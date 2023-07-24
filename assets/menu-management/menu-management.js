// const params = new URLSearchParams(window.location.search);
// const storeId = params.get('storeId');

window.addEventListener('DOMContentLoaded', async () => {
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
        let menu_option = menu.option;
        let temp_html = `
        <div class="menu-box" >
          <img
            src="${menu_img}"
          />
          <div class="menu-details">
            <div class="menu-name">${menu_name}</div>
            <label>가격 : </label><input class="menu-price" value=${menu_price}></br>
            <label>옵션 : </label><input class="menu-option" type=text value="${menu_option}"></br>
            <input type="file">
            <button id="${menu_id}">수정</button>
            <button>삭제</button>
          </div>
        </div>
        `;
        menu_list.insertAdjacentHTML('beforeend', temp_html);
        document.getElementById(menu_id).addEventListener('click', function (event) {
          const price = event.target.parentNode.children[2].value;
          const option = event.target.parentNode.children[5].value;
          const menuImg = event.target.parentNode.children[7].files[0];
          console.log(price);
          console.log(option);
          let formData = new FormData();
          formData.append('price', price);
          formData.append('option', option);
          formData.append('newFile', menuImg);

          fetch(`/store/menu/${menu_id}`, {
            method: 'PATCH',
            cache: 'no-cache',
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.errorMessage) {
                return Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: err.responseJSON.errorMessage,
                });
              }
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message,
              });
              window.location.reload();
            });
        });
        document
          .getElementById(menu_id)
          .nextSibling.nextSibling.addEventListener('click', function (event) {
            const menuId = event.target.previousSibling.previousSibling.id;
            fetch(`/store/menu/${menuId}`, {
              method: 'DELETE',
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.errorMessage) {
                  return Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.responseJSON.errorMessage,
                  });
                }
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: data.message,
                });
                window.location.reload();
              });
          });
      });
    });
});

document.querySelector('.register-btn').addEventListener('click', function (event) {
  const menu = document.querySelector('#menu-name').value;
  const price = document.querySelector('#menu-price').value;
  const option = document.querySelector('#menu-option').value;
  const category = document.querySelector('#menu-category').value;
  const menuImg = document.querySelector('#menu-image').files[0];
  let formData = new FormData();
  formData.append('menu', menu);
  formData.append('price', price);
  formData.append('option', option);
  formData.append('category', category);
  formData.append('newFile', menuImg);

  fetch('/store/menu', {
    method: 'POST',
    cache: 'no-cache',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errorMessage) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.errorMessage,
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      });
      window.location.reload();
    });
});
