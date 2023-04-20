import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mdrashidmeraj2002@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app ${name}. Let me know how you get along with the app.`
    });
};

export const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mdrashidmeraj2002@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    });
};
