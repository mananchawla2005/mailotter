<script setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['protected']
})
const storedIds = ref([27323, 27326, 27330])
const toFetchIds = ref(null)
const mailEnvelopes = ref([{}])
onMounted(async ()=>{
    const {data} = await $fetch('/api/mail/fetch', {
        method: 'POST'
    })
    storedIds.value = storedIds.value.concat(data.filter(value => !storedIds.value.includes(value)))
    toFetchIds.value = storedIds.value.filter(value=>!mailEnvelopes.value.isFetched)
    await new Promise(async (resolve, reject)=>{
            for (let index = 0; index <  toFetchIds.value.length; index++) {
                const id =  toFetchIds.value[index]
                const messageEnvelope = await $fetch('/api/mail/fetchMail', {
                    method: 'POST',
                    body: {
                        id: id
                    }
                })
                console.log(messageEnvelope)      
                mailEnvelopes.value.push(messageEnvelope)          
            }
            resolve()
    })
})
</script>
<template>
    <div>
        {{ mailEnvelopes }}
    </div>
</template>
<style scoped>
</style>