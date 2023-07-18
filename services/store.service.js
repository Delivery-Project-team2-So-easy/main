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
