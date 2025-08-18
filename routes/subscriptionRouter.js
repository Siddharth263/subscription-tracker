import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    getSubscription,
    getUserSubscription,
    updateSubscription,
    deleteSubscription,
    cancelSubscription
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();
subscriptionRouter.use(authorize);

subscriptionRouter.get('/:id', getSubscription);

subscriptionRouter.post('/', createSubscription);

subscriptionRouter.put('/:id', updateSubscription);

subscriptionRouter.delete('/:id', deleteSubscription);

subscriptionRouter.get('/user/:id', getUserSubscription);

subscriptionRouter.put('/:id/cancel', cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: "get upcoming renewals subscriptions"})
});

export default subscriptionRouter;