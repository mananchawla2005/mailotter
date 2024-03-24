export default eventHandler(async (event) => {
	if (!event.context.session) {
		throw createError({
			statusCode: 403
		});
	}
	const accounts = await sql`select provider_id from oauth_account where user_id=${event.context.user.id}`
    return {
        data: accounts
    }
});