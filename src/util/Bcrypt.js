const bcrypt = require('bcrypt')

/**
 * Bcrypt: using the orginal bcrypt package with dynamic salt generation based on env
 */
class Bcrypt {
	/**
   * Converts String to bcrypt hash
   * @param {String} secret that is to be hashed
   */
	static hash (secret) {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(+process.env.SALT_SIZE, (err, salt) => {
				if (err) {
					return reject(err)
				}
				bcrypt.hash(secret, salt, (err, hash) => {
					if (err) {
						return reject(err)
					}

					return resolve(hash)
				})
			})
		})
	}

	/**
   * Compares normal string with bcrypt hash
   * @param {String} hash bcrypt hash param
   * @param {String} normal normal String that is to be compared with the hash
   */
	static compare (hash, normal) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(normal, hash, (err, isMatch) => {
				if (err) {
					return reject(err)
				}
				if (!isMatch) {
					return resolve(false)
				}
				return resolve(true)
			})
		})
	}
}

module.exports = Bcrypt
