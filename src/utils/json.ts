export const safeJSONParse = <T>(str: string): [null, T] | [unknown, null] => {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err, null];
  }
};
