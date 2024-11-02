const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

// POST endpoint for generating questions
app.post('/generate-question', async (req, res) => {
  const { category } = req.body;
  let prompt = '';

  switch (category) {
    case 'fun':
      prompt = "Create a fun and lighthearted question for team-building.";
      break;
    case 'motivational':
      prompt = "Generate an inspiring question for team motivation.";
      break;
    case 'deep':
      prompt = "Provide a thought-provoking question for deep conversation.";
      break;
    default:
      prompt = "Create an engaging question for a team chat.";
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`
        }
      }
    );

    res.json({ question: response.data[0].generated_text.trim() });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ message: 'Failed to generate question. Please try again.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
