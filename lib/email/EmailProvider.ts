class Email {
  to: string;
  subject: string;
  body: string;

  constructor(to: string, subject: string, body: string) {
    this.to = to;
    this.subject = subject;
    this.body = body;
  }
}


interface EmailProvider {
  sendEmail(email: Email): Promise<boolean>;
}

export {
  Email
}

export default EmailProvider;