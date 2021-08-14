const fs = require('fs')
const path = require('path')
const _function = require('./lib/function')
const Connect = require('node-telegram-bot-api')
const token = '' // < PUT YOUR TOKEN HERE!!
if(token == '') return console.log('Token empty!')
const conn = new Connect(token, { polling: true })
conn.on('message', async (m) => {
	global.cmd = Object.fromEntries(fs.readdirSync('./commands/').filter(v => v.endsWith('.js')).map(file => [ file, require('./commands/' + file) ]))
	let handler = require('./handler')
	await handler(m, conn)
	fs.watch(path.join(__dirname, 'commands'), (event, file) => {
		let js = file => file.endsWith('.js')
		if(js(file)) {
			let dir = './commands/' + file
		if (delete require.cache[require.resolve(dir)]) {
			if (!fs.existsSync(require.resolve(dir))) return delete global.cmd[file]
		}
    } else { 
			console.log(`requiring new plugin '${dir}'`)
    		global.cmd[file] = require(dir)
		}
	})
})

_function.change('../handler.js', () => {
	require('./handler.js')
	console.log('Handler was updated!')
})