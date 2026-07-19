import { supabase } from '@/lib/supabase'
import { ToggleSwitch } from '../ToggleSwitch'
import { addTemplate, deleteTemplate, seedDefaultTemplates, toggleTemplate, updateTemplate } from './actions'

const inputClass =
  'w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-neutral-600'

export default async function TemplatesPage() {
  const [
    { data: commentTemplates, error: commentError },
    { data: dmTemplates, error: dmError },
  ] = await Promise.all([
    supabase.from('comment_templates').select('*').order('created_at'),
    supabase.from('dm_templates').select('*').order('created_at'),
  ])
  if (commentError) throw new Error(`Failed to load comment templates: ${commentError.message}`)
  if (dmError) throw new Error(`Failed to load DM templates: ${dmError.message}`)

  const comments = commentTemplates ?? []
  const dms = dmTemplates ?? []

  return (
    <div className="space-y-14">
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-semibold">Public reply templates</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Posted publicly under the comment. One is picked at random per comment.
            </p>
          </div>
          {comments.length === 0 && (
            <form action={seedDefaultTemplates.bind(null, 'comment_templates')}>
              <button
                type="submit"
                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-500 hover:text-white"
              >
                Load starter templates
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3">
          {comments.map((t) => (
            <form
              key={t.id}
              action={updateTemplate.bind(null, 'comment_templates', t.id)}
              className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4"
            >
              <textarea name="text" defaultValue={t.text} rows={2} className={`${inputClass} flex-1`} />
              <div className="flex shrink-0 flex-col items-end gap-2">
                <ToggleSwitch action={toggleTemplate.bind(null, 'comment_templates', t.id, !t.active)} active={t.active} />
                <div className="flex gap-3">
                  <button type="submit" className="text-xs font-medium text-emerald-400 hover:text-emerald-300">
                    Save
                  </button>
                  <button
                    formAction={deleteTemplate.bind(null, 'comment_templates', t.id)}
                    className="text-xs text-neutral-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </form>
          ))}
          {comments.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-800 p-5 text-center text-sm text-neutral-500">
              No reply templates yet — load the starter set above or add your own below.
            </p>
          )}
        </div>

        <form
          action={addTemplate.bind(null, 'comment_templates')}
          className="mt-4 space-y-2 rounded-xl border border-dashed border-neutral-800 p-4"
        >
          <textarea name="text" placeholder="New public reply variation..." rows={2} required className={inputClass} />
          <button
            type="submit"
            className="rounded-lg bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            Add reply template
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-semibold">DM templates</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Sent as a private message with a button. One is picked at random per comment.
            </p>
          </div>
          {dms.length === 0 && (
            <form action={seedDefaultTemplates.bind(null, 'dm_templates')}>
              <button
                type="submit"
                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-500 hover:text-white"
              >
                Load starter templates
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3">
          {dms.map((t) => (
            <form
              key={t.id}
              action={updateTemplate.bind(null, 'dm_templates', t.id)}
              className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4"
            >
              <textarea name="text" defaultValue={t.text} rows={2} className={inputClass} />
              <div className="flex gap-2">
                <input name="button_label" defaultValue={t.button_label} placeholder="Button label" className={inputClass} />
                <input name="link" defaultValue={t.link} placeholder="Link" className={inputClass} />
              </div>
              <div className="flex items-center justify-between">
                <ToggleSwitch action={toggleTemplate.bind(null, 'dm_templates', t.id, !t.active)} active={t.active} />
                <div className="flex gap-3">
                  <button type="submit" className="text-xs font-medium text-emerald-400 hover:text-emerald-300">
                    Save
                  </button>
                  <button
                    formAction={deleteTemplate.bind(null, 'dm_templates', t.id)}
                    className="text-xs text-neutral-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </form>
          ))}
          {dms.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-800 p-5 text-center text-sm text-neutral-500">
              No DM templates yet — load the starter set above or add your own below.
            </p>
          )}
        </div>

        <form
          action={addTemplate.bind(null, 'dm_templates')}
          className="mt-4 space-y-2 rounded-xl border border-dashed border-neutral-800 p-4"
        >
          <textarea name="text" placeholder="New DM message variation..." rows={2} required className={inputClass} />
          <div className="flex gap-2">
            <input name="button_label" placeholder="Button label (e.g. Get Access)" className={inputClass} />
            <input name="link" placeholder="Link" required className={inputClass} />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            Add DM template
          </button>
        </form>
      </section>
    </div>
  )
}
