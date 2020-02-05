import config from '../config';

// 处理cookie失效重新登录
let loginPromise = null;

export default async (ctx, next) => {
  if (!config.getClient().needLogin) {
    return await next();
  }
  if (loginPromise) {
    // console.log('is relogin..., push in to queue');
    await loginPromise;
    await next();
  } else if (!loginPromise && (new Date().getTime() - config.lastTime) >= config.getClient().session) {
    // console.log('cookie outdate, start relogin');
    loginPromise = config.getClient().doLogin(config.account, config.password);
    await loginPromise;
    config.refreshLastTime();
    // console.log('relogin success');
    loginPromise = null;
    await next();
  } else {
    await next();
  }
};
