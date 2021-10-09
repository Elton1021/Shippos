const {
	GraphQLObjectType,
} = require('graphql')
const TestController = require('../../../controllers/TestController')
const type = require('./type')

module.exports = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		DemoMethod: {
			type,
			args: {},
			resolve: TestController.DemoMethod.bind(TestController)
		}
	}
})
