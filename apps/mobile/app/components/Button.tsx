import type {
  GestureResponderEvent,
} from 'react-native'

import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'

export interface ButtonProps {
  text: string
  onClick?: (event: GestureResponderEvent) => void
}

const styles = StyleSheet.create({
  button: {
    maxWidth: 200,
    textAlign: 'center',
    borderRadius: 10,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 15,
    backgroundColor: '#2f80ed',
  },
  text: {
    color: 'white',
  },
})

export function Button({ text, onClick }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onClick}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}
