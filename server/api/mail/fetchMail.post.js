import PostalMime from 'postal-mime'
import { ImapFlow } from 'imapflow';

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
        const data =[]
        for await (let msg of client.fetch(body.toFetchIds, {source: true})){
            const parser = new PostalMime();
            const parsed = await parser.parse(msg.source)
            // console.log(`${event.context.user.id},'google', ${parsed.from.address}, ${parsed.from.name}, ${parsed.replyTo.address}, ${parsed.replyTo.name}, ${parsed.subject}, ${parsed.messageId}, ${parsed.date}, ${parsed.html}, ${parsed.text}, ${parsed.attachments}, ${msg.seq}`)
            await sql`insert into mail values(${event.context.user.id},'google', ${parsed.from.address}, ${parsed.from.name}, ${parsed.replyTo !== undefined ? parsed.replyTo.address : null}, ${parsed.replyTo !== undefined ? parsed.replyTo.name : null}, ${parsed.subject}, ${parsed.messageId}, ${parsed.date}, ${parsed.html}, ${parsed.text !== undefined ? parsed.text : null}, ${parsed.attachments !== undefined ? parsed.attachments : null}, ${msg.seq})`
            // msg.modseq = msg.modseq.toString()
            parsed.seq = msg.seq
            data.push(parsed)
            // NB! You can not run any IMAP commands in this loop
            // otherwise you will end up in a deadloop
        }
        await lock.release();
        return {
            mailData: data
        }
    } catch (error) {
        console.log(error)
    }
})