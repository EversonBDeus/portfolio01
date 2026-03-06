export function useDashboardFormUi() {
  const fieldBase =
    'bg-[color:var(--dashboard-form-surface)] ' +
    'text-[var(--dashboard-field-text)] ' +
    'placeholder:text-transparent ' +
    'ring-1 ring-inset ring-[color:var(--dashboard-field-ring)] ' +
    'focus:ring-2 focus:ring-primary ' +
    'transition-colors'

  const inputUi = {
    root: 'relative',
    base: `peer w-full ${fieldBase}`,
    leading: 'absolute inset-y-0 start-0 flex items-center ps-3',
    leadingIcon: 'size-5 text-[var(--dashboard-field-icon)]',
    trailing: 'absolute inset-y-0 end-0 flex items-center pe-2'
  }

  const textareaUi = {
    base:
      'peer w-full bg-[color:var(--dashboard-form-surface)] ' +
      'text-[var(--dashboard-field-text)] ' +
      'placeholder:text-transparent ' +
      'ring-1 ring-inset ring-[color:var(--dashboard-field-ring)] ' +
      'focus:ring-2 focus:ring-primary transition-colors'
  }

  const floatingLabelBaseClass =
    'pointer-events-none absolute z-[1] -top-2.5 text-xs font-medium text-highlighted ' +
    'transition-all duration-200 peer-focus:-top-2.5 peer-focus:text-xs ' +
    'peer-focus:font-medium peer-focus:text-highlighted ' +
    'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 ' +
    'peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal ' +
    'peer-placeholder-shown:text-dimmed peer-focus:translate-y-0'

  const floatingLabelSurfaceClass =
    'inline-block bg-[color:var(--dashboard-form-surface)] px-1'

  return {
    inputUi,
    textareaUi,
    floatingLabelBaseClass,
    floatingLabelSurfaceClass
  }
}