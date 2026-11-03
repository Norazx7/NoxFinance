import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { CreateRecurringDto, UpdateRecurringDto } from './dto/recurring.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurring: RecurringService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRecurringDto) {
    return this.recurring.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.recurring.findAll(user.userId);
  }

  @Get('forecast/cashflow')
  forecast(
    @CurrentUser() user: AuthUser,
    @Query('days') days?: string,
  ) {
    return this.recurring.cashflowForecast(
      user.userId,
      days ? Number(days) : 30,
    );
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.recurring.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    return this.recurring.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.recurring.remove(user.userId, id);
  }
}
