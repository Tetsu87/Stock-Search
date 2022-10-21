// import dayjs from 'dayjs';

const express = require("express");
const request = require("request");
const async = require("express-async-await");
const fetch = require("node-fetch");
const url = require("url");
const cors = require("cors");
const app = express();
// const PORT = 3000;
const PORT = parseInt(process.env.PORT) || 8080;
const dayjs = require("dayjs");
// const userRouter = require("./routes/user")

app.use(cors());
app.use(express.static("public"));
// app.get('/', (req, res) => {
//   res.status(200).send('Hello, world!').end();
// });

async function getDescription(ticker) {
  let url =
    "https://finnhub.io/api/v1/stock/profile2?symbol=" +
    ticker +
    "&token=c7tntuiad3i8dq4u9na0";

  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getHistoricalData(ticker) {
  let from = dayjs().subtract(7, "d").unix();
  let to = dayjs().unix();
  console.log("from server getHistoricalData");
  console.log(from);
  console.log(to);
  console.log("from server getHistoricalData OK??");
  let url =
    "https://finnhub.io/api/v1/stock/candle?symbol=" +
    ticker +
    "&resolution=5&from=" +
    from +
    "&to=" +
    to +
    "&token=c7tntuiad3i8dq4u9na0";
  // let url =
  //   "https://finnhub.io/api/v1/stock/candle?symbol=" +
  //   ticker +
  //   "&resolution=5&from=1631022248&to=1631627048&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getHistoricalDailyData(ticker) {
  let from = dayjs().subtract(2, "y").unix();
  let to = dayjs().unix();
  console.log("from server getHistoricalDailyData");
  console.log(from);
  console.log(to);
  console.log("from server getHistoricalDailyData OK??");
  let url =
    "https://finnhub.io/api/v1/stock/candle?symbol=" +
    ticker +
    "&resolution=D&from=" +
    from +
    "&to=" +
    to +
    "&token=c7tntuiad3i8dq4u9na0";
  // let url =
  //   "https://finnhub.io/api/v1/stock/candle?symbol=" +
  //   ticker +
  //   "&resolution=5&from=1631022248&to=1631627048&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getLatestPrice(ticker) {
  let url =
    "https://finnhub.io/api/v1/quote?symbol=" +
    ticker +
    "&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function autoComplete(ticker) {
  let url =
    "https://finnhub.io/api/v1/search?q=" + ticker + "&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getNews(ticker) {
  let from = dayjs().subtract(3, "M").format('YYYY-MM-DD');
  let to = dayjs().format('YYYY-MM-DD');
  let url =
    "https://finnhub.io/api/v1/company-news?symbol=" +
    ticker +
    "&from=" + from + "&to=" + to + "&token=c7tntuiad3i8dq4u9na0";
  // let url = "https://finnhub.io/api/v1/company-news?symbol=TSLA&from=2021-09-01&to=2021-09-09&token=c7tntuiad3i8dq4u9na0";
  console.log("from server getNews");
  console.log(from);
  console.log(to);
  console.log("from server getNews OK??");
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getRecommendationTrends(ticker) {
  let url =
    "https://finnhub.io/api/v1/stock/recommendation?symbol=" +
    ticker +
    "&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getSocialSentiment(ticker) {
  let url =
    "https://finnhub.io/api/v1/stock/social-sentiment?symbol=" +
    ticker +
    "&from=2022-01-01&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getPeers(ticker) {
  let url =
    "https://finnhub.io/api/v1/stock/peers?symbol=" +
    ticker +
    "&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

async function getEarnings(ticker) {
  let url =
    "https://finnhub.io/api/v1/stock/earnings?symbol=" +
    ticker +
    "&token=c7tntuiad3i8dq4u9na0";
  let headers = { "Content-Type": "application/json" };
  let APIres = await fetch(url, { method: "GET", headers: headers });
  let metaDataRes = await APIres.json();
  return metaDataRes;
}

app.get("/description/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getDescription(ticker);
  res.send(origRes);
});

app.get("/historicalData/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getHistoricalData(ticker);
  res.send(origRes);
});

app.get("/historicalDailyData/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getHistoricalDailyData(ticker);
  res.send(origRes);
});

app.get("/latestPrice/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getLatestPrice(ticker);
  res.send(origRes);
});

app.get("/autocomplete/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await autoComplete(ticker);
  res.send(origRes);
});

app.get("/news/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getNews(ticker);
  res.send(origRes);
});

app.get("/recommendationTrends/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getRecommendationTrends(ticker);
  res.send(origRes);
});

app.get("/socialSentiment/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getSocialSentiment(ticker);
  res.send(origRes);
});

app.get("/peers/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getPeers(ticker);
  res.send(origRes);
});

app.get("/earnings/:ticker", async (req, res) => {
  ticker = req.params.ticker;
  let origRes = await getEarnings(ticker);
  res.send(origRes);
});

app.listen(PORT, () => console.log("server is established"));
 