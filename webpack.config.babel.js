import { resolve } from 'path'
import { host, devPort } from './config.json'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'

const config = {
  context: resolve('app'),
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: resolve('app'),
        use: [
          { loader: 'file-loader', options: { name: '[name].html' } },
          { loader: 'extract-loader' },
          { loader: 'html-loader' },
          { loader: 'pug-html-loader', options: { exports: false } },
        ],
      },
      {
        test: /\.sass$/,
        include: resolve('app'),
        use: [
          { loader: 'file-loader', options: { name: '[name].css' } },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { plugins: [autoprefixer] } },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.js$/,
        include: resolve('app'),
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.(jpg|png|svg|mp3)$/,
        include: resolve('app/res'),
        use: { loader: 'file-loader', options: { name: 'res/[hash:7].[ext]' } },
      },

      // Semantic UI
      {
        test: /\.css$/,
        include: resolve('node_modules/semantic-ui-css'),
        use: [
          { loader: 'style-loader', options: { insertAt: 'top' } },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.(eot|png|svg|ttf|woff2|woff)$/,
        include: resolve('node_modules/semantic-ui-css'),
        use: { loader: 'file-loader', options: { name: 'res/[hash:7].[ext]' } },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
  ],
  output: {
    path: resolve('public'),
    filename: 'app.js',
  },
  devServer: {
    host: host || 'localhost',
    port: devPort || '8800',
    inline: true,
    stats: { chunkModules: false },
  },
}

if(process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
  ])
}

export default config
