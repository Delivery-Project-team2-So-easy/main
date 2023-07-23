// const params = new URLSearchParams(window.location.search);
// const storeId = params.get('storeId');
//매장정보 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  storeId = 1; // 추후 삭제 필요. URLSearchParams로 storeId 받을것
  fetch(`/store/${storeId}`)
    .then((response) => response.json())
    .then((data) => {
      const store_name = data.data.store_name;
      const store_img = data.data.store_img;
      const store_likes = data.data.likes;
      const temp_html = `<img class="store-img" src="${store_img}"
      />
      <div class="store-name">${store_name}</div>
      <div class="info"><i class="fa fa-heart" aria-hidden="true"></i> ${store_likes}</div>
      <i id="heart" class="mylike fa fa-heart-o fa-2x" aria-hidden="true"></i> `;
      const store_overview = document.querySelector('.store-overview');
      store_overview.insertAdjacentHTML('beforeend', temp_html);
    });
});

window.addEventListener('DOMContentLoaded', async () => {
  storeId = 1;
  fetch(`/user/store/${storeId}/isliked`)
    .then((res) => res.json())
    .then((data) => {
      const heart = document.querySelector('#heart');
      if (data.result) {
        heart.classList.remove('fa-heart-o');
        heart.classList.add('fa-heart');
      }
      heart.addEventListener('click', function () {
        fetch(`/user/store/${storeId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            body: JSON.stringify({}),
          },
        }).then((res) => res.json());
        if (this.classList.contains('fa-heart-o')) {
          heart.classList.remove('fa-heart-o');
          heart.classList.add('fa-heart');
        } else {
          heart.classList.add('fa-heart-o');
          heart.classList.remove('fa-heart');
        }
        window.location.reload();
      });
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
            <div class="menu-price">${menu_price} 원</div>
          </div>
        </div>
        `;
        menu_list.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});
