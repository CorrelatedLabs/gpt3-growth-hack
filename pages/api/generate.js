import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = `Shorten the following blog post into three cohesive paragraphs:`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.7,
    max_tokens: 250,
  });
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Turn the summary into three tweets that are exciting and friendly, but explain the concept clearly. Each tweet should contain new information. 

  Summary: ${basePromptOutput.text}

  Tweets:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.6,
		// I also increase max_tokens.
    max_tokens: 500,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });

  // res.status(200).json({ output: basePromptOutput });

};

export default generateAction;