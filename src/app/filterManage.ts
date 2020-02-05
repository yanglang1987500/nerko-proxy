import { mock, cookieCheck, doGet, formPost, jsonPost, jsonPut, normalPut,
  jsonDelete, normalDelete, multiPost, setCookie, end } from './filter';
import config from './config';
import { Method } from './util/enum';

const getFilterList = [
  mock,
  cookieCheck,
  doGet,
  end
];

const postFilterList = [
  mock,
  cookieCheck,
  formPost,
  jsonPost,
  multiPost,
  end
];

const putFilterList = [
  cookieCheck,
  jsonPut,
  normalPut,
  end
];

const deleteFilterList = [
  cookieCheck,
  jsonDelete,
  normalDelete,
  end
];

const onlyMock = [mock, end];

export default async (method, ctx, next) => {
  const list = config.type === 'None' ? onlyMock : getListByMethod(method);
  await setCookie(ctx, () => {});
  let cursor = 0;
  const nextFilter = async () => {
    if (cursor < (list.length - 1)) await list[++cursor](ctx, nextFilter);
  };
  await list[cursor](ctx, nextFilter);
  await next();
  config.refreshLastTime();
};

const getListByMethod = (method) => {
  switch(method) {
    case Method.get:
      return getFilterList;
    case Method.post:
      return postFilterList;
    case Method.put:
      return putFilterList;
    case Method.delete:
      return deleteFilterList;
  }
}