import { makeWASocket, DisconnectReason, useSingleFileAuthState } from '@adiwajshing/baileys';
import readline from 'readline';
import chalk from 'chalk';
import { Exp, Data } from './yourModule.js'; // استيراد yourModule.js
import { Connecting } from './utils/connecting.js'; // استيراد connecting.js من مجلد utils
import { krakenHandler } from './handlers/kraken.js'; // استيراد kraken.js من مجلد handlers
import { mediafireHandler } from './handlers/mediafire.js'; // استيراد mediafire.js من مجلد handlers
import { pixeldrainHandler } from './handlers/pixeldrain.js'; // استيراد pixeldrain.js من مجلد handlers
import { youtubeHandler } from './handlers/youtube.js'; // استيراد youtube.js من مجلد handlers
import { Boom } from '@hapi/boom'; // استيراد Boom
import { sleep } from './utils/sleep.js'; // استيراد sleep.js من مجلد utils

// تعريف saveCreds إذا لم تكن مستوردة
const saveCreds = () => {
    // الكود الخاص بحفظ البيانات
};

async function launch() {
    try {
        // إعداد الاتصال عبر الـ pairing code
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (text) => new Promise((resolve) => rl.question(text, resolve));
        const phoneNumber = await question(chalk.yellow('Please type your WhatsApp number : '));

        // إرسال طلب pairing و الحصول على الكود
        let code = await Exp.requestPairingCode(phoneNumber.replace(/[+ -]/g, ""));
        console.log(chalk.bold.rgb(255, 136, 0)(`\n  ╭────────────────────────────╮\n  │  ${chalk.yellow('Your Pairing Code:')} ${chalk.greenBright(code)}  │\n  ╰────────────────────────────╯\n`));

        // تهيئة بيانات الاتصال
        Data.initialize({ Exp });

        // الاستماع لتحديثات الاتصال
        Exp.ev.on('connection.update', async (update) => {
            await Connecting({ update, Exp, Boom, DisconnectReason, sleep, launch });
        });

        // حفظ بيانات الاتصال عند التحديث
        Exp.ev.on('creds.update', saveCreds);

        // التعامل مع الرسائل الواردة
        Exp.ev.on('messages.upsert', async ({ messages }) => {
            const message = messages[0];
            if (message.body.startsWith('.krakenvideo')) {
                await krakenHandler(message, { Exp, text: message.body });
            } else if (message.body.startsWith('.pixeldrain')) {
                await pixeldrainHandler(message, { Exp, text: message.body });
            } else if (message.body.startsWith('.mediafirevideo')) {
                await mediafireHandler(message, { Exp, text: message.body });
            } else if (message.body.startsWith('.youtubevideo')) {
                await youtubeHandler(message, { Exp, text: message.body });
            }
        });

    } catch (error) {
        console.error(error);
    }
}

// تشغيل البوت
launch();