import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}

export function isArtist(req, res, next) {
  if (req.user.role !== "artist") {
    return res.status(403).json({
      success: false,
      message: "Only artists can create songs",
    });
  }

  next();
}
