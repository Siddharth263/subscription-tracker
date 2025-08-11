import {Router} from 'express';

const userRouter = Router();

userRouter.get('/',  (req, res) => {
    res.send({title: 'all user'})
})

userRouter.get('/:id',  (req, res) => {
    res.send({title: 'user with mentioned id'})
})

userRouter.post('/',  (req, res) => {
    res.send({title: 'create the user'})
})

userRouter.put('/:id',  (req, res) => {
    res.send({title: 'update the user with mentioned id'})
})

userRouter.delete('/:id',  (req, res) => {
    res.send({title: 'delete the user with mentioned id'})
})

export default userRouter;