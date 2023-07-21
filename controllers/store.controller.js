const StoreService = require('../services/store.service');

class StoreController {
  storeService = new StoreService();
  getStore = async (_, res) => {
    const { code, data, errorMessage } = await this.storeService.getStore(res);

    if (errorMessage) return res.status(code).json({ errorMessage });
    return res.status(code).json({ data });
  };
  getStoreDetail = async (req, res) => {
    const { storeId } = req.params;
    const { code, data, errorMessage } = await this.storeService.getStoreDetail(storeId);

    if (errorMessage) return res.status(code).json({ errorMessage });
    return res.status(code).json({ data });
  };

  registerStore = async (req, res) => {
    const userId = res.locals.user.id;
    const { storeName, storeAddress, openingDate } = req.body;
    if (!storeName || !storeAddress || !openingDate)
      return res.status(400).json({ message: '매장 정보를 모두 입력해주세요.' });

    const storeImg = req.file ? req.file.location : null;
    const { code, message, errorMessage } = await this.storeService.registerStore(
      userId,
      storeName,
      storeAddress,
      openingDate,
      storeImg
    );
    if (errorMessage) {
      return res.status(code).json({ errorMessage });
    }
    res.status(code).json({ message });
  };

  updateStore = async (req, res) => {
    // api명세 openingDate 삭제 필요
    const userId = res.locals.user.id;
    const storeImg = req.file ? req.file.location : null;
    const { storeName, storeAddress } = req.body;
    const { code, message, errorMessage } = await this.storeService.updateStore(
      userId,
      storeName,
      storeAddress,
      storeImg
    );
    if (errorMessage) {
      return res.status(code).json({ errorMessage });
    }
    res.status(code).json({ message });
  };

  deleteStore = async (req, res) => {
    const userId = res.locals.user.id;
    //auth 추가 시  deleteStore 파라미터에 userId 추가
    const { code, message, errorMessage } = await this.storeService.deleteStore(userId);
    if (errorMessage) {
      return res.status(code).json({ errorMessage });
    }
    console.log(message); // 터미널에는 message 정상적으로 표시됨
    res.status(code).json({ message }); // json데이터가 반환되지 않음..
  };

  registerMenu = async (req, res) => {
    const { is_seller } = res.locals.user;
    if (is_seller === false)
      return res
        .status(401)
        .json({ errorMessage: '사장으로 로그인한 계정만 이용할 수 있는 기능입니다.' });
    const userId = res.locals.user.id;
    const menuImg = req.file ? req.file.location : null;
    const { menu, price, option, category } = req.body;
    if (!menu || !price || !category)
      return res.status(400).json({ message: '메뉴 정보를 모두 입력해주세요' });
    const { code, message, errorMessage } = await this.storeService.registerMenu(
      userId,
      menu,
      price,
      menuImg,
      option,
      category
    );
    if (errorMessage) {
      return res.status(code).json({ errorMessage });
    }
    res.status(code).json({ message });
  };

  updateMenu = async (req, res) => {
    const userId = res.locals.user.id;
    const { menuId } = req.params;
    const menuImg = req.file ? req.file.location : null;
    const { menu, price, option, category } = req.body;
    if (!menu && !price && !option && !category && !menuImg)
      return res.status(400).json({ errorMessage: '수정하려는 정보가 없습니다.' });
    const { code, message, errorMessage } = await this.storeService.updateMenu(
      userId,
      menuId,
      menu,
      price,
      menuImg,
      option,
      category
    );
    if (errorMessage) {
      return res.status(code).json({ errorMessage });
    }
    res.status(code).json({ message });
  };

  deleteMenu = async (req, res) => {
    const userId = res.locals.user.id;
    const { menuId } = req.params;
    const { code, message, errorMessage } = await this.storeService.deleteMenu(userId, menuId);
    if (errorMessage) {
      return res.status(code).json({ errorMessage });
    }
    res.status(code).json({ message });
  };

  getAllMenuInfo = async (req, res) => {
    const { storeId } = req.params;
    const getMenuInfo = await this.storeService.getAllMenuInfo(storeId);

    if (getMenuInfo.errorMessage) {
      return res.status(getMenuInfo.code).json({ errorMessage: getMenuInfo.errorMessage });
    }
    return res.status(200).json({ menus: getMenuInfo });
  };

  search = async (req, res) => {
    const { searchKeyword } = req.body;
    if (!searchKeyword) {
      return res.status(400).json({ message: '검색어를 입력해주세요' });
    }
    const { code, data, errorMessage } = await this.storeService.search(searchKeyword);
    if (errorMessage) {
      return res.status(code).json({ errorMessage });
    }
    res.status(code).json({ data });
  };

  getStoreRanking = async (req, res) => {
    const { period } = req.body;
    const daysAgo = Math.floor(period);

    if (!daysAgo || daysAgo > 32) {
      return res
        .status(400)
        .json({ errorMessage: '기간은 숫자만 들어올 수 있으며 31일을 초과할 수 없습니다.' });
    }

    const getStoreRanking = await this.storeService.getStoreRanking(daysAgo);

    if (getStoreRanking.errorMessage) {
      return res.status(getStoreRanking.code).json({ errorMessage: getStoreRanking.errorMessage });
    }
    return res.status(200).json({ ranking: getStoreRanking });
  };

  getReorderRanking = async (_, res) => {
    const getReorderRanking = await this.storeService.getReorderRanking();

    if (getReorderRanking.errorMessage) {
      return res
        .status(getReorderRanking.code)
        .json({ errorMessage: getReorderRanking.errorMessage });
    }
    return res.status(200).json({ reorderRanking: getReorderRanking });
  };
}
module.exports = StoreController;
