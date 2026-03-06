export function useDashboardThemeUi() {
  const cardUi = {
    root: 'rounded-2xl overflow-hidden border border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface-1)] shadow-[var(--dashboard-shadow-sm)]',
    header: '',
    body: '',
    footer: ''
  }

  const tabsUi = {
    list: 'relative flex w-max min-w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-tabs-bg)] p-1 shadow-[var(--dashboard-shadow-xs)] md:w-full',
    indicator: 'absolute rounded-lg border border-[var(--dashboard-border-soft)] shadow-[var(--dashboard-shadow-xs)]',
    trigger: 'whitespace-nowrap md:flex-1 md:justify-center'
  }

  const switchUi = {
    base: [
      'inline-flex shrink-0 items-center rounded-full border transition-[background,border-color,box-shadow] duration-200',
      'data-[state=unchecked]:bg-[var(--dashboard-switch-off-track)]',
      'data-[state=unchecked]:border-[var(--dashboard-switch-off-border)]',
      'data-[state=checked]:border-transparent',
      'shadow-[var(--dashboard-shadow-xs)]'
    ].join(' '),
    thumb: [
      'pointer-events-none block rounded-full transition-transform duration-200',
      'bg-[var(--dashboard-switch-thumb)] data-[state=checked]:bg-[var(--dashboard-switch-thumb)]',
      'shadow-sm'
    ].join(' ')
  }

  return {
    cardUi,
    tabsUi,
    switchUi
  }
}