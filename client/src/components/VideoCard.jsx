import React from 'react';
import { Play, Star, Clock, Eye, Sparkles } from 'lucide-react';

export default function VideoCard({
  video,
  onPlay,
  isFavorite,
  onToggleFavorite,
  fontSizeLevel = 1
}) {
  // フォントサイズのクラス分け
  const titleClass = [
    'text-sm leading-snug',     // 0: 小
    'text-base leading-snug',    // 1: 標準
    'text-lg font-bold leading-tight' // 2: 特大
  ][fontSizeLevel] || 'text-base leading-snug';

  // 再生回数の見やすいフォーマット
  const formatViews = (views) => {
    if (!views) return '';
    if (views >= 100000000) {
      return `${(views / 100000000).toFixed(1)}億回再生`;
    }
    if (views >= 10000) {
      return `${(views / 10000).toFixed(0)}万回再生`;
    }
    return `${views.toLocaleString()}回再生`;
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col group relative">
      {/* サムネイル部分 */}
      <div 
        onClick={() => onPlay(video)}
        className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // 代替画像
            e.target.src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
          }}
        />

        {/* 再生時間バッジ */}
        {video.duration?.timestamp && (
          <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
            <Clock className="w-3 h-3" />
            <span>{video.duration.timestamp}</span>
          </span>
        )}

        {/* センタースクリーン再生オーバーレイ */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* お気に入りバッジ（すでにお気に入りの場合） */}
        {isFavorite && (
          <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-xl flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>お気に入り</span>
          </span>
        )}
      </div>

      {/* カードコンテンツ */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* タイトル */}
          <h3 
            onClick={() => onPlay(video)}
            className={`font-black text-slate-900 hover:text-amber-600 cursor-pointer transition line-clamp-2 ${titleClass}`}
            title={video.title}
          >
            {video.title}
          </h3>

          {/* チャンネル名と再生回数 */}
          <div className="mt-2 text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700 truncate max-w-[180px]">
              {video.author?.name || '公式チャンネル'}
            </span>
            {video.views > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {formatViews(video.views)}
                </span>
              </>
            )}
            {video.ago && (
              <>
                <span className="text-slate-300">•</span>
                <span>{video.ago}</span>
              </>
            )}
          </div>
        </div>

        {/* アクションボタン群 */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* お父さんのお気に入り登録ボタン */}
          <button
            onClick={() => onToggleFavorite(video)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              isFavorite
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
            title={isFavorite ? 'お気に入りから外す' : 'お父さんが笑った動画として保存'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            <span>{isFavorite ? 'お気に入り済' : 'お気に入り'}</span>
          </button>

          {/* 大きな再生ボタン */}
          <button
            onClick={() => onPlay(video)}
            className="flex-1 max-w-[140px] flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-sm shadow-amber-500/20 active:scale-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>今すぐ再生</span>
          </button>
        </div>
      </div>
    </div>
  );
}
