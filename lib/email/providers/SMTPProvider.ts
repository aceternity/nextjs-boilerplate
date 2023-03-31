import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import EmailProvider, { Email } from '../EmailProvider';

class SMTPProvider implements EmailProvider {
  private client: nodemailer.Transporter;
  private fromEmail: string;
  constructor(config: SMTPTransport | SMTPTransport.Options, fromEmail: string) {
    this.fromEmail = fromEmail;
    this.client = nodemailer.createTransport(config);
  }

  async sendEmail(email: Email): Promise<boolean> {
    const data: Mail.Options = {
      from: this.fromEmail, // replace with your email
      to: email.to,
      subject: email.subject,
      html: email.body,
    };

    try {
      await this.client.sendMail(data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default SMTPProvider;
