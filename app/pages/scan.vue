<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ScanResult } from '../utils/scan'

const { locale, t } = useI18n()

const breadcrumbHome = t('header.home')
const breadcrumbScan = t('header.scan')

const localeLink = computed(() => locale.value === 'en' ? '/' : '/es/')

const breadcrumbItems = ref([
  {
    label: breadcrumbHome,
    icon: 'i-lucide-home',
    to: localeLink.value
  },
  {
    label: breadcrumbScan,
    icon: 'i-lucide-file-text',
    to: localeLink.value + 'scan'
  }
])

// Form Schema
const schema = z.object({
  pdf: z
    .instanceof(File, { message: 'Please select a PDF file.' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'The file is too large. Max size is 5MB.')
    .refine(file => file.type === 'application/pdf', 'Only PDF files are allowed.')
})

type Schema = z.output<typeof schema>

const state = reactive<{ pdf: File | undefined }>({
  pdf: undefined
})

const loading = ref(false)
const result = ref<ScanResult | null>(null)
const error = ref<string | null>(null)

async function extractTextFromPDF(file: File): Promise<string> {
  // Lazy-load pdfjs-dist only on the client to avoid "DOMMatrix is not defined"
  // during SSR (the library uses browser-only APIs)
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: unknown) => (item as { str: string }).str ?? '')
      .join(' ') as string
    fullText += pageText + '\n'
  }

  return fullText.trim()
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  result.value = null
  error.value = null

  try {
    const text = await extractTextFromPDF(event.data.pdf)

    if (text.length < 50) {
      throw new Error('We could not extract enough text from your resume. Please make sure it is not just an image.')
    }

    const response = await $fetch<{ result: number, data: ScanResult }>('/api/scan', {
      method: 'POST',
      body: { text, locale: locale.value }
    })

    result.value = response.data
  } catch (err: unknown) {
    console.error('Scan error:', err)
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred.'
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}

const scoreColor = computed(() => {
  if (!result.value) return 'neutral'
  const score = result.value.score
  if (score >= 80) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
})

const heroTitle = t('scan.hero.title')
const heroDescription = t('scan.hero.description')
const formButton = t('scan.form.button')
const formLabel = t('scan.form.label')
const formDescription = t('scan.form.description')
const resultsTitle = t('scan.results.title')
const resultsScore = t('scan.results.score')
const resultsPros = t('scan.results.pros')
const resultsCons = t('scan.results.cons')
const detailedTitle = t('scan.detailed.title')
const detailedCategoriesPros = t('scan.detailed.categories.pros')
const detailedCategoriesCons = t('scan.detailed.categories.cons')
</script>

<template>
  <div class="pb-20">
    <UBreadcrumb
      :items="breadcrumbItems"
      class="sticky top-0 z-10"
    />

    <UPageHero
      :title="heroTitle"
      :description="heroDescription"
    >
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <UFormField
            name="pdf"
            class="relative"
          >
            <UFileUpload
              v-model="state.pdf"
              accept="application/pdf"
              class="w-full"
              :disabled="loading"
              :file-delete="!loading"
              highlight
              :label="formLabel"
              :description="formDescription"
            />
            <UProgress
              v-if="loading"
              :model-value="null"
              class="absolute inset-0 m-auto translate-y-1/2"
            />
          </UFormField>

          <div class="flex flex-col gap-4">
            <UButton
              type="submit"
              size="xl"
              block
              :loading="loading"
              icon="i-lucide-zap"
              :label="formButton"
            />

            <UAlert
              v-if="error"
              color="error"
              variant="subtle"
              icon="i-lucide-alert-circle"
              :title="error"
            />
          </div>
        </UForm>
      </template>
    </UPageHero>

    <template
      v-if="result"
    >
      <UContainer
        class="mt-12 space-y-12"
      >
        <!-- Overall Score -->
        <section class="text-center space-y-4">
          <h2 class="text-2xl font-bold">
            {{ resultsTitle }}
          </h2>
          <div class="flex justify-center">
            <div
              class="relative flex items-center justify-center w-32 h-32 rounded-full border-8"
              :class="`border-${scoreColor}-500/20 text-${scoreColor}-500`"
            >
              <span class="text-4xl font-black">{{ result?.score }}</span>
              <span class="text-xs absolute bottom-4">{{ resultsScore }}</span>
            </div>
          </div>
        </section>

        <!-- Main Pros & Cons -->
        <div class="grid md:grid-cols-2 gap-8">
          <UCard :ui="{ body: 'space-y-4' }">
            <template #header>
              <div class="flex items-center gap-2 text-success-500 font-bold">
                <UIcon name="i-lucide-check-circle" />
                {{ resultsPros }}
              </div>
            </template>
            <ul class="space-y-2 list-disc list-inside text-sm">
              <li
                v-for="pro in result?.pros"
                :key="pro"
              >
                {{ pro }}
              </li>
            </ul>
          </UCard>

          <UCard :ui="{ body: 'space-y-4' }">
            <template #header>
              <div class="flex items-center gap-2 text-error-500 font-bold">
                <UIcon name="i-lucide-x-circle" />
                {{ resultsCons }}
              </div>
            </template>
            <ul class="space-y-2 list-disc list-inside text-sm">
              <li
                v-for="con in result?.cons"
                :key="con"
              >
                {{ con }}
              </li>
            </ul>
          </UCard>
        </div>

        <!-- Detailed Analysis -->
        <section class="space-y-6">
          <h3 class="text-xl font-bold text-center">
            {{ detailedTitle }}
          </h3>
          <div class="grid gap-6">
            <UCard
              v-for="category in result?.structured?.categories"
              :key="category.name"
            >
              <template #header>
                <h4 class="font-bold">
                  {{ category?.name }}
                </h4>
              </template>
              <div class="grid md:grid-cols-2 gap-4">
                <div v-if="category?.pros?.length">
                  <p class="text-xs font-bold text-success-500 mb-2 uppercase tracking-wider">
                    {{ detailedCategoriesPros }}
                  </p>
                  <ul class="text-sm list-disc list-inside space-y-1">
                    <li
                      v-for="pro in category?.pros"
                      :key="pro"
                      class="flex gap-2"
                    >
                      <UIcon
                        name="i-lucide-check"
                        class="text-success-500 shrink-0 mt-0.5"
                      />
                      {{ pro }}
                    </li>
                  </ul>
                </div>
                <div v-if="category?.cons?.length">
                  <p class="text-xs font-bold text-error-500 mb-2 uppercase tracking-wider">
                    {{ detailedCategoriesCons }}
                  </p>
                  <ul class="text-sm list-disc list-inside space-y-1">
                    <li
                      v-for="con in category?.cons"
                      :key="con"
                      class="flex gap-2"
                    >
                      <UIcon
                        name="i-lucide-x"
                        class="text-error-500 shrink-0 mt-0.5"
                      />
                      {{ con }}
                    </li>
                  </ul>
                </div>
              </div>
            </UCard>
          </div>
        </section>
      </UContainer>
    </template>
  </div>
</template>
