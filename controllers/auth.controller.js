import mongoose from 'mongoose';
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

export const signUp = async (req, res, next) => {
    // signup logic comes here
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // create a new user
        const {name, email, password} = req.body;

        // check if the user is already existing in the db
        const existingUser = await User.findOne({email})

        if(existingUser) {
            const error = new Error('User already exists');
            error.status = 409;
            throw error;
        }

        // hashing password basically securing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password: hashedPassword}], {session});

        const jwtToken = jwt.sign({userID: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN} );

        await session.commitTransaction();
        session.endSession();

        res.status(201).send({
            success: true,
            message: 'User successfully created',
            data: {
                token: jwtToken,
                user: newUsers[0],
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    // sign in logic comes here
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if (!user) {
            const error = new Error('user not found from the provided email or email is incorrect');
            error.status = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.status = 401; //unauthorised
            throw error;
        }

        const jwtToken = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(201).send({
            success: true,
            message: 'User successfully logged in',
            data: {
                token: jwtToken,
                user: user,
            }
        })

    } catch(error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    // sign out logic comes here
}