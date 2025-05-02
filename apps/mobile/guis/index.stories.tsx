import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from '@victorli/7guis-ui-mobile/theme'

import { CircleDrawer } from './CircleDrawer'
import { Counter } from './Counter'
import { CRUD } from './CRUD'
import { FlightBooker } from './FlightBooker'
import { TemperatureConverter } from './TemperatureConverter'
import { Timer } from './Timer'

const meta: Meta = {
  title: 'GUIs',
}

export default meta

type Story = StoryObj<typeof meta>

const counterStyles = StyleSheet.create({
  decoratorView: {
    alignItems: 'center', // Center the Counter component horizontally
    alignSelf: 'stretch', // Ensure decorator stretches if needed
    borderColor: theme.colors.border,
    borderWidth: 1, // Optional: Add border to visualize bounds
    flex: 1, // Allow component to fill decorator space
    justifyContent: 'center', // Center the Counter component vertically
    padding: theme.spacing.m,
  },
})

export const CounterStory: Story = {
  name: 'Counter',
  render: () => (
    <View style={counterStyles.decoratorView}>
      <Counter />
    </View>
  ),
}

const temperatureConverterStyles = StyleSheet.create({
  decoratorView: {
    alignItems: 'center', // Center the component horizontally
    alignSelf: 'stretch',
    borderColor: theme.colors.border,
    borderWidth: 1,
    flex: 1, // Allow component to fill decorator space
    justifyContent: 'center', // Center the component vertically
    padding: theme.spacing.l, // Generous padding
  },
})

export const TemperatureConverterStory: Story = {
  name: 'TemperatureConverter',
  render: () => (
    <View style={temperatureConverterStyles.decoratorView}>
      <TemperatureConverter />
    </View>
  ),
}

const flightBookerStyles = StyleSheet.create({
  decoratorView: {
    alignSelf: 'stretch',
    borderColor: theme.colors.border,
    borderWidth: 1,
    flex: 1,
    padding: theme.spacing.l,
  },
})

export const FlightBookerStory: Story = {
  name: 'FlightBooker',
  render: () => (
    <View style={flightBookerStyles.decoratorView}>
      <FlightBooker />
    </View>
  ),
}

const timerStyles = StyleSheet.create({
  decoratorView: {
    alignSelf: 'stretch',
    borderColor: theme.colors.border,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.l, // Center content vertically
  },
})

export const TimerStory: Story = {
  name: 'Timer',
  render: () => (
    <View style={timerStyles.decoratorView}>
      <Timer />
    </View>
  ),
}

const CRUDStyles = StyleSheet.create({
  decoratorView: {
    alignSelf: 'stretch',
    borderColor: theme.colors.border,
    borderWidth: 1,
    flex: 1,
    padding: theme.spacing.m,
  },
})

export const CRUDStory: Story = {
  name: 'CRUD',
  render: () => (
    <View style={CRUDStyles.decoratorView}>
      <CRUD />
    </View>
  ),
}

const circleDrawerStyles = StyleSheet.create({
  decoratorView: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.circleBackgroundColor,
    borderColor: theme.colors.border,
    borderWidth: 1,
    flex: 1, // Light background for contrast
  },
})

export const CircleDrawerStory: Story = {
  name: 'CircleDrawer',
  render: () => (
    <View style={circleDrawerStyles.decoratorView}>
      <CircleDrawer />
    </View>
  ),
}
