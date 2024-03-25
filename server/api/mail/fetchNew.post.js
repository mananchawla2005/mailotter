import { ImapFlow } from 'imapflow';
// import PostalMime from 'postal-mime';

export default defineEventHandler(async (event)=>{
    if (!event.context.session) {
		throw createError({
			statusCode: 403
		});
	}
    const body = await readBody(event)
    const refresh_token = (await sql`select refresh_token from oauth_account where provider_id='google' and user_id=${event.context.user.id}`)[0].refresh_token
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
        let list = await client.search({seen: false});//
        await lock.release();

        return {
            // data: email.html
            data: list.filter(n => n > body.maxSeq)
        }
    } catch(error) {
        console.log(error)
    }

})