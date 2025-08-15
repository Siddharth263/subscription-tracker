import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import{createSubscription, getUserSubscription} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({title: "get all subscriptions"})
})

subscriptionRouter.get('/:id', (req, res) => {
    res.send({title: "get subscription as per mentioned id"})
})

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {
    res.send({title: "update subscriptions as per mentioned id"})
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: "delete a subscription as per mentioned id"})
})

subscriptionRouter.get('/user/:id', authorize, getUserSubscription);

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({title: "cancel a specific subscription as per mentioned id"})
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: "get upcoming renewals subscriptions"})
})



export default subscriptionRouter;