<script setup lang="ts">
// Aqui definimos os dados estáticos da página para manter o template limpo.
const funcionalidades = [
  { 
    icon: 'i-heroicons-paint-brush', 
    title: 'Design Customizável', 
    description: 'Edita cores, tipografia e secções com o nosso editor visual de arrastar e soltar.' 
  },
  { 
    icon: 'i-heroicons-device-phone-mobile', 
    title: '100% Responsivo', 
    description: 'O teu portfólio vai ficar perfeito num telemóvel, tablet ou computador.' 
  },
  { 
    icon: 'i-heroicons-chart-bar', 
    title: 'Estatísticas Detalhadas', 
    description: 'Descobre quantas pessoas visitam o teu site e quais os projetos mais vistos.' 
  }
]

const planos = [
  {
    title: 'Gratuito',
    description: 'Perfeito para começar a mostrar o teu trabalho.',
    price: '0€',
    billingPeriod: '/mês',
    features: ['1 Portfólio', '3 Temas Base', 'Subdomínio gratuito', 'Suporte da comunidade'],
    button: { label: 'Começar Grátis', to: '/login', color: 'gray' }
  },
  {
    title: 'Pro',
    description: 'Para profissionais que querem destacar-se.',
    price: '9€',
    billingPeriod: '/mês',
    highlight: true, // Destaca este plano visualmente
    features: ['Portfólios ilimitados', 'Acesso a +60 Temas Premium', 'Domínio Personalizado', 'Analytics Avançado', 'Suporte Prioritário'],
    button: { label: 'Assinar Pro', to: '/login', color: 'primary' }
  }
]
</script>

<template>
  <div class="app-bg bg-theme min-h-screen">
    
    <UPageBody>
      
      <UPageHero
        title="Cria o teu Portfólio Profissional em Minutos"
        description="Mostra o teu trabalho ao mundo com temas incríveis, fáceis de editar e otimizados para converter visitantes em clientes. Sem precisares de programar."
        align="center"
        class="pt-20 pb-12"
      >
        <template #links>
          <UButton label="Criar Conta Grátis" to="/login" size="xl" color="primary" icon="i-heroicons-rocket-launch" />
          <UButton label="Explorar Temas" to="#temas" size="xl" variant="outline" color="gray" />
        </template>
      </UPageHero>

      <UPageSection 
        title="Tudo o que precisas num só lugar" 
        description="O nosso SaaS oferece as melhores ferramentas para impulsionares a tua carreira."
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
        title="Planos Simples e Transparentes" 
        description="Escolhe o plano ideal para a tua carreira. Podes alterar a qualquer momento."
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

    </UPageBody>
  </div>
</template>