import Base from '../base';

class None extends Base {
  
  constructor() {
    super();
    this.port = 3001;
    this.type = 'None';
    this.needLogin = false;
  }

}

export default None;