import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as colors from 'colors-console';
import * as inquirer from 'inquirer';
import * as cors from 'koa2-cors';
import * as Router from 'koa-router';
import config from './app/config';
import { start } from './app/index.js';
import Base from "./app/login/base";

const Applicaton = async (mockMapping: IKeyValueMap, mockDataPath: string, origin: string) => {

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
    origin: () => origin,
    credentials: true,
  }));

  config.setMockDataPath(mockDataPath);
  config.setMockMapping(mockMapping);
  console.log(colors('red', ``)); 
  const answer = await inquirer.prompt({
    name: 'type',
    type: 'rawlist',
    message: 'Please select which point you want to login in',
    choices: config.points.map(p => p.type)
  });
  config.setType(answer.type);

  const point = config.getClient();
  if (point.needLogin) {
    const answer1 = await inquirer.prompt({
      name: 'account',
      type: 'input',
      message: `Please type in ${colors('green', config.type)} account `
    });
    config.setAccount(answer1.account);
    const answer2 = await inquirer.prompt({
      name: 'password',
      type: 'mask',
      message: `Please type in ${colors('green', config.type)} password `
    });
    config.setPassword(answer2.password);
  }

  console.log(`${colors('green', config.type)} agency start on port: ${colors('red', config.getPort())}`);
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
