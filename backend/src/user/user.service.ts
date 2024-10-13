import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { Rol } from './enum/roles.enum';
import * as bcrypt from 'bcrypt';
import { searchDto } from './dto/search.dto';

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
  private async contrasenaHash(contrasena: string): Promise<string> {
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
      throw new ConflictException('El usuario ya existe, inténtalo nuevamente');
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

  async login(loginDto: LoginDto) {
    const { contrasena, email } = loginDto;

    // Verifica la existencia del usuario
    const existeUsuario = await this.verificarExistenciaUsuario(email);

    // Si no existe retorna error
    if (!existeUsuario) {
      throw new NotFoundException("El usuario no existe, intentalo nuevamente");
    }

    // Compara la contraseña encriptada con la contraseña ingresada en el login
    const verificarContrasena = await bcrypt.compare(
      contrasena,
      existeUsuario.contrasena
    );

    // Si la contraseña no coincide lanza un error
    if (!verificarContrasena) {
      throw new UnauthorizedException("Contraseña inválida");
    };

    // Generación del token
    const token = this.jwtServ.sign(
      {
        sub: existeUsuario.id,
        rol: existeUsuario.rol,
        email: existeUsuario.email
      },
      {
        secret: this.configService.get<string>('JWT_SECRET')
      }
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Login exitoso',
      jwt_token: token
    };
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

  // Modificar usuarios
  async update(email: string, updateUserDto: UpdateUserDto) {

    // Verificar si el usuario existe
    const existeUsuario = await this.verificarExistenciaUsuario(email);
  
    if (!existeUsuario) {
      throw new NotFoundException("El usuario no existe, intentalo nuevamente");
    }
  
    // Guardar la información original del usuario
    const infoOriginal = { ...existeUsuario };
  
    // Evitar que se actualice la contraseña
    for (const key of Object.keys(updateUserDto)) {
      if (key === 'contrasena') {
        throw new ForbiddenException("No puedes actualizar la contraseña directamente")
      }
      if (key in existeUsuario) {
        existeUsuario[key] = updateUserDto[key];
      }
    }
  
    try {
      // Guardar los cambios
      await this.userRepository.save(existeUsuario);
  
      // Crear un objeto con los campos que fueron actualizados
      const infoActualizada = Object.keys(updateUserDto).reduce(
        (acc, key) => {
          if (updateUserDto[key] !== infoOriginal[key] && key !== 'contrasena') {
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
      throw new InternalServerErrorException('Falló la actualización del usuario');
    }
  }
  

  // Eliminar un usuario
  async delete(email: string) {
    const existeUsuario = await this.verificarExistenciaUsuario(email);

    if (!existeUsuario) {
      throw new NotFoundException("El usuario no existe, intentalo nuevamente");
    }

    try {
      const resultado = await this.userRepository.delete(existeUsuario)

      if (resultado.affected === 0) {
        throw new NotFoundException("El usuario no existe, intentalo nuevamente");
      }
      return { message: 'Usuario eliminado exitosamente' };

    } catch (error) {
      throw new InternalServerErrorException('Falló la eliminación del usuario')
    }

  }

  //Encontrar la información de un usuario especifico
  async findOne(email: string): Promise<User> {
    try {
      const usuario = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'nombre', 'apellido', 'email', 'estado', 'rol']
      });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      throw new InternalServerErrorException('Algo salió mal en la busqueda del usuario especificado')
    }
  }

  //Filtro dinámico de usuarios
  async searchUser(searchUser: searchDto): Promise<Partial<User>[]>{
    try {
      const {email, nombre, apellido, rol, estado} = searchUser;


      const query: any = {
        select: [
          'id',
          'email',
          'nombre',
          'apellido',
          'rol',
          'estado'
        ],
        where: {}
      };

      if(email) {
        query.where['email'] = Like(`%${email}`);
      }

      if(nombre) {
        query.where['nombre'] = Like(`%${nombre}`);
      }

      if(apellido) {
        query.where['apellido'] = Like(`%${apellido}`);
      }

      if(rol) {
        query.where['rol'] = Like(`${rol}`);
      }

      if(estado) {
        query.where['estado'] = Like(`${estado}`);
      }

      const usuario = await this.userRepository.find(query);

      if(usuario.length <= 0){
        return [];
      }

      return usuario;
      
    } catch (error) {
      throw new BadRequestException('Error al buscar el usuario')
    }
  }

  async updatePassword(email: string, contrasenaActual: string, contrasenaNueva: string, contrasenaConfirmacion: string): Promise<{ statusCode: number, message: string }>{
    const existeUsuario = await this.verificarExistenciaUsuario(email);

    if(!existeUsuario){
      throw new NotFoundException('El usuario no existe, intentalo nuevamente');
    }

    const contrasenaCoincide = await bcrypt.compare(contrasenaActual, existeUsuario.contrasena);

    if(!contrasenaCoincide){
      throw new UnauthorizedException('La contraseña actual con la registrada en la base de datos no coinciden');
    }

    if(contrasenaNueva !== contrasenaConfirmacion){
      throw new UnauthorizedException('La contraseña nueva con su correspondiente verificación no coincide');
    }

    const contrasenaHasheada = await this.contrasenaHash(contrasenaNueva);

    existeUsuario.contrasena = contrasenaHasheada;

    try {
      await this.userRepository.save(existeUsuario);
      return {
        statusCode: HttpStatus.OK,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      throw new InternalServerErrorException('Falló la actualización de la contraseña')
    }
  }
}
