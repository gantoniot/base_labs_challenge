import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class FindAllUserDto {
    @ValidateIf(o => o.name !== undefined && o.name.trim() !== '')
    @IsString()
    @IsNotEmpty()
    name: string;
    @ValidateIf(o => o.email !== undefined && o.email.trim() !== '')
    @IsString()
    @IsNotEmpty()
    email: string;
    @ValidateIf(o => o.isAdmin !== undefined)
    @IsNotEmpty()
    isAdmin: boolean;
}