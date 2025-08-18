import Subscription from "../models/subscription.model.js";
import {workflowClient} from "../config/upstash.js";
import {SERVER_URL} from "../config/env.js";
// import {sendReminders} from "./workflow.controller.js";

export const createSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const workflowRunId = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id,
            },
            headers: {
                "Content-Type": "application/json"
            },
            retries: 0,
        })

        res.status(201).json({
            success: true,
            data: {subscription, workflowRunId}
        });
    } catch(error) {
        next(error)
    }
}

export const getUserSubscription = async (req, res, next) =>{
    try {
        if(req.user.id !== req.params.id){
            const error = new Error("you are not authorised");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id})

        res.status(200).json({success: true, data: subscriptions});

    } catch(error) {
        next(error)
    }
}

export const getSubscription = async (req, res, next) =>{
    try {
        const userId = req.user._id;
        const subscriptionId = req.params.id;
        const subscription = await Subscription.findById(subscriptionId);

        // checking whether the subscription with this id exists or not
        if(!subscription) return res.status(404).json({
            success: false,
            message: "invalid subscription id"
        })

        // checking whether the logged-in user is the owner of the subscription or not
        if(!(subscription.user.toString() === userId.toString())) return res.status(403).json({
            success: false,
            message: "forbidden, you do not have access to this subscription",
        })

        return res.status(200).json({success: true, data: subscription});
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription) return res.status(404).json({
            success: false,
            message: "invalid subscription id"
        });

        if(subscription.user.toString() !== req.user._id.toString()) return res.status(403).json({
            success: false,
            message: "forbidden,  you do not have the access to this subscription",
        })

        const updated = await Subscription.findOneAndUpdate(
            {_id:req.params.id, user: req.user._id},
            {$set: req.body},
            {new:true, runValidators:true}
        )

        res.status(200).json({
            success: true,
            message: "subscription details has been updated",
            data: updated
        });

    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription) return res.status(404).json({
            success: false,
            message: "invalid subscription id"
        });

        if(subscription.user.toString() !== req.user._id.toString()) return res.status(403).json({
            success: false,
            message: "forbidden,  you do not have the access to this subscription",
        })

        const deleted = await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "subscription has been deleted",
            data: deleted
        })

    } catch(error) {
        next(error);
    }
}

export const cancelSubscription = async (req, res, next) =>{
    try {
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription) return res.status(404).json({
            success: false,
            message: "invalid subscription id"
        });

        if(subscription.user.toString() !== req.user._id.toString()) return res.status(403).json({
            success: false,
            message: "forbidden,  you do not have the access to this subscription",
        })

        if(subscription.status !== 'active') return res.status(409).json({
            success: false,
            message: "subscription is already either cancelled or expired",
        })

        const cancelled = await Subscription.findOneAndUpdate(
            {_id:req.params.id, user: req.user._id},
            {status: "cancelled"},
            {new: true, runValidators: true}
        )

        res.status(200).json({
            success: true,
            message: "subscription has been cancelled",
            data: cancelled,
        })

    } catch(error) {
        next(error);
    }
}