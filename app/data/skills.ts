export type SkillLevel = 'basic' | 'intermediate' | 'advanced'

export type Skill = {
  name: string
  icon: string
  level: SkillLevel
  colorClass?: string // classe Tailwind para cor do ícone
}

export const skills: Skill[] = [
  { name: 'HTML', icon: 'i-simple-icons-html5', level: 'advanced', colorClass: 'text-[#E34F26]' },
  { name: 'CSS', icon: 'i-simple-icons-css3', level: 'advanced', colorClass: 'text-[#1572B6]' },
  { name: 'JavaScript', icon: 'i-simple-icons-javascript', level: 'advanced', colorClass: 'text-[#F7DF1E]' },
  { name: 'TypeScript', icon: 'i-simple-icons-typescript', level: 'intermediate', colorClass: 'text-[#3178C6]' },

  { name: 'Vue.js', icon: 'i-simple-icons-vuedotjs', level: 'advanced', colorClass: 'text-[#42B883]' },
  { name: 'Nuxt', icon: 'i-simple-icons-nuxtdotjs', level: 'intermediate', colorClass: 'text-[#00DC82]' },
  { name: 'Tailwind CSS', icon: 'i-simple-icons-tailwindcss', level: 'intermediate', colorClass: 'text-[#06B6D4]' },

  // ✅ era i-simple-icons-pinialogo (não existe)
  { name: 'Pinia', icon: 'i-simple-icons-pinia', level: 'intermediate', colorClass: 'text-[#F7D336]' },

  { name: 'Node.js', icon: 'i-simple-icons-nodedotjs', level: 'intermediate', colorClass: 'text-[#339933]' },
  { name: 'MongoDB', icon: 'i-simple-icons-mongodb', level: 'basic', colorClass: 'text-[#47A248]' },
  { name: 'MySQL', icon: 'i-simple-icons-mysql', level: 'basic', colorClass: 'text-[#4479A1]' },
  { name: 'AWS', icon: 'i-simple-icons-amazonaws', level: 'basic', colorClass: 'text-[#FF9900]' }
]