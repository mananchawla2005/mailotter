<script setup>
definePageMeta({
    layout: 'auth'
})

const user = useUser();
console.log("what", user.value)
if (user.value) {
	await navigateTo("/app"); 
}

async function login(e) {
	await $fetch("/api/login", {
		method: "POST",
		body: new FormData(e.target)
	});
	await navigateTo("/app");
}

const router = useRouter()

</script>
<template>
    <div>
        <h1 class="absolute left-8 cursor-pointer" @click="router.back()"><Icon name="ep:back" class="mr-1 size-5"/>Go Back</h1>
        <div class="mt-14 rubik grid lg:grid-cols-3">
            <div class=" lg:col-start-2 p-5">
                <h1 class="text-center text-2xl font-semibold">Login</h1>
                <hr class="border-gray-400/50 mt-5"/>
                <form class="mt-7" method="post" action="/api/login" @submit.prevent="login">
                    <h1 class="ml-2 font-bold mb-4 text-xl">Email</h1>
                    <input name="email" placeholder="Enter your email" type="email" class="rubik w-full hover:outline-none rounded-3xl shadow-lg outline-none p-2 px-4"/>
                    <h1 class="ml-2 font-bold mb-4 mt-5 text-xl">Password</h1>
                    <input name="password" placeholder="Enter your Password" type="password" class="rubik w-full hover:outline-none rounded-3xl shadow-lg outline-none p-2 px-4"/>
                    <p class="mt-3 underline cursor-pointer ml-3 text-sm">Forgot Password?</p>
                    <h1 class="text-center mt-5 mb-3">OR</h1>
                    <input type="submit" class="p-3 mb-3 bg-[#5f5f96] hover:bg-[#52517c] cursor-pointer text-white text-center rounded-xl shadow-md text-lg w-full" value="Continue to Inbox"/>
                    <div class="grid grid-cols-2 text-center gap-4">
                        <h1 class="border-gray-300 hover:bg-white/50 cursor-pointer border-2 shadow-md rounded-xl text-black"><div class="flex"><Icon name="logos:google-icon" class="my-2 mx-3"/><p class="mt-1">Login with Google</p></div></h1>
                        <h1 class="border-gray-300 hover:bg-white/50 cursor-pointer border-2 shadow-md rounded-xl text-black"><div class="flex"><Icon name="logos:microsoft-icon" class="my-2 mx-3"/><p class="mt-1">Login with Microsoft</p></div></h1>
                    </div>
                </form>
                <nuxt-link class="text-sm underline mt-14 ml-2 text-center block" to="/signup">Don't have an account yet? Sign Up</nuxt-link>
            </div>
        </div>
    </div>
</template>
<style scoped>

</style>