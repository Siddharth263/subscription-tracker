import Users from "../models/user.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
    try {
        const users = await Users.find();

        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error)  {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id).select('-password');

        if(!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            users: user
        });
    } catch (error)  {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(req.params.id).session(session);

        if(!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        if(req.body.name) user.name = req.body.name;
        if(req.body.email) user.email = req.body.email;

        if(req.body.password) {
            const newPassword = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }

        await user.save({session});
        await session.commitTransaction();
        await session.endSession();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                name: user.name,
                email: user.email,
            }
        })

    } catch(error) {
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {
                name: user.name,
                email: user.email,
            }
        })

    } catch(error) {
        next(error);
    }
}