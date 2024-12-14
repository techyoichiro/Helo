import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1時間のTTL

export const cacheMiddleware = () => {
  return async (c: any, next: () => Promise<void>) => {
    const key = c.req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return c.json(cachedResponse);
    }

    await next();

    if (c.res.status === 200) {
      const responseBody = await c.res.json();
      cache.set(key, responseBody);
    }
  };
};

export const getFromCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setInCache = <T>(key: string, value: T): void => {
  cache.set(key, value);
};