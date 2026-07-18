import { supabase } from '@/lib/supabase'
import { addTemplate, deleteTemplate, toggleTemplate, updateTemplate } from './actions'

const inputClass =
  'w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100'

export default async function TemplatesPage() {
  const [{ data: commentTemplates }, { data: dmTemplates }] = await Promise.all([
    supabase.from('comment_templates').select('*').order('created_at'),
    supabase.from('dm_templates').select('*').order('created_at'),
  ])

  return (
    <div className="space-y-12">
      <section>
        <h1 className="mb-1 text-xl font-semibold">Public reply templates</h1>
        <p className="mb-4 text-sm text-neutral-500">
          Posted publicly under the comment. One is picked at random per comment.
        </p>

        <div className="space-y-3">
          {(commentTemplates ?? []).map((t) => (
            <form
              key={t.id}
              action={updateTemplate.bind(null, 'comment_templates', t.id)}
              className="flex items-start gap-2 rounded-lg border border-neutral-800 p-3"
            >
              <textarea name="text" defaultValue={t.text} rows={2} className={inputClass} />
              <div className="flex flex-col gap-2">
                <button type="submit" className="rounded-md bg-neutral-800 px-3 py-1 text-xs hover:bg-neutral-700">
                  Save
                </button>
                <button
                  formAction={toggleTemplate.bind(null, 'comment_templates', t.id, !t.active)}
                  className={
                    t.active
                      ? 'rounded-md bg-green-900/40 px-3 py-1 text-xs text-green-400'
                      : 'rounded-md bg-neutral-800 px-3 py-1 text-xs text-neutral-400'
                  }
                >
                  {t.active ? 'Active' : 'Paused'}
                </button>
                <button
                  formAction={deleteTemplate.bind(null, 'comment_templates', t.id)}
                  className="rounded-md px-3 py-1 text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>

        <form action={addTemplate.bind(null, 'comment_templates')} className="mt-4 space-y-2 rounded-lg border border-dashed border-neutral-800 p-3">
          <textarea name="text" placeholder="New public reply variation..." rows={2} required className={inputClass} />
          <button type="submit" className="rounded-md bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white">
            Add reply template
          </button>
        </form>
      </section>

      <section>
        <h1 className="mb-1 text-xl font-semibold">DM templates</h1>
        <p className="mb-4 text-sm text-neutral-500">
          Sent as a private message with a button. One is picked at random per comment.
        </p>

        <div className="space-y-3">
          {(dmTemplates ?? []).map((t) => (
            <form
              key={t.id}
              action={updateTemplate.bind(null, 'dm_templates', t.id)}
              className="space-y-2 rounded-lg border border-neutral-800 p-3"
            >
              <textarea name="text" defaultValue={t.text} rows={2} className={inputClass} />
              <div className="flex gap-2">
                <input name="button_label" defaultValue={t.button_label} placeholder="Button label" className={inputClass} />
                <input name="link" defaultValue={t.link} placeholder="Link" className={inputClass} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-md bg-neutral-800 px-3 py-1 text-xs hover:bg-neutral-700">
                  Save
                </button>
                <button
                  formAction={toggleTemplate.bind(null, 'dm_templates', t.id, !t.active)}
                  className={
                    t.active
                      ? 'rounded-md bg-green-900/40 px-3 py-1 text-xs text-green-400'
                      : 'rounded-md bg-neutral-800 px-3 py-1 text-xs text-neutral-400'
                  }
                >
                  {t.active ? 'Active' : 'Paused'}
                </button>
                <button
                  formAction={deleteTemplate.bind(null, 'dm_templates', t.id)}
                  className="rounded-md px-3 py-1 text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>

        <form action={addTemplate.bind(null, 'dm_templates')} className="mt-4 space-y-2 rounded-lg border border-dashed border-neutral-800 p-3">
          <textarea name="text" placeholder="New DM message variation..." rows={2} required className={inputClass} />
          <div className="flex gap-2">
            <input name="button_label" placeholder="Button label (e.g. Get Access)" className={inputClass} />
            <input name="link" placeholder="Link" required className={inputClass} />
          </div>
          <button type="submit" className="rounded-md bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white">
            Add DM template
          </button>
        </form>
      </section>
    </div>
  )
}
