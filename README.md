# GPTERMINAL
Very simplistic (but kind of aesthetic) node command line-based chatgpt terminal.
Wrote it so I could have secret terminal chats with chat gpt.
Feel free to clone/fork this, update the .env to get it running (notes below), and then mess around with it all you like.

![image](https://github.com/brangor/gpterminal/assets/3292898/b1dc4e02-1b1e-4676-a426-2d907a4714c0)

---
## How to install
- `nvmrc install 18.18.7`
- `nvm use 18.18.7`
- `npm install`
- copy/rename the .env.example to .env
  - Configure your .env file with your OpenAI API key and GPT model.
  - The default model here is GPT-3.5-turbo, but you can shift that up or down if you like.
    - 3.5 seems real cheap to me, I've only spent $.02 doing random goofery setting this up.

## How to run
- `node ./gpterminal.js`
