import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RealEstateDeveloperEmployee } from '../entities';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RealEstateDeveloperEmployee => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
