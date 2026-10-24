import React, { useState } from 'react';
import { X, Plus, Sparkles, Smile } from 'lucide-react';

const SUGGESTIONS = [
  { name: '志村けん', query: '志村けん コント バカ殿 だいじょうぶだぁ', icon: '👘' },
  { name: '霜降り明星', query: '霜降り明星 漫才 コント 爆笑', icon: '🎤' },
  { name: '粗品 ツッコミ', query: '粗品 フリップ ネタ ツッコミ 名作', icon: '⚡' },
  { name: '明石家さんま', query: '明石家さんま トーク 爆笑', icon: '😄' },
  { name: '綾小路きみまろ', query: '綾小路きみまろ 漫談 爆笑ライブ', icon: '扇' },
  { name: '男はつらいよ・寅さん', query: '男はつらいよ 寅さん 名場面 渥美清', icon: '🍶' },
  { name: '大相撲 名勝負', query: '大相撲 名勝負 昭和 平成 横綱', icon: '🥋' },
  { name: 'タモリ・ブラタモリ', query: 'タモリ 爆笑 トーク ブラタモリ', icon: '🕶️' },
  { name: '所ジョージ', query: '所ジョージ 世田谷ベース 爆笑', icon: '🚜' },
  { name: '懐かしの昭和歌謡', query: '昭和 歌謡曲 ヒットパレード 名曲', icon: '🎵' },
  { name: '昭和のバラエティ', query: '8時だョ!全員集合 ドリフターズ コント', icon: '📺' },
  { name: 'サンドウィッチマン 富澤', query: 'サンドウィッチマン ちょっと何言ってるか分からない', icon: '🥪' },
  { name: 'サンドウィッチマン 伊達', query: 'サンドウィッチマン カロリーゼロ理論', icon: '🍕' },
  { name: '大谷翔平 WBC名場面', query: '大谷翔平 WBC 決勝 トラウト 歓喜', icon: '🏆' },
];

export default function AddKeywordModal({ isOpen, onClose, onAddKeyword }) {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [icon, setIcon] = useState('⭐');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddKeyword({
      name: name.trim(),
      query: (query.trim() || `${name.trim()} 爆笑 お笑い`),
      icon: icon || '⭐',
      category: 'お父さんのお気に入り',
      description: '登録したおすすめ動画'
    });

    setName('');
    setQuery('');
    setIcon('⭐');
    onClose();
  };

  const handleSelectSuggestion = (s) => {
    setName(s.name);
    setQuery(s.query);
    setIcon(s.icon || '⭐');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-fadeIn">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              ボタンを追加する
            </h2>
            <p className="text-xs text-slate-500">
              お父さんが好きな芸人・スターをトップ画面に追加できます
            </p>
          </div>
        </div>

        {/* よくあるおすすめ候補 */}
        <div className="my-4">
          <span className="text-xs font-bold text-slate-500 mb-2 block">
            💡 人気の候補（タップで入力）:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ボタンに表示する名前 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!query) {
                  setQuery(`${e.target.value} 面白い コント 漫才`);
                }
              }}
              placeholder="例: 志村けん、大相撲、綾小路きみまろ"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              YouTube検索キーワード（細かい指定がある場合）
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="空欄なら自動で設定されます"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden text-sm text-slate-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              ※「爆笑」「コント」「ハイライト」などを入れると面白い動画が見つかりやすくなります。
            </p>
          </div>

          {/* アイコン選択 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              アイコンマーク
            </label>
            <div className="flex gap-2 text-xl">
              {['⭐', '🎙️', '🎭', '⚾', '🥋', '📺', '👑', '🍙', '🎵', '👴'].map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                    icon === em ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* ボタン */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 disabled:opacity-40 transition cursor-pointer"
            >
              ボタンを追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
