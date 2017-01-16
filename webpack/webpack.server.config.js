const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeModules = fs
  .readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .reduce(
    (modules, module) => Object.assign(modules, { [module]: `commonjs ${module}` }),
    {}
  );

const config = {
  entry: './source/server.jsx',
  output: {
    filename: 'index.js',
    path: './built/server',
    publicPath: process.env.NODE_ENV === 'production'
      ? 'https://platzi-reactredux-sfs.now.sh'
      : 'http://localhost:3001/',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /(node_modules)/,
      },
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules)/,
        query: {
          presets: ['react'],
          env: {
            production: {
              plugins: ['transform-regenerator', 'transform-runtime'],
              presets: ['es2015'],
            },
            development: {
              presets: ['latest-minimal'],
            },
          },
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules'),
      },
    ],
  },
  target: 'node',
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({ /* Definiendo este plugin podemos decir que existe
                                  process.env.NODE_ENV para que así react pueda
                                  optimizar el bundle final. */
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true), // Ordena los modulos
                                                      // depende que tanto se requieran
    new ExtractTextPlugin('../statics/styles.css'),
  ],
  externals: nodeModules,
};
/* Si estamos en un ambiente de producción */
if (process.env.NODE_ENV === 'production') {
  // Hacemos push de plugins para una configuración especial de produccion
  config.plugins.push(
    new webpack.optimize.DedupePlugin(), // Evita que se pase una dependencia duplicada
    new webpack.optimize.UglifyJsPlugin({ // Se encarga de minificar nuestro codigo
      compress: {
        warnings: false, // Para que no nos muestre los warnings en consola
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require'],
      },
    })
  );
}

module.exports = config;
