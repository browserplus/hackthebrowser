function initCB(result) {
  if (!result.success) {
    if (result.error == "bp.notInstalled") {
	  alert("BrowserPlus is not installed!"); 
    } else {
      msg = "BrowserPlus platform initialization failed\n"
      msg += result.error
      alert(msg);
    }
    return;
  }

  BrowserPlus.listActiveServices(updateCoreletList);

  updateVersionTitle(BrowserPlus.getPlatformInfo());
}

function resultsFunc(results)
{
  var target = document.getElementById("functionOutput");

  if (target != null)
  {
    var pre = document.createElement("pre");
    pre.appendChild(document.createTextNode(
	  JSON.stringify(results, null, "  ")));
    target.appendChild(pre);
  }
}

// We always try to cancel the last transaction before starting a new
// one
g_lastTransaction = 0;

function executeFunction(corelet, version,
                         function_name, params)
{
  var target = document.getElementById("functionOutput");

  if (target != null)
  {
    while (target.childNodes.length > 0) {
      target.removeChild(target.firstChild);
    }
  }

  var paramObj = {};

  for (j in params)
  {
    if (params[j].type == "callback") {
      paramObj[params[j].name] = resultsFunc;
    } else {
      var input = document.getElementById("execArg_" + params[j].name);
      var val = input.value;
	  // don't include blank optional arguments.
      if (val.length == 0 && params[j].required == false) continue;
      switch (params[j].type) {
      case "list":
      case "map":
        paramObj[params[j].name] = JSON.parse(val);
        break;
      case "integer": 
      case "double": 
        // XXX catch exceptions
        paramObj[params[j].name] = Number(val);
        break;
      case "boolean":
        paramObj[params[j].name] = /^(1|t|true|y|yes)$/i.test(val);
        break;
      default:
        paramObj[params[j].name] = val;
      }
    }
  }

  g_lastTransaction = 
	BrowserPlus[corelet][function_name](paramObj, resultsFunc);

}

function displayExecFunction(corelet, version,
                             function_name, params)
{
  var target = document.getElementById("rightBar");

  while (target.childNodes.length > 0) {
    target.removeChild(target.firstChild);
  }

  var title = document.createElement("div");
  title.setAttribute("className", "moduleTitle");
  title.setAttribute("class", "moduleTitle");
  title.appendChild(document.createTextNode("(execute) BrowserPlus." +
                                            corelet + "[\"" + version
                                            + "\"]." + function_name));
  target.appendChild(title);  

  var disp = document.createElement("div");
  disp.setAttribute("className", "moduleContent");
  disp.setAttribute("class", "moduleContent");

  var p = document.createElement("p");
  disp.appendChild(p);

  var form = document.createElement("form");
  form.setAttribute("name", "execform");
  for (j in params)
  {
    // don't render an input box for callbacks
    if (params[j].type != "callback") {
      form.appendChild(document.createTextNode(params[j].name + ": "));
      var input = document.createElement("input");
      input.setAttribute("id", "execArg_" + params[j].name);
      form.appendChild(input);
      form.appendChild(document.createElement("br"));
    }
  }
  form.appendChild(document.createElement("br"));
  var submit = document.createElement("input");
  submit.setAttribute("type", "submit");
  submit.setAttribute("value", "execute " + function_name);
  form.appendChild(submit);
  form.onsubmit = function() {
    var _corelet = corelet;
    var _version = version;
    var _func = function_name;
    var _params = params;
    return function () 
    {
      executeFunction(_corelet, _version, _func, _params);
      return false;
    }}();
  disp.appendChild(form);

  var div = document.createElement("div");
  div.setAttribute("id", "functionOutput");
  div.innerHTML = " ";
  disp.appendChild(div);
  
  target.appendChild(disp);
}

