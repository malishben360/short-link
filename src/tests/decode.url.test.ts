import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from '..'
import * as dotenv from 'dotenv';
import {describe, expect, test} from '@jest/globals';

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

describe('GET /decode', () => {
  let agent: any;
  beforeAll(async () => {
    /** Simulate user authentication */
    agent = request.agent(app);
    const response = await agent.post('/api/v1/auth/login').send({
      email: 'malish@gmail.com', password: '12345'
    });
    const cookie = response.header['set-cookie'][0];
    agent.set('Cookie', cookie);
  });

  test('should return the long URL for a given short URL', async () => {
    /** Generate short url base on user */
    const encodeResponse = await agent
      .post('/api/v1/encode')
      .send({ longURL: 'https://indicina.co' });
    const shortURL = encodeResponse.body.shortURL;

    const decodeResponse = await agent
      .get('/api/v1/decode')
      .send({ shortURL })
      .expect('Content-Type', /json/); // Validates that the response body is in JSON format.

    /** Validate body and status code */
    expect(decodeResponse.statusCode).toBe(200);
    expect(decodeResponse.body).toHaveProperty('longURL');
    expect(decodeResponse.body.longURL).toBe('https://indicina.co');
  });

  test('should return 404 if the provided short URL is not found', async () => {
    const response = await agent
      .get('/api/v1/decode')
      .send({ shortURL: 'http://short.est/invalid' });

    /** Validate status code */
    expect(response.statusCode).toBe(404);
  });
  
  test('should return 400 if the request payload is invalid', async () => {
    const response = await agent
      .get('/api/v1/decode')
      .send({ invalidValue: 'http://short.est/vVCaF2' });

    /** Validate status code */
    expect(response.statusCode).toBe(400);
  });
});
