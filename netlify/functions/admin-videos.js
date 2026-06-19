const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const VIDEOS_FILE = path.join(__dirname, '../../data/videos.json');

function ensureDataDir() {
    const dataDir = path.dirname(VIDEOS_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function getVideos() {
    ensureDataDir();
    if (!fs.existsSync(VIDEOS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(VIDEOS_FILE, 'utf8');
    return JSON.parse(data || '[]');
}

function saveVideos(videos) {
    ensureDataDir();
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
}

exports.handler = async (event, context) => {
    const method = event.httpMethod;

    if (method === 'GET') {
        const action = event.queryStringParameters?.action;

        if (action === 'list') {
            const videos = getVideos();
            return {
                statusCode: 200,
                body: JSON.stringify({ videos })
            };
        }
    }

    if (method === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const action = body.action;

            if (action === 'delete') {
                let videos = getVideos();
                videos = videos.filter(v => v.id !== body.id);
                saveVideos(videos);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ success: true })
                };
            } else {
                // Add new video
                const videos = getVideos();
                const newVideo = {
                    id: crypto.randomBytes(8).toString('hex'),
                    title: body.title,
                    url: body.url,
                    description: body.description || '',
                    createdAt: new Date().toISOString()
                };

                videos.unshift(newVideo);
                saveVideos(videos);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ success: true, video: newVideo })
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
