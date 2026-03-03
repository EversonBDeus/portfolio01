<script setup lang="ts">
import { computed, ref } from 'vue'
import { certificates } from '~/data/certificates'
import type { Certificate } from '~/data/certificates'
import CertificateCard from '~/components/certificates/CertificateCard.vue'
import CertificateSlideover from '~/components/certificates/CertificateSlideover.vue'
import { formatYm } from '~/utils/format'

const viewMode = ref<'grid' | 'timeline'>('grid')

const selected = ref<Certificate | null>(null)
const isOpen = ref(false)

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
  <div  class="pt-4 space-y-4">
    <div class="flex items-center justify-between gap-3">
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
      title="Nenhum certificado cadastrado"
      description="Adicione certificados em data/certificates.ts."
    />

    <div v-else>
      <div v-reveal v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <CertificateCard
          v-for="c in certificates"
          :key="c.id"
          :item="c"
          @open="openCertificate"
        />
      </div>

      <div v-else class="mt-2">
        <UTimeline :items="timelineItems" />
      </div>
    </div>

    <CertificateSlideover v-model="isOpen" :item="selected" />
  </div>
</template>