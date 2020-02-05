const _request = require('request');

const _jar = _request.jar();
const request = _request.defaults({
  jar: _jar
});

export const jar = _jar;
export default request;