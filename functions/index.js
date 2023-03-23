const functions = require("firebase-functions");
const axios = require("axios");
const convert = require('xml-js');

exports.getRssFead = functions.https.onRequest(async (request, response) => {
  const RSS_URL = 'https://hnrss.org/frontpage';

  axios.get(RSS_URL)
    .then(res => {
      const jsonRes = convert.xml2json(res.data);
      response.send(jsonRes);
    })
})

