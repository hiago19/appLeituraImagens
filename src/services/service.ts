import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Verificar se a GEMINI_API_KEY está definida
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

function fileToGenerativePart(imageBase64: string, mimeType: string) {
  return {
    inlineData: {
      data: imageBase64,
      mimeType
    },
  };
}

// Função para extrair texto de uma imagem usando o modelo Gemini Pro Vision
export async function getGemini(imageBase64: string, mimeType: string) {
  const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"});
  const prompt = "Describe the water or gas meter measurement through the photo in just one line. Ex. Type: Water, Value: 1234.56 or if you can't identify what's in the image, say: Type: Null, Value: -1";
  const imageParts = [fileToGenerativePart(imageBase64, mimeType)];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response.text();

  if (!response) {
    throw new Error('No text detected or Gemini failed to generate a response');
  }

  console.log(response.trim());
  return {text: response.trim()};
}