const StoreRepository = require("../repositories/store.repository");

class StoreService {
  storeRepository = new StoreRepository();
}

module.exports = StoreService;
