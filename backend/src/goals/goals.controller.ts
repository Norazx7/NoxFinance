import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import {
  ContributeGoalDto,
  CreateGoalDto,
  UpdateGoalDto,
} from './dto/goal.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateGoalDto) {
    return this.goals.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.goals.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.goals.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.goals.update(user.userId, id, dto);
  }

  @Post(':id/contribute')
  contribute(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ContributeGoalDto,
  ) {
    return this.goals.contribute(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.goals.remove(user.userId, id);
  }
}
