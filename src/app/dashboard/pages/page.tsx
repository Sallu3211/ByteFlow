import { supabase } from '@/lib/supabase'
import { ToggleSwitch } from '../ToggleSwitch'
import { addPage, removePage, togglePage } from './actions'

const inputClass =
  'w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-neutral-600'

export default async function PagesPage() {
  const { data: pages, error } = await supabase.from('pages').select('*').order('created_at')
  if (error) throw new Error(`Failed to load pages: ${error.message}`)
  const list = pages ?? []
  const activeCount = list.filter((p) => p.active).length

  return (
    <div className="space-y-10">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pages</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {list.length === 0 ? 'No pages connected yet.' : `${activeCount} active of ${list.length} connected.`}
          </p>
        </div>
      </div>

      {list.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Page ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {list.map((page) => (
                <tr key={page.id} className="hover:bg-neutral-900/40">
                  <td className="px-4 py-3.5 font-medium text-neutral-100">{page.name}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-neutral-500">{page.page_id}</td>
                  <td className="px-4 py-3.5">
                    <ToggleSwitch action={togglePage.bind(null, page.id, !page.active)} active={page.active} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <form action={removePage.bind(null, page.id)}>
                      <button type="submit" className="text-xs text-neutral-500 hover:text-red-400">
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Add a page</h2>
        <form action={addPage} className="grid gap-3 rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 sm:grid-cols-2">
          <input name="name" placeholder="Page name (e.g. Page 1)" required className={inputClass} />
          <input name="page_id" placeholder="Facebook Page ID" required className={inputClass} />
          <input
            name="access_token"
            placeholder="Long-lived Page Access Token"
            required
            className={`${inputClass} sm:col-span-2`}
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400 sm:col-span-2 sm:w-fit"
          >
            Add page
          </button>
        </form>
      </div>
    </div>
  )
}
