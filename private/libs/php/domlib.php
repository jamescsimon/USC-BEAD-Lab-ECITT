<?php
	$domImpl=new DOMImplementation();

	function createXMLDoc($preserveWhiteSpace=false, $formatOutput=true, $encoding="utf-8") {
		$doc=new DOMDocument();
		$doc->preserveWhiteSpace=$preserveWhiteSpace;
		$doc->formatOutput=$formatOutput;
		$doc->version="1.0";
		$doc->encoding=$encoding;
		return $doc;
	}
	
	function importSubtree($toParent, $fromParent) {
		$doc=$toParent->ownerDocument;
		$nodeList=$fromParent->childNodes;
		for ($i=0; $i<$nodeList->length; $i++) {
			$node=$nodeList->item($i);
			if ($node->nodeType==XML_CDATA_SECTION_NODE)
				$node=$doc->createTextNode($node->nodeValue);
			$toParent->appendChild($doc->importNode($node, true));
		}
	}
	
	function setIdAttributes($parentElem) {
		$nodeList=$parentElem->childNodes;
		for ($i=0; $i<$nodeList->length; $i++) {
			$node=$nodeList->item($i);
			if ($node->nodeType==XML_ELEMENT_NODE) {
				if ($node->getAttribute("id")) {
					$node->setIdAttribute("id", true);
				}
				setIdAttributes($node);
			}
		}
	}

	function createIdIndex($parentElem, &$idIndex) {
		$childElem=$parentElem->firstChild;
		while($childElem!=NULL) {
			if ($childElem->nodeType==XML_ELEMENT_NODE) {
			 	$idAttr=$childElem->getAttribute("id");
			 	if ($idAttr)
			 		$idIndex[$idAttr]=$childElem;
			 		createIdIndex($childElem, $idIndex);
			}
			$childElem=$childElem->nextSibling;
		}
	}

	function getElementById($parentElem, $id) {
		$foundElem=NULL;
		$childElem=$parentElem->firstChild;
		while($foundElem==NULL && $childElem!=NULL) {
			if ($childElem->nodeType==XML_ELEMENT_NODE) {
			 	if ($childElem->getAttribute("id")==$id)
					$foundElem=$childElem;
				else
					$foundElem=getElementById($childElem, $id);
			}
			if ($foundElem==NULL)
				$childElem=$childElem->nextSibling;
		}
		return $foundElem;
	}

	function getFirstElementByTagName($parentElem, $tagName) {
		$nodeList=$parentElem->getElementsByTagName($tagName);
		if ($nodeList->length>0)
			return $nodeList->item(0);
		else
			return NULL;
	}

	function getElementByAttrValue($parentElem, $attrName, $attrValue) {
		$foundElem=NULL;
		$childElem=$parentElem->firstChild;
		while($foundElem==NULL && $childElem!=NULL) {
			if ($childElem->nodeType==XML_ELEMENT_NODE) {
				if ($childElem->getAttribute($attrName)==$attrValue)
					$foundElem=$childElem;
				else
					$foundElem=getElementByAttrValue($childElem, $attrName, $attrValue);
			}
			if ($foundElem==NULL)
				$childElem=$childElem->nextSibling;
		}
		return $foundElem;
	}

	function pruneTree($parentElem) {
		$childElem=$parentElem->firstChild;
		while($childElem!=NULL) {
			if ($childElem->nodeType!=XML_ELEMENT_NODE || $childElem->nodeName!=$parentElem->nodeName)
				$parentElem->removeChild($childElem);
			else
				pruneTree($childElem);
			$childElem=$childElem->nextSibling;
		}
	}
	
	function setAttributes(&$elem, $attrs) {
		foreach ($attrs as $name=>$value)
			$elem->setAttribute($name, $value);
	}
