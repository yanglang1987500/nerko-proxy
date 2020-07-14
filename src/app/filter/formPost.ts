import config from '../config';
import { delegateResponse, tryCatchWrap } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';
import axios from '../util/axios';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const url = ctx.request.path;
  const contentType = ctx.headers['content-type'] || 'application/x-www-form-urlencoded';
  if (contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
    console.log('proxy formPost', url);
    return tryCatchWrap(() => axios.post(config.getUrl() + url, ctx.request.body, {
      headers: {
        ...(config.token ? { Authorization: config.token } : {}),
        'Content-Type': 'application/x-www-form-urlencoded',
        "X-Requested-With": 'XMLHttpRequest'
      }
    }), ctx);
  }
  await next();
};