<script setup lang="ts">
// pages/dashboard/index.vue

// Definimos o título da página para fins de SEO e aba do navegador
useSeoMeta({
  title: 'Meu Painel - Gestão de Layout'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
    
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Layout</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Gerencie a aparência do seu portfólio.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 space-y-6">
        
        <UCard>
          <div class="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-t-md mb-4 flex items-center justify-center overflow-hidden">
            <span class="text-gray-400 font-medium">Preview do Tema: Toluca</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-semibold">Toluca</h2>
                <UBadge color="success" variant="subtle">Layout atual</UBadge>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <UButton color="gray" variant="outline" icon="i-heroicons-pencil-square">
                Editar layout atual
              </UButton>
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-lg font-semibold">Baires</h2>
                <UBadge color="warning" variant="subtle">Rascunho</UBadge>
              </div>
              <p class="text-sm text-gray-500 mt-1">Última edição: 19 mai</p>
            </div>
            
            <div class="flex items-center gap-2">
              <UButton color="gray" variant="outline">
                Editar rascunho
              </UButton>
              <UButton color="primary" variant="solid" icon="i-heroicons-paper-airplane">
                Publicar
              </UButton>
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
            </div>
          </div>
        </UCard>

        <UCard class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border-none">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <UIcon name="i-heroicons-swatch" class="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold text-lg">Mais de 60 temas disponíveis</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Encontre o design perfeito para o seu portfólio.</p>
              </div>
            </div>
            <UButton color="primary" variant="outline">
              Ver outros temas
            </UButton>
          </div>
        </UCard>

        <div class="flex justify-center mt-4">
          <UButton color="gray" variant="link" icon="i-heroicons-question-mark-circle">
            Mais sobre layout
          </UButton>
        </div>

      </div>

      <div class="space-y-6">
        
        <UCard>
          <template #header>
            <h3 class="font-semibold">Logotipo da sua marca</h3>
          </template>
          
          <div class="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col items-center justify-center mb-4 border border-dashed border-gray-300 dark:border-gray-700">
            <UIcon name="i-fluent-emoji-high-contrast-octopus" class="w-10 h-10 text-yellow-500 mb-2" />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Kraken Store</span>
          </div>
          
          <template #footer>
            <UButton block color="gray" variant="outline" icon="i-heroicons-photo">
              Editar logotipo
            </UButton>
          </template>
        </UCard>

        <UCard>
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-video-camera" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="font-semibold text-blue-600 dark:text-blue-400">iShorts - Video Commerce</h3>
              <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                Adicione vídeos curtos interativos ao seu portfólio para aumentar o engajamento.
              </p>
            </div>
          </div>
          
          <template #footer>
            <div class="flex items-center justify-between">
              <UButton color="gray" variant="link" :padded="false" class="text-xs">
                Mais apps de marketing
              </UButton>
              <UButton color="gray" variant="solid" size="sm">
                Instalar
              </UButton>
            </div>
          </template>
        </UCard>

      </div>

    </div>
  </div>
</template>