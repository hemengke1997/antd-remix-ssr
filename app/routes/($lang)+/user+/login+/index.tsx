import { type MetaFunction, json } from '@remix-run/node'
import { type LoaderFunctionArgs } from '@remix-run/router'
import LocaleLink from '@/components/locale-link'
import { i18nServer } from '@/i18n/i18n.server'

export const handle = {
  i18n: ['test'],
}

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18nServer.getFixedT(request)
  const title = t('common.title')
  return json({ title })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
    {
      name: 'description',
      content: '临时描述',
    },
  ]
}

export default function () {
  return (
    <>
      <h1>登录页面</h1>
      <LocaleLink to={'/'}>回到首页</LocaleLink>
    </>
  )
}
