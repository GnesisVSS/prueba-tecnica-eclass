import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Crear usuario nuevo
  @Post('registro')
  async create(@Body() createUserDto: CreateUserDto, @Req() req): Promise<{message: string}>{
    try {
      await this.userService.create(createUserDto, req.usuario);
      return {message: 'Usuario registrado de manera exitosa'}
    } catch (error) {
      throw new HttpException('No se pudo crear el usuario',HttpStatus.BAD_REQUEST)
    }
  }

  // Encuentra todos los usuarios para listarlos
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Modificar usuarios
  @Patch()
  update(@Query('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(email, updateUserDto);
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
