import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Estado } from "../enum/estado.enum";
import { Role } from "../enum/roles.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({unique: true})
    email: string;

    @Column()
    contrasena : string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.user
    })
    role: string;

    @Column({
        type: 'enum',
        enum: Estado,
        default: Estado.activo
    })
    estado: string;
}