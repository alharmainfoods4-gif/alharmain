/**
 * Role Middleware
 * Role-based access control middleware
 */

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

/**
 * Check if user is wholesale
 */
const isWholesale = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'wholesale' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Wholesale privileges required.'
        });
    }

    next();
};

/**
 * Generic role checker
 * @param {...string} roles - Allowed roles
 */
const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

module.exports = {
    isAdmin,
    isWholesale,
    hasRole
};
