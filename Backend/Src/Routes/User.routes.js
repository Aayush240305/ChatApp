import {Router} from 'express'
import {registerUser, loginUser,getAllUsers,getUser,logoutUser, getMessages} from '../Controllers/User.controller.js'
import {verifyUser} from '../Middlewares/Verify.middleware.js'
import {upload} from '../Middlewares/Multer.middleware.js'

const userRouter = Router()

userRouter.route("/register").post(upload.single("profilePhoto"), registerUser)

userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(verifyUser,logoutUser)

userRouter.route("/getUserAll").get(verifyUser,getAllUsers)

userRouter.route("/getUser").get(verifyUser,getUser)

userRouter.route("/getMessages/:id").get(verifyUser, getMessages)

export default userRouter; 