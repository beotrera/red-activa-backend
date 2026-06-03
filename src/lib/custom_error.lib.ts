import { customErrors } from '../enums';

interface DefaultExtraData {
  data?: any;
  substitutions?: any;
}

const defaultExtraData: DefaultExtraData = {
  data: undefined,
  substitutions: undefined,
};

export class CustomError extends Error {
  public errorCode: number;
  public data: any;
  public substitutions: any;
  public type: string;
  public message: string;
  public statusCode: number;

  constructor(errorCode: number, { data, substitutions } = defaultExtraData) {
    super(customErrors[errorCode].message); // eslint-disable-line @typescript-eslint/no-unsafe-argument
    this.errorCode = errorCode;
    this.data = data;
    this.substitutions = substitutions;
    this.type = customErrors[errorCode].type;
    this.message = customErrors[errorCode].message;
    this.statusCode = customErrors[errorCode].HTTPStatusCode;
  }
}
