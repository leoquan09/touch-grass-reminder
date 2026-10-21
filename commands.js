require('dotenv/config')
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'ding',
        description: 'replies with dong!'
    }, 
    {
        name: 'timer',
        description: "Starts a 30 minutes timer and will send a text when your time is up."
    },
    {
        name: 'leaderboard',
        description: 'Displays the official leigh coding club TOUCH GRASS leaderboard'
    }
];

const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);

async function run() {
    try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
    console.error(error);
    }
}
run()
