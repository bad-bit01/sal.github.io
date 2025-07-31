function renderPostContent(content) {
  let html = '';
  
  content.forEach(item => {
    switch(item.type) {
      case 'paragraph':
        html += `<p>${item.text}</p>`;
        break;
      case 'heading':
        html += `<h${item.level}>${item.text}</h${item.level}>`;
        break;
      case 'list':
        const listType = item.style === 'ordered' ? 'ol' : 'ul';
        html += `<${listType}>`;
        item.items.forEach(li => {
          html += `<li>${li}</li>`;
        });
        html += `</${listType}>`;
        break;
    }
  });
  
  return html;
}

function loadPost() {
  // Get the post ID from the URL
  const postId = window.location.pathname.split('/').pop().replace('.html', '');
  const isGitHubPages = window.location.hostname.includes('github.io');
  const repoPath = isGitHubPages ? '/saloni-journal' : '';
  const path = window.location.pathname.toLowerCase();
  const isInBlogDir = path.includes('/blog/');
  const basePath = `${repoPath}/${isInBlogDir ? '..' : '.'}/blog`;
  
  console.log('Loading post from:', `${basePath}/posts/${postId}.json`);
  
  // Fetch the post JSON
  fetch(`${basePath}/posts/${postId}.json`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(post => {
      // Set the title
      document.title = post.title;
      document.querySelector('.post-title').textContent = post.title;
      
      // Set the date
      const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      document.querySelector('.post-date').textContent = date;
      
      // Render the content
      document.querySelector('.post-body').innerHTML = renderPostContent(post.content);
    })
    .catch(error => {
      console.error('Error loading post:', error);
      document.querySelector('.post-body').innerHTML = 
        `<p>Error loading post content: ${error.message}</p>`;
    });
}

document.addEventListener('DOMContentLoaded', loadPost);
