import { Button, Flex, Heading } from '@radix-ui/themes'
import { useAppDispatch, useAppSelector } from '~/store'

import { increment, selectCount } from 'state/counterSlice'

export default function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <Flex align="center" gap="4">
      <Heading size="9" as="h4">
        {count}
      </Heading>
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
