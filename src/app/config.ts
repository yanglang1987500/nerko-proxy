import { None } from './login/index';
import request, { jar } from './util/request';
import Base from './login/base';

class Config {

  type: string = '';
  account: string = '';
  password: string = '';
  jar: any = null;
  mockMapping: IKeyValueMap = {};
  mockDataPath: string = '';
  lastTime = new Date().getTime();
  token: string = null;
  points: Base[] = [];

  setType(type) {
    this.type = type;
  }
  
  getClient() {
    return this.points.find(point => point.type === this.type);
  }
  
  getPort() {
    const client = this.getClient();
    return client ? client.port : 3001;
  }

  setToken(token) {
    this.token = token;
  }

  getJar() {
    return jar;
  }

  setAccount(account) {
    this.account = account;
  }

  setPassword(password) {
    this.password = password;
  }

  getUrl() {
    return this.getClient().host;
  }

  refreshLastTime() {
    this.lastTime = new Date().getTime();
  }

  setMockMapping(mapping) {
    this.mockMapping = mapping;
  }

  setMockDataPath(path) {
    this.mockDataPath = path;
  }

  register(point: Base) {
    // replace point with the same name
    this.points = this.points.filter(p => p.type !== point.type);
    this.points.push(point)
    this.orderPoints();
  }

  unregister(point: Base) {
    this.points = this.points.filter(p => p.type !== point.type);
  }

  orderPoints() {
    const none = originPoints[originPoints.length - 1];
    this.points = this.points.sort((a, b) => a.type.localeCompare(b.type)).filter(p => p !== none);
    this.points.push(none);
  }
}

const config = new Config();
const originPoints: Base[] = [new None()];
originPoints.forEach(point => config.register(point));

export default config;