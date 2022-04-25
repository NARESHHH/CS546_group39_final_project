const noAuthRoutes = require('../shared/no-auth-routes.json');

module.exports = async (req, res, next) => {
    if (noAuthRoutes[req.originalUrl] && noAuthRoutes[req.originalUrl].includes(req.method)) next();
    
    else {
        if (!req.session.user) {
            return res.status(403).send('Unauthorized');
        }
        
    }
}