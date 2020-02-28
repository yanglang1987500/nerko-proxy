const responseMap = {
  '[object String]': (body: any) => body,
  '[object Number]': (body: any) => `${body}`,
  '[object Boolean]': (body: any) => body,
  '[object Object]': (body: any) => body,
  '[object Array]': (body: any) => body,
};

export const delegateResponse = (innerResponse, ctx, error) => {
  if (error != null) {
    ctx.status = 500;
    ctx.body = error.toString();
    return;
  }
  const body = innerResponse.body;
  innerResponse && (ctx.status = innerResponse.statusCode);
  const dataType = Object.prototype.toString.call(body);
  ctx.body = responseMap[dataType] ? responseMap[dataType](body) : '';
};