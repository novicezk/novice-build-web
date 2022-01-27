process.env.VUE_APP_BACKEND_URL = "/backend";
module.exports = {
    publicPath: './',
    lintOnSave: 'warning',
    devServer: {
      port: 8300,
      proxy: {
        "/backend": {
          "target": 'http://localhost:9000/'
        }
      }
    }
  }