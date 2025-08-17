import mongoose from 'mongoose';
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import redis from "../config/redis.js";

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
        await session.endSession();

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
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) return res.status(401).json({message: 'Unauthorized'});

        const decoded = jwt.decode(token);
        if(!decoded) {
            return res.status(500).json({message: 'invalid token'});
        }

        const exp = decoded.exp;
        const ttl = exp - Math.floor(Date.now() / 1000);

        if(ttl > 0) {
            await redis.set(token, "blacklisted", 'ex', ttl);
        }

        res.status(200).json({
            success: true,
            message: 'Logged out successfully, token blacklisted',
        })


    } catch (error) {
        next(error)
    }
}