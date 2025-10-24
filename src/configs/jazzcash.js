import { credentials, setData, createRequest } from "jazzcash-checkout";


// initializes your jazzcash
credentials({
  config: {
    merchantId: '', // Merchant Id
    password: '', // Password
    hashKey: '', // Hash Key
  },
  environment: 'sandbox', // available environment live or sandbox
});

const JC = {
  wallet: (data, callback) => {
    setData(data);
    createRequest('WALLET').then(res => {
      res = JSON.parse(res);
      console.log(res);

      // callback function
      callback(res);
    });
  },

  pay: (data, callback) => {
    setData(data);
    createRequest('PAY').then(res => {
      console.log(res);

      // callback function
      callback(res);
    });
  },

  refund: (data, callback) => {
    setData(data);
    createRequest('REFUND').then(res => {
      res = JSON.parse(res);
      console.log(res);

      // callback function
      callback(res);
    });
  },

  inquiry: (data, callback) => {
    setData(data);
    createRequest('INQUIRY').then(res => {
      res = JSON.parse(res);
      console.log(res);

      // callback function
      callback(res);
    });
  },
};

export default JC;
