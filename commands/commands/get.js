const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetch_data } = require('../../lib.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get')
        .setDescription('Gets a random fighter plane!'),
    async execute(interaction) {
        await interaction.deferReply()
        const data = await fetch_data()
        console.log(data)
        reply = await interaction.editReply(`${data.element.model} (${data.element.year} ${data.element.country} ${data.element.status == '' ? "Production" : data.element.status} Model)`)

        send_image = null

        for (image of data.image) {
            for (word of image.split(/_|\//)) {
                for (word2 of data.element.model) {
                    if (word == word2) {
                        send_image = image;
                        break;
                    }
                }
            }
            if (send_image) break
        }

        if (!send_image) send_image = "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?cs=srgb&dl=pexels-pixabay-356079.jpg&fm=jpg"

        const embed = new EmbedBuilder().setImage(send_image)
        reply.reply({embeds: [embed]})
    }
}