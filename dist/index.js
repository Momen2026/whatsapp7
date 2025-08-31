async function onResolve(ctx) {
  try {
    const videoUrl = ctx.url;

    // تحقق إن الرابط فعلاً من يوتيوب
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      throw new Error("الرابط ليس من يوتيوب");
    }

    // استدعاء API لتحويل الرابط إلى رابط تحميل مباشر
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.url || !data?.result?.title) {
      throw new Error("فشل في استخراج معلومات الفيديو");
    }

    const { title, url } = data.result;

    // إرسال اسم الفيديو + رابط التحميل
    ctx.resolve({
      title: `🎬 ${title}`,
      url: url
    });

  } catch (err) {
    ctx.reject(`❌ ${err.message}`);
  }
}

module.exports = { onResolve };
