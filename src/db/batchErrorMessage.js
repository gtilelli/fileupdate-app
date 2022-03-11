const batchErrorMessage = (batchErrors) => {
    let errmsg = '[\n'
    batchErrors.forEach( (error) => {
        errmsg += '{\n\"message\": \"' + error.message.replace(/\"/g, '') + 
                  '\"\n\"row\": ' + error.offset + '\n},\n'
    } )
    errmsg = errmsg.slice(0, -2) + '\n]'
    return errmsg
}

module.exports = batchErrorMessage