import dayjs from "dayjs";
import { createRequire} from 'module';
import Subscription from "../models/subscription.model.js";
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express')

const Reminders = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for this subscriptio with id: ${subscriptionId}. Stopping Workflow`);
        return;
    }

    for(const daysBefore of Reminders) {
        const reminderDate = renewalDate.subtract(daysBefore, "days");
        if(reminderDate.isAfter(dayjs())) {
            await  sleepUntilReminders(context, `Reminder ${daysBefore} days before ${reminderDate}`);
        }
        await triggerReminder(context, `Reminder ${daysBefore} days before`);
    }

});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminders = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder for ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
        // any push notification for the reminder
    });
}