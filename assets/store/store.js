//매장정보 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  storeId = 1; // 추후 삭제 필요. URLSearchParams로 storeId 받을것
  fetch(`/store/${storeId}`, {})
    .then((response) => response.json())
    .then((data) => {
      const store_name = data.data.store_name;
      const store_img = data.data.store_img;
      const store_likes = data.data.likes;
      const temp_html = `<img class="store-img" src="${store_img}"
      />
      <div class="store-name">${store_name}</div>
      <div class="info">좋아요: ${store_likes}</div>
      <div class="like">좋아요</div>`;
      const store_overview = document.querySelector('.store-overview');
      store_overview.insertAdjacentHTML('beforeend', temp_html);
    });
});

//메뉴 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  storeId = 1; // 추후 삭제 필요
  fetch(`/store/${storeId}/menus`, {})
    .then((response) => response.json())
    .then((data) => {
      const menu_list = document.querySelector('.menu-list');
      const menus = data.menus;
      menus.forEach((menu) => {
        let menu_id = menu.id;
        let menu_name = menu.menu;
        let menu_img = menu.menu_img;
        let menu_price = menu.price;
        let temp_html = `
        <div class="menu-box">
          <img
            src="${menu_img}"
          />
          <div class="menu-details">
            <div class="menu-name">${menu_name}</div>
            <div class="menu-price">${menu_price}</div>
          </div>
        </div>
        `;
        menu_list.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});
