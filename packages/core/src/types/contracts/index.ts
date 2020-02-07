export * from "./user/index";
export * from "./data";
export * from "./user";
export * from "./work-order";

export interface IErrorResponse {
  error: string;
}

export interface IValidationErrorResponse {
  [path: string]: string;
}
