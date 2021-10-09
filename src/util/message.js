const messages = {
	100: 'Success',
	101: 'Something Went Wrong',
	102: 'Something Went Wrong! Query Too Long',
	103: 'Error: Could not find query',
	104: 'Error: Authorization Failed',
	105: 'Error: Required Field Not Found',
	106: 'Error: Admin Already Exists',
	107: 'Error: Invalid Credentials',
	108: 'Error: Unauthorizatied Access',
	109: 'Error: No Records found',
	110: 'Error: Invalid Email',
	111: 'Error: Invalid Status',
	112: 'Error: New Password Must Not Match Previous Password',
	113: 'Error: Property Already Exists',
	114: 'Error: Property Doesn\'t Exists',
}

module.exports.responseMessage = messages

module.exports.dynamic = (status, responseCode, message = '') => ({ status, message: messages[responseCode] + message, responseCode })

module.exports.success = (responseCode = 100, message = '') => {
	responseCode = responseCode || 100
	return { status: 200, message: messages[responseCode] + message, responseCode }
}
