const cron = require('node-cron');
const { getLink, getProducts } = require('./crawl');

function startCronJob() {
  async function doCronJob() {
    console.log('Running the crawl job...');
    await getLink();
    await getProducts();
    console.log('Additional action after crawling...');
  }
  // 초기 DB 세팅용

  // 주기적 DB 세팅
  // 분 시 일 월 요일
  cron.schedule('0 12 * * *', doCronJob);
}
module.exports = { startCronJob };
