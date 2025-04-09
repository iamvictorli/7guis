import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import { Button } from '~/components/Button/Button'
import { Text } from '~/components/Text/Text'
import theme from '~/styles/theme'

import type { CardProps } from './Card'

import { Card } from './Card'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m, // Padding around the single card
    alignItems: 'center', // Center card horizontally if needed
    width: '100%',
    maxWidth: 400, // Limit width for better card visibility
  },
  decoratorViewList: {
    padding: theme.spacing.m, // Padding around the list of cards
    width: '100%',
    maxWidth: 400, // Limit width
  },
})

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  args: {
    // No specific args needed here, children are defined per story
  },
  argTypes: {
    // Disable controls for complex props like children/style
    children: { table: { disable: true } },
    style: { control: 'object' }, // Allow editing style object for experimentation
  },
  decorators: [
    Story => (
      // Provide a container with padding to see the card's margins/shadows
      <View style={styles.decoratorView}>
        <Story />
      </View>
    ),
  ],
}

export default meta

// Define Story type based on AppCardProps
type Story = StoryObj<CardProps>

// --- Stories ---

export const BasicCard: Story = {
  render: args => (
    <Card {...args}>
      <Text>This is some basic content placed inside an AppCard component.</Text>
      <Text variant="caption" style={{ marginTop: theme.spacing.s }}>
        It provides structure and visual separation.
      </Text>
    </Card>
  ),
}

export const CardWithButton: Story = {
  render: args => (
    <Card {...args}>
      <Text variant="h2">Action Required</Text>
      <Text style={{ marginVertical: theme.spacing.m }}>
        Please review the details below before proceeding.
      </Text>
      <Button
        title="Review Details"
        onPress={() => Alert.alert('Button Pressed!')}
      // No need for extra margin if AppButton has its own, or add if needed:
      // style={{ marginTop: theme.spacing.m }}
      />
    </Card>
  ),
}

export const CardWithCustomStyle: Story = {
  args: { // Pass style via args for control panel interaction
    style: {
      backgroundColor: theme.colors.primary, // Primary background
      padding: theme.spacing.l, // Larger padding
      borderRadius: 16, // More rounded corners
      marginVertical: theme.spacing.l, // Larger vertical margin
    },
  },
  render: args => (
    <Card {...args}>
      <Text variant="button" style={{ color: theme.colors.surface, textAlign: 'center' }}>
        This Card Uses Custom Styles!
      </Text>
      <Text variant="caption" style={{ color: theme.colors.surface, textAlign: 'center', marginTop: theme.spacing.s }}>
        Background, padding, and radius are overridden.
      </Text>
    </Card>
  ),
}

export const MultipleCards: Story = {
  render: args => (
    // Decorator already provides a View, just render multiple cards
    <>
      <Card {...args}>
        <Text>Card 1</Text>
      </Card>
      <Card {...args}>
        <Text>Card 2</Text>
        <Text variant="body">With some more content to make it taller.</Text>
      </Card>
      <Card {...args}>
        <Text>Card 3</Text>
      </Card>
    </>
  ),
  decorators: [ // Override decorator for this story if needed, or ensure default handles list-like view
    Story => (
      <View style={styles.decoratorViewList}>
        <Story />
      </View>
    ),
  ],
}
