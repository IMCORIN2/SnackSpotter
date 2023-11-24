const express = require('express');
const { Products } = require('../models');
const router = express.Router();
const path = require('path');

router.get('/products', async (req, res) => {
  try {
    const products = await Products.findAll();
    res.json({ products });
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
<<<<<<< HEAD
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
  } catch (error) {
    console.error('에러', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다.' });
  }
  await browser.close();
});

router.get(`/:productId`, async (req, res) => {
  try {
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
  } catch (error) {
    console.error('에러', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다.' });
  }
  await browser.close();
=======
    const products = await Products.findAll({
      attributes: ['id', 'name', 'description', 'image', 'price', 'category'],
    });

    res.status(200).json({
      success: true,
      message: '상품 목록 조회했습니다',
      data: products,
    });
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Products.findOne({
      where: { id: productId },
    });

    if (!product) {
      res
        .status(404)
        .json({ success: false, message: '상품 조회에 실패하였습니다' });
    }

    res.status(200).json({
      success: true,
      message: '상품 조회 성공했습니다',
      data: product,
    });
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
  }
>>>>>>> 79f42a225a836eb8a3da74bdbbb2430fb408d3fa
});

router.get('/html', async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: ['id', 'name', 'description', 'image', 'price', 'category'],
    });

    const html = products
      .map(
        (product) => `<div>
          <img src="${product.image}" alt="${product.name}">
          <p>${product.name}</p>
          <p>${product.description}</p>
          <p>${product.price}</p>
        </div>`
      )
      .join('');

    res.send(html);
  } catch (error) {
    console.error('에러 ---', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다' });
  }
});

module.exports = router;