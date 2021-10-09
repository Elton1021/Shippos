const { GraphQLSchema } = require('graphql')

const mutation = require('../model/shp_test/mutations')
const query = require('../model/shp_test/queries')

const schema = new GraphQLSchema({
	query,
	mutation
})

module.exports = schema
