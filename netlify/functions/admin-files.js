const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILES_MANIFEST = path.join(__dirname, '../../data/files.json');

function ensureDataDir() {
    const dataDir = path.dirname(FILES_MANIFEST);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function getFileManifest() {
    ensureDataDir();
    if (!fs.existsSync(FILES_MANIFEST)) {
        return [];
    }
    const data = fs.readFileSync(FILES_MANIFEST, 'utf8');
    return JSON.parse(data || '[]');
}

function saveFileManifest(files) {
    ensureDataDir();
    fs.writeFileSync(FILES_MANIFEST, JSON.stringify(files, null, 2));
}

exports.handler = async (event, context) => {
    const method = event.httpMethod;

    if (method === 'GET') {
        const action = event.queryStringParameters?.action;

        if (action === 'list') {
            const files = getFileManifest();
            return {
                statusCode: 200,
                body: JSON.stringify({ files })
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
                    let files = getFileManifest();
                    files = files.filter(f => f.id !== body.id);
                    saveFileManifest(files);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ success: true })
                    };
                }
            } else {
                // File upload would be handled by Netlify Functions with file parsing
                // For now, return a placeholder response
                const files = getFileManifest();
                const newFile = {
                    id: crypto.randomBytes(8).toString('hex'),
                    name: 'file.txt',
                    size: 0,
                    url: '/uploads/files/file.txt',
                    uploadedAt: new Date().toISOString()
                };

                files.push(newFile);
                saveFileManifest(files);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ success: true, file: newFile })
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
