import { ShowMessage } from '../types/generic';
import { ApiError, customErrors } from '../enums';

/**
 * Class for encapsulating API response
 */
export class WSresponse {
  public data: string;
  public result: boolean; // `true` if error, `false` otherwise
  public errorCode: number; // custom error code
  public message: string; // internal error message
  public showMessage: string | ShowMessage; // error message to display to the final user
  public needUpdate: boolean;

  constructor(result: boolean, data?: any, errorCode?: number, substitutions?: any) {
    this.data = data;
    if (errorCode === (ApiError.WS.appVersionObsolete as number)) {
      this.result = false;
      this.needUpdate = true;
      return;
    }
    this.result = result;
    this.needUpdate = false;

    if (result) {
      this.errorCode = 0;
      this.message = null;
      this.showMessage = null;
      return;
    }
    if (errorCode) {
      this.errorCode = errorCode;
      this.message = customErrors[errorCode].message;
      this.showMessage = customErrors[errorCode].showMessage || this.message;
      if (substitutions) {
        /* eslint-disable */
        for (const sub of Object.keys(substitutions)) {
          for (const lang of Object.keys(this.showMessage)) {
            this.showMessage[lang] = this.showMessage[lang].replace(`%${sub}`, substitutions[sub]);
          }
        }
        delete this.data;
      }
      return;
    }

    this.errorCode = 1; // default error code
  }
}
