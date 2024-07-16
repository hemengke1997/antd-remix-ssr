import { createThemeAction } from 'remix-themes'
import { themeSessionResolver } from '@/modules/session/session.server'

export const action = createThemeAction(themeSessionResolver)
