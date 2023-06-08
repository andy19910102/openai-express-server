const express = require('express');
const router = express.Router();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/* POST API */
router.post('/bot', async function (req, res, next) {
    const { userMessage } = req.body;
    console.log('[req.body]', req.body);

    if (userMessage.length >= 256) {
        res.status(400).json({
            message: "Message too long"
        });
        return;
    }

    const messages = [
        // {"role": "system", "content": "You are a helpful assistant."},
        { "role": "user", "content": userMessage },
    ];

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 256,
    });

    const aiMessage = completion.data.choices[0].message.content;

    res.status(200).json({
        aiMessage: aiMessage
    });
});

module.exports = router;
