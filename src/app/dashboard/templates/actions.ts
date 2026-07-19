'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { sanitizeText } from '@/lib/sanitize'

type Table = 'comment_templates' | 'dm_templates'

export async function addTemplate(table: Table, formData: FormData) {
  const text = sanitizeText(String(formData.get('text') ?? ''))
  if (!text) return

  if (table === 'dm_templates') {
    const button_label = sanitizeText(String(formData.get('button_label') ?? 'Get Access')) || 'Get Access'
    const link = String(formData.get('link') ?? '').trim()
    if (!link) return
    await supabase.from(table).insert({ text, button_label, link })
  } else {
    await supabase.from(table).insert({ text })
  }
  revalidatePath('/dashboard/templates')
}

export async function updateTemplate(table: Table, id: string, formData: FormData) {
  const text = sanitizeText(String(formData.get('text') ?? ''))
  if (!text) return

  if (table === 'dm_templates') {
    const button_label = sanitizeText(String(formData.get('button_label') ?? 'Get Access')) || 'Get Access'
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

const DEFAULT_COMMENT_TEMPLATES = [
  "Thanks for your comment! 🙌 Just sent you a DM with the details.",
  "Appreciate you reaching out! 📩 Check your inbox, I sent you the link.",
  "Thank you! 😊 I've sent you a message with more info.",
  "Glad you're interested! 💬 Sent you a DM just now.",
  "Thanks for commenting! ✅ Check your Messenger inbox.",
]

const DEFAULT_DM_TEMPLATES: { text: string; button_label: string; link: string }[] = [
  { text: "Hey! Thanks for commenting 🙌 Here's the link you asked for:", button_label: 'Get Access', link: 'https://your-link.com' },
  { text: 'Hi there! 😊 Tap below to check it out:', button_label: 'View Now', link: 'https://your-link.com' },
  { text: "Thanks for reaching out! Here's what you need:", button_label: 'Get Started', link: 'https://your-link.com' },
  { text: 'Appreciate the comment! Grab it here:', button_label: 'Get Access', link: 'https://your-link.com' },
  { text: 'Hey! Just for you 🎁 tap below:', button_label: 'Claim Now', link: 'https://your-link.com' },
]

export async function seedDefaultTemplates(table: Table) {
  if (table === 'dm_templates') {
    await supabase.from(table).insert(DEFAULT_DM_TEMPLATES)
  } else {
    await supabase.from(table).insert(DEFAULT_COMMENT_TEMPLATES.map((text) => ({ text })))
  }
  revalidatePath('/dashboard/templates')
}
