interface IExtractStringMap {
  [key: string]: string | string[] | undefined;
}

export const extractSlug = (key: string, params: IExtractStringMap): Array<string | undefined> => {
  if (!Object.keys(params).some(v => v === key)) {
    return [];
  }

  if (!Array.isArray(params[key])) {
    return [];
  }

  return params[key] as Array<string | undefined>;
};
