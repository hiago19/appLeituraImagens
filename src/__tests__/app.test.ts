import request from 'supertest';
import express from 'express';
import { routes } from '../routes/index';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(routes);

function fileToGenerativePart(filePath: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
}

const imagePath = path.join(__dirname, '..', 'assets', 'medidor-gas.jpg');
const imageBase64 = fileToGenerativePart(imagePath, 'image/jpeg').inlineData.data;

describe('API Endpoints', () => {
  let measureUuid: string;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  jest.setTimeout(20000); // Define o tempo limite para 20 segundos

  test('should upload an image', async () => {
    const response = await request(app)
      .post('/upload')
      .send({
        image: imageBase64,
        customer_code: '123456',
        measure_datetime: new Date().toISOString(),
        measure_type: 'GAS',
        image_extension: 'jpg',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('image_url');
    expect(response.body).toHaveProperty('measure_value');
    expect(response.body).toHaveProperty('measure_uuid');
    measureUuid = response.body.measure_uuid;
  });

  test('should confirm a measure', async () => {
    const response = await request(app)
      .patch('/confirm')
      .send({
        measure_uuid: measureUuid,
        confirmed_value: 55,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });

  test('should list measures', async () => {
    const response = await request(app)
      .get('/12345/list');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('customer_code', '12345');
    expect(response.body).toHaveProperty('measures');
    expect(Array.isArray(response.body.measures)).toBe(true);
  });
});