import { Module } from "@nestjs/common";
import { PrismaModule } from "./shared/infra/prisma/prisma.module";
import { IdentityModule } from "./modules/identity/identity.module";

@Module({
    imports: [PrismaModule, IdentityModule],
})
export class AppModule {}