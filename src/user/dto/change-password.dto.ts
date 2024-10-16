import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto{
    @IsString()
    @MinLength(6)
    contrasenaNueva : string;

    @IsString()
    @MinLength(6)
    contrasenaConfirmacion : string;
}