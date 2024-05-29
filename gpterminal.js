import('dotenv/config');
import readline from 'readline';
import chalk from 'chalk';
import OpenAI from "openai";

process.emitWarning = function () {};

const GPT_MODEL_ID = process.env.GPT_MODEL_ID || 'gpt-3.5-turbo';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let openai;

const initialize = async () => {
  await type(label('WELCOME TO GPTERMINAL', 'cyan', 'title'));
  await type(label('------------------------', 'cyan', 'title'), 10);

  await type(message('Initializing', 'green', 'bold'));
  await type(message(" . . .", 'green', 'bold'), 50);

  await import('dotenv/config');

  if (!process.env.OPENAI_API_KEY) {
    await type(label('   [✗]', 'red', 'bold'));
    await type(message("No OpenAI API key found. Please add it to your .env file.", 'red'), 20);
    process.exit();
  } else {
    await type(label('   [✓]', 'green', 'bold'));
    await type(message(`OpenAI API key found.`, 'green'), 20);
  }

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  await type(label('   [✓]', 'green', 'bold'));
  await type(message(`Good to go!`, 'green'), 20);

  await type(label('------------------------', 'cyan', 'title'), 10);
  chat();
};

let messages = [
  {
    "role": "system",
    "content": "You are a helpful assistant."
  }
];

const chat = async () => {
  const gptLabel = label('THEM:', 'green', 'prompt');

  rl.question(label("YOU:", 'cyan', 'prompt'), async (userInput) => {

    await type(gptLabel);
    // Append the user's message
    messages.push({
      role: "user",
      content: userInput
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: GPT_MODEL_ID,
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const assistantMessage = message(response.choices[0].message.content);

    await type(assistantMessage, 20);

    // Append the assistant's message for continuity
    messages.push({
      role: "assistant",
      content: assistantMessage
    });

    // Loop back for next user input
    chat();
  });
};

const label = (label, color = 'cyan', type = 'label', margin = 0) => {
  if (type === 'title') {
    return message(`\n${label}\n`, color, 'bold', margin);
  } else if (type === 'prompt' || type === 'bold') {
    return message(`${label}\t`, color, 'bold', margin);
  } else {
    return message(` ${label} `, color);
  }
}

const message = (message, color = 'white', type) => {
  if (type === 'bold') {
    return chalk[color].bold(`${message}`);
  } else {
    return chalk[color](`${addMargin(message)}`);
  }
}

const addMargin = (message) => {
  const margin = '\t'; // Create a string of spaces for the margin
  const lines = message.split('\n'); // Split the message by lines
  const indentedLines = [lines.slice(0, 1), ...lines.slice(1, lines.length + 1).map(line => margin + line)]; // Add the margin to each line
  return indentedLines.join('\n'); // Join the lines back together
};

const type = (message, baseDelay = 0) => {
  if (baseDelay === 0) {
    process.stdout.write(message);
  } else {
    let index = 0;
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const nextChar = message[index];
        process.stdout.write(nextChar);
        index++;

        // Calculate the variable delay based on whether it's a space or not.
        let delay = baseDelay;
        if (nextChar === ' ') {
          delay += 100; // A longer delay for spaces
        } else {
          delay += Math.floor(Math.random() * 30); // A little randomization
        }

        if (index >= message.length) {
          clearInterval(intervalId);
          console.log(''); // Move to the next line
          resolve();
        }
      }, baseDelay);
    });
  }
}

initialize();
