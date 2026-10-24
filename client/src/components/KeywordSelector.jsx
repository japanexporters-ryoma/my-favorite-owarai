import React, { useState } from 'react';
import { Search, Plus, Sparkles, Trash2, RotateCcw } from 'lucide-react';

export default function KeywordSelector({
  presets,
  selectedKeyword,
  onSelectKeyword,
  onOpenAddModal,
  onDeleteKeyword,
  onResetPresets,
  onSearchCustom,
  isLoading
}) {
  const [customInput, setCustomInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSearchCustom(customInput.trim());
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-6 transition-all">
      {/* 上部説明と検索バー */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block p-1 bg-amber-100 rounded-lg text-amber-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              誰の動画を見ますか？
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ボタンを1回押すだけで、その人の面白い動画がずらりと並びます。
          </p>
        </div>

        {/* 自由検索入力バー */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="他の芸人や有名人で検索（例: 志村けん、大相撲）"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={!customInput.trim() || isLoading}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-2xl font-bold text-sm transition shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>検索</span>
          </button>
        </form>
      </div>

      {/* キーワード・芸人ボタン一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {presets.map((preset) => {
          const isSelected = selectedKeyword === preset.name || selectedKeyword === preset.query;
          return (
            <div
              key={preset.id || preset.name}
              className="relative group"
            >
              <button
                onClick={() => onSelectKeyword(preset)}
                disabled={isLoading}
                className={`w-full h-full p-3 sm:p-3.5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-600 shadow-md shadow-amber-500/25 ring-2 ring-amber-300 ring-offset-1 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-800 hover:border-amber-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-2xl sm:text-3xl filter drop-shadow-xs">
                    {preset.icon || '🎬'}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      再生中
                    </span>
                  )}
                </div>

                <div>
                  <h3 className={`font-black tracking-tight text-sm sm:text-base leading-snug line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}>
                    {preset.name}
                  </h3>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-amber-100' : 'text-slate-500'
                  }`}>
                    {preset.description || preset.category || '動画を見る'}
                  </p>
                </div>
              </button>

              {/* ユーザーが追加したカスタムキーワードのみ削除可能 */}
              {preset.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteKeyword(preset.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs z-10 cursor-pointer"
                  title="このボタンを削除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* 新しいキーワード追加ボタン */}
        <button
          onClick={onOpenAddModal}
          className="p-3 sm:p-3.5 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-100/60 transition-all text-amber-800 flex flex-col items-center justify-center gap-1.5 min-h-[90px] cursor-pointer group active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-center leading-tight">
            ボタンを追加
          </span>
        </button>
      </div>

      {/* 下部リセット・ヘルプ表示 */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>※ タップするだけで最新の面白いYouTube動画が自動取得されます</span>
        <button
          onClick={onResetPresets}
          className="text-slate-400 hover:text-slate-600 flex items-center gap-1 transition cursor-pointer hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>ボタン配置を初期値に戻す</span>
        </button>
      </div>
    </div>
  );
}
