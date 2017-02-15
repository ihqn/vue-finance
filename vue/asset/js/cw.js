function getDate(url, cb) {
    fetch(url)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log("存在一个问题，状态码为：" + response.status);
                    return;
                }
                //检查响应文本
                response.json().then(function(data) {
                    cb(data)
                });
            }
        )
        .catch(function(err) {
            console.log("Fetch错误:" + err);
        });
}

function postDate(url, body, cb) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept":" application/json, text/plain, */*"
        },
        body: body
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function(data) {
                cb(data)
            });
        } else if (res.status == 401) {
            alert("Oops! You are not authorized.");
        }
    }, function(e) {
        alert("无法连接服务器");
    });
}

// 生成编号
var number = 1,
    singlebak={
        "code": "",
        "id": "",
        "date": "",
        "money": "",
        "channel": "0",
        "apply": "",
        "examine": "",
        "number": "",
        "department": "",
        "business": "",
        "costtype": "",
        "subject": "",
        "tag": "0",
        "expenditure": "",
        "remark": ""
    };

// 添加类目
Vue.component('addproject-box', {
    template: '#addproject-temp',
    props: {
        isshow: '',
        addname: {},
        data: {},
        datas: {}
    },
    methods: {
        addpr: function() {
            if (!this.addname.name) return;
            var d = Object.keys( this.data ) || [];
            var ifzero = d.length>0 ? d[0].toString() !== '1' : true;
            var key = (!!this.addname.key ? this.addname.key : d.length + 1).toString();
            this.addname.key = (key < 10 && key.length < 2 && ifzero) ? '0' + key : key;

            Vue.set(this.data, this.addname.key , this.addname);
            this.isshow  = false
            this.$dispatch('ifshow')
        }
    }
})

// 添加和编辑弹层
Vue.component('pouple', {
    template: '#pouple-temp',
    props: {
        data : {},
        datas : {},
        formtype: '',
        costcode: '',
        tem: {},
        iserr: false,
        bus: '',
        type: '',
        depart: '',
        isshow0: false,
        isshow1: false,
        isshow2: false,
        isshow3: false
    },
    events: {
        ifshow: function () {
            var len = 4;
            for( var i = 0; i< len; i++ ){
                this['isshow' + i] =  false;
            }
            this.bus[this.data.business]['type'] = this.type
            this.type[this.data.costtype]['depart'] = this.depart
            var data = this.datas.columns.departmentlist
            postDate('/addproject', 'data=' + JSON.stringify(data), function(res) {})
        }
    },
    methods: {
        //通过编码框对编码表进行修改
        changelist: function() {
            this.iserr = false;
            var code = this.data.number.split('-');

            if (code.length == 1 && code[0].length == 7) {
                var c = code[0]
                code[0] = c.slice(0, 1)
                code[1] = c.slice(1, 3)
                code[2] = c.slice(3, 5)
                code[3] = c.slice(5)
                code.join('-')
            }

            if( code[0] in this.datas.columns.departmentlist){this.bus = this.datas.columns.departmentlist[code[0]]['bus']}else{this.iserr = true;return false} 
            if( code[1] in this.bus ){ this.type =this.bus[code[1]]['type'] }else{this.iserr = true;return false}
            if( code[2] in this.type ){ this.depart =this.type[code[2]]['depart'] }else{this.iserr = true;return false}
            if( !(code[3] in this.depart) ){ this.iserr = true;return false }

            this.data['department'] = code[0]
            this.data['business'] = code[1]
            this.data['costtype'] = code[2]
            this.data['subject'] = code[3]
            this.data.number =  code.join('-')
        },
        changecode: function(index) {
            this[name] = index;
            var code = this.data.number ? this.data.number.split('-') : [];
            var name = '';

            switch (index) {
                case '0':
                    name = 'department';
                    break;
                case '1':
                    name ='business';
                    break;
                case '2':
                    name ='costtype';
                    break;
                default:
                    name ='subject';
                    break;
            }
            code[index] = this.data[name];
            this.data.number = code.join('-')

            this.bus = this.datas.columns.departmentlist[this.data.department]['bus']
            this.type = this.data.business in  this.bus  ? this.bus[this.data.business]['type'] : {}
            this.depart = this.data.costtype in this.type ? this.type[this.data.costtype]['depart']: {}

            this.iserr = code[0] in this.datas.columns.departmentlist ? false : true;
            this.iserr = code[1] in this.bus ? false : true;
            this.iserr = code[2] in this.type ? false : true;
            this.iserr = code[3] in this.depart ? false : true;
        },
        addproject: function(index, type, tem) {
            var len = 4;
            for( var i = 0; i< len; i++ ){
                if( i != index ) this['isshow' + i] =  false;
            }
            this['isshow' + index] = !this['isshow' + index];
            if (tem) this.tem = tem;
            else {
                this.tem = { key: '', name: ''};
                if(type) this.tem[type] = {} ;
            }
        },
        //添加整条数据
        add: function(type) {
            var iftrue = validate($('form[name="form'+ type +'"] .js-input'), function(err,input){alert(err);input.focus();}, false)();
            if( !iftrue || this.iserr ){
                return false;
            }

            var data = $('form[name="form'+ type +'"]').serialize();
            postDate('/add', data, function(res) {
                Vue.set(this.datas, 'grid', res.data.grid);
                Vue.set(this.datas, 'columns', res.data.columns);
                number++
                $('#myModal'+type).modal('hide')
            }.bind(this))
        },
        hidepouple: function (name) {
            var issave = true;
            for ( var key in singlebak ){
                if ( singlebak.hasOwnProperty(key) && singlebak[key] != this.data[key] ){
                    issave = false
                }
            };
            if( !issave ){
                if( confirm('页面已修改,直接关闭则不保存数据') ){
                    for ( var key in singlebak ){
                        if ( singlebak.hasOwnProperty(key) && singlebak[key] != this.data[key] ){
                            this.data[key] = singlebak[key]
                        }
                    }
                    $('#'+name).modal('hide')
                }
            }else{
                $('#'+name).modal('hide')
            }
        }
    }
})

// 备注
Vue.component('remark-box', {
    template: '#remark-temp',
    props: {
        expremark: '',
        showRemark: false
    },
    methods: {
        notify: function() {
            this.showRemark = !this.showRemark;
        },
        saveRemark: function() {
            this.showRemark = false;
            postDate('/addremark', 'id=' + this.expremark.id + '&title=' + this.expremark.remark, function(res) {
                Vue.set(this.expremark, 'remark', res.remark);
            }.bind(this))
        }
    }
})

//主要内容
Vue.component('main-grid', {
    template: '#main-temp',
    props: {
        datas: {},
        single: {},
        formtype: 'edit',
        showRemark: false,
        issave: false,
        query: '',
        keyword: '',
        yearword: '',
        monthword: '',
        departmentword: '',
        businessword: '',
        costword: '',
        subjectword: '',
        buslist: '',
        costlist: '',
        subjectlist: '',
        bus:'',
        type:'',
        depart:'',
        num:'',
        num1:'',
        num2:'',
        num3:''
    },
    methods: {
        screen: function(val) {
            if (this.query == val) this.query = '';
            else this.query = val
        },
        filer: function(val, type, name) {

            var kw = type ? type : 'yearword';
            if (this[kw] == val) this[kw] = '';
            else this[kw] = val;
            if( !name ) return;

            this[name] = val;
            var n = '';
            switch (name) {
                case 'num':
                    n = 0;
                    break;
                case 'num1':
                    n = 1;
                    break;
                case 'num2':
                    n = 2;
                    break;
                default:
                    n = 3;
                    break;
            }

            this.buslist = this.datas.columns.departmentlist[this.num]['bus']
            this.costlist = this.num1 in this.buslist ? this.buslist[this.num1]['type'] : {}
            this.subjectlist= this.num2 in this.costlist ? this.costlist[this.num2]['depart'] :{}
        },
        deltr: function(id) {
            //删除单条数据，如果是array。使用datas.$remove(data)
            postDate('/del', 'id=' + id, function(res) {
                Vue.delete(this.datas.grid, res.id);
            }.bind(this))
        },
        editList: function (data) {
            this.single = data;
            this.formtype= 'edit'

            this.bus = this.datas.columns.departmentlist[data.department]['bus']
            this.type = this.datas.columns.departmentlist[data.department]['bus'][data.business]['type']
            this.depart = this.datas.columns.departmentlist[data.department]['bus'][data.business]['type'][data.costtype]['depart']           
            $('#myModaledit').modal('show')

            for ( var key in singlebak ){
                if ( singlebak.hasOwnProperty(key) ){
                    singlebak[key] = this.single[key]
                }
            }
        }
    }
})

new Vue({
    el: '#app',
    data: {
        datas: {
            columns: {},
            grid: {},
            deal: {}
        },
        bus: {},
        type: {},
        depart: {},
        costcode: 0,
        formtype: 'add',
        single:{
            "code": "",
            "id": "",
            "date": "",
            "money": "",
            "channel": "0",
            "apply": "",
            "examine": "",
            "number": "",
            "department": "",
            "business": "",
            "costtype": "",
            "subject": "",
            "tag": "0",
            "expenditure": "",
            "remark": ""
        },
        keyword: ''
    },
    ready: function() {
        getDate("/index", function(response) {
            if (response.result == 'success') {
                this.datas = response.data
                var a = Object.keys( this.datas.grid );
                number = ~~a[ a.length - 1 ] + 1;
                number < 10 ? '0' + number : number;
            }
        }.bind(this))
    },
    methods: {
        addnumber: function () {
            var d = new Date;
            var y = (d.getYear()).toString().slice(1)
            var m = d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
            if( number < 10 ){
               n = '00' + number
            }else if( number >= 10 && number < 100 ){
               n = '0' + number
            }else{
                n = number
            }
            
            for ( var key in singlebak ){
                if ( singlebak.hasOwnProperty(key) ){
                    singlebak[key] = this.single[key] = ''
                }
            }
            singlebak['channel'] = this.single['channel']=singlebak['tag'] = this.single['tag'] = '0'
            singlebak.code = this.single.code = 'C'+y + m + n;
        }
    }
})


$('.modal-dialog').click(function (e) {
    e.stopPropagation()
})