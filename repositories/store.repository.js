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
    if (storeImg)
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
    else
      return await Store.update(
        {
          store_name: storeName,
          store_address: storeAddress,
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

  findMenu = async (storeId, menuId) => {
    return await Menu.findOne({ where: { [Op.and]: [{ id: menuId }, { store_id: storeId }] } });
  };

  findMenuById = async (storeId, menuId) => {
    return await Menu.findOne({ where: { [Op.and]: [{ id: menuId }, { store_id: storeId }] } });
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

  increaseInSales = async (userId, price) => {
    await Store.update({ total_sales: price }, { where: { user_id: userId } });
  };

  calculateTotalOrders = async (storeId, daysAgo) => {
    /* 랭킹 기준
    1. 주문수가 많은 순서로 랭킹을 집계
    2. 기간(일별 주문수, 주간 주문수)을 설정하여 2가지의 랭킹을 계산
    3. 전체 주문건수를 계산 후에 취소된 주문을 차감하여 랭킹에 반영
    */
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - daysAgo);

    const orderCount = await Order.count({
      where: {
        store_id: storeId,
        create_at: {
          [Op.between]: [startDate, currentDate],
        },
      },
    });

    return orderCount;
  };

  getStoreRanking = async (daysAgo) => {
    const stores = await this.getStore();

    const ranking = await Promise.all(
      stores.map(async (store) => {
        const storeId = store.id;
        const orderCount = await this.calculateTotalOrders(storeId, daysAgo);

        return {
          storeId,
          storeName: store.store_name,
          storeImg: store.store_img,
          storeAddress: store.store_address,
          orderCount,
        };
      })
    );
    ranking.sort((a, b) => b.orderCount - a.orderCount);
    return ranking;
  };
}

module.exports = StoreRepository;
