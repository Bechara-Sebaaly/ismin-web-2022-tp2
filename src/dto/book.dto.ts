import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class BookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  constructor() {
    this.title = '';
    this.author = '';
    this.date = new Date();
  }
}
