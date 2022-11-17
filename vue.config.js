'use strict'


// 所有配置项解释都可以在其中找到 https://cli.vuejs.org/config/
module.exports = {

  productionSourceMap: false,

  lintOnSave: false,

  publicPath: process.env.NODE_ENV === 'production' ? '/cms' : '/',//


  devServer: {
    disableHostCheck: true,

  }

}
