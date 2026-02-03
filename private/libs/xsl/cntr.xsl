<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:include href="common.xsl"/>
	
	<xsl:template match="cntr">
		<div id="connect_page" class="page" hidden="">
			<xsl:call-template name="genPageHeading"/>
			<p id="connectPageTitle" class="subTitle"></p>
			<table class="page">
				<xsl:call-template name="genConnectRow"/>
				<xsl:call-template name="genSignOutRow"/>
			</table>
		</div>
		<div id="appType_page" class="page" hidden="">
			<h1 class="pageHeading">Select App</h1>
			<table class="page">
				<tr>
					<td class="page">
						<button type="button" id="gotoGamesButt" class="nav medium" data-action="enterGamesApp()">Games</button>
					</td>
				</tr>
				<tr>
					<td class="page">
						<button type="button" id="gotoTestsButt" class="nav medium" data-action="enterTestsApp()">Tests</button>
					</td>
				</tr>
				<tr>
					<td class="page">
						<button type="button" id="disconnectButton" class="actionAlert medium" data-action="disconnect()">Disconnect</button>
					</td>
				</tr>
			</table>
		</div>
		<xsl:apply-templates select="entityPageSet"/>
		<xsl:apply-templates select="selectPage"/>
		<div id="awaitStart_page" class="page" hidden=""/>
		<div id="newGame_page" class="page" hidden="">
			<h1 class="pageHeading">Select Game</h1>
			<table class="page">
				<xsl:apply-templates select="gameCntrDir" mode="genIndex"/>
				<tr>
					<td class="page">
						<button type="button" class="nav medium" data-action="touchGame()">Touch</button>
					</td>
				</tr>
				<tr>
					<td class="page">
						<button type="button" id="exitGamesButton" class="actionAlert medium" data-action="exitGames()">Exit</button>
					</td>
				</tr>
			</table>
		</div>
		<xsl:apply-templates mode="genPage"/>
	</xsl:template>
	
	<xsl:template match="gameCntr" mode="genIndex">
		<tr>
			<td class="page">
				<button type="button" id="{@game}_newGameButt" class="nav medium" data-action="startNewGame('{@game}')"><xsl:value-of select="@gameName"/></button>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template match="gameCntrDir" mode="genIndex">
		<tr>
			<td class="page">
				<button type="button" id="{@game}_newGameButt" class="select medium" data-action="flipGame('{@game}')"><xsl:value-of select="@gameName"/></button>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template match="gameCntr" mode="genPage">
		<div id="{@game}_index_page" class="page" hidden="">
			<xsl:call-template name="genPageHeading"/>
			<p class="subTitle"><xsl:value-of select="@gameName"/></p>
			<table class="page">
				<xsl:apply-templates mode="genIndex"/>
				<tr>
					<td class="page">
						<button type="button" class="action medium" data-action="touchGame()">Touch</button>
					</td>
				</tr>
				<tr>
					<td class="page">
						<button type="button" class="actionAlert medium" data-action="endGame()">Exit</button>
					</td>
				</tr>
			</table>
		</div>
		<xsl:apply-templates mode="genPage"/>
	</xsl:template>
