import { asHTML } from "@prismicio/helpers";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from './../styles.module.scss';

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  },
  success: boolean
}

export default function PostPreview({ post, success }: PostProps) {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(data?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [data, post, router])

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      {success ? (
          <main className={styles.container}>
            <article className={styles.post}>
              <h1>{post.title}</h1>
              <time>{post.updatedAt}</time>
              <div className={`${styles.postContent} ${styles.previewContent}`} 
                dangerouslySetInnerHTML={{__html: post.content}} />
            
              <div className={styles.continueReading}>
                Wanna continue reading?
                <Link href='/'>
                  <a>Subscribe now 🤗</a>
                </Link>
              </div>
            </article>
        </main>
      ) :
      <main className={styles.container}>
        <article className={styles.postNotFound}>
          <h1>Artigo não encontrado.</h1>
        </article>
      </main>
      }
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  try {
    const response = await prismic.getByUID('post-custom-type', String(slug));
    const post = {
      slug: String(slug),
      title: response.data.title,
      content: asHTML(response.data.content.splice(0, 3)),
      updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };

    return {
      props: {
        post,
        success: true
      }
    }

  } catch (err) {
    return {
      props: {
        success: false,
        post: {}
      },
      revalidate: 60 * 60 // 1hrs
    }
  }
}