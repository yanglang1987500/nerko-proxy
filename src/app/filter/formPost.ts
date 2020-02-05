import config from '../config';
import request from '../util/request';
import { delegateResponse } from '../util/delegate';

export default async (ctx, next) => {
  const url = ctx.request.path;
  const contentType = ctx.headers['content-type'] || 'application/x-www-form-urlencoded';
  if (contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
    console.log('proxy formPost', url);
    return new Promise(resolve => {
      request.post(config.getUrl() + url, {
        form: ctx.request.body,
        rejectUnauthorized: false,
        headers: {
          ...(config.token ? { Authorization: `bearer ${config.token}` } : {}),
          'Content-Type': 'application/x-www-form-urlencoded',
          "X-Requested-With": 'XMLHttpRequest'
        }
      }, function (error, response, body) {
        delegateResponse(response, ctx, error);
        resolve();
      });
    });
  }
  await next();
};