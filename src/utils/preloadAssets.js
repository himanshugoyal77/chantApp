// Preload critical images for Mala page
const preloadMalaImages = () => {
  const images = [
    '/rudraksha.png',
    '/thread.png',
  ];

  images.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Preload critical videos
const preloadVideos = () => {
  const videos = [
    '/shiv/shivabhishekfinal.mp4',
  ];

  videos.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    document.head.appendChild(link);
  });
};

export { preloadMalaImages, preloadVideos };
