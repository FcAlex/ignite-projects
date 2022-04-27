import { asHTML } from "@prismicio/helpers";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from './styles.module.scss';

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  },
  success: boolean
}

export default function Post({ post, success }: PostProps) {
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
            <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.content}} />
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

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({req});
  const { slug } = params;

  if(!session?.activeSubscription) {
    return {
      redirect: {
        destination: `posts/preview/${slug}`,
        permanent: false
      }
    };
  }

  const prismic = getPrismicClient(req);

  try {
    const response = await prismic.getByUID('post-custom-type', String(slug));
    const post = {
      slug: String(slug),
      title: response.data.title,
      content: asHTML(response.data.content),
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
      }
    }
  }
}