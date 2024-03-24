import { generateState, generateCodeVerifier } from "arctic";

export default defineEventHandler(async (event)=>{
    console.log("something")
    const state = generateState()
    const codeVerifier = generateCodeVerifier();
    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email", "https://mail.google.com/"]
    })
    url.searchParams.set("access_type", "offline")
    setCookie(event, "google_oauth_state", state, {
        path: '/',
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
    })
    setCookie(event, "google_code_verifier", codeVerifier, {
        path: '/',
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
    })
    return sendRedirect(event, url.toString());
})