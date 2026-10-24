import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import KeywordSelector from './components/KeywordSelector';
import VideoCard from './components/VideoCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import FavoritesView from './components/FavoritesView';
import AddKeywordModal from './components/AddKeywordModal';
import CaregiverNotesModal from './components/CaregiverNotesModal';
import NetworkInfoModal from './components/NetworkInfoModal';
import { Loader2, AlertCircle, RefreshCw, Sparkles, Smile, Tv } from 'lucide-react';

const STORAGE_KEY_PRESETS = 'owarai_custom_presets_v1';
const STORAGE_KEY_FAVORITES = 'owarai_favorites_v1';
const STORAGE_KEY_NOTES = 'owarai_care_notes_v1';
const STORAGE_KEY_FONT_SIZE = 'owarai_font_size_v1';

export default function App() {
  // ナビゲーション状態
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'favorites'

  // プリセット・キーワード関連
  const [presets, setPresets] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');

  // 動画リスト・ローディング
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 再生モーダル状態
  const [activeVideo, setActiveVideo] = useState(null);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  // お気に入り動画リスト (localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 介護メモリスト (localStorage)
  const [careNotes, setCareNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      if (saved) return JSON.parse(saved);
      // 初期の優しいサンプルメモ
      return [
        {
          id: 'initial-1',
          author: '竜馬',
          content: 'お父さんはサンドウィッチマンと中川家が特に好きです。大谷翔平のホームラン集も見せると目を輝かせます。',
          createdAt: '初期設定'
        }
      ];
    } catch {
      return [];
    }
  });

  // 文字サイズ設定 (0: 小, 1: 標準, 2: 特大)
  const [fontSizeLevel, setFontSizeLevel] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
      return saved !== null ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // モーダル開閉
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  // 初期プリセットおよびサーバーバックアップの読み込み
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const [presetsRes, backupRes] = await Promise.all([
          fetch('/api/presets').then(r => r.json()).catch(() => ({ presets: [] })),
          fetch('/api/backup').then(r => r.json()).catch(() => null)
        ]);

        const basePresets = presetsRes.presets || [];

        // localStorageからカスタムプリセットを取得（なければサーバーバックアップから復元）
        let customPresets = [];
        try {
          const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
          if (raw) {
            customPresets = JSON.parse(raw);
          } else if (backupRes?.customPresets?.length > 0) {
            customPresets = backupRes.customPresets;
            localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(customPresets));
          }
        } catch (e) {
          console.error(e);
        }

        // お気に入りの復元（localStorageが空でサーバーバックアップがあれば自動復元）
        if (favorites.length === 0 && backupRes?.favorites?.length > 0) {
          setFavorites(backupRes.favorites);
          localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(backupRes.favorites));
        }

        // 介護メモの復元
        if (careNotes.length <= 1 && backupRes?.notes?.length > 0) {
          setCareNotes(backupRes.notes);
          localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(backupRes.notes));
        }

        const merged = [...basePresets, ...customPresets];
        setPresets(merged);

        // 最初のキーワードで自動検索
        if (merged.length > 0) {
          const first = merged[0];
          setSelectedKeyword(first.name);
          setCurrentQuery(first.query);
          searchVideos(first.query);
        }
      } catch (err) {
        console.error('Failed to fetch presets:', err);
        setError('プリセットの取得に失敗しました。サーバーが動いているかご確認ください。');
      }
    };
    loadPresets();
  }, []);

  // サーバーへの自動バックアップ送信関数
  const syncBackupToServer = (updatedFavs, updatedNotes, updatedCustomPresets) => {
    try {
      fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favorites: updatedFavs !== undefined ? updatedFavs : favorites,
          notes: updatedNotes !== undefined ? updatedNotes : careNotes,
          customPresets: updatedCustomPresets !== undefined ? updatedCustomPresets : presets.filter(p => p.isCustom)
        })
      }).catch(e => console.error('Failed to sync backup:', e));
    } catch (err) {
      console.error(err);
    }
  };

  // お気に入りのlocalStorage保存＆サーバーバックアップ
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
      syncBackupToServer(favorites, undefined, undefined);
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // 介護メモのlocalStorage保存＆サーバーバックアップ
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(careNotes));
      syncBackupToServer(undefined, careNotes, undefined);
    } catch (e) {
      console.error(e);
    }
  }, [careNotes]);

  // 文字サイズのlocalStorage保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FONT_SIZE, fontSizeLevel.toString());
    } catch (e) {
      console.error(e);
    }
  }, [fontSizeLevel]);

  // 動画検索関数
  const searchVideos = async (queryText) => {
    if (!queryText) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(queryText)}`);
      if (!res.ok) {
        throw new Error(`サーバーエラー: ${res.status}`);
      }
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Search failed:', err);
      setError('動画の取得に失敗しました。もう一度お試しいただくか、キーワードを変えてみてください。');
    } finally {
      setIsLoading(false);
    }
  };

  // キーワード選択時
  const handleSelectKeyword = (preset) => {
    setCurrentTab('home');
    setSelectedKeyword(preset.name);
    setCurrentQuery(preset.query);
    searchVideos(preset.query);
  };

  // 自由入力検索時
  const handleSearchCustom = (customText) => {
    setCurrentTab('home');
    setSelectedKeyword(customText);
    setCurrentQuery(customText);
    searchVideos(`${customText} 爆笑 面白い`);
  };

  // 新規キーワード追加
  const handleAddKeyword = (newPreset) => {
    const item = {
      ...newPreset,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    const updatedPresets = [...presets, item];
    setPresets(updatedPresets);

    // localStorageにカスタム分だけ保存
    const customOnly = updatedPresets.filter(p => p.isCustom);
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(customOnly));

    // 追加したキーワードを選択
    handleSelectKeyword(item);
  };

  // カスタムキーワード削除
  const handleDeleteKeyword = (id) => {
    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);

    const customOnly = updatedPresets.filter(p => p.isCustom);
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(customOnly));
  };

  // プリセット初期化
  const handleResetPresets = async () => {
    if (window.confirm('追加したカスタムボタンを初期状態に戻しますか？')) {
      localStorage.removeItem(STORAGE_KEY_PRESETS);
      const res = await fetch('/api/presets');
      const data = await res.json();
      setPresets(data.presets || []);
      if (data.presets?.length > 0) {
        handleSelectKeyword(data.presets[0]);
      }
    }
  };

  // お気に入りトグル
  const handleToggleFavorite = (video) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.videoId === video.videoId);
      if (exists) {
        return prev.filter(f => f.videoId !== video.videoId);
      } else {
        return [video, ...prev];
      }
    });
  };

  // 介護メモ追加
  const handleAddCareNote = (newNote) => {
    setCareNotes(prev => [newNote, ...prev]);
  };

  // 介護メモ削除
  const handleDeleteCareNote = (id) => {
    setCareNotes(prev => prev.filter(n => n.id !== id));
  };

  // 現在再生中の動画インデックス
  const currentVideoList = currentTab === 'favorites' ? favorites : videos;
  const currentVideoIndex = currentVideoList.findIndex(v => v.videoId === activeVideo?.videoId);

  // 次の動画へ
  const handlePlayNext = useCallback(() => {
    if (currentVideoIndex >= 0 && currentVideoIndex < currentVideoList.length - 1) {
      setActiveVideo(currentVideoList[currentVideoIndex + 1]);
    }
  }, [currentVideoIndex, currentVideoList]);

  // 前の動画へ
  const handlePlayPrev = useCallback(() => {
    if (currentVideoIndex > 0) {
      setActiveVideo(currentVideoList[currentVideoIndex - 1]);
    }
  }, [currentVideoIndex, currentVideoList]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 画面上部ヘッダー */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        favoritesCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenNotesModal={() => setIsNotesModalOpen(true)}
        onOpenNetworkModal={() => setIsNetworkModalOpen(true)}
        fontSizeLevel={fontSizeLevel}
        setFontSizeLevel={setFontSizeLevel}
      />

      {/* メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'home' ? (
          <>
            {/* 芸人・有名人キーワード選択パネル */}
            <KeywordSelector
              presets={presets}
              selectedKeyword={selectedKeyword}
              onSelectKeyword={handleSelectKeyword}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onDeleteKeyword={handleDeleteKeyword}
              onResetPresets={handleResetPresets}
              onSearchCustom={handleSearchCustom}
              isLoading={isLoading}
            />

            {/* 現在表示中のキーワードタイトル */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  「{selectedKeyword || 'おすすめ'}」の動画一覧
                </h2>
                {!isLoading && (
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded-full">
                    {videos.length}本
                  </span>
                )}
              </div>

              {/* 再読み込みボタン */}
              <button
                onClick={() => searchVideos(currentQuery)}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-500 hover:text-amber-600 transition cursor-pointer"
                title="最新の動画を取得し直す"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
                <span className="hidden sm:inline">更新</span>
              </button>
            </div>

            {/* ローディング表示 */}
            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
                  <Smile className="w-6 h-6 text-amber-500 absolute inset-0 m-auto" />
                </div>
                <p className="text-sm font-bold text-slate-600">
                  お父さんが好きなお笑い動画を探しています...
                </p>
              </div>
            )}

            {/* エラー表示 */}
            {!isLoading && error && (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center max-w-lg mx-auto my-8">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                <h3 className="font-bold text-rose-900 mb-1">取得できませんでした</h3>
                <p className="text-xs text-rose-700 mb-4">{error}</p>
                <button
                  onClick={() => searchVideos(currentQuery)}
                  className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
                >
                  もう一度試す
                </button>
              </div>
            )}

            {/* 動画カードグリッド */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video.videoId}
                    video={video}
                    onPlay={(v) => setActiveVideo(v)}
                    isFavorite={favorites.some(f => f.videoId === video.videoId)}
                    onToggleFavorite={handleToggleFavorite}
                    fontSizeLevel={fontSizeLevel}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* お父さんの殿堂入り動画ビュー */
          <FavoritesView
            favorites={favorites}
            onPlay={(v) => setActiveVideo(v)}
            onRemoveFavorite={(id) => setFavorites(prev => prev.filter(f => f.videoId !== id))}
            onPlayAll={() => {
              if (favorites.length > 0) {
                setActiveVideo(favorites[0]);
              }
            }}
            fontSizeLevel={fontSizeLevel}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-600">お父さんのお笑いシアター</span>
            <span>— 寝たきりの毎日にたくさんの笑いと元気を</span>
          </div>
          <div>
            <span>ワンクリックでYouTube安心再生 / 介護施設・ベッドサイド支援</span>
          </div>
        </div>
      </footer>

      {/* 動画プレイヤーモーダル */}
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          videoList={currentVideoList}
          currentIndex={currentVideoIndex}
          onClose={() => setActiveVideo(null)}
          onPlayNext={handlePlayNext}
          onPlayPrev={handlePlayPrev}
          isFavorite={favorites.some(f => f.videoId === activeVideo.videoId)}
          onToggleFavorite={handleToggleFavorite}
          autoPlayNext={autoPlayNext}
          setAutoPlayNext={setAutoPlayNext}
        />
      )}

      {/* 新規キーワード追加モーダル */}
      <AddKeywordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddKeyword={handleAddKeyword}
      />

      {/* 介護メモモーダル */}
      <CaregiverNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        notes={careNotes}
        onAddNote={handleAddCareNote}
        onDeleteNote={handleDeleteCareNote}
      />

      {/* スマホ・タブレット案内モーダル */}
      <NetworkInfoModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  );
}
