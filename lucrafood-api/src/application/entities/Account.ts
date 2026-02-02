import { randomUUID } from 'node:crypto';

export class Account {
  readonly email: string;
  readonly name: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
  id: string;

  constructor(attrs: Account.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.email = attrs.email;
    this.name = attrs.name;
    this.passwordHash = attrs.passwordHash;
    this.createdAt = attrs.createdAt ?? new Date();

  }
}
export namespace Account {
  export type Attributes = {
    id?: string
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date;
  };

}
