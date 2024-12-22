export const IMPORT_FIELD = {
  ELIST: 'E-List',
  EMPLOYEE: 'Employee',
  ID: 'id',
  NAME: 'name',
  SURNAME: 'surname',
  DEPARTMENT: 'Department',
  SALARY: 'Salary',
  STATEMENT: 'Statement',
  AMOUNT: 'amount',
  DATE: 'date',
  DONATION: 'Donation',
  RATES: 'Rates',
  RATE: 'Rate',
  SIGN: 'sign',
  VALUE: 'value',
};

export const IMPORT_LEVEL = {
  ZERO: 0,
  ONE: 2,
  TWO: 4,
  THREE: 6,
};

export const IMPORT_OBJ = {
  ZERO: [IMPORT_FIELD.ELIST, IMPORT_FIELD.RATES],
  ONE: [IMPORT_FIELD.EMPLOYEE, IMPORT_FIELD.RATE],
  TWO: [IMPORT_FIELD.DEPARTMENT, IMPORT_FIELD.SALARY, IMPORT_FIELD.DONATION],
  THREE: [IMPORT_FIELD.STATEMENT],
};
