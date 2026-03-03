<script setup lang="ts">
definePageMeta({ layout: false })
useSeoMeta({ title: 'Editor — PortfolioSaaS' })

const toast = useToast()

// Estado do editor
const previewMode = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const activeSection = ref('sobre')
const isSaving = ref(false)
const isDirty = ref(false)

// Dados do portfólio
const portfolio = reactive({
  name: 'Portfólio Principal',
  template: 'moderno',
  primaryColor: '#3b82f6',
  sobre: {
    nome: 'João Silva',
    titulo: 'Designer UX & Developer',
    bio: 'Apaixonado por criar experiências digitais que encantam os utilizadores. 5+ anos de experiência.',
    avatar: '',
    location: 'Lisboa, Portugal',
    email: 'joao@exemplo.com',
    linkedin: '',
    github: 'github.com/joaosilva'
  },
  projetos: [
    { id: 1, titulo: 'App de Finanças', desc: 'UX Design para app iOS/Android', tags: ['UX', 'Mobile'], img: 'from-blue-400 to-blue-600' },
    { id: 2, titulo: 'Website Corporativo', desc: 'Design e desenvolvimento completo', tags: ['Web', 'React'], img: 'from-purple-400 to-purple-600' },
    { id: 3, titulo: 'Dashboard SaaS', desc: 'Interface para plataforma B2B', tags: ['UI', 'Figma'], img: 'from-green-400 to-green-600' }
  ],
  habilidades: ['UX Design', 'Figma', 'React', 'Vue.js', 'TypeScript', 'Node.js']
})

const sections = [
  { id: 'sobre', label: 'Sobre mim', icon: 'i-heroicons-user' },
  { id: 'projetos', label: 'Projetos', icon: 'i-heroicons-squares-2x2' },
  { id: 'habilidades', label: 'Habilidades', icon: 'i-heroicons-wrench-screwdriver' },
  { id: 'contato', label: 'Contato', icon: 'i-heroicons-envelope' },
  { id: 'aparencia', label: 'Aparência', icon: 'i-heroicons-paint-brush' }
]

const templates = [
  { id: 'moderno', label: 'Moderno', color: 'from-blue-400 to-blue-600' },
  { id: 'editorial', label: 'Editorial', color: 'from-gray-700 to-gray-900' },
  { id: 'minimalista', label: 'Minimalista', color: 'from-gray-300 to-gray-400' },
  { id: 'criativo', label: 'Criativo', color: 'from-purple-400 to-pink-500' }
]

const previewWidths = { desktop: 'w-full', tablet: 'max-w-[768px] mx-auto', mobile: 'max-w-[390px] mx-auto' }

async function save() {
  isSaving.value = true
  await new Promise(r => setTimeout(r, 1200))
  isSaving.value = false
  isDirty.value = false
  toast.add({ title: 'Guardado!', description: 'As tuas alterações foram guardadas.', color: 'success' })
}

