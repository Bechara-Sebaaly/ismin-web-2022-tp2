import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './dto';

@Controller('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  findAll(@Query('author') author: string): BookDto[] {
    console.log('findAll' + author);
    if (author) {
      console.log('findAll if' + author);
      return this.bookService.findByAuthor(author);
    }

    return this.bookService.findAll();
  }

  @Get('/:title')
  findByTitle(@Param('title') title: string) {
    return this.bookService.findByTitle(title);
  }

  @Post('/title/search')
  searchByTitle(@Body('term') title: string) {
    return this.bookService.searchByTitle(title);
  }

  @Post('/author/search')
  searchByAuthor(@Body('term') author: string) {
    return this.bookService.searchByAuthor(author);
  }

  @Post()
  create(@Body() ibookDto: BookDto): BookDto {
    return this.bookService.create(ibookDto);
  }

  @Delete('/:title')
  remove(@Param('title') title: string) {
    return this.bookService.remove(title);
  }
}
