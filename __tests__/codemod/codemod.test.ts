import { describe, it, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync, copyFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

describe('codemod-toolkit-react', () => {
  it('react prefix 만 치환, 비-react 보존', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cm-'))
    const target = join(dir, 'sample.ts')
    copyFileSync(join(here, 'fixture.input.ts'), target)
    execFileSync('bash', [join(here, '../../scripts/codemod-toolkit-react.sh'), dir])
    const got = readFileSync(target, 'utf8')
    const want = readFileSync(join(here, 'fixture.expected.ts'), 'utf8')
    expect(got).toBe(want)
  })
})
