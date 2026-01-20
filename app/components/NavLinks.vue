<script setup lang="ts">
const { locale, t } = useI18n()

const localeLink = computed(() => (locale.value === 'en' ? '/' : '/es/'))
const homeLink = computed(() => t('header.home'))
const scanLink = computed(() => t('header.scan'))
</script>

<template>
  <div class="flex items-center gap-x-3">
    <NuxtLink :to="localeLink">
      {{ homeLink }}
    </NuxtLink>

    <NuxtLink :to="localeLink + 'scan'">
      {{ scanLink }}
    </NuxtLink>
  </div>
</template>
