<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePortfolioData } from '~/composables/usePortfolioData'
import type { Certificate } from '~/data/certificates'

import CertificateCard from '~/components/certificates/CertificateCard.vue'
import CertificateSlideover from '~/components/certificates/CertificateSlideover.vue'
import { formatYm } from '~/utils/format'

const { data } = usePortfolioData()
const certificates = data.certificates

const viewMode = ref<'grid' | 'timeline'>('grid')

const isOpen = ref(false)
const selected = ref<Certificate | null>(null)

function openCertificate(item: Certificate) {
  selected.value = item
  isOpen.value = true
}

const timelineItems = computed(() => {
  return certificates.map((c) => ({
    title: c.title,
    date: `${formatYm(c.startDate)} → ${formatYm(c.endDate)}`,
    icon: 'i-lucide-award'
  }))
})
</script>

<template>
  <div class="pt-4 space-y-4">
    <div class="flex items-start justify-between gap-3 flex-wrap">
      <div class="text-left">
        <h2 class="text-lg font-semibold">Certificados</h2>
        <p class="text-sm text-muted">
          Cursos e formações concluídas.
        </p>
      </div>

      <UButton
        icon="i-lucide-calendar-range"
        color="primary"
        variant="soft"
        @click="viewMode = viewMode === 'grid' ? 'timeline' : 'grid'"
      >
        Linha do tempo
      </UButton>
    </div>

    <UEmpty
      v-if="certificates.length === 0"
      icon="i-lucide-award"
      title="Nenhum certificado"
      description="Adicione certificados em app/data/certificates.ts."
    />

    <div v-else>
      <div v-if="viewMode === 'timeline'" class="mt-2">
        <UTimeline :items="timelineItems" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <CertificateCard
          v-for="c in certificates"
          :key="c.id"
          :item="c"
          @open="openCertificate"
        />
      </div>
    </div>

    <CertificateSlideover v-model="isOpen" :item="selected" />
  </div>
</template>