<script setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['protected']
})
const storedIds = ref([27316])
const toFetchIds = ref(null)
const user = useUser()
const mails = ref([])

async function refreshInbox() {
    console.log(Math.max(storedIds.value))
    const { data } = await $fetch('/api/mail/fetchNew', {
        method: 'POST',
        body: {
            maxSeq: Math.max(storedIds.value)
        }
    })
    toFetchIds.value = data.filter(value => !storedIds.value.includes(value))
    const { mailData } = await $fetch('/api/mail/fetchMail', {
        method: 'POST',
        body: {
            toFetchIds: toFetchIds.value
        }
    })
    mailData.forEach((m)=>{
        mails.value.push({
            "user_id": useUser().value.id,
            "provider_id": "google",
            "sender_address": m.from.address,
            "sender_name": m.from.name,
            "reply_address": m.replyTo ? m.replyTo.address : null,
            "reply_name": m.replyTo ? m.replyTo.name : null,
            "subject": m.subject,
            "message_id": m.messageId,
            "date": m.date,
            "html": m.html,
            "text": m.text,
            "attachments": m.attachments,
            "seq": m.seq
        })
    })
    storedIds.value = storedIds.value.concat(toFetchIds.value)
}
onMounted(async () => {
    const { inboxData } = await $fetch('/api/mail/inbox', {
        method: 'POST'
    })
    mails.value = inboxData
    mails.value.forEach((m)=>{
        storedIds.value.push(m.seq)
    })
    console.log(storedIds.value)
    setInterval(async () => {
        await refreshInbox()
    }, 10000);

})
</script>
<template>
    <div>
        <h1 class="text-xl font-bold text-center">Showing Inbox for {{ user.email }}</h1>
        <div class="mt-8">
            <template v-for="mail in mails">
                <div
                    class="grid grid-cols-[20%_60%_20%] m-2 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-[#e7e9f2] via-[#d5d8e8] to-[#6b6ea5] text-black p-5 rounded-xl">
                    <div class="flex items-center">
                        <input type="checkbox" class="inline size-5">
                        <h1 class="text-lg inline mx-5 text-ellipsis max-w-full whitespace-nowrap overflow-hidden">{{ mail.sender_address }}</h1>
                    </div>
                    <h1 class="text-lg inline ml-5 text-ellipsis max-w-full whitespace-nowrap overflow-hidden">{{ mail.subject }}</h1>
                    <div>
                        <h1 class="text-right"><Icon name="material-symbols-light:delete-outline" class="size-5 mr-5"/><Icon name="material-symbols:star-outline" class="size-5"/></h1>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<style scoped></style>