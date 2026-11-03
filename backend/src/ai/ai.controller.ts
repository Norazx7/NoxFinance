import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiAskDto, AiSimulateDto } from './dto/ai.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly ai: AiService,
    private readonly config: ConfigService,
  ) {}

  @Get('status')
  status() {
    return {
      enabled: true,
      provider: this.config.get('LLM_PROVIDER', 'mock'),
      note: 'Chaves de API ficam apenas no backend. O app mobile nunca as recebe.',
    };
  }

  @Post('ask')
  ask(@CurrentUser() user: AuthUser, @Body() dto: AiAskDto) {
    return this.ai.ask(user.userId, dto);
  }

  @Post('simulate')
  simulate(@CurrentUser() user: AuthUser, @Body() dto: AiSimulateDto) {
    return this.ai.simulatePurchase(user.userId, dto);
  }
}
