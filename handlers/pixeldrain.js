import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export const pixeldrainHandler = async (m, { Exp, text }) => {
    if (!text) return m.reply('🚨 يرجى إرسال رابط PixelDrain صالح!');

    try {
        if (!text.includes('/u/')) {
            return m.reply('❌ الرابط غير صالح!');
        }

        let fileId = text.split('/u/')[1];
        if (!fileId) return m.reply('❌ الرابط غير صالح!');

        let directLink = `https://pixeldrain.com/api/file/${fileId}`;
        let response = await fetch(directLink);
        
        if (!response.ok) {
            return m.reply('❌ فشل الوصول إلى الملف، تأكد من صحة الرابط!');
        }

        // حفظ الفيديو مؤقتًا
        const fileName = path.join(__dirname, `temp_video_${fileId}.mp4`);
        const writeStream = fs.createWriteStream(fileName);
        response.body.pipe(writeStream);

        // الانتظار حتى يتم تحميل الفيديو بالكامل
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        // إرسال الفيديو إلى المستخدم
        let caption = '🎬 *تم تحميل الفيديو بنجاح!*';
        await Exp.sendMessage(m.chat, {
            video: { url: `file://${fileName}` },
            caption: caption
        }, { quoted: m });

        // حذف الفيديو بعد الإرسال
        fs.unlink(fileName, (err) => {
            if (err) {
                console.error('فشل حذف الفيديو:', err);
            } else {
                console.log('تم حذف الفيديو بنجاح');
            }
        });

    } catch (error) {
        console.error(error);
        m.reply('⚠️ حدث خطأ أثناء تحميل الفيديو.');
    }
};
