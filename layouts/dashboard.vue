<script setup lang="js">
const isModal = ref(false)
const isGoogleLinked = ref(false)
async function logout() {
	await $fetch("/api/logout", {
		method: "POST"
	});
	await navigateTo("/login");
}

const user = useUser()

onKeyStroke('/', (e)=>{
    e.preventDefault()
    alert('Search Box')
    // Search Box
})

const toggleModal = () => {
    isModal.value = !isModal.value
}

onMounted(async ()=>{
    const { data: accounts } = await $fetch('/api/accounts', {
        method: 'POST'
    })

    accounts.forEach((account)=>{
        if(account.provider_id=='google') {
            isGoogleLinked.value = true
        }
    })
})
</script>
<template>
    <div
        class="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-[#e7e9f2] via-[#d5d8e8] to-[#6b6ea5] min-h-screen">
            <div class="grid grid-cols-[20%_80%] min-h-screen">
                <div class="p-4 h-screen sticky self-start top-0">
                    <div class="h-full bg-white/60 backdrop-blur rounded-xl shadow-xl p-5 rubik">
                        <div>
                            <h1 class="font-bold text-lg text-center">Welcome, {{ user.fullname }}</h1>
                            <h1 @click="toggleModal" class="text-center py-1 px-2 bg-[#343450] hover:bg-[#28283a] cursor-pointer rounded-xl shadow-md text-white">Account Settings</h1>
                        </div>
                        <form @submit.prevent="logout">
                            <button>Sign out</button>
                        </form>
                    </div>
                </div>
                <div class="p-4">
                    <div class="h-full bg-white/60 backdrop-blur rounded-xl shadow-xl p-5 rubik">
                        <slot />
                    </div>
                </div>
            </div>
        <div class="absolute top-0 w-full h-screen bg-black/50 z-20 text-white" v-if="isModal">
            <div class="absolute right-0 mx-auto top-1/4 left-0 w-[30rem] bg-white/80 backdrop-blur shadow-xl border-gray-200 text-black rounded-xl p-2 t">
                <h1 class="text-center font-bold text-lg">Account Settings</h1>
                <hr class="mx-5 border-gray-400 mt-3" />
                <p class="text-left mt-2 ml-5 font-bold">
                    Your Email Accounts
                </p>
                <nuxt-link v-if="!isGoogleLinked" external to="/login/google" class="border-gray-300 block mx-4 hover:bg-white/75 mt-5 cursor-pointer border-2 shadow-md rounded-xl text-black"><div class="flex"><Icon name="logos:google-icon" class="my-2 mx-3"/><p class="mt-1">Link with Google</p></div></nuxt-link>
                <nuxt-link v-if="isGoogleLinked" class="border-gray-300 block bg-green-200 mx-4 mt-5 border-2 shadow-md rounded-xl text-black"><div class="flex"><Icon name="logos:google-icon" class="my-2 mx-3"/><p class="mt-1">Linked with Google</p></div></nuxt-link>
                <p class="my-3 text-center">
                    OR
                </p>
                <h1 class="border-gray-300 mx-4 hover:bg-white/75 mt-5 cursor-pointer border-2 shadow-md rounded-xl text-black"><div class="flex"><Icon name="logos:microsoft-icon" class="my-2 mx-3"/><p class="mt-1">Link with Outlook</p></div></h1>
                <div @click="toggleModal" class=" text-white py-1 bg-[#343450] hover:bg-[#28283a] cursor-pointer text-center w-full mt-4 rounded-xl p-2">
                    Save
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>

</style>