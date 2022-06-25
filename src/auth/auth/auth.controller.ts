import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth_service: AuthService) {}

  @Post('signIn')
  signIn(@Body() dto: AuthDto) {
    return this.auth_service.signIn(dto);
  }

  @Post('signUp')
  signUp(@Body() dto: AuthDto) {
    return this.auth_service.signUp(dto);
  }
}
