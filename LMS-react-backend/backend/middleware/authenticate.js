import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' })
    }
    
    const decoded = jwt.verify(token,'3988862d48ed98eed748f2487ae4bdd6ea61b9f5cd46a4cd0220db760cf2d82a')

    if(!decoded){
        return res.status(401).json({ message: 'Invalid Token' })
    }

    const user = await User.findById(decoded.id)
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }
    
    req.user = user
    console.log("iam User:", user)
    next()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error })
  }
}

export default authenticate
