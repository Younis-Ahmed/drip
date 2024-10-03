import getPosts from '@/server/actions/get-posts';
import createPost from '@/server/actions/create-posts';
import PostButton from '@/components/post-button';

export default async function Home() {
  const { error, success } = await getPosts();
  if (error) throw new Error(error);
  if (success) {
    return (
      <main>
        <h1>Home Page</h1>
        {success.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
          </div>
        ))}
        <form action={createPost}>
          <input className='bg-black' type='text' placeholder='Title' />
          <PostButton />
        </form>
      </main>
    );
  }
}
