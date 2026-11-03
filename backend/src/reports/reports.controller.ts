import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('expenses-by-category')
  expensesByCategory(
    @CurrentUser() user: AuthUser,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date();
    return this.reports.expensesByCategory(
      user.userId,
      year ? Number(year) : now.getFullYear(),
      month ? Number(month) : now.getMonth() + 1,
    );
  }

  @Get('monthly-evolution')
  monthlyEvolution(
    @CurrentUser() user: AuthUser,
    @Query('months') months?: string,
  ) {
    return this.reports.monthlyEvolution(
      user.userId,
      months ? Number(months) : 6,
    );
  }

  @Get('compare')
  compare(
    @CurrentUser() user: AuthUser,
    @Query('yearA') yearA: string,
    @Query('monthA') monthA: string,
    @Query('yearB') yearB: string,
    @Query('monthB') monthB: string,
  ) {
    return this.reports.comparePeriods(
      user.userId,
      Number(yearA),
      Number(monthA),
      Number(yearB),
      Number(monthB),
    );
  }
}
