import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport, { MailOptions } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class Mail {
  private transport: nodemailer.Transporter<SMTPTransport.MailOptions>;

  constructor(private configService: ConfigService) {
    const mailConfig = configService.get('mail');

    this.transport = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
    });
  }

  async sendMail({ to, subject, text, html }: MailOptions) {
    console.log('send mail to____', to);
    return await this.transport.sendMail({
      from: 'info@tourbox.io',
      to: to,
      subject,
      text,
      html,
    });
  }
}
