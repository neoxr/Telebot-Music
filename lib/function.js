const fs = require('fs')
const fetch = require('node-fetch')

const change = (module, cross) => {
	require('fs').watchFile(require.resolve(module), () => {
	 delete require.cache[require.resolve(module)]
	 if (cross) cross(module)
    })
}

const crop = url => {
	return new Promise((resolve, reject) => {
		let params = new URLSearchParams()
		params.append('url', url)
		fetch('http://neoxr.xyz/api.php', { method: 'POST', body: params })
    	.then(res => res.json())
    	.then(json => {
    		resolve(json.url)
		}).catch(reject)
	})
}

exports.change = change
exports.crop = crop