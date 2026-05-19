import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Read API key manually
const env = fs.readFileSync('.env.local', 'utf-8');
const keyMatch = env.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;

console.log("API Key found:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    console.log(`\nTesting model: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say hello");
    console.log(`Success! Response: ${result.response.text()}`);
  } catch (err) {
    console.error(`Failed: ${err.message}`);
  }
}

async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-2.0-flash");
}

run();
