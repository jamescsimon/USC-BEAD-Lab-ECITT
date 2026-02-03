<?php
	include_once "domlib.php";
	
	class DOMDoc extends DOMDocument {
	
		var $idIndex;

		function __construct($formatOutput=false, $preserveSpace=false, $encoding="UTF-8", $version="1.0") {
			global $domImpl;
			parent::__construct();
			$this->formatOutput=$formatOutput;
			$this->preserveSpace=$preserveSpace;
			$this->encoding=$encoding;
			$this->version=$version;
			$idIndex=array();
		}
		
		function loadXMLFile($fileURL) {
			$this->loadXML(file_get_contents($fileURL));
		}

		function saveXMLFile($fileURL) {
			file_put_contents($fileURL, $this->saveXML());
		}

		function createIdIndex() {
			createIdIndex($this->documentElement, $this->idIndex);
		}
		
		function getElementById($id) {
			return $this->idIndex[$id];
		}

		function &createElem($tagName, $content=null, $attrs=array()) {
			$elem=$this->createElement($tagName);
			setAttributes($elem, $attrs);
			if (is_string($content))
				$elem->appendChild($this->createTextNode($content));
			elseif (is_array($content)) {
				foreach ($content as $contentItem) {
					if (is_string($contentItem))
						$elem->appendChild($this->createTextNode($contentItem));
					elseif (!is_null($contentItem))
						$elem->appendChild($contentItem);
				}
			}
			elseif (!is_null($content))
				$elem->appendChild($content);
			return $elem;
		}
		
		function getElementByAttrValue($attrName, $attrValue) {
			$docElem = $this->documentElement;
			if ($docElem) {
				return getElementByAttrValue($docElem, $attrName, $attrValue);
			}
		}


		function output() {
			$content = $this->saveXML();
			$length = strlen($content);
			header("Content-Length: $length");
			echo $content;
		}

	}
