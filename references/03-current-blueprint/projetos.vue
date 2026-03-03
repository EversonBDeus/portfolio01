<script setup lang="ts">
// Importamos o teu componente de acordeão (ajusta o caminho se ele estiver noutra pasta)
import AboutAccordion from '~/components/AboutAccordion.vue'

// Aqui criamos um objeto simples com os teus dados.
// Mais tarde, podemos mover isto para o teu ficheiro `~/data/profile.ts`
const profileData = {
  name: 'Everson Deus',
  role: 'Desenvolvedor Full Stack & UX/UI',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4', // Troca pelo link da tua foto
  bio: 'Apaixonado por criar interfaces incríveis e sistemas robustos usando Nuxt e Vue 3.'
}
</script>

<template>
  <section class="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
    
    <UCard class="w-full max-w-md backdrop-blur-sm surface-panel">
      
      <div class="flex flex-col items-center text-center space-y-4 mb-6">
        
        <UAvatar
          :src="profileData.avatar"
          :alt="profileData.name"
          size="3xl"
          class="ring-4 ring-primary/20"
        />
        
        <div>
          <h1 class="text-2xl font-bold text-primary">{{ profileData.name }}</h1>
          <p class="text-sm text-muted font-medium mt-1">{{ profileData.role }}</p>
        </div>

        <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {{ profileData.bio }}
        </p>
      </div>

      <div class="flex justify-center gap-3 mb-8">
        <UButton
          icon="i-lucide-github"
          color="neutral"
          variant="soft"
          target="_blank"
          to="https://github.com/teu-usuario"
        />
        <UButton
          icon="i-lucide-linkedin"
          color="neutral"
          variant="soft"
          target="_blank"
          to="https://linkedin.com/in/teu-usuario"
        />
        <UButton
          icon="i-lucide-mail"
          color="primary"
          variant="solid"
          to="mailto:teu-email@exemplo.com"
          label="Contactar"
        />
      </div>

      <hr class="border-default/20 mb-6" />

      <AboutAccordion />
      
    </UCard>
  </section>
</template>