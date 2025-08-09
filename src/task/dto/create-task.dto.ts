import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Timestamp } from "typeorm";

enum ETaskState {
    FINISHED="finished",
    ACTIVE="active"
}

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsNumber()
    estimation: number;
    @IsString()
    expiration: Date;
    @IsEnum(ETaskState)
    state: ETaskState;
    @IsNumber()
    cost: number;
    assignees: number[];
}
