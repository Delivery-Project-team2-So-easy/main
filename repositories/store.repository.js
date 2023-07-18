const { Store, Menu } = require('../models');
const { Op } = require('sequelize');

class StoreRepository {
  findStore = async (storeName) => {
    return await Store.findOne({ where: { store_name: storeName } });
  };

  findStoreById = async (storeId) => {
    return await Store.findOne({ where: { store_id: storeId } });
  };

  findMyStore = async (userId) => {
    return await Store.findOne({ where: { user_id: userId } });
  };

  registerStore = async (
    //userId,
    storeName,
    storeAddress,
    openingDate,
    storeImg,
    companyRegistrationNumber
  ) => {
    return await Store.create({
      //user_id: userId,
      store_name: storeName,
      store_address: storeAddress,
      store_img: storeImg,
      opening_date: openingDate,
      company_registration_number: companyRegistrationNumber,
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

  findMenu = async (storeId, menuId) => {
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

  updateMenu = async (
    //userId,
    menuId,
    menu,
    price,
    menuImg,
    option,
    category
  ) => {
    await Menu.update(
      {
        menu,
        price,
        menu_img: menuImg,
        option,
        category,
      },
      { where: { [Op.and]: [{ id: menuId }, { store_id: storeId }] } }
    );
    return;
  };

  deleteMenu = async (storeId, menuId) => {
    await Menu.destroy({ where: { [Op.and]: [{ id: menuId }, { store_id: storeId }] } });
  };
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
