import { Context } from 'hono'
import { env } from 'hono/adapter'
import { buildActivityId, normalizePage } from './activityId'

export default function MetaHelper(
  c: Context,
  tags: {
    name: string
    content: string | null
  }[],
  alternate?: {
    [key: string]: string | number
  },
  awemeId?: string,
  hq?: boolean,
  addDesc?: boolean,
  activityPage?: number
): JSX.Element {
  const { OFF_LOAD } = env(c) as { OFF_LOAD: string }
  // Served by this Worker, not the offload server, so embeds carry this deployment's branding.
  const page = normalizePage(activityPage || c.req.query('page'))
  const activityId = awemeId ? buildActivityId(awemeId, { hq, addDesc, page }) : null
  const activityUrl = activityId
    ? new URL('/users/username/statuses/' + activityId, c.req.url)
    : null

  let alternateUrl = new URL('/generate/alternate', c.req.url)

  if (alternate) {
    for (const key in alternate) {
      alternateUrl.searchParams.set(key, encodeURIComponent(alternate[key].toString()))
    }
  }

  return (
    <html lang='en'>
      <head>
        {tags.map((tag) => (tag.content ? <meta property={tag.name} content={tag.content} /> : null))}
        {alternate ? <link rel='alternate' href={alternateUrl.toString()} type='application/json+oembed' /> : null}
        {awemeId ? <link rel='alternate' type='application/activity+json' href={activityUrl?.toString()} /> : null}
      </head>
    </html>
  )
}
