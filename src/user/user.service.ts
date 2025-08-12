import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { FindAllUserDto } from './dto/find-all-user.dto';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

  create(createUserDto: CreateUserDto) {
    const user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.isAdmin = createUserDto.isAdmin;
    return this.userRepository.save(user);
  }

  async findAll(findAllUserDto: FindAllUserDto) {

    let whereData: FindOptionsWhere<User> = {}
    if(findAllUserDto.name)
      whereData.name = Like(`%${findAllUserDto.name}%`);
    if(findAllUserDto.email)
      whereData.email = Like(`%${findAllUserDto.email}%`);
    if(findAllUserDto.isAdmin)
      whereData.isAdmin = findAllUserDto.isAdmin;

    const users = await this.userRepository.find({
      select: ["name", "email", "isAdmin", "tasks"],
      where: whereData,
      relations: ["tasks"],
    });

    return users.map(user => ({...user, tasks: user.taskCount = user.tasks.length, tasksCost: user.tasks.reduce((accumulator, value) => {return accumulator + value.cost}, 0)}));
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
