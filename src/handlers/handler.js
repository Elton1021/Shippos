const msg = require('../util/message')
const { log } = require('../util/Logger')
const { basename } = require('path')
const { graphql } = require('graphql')

module.exports = async (schema, event ) => {
	log({ filename: basename(__filename), method: 'handler', action: 'event', log: event })
	// get query
	const data = JSON.parse(event.body)

	// get secure connection

	try {
		// process Request
		let response = await graphql(schema, data.query)
		log({ filename: basename(__filename), method: 'handler', action: 'response', log: response })

		if (response.errors) return { statusCode: 500, body: JSON.stringify(msg.dynamic(500, 101), null, 2) }
		return { statusCode: 200, body: JSON.stringify(response, null, 2) }
	} catch (err) {
		log({ filename: basename(__filename), method: 'handler', action: 'catch error', log: err })
		return msg
	}
}