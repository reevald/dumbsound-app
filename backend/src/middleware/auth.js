// Rule:
// "0" = user
// "1" = admin

const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  
  const authHeader = req.header("Authorization");
  // Extract authHeader = "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  // Avoid error in console browser with remove status (401) => (200)
  if (!token || token === "undefined") return res.status(401).send({
    status: "failed",
    message: "Unauthorized"
  });

  try {
    const dataUserVerified = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = dataUserVerified;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "invalid token"
    });
  }
}

exports.adminOnly = (req, res, next) => {
  if (req.user.listAs && req.user.listAs === "1") {
    return next();
  }
  res.status(403).send({
    status: "failed",
    message: "Forbidden"
  });
}