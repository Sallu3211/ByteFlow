export function ToggleSwitch({
  action,
  active,
}: {
  action: (formData: FormData) => void | Promise<void>
  active: boolean
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        aria-pressed={active}
        title={active ? 'Active — click to pause' : 'Paused — click to resume'}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          active ? 'bg-emerald-500' : 'bg-neutral-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            active ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </form>
  )
}
