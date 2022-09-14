import { Injectable } from '@nestjs/common';
import { Bookshelf, BookDto } from './dto';

@Injectable()
export class BookService {
  bookshelf: Bookshelf;

  constructor() {
    this.bookshelf = new Bookshelf();
  }

  findAll() {
    return this.sortBookshelf(this.bookshelf.books);
  }

  findByAuthor(author: string): BookDto[] {
    let b = this.bookshelf.books.filter((element) => element.author === author);
    this.sortBookshelf(b);
    return b;

    //return this.sortBookshelf(this.bookshelf.books.filter((element) => element.author === author));
  }

  findByTitle(title: string): BookDto {
    const book = this.bookshelf.books.find(
      (element) => element.title === title,
    );
    if (!book) throw new Error('Book not found!');
    return book;
  }

  searchByTitle(title: string) {
    const book = this.bookshelf.books.filter((element) =>
      element.title.includes(title),
    );
    if (!book) throw new Error('Book not found!');
    if (book.length === 1) return book[0];
    else return book;
  }

  searchByAuthor(author: string) {
    let b = this.bookshelf.books.filter((element) =>
      element.author.includes(author),
    );
    this.sortBookshelf(b);
    return b;
  }

  create(ibookDto: BookDto): BookDto {
    if (!this.bookshelf.books.find((element) => element === ibookDto)) {
      this.bookshelf.books.push(ibookDto);
      return ibookDto;
    }

    throw new Error('Book Already Exists!');
  }

  remove(title: string) {
    let i: number = -1;
    this.bookshelf.books.forEach((element, index) => {
      if (element.title === title) i = index;
    });

    if (i !== -1) this.bookshelf.books.splice(i, 1);
  }

  sortBookshelf(books: BookDto[]): BookDto[] {
    return this.bookshelf.books.sort((fo: BookDto, so: BookDto) =>
      fo.title.localeCompare(so.title),
    );
  }
}
