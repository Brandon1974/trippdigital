const crypto = require('crypto');

// In production, use environment variables for the admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { password } = JSON.parse(event.body);

        if (password === ADMIN_PASSWORD) {
            const token = generateToken();
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    token: token
                })
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid password'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
