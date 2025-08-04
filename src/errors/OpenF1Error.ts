export class OpenF1Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenF1Error";
  }
}

export class FetchError extends OpenF1Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = "FetchError";
  }
}

export class NotFoundError extends OpenF1Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}
