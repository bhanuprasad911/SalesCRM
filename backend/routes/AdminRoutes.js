import express from 'express';
import { adminMe, login, signup, updatePassword } from '../controllers/AdminControllers.js';
import { adminMiddleware } from '../middlewares/AdminMiddleWare.js';
const adminrouter = express.Router()

adminrouter.post('/signup', signup)
adminrouter.post("/login", login)
adminrouter.get("/me", adminMiddleware, adminMe)
adminrouter.patch("/updatePassword", adminMiddleware, updatePassword)

export default adminrouter;