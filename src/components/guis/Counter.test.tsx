import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '~/test-utils'
import { expect, test } from 'vitest'

import Counter from './Counter'

test('Counter', () => {
  const { getByRole, getByTestId } = renderWithProviders(<Counter />)

  // initial value to be 0
  expect(getByTestId('count').textContent).toBe('0')

  // each time button is clicked increases the value
  fireEvent.click(getByRole('button', { name: /increment/i }))
  expect(getByTestId('count').textContent).toBe('1')

  fireEvent.click(getByRole('button', { name: /increment/i }))
  expect(getByTestId('count').textContent).toBe('2')
  fireEvent.click(getByRole('button', { name: /increment/i }))
  fireEvent.click(getByRole('button', { name: /increment/i }))
  expect(getByTestId('count').textContent).toBe('4')
})
