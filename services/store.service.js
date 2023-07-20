const StoreRepository = require('../repositories/store.repository');
const UserRepository = require('../repositories/user.repository');

class StoreService {
  storeRepository = new StoreRepository();
  userRepository = new UserRepository();

  registerStore = async (userId, storeName, storeAddress, openingDate, storeImg) => {
    try {
      const exStore = await this.storeRepository.findStore(storeName);
      if (exStore) {
        return { code: 403, errorMessage: '이미 존재하는 매장 이름입니다.' };
      }
      const myStore = await this.storeRepository.findMyStore(userId);
      if (myStore) {
        return { code: 403, errorMessage: '매장을 추가로 등록할 수 없습니다.' };
      }

      const user = await this.userRepository.findUser(userId);
      if (!user.is_seller) return { code: 403, errorMessage: '사업자 등록 후 이용해 주세요.' };
      await this.storeRepository.registerStore(
        userId,
        storeName,
        storeAddress,
        openingDate,
        storeImg
      );
      return { code: 201, message: `${storeName} 매장이 정상적으로 등록되었습니다.` };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '매장 등록에 실패했습니다.' };
    }
  };

  updateStore = async (userId, storeName, storeAddress, storeImg) => {
    const store = await this.storeRepository.findMyStore(userId);
    const user = await this.userRepository.findUser(userId);
    // 유저 검색, 추후 해당 기능 완성 후 수정 필요
    if (!store) return { code: 404, errorMessage: '보유한 매장이 없습니다.' };
    if (store.user_id !== userId)
      return { code: 403, errorMessage: '해당 매장 관리자가 아닙니다.' };

    await this.storeRepository.updateStore(userId, storeName, storeAddress, storeImg);

    return { code: 201, message: `${storeName} 매장의 정보가 정상적으로 수정되었습니다.` };
  };

  deleteStore = async (userId) => {
    // const user = await this.userRepository.findUser(userId);
    const store = await this.storeRepository.findMyStore(userId);
    if (!store) return { code: 404, errorMessage: '보유한 매장이 없습니다.' };
    const storeName = store.store_name;
    await this.storeRepository.deleteStore(userId);
    return { code: 200, message: `${storeName} 매장이 정상적으로 삭제되었습니다.` };
  };

  registerMenu = async (userId, menu, price, menuImg, option, category) => {
    try {
      const store = await this.storeRepository.findMyStore(userId);
      if (!store) return { code: 404, errorMessage: '보유한 매장이 없습니다.' };
      const storeId = store.id;
      const exMenu = await this.storeRepository.findMenu(storeId, menu);
      if (exMenu) return { code: 403, errorMessage: '이미 등록된 메뉴입니다.' };

      const Menu = await this.storeRepository.registerMenu(
        storeId,
        menu,
        price,
        menuImg,
        option,
        category
      );
      return { code: 201, message: `${Menu.menu} 메뉴가 등록되었습니다.` };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '메뉴 등록에 실패했습니다.' };
    }
  };

  updateMenu = async (userId, menuId, menu, price, menuImg, option, category) => {
    const store = await this.storeRepository.findMyStore(userId);
    if (!store)
      return { code: 404, errorMessage: '매장을 보유중인 사장님만 메뉴를 등록할 수 있습니다.' };
    const storeId = store.id;
    const exMenu = await this.storeRepository.findMenuById(storeId, menuId);
    if (!exMenu) return { code: 404, errorMessage: '존재하지 않는 메뉴입니다.' };
    if (menu === exMenu.menu) return { code: 404, errorMessage: '이미 등록된 메뉴입니다.' };
    await this.storeRepository.updateMenu(menuId, menu, price, menuImg, option, category);
    return { code: 201, message: `메뉴가 수정되었습니다.` };
  };

  deleteMenu = async (userId, menuId) => {
    const store = await this.storeRepository.findMyStore(userId);
    if (!store) return { code: 404, errorMessage: '보유한 매장이 없습니다.' };
    const storeId = store.id;
    const exMenu = await this.storeRepository.findMenu(storeId, menuId);
    if (!exMenu) return { code: 404, errorMessage: '존재하지 않는 메뉴입니다.' };

    await this.storeRepository.deleteMenu(storeId, menuId);
    return { code: 200, message: '메뉴가 삭제되었습니다.' };
  };

  getStore = async () => {
    try {
      const allStoreData = await this.storeRepository.getStore();

      return { code: 200, data: allStoreData };
    } catch (err) {
      console.log(err);
      return { code: 500, errorMessage: '매장 전체 조회에 실패했습니다.' };
    }
  };

  getStoreDetail = async (storeId) => {
    try {
      const oneStoreData = await this.storeRepository.getStoreDetail(storeId);

      if (!oneStoreData) return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };

      return { code: 200, data: oneStoreData };
    } catch (err) {
      console.log(err);
      return { code: 500, errorMessage: '매장 상세 조회에 실패했습니다.' };
    }
  };

  getAllMenuInfo = async (storeId) => {
    try {
      const findStoreById = await this.storeRepository.findStoreById(storeId);

      if (!findStoreById) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      }

      const getMenuInfo = await this.storeRepository.getAllMenuInfo(storeId);

      return getMenuInfo;
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '메뉴 조회에 실패하였습니다.' };
    }
  };

  search = async (searchKeyword) => {
    try {
      const allStoreData = await this.storeRepository.searchStore(searchKeyword);
      // 검색어를 Store 테이블의 가게명과 매치
      const allMenuData = await this.storeRepository.searchMenu(searchKeyword);
      // 검색어를 Menu 테이블의 메뉴명 or 카테고리 와 매치

      // for (var i = 0; i < allMenuData.length; i++) {
      //   if (allMenuData[i].store_id === allMenuData[i + 1].store_id) {
      //     allMenuData.splice(i, 1);
      //   }
      // }
      // 메뉴의 가게이름 중복 제거

      return { code: 200, data: { allStoreData, allMenuData } };
    } catch (err) {
      console.log(err);
      return { code: 500, errorMessage: '오류' };
    }
  };

  getStoreRanking = async (daysAgo) => {
    try {
      const getStoreRanking = await this.storeRepository.getStoreRanking(daysAgo);

      return getStoreRanking;
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '랭킹 출력에 실패하였습니다.' };
    }
  };
}

module.exports = StoreService;
