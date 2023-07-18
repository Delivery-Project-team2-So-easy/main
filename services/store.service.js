const StoreRepository = require('../repositories/store.repository');

class StoreService {
  storeRepository = new StoreRepository();

  getStore = async () => {
    try {
      const allStoreData = await this.storeRepository.getStore();

      return { code: 200, data: allStoreData };
    } catch (err) {
      console.log(err);
      return { code: 500, data: err };
    }
  };

  getStoreDetail = async (storeId) => {
    try {
      const oneStoreData = await this.storeRepository.getStoreDetail(storeId);

      return { code: 200, data: oneStoreData };
    } catch (err) {
      console.log(err);
      return { code: 500, data: err };
    }
  };
}

module.exports = StoreService;
