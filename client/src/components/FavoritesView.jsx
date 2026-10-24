import React from 'react';
import { Star, Play, Trash2, MessageSquareHeart, Sparkles, Smile } from 'lucide-react';
import VideoCard from './VideoCard';

export default function FavoritesView({
  favorites,
  onPlay,
  onRemoveFavorite,
  onPlayAll,
  fontSizeLevel
}) {
  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto my-8">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 mx-auto flex items-center justify-center mb-4">
          <Star className="w-10 h-10 fill-amber-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
          まだお気に入り動画がありません
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
          動画カードの「⭐ お気に入り」ボタンを押すと、お父さんが笑ってくれた動画をここに保存できます。
          「これを流せば絶対笑顔になる！」というお父さん専用の宝箱になります。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 上部ヘッダー */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <Star className="w-5 h-5 fill-amber-200 text-amber-200" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              お父さんのお気に入り動画（{favorites.length}本）
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            お父さんが笑顔になった大好きな動画たちです。いつでもすぐに流せます。
          </p>
        </div>

        {/* お気に入り動画を連続再生するボタン */}
        <button
          onClick={onPlayAll}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 font-black shadow-lg transition active:scale-95 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-900" />
          <span>お気に入りを最初から再生</span>
        </button>
      </div>

      {/* 動画カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {favorites.map((video) => (
          <VideoCard
            key={video.videoId}
            video={video}
            onPlay={onPlay}
            isFavorite={true}
            onToggleFavorite={() => onRemoveFavorite(video.videoId)}
            fontSizeLevel={fontSizeLevel}
          />
        ))}
      </div>
    </div>
  );
}
