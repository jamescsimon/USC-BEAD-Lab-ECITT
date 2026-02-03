// HTML

function createA(content, href, title, className) {
	var elem;
	elem=createElem("a", content);
	elem.setAttribute("href", href);
	if (title)
		elem.setAttribute("title", title);
	if (className)
		elem.setAttribute("class", className);
	return elem;
}

function createTd(content, className) {
	var elem;
	elem=createElem("td", content);
	if (className)
		elem.setAttribute("class", className);
	return elem;
}

function createP(content, className) {
	var elem;
	elem=createElem("p", content);
	if (className)
		elem.setAttribute("class", className);
	return elem;
}

function createImg(src, alt, className, id) {
	var imgElem;
	imgElem=new Image();
	//elem=document.createElement("img");
	imgElem.setAttribute("src", src);
	imgElem.setAttribute("alt", alt);
	if (className)
		imgElem.setAttribute("class", className);
	if (id)
		imgElem.setAttribute("id", id);
	return imgElem;
}

function createTr(content, className) {
	var elem;
	elem=createElem("tr", content);
	if (className)
		elem.setAttribute("class", className);
	return elem;
}

function createTd(content, className) {
	var elem;
	elem=createElem("td", content);
	if (className)
		elem.setAttribute("class", className);
	return elem;
}

function createDiv(content, className, id) {
	var elem;
	elem=createHtmlElem("div", content, className, id);
	return elem;
}

function createInput(type, name, value, className) {
	var elem;
	elem=createElem("input", null);
	elem.setAttribute("type", type);
	if (name)
		elem.setAttribute("name", name);
	if (value)
		elem.setAttribute("value", value);
	if (className)
		elem.setAttribute("class", className);
	return elem;
}

function createOption(value, content) {
	var elem;
	elem=createElem("option", content);
	elem.setAttribute("value", value);
	return elem;
}

function createHtmlElem(tag, content, className, id) {
	var elem;
	elem=createElem(tag, content);
	if (className)
		elem.setAttribute("class", className);
	if (id)
		elem.setAttribute("id", id);
	return elem;
}

function hideHtmlElemWithId(id) {
	var elem;
	elem=document.getElementById(id);
	if (elem) {
		elem.hidden=true;
		elem.style.visibility="hidden";
		//console.log("hideHtmlElemWithId id:"+id);
	}
	else
		console.warn("hideHtmlElemWithId ignored id:"+id);
}

function hideHtmlElem(elem) {
	if (elem) {
		elem.hidden=true;
		elem.style.visibility="hidden";
	}
	else
		console.warn("hideHtmlElem ignored");
}

function showHtmlElemWithId(id) {
	var elem;
	//console.log("showHtmlElemWithId id:"+id);
	elem=document.getElementById(id);
	if (elem) {
		elem.hidden=false;
		elem.style.visibility="visible";
	}
	else
		console.warn("showHtmlElemWithId ignored id:"+id);
}

function showHtmlElem(elem) {
	if (elem) {
		elem.hidden=false;
		elem.style.visibility="visible";
	}
	else
		console.warn("showHtmlElem ignored");
}

function disableHtmlElemWithId(id) {
	var elem;
	elem=document.getElementById(id);
	if (elem) {
		//console.log("disableHtmlElemWithId id:"+id);
		elem.disabled=true;
	}
	else
		console.warn("disableHtmlElemWithId ignored id:"+id);
}

function disableHtmlElem(elem) {
	if (elem)
		elem.disabled=true;
	else
		console.warn("disableHtmlElem ignored");
}

function enableHtmlElemWithId(id) {
	var elem;
	elem=document.getElementById(id);
	if (elem) {
		elem.disabled=false;
		//console.log("enableHtmlElemWithId id:"+id);
	}
	else
		console.warn("enableHtmlElemWithId ignored id:"+id);
}

function enableHtmlElem(elem) {
	if (elem)
		elem.disabled=false;
	else
		console.warn("enableHtmlElem ignored");
}

function getElementsByTagNameClassName(tagName, className, autoIndex) {
	var res, i, j, n, elems, elem;
	if (autoIndex!=false)
		autoIndex=true;
	elems=document.getElementsByTagName(tagName);
	res=new Array();
	n=elems.length;
	j=0;
	for (i=0; i<n; i++) {
		elem=elems.item(i);
		if (elem.className==className) {
			if (autoIndex)
				res[j++]=elem;
			else
				res[elem.getAttribute("id")]=elem;

		}
	}
	return res;
}

