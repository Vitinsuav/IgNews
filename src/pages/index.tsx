import Head from 'next/head';
import { GetStaticProps } from 'next';

import { SubscribeButton } from '../components/subscribeButton';
import styles from './home.module.scss'
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}
export default function Home({ product } : HomeProps) {

  return (
    <>
      <Head>
        <title> Home | IgNews</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about the <span>React</span> World </h1>
          <p> Get access to all the publications <br />
          <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src='/images/avatar.svg' alt='Girl coding'/>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps  = async() => {
  const price = await stripe.prices.retrieve('price_1KpJJ4FXs2YOuOCpnnwUOcC5', {expand: ['product']})//busca todas informacoes price.product
  
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)//centavos

  }
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24horas
  }

}

//só usa getstatic para informações statics e nao dinamicas como usuario(pois todos os que entrarme na pag vao ver a mesma informacao se estatica)
//client side(nao precisa de indexação do google), server-side(indexação e info em tempo real), static-side(indexação e performance static)
//informações que nao precisam carregar ao mesmo tempo que a pagina(client-side, comentarios por exemplo) so atrapalham o carregamento

//conteudo(statuc)
//comentarios(dinamico e sem carregar automaticamente)