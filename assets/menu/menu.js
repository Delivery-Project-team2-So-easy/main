// const params = new URLSearchParams(window.location.search);
// const storeId = params.get('storeId');
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
        <div class="menu-box" id="${menu_id}">
          <img
            src="${menu_img}"
          />
          <div class="menu-details">
            <div class="menu-name">${menu_name}</div>
            <div class="menu-price">${menu_price}</div>
            <input type=number min="0" value="0" class="${menu_id}">
          </div>
        </div>
        `;
        menu_list.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});

function order_menu() {
  storeId = 1;
  const orders = [];

  const menuBoxs = document.querySelectorAll('.menu-list .menu-box');
  menuBoxs.forEach((menu) => {
    const menuId = menu.id;
    const quantity = menu.getElementsByTagName('input')[0].value;
    if (quantity > 0) {
      orders.push({ menuId, quantity });
    }
  });
  if (orders.length === 0) {
    return alert('주문할 메뉴가 없습니다!');
  }
  fetch(`/order/store/${storeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orders),
  });
  alert('주문이 완료되었습니다.');
  window.location.reload(); // 추후 주문상세페이지로 이동으로 변경
}
