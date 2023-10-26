import('dotenv/config');

import readline from 'readline';
import chalk from 'chalk';
import OpenAI from "openai";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let openai = null;

const initialize = async () => {
  await type(label('WELCOME TO CHATGPT SHELL', 'cyan', 'title'));
  await typeSlowly(label('------------------------', 'cyan', 'title'), 10);

  await type(message('Initializing', 'green', 'bold'), 0);
  await typeSlowly(message(" . . .", 'green', 'bold'), 100);

  await import('dotenv/config');

  if (!process.env.OPENAI_API_KEY) {
    await type(label('   [✗]', 'red', 'bold'));
    await typeSlowly(message("No OpenAI API key found. Please add it to your .env file.", 'red'), 20);
    process.exit();
  } else {
    await type(label('   [✓]', 'green', 'bold'));
    await typeSlowly(message(`OpenAI API key found.`, 'green'));
  }

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  await type(label('   [✓]', 'green', 'bold'));
  await typeSlowly(message(`Good to go!`, 'green'));

  await typeSlowly(label('------------------------', 'cyan', 'title'), 10);
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
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const assistantMessage = message(response.choices[0].message.content);

    await typeSlowly(assistantMessage);

    // Append the assistant's message for continuity
    messages.push({
      role: "assistant",
      content: assistantMessage
    });

    // Loop back for next user input
    chat();
  });
};

const label = (label, color = 'cyan', type) => {
  if (type === 'title') {
    return chalk[color].bold(`\n${label}\n`);
  } else if (type === 'prompt' || type === 'bold') {
    return chalk[color].bold(`${label}\t`);
  } else {
    return chalk[color](` ${label} `);
  }
}

const message = (message, color = 'white', type) => {
  if (type === 'bold') {
    return chalk[color].bold(`${message}`);
  } else {
    return chalk[color](`${message}`);
  }
}

const typeSlowly = (message, delay = 50) => {
  let index = 0;
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      process.stdout.write(message[index]);
      index++;
      if (index >= message.length) {
        clearInterval(intervalId);
        console.log(''); // Move to the next line
        resolve();
      }
    }, delay);
  });
};

const type = (message) => {
  process.stdout.write(message);
}

initialize();
