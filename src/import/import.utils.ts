import { getSplitString, stringToDate, stringToFloat } from 'src/common/utils';

export function getLeadingSpaceLength(inputString: string): number {
  const match = inputString.match(/^\s*/);
  return match ? match[0].length : 0;
}

export function getEmployeeValue(lines: Array<any>, lineIndex: number): any {
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
  return {
    external_id: getSplitString(lines[lineIndex + 1], ':', 1),
    name: getSplitString(lines[lineIndex + 2], ':', 1),
  };
}

export function getStatementValue(lines: Array<any>, lineIndex: number): any {
  return {
    external_id: getSplitString(lines[lineIndex + 1], ':', 1),
    amount: stringToFloat(getSplitString(lines[lineIndex + 2], ':', 1)),
    date: stringToDate(getSplitString(lines[lineIndex + 3], ':', 1)),
  };
}
export function getDonationValue(lines: Array<any>, lineIndex: number): any {
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
