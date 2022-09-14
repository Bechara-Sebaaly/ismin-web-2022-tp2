import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { BookModule } from '../src/book.module';

describe('Books API', () => {
  let app: INestApplication;
  let httpRequester: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [BookModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    httpRequester = request(app.getHttpServer());
  });

  it(`/GET books`, async () => {
    const response = await httpRequester.get('/books').expect(200);

    expect(response.body).toEqual(expect.any(Array));
  });

  it(`/POST books`, async () => {
    const response = await httpRequester
      .post('/books')
      .send({
        title: 'Candide',
        author: 'Voltaire',
        date: '1759',
      })
      .expect(201);

    expect(response.body).toEqual({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
  });

  it(`/GET books/:title`, async () => {
    // First prepare the data by adding a book
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });

    // Then get the previously stored book
    const response = await httpRequester.get('/books/Candide').expect(200);

    expect(response.body).toEqual({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
  });

  it(`/GET books by author`, async () => {
    // First prepare the data by adding some books
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
    await httpRequester.post('/books').send({
      title: 'Zadig',
      author: 'Voltaire',
      date: '1748',
    });
    await httpRequester.post('/books').send({
      title: 'La Cantatrice chauve',
      author: 'Ionesco',
      date: '1950',
    });

    // Then get the previously stored book
    const response = await httpRequester
      .get('/books')
      .query({ author: 'Voltaire' })
      .expect(200);

    expect(response.body).toEqual([
      {
        title: 'Candide',
        author: 'Voltaire',
        date: '1759',
      },
      {
        title: 'Zadig',
        author: 'Voltaire',
        date: '1748',
      },
    ]);
  });

  it(`/DELETE books/:title`, async () => {
    // First prepare the data by adding a book
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });

    // Delete the book
    await httpRequester.delete('/books/Candide').expect(200);

    // Finally check the book was successfully deleted
    const response = await httpRequester.get('/books');

    expect(response.body).toEqual([]);
  });

  it(`/GET search books by author`, async () => {
    // First prepare the data by adding some books
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
    await httpRequester.post('/books').send({
      title: 'Zadig',
      author: 'Voltadd',
      date: '1748',
    });
    await httpRequester.post('/books').send({
      title: 'La Cantatrice chauve',
      author: 'Ionesco',
      date: '1950',
    });

    // Then get the previously stored book
    const response = await httpRequester
      .get('/books/author/search/')
      .query({ author: 'Volta' })
      .expect(200);

    expect(response.body).toEqual([
      {
        title: 'Candide',
        author: 'Voltaire',
        date: '1759',
      },
      {
        title: 'Zadig',
        author: 'Voltadd',
        date: '1748',
      },
    ]);
  });

  it(`/GET search books by title`, async () => {
    // First prepare the data by adding some books
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
    await httpRequester.post('/books').send({
      title: 'Zadig',
      author: 'Voltaire',
      date: '1748',
    });
    await httpRequester.post('/books').send({
      title: 'Candittad',
      author: 'Ionesco',
      date: '1950',
    });

    // Then get the previously stored book
    const response = await httpRequester
      .get('/books/title/search/Candi')
      .expect(200);

    expect(response.body).toEqual([
      {
        title: 'Candide',
        author: 'Voltaire',
        date: '1759',
      },
      {
        title: 'Candittad',
        author: 'Ionesco',
        date: '1950',
      },
    ]);
  });

  it(`/Post validation`, async () => {
    const response = await httpRequester
      .post('/books')
      .send({
        title: '',
        author: '',
        date: '',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: [
        'title should not be empty',
        'author should not be empty',
        'date should not be empty',
        'date must be a valid ISO 8601 date string',
      ],
      error: 'Bad Request',
    });
  });
});
