import Image from "next/future/image"
import { HomeContainer, Product } from "../styles/pages/home"

import Head from 'next/head'

import { useKeenSlider } from 'keen-slider/react'

import 'keen-slider/keen-slider.css'
import { useEffect, useState } from "react"
import { stripe } from "../lib/stripe"
import { GetServerSideProps, GetStaticProps } from "next"
import Stripe from "stripe"
import Link from "next/link"

interface HomeProps {
  products: {
    id: string
    name: string,
    imageUrl: string,
    price: string,
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  useEffect(() => { 
    setTimeout(() => {

    }, 2000)
  }, [])

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
    
        {products.map((product) => {
          return (
            <Link key={product.id} href={`/product/${product.id}`} prefetch={false}>
              <Product className="keen-slider__slide" >
                <Image src={product.imageUrl} width={520} height={480} alt=""/>

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          )
        })}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ( ) => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  console.log('response =>', response.data)


  const products = response.data.map(product => {
  const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount),
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2 // 2 hours
  }
}
