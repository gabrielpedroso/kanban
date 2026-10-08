import { Injectable } from "@nestjs/common";
import { User } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";
import { PrismaService } from "../../../shared/infra/prisma/prisma.service";
import { Prisma, User as UserRow } from "@prisma/client";
import { EmailAlreadyInUseError } from "../domain/errors";

@Injectable()
export class PrismaUserRepository extends UserRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    private toDomain(data: UserRow): User {
        return User.restore({ 
            id: data.id, 
            name: data.name, 
            email: data.email, 
            passwordHash: data.passwordHash, 
            createdAt: data.createdAt
        })
    }

    async insert(user: User): Promise<void> {
        try {
            await this.prisma.user.create({ 
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    passwordHash: user.passwordHash,
                    createdAt: user.createdAt
                } 
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new EmailAlreadyInUseError();
            }

            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
       const user = await this.prisma.user.findUnique({ where: { email } })

       return user ? this.toDomain(user) : null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id }})

        return user ? this.toDomain(user) : null;
    }
}