<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:include href="common.xsl"/>
	
	<xsl:template match="clock">
		<div draggable="false" ontouchstart="event.preventDefault();" id="clock_page" class="page" hidden="">
			<table class="page clock">
				<tr>
					<td draggable="false" ontouchstart="event.preventDefault();" id="clockCell" class="page clock">
					</td>
				</tr>
			</table>
		</div>
	</xsl:template>

</xsl:stylesheet>
