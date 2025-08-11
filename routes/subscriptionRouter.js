import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({title: "get all subscriptions"})
})

subscriptionRouter.get('/:id', (req, res) => {
    res.send({title: "get subscription as per mentioned id"})
})

subscriptionRouter.post('/', (req, res) => {
    res.send({title: "create subscriptions"})
})

subscriptionRouter.put('/:id', (req, res) => {
    res.send({title: "update subscriptions as per mentioned id"})
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: "delete a subscription as per mentioned id"})
})

subscriptionRouter.get('/user/:id', (req, res) => {
    res.send({title: "get a subscription of the user id"})
})

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({title: "cancel a specific subscription as per mentioned id"})
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: "get upcoming renewals subscriptions"})
})



export default subscriptionRouter;