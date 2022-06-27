import Head from 'next/head'
import { Container } from 'react-bootstrap'

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Vanilla WebBuilder</title>
      </Head>
      <h1>Welcome to Vanilla!</h1>
    </Container>
  )
}
