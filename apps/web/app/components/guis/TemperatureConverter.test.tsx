import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '~/lib/test-utils'

import TemperatureConverter from './TemperatureConverter'

describe('temperatureConverter', () => {
  it('text fields to be initially empty', () => {
    renderWithProviders(<TemperatureConverter />)

    expect(
      screen.getByLabelText(/celsius/i, { selector: 'input' }),
    ).toHaveValue(null)
    expect(
      screen.getByLabelText(/fahrenheit/i, { selector: 'input' }),
    ).toHaveValue(null)
  })

  it('updates fahrenheit field when number is entered in celsius field', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)

    const celsiusInput = screen.getByLabelText(/celsius/i, {
      selector: 'input',
    })

    const fahrenheitInput = screen.getByLabelText(/fahrenheit/i, {
      selector: 'input',
    })

    await user.type(celsiusInput, '10')
    expect(fahrenheitInput).toHaveValue(50)

    await user.clear(celsiusInput)
    await user.type(celsiusInput, '25')
    expect(fahrenheitInput).toHaveValue(77)

    await user.clear(celsiusInput)
    await user.type(celsiusInput, '0')
    expect(fahrenheitInput).toHaveValue(32)
  })

  it('updates celsius field when number is entered in fahrenheit field', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)

    const celsiusInput = screen.getByLabelText(/celsius/i, {
      selector: 'input',
    })

    const fahrenheitInput = screen.getByLabelText(/fahrenheit/i, {
      selector: 'input',
    })

    await user.type(fahrenheitInput, '68')
    expect(celsiusInput).toHaveValue(20)

    await user.clear(fahrenheitInput)
    await user.type(fahrenheitInput, '95')
    expect(celsiusInput).toHaveValue(35)

    await user.clear(fahrenheitInput)
    await user.type(fahrenheitInput, '50')
    expect(celsiusInput).toHaveValue(10)
  })
})
