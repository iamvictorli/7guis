import { StyleSheet, Text, View } from 'react-native'

import { increment, selectCount } from '@7guis/state/counterSlice'
import { useAppDispatch, useAppSelector } from '@7guis/state/hooks'
import { Button } from '~/components/Button'

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
