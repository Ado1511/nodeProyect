export const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            message: "Access Denied: Administrative privileges are required to access this resource."
        });
    };
    return next();
};