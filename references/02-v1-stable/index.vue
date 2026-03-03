<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'PortfolioSaaS — O teu portfólio profissional', description: 'Cria, personaliza e partilha o teu portfólio com o mundo em minutos.' })

const features = [
  { icon: 'i-heroicons-bolt', title: 'Criação Rápida', desc: 'Do zero ao online em menos de 5 minutos. Sem código, sem complicações.' },
  { icon: 'i-heroicons-paint-brush', title: 'Totalmente Personalizável', desc: 'Escolhe entre dezenas de templates e personaliza cada detalhe ao teu gosto.' },
  { icon: 'i-heroicons-chart-bar', title: 'Analytics Integrado', desc: 'Sabe quem visita o teu portfólio, de onde vêm e o que mais lhes interessa.' },
  { icon: 'i-heroicons-share', title: 'Link Único', desc: 'O teu portfólio com o teu nome: portfoliosaa.com/ti.' },
  { icon: 'i-heroicons-device-phone-mobile', title: '100% Responsivo', desc: 'Perfeito em qualquer dispositivo — desktop, tablet ou telemóvel.' },
  { icon: 'i-heroicons-shield-check', title: 'Seguro & Privado', desc: 'Os teus dados são teus. Podes exportar ou apagar a qualquer momento.' }
]

const plans = [
  {
    name: 'Gratuito',
    price: '€0',
    period: '/mês',
    desc: 'Para começar e explorar.',
    color: 'neutral' as const,
    featured: false,
    items: ['1 portfólio', 'Templates básicos', 'Subdomínio portfoliosaas.com/tu', 'Analytics básico', '100 MB de armazenamento']
  },
  {
    name: 'Pro',
    price: '€9',
    period: '/mês',
    desc: 'Para profissionais a sério.',
    color: 'primary' as const,
    featured: true,
    items: ['Portfólios ilimitados', 'Todos os templates', 'Domínio personalizado', 'Analytics avançado', '10 GB de armazenamento', 'Suporte prioritário', 'Remover branding']
  },
  {
    name: 'Agência',
    price: '€29',
    period: '/mês',
    desc: 'Para equipas e agências.',
    color: 'neutral' as const,
    featured: false,
    items: ['Tudo do Pro', 'Até 10 membros de equipa', 'Painel de gestão', 'White-label', 'API Access', 'SLA garantido']
  }
]

const faqs = [
  { q: 'Preciso de saber programar?', a: 'Não. O nosso editor visual é intuitivo e qualquer pessoa consegue criar um portfólio profissional sem escrever uma linha de código.' },
  { q: 'Posso usar o meu próprio domínio?', a: 'Sim, no plano Pro e Agência podes ligar o teu domínio personalizado (ex: joaosilva.pt).' },
  { q: 'Posso cancelar a qualquer momento?', a: 'Claro. Sem contratos, sem taxas escondidas. Cancelas quando quiseres, sem complicações.' },
  { q: 'Os meus dados ficam seguros?', a: 'Sim. Utilizamos encriptação de ponta a ponta e nunca vendemos os teus dados a terceiros.' }
]

const openFaq = ref<number | null>(null)

