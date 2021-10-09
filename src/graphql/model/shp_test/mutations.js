const {
	GraphQLString,
	GraphQLObjectType,
} = require('graphql')
const TestController = require('../../../controllers/TestController')
const type = require('./type')

module.exports = new GraphQLObjectType({
	name: 'RootMutationsType',
	fields: {
		DemoMutation: {
			type,
			args: {
				test: { type: GraphQLString }
			},
			resolve: TestController.DemoMutation.bind(TestController)
		}
	}
})
