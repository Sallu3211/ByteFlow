import { supabase } from '@/lib/supabase'
import { addPage, removePage, togglePage } from './actions'

export default async function PagesPage() {
  const { data: pages } = await supabase.from('pages').select('*').order('created_at')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-xl font-semibold">Pages</h1>
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 text-left text-neutral-400">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Page ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {(pages ?? []).map((page) => (
                <tr key={page.id} className="border-t border-neutral-800">
                  <td className="px-4 py-3">{page.name}</td>
                  <td className="px-4 py-3 text-neutral-400">{page.page_id}</td>
                  <td className="px-4 py-3">
                    <form action={togglePage.bind(null, page.id, !page.active)}>
                      <button
                        type="submit"
                        className={
                          page.active
                            ? 'rounded-full bg-green-900/40 px-2 py-1 text-xs text-green-400'
                            : 'rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-400'
                        }
                      >
                        {page.active ? 'Active — click to pause' : 'Paused — click to resume'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={removePage.bind(null, page.id)}>
                      <button type="submit" className="text-xs text-red-400 hover:text-red-300">
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(pages ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                    No pages connected yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Add a page</h2>
        <form action={addPage} className="space-y-3 rounded-lg border border-neutral-800 p-4">
          <input
            name="name"
            placeholder="Page name (e.g. Page 1)"
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
          />
          <input
            name="page_id"
            placeholder="Facebook Page ID"
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
          />
          <input
            name="access_token"
            placeholder="Long-lived Page Access Token"
            required
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
          />
          <button
            type="submit"
            className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            Add page
          </button>
        </form>
      </div>
    </div>
  )
}
