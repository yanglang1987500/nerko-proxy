export const delegateResponse = (innerResponse, ctx, error) => {
  if (error != null) {
    ctx.status = 400;
    ctx.body = error.toString();
    return;
  }
  const body = innerResponse.body;
  innerResponse && (ctx.status = innerResponse.statusCode);
  const dataType = Object.prototype.toString.call(body);
  switch (dataType) {
    case '[object String]':
      ctx.body = body;
      break;
    case '[object Number]':
      ctx.body = (`${body}`);
      break;
    case '[object Boolean]':
      ctx.body = (body);
      break;
    case '[object Object]':
    case '[object Array]':
      ctx.body = (body);
      break;
    default:
      ctx.body = ('');
  }
};