import { Injectable, Logger } from '@nestjs/common';
import { IMPORT_FIELD, IMPORT_LEVEL, IMPORT_OBJ } from './import.constants';
import {
  calculateDonationAmount,
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
import { Department } from 'src/database/entities/department.entity';
import { Employee } from 'src/database/entities/employee.entity';
import { Statement } from 'src/database/entities/statement.entity';
import { Donation } from 'src/database/entities/donation.entity';

@Injectable()
export class ImportService {
  constructor(private readonly dataSource: DataSource) {}

  private readonly logger = new Logger(ImportService.name);

  async importDump(fileContent: string): Promise<void> {
    try {
      const { employees, rates, departments } =
        await this.parseTextData(fileContent);

      try {
        await this.dataSource.transaction(async (manager) => {
          // Save rates
          await this.processRate(manager, rates);

          // Save department
          const departmentMap = await this.processDepartment(
            manager,
            departments,
          );

          // Retrieve currencies
          const currencyMap = await this.getLatestCurrencyRates();

          // Save employee
          await this.processEmployee(
            manager,
            employees,
            departmentMap,
            currencyMap,
          );
        });
      } catch (error) {
        this.logger.error(`Error saving to db: ${error.message}`, error.stack);
        throw new Error(`Failed saving to db: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error importing dump: ${error.message}`, error.stack);
      throw new Error(error.message);
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

  private async processRate(manager: any, rates: Array<any>): Promise<any> {
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

    await manager.save(Currency, Object.values(currencies));
    await manager.save(CurrencyRate, currencyRates);
  }

  private async processDepartment(
    manager: any,
    departments: Array<any>,
  ): Promise<any> {
    const savedDepartments = await manager.save(
      Department,
      Object.values(departments),
    );

    const results = new Map(
      savedDepartments.map((item: any) => [item.external_id, item]),
    );

    return results;
  }

  private async processEmployee(
    manager: any,
    employees: Array<any>,
    departmentMap: Map<string, any>,
    currencyMap: Map<string, any>,
  ): Promise<any> {
    const statements = {};
    const donations = {};

    /** Saving Employees */
    const employee_data = employees.map((item) => {
      statements[item.external_id] = item.statements;
      donations[item.external_id] = item.donations;

      return {
        firstName: item.name,
        lastName: item.surname,
        external_id: item.external_id,
        department: {
          id: departmentMap.get(item.department.external_id)?.id ?? null,
        },
      };
    });

    const savedEmployee = await manager.save(Employee, employee_data);

    const employeeIds = new Map(
      savedEmployee.map((item: any) => [item.external_id, item.id]),
    );

    /** Saving Statements & Donations */
    const statement_data = [];
    const donation_data = [];
    for (const employee of employees) {
      const current_statement = statements[employee.external_id];
      const current_donation = donations[employee.external_id];

      for (const statement of current_statement) {
        statement_data.push({
          ...statement,
          employee: { id: employeeIds.get(employee.external_id) },
        });
      }

      for (const donation of current_donation) {
        donation_data.push({
          employee: { id: employeeIds.get(employee.external_id) },
          date: donation.date,
          amount: calculateDonationAmount(
            currencyMap,
            donation.amount,
            donation.currency,
          ),
        });
      }
    }

    await manager.save(Statement, statement_data);
    await manager.save(Donation, donation_data);
  }

  private async getLatestCurrencyRates(): Promise<any> {
    const rates = await this.getRates();
    const rateMap = new Map(rates.map((row) => [row.currency_id, row]));

    const currencies = await this.getCurrency();
    const currencyMap = new Map(
      currencies.map((row) => {
        return [
          row.sign,
          {
            id: row.id,
            sign: row.sign,
            value: rateMap.get(row.id)?.value ?? 0,
          },
        ];
      }),
    );

    return currencyMap;
  }

  private async getRates(): Promise<Array<any>> {
    const queryBuilder = this.dataSource
      .getRepository(CurrencyRate)
      .createQueryBuilder('currency_rate')
      .select([
        'currency_rate.currency_id AS currency_id',
        'currency_rate.value AS value',
      ])
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(inner_currency_rate.date)')
          .from(CurrencyRate, 'inner_currency_rate')
          .where('inner_currency_rate.currency_id = currency_rate.currency_id')
          .getQuery();

        return `currency_rate.date = ${subQuery}`;
      });

    const queryResults = await queryBuilder.getRawMany();
    return queryResults;
  }

  private async getCurrency(): Promise<Array<Currency>> {
    return await this.dataSource.getRepository(Currency).find();
  }
}
