import EmailProvider, { Email } from "./EmailProvider";

import SMTPProvider from "./providers/SMTPProvider";

class EmailService {
  private provider: EmailProvider;

  private static instance: EmailService;

  private constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  static getInstance(provider: EmailProvider): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService(provider);
    }
    return EmailService.instance;
  }

  async sendEmail(email: Email): Promise<boolean> {
    // Call the sendEmail method on the email provider
    return this.provider.sendEmail(email);
  }
}

const emailProvider: EmailProvider = new SMTPProvider({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT as unknown as number,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  }, process.env.FROM_EMAIL as string
)

const mail: EmailService = EmailService.getInstance(emailProvider);

export default mail;