import crypto from 'crypto';

const csrfTokenMap = new Map(); // For simplicity, in production use Redis

export const csrfProtection = (req, res, next) => {
    const method = req.method;
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        return next();
    }

    const token = req.headers['x-csrf-token'];
    const cookieToken = req.cookies['csrf-token'];

    if (!token || !cookieToken || token !== cookieToken) {
        return res.status(403).json({
            success: false,
            code: 'CSRF_ERROR',
            message: 'Invalid or missing CSRF token',
        });
    }

    next();
};

export const generateCsrfToken = (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf-token', token, {
        httpOnly: false, // Must be accessible by JS to send in header
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    res.json({ csrfToken: token });
};
