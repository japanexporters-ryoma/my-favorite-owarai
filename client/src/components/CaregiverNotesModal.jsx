import React, { useState } from 'react';
import { X, Heart, MessageSquare, Plus, Trash2, Calendar, Smile } from 'lucide-react';

export default function CaregiverNotesModal({ isOpen, onClose, notes, onAddNote, onDeleteNote }) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote({
      id: Date.now().toString(),
      content: content.trim(),
      author: author.trim() || 'スタッフ',
      createdAt: new Date().toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-fadeIn flex flex-col max-h-[90vh]">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Heart className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              お父さんの介護・笑顔メモ
            </h2>
            <p className="text-xs text-slate-500">
              スタッフやご家族でお父さんの好みや反応を共有できるメモ欄です
            </p>
          </div>
        </div>

        {/* 新規メモ入力フォーム */}
        <form onSubmit={handleSubmit} className="mb-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="記入者（例: 竜馬、日勤スタッフ）"
              className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-400 w-44"
            />
          </div>
          <textarea
            required
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例: 今日は中川家の電車のモノマネで声を出して笑っていました！午後の体位変換後に見せると機嫌が良いです。"
            className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>メモを残す</span>
            </button>
          </div>
        </form>

        {/* メモ一覧 */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              まだメモはありません。お父さんの反応や好きなネタを気軽に残してください。
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {note.author}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {note.createdAt}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer"
                  title="メモを削除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
