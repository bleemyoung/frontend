var Button_Query;
var Input_Warehouse;
var Input_Goods;
var Table_Warehouse;
var Button_Query1 
var Input_goodsId 
var Input_goodsNum 
var Input_oldRepo 
var Input_newRepo 
var Input_repoId
var Button_Query2

function main(){
    Button_Query = document.getElementById("button_query"); // 查询按钮
    Input_Warehouse = document.getElementById("input_warehouse");
    Input_Goods = document.getElementById("input_goods");
    Table_Warehouse = document.getElementById("warehouse_table");
    Button_Query1 = document.getElementById("button_query1"); // 查询按钮
    Input_goodsId = document.getElementById("1")
    Input_goodsNum = document.getElementById("2")
    Input_oldRepo = document.getElementById("3")
    Input_newRepo = document.getElementById("4")
    Button_Query2 = document.getElementById("button_query2"); // 查询按钮
    Input_repoId = document.getElementById("5")
    setEventListener();
    query_warehouse();
}

function setEventListener(){
    Button_Query.addEventListener("click", query_warehouse);
    Button_Query1.addEventListener("click", query_warehouse1);
    Button_Query2.addEventListener("click", query_warehouse2);
}


function query_warehouse(){
    // 获取数据
    warehouse_name = Input_Warehouse["value"]; // 哪个仓库
    goods_name = Input_Goods["value"]; // 哪个商品

     // 构造ajax报文
    ajaxPost(
         'http://'+HOST_PORT+'/retail/repo',
         'search',
         {"goodsName":goods_name, "repoId":warehouse_name},
        function(data){
            clearTable(Table_Warehouse);
               
            for(let i=0; i<data.length; i++){
                appendJsonItemToTableWithButtons(
                    Table_Warehouse, 
                    data[i], 
                    ["goodsId","goodsName", "goodsNum","repoId"],
                    [
                        CreateTableRowButton("恢复", function(Row){
                        Row.childNodes[1].innerHTML = 12;
                    }),
                        CreateTableRowButton("删除", function(Row){
                        Row.childNodes[1].innerHTML = Number(Row.childNodes[1].innerHTML) - 1;
                        })
                    ]
                );
                
            }
        },
        function(data){
             alert(data);
        }
    );

    }

   function query_warehouse1(){
       //获取数据
    goods_Id = Input_goodsId["value"];//哪个商品
    goods_Num = Input_goodsNum["value"];//商品数量
    old_Repo = Input_oldRepo["value"];//原仓库号
    new_Repo = Input_newRepo["value"];//新仓库号

    //构造ajax报文
    ajaxPost(
        'http://'+HOST_PORT+'/retail/repo',
        'dispatch',
        {"goodsId":goods_Id, "goodsNum":goods_Num,"oldRepo":old_Repo,"newRepo":new_Repo},
       function(data){
           clearTable(Table_Warehouse);
       },
       function(data){
            alert(data);
       }
   );

   }

   function query_warehouse2(){
    repo_Id = Input_repoId["value"];//哪些仓库
    //构造ajax报文
    ajaxPost(
        'http://'+HOST_PORT+'/retail/repo',
        'getAll',
        {"repoId":repo_Id},
       function(data){
           clearTable(Table_Warehouse); 
           for(let i=0; i<data.length; i++){
               appendJsonItemToTableWithButtons(
                   Table_Warehouse, 
                   data[i], 
                   ["goodsId","goodsName", "goodsNum","repoId"],
                   [
                       CreateTableRowButton("恢复", function(Row){
                       Row.childNodes[1].innerHTML = 12;
                   }),
                       CreateTableRowButton("删除", function(Row){
                       Row.childNodes[1].innerHTML = Number(Row.childNodes[1].innerHTML) - 1;
                       })
                   ]
               );
               
           }
       },
       function(data){
            alert(data);
       }
   );

   }


