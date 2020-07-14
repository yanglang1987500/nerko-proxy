import config from '../config';
import request from '../util/request';
import { delegateResponse } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';

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
  return new Promise(resolve => {
    request.get({
      url: config.getUrl() + url,
      rejectUnauthorized: false,
      qs: param,
      headers: {
        ...(config.token ? { Authorization: config.token } : {}),
        "X-Requested-With": 'XMLHttpRequest'
      }
    }, function (error, response, body) {
      delegateResponse(response, ctx, error);
      resolve();
    });
  });
};