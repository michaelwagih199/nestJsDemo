import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppRouting } from '../utils/app-routing';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get(AppRouting.profile.getMe)
  getMe(@Req() req: Request) {
    return req.;
  }
}
