import * as UrlPattern from 'url-pattern';
import * as fs from 'fs';
import * as path from 'path';
import * as Mock from 'mockjs';
import config from '../config';

export default async (ctx, next) => {
  const url = ctx.request.path;
  const mockData = filter(url);
  if (mockData) {
    console.log('===========命中本地mock===========', url);
    ctx.status = 200;
    ctx.body = mockData;
    return;
  }
  await next();
};

const filter = (url) => {
  const map = config.mockMapping;
  for (const key in map) {
    const pattern = new UrlPattern(key);
    if (pattern.match(url)) {
      let result: any = fs.readFileSync(path.join(config.mockDataPath, map[key])) + '';
      try {
        result = JSON.parse(result);
        result = Mock.mock(result);
      } catch (e) {
        console.log('error', e);
      }
      if (Object.prototype.toString.call(result) === '[object Object]' && result._array_) {
        result = result._array_;
      }
      if (Object.prototype.toString.call(result) === '[object Number]') {
        result += '';
      }
      return result;
    }
  }
  return null;
}