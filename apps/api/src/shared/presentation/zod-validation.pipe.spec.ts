import { z } from "zod";
import { BadRequestException } from "@nestjs/common";
import { ZodValidationPipe } from "./zod-validation.pipe";

const schema = z.object({ email: z.email(), name: z.string().trim().min(1) });

describe('ZodValidationPipe', () => {
    const pipe = new ZodValidationPipe(schema);

    it('should return the validated data when the input is valid', () => {
        
        const value = pipe.transform({ email: "test@email.com", name: " teste " });

        expect(value).toEqual({ email: "test@email.com", name: "teste"});
    });

    it('should throw BadRequestException when the input is invalid', () => {
        let error: unknown;

        try {
            pipe.transform({ email: "", name: "teste" });
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).getResponse()).toMatchObject({
            code: "VALIDATION_ERROR",
            issues: [{ field: "email"}]
        })
    });
});