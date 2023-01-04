import { GetServerSideProps } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Stripe from "stripe"
import { stripe } from "../lib/stripe"
import { ImageContainer, SuccessContainer } from "../styles/pages/success"

interface SuccessProps {
  costumerName: string
    product: {
      name: string
      image: string
    }
}

export default function Success({ costumerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SuccessContainer>
        <h1>Compra efetuada</h1>
        <ImageContainer >
          <Image src={product.image} alt="" width={120} height={110}/>
        </ImageContainer>

        <p>
          Uhull, <strong>{costumerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa
        </p>

        <Link href="/">
          Voltar ao catalogo
        </Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      props: {},
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  
  const sessionId = String(query.session_id)

 
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  console.log(session)

  const customerName = session.customer_details.name
  const product = session.line_items.data[0].price.product as Stripe.Product


  return {
    props: {
      costumerName: customerName,
      product: {
        name: product.name,
        image: product.images[0]
      }
    },
  }
}