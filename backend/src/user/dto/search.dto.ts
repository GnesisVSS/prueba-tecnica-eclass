import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Rol } from "../enum/roles.enum";
import { Estado } from "../enum/estado.enum";

export class searchDto {

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(10)
    nombre?: string;

    @IsString()
    @MinLength(3)
    @MaxLength(10)
    apellido?: string;

    @IsString()
    @IsOptional()
    rol?: Rol;

    @IsString()
    @IsOptional()
    estado?: Estado;

}