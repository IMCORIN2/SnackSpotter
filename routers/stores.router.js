const express = require('express');
const router = express.Router();
const { Stores } = require('../models');

// 가게 목록을 반환하는 라우트 
router.get('/', async (req, res) => {
  try {
    const stores = await Stores.findAll();
    res.json({ stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 가게 정보를 반환하는 라우트
router.get('/:id', async (req, res) => {
  const storeId = req.params.id;
  try {
    const store = await Stores.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: '가게를 찾을 수 없습니다.' });
    }
    res.json({ store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 새로운 가게 추가하는 라우트
router.post('/', async (req, res) => {
  const { name } = req.body;
  
    try{
    const newStore = (await Stores.create({ name })).toJSON();
    res.status(201).json({ store: newStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 가게 정보를 업데이트하는 라우트
router.put('/:id', async (req, res) => {
  const storeId = req.params.id;
  const { name } = req.body;

    const store = await Stores.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: '가게를 찾을 수 없습니다.' });
    }

    const updatedStore = await store.update({ name });

    if (updatedStore) {
      res.json({ store: updatedStore });
    } else {
      res.status(500).json({ message: '가게 업데이트에 실패했습니다.' });
    }
});


// 특정 가게 정보를 삭제하는 라우트 
router.delete('/:id', async (req, res) => {
  const storeId = req.params.id;
  try {
    const store = await Stores.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: '가게를 찾을 수 없습니다.' });
    }
    await store.destroy();
    res.json({ message: '가게가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
