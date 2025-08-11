import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'User name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email:{
        type:String,
        required:[true, 'User email is required'],
        trim: true,
        unique:true,
        lowercase:true,
        match:[/\S+@\S+.\.\S+/, 'enter a valid email address'],
        minlength: 5,
        maxlength: 255
    },
    password:{
        type:String,
        required:[true, 'User password is required'],
        minlength: 5,
        maxlength: 255,
    }
}, { timestamps: true });

const User = mongoose.model('User', usersSchema);

export default User;