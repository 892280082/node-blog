var DateSet_Flag = 'MERGE_TYPE_|_';
var DateSet = {
	'flag':DateSet_Flag,
	'String':DateSet_Flag+'String',
	'Number':DateSet_Flag+'Number',
	'Date':DateSet_Flag+'Date'
}

function judgeParam(param,pojo,p,type){
	var flag = false;
	if(typeof pojo[p]  != "undefined"){
		if(pojo[p] == type){
			if(typeof param[p] != "undefined"){
				return true;
			}
		}
	}
	return flag;
}

function copyParam(param,pojo,show){
	for(var p in pojo){
		if(typeof pojo[p]  == "string" &&  pojo[p].indexOf(DateSet.flag) >= 0 ){
			var flag = false;
			//String 
			if(judgeParam(param,pojo,p,DateSet.String)){
				pojo[p] =  param[p];
				flag = true;
			}
			//Integer
			if(judgeParam(param,pojo,p,DateSet.Number)){
				try{
					pojo[p] =   Number(param[p]);
					flag = true;
				}catch(err){
					console.log("merge_error:  "+p+"property  conver error! ");
				}
			}
			//Date
			if(judgeParam(param,pojo,p,DateSet.Date)){
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
	var option_length = Object.getOwnPropertyNames(option).length;
	var option_index = 1;
	for(var o in option){
		option_index++;
		if(typeof option[o] != "undefined"){
			 copyParam(option[o],pojo,option_length == option_index);
		}
	}
	return pojo;
}


var merges = {
	'String':DateSet.String,
	'Number':DateSet.Number,
	'Date':DateSet.Date,
	'copy':merge
}

module.exports = merges;

