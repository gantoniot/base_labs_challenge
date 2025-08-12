import { IsEnum, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class FindAllTaskDto {
    @ValidateIf(o => o.title !== undefined && o.title.trim() !== '')
    @IsString()
    @IsNotEmpty()
    title: string;
    @ValidateIf(o => o.lesserThanExpiry !== undefined && o.lesserThanExpiry.trim() !== '')
    @IsString()
    @IsNotEmpty()
    lesserThanExpiry: Date;
    @ValidateIf(o => o.greaterThanExpiry !== undefined && o.greaterThanExpiry.trim() !== '')
    @IsString()
    @IsNotEmpty()
    greaterThanExpiry: Date;
    @ValidateIf(o => o.assignees !== undefined)
    @IsNotEmpty()
    assignees: User[];
    @ValidateIf(o => o.order !== undefined && o.order.trim() !== '')
    @IsEnum(["asc", "desc"])
    order: "asc" | "desc";
}