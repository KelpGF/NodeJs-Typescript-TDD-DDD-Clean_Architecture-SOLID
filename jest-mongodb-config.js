module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '4.13.0',
      skipMD5: true
    },
    autoStart: false
  }
}
