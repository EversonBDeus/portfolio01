declare module 'scrollreveal' {
  export type ScrollRevealOptions = Record<string, any>

  export interface ScrollRevealObject {
    reveal(
      target: Element | string | NodeListOf<Element>,
      options?: ScrollRevealOptions
    ): void
    clean?(target?: Element | string | NodeListOf<Element>): void
    destroy?(): void
  }

  export interface ScrollRevealFactory {
    (options?: ScrollRevealOptions): ScrollRevealObject
  }

  const ScrollReveal: ScrollRevealFactory
  export default ScrollReveal
}