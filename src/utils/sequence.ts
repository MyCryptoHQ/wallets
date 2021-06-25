export const sequence = async <T>(promises: (() => Promise<T>)[]): Promise<T[]> => {
  return promises.reduce<Promise<T[]>>(async (results, promise) => {
    return [...(await results), await promise()];
  }, Promise.resolve([]));
};
