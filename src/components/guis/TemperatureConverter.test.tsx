import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '~/test-utils'
import { describe, expect, test } from 'vitest'

import TemperatureConverter from './TemperatureConverter'

describe('TemperatureConverter', () => {
  test('Text fields to be initially empty', () => {
    const { getByLabelText } = renderWithProviders(<TemperatureConverter />)

    expect(
      (getByLabelText(/celcius/i, { selector: 'input' }) as HTMLInputElement)
        .value,
    ).toBe('')

    expect(
      (getByLabelText(/fahrenheit/i, { selector: 'input' }) as HTMLInputElement)
        .value,
    ).toBe('')
  })

  test('updates fahrenheit field when number is entered in celcius field', () => {
    const { getByLabelText } = renderWithProviders(<TemperatureConverter />)

    const celciusInput = getByLabelText(/celcius/i, {
      selector: 'input',
    }) as HTMLInputElement

    const fahrenheitInput = getByLabelText(/fahrenheit/i, {
      selector: 'input',
    }) as HTMLInputElement

    fireEvent.change(celciusInput, { target: { value: '10' } })
    expect(fahrenheitInput.value).toBe('50')
    fireEvent.change(celciusInput, { target: { value: '25' } })
    expect(fahrenheitInput.value).toBe('77')
    fireEvent.change(celciusInput, { target: { value: '0' } })
    expect(fahrenheitInput.value).toBe('32')
    fireEvent.change(celciusInput, { target: { value: '' } })
    expect(fahrenheitInput.value).toBe('')
  })

  test('updates celcius field when number is entered in fahrenheit field', () => {
    const { getByLabelText } = renderWithProviders(<TemperatureConverter />)

    const celciusInput = getByLabelText(/celcius/i, {
      selector: 'input',
    }) as HTMLInputElement

    const fahrenheitInput = getByLabelText(/fahrenheit/i, {
      selector: 'input',
    }) as HTMLInputElement

    fireEvent.change(fahrenheitInput, { target: { value: '68' } })
    expect(celciusInput.value).toBe('20')
    fireEvent.change(fahrenheitInput, { target: { value: '95' } })
    expect(celciusInput.value).toBe('35')
    fireEvent.change(fahrenheitInput, { target: { value: '50' } })
    expect(celciusInput.value).toBe('10')
    fireEvent.change(fahrenheitInput, { target: { value: '' } })
    expect(celciusInput.value).toBe('')
  })
})
