import { Argon2id } from "oslo/password";
import { generateId } from "lucia";

export default eventHandler(async (event) => {
	const formData = await readFormData(event)
    const fullname = formData.get("fullname");
	const email = formData.get("email")
	if (
		typeof email !== "string" ||
		!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
	) {

		throw createError({
			message: "Invalid email",
			statusCode: 400
		});
	}
	const password = formData.get("password")
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		throw createError({
			message: "Invalid password",
			statusCode: 400
		});
	}

	const hashedPassword = await new Argon2id().hash(password)
	const userId = generateId(15)

	// TODO: check if username is already used
    try {
        // Insert User
        await sql`insert into auth_user values(${userId}, ${email}, ${hashedPassword}, ${fullname})`
    } catch (error) {
        console.log(error)
        throw createError({
			message: "Some error occurred",
			statusCode: 500
		});
    }

	const session = await lucia.createSession(userId, {})
	appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize())
});