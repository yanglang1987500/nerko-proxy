import { mock, cookieCheck, doGet, formPost, jsonPost, jsonPut, normalPut,
  jsonDelete, normalDelete, multiPost, setCookie, end } from './filter';
import config from './config';
import { Method } from './util/enum';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';

const customRouters = {
  [Method.get]: [],
  [Method.post]: [],
  [Method.put]: [],
  [Method.delete]: [],
};

const filterMap = {
  [Method.get]: () => [
    mock,
    cookieCheck,
    ...customRouters[Method.get],
    doGet,
    end
  ],
  [Method.post]: () => [
    mock,
    cookieCheck,
    ...customRouters[Method.post],
    formPost,
    jsonPost,
    multiPost,
    end
  ],
  [Method.put]: () => [
    cookieCheck,
    ...customRouters[Method.put],
    jsonPut,
    normalPut,
    end
  ],
  [Method.delete]: () => [
    cookieCheck,
    ...customRouters[Method.delete],
    jsonDelete,
    normalDelete,
    end
  ]
};

const onlyMock = () => [mock, ...customRouters[Method.get], end];

export default async (method: Method, ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const list = config.type === 'None' ? onlyMock() : filterMap[method]();
  await setCookie(ctx, () => Promise.resolve());
  let cursor = 0;
  const nextFilter = async () => {
    if (cursor < (list.length - 1)) await list[++cursor](ctx, nextFilter);
  };
  await list[cursor](ctx, nextFilter);
  await next();
  config.refreshLastTime();
};

export const addRouter = (method: Method, route: string, callback: (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => Promise<any>) => {
  customRouters[method].push(async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
    if (ctx.request.path === route) {
      return callback(ctx, next);
    }
    await next();
  });
};