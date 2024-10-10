import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { Rol } from './enum/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  //Constructor
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtServ: JwtService,
    private readonly configService: ConfigService,
  ) { }

  // Funcion para verificar la existencia de un usuario para evitar repetir el codigo
  private async verificarExistenciaUsuario(email: string) {
    const existeUsuario = await this.userRepository.findOne({
      where: { email },
    });

    return existeUsuario;
  }

  // Contrasena hasheada usando bcrypt
  private async contrasenaHash (contrasena: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(contrasena, salt);
  }

  // Crear usuario
  async create(createUserDto: CreateUserDto, creator?: User): Promise<User> {
    // Se verifica que el que esté agregando un nuevo usuario sea administrador
    if (creator && creator.rol !== Rol.admin) {
      throw new UnauthorizedException("Solo administradores pueden agregar nuevos usuarios")
    }

    const { nombre, apellido, email, contrasena, rol, estado } = createUserDto;

    // Se verifica si el usuario existe por su email
    const existeUsuario = await this.verificarExistenciaUsuario(email);

    // Si el usuario existe significa que ya está registrado y no puede registrarse nuevamente
    if (existeUsuario) {
      throw new NotFoundException('El usuario ya existe, inténtalo nuevamente');
    }

    // Se hashea la contrasena recibida
    const hashedContrasena = await this.contrasenaHash(contrasena);

    // Creacion del usuario nuevo
    const usuario = this.userRepository.create({
      nombre,
      apellido,
      contrasena: hashedContrasena,
      email,
      estado,
      rol: rol || Rol.usuario
    });
    
    return this.userRepository.save(usuario);
  }

  // Encontrar todos los usuarios sin su contrasena
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'nombre',
        'apellido',
        'email',
        'estado',
        'rol'
      ]
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // Modificar usuarios
  async update(email: string, updateUserDto: UpdateUserDto) {

    const existeUsuario = await this.userRepository.findOne({
      where: { email: email }
    })

    if (!existeUsuario) {
      throw new NotFoundException("El usuario no existe, intentalo nuevamente");
    }

    const infoOriginal = { ...existeUsuario };

    for (const key of Object.keys(updateUserDto)) {
      if (key in existeUsuario) {
        existeUsuario[key] = updateUserDto[key];
      }
    }

    try {
      await this.userRepository.save(existeUsuario);

      const infoActualizada = Object.keys(updateUserDto).reduce(
        (acc, key) => {
          if (updateUserDto[key] !== infoOriginal[key]) {
            acc[`new ${key}`] = updateUserDto[key];
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Usuario actualizado exitosamente',
        data: infoActualizada
      };
    } catch (error) {
      throw new InternalServerErrorException('Falló la actualizacion del usuario')
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
