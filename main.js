require('dotenv/config');
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const leaderboardPath = path.join(__dirname, 'scoreboard.json');

let timerCanStart = true;

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ding') {
    await interaction.reply('Dong!');
  };
  
  if (interaction.commandName === 'timer') {
    const userID = interaction.user.id;
    const username = interaction.user.username;

    let leaderboard = {};
    try {
      const fileContent = await fs.readFile(leaderboardPath, 'utf-8');
      leaderboard = JSON.parse(fileContent);
    } catch (error) {
      console.log("Error occured: ", error);
    };

    if (!leaderboard[userID]) {
      leaderboard[userID] = {
        username: username,
        score: 0
      };
    };

    if (timerCanStart === false) {
      await interaction.reply('You already have a timer running... Wait until your other timer finished :p');
      return;
    };

    leaderboard[userID].score += 1;
    const currentScore = leaderboard[userID].score;
    await fs.writeFile(leaderboardPath, JSON.stringify(leaderboard, null, 2), 'utf-8');

    const thirtyMins = 60 * 30;
    const thirtsMinsMs = thirtyMins * 1000;
    const targetTime = Math.floor(Date.now() / 1000) + thirtyMins;

    await interaction.reply(`Timer started. You're gonna have to touch some grass <t:${targetTime}:R>... You also now have **${currentScore} points** on the leaderboard.`);
    timerCanStart = false;

    setTimeout(async () => {
        await interaction.followUp(`Time's up! You've been online for 30 minutes and its time to touch some grass now`);
        timerCanStart = true;
    }, thirtsMinsMs);
  };

  if (interaction.commandName === 'leaderboard') {
    let leaderboard = {};
    const fileContent = await fs.readFile(leaderboardPath, 'utf-8');
    
    if (fileContent.trim() !== '') {
      leaderboard = JSON.parse(fileContent);
    }

    let users = Object.values(leaderboard);

    if (users.length === 0) {
      return await interaction.reply({ content: "The leaderboard is currently empty! Use `/timer` to get started." });
    }

    users.sort((a, b) => b.score - a.score);

    let leaderboardText = "**🏆 Touch Grass Leaderboard 🏆**\n\n";
    users.slice(0, 10).forEach((user, index) => {
      leaderboardText += `${index + 1}. **${user.username}** — ${user.score} point(s)\n`;
    });

    await interaction.reply({ content: leaderboardText });
  };
});

client.login(process.env.TOKEN);
