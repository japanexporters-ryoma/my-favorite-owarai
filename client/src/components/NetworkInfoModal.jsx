import React, { useState, useEffect } from 'react';
import { X, Tablet, Smartphone, Wifi, Copy, Check, ExternalLink } from 'lucide-react';

export default function NetworkInfoModal({ isOpen, onClose }) {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/network-info')
        .then(res => res.json())
        .then(data => setNetworkInfo(data))
        .catch(err => console.error('Failed to load network info:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Tablet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              ベッドサイドの端末で使う
            </h2>
            <p className="text-xs text-slate-500">
              iPadやスマホからでもこのアプリを開けます
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3">
            <Wifi className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900 text-xs sm:text-sm">
                同じWi-Fiに接続してブラウザで開くだけ
              </p>
              <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                このPCと同じWi-Fiに接続しているスマートフォンやiPadのSafari / Chromeのアドレスバーに、以下のURLを入力してください。
              </p>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-700 block mb-2 text-xs">
              アクセス用URL:
            </span>
            <div className="space-y-2">
              {networkInfo?.networkUrls?.length > 0 ? (
                networkInfo.networkUrls.map((url, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono text-slate-800 font-bold select-all text-xs sm:text-sm">
                      {url}
                    </span>
                    <button
                      onClick={() => handleCopy(url)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-100 text-slate-700 flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedUrl === url ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl === url ? 'コピー済' : 'コピー'}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
                  {window.location.origin}
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-800 text-xs">
            <p className="font-bold mb-1">💡 ベッドサイド設置のワンポイント</p>
            <p className="leading-relaxed">
              タブレットをアームスタンド等でベッド柵に固定し、画面の「ホーム画面に追加」をしておくと、次回からアプリアイコンをタップするだけで全画面起動できます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
