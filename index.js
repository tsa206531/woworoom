
document.addEventListener('DOMContentLoaded', function() {
    const ele = document.querySelector('.recommendation-wall');
    ele.style.cursor = 'grab';
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});
// menu 切換
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if(menu.classList.contains('openMenu')) {
        menu.classList.remove('openMenu');
    }else {
        menu.classList.add('openMenu');
    }
}
function closeMenu() {
    menu.classList.remove('openMenu');
}
//api
// 請代入自己的網址路徑
// https://livejs-api.hexschool.io/api/livejs/v1/customer/eychen/products
const api_path = "eychen";
const token = "pg27b4hoNWUi440ayHuiYwYYrll1";
let productData=[];
let cartData=[];
const productList = document.querySelector('.productWrap');  
const productSelect = document.querySelector('.productSelect');
const shoppingCarttable = document.querySelector('.shoppingCart-table');
const cartList =document.querySelector('.shoppingCart-tableList');



//初始化載入渲染
function init(){
    getProductList();
    
  }
  init();
  getCartList();

// 取得產品列表
function getProductList() {
    axios
    
    .get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)

      .then(function (response) {
        productData = response.data.products;
        renderProductList();
        // console.log(response);      
      })

      .catch(function(error){
        console.log(error)
      })
  }
//列表顯示重
  function combinProductHTMLitem(item){
    return`
    <li class="productCard" >
    <h4 class="productType">新品</h4>
    <img  src="${item.images}"  alt="">
    <a href="#" class="js-addCart" id="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${toThousand(item.origin_price)}</del>
    <p class="nowPrice">NT$${toThousand(item.price)}</p>
</li>`
  }
//toThousand(item.price)
//顯示全部產品
function renderProductList(){
  let str = "";
  productData.forEach(function(item){
    str +=combinProductHTMLitem(item);
  })
  productList.innerHTML = str;
}
//塞選邏輯
  productSelect.addEventListener("change",function(e){
    const category = e.target.value;
    if(category=="全部"){
      renderProductList();
      return;
      }
     let str = "";
      productData.forEach(function(item){
      if(item.category == category){
        str +=combinProductHTMLitem(item);
      }
    })
    productList.innerHTML = str;
    console.log(e.target.value);
  });
//監控"加入購物車"
  productList.addEventListener("click",function(e){
    e.preventDefault();
    let addCartClass = e.target.getAttribute("class");
    if(addCartClass!=="js-addCart"){
      console.log("不要亂點窩")      
      return;
    }
    let productId=e.target.getAttribute("data-id");
     console.log(productId);

     //確認購物車有品項且+1
     let numCheck = 1;
     cartData.forEach(function(item){
      if(item.product.id===productId){
        numCheck = item.quantity+=1;
      }
     })
    //  console.log(numCheck);
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/eychen/carts`,{
      "data": {
        "productId": productId,
        "quantity": numCheck
      }
    })
    .then(function(response){
      // console.log(response);
     
      console.log("已加入購物車");
      getCartList();
    })
  })
//我的購物車
  function getCartList(){
    axios
    
    .get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/eychen/carts`)

      .then(function (response) {
        cartData=response.data.carts;
        document.querySelector(".js-total").textContent= toThousand(response.data.finalTotal);
        // console.log(response.data);  
        let str ="";
      // toThousand(item.product.price*item.quantity)
        cartData.forEach(function(item){
          str +=`
          <tr>
          <td>
              <div class="cardItem-title">
                  <img src="${item.product.images}" alt="">
                  <p>${item.product.title}</p>
              </div>
          </td>
          <td>${toThousand(item.product.price)}</td>
          <td>${item.quantity}</td>
          <td>NT$${toThousand(item.product.price*item.quantity)}</td>
          <td class="discardBtn">
              <a href="#" class="material-icons" data-id="${item.id}">
                  clear
              </a>
          </td>
      </tr>`
        })    

        cartList.innerHTML =str;
      })

      .catch(function(error){
        console.log(error)
      })
  }
//刪除單項購物車
cartList.addEventListener("click",function(e){
  e.preventDefault();
  // console.log(e.target);
  const cartId = e.target.getAttribute("data-id");
  if(cartId==null){
    alert("你點到其他東西了窩~")
    return;
  }
console.log(cartId);
axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/eychen/carts/${cartId}`)
.then(function(reponse){
  console.log("刪除購物車成功");
  getCartList();
  })
})
//刪除  全部購物車
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click",function(e){
  e.preventDefault()
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/eychen/carts`)
  

  .then(function(reponse){
    console.log("購物車已清空");
    getCartList();
  
  })
  .catch(function(reponse){
    alert("購物車已清空，請勿重複典籍")
  })
})

const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click",function(e){
  e.preventDefault();
  // console.log("你被點擊了");
  if(cartData.length==0){
    alert("請加入購物車")
  return;
}
const customerName=document.querySelector("#customerName").value;
const customerPhone=document.querySelector("#customerPhone").value;
const customerEmail=document.querySelector("#customerEmail").value;
const customerAddress=document.querySelector("#customerAddress").value;
const tradeWay=document.querySelector("#tradeWay").value;

console.log(customerName,customerPhone,customerEmail,customerAddress,tradeWay)

if(customerName==""||customerPhone==""||customerEmail==""||customerAddress==""||tradeWay==""){
alert("請輸入訂單資訊");
return;
}




axios
.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/eychen/orders`,{
  "data": {
    "user": {
      "name": customerName,
      "tel": customerPhone,
      "email": customerEmail,
      "address": customerAddress,
      "payment":tradeWay,
      }
    }
    
}).then(function (response) {
  alert("訂單建立成功");
const customerName=document.querySelector("#customerName").value="";
const customerPhone=document.querySelector("#customerPhone").value="";
const customerEmail=document.querySelector("#customerEmail").value="";
const customerAddress=document.querySelector("#customerAddress").value="";
const tradeWay=document.querySelector("#tradeWay").value="ATM";
  getCartList();

})
.catch(function (error) {
  console.log(error.response.data);
});


})

function toThousand(num) {
  const numStr = num.toString();
  return numStr.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}