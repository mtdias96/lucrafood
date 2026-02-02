
import { Account } from '@application/entities/Account';
import { Conflict } from '@application/errors/http/NotFound';
import { AccountRepository } from '@infra/database/repository/AccountRepository';
import { JwtProvider } from '@infra/security/JwtProvider';
import { Injectable } from '@kernel/decorators/Injactable';
import { hash } from 'bcrypt';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtProvider,

  ) { };

  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const { email, name, password } = input;
    const accountAlreadyExists = await this.accountRepository.findByEmail(email);

    if (accountAlreadyExists) { throw new Conflict('Account already exists'); }

    const passwordHash = await hash(password, 10);

    const account = new Account({ email, name, passwordHash });

    await this.accountRepository.create(account);

    const accessToken = await this.jwtService.signAccessToken({
      sub: String(account.id),
      email: account.email,
    });

    return {
      accessToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  }

  export type Output = {
    accessToken: string
  }
}
