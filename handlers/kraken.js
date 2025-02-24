import fetch from 'node-fetch';

export const krakenHandler = async (m, { Exp, text }) => {
    if (!text) return m.reply('🚨 يرجى إرسال رابط فيديو صالح من KrakenFiles!');

    try {
        if (!text.includes('/video/uploads/')) {
            return m.reply('❌ الرابط المرسل ليس رابط فيديو مباشر!');
        }

        // إرسال الفيديو إلى واتساب
        let caption = '🎬 *تم التحميل بنجاح!*';
        
        await Exp.sendMessage(m.chat, {
            video: { url: text },
            caption: caption
        }, { quoted: m });

        // هنا يمكن إضافة أي عملية لحذف الملف من الاستضافة بعد الإرسال إذا كانت الخدمة تدعم الحذف عبر API
        // مثلا لو كانت KrakenFiles تدعم الحذف عبر API، ستحتاج إلى استخدام الكود المناسب لحذف الفيديو بعد الإرسال
        // مثال (افتراضًا أنه يوجد API للحذف):
        // await fetch(`https://krakenfiles.com/api/delete/${fileId}`, { method: 'DELETE' });

        // في حال لم يكن هناك API، يمكن أن تطلب من المستخدم أن يتأكد من حذف الفيديو يدويًا
        m.reply('⚠️ يجب عليك حذف الفيديو من الاستضافة إذا كانت الخدمة لا تدعم الحذف التلقائي.');

    } catch (error) {
        console.error(error);
        m.reply('⚠️ حدث خطأ أثناء إرسال الفيديو.');
    }
};
