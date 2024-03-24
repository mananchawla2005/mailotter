import { Lucia } from "lucia"
import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import postgres from "postgres";
import { Google } from "arctic";

import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto
const runtimeConfig = useRuntimeConfig()

export const sql = postgres(runtimeConfig.dbConnectionString, { ssl: { rejectUnauthorized: false }});

const adapter = new PostgresJsAdapter(sql, {
	user: "auth_user",
	session: "user_session"
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		// IMPORTANT!
		attributes: {
			// set to `true` when using HTTPS
			secure: !process.dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			email: attributes.email,

			fullname: attributes.fullname
		};
	}
});


export const google = new Google(runtimeConfig.googleClientId, runtimeConfig.googleClientSecret, runtimeConfig.googleRedirectURI);
