const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js')
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

// Handler commands

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] Le fichier ${filePath} n'as pas l'élements "data" ou "execute" propriété.`);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Lorsque le client est prêt, exécutez ce code (une seule fois)
// Nous utilisons "c" pour le paramètre "event" afin de le séparer du paramètre "client" déjà défini.
client.once(Events.ClientReady, c => {
	console.log(`Je suis prêt! ${c.user.tag} viens de se connecter`);
});

client.login(token)
