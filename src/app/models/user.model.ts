export interface User {
    id: string | null | undefined;
    nome: string;
    sobrenome: string;
    email: string;
    dataNascimento: Date;
    escolaridade: number;
}