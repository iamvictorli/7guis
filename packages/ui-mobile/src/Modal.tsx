import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import React from 'react'
import {
  Platform,
  Pressable,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { Text } from './Text'
import { theme } from './theme'

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: theme.colors.modalBackgroundColor,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  closeButton: {
    padding: theme.spacing.s / 2, // Make touch target slightly larger than text
  },
  closeButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 24,
    fontWeight: '300',
  },
  contentContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    maxHeight: '90%',
    maxWidth: 500,
    overflow: 'hidden',
    padding: theme.spacing.l,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
    minHeight: 30,
    paddingBottom: theme.spacing.s, // Ensure header has some minimum height even if empty
  },
  scrollView: {
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  titleArea: {
    flex: 1, // Takes up available space, pushing button right
    marginRight: theme.spacing.m, // Space between title area and button
  },
  titleText: {
    color: theme.colors.text,
  },
})

export interface ModalProps {
  /** Controls whether the modal is visible or not. */
  visible: boolean
  /** Callback function invoked when the modal requests to be closed (e.g., close button, backdrop press, hardware back button). */
  onClose: () => void
  /** The content to be displayed inside the modal. */
  children: React.ReactNode
  /** Optional title displayed at the top of the modal. */
  title?: string
  /** Optional style for the main content container View. */
  containerStyle?: StyleProp<ViewStyle>
  /** Optional style for the semi-transparent backdrop View. */
  backdropStyle?: StyleProp<ViewStyle>
  /** Hides the default 'X' close button. Set to true if providing a custom close mechanism within children. @default false */
  hideCloseButton?: boolean
  /** Allows closing the modal by pressing the backdrop. @default true */
  closeOnBackdropPress?: boolean
  /** Animation type for modal appearance ('none', 'slide', 'fade'). @default 'fade' */
  animationType?: 'none' | 'slide' | 'fade'
}

export function Modal({
  visible,
  onClose,
  children,
  title,
  containerStyle,
  backdropStyle,
  hideCloseButton = false,
  closeOnBackdropPress = true,
  animationType = 'fade',
}: ModalProps) {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose()
    }
  }

  const handleContentPress = (e: GestureResponderEvent) => {
    e.stopPropagation()
  }

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={[styles.backdrop, backdropStyle]}
        onPress={handleBackdropPress}
        accessibilityLabel="Close modal"
        accessibilityRole="button"
      >
        <Pressable
          style={[styles.contentContainer, containerStyle]}
          onPress={handleContentPress}
        >
          {(title || !hideCloseButton) && (
            <View style={styles.header}>
              {/* Left Area (for Title or Spacer) */}
              <View style={styles.titleArea}>
                {title && (
                  <Text variant="h2" style={styles.titleText} numberOfLines={1}>
                    {title}
                  </Text>
                )}
              </View>

              {!hideCloseButton && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Scrollable Content Area */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}
