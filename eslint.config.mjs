import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)) })
const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', '.agents/**', '.codex/**', 'artifacts/**'] },
  ...compat.extends('next/core-web-vitals'),
  { files: ['src/**/*.{js,jsx}'], rules: {
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/control-has-associated-label': ['error', { ignoreElements: ['input', 'textarea'] }],
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/click-events-have-key-events': 'error'
  } }
]

export default config
