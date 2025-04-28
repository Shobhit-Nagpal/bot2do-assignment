export class InitiateSignUpDto {
  email: string;
}

export class VerifySignUpDto {
  email: string;
  otp: string;
}

export class CompleteSignUpDto {
  email: string;
  password: string;
}

export class ResendOtpDto {
  email: string;
}

export class ResetPasswordDto {
  password: string;
  token: string;
}
