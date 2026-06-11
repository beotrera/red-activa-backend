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

// #region Institution

customErrors[ApiError.Institution.notFound] = {
  message: 'Institution not found',
  showMessage: {
    EN: 'Institution not found',
    ES: 'Institución no encontrada',
  },
  HTTPStatusCode: 404,
};

// #region Person

customErrors[ApiError.Person.notFound] = {
  message: 'Person not found',
  showMessage: {
    EN: 'Person not found',
    ES: 'Persona no encontrada',
  },
  HTTPStatusCode: 404,
};

// #region Report

customErrors[ApiError.Report.notFound] = {
  message: 'Report not found',
  showMessage: {
    EN: 'Report not found',
    ES: 'Denuncia no encontrada',
  },
  HTTPStatusCode: 404,
};

export { customErrors };
