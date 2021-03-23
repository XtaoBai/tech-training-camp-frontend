
const isProduction = process.env.NODE_ENV === 'production';

const url = isProduction ? 'https://github.com/XtaoBai' : 'http://localhost:8088/';

const apiUrl = '/api';  


export {
  apiUrl,
  url
};