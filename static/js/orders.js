var Sell_Table;      //   表格
var Button_Query
var Button_Query1
var Input_payId
var Input_refundId
var Button_Query2
var Input_removeId
var Button_Query3
function main(){

    Sell_Table = document.getElementById("sell_table");
    Button_Query = document.getElementById("confirm_sell");
    Button_Query1 = document.getElementById("save_sell");
    Input_payId = document.getElementById("1");
    Input_refundId = document.getElementById("2");
    Button_Query2 = document.getElementById("save_sell1");
    Input_removeId = document.getElementById("3");
    console.log(Input_removeId);
    Button_Query3 = document.getElementById("save_sell2");

    // 显示表格
    query_orders();
    setEventListener();
}

function setEventListener(){
    Button_Query.addEventListener("click", query_orders);
    Button_Query1.addEventListener("click", query_orders1);
    Button_Query2.addEventListener("click", query_orders2);
    Button_Query3.addEventListener("click", query_orders3);
}

function query_orders(){

 // 构造ajax报文
 ajaxGet(
    'http://'+HOST_PORT+'/retail/draftOrder?action=getAll',
   function(data){
       clearTable(Sell_Table)
       console.log(data.length);
       for(let i=0; i<data.length; i++){
           appendJsonItemToTable(
               Sell_Table, 
               data[i], 
               ["pay","refund", "price","id"]
           );
           
       }
   },
   function(data){
    //clearTable(Sell_Table);
    alert(data);
}
);

}

function query_orders1(){
    //获取数据
    pay_Id = Input_payId["value"];

    // 构造ajax报文
 ajaxPost(
    'http://'+HOST_PORT+'/retail/draftOrder',
    'pay',
    {"id":pay_Id},
   function(data){
       clearTable(Sell_Table)
       for(let i=0; i<data.length; i++){
           appendJsonItemToTableWithButtons(
               Sell_Table, 
               data[i], 
               ["pay","refund", "price","customerId"],
           );
           
       }
   },
   function(data){
    clearTable(Sell_Table);
    alert(data);
}
);

}

function query_orders2(){
    //获取数据
    refund_Id = Input_refundId["value"];

    // 构造ajax报文
 ajaxPost(
    'http://'+HOST_PORT+'/retail/draftOrder',
    'refund',
    {"id":refund_Id},
   function(data){
       clearTable(Sell_Table)
       for(let i=0; i<data.length; i++){
           appendJsonItemToTableWithButtons(
               Sell_Table, 
               data[i], 
               ["pay","refund", "price","customerId"],
           );
           
       }
   },
   function(data){
    clearTable(Sell_Table);
    alert(data);
}
);

}

function query_orders3(){
    console.log(Input_removeId);
    remove_Id = Input_removeId["value"];

// 构造ajax报文
ajaxPost(
    'http://'+HOST_PORT+'/retail/draftOrder',
    'remove',
    {"id":remove_Id},
   function(data){
       clearTable(Sell_Table)
       
   },
   function(data){
    clearTable(Sell_Table);
    alert(data);
}
);


}




