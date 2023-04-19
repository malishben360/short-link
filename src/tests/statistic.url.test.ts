import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from '..'
import * as dotenv from 'dotenv';
import {describe, expect, test} from '@jest/globals';

import { extractEncodedComponent } from '../helpers/url.helper';

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

describe('GET /statistic/:url_path', () => {
  const longURL = 'https://indicina.com';
  let shortURL: string;
  let agent: any;

  beforeAll(async () => {
    /** Simulate user authentication */
    agent = request.agent(app);
    let response = await agent.post('/api/v1/auth/login').send({
      email: 'malish@indicina.co', password: '12345'
    });
    const cookie = response.header['set-cookie'][0];
    agent.set('Cookie', cookie);

    /** create a short URL base on mocked user*/
    response = await agent
      .post('/api/v1/encode')
      .send({ longURL });
    shortURL = response.body.shortURL;
  });

  test('should return statistics for a valid short URL', async () => {
    /** send a request to get statistics for the short URL */
    const response = await agent
      .get(`/api/v1/statistic/${extractEncodedComponent(shortURL)}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/); // Validates that the response body is in JSON format.

    /** validate the response body and status code*/
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      longURL,
      countries: {},
      referrers: {},
      visites: 0,
      lastVisitedAt: '0000-00-00T00:00:00.000+00:00'
    }));
  });

  test('should return 404 for an invalid short URL', async () => {
    /** send a request to get statistics for a non-existent short URL */
    const response = await request(app)
      .get(`/api/v1/statistic/${extractEncodedComponent('http://short.est/invalid')}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/); // Validates that the response body is in JSON format.

    /** validate the status code */
    expect(response.statusCode).toBe(404);
  });
});
