import { IsBoolean, IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateUserDto {
    @ValidateIf(o => o.name.trim() !== '')
    @IsString()
    @IsNotEmpty()
    name: string;
    @ValidateIf(o => o.email.trim() !== '')
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsBoolean()
    isAdmin: boolean;
}
