$(function(){
    //模拟数据
    // var todolist=[
        
    // ]
    //存储数据到localStrage并且获取数据
    // 在localStorage中取数据的方法
    function loadData(){
        var collection=localStorage.getItem('todo');
        if(collection){
            return JSON.parse(collection);
        }else{
            return [];
        }
    }

    // 在localStorage中取数据的方法
    function saveDate(data){
        localStorage.setItem('todo', JSON.stringify(data));
    }
    //加载网页数据
    load();
    function load(){
        var todoCount=0;
        var doneCount=0;
        var doneStr='';
        var todoStr='';
        var todolist=loadData();
        if(todolist&&todolist.length>0){
            // 有数据
            todolist.forEach(function(data,i){
                if(data.done){
                    //已经完成
                    doneStr+=`
                    <li>
                        <input type="checkbox" index=${i} checked>
                        <p id="p-${i}" index=${i}>${data.title}</p>
                        <a href="javascript:;">-</a>
                    </li>
                    `;
                    doneCount++;
                }else{
                    //正在进行
                    todoStr += `
                    <li>
                        <input type="checkbox" index=${i}>
                        <p id="p-${i}" index=${i}>${data.title}</p>
                        <a href="javascript:;">-</a>
                    </li>
                    `;
                    todoCount++;
                }
                $('#todolist').html(todoStr);
                $('#donelist').html(doneStr);
                $('#todocount').text(todoCount);
                $('#donecount').text(doneCount);
            })
        }else{
            $('#todolist').html('');
            $('#donelist').html('');
            // 无数据
            $('#todocount').text(todoCount);
            $('#donecount').text(doneCount);
        }
    }

    //添加数据的方法
    $('#title').keydown(function(event){
        if(event.keyCode===13){
            // 获取输入框的值
            var val=$(this).val();
            if(!val){
                $(this).next().detach();
                $(this).after("<span id='title_span'>亲,您是个渣渣,请您输入内容。</span>")
            }else{
                $(this).next().detach();
                var data = loadData();
                data.unshift({
                    title:val,
                    done:false
                });
                // 清空input输入框的值
                $(this).val('');
                saveDate(data);
                load();
            }
        }
    })

    // 删除todolist数据的方法
    // 通过事件代理的方式
    $('#todolist').on('click','a',function(){
        // 获取当前点击元素的索引下标
        var i=$(this).parent().index();
        // console.log(i);
        todolist.splice(i,1);
        load();
    })
    // 删除donelist数据的方法
    $('#donelist').on('click', 'a', function () {
        // 获取当前点击元素的索引下标
        var i = $(this).parent().index();
        // console.log(i);
        todolist.splice(i, 1);
        load();
    })
    //更新数据
    $('#todolist').on('change','input[type=checkbox]',function(){
        // 获取当前点击元素的索引下标
        var i = parseInt($(this).attr('index'));
        // 更新数据
        update(i,'done',true);
        var todoTwo=parseInt($('#todocount').text());
        todoTwo--;
    })
    $('#donelist').on('change', 'input[type=checkbox]', function () {
        // 获取当前点击元素的索引下标
        var i = parseInt($(this).attr('index'));
        // 更新数据
        update(i, 'done', false);
        var doneTwo=parseInt($('#donecount').text());
        doneTwo--;
    })
    function update(i,key,value){
        var data=loadData();
        var todo = data.splice(i, 1)[0];
        todo[key]=value;
        // 替换数据
        data.splice(i, 0, todo);
        saveDate(data);
        load();
    }


    //编辑操作
    $('#todolist').on('click','p',function(){
        // 获取当前元素索引的下标
       var i = parseInt($(this).attr('index'));
       var title=$(this).text();
       var $p=$(this);
       $p.html(`
        <input type="text" id="input-${i}" value=${title}>
       `)
       //选中获取焦点时的内容
       $(`#input-${i}`)[0].setSelectionRange(0,$(`#input-${i}`).val().length);
       //获取焦点
       $(`#input-${i}`).focus();

       //失去焦点保存更改的数据
       $(`#input-${i}`).blur(function(){
           if($(this).val().length===0){
            $p.html(title);
            alert('内容不能为空');
           }else{
             update(i,'title',$(this).val());  
           }
       })
    })

})