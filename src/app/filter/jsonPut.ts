import config from '../config';
import request from '../util/request';
import { delegateResponse } from '../util/delegate';

export default async (ctx, next) => {
  const url = ctx.request.path;
  const contentType = ctx.headers['content-type'] || 'application/x-www-form-urlencoded';
  console.log('contentType', contentType);
  if (contentType.indexOf('application/json') !== -1) {
    console.log('proxy jsonPut', url);
    return new Promise(resolve => {
      request.put(config.getUrl() + url, {
        qs: ctx.request.body,
        body: ctx.request.body,
        json: true,
        rejectUnauthorized: false,
        headers: {
          ...(config.token ? { Authorization: config.token } : {}),
          'Content-Type': 'application/json',
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