import dayjs from "dayjs";
import { createRequire} from 'module';
import Subscription from "../models/subscription.model.js";
import {sendReminderEmail} from "../utils/send-email.js";
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express')

const Reminders = [7, 5, 2, 1, 0];


export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for this subscription with id: ${subscriptionId}. Stopping Workflow`);
        return;
    }

    for(const daysBefore of Reminders) {
        const reminderDate = renewalDate.subtract(daysBefore, "days");
        if(reminderDate.isAfter(dayjs().toDate())) {
            await  sleepUntilReminders(context, `${daysBefore} days before reminder`, reminderDate);
        }

		if(dayjs().isSame(reminderDate, 'day')) {
        	await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
		}
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

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        // any push notification for the reminder

		await sendReminderEmail({
			to: subscription.user.email,
			type: label,
			subscription: subscription,
		})
    });
}