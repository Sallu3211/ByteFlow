import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { postPublicReply, sendPrivateReplyButton } from '@/lib/meta'

// Meta's one-time handshake when you set the webhook URL in the App dashboard.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const mode = params.get('hub.mode')
  const token = params.get('hub.verify_token')
  const challenge = params.get('hub.challenge')

  if (mode === 'subscribe' && challenge && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

interface FeedChange {
  field: string
  value: {
    item?: string
    verb?: string
    comment_id?: string
    sender_id?: string
  }
}

interface WebhookEntry {
  id: string
  changes?: FeedChange[]
}

interface WebhookBody {
  entry?: WebhookEntry[]
}

function verifySignature(rawBody: string, signatureHeader: string | null) {
  const appSecret = process.env.META_APP_SECRET
  if (!appSecret || !signatureHeader) return false

  const expected = 'sha256=' + createHmac('sha256', appSecret).update(rawBody).digest('hex')
  const a = Buffer.from(signatureHeader)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(Math.random() * items.length)]
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  if (!verifySignature(rawBody, request.headers.get('x-hub-signature-256'))) {
    return new Response('Invalid signature', { status: 401 })
  }

  const body = JSON.parse(rawBody) as WebhookBody

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'feed') continue
      const { item, verb, comment_id, sender_id } = change.value
      if (item !== 'comment' || verb !== 'add' || !comment_id) continue

      await handleComment(entry.id, comment_id, sender_id).catch((err) =>
        console.error(`webhook: failed to process comment ${comment_id}`, err)
      )
    }
  }

  return NextResponse.json({ ok: true })
}

async function handleComment(pageId: string, commentId: string, senderId?: string) {
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('page_id', pageId)
    .eq('active', true)
    .maybeSingle()

  if (!page) return // unknown page, or automation paused for it

  // Our own public reply below creates a new "add" comment event on the same
  // thread — skip it so the bot doesn't reply to itself in a loop.
  if (senderId && senderId === pageId) return

  const { error: insertError } = await supabase
    .from('processed_comments')
    .insert({ comment_id: commentId })

  // Unique-constraint violation means another webhook delivery already
  // claimed this comment (Meta retries deliveries) — skip duplicate work.
  if (insertError) return

  const [{ data: commentTemplates }, { data: dmTemplates }] = await Promise.all([
    supabase.from('comment_templates').select('*').eq('active', true),
    supabase.from('dm_templates').select('*').eq('active', true),
  ])

  const commentTemplate = pickRandom(commentTemplates ?? [])
  const dmTemplate = pickRandom(dmTemplates ?? [])
  if (!commentTemplate || !dmTemplate) {
    console.error('webhook: no active templates configured')
    return
  }

  await postPublicReply(commentId, page.access_token, commentTemplate.text)
  await sendPrivateReplyButton(
    commentId,
    page.access_token,
    dmTemplate.text,
    dmTemplate.button_label,
    dmTemplate.link
  )
}
