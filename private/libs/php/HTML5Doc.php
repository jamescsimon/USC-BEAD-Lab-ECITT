<?php
	include_once "domlib.php";
	include_once "DOMDoc.php";

	class HTML5Doc extends DOMDoc {
	
		var $docTypeElem;
		var $htmlElem;
		var $headElem;
		var $bodyElem;
		var $titleElem;
		
		function __construct($title="", $lang="no", $formatOutput=true, $preserveSpace=false, $encoding="UTF-8") {
			global $domImpl;
			parent::__construct($formatOutput, $preserveSpace, $encoding, "1.0");
		
			$this->htmlElem=$this->createElement("html");
			$this->htmlElem->setAttribute("lang", $lang);
			$this->appendChild($this->htmlElem);
		
			$this->headElem=$this->createElement("head");
			$this->htmlElem->appendChild($this->headElem);
		
			$this->addMetaElem("http-equiv", "Content-Type", "text/html; charset=$encoding");
		
			$this->titleElem=$this->createElement("title");
			$this->titleElem->nodeValue=$title;
			$this->headElem->appendChild($this->titleElem);
		
			$this->bodyElem=$this->createElement("body");
			$this->htmlElem->appendChild($this->bodyElem);
		}
		
		function output() {
			header("Content-type: text/html; charset=UTF-8");
			echo "<!DOCTYPE html>\n";
			echo $this->saveHTML();
		}
		
		// Utilities
		
		function appendP($content) {
			$this->bodyElem->appendChild($this->createP($content));
		}
		
		function appendElem(&$elem) {
			$this->bodyElem->appendChild($elem);
		}
		
		function addMetaElem($varType, $varName, $content) {
			$elem=$this->createElement("meta");
			$elem->setAttribute($varType, $varName);
			$elem->setAttribute("content", $content);
			$this->headElem->appendChild($elem);
		}
		
		function addCssLink($href, $attrs=array()) {
			$elem=$this->createElem("link", null, array("href"=>$href, "rel"=>"stylesheet", "type"=>"text/css")+$attrs);
			$this->headElem->appendChild($elem);
		}
		
		function addIconLink($href, $rel, $attrs=array()) {
			$elem=$this->createElem("link", null, array("href"=>$href, "rel"=>$rel)+$attrs);
			$this->headElem->appendChild($elem);
		}

		function addJsLink($src, $attrs=array()) {
			$elem=$this->createElem("script", "", array("src"=>$src, "type"=>"text/javascript")+$attrs);
			$this->headElem->appendChild($elem);
		}
	
		// Content creators
	
		function &createForm($content=null, $action="", $method="get", $attrs=array()) {
			$elem=$this->createElem("form", $content, array("action"=>$action, "method"=>$method)+$attrs);
		return $elem;
		}

		function &createInputText($name, $value, $size, $attrs=array()) {
			$elem=$this->createElem("input", null, array("type"=>"text", "name"=>$name, "value"=>$value, "size"=>$size)+$attrs);
			return $elem;
		}
		
		function &createInputFile($name, $attrs=array()) {
			$elem=$this->createElem("input", null, array("type"=>"file", "name"=>$name)+$attrs);
			return $elem;
		}
		
		function &createInputSubmit($name, $value, $attrs=array()) {
			$elem=$this->createElem("input", null, array("type"=>"submit", "name"=>$name, "value"=>$value)+$attrs);
			return $elem;
		}

		function &createInputCheckBox($name, $checked=false, $attrs=array()) {
			$elem=$this->createElem("input", null, array("type"=>"checkbox", "name"=>$name, "checked"=>$checked)+$attrs);
			return $elem;
		}

		function &createInputRadio($name, $value, $checked=false, $attrs=array()) {
			$elem=$this->createElem("input", null, array("type"=>"radio", "name"=>$name, "value"=>$value, "checked"=>$checked)+$attrs);
			return $elem;
		}
		
		function &createInputHidden($name, $value, $attrs=array()) {
			$elem=$this->createElem("input", null, array("type"=>"hidden", "name"=>$name, "value"=>$value)+$attrs);
			return $elem;
		}

		function &createButton($type, $content=null, $attrs=array()) {
			$elem=$this->createElem("button", $content, array("type"=>$type)+$attrs);
			return $elem;
		}
		
		function &createUl($content=null, $attrs=array()) {
			$elem=$this->createElem("ul", $content, $attrs);
			return $elem;
		}

		function &createOl($content=null, $attrs=array()) {
			$elem=$this->createElem("ol", $content, $attrs);
			return $elem;
		}

		function &createLi($content=null, $attrs=array()) {
			$elem=$this->createElem("li", $content, $attrs);
			return $elem;
		}

		function &createP($content=null, $attrs=array()) {
			$elem=$this->createElem("p", $content, $attrs);
			return $elem;
		}

		function &createDiv($content=null, $attrs=array()) {
			$elem=$this->createElem("div", $content, $attrs);
			return $elem;
		}

		function &createA($content=null, $href, $attrs=array()) {
			$elem=$this->createElem("a", $content, array("href"=>$href)+$attrs);
			return $elem;
		}

		function &createH($level, $content=null, $attrs=array()) {
			$elem=$this->createElem("h$level", $content, $attrs);
			return $elem;
		}
		
		function &createHr($content=null, $attrs=array()) {
			$elem=$this->createElem("hr", $content, $attrs);
			return $elem;
		}
		
		function &createSpan($content=null, $attrs=array()) {
			$elem=$this->createElem("span", $content, $attrs);
			return $elem;
		}
	}

?>
