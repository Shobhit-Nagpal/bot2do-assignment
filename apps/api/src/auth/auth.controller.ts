import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteSignUpDto, InitiateSignUpDto, ResendOtpDto, ResetPasswordDto, VerifySignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initiate-sign-up')
  async initiateSignUp(@Body() initiateSignUpDto: InitiateSignUpDto) {
    return await this.authService.initiateSignUp(initiateSignUpDto);
  }

  @Post('verify-sign-up')
  async verifySignUp(@Body() verifySignUpDto: VerifySignUpDto) {
    return await this.authService.verifySignUp(verifySignUpDto);
  }

  @Post('complete-sign-up')
  async completeSignUp(@Body() completeSignUpDto: CompleteSignUpDto) {
    return await this.authService.completeSignUp(completeSignUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log("dto", loginDto);
    return await this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return await this.authService.resendOtp(resendOtpDto)
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto)
  }

}
