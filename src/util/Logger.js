class Logger {
	/**
   * Console logs data
   * @param {{ filename: string, method: string, action: string, log: any }} param required for logging
   */
	static log ({ filename, method, action, log }) {
		console.log('Filename:', filename, '|| Method:', method, '|| Action:', action, '|| Log:', log)
	}

	/**
   * Console logs data except for production environment
   * @param {{ filename: string, method: string, action: string, log: any }} param required for logging
   */
	static debug ({ filename, method, action, log }) {
		if (process.env.NODE_ENV == 'production') return
		console.log('DEBUG\n', 'Filename:', filename, '|| Method:', method, '|| Action:', action, '|| Log:', log, '\nDEBUG')
	}
}

module.exports = Logger
