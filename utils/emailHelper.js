const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const ejs = require('ejs');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.username = user.username;
    this.url = url;
    this.from = `${process.env.NAME} <${process.env.EMAIL_FROM}>`;
  }

  async send(template, subject) {
    ejs
      .renderFile(`${__dirname}/../views/emails/${template}.ejs`, {
        username: this.username,
        url: this.url,
        subject,
      })
      .then(async (result) => {
        let html = result;
        const mailOptions = {
          from: this.from,
          to: this.to,
          subject,
          html,
          text: convert(html),
        };

        await sgMail.send(mailOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendWelcome(title) {
    await this.send('welcome', `Welcome to ${title}`);
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }

  async sendPasswordChange() {
    await this.send('passwordChanged', 'Your password has been changed');
  }
};
