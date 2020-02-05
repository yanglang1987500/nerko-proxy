import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as readline from 'readline-sync';
import * as cors from 'koa2-cors';
import * as Router from 'koa-router';
import config from './app/config';
import { start } from './app/index.js';
import Base from "./app/login/base";

const Applicaton = (mockMapping, mockDataPath) => {

  const router = new Router();
  const app = new Koa();

  app.use(bodyParser());
  app.use(async (ctx, next) => {
    // 自定义中间件，设置跨域需要的响应头。
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    await next();
  });

  app.use(cors({
    origin: () => "*",
    credentials: true,
  }));

  config.setMockDataPath(mockDataPath);
  config.setMockMapping(mockMapping);
  const type = readline.question(`Please select which point you want to login in and type in number 
  ${config.points.map((point, index) => `\n ${index}: ${point.type}`).join('')}
  `);
  config.setType(config.points[parseInt(type, 10)].type);

  const point = config.getClient();
  if (point.needLogin) {
    const account = readline.question(`Please type in ${config.type} account :\n`);
    config.setAccount(account);
    const password = readline.question(`Please type in ${config.type} password :\n`);
    config.setPassword(password);
  }

  console.log(`${config.type} agency start on port:${config.getPort()}`);
  app.use(router.routes()).use(router.allowedMethods());

  start(router);
  app.listen(config.getPort(), () => {
    console.log(`server is starting at \n host:${config.getUrl()} \n port: ${config.getPort()}`);
  });
};
export default Applicaton;

export const register = (point: Base) => {
  config.register(point);
};

export const setToken = config.setToken.bind(config);

export { default as BasePoint } from './app/login/base';
export { default as request } from './app/util/request';


// ihwith36_251
// Autest123!

// 50001-559  
// Susan@1234