import { useTranslation } from 'react-i18next'
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { Button, Card, Space, Tag } from 'antd'
import { Theme, useTheme } from 'remix-themes'
import LocaleLink from '@/components/locale-link'
import { useSteps } from '@/hooks/use-steps'
import { i18nServer } from '@/i18n/i18n.server'
import { tdk } from '@/utils/tdk'

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18nServer.getFixedT(request)
  const title = t('common.title')
  return json({ title })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return tdk({ t: data?.title, d: 'remix antd i18n demo' })
}

export default function () {
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useTheme()
  const [, next] = useSteps<Theme>([Theme.LIGHT, Theme.DARK], {
    defaultValue: theme!,
    onChange: setTheme,
  })

  return (
    <div className={'flex flex-col items-center gap-y-3'}>
      <div>{t('common.title')}</div>
      <h1 className={'mt-4 text-ant-color-primary'}>remix antd i18n 模板</h1>
      <div className={'flex w-96 flex-col gap-y-4'}>
        <Card title={t('home.theme')}>
          <Space direction='vertical'>
            <div className={'flex items-center'}>
              <div>当前主题：</div>
              <Tag>{theme}</Tag>
            </div>
            <Button onClick={() => next()}>切换主题</Button>
          </Space>
        </Card>
        <Card title={t('home.language')}>
          <Space direction='vertical'>
            <div>当前语言：{i18n.language}</div>
            <Space>
              <Button onClick={() => i18n.changeLanguage('en')}>切换到英文</Button>
              <Button onClick={() => i18n.changeLanguage('zh')}>切换到中文</Button>
            </Space>
          </Space>
        </Card>
        <Card title={t('home.route')}>
          <Space direction='vertical'>
            <LocaleLink to={'/user/login'}>跳转到登录页面</LocaleLink>
          </Space>
        </Card>
      </div>
    </div>
  )
}
