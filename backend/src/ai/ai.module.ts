import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [DashboardModule, ReportsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
