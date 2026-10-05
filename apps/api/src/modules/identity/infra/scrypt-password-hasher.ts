import { promisify } from "node:util";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { PasswordHasher } from "../domain/password-hasher";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

// o scrypt é uma key derivation function: além de irreversível, ele é lento e consome muita memória de propósito. Isso encarece cada tentativa de quem tenta adivinhar senhas aos milhões. Um hash comum (como SHA-256) é rápido demais para guardar senhas.
const scrypt = promisify(scryptCallback);

// hash: uma "impressão digital" da senha, gerada por uma função matemática de mão única (dá para ir da senha ao hash, mas não do hash de volta à senha).
export class ScryptPasswordHasher extends PasswordHasher {
    // plain é a senha.
    async hash(plain: string): Promise<string> {
        // salt são 16bytes alatorios.
        const salt = randomBytes(SALT_LENGTH);

        // cria um hash misturando a senha e o salt(16bytes aleatorios) e retorna um buffer(binario).
        // o salt faz duas pessoas com a mesma senha terem hashes diferentes no banco;
        const derivedKey = (await scrypt(plain, salt, KEY_LENGTH)) as Buffer

        // cria uma sting só de salt:hash para guardar no banco.
        // .toString('hex'): transforma dados binarios(buffer) em hexadecimal.
        return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
    }

    async verify(plain: string, hash: string): Promise<boolean> {
        // pega o hash que vem do banco e separa o salt do hash.
        const [saltHex, hashHex] = hash.split(":");

        if (!saltHex || !hashHex) {
            return false
        }

        // transforma o salt em formato de hexadecimal em um buffer(binario).
        const salt = Buffer.from(saltHex, 'hex');
        // transforma o hash em formato de hexadecimal em um buffer(binario).
        const expectedHash = Buffer.from(hashHex, 'hex');

        // com a senha digitada pelo usuario e o salt retirado do banco podemos criar a mesmo buffer(binario) que foi criado ao fazer o hashing.
        const derivedKey = (await scrypt(plain, salt, KEY_LENGTH)) as Buffer;

        if (derivedKey.length !== expectedHash.length) return false;

        // compara os dois hash(buffers).
        return timingSafeEqual(derivedKey, expectedHash);
    }
}