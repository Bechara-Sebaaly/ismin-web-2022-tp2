import { Injectable } from '@nestjs/common';
import { Bookshelf, IBook } from './dto';

@Injectable()
export class BookService {
  bookshelf: Bookshelf;

  constructor() {
    this.bookshelf = new Bookshelf();
  }

  findAll() {
    return this.sortBookshelf(this.bookshelf.books);
  }

  findByAuthor(author: string): IBook[] {
    let b = this.bookshelf.books.filter((element) => element.author === author);
    this.sortBookshelf(b);
    return b;
  }

  findByTitle(title: string): IBook {
    const book = this.bookshelf.books.find(
      (element) => element.title === title,
    );
    if (!book) throw new Error('Book not found!');
    return book;
  }

  create(ibookDto: IBook): IBook {
    if (!this.bookshelf.books.find((element) => element === ibookDto)) {
      this.bookshelf.books.push(ibookDto);
      return ibookDto;
    }

    throw new Error('Book Already Exists!')
  }

  remove(title: string) {
    let i: number = -1;
    this.bookshelf.books.forEach((element, index) => {
      if (element.title === title) i = index;
    });

    if (i !== -1) this.bookshelf.books.splice(i, 1);
  }

  sortBookshelf(books: IBook[]): IBook[] {
    return this.bookshelf.books.sort((fo: IBook, so: IBook) =>
      fo.title.localeCompare(so.title),
    );
  }
}
