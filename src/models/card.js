const oracledb = require('oracledb');

// Works with the following definition:
// create table card ( pan varchar2(19) not null, status varchar2(1), balance number(12,2) );
// For character fields, prefer to use always varchar2, to avoid problems with blank padding

// Should contain all table fields (that it is the intention to "upsert")
const requiredPutFields = [ 'pan', 'status', 'balance' ]
// Generally contains the key fields, that in the case of the card it is the pan
const requiredDeleteFields = [ 'pan' ]
const requiredFields = [
    {
        oper: 'put',
        fields: requiredPutFields
    },
    {
        oper: 'delete',
        fields: requiredDeleteFields
    } 
]

var requiredFieldsForOper = (oper) => {
    let result = []
    requiredFields.forEach( (element) => {
        if ( oper === element.oper ) {
            result = element.fields
        }
    } )
    return result
}

const card = {
    // The SQL command below is equivalent to:
    //
    // sqlUpsert: 'begin ' + 
    //     '    update card ' +
    //     '        set status = :status, ' +
    //     '            balance = :balance ' +
    //     '        where pan = :pan; ' +
    //     '    if ( sql%rowcount = 0 ) then' +
    //     '        insert into card (pan, status, balance) ' + 
    //     '            values (:pan, :status, :balance); ' +
    //     '    end if;' +
    //     'end; \n',
    //
    // With MERGE version the performance is similar, and we can get batchErrors:
    sqlUpsert: 'MERGE INTO CARD USING DUAL ' +
               'ON (PAN = :pan) ' +
               'WHEN MATCHED THEN ' +
               '    UPDATE SET STATUS = :status, BALANCE = :balance ' + 
               'WHEN NOT MATCHED THEN ' +
               '    INSERT ( PAN, STATUS, BALANCE ) ' + 
               '    VALUES ( :pan, :status, :balance ) ',
    sqlSelectByPan: 'select ' + 
        '    status, ' +
        '    balance ' +
        'from card ' +
        '    where pan = :pan ',
    sqlDelete: 'delete ' + 
        'from card ' +
        'where pan = :pan ',
    sqlDeleteAll: 'delete from card', 
    optionsUpsert: {
        autoCommit: true,
        batchErrors: true,
        bindDefs: {
            pan: { type: oracledb.STRING, maxSize: 19 },
            status: { type: oracledb.STRING, maxSize: 1 },
            balance: { type: oracledb.NUMBER }
        }
    },
    optionsDelete: {
        autoCommit: true,
        batchErrors: true,
        bindDefs: {
            pan: { type: oracledb.STRING, maxSize: 19 }
        }
    },
    optionsSelect: {
        autoCommit: true,
        bindDefs: {
            pan: { type: oracledb.STRING, maxSize: 19 }
        }
    },
    checkCardValidity(element, oper, index) {
        const fields = Object.keys(element)
        let count = 0
        const requiredFieldsOper = requiredFieldsForOper(oper)
        fields.forEach( (field) => {
            if ( ! (requiredFieldsOper.includes(field)) ) {
                throw new Error('Element is not a valid card for ' + oper + ': field ' + field + ' not expected (expected fields: ' + requiredFieldsOper + ') in element ' + index)
            }
            count++
        })
        if (count < requiredFieldsOper.length) {
            throw new Error('Element is not a valid card for ' + oper + ': not all required fields present (' + requiredFieldsOper + ') in element ' + index)
        } 
    }
}

module.exports = card