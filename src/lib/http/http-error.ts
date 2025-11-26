export class HttpClientError extends Error {
  public readonly statusCode: number;
  public readonly responseBody?: unknown;

  constructor(message: string, statusCode: number, responseBody?: unknown) {
    super(message);
    this.name = "HttpClientError";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}
