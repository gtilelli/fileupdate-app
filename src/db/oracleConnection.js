const oracledb = require('oracledb')
const dbConfig = require('./database.js')

// Increase Node thread pool size to be able to create up to dbConfig.hrPool.poolMax threads
// to process Oracle requests asynchronously
const increaseThreadPoolSize = () => {
    const defaultThreadPoolSize = 4;

    // Increase thread pool size by poolMax
    process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;
}

async function initDb() {
    increaseThreadPoolSize()
    try {
        console.log('Initializing database module');
        await oracledb.createPool(dbConfig.hrPool);
    } catch (err) {
        console.error(err)
        process.exit(1) // Non-zero failure code
    }
}

async function closeDbAndExit() {
    try {
        console.log('Closing database module');
        await oracledb.getPool().close();
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message)
        process.exit(1) // Non-zero failure code
    }
}

module.exports = {
    initDb,
    closeDbAndExit
}
