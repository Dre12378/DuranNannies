export async function fetchAPI(query: string, { variables }: { variables?: Record<string, any> } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    // This part is key:
    // 'no-store' means it always fetches fresh data (good for development)
    // In production, we'll use revalidation to manage the cache.
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

// EXAMPLE QUERY: Get all post slugs
export async function getAllPostSlugs() {
  const data = await fetchAPI(`
    query AllPostSlugs {
      posts(first: 10000) {
        nodes {
          slug
        }
      }
    }
  `);
  return data?.posts.nodes;
}

// EXAMPLE QUERY: Get a single post by slug, including ACF fields
export async function getPostBySlug(slug: string) {
  const data = await fetchAPI(`
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        content
        slug
        # This queries your ACF field group with GraphQL Field Name "postSettings"
        postSettings {
          subtitle # An example ACF field
        }
      }
    }
  `, {
    variables: { id: slug }
  });
  return data?.post;
}