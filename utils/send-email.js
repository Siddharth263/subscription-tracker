import {emailTemplates} from "./email-template.js";
import dayjs from "dayjs";
import {transporter, accountEmail} from "../config/nodemailer.js";

export const sendReminderEmail = async ({to, type, subscription}) => {
	if(!to || !type) throw new Error("Missing Required Parameters");

	const template = emailTemplates.find((t) => t.label === type);

	if(!template) throw new Error("Invalid Email Template");
	const mailInfo = {
		userName: subscription.user.name,
		subscriptionName: subscription.name,
		plan: `${subscription.frequency}`,
		renewalDate: dayjs(subscription.renewalDate).format('MMM D YYYY'),
		price: `${subscription.currency} ${subscription.price}`,
		paymentMethod: subscription.paymentMethod,
	}

	const message = template.generateBody(mailInfo);
	const subject = template.generateSubject(mailInfo);

	const mailOptions = {
		from: accountEmail,
		to: to,
		subject: subject,
		html: message,
	}

	await transporter.sendMail(mailOptions, (error, info) => {
		if (error) return console.log(error, 'Error sending email');

		console.log("Email sent to: " + info.response);
	});
}