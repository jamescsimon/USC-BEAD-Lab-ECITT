<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:include href="common.xsl"/>
	
	<xsl:template match="resp">
		<div draggable="false" ontouchstart="event.preventDefault();" id="connect_page" class="page" hidden="">
			<xsl:call-template name="genPageHeading"/>
			<p id="connectPageTitle" class="subTitle"></p>
			<table class="page">
				<xsl:call-template name="genStartPairingRow"/>
				<xsl:call-template name="genSignOutRow"/>
				<xsl:call-template name="genUpdateAppRow"/>
		</table>
		</div>
		<xsl:call-template name="genLoadResPage"/>
		<div draggable="false" ontouchstart="event.preventDefault();" id="ready_page" class="page" hidden="">
			<table class="ecittLayout">
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="ready_top_readyCell" class="readyCell">
						<p id="readyMessagePara1Top" class="readyMessage"/>
						<p id="readyMessagePara2Top" class="readyMessage"/>
					</td>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="ready_mdl_readyCell" class="readyCell" style="height:80px">
					</td>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="ready_btm_readyCell" class="readyCell">
						<p id="readyMessagePara1Btm" class="readyMessage" style="font-size:32px; margin-left:3em; margin-right:3em"/>
						<p id="readyMessagePara2Btm" class="readyMessage"/>
					</td>
				</tr>
			</table>
		</div>
		<div draggable="false" ontouchstart="event.preventDefault();" id="end_page" class="page" hidden="">
			<table class="ecittLayout">
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="end_top_readyCell" class="readyCell">
						<p id="endMessagePara1Top" class="readyMessage"/>
						<p id="endMessagePara2Top" class="readyMessage"/>
					</td>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="end_mdl_readyCell" class="readyCell" style="height:80px">
					</td>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="end_btm_readyCell" class="readyCell">
						<p id="endMessagePara1Btm" class="readyMessage" style="font-size:32px; margin-left:3em; margin-right:3em"/>
						<p id="endMessagePara2Btm" class="readyMessage"/>
					</td>
				</tr>
			</table>
		</div>
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="gamePage">
		<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_page" class="page" hidden=""/>
	</xsl:template>
	
	<xsl:template match="videoPageHor">
		<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_page" data-hor="yes" class="page" style="background-color: #000" hidden="">
			<img id="{@id}_video" ontouchstart="event.preventDefault();" style="height: 100%"/>
		</div>
	</xsl:template>
	
	<xsl:template match="videoPageVer">
		<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_page" data-hor="no" class="page" style="background-color: #000" hidden="">
			<img id="{@id}_video" ontouchstart="event.preventDefault();" style="height: 100%"/>
		</div>
	</xsl:template>

	<xsl:template match="clockPage">
		<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_page" class="page" hidden="">
			<table class="page clock">
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_camTimeCell" class="page clock">
					</td>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_partRefCell" class="page clock"/>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_partBirthCell" class="page clock"/>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_partAgeCell" class="page clock"/>
				</tr>
			</table>
		</div>
	</xsl:template>
	
	<xsl:template match="ecittPage">
		<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_page" class="page" hidden="">
			<table class="ecittLayout">
				<xsl:if test="@layout='double' or @layout='triple'">
					<tr>
						<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_top_respCell" class="ecittButton" data-type="respCell">
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_top_button_resp"  class="ecittButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="top" data-action="buttonPressed('top', event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_top_button_progr" class="ecittButton" data-type="respElem" data-page="{@id}" data-name="top" data-action="progrButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_top_info"         class="testInfo"    data-type="respElem" data-page="{@id}" data-name="top"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_top_anim"         class="ecittButton" data-type="respElem" data-page="{@id}" data-name="top"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_top_empty"        class="ecittButton" data-type="respElem" data-page="{@id}" data-name="top"></div>
						</td>
					</tr>
				</xsl:if>
				<xsl:if test="@layout='triple' or @layout='single'">
					<tr>
						<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_mdl_respCell" class="ecittButton" data-type="respCell" style="height:80px">
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_mdl_button_resp"  class="ecittButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="mdl" data-action="buttonPressed('mdl', event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_mdl_button_progr" class="ecittButton" data-type="respElem" data-page="{@id}" data-name="mdl" data-action="progrButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_mdl_button_dot"   class="dotButton"   data-type="respElem" data-page="{@id}" data-name="mdl" data-action="dotButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_mdl_info"         class="testInfo"    data-type="respElem" data-page="{@id}" data-name="mdl"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_mdl_anim"         class="ecittButton" data-type="respElem" data-page="{@id}" data-name="mdl"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_mdl_empty"        class="ecittButton" data-type="respElem" data-page="{@id}" data-name="mdl"></div>
						</td>
					</tr>
				</xsl:if>
				<xsl:if test="@layout='double' or @layout='triple'">
					<tr>
						<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_btm_respCell" class="ecittButton" data-type="respCell">
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_btm_button_resp"  class="ecittButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="btm" data-action="buttonPressed('btm', event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_btm_button_progr" class="ecittButton" data-type="respElem" data-page="{@id}" data-name="btm" data-action="progrButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_btm_info"         class="testInfo"    data-type="respElem" data-page="{@id}" data-name="btm"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_btm_anim"         class="ecittButton" data-type="respElem" data-page="{@id}" data-name="btm"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_btm_empty"        class="ecittButton" data-type="respElem" data-page="{@id}" data-name="btm"></div>
						</td>
					</tr>
				</xsl:if>
			</table>
		</div>
	</xsl:template>
	
	<xsl:template match="ecittPageHor">
		<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_page" class="page" data-hor="yes" hidden="">
			<table class="ecittLayout">
				<tr>
					<xsl:if test="@layout='double' or @layout='triple'">
						<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_lft_respCell" class="ecittButton" data-type="respCell">
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_lft_button_resp"  class="ecittButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="lft" data-action="buttonPressed('lft', event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_lft_button_progr" class="ecittButton" data-type="respElem" data-page="{@id}" data-name="lft" data-action="progrButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_lft_info"         class="testInfo"    data-type="respElem" data-page="{@id}" data-name="lft"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_lft_anim"         class="ecittButton" data-type="respElem" data-page="{@id}" data-name="lft"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_lft_empty"        class="ecittButton" data-type="respElem" data-page="{@id}" data-name="lft"></div>
						</td>
					</xsl:if>
					<xsl:if test="@layout='triple' or @layout='single'">
						<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_ctr_respCell" class="ecittButton" data-type="respCell" style="width:80px">
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_ctr_button_resp"  class="ecittButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="ctr" data-action="buttonPressed('ctr', event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_ctr_button_progr" class="ecittButton" data-type="respElem" data-page="{@id}" data-name="ctr" data-action="progrButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_ctr_button_dot"   class="dotButton"   data-type="respElem" data-page="{@id}" data-name="ctr" data-action="dotButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_ctr_info"         class="testInfo"    data-type="respElem" data-page="{@id}" data-name="ctr"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_ctr_anim"         class="ecittButton" data-type="respElem" data-page="{@id}" data-name="ctr"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_ctr_empty"        class="ecittButton" data-type="respElem" data-page="{@id}" data-name="ctr"></div>
						</td>
					</xsl:if>
					<xsl:if test="@layout='double' or @layout='triple'">
						<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_rgt_respCell" class="ecittButton" data-type="respCell">
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_rgt_button_resp"  class="ecittButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="rgt" data-action="buttonPressed('rgt', event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_rgt_button_progr" class="ecittButton" data-type="respElem" data-page="{@id}" data-name="rgt" data-action="progrButtonPressed(event)"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_rgt_info"         class="testInfo"    data-type="respElem" data-page="{@id}" data-name="rgt"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_rgt_anim"         class="ecittButton" data-type="respElem" data-page="{@id}" data-name="rgt"></div>
							<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_rgt_empty"        class="ecittButton" data-type="respElem" data-page="{@id}" data-name="rgt"></div>
						</td>
					</xsl:if>
				</tr>
			</table>
		</div>
	</xsl:template>
	
	<xsl:template match="spcPage">
		<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_page" class="page" data-hor="yes" hidden="">
			<table class="spcLayout">
				<tr>
					<xsl:choose>
						<xsl:when test="@layout='single'">
							<td id="{@id}_cntr_stimCell" colspan="2" class="spcStim" data-type="stimCell" data-page="{@id}" data-name="cntr" style="text-align:center"></td>
						</xsl:when>
						<xsl:when test="@layout='double'">
							<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_left_stimCell" class="spcStim" data-type="stimCell" data-page="{@id}" data-name="left" style="text-align:left"></td>
							<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_rght_stimCell" class="spcStim" data-type="stimCell" data-page="{@id}" data-name="rght" style="text-align:right"></td>
						</xsl:when>
					</xsl:choose>
				</tr>
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_L_respCell" class="spcButton" style="text-align:left" data-type="respCell">
						<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_L_button_resp" class="spcButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="L" data-action="buttonPressed('L', event)"></div>
						<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_L_anim"        class="spcButton" data-type="respElem" data-page="{@id}" data-name="L"></div>
						<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_L_empty"       class="spcButton" data-type="respElem" data-page="{@id}" data-name="L"></div>
					</td>
					<td draggable="false" ontouchstart="event.preventDefault();" id="{@id}_R_respCell" class="spcButton" style="text-align:right" data-type="respCell">
						<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_R_button_resp" class="spcButton" data-monitored="yes" data-type="respElem" data-page="{@id}" data-name="R" data-action="buttonPressed('R', event)"></div>
						<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_R_anim"        class="spcButton" data-type="respElem" data-page="{@id}" data-name="R"></div>
						<div draggable="false" ontouchstart="event.preventDefault();" id="{@id}_R_empty"       class="spcButton" data-type="respElem" data-page="{@id}" data-name="R"></div>
					</td>
				</tr>
			</table>
		</div>
	</xsl:template>
	
	<xsl:template match="respButton">
	</xsl:template>
	
</xsl:stylesheet>
