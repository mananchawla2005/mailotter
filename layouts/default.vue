<script setup>
const isProductsMenuVisible = ref(false)
const isDocsMenuVisible = ref(false)
const nav = ref(null)
const navIsVisible = ref(true)

const { stop } = useIntersectionObserver(
    nav,
  ([{ isIntersecting }], observerElement) => {
    navIsVisible.value = isIntersecting
    console.log(navIsVisible.value)
  },
)

</script>
<template>
    <div
        class="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-[#e7e9f2] via-[#d5d8e8] to-[#6b6ea5] min-h-[200vh]">
        <!-- Navbar -->
        <div ref="nav"></div>
        <div style="display: initial;" class="mb-10">
            <div class="p-5 flex rubik top-0 transition-all z-50"  :class="{'bg-[#f5f6f9]/75': !navIsVisible, 'sticky': !navIsVisible, 'shadow-xl': !navIsVisible, 'backdrop-blur-xl': !navIsVisible}">
                <div class="min-w-[50%]">
                    <div class="flex">
                        <nuxt-link class="font-bold text-3xl cursor-pointer" to="/">MailOtter</nuxt-link>
                        <h1 class="pl-20 text-xl mt-1 cursor-pointer" @mouseover="isProductsMenuVisible = true"
                            @mouseleave="isProductsMenuVisible = false">
                            Products 
                            <Transition mode="out-in" name="slide-up">
                            <Icon name="ep:arrow-down" v-if="!isProductsMenuVisible" size="15" />
                            <Icon name="ep:arrow-up" v-else size="15" />
                            </Transition>
                            <br /> 
                            <Transition name="fade">
                                <div class="absolute dropdown" v-if="isProductsMenuVisible">
                                    <Icon name="akar-icons:triangle-fill" :class="{'!top-6': !navIsVisible}" class="absolute top-2 left-8" style="color: rgb(255 255 255)" size="19"/>
                                    <div :class="{'!mt-10': !navIsVisible}" class="mt-6 p-5 rounded-xl w-fit text-base bg-white shadow-lg z-10">
                                        <p class="px-5 py-1 rounded-2xl hover:bg-[#5f5f96] hover:text-white transition-all">Email Marketing with AI</p>
                                        <p class="px-5 py-1 mt-2 rounded-2xl hover:bg-[#5f5f96] hover:text-white transition-all">Declutter Inbox</p>
                                    </div>
                                </div>
                            </Transition>
                        </h1>
                        <h1 class="pl-10 text-xl mt-1 cursor-pointer">
                            Pricing
                        </h1>
                        <h1 class="pl-10 text-xl mt-1 cursor-pointer" @mouseover="isDocsMenuVisible = true"
                            @mouseleave="isDocsMenuVisible = false">
                            Docs
                            <Transition mode="out-in" name="slide-up">
                            <Icon name="ep:arrow-down" v-if="!isDocsMenuVisible" size="15" />
                            <Icon name="ep:arrow-up" v-else size="15" />
                            </Transition>
                            <br /> 
                            <Transition name="fade">
                                <div class="absolute dropdown z-20" v-if="isDocsMenuVisible">
                                    <Icon name="akar-icons:triangle-fill" :class="{'!top-6': !navIsVisible}" class="absolute top-2 left-4" style="color: rgb(255 255 255)" size="19"/>
                                    <div :class="{'!mt-10': !navIsVisible}" class="mt-6 p-5 rounded-xl w-fit text-base bg-white shadow-lg z-10">
                                        <p class="px-5 py-1 rounded-2xl hover:bg-[#5f5f96] hover:text-white transition-all">Getting Started</p>
                                        <p class="px-5 py-1 mt-2 rounded-2xl hover:bg-[#5f5f96] hover:text-white transition-all">Querying Inbox</p>
                                        <p class="px-5 py-1 mt-2 rounded-2xl hover:bg-[#5f5f96] hover:text-white transition-all">Filtering Users</p>
                                    </div>
                                </div>
                            </Transition>
                        </h1>
                    </div>
                </div>
                <div class="w-full text-right font-semibold text-xl mt-1">
                    <nuxt-link to="/login" class="group text-black transition-all duration-300 ease-in-out px-5 inline cursor-pointer">
                        <span class="bg-left-bottom bg-gradient-to-r from-[#5f5f96] to-[#5f5f96] bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-200 ease-out">
                            Login
                        </span>
                    </nuxt-link>
                    <h2 class="px-5 py-1 rounded-2xl inline bg-[#5f5f96] hover:bg-[#52517c] cursor-pointer text-white">Start
                        Free</h2>
                </div>
            </div>
        </div>
        <slot />
    </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>