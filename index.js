import dotenv from 'dotenv'
import fetch from 'node-fetch'
import Discord from 'discord.js'
import { Client, Intents } from 'discord.js'
import { NftCollectionTitle, printTimer } from './inputs.js'
const url = `https://api.opensea.io/api/v1/collection/${NftCollectionTitle}`
const options = { method: 'GET' }
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
dotenv.config()
client.login(process.env.TOKEN)

const getPrice = async () => {
  const data = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return json.collection.stats.floor_price
    })
    .catch((err) => console.error('error:' + err))
  return data
}

const getImageUrl = async () => {
  const data = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return json.collection.primary_asset_contracts[0].image_url
    })
    .catch((err) => console.error('error:' + err))
  return data
}

const getTitle = async () => {
  const data = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return json.collection.primary_asset_contracts[0].name
    })
    .catch((err) => console.error('error:' + err))
  return data
}

const main = async () => {
  const floorPrice = (await getPrice()).toString()
  const imageUrl = await getImageUrl()
  const title = await getTitle()
  const embedMsg = new Discord.MessageEmbed().setColor('#0099ff').setTitle(title).setDescription(`Floor price: ${floorPrice}Ξ`).setThumbnail(imageUrl)
  await client.channels.fetch(process.env.FLOOR_CHANNEL_ID).then((channel) => {
    channel.send({ embeds: [embedMsg] })
  })
}

const start = () => {
  setTimeout(() => {
    main()
    start()
  }, 60000 * printTimer)
}

start()
