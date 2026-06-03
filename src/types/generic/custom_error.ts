interface ShowMessage {
  EN: string;
  ES: string;
}

interface CustomError {
  message: string;
  showMessage: ShowMessage;
  HTTPStatusCode?: number;
  type?: string;
}

export { CustomError, ShowMessage };
