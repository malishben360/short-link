import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from '..'
import * as dotenv from 'dotenv';
import { describe, expect, test } from '@jest/globals';

dotenv.config();

/** Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URL);
});

/** Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
    server.close();
});

describe('GET /encode', () => {
  let agent: any;
  beforeAll(async () => {
    /** Simulate user authentication */
    agent = request.agent(app);
    const response = await agent.post('/api/v1/auth/login').send({
      email: 'malish@indicina.co', password: '12345'
    });
    const cookie = response.header['set-cookie'][0];
    agent.set('Cookie', cookie);
  });

  test('should return a short link when given a valid original URL', async () => {
    const response = await agent
      .post('/api/v1/encode')
      .send({ originalURL: 'https://indicina.co' })
      .expect('Content-Type', /json/); // Validates that the response body is in JSON format.

    /** If short link exist expecting 200 status code else 201 status code */
    if (response.statusCode === 200) {
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('shortLink');
      expect(response.body.shortLink).toMatch(/^http:\/\/short\.est\/.*/);
    } else if (response.statusCode === 201) {
      expect(response.statusCode).toBe(201)
      expect(response.body).toHaveProperty('shortLink');
      expect(response.body.shortLink).toMatch(/^http:\/\/short\.est\/.*/);
    }
  });

  test('should return 400 if original URL is not provided', async () => {
    const response = await agent
      .post('/api/v1/encode')
      .send({});

    /** Validate the status code */
    expect(response.statusCode).toBe(400);
  });

  test('should return 400 if original URL is not a valid URL', async () => {
    const response = await agent
      .post('/api/v1/encode')
      .send({ originalURL: 'invalid-url' });

    /** Validate the status code */
    expect(response.statusCode).toBe(400);
  });
});
