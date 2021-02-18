interface IExtractStringMap {
  [key: string]: string | string[] | undefined;
}

export function extractString(key: string, params: IExtractStringMap): string {
  if (!Object.keys(params).some(v => v === key)) {
    return "";
  }

  if (typeof params[key] === "string") {
    return params[key] as string;
  }

  return "";
}
