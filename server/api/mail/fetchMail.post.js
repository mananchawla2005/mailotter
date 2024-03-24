import PostalMime from 'postal-mime'
import { ImapFlow } from 'imapflow';

export default defineEventHandler(async (event)=>{
    if (!event.context.session) {
		throw createError({
			statusCode: 403
		});
	}
    const body = await readBody(event)
    const refresh_token = (await sql`select refresh_token from oauth_account where provider_id='google'`)[0].refresh_token
    const access_token = await google.refreshAccessToken(refresh_token)
    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: {
            user: event.context.user.email,
            accessToken: access_token.accessToken
        },
        logger: false
    });
    try {
        await client.connect()
        let lock = await client.getMailboxLock('INBOX');
        const messageEnvelope = await client.fetchOne(body.id, { envelope: true });
        messageEnvelope.modseq = messageEnvelope.modseq.toString()
        return {
            messageEnvelope
        }
    } catch (error) {
        console.log(error)
    }
})