const { Store } = require('../models');

class StoreRepository {
  getStore = async () => {
    const allStoreData = await Store.findAll({});

    return allStoreData;
  };

  getStoreDetail = async (storeId) => {
    const oneStoreData = await Store.findAll({ where: { id: storeId } });

    return oneStoreData;
  };
}

module.exports = StoreRepository;
