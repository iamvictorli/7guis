import { Container, Section } from '@radix-ui/themes'

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Container size="2" px={{ initial: '5', sm: '0' }} height="100dvh">
        <Section size={{ initial: '1', sm: '2' }} height="100%">
          {children}
        </Section>
      </Container>
    </main>
  )
}
