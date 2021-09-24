const config = {
  presets: ['react-app'],
  plugins: [],
}

const isEnvDev = process.env.NODE_ENV !== 'production'

if (isEnvDev) {
  config.plugins.push('react-refresh/babel')
}

module.exports = config