function displayCorelet(details)
{
  if (details.error) {
    alert("enumerate corelets failed!: " +
          JSON.stringify(details));
    return false;
  }
  details = details.value;

  var target = document.getElementById("rightBar");

  while (target.childNodes.length > 0) {
    target.removeChild(target.firstChild);
  }

  var title = document.createElement("div");
  title.setAttribute("class", "moduleTitle");
  title.setAttribute("className", "moduleTitle");
  title.appendChild(document.createTextNode("\"" +
                                            details.name +
                                            "\" Service, version "
                                            + details.versionString));
  target.appendChild(title);  

  var disp = document.createElement("div");
  disp.setAttribute("class", "moduleContent");
  disp.setAttribute("className", "moduleContent");

  p = document.createElement("p");
  p.appendChild(document.createTextNode(details.documentation));  
  disp.appendChild(p);

  for (i in details.functions)
  {
    var ref = document.createElement("a");
    ref.href = "#"
    ref.appendChild(document.createTextNode(details.functions[i].name));
    onClickFunc = (function()
                   { var cname = details.name;
                     var cversion = details.versionString;
                     var fname = details.functions[i].name;
                     var fparams = details.functions[i].parameters;
                     return function(evt) {
                       displayExecFunction(cname, cversion,
                                           fname, fparams);
                       return false;
                     }})();
    ref.onclick = onClickFunc;
    disp.appendChild(ref);

    disp.appendChild(document.createTextNode(" - "));
    disp.appendChild(
      document.createTextNode(details.functions[i].documentation));

    var ul = document.createElement("ul");
    for (j in details.functions[i].parameters)
    {
      var arg = details.functions[i].parameters[j];
      var li = document.createElement("li");          
      if (!arg.required) li.appendChild(document.createTextNode("["));
      li.appendChild(document.createTextNode(arg.type + " "));
      var ital = document.createElement("i");
      ital.appendChild(document.createTextNode(arg.name));
      li.appendChild(ital);
      if (!arg.required) li.appendChild(document.createTextNode("]"));
      li.appendChild(document.createTextNode(" - "));
      li.appendChild(document.createTextNode(arg.documentation));
      ul.appendChild(li);
    }
    disp.appendChild(ul);
  }

  target.appendChild(disp);
}

function updateCoreletList(corelets) {
  if (corelets.error) {
    alert("enumerate services failed!: " + JSON.stringify(corelets));
    return;
  }

  var qtarget = document.getElementById("coreletDisplayArea");

  list = document.createElement("ul");

  var services = [];
  var keys = [];
  for (var x in corelets.value) {
	var n = corelets.value[x].name;
	var v = corelets.value[x].version;
	if (services[n]) {
	  services[n].push(v);
	} else {
	  services[n] = [v];
	  keys.push(n);
	}
  }
  keys = keys.sort(function(x,y){ 
	var a = String(x).toUpperCase(); 
	var b = String(y).toUpperCase(); 
	if (a > b) return 1 
	if (a < b) return -1 
	return 0; 
  }); 

  for (var i = 0; i < keys.length; i++)
  {
	service = keys[i];
	for (var j = 0; j < services[service].length; j++)  {
	  version = services[service][j];
	  elem = document.createElement("li");

	  ref = document.createElement("a");
	  ref.href = "#"
	  ref.appendChild(document.createTextNode(service));

	  onClickFunc = (function()
					 { var x = service;
					   var y = version;
					   return function(evt) {
						 var sDesc = {service: x, version: y};
						 if (BrowserPlus.isServiceLoaded(x,y)) {
						   BrowserPlus.describeService(
							 sDesc, displayCorelet);
						 } else {
						   BrowserPlus.require(
							 {services: [sDesc]},
							 function (res) {
							   BrowserPlus.describeService(
								 sDesc, displayCorelet);
							 });
						 }
						 return false;
					   }})();
	  ref.onclick = onClickFunc;
      
	  elem.appendChild(ref);
	  resText = ": " + version;
	  elem.appendChild(document.createTextNode(resText));
	  list.appendChild(elem);
	}
  }

  // now update the document
  qtarget.replaceChild(list, qtarget.childNodes[0]);
}


function updateVersionTitle(info) {
  var target = document.getElementById("bplusTitle");
  while (target.childNodes.length > 0) {
	target.removeChild(target.firstChild);
  }
  var title = "BrowserPlus " + info.version +
	" (" + info.os + ") Online Help";
  target.appendChild(document.createTextNode(title));
}

BrowserPlus.init(initCB);
