import config from '../config';
import request from '../util/request';
import { delegateResponse, tryCatchWrap } from '../util/delegate';
import { ParameterizedContext, Next } from 'koa';
import * as Router from 'koa-router';
import { axios } from '../..';

export default async (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {
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
      ctx.req.addListener('end', async function () {
        const body = Buffer.concat(data);
        await tryCatchWrap(() => axios.post(config.getUrl() + url, body, {
          headers: {
            'Content-Type': contentType,
            ...(config.token ? { Authorization: config.token } : {}),
            Connection: 'keep-alive',
            "X-Requested-With": 'XMLHttpRequest'
          }
        }), ctx);
        resolve();
      });
    });
  }
  await next();
};