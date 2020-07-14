import config from '../config';
import request from '../util/request';import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
  ctx.body = ('resource not found!');
};