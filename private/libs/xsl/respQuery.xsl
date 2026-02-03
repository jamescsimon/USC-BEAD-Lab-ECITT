<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:include href="common.xsl"/>

	<xsl:template match="respQuery">
		<div id="queryPage" class="page">
			<table class="page" style="width:100%; border-collapse:collapse">
				<xsl:apply-templates/>
			</table>
		</div>
	</xsl:template>


	<xsl:template match="queryText">
		<tr>
			<td style="background-color:#fff; border:none; padding:1ex">
				<form action="" method="post">
					<p>
						<textarea id="queryInput" name="queryText" style="height:15em; width:calc(100% - 2px - 2ex); border:1px solid black; padding:1ex; font-family:sans-serif; font-size:16px">
							<xsl:value-of select="."/>
						</textarea>
					</p>
					<p>
						<input style="height:3em; width: 8em; font-weight:bold; font-size:1em; border:2px solid #aaa; text-align:center; background-color:#484; border-radius:15px; -webkit-user-select:none; -moz-user-select:none; user-select:none" type="submit">Submit</input>
					</p>
				</form>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="queryRes">
		<tr>
			<td style="padding:1ex; background-color:#fff; -webkit-user-select:all; -moz-user-select:all; user-select:all">
				<xsl:apply-templates/>
			</td>
		</tr>
	</xsl:template>

<xsl:template match="line">
	<p>
		<xsl:apply-templates/>
	</p>
</xsl:template>

</xsl:stylesheet>
