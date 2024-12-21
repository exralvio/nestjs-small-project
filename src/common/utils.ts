export function getSplitString(
  inputString: string,
  separator: string,
  inputIndex: number,
): string {
  const words = inputString.split(separator);

  return words[inputIndex].trim();
}

export function stringToDate(inputString: string): any {
  return new Date(inputString);
}

export function stringToFloat(inputString: string): number {
  return parseFloat(inputString);
}
