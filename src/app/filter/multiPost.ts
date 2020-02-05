import config from '../config';
import request from '../util/request';
import { delegateResponse } from '../util/delegate';

export default async (ctx, next) => {
  const url = ctx.request.path;
  const contentType = ctx.headers['content-type'] || 'application/x-www-form-urlencoded';
  if (contentType.indexOf('multipart/form-data') !== -1) {
    console.log('proxy multiPost', url);
    return new Promise(resolve => {
      //文件上传
      const data = [];
      ctx.req.addListener('data', function (chunk) {
        data.push(chunk); //读取参数流转化为字符串
      });
      ctx.req.addListener('end', function () {
        const body = Buffer.concat(data);
        request.post(config.getUrl() + url, {
          body: body,
          rejectUnauthorized: false,
          headers: {
            'Content-Type': contentType,
            ...(config.token ? { Authorization: `bearer ${config.token}` } : {}),
            Connection: 'keep-alive',
            "X-Requested-With": 'XMLHttpRequest'
          }
        }, function (error, response, body) {
          delegateResponse(response, ctx, error);
          resolve();
        });
      });
    });
  }
  await next();
};