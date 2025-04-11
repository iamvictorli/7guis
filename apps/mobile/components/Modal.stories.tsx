import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import type { ModalProps } from '@victorli/7guis-ui-mobile/Modal'

import { Button } from '@victorli/7guis-ui-mobile/Button'
import { Modal } from '@victorli/7guis-ui-mobile/Modal'
import { Text } from '@victorli/7guis-ui-mobile/Text'
import { TextInput } from '@victorli/7guis-ui-mobile/TextInput'
import theme from '@victorli/7guis-ui-mobile/theme'

const styles = StyleSheet.create({
  decoratorView: {
    padding: theme.spacing.m,
    flex: 1,
    alignItems: 'center', // Center trigger button
    justifyContent: 'center', // Center trigger button
  },
  storyContainer: {
    alignItems: 'center', // Center trigger button within container
  },
  storybookNote: {
    marginTop: theme.spacing.l,
    textAlign: 'center',
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    position: 'absolute', // Position note at bottom
    bottom: theme.spacing.m,
    left: theme.spacing.m,
    right: theme.spacing.m,
  },
  storyText: {
    marginBottom: theme.spacing.m,
  },
  inputSpacing: {
    marginBottom: theme.spacing.m,
  },
})

function ModalStateWrapper({ children, triggerTitle, ...props }: Partial<ModalProps> & { children?: React.ReactNode, triggerTitle?: string }) {
  const [isVisible, setIsVisible] = useState(props.visible || false)

  const openModal = () => setIsVisible(true)
  const closeModal = () => setIsVisible(false)

  const modalProps = props

  return (
    <View style={styles.storyContainer}>
      <Button title={triggerTitle || 'Open Modal'} onPress={openModal} />
      <Modal
        {...modalProps}
        visible={isVisible}
        onClose={closeModal}
      >
        {/* Render children passed down */}
        {children}
      </Modal>
    </View>
  )
}

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    title: 'Modal Title',
    visible: false,
    hideCloseButton: false,
    closeOnBackdropPress: true,
    animationType: 'fade',
  },
  argTypes: {
    visible: { control: 'boolean' },
    title: { control: 'text' },
    hideCloseButton: { control: 'boolean' },
    closeOnBackdropPress: { control: 'boolean' },
    animationType: { control: 'select', options: ['none', 'slide', 'fade'] },
    // Disable controls for non-serializable/handled props
    children: { table: { disable: true } },
    onClose: { table: { disable: true } },
  },
  decorators: [
    Story => (
      <View style={styles.decoratorView}>
        <Story />
        <Text variant="caption" style={styles.storybookNote}>
          Note: Native Modal UI might not render correctly within the Storybook web canvas. Test on device/emulator for accurate appearance and behavior.
        </Text>
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

// --- Stories ---

export const SimpleContent: Story = {
  args: {
    title: 'Information',
    triggerTitle: 'Show Simple Modal',
  },
  render: (args) => {
    const modalContent = (
      <View>
        <Text style={styles.storyText}>
          This is the content of the modal. You can put any React components here.
        </Text>
        <Text style={styles.storyText}>
          Press the 'X' or the backdrop (if enabled) to close.
        </Text>
      </View>
    )
    return <ModalStateWrapper {...args}>{modalContent}</ModalStateWrapper>
  },
}

export const ComplexContent: Story = {
  args: {
    title: 'User Details',
    triggerTitle: 'Show Form Modal',
  },
  render: (args) => {
    const modalContent = (
      <View>
        <TextInput label="Name" placeholder="Enter your name" style={styles.inputSpacing} />
        <TextInput label="Email" placeholder="Enter your email" keyboardType="email-address" style={styles.inputSpacing} />
        <Button title="Submit" onPress={() => Alert.alert('Submit pressed!')} />
      </View>
    )
    return <ModalStateWrapper {...args}>{modalContent}</ModalStateWrapper>
  },
}

// TODO: Long content is not able to scroll
export const LongContent: Story = {
  args: {
    title: 'Terms and Conditions',
    triggerTitle: 'Show Scrollable Modal',
  },
  render: (args) => {
    const modalContent = (
      <View>
        <Text variant="h2" style={styles.storyText}>Section 1</Text>
        <Text style={styles.storyText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <Text variant="h2" style={styles.storyText}>Section 2</Text>
        <Text style={styles.storyText}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Text variant="h2" style={styles.storyText}>Section 3</Text>
        <Text style={styles.storyText}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Text variant="h2" style={styles.storyText}>Section 4</Text>
        <Text style={styles.storyText}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        {/* ... Add more sections as before ... */}
        <Text variant="h2" style={styles.storyText}>Section 5</Text>
        <Text style={styles.storyText}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
        </Text>
        <Text variant="h2" style={styles.storyText}>Section 6</Text>
        <Text style={styles.storyText}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
        </Text>
      </View>
    )
    return <ModalStateWrapper {...args}>{modalContent}</ModalStateWrapper>
  },
}

export const NoTitle: Story = {
  args: {
    title: undefined, // Set title arg to undefined
    triggerTitle: 'Show No-Title Modal',
  },
  render: (args) => {
    const modalContent = (
      <Text style={styles.storyText}>
        This modal content area has no predefined title, but it still includes the close button by default.
      </Text>
    )
    return <ModalStateWrapper {...args}>{modalContent}</ModalStateWrapper>
  },
}

function NoCloseButtonStory({ ...props }: Partial<ModalProps>) {
  const [isVisible, setIsVisible] = useState(props.visible || false)

  const openModal = () => setIsVisible(true)
  const closeModal = () => setIsVisible(false)

  const modalProps = props

  return (
    <View style={styles.storyContainer}>
      <Button title="Open Modal" onPress={openModal} />
      <Modal
        {...modalProps}
        visible={isVisible}
        onClose={closeModal}
      >
        <View>
          <Text style={styles.storyText}>
            The default 'X' button is hidden. You need to provide your own close mechanism within the children, like this button:
          </Text>
          <Button
            title="Close Me"
            onPress={closeModal} // Hook up the actual close handler
            style={{ marginTop: theme.spacing.m }}
          />
        </View>
      </Modal>
    </View>
  )
}

export const NoCloseButton: Story = {
  args: {
    title: 'Custom Close Logic',
    hideCloseButton: true,
    closeOnBackdropPress: false,
    triggerTitle: 'Show Modal Without \'X\'',
  },
  render: (args) => {
    return (
      <NoCloseButtonStory {...args} />
    )
  },
}
