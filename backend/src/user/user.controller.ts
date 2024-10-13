import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, HttpException, HttpStatus, UnauthorizedException, HttpCode, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Rol } from './enum/roles.enum';
import { searchDto } from './dto/search.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Crear usuario nuevo
  @Post('registro')
  @UseGuards(JwtGuard)
  async create(@Body() createUserDto: CreateUserDto, @Req() req): Promise<{ message: string }> {

    // Verificacion de que sea un administrador el que quiera crear un nuevo usuario
    if (req.user.rol !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden agregar nuevos usuarios');
    }

    try {
      await this.userService.create(createUserDto, req.usuario);
      return { message: 'Usuario registrado de manera exitosa' }
    } catch (error) {
      throw new HttpException('No se pudo crear el usuario', HttpStatus.BAD_REQUEST)
    }
  }

  // Login de usuarios
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
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
  update(@Query('email') email: string, @Body() updateUserDto: UpdateUserDto, @Req() req): Promise<{ message: string }> {

    // Se verifica que el usuario que haya iniciado sesion y su token sean de un administrador para poder modificar
    if (req.user.rol !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden modificar un usuario');
    }

    try {
      return this.userService.update(email, updateUserDto);
    } catch (error) {
      throw new HttpException("No se pudo modificar el usuario", HttpStatus.BAD_REQUEST)
    }
  }

  // Eliminar un usuario
  @Delete()
  @UseGuards(JwtGuard)
  async remove(@Query('email') email: string, @Req() req): Promise<{ message: string }> {

    if (req.user.rol !== 'admin') {
      throw new UnauthorizedException('Solo los administradores pueden eliminar un usuario');
    }

    try {
      await this.userService.delete(email)
      return { message: 'Usuario eliminado correctamente' }
    } catch (error) {
      throw new HttpException("No se pudo eliminar el usuario" + error.message, HttpStatus.BAD_REQUEST)
    }

  }

  // Información de usuario
  @Get('/user-info')
  @UseGuards(JwtGuard)
  async findOne(@Query('email') email: string) {
    try {
      return await this.userService.findOne(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('No se puede ver el perfil del usuario', HttpStatus.BAD_REQUEST);
    }
  }

  // Profile
  @Get('/profile')
  @UseGuards(JwtGuard)
  async profile(@Req() req) {
    try {
      return await this.userService.findOne(req.user.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('No se puede ver el perfil del usuario', HttpStatus.BAD_REQUEST);
    }
  }

  // Filtro dinámico por nombre y/o apellido, rol, estado o correo
  @Get('search')
  @UseGuards(JwtGuard)
  async searchUser(@Query() query: searchDto) {
    const usuario = await this.userService.searchUser(query);
    return { message: `Se encontraron ${usuario.length} usuarios`, data: { usuario } }
  }

  @Post('updatePassword')
  @UseGuards(JwtGuard)
  async updatePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
      const email = req.user.email;
      return await this.userService.updatePassword(email, changePasswordDto.contrasenaActual, changePasswordDto.contrasenaNueva, changePasswordDto.contrasenaConfirmacion)
  }
}
