import config from '../config';
import { delegateResponse, tryCatchWrap } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';
import axios from '../util/axios';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const url = ctx.request.path;
  console.log('proxy get ', url)
  const param = Object.keys(ctx.query).reduce((p, c) => {
    if (/\[\]$/.test(c) && Object.prototype.toString.call(ctx.query[c]) === '[object Array]') {
      p[c.replace('[]', '')] = ctx.query[c];
    } else {
      p[c] = ctx.query[c];
    }
    return p;
  }, {});
  return tryCatchWrap(() => axios.get(config.getUrl() + url, {
    params: param,
    headers: {
      ...(config.token ? { Authorization: config.token } : {}),
      "X-Requested-With": 'XMLHttpRequest'
    }
  }), ctx);
};