import { getSchema } from '@kernel/decorators/Schema';

type TRouteType = 'public' | 'private';

export abstract class Controller<TType extends TRouteType, TResBody = undefined> {
  protected abstract handle(
    request: Controller.Request<TType>,
  ): Promise<Controller.Response<TResBody>>;

  public async execute(
    request: Controller.Request<TType>,
  ): Promise<Controller.Response<TResBody>> {
    const body = this.validateBody(request.body);

    return this.handle({
      ...request,
      body,
    });
  }

  private validateBody(body: Controller.Request<TType>['body']) {
    const schema = getSchema(this);
    if (!schema) { return body; }

    return schema.parse(body);
  }
}

export namespace Controller {
  export type BaseRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
    THeaders = Record<string, string>,
  > = {
    body: TBody;
    params: TParams;
    queryParams: TQueryParams;
    headers: THeaders;
  };

  export type PublicRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
    THeaders = Record<string, string>,
  > = BaseRequest<TBody, TParams, TQueryParams, THeaders>;

  export type PrivateRequest<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
    THeaders = Record<string, string>,
  > = BaseRequest<TBody, TParams, TQueryParams, THeaders> & {
    accountId: string;
  };

  export type Request<
    TType extends TRouteType,
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    THeaders = Record<string, string>,
    TQueryParams = Record<string, unknown>,
  > = TType extends 'public'
    ? PublicRequest<TBody, TParams, TQueryParams, THeaders>
    : PrivateRequest<TBody, TParams, TQueryParams, THeaders>;

  export type Response<TBody = undefined> = {
    statusCode: number;
    body?: TBody;
  };
}
