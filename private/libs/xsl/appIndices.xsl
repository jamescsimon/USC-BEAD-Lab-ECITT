<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:include href="common.xsl"/>
	
	<xsl:template match="appIndices">
		<div id="{@index}_page" class="page" hidden="">
			<xsl:call-template name="genPageHeading"/>
			<table class="page">
				<xsl:apply-templates mode="genIndex"/>
			</table>
		</div>
		<xsl:apply-templates>
			<xsl:with-param name="parent" select="@index"/>
		</xsl:apply-templates>
	</xsl:template>
	
	<xsl:template match="appIndex">
		<xsl:param name="parent"/>
		<div id="{@index}_page" class="page" hidden="">
			<xsl:call-template name="genPageHeading"/>
			<table class="page">
				<xsl:apply-templates/>
				<xsl:if test="$parent">
					<tr>
						<td class="page">
							<button class="navEmp wide" data-action="showPage('{../@index}')">Back</button>
						</td>
					</tr>
				</xsl:if>
				<xsl:call-template name="genAboutRow"/>
				<xsl:call-template name="genPrivacyPolicyRow"/>
				<xsl:call-template name="genGuestUsertInfoRow"/>
				<xsl:call-template name="genSupportInfoRow"/>
				<xsl:call-template name="genLicenseInfoRow"/>
			</table>
		</div>
	</xsl:template>
	
	<xsl:template match="appIndex" mode="genIndex">
		<tr>
			<td class="page">
				<button class="nav wide" data-action="showPage('{@index}')"><xsl:value-of select="@indexName"/></button>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template match="appLink">
		<tr>
			<td class="page">
				<button class="nav wide" data-action="window.location.href='../{@href}'"><xsl:value-of select="@linkName"/></button>
			</td>
		</tr>
	</xsl:template>
	
</xsl:stylesheet>
