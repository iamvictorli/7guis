import { Container, Section, Skeleton } from '@radix-ui/themes'

export default function SkeletenIndex() {
  return (
    <Container size="2" px={{ initial: '5', sm: '0' }}>
      <Section size={{ initial: '1', sm: '2' }} height="100dvh">
        <Skeleton height="100%" />
      </Section>
    </Container>
  )
}
