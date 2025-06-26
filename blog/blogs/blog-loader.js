
document.addEventListener("DOMContentLoaded", function () {
  fetch('../posts.json')
    .then(response => response.json())
    .then(posts => {
      const list = document.getElementById('blog-list');
      posts.forEach(post => {
        const container = document.createElement('div');
        container.className = 'blog-post';

        container.innerHTML = `
          <h3><a href="./blogs/${post.file}">${post.title}</a></h3>
          <p class="description">${post.description}</p>
          <small class="date">${post.date}</small>
        `;

        list.appendChild(container);
      });
    });
});
