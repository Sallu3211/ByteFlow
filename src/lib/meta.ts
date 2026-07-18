const GRAPH_API_VERSION = 'v21.0'
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`

// Public reply, posted as a reply to the original comment.
export async function postPublicReply(commentId: string, accessToken: string, message: string) {
  const res = await fetch(`${GRAPH_BASE}/${commentId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: accessToken }),
  })
  if (!res.ok) {
    throw new Error(`postPublicReply failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

// Private reply DM with a button, sent in response to the triggering comment.
export async function sendPrivateReplyButton(
  commentId: string,
  accessToken: string,
  text: string,
  buttonLabel: string,
  link: string
) {
  const res = await fetch(`${GRAPH_BASE}/me/messages?access_token=${encodeURIComponent(accessToken)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { comment_id: commentId },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text,
            buttons: [{ type: 'web_url', url: link, title: buttonLabel }],
          },
        },
      },
    }),
  })
  if (!res.ok) {
    throw new Error(`sendPrivateReplyButton failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}
