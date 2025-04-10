import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import theme from '~/styles/theme'

import { Button } from './Button'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m,
    alignItems: 'center',
  },
})

function handlePress() {
  Alert.alert('Button pressed')
}

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    // Default args for controls
    title: 'Button Text',
    onPress: handlePress,
    disabled: false,
    isLoading: false,
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'text'],
    },
    onPress: { action: 'pressed' }, // Log presses in actions tab if addon configured
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    title: { control: 'text' },
  },
  decorators: [
    Story => (
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

// --- Variants ---

export const Primary: Story = {
  args: {
    title: 'Primary Action',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    title: 'Secondary Action',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    title: 'Outline Action',
    variant: 'outline',
  },
}

export const Text: Story = {
  args: {
    title: 'Text Action',
    variant: 'text',
  },
}

// --- States ---

export const PrimaryDisabled: Story = {
  args: {
    title: 'Cannot Click',
    variant: 'primary',
    disabled: true,
  },
}

export const SecondaryDisabled: Story = {
  args: {
    title: 'Cannot Click',
    variant: 'secondary',
    disabled: true,
  },
}

export const OutlineDisabled: Story = {
  args: {
    title: 'Cannot Click',
    variant: 'outline',
    disabled: true,
  },
}

export const TextDisabled: Story = {
  args: {
    title: 'Cannot Click',
    variant: 'text',
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    title: 'Loading...',
    variant: 'primary',
    isLoading: true,
  },
}

export const SecondaryLoading: Story = {
  args: {
    title: 'Submitting...',
    variant: 'secondary',
    isLoading: true,
  },
}

// --- Customization ---

export const CustomStyle: Story = {
  args: {
    title: 'Custom Style',
    variant: 'primary',
    style: {
      borderRadius: 20,
      backgroundColor: theme.colors.secondary,
      paddingVertical: theme.spacing.s,
    },
    textStyle: {
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: 'black',
    },
  },
}
