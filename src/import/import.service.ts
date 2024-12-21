import { Injectable, Logger } from '@nestjs/common';
import { IMPORT_FIELD, IMPORT_LEVEL, IMPORT_OBJ } from './import.constants';
import {
  getDepartmentValue,
  getDonationValue,
  getEmployeeValue,
  getLeadingSpaceLength,
  getRateValue,
  getStatementValue,
} from './import.utils';
import { DataSource } from 'typeorm';
import { Currency } from 'src/database/entities/currency.entity';
import { CurrencyRate } from 'src/database/entities/currency-rate.entity';

@Injectable()
export class ImportService {
  constructor(private readonly dataSource: DataSource) {}

  private readonly logger = new Logger(ImportService.name);

  async importDump(fileContent: string): Promise<void> {
    try {
      const { employees, rates, departments } =
        await this.parseTextData(fileContent);

      this.processRate(rates);
      this.processDepartment(departments);
      this.processEmployee(employees);
    } catch (error) {
      this.logger.error('Error importing dump', error.stack);
      throw new Error('Error importing dump');
    }
  }

  private parseTextData(text: string): any {
    const lines = text.split('\n');

    let lineIndex = 0;
    let parent = null;
    let employeeId = null;

    const entities = {};
    const departments = {};

    while (lineIndex < lines.length) {
      let line = lines[lineIndex];
      const spaceLength = getLeadingSpaceLength(line);

      line = line.trim();

      if (spaceLength == IMPORT_LEVEL.ZERO && IMPORT_OBJ.ZERO.includes(line)) {
        if (line == IMPORT_FIELD.ELIST) {
          parent = 'employees';
          entities[parent] = {};
        } else if (line == IMPORT_FIELD.RATES) {
          parent = 'rates';
          entities[parent] = [];
        }
      } else if (
        spaceLength == IMPORT_LEVEL.ONE &&
        IMPORT_OBJ.ONE.includes(line)
      ) {
        if (line == IMPORT_FIELD.EMPLOYEE) {
          const employee = getEmployeeValue(lines, lineIndex);
          entities[parent][employee.external_id] = employee;

          employeeId = employee.external_id;
        } else if (line == IMPORT_FIELD.RATE) {
          const rate = getRateValue(lines, lineIndex);
          entities[parent].push(rate);
        }
      } else if (
        spaceLength == IMPORT_LEVEL.TWO &&
        IMPORT_OBJ.TWO.includes(line)
      ) {
        if (line == IMPORT_FIELD.DEPARTMENT) {
          const department = getDepartmentValue(lines, lineIndex);
          entities[parent][employeeId]['department'] = department;

          if (!departments[department.external_id]) {
            departments[department.external_id] = department;
          }
        } else if (line == IMPORT_FIELD.DONATION) {
          const donation = getDonationValue(lines, lineIndex);
          entities[parent][employeeId]['donations'].push(donation);
        }
      } else if (
        spaceLength == IMPORT_LEVEL.THREE &&
        IMPORT_OBJ.THREE.includes(line)
      ) {
        if (line == IMPORT_FIELD.STATEMENT) {
          const statement = getStatementValue(lines, lineIndex);
          entities[parent][employeeId]['statements'].push(statement);
        }
      }

      lineIndex++;
    }

    return {
      employees: Object.values(entities['employees']),
      rates: entities['rates'],
      departments,
    };
  }

  private async processRate(rates: Array<any>): Promise<any> {
    const currencies = {};
    const currencyRates = [];

    let id = 1;
    for (const rate of rates) {
      if (!currencies[rate.sign]) {
        currencies[rate.sign] = { id, sign: rate.sign };
        id++;
      }

      currencyRates.push({
        value: rate.value,
        date: rate.date,
        currency: { id: currencies[rate.sign].id },
      });
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.save(Currency, Object.values(currencies));
        await manager.save(CurrencyRate, currencyRates);
      });
    } catch (error) {
      this.logger.error('Error bulk insert currency', error.stack);
      throw new Error('Failed to bulk insert currency');
    }
  }

  private processDepartment(departements: Array<any>): any {
    // console.log('---employees', employees);
  }

  private processEmployee(employees: Array<any>): any {
    // console.log('---employees', employees);
  }
}
