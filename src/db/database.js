module.exports = {
    hrPool: {
      user: process.env.FUPD001_USER,
      password: process.env.FUPD001_MYPW,
      connectString: process.env.FUPD001_CONNECT_STRING,
      poolMin: 10,
      poolMax: 10,
      poolIncrement: 0
    }
  };