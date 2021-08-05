export default function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401);
    res.json({
        error: "Login required."
    })
}
