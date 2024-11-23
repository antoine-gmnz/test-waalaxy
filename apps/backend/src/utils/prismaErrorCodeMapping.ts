export const prismaErrorMapping = new Map<
  string,
  { message: string; httpStatus: number }
>([
  [
    'P2000',
    {
      message:
        "The provided value for the column is too long for the column's type",
      httpStatus: 400,
    },
  ],
  [
    'P2001',
    {
      message: 'The record searched for in the where condition does not exist',
      httpStatus: 404,
    },
  ],
  [
    'P2006',
    {
      message: 'The provided value for the field is not valid',
      httpStatus: 400,
    },
  ],
  ['P2007', { message: 'Data validation error', httpStatus: 400 }],
  ['P2008', { message: 'Failed to parse the query', httpStatus: 400 }],
  ['P2009', { message: 'Failed to validate the query', httpStatus: 400 }],
  ['P2010', { message: 'Raw query failed', httpStatus: 500 }],
  [
    'P2018',
    {
      message: 'The required connected records were not found',
      httpStatus: 404,
    },
  ],
  ['P2023', { message: 'Inconsistent column data', httpStatus: 400 }],
]);
