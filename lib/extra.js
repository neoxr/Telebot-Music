const request = require('request')
const { decode } = require('html-entities')
exports.chats = async (m, conn) => {
	if(!m) return m
	if(m) {
		m.chat = typeof m.chat == 'undefined' ? m.message.chat.id : m.chat.id
		m.sender = m.from.id || m.message.from.id
		m.text = m.data ? m.data : m.text
	}

   /**
    * Sending Text
    * @param {Integer} id
    * @param {String} text
	*/
	m.reply = async (id, text) => {
		await conn.sendChatAction(id, 'typing')
		conn.sendMessage(id, text, { disable_web_page_preview: true, reply_to_message_id: m.message_id ? m.message_id : m.message.message_id })
	}

	/**
    * Sending Audio
    * @param {Integer} id
    * @param {String} url
    * @param {String} caption
	*/
	m.Aud = async (id, url, caption, name) => {
		await conn.sendChatAction(id, 'typing') 
		conn.sendAudio(id, request(url), { caption: caption, reply_to_message_id: m.message_id ? m.message_id : m.message.message_id }, { filename: decode(name) + '.mp3' })
	}
}