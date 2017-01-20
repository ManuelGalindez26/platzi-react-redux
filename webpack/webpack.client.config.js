const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: './source/client.jsx',
  output: {
    filename: 'app.js',
    path: './built/statics',
    publicPath: process.env.NODE_ENV === 'production'
      ? 'https://platzi-reactredux-sfs.now.sh'
      : 'http://localhost:3001/',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /node_modules/,
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
        exclude: /node_modules/,
        query: {
          presets: ['es2016', 'es2017', 'react'],
          env: {
            production: {
              plugins: ['transform-regenerator', 'transform-runtime'],
              presets: ['es2015'],
            },
            development: {
              plugins: ['transform-es2015-modules-commonjs'],
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
  target: 'web',
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
