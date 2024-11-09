import { HttpStatusCode } from 'axios';

/**
 * I used this code sample a lot in the past,
 * very nice to have for basic custom error handling
 * base on this : https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md
 * */

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(name: string, httpCode: HttpStatusCode, description: string) {
    // Get description from parent class
    super(description);

    // Keep prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;

    // Set the stacktrace right
    Error.captureStackTrace(this);
  }
}
