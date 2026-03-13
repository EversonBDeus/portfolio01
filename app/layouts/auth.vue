<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const scene = computed(() => {
  if (route.path === '/auth/register') {
    return {
 badge: 'Cadastro',
  title: 'Crie sua conta',
  body: 'Comece sua presença profissional com uma página clara, moderna e fácil de atualizar.',
  steps: [
    'Crie sua conta',
    'Preencha suas informações',
    'Escolha sua base visual',
    'Publique sua página'
      ]
    }
  }

  return {
  badge: 'Login',
  title: 'Entre na Lumio',
  body: 'Acesse sua conta para editar seu conteúdo e publicar sua página profissional.',
  steps: [
    'Entre na sua conta',
    'Revise seu conteúdo',
    'Ajuste sua página',
    'Publique quando estiver pronto'
    ]
  }
})

const testimonial = {
  quote: '“Em poucos minutos eu já tinha uma base pronta para organizar meu portfólio com mais clareza e presença profissional.”',
  name: 'Cliente demo',
  role: 'Profissional criativo'
}
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_46%,#f8fafc_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.10),transparent_22%),linear-gradient(180deg,#030712_0%,#07111f_46%,#040816_100%)] dark:text-white">
    <header class="border-b border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
      <div class="mx-auto flex min-h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
          <img
            src="/brand/lumio-logo.png"
            alt="Lumio"
            class="h-8 w-auto sm:h-9"
          >

          <div class="min-w-0">
            <p class="truncate font-semibold text-slate-950 dark:text-white">
              Lumio
            </p>
            <p class="truncate text-xs text-slate-500 dark:text-slate-400">
              Acesso à plataforma
            </p>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <UButton
            to="/"
            color="neutral"
            variant="ghost"
            size="sm"
            class="text-emerald-700 dark:text-emerald-300"
          >
            Voltar para landing
          </UButton>

          <UColorModeButton />
        </div>
      </div>
    </header>

    <UMain class="px-4 py-5 sm:px-6 lg:px-8 lg:py-0">
      <div class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1400px] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(430px,470px)] lg:items-stretch">
        <section
          class="order-2 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(241,245,249,0.92)_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_20%),linear-gradient(180deg,rgba(9,16,34,0.95)_0%,rgba(3,8,20,0.98)_100%)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.28)] lg:order-1 lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:p-8 xl:p-10"
        >
          <div class="flex h-full flex-col justify-between gap-8">
            <div class="space-y-6">
              <div class="space-y-3">
                <UBadge color="primary" variant="subtle">
                  {{ scene.badge }}
                </UBadge>

                <h1 class="max-w-[9ch] text-4xl font-semibold leading-[0.95] tracking-tight text-slate-950 dark:text-white sm:text-5xl xl:text-[4rem]">
                  {{ scene.title }}
                </h1>

                <p class="max-w-xl text-base leading-7 text-slate-700 dark:text-slate-300">
                  {{ scene.body }}
                </p>
              </div>

              <div class="space-y-3">
                <div class="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span>Etapas do fluxo</span>
                  <span class="h-px w-20 bg-slate-300 dark:bg-white/15" />
                </div>

                <ul class="space-y-3">
                  <li
                    v-for="(step, index) in scene.steps"
                    :key="step"
                    class="flex items-center gap-3 text-slate-800 dark:text-slate-200"
                  >
                    <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25">
                      {{ index + 1 }}
                    </span>
                    <span class="text-sm sm:text-base">{{ step }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="relative hidden lg:block">
              <div class="absolute -left-6 bottom-10 h-24 w-24 rounded-[1.5rem] bg-emerald-500/10 blur-sm ring-1 ring-emerald-400/15 dark:bg-emerald-500/12 dark:ring-emerald-400/20" />
              <div class="absolute right-2 top-[-7rem] h-32 w-24 rotate-[8deg] rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(78,222,128,0.25),rgba(75,200,180,0.10))] ring-1 ring-slate-200/70 dark:ring-white/10" />
              <div class="absolute right-20 top-[-1.5rem] h-24 w-20 rotate-[-2deg] rounded-[1.3rem] bg-[linear-gradient(180deg,rgba(53,209,192,0.22),rgba(14,116,144,0.10))] ring-1 ring-slate-200/70 dark:ring-white/10" />

              <div class="relative max-w-xl rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/8 dark:shadow-[0_18px_60px_rgba(0,0,0,0.26)]">
                <div class="mb-4 flex items-center gap-1 text-amber-400 dark:text-amber-300">
                  <UIcon v-for="star in 5" :key="star" name="i-lucide-star" class="size-4 fill-current" />
                </div>

                <p class="text-base leading-7 text-slate-800 dark:text-slate-100">
                  {{ testimonial.quote }}
                </p>

                <div class="mt-4 flex items-center gap-3">
                  <span class="flex size-10 items-center justify-center rounded-full bg-emerald-500/12 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20">
                    CD
                  </span>

                  <div>
                    <p class="font-medium text-slate-950 dark:text-white">
                      {{ testimonial.name }}
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ testimonial.role }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="order-1 flex items-start justify-center py-1 lg:order-2 lg:py-5">
          <slot />
        </section>
      </div>
    </UMain>
  </div>
</template>