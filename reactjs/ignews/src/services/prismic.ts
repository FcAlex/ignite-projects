import { createClient } from '@prismicio/client';
import fetch from 'node-fetch';

export function getPrismicClient(req?: unknown) {
  const prismic = createClient(
    process.env.PRISMIC_ENDPOINT,
    {      
      accessToken: process.env.PRISMIC_ACESS_TOKEN,
      fetch
    }
  )

  return prismic;
}