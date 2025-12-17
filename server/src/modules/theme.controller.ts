import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/api-key.guard';

@Controller('config')
export class ThemeController {
  @Get('theme')
  @Public()
  getTheme() {
    return {
      tokens: {
        primary: '#4f46e5',
        primaryText: '#ffffff',
        surface: '#ffffff',
        surfaceAlt: '#f5f7fa',
        border: '#e2e8f0',
        radiusSm: '4px',
        radiusMd: '8px',
        radiusLg: '16px'
      }
    };
  }
}
