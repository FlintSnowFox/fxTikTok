import { Context } from 'hono'
import { BRAND } from '../../branding'
import MetaHelper from '../../util/metaHelper'

export function MessageResponse(title: string, message: string, c: Context): JSX.Element {
  return (
    <>
      {MetaHelper(c, [
        {
          name: 'og:title',
          content: title
        },
        {
          name: 'theme-color',
          content: BRAND.color
        },
        {
          name: 'og:description',
          content: message
        }
      ])}
    </>
  )
}
