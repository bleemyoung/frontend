//草稿页面的几个
var Draft_table;
var D_id;
var D_name;
var D_discount;
var D_num;
// table
var Show_Table;
// 增加草稿
var Add_draft;
function main(){
    Show_Table=document.getElementById("draft_table");
  

    Draft_table=document.getElementById("add_draft_table");
    D_id=document.getElementById("draft_id");
    D_name=document.getElementById("draft_name");
    D_discount=document.getElementById("draft_discount");
    D_num=document.getElementById("draft_num");
    // add
    Add_draft=document.getElementById("add_draft");
// //    打印
    query_draft("*");
    setEventListener();
}


function query_draft(name=""){
    ajaxPost(
        // 'http://4b6412f2.cpolar.io/retail/order',
        'http://'+HOST_PORT+'/retail/order',
        'getAll',
        {"name":name},
        function(data){
            for(let i=0;i<data.length;i++){
                data[i]["goods"] = JSON.stringify(data[i]["goods"]);
                //三个按钮：删除、修改、审核
                appendJsonItemToTableWithButtons(
                Show_Table,
                data[i],
                ["id", "goods","createDate","imDate","price","customerId","profit"],
                [
                    CreateTableRowButton("删除", function(Row){
                        ajaxPost(
                            'http://'+HOST_PORT+'/retail/order',
                            'remove',
                            {"id":data[i]["id"]},
                            function(data){
                                clearTable(Show_Table);
                                // clear之后再重新打印一次
                                query_draft();
                            },
                            function(data){
                                // alert("删除失败...");
                                alert(data);
                            }
                        );
                    }),
                    CreateTableRowButton("修改",function(Row){
                        id_to_update=data[i]["id"];

                        Div_Update.style["display"]="inline";

                         // 设置其它行为默认颜色
                         console.log("123");
                         console.log(id_to_update);
                         console.log(last_Row_to_update);
                         if(last_Row_to_update !== null){
                             for(let i=0; i<last_Row_to_update.childNodes.length-1; i++){
                                 last_Row_to_update.childNodes[i].style["color"] = "#4f6b72";
                             }
                         }
                         // 设置选中的行为红色
                         for(let i=0; i<Row.childNodes.length-1; i++){
                             Row.childNodes[i].style["color"] = "red";
                         }
                         // 重新更新下一行的指针
                         last_Row_to_update = Row;
                    }),
                    
                    CreateTableRowButton("审核", function(Row){
                        ajaxPost(
                            'http://'+HOST_PORT+'/retail/order',
                            'confirm',
                            {"id":data[i]["id"]},
                            function(data){
                                clearTable(Show_Table);
                                // clear之后再重新打印一次
                                query_draft();
                            },
                            function(data){
                                // alert("删除失败...");
                                alert(data);
                            }
                        );
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

var add_draft_input_type;
var add_draft_input_value;
function setEventListener(){
    // 进入添加草稿页面

    document.getElementById("add_draft_start").onclick = function(){
        document.getElementById("draft_table_div").style["display"] = "none";
        document.getElementById("draft_add_div").style["display"] = "none";
        document.getElementById("input_draft_div").style["display"] = "flex";
    }

    document.getElementById("add_draft_cancel").onclick = function(){
        document.getElementById("draft_table_div").style["display"] = "inline";
        document.getElementById("draft_add_div").style["display"] = "inline";
        document.getElementById("input_draft_div").style["display"] = "none";
    }



    document.getElementById("button_add_a_row").onclick = function(){
        let draft_table = document.getElementById('add_draft_table');
        let input_1 = document.createElement('input');
        input_1.type = 'text';
        input_1.oninput = function(){
            add_draft_input_type = 'goods_name';
            add_draft_input_value = input_1.value;
            update_add_draft_info_div(this);
        }
        let td1 = document.createElement('td');
        td1.appendChild(input_1);
        let input_2 = document.createElement('input');
        input_2.type = 'text';
        let td2 = document.createElement('td');
        td2.appendChild(input_2);

        let input_3 = document.createElement('input');
        input_3.type = 'text';
        let td3 = document.createElement('td');
        td3.appendChild(input_3);

        let button_remove = document.createElement('input');
        button_remove.type = 'button';
        button_remove.value = '移除';
        let td4 = document.createElement('td');
        td4.appendChild(button_remove);
        button_remove.onclick = function(){
            draft_table.deleteRow(this.parentNode.parentNode.rowIndex);
        }


        let tr = document.createElement('tr');
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        draft_table.childNodes[1].appendChild(tr);
    }

    

    Add_draft.addEventListener("click", function(){
        let draft_table = document.getElementById("add_draft_table");
        let customerId = Number(document.getElementById("customer_id").value);
        let data_collected = [];
        for(let i=1; i<draft_table.rows.length; i++){
            console.log(draft_table.rows[i].cells[0].childNodes);
            data_collected.push({
                "goodsId": Number(draft_table.rows[i].cells[1].childNodes[0].value),
                "num":  Number(draft_table.rows[i].cells[2].childNodes[0].value),
                "discountRate": 1,
                "goodsName": draft_table.rows[i].cells[0].childNodes[0].value
            });
        }

        ajaxPost(
            'http://'+HOST_PORT+'/retail/order',
            'add',
            {
                "goodItems":data_collected,
                "customerId":customerId
            }
            ,
            function(data){
                alert("草稿增添成功");
                clearTable(Show_Table);
                query_draft("*");
                // 回到一开始的页面
                document.getElementById("draft_table_div").style["display"] = "inline";
                document.getElementById("draft_add_div").style["display"] = "inline";
                document.getElementById("input_draft_div").style["display"] = "none";
            },
            function(data){
                alert("创建失败，请重试或者取消：" + data);
            }
        );

    });

    document.getElementById("immediate_submit").onclick = function(){
        let draft_table = document.getElementById("add_draft_table");
        let customerId = Number(document.getElementById("customer_id").value);
        let data_collected = [];
        for(let i=1; i<draft_table.rows.length; i++){
            console.log(draft_table.rows[i].cells[0].childNodes);
            data_collected.push({
                "goodsId": Number(draft_table.rows[i].cells[1].childNodes[0].value),
                "num":  Number(draft_table.rows[i].cells[2].childNodes[0].value),
                "discountRate": 1,
                "goodsName": draft_table.rows[i].cells[0].childNodes[0].value
            });
        }

        ajaxPost(
            'http://'+HOST_PORT+'/retail/order',
            'add',
            {
                "goodItems":data_collected,
                "customerId":customerId
            }
            ,
            function(data){
                // 目前草稿添加成功
                ajaxPost(

                )
                alert("交易成功");

            },
            function(data){
                alert("创建失败，请重试或者取消：" + data);
            }
        );

    }

    // modify

    // Update_submit.addEventListener('click',function(){
    //     let id=id_to_update;
     
    //     let update_tradePrice=Update_tradePrice["value"];
    //     let update_price=Update_price["value"];
    //     let update_cost=Update_cost["value"];
    //     // let update_submit=Update_submit["value"];
    //     Div_Update.style["display"]="inline";
    //     ajaxPost(
    //         'http://'+HOST_PORT+'/retail/order',
    //         'modify',
    //         {"id":id,"tradePrice":update_tradePrice,"price":update_price,"cost":update_cost},
    //         function(data){
    //             clearTable(Show_Table);
    //             query_goods("");
    //             Div_Update.style["display"] = "none";
    //             // for(let i=0; i<Row.childNodes.length-1; i++){
    //             //     Row.childNodes[i].style["color"] = "4f6b72";
    //             // }
    //         },
    //         function(data){
    //             // alert(data);
    //             alert("123");
    //         }
    //     );
    // });
}

function update_add_draft_info_div(oninput_input){
    let customer_table_div = document.getElementById("add_draft_customer_table_div");
    let customer_table = document.getElementById("add_draft_customer_table");
    let goods_table_div = document.getElementById("add_draft_goods_table_div");
    let goods_table = document.getElementById("add_draft_goods_table");
    if(add_draft_input_type === 'customer_name'){ // 展示客户表
        goods_table_div.style["display"] = "none";
        customer_table_div.style["display"] = "inline";
        ajaxPost(
            'http://'+HOST_PORT+'/retail/customer', 
            // 'http://4b6412f2.cpolar.io/retail/customer',
            'search',  {"name":add_draft_input_value},
            function(data){
                clearTable(customer_table);
                for(let i=0;i<data.length;i++){
                    appendJsonItemToTableWithButtons(
                        customer_table,
                        data[i],
                        ["name", "phone","company","method"],
                        [
                            CreateTableRowButton("选择", function(Row){
                                document.getElementById("customer_id").value = data[i]["id"];
                                document.getElementById("customer_name").value=data[i]["name"]; 
                            })
                        ]
                    );
                }
            },
            function(data){
                clearTable(customer_table);
            }
        );

    }else{ // 展示货品表
        goods_table_div.style["display"] = "inline";
        customer_table_div.style["display"] = "none";
        ajaxPost(
            'http://'+HOST_PORT+'/retail/goods',
            // 'http://4b6412f2.cpolar.io/retail/goods',
            'search',
            {'name':add_draft_input_value},
            function(data){
                clearTable(goods_table);
                for(let i=0;i<data.length;i++){
                    appendJsonItemToTableWithButtons(
                        goods_table,
                        data[i],
                        ["name", "price","tradePrice","cost"],
                        [
                            CreateTableRowButton("选择", function(Row){
                                oninput_input.parentNode.parentNode.childNodes[1].childNodes[0].value=data[i]["id"]; 
                                oninput_input.value=data[i]["name"]; 
                            })
                        ]
                    );
                }
            },
            function(data){
                clearTable(goods_table);
            },
        );
    }
}