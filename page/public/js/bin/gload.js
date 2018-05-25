/**
 * 定义全局 Raed方法， 代替绑定到window的onload方法
 * @method Read
 * @param {*callback} fn
 */
window.__proto__.Read = function (fn) {
  // 内部方法，暴露出去，保证每个调用的独立性，存在单独的域和init
  this.Read = function () {
    /**
     * XMLHttpRequest 事件绑定
     * @param {*XMLHttpRequest} x
     * @param {*callback} f
     */
    function ___L(x, f) {
        x.upload.progress = function(e) { f({"progress": e }) };
        x.load = function(e) { f({ "load": e }) };
        x.error = function(e) { f({ "error": e }) };
        x.abort = function(e) { f({ "abort": e }) };
    };
    /**
     * 文件上传 XMLHttpRequest
     * @param {*host} u
     * @param {*data array} d
     * @param {*callback} f
     */
    function _l(u, d, f) {
      var m = new FormData()
        , x = new XMLHttpRequest();
      ___L(x, f);
      for (var i of d) {
        m.append(i.name, i.file);
      };
      x.open("POST", u);
      x.send(m);
    };
    /**
     * 弹出提示
     * @param {*类型} e
     * @param {*消息} x
     */
    function _p(e, x) {
      var s = document.documentElement.offsetWidth * 0.95
        , b = document.getElementById("ReturnPrintBody")
        , r = document.createElement("DIV")
        , i = document.createElement("I")
        , l = s - s - s;
      // 初始化节点
      i.style.marginRight = "10px";
      r.style.position = "relative";
      r.style.marginTop = "10px";
      r.style.padding = "10px 20px";
      r.style.textAlign = "left";
      r.style.opacity = "1";
      r.style.backgroundColor = "#fff";
      r.style.boxShadow = "0 0 5px 2px #ddd";
      r.style.display = "table";
      r.style.left = l + "px";
      r.style.transition = "0.8s";
      // 判断消息类型
      if (e === "Error") {
        r.style.borderLeft = "3x solid #f00222";
        r.style.color = "#f00222";
        i.className = "fa fa-exclamation-circle";
      } else if (e === "Info") {
        r.style.borderLeft = "3px solid #00b150";
        r.style.color = "#999";
        i.className = "fa fa-circle";
      };
      // 初始化状态 写入容器
      r.appendChild(i);
      r.innerHTML += x;
      b.appendChild(r);
      // 开始动画
      setTimeout(function () {
        r.style.left = "0";
        r.style.opacity = 1;
      }, 500);
      // 循环执行动画
      var t = setInterval(function () {
        r.style.opacity = r.style.opacity == "0.3" ? "1" : "0.3";
      }, 2000);
      // 流程结束
      setTimeout(function () {
        r.style.left = l + "px";
        r.style.opacity = "0.3";
        // 删除节点
        setTimeout(function () {
          b.removeChild(r);
        }, 500);
        clearInterval(t);
      }, 10000);
    };
    // 弹出提示节点容器
    function _print() {
      var p = document.createElement("DIV");
      p.id = "ReturnPrintBody";
      p.style.position = "fixed";
      p.style.maxWidth = "90%";
      p.style.left = "5%";
      p.style.zIndex = 100;
      p.style.top = "10vh";
      return p;
    };
    /** 
     * 获取标准格式时间
     * @private
     */
    function _ts(n, type) {
      var y = n.getFullYear()
        , m = n.getMonth() + 1
        , d = n.getDate()
        , h = n.getHours()
        , i = n.getMinutes()
        , s = n.getSeconds();
      if (m < 10) {
        m = "0" + m.toString();
      };
      if (d < 10) {
        d = "0" + d.toString();
      };
      if (type === true) {
        if (h < 10) {
          h = "0" + h.toString();
        };
        if (i < 10) {
          i = "0" + i.toString();
        };
        if (s < 10) {
          s = "0" + s.toString();
        };
        return y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;
      } else {
        return y + "-" + m + "-" + d;
      };
    }
    /**
     * 日期加减换算
     * @private
     */
    function _adt(d, s) {
      var t = new Date(d);
      t.setDate(t.getDate() + s);
      return _ts(t);
    };
    /**
     * 验证类型
     */
    function _assert(a, b, m) {
      if (a == b) {
        return true;
      } else {
        throw new Error(m || a.toString() + " != " + b.toString());
      }
    };
    /**
     * URL查询转对象
     * @private
     */
    function _url (url) {
      var a = url.split("?")
      if (a.length === 1) {
        return {}
      } else {
        var e = {}
        for (var i = 0, k = a[1].split("&"); i < k.length; i ++) {
          var t = k[i].split("=")
          if (t.length > 1) {
            e[t[0]] = t[1]
          }
        }
        return e
      }
    };
    // 回调方法
    fn({
      LoadFile: _l,
      Print: _p,
      TimeString: _ts,
      AddDate: _adt,
      assert: _assert,
      urlQuery: _url
    });
    // 写入节点列表
    document.body.appendChild(_print());
  }
  // 把 window.onload 绑定到this.Read
  window.onload = this.Read;
};