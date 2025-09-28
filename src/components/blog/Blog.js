import React, { useContext } from 'react';
import { BlogContext } from '../../context/BlogContext';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { posts, loading, error } = useContext(BlogContext);
  const postsByYear = new Map();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  posts.forEach(post => {
    if (postsByYear.has(post.year)) {
      postsByYear.get(post.year).push(post);
    } else {
      postsByYear.set(post.year, [post]);
    }
  })

  return (
    <div className="content-section">
      <h1>Blog Posts</h1>
        {Array.from(postsByYear.entries()).map(([year, posts]) => (
        <div key={year}>
          <h2 className="blog-year-header">{year}</h2>
          <div>
            <ul className="blog-post-list">
              {posts.map(post => (
                <li key={post.date} className="blog-post-item">
                  <Link to={`/blog/${post.slug}`} className="blog-post-link"> 
                    {post.title}
                    {post.subhead ? ` - ${post.subhead}` : ''}
                  </Link>
                  <span>{post.formattedDate}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Blog;