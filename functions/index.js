const functions = require("firebase-functions");
const axios = require("axios");
const convert = require('xml-js');

exports.getRssFeed = functions.https.onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  if (request.method !== 'POST') {
    response.status(400).send('Request is not a POST');
  }
  const body = request.body;
  if (!body) {
    response.status(400).send('Body is empty');
  }
  const { rssUrlList } = body;

  const rssFetchPromises = rssUrlList.map(rssUrl => new Promise(resolve => {
    axios.get(rssUrl).then(res => {
      const jsonRes = convert.xml2json(res.data);
      resolve(jsonRes);
    })
  }))

  Promise
    .allSettled(rssFetchPromises)
    .then((results) => {
      const data = results.filter(result => result.status === 'fulfilled').map(result => JSON.parse(result.value));
      const feeds = data.flatMap(singleData => singleData.elements).flatMap(rssData => rssData.elements)
      response.status(200).send(feeds)
    });
});
