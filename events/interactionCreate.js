const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`Je trouve aucune commande avec le nom ${interaction.commandName} .`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Soucis d'éxécutions avec la commande ${interaction.commandName}`);
			console.error(error);
		}
	},
};