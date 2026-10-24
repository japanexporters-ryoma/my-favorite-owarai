import React from 'react';
import { Smile, Sparkles, Star, Tablet, HelpCircle, Heart, ZoomIn, ZoomOut } from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  favoritesCount, 
  onOpenAddModal, 
  onOpenNotesModal,
  onOpenNetworkModal,
  fontSizeLevel,
  setFontSizeLevel
}) {
  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-amber-200/80 shadow-sm transition-all">
      {/* 介護者への案内バナー */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-4 py-2 text-center text-xs sm:text-sm font-medium shadow-inner flex items-center justify-between">
        <div className="flex items-center gap-1.5 mx-auto">
          <Heart className="w-4 h-4 text-amber-200 fill-amber-200 animate-pulse" />
          <span>お世話をしてくださる方へ：下のボタンを押すだけで、お父さんが大好きなお笑いや名場面がすぐに流れます</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* ロゴ・タイトル */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Smile className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                お父さんのお笑いシアター
                <span className="text-amber-500 text-base">✨</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              大好きな芸人・スターの動画で笑顔と元気を
            </p>
          </div>
        </div>

        {/* コントロール群 */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* 文字サイズ調整（遠くからでも見やすく） */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <span className="text-xs text-slate-500 px-2 font-medium hidden sm:inline">文字:</span>
            <button
              onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${fontSizeLevel === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-white'}`}
              title="文字を小さく"
              disabled={fontSizeLevel === 0}
            >
              小
            </button>
            <button
              onClick={() => setFontSizeLevel(1)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition ${fontSizeLevel === 1 ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
              title="標準文字サイズ"
            >
              標準
            </button>
            <button
              onClick={() => setFontSizeLevel(Math.min(2, fontSizeLevel + 1))}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${fontSizeLevel === 2 ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'}`}
              title="大文字（ベッドから見やすい）"
            >
              特大
            </button>
          </div>

          {/* スマホ・タブレット接続案内ボタン */}
          <button
            onClick={onOpenNetworkModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition shadow-xs"
            title="タブレットやスマホで開く方法"
          >
            <Tablet className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">タブレットで開く</span>
          </button>

          {/* 介護メモ・伝言板ボタン */}
          <button
            onClick={onOpenNotesModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition shadow-xs"
            title="お父さんの好み・介護者メモ"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">介護メモ</span>
          </button>

          {/* お気に入り動画タブ切替 */}
          <button
            onClick={() => setCurrentTab(currentTab === 'favorites' ? 'home' : 'favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs ${
              currentTab === 'favorites'
                ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Star className={`w-4 h-4 ${currentTab === 'favorites' ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'}`} />
            <span>お気に入り動画</span>
            {favoritesCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                currentTab === 'favorites' ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
