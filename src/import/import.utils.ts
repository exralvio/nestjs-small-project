import { getSplitString, stringToDate, stringToFloat } from 'src/common/utils';

export function getLeadingSpaceLength(inputString: string): number {
  // Match leading spaces at the start of the string
  const match = inputString.match(/^\s*/);

  // Return the length of the matched leading spaces
  return match ? match[0].length : 0;
}

export function getEmployeeValue(lines: any, lineIndex: number): any {
  return {
    id: getSplitString(lines[lineIndex + 1], ':', 1),
    name: getSplitString(lines[lineIndex + 2], ':', 1),
    surname: getSplitString(lines[lineIndex + 3], ':', 1),
    department: {},
    statements: [],
    donations: [],
  };
}

export function getDepartmentValue(lines: any, lineIndex: number): any {
  return {
    id: getSplitString(lines[lineIndex + 1], ':', 1),
    name: getSplitString(lines[lineIndex + 2], ':', 1),
  };
}

export function getStatementValue(lines: any, lineIndex: number): any {
  return {
    id: getSplitString(lines[lineIndex + 1], ':', 1),
    amount: stringToFloat(getSplitString(lines[lineIndex + 2], ':', 1)),
    date: stringToDate(getSplitString(lines[lineIndex + 3], ':', 1)),
  };
}
export function getDonationValue(lines: any, lineIndex: number): any {
  const amountFull = getSplitString(lines[lineIndex + 3], ':', 1);
  const amount = stringToFloat(getSplitString(amountFull, ' ', 0));
  const currency = getSplitString(amountFull, ' ', 1);

  return {
    id: getSplitString(lines[lineIndex + 1], ':', 1),
    date: stringToDate(getSplitString(lines[lineIndex + 2], ':', 1)),
    amount: amount,
    currency: currency,
  };
}

export function getRateValue(lines: any, lineIndex: number): any {
  return {
    date: stringToDate(getSplitString(lines[lineIndex + 1], ':', 1)),
    sign: getSplitString(lines[lineIndex + 2], ':', 1),
    value: stringToFloat(getSplitString(lines[lineIndex + 3], ':', 1)),
  };
}
