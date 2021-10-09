const msg = require('./message')
const { log } = require('./Logger')
const { basename } = require('path')
const Validator = require('./Validator')
const crypto = require('crypto')

class Cryptography {
	/**
   * generateUuid - generates a universally unique id
   * @returns {{ status: number, message: string, responseCode: number }}
   */
	static async generateUuid (_, fields) {
		log({ filename: basename(__filename), method: 'generateUuid', action: 'request', log: '' })

		try {
			const date = new Date().getTime()
			const uuid = 'xxx3xxx4xxxxxyxx'.replace(/[xy]/g, function (c) {
				const r = (date + Math.random() * 16) % 16 | 0
				return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
			})
			return uuid
		} catch (err) {
			log({ filename: basename(__filename), method: 'generateUuid', action: 'catch error', log: err })
			return msg.dynamic(400, 101)
		}
	}

	/**
   * Encrypt - Encrypts a string with the key
   * @param {string} text
   * @param {string} key
   * @returns {{ status: number, message: string, responseCode: number, encrypted: string }}
   */
	static async Encrypt (text, key) {
		log({ filename: basename(__filename), method: 'Encrypt', action: 'request', log: text })

		const validationResponse = Validator.validateFields({text, key}, ['text', 'key'])
		if (validationResponse.status !== 200) return validationResponse

		try {
			const iv = await this.generateUuid()
			log({ filename: basename(__filename), method: 'Encrypt', action: 'iv', log: iv })
			const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
			let encrypted = cipher.update(text, 'utf8', 'base64')
			encrypted += cipher.final('base64')
			return { ...msg.success(), encrypted: iv + encrypted }
		} catch (err) {
			log({ filename: basename(__filename), method: 'Encrypt', action: 'catch error', log: err })
			return msg.dynamic(400, 101)
		}
	}

	/**
   * Decrypt - Decrypts a string with the key
   * @param {string} text
   * @param {string} key
   * @returns {{ status: number, message: string, responseCode: number, decrypted: string }}
   */
	static async Decrypt (text, key) {
		log({ filename: basename(__filename), method: 'Decrypt', action: 'request', log: text })

		const validationResponse = Validator.validateFields({text, key}, ['text', 'key'])
		if (validationResponse.status !== 200) return validationResponse

		try {
			const iv = text.substr(0, 16)
			log({ filename: basename(__filename), method: 'Decrypt', action: 'iv', log: iv })
			const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
			let decrypted = decipher.update(text, 'base64', 'ascii')
			decrypted += decipher.final('ascii')
			return decrypted
		} catch (err) {
			log({ filename: basename(__filename), method: 'Decrypt', action: 'catch error', log: err })
			return msg.dynamic(400, 101)
		}
	}
}

module.exports = Cryptography
