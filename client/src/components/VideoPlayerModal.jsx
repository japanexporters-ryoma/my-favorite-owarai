import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, SkipForward, SkipBack, Star, ExternalLink, Volume2, HelpCircle } from 'lucide-react';

export default function VideoPlayerModal({
  video,
  videoList = [],
  currentIndex = -1,
  onClose,
  onPlayNext,
  onPlayPrev,
  isFavorite,
  onToggleFavorite,
  autoPlayNext,
  setAutoPlayNext
}) {
  const [isTheater, setIsTheater] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  // Escキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onPlayNext) onPlayNext();
      if (e.key === 'ArrowLeft' && onPlayPrev) onPlayPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPlayNext, onPlayPrev]);

  if (!video) return null;

  // YouTube埋め込みURLの構築 (autoplay=1, rel=0, enablejsapi=1)
  const embedUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto transition-all animate-fadeIn">
      {/* モーダルウィンドウ本体 */}
      <div className={`w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 border border-slate-700/60 ${
        isTheater 
          ? 'max-w-[98vw] h-[95vh]' 
          : 'max-w-5xl max-h-[92vh]'
      }`}>
        {/* モーダル上部バー */}
        <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <h2 className="text-sm sm:text-base font-bold truncate text-slate-100">
              {video.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* お父さんのお気に入りボタン */}
            <button
              onClick={() => onToggleFavorite(video)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-slate-900 text-slate-900' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isFavorite ? 'お気に入り済' : 'お気に入り登録'}</span>
            </button>

            {/* シアターモード切替 */}
            <button
              onClick={() => setIsTheater(!isTheater)}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition cursor-pointer"
              title={isTheater ? '通常サイズに戻す' : '大画面シアターモード'}
            >
              {isTheater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer"
              title="閉じる (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 動画プレイヤー本体 (iframe) */}
        <div className="relative w-full flex-1 bg-black aspect-video min-h-[300px] sm:min-h-[420px]">
          <iframe
            key={video.videoId}
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        </div>

        {/* コントロール・ナビゲーション下部バー */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex flex-wrap items-center justify-between gap-4">
          {/* 左側: 前後スキップボタン */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayPrev}
              disabled={currentIndex <= 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
              <span>前の動画</span>
            </button>

            <button
              onClick={onPlayNext}
              disabled={currentIndex >= videoList.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black transition shadow-xs cursor-pointer"
            >
              <span>次の動画</span>
              <SkipForward className="w-4 h-4" />
            </button>

            {videoList.length > 0 && (
              <span className="text-xs text-slate-400 ml-2">
                {currentIndex + 1} / {videoList.length} 本
              </span>
            )}
          </div>

          {/* 右側: 連続再生スイッチ＆YouTube直行リンク */}
          <div className="flex items-center gap-4">
            {/* YouTube直接リンク */}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              title="YouTubeサイトまたはアプリで直接開く"
            >
              <span>YouTubeで開く</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
