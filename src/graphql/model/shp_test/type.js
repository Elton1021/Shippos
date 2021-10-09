const {
	GraphQLString,
	GraphQLInt,
	GraphQLObjectType,
} = require('graphql')


module.exports = new GraphQLObjectType({
	name: 'admin',
	description: 'admin types',
	fields: {
		status: { type: GraphQLInt },
		message: { type: GraphQLString },
		responseCode: { type: GraphQLInt }
	}
})