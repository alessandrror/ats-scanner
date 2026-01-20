<script setup lang="ts">
const { locale, t } = useI18n()

const heroTitle = t('landing.hero.title')
const heroDescription = t('landing.hero.description')
const heroLink = t('landing.hero.link')

const featuresSectionTitle = computed(() => t('landing.features.sectionTitle'))
const featuresSectionDescription = computed(() => t('landing.features.sectionDescription'))
const features = computed(() => [
  {
    icon: 'i-lucide-sparkles',
    title: t('landing.features.ai.title'),
    description: t('landing.features.ai.description')
  },
  {
    icon: 'i-lucide-gauge',
    title: t('landing.features.score.title'),
    description: t('landing.features.score.description')
  },
  {
    icon: 'i-lucide-list-checks',
    title: t('landing.features.structured.title'),
    description: t('landing.features.structured.description')
  },
  {
    icon: 'i-lucide-shield-check',
    title: t('landing.features.privacy.title'),
    description: t('landing.features.privacy.description')
  },
  {
    icon: 'i-lucide-zap',
    title: t('landing.features.instant.title'),
    description: t('landing.features.instant.description')
  },
  {
    icon: 'i-lucide-languages',
    title: t('landing.features.multilang.title'),
    description: t('landing.features.multilang.description')
  }
])

const ctaHeader = t('landing.cta.header')
const ctaTitle = t('landing.cta.title')
const ctaDescription = t('landing.cta.description')
const ctaLink = t('landing.cta.link')

const scanLink = computed(() => (locale.value === 'en' ? '/scan' : '/es/scan'))

const resumeExamples = computed(() => [
  {
    isReverse: true,
    root: '[--duration:40s] absolute w-[460px] -left-[100px] -top-[300px] h-[940px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30',
    images: [
      '/images/resume-ats-marquee-01.png',
      '/images/resume-ats-marquee-02.png',
      '/images/resume-ats-marquee-03.jpg',
      '/images/resume-ats-marquee-04.webp'
    ]
  },
  {
    isReverse: false,
    root: '[--duration:40s] absolute w-[460px] -top-[400px] left-[480px] h-[1160px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30',
    images: [
      '/images/resume-ats-marquee-05.webp',
      '/images/resume-ats-marquee-06.jpg',
      '/images/resume-ats-marquee-07.png',
      '/images/resume-ats-marquee-08.png'
    ]
  },
  {
    isReverse: true,
    root: 'hidden md:flex [--duration:40s] absolute w-[460px] -top-[300px] left-[1020px] h-[1060px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30',
    images: [
      '/images/resume-ats-marquee-09.webp',
      '/images/resume-ats-marquee-10.webp',
      '/images/resume-ats-marquee-11.webp',
      '/images/resume-ats-marquee-12.webp'
    ]
  }
])
</script>

<template>
  <div>
    <UPageHero
      :title="heroTitle"
      :description="heroDescription"
      :links="[{
        label: heroLink,
        to: scanLink,
        trailingIcon: 'i-lucide-arrow-right'
      }]"
    />

    <UPageSection
      id="features"
      :title="featuresSectionTitle"
      :description="featuresSectionDescription"
      :features="features"
    />

    <UPageSection
      id="cta"
      :title="ctaHeader"
      variant="subtle"
    >
      <template #body>
        <div class="relative w-full h-[400px] bg-muted overflow-hidden">
          <UMarquee
            v-for="({ isReverse, root, images }, index) in resumeExamples"
            :key="index + 1"
            :overlay="false"
            :reverse="isReverse"
            orientation="vertical"
            :ui="{ root }"
          >
            <img
              v-for="(image, i) in images"
              :key="(i + 1) * (index + 1)"
              :src="image"
              width="460"
              height="258"
              :alt="`Resume Example ${(i + 1) * (index + 1)}`"
              class="aspect-video border border-default rounded-lg bg-white overflow-hidden w-full h-full object-contain"
            >
          </UMarquee>
        </div>
      </template>
      <template #footer>
        <UPageCTA
          :title="ctaTitle"
          :description="ctaDescription"
          variant="subtle"
          :links="[{
            label: ctaLink,
            to: scanLink,
            trailingIcon: 'i-lucide-arrow-right'
          }]"
        />
      </template>
    </UPageSection>
  </div>
</template>
