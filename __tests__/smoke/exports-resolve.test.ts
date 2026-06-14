import { describe, it, expect } from 'vitest'

const targets: Array<[string, string]> = [
  ['@withwiz/ui/react/components/ui/data-table', 'DataTable'],
  ['@withwiz/ui/react/components/ui/Button', 'Button'],
  ['@withwiz/ui/react/components/ui/Select', 'Select'],
  ['@withwiz/ui/react/hooks/useDebounce', 'useDebounce'],
  ['@withwiz/ui/react/hooks/useTimezone', 'useTimezone'],
  ['@withwiz/ui/react/utils/client-utils', 'cn'],
  ['@withwiz/ui/react/error', 'showFriendlyError'],
]

describe('@withwiz/ui exports resolve', () => {
  it.each(targets)('%s exposes %s', async (path, symbol) => {
    const mod = await import(/* @vite-ignore */ path)
    expect(mod[symbol]).toBeDefined()
  })
})
