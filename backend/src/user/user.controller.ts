import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, HttpException, HttpStatus, UnauthorizedException, HttpCode, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Crear usuario nuevo
  @Post('registro')
  @UseGuards(JwtGuard)
  async create(@Body() createUserDto: CreateUserDto, @Req() req): Promise<{message: string}>{
    
    // Verificacion de que sea un administrador el que quiera crear un nuevo usuario
    if(req.user.rol !== 'admin'){
      throw new UnauthorizedException('Solo los administradores pueden agregar nuevos usuarios');
    }

    try {
      await this.userService.create(createUserDto, req.usuario);
      return {message: 'Usuario registrado de manera exitosa'}
    } catch (error) {
      throw new HttpException('No se pudo crear el usuario',HttpStatus.BAD_REQUEST)
    }
  }

  // Login de usuarios
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto){
    try {
      return await this.userService.login(loginDto);
    } catch (error) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
  }

  // Encuentra todos los usuarios para listarlos
  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.userService.findAll();
  }

  // Modificar usuarios
  @Patch()
  @UseGuards(JwtGuard)
  update(@Query('email') email: string, @Body() updateUserDto: UpdateUserDto, @Req() req): Promise<{message: string}>{

    // Se verifica que el usuario que haya iniciado sesion y su token sean de un administrador para poder modificar
    if(req.user.rol !== 'admin'){
      throw new UnauthorizedException('Solo los administradores pueden modificar un usuario');
    }

    try {
      return this.userService.update(email, updateUserDto);
    } catch (error) {
      throw new HttpException("No se pudo modificar el usuario",HttpStatus.BAD_REQUEST)
    }

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
