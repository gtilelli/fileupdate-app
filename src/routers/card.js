const express = require('express')
const oracledb = require('oracledb')
const batchErrorMessage = require('../db/batchErrorMessage')
const Card = require('../models/card')

const router = new express.Router()

// Allows client to read data for a card, using pan as the key (id)
router.get('/cards/:id', async (req, res) => {
    try {
        // Database execution
        const connection = await oracledb.getConnection()
        const result = await connection.execute(Card.sqlSelectByPan, [ req.params.id ], Card.optionsSelect)
        connection.close()

        // Exceptions
        if (result.rows.length > 1) {
            throw new Error('More than 1 line fetched')
        }
        if (result.rows.length === 0) {
            return res.status(404).send()
        }

        res.status(200).send(result.rows[0])
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// Returns OK when all cards received are in the table, inserted this time ou update because they 
// were already in the table, using pan as the key. If it was not possible to put one or more of
// the cards received in the table, the return is 400 and a message with the reason is returned too.
router.put('/cards/bulk', async (req, res) => {
    let result = ''
    try {
        // Input validation
        if (req.body.constructor !== Array) {
            throw new Error('Bulk input is not an array')
        }
        if (req.body.length > process.env.FUPD001_MAX_BULK_SIZE) {
            throw new Error('Max bulk size exceeded (size: ' + req.body.length + ' max: ' + process.env.FUPD001_MAX_BULK_SIZE + ')')
        }
        req.body.forEach( (element, index) => {
            Card.checkCardValidity(element, 'put', index)
        } )

        // Database bulk execution
        const connection = await oracledb.getConnection()
        result = await connection.executeMany(Card.sqlUpsert, req.body, Card.optionsUpsert)
        connection.close()
        if ( result.batchErrors !== undefined ) {
            throw new Error(batchErrorMessage(result.batchErrors))
        }

        res.status(200).send()
    } catch (e) {
        res.status(400).send( {message: e.message } )
    }
})

// Returns OK when all the keys received are deleted, even if these keys had already been
// deleted before, that is, the return is OK when you can´t find the keys received in the table
// anymore (keys not found for delete aren´t considered exceptions).
router.delete('/cards/bulk', async (req, res) => {
    let result = ''
    try {
        // Input validation
        if (req.body.constructor !== Array) {
            throw new Error('Bulk input is not an array')
        }
        if (req.body.length > process.env.FUPD001_MAX_BULK_SIZE) {
            throw new Error('Max bulk size exceeded (size: ' + req.body.length + ' max: ' + process.env.FUPD001_MAX_BULK_SIZE + ')')
        }
        req.body.forEach( (element, index) => {
            Card.checkCardValidity(element, 'delete', index)
        } )

        // Database bulk execution
        const connection = await oracledb.getConnection()
        result = await connection.executeMany(Card.sqlDelete, req.body, Card.optionsDelete)
        connection.close()
        if ( result.batchErrors !== undefined ) {
            throw new Error(batchErrorMessage(result.batchErrors))
        }

        res.status(200).send()
    } catch (e) {
        res.status(400).send( {message: e.message } )
    }
})

module.exports = router