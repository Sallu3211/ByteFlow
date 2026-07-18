'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function addPage(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const page_id = String(formData.get('page_id') ?? '').trim()
  const access_token = String(formData.get('access_token') ?? '').trim()
  if (!name || !page_id || !access_token) return

  await supabase.from('pages').insert({ name, page_id, access_token })
  revalidatePath('/dashboard/pages')
}

export async function removePage(id: string) {
  await supabase.from('pages').delete().eq('id', id)
  revalidatePath('/dashboard/pages')
}

export async function togglePage(id: string, active: boolean) {
  await supabase.from('pages').update({ active }).eq('id', id)
  revalidatePath('/dashboard/pages')
}
