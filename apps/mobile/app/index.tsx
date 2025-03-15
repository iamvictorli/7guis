import { StyleSheet, Text, View } from 'react-native'

import { increment, selectCount } from '@7gui/state/counterSlice'
import { Button } from '~/components/Button'
import { useAppDispatch, useAppSelector } from '~/store'

function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()
  return (
    <>
      <Text>{count}</Text>
      <Button text="Increment" onClick={() => dispatch(increment(1))} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function Index() {
  return (
    <View style={styles.container}>
      <Counter />
    </View>
  )
}
