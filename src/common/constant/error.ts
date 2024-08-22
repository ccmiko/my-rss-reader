export const ERROR_CODE = {
  E1000: "E1000",
} as const;

type ERROR_CODE_KEY_TYPE = keyof typeof ERROR_CODE;
export type ERROR_CODE_VALUE_TYPE = (typeof ERROR_CODE)[ERROR_CODE_KEY_TYPE];
