import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '~/test-utils'
import { expect, test } from 'vitest'

import Counter from './Counter'

test('counter', () => {
  const { getByRole, getByTestId } = renderWithProviders(<Counter />)

  expect(getByTestId('count').textContent).toBe('0')
  fireEvent.click(getByRole('button', { name: /increment/i }))
  expect(getByTestId('count').textContent).toBe('1')
})
