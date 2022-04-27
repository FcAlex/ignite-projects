import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({posts}: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts && posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>
                  {post.excerpt}
                </p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getAllByType("post-custom-type", {
    fetch: ["post-custom-type.title", "post-custom-type.content", "post-custom-type.excerpt"],
    pageSize: 100
  });


  response.forEach(a => console.log(a))

  const posts = response.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: post.data.excerpt,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    },
  };
};
