import { BadRequestException, PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
        throw new BadRequestException({ 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data.', 
            issues: result.error.issues.map((issue) => ({ 
                field: issue.path.join("."), 
                message: issue.message 
            }))
        });
    }

    return result.data 
  }
}