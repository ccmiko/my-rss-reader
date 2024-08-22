import { ERROR_CODE, ERROR_CODE_VALUE_TYPE } from "../constant";

type ErrorOptions = {
  msg?: string;
  original?: Error;
};

export class InvalidArgsError extends Error {
  static {
    this.prototype.name = "InvalidArgsError";
  }

  code: ERROR_CODE_VALUE_TYPE;
  original: ErrorOptions["original"];

  constructor({ msg = "引数が不正な値です", original }: ErrorOptions) {
    super(msg);
    this.code = ERROR_CODE.E1000;
    if (original != undefined) {
      this.original = original;
    }
  }
}
