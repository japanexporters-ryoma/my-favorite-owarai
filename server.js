const express = require('express');
const cors = require('cors');
const yts = require('yt-search');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// シンプルなインメモリカッシュ (キー: 検索クエリ, 有効期限: 15分)
const cache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

// 初期プリセットキーワード定義（お父様が喜びそうなジャンル・有名人）
const DEFAULT_PRESETS = [
  {
    id: 'sand',
    name: 'サンドウィッチマン',
    query: 'サンドウィッチマン 公式 コント 漫才',
    category: 'お笑い',
    icon: '🎙️',
    color: 'from-amber-500 to-orange-500',
    description: '定番の爆笑コント＆漫才'
  },
  {
    id: 'nakagawake',
    name: '中川家',
    query: '中川家 漫才 礼二 剛 爆笑',
    category: 'お笑い',
    icon: '🚃',
    color: 'from-blue-500 to-indigo-500',
    description: '日常の観察モノマネ・兄弟漫才'
  },
  {
    id: 'kamaitachi',
    name: 'かまいたち',
    query: 'かまいたち チャンネル 公式 コント',
    category: 'お笑い',
    icon: '😺',
    color: 'from-rose-500 to-pink-500',
    description: '軽快なテンポのコントとトーク'
  },
  {
    id: 'chidori',
    name: '千鳥',
    query: '千鳥 漫才 大悟 ノブ 爆笑',
    category: 'お笑い',
    icon: '🦅',
    color: 'from-teal-500 to-emerald-500',
    description: 'クセがすごい爆笑トーク＆漫才'
  },
  {
    id: 'soshina',
    name: '粗品',
    query: '粗品 霜降り明星 公式 フリップ 漫才 爆笑',
    category: 'お笑い',
    icon: '⚡',
    color: 'from-indigo-500 to-purple-600',
    description: '鋭いツッコミと痛快フリップネタ'
  },
  {
    id: 'knights',
    name: 'ナイツ',
    query: 'ナイツ 漫才 ヤホー ヤホー漫才',
    category: 'お笑い',
    icon: '👓',
    color: 'from-purple-500 to-violet-500',
    description: '聞き取りやすく笑える時事・言葉遊び'
  },
  {
    id: 'ohtani',
    name: '大谷翔平',
    query: '大谷翔平 ホームラン ハイライト 2024 2025',
    category: 'スポーツ・スター',
    icon: '⚾',
    color: 'from-blue-600 to-cyan-500',
    description: '豪快なホームラン・名場面集'
  },
  {
    id: 'hanamaru',
    name: '博多華丸・大吉',
    query: '博多華丸大吉 漫才',
    category: 'お笑い',
    icon: '🍜',
    color: 'from-emerald-500 to-green-600',
    description: '穏やかで誰もがクスッと笑える漫才'
  },
  {
    id: 'nonstyle',
    name: 'NON STYLE',
    query: 'NON STYLE 漫才 ノンスタイル',
    category: 'お笑い',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-600',
    description: 'ハイスピードな掛け合いとボケ連発'
  },
  {
    id: 'shinkigeki',
    name: '吉本新喜劇',
    query: '吉本新喜劇 茂造 すっちー 爆笑',
    category: 'お笑い',
    icon: '🎭',
    color: 'from-orange-500 to-red-500',
    description: 'おなじみのギャグ満載の舞台喜劇'
  },
  {
    id: 'rakugo',
    name: '名作落語',
    query: '落語 名演 古今亭志ん朝 柳家小三治 笑点',
    category: '伝統芸能',
    icon: '🏮',
    color: 'from-stone-600 to-slate-700',
    description: '耳だけでも楽しめる名人芸'
  },
  {
    id: 'showa_manzai',
    name: '懐かしの漫才・演芸',
    query: '昭和 漫才 やすしきよし オール阪神巨人 演芸',
    category: '懐かしの名人',
    icon: '📻',
    color: 'from-yellow-700 to-amber-800',
    description: '青春時代を思い出す懐かしの爆笑漫才'
  },
  {
    id: 'downtown',
    name: 'ダウンタウン',
    query: 'ダウンタウン ごっつええ感じ コント トーク',
    category: 'お笑い',
    icon: '🔥',
    color: 'from-red-600 to-rose-700',
    description: '伝説のコントと痛快フリートーク'
  }
];

// プリセット取得API
app.get('/api/presets', (req, res) => {
  res.json({ presets: DEFAULT_PRESETS });
});

// データバックアップ・同期用ファイルパス
const DATA_FILE = path.join(__dirname, 'data', 'backup.json');

// バックアップ取得API
app.get('/api/backup', (req, res) => {
  try {
    const fs = require('fs');
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return res.json(JSON.parse(content));
    }
    res.json({ favorites: [], notes: [], customPresets: [] });
  } catch (err) {
    console.error('Backup read error:', err);
    res.status(500).json({ error: 'Failed to read backup' });
  }
});

// バックアップ保存API
app.post('/api/backup', (req, res) => {
  try {
    const fs = require('fs');
    const { favorites, notes, customPresets } = req.body;
    const data = {
      favorites: favorites || [],
      notes: notes || [],
      customPresets: customPresets || [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, savedAt: data.updatedAt });
  } catch (err) {
    console.error('Backup write error:', err);
    res.status(500).json({ error: 'Failed to save backup' });
  }
});

// YouTube動画検索API
app.get('/api/search', async (req, res) => {
  try {
    const rawQuery = req.query.q;
    if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
      return res.status(400).json({ error: '検索キーワードを指定してください。' });
    }

    const query = rawQuery.trim();
    const cacheKey = query.toLowerCase();

    // キャッシュチェック
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json({
        cached: true,
        query,
        count: cached.data.length,
        videos: cached.data
      });
    }

    // YouTube検索実行
    const searchResults = await yts(query);
    const videos = (searchResults.videos || []).slice(0, 24).map(v => ({
      videoId: v.videoId,
      title: v.title,
      description: v.description,
      url: v.url,
      thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
      duration: {
        seconds: v.seconds,
        timestamp: v.timestamp
      },
      author: {
        name: v.author?.name || 'YouTube',
        url: v.author?.url || ''
      },
      views: v.views,
      ago: v.ago
    }));

    // キャッシュ保存
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: videos
    });

    res.json({
      cached: false,
      query,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: '動画の取得中にエラーが発生しました。',
      details: error.message
    });
  }
});

// ローカルIP取得（タブレットやスマホからアクセスするための案内用）
app.get('/api/network-info', (req, res) => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // IPv4かつ内部ループバック以外
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  res.json({
    port: PORT,
    localIps: addresses,
    localUrl: `http://localhost:${PORT}`,
    networkUrls: addresses.map(ip => `http://${ip}:${PORT}`)
  });
});

// フロントエンドの静的ファイル配信（ビルド済みのdistが存在する場合）
const clientDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

// SPAフォールバック (API以外のGETリクエストはindex.htmlを返す)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(clientDistPath, 'index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send('フロントエンドがまだビルドされていません。npm run build を実行するか、開発サーバーをご利用ください。');
      }
    });
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🎬 お父さんのお笑いシアター サーバー起動完了！`);
  console.log(`🌐 ローカルアクセス: http://localhost:${PORT}`);
  
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`📱 スマホ・タブレット用 (同一Wi-Fi): http://${net.address}:${PORT}`);
      }
    }
  }
  console.log(`=======================================================`);
});
