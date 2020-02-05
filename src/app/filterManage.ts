import { mock, cookieCheck, doGet, formPost, jsonPost, jsonPut, normalPut,
  jsonDelete, normalDelete, multiPost, setCookie, end } from './filter';
import config from './config';
import { Method } from './util/enum';

const filterMap = {
  [Method.get]: [
    mock,
    cookieCheck,
    doGet,
    end
  ],
  [Method.post]: [
    mock,
    cookieCheck,
    formPost,
    jsonPost,
    multiPost,
    end
  ],
  [Method.put]: [
    cookieCheck,
    jsonPut,
    normalPut,
    end
  ],
  [Method.delete]:  [
    cookieCheck,
    jsonDelete,
    normalDelete,
    end
  ]
};

const onlyMock = [mock, end];

export default async (method: Method, ctx, next) => {
  const list = config.type === 'None' ? onlyMock : filterMap[method];
  await setCookie(ctx, () => {});
  let cursor = 0;
  const nextFilter = async () => {
    if (cursor < (list.length - 1)) await list[++cursor](ctx, nextFilter);
  };
  await list[cursor](ctx, nextFilter);
  await next();
  config.refreshLastTime();
};
