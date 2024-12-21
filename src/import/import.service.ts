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

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  async importDump(fileContent: string): Promise<void> {
    try {
      const { employees, rates } = await this.parseTextData(fileContent);

      this.logger.log('Parsed Employees:', JSON.stringify(employees, null, 2));
      this.logger.log('Parsed Rates:', JSON.stringify(rates, null, 2));
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
          entities[parent][employee.id] = employee;

          employeeId = employee.id;

          lineIndex += Object.entries(employee).length;
        } else if (line == IMPORT_FIELD.RATE) {
          const rate = getRateValue(lines, lineIndex);
          entities[parent].push(rate);

          lineIndex += Object.entries(rate).length;
        }
      } else if (
        spaceLength == IMPORT_LEVEL.TWO &&
        IMPORT_OBJ.TWO.includes(line)
      ) {
        if (line == IMPORT_FIELD.DEPARTMENT) {
          const department = getDepartmentValue(lines, lineIndex);
          entities[parent][employeeId]['department'] = department;

          lineIndex += Object.entries(department).length;
        } else if (line == IMPORT_FIELD.DONATION) {
          const donation = getDonationValue(lines, lineIndex);
          entities[parent][employeeId]['donations'].push(donation);

          lineIndex += Object.entries(donation).length;
        }
      } else if (
        spaceLength == IMPORT_LEVEL.THREE &&
        IMPORT_OBJ.THREE.includes(line)
      ) {
        if (line == IMPORT_FIELD.STATEMENT) {
          const statement = getStatementValue(lines, lineIndex);
          entities[parent][employeeId]['statements'].push(statement);

          lineIndex += Object.entries(statement).length;
        }
      }

      lineIndex++;
    }

    return {
      employees: Object.values(entities['employees']),
      rates: entities['rates'],
    };
  }
}
