import { OAuth2RequestError } from "arctic";

export default defineEventHandler(async (event)=>{
    const query = getQuery(event)
	const code = query.code?.toString() ?? null
	const state = query.state?.toString() ?? null
	const storedState = getCookie(event, "google_oauth_state") ?? null
    const storedCodeVerifier = getCookie(event, "google_code_verifier") ?? null
    if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		throw createError({
			status: 400
		});
	}
    try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
		const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
        const refreshToken = tokens.refreshToken
        const userId = event.context.user.id
		const googleUser = await googleUserResponse.json();
        // console.log(googleUser)
		// Replace this with your own DB client.
        console.log(userId)
        const existingGoogleAccount = await sql`select user_id from oauth_account where user_id=${userId} AND provider_id='google'`
        console.log()
		if (existingGoogleAccount.length!=0) {
            await sql`update oauth_account set refresh_token=${refreshToken} where user_id=${userId}`            
			return sendRedirect(event, "/app");
		}

        else {
            await sql`insert into oauth_account values('google', ${googleUser.id}, ${userId}, ${refreshToken})`
            return sendRedirect(event, "/app");
        }


		
	} catch (e) {
        console.log(e)
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			throw createError({
				status: 400
			});
		}
		throw createError({
			status: 500
		});
	}
})