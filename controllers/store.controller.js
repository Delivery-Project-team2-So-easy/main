const StoreService = require("../services/store.service");

class StoreController {
  storeService = new StoreService();
}

module.exports = StoreController;
