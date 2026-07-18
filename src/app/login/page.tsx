import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form
        action={login}
        className="w-full max-w-sm space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
      >
        <h1 className="text-lg font-semibold text-neutral-100">ByteFlow</h1>
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none focus:border-neutral-500"
        />
        {error && <p className="text-sm text-red-400">Wrong password.</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-neutral-100 px-3 py-2 font-medium text-neutral-900 hover:bg-white"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
