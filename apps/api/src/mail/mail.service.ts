import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error('Missing required SMTP configuration');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      const from = process.env.SMTP_FROM;
      if (!from) {
        throw new Error('SMTP_FROM environment variable is not set');
      }

      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });

      console.log('Email sent:', info.messageId);

      return info;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
