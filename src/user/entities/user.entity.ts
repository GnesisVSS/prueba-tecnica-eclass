import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Estado } from "../enum/estado.enum";
import { Rol } from "../enum/roles.enum";

@Entity('usuarios')
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
        enum: Rol,
        default: Rol.usuario
    })
    rol: string;

    @Column({
        type: 'enum',
        enum: Estado,
        default: Estado.activo
    })
    estado: string;
}