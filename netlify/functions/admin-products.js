const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');

function ensureDataDir() {
    const dataDir = path.dirname(PRODUCTS_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function getProducts() {
    ensureDataDir();
    if (!fs.existsSync(PRODUCTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
}

function saveProducts(products) {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function saveUploadedFile(buffer, originalName) {
    const uploadsDir = path.join(__dirname, '../../uploads/products');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${crypto.randomBytes(8).toString('hex')}-${Date.now()}-${originalName}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/products/${fileName}`;
}

exports.handler = async (event, context) => {
    const method = event.httpMethod;

    if (method === 'GET') {
        const action = event.queryStringParameters?.action;

        if (action === 'list') {
            const products = getProducts();
            return {
                statusCode: 200,
                body: JSON.stringify({ products })
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
                    let products = getProducts();
                    products = products.filter(p => p.id !== body.id);
                    saveProducts(products);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ success: true })
                    };
                }
            } else if (contentType.includes('multipart/form-data')) {
                // Handle file upload - parse multipart data
                // For now, return a simple response
                const products = getProducts();
                const newProduct = {
                    id: crypto.randomBytes(8).toString('hex'),
                    name: event.body.name || 'Product',
                    price: event.body.price || '0',
                    description: event.body.description || '',
                    payhipLink: event.body.payhipLink || '',
                    image: null,
                    createdAt: new Date().toISOString()
                };

                products.push(newProduct);
                saveProducts(products);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ success: true, product: newProduct })
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
