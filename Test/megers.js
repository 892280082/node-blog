var DateSet_Flag = 'MERGE_TYPE_|_';
var DateSet = {
	'flag':DateSet_Flag,
	'string':DateSet_Flag+'String',
	'integer':DateSet_Flag+'Integer',
	'date':DateSet_Flag+'Date'
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
			if(judgeParam(param,pojo,p,DateSet.string)){
				pojo[p] =  param[p];
				flag = true;
			}
			//Integer
			if(judgeParam(param,pojo,p,DateSet.integer)){
				try{
					pojo[p] =   Number(param[p]);
					flag = true;
				}catch(err){
					console.log("merge_error:  "+p+"property  conver error! ");
				}
			}
			//Date
			if(judgeParam(param,pojo,p,DateSet.date)){
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

function merge(req,pojo){
	var temp = pojo.constructor();
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
			temp = copyParam(option[o],pojo,option_length == option_index);
		}
	}
	return temp;
}

function Merges(){
	this.string = DateSet.string;
	this.integer = DateSet.integer;
	this.date = DateSet.date;
	this.copy = merge;
}

module.exports = new Merges();