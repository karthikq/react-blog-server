/** @format */
import jwt from "jsonwebtoken";

function Authmiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, "key", (err, decoded) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    console.log("no token found");
    return "no token";
  }
}

export default Authmiddleware;
