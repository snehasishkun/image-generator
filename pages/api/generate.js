import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const { key, prompt } = req.query;

  if (!key) return res.json({ message: 'API Key is required.' });
  if (!prompt) return res.json({ message: 'Prompt is required.' });

  const configuration = new Configuration({
    apiKey: decodeURIComponent(key),
  });
  const openai = new OpenAIApi(configuration);

  try {

    const response = await openai.createImage({
      prompt: `${decodeURIComponent(prompt)}`,
      n: 1,
      size: "1024x1024",
      response_format: "url"
    });
    console.log(response)

    if (!response) return res.json({ message: 'No response found. Try again later.' });

    return res.json({ url: `${response?.data?.data[0]?.url || "<No URL>"}` });

  } catch (err) {
    console.log(err);
    return res.json({ url: `${err.message||"Invalid API Key."}` });
  }
}


