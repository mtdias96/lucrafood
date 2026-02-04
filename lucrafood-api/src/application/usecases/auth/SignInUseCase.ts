import { compare } from 'bcrypt';

import { Unauthorized } from '@application/errors/http/Unauthorization';

import { AccountRepository } from '@infra/database/drizzle/repository/AccountRepository';
import { JwtProvider } from '@infra/security/JwtProvider';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtProvider,
  ) { }

  async execute(input: SignInUseCase.Input): Promise<SignInUseCase.Output> {
    const { email, password } = input;

    const account = await this.accountRepository.findByEmail(email);

    if (!account) { throw new Unauthorized('Invalid credentials'); }

    const decoded = await compare(password, account.passwordHash);

    if (!decoded) { throw new Unauthorized('Invalid credentials'); }

    const accessToken = await this.jwtService.signAccessToken({
      sub: String(account.id),
      email: account.email,
    });

    return {
      accessToken,
    };
  }
}

export namespace SignInUseCase {
  export type Input = {
    email: string;
    password: string;
  }

  export type Output = {
    accessToken: string
  }
}
