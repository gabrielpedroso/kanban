import { Module } from "@nestjs/common";
import { IdGenerator } from "../../domain/id-generator";
import { UuidIdGenerator } from "../uuid-id-generator";

@Module({ 
    providers: [{ provide: IdGenerator, useClass: UuidIdGenerator }],
    exports: [IdGenerator]
 })
export class IdModule {}