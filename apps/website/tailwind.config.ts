import type { Config } from 'tailwindcss'

import baseConfig from '@seventy-seven/ui/tailwind.config.ts'

const config = {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  presets: [baseConfig],
} satisfies Config

export default config
