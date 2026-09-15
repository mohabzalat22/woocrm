import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);
