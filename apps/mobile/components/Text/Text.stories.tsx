import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import { StyleSheet, View } from 'react-native'

import theme from '~/styles/theme'

import { Text } from './Text'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m,
    alignItems: 'flex-start', // Align text to start for better readability
  },
})

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  args: {
    // Default args for controls
    children: 'This is sample text.',
    variant: 'body',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.keys(theme.typography),
    },
    color: {
      control: 'select',
      options: [...Object.keys(theme.colors), 'purple', '#123456'], // Add theme colors and examples
    },
    children: {
      control: 'text',
    },
  },
  decorators: [
    // Optional decorator to add padding around stories
    Story => (
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'This is default (body) text.',
    variant: 'body', // Explicitly set for clarity, though it's the default
  },
}

export const Heading1: Story = {
  args: {
    children: 'Heading 1',
    variant: 'h1',
  },
}

export const Heading2: Story = {
  args: {
    children: 'Heading 2',
    variant: 'h2',
  },
}

export const Label: Story = {
  args: {
    children: 'Label Text',
    variant: 'label',
  },
}

export const Caption: Story = {
  args: {
    children: 'Caption Text',
    variant: 'caption',
  },
}

export const PrimaryColor: Story = {
  args: {
    children: 'Primary Color Text',
    color: 'primary', // Use theme color key
  },
}

export const CustomColorString: Story = {
  args: {
    children: 'Custom Color Text (Orange)',
    color: '#FFA500', // Use custom color string
  },
}

export const CustomStyle: Story = {
  args: {
    children: 'Italic Underlined',
    style: {
      fontStyle: 'italic',
      textDecorationLine: 'underline',
      color: theme.colors.secondary, // Can also include color here
    },
  },
}

export const LongText: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  decorators: [ // Specific decorator for this story to show wrapping
    Story => (
      <View style={{ padding: theme.spacing.m, width: 300, borderWidth: 1, borderColor: theme.colors.border }}>
        <Story />
      </View>
    ),
  ],
}
