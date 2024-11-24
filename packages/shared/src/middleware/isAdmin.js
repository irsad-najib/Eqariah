const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "requires admin access" })
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
};

module.exports = isAdmin;