import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://erp.duxsoftware.com.ar/WSERP/rest/services/listaprecioventa',
  headers: {
    accept: 'application/json',
    authorization: 'WuJv3P8jfSyXolGLPEWmu3xVCaKGgNRy4cJKGRb7ZPUrkkJRUyIEQOlkeMk9NLYJ'
  }
};

axios
  .request(options)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));