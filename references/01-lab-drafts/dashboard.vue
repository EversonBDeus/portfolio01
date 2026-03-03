<script setup lang="ts">
// Aqui vamos gerir a lógica, como abrir menus ou clicar em botões.
// Por agora, preparamos uma função simples de exemplo.
function editarLayout(nome: string) {
  console.log(`A redirecionar para o editor do layout: ${nome}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f9f9f9] p-6 text-slate-800 dark:bg-neutral-950 dark:text-slate-200">
    
    <header class="mb-8">
      <h1 class="text-3xl font-bold">Layout</h1>
      <p class="text-gray-500 dark:text-gray-400">Gere o visual do teu portfólio</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <div class="lg:col-span-8 flex flex-col gap-6">
        
        <UCard class="rounded-lg shadow-sm">
          <div class="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-md mb-4 flex items-center justify-center">
            <span class="text-gray-400">[Imagem do Tema Toluca]</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold flex items-center gap-2">
                Toluca
                <UBadge color="success" variant="subtle">Layout atual</UBadge>
              </h2>
            </div>
            <div class="flex gap-2">
              <UButton variant="outline" label="Editar layout atual" @click="editarLayout('Toluca')" />
              <UButton variant="ghost" icon="i-heroicons-ellipsis-vertical" color="gray" />
            </div>
          </div>
        </UCard>

        <UCard class="rounded-lg shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold flex items-center gap-2">
                Baires
                <UBadge color="warning" variant="subtle">Rascunho</UBadge>
              </h3>
              <p class="text-sm text-gray-500 mt-1">Última edição: 19 mai</p>
            </div>
            <div class="flex items-center gap-2">
              <UButton variant="outline" label="Editar rascunho" @click="editarLayout('Baires')" />
              <UButton color="primary" label="Publicar" />
              <UButton variant="ghost" icon="i-heroicons-ellipsis-vertical" color="gray" />
            </div>
          </div>
        </UCard>

        <UCard class="rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-none">
          <div class="flex items-center justify-between p-4">
            <div>
              <h3 class="font-bold text-lg mb-1">Mais de 60 temas disponíveis</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Descobre o design perfeito para o teu portfólio.</p>
            </div>
            <UButton variant="outline" color="primary" label="Ver outros temas" />
          </div>
        </UCard>

        <div class="text-center mt-4">
          <ULink to="#" class="text-sm text-gray-500 hover:text-primary flex items-center justify-center gap-1">
            <UIcon name="i-heroicons-question-mark-circle" />
            Mais sobre layout
          </ULink>
        </div>

      </div>

      <div class="lg:col-span-4 flex flex-col gap-6">
        
        <UCard class="rounded-lg shadow-sm">
          <h3 class="font-bold mb-4">Logotipo da sua marca</h3>
          <div class="bg-gray-100 dark:bg-gray-800 h-32 rounded flex items-center justify-center mb-4 border border-dashed border-gray-300 dark:border-gray-700">
            <span class="text-gray-400">[Kraken Store]</span>
          </div>
          <UButton variant="outline" block label="Editar logotipo" />
        </UCard>

        <UCard class="rounded-lg shadow-sm">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-video-camera" class="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h4 class="font-bold text-primary mb-1">iShorts - Video Commerce</h4>
              <p class="text-sm text-gray-500 mb-3 leading-relaxed">Adicione vídeos curtos ao seu portfólio para aumentar o engajamento.</p>
              <div class="flex gap-3 text-sm">
                <ULink to="#" class="text-primary font-medium hover:underline">Instalar</ULink>
                <ULink to="#" class="text-gray-500 hover:underline">Mais apps</ULink>
              </div>
            </div>
          </div>
        </UCard>

      </div>
    </div>
  </div>
</template>