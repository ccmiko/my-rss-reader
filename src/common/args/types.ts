import { CRUD_TYPES, MODE_TYPES } from "../constant/args";

export type Args = {
  mode: MODE_TYPES;
  crud?: CRUD_TYPES;
  params?: Object;
};
