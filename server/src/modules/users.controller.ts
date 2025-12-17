import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/api-key.guard';

@Controller('users')
export class UsersController {
  @Get('current_user')
  @Public()
  currentUser() {
    return {
      name: 'Michael Scott',
      email_id: 'michael.scott@dundermifflin.com',
      roles: ['admin'],
      preferences: { theme: 'light' }
    };
  }
}
