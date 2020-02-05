import config from '../config';

const cookieMap = {};

export default async (ctx, next) => {
  const jar = config.getJar();
  const cookieStr = jar.getCookieString(config.getUrl());
  if (!cookieStr)
    return;
  if (cookieMap[cookieStr]) {
    return cookieMap[cookieStr].forEach((item) => {
      ctx.cookies.set(item.name, item.value, {
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        maxAge: 999999999,
        secure: false,
        signed: false
      });
    })
  }
  const obj = [];
  cookieStr.split(';').map(item => {
    const arr = item.trim().split('=');
    obj.push({
      name: arr[0],
      value: arr[1]
    });
    ctx.cookies.set(arr[0], arr[1], {
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      maxAge: 999999999,
      secure: false,
      signed: false
    });
  });
  cookieMap[cookieStr] = obj;
  await next();
};