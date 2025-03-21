import { Container, Section, Skeleton } from '@radix-ui/themes'

export function IndexSkeleton() {
  return (
    <Container size="2" px={{ initial: '5', sm: '0' }}>
      <Section size={{ initial: '1', sm: '2' }}>
        <Skeleton minHeight="600px" />
      </Section>
    </Container>
  )
}
