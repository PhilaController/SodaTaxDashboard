const webpack = require("webpack");

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  css: {
    extract: false
  },
  configureWebpack: () => {

    const mode = process.env.VUE_APP_SODA_MODE;
    if (!mode) throw new Error("WARNING: VUE_APP_SODA_MODE is not defined; Use `make COMMAND mode='MODE'`");
    if (mode !== 'production' && mode !== 'staging') throw new Error("WARNING: mode should be 'staging' or 'production'");
    return {
      externals: {
        jquery: "jQuery",
        $: "jQuery"
      },
      entry: {
        main: './src/main.js',
      },
      output: {
        filename: `soda-tax-expenditures.${mode}.[name].[hash:7].js`
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
      ],
      optimization: {
        splitChunks: false
      },
    }
  }
}
