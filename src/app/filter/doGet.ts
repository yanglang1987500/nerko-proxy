import config from '../config';
import request from '../util/request';
import { delegateResponse } from '../util/delegate';

export default async (ctx, next) => {
  const url = ctx.request.path;
  console.log('proxy get ', url)
  const param = { ...ctx.query };
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