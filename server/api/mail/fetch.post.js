import { ImapFlow } from 'imapflow';
// import PostalMime from 'postal-mime';

export default defineEventHandler(async (event)=>{
    if (!event.context.session) {
		throw createError({
			statusCode: 403
		});
	}
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
        let list = await client.search({seen: false});//
        // const messages = []
        // await new Promise(async (resolve, reject)=>{
        //     for (let index = 0; index <  list.slice(-10).length; index++) {
        //         const element =  list.slice(-10)[index]
        //         let message = await client.fetchOne(element, { envelope: true });
        //         message.modseq = message.modseq.toString()
        //         messages.push(message)
                
        //     }
        //     resolve()
        // })
        // console.log(messages)
        // const parser = new PostalMime();
        // const email = await parser.parse(message.source)
        // console.log(list.slice(-10))
        lock.release();

        return {
            // data: email.html
            data: list.slice(-10)
        }
    } catch(error) {
        console.log(error)
    }

})