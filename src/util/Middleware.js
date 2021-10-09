const msg = require('./message')
const { log } = require('./Logger')
const { basename } = require('path')
const jwt = require('jsonwebtoken')
const { parse } = require('graphql')
const UsersController = require('../controller/users/UsersController')

class Middleware {
	/**
   * Checks the size of the query
   * @param {string} query
   */
	static sizeLimit (query) {
		log({ filename: basename(__filename), method: 'sizeLimit', action: 'request', log: { query, queryLength: query.length, limit: (process.env.QUERY_LIMIT || 2000) } })
		try {
			if (query.length > (process.env.QUERY_LIMIT || 2000)) {
				return msg.dynamic(400, 102)
			}

			return msg.success()
		} catch (err) {
			log({ filename: basename(__filename), method: 'sizeLimit', action: 'catch error', log: err })
			return msg.dynamic(400, 101)
		}
	}

	/**
   * Checks whether query parameter is present
   * @param {JSON} body
   * @param {string} body.query
   */
	static checkQuery (body) {
		log({ filename: basename(__filename), method: 'checkQuery', action: 'request', log: { body } })
		try {
			if (!body.query) {
				return msg.dynamic(400, 103)
			}

			return msg.success()
		} catch (err) {
			log({ filename: basename(__filename), method: 'checkQuery', action: 'catch error', log: err })
			return msg.dynamic(400, 101)
		}
	}

	/**
   * Authenticates JWT TOKEN
   * @param {string} query
   * @param {string} url
   * @param {JSON} headers
   * @param {string} headers.Authorization
   */
	static async auth (query, url, headers) {
		log({ filename: basename(__filename), method: 'auth', action: 'request', log: { query } })
		const exceptions = {
			users: ['login']
		}

		try {
			const QueryParams = parse(query)
			for (const exceptionRoutes in exceptions) {
				if (url.substring(1, url.length) === exceptionRoutes && exceptions[exceptionRoutes].filter(f => QueryParams.definitions[0].selectionSet.selections[0].name.value === f).length > 0) {
					log({ filename: basename(__filename), method: 'auth', action: 'exception skipping', log: { query: QueryParams.definitions[0].selectionSet.selections[0].name.value } })
					return msg.success()
				}
			}

			const authorization = headers.Authorization || headers.authorization
			if (!authorization || authorization.indexOf('BNW ') === -1) {
				return msg.dynamic(400, 104)
			}

			const token = authorization.replace('BNW ', '')
			const payload = jwt.verify(token, process.env.JWT_KEY)
			const fields = {}

			for (const argument of QueryParams.definitions[0].selectionSet.selections[0].arguments) {
				if (fields.userType && fields.userid) {
					if (fields.userid === payload.userid && fields.userType === payload.userType) {
						break
					} else {
						return msg.dynamic(400, 104)
					}
				}

				if (argument.name.value === 'userid') {
					fields.userid = argument.value.value
				} else if (argument.name.value === 'userType') {
					fields.userType = argument.value.value
				}
			}

			// jwt compare
			const compareJWTResponse = await UsersController.compareJWT(fields, token)
			log({ filename: basename(__filename), method: 'auth', action: 'compareJWTResponse', log: compareJWTResponse })
			if (compareJWTResponse.status !== 200) {
				return compareJWTResponse
			}

			return msg.success()
		} catch (err) {
			log({ filename: basename(__filename), method: 'auth', action: 'catch error', log: err })
			return msg.dynamic(400, 104)
		}
	}

	static async setExpressMiddlewares (req, res, next) {
		try {
			const checkQueryResponse = Middleware.checkQuery(req.body)
			if (checkQueryResponse.status !== 200) {
				return res.send(checkQueryResponse)
			}

			const sizeLimitResponse = Middleware.sizeLimit(req.body.query)
			if (sizeLimitResponse.status !== 200) {
				return res.send(sizeLimitResponse)
			}

			const authResponse = await Middleware.auth(req.body.query, req.url, req.headers)
			if (authResponse.status !== 200) {
				return res.send(authResponse)
			}

			return next()
		} catch (err) {
			log({ filename: basename(__filename), method: 'setExpressMiddlewares', action: 'catch error', log: err })
			return res.send(msg.dynamic(400, 101))
		}
	}
}

module.exports = Middleware
