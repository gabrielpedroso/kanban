import { randomUUID } from "node:crypto";
import { IdGenerator } from "../domain/id-generator";

export class UuidIdGenerator extends IdGenerator {
    next(): string {
        return randomUUID()
    }
}