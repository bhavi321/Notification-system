const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const authenticate = async (req, res, next) => {
  try {
    let bearerToken = req.header("Authorization");
    if (!bearerToken)
      return res
        .status(400)
        .send({ status: false, message: "BearerToken is mandatory" });
    const token = req.header("Authorization").replace("Bearer ", "");

    jwt.verify(token,"secretkey",async function(err,decode){
        if(err){
            return res.status(401).send({status:false,message:err.message})
        }else{
            const user = await UserModel.findById(decode.userId);
            if (!user) {
              throw new Error();
            }
            req.user = user;
            req.decode = decode;
            console.log("consoling decode", decode)
            console.log("consoling user", user)
            next();
        }
    
    })
   
  } catch (error) {
    res.status(401).send("Please authenticate");
  }
};

module.exports = { authenticate };
