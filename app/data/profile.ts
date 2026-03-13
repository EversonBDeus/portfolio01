export type SocialLink = {
  label: string
  icon: string
  url: string
  brandClass: string
}

export type AboutItem = {
  label: string
  icon: string
  content: string
}

export const profile = {
  name: 'Perfil de demonstração',
  headline: 'Exemplo neutro para apresentação da Lumio',
  avatarSrc: '/favicon.png',

  cv: {
    url: '/files/cv.pdf',
    openInNewTab: true
  },

  socials: [
    { label: 'LinkedIn', icon: 'i-lucide-linkedin', url: '', brandClass: 'brand-linkedin' },
    { label: 'GitHub', icon: 'i-lucide-github', url: '', brandClass: 'brand-github' },
    { label: 'Instagram', icon: 'i-lucide-instagram', url: '', brandClass: 'brand-instagram' }
  ] satisfies SocialLink[],

  contact: {
    whatsappUrl: '',
    telegramUrl: ''
  },

  about: [
    {
      label: 'Sobre esta demo',
      icon: 'i-lucide-user',
      content: 'Esta rota legado foi mantida apenas como demonstração neutra enquanto a experiência principal da Lumio evolui na publicação por slug.'
    },
    {
      label: 'Foco do produto',
      icon: 'i-lucide-code',
      content: 'A plataforma está sendo preparada para oferecer criação, edição e publicação de portfólios com uma experiência simples e profissional.'
    },
    {
      label: 'Próximo passo',
      icon: 'i-lucide-rocket',
      content: 'A evolução natural da plataforma é consolidar publicação pública, autenticação estável e limpeza visual antes da abertura para uso real.'
    }
  ] satisfies AboutItem[]
}