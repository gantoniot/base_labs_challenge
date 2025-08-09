import { Task } from "src/task/entities/task.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 40 })
    email: string;

    @Column({ type: 'bool' })
    isAdmin: boolean;

    @ManyToMany(() => Task, (task) => task.assignees)
    tasks: Task[];
}
