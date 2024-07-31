// app.js
const express = require('express');
const uuidv4 = require('uuid');
const { OpenAI, FunctionTool, OpenAIAgent, Settings, OpenAISession } = require("llamaindex");
const { INITIALIZED_PROMPT } = require('./prompts/initialize_prompts');
const { default: mongoose } = require('mongoose');
const ChatSession = require('./models/ChatSession');
const ChatMessage = require('./models/chatMessage');
const app = express();
const port = 3000;

require('dotenv').config()
const apiResponse = (status, message, code, data) => {
  return {
    status, message, code, data
  }
}


Settings.llm = new OpenAI({
  apiKey: process.env.openai,
  model: "gpt-4o",
});
Settings.callbackManager.on("llm-tool-call", (event) => {
  console.log(event.detail);
});
Settings.callbackManager.on("llm-tool-result", (event) => {
  console.log(event.detail);
});

const sumNumbers = ({ a, b }) => {
  return `${a + b}`;
};

const tool = FunctionTool.from(sumNumbers, {
  name: "sumNumbers",
  description: "Use this function to sum two numbers",
  parameters: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number to sum",
      },
      b: {
        type: "number",
        description: "Second number to sum",
      },
    },
    required: ["a", "b"],
  },
});

const getNameAndEmail = ({ name, email }) => {
  // save this name and email
  return { name, email }
}
const getGrowthGoal = ({ growthGoal }) => {
  // save this growth Goal
  return { growthGoal }
}





const getNameAndEmailTool = FunctionTool.from(getNameAndEmail, {
  name: "getNameAndEmail",
  description: "Use this function to save name and email",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the user",
      },
      email: {
        type: "string",
        description: "Email of the user",
      },
    },
    required: ["name", "email"],
  },
})


const getGrowthGoalTool = FunctionTool.from(
  getGrowthGoal, {
  name: "getGrowthGoal",
  description: "use this tool to log the answer of the user for the when you ask them **Where do they want to grow in life?**. To be used only when the user has given you the answer. Never invent an answer and add when calling this tool.",
  parameters: {
    type: "object",
    properties: {

      growthGoal: {
        type: 'string',
        description: "Growth goal of the user"
      },
    },
    required: ["growthGoal"],
  }

}
)

const getThingsToAcheive = ({ thingsToAcheive }) => {

  return { thingsToAcheive }

}
const getThingsStoppingThem = ({ thingsStoppingThem }) => {

  return { thingsStoppingThem }

}

const getUersWhyForGrowth = ({ usersWhyForGrowth }) => {

  return { usersWhyForGrowth }

}

const getThingsToAcheiveTool = FunctionTool.from(
  getThingsToAcheive, {
  name: "getThingsToAcheive",
  description: "use this tool to log the answer of the user for the when you ask them **the things they do daily to achieve goal/intention/desire**. The user might or might not have three things, whatever they are doing to achieve their goal, I will log. To be used only when the user has given you the answer. Never invent an answer and add when calling this tool. no need to add quotation marks or commas, I will write it as a summary",
  parameters: {
    type: "object",
    properties: {
      thingsToAcheive: {
        type: 'string',
        description: "Things user wants to acheive"
      },
    },
    required: ["thingsToAcheive"],
  }

}
)


const getThingsStoppingThemtool = FunctionTool.from(
  getThingsStoppingThem, {
  name: "getThingsStoppingThem",
  description: "use this tool to log the answer of the user for the when you ask them **what are the three things that they are doing or not doing that are getting in the way**. The user might or might not have three things, whatever they are doing that is getting in the way to achieve their goal, I will log. To be used only when the user has given you the answer. Never invent an answer and add when calling this tool. no need to add quotation marks or commas, I will write it as a summary",
  parameters: {
    type: "object",
    properties: {
      thingsStoppingThem: {
        type: 'string',
        description: "Things stopping users to acheive his/her goals"
      },
    },
    required: ["thingsStoppingThem"],
  }

}
)


const getUsersWhyForGrowthTool = FunctionTool.from(
  getUersWhyForGrowth, {
  name: "getUersWhyForGrowth",
  description: "use this tool to log the answer of the user for the when you ask them **Their 'Why' for achieving that goal**. To be used only when the user has given you the answer. Never invent an answer and add when calling this tool.",
  parameters: {
    type: "object",
    properties: {
      usersWhyForGrowth: {
        type: 'string',
        description: "Users why being acheiving their goal"
      },
    },
    required: ["usersWhyForGrowth"],
  }

}
)








mongoose.connect(url)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected successfully to MongoDB');
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/session', async (req, res) => {
  const uuid_ = uuidv4.v4();



  // add this session in the mongo collection
  res.send(apiResponse(true, 'Successfully Initiated the session', 201, { session_id: uuid_ }));
});



app.post('/chat', async (req, res) => {
  // add all tools here (tools are the function to perform on specific keypoints)
  const tools = [ getNameAndEmailTool, getGrowthGoalTool, getThingsToAcheiveTool, getThingsStoppingThemtool, getUsersWhyForGrowthTool];
  const { message, session_id } = req?.body || {};

  const session = await ChatSession.findById('66a90bb1a7dc9c70de6857d3')
  // const messages = await ChatMessage.find({})

  //  { role: "user", text: "i want to become a cricketer", }, { role: "assistant", text: "What's you why behind it?" }, { role: "user", text: "i like the game" }, { role: 'assistant', text: "what are the things stopping you?" }
  const messages = [{ role: "assistant", text: "What habits you like to start?" },
// {role:"user",text:""},
// {role:"assistant",text:""}
{role:"user",text:"I would like to play cricket"},
{role:"assistant",text:"That's awesome! Cricket is a fantastic sport that can be both fun and a great way to stay active. \n\nWhat motivates you to start playing cricket?"},
{role:"user",text:"I Like the game"},
{role:"assistant",text:"That's great to hear! Cricket is indeed a thrilling game and can be a wonderful way to stay active and engaged.\n\n### Why Cricket?\n- **Physical Fitness**: It helps in improving your stamina, agility, and overall physical health.\n- **Team Spirit**: Playing cricket can teach you the importance of teamwork and cooperation.\n- **Mental Well-being**: It can be a great stress reliever and a way to enjoy some time outdoors.\n\nCould you share with me why playing cricket is important to you?"},
{role:"user",text:"i just like the game"},
{role:"assistant",text:"That's a wonderful reason! Enjoying the game itself is a fantastic motivator. \n\n### Benefits of Playing Cricket\n- **Physical Fitness**: It keeps you active and improves your stamina.\n- **Mental Refreshment**: Playing a game you love can be a great stress reliever.\n- **Social Interaction**: It's a great way to meet new people and build friendships.\n\nCould you share with me what you're currently doing to start playing cricket regularly?"}

]

  // this is for formatting messages
  const previousMessages = messages.map(item => {
    return {
      role: item.role,
      content: item.text
    }
  })

  // initializing the agent
  const agent = new OpenAIAgent({ llm: new OpenAI({ model: 'gpt-4o', temperature: 0.7, }), systemPrompt: INITIALIZED_PROMPT, tools, })
  const response = await agent.chat({ message: message, chatHistory: previousMessages })
  console.log({ response });
  res.send({ message: response.message.content });
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

