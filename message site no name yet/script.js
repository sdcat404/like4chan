document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const searchBar = document.getElementById('searchBar');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    const displayPosts = (filteredPosts = posts) => {
        postsContainer.innerHTML = '';
        filteredPosts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <p class="timestamp">${new Date(post.timestamp).toLocaleString()}</p>
                <button onclick="toggleCommentForm(${index})">Add Comment</button>
                <button onclick="addLike(${index})">Like (${post.likes})</button>
                <div id="commentsContainer-${index}">
                    ${post.comments.map(comment => `
                        <div class="comment">
                            <p>${comment.content}</p>
                            <p class="timestamp">${new Date(comment.timestamp).toLocaleString()}</p>
                        </div>
                    `).join('')}
                </div>
                <div id="commentFormContainer-${index}" class="comment-form-container" style="display: none;">
                    <textarea id="commentContent-${index}" placeholder="Write your comment here..." required></textarea>
                    <button onclick="addComment(${index})">Post Comment</button>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    };

    window.toggleCommentForm = (postIndex) => {
        const formContainer = document.getElementById(`commentFormContainer-${postIndex}`);
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    };

    window.addComment = (postIndex) => {
        const content = document.getElementById(`commentContent-${postIndex}`).value;
        const timestamp = Date.now();
        if (content.trim() !== "") {
            posts[postIndex].comments.push({ content, timestamp });
            localStorage.setItem('posts', JSON.stringify(posts));
            displayPosts();
        }
    };

    window.addLike = (postIndex) => {
        posts[postIndex].likes += 1;
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    };

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const timestamp = Date.now();

        posts.push({ title, content, timestamp, comments: [], likes: 0 });
        localStorage.setItem('posts', JSON.stringify(posts));

        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        displayPosts();
    });

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query));
        displayPosts(filteredPosts);
    });

    displayPosts();
});
