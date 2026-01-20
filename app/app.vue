<script setup lang="ts">
import { en, es } from '@nuxt/ui/locale'

const { locale, setLocale, t } = useI18n()

const title = computed(() => t('meta.title'))
const description = computed(() => t('meta.description'))
const htmlLang = computed(() => t('meta.language'))
const builtWith = computed(() => t('footer.builtWith'))

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: htmlLang.value ?? 'en'
  }
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <div
      id="dots"
      class="fixed inset-0 m-auto size-full blur-xs bg-[radial-gradient(var(--ui-text-muted)_1px,_transparent_1px)] bg-size-[32px_32px]"
    />
    <UHeader class="fixed top-0 left-0 right-0">
      <template #left>
        <NavLinks />
      </template>

      <template #right>
        <ULocaleSelect
          label-key="code"
          :locales="[en, es]"
          :model-value="locale"
          @update:model-value="setLocale($event as 'en' | 'es')"
        />

        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="p-5 mt-16 relative mx-auto flex size-full flex-col sm:max-w-160 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          {{ builtWith }} • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/alessandrro/ats-scanner"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
