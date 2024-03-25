export default defineEventHandler(async (event)=>{
    if (!event.context.session) {
		throw createError({
			statusCode: 403
		});
	}
    try {
        const data = await sql`select * from mail where user_id=${event.context.user.id} and provider_id='google'`

        return {
            // data: email.html
            inboxData: data
        }
    } catch(error) {
        console.log(error)
    }

})