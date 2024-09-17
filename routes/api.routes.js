const express = require('express')
const router = express.Router()
const user = require('./user.routes')
const event = require('./event.routes')

router.use('/api', user)
router.use('/api', event)


module.exports = router