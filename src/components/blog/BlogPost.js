import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { BlogContext } from '../../context/BlogContext';

import '../../styles/blog.css';

const  BlogPost = () => {
  const { posts, loading, error } = useContext(BlogContext);
  const { slug } = useParams(); // Get the slug using useParams()
  const post = posts.find((p) => p.slug === slug);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="content-section">
      <h1>{post.title}</h1>
      {post.subhead && <h2 className="blog-post-subhead">{post.subhead}</h2>}
      <p className="blog-post-date">{post.formattedDate}</p>
      <ReactMarkdown 
        children={post.content} 
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  );
}



export default BlogPost;