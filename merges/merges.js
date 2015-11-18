function copyParam(param,pojo,show){
	for(var p in pojo){
		var flag = false;
		if(typeof param[p] != "undefined"){
			if(pojo[p] == String){
				pojo[p] = param[p];
				flag = true;
			}
			if(pojo[p] == Number){
				pojo[p] = Number(param[p]);
			}
			if(pojo[p] == Date ){
				var timeStr = param[p];
				timeStr = timeStr.replace(/-/g,"/");
				pojo[p] =  new Date(timeStr);
				flag = true;
			}
			if(!flag && show){
				console.log("[meger_error:]  "+p+"  property not copy!");
			}
		}
	}
	return pojo;
}

function merge(req,constructor){
	var pojo = new constructor();
	var option = {
		'body':req.body,
		'param':req.param,
		'query':req.query
	}
	var option_index = 0;
	var option_length = Object.getOwnPropertyNames(option).length;
	for(var o in option){
		option_index++;
		if(typeof option[o] != "undefined"){
			 copyParam(option[o],pojo,option_length == option_index);
		}
	}
	if(typeof pojo._mongoose == "function"){
		return new pojo._mongoose(pojo);
	}
	return pojo;
}

function createModel(origin,func){
	origin.prototype._mongoose = func;
	return origin;
}


var merges = {
	'copy':merge,
	'create':createModel
}

module.exports = merges;

