const responseMap = {
  '[object String]': (body: any) => body,
  '[object Number]': (body: any) => `${body}`,
  '[object Boolean]': (body: any) => body,
  '[object Object]': (body: any) => body,
  '[object Array]': (body: any) => body,
};

export const delegateResponse = (innerResponse, ctx, error) => {
  if (error != null) {
    ctx.status = innerResponse ? innerResponse.status : 500;
    ctx.body = error.toString();
    return;
  }
  const body = innerResponse.data;
  innerResponse && (ctx.status = innerResponse.status);
  const dataType = Object.prototype.toString.call(body);
  ctx.body = responseMap[dataType] ? responseMap[dataType](body) : '';
};

export const tryCatchWrap = async (executor: () => Promise<any>, ctx) => {
  try {
    const res = await executor();
    delegateResponse(res, ctx, null);
  } catch(e) {
    delegateResponse(e.response, ctx, e);
  }
}