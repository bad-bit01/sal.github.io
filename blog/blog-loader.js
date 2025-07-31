function getPathDetails() {
  const path = window.location.pathname.toLowerCase();
  const isInBlogDir = path.includes('/blog/');
  const isGitHubPages = window.location.hostname.includes('github.io');
  const repoPath = isGitHubPages ? '/saloni-journal' : '';
  
  return {
    postsJson: isInBlogDir ? '../posts.json' : 'posts.json',
    blogPath: isInBlogDir ? '.' : 'blog',
    rootPath: isInBlogDir ? '..' : '.',
    isGitHubPages: isGitHubPages,
    repoPath: repoPath
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
  const basePath = paths.isGitHubPages ? paths.repoPath : '';
  
  sortedPosts.forEach(post => {
    const container = document.createElement('div');
    container.className = 'recent-post-item';

    // Create the post path
    const postPath = paths.isInBlogDir 
      ? `blogs/${post.id}.html`
      : `${basePath}/blog/blogs/${post.id}.html`;

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
  
  sortedPosts.forEach(post => {
    const container = document.createElement('div');
    container.className = 'blog-post';

    const date = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    container.innerHTML = `
      <h3><a href="blogs/${post.id}.html">${post.title}</a></h3>
      <p class="description">${post.description}</p>
      <small class="date">${date}</small>
    `;

    list.appendChild(container);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const paths = getPathDetails();
  const basePath = paths.isGitHubPages ? paths.repoPath : '';
  const postsJsonPath = paths.isInBlogDir ? '../posts.json' : 'posts.json';
  const fullPath = `${basePath}/${postsJsonPath}`;

  console.log('Current location:', window.location.pathname);
  console.log('Loading posts from:', fullPath);

  fetch(fullPath)
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
