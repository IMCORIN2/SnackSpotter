const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

const products = [];

router.get('/', async (req, res) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 웹 사이트에게 브라우저처럼 보이기 위한 User-Agent 설정
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  );

  // 웹 페이지 열기
  await page.goto(
    'https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N',
  );

  // 프레임워크 기다리기 (동적으로 데이터가 로드되는 시간을 기다립니다)
  await page.waitForTimeout(1000);

  // prod_list 클래스를 가진 모든 요소 선택
  const prodListElements = await page.$$('.prod_list');

  // 선택된 요소들을 순회하며 img, name, price를 출력
  for (const prodListElement of prodListElements) {
    const img = await prodListElement.$eval(
      'div.prod_img img',
      (img) => img.src,
    );
    const name = await prodListElement.$eval('div.name p', (element) =>
      element.textContent.trim(),
    );
    const price = await prodListElement.$eval('div.price strong', (element) =>
      element.textContent.trim(),
    );
    const click = await prodListElement.$eval('div.prod_img', (element) =>
      element.getAttribute('onclick').replace(/[^0-9]/g, ''),
    );

    products.push({ img, name, price, click });
  }
  res.status(200).json(products);

  await browser.close();
});

router.get(`/:productId`, async (req, res) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 웹 사이트에게 브라우저처럼 보이기 위한 User-Agent 설정
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  );

  const { productId } = req.params;
  // const { img, name, price } = req.body;

  await page.goto(
    `https://cu.bgfretail.com/product/view.do?category=product&gdIdx=${productId}`,
  );
  await page.waitForTimeout(1000);

  // prod_list 클래스를 가진 모든 요소 선택
  const img = await page.$eval('.prodDetail-w img', (element) => element.src);
  const name = await page.$eval('.tit', (element) =>
    element.textContent.trim(),
  );
  const price = await page.$eval('.prodPrice p span', (element) =>
    element.textContent.trim(),
  );
  const detail = await page.$eval('.prodExplain li', (element) =>
    element.textContent.replace(/\s+/g, ' ').trim(),
  );

  const productDetail = {
    img,
    name,
    price,
    detail,
  };
  res.status(200).json({ productDetail });

  await browser.close();
});

module.exports = router;
