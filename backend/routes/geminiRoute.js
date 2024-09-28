const express = require('express');
const upload = require('../middleware/multerConfig.js');
const { generateContent } = require('../services/googleGenerativeAIService.js');

const router = express.Router();

router.post('/gemini', upload.single('file'), async (req, res) => {
  try {
    let description;

    if (req.file) {
      const fileBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;

      const image = {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: mimeType,
        },
      };

      const prompt = req.body.prompt || 'Describe this image';
      description = await generateContent(prompt, image);
    } else if (req.body.prompt) {
      const prompt = req.body.prompt;
      description = await generateContent(prompt);
    } else {
      res.status(400).json({ error: 'bro give a prompt or image' });
      return;
    }

    res.json({ description });
  } catch (error) {
    console.error('request error:', error);
    res.status(500).json({ error: 'request error' });
  }
});

module.exports = router;
