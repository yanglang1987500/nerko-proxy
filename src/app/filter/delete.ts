import config from '../config';
import request from '../util/request';
import { delegateResponse } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const url = ctx.request.path;
  console.log('proxy delete ', url)
  const param = { ...ctx.query };
  return new Promise(resolve => {
    request.delete(config.getUrl() + url, {
      qs: param,
      body: param,
      json: true,
      rejectUnauthorized: false,
      headers: {
        ...(config.token ? { Authorization: config.token } : {}),
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, function (error, response, body) {
      delegateResponse(response, ctx, error);
      resolve();
    });
  });
};