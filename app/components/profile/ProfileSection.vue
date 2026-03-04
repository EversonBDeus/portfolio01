<script setup lang="ts">
import PortfolioTabs from '~/components/tabs/PortfolioTabs.vue'
import AboutAccordion from '~/components/profile/AboutAccordion.vue'
import { usePortfolioData } from '~/composables/usePortfolioData'

const isLoading = ref(false)
const avatarOk = ref(true)
const isAboutOpen = ref(false)

const { data } = usePortfolioData()
const profile = data.profile

onMounted(() => {
  const img = new Image()
  img.onload = () => (avatarOk.value = true)
  img.onerror = () => (avatarOk.value = false)
  img.src = profile.avatarSrc
})

const toast = useToast()

function notifyMissing(label: string, e?: Event) {
  e?.preventDefault?.()
  toast.add({
    title: 'Link não configurado',
    description: `Adicione o link de ${label} em app/data/profile.ts`,
    icon: 'i-lucide-link-2-off'
  })
}

function onSocialClick(s: { label: string; url: string }, e: Event) {
  if (!s.url) notifyMissing(s.label, e)
}

function onContactClick(label: string, url: string, e: Event) {
  if (!url) notifyMissing(label, e)
}

async function fileExists(url: string) {
  try {
    const head = await fetch(url, { method: 'HEAD' })
    if (head.ok) return true
    const get = await fetch(url, { method: 'GET' })
    return get.ok
  } catch {
    return false
  }
}

async function downloadCV() {
  const url = profile.cv?.url || '/files/cv.pdf'
  const ok = await fileExists(url)

  if (!ok) {
    toast.add({
      title: 'Currículo não encontrado',
      description: 'Coloque o arquivo em public/files/cv.pdf (ou ajuste app/data/profile.ts).',
      icon: 'i-lucide-file-x'
    })
    return
  }

  toast.add({
    title: 'Abrindo currículo',
    description: 'O arquivo será aberto em uma nova guia.',
    icon: 'i-lucide-download'
  })

  if (profile.cv?.openInNewTab) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    location.href = url
  }
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center pt-24 px-4">
    <div class="w-full max-w-3xl">
      <UCard class="text-center surface-panel">
        <div class="space-y-6 py-4">
          <!-- Avatar -->
          <div v-reveal="{ eager: true, delay: 0 }" class="flex justify-center">
            <div
              class="rounded-full border-4 border-primary shadow-lg overflow-hidden
                     w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center"
            >
              <img
                v-if="avatarOk"
                :src="profile.avatarSrc"
                alt="Foto de perfil"
                class="w-full h-full object-cover"
              />
              <UAvatar v-else size="3xl" icon="i-lucide-user" />
            </div>
          </div>

          <UAlert
            v-if="!avatarOk"
            title="Sem foto de perfil"
            description="Verifique o arquivo em public/img/profile/avatar.jpeg"
            icon="i-lucide-image-off"
            variant="soft"
          />

          <!-- Nome, headline e Sobre mim -->
          <div v-reveal="{ eager: true, delay: 80 }" class="space-y-1">
            <h1 class="text-3xl sm:text-4xl font-bold">{{ profile.name }}</h1>

            <p class="text-base sm:text-lg text-muted">
              {{ profile.headline }}
            </p>

            <div class="pt-1 flex justify-center">
              <UTooltip text="Clique para abrir / fechar">
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  class="px-2 py-1 text-xs text-muted hover:text-toned"
                  :icon="isAboutOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  @click="isAboutOpen = !isAboutOpen"
                >
                  Sobre mim
                </UButton>
              </UTooltip>
            </div>

            <div v-if="isAboutOpen" class="mt-2 flex justify-center">
              <div class="w-full max-w-sm">
                <AboutAccordion />
              </div>
            </div>
          </div>

          <!-- Redes sociais (stagger) -->
          <div class="flex justify-center gap-4 sm:gap-6">
            <div
              v-for="(s, idx) in profile.socials"
              :key="s.label"
              v-reveal="{ eager: true, delay: 160 + idx * 80 }"
            >
              <UButton
                variant="ghost"
                size="lg"
                :to="s.url || '#'"
                :aria-label="s.label"
                :ui="{ leadingIcon: s.brandClass }"
                :icon="s.icon"
                @click="(e) => onSocialClick(s, e)"
              />
            </div>
          </div>

          <!-- Ações -->
          <div v-reveal="{ eager: true, delay: 420 }" class="pt-1">
            <div class="flex items-center justify-center gap-4 flex-wrap">
              <UButton
                color="primary"
                variant="solid"
                size="xl"
                icon="i-lucide-download"
                loading-auto
                @click="downloadCV"
              >
                Download CV
              </UButton>

              <div class="flex items-center gap-3">
                <div v-reveal="{ eager: true, delay: 520 }">
                  <UButton
                    variant="soft"
                    size="xl"
                    class="h-14 w-14 justify-center rounded-lg"
                    aria-label="WhatsApp"
                    :to="profile.contact.whatsappUrl || '#'"
                    icon="i-simple-icons-whatsapp"
                    :ui="{ leadingIcon: 'brand-whatsapp' }"
                    @click="(e) => onContactClick('WhatsApp', profile.contact.whatsappUrl, e)"
                  />
                </div>

                <div v-reveal="{ eager: true, delay: 600 }">
                  <UButton
                    variant="soft"
                    size="xl"
                    class="h-14 w-14 justify-center rounded-lg"
                    aria-label="Telegram"
                    :to="profile.contact.telegramUrl || '#'"
                    icon="i-simple-icons-telegram"
                    :ui="{ leadingIcon: 'brand-telegram' }"
                    @click="(e) => onContactClick('Telegram', profile.contact.telegramUrl, e)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="pt-2">
            <USeparator class="my-6" />
            <PortfolioTabs />
          </div>
        </div>
      </UCard>
    </div>
  </section>
</template>