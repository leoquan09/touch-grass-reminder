require('dotenv/config');
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ding') {
    await interaction.reply('Dong!');
  };
  
  if (interaction.commandName === 'timer') {
    const thirtyMins = 60*30;
    const targetTime = Math.floor(Date.now() / 1000) + thirtyMins;

    await interaction.reply(`Timer started. You're gonna have to touch some grass in <t:${targetTime}:R>... You also got a point of the leaderboard.`);

    setTimeout(async () => {
        await interaction.followUp(`Time's up! You've been online for 30 minutes and its time to touch some grass now`);
    }, targetTime * 1000);
  };
});

client.login(process.env.TOKEN);
