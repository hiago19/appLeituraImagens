import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getGemini } from '../services/service';
import { getMimeType } from '../utils/mimeTypes';
import Joi from 'joi';

const prisma = new PrismaClient();

export const uploadController = {
  async uploadImage(req: Request, res: Response) {
    const schema = Joi.object({
      image: Joi.string().base64().required(),
      customer_code: Joi.string().required(),
      measure_datetime: Joi.date().iso().required(),
      measure_type: Joi.string().valid('WATER', 'GAS').required(),
      image_extension: Joi.string().valid('jpeg', 'jpg', 'png', 'webp', 'heic', 'heif').optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: error.details[0].message,
      });
    }

    try {
      const { image, customer_code, measure_datetime, measure_type, image_extension } = req.body;
      const mimeType = getMimeType(image_extension);
      const result = await getGemini(image, mimeType);

      // Verificar se já existe uma leitura para o mesmo tipo e mês
      const startOfMonth = new Date(measure_datetime);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);

      const existingMeasure = await prisma.measure.findFirst({
        where: {
          customer_code,
          measure_type,
          measure_datetime: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      });

      if (existingMeasure) {
        return res.status(409).json({
          error_code: 'DOUBLE_REPORT',
          error_description: 'Leitura do mês já realizada',
        });
      }

      // Salvar a nova medição no banco de dados
      const measure = await prisma.measure.create({
        data: {
          customer_code,
          measure_datetime: new Date(measure_datetime),
          measure_type,
          image_extension,
          image_url: '', // Generate or store the image URL as needed
          measure_value: parseFloat(result.text.split('Value: ')[1]),
          has_confirmed: false,
        },
      });

      res.json({
        image_url: measure.image_url,
        measure_value: measure.measure_value,
        measure_uuid: measure.uuid,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro interno do servidor' });
    }
  },

  async confirmMeasure(req: Request, res: Response) {
    const schema = Joi.object({
      measure_uuid: Joi.string().required(),
      confirmed_value: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: error.details[0].message,
      });
    }

    try {
      const { measure_uuid, confirmed_value } = req.body;

      // Verificar se o código de leitura informado existe
      const measure = await prisma.measure.findUnique({ where: { uuid: measure_uuid } });
      if (!measure) {
        return res.status(404).json({
          error_code: 'MEASURE_NOT_FOUND',
          error_description: 'Leitura não encontrada',
        });
      }

      // Verificar se a leitura já foi confirmada
      if (measure.has_confirmed) {
        return res.status(409).json({
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Leitura já confirmada',
        });
      }

      // Atualizar o valor confirmado no banco de dados
      await prisma.measure.update({
        where: { uuid: measure_uuid },
        data: {
          measure_value: confirmed_value,
          has_confirmed: true,
        },
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro interno do servidor' });
    }
  },

  async listMeasures(req: Request, res: Response) {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    // Validar o parâmetro measure_type
    if (measure_type && !['WATER', 'GAS'].includes((measure_type as string).toUpperCase())) {
      return res.status(400).json({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }

    try {
      const whereClause: any = { customer_code };

      if (measure_type) {
        whereClause.measure_type = (measure_type as string).toUpperCase();
      }

      const measures = await prisma.measure.findMany({
        where: whereClause,
      });

      if (measures.length === 0) {
        return res.status(404).json({
          error_code: 'MEASURES_NOT_FOUND',
          error_description: 'Nenhuma leitura encontrada',
        });
      }

      res.json({
        customer_code,
        measures,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro interno do servidor' });
    }
  },
};