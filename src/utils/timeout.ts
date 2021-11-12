export const timeout = <T>(prom: Promise<T>, time: number, error: Error): Promise<T> => {
  let timer: NodeJS.Timeout;
  return Promise.race([
    prom,
    new Promise((_r, rej) => (timer = setTimeout(rej, time, error)))
  ]).finally(() => clearTimeout(timer)) as Promise<T>;
};
