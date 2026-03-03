<script setup lang="ts">
// 1. SEO Otimizado para o SaaS
useSeoMeta({
  title: 'Crie o seu Portfólio Profissional — MeuSaaS',
  description: 'A plataforma definitiva para designers, developers e criativos mostrarem o seu trabalho ao mundo com temas premium e edição visual.'
})

// 2. Funcionalidades do SaaS
const funcionalidades = [
  { 
    icon: 'i-heroicons-paint-brush', 
    title: 'Edição Visual (WYSIWYG)', 
    description: 'Vê as alterações em tempo real. Muda cores, fontes e layouts sem tocar numa única linha de código.' 
  },
  { 
    icon: 'i-heroicons-sparkles', 
    title: 'Dezenas de Temas Premium', 
    description: 'Do "Cyber Lime" ao "Rose Wine", escolhe templates criados por especialistas em UX/UI.' 
  },
  { 
    icon: 'i-heroicons-device-phone-mobile', 
    title: '100% Responsivo', 
    description: 'O teu portfólio adapta-se perfeitamente a telemóveis, tablets e monitores ultrawide.' 
  },
  { 
    icon: 'i-heroicons-chart-bar', 
    title: 'Analytics Integrado', 
    description: 'Sabe exatamente quantas pessoas visitam o teu site e quais os projetos que mais chamam a atenção.' 
  }
]

// 3. Vitrine de Temas (Baseado no teu useThemePresets.ts)
const temasDestaque = [
  { nome: 'Cyber Lime', desc: 'Alta performance e visual industrial.', cores: 'from-green-400 to-lime-500' },
  { nome: 'Rose Wine', desc: 'Elegante, premium e sofisticado.', cores: 'from-rose-500 to-pink-700' },
  { nome: 'Neon Spectrum', desc: 'Vibrante e com estilo Cyberpunk.', cores: 'from-cyan-400 to-blue-600' },
  { nome: 'UX Mastery', desc: 'Sóbrio, profissional e tecnológico.', cores: 'from-blue-700 to-indigo-900' }
]

// 4. Planos e Preços
const planos = [
  {
    title: 'Gratuito',
    description: 'Perfeito para começares a tua presença online.',
    price: '0€',
    billingPeriod: '/mês',
    features: ['1 Portfólio', '3 Temas Base (Minimalistas)', 'Subdomínio gratuito', 'Suporte da comunidade'],
    button: { label: 'Começar Grátis', to: '/login', color: 'gray', variant: 'outline' }
  },
  {
    title: 'Pro',
    description: 'Para profissionais que exigem destaque.',
    price: '9€',
    billingPeriod: '/mês',
    highlight: true, // Nuxt UI destaca este plano automaticamente
    features: ['Portfólios ilimitados', 'Acesso a TODOS os Temas Premium', 'Domínio Personalizado', 'Analytics Avançado', 'Suporte Prioritário'],
    button: { label: 'Assinar Plano Pro', to: '/login', color: 'primary' }
  }
]
</script>

<template>
  <div>
    
    <UPageHero
      title="O teu portfólio online em minutos, não em semanas."
      description="Destaca-te no mercado de trabalho. Escolhe um tema premium, personaliza-o com o nosso editor visual e publica o teu portfólio hoje mesmo."
      align="center"
      class="pt-24 pb-16 relative z-10"
    >
      <template #links>
        <UButton label="Criar Portfólio Grátis" to="/login" size="xl" color="primary" icon="i-heroicons-rocket-launch" />
        <UButton label="Ver Temas Disponíveis" to="#temas" size="xl" variant="ghost" color="gray" icon="i-heroicons-swatch" />
      </template>

      <template #bottom>
        <div class="mt-12 max-w-5xl mx-auto surface-panel p-2 rounded-2xl overflow-hidden reveal reveal--visible">
          <div class="aspect-video bg-gray-900 rounded-xl overflow-hidden relative flex items-center justify-center">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-secondary-900/40" />
            <UIcon name="i-heroicons-play-circle" class="text-6xl text-white/80 hover:text-white transition-colors cursor-pointer relative z-10" />
            <p class="absolute bottom-4 text-white/60 text-sm font-medium">Clica para ver como funciona o editor</p>
          </div>
        </div>
      </template>
    </UPageHero>

    <UPageBody>
      
      <UPageSection 
        id="temas"
        title="Design de classe mundial à distância de um clique" 
        description="Esquece os templates aborrecidos. O nosso sistema de cores dinâmico adapta-se à tua identidade visual instantaneamente."
      >
        <UPageGrid>
          <UCard v-for="(tema, index) in temasDestaque" :key="index" class="group overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all">
            <div :class="`h-40 bg-gradient-to-br ${tema.cores} -m-4 mb-4 sm:-m-5 sm:mb-5 relative`">
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UButton color="white" variant="solid" label="Pré-visualizar" size="sm" />
              </div>
            </div>
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ tema.nome }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ tema.desc }}</p>
          </UCard>
        </UPageGrid>

        <div class="text-center mt-10">
          <UButton label="Explorar todos os 10+ temas" variant="soft" color="primary" trailing-icon="i-heroicons-arrow-right" />
        </div>
      </UPageSection>

      <UPageSection 
        title="Tudo o que precisas para crescer a tua carreira" 
        description="Desenvolvemos as ferramentas perfeitas para que te possas focar apenas em mostrar o teu melhor trabalho."
        class="bg-gray-50/50 dark:bg-neutral-900/20 rounded-3xl my-12"
      >
        <UPageGrid>
          <UPageFeature
            v-for="(item, index) in funcionalidades"
            :key="index"
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
          />
        </UPageGrid>
      </UPageSection>

      <UPageSection 
        title="Planos transparentes e escaláveis" 
        description="Começa grátis ou faz o upgrade quando quiseres mais poder."
        class="pb-24"
      >
        <UPricingGrid>
          <UPricingPlan
            v-for="(plano, index) in planos"
            :key="index"
            :title="plano.title"
            :description="plano.description"
            :price="plano.price"
            :billing-period="plano.billingPeriod"
            :features="plano.features"
            :button="plano.button"
            :highlight="plano.highlight"
          />
        </UPricingGrid>
      </UPageSection>

      <div class="bg-primary-500 rounded-3xl p-12 text-center text-white mb-20 relative overflow-hidden">
        <div class="absolute inset-0 bg-white/10 blur-3xl w-64 h-64 mx-auto rounded-full" />
        <h2 class="text-3xl font-bold relative z-10 mb-4">Pronto para impressionar o mundo?</h2>
        <p class="text-white/90 mb-8 relative z-10">Cria a tua conta hoje, é 100% grátis.</p>
        <UButton color="white" size="lg" label="Começar agora mesmo" class="text-primary-600 relative z-10" />
      </div>

    </UPageBody>
  </div>
</template>

<style scoped>
/* Aproveitamos as tuas classes animadas no Herói */
.reveal {
  animation: revealUp 0.8s ease-out forwards;
}
@keyframes revealUp {
  from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
</style>