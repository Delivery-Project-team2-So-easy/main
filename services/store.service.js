const StoreRepository = require('../repositories/store.repository');
const UserRepository = require('../repositories/user.repository');

class StoreService {
  storeRepository = new StoreRepository();
  userRepository = new UserRepository();

  registerStore = async (
    //userId,
    storeName,
    storeAddress,
    openingDate,
    storeImg,
    companyRegistrationNumber
  ) => {
    const exStore = await this.storeRepository.findStore(storeName);
    // 응답코드
    if (exStore) {
      return { code: 403, message: '이미 존재하는 매장 이름입니다.' };
    }

    await this.storeRepository.registerStore(
      //userId,
      storeName,
      storeAddress,
      openingDate,
      storeImg,
      companyRegistrationNumber
    );
    return { code: 201, message: `${storeName} 매장이 정상적으로 등록되었습니다.` };
  };

  //auth 추가 후 파라미터에 userId 추가
  updateStore = async (
    //userId,
    storeName,
    storeAddress,
    storeImg
  ) => {
    const store = await this.storeRepository.findMyStore(userId);
    // const user = await this.storeRepository.findUser(userId);
    // 유저 검색, 추후 해당 기능 완성 후 수정 필요
    if (!store) return { code: 404, message: '존재하지 않는 매장입니다.' };
    // if (storeId !== user.store_id) return { code: 403, message: '해당 매장 관리자가 아닙니다.' };

    await this.storeRepository.updateStore(userId, storeName, storeAddress, storeImg);

    return { code: 201, message: `${storeName} 매장의 정보가 정상적으로 수정되었습니다.` };
  };

  deleteStore = async (userId) => {
    // 유저 검색, 추후 해당 기능 완성 후 수정 필요
    // const user = await this.userRepository.findUser(userId);
    const store = await this.storeRepository.findMyStore(userId);
    // const user = await this.storeRepository.findUser(userId);
    console.log('store:', store);
    if (!store) return { code: 404, message: '존재하지 않는 매장입니다' };
    //auth 추가시 수정
    // if (user.store_id !== storeId) return { code: 403, message: '해당 매장 관리자가 아닙니다.' };

    await this.storeRepository.deleteStore(userId);
    //응답코드
    return { code: 204, message: `${store.storeName} 매장이 정상적으로 삭제되었습니다.` };
  };

  registerMenu = async (userId, menu, price, menuImg, option, category) => {
    const store = await this.storeRepository.findMyStore(userId);
    const storeId = store.store_id;
    const exMenu = await this.storeRepository.findMenu(storeId, menu);
    if (exMenu) return { code: 403, message: '이미 등록된 메뉴입니다.' };

    const Menu = await this.storeRepository.registerMenu(
      storeId,
      menu,
      price,
      menuImg,
      option,
      category
    );
    console.log('등록메뉴', Menu);
    return { code: 201, message: `${Menu.menu} 메뉴가 등록되었습니다.` };
  };

  updateMenu = async (
    //userId,
    menuId,
    menu,
    price,
    menuImg,
    option,
    category
  ) => {
    const store = await this.storeRepository.findMyStore(userId);
    const storeId = store.store_id;
    const exMenu = await this.storeRepository.findMenu(storeId, menu);
    if (!exMenu) return { code: 404, message: '존재하지 않는 메뉴입니다.' };
    await this.storeRepository.updateMenu(storeId, menuId, menu, price, menuImg, option, category);
    return { code: 201, message: `메뉴가 수정되었습니다.` };
  };

  deleteMenu = async (userId, menuId) => {
    const store = await this.storeRepository.findMyStore(userId);
    const storeId = store.store_id;
    const exMenu = await this.storeRepository.findMenu(storeId, menuId);
    if (!exMenu) return { code: 404, message: '존재하지 않는 메뉴입니다.' };

    await this.storeRepository.deleteMenu(storeId, menuId);
    return { code: 200, message: '메뉴가 삭제되었습니다.' };
  };

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

  // search = async (searchKeyword) => {
  //   try {
  //     const allStoreData = await this.storeRepository.searchStore(searchKeyword);
  //     const allMenuData = await this.storeRepository.searchMenu(searchKeyword);

  //     const allSearchData = [...allStoreData, ...allMenuData];
  //     //중복제거 코드!!
  //     const filteredSearchData = arr.reduce((acc, current) => {
  //       const x = acc.find((item) => item.id === current.id);
  //       if (!x) {
  //         return acc.concat([current]);
  //       } else {
  //         return acc;
  //       }
  //     }, []);

  //     return { code: 200, data: a };
  //   } catch (err) {
  //     console.log(err);
  //     return { code: 500, data: '오류' };
  //   }
  // };
}

module.exports = StoreService;
