let extra = require('./lib/extra.js')
let _function = require('./lib/function')
let yts = require('yt-search')
let { servers, yta } = require('./lib/y2mate')
let { decode } = require('html-entities')
module.exports = async (m, conn) => {
try {
	extra.chats(m, conn)
	const status = {
		error: 'Error, something went wrong!',
		errorF: 'Sorry this feature is in error.',
	}
	if(m.text.slice(0, 1) !== '/') {
		try {
			conn.sendChatAction(m.chat, 'typing') 
			let json = await yts(m.text)
			let yt = json.all.find(video => video.seconds < 3600)
			let server = (servers[0]).toLowerCase()
			let { dl_link, title, filesize, filesizeF } = await yta(yt.url, servers.includes(server) ? server : servers[0])
			let y = '•  Title : ' + decode(title) + '\n'
			y += '•  Size : ' + filesizeF + '\n'
			y += '•  Duration : ' + yt.seconds + 's (' + yt.timestamp + ')\n'
			y += '•  Bitrate : 192 kbps\n'
			m.reply(m.chat, y)
			let over = 60 * 1024 < filesize
			if(over) {
    			let link = await _function.crop(dl_link)
				return m.reply(m.chat, `•  Ukuran file yang kamu minta ${filesizeF} (Ukuran melebihi batas) silahkan download sendiri : ${link}`)
			}
			m.Aud(m.chat, dl_link, null, title.replace(/["/]/, ''))
		} catch {
			return m.reply(m.chat, status.error)
			}
		}
	let prefix = new RegExp('^[' + ('/') + ']')
	let isPrefix
	if (m.text && m.text.length != 1 && (isPrefix = (prefix.exec(m.text) || '')[0])) {
		let args = m.text.replace(isPrefix, '').split` `.filter(v=>v)
		let command = args.shift().toLowerCase()
	for (let n in global.cmd) {
		let cmd = global.cmd[n].run
		let turn = cmd.usage instanceof RegExp ? cmd.usage.test(command) : cmd.usage instanceof Array ? cmd.usage.includes(command) : cmd.usage instanceof String ? cmd.usage == command : false
		if (!turn) continue
		if (typeof cmd.error !== 'undefined' && cmd.error) {
			m.reply(m.id, status.errorF)
			continue
		} 
		cmd.async(m, { conn, _function, status, args, isPrefix, command })
		break
			}
		}
	} catch(e) {
		console.log(e.message)
	}
}