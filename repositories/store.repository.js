const { Store, Menu } = require('../models');
const { Op } = require('sequelize');

class StoreRepository {
  getStore = async () => {
    const allStoreData = await Store.findAll({});

    return allStoreData;
  };

  getStoreDetail = async (storeId) => {
    const oneStoreData = await Store.findOne({ where: { id: storeId } });

    return oneStoreData;
  };

  searchStore = async (searchKeyword) => {
    const searchStore = await Store.findAll({
      where: { store_name: { [Op.substring]: searchKeyword } },
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
    });
    return searchMenu;
  };
}

module.exports = StoreRepository;
