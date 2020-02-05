## Nerko Proxy 

一个nodejs代理库，支持如下功能点：

1. 自定义代理点
1. 自定义代理点的登录，及超时重登
1. get/post/put/delete请求代理，支持各类content-type请求，如json/formdata/multi-form（文件上传）等，支持token认证。
1. 提供本地拦截匹配，支持mock.js解析。
1. 提供d.ts声明。

使用方式如下：
```javascript
import mock, { register } from 'nerko-proxy';
import map from './data';
import Baidu from './baidu';

register(new Baidu());
mock(map, __dirname);
```

baidu.ts(自定义登录点实现)
```javascript
import mock, { register, BasePoint } from 'nerko-proxy';

class Baidu extends BasePoint {
  type = 'Baidu';
  port = 3001;
  needLogin = false;
  host = 'http://www.baidu.com';
}

export default Baidu;
```

data.ts
```javascript
export default {
  '/api/list': './localdata/list.json',
};
```

运行截屏：

![](https://s2.ax1x.com/2020/02/05/1rTXM6.png)
![](https://s2.ax1x.com/2020/02/05/1rTjsK.png)