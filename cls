warning: in the working copy of 'app/components/tabs/TabCertificates.vue', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'app/components/tabs/TabEducation.vue', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'app/components/tabs/TabExperience.vue', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'app/components/tabs/TabProjects.vue', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'app/components/tabs/TabSkills.vue', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'app/data/education.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'app/data/experience.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'app/pages/index.vue', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/app/components/tabs/TabCertificates.vue b/app/components/tabs/TabCertificates.vue[m
[1mindex c579b23..2ca84d8 100644[m
[1m--- a/app/components/tabs/TabCertificates.vue[m
[1m+++ b/app/components/tabs/TabCertificates.vue[m
[36m@@ -2,6 +2,7 @@[m
 import { computed, ref } from 'vue'[m
 import { usePortfolioData } from '~/composables/usePortfolioData'[m
 import type { Certificate } from '~/data/certificates'[m
[32m+[m
 import CertificateCard from '~/components/certificates/CertificateCard.vue'[m
 import CertificateSlideover from '~/components/certificates/CertificateSlideover.vue'[m
 import { formatYm } from '~/utils/format'[m
[36m@@ -11,8 +12,8 @@[m [mconst certificates = data.certificates[m
 [m
 const viewMode = ref<'grid' | 'timeline'>('grid')[m
 [m
[31m-const selected = ref<Certificate | null>(null)[m
 const isOpen = ref(false)[m
[32m+[m[32mconst selected = ref<Certificate | null>(null)[m
 [m
 function openCertificate(item: Certificate) {[m
   selected.value = item[m
[36m@@ -30,7 +31,7 @@[m [mconst timelineItems = computed(() => {[m
 [m
 <template>[m
   <div class="pt-4 space-y-4">[m
[31m-    <div class="flex items-center justify-between gap-3">[m
[32m+[m[32m    <div class="flex items-start justify-between gap-3 flex-wrap">[m
       <div class="text-left">[m
         <h2 class="text-lg font-semibold">Certificados</h2>[m
         <p class="text-sm text-muted">[m
[36m@@ -51,13 +52,16 @@[m [mconst timelineItems = computed(() => {[m
     <UEmpty[m
       v-if="certificates.length === 0"[m
       icon="i-lucide-award"[m
[31m-      title="Nenhum certificado cadastrado"[m
[31m-      description="Adicione certificados em data/certificates.ts."[m
[32m+[m[32m      title="Nenhum certificado"[m
[32m+[m[32m      description="Adicione certificados em app/data/certificates.ts."[m
     />[m
 [m
     <div v-else>[m
[31m-      <div v-if="viewMode === 'grid'" v-reveal class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">[m
[31m-        <!-- ✅ CertificateCard espera :item -->[m
[32m+[m[32m      <div v-if="viewMode === 'timeline'" class="mt-2">[m
[32m+[m[32m        <UTimeline :items="timelineItems" />[m
[32m+[m[32m      </div>[m
[32m+[m
[32m+[m[32m      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">[m
         <CertificateCard[m
           v-for="c in certificates"[m
           :key="c.id"[m
[36m@@ -65,13 +69,8 @@[m [mconst timelineItems = computed(() => {[m
           @open="openCertificate"[m
         />[m
       </div>[m
[31m-[m
[31m-      <div v-else class="mt-2">[m
[31m-        <UTimeline :items="timelineItems" />[m
[31m-      </div>[m
     </div>[m
 [m
[31m-    <!-- ✅ Slideover espera :item -->[m
     <CertificateSlideover v-model="isOpen" :item="selected" />[m
   </div>[m
 </template>[m
\ No newline at end of file[m
[1mdiff --git a/app/components/tabs/TabEducation.vue b/app/components/tabs/TabEducation.vue[m
[1mindex b9da93b..5b7a7e7 100644[m
[1m--- a/app/components/tabs/TabEducation.vue[m
[1m+++ b/app/components/tabs/TabEducation.vue[m
[36m@@ -6,10 +6,13 @@[m [mimport { formatYm } from '~/utils/format'[m
 const { data } = usePortfolioData()[m
 const education = data.education[m
 [m
[32m+[m[32mconst endLabel = (end?: string) => (end && end.trim() ? formatYm(end) : 'em andamento')[m
[32m+[m
 const timelineItems = computed(() =>[m
   education.map((e) => ({[m
[31m-    title: `${e.title} — ${e.institution}`,[m
[31m-    date: `${formatYm(e.startDate)} → ${e.endDate ? formatYm(e.endDate) : 'em andamento'}`,[m
[32m+[m[32m    title: e.title,[m
[32m+[m[32m    description: e.institution,[m
[32m+[m[32m    date: `${formatYm(e.startDate)} → ${endLabel(e.endDate)}`,[m
     icon: 'i-lucide-graduation-cap'[m
   }))[m
 )[m
[36m@@ -19,29 +22,25 @@[m [mconst timelineItems = computed(() =>[m
   <div class="pt-4 space-y-4">[m
     <div class="text-left">[m
       <h2 class="text-lg font-semibold">Formação</h2>[m
[31m-      <p class="text-sm text-muted">Cursos, graduação e formações.</p>[m
[32m+[m[32m      <p class="text-sm text-muted">Graduação, cursos e formaações.</p>[m
     </div>[m
 [m
     <UEmpty[m
       v-if="education.length === 0"[m
       icon="i-lucide-graduation-cap"[m
[31m-      title="Sem formações cadastradas"[m
[32m+[m[32m      title="Sem formações"[m
       description="Adicione itens em app/data/education.ts."[m
     />[m
 [m
     <div v-else class="space-y-4">[m
       <UTimeline :items="timelineItems" />[m
 [m
[32m+[m[32m      <!-- detalhes (sem repetir título/data) -->[m
       <div class="grid grid-cols-1 gap-3">[m
         <UCard v-for="e in education" :key="e.id" class="surface-panel">[m
[31m-          <div class="space-y-1">[m
[31m-            <div class="font-semibold">{{ e.title }}</div>[m
[31m-            <div class="text-sm text-muted">{{ e.institution }}</div>[m
[31m-            <div class="text-xs text-muted">[m
[31m-              {{ formatYm(e.startDate) }} → {{ e.endDate ? formatYm(e.endDate) : 'em andamento' }}[m
[31m-            </div>[m
[31m-            <p v-if="e.description" class="text-sm mt-2">{{ e.description }}</p>[m
[31m-          </div>[m
[32m+[m[32m          <p v-if="e.description" class="text-sm">[m
[32m+[m[32m            {{ e.description }}[m
[32m+[m[32m          </p>[m
         </UCard>[m
       </div>[m
     </div>[m
[1mdiff --git a/app/components/tabs/TabExperience.vue b/app/components/tabs/TabExperience.vue[m
[1mindex 17b8a3d..1aa8dab 100644[m
[1m--- a/app/components/tabs/TabExperience.vue[m
[1m+++ b/app/components/tabs/TabExperience.vue[m
[36m@@ -6,13 +6,19 @@[m [mimport { formatYm } from '~/utils/format'[m
 const { data } = usePortfolioData()[m
 const experiences = data.experiences[m
 [m
[32m+[m[32mconst endLabel = (end?: string) => (end && end.trim() ? formatYm(end) : 'atual')[m
[32m+[m
 const timelineItems = computed(() =>[m
[31m-  experiences.map((e) => ({[m
[31m-    title: `${e.role} — ${e.company}`,[m
[31m-    date: `${formatYm(e.startDate)} → ${e.endDate ? formatYm(e.endDate) : 'atual'}`,[m
[31m-    icon: 'i-lucide-briefcase-business',[m
[31m-    description: e.location[m
[31m-  }))[m
[32m+[m[32m  experiences.map((e) => {[m
[32m+[m[32m    const period = `${formatYm(e.startDate)} → ${endLabel(e.endDate)}`[m
[32m+[m[32m    const place = `${e.company}${e.location ? ` • ${e.location}` : ''}`[m
[32m+[m[32m    return {[m
[32m+[m[32m      title: e.role,[m
[32m+[m[32m      description: place,[m
[32m+[m[32m      date: period,[m
[32m+[m[32m      icon: 'i-lucide-briefcase-business'[m
[32m+[m[32m    }[m
[32m+[m[32m  })[m
 )[m
 </script>[m
 [m
[36m@@ -20,33 +26,28 @@[m [mconst timelineItems = computed(() =>[m
   <div class="pt-4 space-y-4">[m
     <div class="text-left">[m
       <h2 class="text-lg font-semibold">Experiência</h2>[m
[31m-      <p class="text-sm text-muted">Histórico profissional (ou atuações).</p>[m
[32m+[m[32m      <p class="text-sm text-mu