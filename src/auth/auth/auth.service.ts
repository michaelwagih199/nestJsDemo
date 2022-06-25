import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AppExceptionErrors } from 'src/utils/globa-exception';
import { AppResponse } from '../../utils/app-response';
import { User } from '@prisma/client';
import { AppConstatnts } from '../../utils/app-constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) { }

  async signUp(dto: AuthDto): Promise<AppResponse<any>> {
    try {
      const hashPassword = await argon.hash(dto.password);
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash: hashPassword,
        },
        select: {
          id: true,
          email: true,
          updatedAt: true,
        },
      });
      return new AppResponse<any>(200, user, AppConstatnts.SUCCESSFULL);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            AppExceptionErrors.Forbidden_Exception_ERROR,
          );
        }
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto): Promise<AppResponse<any>> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user)
      throw new ForbiddenException(
        AppExceptionErrors.Forbidden_Exception_ERROR,
      );
    const pwMatch = await argon.verify(user.hash, dto.password);
    if (!pwMatch)
      throw new ForbiddenException(
        AppExceptionErrors.Forbidden_Exception_ERROR,
      );
    const jwt = { accessToken: await this.signTokent(user.id, user.email) };
    return new AppResponse<any>(200, jwt, AppConstatnts.SUCCESSFULL);
  }

  signTokent(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
