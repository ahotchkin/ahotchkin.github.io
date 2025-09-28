import React, { useContext } from 'react';
import { BlogContext } from '../../context/BlogContext';
import { Link } from 'react-router-dom';

const BlogPreview = () => {
  const { posts, loading, error } = useContext(BlogContext);
  const latestBlogPosts = posts.slice(0, 4); // <--- Changed from 3 to 4

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (latestBlogPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">No recent blog posts available.</div>
    );
  }

  return (
    <div className="content-section">
      <h2>✏️ Latest Blog Posts</h2>
      <div className="blog-preview">
        <ul className="blog-post-list">
          {latestBlogPosts.map(post => (
            <li key={post.id} className="blog-post-item">
              <Link to={`/blog/${post.slug}`} className="blog-post-link">
                {post.title}
              </Link>
              <span>{post.formattedDate}</span>
            </li>
          ))}
        </ul>
        <br/>
        <div>
          <Link to="/blog">
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPreview;