// Check authentication
function checkAuth() {
    if (!localStorage.getItem('adminToken')) {
        window.location.href = '/admin-login.html';
        return false;
    }
    return true;
}

if (!checkAuth()) {
    throw new Error('Not authenticated');
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(section).classList.add('active');

        if (section === 'products') loadProducts();
        if (section === 'blog') loadBlogPosts();
        if (section === 'videos') loadVideos();
        if (section === 'files') loadFiles();
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login.html';
});

// Message display
function showMessage(text, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}

// ========== PRODUCTS ==========
let products = [];

document.getElementById('newProductBtn').addEventListener('click', () => {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('productFormElement').reset();
});

document.getElementById('cancelProductBtn').addEventListener('click', () => {
    document.getElementById('productForm').style.display = 'none';
});

document.getElementById('productImage').addEventListener('change', (e) => {
    document.getElementById('productImageName').textContent = e.target.files[0]?.name || '';
});

document.getElementById('productFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('payhipLink', document.getElementById('productPayhipLink').value);

    const imageFile = document.getElementById('productImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('/.netlify/functions/admin-products', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            showMessage('Product saved successfully!');
            document.getElementById('productForm').style.display = 'none';
            loadProducts();
        } else {
            showMessage('Error saving product: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

async function loadProducts() {
    try {
        const response = await fetch('/.netlify/functions/admin-products?action=list');
        const data = await response.json();
        products = data.products || [];
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts() {
    const list = document.getElementById('productsList');
    list.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.image ? `<img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;">` : '📦'}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                <div style="font-size: 13px; color: #666; margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis;">${product.description}</div>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPayhipLink').value = product.payhipLink;
        document.getElementById('productForm').style.display = 'block';
        document.getElementById('productForm').setAttribute('data-edit-id', id);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch('/.netlify/functions/admin-products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });

        const data = await response.json();
        if (data.success) {
            showMessage('Product deleted!');
            loadProducts();
        } else {
            showMessage('Error deleting product', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// ========== BLOG ==========
let blogPosts = [];

document.getElementById('newBlogBtn').addEventListener('click', () => {
    document.getElementById('blogForm').style.display = 'block';
    document.getElementById('blogFormElement').reset();
    document.getElementById('blogContent').innerHTML = '';
});

document.getElementById('cancelBlogBtn').addEventListener('click', () => {
    document.getElementById('blogForm').style.display = 'none';
});

document.getElementById('blogImage').addEventListener('change', (e) => {
    document.getElementById('blogImageName').textContent = e.target.files[0]?.name || '';
});

// Rich text editor
document.querySelectorAll('.editor-toolbar button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const command = btn.getAttribute('data-command');
        const value = btn.getAttribute('data-value');

        if (command === 'createLink') {
            const url = prompt('Enter URL:');
            if (url) document.execCommand(command, false, url);
        } else if (value) {
            document.execCommand(command, false, value);
        } else {
            document.execCommand(command, false, null);
        }
    });
});

document.getElementById('blogFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('blogTitle').value);
    formData.append('content', document.getElementById('blogContent').innerHTML);

    const imageFile = document.getElementById('blogImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('/.netlify/functions/admin-blog', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            showMessage('Blog post published!');
            document.getElementById('blogForm').style.display = 'none';
            loadBlogPosts();
        } else {
            showMessage('Error publishing post: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

async function loadBlogPosts() {
    try {
        const response = await fetch('/.netlify/functions/admin-blog?action=list');
        const data = await response.json();
        blogPosts = data.posts || [];
        renderBlogPosts();
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function renderBlogPosts() {
    const list = document.getElementById('blogList');
    list.innerHTML = '';

    blogPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-post-card';
        const date = new Date(post.date).toLocaleDateString();
        card.innerHTML = `
            <div class="blog-title">${post.title}</div>
            <div class="blog-meta">Published on ${date}</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; max-height: 60px;">${post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</div>
            <div class="blog-actions">
                <button class="btn btn-secondary" onclick="editBlogPost('${post.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteBlogPost('${post.id}')">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

async function deleteBlogPost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetch('/.netlify/functions/admin-blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });

        const data = await response.json();
        if (data.success) {
            showMessage('Post deleted!');
            loadBlogPosts();
        } else {
            showMessage('Error deleting post', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// ========== VIDEOS ==========
let videos = [];

document.getElementById('newVideoBtn').addEventListener('click', () => {
    document.getElementById('videoForm').style.display = 'block';
    document.getElementById('videoFormElement').reset();
});

document.getElementById('cancelVideoBtn').addEventListener('click', () => {
    document.getElementById('videoForm').style.display = 'none';
});

document.getElementById('videoFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('videoUrl').value;
    let embedUrl = '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
    } else {
        showMessage('Invalid YouTube or Vimeo URL', 'error');
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/admin-videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: document.getElementById('videoTitle').value,
                url: embedUrl,
                description: document.getElementById('videoDescription').value
            })
        });

        const data = await response.json();
        if (data.success) {
            showMessage('Video added!');
            document.getElementById('videoForm').style.display = 'none';
            loadVideos();
        } else {
            showMessage('Error adding video: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

async function loadVideos() {
    try {
        const response = await fetch('/.netlify/functions/admin-videos?action=list');
        const data = await response.json();
        videos = data.videos || [];
        renderVideos();
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function renderVideos() {
    const list = document.getElementById('videoList');
    list.innerHTML = '';

    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div style="font-weight: 600; margin-bottom: 10px;">${video.title}</div>
                <iframe width="100%" height="315" src="${video.url}" frameborder="0" allowfullscreen style="border-radius: 6px;"></iframe>
                <div style="font-size: 13px; color: #666; margin-top: 10px;">${video.description}</div>
            </div>
            <button class="btn btn-danger" onclick="deleteVideo('${video.id}')">Delete Video</button>
        `;
        list.appendChild(card);
    });
}

async function deleteVideo(id) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch('/.netlify/functions/admin-videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });

        const data = await response.json();
        if (data.success) {
            showMessage('Video deleted!');
            loadVideos();
        } else {
            showMessage('Error deleting video', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// ========== FILES ==========
let files = [];

document.getElementById('uploadFileBtn').addEventListener('click', () => {
    document.getElementById('fileUploadForm').style.display = 'block';
});

document.getElementById('cancelFileBtn').addEventListener('click', () => {
    document.getElementById('fileUploadForm').style.display = 'none';
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    document.getElementById('fileName').textContent = e.target.files[0]?.name || '';
});

document.getElementById('fileFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', document.getElementById('fileInput').files[0]);

    try {
        const response = await fetch('/.netlify/functions/admin-files', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            showMessage('File uploaded!');
            document.getElementById('fileUploadForm').style.display = 'none';
            loadFiles();
        } else {
            showMessage('Error uploading file: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

async function loadFiles() {
    try {
        const response = await fetch('/.netlify/functions/admin-files?action=list');
        const data = await response.json();
        files = data.files || [];
        renderFiles();
    } catch (error) {
        console.error('Error loading files:', error);
    }
}

function renderFiles() {
    const list = document.getElementById('fileList');
    list.innerHTML = '';

    files.forEach(file => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">📄 ${file.name}</div>
                    <div style="font-size: 13px; color: #666;">${(file.size / 1024).toFixed(2)} KB</div>
                </div>
                <div>
                    <a href="${file.url}" class="btn btn-secondary" target="_blank" style="text-decoration: none; margin-right: 10px;">View</a>
                    <button class="btn btn-danger" onclick="deleteFile('${file.id}')">Delete</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

async function deleteFile(id) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch('/.netlify/functions/admin-files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });

        const data = await response.json();
        if (data.success) {
            showMessage('File deleted!');
            loadFiles();
        } else {
            showMessage('Error deleting file', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}
