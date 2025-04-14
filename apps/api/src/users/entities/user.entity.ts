import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';

export class User {
    @Expose()
    username: string;
    @Expose()
    email: string;
    @Exclude()
    password: string;
}
