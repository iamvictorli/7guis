import { fireEvent } from '@testing-library/react'
import { expect, test } from 'vitest'

import { renderWithProviders } from '../test-utils'
import Counter from './counter'

test('counter', () => {
  const { getByRole } = renderWithProviders(<Counter />)

  expect(getByRole('heading').textContent).toBe('0')
  fireEvent.click(getByRole('button', { name: /increment/i }))
  expect(getByRole('heading').textContent).toBe('1')
})
