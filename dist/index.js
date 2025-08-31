async function onResolve(ctx) {
  try {
    const videoUrl = ctx.url;
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(videoUrl)}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data || !data.status || !data.result) {
      throw new Error("Failed to fetch video info");
    }

    const result = data.result;

    ctx.resolve({
      title: result.title,
      url: result.url,
      thumbnail: result.thumbnail
    });

  } catch (err) {
    ctx.reject(err.message);
  }
}

module.exports = { onResolve };
