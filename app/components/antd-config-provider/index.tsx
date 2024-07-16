import { App, ConfigProvider, theme as antdTheme } from 'antd'
import { type PropsWithChildren, memo } from 'react'
import { Theme, useTheme } from 'remix-themes'

function AntdConfigProvider(props: PropsWithChildren) {
  const { children } = props
  const [theme] = useTheme()
  return (
    <ConfigProvider
      button={{ autoInsertSpace: false }}
      input={{ autoComplete: 'off' }}
      theme={{
        algorithm: theme === Theme.DARK ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        hashed: false,
        cssVar: true,
      }}
      warning={{ strict: false }}
    >
      <App>{children}</App>
    </ConfigProvider>
  )
}

export default memo(AntdConfigProvider)
