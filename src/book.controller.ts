import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { IBook } from './dto';

@Controller('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  findAll(@Query('author') author: string): IBook[] {
    console.log('findAll' + author);
    if(author){
      console.log('findAll if' + author);
      return this.bookService.findByAuthor(author);
    }

    return this.bookService.findAll();
  }

  @Get('/:title')
  findByTitle(@Param('title') title: string) {
    return this.bookService.findByTitle(title);
  }

  @Post()
  create(@Body() ibookDto: IBook): IBook{
    return this.bookService.create(ibookDto);
  }

  @Delete('/:title')
  remove(@Param('title') title: string){
    return this.bookService.remove(title);
  }
}
