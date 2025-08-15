import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'subscription name is required'],
        minLength: 2,
        maxLength: 255,
    },

    price: {
        type: Number,
        required: [true, 'subscription price is required'],
        min:[0, 'pirce must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'INR', 'EUR'],
        default: 'INR'
    },
    frequency: {
        type: String,
        enum: ['daily','weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'entertainment', 'lifestyle', 'tech', 'finance', 'other'],
    },
    paymentMethod: {
        type: String,
        required: [true, 'subscription methods is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'subscription startDate is required'],
        validate: {
            validator:  (value) => value <= new Date(),
            message: 'start date must be in the past as you cannot start a subscription in the future',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator:  function (value) {
                return value > this.startDate
            },
            message: 'renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'subscription user is required'],
        index: true,
    }
}, {timestamps: true});

// auto calculate the renewal date if not provided by the user

subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

// auto update status based on renewal date
    if(this.renewalDate < new Date()) {
        this.statur = 'expired'
    }

    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;