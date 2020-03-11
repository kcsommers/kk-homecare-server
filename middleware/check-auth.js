const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) { // Bearer token
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_KEY);
      req.userData = decoded;
    } else {
      return res.status(401).json({
        success: false,
        error: 'Auth Failed'
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Auth Failed'
    });
  }
  next();
};