
function getPathDetails() {
  const path = wi    .then(posts => {
      if (!Array.isArray(posts)) {
        throw new Error('Invalid posts data format');
      }

      // Load the blog list if we're on the blog index page
      const list = document.getElementById('blog-list');
      if (list) {
        // Sort posts by date (newest first)
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (sortedPosts.length === 0) {
          list.innerHTML = '<p>No blog posts available yet.</p>';
          return;
        }
        
        sortedPosts.forEach(post => {
          const container = document.createElement('div');
          container.className = 'blog-post';

          container.innerHTML = `
            <h3><a href="blogs/${post.file}">${post.title}</a></h3>
            <p class="description">${post.description}</p>
            <small class="date">${post.date}</small>
          `;

          list.appendChild(container);
        });
      }me.toLowerCase();
  const isInBlogDir = path.includes('/blog/');
  
  return {
    postsJson: isInBlogDir ? '../posts.json' : 'posts.json',
    blogPath: isInBlogDir ? '.' : 'blog',
    rootPath: isInBlogDir ? '..' : '.'
  };
}

function loadRecentPosts(posts) {
  const recentPosts = document.getElementById('recent-posts');
  if (!recentPosts) return;

  // Sort posts by date and take the 3 most recent
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const paths = getPathDetails();
  sortedPosts.forEach(post => {
    const container = document.createElement('div');
    container.className = 'recent-post-item';

    container.innerHTML = `
      <a href="${paths.blogPath}/blogs/${post.file}">${post.title}</a>
      <div class="date">${post.date}</div>
    `;

    recentPosts.appendChild(container);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  try {
    const paths = getPathDetails();
    const jsonPath = paths.postsJson;
  console.log('Attempting to load posts from:', jsonPath);
  
  fetch(jsonPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(posts => {
      console.log('Posts loaded successfully:', posts);
      // Load the blog list if we're on the blog index page
      const list = document.getElementById('blog-list');
      if (list) {
        // Sort posts by date (newest first)
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedPosts.forEach(post => {
          const container = document.createElement('div');
          container.className = 'blog-post';

          container.innerHTML = `
            <h3><a href="blogs/${post.file}">${post.title}</a></h3>
            <p class="description">${post.description}</p>
            <small class="date">${post.date}</small>
          `;

          list.appendChild(container);
        });
      }

      // Load recent posts in the sidebar
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