<xsl:template match="testCntrRow" mode="genIndex">
		<tr>
			<xsl:apply-templates mode="genIndex"/>
		</tr>
	</xsl:template>
	
	<xsl:template match="testCntr" mode="genIndex">
		<td class="page">
			<xsl:if test="@test!=''">
				<button type="button" id="{@test}_newTestButt" class="nav medium" data-action="startNewTest('{@test}')"><xsl:value-of select="@testName"/></button>
			</xsl:if>
		</td>
	</xsl:template>
	
	<xsl:template match="testCntr" mode="genPage">
		<xsl:if test="@test!=''">
			<div id="{@test}_index_page" class="page" hidden="">
				<h1 class="pageHeading">Select Trial Set</h1>
				<p class="subTitle"><xsl:value-of select="@testName"/></p>
				<table class="page">
					<xsl:apply-templates mode="genIndex"/>
				</table>
				<table class="page">
					<tr>
						<xsl:call-template name="genClockButtonCell"/>
					</tr>
					<tr>
						<td class="page">
							<button type="button" class="actionAlert medium" data-action="endTest()">End</button>
						</td>
					</tr>
				</table>
			</div>
			<xsl:apply-templates mode="genPage"/>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="configCntr" mode="genIndex">
		<tr>
			<td class="page">
				<button type="button" class="nav medium" data-action="gotoTrials('{../@test}', '', '{@config}')">
					<xsl:value-of select="@configName"/>
				</button>
			</td>
			<xsl:if test="../@test!='phb'">
				<xsl:call-template name="genTrialCounterCells">
					<xsl:with-param name="idPrefix" select="concat(../@test, '_', @config, '_index')"/>
				</xsl:call-template>
			</xsl:if>
		</tr>
	</xsl:template>
	
	<xsl:template match="testListDivider" mode="genIndex">
		<tr><td colspan="5"><hr/></td></tr>
	</xsl:template>
	
	<xsl:template match="testListHeading" mode="genIndex">
		<tr><td colspan="5" class="testListHeading"><xsl:value-of select="@heading"/></td></tr>
	</xsl:template>
	
	
	<xsl:template match="trialTypeTotalRow">
		<tr>
			<td class="trialCntrSection" id="{@test}_{@total}_frameCell">
				<table class="trialCounter">
					<tr data-type="totalRow" data-testname="{@test}" data-configname="{../@config}" data-totalname="{@total}" data-trialtypes="{@trialTypes}" data-trialphases="{@trialPhases}" data-reflect="{@reflect}" data-countrscc="{@countRscc}">
						<xsl:call-template name="genTrialCounterCells">
							<xsl:with-param name="counterName" select="@totalName"/>
							<xsl:with-param name="idPrefix" select="concat(@test, '_', @total, '_total')"/>
						</xsl:call-template>
					</tr>
				</table>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template match="gameConfigCntr" mode="genPage">
		<div id="{../@test}_{@config}_trials_page" class="page" hidden="">
			<table class="trialCntrSection">
				<xsl:apply-templates>
					<xsl:with-param name="idPrefix" select="concat(../@test, '_', @config)"/>
				</xsl:apply-templates>
			</table>
			<table class="page tight">
				<tr>
					<td class="page">
						<button type="button" class="actionAlert medium" id="{../@test}_{@config}_endTrialsButt" data-action="endTrials()">End</button>
					</td>
				</tr>
			</table>
		</div>
	</xsl:template>
	
	<xsl:template match="gameTrialCntrDir" mode="genIndex">
		<xsl:param name="idPrefix" select="''"/>
		<tr>
			<td class="startGameTrialButton">
				<button type="button" id="{@test}_{@trialType}_trial_startGameTrialButt" class="select medium" data-text="{@trialName}" data-action="flipTrial('{@test}', '{@trialType}', 'trial', 1)">
					<xsl:value-of select="@trialName"/>
				</button>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template match="gameTouch" mode="genIndex">
		<tr>
			<td class="page">
				<button type="button" class="nav medium" data-action="touchGame()">Touch</button>
			</td>
		</tr>
	</xsl:template>

	
	<xsl:template match="gameTrialCntr">
		<xsl:param name="idPrefix" select="''"/>
		<tr>
			<td class="page">
				<button type="button" class="nav medium" data-action="touchGame()">Touch</button>
			</td>
			<td/>
		</tr>
		<tr>
			<td class="startTrialButton">
				<button type="button" id="{$idPrefix}_{@trialType}_trial_startTrialButt" class="select medium" data-text="{@trialName}" data-action="flipTrial('{@test}', '{@trialType}', 'trial', 1)">
					<xsl:value-of select="@trialName"/>
				</button>
			</td>
			<td id="{$idPrefix}_resCell" class="respTime" style="color:#0b0"></td>
		</tr>
	</xsl:template>
	
	<xsl:template match="configCntr" mode="genPage">
		<div id="{../@test}_{@config}_trials_page" class="page" hidden="">
			<table class="trialCntrSection">
				<xsl:apply-templates>
					<xsl:with-param name="idPrefix" select="concat(../@test, '_', @config)"/>
				</xsl:apply-templates>
			</table>
			<table class="page tight">
				<tr>
					<td class="page">
						<button type="button" class="actionAlert medium" id="{../@test}_{@config}_endTrialsButt" data-action="endTrials()">End</button>
					</td>
				</tr>
			</table>
		</div>
	</xsl:template>
	
	<xsl:template match="trialCntr">
		<xsl:param name="idPrefix" select="''"/>
		<tr>
			<td class="trialCntrSection" id="{@test}_{@trialType}_{@trialPhase}_frameCell">
				<table class="trialCounter">
					<tr class="res" id="{@test}_{@trialType}_{@trialPhase}_resRow" data-testname="{@test}" data-configname="{../@config}" data-trialtype="{@trialType}" data-trialphase="{@trialPhase}" data-reflect="{@reflect}" data-countrscc="{@countRscc}" data-reqrscc="{@reqRscc}">
						<xsl:call-template name="genTrialCounterCells">
							<xsl:with-param name="counterName" select="@trialName"/>
							<xsl:with-param name="idPrefix" select="concat(@test, '_', @trialType, '_', @trialPhase)"/>
						</xsl:call-template>
					</tr>
				</table>
				<table class="trialButton">
					<tr>
						<td class="startTrialButton">
							<xsl:choose>
								<xsl:when test="@single='yes'">
									<button type="button" id="{@test}_{@trialType}_{@trialPhase}_1_startTrialButt" class="select small" data-text="x 1" data-action="flipTrial('{@test}', '{@trialType}', '{@trialPhase}', 1, '{@nextSingleTrialType}', '{@nextSingleTrialRepeat}')">
										<xsl:text>x 1</xsl:text>
									</button>
								</xsl:when>
								<xsl:otherwise>
									<button type="button" class="select small" data-text="-" disabled=""/>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td class="startTrialButton">
							<xsl:choose>
								<xsl:when test="@repeat">
									<button type="button" id="{@test}_{@trialType}_{@trialPhase}_{@repeat}_startTrialButt" class="select small"  data-text="x {@repeat}" data-action="flipTrial('{@test}', '{@trialType}', '{@trialPhase}', {@repeat}, '{@nextMultiTrialType}', '{@nextMultiTrialRepeat}')">
										<xsl:text>x </xsl:text><xsl:value-of select="@repeat"/>
									</button>
								</xsl:when>
								<xsl:otherwise>
									<button type="button" class="select small" data-text="-" disabled=""/>
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td class="cancelTrialButton">
							<button type="button" class="nav small" id="{$idPrefix}_{@trialType}_{@trialPhase}_cancelButt" data-action="cancelTrial()">Cancel</button>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template match="trialSect">
		<tr>
			<td class="trialCntrSection" id="{@test}_{@trialType}_{@trialPhase}_frameCell">
				<xsl:apply-templates/>
			</td>
		</tr>
	</xsl:template>
	
	<xsl:template match="trialCounters">
		<xsl:variable name="idPrefix" select="concat(../@test, '_', ../@trialType, '_', ../@trialPhase)"/>
		<table class="trialCounter">
			<tr class="res" id="{$idPrefix}_resRow" data-testname="{../@test}" data-configname="{../../@config}" data-trialtype="{../@trialType}" data-trialphase="{../@trialPhase}" data-reflect="{@reflect}" data-countrscc="{@countRscc}" data-reqrscc="{@reqRscc}">
				<xsl:call-template name="genTrialCounterCells">
					<xsl:with-param name="counterName" select="../@trialName"/>
					<xsl:with-param name="idPrefix" select="$idPrefix"/>
				</xsl:call-template>
			</tr>
		</table>
	</xsl:template>
	
	
	<xsl:template match="projectRow">
		<tr>
			<xsl:apply-templates/>
		</tr>
	</xsl:template>
	
	<xsl:template match="project">
		<td class="page">
			<xsl:if test="@id!=''">
				<button type="button" class="nav medium" data-action="enterProject('{@id}')">
					<xsl:value-of select="@id"/>
				</button>
			</xsl:if>
		</td>
	</xsl:template>
	
	<xsl:template match="regButtons">
		<table class="regButton">
			<tr>
				<xsl:apply-templates/>
				<td class="cancelTrialButton">
					<button type="button" id="{../@test}_{../@trialType}_{../@trialPhase}_undoButton" class="nav small" data-type="undoButton" data-action="undoReg()">Undo</button>
				</td>
			</tr>
		</table>
	</xsl:template>
	
	<xsl:template match="regButton">
		<td class="regButton">
			<button type="button" class="select small" data-action="regResponse('{../../@test}', '{../../@trialType}', '{../../@trialPhase}', '{@name}')">Reach <xsl:value-of select="@name"/></button>
		</td>
	</xsl:template>
	
	<xsl:template name="genTrialCounterCells">
		<xsl:param name="counterName" select="''"/>
		<xsl:param name="idPrefix"/>
		<xsl:if test="$counterName!=''">
			<td id="{$idPrefix}_name_resCell" class="trialCounterName"><xsl:value-of select="$counterName"/></td>
		</xsl:if>
		<td id="{$idPrefix}_totl_resCell" class="trialCounter" style="color:#fff"></td>
		<td id="{$idPrefix}_succ_resCell" class="trialCounter" style="color:#0b0"></td>
		<td id="{$idPrefix}_fail_resCell" class="trialCounter" style="color:#d00"></td>
		<td id="{$idPrefix}_rscc_resCell" class="trialCounter" style="color:#fe4"></td>
	</xsl:template>
	
</xsl:stylesheet>
