import { Boom } from '@hapi/boom';

export const Connecting = async ({ update, Exp, Boom, DisconnectReason, sleep, launch }) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
        const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);

        if (shouldReconnect) {
            await sleep(5000);
            launch();
        }
    } else if (connection === 'open') {
        console.log('Connected successfully!');
    }
};