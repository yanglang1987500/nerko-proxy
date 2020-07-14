import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import * as tough from 'tough-cookie';
import { Agent } from 'https';

export const jar = new tough.CookieJar();
const instance = axios.create({
  jar,
  withCredentials: true,
  httpsAgent: new Agent({  
    rejectUnauthorized: false
  })
});
 
axiosCookieJarSupport(instance);
instance.defaults.jar = jar;
export default instance;