function getElementsByTagNameDataItem(tagName, dataItemName, dataItemValue, autoIndex) {
	var res, i, j, n, elems, elem;
	//console.log("getElementsByTagNameDataItem tagName:"+tagName+" dataItemName:"+dataItemName+" dataItemValue:"+dataItemValue);
	if (autoIndex!=false) {
		autoIndex=true;
	}
	elems=document.getElementsByTagName(tagName);
	if (autoIndex)
		res=new Array();
	else
		res=new Object();
	n=elems.length;
	j=0;
	for (i=0; i<n; i++) {
		elem=elems.item(i);
		if (elem.dataset) {
			if (elem.dataset[dataItemName]==dataItemValue) {
				if (autoIndex)
					res[j++]=elem;
				else
					res[elem.getAttribute("id")]=elem;
			}
		}
	}
	return res;
}

// XML

function getChildElementById(node, id) {
	var childNodes, resNode, i, n;
	resNode=null;
	if (node.nodeType==1) {
		if (node.getAttribute("id")==id) {
			resNode=node;
		}
		else {
			childNodes=node.childNodes;
			n=childNodes.length;
			for (i=0; i<n && !resNode; i++)
				resNode=getChildElementById(childNodes.item(i), id);
		}
	}
	return resNode;
}

function transformToCSV(elem, valueSep) {
	var csvStr, sep, attributes, i;
	if (!valueSep)
		valueSep=",";
	csvStr="";
	sep="";
	attributes=elem.attributes;
	for (i=0; i<attributes.length; i++) {
		csvStr+=sep+attributes.item(i);
		if (i==0)
			sep=valueSep;
	}
	return csvStr;
}

function createElem(tag, content) {
	var elem;
	elem=document.createElement(tag);
	if (content) {
		if (typeof content=="string")
			elem.appendChild(createTextNode(content));
		else if (typeof content=="object")
			elem.appendChild(content);
	}
	return elem;
}

function createTextNode(text) {
	return document.createTextNode(text);
}

function importChildren(parent, source) {
	var children;
	var length;
	var i;
	children=source.childNodes;
	length=children.length;
	for (i=0; i<length; i++)
		parent.appendChild(importNode(children.item(i)));
}

function importNode(node) {
	var newNode;
	var children;
	var length;
	var i;
	if (node.nodeType==1) {
		newNode=document.createElement(node.tagName);
		children=node.childNodes;
		length=children.length;
		for (i=0; i<length; i++)
			newNode.appendChild(importNode(children.item(i)));
	}
	else
		if (node.nodeType==3)
			newNode=document.createTextNode(node.nodeValue);
		else
			newNode=node;
	return newNode;
}

function replaceTextInElemWithId(id, text) {
	//console.log("replaceTextInElemWithId id:"+id+" text:"+text);
	var elem;
	elem=document.getElementById(id);
	if (elem)
		replaceText(elem, ""+text);
	else
		console.warn("replaceTextInElemWithId ignored id:"+id+" text:"+text);
}

function replaceText(elem, text) {
	//console.log("replaceText", "elem: "+elem, "text: "+text);
	removeChildren(elem);
	elem.appendChild(createTextNode(text));

}

function replaceChildrenInElemWithId(id, child) {
	var elem;
	elem=document.getElementById(id);
	if (elem && child)
		replaceChildren(elem, child);
	else
		console.warn("replaceChildrenInElemWithId ignored id:"+id+" child:"+child);
}

function replaceChildren(elem, child) {
	removeChildren(elem);
	elem.appendChild(child);
}

function appendChildToElemWithId(id, child) {
	var elem;
	elem=document.getElementById(id);
	if (elem && child)
		elem.appendChild(child);
	else
		console.warn("replaceChildrenInElemWithId ignored id:"+id+" child:"+child);
}

function removeChildrenInElemWithId(id) {
	var elem;
	elem=document.getElementById(id);
	if (elem)
		removeChildren(elem);
	else
		console.warn("removeChildrenInElemWithId ignored id:"+id);
}

function removeChildren(node) {
	var children, i, n;
	children=node.childNodes;
	n=children.length;
	for (i=0; i<n; i++)
		node.removeChild(node.lastChild);
}

function removeEmptyChildNodes(parent) {
	var curChild, nextChild;
	curChild=parent.firstChild;
	while (curChild) {
		nextChild=curChild.nextSibling;
		if (curChild.nodeType==3 && curChild.nodeValue.trim()=="") {
			parent.removeChild(curChild)
		}
		if (curChild.nodeType==1)
			removeEmptyChildNodes(curChild);

		curChild=nextChild;
	}
}

function importIdentifiedNodes(node) {
	var childNodes, i, n;
	if (node.nodeType==1) {
		if (node.id) {
			window[node.id]=node;
		}
		childNodes=node.childNodes;
		n=childNodes.length;
		for (i=0; i<n; i++)
			importIdentifiedNodes(childNodes.item(i));
	}
}

function setPageElemRefs(elemIds) {
	elemIds.forEach(setPageElemRef);
}

function setPageElemRef(elemId) {
	window[elemId]=document.getElementById(elemId);
}

function getCSVAttribute(elem, attrName) {
	var str, list;
	str=elem.getAttribute(attrName);
	if (!str)
		list=new Array();
	else
		list=str.split(",");
	return list;
}
