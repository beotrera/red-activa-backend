export namespace ApiError {
  export enum Generic {
    generic = 1000,
  }

  export enum WS {
    generic = 2000,
    appVersionObsolete,
  }

  export enum Auth {
    unauthorized = 3000,
    invalidCredentials,
    tokenExpired,
  }

  export enum Institution {
    notFound = 4000,
  }

  export enum Person {
    notFound = 5000,
  }

  export enum Report {
    notFound = 6000,
  }
}
