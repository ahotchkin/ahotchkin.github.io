import { createContext, useState } from 'react';
import matter from 'gray-matter';
import { DateTime } from 'luxon';

const BlogContext = createContext({ posts: [], loading: true });

// Dynamically import the Markdown content using template literals
function importAll(r) {
  return r.keys().map((key) => {
    const fileContent = require(
      `!!raw-loader!../components/blog/posts/${key.replace('./', '')}`
    ).default;
    const { data, content } = matter(fileContent);

    const post = {
      ...data,
      content,
      slug: key.replace('./', '').replace('.md', ''),
    };

    if (post.date) {
      const dateString = post.date;
      const isoString = dateString.replace(' ', 'T');
      const datePart = isoString.split(' ')[0];
      const dateTime = DateTime.fromISO(datePart);
      post.year = dateTime.year;
      post.formattedDate = dateTime.toFormat('MMMM d, yyyy');
    }

    return post;
  });
}

const posts = importAll(
  require.context('../components/blog/posts', false, /\.md$/)
);

const sortedPosts = posts.sort((a, b) => b.date.localeCompare(a.date));

function BlogProvider({ children }) {
  const [blogPosts] = useState(sortedPosts);
  const value = { posts: blogPosts };
  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export { BlogContext, BlogProvider };
