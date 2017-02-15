var express = require('express'),
  http = require('http'),
  app = express(),
  port = parseInt(process.env.PORT, 10) || 3000;

app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/vue'));
  app.use(app.router);
});

var datas = {
  "result": "success",
  "data": {
    "grid": {
      "1": {
        "code": "C1607001",
        "date": "2016-07-08",
        "money": "10000",
        "channel": "1",
        "apply": "碧",
        "examine": "庆",
        "number": "2-01-01-01",
        "department": "2",
        "business": "01",
        "costtype": "01",
        "subject": "01",
        "expenditure": "花花花花",
        "remark": "花花花花花啊",
        "tag": '1',
        "id": 1
      },
      "2": {
        "code": "C1607002",
        "date": "2016-07-07",
        "money": "100000",
        "channel": "0",
        "apply": "林碧",
        "examine": "黄庆",
        "number": "1-02-02-01",
        "department": "1",
        "business": "02",
        "costtype": "02",
        "subject": "01",
        "expenditure": "其它费用啊",
        "remark": "省着点使用",
        "tag": '2',
        "id": 2
      },
      "3": {
        "code": "C1607003",
        "date": "2016-07-07",
        "money": "555",
        "channel": "0",
        "apply": "林小碧",
        "examine": "黄全庆",
        "number": "2-01-02-02",
        "department": "2",
        "business": "01",
        "costtype": "02",
        "subject": "02",
        "expenditure": "其它费用啊啊啊啊",
        "remark": "省着点使用",
        "tag": '0',
        "id": 3
      }
    },
    "columns": {
      "year": [{
        key: "",
        name: "全部"
      }, {
        key: "15",
        name: "2015"
      }, {
        key: "16",
        name: "2016"
      }],
      "month": [{
        key: "",
        name: "全部"
      }, {
        key: "04",
        name: "4月"
      }, {
        key: "05",
        name: "5月"
      }, {
        key: "06",
        name: "6月"
      }],
      departmentlist : {
        "1" : {
          key: "1",
          name: "人力资源",
          bus:{
            "01":{
              key: "01",
              name: "工资",
              type:{
                "01":{
                    key: "01",
                    name: "工资",
                    depart:{
                        "01":{
                        key: "01",
                        name: "员工工资"
                      },
                      "02":{
                        key: "02",
                        name: "兼职人员工资"
                      }
                    }
                  },
                  "02":{
                    key: "02",
                    name: "福利",
                    depart:{
                        "01":{
                        key: "01",
                        name: "年终奖"
                      },
                      "02":{
                        key: "02",
                        name: "季度奖"
                      }
                    }
                  }
              }
            },
            "02":{
              key: "02",
              name: "福利",
              type:{
                "01":{
                    key: "01",
                    name: "社会保险费",
                    depart:{
                        "01":{
                        key: "01",
                        name: "养老保险"
                      },
                      "02":{
                        key: "02",
                        name: "医疗保险"
                      }
                    }
                  },
                  "02":{
                    key: "02",
                    name: "商业保险",
                    depart:{
                      "01":{
                        key: "01",
                        name: "人身意外保险费"
                      },
                      "02":{
                        key: "02",
                        name: "医疗保险"
                      }
                    }
                  }
              }
            }
          }
        },
        "2" : {
          key: "2",
          name: "行政",
          bus:{
            "01":{
              key: "01",
              name: "办公成本",
              type:{
                "01":{
                    key: "01",
                    name: "办公费",
                    depart:{
                        "01":{
                        key: "01",
                        name: "办公品"
                      },
                      "02":{
                        key: "02",
                        name: "饮用水"
                      }
                    }
                  },
                  "02":{
                    key: "02",
                    name: "房租费",
                    depart:{
                        "01":{
                        key: "01",
                        name: "办公室租赁费"
                      },
                      "02":{
                        key: "02",
                        name: "办公室押金"
                      }
                    }
                  }
              }
            },
            "02":{
              key: "02",
              name: "资产成本",
              type:{}
            }
          }
        }
      }
    },
    "deal": {
      "sum": 10000,
      "dealnum": 10
    }
  }
}

//查找数据
app.get('/index', function(req, res) {
  res.send(datas);
})

//添加和修改备注
app.post('/addremark', function(req, res) {
  var title = req.body.title;
  datas['data']['grid'][req.body.id]['remark'] = title;
  res.send(datas['data']['grid'][req.body.id]);
});

//删除整条数据
app.post('/del', function(req, res) {
  var id = req.body.id;
  delete datas['data']['grid'][id];
  var ress = {
    'del': 'ok',
    'id': id
  }
  res.send(ress);
});

//添加类目
app.post('/addproject', function(req, res) {
  var data = JSON.parse(req.body.data);
    datas['data']['columns']['departmentlist'] = data
  res.send(data);
});

//添加单条数据
app.post('/add', function(req, res) {
  var data = req.body;
  if (!!data.id) {
    datas['data']['grid'][data.id] = data;
  } else {
    var a = Object.keys(datas['data']['grid']);
    data.id = ~~a[a.length - 1] + 1;
    datas['data']['grid'][data.id] = data;
  }
  res.send(datas);
});

app.listen(port, function(req, res) {
  console.log('http://localhost:3000/index');
})