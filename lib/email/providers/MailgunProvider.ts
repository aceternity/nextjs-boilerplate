import Mailgun from 'mailgun-js';

import EmailProvider, { Email } from '../EmailProvider';

class MailgunProvider implements EmailProvider {
  private apiKey: string;
  private domain: string;
  private mg: Mailgun.Mailgun;

  constructor(apiKey: string, domain: string) {
    this.apiKey = apiKey;
    this.domain = domain;


    this.mg = new Mailgun({ apiKey: apiKey, domain: domain, testMode: true });
  }

  async sendEmail(email: Email): Promise<boolean> {
    const data = {
      from: 'mailgun@sandboxc83661008693411c8f7f69142c6e0de5.mailgun.org', // replace with your email
      to: email.to,
      subject: email.subject,
      text: email.body,
    };

    try {
      await this.mg.messages().send(data);
      return true;
    } catch (err) {
      console.log(this.domain, this.apiKey);
      console.error(err);
      return false;
    }
  }
}

export default MailgunProvider;