function markDirty() { isDirty.value = true }
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-100 dark:bg-neutral-950 overflow-hidden">

    <!-- ===== TOPBAR ===== -->
    <header class="flex items-center justify-between px-4 h-14 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0 z-20">
      <div class="flex items-center gap-3">
        <UButton to="/dashboard" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" size="sm" />
        <div class="w-px h-5 bg-gray-200 dark:bg-neutral-700" />
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-sparkles" class="text-primary-500 text-sm" />
          <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ portfolio.name }}</span>
          <UBadge v-if="isDirty" color="warning" variant="soft" label="Não guardado" size="xs" />
        </div>
      </div>

      <!-- Preview mode toggles -->
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
        <UButton
          v-for="mode in (['desktop', 'tablet', 'mobile'] as const)"
          :key="mode"
          :icon="mode === 'desktop' ? 'i-heroicons-computer-desktop' : mode === 'tablet' ? 'i-heroicons-tablet-smartphone' : 'i-heroicons-device-phone-mobile'"
          :variant="previewMode === mode ? 'solid' : 'ghost'"
          :color="previewMode === mode ? 'primary' : 'neutral'"
          size="xs"
          @click="previewMode = mode"
        />
      </div>

      <div class="flex items-center gap-2">
        <UButton variant="outline" color="neutral" size="sm" icon="i-heroicons-arrow-top-right-on-square" label="Pré-visualizar" />
        <UButton
          size="sm"
          :loading="isSaving"
          :label="isSaving ? 'A guardar...' : 'Guardar'"
          leading-icon="i-heroicons-cloud-arrow-up"
          :color="isDirty ? 'primary' : 'neutral'"
          :variant="isDirty ? 'solid' : 'outline'"
          @click="save"
        />
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">

      <!-- ===== SIDEBAR ESQUERDA - Secções ===== -->
      <aside class="w-52 flex-shrink-0 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col">
        <div class="p-3 border-b border-gray-100 dark:border-neutral-800">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Secções</p>
        </div>
        <nav class="p-2 space-y-0.5 flex-1">
          <button
            v-for="s in sections"
            :key="s.id"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
            :class="activeSection === s.id
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'"
            @click="activeSection = s.id"
          >
            <UIcon :name="s.icon" class="text-base flex-shrink-0" />
            {{ s.label }}
          </button>
        </nav>
      </aside>

      <!-- ===== PAINEL CENTRAL - Formulário ===== -->
      <div class="w-80 flex-shrink-0 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 overflow-y-auto">
        <div class="p-5 space-y-5">

          <!-- SOBRE -->
          <div v-if="activeSection === 'sobre'" class="space-y-4">
            <h3 class="font-bold text-gray-900 dark:text-white">Sobre mim</h3>
            <UFormField label="Nome completo">
              <UInput v-model="portfolio.sobre.nome" placeholder="O teu nome" @input="markDirty" />
            </UFormField>
            <UFormField label="Título profissional">
              <UInput v-model="portfolio.sobre.titulo" placeholder="Ex: Designer UX" @input="markDirty" />
            </UFormField>
            <UFormField label="Biografia">
              <UTextarea v-model="portfolio.sobre.bio" :rows="4" placeholder="Conta a tua história..." @input="markDirty" />
            </UFormField>
            <UFormField label="Localização">
              <UInput v-model="portfolio.sobre.location" placeholder="Lisboa, Portugal" @input="markDirty" />
            </UFormField>
            <UFormField label="Email de contacto">
              <UInput v-model="portfolio.sobre.email" type="email" @input="markDirty" />
            </UFormField>
            <UFormField label="GitHub">
              <UInput v-model="portfolio.sobre.github" placeholder="github.com/utilizador" @input="markDirty" />
            </UFormField>
          </div>

          <!-- PROJETOS -->
          <div v-else-if="activeSection === 'projetos'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-gray-900 dark:text-white">Projetos</h3>
              <UButton size="xs" variant="soft" label="Adicionar" leading-icon="i-heroicons-plus" @click="markDirty" />
            </div>
            <div v-for="(proj, i) in portfolio.projetos" :key="proj.id" class="border border-gray-200 dark:border-neutral-700 rounded-xl p-3 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Projeto {{ i + 1 }}</span>
                <UButton variant="ghost" color="error" icon="i-heroicons-trash" size="xs" />
              </div>
              <UFormField label="Título">
                <UInput v-model="proj.titulo" size="sm" @input="markDirty" />
              </UFormField>
              <UFormField label="Descrição">
                <UInput v-model="proj.desc" size="sm" @input="markDirty" />
              </UFormField>
            </div>
          </div>

          <!-- HABILIDADES -->
          <div v-else-if="activeSection === 'habilidades'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-gray-900 dark:text-white">Habilidades</h3>
              <UButton size="xs" variant="soft" label="Adicionar" leading-icon="i-heroicons-plus" />
            </div>
            <div class="flex flex-wrap gap-2">
              <div v-for="(skill, i) in portfolio.habilidades" :key="i" class="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 rounded-full px-3 py-1">
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ skill }}</span>
                <UButton variant="ghost" color="neutral" icon="i-heroicons-x-mark" size="2xs" class="ml-0.5" @click="portfolio.habilidades.splice(i, 1); markDirty()" />
              </div>
            </div>
          </div>

          <!-- APARÊNCIA -->
          <div v-else-if="activeSection === 'aparencia'" class="space-y-5">
            <h3 class="font-bold text-gray-900 dark:text-white">Aparência</h3>
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Template</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="t in templates"
                  :key="t.id"
                  class="rounded-xl overflow-hidden border-2 transition-all"
                  :class="portfolio.template === t.id ? 'border-primary-500' : 'border-gray-200 dark:border-neutral-700'"
                  @click="portfolio.template = t.id; markDirty()"
                >
                  <div :class="`h-16 bg-gradient-to-br ${t.color}`" />
                  <div class="px-2 py-1.5 bg-white dark:bg-neutral-800">
                    <p class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ t.label }}</p>
                  </div>
                </button>
              </div>
            </div>
            <UFormField label="Cor principal">
              <div class="flex items-center gap-2">
                <input type="color" v-model="portfolio.primaryColor" class="w-8 h-8 rounded cursor-pointer border-0" @input="markDirty" />
                <UInput v-model="portfolio.primaryColor" size="sm" class="font-mono flex-1" @input="markDirty" />
              </div>
            </UFormField>
          </div>

          <!-- CONTATO -->
          <div v-else-if="activeSection === 'contato'" class="space-y-4">
            <h3 class="font-bold text-gray-900 dark:text-white">Contato</h3>
            <UFormField label="Email">
              <UInput v-model="portfolio.sobre.email" type="email" @input="markDirty" />
            </UFormField>
            <UFormField label="LinkedIn">
              <UInput v-model="portfolio.sobre.linkedin" placeholder="linkedin.com/in/utilizador" @input="markDirty" />
            </UFormField>
            <UFormField label="GitHub">
              <UInput v-model="portfolio.sobre.github" placeholder="github.com/utilizador" @input="markDirty" />
            </UFormField>
            <UDivider />
            <p class="text-xs text-gray-400">Activa ou desactiva formas de contato visíveis no teu portfólio.</p>
          </div>

        </div>
      </div>

      <!-- ===== PREVIEW ===== -->
      <div class="flex-1 bg-gray-100 dark:bg-neutral-950 overflow-auto p-6">
        <div :class="['transition-all duration-300', previewWidths[previewMode]]">
          <div class="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 min-h-[600px]">
            <!-- Portfolio preview -->
            <div class="bg-gradient-to-br from-primary-600 to-secondary-500 px-8 py-16 text-white text-center">
              <div class="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                {{ portfolio.sobre.nome.split(' ').map(n => n[0]).join('').slice(0,2) }}
              </div>
              <h1 class="text-2xl font-extrabold mb-1">{{ portfolio.sobre.nome }}</h1>
              <p class="text-white/80 text-sm mb-2">{{ portfolio.sobre.titulo }}</p>
              <p class="text-white/60 text-xs flex items-center justify-center gap-1">
                <UIcon name="i-heroicons-map-pin" />
                {{ portfolio.sobre.location }}
              </p>
            </div>

            <div class="p-8">
              <h2 class="font-bold text-gray-900 dark:text-white mb-2">Sobre mim</h2>
              <p class="text-gray-500 text-sm mb-8 leading-relaxed">{{ portfolio.sobre.bio }}</p>

              <h2 class="font-bold text-gray-900 dark:text-white mb-4">Projetos</h2>
              <div class="grid gap-4" :class="previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'">
                <div v-for="p in portfolio.projetos" :key="p.id" class="rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800">
                  <div :class="`h-24 bg-gradient-to-br ${p.img}`" />
                  <div class="p-3">
                    <h3 class="font-semibold text-gray-900 dark:text-white text-sm">{{ p.titulo }}</h3>
                    <p class="text-xs text-gray-500 mt-0.5">{{ p.desc }}</p>
                    <div class="flex gap-1 mt-2 flex-wrap">
                      <span v-for="tag in p.tags" :key="tag" class="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 class="font-bold text-gray-900 dark:text-white mb-3 mt-8">Habilidades</h2>
              <div class="flex flex-wrap gap-2">
                <span v-for="s in portfolio.habilidades" :key="s" class="text-sm bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">{{ s }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