const stats = [
  { value: '12k+', label: 'Portfólios criados' },
  { value: '98%', label: 'Satisfação' },
  { value: '3min', label: 'Tempo médio de setup' },
  { value: '40+', label: 'Templates disponíveis' }
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-neutral-950 overflow-x-hidden">

    <!-- ===== NAVBAR ===== -->
    <header class="sticky top-0 z-50 border-b border-gray-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="text-white text-sm" />
          </div>
          <span class="font-bold text-gray-900 dark:text-white text-lg">PortfolioSaaS</span>
        </div>
        <nav class="hidden md:flex items-center gap-7">
          <a href="#features" class="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Funcionalidades</a>
          <a href="#precos" class="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Preços</a>
          <a href="#faq" class="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a>
        </nav>
        <div class="flex items-center gap-2">
          <UButton to="/login" variant="ghost" color="neutral" size="sm" label="Entrar" />
          <UButton to="/registro" size="sm" label="Começar grátis" trailing-icon="i-heroicons-arrow-right" />
        </div>
      </div>
    </header>

    <!-- ===== HERO ===== -->
    <section class="relative pt-20 pb-28 px-4 sm:px-6 overflow-hidden">
      <!-- Background blob -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-primary-100 via-secondary-50 to-transparent dark:from-primary-950/30 dark:via-secondary-950/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div class="relative max-w-4xl mx-auto text-center">
        <UBadge color="primary" variant="soft" label="✨ Novo — Templates 2025 disponíveis" class="mb-6" />
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.08]">
          O teu portfólio.<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Sem esforço.</span>
        </h1>
        <p class="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Cria um portfólio profissional em minutos, personaliza ao teu estilo e partilha com o mundo.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <UButton to="/registro" size="xl" label="Criar o meu portfólio" trailing-icon="i-heroicons-arrow-right" class="font-semibold" />
          <UButton variant="outline" color="neutral" size="xl" label="Ver exemplos" leading-icon="i-heroicons-eye" />
        </div>
        <p class="text-sm text-gray-400 mt-4">Grátis para sempre · Sem cartão de crédito</p>
      </div>

      <!-- Mock dashboard preview -->
      <div class="relative max-w-5xl mx-auto mt-16">
        <div class="rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-2xl overflow-hidden bg-white dark:bg-neutral-900">
          <!-- Fake browser bar -->
          <div class="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-400" />
              <div class="w-3 h-3 rounded-full bg-yellow-400" />
              <div class="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div class="flex-1 mx-4 bg-white dark:bg-neutral-700 rounded-lg h-6 flex items-center px-3">
              <span class="text-xs text-gray-400">portfoliosaas.com/ti</span>
            </div>
          </div>
          <!-- Fake portfolio preview -->
          <div class="bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800 p-8 min-h-48 flex items-center gap-8">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 flex-shrink-0" />
            <div class="flex-1">
              <div class="h-6 w-48 bg-gray-200 dark:bg-neutral-700 rounded-lg mb-3" />
              <div class="h-4 w-72 bg-gray-100 dark:bg-neutral-750 rounded-lg mb-2" />
              <div class="h-4 w-56 bg-gray-100 dark:bg-neutral-750 rounded-lg mb-5" />
              <div class="flex gap-2">
                <div class="h-8 w-24 bg-primary-500/20 rounded-lg" />
                <div class="h-8 w-24 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="py-14 border-y border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
      <div class="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <p class="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section id="features" class="py-24 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <UBadge color="primary" variant="soft" label="Funcionalidades" class="mb-4" />
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Tudo o que precisas, nada do que não precisas</h2>
          <p class="text-gray-500 max-w-lg mx-auto">Ferramentas poderosas que te deixam focar no que interessa — o teu trabalho.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="f in features"
            :key="f.title"
            class="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
              <UIcon :name="f.icon" class="text-primary-500 text-xl" />
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ f.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ f.desc }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- ===== PRICING ===== -->
    <section id="precos" class="py-24 px-4 sm:px-6 bg-gray-50/50 dark:bg-neutral-900/30">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <UBadge color="primary" variant="soft" label="Preços" class="mb-4" />
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Simples e transparente</h2>
          <p class="text-gray-500">Sem surpresas. Cancela quando quiseres.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6 items-start">
          <UCard
            v-for="plan in plans"
            :key="plan.name"
            :class="plan.featured ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/10 scale-105' : ''"
          >
            <div v-if="plan.featured" class="text-center mb-4">
              <UBadge color="primary" label="⭐ Mais popular" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ plan.name }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ plan.desc }}</p>
            <div class="flex items-end gap-1 mb-6">
              <span class="text-4xl font-extrabold text-gray-900 dark:text-white">{{ plan.price }}</span>
              <span class="text-gray-500 mb-1">{{ plan.period }}</span>
            </div>
            <UButton
              :color="plan.featured ? 'primary' : 'neutral'"
              :variant="plan.featured ? 'solid' : 'outline'"
              block
              to="/registro"
              label="Começar agora"
              class="mb-6"
            />
            <ul class="space-y-2">
              <li v-for="item in plan.items" :key="item" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-check" class="text-primary-500 flex-shrink-0" />
                {{ item }}
              </li>
            </ul>
          </UCard>
        </div>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section id="faq" class="py-24 px-4 sm:px-6">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-12">
          <UBadge color="primary" variant="soft" label="FAQ" class="mb-4" />
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white">Perguntas frequentes</h2>
        </div>
        <div class="space-y-3">
          <UCard
            v-for="(faq, i) in faqs"
            :key="i"
            class="cursor-pointer"
            @click="openFaq = openFaq === i ? null : i"
          >
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-900 dark:text-white">{{ faq.q }}</span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="text-gray-400 transition-transform duration-200 flex-shrink-0"
                :class="openFaq === i ? 'rotate-180' : ''"
              />
            </div>
            <Transition name="accordion">
              <p v-if="openFaq === i" class="mt-3 text-sm text-gray-500 leading-relaxed">{{ faq.a }}</p>
            </Transition>
          </UCard>
        </div>
      </div>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="py-24 px-4 sm:px-6">
      <div class="max-w-3xl mx-auto text-center">
        <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-500 p-12 text-white">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <h2 class="text-4xl font-extrabold mb-4 relative">Pronto para começar?</h2>
          <p class="text-white/80 mb-8 relative">Junta-te a mais de 12.000 profissionais que já criaram o seu portfólio.</p>
          <UButton
            to="/registro"
            size="xl"
            color="white"
            class="font-semibold relative"
            label="Criar o meu portfólio grátis"
            trailing-icon="i-heroicons-arrow-right"
          />
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="border-t border-gray-100 dark:border-neutral-800 py-10 px-4">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-primary-500 rounded-md flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="text-white text-xs" />
          </div>
          <span class="font-bold text-gray-700 dark:text-gray-300">PortfolioSaaS</span>
        </div>
        <p class="text-sm text-gray-400">© {{ new Date().getFullYear() }} PortfolioSaaS · Todos os direitos reservados</p>
        <div class="flex gap-4">
          <a href="#" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">Privacidade</a>
          <a href="#" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">Termos</a>
          <a href="#" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.accordion-enter-active, .accordion-leave-active {
  transition: opacity 0.2s, max-height 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}
.accordion-enter-from, .accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
