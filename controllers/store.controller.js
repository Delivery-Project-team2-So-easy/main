const errorHandler = require('../errorHandler');
const StoreService = require('../services/store.service');
const jwt = require('jsonwebtoken');

class StoreController {
  storeService = new StoreService();

  getStore = async (_, res, next) => {
    try {
      const { code, data } = await this.storeService.getStore();
      //개발테스트용 토큰 발급
      const token = jwt.sign(
        {
          userId: 1,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.cookie('authorization', `Bearer ${token}`);
      return res.status(code).json({ data });
    } catch (err) {
      next(err);
    }
  };
  getStoreDetail = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { code, data } = await this.storeService.getStoreDetail(storeId);

      return res.status(code).json({ data });
    } catch (err) {
      next(err);
    }
  };

  registerStore = async (req, res, next) => {
    try {
      const userId = res.locals.user.id;
      const { storeName, storeAddress, openingDate } = req.body;
      if (!storeName || !storeAddress || !openingDate) throw errorHandler.emptyContent;
      const storeImg = req.file ? req.file.location : null;

      const { code, message } = await this.storeService.registerStore(
        userId,
        storeName,
        storeAddress,
        openingDate,
        storeImg
      );

      return res.status(code).json({ message });
    } catch (err) {
      next(err);
    }
  };

  updateStore = async (req, res, next) => {
    // api명세 openingDate 삭제 필요
    try {
      const userId = res.locals.user.id;
      const storeImg = req.file ? req.file.location : null;
      const { storeName, storeAddress } = req.body;
      console.log(storeName, storeAddress);
      const { code, message } = await this.storeService.updateStore(
        userId,
        storeName,
        storeAddress,
        storeImg
      );

      res.status(code).json({ message });
    } catch (err) {
      next(err);
    }
  };

  deleteStore = async (req, res, next) => {
    try {
      const userId = res.locals.user.id;
      //auth 추가 시  deleteStore 파라미터에 userId 추가
      const { code, message } = await this.storeService.deleteStore(userId);

      res.status(code).json({ message });
    } catch (err) {
      next(err);
    }
  };

  registerMenu = async (req, res, next) => {
    try {
      const { is_seller } = res.locals.user;

      if (is_seller === false) throw errorHandler.noSeller;

      const userId = res.locals.user.id;
      const menuImg = req.file ? req.file.location : null;
      const { menu, price, option, category } = req.body;

      if (!menu || !price || !category) throw errorHandler.emptyContent;

      const { code, message } = await this.storeService.registerMenu(
        userId,
        menu,
        price,
        menuImg,
        option,
        category
      );

      res.status(code).json({ message });
    } catch (err) {
      next(err);
    }
  };

  updateMenu = async (req, res, next) => {
    try {
      const userId = res.locals.user.id;
      const { menuId } = req.params;
      const menuImg = req.file ? req.file.location : null;
      const { menu, price, option, category } = req.body;

      if (!menu && !price && !option && !category && !menuImg) throw errorHandler.emptyContent;

      const { code, message } = await this.storeService.updateMenu(
        userId,
        menuId,
        menu,
        price,
        menuImg,
        option,
        category
      );

      res.status(code).json({ message });
    } catch (err) {
      next(err);
    }
  };

  deleteMenu = async (req, res, next) => {
    try {
      const userId = res.locals.user.id;
      const { menuId } = req.params;
      const { code, message } = await this.storeService.deleteMenu(userId, menuId);

      res.status(code).json({ message });
    } catch (err) {
      next(err);
    }
  };

  getAllMenuInfo = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const getMenuInfo = await this.storeService.getAllMenuInfo(storeId);

      return res.status(200).json({ menus: getMenuInfo });
    } catch (err) {
      next(err);
    }
  };

  search = async (req, res, next) => {
    try {
      const { searchKeyword } = req.body;
      if (!searchKeyword) {
        return res.status(400).json({ message: '검색어를 입력해주세요' });
      }
      const { code, data } = await this.storeService.search(searchKeyword);

      res.status(code).json({ data });
    } catch (err) {
      next(err);
    }
  };

  getStoreRanking = async (req, res, next) => {
    try {
      const { period } = req.body;
      const daysAgo = Math.floor(period);

      if (!daysAgo || daysAgo > 32) throw errorHandler.periodError;

      const getStoreRanking = await this.storeService.getStoreRanking(daysAgo);

      return res.status(200).json({ ranking: getStoreRanking });
    } catch (err) {
      next(err);
    }
  };

  getReorderRanking = async (_, res, next) => {
    try {
      const getReorderRanking = await this.storeService.getReorderRanking();

      return res.status(200).json({ reorderRanking: getReorderRanking });
    } catch (err) {
      next();
    }
  };
}
module.exports = StoreController;
