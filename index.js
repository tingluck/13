 class Problem {
    constructor() {
		this.$('');
        // console.log(this.saveData);
        // 获取保存按钮，绑定点击事件
        this.$('.save-date').addEventListener('click', this.saveData);
        // 给tbody绑定点击事件
        this.$('.table tbody').addEventListener('click', this.distribute.bind(this));
        this.getDate();
        // 给确认按钮绑定事件
        this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this));
        // 给修改按钮保存绑定事件
        this.$('.modify-date').addEventListener('click', this.saveModify.bind(this));
    }
    distribute(eve) {
        let e = eve.target;
        // console.log(e);
        // console.log(e.classList.contains('btn-del'));
        // 判断是否为删除按钮
        if (e.classList.contains('btn-del')) this.delDate(e);
        if (e.classList.contains('btn-modify')) this.modifyDate(e);
    }
    static(){
        this.name='zs'
    }
    findTr(e) {
        // console.log(e);
        if (e.nodeName == "TR") {
            return e;
        } else {
            return this.findTr(e.parentNode);
        }
    }
    // 修改的方法
    modifyDate(e) {
        // console.log(e);
        // let trobj = ''
        let trobj1 = this.findTr(e);

        //  1.弹出模态框
        $('#modifyModal').modal('show');


        // 获取修改内容到模态框对应内
        // if (e.nodeName == 'SPAN') {
        //     trobj = e.parentNode.parentNode.parentNode
        // }

        // if (e.nodeName == 'BUTTON') {
        //     trobj = e.parentNode.parentNode
        // }
        // console.log(trobj);
        // 获取所有的子节点。分别取出
        let child = trobj1.children;
        let id = child[0].innerHTML;
        let title = child[1].innerHTML;
        let pos = child[2].innerHTML;
        let idea = child[3].innerHTML
        // console.log(id,pos,title,idea);
        // 放入模态框
        let form = this.$('#modifyModal form').elements;
        // console.log(form);
        form.title.value = title;
        form.pos.value = pos;
        form.idea.value = idea;
        // 获取id，传给json
        this.modifyId = id;
    }
    // 修改按钮保存
    saveModify() {
        // 收集表单中的数据
        // let form = this.$('#modifyModal form').elements;
        // console.log(form);
        // let title=form.title.value.trim();
        // let idea=form.idea.value.trim();
        // let pos=form.pos.value.trim();
        // console.log(title,idea,pos);
        // 解析构赋值
        let {
            title,
            pos,
            idea
        } = this.$('#modifyModal form').elements;
        // console.log(form);
        let titleVal = title.value.trim();
        let ideaVal = idea.value.trim();
        let posVal = pos.value.trim();
        // 非空验证 结束执行
        if (!title || !pos || !idea) return
        // console.log(titleVal,ideaVal,posVal);
        // 给后台发送数据，帮存数据
        axios.put("http://localhost:3000/problem/" + this.modifyId, {
            title: titleVal,
            pos: posVal,
            idea: ideaVal
        }).then(res => {
            if (res.status == 200) {
                location.reload();
            }
        })
    }
    // 删除数据方法
    delDate(e) {
        // 将当前删除节点保存在e
        this.e = e;
        // 1.弹出模态框，通过js
        $('#delModal').modal('show');
    }
    // 确认删除方法
    confirmDel() {
        // console.log('en');
        // console.log(this.e.nodeName);
        let id = 0;
        // 确认点击的是哪个节点
        if (this.e.nodeName == 'SPAN') {
            let trobj = this.e.parentNode.parentNode.parentNode;
            // console.log(trobj);
            id = trobj.firstElementChild.innerHTML;
            // console.log(id);
        }
        if (this.e.nodeName == 'BUTTON') {
            let trobj1 = this.e.parentNode.parentNode;
            // console.log(trobj1);
            id = trobj1.firstElementChild.innerHTML;
            // console.log(id);
        }
        // 把id给json-server服务器，删除其信息
        axios.delete("http://localhost:3000/problem/" + id).then(res => {
            // console.log(res);
            if (res.status == 200) {
                location.reload();
            }
        })

    }
    // 保存数据方法
    saveData() {
        // console.log(this,111);
        // 获取内容添加表单
        let form = document.forms[0].elements;
        // console.log(form);
        let title = form.title.value.trim();
        let pos = form.pos.value.trim();
        let idea = form.idea.value.trim();
        // console.log(title,pos,idea);
        // 判断表单每一项是否有值
        if (!title || !pos || !idea) {
            throw new Error('不能为空')
        }
        // 将值传给json-server post是添加数据的
        axios.post('http://localhost:3000/problem', {
            title,
            pos,
            idea
        }).then(res => {
            // console.log(res);
            if (res.status == 201) {
                location.reload()
            }
        })
    }
    // 获取数据的方法
    getDate() {
        // console.log('这是数据获取');
        // 获取tbody
        let tbody = this.$('tbody');
        // console.log(tbody);

        // let div=this.$('div');
        // console.log(div);
        // 发送ajax请求获取数据
        axios.get('http://localhost:3000/problem').then(function (response) {
            //  console.log(response);
            // 获取date和status
            let {
                data,
                status
            } = response;
            //   console.log(data,status);
            if (status == 200) {
                // console.log(data);
                // 将获取的获取的信息db.json渲染到页面上
                let html = '';
                data.forEach(ele => {
                    // console.log(ele);
                    html += `<tr>
            <th scope="row">${ele.id}</th>
            <td>${ele.title}</td>
            <td>${ele.pos}</td>
            <td>${ele.idea}</td>
            <td><button type="button" class="btn btn-danger btn-xs btn-del"><span class="glyphicon glyphicon-trash btn-del" aria-hidden="true"></span></button>
            <button type="button" class="btn btn-warning btn-xs btn-modify"><span class="glyphicon glyphicon-pencil btn-modify" aria-hidden="true"></span></button></td>
        </tr>`
                });
                // console.log(html);
                // let tbody=this.$('tbody');
                // console.log(t);
                // console.log(tbody);
                // 追加到页面
                tbody.innerHTML = html;
            }
        })
    }
    // 获取节点对象的方法
    $(ele) {
        let res = document.querySelectorAll(ele);
        //  判断当前只有一个符合，就返回一个，否则返回节点集合
        return res.length == 1 ? res[0] : res;
    }
}
new Problem;