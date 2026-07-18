'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

type Table = 'comment_templates' | 'dm_templates'

export async function addTemplate(table: Table, formData: FormData) {
  const text = String(formData.get('text') ?? '').trim()
  if (!text) return

  if (table === 'dm_templates') {
    const button_label = String(formData.get('button_label') ?? 'Get Access').trim()
    const link = String(formData.get('link') ?? '').trim()
    if (!link) return
    await supabase.from(table).insert({ text, button_label, link })
  } else {
    await supabase.from(table).insert({ text })
  }
  revalidatePath('/dashboard/templates')
}

export async function updateTemplate(table: Table, id: string, formData: FormData) {
  const text = String(formData.get('text') ?? '').trim()
  if (!text) return

  if (table === 'dm_templates') {
    const button_label = String(formData.get('button_label') ?? 'Get Access').trim()
    const link = String(formData.get('link') ?? '').trim()
    await supabase.from(table).update({ text, button_label, link }).eq('id', id)
  } else {
    await supabase.from(table).update({ text }).eq('id', id)
  }
  revalidatePath('/dashboard/templates')
}

export async function deleteTemplate(table: Table, id: string) {
  await supabase.from(table).delete().eq('id', id)
  revalidatePath('/dashboard/templates')
}

export async function toggleTemplate(table: Table, id: string, active: boolean) {
  await supabase.from(table).update({ active }).eq('id', id)
  revalidatePath('/dashboard/templates')
}
