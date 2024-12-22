import { Controller, Get } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('api')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get('rewards')
  async getRewards() {
    const results = await this.rewardService.calculateRewards();
    return { results };
  }
}
