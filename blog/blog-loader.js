function getPathDetails() {
  const path = window.location.pathname.toLowerCase();
  const isGitHubPages = window.location.hostname.includes('github.io');
  const isInBlogDir = path.includes('/blog/');
  const isInBlogPost = path.includes('/blog/blogs/');
  const repoPath = isGitHubPages ? '/saloni-journal' : '';
  
  if (isGitHubPages) {
    return {
      postsJson: '/saloni-journal/posts.json',
      blogPath: '/saloni-journal/blog',
      rootPath: '/saloni-journal',
      isGitHubPages,
      isInBlogDir,
      isInBlogPost
    };
  }
  
  // For local development
  let pathPrefix;
  if (isInBlogPost) {
    pathPrefix = '../..';
  } else if (isInBlogDir) {
    pathPrefix = '..';
  } else {
    pathPrefix = '.';
  }
  
  return {
    postsJson: `${pathPrefix}/posts.json`,
    blogPath: `${pathPrefix}/blog`,
    rootPath: pathPrefix,
    isGitHubPages,
    isInBlogDir,
    isInBlogPost
  };
}

function loadRecentPosts(posts) {
  const recentPosts = document.getElementById('recent-posts');
  if (!recentPosts) return;

  // Clear existing content
  recentPosts.innerHTML = '';

  // Sort posts by date and take the 3 most recent
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const paths = getPathDetails();
  
  // Create a mapping of posts to their original indices
  const postIndices = new Map(posts.map((post, index) => [post.title, index + 1]));
  
  sortedPosts.forEach(post => {
    const container = document.createElement('div');
    container.className = 'recent-post-item';

    // Get the original index for this post
    const postId = postIndices.get(post.title).toString();
    const postPath = paths.isInBlogDir ? `blogs/${postId}.html` : `blog/blogs/${postId}.html`;

    const date = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    container.innerHTML = `
      <a href="${postPath}">${post.title}</a>
      <div class="date">${date}</div>
    `;

    recentPosts.appendChild(container);
  });
}

function loadBlogPost() {
  const postId = window.location.pathname.split('/').pop().replace('.html', '');
  const paths = getPathDetails();
  
  fetch(paths.postsJson)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(posts => {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Update page title and blog title
      document.title = post.title;
      const titleElement = document.getElementById('blog-title');
      if (titleElement) {
        titleElement.textContent = post.title;
      }
      
      // Update blog content, stripping out the title
      const contentElement = document.getElementById('blog-content');
      if (contentElement) {
        let content = post.content;
        // Remove the h1 title since we display it separately
        content = content.replace(/<h1>.*?<\/h1>/, '').trim();
        // If content starts with a newline or paragraph after title removal, clean that up too
        content = content.replace(/^(?:\s*<br\s*\/?>\s*|\s*<p>\s*<\/p>\s*)*/, '');
        contentElement.innerHTML = content || 'No content available.';
      }
    })
    .catch(error => {
      console.error('Error loading post:', error);
      const contentElement = document.getElementById('blog-content');
      if (contentElement) {
        contentElement.innerHTML = `Error loading post: ${error.message}`;
      }
    });
}

function loadBlogList(posts) {
  const list = document.getElementById('blog-list');
  if (!list) return;

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedPosts.length === 0) {
    list.innerHTML = '<p>No blog posts available yet.</p>';
    return;
  }
  
  list.innerHTML = ''; // Clear any existing content
  
  const paths = getPathDetails();
  
  sortedPosts.forEach((post, index) => {
    const container = document.createElement('div');
    container.className = 'blog-post';

    const date = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Use index + 1 as the file name if id is not present
    const postId = (index + 1).toString();
    const postPath = paths.isInBlogDir ? `blogs/${postId}.html` : `blog/blogs/${postId}.html`;

    container.innerHTML = `
      <h3><a href="${postPath}">${post.title}</a></h3>
      <p class="description">${post.description}</p>
      <small class="date">${date}</small>
    `;

    list.appendChild(container);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const paths = getPathDetails();
  console.log('Path details:', paths);
  console.log('Current location:', window.location.pathname);
  console.log('Loading posts from:', paths.postsJson);

  // Load blog post content if we're on a blog post page
  if (window.location.pathname.includes('/blog/blogs/')) {
    loadBlogPost();
  }

  fetch(paths.postsJson)
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(posts => {
      console.log('Posts loaded:', posts);
      if (!Array.isArray(posts)) {
        throw new Error('Invalid posts data format');
      }
      
      loadBlogList(posts);
      loadRecentPosts(posts);
    })
    .catch(error => {
      console.error('Error loading posts:', error);
      const list = document.getElementById('blog-list');
      if (list) {
        list.innerHTML = `<p>Error loading blog posts: ${error.message}</p>`;
      }
      const recentPosts = document.getElementById('recent-posts');
      if (recentPosts) {
        recentPosts.innerHTML = `<p>Error loading recent posts: ${error.message}</p>`;
      }
    });
});
