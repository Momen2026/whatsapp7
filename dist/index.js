async function onResolve(ctx) {
  try {
    const videoUrl = ctx.url;

    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.url || !data?.result?.title) {
      throw new Error("فشل في استخراج معلومات الفيديو");
    }

    const { title, url } = data.result;
    const extension = url.split('.').pop().split('?')[0] || "mp4";

    ctx.resolve({
      title: `${title}.${extension}`,
      url: `${url}?filename=${encodeURIComponent(title)}.${extension}`
    });

  } catch (err) {
    ctx.reject(`❌ ${err.message}`);
  }
}

module.exports = { onResolve };
