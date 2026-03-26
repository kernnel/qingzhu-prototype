// Mock data for Qingzhu prototype
// Design: Dark theme phone simulator, bamboo green #22C55E brand color

export const COVER_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464116578/62PJyCVZFXZcVSHo4qkLCE/qingzhu-album-cover-1-8bD2XqXWRrnSNTCyB6UvXW.webp";
export const COVER_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464116578/62PJyCVZFXZcVSHo4qkLCE/qingzhu-album-cover-2-LFXuNu3iJEhkTJoCpEJL9a.webp";
export const PHOTOGRAPHER_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464116578/62PJyCVZFXZcVSHo4qkLCE/qingzhu-photographer-avatar-bwCqxbE4xZFsNT3qkjgbhp.webp";
export const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663464116578/62PJyCVZFXZcVSHo4qkLCE/qingzhu-hero-bg-VY2yZkv8hr9dCmAvdroX8b.webp";

// Unsplash photo grid thumbnails
export const PHOTO_GRID = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=200&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=200&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=200&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=200&q=80",
  "https://images.unsplash.com/photo-1525772764200-be829a350797?w=200&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&q=80",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=200&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&q=80",
];

export const mockAlbums = [
  {
    id: "album-001",
    name: "张先生婚礼纪实",
    cover: COVER_1,
    status: "active" as const,
    photoCount: 128,
    views: 342,
    createdAt: "2026-03-20",
    expiresAt: "2026-03-27",
    daysLeft: 2,
  },
  {
    id: "album-002",
    name: "李小姐写真集",
    cover: COVER_2,
    status: "active" as const,
    photoCount: 86,
    views: 215,
    createdAt: "2026-03-18",
    expiresAt: "2026-03-25",
    daysLeft: 0,
  },
  {
    id: "album-003",
    name: "王家全家福 2025",
    cover: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    status: "done" as const,
    photoCount: 54,
    views: 98,
    createdAt: "2026-02-14",
    expiresAt: "2026-02-21",
    daysLeft: -32,
  },
  {
    id: "album-004",
    name: "陈先生商务形象照",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    status: "done" as const,
    photoCount: 32,
    views: 67,
    createdAt: "2026-01-28",
    expiresAt: "2026-02-04",
    daysLeft: -49,
  },
];

export const mockUser = {
  name: "陈摄影",
  avatar: PHOTOGRAPHER_AVATAR,
  plan: "standard" as const,
  todayUploaded: 12,
  dailyLimit: 200,
  todayViews: 557,
  todaySaves: 43,
};

export const mockPhotographer = {
  name: "陈摄影",
  avatar: PHOTOGRAPHER_AVATAR,
  city: "上海",
  bio: "专注婚礼纪实与人像写真，从业 8 年，服务客户 600+",
  albumCount: 248,
  totalPhotos: 18600,
  yearsExp: 8,
  wechat: "chen_photo_sh",
  xiaohongshu: "@陈摄影_上海",
};

export const mockClientAlbums = [
  {
    id: "album-001",
    name: "张先生婚礼纪实",
    cover: COVER_1,
    photographer: "陈摄影",
    viewedAt: "2026-03-24 18:32",
  },
  {
    id: "album-002",
    name: "李小姐写真集",
    cover: COVER_2,
    photographer: "陈摄影",
    viewedAt: "2026-03-22 14:10",
  },
];
