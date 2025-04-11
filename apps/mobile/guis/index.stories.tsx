import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '~/styles/theme'

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
    padding: theme.spacing.m,
    flex: 1, // Allow component to fill decorator space
    alignSelf: 'stretch', // Ensure decorator stretches if needed
    justifyContent: 'center', // Center the Counter component vertically
    alignItems: 'center', // Center the Counter component horizontally
    borderWidth: 1, // Optional: Add border to visualize bounds
    borderColor: theme.colors.border,
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
    padding: theme.spacing.l, // Generous padding
    flex: 1, // Allow component to fill decorator space
    alignSelf: 'stretch',
    justifyContent: 'center', // Center the component vertically
    alignItems: 'center', // Center the component horizontally
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    padding: theme.spacing.l,
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    padding: theme.spacing.l,
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center', // Center content vertically
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
    padding: theme.spacing.m,
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#f0f0f0', // Light background for contrast
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
