import {Router} from 'express';
import {deleteUser, getUser, getUsers, updateUser} from "../controllers/user.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();
userRouter.use(authorize);

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser)

userRouter.put('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;