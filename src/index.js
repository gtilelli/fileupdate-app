const { initDb, closeDbAndExit } = require('./db/oracleConnection')
const app = require('./app')

const init = async () => {
    await initDb()

    const port = process.env.FUPD001_PORT

    app.listen( port, () => {
        console.log('Server is up on port ' + port)
    })
} 

process
  .once('SIGTERM', closeDbAndExit)
  .once('SIGINT',  closeDbAndExit);

init()