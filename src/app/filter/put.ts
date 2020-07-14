import config from '../config';
import request from '../util/request';
import { delegateResponse, tryCatchWrap } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';
import { axios } from '../..';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  const url = ctx.request.path;
  console.log('proxy put ', url)
  const param = { ...ctx.query };
  return tryCatchWrap(() => axios.put(config.getUrl() + url, param, {
    headers: {
      ...(config.token ? { Authorization: config.token } : {}),
      'Content-Type': 'application/json'
    }
  }), ctx)
};