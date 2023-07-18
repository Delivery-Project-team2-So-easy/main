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

  registerStore = async (req, res) => {
    // auth미들웨어 완성시 수정 필요
    // const {userId} = res.locals.user;
    const { storeName, storeAddress, openingDate, storeImg, companyRegistrationNumber } = req.body;
    if (!storeName || !storeAddress || !openingDate || !companyRegistrationNumber)
      return res.status(400).json({ message: '매장 정보를 모두 입력해주세요.' });
    const { code, message } = await this.storeService.registerStore(
      // userId,
      storeName,
      storeAddress,
      openingDate,
      storeImg,
      companyRegistrationNumber
    );
    res.status(code).json({ message });
  };

  updateStore = async (req, res) => {
    // api명세 openingDate 삭제 필요
    // auth미들웨어 완성시 수정 필요
    // const userId = res.locals.users.id;
    const { storeName, storeAddress, storeImg } = req.body;
    const { code, message } = await this.storeService.updateStore(
      //userId,
      storeName,
      storeAddress,
      storeImg
    );

    res.status(code).json({ message });
  };

  deleteStore = async (req, res) => {
    // auth미들웨어 완성시 수정 필요
    // const userId = res.locals.users.id;
    const userId = 1;
    //auth 추가 시  deleteStore 파라미터에 userId 추가
    const { code, message } = await this.storeService.deleteStore(userId);

    res.status(code).json({ message });
  };

  registerMenu = async (req, res) => {
    const { userId } = res.locals.users;
    const { menu, price, menuImg, option, category } = req.body;
    if (!menu || !price || !option || !category)
      return res.status(400).json({ message: '메뉴 정보를 모두 입력해주세요' });
    const { code, message } = await this.storeService.registerMenu(
      storeId,
      menu,
      price,
      menuImg,
      option,
      category
    );
    res.status(code).json({ message });
  };

  updateMenu = async (req, res) => {
    // auth미들웨어 완성시 수정 필요
    // const { userId } = res.locals.users;
    const { menuId } = req.params;
    const { menu, price, menuImg, option, category } = req.body;
    const { code, message } = await this.storeService.updateMenu(
      //userId,
      menuId,
      menu,
      price,
      menuImg,
      option,
      category
    );
    res.status(code).json({ message });
  };

  deleteMenu = async (req, res) => {
    // auth미들웨어 완성시 수정 필요
    // const { userId} = res.locals.user;
    const { menuId } = req.params;
    const { code, message } = await this.storeService.deleteMenu(
      //userId,
      menuId
    );

    res.status(code).json({ message });
  };
}
module.exports = StoreController;
