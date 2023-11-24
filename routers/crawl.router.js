const puppeteer = require('puppeteer');
const { Products } = require('../models');

let links = [];
let categories = [];

async function getLink() {
  try {
    await Products.destroy({ where: {} });
    links = [];
    categories = [];

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // 웹 사이트에게 브라우저처럼 보이기 위한 User-Agent 설정
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    );

    // 웹 페이지 열기
    for (let i = 1; i <= 6; i++) {
      await page.goto(
        `https://cu.bgfretail.com/product/product.do?category=product&depth2=4&depth3=${i}`,
      );

      await page.reload();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // prod_list 클래스를 가진 모든 요소 선택
      const prodListElements = await page.$$('.prod_list');

      for (prodListElement of prodListElements) {
        const link = await prodListElement.$eval('div.prod_img', (element) =>
          element.getAttribute('onclick').replace(/[^0-9]/g, ''),
        );

        const category = {
          1: '간편식사',
          2: '즉석요리',
          3: '과자',
          4: '아이스크림',
          5: '식품',
          6: '음료',
        };

        links.push(link);
        categories.push(category[i]);
      }
    }

    await browser.close();
  } catch (error) {
    console.error('에러 ---', error);
  }
}

async function getProducts() {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // 웹 사이트에게 브라우저처럼 보이기 위한 User-Agent 설정
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    );
    for (let i = 1; i <= links.length; i++) {
      await page.goto(
        `https://cu.bgfretail.com/product/view.do?category=product&gdIdx=${
          links[i - 1]
        }`,
      );

      // prod_list 클래스를 가진 모든 요소 선택
      const imageElement = await page.$('.prodDetail-w img');
      const imageSrc = await page.evaluate(
        (element) => element.src,
        imageElement,
      );
      const image = imageSrc.split('/').pop();
      const category = categories[index];

      const name = await page.$eval('.tit', (name) => name.textContent.trim());
      const price = await page.$eval('.prodPrice p span', (price) =>
        price.textContent.trim(),
      );
      const description = await page.$eval('.prodExplain li', (description) =>
        description.textContent.replace(/\s+/g, ' ').trim(),
      );

      await Products.create({
        id: i,
        image,
        name,
        price,
        description,
        category: categories[i - 1],
      });
    }
    await browser.close();
  } catch (error) {
    console.error('에러 ---', error);
  }
}

module.exports = { getLink, getProducts };
