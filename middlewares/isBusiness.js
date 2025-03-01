export const isBusiness = (req, res, next) => {
    if (!req.user.isBusiness) {
        return res.status(403).json({ message: "Access Denied: This feature is available for business accounts only." });
    };
    return next();
};