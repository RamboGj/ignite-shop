import { useRouter } from 'next/router'

export default function Product() {
  const router = useRouter()

  const { id } = router.query
  console.log(id)
  
  return (
    <h1>Product {id}</h1>
  )
}