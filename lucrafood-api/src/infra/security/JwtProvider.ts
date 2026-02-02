import { JwtService } from '@application/contracts/TokenService';
import { Injectable } from '@kernel/decorators/Injactable';
import { SignJWT } from 'jose';

@Injectable()
export class JwtProvider extends JwtService {
  private readonly secret: Uint8Array;
  private readonly issuer = process.env.JWT_ISSUER ?? 'api';
  private readonly audience = process.env.JWT_AUDIENCE ?? 'web';

  constructor() {
    super();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is missing');
    }

    this.secret = new TextEncoder().encode(secret);
  }

  async signAccessToken(payload: JwtService.Payload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime('7d')
      .sign(this.secret);
  }
}
