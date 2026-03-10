<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfile } from '~/composables/usePerfilState'
import { useDashboardFormUi } from '~/composables/useDashboardFormUi'
import DashboardFloatingInput from '~/components/dashboard/profile/DashboardFloatingInput.vue'

const props = defineProps<{ model: UserProfile }>()
const emit = defineEmits<{ dirty: [] }>()

const { textareaUi } = useDashboardFormUi()

const mainSkillsText = computed({
  get() {
    return props.model.mainSkills.join(', ')
  },
  set(value: string) {
    props.model.mainSkills = String(value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12)

    markDirty()
  }
})

function markDirty() {
  emit('dirty')
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h2 class="text-base font-semibold">Dados públicos e profissionais</h2>
      <p class="text-sm text-muted">
        Estes campos alimentam o portfólio público, a base profissional e o fallback do editor.
      </p>
    </div>

    <UAlert
      class="dashboard-note-alert"
      icon="i-lucide-database-zap"
      title="Conectado ao backend"
      description="Esta aba agora salva em profiles e professional_data. Aqui ficam os dados-base do seu portfólio."
      color="neutral"
      variant="outline"
    />

    <div class="space-y-4">
      <div class="space-y-1">
        <p class="font-medium">Base pública</p>
        <p class="text-sm text-muted">
          Nome, headline, bio e contatos públicos exibidos no portfólio.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <DashboardFloatingInput
          v-model="props.model.publicName"
          label="Nome público"
          icon="i-lucide-user-round"
          autocomplete="name"
          :maxlength="120"
          @update:model-value="markDirty"
        />

        <DashboardFloatingInput
          v-model="props.model.location"
          label="Localização"
          icon="i-lucide-map-pin"
          autocomplete="address-level2"
          :maxlength="120"
          @update:model-value="markDirty"
        />

        <div class="sm:col-span-2">
          <DashboardFloatingInput
            v-model="props.model.headline"
            label="Headline"
            icon="i-lucide-briefcase-business"
            autocomplete="organization-title"
            :maxlength="180"
            @update:model-value="markDirty"
          />
        </div>

        <DashboardFloatingInput
          v-model="props.model.publicEmail"
          type="email"
          label="E-mail público"
          icon="i-lucide-mail"
          autocomplete="email"
          :maxlength="160"
          @update:model-value="markDirty"
        />

        <DashboardFloatingInput
          v-model="props.model.website"
          label="Website"
          icon="i-lucide-globe"
          autocomplete="url"
          :maxlength="180"
          @update:model-value="markDirty"
        />

        <UFormField label="Bio" class="sm:col-span-2">
          <UTextarea
            v-model="props.model.bio"
            :rows="5"
            class="w-full"
            :maxlength="600"
            :ui="textareaUi"
            @update:model-value="markDirty"
          />
        </UFormField>
      </div>
    </div>

    <USeparator />

    <div class="space-y-4">
      <div class="space-y-1">
        <p class="font-medium">Base profissional</p>
        <p class="text-sm text-muted">
          Dados profissionais centrais usados pelo onboarding, editor e rota pública.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <DashboardFloatingInput
          v-model="props.model.roleTitle"
          label="Cargo principal"
          icon="i-lucide-badge-check"
          :maxlength="120"
          @update:model-value="markDirty"
        />

        <DashboardFloatingInput
          v-model="props.model.workArea"
          label="Área de atuação"
          icon="i-lucide-briefcase"
          :maxlength="120"
          @update:model-value="markDirty"
        />

        <div class="sm:col-span-2">
          <DashboardFloatingInput
            v-model="props.model.experienceLevel"
            label="Nível de experiência"
            icon="i-lucide-chart-column"
            :maxlength="120"
            @update:model-value="markDirty"
          />
        </div>

        <UFormField label="Resumo profissional" class="sm:col-span-2">
          <UTextarea
            v-model="props.model.professionalSummary"
            :rows="5"
            class="w-full"
            :maxlength="900"
            :ui="textareaUi"
            @update:model-value="markDirty"
          />
        </UFormField>

        <UFormField
          label="Habilidades principais"
          description="Separe por vírgula. Exemplo: Nuxt, TypeScript, Supabase"
          class="sm:col-span-2"
        >
          <UTextarea
            v-model="mainSkillsText"
            :rows="3"
            class="w-full"
            :maxlength="400"
            :ui="textareaUi"
          />
        </UFormField>
      </div>
    </div>

    <USeparator />

    <div class="space-y-4">
      <div class="space-y-1">
        <p class="font-medium">Links e contato</p>
        <p class="text-sm text-muted">
          Canais públicos usados pela rota publicada e por futuras integrações do editor.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <DashboardFloatingInput
          v-model="props.model.linkedin"
          label="LinkedIn"
          icon="i-simple-icons-linkedin"
          autocomplete="url"
          :maxlength="180"
          @update:model-value="markDirty"
        />

        <DashboardFloatingInput
          v-model="props.model.github"
          label="GitHub"
          icon="i-simple-icons-github"
          autocomplete="url"
          :maxlength="180"
          @update:model-value="markDirty"
        />

        <DashboardFloatingInput
          v-model="props.model.whatsapp"
          label="WhatsApp"
          icon="i-simple-icons-whatsapp"
          autocomplete="tel"
          :maxlength="40"
          @update:model-value="markDirty"
        />

        <DashboardFloatingInput
          v-model="props.model.website"
          label="Link principal"
          icon="i-lucide-link"
          autocomplete="url"
          :maxlength="180"
          @update:model-value="markDirty"
        />
      </div>
    </div>
  </div>
</template>