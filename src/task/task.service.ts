import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { And, ArrayContains, Between, FindOptionsWhere, In, LessThan, LessThanOrEqual, Like, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FindAllTaskDto } from './dto/find-all-task.dto';

@Injectable()
export class TaskService {

  constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>){}

  create(createTaskDto: CreateTaskDto) {
    const task: Task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.estimation = createTaskDto.estimation;
    task.expiration = createTaskDto.expiration;
    task.state = createTaskDto.state;
    task.cost = createTaskDto.cost;
    task.assignees = createTaskDto.assignees.map(id => ({...new User(), id}));
    return this.taskRepository.save(task);
  }

  async findAll(findAllTaskDto: FindAllTaskDto) {

    let whereData: FindOptionsWhere<Task> = {}
    if(findAllTaskDto.title)
      whereData.title = Like(`%${findAllTaskDto.title}%`);

    if(findAllTaskDto.lesserThanExpiry && findAllTaskDto.greaterThanExpiry)
      whereData.expiration = Between(findAllTaskDto.greaterThanExpiry, findAllTaskDto.lesserThanExpiry);
    else if(findAllTaskDto.lesserThanExpiry)
      whereData.expiration = LessThanOrEqual(findAllTaskDto.lesserThanExpiry);
    else if(findAllTaskDto.greaterThanExpiry)
      whereData.expiration = MoreThanOrEqual(findAllTaskDto.greaterThanExpiry);

    let groupedValues: {ids: number[] , names: string[], emails: string[]} = {
      ids: [], 
      names: [],
      emails: []
    }
    if(findAllTaskDto.assignees){
      findAllTaskDto.assignees.forEach(user => {
        if(user.id)
          groupedValues.ids.push(user.id);
        if(user.name)
          groupedValues.names.push(user.name);
        if(user.email)
          groupedValues.emails.push(user.email);
      });
    }

    const tasks = await this.taskRepository.createQueryBuilder("task")
    .where(whereData)
    .leftJoinAndSelect("task.assignees", "assignees")
    .where("assignees.id IN (:...ids)", {ids: groupedValues.ids})
    .orWhere("assignees.name IN (:...names)", {names: groupedValues.names})
    .orWhere("assignees.email IN (:...emails)", {emails: groupedValues.emails})
    .select([
      "task.title", 
      "task.description", 
      "task.cost", 
      "task.estimation", 
      "task.expiration", 
      "task.state", 
      "assignees.name", 
      "assignees.email"
    ])
    .getMany()

    return tasks;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {

    if(Object.keys(updateTaskDto).length == 0)
      return null;

    const taskToUpdate = await this.taskRepository.findOneBy({ id });;

    if(taskToUpdate){
      if(updateTaskDto.assignees)
        taskToUpdate.assignees = updateTaskDto.assignees?.map(id => ({...new User(), id}));
      if(updateTaskDto.cost)
        taskToUpdate.cost = updateTaskDto.cost;
      if(updateTaskDto.description)
        taskToUpdate.description = updateTaskDto.description;
      if(updateTaskDto.estimation)
        taskToUpdate.estimation = updateTaskDto.estimation;
      if(updateTaskDto.expiration)
        taskToUpdate.expiration = updateTaskDto.expiration;
      if(updateTaskDto.state)
        taskToUpdate.state = updateTaskDto.state;
      if(updateTaskDto.title)
        taskToUpdate.title = updateTaskDto.title;
      
      await this.taskRepository.save(taskToUpdate);
    }

    return taskToUpdate;
  }

  async remove(id: number) {
    await this.taskRepository.softRemove( {id} );

    return `The task has been deleted successfully`;
  }
}
