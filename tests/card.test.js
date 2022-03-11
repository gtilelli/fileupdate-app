const request = require('supertest')
const oracledb = require('oracledb');
const Card = require('../src/models/card')
const app = require('../src/app')

const { cards, cardsTooMany, setupDatabase } = require('./fixtures/db')

beforeEach( setupDatabase )

test('Should return error Bulk input is not an array', async () => {
    const response = await request(app)
        .put('/cards/bulk')
        .send( { pan: cards[0].pan, status: 'A', balance: 19.00 } )
        .expect(400)
    expect(response.body.message).toEqual('Bulk input is not an array')
})

test('Should return error Max bulk size exceeded (size: 51 max: 50)', async () => {
    const response = await request(app)
        .put('/cards/bulk')
        .send( cardsTooMany )
        .expect(400)
    expect(response.body.message).toEqual('Max bulk size exceeded (size: 51 max: 50)')
})

test('Should return error Element is not a valid card for put', async () => {
    const response = await request(app)
        .put('/cards/bulk')
        .send( [ { pan: cards[0].pan, pin_offset: '348976384' } ] )
        .expect(400)
    expect(response.body.message).toEqual('Element is not a valid card for put: field pin_offset not expected (expected fields: pan,status,balance) in element 0')
})

test('Should return error Element is not a valid card for put', async () => {
    const response = await request(app)
        .put('/cards/bulk')
        .send( [ { pan: cards[0].pan, balance: 10 } ] )
        .expect(400)
    expect(response.body.message).toEqual('Element is not a valid card for put: not all required fields present (pan,status,balance) in element 0')
})

test('Should update one card and insert the other card', async () => {
    await request(app)
        .put('/cards/bulk')
        .send( [ { pan: cards[0].pan, status: 'X', balance: 111.11 },
                 { pan: '1234567890123456', status: 'Y', balance: 222.22 } ] )
        .expect(200)

    const connection = await oracledb.getConnection()
    const result1 = await connection.execute(Card.sqlSelectByPan, [ cards[0].pan ], Card.optionsSelect )
    console.log('result1.rows: ' + result1.rows)
    expect(result1.rows.length).toEqual(1)
    expect(result1.rows[0]).toEqual(['X', 111.11])
    connection.close()

    const connection2 = await oracledb.getConnection()
    const result2 = await connection2.execute(Card.sqlSelectByPan, [ '1234567890123456' ], Card.optionsSelect )
    console.log('result2.rows: ' + result2.rows)
    expect(result2.rows.length).toEqual(1)
    expect(result2.rows[0]).toEqual(['Y', 222.22])
    connection2.close() // previously nothing
})

test('Should return error Bulk input is not an array', async () => {
    const response = await request(app)
        .delete('/cards/bulk')
        .send( { pan: cards[0].pan } )
        .expect(400)
    expect(response.body.message).toEqual('Bulk input is not an array')
})

test('Should return error Max bulk size exceeded (size: 51 max: 50)', async () => {
    const response = await request(app)
        .delete('/cards/bulk')
        .send( cardsTooMany )
        .expect(400)
    expect(response.body.message).toEqual('Max bulk size exceeded (size: 51 max: 50)')
})

test('Should return error Element is not a valid card for delete', async () => {
    const response = await request(app)
        .delete('/cards/bulk')
        .send( [ { pan: cards[0].pan, pin_offset: '348976384' } ] )
        .expect(400)
    expect(response.body.message).toEqual('Element is not a valid card for delete: field pin_offset not expected (expected fields: pan) in element 0')
})

test('Should delete card', async () => {
    await request(app)
        .delete('/cards/bulk')
        .send( [ { pan: cards[0].pan } ] )
        .expect(200)

    const connection = await oracledb.getConnection()

    const result1 = await connection.execute(Card.sqlSelectByPan, [ cards[0].pan ], Card.optionsSelect )
    connection.close()
    console.log(result1.rows)
    expect(result1.rows.length).toEqual(0)

    const connection2 = await oracledb.getConnection()
    const result2 = await connection2.execute(Card.sqlSelectByPan, [ cards[1].pan ], Card.optionsSelect )
    console.log(result2.rows)
    expect(result2.rows.length).toEqual(1)
})

test('Should delete both cards', async () => {
    await request(app)
        .delete('/cards/bulk')
        .send( [ { pan: cards[0].pan }, { pan: cards[1].pan } ] )
        .expect(200)

    const connection = await oracledb.getConnection()

    const result1 = await connection.execute(Card.sqlSelectByPan, [ cards[0].pan ], Card.optionsSelect )
    connection.close()
    console.log(result1.rows)
    expect(result1.rows.length).toEqual(0)

    const connection2 = await oracledb.getConnection()
    const result2 = await connection2.execute(Card.sqlSelectByPan, [ cards[1].pan ], Card.optionsSelect )
    console.log(result2.rows)
    expect(result2.rows.length).toEqual(0)
})
