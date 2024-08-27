import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '~/test-utils'
import { expect, test } from 'vitest'

import Counter from './Counter'

test('counter', () => {
  const { getByRole } = renderWithProviders(<Counter />)

  expect(getByRole('heading').textContent).toBe('0')
  fireEvent.click(getByRole('button', { name: /increment/i }))
  expect(getByRole('heading').textContent).toBe('1')
})
