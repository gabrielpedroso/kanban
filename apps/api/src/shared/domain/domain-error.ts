// abstract class Não pode ser instanciada com new. Só serve de base para outras
export abstract class DomainError extends Error {
    // Obriga toda classe filha a definir um code
    abstract readonly code: string

    constructor(message: string) {
        super(message);
        // new.target é a classe que foi realmente instanciada com new
        this.name = new.target.name
    }
}