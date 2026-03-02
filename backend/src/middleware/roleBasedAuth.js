// middleware/roleBasedAuth.js

// Admin only access
export const adminOnly = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only."
        });
    }
    next();
};

// Teacher only access
export const teacherOnly = (req, res, next) => {
    if (req.user.role !== "TEACHER") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Teacher only."
        });
    }
    next();
};

// Student only access
export const studentOnly = (req, res, next) => {
    if (req.user.role !== "STUDENT") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Student only."
        });
    }
    next();
};