import config from '../config';
import { tryCatchWrap } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';
import { axios } from '../..';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const url = ctx.request.path;
  const contentType = ctx.headers['content-type'] || 'application/x-www-form-urlencoded';
  if (contentType.indexOf('application/json') !== -1) {
    console.log('proxy jsonDelete', url);
    return tryCatchWrap(() => axios.delete(config.getUrl() + url, {
      data: ctx.request.body,
      params: ctx.request.body,
      headers: {
        ...(config.token ? { Authorization: config.token } : {}),
        'Content-Type': 'application/json',
        "X-Requested-With": 'XMLHttpRequest'
      }
    }), ctx);    
  }
  await next();
};