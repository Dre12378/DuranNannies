import { getPostBySlug, getAllPostSlugs } from "@/src/lib/wordpress";

// This tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const allPosts = await getAllPostSlugs();
  return allPosts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// This is the page component
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      {/* Use the ACF field */}
      {post.postSettings?.subtitle && <h2>{post.postSettings.subtitle}</h2>}
      
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}