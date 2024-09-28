const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/dotenv.js');

exports.generateContent = async (prompt, image = null) => {
  const genAI = new GoogleGenerativeAI(config.googleApiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  if (image) {
    const result = await model.generateContent([prompt, image]);
    return result.response.text();
  } else {
    const result = await model.generateContent([prompt]);
    return result.response.text();
  }
};