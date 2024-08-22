export const CRUD_C = "c" as const;
export const CRUD_R = "r" as const;
export const CRUD_U = "u" as const;
export const CRUD_D = "d" as const;
export const CRUD_LIST = [CRUD_C, CRUD_R, CRUD_U, CRUD_D] as const;
export type CRUD_TYPES = typeof CRUD_LIST;

export const MODE_CLI = "cli" as const;
export const MODE_HTTP = "http" as const;
export const MODE_LIST = [MODE_CLI, MODE_HTTP] as const;
export type MODE_TYPES = typeof MODE_LIST;
