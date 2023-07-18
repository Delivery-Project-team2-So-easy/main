const StoreService = require('../services/store.service');

class StoreController {
  storeService = new StoreService();

  getStore = async (req, res) => {
    const { code, data } = await this.storeService.getStore();

    res.status(code).json({ data });
  };
  getStoreDetail = async (req, res) => {
    const { storeId } = req.params;
    const { code, data } = await this.storeService.getStoreDetail(storeId);

    res.status(code).json({ data });
  };

  // search = async (req, res) => {
  //   const { searchKeyword } = req.body;
  //   const { code, data } = await this.storeService.search(searchKeyword);

  //   res.status(code).json({ data });
  // };
}

module.exports = StoreController;
