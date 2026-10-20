import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DomainExceptionFilter } from "./shared/presentation/domain-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.enableShutdownHooks();
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);   
}

void bootstrap();