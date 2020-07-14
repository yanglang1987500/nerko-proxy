import config from '../config';
import request from '../util/request';
import { delegateResponse, tryCatchWrap } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';
import { axios } from '../..';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const url = ctx.request.path;
  const contentType = ctx.headers['content-type'] || 'application/x-www-form-urlencoded';
  console.log('contentType', contentType);
  if (contentType.indexOf('application/json') !== -1) {
    console.log('proxy jsonPut', url);
    return tryCatchWrap(() => axios.put(config.getUrl() + url, ctx.request.body, {
      headers: {
        ...(config.token ? { Authorization: config.token } : {}),
        'Content-Type': 'application/json',
        "X-Requested-With": 'XMLHttpRequest'
      }
    }), ctx);
  }
  await next();
};