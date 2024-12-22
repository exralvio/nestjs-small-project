import { getSplitString, stringToDate, stringToFloat } from 'src/common/utils';
import { IMPORT_FIELD } from './import.constants';

export function getLeadingSpaceLength(inputString: string): number {
  const match = inputString.match(/^\s*/);
  return match ? match[0].length : 0;
}

export function getEmployeeValue(lines: Array<any>, lineIndex: number): any {
  checkField(
    lines[lineIndex + 1],
    IMPORT_FIELD.EMPLOYEE,
    IMPORT_FIELD.ID,
    lineIndex + 1,
  );
  checkField(
    lines[lineIndex + 2],
    IMPORT_FIELD.EMPLOYEE,
    IMPORT_FIELD.NAME,
    lineIndex + 2,
  );
  checkField(
    lines[lineIndex + 3],
    IMPORT_FIELD.EMPLOYEE,
    IMPORT_FIELD.SURNAME,
    lineIndex + 3,
  );

  return {
    external_id: getSplitString(lines[lineIndex + 1], ':', 1),
    name: getSplitString(lines[lineIndex + 2], ':', 1),
    surname: getSplitString(lines[lineIndex + 3], ':', 1),
    department: {},
    statements: [],
    donations: [],
  };
}

export function getDepartmentValue(lines: Array<any>, lineIndex: number): any {
  checkField(
    lines[lineIndex + 1],
    IMPORT_FIELD.DEPARTMENT,
    IMPORT_FIELD.ID,
    lineIndex + 1,
  );
  checkField(
    lines[lineIndex + 2],
    IMPORT_FIELD.DEPARTMENT,
    IMPORT_FIELD.NAME,
    lineIndex + 2,
  );

  return {
    external_id: getSplitString(lines[lineIndex + 1], ':', 1),
    name: getSplitString(lines[lineIndex + 2], ':', 1),
  };
}

export function getStatementValue(lines: Array<any>, lineIndex: number): any {
  checkField(
    lines[lineIndex + 1],
    IMPORT_FIELD.STATEMENT,
    IMPORT_FIELD.ID,
    lineIndex + 1,
  );
  checkField(
    lines[lineIndex + 2],
    IMPORT_FIELD.STATEMENT,
    IMPORT_FIELD.AMOUNT,
    lineIndex + 2,
  );
  checkField(
    lines[lineIndex + 3],
    IMPORT_FIELD.STATEMENT,
    IMPORT_FIELD.DATE,
    lineIndex + 3,
  );

  return {
    external_id: getSplitString(lines[lineIndex + 1], ':', 1),
    amount: stringToFloat(getSplitString(lines[lineIndex + 2], ':', 1)),
    date: stringToDate(getSplitString(lines[lineIndex + 3], ':', 1)),
  };
}
export function getDonationValue(lines: Array<any>, lineIndex: number): any {
  checkField(
    lines[lineIndex + 1],
    IMPORT_FIELD.DONATION,
    IMPORT_FIELD.ID,
    lineIndex + 1,
  );
  checkField(
    lines[lineIndex + 2],
    IMPORT_FIELD.DONATION,
    IMPORT_FIELD.DATE,
    lineIndex + 2,
  );
  checkField(
    lines[lineIndex + 3],
    IMPORT_FIELD.DONATION,
    IMPORT_FIELD.AMOUNT,
    lineIndex + 3,
  );

  const amountFull = getSplitString(lines[lineIndex + 3], ':', 1);
  const amount = stringToFloat(getSplitString(amountFull, ' ', 0));
  const currency = getSplitString(amountFull, ' ', 1);

  return {
    external_id: getSplitString(lines[lineIndex + 1], ':', 1),
    date: stringToDate(getSplitString(lines[lineIndex + 2], ':', 1)),
    amount: amount,
    currency: currency,
  };
}

export function getRateValue(lines: Array<any>, lineIndex: number): any {
  checkField(
    lines[lineIndex + 1],
    IMPORT_FIELD.DONATION,
    IMPORT_FIELD.DATE,
    lineIndex + 1,
  );
  checkField(
    lines[lineIndex + 2],
    IMPORT_FIELD.DONATION,
    IMPORT_FIELD.SIGN,
    lineIndex + 2,
  );
  checkField(
    lines[lineIndex + 3],
    IMPORT_FIELD.DONATION,
    IMPORT_FIELD.VALUE,
    lineIndex + 3,
  );

  return {
    date: stringToDate(getSplitString(lines[lineIndex + 1], ':', 1)),
    sign: getSplitString(lines[lineIndex + 2], ':', 1),
    value: stringToFloat(getSplitString(lines[lineIndex + 3], ':', 1)),
  };
}

export function calculateDonationAmount(
  currencies: Map<string, any>,
  amount: number,
  currency: string,
): number {
  const value = currencies.get(currency)?.value ?? 1;
  const result = amount * value;
  return result;
}

const checkField = (
  line: string,
  parent: string,
  expectedValue: string,
  index: number,
) => {
  if (getSplitString(line, ':', 0).trim() !== expectedValue) {
    throw new Error(`Line ${index}: ${parent} missing ${expectedValue}.`);
  }
};
