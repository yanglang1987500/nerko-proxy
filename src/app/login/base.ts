abstract class Base {

  host: string = '';
  login: string = '';
  port: number = 3001;
  session: number = 1000 * 60 * 10; // session out 
  type: string = '';
  needLogin: boolean = true;

  doLogin(userName: string, password: string) {
    return new Promise(resolve => resolve());
  };
}

export default Base;