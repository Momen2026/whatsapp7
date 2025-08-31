async function onResolve(ctx) {
  try {
    const videoUrl = ctx.url;

    // استدعاء API
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data || !data.status || !data.result) {
      throw new Error("Failed to fetch video info");
    }

    const result = data.result;

    // نرسل اسم الفيديو + الرابط فقط
    ctx.resolve({
      title: result.title, // اسم الفيديو
      url: result.url      // رابط التحميل المباشر
    });

  } catch (err) {
    ctx.reject(err.message);
  }
}

module.exports = { onResolve };
