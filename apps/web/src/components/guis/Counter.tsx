import { Button, Flex, Text } from '@radix-ui/themes'

import { increment, selectCount } from '@7gui/state/counterSlice'

import { useAppDispatch, useAppSelector } from '~/store'

export default function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <Flex align="center" gap="4">
      <Text size="9" weight="bold" data-testid="count">
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
