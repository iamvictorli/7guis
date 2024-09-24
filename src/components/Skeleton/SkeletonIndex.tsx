import { Skeleton } from '@radix-ui/themes'

import IndexLayout from 'components/Layout/IndexLayout'

export default function SkeletenIndex() {
  return (
    <IndexLayout>
      <Skeleton height="100%" />
    </IndexLayout>
  )
}
