const oracledb = require('oracledb')
const Card = require('../../src/models/card')

const { increaseThreadPoolSize, initDb, closeDb } = require('../../src/db/oracleConnection')

const setupDatabase = async () => {
    // Increases Node thread pool size for use by Oracle requests and creates Oracle connection pool
    await initDb()
    const connection = await oracledb.getConnection()
    await connection.execute(Card.sqlDeleteAll)
    await connection.executeMany(Card.sqlUpsert, cards, Card.optionsUpsert)
    connection.close()
}

const cards = 
[
    {
        pan: '4485142860357550',
        status: 'A',
        balance: 30.80
    },
    {
        pan: '4485142860357551000',
        status: 'C',
        balance: 100
    }
]

const cardsTooMany = [
    {
        "pan": "4485142860357500",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357501",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357502",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357503",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357504",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357505",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357506",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357507",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357508",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357509",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357510",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357511",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357512",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357513",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357514",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357515",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357516",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357517",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357518",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357519",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357520",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357521",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357522",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357523",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357524",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357525",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357526",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357527",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357528",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357529",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357530",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357531",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357532",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357533",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357534",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357535",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357536",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357537",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357538",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357539",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357540",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357541",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357542",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357543",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357544",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357545",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357546",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357547",
        "status": "A",
        "balance": 100.00
    },
    {
        "pan": "4485142860357548",
        "status": "A",
        "balance": 110.00
    },
    {
        "status": "Z",
        "pan": "4485142860357549",
        "balance": 101.50
    },
    {
        "status": "Z",
        "pan": "4485142860357550",
        "balance": 101.50
    }
]

module.exports = {
    cards,
    cardsTooMany,
    setupDatabase
}