export abstract class JwtService {
  abstract signAccessToken(payload: JwtService.Payload): Promise<string>;
}

export namespace JwtService {
  export type Payload = {
    sub: string;
    email?: string;
  };
}
