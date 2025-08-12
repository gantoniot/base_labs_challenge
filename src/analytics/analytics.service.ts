import { Injectable } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

  create(createAnalyticsDto: CreateAnalyticsDto) {
    return 'This action adds a new analytics';
  }

  async findAll() {
    const data = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.tasks", "task")
      .select("user.name", "name")
      .addSelect("COUNT(task.id)", "taskCount")
      .groupBy("user.name")
      .getRawMany()
  
      return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} analytics`;
  }

  update(id: number, updateAnalyticsDto: UpdateAnalyticsDto) {
    return `This action updates a #${id} analytics`;
  }

  remove(id: number) {
    return `This action removes a #${id} analytics`;
  }
}
