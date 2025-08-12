import Users from "../models/user.model.js";

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