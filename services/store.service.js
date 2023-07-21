const StoreRepository = require('../repositories/store.repository');
const UserRepository = require('../repositories/user.repository');
const OrderRepository = require('../repositories/order.repository');
const errorHandler = require('../errorHandler');

class StoreService {
  storeRepository = new StoreRepository();
  userRepository = new UserRepository();
  orderRepository = new OrderRepository();

  registerStore = async (userId, storeName, storeAddress, openingDate, storeImg) => {
    try {
      const exStore = await this.storeRepository.findStore(storeName);
      if (exStore) throw errorHandler.existStore;

      const myStore = await this.storeRepository.findMyStore(userId);
      if (myStore) throw errorHandler.addStoreForbidden;

      await this.storeRepository.registerStore(
        userId,
        storeName,
        storeAddress,
        openingDate,
        storeImg
      );
      return { code: 201, message: `${storeName} 매장이 정상적으로 등록되었습니다.` };
    } catch (err) {
      throw err;
    }
  };

  updateStore = async (userId, storeName, storeAddress, storeImg) => {
    try {
      if (!storeImg && !storeName && !storeAddress) throw errorHandler.emptyContent;
      const store = await this.storeRepository.findMyStore(userId);
      const user = await this.userRepository.findUser(userId);
      // 유저 검색, 추후 해당 기능 완성 후 수정 필요
      if (!store) throw errorHandler.noStore;
      if (store.user_id !== userId) throw errorHandler.noPermissions;

      const updateName = storeName ? storeName : store.store_name;
      const updateImg = storeImg ? storeImg : store.store_img;

      await this.storeRepository.updateStore(userId, updateName, storeAddress, updateImg);

      return { code: 201, message: `${updateName} 매장의 정보가 정상적으로 수정되었습니다.` };
    } catch (err) {
      throw err;
    }
  };

  deleteStore = async (userId) => {
    try {
      // const user = await this.userRepository.findUser(userId);
      const store = await this.storeRepository.findMyStore(userId);
      if (!store) throw errorHandler.noStore;
      const storeName = store.store_name;
      await this.storeRepository.deleteStore(userId);
      return { code: 200, message: `${storeName} 매장이 정상적으로 삭제되었습니다.` };
    } catch (err) {
      throw err;
    }
  };

  registerMenu = async (userId, menu, price, menuImg, option, category) => {
    try {
      const store = await this.storeRepository.findMyStore(userId);
      if (!store) throw errorHandler.noStore;
      const storeId = store.id;
      const exMenu = await this.storeRepository.findMenu(storeId, menu);
      if (exMenu) throw errorHandler.duplicateMenu;

      const Menu = await this.storeRepository.registerMenu(
        storeId,
        menu,
        price,
        menuImg,
        option,
        category
      );
      return { code: 201, message: `${Menu.menu} 메뉴가 등록되었습니다.` };
    } catch (err) {
      throw err;
    }
  };

  updateMenu = async (userId, menuId, menu, price, menuImg, option, category) => {
    try {
      const store = await this.storeRepository.findMyStore(userId);
      if (!store) throw errorHandler.noStore;
      const storeId = store.id;
      const exMenu = await this.storeRepository.findMenuById(storeId, menu);
      if (!exMenu) throw errorHandler.nonExistMenu;

      if (menu === exMenu.menu) throw errorHandler.duplicateMenu;
      const updateImg = menuImg ? menuImg : store.store_img;
      const updateOption = option ? option : exMenu.option;
      await this.storeRepository.updateMenu(menuId, menu, price, updateImg, updateOption, category);

      return { code: 201, message: `메뉴가 수정되었습니다.` };
    } catch (err) {
      throw err;
    }
  };

  deleteMenu = async (userId, menuId) => {
    try {
      const store = await this.storeRepository.findMyStore(userId);
      if (!store) throw errorHandler.noStore;
      const storeId = store.id;
      const exMenu = await this.storeRepository.findMenuById(storeId, menuId);
      if (!exMenu) throw errorHandler.nonExistMenu;

      await this.storeRepository.deleteMenu(storeId, menuId);
      return { code: 200, message: '메뉴가 삭제되었습니다.' };
    } catch (err) {
      throw err;
    }
  };

  getStore = async () => {
    try {
      const allStoreData = await this.storeRepository.getStore();

      return { code: 200, data: allStoreData };
    } catch (err) {
      throw err;
    }
  };

  getStoreDetail = async (storeId) => {
    try {
      const oneStoreData = await this.storeRepository.getStoreDetail(storeId);

      if (!oneStoreData) throw errorHandler.nonExistStore;

      return { code: 200, data: oneStoreData };
    } catch (err) {
      throw err;
    }
  };

  getAllMenuInfo = async (storeId) => {
    try {
      const findStoreById = await this.storeRepository.findStoreById(storeId);

      if (!findStoreById) throw errorHandler.nonExistStore;

      const getMenuInfo = await this.storeRepository.getAllMenuInfo(storeId);

      return getMenuInfo;
    } catch (err) {
      throw err;
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
      throw err;
    }
  };

  getStoreRanking = async (daysAgo) => {
    try {
      const stores = await this.storeRepository.getStore();

      const ranking = await Promise.all(
        stores.map(async (store) => {
          const storeId = store.id;
          const orderCount = await this.orderRepository.countTotalOrders(storeId, daysAgo);

          return {
            storeId,
            storeName: store.store_name,
            storeImg: store.store_img,
            storeAddress: store.store_address,
            orderCount,
          };
        })
      );

      // const filteredRanking = ranking.filter((store) => store.orderCount > 0)
      ranking.sort((a, b) => b.orderCount - a.orderCount);

      return ranking;
    } catch (err) {
      throw err;
    }
  };

  getReorderRanking = async () => {
    try {
      const stores = await this.storeRepository.getStore();

      const ranking = await Promise.all(
        stores.map(async (store) => {
          const storeId = store.id;
          const { reorderCount, averageRate } = await this.orderRepository.countTotalReorders(
            storeId
          );

          return {
            storeId,
            storeName: store.store_name,
            storeImg: store.store_img,
            storeAddress: store.store_address,
            reorderCount,
            averageRate,
          };
        })
      );

      ranking.sort((a, b) => b.reorderCount - a.reorderCount);

      return ranking;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = StoreService;
