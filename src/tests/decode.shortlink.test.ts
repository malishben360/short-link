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
      email: 'malish@indicina.co', password: '12345'
    });
    const cookie = response.header['set-cookie'][0];
    agent.set('Cookie', cookie);
  });

  test('should return the original URL for a given short link', async () => {
    /** Generate short link base on user */
    const encodeResponse = await agent
      .post('/api/v1/encode')
      .send({ originalURL: 'https://indicina.co' });
    const shortLink = encodeResponse.body.shortLink;

    const decodeResponse = await agent
      .get('/api/v1/decode')
      .send({ shortLink })
      .expect('Content-Type', /json/); // Validates that the response body is in JSON format.

    /** Validate body and status code */
    expect(decodeResponse.statusCode).toBe(200);
    expect(decodeResponse.body).toHaveProperty('originalURL');
    expect(decodeResponse.body.originalURL).toBe('https://indicina.co');
  });

  test('should return 404 if the provided short URL is not found', async () => {
    const response = await agent
      .get('/api/v1/decode')
      .send({ shortLink: 'http://short.est/invalid' });

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
