'use strict'

const handler = require('./handler')
const schema = require('../graphql/schema/shp_test')

module.exports.test = async (event) => {
	const response = await handler(schema, event)
	return response
}
