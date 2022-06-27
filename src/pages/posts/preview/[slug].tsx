import { GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'

interface PostPreviewProps{
    post: {
        slug: string,
        title: string,
        content: string,
        updateAt: string,
    }
}

export default function PostPreview({ post } : PostPreviewProps){
    const {data: session} = useSession()
    const router = useRouter()
    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    }, [session])
    
    return (
        <>
        <Head>
            <title> {post.title} | IgNews </title>
        </Head>
        <main className={styles.container}>
            <article className={styles.post}>
                <h1>{post.title}</h1>
                <time>{post.updateAt}</time>
                <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{ __html: post.content}}></div>
                <div className={styles.continueReading}> Wanna continue reading?
                <Link href="/">
                    <a href="">Subscribe Now 🤗</a>
                </Link>
                </div>
            </article>
        </main>
        </>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [
            //{ params : {'slug: quais slugs sao mais acessados e quero gerar de forma estatica na build'} }
        ],
        fallback: 'blocking', 
        //true = carrega post pelo browser caso nao gerado de forma estatica
        //false = 404 caso nao gerado pela build
        //blocking = carrega conteudo novo pelo next atraves de server-side-rendering 
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;



   const prismic = getPrismicClient()

   const response = await prismic.getByUID('post', String(slug), {})

   const post = {
       slug,
       title: RichText.asText(response.data.title),
       content: RichText.asHtml(response.data.content.splice(0, 3)),
       updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
   }

   return {
       props: {
           post
       }, redirect: 60 * 30 //30 minutos
   }
}