export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neonspectrum-lime',
      secondary: 'neonspectrum-azure',
      tertiary: 'neonspectrum-cyan',
      success: 'neonspectrum-green',
      info: 'aquatech-electric',
      warning: 'sunrise-amber',
      error: 'uxred',
      neutral: 'combo04-charcoal'
    }
  }
})



/* Isso é um comentário
// =====  Tema 1: "UX Mastery" (Profissional, Sóbrio e Tecnológico)     ==== //

primary: 'uxblue',
  secondary: 'uxpurple',
  tertiary: 'ocean',
  success: 'uxgreen',
  info: 'candysky-sky',
  warning: 'sunrise-amber',
  error: 'uxred',
  neutral: 'combo01-ink'


// ===== Tema 2: "Neon Spectrum" (Cyberpunk e Vibrante)    ==== //


primary: 'neonspectrum-cyan',
  secondary: 'neonspectrum-deep',
  tertiary: 'combo05-mint',
  success: 'neonspectrum-lime',
  info: 'neonspectrum-azure',
  warning: 'sunrise-orange',
  error: 'rosewine-crimson',
  neutral: 'combo04-charcoal'


  // ===== Tema 3: "Lava & Sunset" (Criativo e Quente)    ==== //



  primary: 'sunrise-orange',
  secondary: 'lavasky-violet',
  tertiary: 'sunrise-coral',
  success: 'brand', 
  info: 'lavasky-azure',
  warning: 'sunrise-amber',
  error: 'sunrise-red',
  neutral: 'combo03-espresso'

    // ===== Tema 4: "Pastel Pop" (Suave, Acessível e Limpo)    ==== //

    primary: 'pastelpop-lilac',
  secondary: 'pastelpop-mint',
  tertiary: 'pastelpop-sky',
  success: 'aquatech-mint', // Um pouco mais forte para garantir leitura na mensagem de sucesso
  info: 'candysky-ice',
  warning: 'pastelpop-butter',
  error: 'rosewine-petal',
  neutral: 'combo05-ice'

      // =====Tema 5: "Aquatech Minimal" (Focado em Dados e Fluidez)   ==== //


      primary: 'aquatech-teal',
  secondary: 'aquatech-cyan',
  tertiary: 'combo05-blue',
  success: 'neonspectrum-green',
  info: 'aquatech-electric',
  warning: 'sunrise-amber',
  error: 'rosewine-berry',
  neutral: 'combo01-paper'

      // =====Tema 6: "The UX Elite" (Foco Total em Usabilidade))   ==== //

      primary: 'uxpurple',
  secondary: 'uxblue',
  tertiary: 'uxgreen',
  success: 'brand', 
  info: 'candysky-blue',
  warning: 'sunrise-amber',
  error: 'uxred',
  neutral: 'combo01-ink' // Um tom escuro profundo e elegante



      // =====Tema 7: "Rose Wine" (Elegante e Premium)  ==== //
  primary: 'rosewine-crimson',
  secondary: 'rosewine-berry',
  tertiary: 'rosewine-petal',
  success: 'uxgreen',
  info: 'lavasky-azure',
  warning: 'sunrise-cream',
  error: 'rosewine-mauve',
  neutral: 'combo03-espresso' // Neutro amarronzado que combina com os tons vinho


  
      // =====Tema 8: "Minty Dark Mode" (Energia e Modernidade) ==== //


      primary: 'combo05-mint',
  secondary: 'combo05-blue',
  tertiary: 'combo05-ice',
  success: 'neonspectrum-green',
  info: 'aquatech-electric',
  warning: 'pastelpop-butter',
  error: 'uxred',
  neutral: 'combo05-ink' // O preto mais profundo da sua lista para contraste máximo


        // =====TO Gemini disse
Com base na enorme variedade de paletas que você adicionou ao seu main.css, criei mais 5 temas exclusivos. Cada um utiliza as combinações semânticas que você definiu para o seu portfólio (como o botão de CV, as tags de Front-end e Back-end).

Aqui estão as novas opções focadas em diferentes estilos visuais:

Tema 6: "The UX Elite" (Foco Total em Usabilidade)
Vibe: Este tema utiliza as paletas que você nomeou especificamente como ux. São cores equilibradas, com contrastes otimizados para leitura e ação.

Primary (uxpurple): Dá um ar de sofisticação ao botão "Download CV".

Secondary (uxblue): Cria uma separação clara para o Back-end.

Tertiary (uxgreen): Ideal para o Full Stack, transmitindo equilíbrio.

JavaScript
export default {
  primary: 'uxpurple',
  secondary: 'uxblue',
  tertiary: 'uxgreen',
  success: 'brand', 
  info: 'candysky-blue',
  warning: 'sunrise-amber',
  error: 'uxred',
  neutral: 'combo01-ink' // Um tom escuro profundo e elegante
}
Tema 7: "Rose Wine" (Elegante e Premium)
Vibe: Um tema mais "quente" e luxuoso, excelente para portfólios que focam em design de interface ou produtos de alta gama.

Primary (rosewine-crimson): Um vermelho vinho marcante para as ações principais.

Secondary (rosewine-berry): Um tom de transição perfeito para o Back-end.

Tertiary (rosewine-petal): Suave para badges de nível básico.

JavaScript
export default {
  primary: 'rosewine-crimson',
  secondary: 'rosewine-berry',
  tertiary: 'rosewine-petal',
  success: 'uxgreen',
  info: 'lavasky-azure',
  warning: 'sunrise-cream',
  error: 'rosewine-mauve',
  neutral: 'combo03-espresso' // Neutro amarronzado que combina com os tons vinho
}
Tema 8: "Minty Dark Mode" (Energia e Modernidade)
Vibe: Cores frias e extremamente vibrantes que funcionam muito bem contra fundos escuros. O mint (menta) traz uma sensação de frescor tecnológico.

Primary (combo05-mint): O botão CV e os destaques ficam com um brilho neon moderno.

Secondary (combo05-blue): Um azul elétrico para as redes sociais e Back-end.

Tertiary (combo05-ice): Um tom quase branco/azulado para o Full Stack.

JavaScript
export default {
  primary: 'combo05-mint',
  secondary: 'combo05-blue',
  tertiary: 'combo05-ice',
  success: 'neonspectrum-green',
  info: 'aquatech-electric',
  warning: 'pastelpop-butter',
  error: 'uxred',
  neutral: 'combo05-ink' // O preto mais profundo da sua lista para contraste máximo
}
Tema 9: "Sunset Lava" (Vibrante e Orgânico) ==== //

        primary: 'sunrise-orange',
  secondary: 'lavasky-violet',
  tertiary: 'sunrise-coral',
  success: 'uxgreen',
  info: 'lavasky-azure',
  warning: 'sunrise-amber',
  error: 'sunrise-red',
  neutral: 'combo03-taupe' // Um cinza terroso que ancora as cores vibrantes


  }
Tema 9: Tema 10: "Cyber Lime" (Alta Performance) ==== //

primary: 'neonspectrum-lime',
  secondary: 'neonspectrum-azure',
  tertiary: 'neonspectrum-cyan',
  success: 'neonspectrum-green',
  info: 'aquatech-electric',
  warning: 'sunrise-amber',
  error: 'uxred',
  neutral: 'combo04-charcoal' // Cinza carvão para um visual industrial


   de várias linhas */