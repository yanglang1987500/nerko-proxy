import config from '../config';
import request from '../util/request';
import { delegateResponse } from '../util/delegate';

export default async (ctx, next) => {
  const url = ctx.request.path;
  console.log('proxy put ', url)
  const param = { ...ctx.query };
  return new Promise(resolve => {
    request.put(config.getUrl() + url, {
      qs: param,
      body: param,
      json: true,
      rejectUnauthorized: false,
      headers: {
        ...(config.token ? { Authorization: config.token } : {}),
        'Content-Type': 'application/json'
      }
    }, function (error, response, body) {
      delegateResponse(response, ctx, error);
      resolve();
    });
  });
};