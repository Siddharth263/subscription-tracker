import { Router } from 'express';

const authRouter = Router();
authRouter.use('/sign-up', (req, res) => {
    res.send({title: "Sign up"});
});
authRouter.use('/sign-in', (req, res) => {
    res.send({title: "Sign in"});
});
authRouter.use('/sign-out', (req, res) => {
    res.send({title: "Sign out"});
});