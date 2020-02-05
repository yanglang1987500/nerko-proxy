
import * as Router from 'koa-router';
import doFilter from './filterManage';
import config from './config';
import { Method } from './util/enum';

export const start = async (router: Router) => {
  await config.getClient().doLogin(config.account, config.password).then(() => config.refreshLastTime());
  
  router.get('*', async (ctx, next) => {
    await doFilter(Method.get, ctx, next);
  });
  router.post('*', async (ctx, next) => {
    await doFilter(Method.post, ctx, next);
  });
  router.put('*', async (ctx, next) => {
    await doFilter(Method.put, ctx, next);
  });
  router.delete('*', async (ctx, next) => {
    await doFilter(Method.delete, ctx, next);
  });
};