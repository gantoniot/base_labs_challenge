import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'int' })
    estimation: number;

    @Column({ type: 'date' })
    expiration: Date;

    @Column({ type: 'enum', enum: ['active', 'finished'] })
    state: string;

    @Column({ type: 'float' })
    cost: number;

    @ManyToMany(() => User, (user) => user.id)
    @JoinTable() // This side owns the relationship and manages the join table
    assignees: User[];
}
