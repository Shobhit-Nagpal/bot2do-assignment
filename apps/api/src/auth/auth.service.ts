import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { InitiateSignUpDto, VerifySignUpDto, CompleteSignUpDto, ResendOtpDto, ResetPasswordDto } from './dto/sign-up.dto';
import { SignUpStatus } from 'generated/prisma';
import { generateOtp, generateToken, hashPassword, verifyPassword, verifyToken } from './auth.utils';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private mailer: MailService,
    private redis: RedisService,
  ) {}

  async initiateSignUp(initiateSignUpDto: InitiateSignUpDto) {
    const userExists = await this.db.user.findFirst({
      where: {
        email: initiateSignUpDto.email,
      },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const existingSignUpSession = await this.db.signUpSessions.findFirst({
      where: {
        email: initiateSignUpDto.email,
      },
    });

    let signUpSession;
    const otp = generateOtp();

    if (existingSignUpSession) {
      if (existingSignUpSession.expiresAt < new Date()) {
        await this.db.signUpSessions.delete({
          where: {
            id: existingSignUpSession.id,
          },
        });
        
        signUpSession = await this.db.signUpSessions.create({
          data: {
            email: initiateSignUpDto.email,
            status: SignUpStatus.OTP_PENDING,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
          },
        });
      } else {
        signUpSession = existingSignUpSession;
      }
    } else {
      signUpSession = await this.db.signUpSessions.create({
        data: {
          email: initiateSignUpDto.email,
          status: SignUpStatus.OTP_PENDING,
          expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
        },
      });
    }

    await this.redis.set(signUpSession.id, otp, 1000 * 60 * 5);

    await this.mailer.sendMail(signUpSession.email, 'OTP', otp);

    return {
      data: {
        email: signUpSession.email,
      },
      error: null,
    };
  } 

  async verifySignUp(verifySignUpDto: VerifySignUpDto) {
    const signUpSession = await this.db.signUpSessions.findFirst({
      where: {
        email: verifySignUpDto.email,
      },
    });

    if (!signUpSession) {
      throw new Error('Sign up session not found');
    }

    const otp = await this.redis.get(signUpSession.id);

    if (otp !== verifySignUpDto.otp) {
      throw new Error('Invalid OTP');
    }
    
    await this.db.signUpSessions.update({
      where: {
        id: signUpSession.id,
      },
      data: {
        status: SignUpStatus.COMPLETED,
      },
    });

    return {
      data: {
        email: signUpSession.email,
      },
      error: null,
    };
  }

  async completeSignUp(completeSignUpDto: CompleteSignUpDto) {
    return await this.db.$transaction(async (tx) => {
      const signUpSession = await tx.signUpSessions.findFirst({
        where: {
          email: completeSignUpDto.email,
          status: SignUpStatus.COMPLETED,
        },
      });

      if (!signUpSession) {
        throw new Error('No completed sign-up session found');
      }

      const existingUser = await tx.user.findFirst({
        where: {
          email: completeSignUpDto.email,
        },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hashPassword(completeSignUpDto.password);

      const user = await tx.user.create({
        data: {
          email: completeSignUpDto.email,
          password: hashedPassword,
        },
      });

      await tx.signUpSessions.delete({
        where: {
          id: signUpSession.id,
        },
      });

      await this.redis.del(signUpSession.id);

      return {
        email: user.email,
        id: user.id,
        error: null,
      };
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.db.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!(await verifyPassword(loginDto.password, user.password))) {
      throw new Error('Incorrect password');
    }

    return {
      data: {
        email: user.email,
        id: user.id,
      },
      error: null,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.db.user.findFirst({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const token = generateToken(user.email);

    await this.mailer.sendMail(
      user.email,
      'Forgot Password',
      'Forgot Password. Reset your password here: ' + process.env.FRONTEND_URL + '/reset-password?token=' + token,
    );

    return {
      data: {
        email: user.email,
      },
      error: null,
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const session = await this.db.signUpSessions.findFirst({
      where: {
        email: resendOtpDto.email,
        status: SignUpStatus.OTP_PENDING,
      },
    });

    if (!session) {
      throw new Error('Sign up session not found');
    }
    
    const otp = generateOtp();

    await this.redis.set(session.id, otp, 1000 * 60 * 5);

    await this.mailer.sendMail(session.email, 'OTP', otp);
    
    return {
      data: {
        email: session.email,
      },
      error: null,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const decoded = verifyToken(resetPasswordDto.token);

    console.log(decoded);
    
    const user = await this.db.user.findFirst({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await hashPassword(resetPasswordDto.password);

    await this.db.user.update({
      where: {
        email: user.email,
        id: user.id,
      },
      data: { password: hashedPassword },
    });

    return {
      data: {
        email: user.email,
        id: user.id,
      },
      error: null,
    };
    
  }
}
