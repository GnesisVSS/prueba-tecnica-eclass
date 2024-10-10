import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

  //Constructor
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtServ: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  async update(email: string, updateUserDto: UpdateUserDto) {
    const existeUsuario = await this.userRepository.findOne({
      where: {email: email}
    })

    if(!existeUsuario){
      throw new NotFoundException("El usuario no existe, intentalo nuevamente");
    }

    const infoOriginal = {...existeUsuario};

    for(const key of Object.keys(updateUserDto)){
      if(key in existeUsuario){
        existeUsuario[key] = updateUserDto[key];
      }
    }

    try {
      await this.userRepository.save(existeUsuario);

      const infoActualizada = Object.keys(updateUserDto).reduce(
        (acc, key) => {
          if(updateUserDto[key] !== infoOriginal[key]){
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
