import { Injectable, Logger } from '@nestjs/common';
import { Employee } from 'src/database/entities/employee.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class RewardService {
  constructor(private readonly dataSource: DataSource) {}

  private readonly logger = new Logger(RewardService.name);

  async calculateRewards(): Promise<any> {
    const results = this.dataSource
      .getRepository(Employee)
      .createQueryBuilder('e')
      .select([
        'e.id as employee_id',
        `CASE 
        WHEN (SELECT SUM(amount) FROM donations) > 0 
        THEN (COALESCE(SUM(d.amount), 0) / (SELECT SUM(amount) FROM donations) * 10000)
        ELSE 0 
      END AS reward`,
      ])
      .leftJoin('donations', 'd', 'd.employee_id = e.id')
      .groupBy('e.id')
      .getRawMany();

    return results;
  }
}
