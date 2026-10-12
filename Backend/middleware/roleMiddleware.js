const checkRole = (roles) => {

    return (req, res, next) => {

        if (!req.session.user) {

            return res.redirect("/login");
        }

        if (!roles.includes(req.session.user.role)) {

            return res.send(
                "Access Denied"
            );
        }

        next();
    };
};

module.exports = checkRole;