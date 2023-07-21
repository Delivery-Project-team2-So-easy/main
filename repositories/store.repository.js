const { Store, Menu, Store_like, Order } = require('../models');
const { Op, Sequelize } = require('sequelize');

class StoreRepository {
  findStore = async (storeName) => {
    return await Store.findOne({ where: { store_name: storeName } });
  };

  findStoreById = async (storeId) => {
    return await Store.findOne({ where: { id: storeId } });
  };

  findMyStore = async (userId) => {
    return await Store.findOne({ where: { user_id: userId } });
  };

  findByStoreId = async (storeId) => {
    return await Store.findOne({ where: { id: storeId } });
  };

  registerStore = async (userId, storeName, storeAddress, openingDate, storeImg) => {
    return await Store.create({
      user_id: userId,
      store_name: storeName,
      store_address: storeAddress,
      store_img: storeImg,
      opening_date: openingDate,
    });
  };

  updateStore = async (userId, storeName, storeAddress, storeImg) => {
    return await Store.update(
      {
        store_name: storeName,
        store_address: storeAddress,
        store_img: storeImg,
      },
      {
        where: { user_id: userId },
      }
    );
  };

  deleteStore = async (userId) => {
    await Store.destroy({ where: { user_id: userId } });
    return;
  };

  findMenu = async (storeId, menu) => {
    return await Menu.findOne({ where: { [Op.and]: [{ menu: menu }, { store_id: storeId }] } });
  };

  findMenuById = async (storeId, menuId, t) => {
    return await Menu.findOne({
      where: { [Op.and]: [{ id: menuId }, { store_id: storeId }] },
      transaction: t,
    });
  };

  registerMenu = async (storeId, menu, price, menuImg, option, category) => {
    return await Menu.create({
      store_id: storeId,
      menu,
      price,
      menu_img: menuImg,
      option,
      category,
    });
  };

  updateMenu = async (menuId, menu, price, menuImg, option, category) => {
    await Menu.update(
      {
        menu,
        price,
        menu_img: menuImg,
        option,
        category,
      },
      { where: { id: menuId } }
    );
    return;
  };

  deleteMenu = async (storeId, menuId) => {
    await Menu.destroy({ where: { [Op.and]: [{ id: menuId }, { store_id: storeId }] } });
  };

  getStore = async () => {
    const allStoreData = await Store.findAll({
      attributes: [
        'id',
        'store_name',
        'store_img',
        'store_address',
        'opening_date',
        [
          Sequelize.literal(
            `(SELECT COUNT (*) FROM store_likes WHERE store_likes.store_id = Store.id)`
          ),
          'likes',
        ],
      ],
      include: [
        {
          model: Store_like,
          attributes: [],
        },
      ],
      order: [[Sequelize.literal('likes'), 'DESC']],
    });

    return allStoreData;
  };

  getStoreDetail = async (storeId) => {
    const oneStoreData = await Store.findOne({
      where: { id: storeId },
      attributes: [
        'id',
        'user_id',
        'store_name',
        'store_img',
        'store_address',
        'opening_date',
        [
          Sequelize.literal(
            `(SELECT COUNT (*) FROM store_likes WHERE store_likes.store_id = Store.id)`
          ),
          'likes',
        ],
      ],
      include: [
        {
          model: Store_like,
          attributes: [],
        },
      ],
    });

    return oneStoreData;
  };

  searchStore = async (searchKeyword) => {
    const searchStore = await Store.findAll({
      where: { store_name: { [Op.substring]: searchKeyword } },
      attributes: [
        'id',
        'store_name',
        'store_img',
        'store_address',
        'opening_date',
        [
          Sequelize.literal(
            `(SELECT COUNT (*) FROM store_likes WHERE store_likes.store_id = Store.id)`
          ),
          'likes',
        ],
      ],
      include: [
        {
          model: Store_like,
          attributes: [],
        },
      ],
      order: [[Sequelize.literal('likes'), 'DESC']],
    });
    return searchStore;
  };

  searchMenu = async (searchKeyword) => {
    const searchMenu = await Menu.findAll({
      where: {
        [Op.or]: [
          { menu: { [Op.substring]: searchKeyword } },
          { category: { [Op.substring]: searchKeyword } },
        ],
      },
      attributes: ['store_id', 'id', 'category', 'menu', 'menu_img', 'price', 'option'],
    });
    return searchMenu;
  };

  getStoreInfo = async (userId, storeId) => {
    if (!userId) {
      const storeInfo = await Store.findOne({
        where: { id: storeId },
        attributes: ['id', 'store_name', 'total_sales'],
      });
      return storeInfo;
    } else {
      const storeInfo = await Store.findOne({ where: { user_id: userId } });
      return storeInfo;
    }
  };

  getAllMenuInfo = async (storeId) => {
    const getMenuInfo = await Menu.findAll({
      where: { store_id: storeId },
      attributes: ['id', 'category', 'menu', 'menu_img', 'price', 'option'],
    });
    return getMenuInfo;
  };

  getMenuInfo = async (storeId, menuId) => {
    const menuInfo = await Menu.findOne({ where: { id: menuId, store_id: storeId } });
    return menuInfo;
  };

  updateStoreInSales = async (userId, price, t) => {
    await Store.update({ total_sales: price }, { where: { user_id: userId }, transaction: t });
  };
}

module.exports = StoreRepository;
