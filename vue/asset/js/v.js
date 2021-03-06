(function webpackUniversalModuleDefinition(root, factory) {
	if (typeof exports === "object" && typeof module === "object") {
		module.exports = factory()
	} else {
		if (typeof define === "function" && define.amd) {
			define(factory)
		} else {
			if (typeof exports === "object") {
				exports["validate"] = factory()
			} else {
				root["validate"] = factory()
			}
		}
	}
})(this, function() {
	return function(inputarray, errcall, ifround, newren) {
		var c = {
			ren: {
				cellphone: "^(((13[0-9]{1})|(18[0-9]{1})|(15[0-9]{1}))+\\d{8})$",
				num: "^\\d*$",
				number: "^\\d*(?:\\.\\d{1,2})?$",
				phone: "^(((13[0-9]{1})|(18[0-9]{1})|(15[0-9]{1}))+\\d{8})|((0\\d{2,3}-?)?[1-9]\\d{6,7})$",
				name: "^[\\u4E00-\\u9FA5\\uF900-\\uFA2Da-zA-Z]([\\s.]?[\\u4E00-\\u9FA5\\uF900-\\uFA2Da-zA-Z]+){1,4}$",
				otempty: function(value) {
					return value.length > 0 && /\S+/.test(value)
				}
			},
			showErr: errcall,
			cheakinput: function(input) {
				var that = this;
				var vails = input.attr("vail")
				  , errs = input.attr("errormsg");
				var ifcareempty = /otempty/gi.test(vails);
				if (!ifcareempty && input.val() <= 0) {
					return true
				}
				var regs = vails.split("|")
				  , err = errs.split("|");
				var t = true;
				for (var j = 0, len = regs.length; j < len; j++) {
					var icom = regs[j];
					console.log('input.val()',input.val())
					var ative = (typeof that.ren[icom] == "function") ? that.ren[icom](input.val(), input) : new RegExp(that.ren[icom]).test(input.val());
					if (!ative) {
						that.showErr(err[j], input);
						t = ative;
						if (!ifround) {
							return ative
						}
						break
					}
				}
				return t
			}
		};
		return function(newren) {
			var tt = true;
			inputarray.each(function() {
				var t = c.cheakinput($(this));
				if (!ifround && !t) {
					tt = t;
					return t
				}
				if (!t) {
					tt = t
				}
			});
			return tt
		}
	}
});
/*使用方法
*html
* <input type="tel" vail="otempty|cellphone" errormsg="联系手机不能为空|联系手机不正确哦"  placeholder="请输入手机号码" />
*调用
*var iftrue  = validate($('.js-validate input'), global.errcallbak, false)();
*返回true为表单验证通过
* @ tianqi
**/
