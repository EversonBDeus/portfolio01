<script setup lang="ts">
// pages/index.vue

// Definimos o layout padrão (que tem o fundo bonito e animações que você já criou)
definePageMeta({
  layout: 'default'
})

const plans = [
  {
    title: 'Iniciante',
    description: 'Perfeito para quem está começando agora.',
    price: 'Grátis',
    button: { label: 'Começar agora', to: '/auth/register' },
    features: ['1 Tema padrão', 'Domínio seu-nome.saas.com', 'Até 10 projetos', 'Suporte via chat']
  },
  {
    title: 'Profissional',
    description: 'Para quem quer se destacar no mercado.',
    price: 'R$ 29,90',
    cycle: '/mês',
    highlight: true, // Destaca o card como na Nuvemshop
    button: { label: 'Escolher Pro', to: '/auth/register' },
    features: ['Todos os temas premium', 'Domínio personalizado (.com)', 'Projetos ilimitados', 'Estatísticas de acesso', 'Sem selo do SaaS']
  },
  {
    title: 'Enterprise',
    description: 'Soluções personalizadas para agências.',
    price: 'Sob consulta',
    button: { label: 'Falar com consultor', color: 'gray' },
    features: ['Múltiplos usuários', 'Temas exclusivos', 'Suporte VIP 24h', 'API de integração']
  }
]
</script>

<template>
  <div>
    <UPageHero
      title="Crie seu portfólio profissional e conquiste mais clientes"
      description="Escolha um tema, personalize do seu jeito e mostre seu trabalho para o mundo. A plataforma completa para freelancers e criativos."
      align="center"
    >
      <template #links>
        <UButton size="xl" color="primary" to="/auth/register">
          Criar meu portfólio grátis
        </UButton>
        <UButton size="xl" color="gray" variant="ghost" trailing-icon="i-heroicons-play">
          Ver exemplos
        </UButton>
      </template>

      <div class="mt-12 relative flex justify-center">
        <div class="relative rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-950 p-2 max-w-4xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
            alt="Preview do Editor" 
            class="rounded-lg opacity-90"
          />
        </div>
      </div>
    </UPageHero>

    <UPageSection title="Tudo o que você precisa para brilhar">
      <UPageGrid>
        <UPageFeature
          icon="i-heroicons-swatch"
          title="Temas Incríveis"
          description="Dezenas de layouts otimizados para conversão e leitura em qualquer dispositivo."
        />
        <UPageFeature
          icon="i-heroicons-bolt"
          title="Super Rápido"
          description="Seu portfólio carrega instantaneamente, garantindo a melhor experiência para o seu cliente."
        />
        <UPageFeature
          icon="i-heroicons-chart-bar"
          title="Análise de Dados"
          description="Saiba quem visitou seu site e quais projetos geraram mais interesse."
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection 
      id="precos"
      title="Planos que crescem com você"
      description="Comece grátis e mude para o Pro quando precisar de recursos avançados."
    >
      <UPricingPlans :plans="plans" />
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Pronto para transformar sua carreira?"
        description="Junte-se a mais de 1.000 profissionais que já usam nossa plataforma."
        :links="[{ label: 'Começar Agora', color: 'primary', size: 'lg', to: '/auth/register' }]"
        align="center"
        class="bg-primary-50 dark:bg-primary-950/20 rounded-3xl p-12 border border-primary-100 dark:border-primary-900"
      />
    </UPageSection>

    <UPageSection title="Profissionais de grandes empresas já usam">
       <UPageLogos
        :logos="[
          { label: 'Google', icon: 'i-simple-icons-google' },
          { label: 'Netflix', icon: 'i-simple-icons-netflix' },
          { label: 'Airbnb', icon: 'i-simple-icons-airbnb' },
          { label: 'Stripe', icon: 'i-simple-icons-stripe' }
        ]"
      />
    </UPageSection>
  </div>
</template>