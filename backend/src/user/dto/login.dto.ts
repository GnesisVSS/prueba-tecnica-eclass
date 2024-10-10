import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto extends PickType(User, ['email','contrasena']){
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    contrasena: string;
}