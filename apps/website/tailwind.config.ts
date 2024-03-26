import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

import baseConfig from '@seventy-seven/ui/tailwind.config.ts'

const config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--roboto)', ...defaultTheme.fontFamily.sans],
        abel: ['var(--abel)'],
        'maven-pro': ['var(--maven-pro)'],
      },
    },
  },
} satisfies Config

export default config
