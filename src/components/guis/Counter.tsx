import { Button, Flex, Text } from '@radix-ui/themes'
import { useAppDispatch, useAppSelector } from '~/store'

import { increment, selectCount } from 'state/counterSlice'

function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <Flex align="center" gap="4">
      <Text size="9" data-testid="count">
        {count}
      </Text>
      <Button
        color="gray"
        variant="solid"
        highContrast
        onClick={() => dispatch(increment(1))}>
        Increment
      </Button>
    </Flex>
  )
}

export default Counter
