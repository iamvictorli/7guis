import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '~/test-utils'

import TemperatureConverter from './TemperatureConverter'

describe('temperatureConverter', () => {
  it('text fields to be initially empty', () => {
    renderWithProviders(<TemperatureConverter />)

    expect(
      screen.getByLabelText(/celcius/i, { selector: 'input' }),
    ).toHaveValue(null)
    expect(
      screen.getByLabelText(/fahrenheit/i, { selector: 'input' }),
    ).toHaveValue(null)
  })

  it('updates fahrenheit field when number is entered in celcius field', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)

    const celciusInput = screen.getByLabelText(/celcius/i, {
      selector: 'input',
    })

    const fahrenheitInput = screen.getByLabelText(/fahrenheit/i, {
      selector: 'input',
    })

    await user.type(celciusInput, '10')
    expect(fahrenheitInput).toHaveValue(50)

    await user.clear(celciusInput)
    await user.type(celciusInput, '25')
    expect(fahrenheitInput).toHaveValue(77)

    await user.clear(celciusInput)
    await user.type(celciusInput, '0')
    expect(fahrenheitInput).toHaveValue(32)
  })

  it('updates celcius field when number is entered in fahrenheit field', async () => {
    const { user } = renderWithProviders(<TemperatureConverter />)

    const celciusInput = screen.getByLabelText(/celcius/i, {
      selector: 'input',
    })

    const fahrenheitInput = screen.getByLabelText(/fahrenheit/i, {
      selector: 'input',
    })

    await user.type(fahrenheitInput, '68')
    expect(celciusInput).toHaveValue(20)

    await user.clear(fahrenheitInput)
    await user.type(fahrenheitInput, '95')
    expect(celciusInput).toHaveValue(35)

    await user.clear(fahrenheitInput)
    await user.type(fahrenheitInput, '50')
    expect(celciusInput).toHaveValue(10)
  })
})
