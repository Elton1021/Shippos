const msg = require('./message')
const { log } = require('./Logger')
const { basename } = require('path')

class Validator {
	/**
   * Validates multiple fields whether they are present or not
   * @param {JSON} fields that are to be validated
   * @param {string[]} requiredFields list of required fields
   * @returns {{ status: number, message: string, responseCode: number}}
   */
	static validateFields (fields, requiredFields) {
		const logFields = { ...fields }
		delete logFields.password
		log({ filename: basename(__filename), method: 'validateFields', action: 'request', log: { fields: { ...fields }, requiredFields } })
		try {
			for (const fieldName of requiredFields) {
				if (!fields[fieldName] || fields[fieldName] === 'null' || fields[fieldName] === 'undefined' || fields[fieldName] === '') return msg.dynamic(400, 105, ': ' + fieldName)
			}
			return msg.success()
		} catch (err) {
			log({ filename: basename(__filename), method: 'validateFields', action: 'request', log: err })
			return msg.dynamic(400, 101)
		}
	}

	/**
   * validates field whether present or not
   * @param {string} field
   * @returns {{ status: number, message: string, responseCode: number}}
   */
	static validate (field) {
		log({ filename: basename(__filename), method: 'validate', action: 'request', log: field })
		if (!field || field === 'null' || field === 'undefined' || field === '')  return msg.dynamic(400, 105)
		return msg.success()
	}

	/**
   * Returns success even if one is present
   * @param {JSON} fields
   * @param {string} checkParams
   * @returns {{ status: number, message: string, responseCode: number}}
   */
	static validateAny (fields, checkParams) {
		log({ filename: basename(__filename), method: 'validateAny', action: 'request', log: checkParams })
		for (const checkParam of checkParams) {
			if (fields[checkParam] && fields[checkParam] !== 'null' && fields[checkParam] !== 'undefined' && fields[checkParam] !== '')  return msg.success()
		}
		return msg.dynamic(400, 105)
	}
}

module.exports = Validator
