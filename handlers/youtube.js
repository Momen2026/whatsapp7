import fetch from 'node-fetch';
import ytdl from 'ytdl-core';

let handler = async (m, { Exp, text }) => {
    if (!text) return m.reply('🚨 يرجى إرسال رابط فيديو صالح من YouTube!');

    try {
        if (!ytdl.validateURL(text)) {
            return m.reply('❌ الرابط المرسل ليس رابط صالح من YouTube!');
        }

        // استخراج رابط الفيديو المباشر من YouTube باستخدام ytdl
        let info = await ytdl.getInfo(text);
        let videoUrl = ytdl.chooseFormat(info.formats, { quality: 'highest' }).url;

        let caption = '🎬 *تم تحميل الفيديو بنجاح!*';

        // إرسال الفيديو إلى واتساب
        await Exp.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: caption
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply('⚠️ حدث خطأ أثناء إرسال الفيديو.');
    }
};

handler.help = ['youtubevideo'];
handler.tags = ['downloader'];
handler.command = /^(youtubevideo|ytv)$/i;

export default handler;