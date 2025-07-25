
    
    
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

    // C3.js


//api
// 請代入自己的網址路徑
// https://livejs-api.hexschool.io/api/livejs/v1/customer/eychen/products
const api_path = "eychen";
const token = "pg27b4hoNWUi440ayHuiYwYYrll1";

function init(){
    getOrderList();
    
}
init();

function renderC3(){
    console.log(orderData);
    let total={};
    orderData.forEach(function(item){
        item.products.forEach(function(productItem){

    if(total[productItem.title]==undefined){
    total[productItem.title]=productItem.price*productItem.quantity;
    console.log(55668888); 

    }else{
    total[productItem.title]+=productItem.price*productItem.quantity;
    console.log(9999666333); 
            }
        })
    })
    console.log(total);  
    //資料關聯
    let categoryAry = Object.keys(total);
    console.log(categoryAry);
    let newData=[];
    categoryAry.forEach(function(item){
        let ary = [];
        ary.push(item);
        ary.push(total[item]);
        newData.push(ary);
    })
    console.log(newData);
    //c3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,

            
            // colors:{
            //     "Louvre 雙人床架":"#DACBFF",
            //     "Antony 雙人床架":"#9D7FEA",
            //     "Anty 雙人床架": "#5434A7",
            //     "其他": "#301E5F",
            // }
        },
    });
}



let orderData=[];
const orderList = document.querySelector(".js-orderList")
function getOrderList(){
    let str ="";
    let productStr ="";

    
    axios
        .get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
            headers:{
                "Authorization":token,
            }
        })

      
        .then(function(response){
        orderData = response.data.orders;
        
        // console.log(response.data.orders);
        


 //組訂單字串
orderData.forEach(function(item){
//組時間狀態
const thisStamp =new Date(item.createdAt*1000);
const torderTime =`${thisStamp.getFullYear()}/${thisStamp.getMonth()+1}/${thisStamp.getDate()}`;
// console.log(torderTime);
//組產品字串
    item.products.forEach(function(item){
    productStr+=`<p>${item.title}X${item.quantity}</p>`
})

//判斷訂單處理狀況 // 如果被點擊時 paid==true =>已處理

    let orderStatus="";
            if(item.paid==true){
            orderStatus="已處理"
            }else{
            orderStatus="未處理"
            }
            

            str+=`<tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              <p>${productStr}</p>
            </td>
            <td>${torderTime}</td>

            <td> 
            <a class="orderStatus" data-status="${item.paid}" href="#" data-id="${item.id}">
             ${orderStatus}</a>           
            </td>

            <td>
            <input type="button" data-id="${item.id}"
            class="delSingleOrder-Btn js-orderDelete" value="刪除">
            </td>
        </tr>
        `
        })        
        orderList.innerHTML = str;
        renderC3();
        
        
    })
   
};
getOrderList();
// 點擊按鈕切換已處理、未處理狀態
orderList.addEventListener("click",function(e){
    e.preventDefault();
    const targetClass = e.target.getAttribute("class");
    let id = e.target.getAttribute("data-id")
    if(targetClass == "delSingleOrder-Btn js-orderDelete"){
        deleteOrderItem(id);
        return;
    }
    if(targetClass == "orderStatus"){
        let status = e.target.getAttribute("data-status");
        let id = e.target.getAttribute("data-id")
        changeOrderStatus(status,id);
        console.log(status,id);
        return;
    }
})

function changeOrderStatus(status,id){
    let newStatus;
    if(status=="true"){
        newStatus=false;
    }else{
        newStatus=true;
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/`,{
        "data": {
        "id": id,
        "paid": newStatus
        }
    },{
        headers:{
            "Authorization":"pg27b4hoNWUi440ayHuiYwYYrll1",
        }
    })
    .then(function(response){
        alert("修改訂單成功");
        console.log(newStatus);
        getOrderList();
    })
    getOrderList();
}
function deleteOrderItem(id){
    axios
    .delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,{
        headers:{
            "Authorization":token,
        }
    })
    .then(function(response){
        alert("刪除該筆訂單成功");
        getOrderList();
    })




}

const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click",function(e){
    axios
    .delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/`,{
        headers:{
            "Authorization":token,
        }
    })
    .then(function(response){
        alert("刪除該筆訂單成功");
        getOrderList();
    })
})

