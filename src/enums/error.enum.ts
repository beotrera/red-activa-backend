import { CustomError } from '../types/generic';
import { ApiError } from './api_error.enum';

const customErrors: CustomError[] = [];

// #region Generic

customErrors[ApiError.Generic.generic] = {
  message: 'Generic',
  showMessage: {
    EN: 'Generic',
    ES: 'Generic',
  },
  HTTPStatusCode: 400,
};

// #region Auth

customErrors[ApiError.Auth.unauthorized] = {
  message: 'Unauthorized',
  showMessage: {
    EN: 'Unauthorized',
    ES: 'No autorizado',
  },
  HTTPStatusCode: 401,
};

customErrors[ApiError.Auth.invalidCredentials] = {
  message: 'Invalid credentials',
  showMessage: {
    EN: 'Invalid email or password',
    ES: 'Email o contraseña incorrectos',
  },
  HTTPStatusCode: 401,
};

customErrors[ApiError.Auth.tokenExpired] = {
  message: 'Token expired',
  showMessage: {
    EN: 'Session expired, please login again',
    ES: 'Sesión expirada, por favor inicie sesión nuevamente',
  },
  HTTPStatusCode: 401,
};

export { customErrors };
