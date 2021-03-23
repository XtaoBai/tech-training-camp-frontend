// vue.config.js 
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
// yourProject Context-path
const productionPath = './devlopment'
module.exports = {
    publicPath: IS_PROD ? productionPath : '/'
}