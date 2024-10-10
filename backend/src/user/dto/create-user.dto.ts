import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    apellido: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    contrasena : string;

    @IsOptional()
    rol: string;

    @IsOptional()
    estado: string;
}
