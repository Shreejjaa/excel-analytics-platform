const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header)
    return res.status(401).json({ message: "Access denied. No token provided." });

  const token = header.replace("Bearer ", "").trim();

  try {
    const verified = jwt.verify(token, "shreejaSecretKey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { verifyToken, isAdmin };
