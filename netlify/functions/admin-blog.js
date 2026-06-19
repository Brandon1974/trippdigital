const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BLOG_FILE = path.join(__dirname, '../../data/blog.json');

function ensureDataDir() {
    const dataDir = path.dirname(BLOG_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function getBlogPosts() {
    ensureDataDir();
    if (!fs.existsSync(BLOG_FILE)) {
        return [];
    }
    const data = fs.readFileSync(BLOG_FILE, 'utf8');
    return JSON.parse(data || '[]');
}

function saveBlogPosts(posts) {
    ensureDataDir();
    fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2));
}

exports.handler = async (event, context) => {
    const method = event.httpMethod;

    if (method === 'GET') {
        const action = event.queryStringParameters?.action;

        if (action === 'list') {
            const posts = getBlogPosts();
            return {
                statusCode: 200,
                body: JSON.stringify({ posts })
            };
        }
    }

    if (method === 'POST') {
        try {
            const contentType = event.headers['content-type'] || '';

            if (contentType.includes('application/json')) {
                const body = JSON.parse(event.body);
                const action = body.action;

                if (action === 'delete') {
                    let posts = getBlogPosts();
                    posts = posts.filter(p => p.id !== body.id);
                    saveBlogPosts(posts);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ success: true })
                    };
                }
            } else if (contentType.includes('multipart/form-data') || event.body) {
                // Simple blog post creation
                const posts = getBlogPosts();
                const newPost = {
                    id: crypto.randomBytes(8).toString('hex'),
                    title: 'New Blog Post',
                    content: '<p>Blog content here</p>',
                    image: null,
                    date: new Date().toISOString()
                };

                posts.unshift(newPost);
                saveBlogPosts(posts);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ success: true, post: newPost })
                };
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};
