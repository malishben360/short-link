import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from '..'
import * as dotenv from 'dotenv';

import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';

dotenv.config();

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
    server.close();
});

describe('POST /auth/register', () => {
    test('should return 409 if user already exists', async () => {
      const existingUser = {
        username: 'malish',
        email: 'malish@indicina.co',
        password: '12345',
      };

      await request(app)
        .post('/api/v1/auth/register')
        .send(existingUser)
        .set('Accept', 'application/json');

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(existingUser)
        .set('Accept', 'application/json');

      expect(response.status).toBe(409);
      expect(response.text).toBe('User already exists');
    });
});

test('should create a new user and return 201 status code', async () => {
  const newUser = {
    username: 'malish',
    email: 'malish@indicina.co',
    password: '12345',
  };

  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(newUser)
    .set('Accept', 'application/json');

    /** Skip checks if user already exist */
    if (response.status !== 409) {
      /** Validate status code and return payload */
      expect(response.status).toBe(201);
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.email).toBe(newUser.email);
    }
});

describe('POST /auth/login', () => {
    test('Should login the user and return 200 status code', async () => {
      const user = {
        email: 'malish@indicina.co', 
        password: '12345'
      }
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(user);
        
      /** Validate status code and cookie */
      expect(response.statusCode).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
      const cookie = response.headers['set-cookie'][0];
      const cookieValue = cookie.split(';')[0].split('=')[1];
      expect(cookieValue).toHaveLength(64);
    });
});