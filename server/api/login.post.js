import { Argon2id } from "oslo/password";

export default eventHandler(async (event) => {
	const formData = await readFormData(event);
	const email = formData.get("email");
	if (
		typeof email !== "string" ||
		!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
	) {
		throw createError({
			message: "Invalid email",
			statusCode: 400
		});
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		throw createError({
			message: "Invalid password",
			statusCode: 400
		});
	}

	const existingUser = await sql`select * from auth_user where email=${email}`
	console.log(existingUser)
	if (existingUser.length==0) {

		throw createError({
			message: "Incorrect username or password",
			statusCode: 400
		});
	}

	const validPassword = await new Argon2id().verify(existingUser[0].hashed_password, password);
	if (!validPassword) {
		throw createError({
			message: "Incorrect username or password",
			statusCode: 400
		});
	}

	const session = await lucia.createSession(existingUser[0].id, {});
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
});