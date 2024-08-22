import { parseArgs, type ParseArgsConfig } from "node:util";
import { Args } from "./types";
import {
  CRUD_LIST,
  CRUD_TYPES,
  MODE_HTTP,
  MODE_LIST,
  MODE_TYPES,
} from "../constant";
import { InvalidArgsError } from "../shared/error";

/**
 * 戻り値の型の元ネタ: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/util.d.ts#L1610-L1612
 */
function parse(): {
  [x: string]: string | boolean | (string | boolean)[] | undefined;
} {
  const options: ParseArgsConfig["options"] = {
    mode: {
      type: "string",
      default: "",
    },
    crud: {
      type: "string",
      default: "",
    },
    params: {
      type: "string",
      default: "",
    },
  };
  const { values } = parseArgs({ options });
  return values;
}

export function getArgs(): Args {
  const { mode, crud, params } = parse();
  const hasMode = Boolean(MODE_LIST.find((value) => value === mode));
  const modeIsHttp = mode == MODE_HTTP;
  if (!hasMode) {
    const logging = Object.values(MODE_LIST).join(" または ");
    throw new InvalidArgsError({
      msg: `--mode は ${logging} を指定してください:`,
    });
  }
  const args: Args = {
    // TODO: 型ガード書くのだるい1
    mode: mode as unknown as MODE_TYPES,
  };
  if (modeIsHttp) {
    return args;
  }

  const hasCrud = Boolean(CRUD_LIST.find((value) => value === crud));
  if (!hasCrud) {
    const logging = Object.values(CRUD_LIST).join(" または ");
    throw new InvalidArgsError({
      msg: `mode = cli の場合、 --crud は ${logging} を指定してください`,
    });
  } else {
    // TODO: 型ガード書くのだるい2
    args.crud = crud as unknown as CRUD_TYPES;
  }

  try {
    // TODO: 型ガード書くのだるい3
    args.params = JSON.parse(params as string);
  } catch (e) {
    throw new InvalidArgsError({
      msg: `--params は正しいJSON形式の文字列を指定してください`,
      // TODO: 型ガード書くのだるい4。（類似ケースはコメント省略する）
      original: e as Error,
    });
  }

  return args;
}
