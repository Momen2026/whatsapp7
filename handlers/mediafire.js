import fetch from 'node-fetch';

let handler = async (m, { Exp, text }) => {
    if (!text) return m.reply('🚨 يرجى إرسال رابط ملف صالح من MediaFire!');

    try {
        if (!text.includes('mediafire.com')) {
            return m.reply('❌ الرابط المرسل ليس رابط من MediaFire!');
        }

        // استخراج رابط التحميل المباشر من MediaFire
        let fileId = text.split('file/')[1];
        if (!fileId) return m.reply('❌ الرابط غير صالح!');

        // هنا، يجب أن تكون على دراية بكيفية الحصول على رابط التحميل المباشر من MediaFire
        // على سبيل المثال، إذا كان لديك رابط مباشر يمكنك إضافته هنا:
        let directLink = `https://www.mediafire.com/file/${fileId}/download`; // استبدل هذا إذا كان لديك طريقة أفضل للحصول على الرابط المباشر

        let caption = '🎬 *تم تحميل الفيديو بنجاح!*';

        // إرسال الفيديو إلى واتساب
        await Exp.sendMessage(m.chat, {
            video: { url: directLink },
            caption: caption
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply('⚠️ حدث خطأ أثناء إرسال الفيديو.');
    }
};

handler.help = ['mediafirevideo'];
handler.tags = ['downloader'];
handler.command = /^(mediafirevideo|mfv)$/i;

export default handler;