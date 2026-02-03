<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:include href="common.xsl"/>
	
	<xsl:template match="dmgr">
		<div id="appType_page" class="page" hidden="">
			<h1 class="pageHeading">Select App</h1>
			<table class="page">
				<tr>
					<td class="page">
						<button type="button" id="gotoTestsButt" class="nav medium" data-action="enterTestsApp()">Tests</button>
					</td>
				</tr>
				<xsl:call-template name="genSignOutRow"/>
			</table>
		</div>
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="syncPointsPage">
		<div id="syncPoints_page" class="page" hidden="">
			<xsl:call-template name="genPageHeading"/>
			<p class="page">
				<button type="button" class="actionAlert medium" data-action="exitSyncPoints()">Exit</button>
			</p>
			<table id="syncPointsTable" class="page" style="background-color: #fff"/>
		</div>
	</xsl:template>
	
	<xsl:template match="partInfoPage">
		<div id="partInfo_page" class="page" hidden="">
			<xsl:call-template name="genPageHeading"/>
			<p class="page">
				<button type="button" class="nav medium" data-action="enterSyncPoints()">Sync Points</button>
			</p>
			<p class="page">
				<a id="ntsMarkersLink" class="downloadLink" href="" download="" disabled="true">NTS Markers</a>
			</p>
			<p class="page">
				<button type="button" class="actionAlert medium" data-action="exitPartInfo()">Exit</button>
			</p>
		</div>
	</xsl:template>
	
</xsl:stylesheet>
