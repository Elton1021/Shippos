const msg = require('../util/message')
const { log } = require('../util/Logger')
const { basename } = require('path')
const Validator = require('../util/Validator')

class TestController {
	/**
   * DemoMethod - purpose demo
   * @param {null} _
   * @param {{}} fields
   * @returns {{ status: number, message: string, responseCode: number }}
   */
	static async DemoMethod (_, fields) {
		log({ filename: basename(__filename), method: 'DemoMethod', action: 'request', log: fields })

		// Check whether all the fields mentioned in the array are present in fields parameter

		try {
			return msg.success()
		} catch (err) {
			log({ filename: basename(__filename), method: 'DemoMethod', action: 'catch error', log: err })
			return msg.dynamic(400, 101)
		}
	}

	/**
   * DemoMutation - demo mutation
   * @param {null} _
   * @param {{ test: string }} fields
   * @returns {{ status: number, message: string, responseCode: number }}
   */
	static async DemoMutation (_, fields) {
		log({ filename: basename(__filename), method: 'DemoMutation', action: 'request', log: fields })
  
		// Check whether all the fields mentioned in the array are present in fields parameter
		const validationResponse = Validator.validateFields(fields, ['test'])
		if (validationResponse.status !== 200) return validationResponse
  
		try {
			return msg.success(100, ' ' + fields.test)
		} catch (err) {
			log({ filename: basename(__filename), method: 'DemoMutation', action: 'catch error', log: err })
			return msg.dynamic(400, 101)
		}
	}
}

module.exports = TestController
