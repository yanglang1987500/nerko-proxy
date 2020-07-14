import config from '../config';
import axios from '../util/axios';
import { delegateResponse, tryCatchWrap } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const url = ctx.request.path;
  console.log('proxy delete ', url)
  const param = { ...ctx.query };
  return tryCatchWrap(() => axios.delete(config.getUrl(), {
    params: param,
    data: param,
    headers: {
      ...(config.token ? { Authorization: config.token } : {}),
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }), ctx);  
};