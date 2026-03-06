export function useDashboardFormUi() {
  const fieldBase =
    'bg-[var(--dashboard-field-bg)] ' +
    'text-[var(--dashboard-field-text)] ' +
    'placeholder:text-[var(--dashboard-field-placeholder)] ' +
    'ring-1 ring-[var(--dashboard-field-ring)] ' +
    'shadow-[inset_0_1px_0_var(--dashboard-field-inner)] ' +
    'focus:ring-2 focus:ring-primary'

  const inputUi = {
    base: `peer ${fieldBase}`,
    leading: 'pointer-events-none text-[var(--dashboard-field-icon)]',
    trailing: 'pe-1'
  }

  const textareaUi = {
    base: fieldBase
  }

  const floatingLabelBaseClass =
    'pointer-events-none absolute z-[1] px-1.5 transition-all duration-200 ' +
    '-top-2.5 text-xs font-medium text-highlighted ' +
    'peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium peer-focus:text-highlighted ' +
    'peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm ' +
    'peer-placeholder-shown:font-normal peer-placeholder-shown:text-dimmed'

  const floatingLabelSurfaceClass = 'inline-flex bg-[var(--dashboard-field-label-bg)] px-1'

  return {
    inputUi,
    textareaUi,
    floatingLabelBaseClass,
    floatingLabelSurfaceClass
  }
}