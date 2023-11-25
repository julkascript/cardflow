export class HttpError extends Error {
  err: Response;

  constructor(err: Response) {
    super('The server responded with an error');
    this.err = err;
  }
}
