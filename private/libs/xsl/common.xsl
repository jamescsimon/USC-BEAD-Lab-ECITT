<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:preserve-space elements=""/>
	<xsl:strip-space elements="*"/>
	
	<xsl:param name="environment" select="'browser'"/>
	<xsl:param name="appVersion" select="'0.00'"/>
	<xsl:param name="deviceType" select="'tablet'"/>
	
	<xsl:template match="ecittApp">
		<xsl:variable name="appTitle">
			<xsl:choose>
			<xsl:when test="@appName!=''">
				<xsl:text>TT </xsl:text><xsl:value-of select="@appName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>TouchTasks</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<html>
		<head>
			<title>TouchTasks<xsl:if test="@appName!=''"><xsl:text> </xsl:text><xsl:value-of select="@appName"/></xsl:if></title>
			<xsl:if test="$deviceType='tablet'">
				<meta name="apple-mobile-web-app-capable" content="yes"/>
				<meta name="mobile-web-app-capable" content="yes"/>
				<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
				<meta name="apple-mobile-web-app-title" content="{$appTitle}"/>
				<xsl:choose>
					<xsl:when test="@scrolling='off'">
						<meta name="viewport" content="user-scalable=no, width=device-width, height=device-height"/>
					</xsl:when>
					<xsl:otherwise>
						<meta name="viewport" content="user-scalable=no, width=device-width, maximum-scale=1.0, minimum-scale=1.0"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:if>
			<link rel="apple-touch-icon" href="../graphics/icons/icon_196x196.png"/>
			<link rel="icon" sizes="196x196" href="../graphics/icons/icon_196x196.png"/>
			<link href="../css/styles.css" rel="stylesheet" type="text/css"/>
			<script src="../js/xmllib.js" type="text/javascript"/>
			<script src="../js/media.js" type="text/javascript"/>
			<xsl:if test="@inclDmg='yes'">
				<script src="../js/dmglib.js" type="text/javascript"/>
			</xsl:if>
			<script src="../js/comm.js" type="text/javascript"/>
			<script src="../js/lib.js" type="text/javascript"/>
			<script src="../js/{@app}.js" type="text/javascript"/>
			<xsl:if test="@inclScore='yes'">
				<script src="../js/scorelib.js" type="text/javascript"/>
			</xsl:if>
			<xsl:if test="@inclGame='yes'">
				<script src="../js/game.js" type="text/javascript"/>
			</xsl:if>
		</head>
		<body onload="{@app}Init('{@scrolling}', '{@cached}', '{@preload}', '{$environment}', '{@offline}', '{@offlineApp}', '{@remote}', '{@rotateHor}', '{@recLoc}')" data-app="{@app}" data-appversion="{$appVersion}">
			<xsl:apply-templates/>
			<xsl:if test="@scrolling='off'">
				<div id="landscape_page" class="page" hidden="">
					<h1 class="pageHeading">Please keep in upright position</h1>
				</div>
			</xsl:if>
			<xsl:call-template name="genAuthPage"/>
		</body>
	</html>
</xsl:template>


<xsl:template name="genAuthPage">
	<div id="auth_page" class="page" hidden="">
		<xsl:call-template name="genPageHeading"/>
		<table class="page">
			<tr>
				<td id="userNameInputCell" class="page">
					<input type="text" id="usernameInput" class="textField medium" value="" placeholder="Username" autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false" onfocus="" onblur=""/>
				</td>
			</tr>
			<tr>
				<td id="userPasswordInputCell" class="page">
					<input type="password" id="passwordInput" class="textField medium" value="" placeholder="Password" autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false" onfocus="" onblur=""/>
				</td>
			</tr>
			<tr>
				<td class="page">
					<button type="button" id="signInButton" class="action medium" data-action="signIn()">Sign in</button>
				</td>
			</tr>
		</table>
	</div>
</xsl:template>

<xsl:template name="genLoadResPage">
	<div id="loadRes_page" class="page" hidden="">
		<xsl:call-template name="genPageHeading"/>
		<p class="subTitle">Updating Cache</p>
		<table class="page">
			<xsl:call-template name="genCacheMsgRow"/>
		</table>
	</div>
</xsl:template>


<xsl:template  match="entityPageSet">
	<div id="{@idLc}Select_page" class="page" hidden="">
		<h1 class="pageHeading">Select <xsl:value-of select="@nameUc"/></h1>
		<p id="{@idLc}ContextPara" class="subTitle"></p>
		<table class="page">
			<tr>
				<td class="page" colspan="2">
					<input type="text" id="{@idLc}Search" class="textField autoWidth" style="text-align:left; padding: 0 1em" placeholder="Search for {@nameUc}" autocomplete="off" spellcheck="false" onfocus="" onblur="" oninput="searchChanged('{@idLc}')"/>
				</td>
			</tr>
			<tr>
				<td class="page" colspan="2">
					<select id="{@idLc}Select" class="page autoWidth" placeholder="Select {@nameUc}" autocomplete="off" spellcheck="false" onfocus="" onblur="" onchange="{@idLc}SelectChanged()"/>
				</td>
			</tr>
			<tr>
				<td class="page">
					<button type="button" id="{@idLc}CreateNewButton" class="nav medium" data-action="{@idLc}CreateNew()" disabled="true">Add new</button>
				</td>
				<td class="page">
					<button type="button" id="{@idLc}FlipEditableButton" class="nav medium" data-action="{@idLc}FlipEditable()" disabled="true">Edit</button>
				</td>
			</tr>
			<tr id="{@idLc}UpdateButtonsRow" hidden="">
				<td class="page">
					<button type="button" id="{@idLc}UpdateCurButton" class="nav medium" data-action="{@idLc}UpdateCur()" disabled="true">Update</button>
				</td>
				<td class="page">
					<button type="button" id="{@idLc}DeleteCurButton" class="nav medium" data-action="{@idLc}DeleteCur()" disabled="true">Delete</button>
				</td>
			</tr>
			<xsl:apply-templates mode="select"/>
			<tr>
				<td class="page">
					<button type="button" id="{@idLc}ExitSelectButton" class="actionAlert medium" data-action="{@idLc}ExitSelect()">Exit</button>
				</td>
				<td class="page">
					<button type="button" id="{@idLc}EnterCurButton" class="action medium" data-action="{@idLc}EnterCur()" disabled="true">Enter</button>
				</td>
			</tr>
		</table>
	</div>
	<div id="{@idLc}Edit_page" class="page" hidden="">
		<h1 class="pageHeading"><xsl:value-of select="@nameUc"/></h1>
		<table class="page">
			<xsl:apply-templates mode="form"/>
			<tr>
				<td class="page">
					<button type="button" id="{@idLc}CancelEditButton" class="actionAlert medium" data-action="{@idLc}CancelEdit()">Cancel</button>
				</td>
				<td class="page">
					<button type="button" id="{@idLc}SaveCurButton" class="action medium" data-action="{@idLc}SaveCur()">Save</button>
				</td>
			</tr>
		</table>
	</div>
</xsl:template>

<xsl:template  match="selectPage">
	<div id="{@idLc}Select_page" class="page" hidden="">
		<h1 class="pageHeading">Select <xsl:value-of select="@nameUc"/></h1>
		<p id="{@idLc}ContextPara" class="subTitle"></p>
		<table class="page">
			<tr>
				<td class="page" colspan="2">
					<select id="{@idLc}Select" class="page autoWidth" placeholder="Select {@nameUc}" autocomplete="off" spellcheck="false" onfocus="" onblur="" onchange="{@idLc}SelectChanged()"/>
				</td>
			</tr>
			<xsl:apply-templates mode="select"/>
			<tr>
				<td class="page">
					<button type="button" id="{@idLc}ExitSelectButton" class="actionAlert medium" data-action="{@idLc}ExitSelect()">Exit</button>
				</td>
				<td class="page">
					<button type="button" id="{@idLc}EnterCurButton" class="action medium" data-action="{@idLc}EnterCur()" disabled="true">Enter</button>
				</td>
			</tr>
		</table>
	</div>
</xsl:template>


<xsl:template match="downloadResultsRow" mode="select">
	<tr id="{../@idLc}DownloadResultsRow">
		<td class="page" style="border: 1px solid white" colspan="2">
			<table style="width: 100%">
				<tr>
					<td class="page">
						<a id="{../@idLc}DownloadRespLink" class="downloadLink" href="" download="" disabled="true">Responses</a>
					</td>
					<td class="page">
						<a id="{../@idLc}DownloadAccuracyLink" class="downloadLink" href="" download="" disabled="true">Accuracy</a>
					</td>
				</tr>
				<tr>
					<td class="page">
						<a id="{../@idLc}DownloadNtsMarkersLink" class="downloadLink" href="" download="" disabled="true">NTSMarkers</a>
					</td>
					<td>
						<a id="{../@idLc}DownloadTrialBlocksLink" class="downloadLink" href="" download="" disabled="true">TrialBlocks</a>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</xsl:template>

<xsl:template  match="entityInfoItem" mode="select">
	<tr id="{../@idLc}{@idUc}InfoRowSelect">
		<td colspan="2" class="entityInfo"><xsl:value-of select="@nameUc"/>: <span id="{../@idLc}{@idUc}TextSelect"/></td>
	</tr>
</xsl:template>

<xsl:template  match="entityInfoItem" mode="form">
	<tr id="{../@idLc}{@idUc}InfoRowForm">
		<td colspan="2" class="entityInfo"><xsl:value-of select="@nameUc"/>: <span id="{../@idLc}{@idUc}TextForm"/></td>
	</tr>
</xsl:template>

<xsl:template  match="genderFormField" mode="form">
	<tr>
		<td class="page" colspan="2">
			<button type="button" id="{../@idLc}GenderButtonFemale" class="radioOption" data-action="genderButtonSelect('{../@idLc}', 'female', 'female,male,other'); {../@idLc}FormInfoChanged()">Female</button>
			<button type="button" id="{../@idLc}GenderButtonMale" class="radioOption" data-action="genderButtonSelect('{../@idLc}', 'male', 'female,male,other'); {../@idLc}FormInfoChanged()">Male</button>
			<button type="button" id="{../@idLc}GenderButtonOther" class="radioOption" data-action="genderButtonSelect('{../@idLc}', 'other', 'female,male,other'); {../@idLc}FormInfoChanged()">Other</button>
		</td>
	</tr>
</xsl:template>

<xsl:template  match="nameFormField" mode="form">
	<tr>
		<td class="page" colspan="2">
			<input type="text" pattern="[a-zA-Z-0-9_ ]*" id="{../@idLc}{@idUc}Input" class="textField autoWidth" value="" placeholder="{../@nameUc} {@nameUc}" autocomplete="off" spellcheck="false" onfocus="" onblur="" oninput="nameInputChanged(this); {../@idLc}FormInfoChanged()"/>
		</td>
	</tr>
</xsl:template>

<xsl:template  match="dateFormField" mode="form">
	<tr>
		<td class="page" colspan="2">
			<select id="{../@idLc}{@idUc}YearSelect" class="page narrow" placeholder="Year" autocomplete="off" spellcheck="false" onfocus="" onblur="" onchange="{../@idLc}FormInfoChanged()"/>
			<select id="{../@idLc}{@idUc}MonthSelect" class="page narrow" placeholder="Month" autocomplete="off" spellcheck="false" onfocus="" onblur="" onchange="{../@idLc}FormInfoChanged()"/>
			<select id="{../@idLc}{@idUc}DaySelect" class="page narrow" placeholder="Day" autocomplete="off" spellcheck="false" onfocus="" onblur="" onchange="{../@idLc}FormInfoChanged()"/>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genConnectRow">
	<tr id="connectRow">
		<td class="page">
			<button type="button" id="connectButt" class="action medium" data-action="flipConnect()">Connect</button>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genAboutRow">
	<tr>
		<td class="page">
			<h2 class="pageHeading">General information</h2>
			<tr>
				<td class="page">
					<h2 class="pageHeading">General information</h2>
					<p class="pageText">These apps implement the Early Childhood Inhibitory Touchscreen Task as described in:</p>
						<ul>
							<li class="pageText"><a class="infoLink" href="https://www.sciencedirect.com/science/article/pii/S0163638321001235">Lui et. al. 2021</a></li>
							<li class="pageText"><a class="infoLink" href="https://onlinelibrary.wiley.com/doi/10.1111/desc.13193">Hendry et. al. 2021</a></li>
							<li class="pageText"><a class="infoLink" href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0260695">Holmboe et. al. 2021</a></li>
							<li class="pageText"><a class="infoLink" href="https://psyarxiv.com/r8m9b/">Fiske et. al. 2021</a></li>
						</ul>
					<p class="pageText">The software implementing the apps is published as open source <a class="infoLink" href="https://figshare.com/articles/software/ECITT_Web_App/13258814">here</a>. Although this software can be used to implement similar projects, it is a prototype, primarily serving as documentation of how the data in the project above was collected.</p>
					<p class="pageText">If you want to use this task in a research project, please contact the project manager below for access to accounts and updated apps.</p>
				</td>
			</tr>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genPrivacyPolicyRow">
	<tr>
		<td class="page">
			<h2 class="pageHeading">Privacy Policy</h2>
			<p class="pageText">No personally identifiable information will be automatically collected, neither from testers nor participants.</p>
			<p class="pageText">Please take care to not include personally identifiable information in the "Participant Ref" field.</p>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genGuestUsertInfoRow">
	<tr>
		<td class="page">
			<h2 class="pageHeading">Guest Users</h2>
			<p class ="pageText">The guest user is only provided for evaluation purposes. Guest users may interfere which each other and data collected will be mixed with other guests.</p>
			<p class="pageText">Also note that data collected by guest users will be publicly available.</p>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genSupportInfoRow">
	<tr>
		<td class="page">
			<h2 class="pageHeading">Contact</h2>
			<p class="pageText">For further information, please contact the project manager: <a class="infoLink" href="mailto:karla.holmboe@bristol.ac.uk">karla.holmboe@bristol.ac.uk</a></p>
			<p class="pageText">Unfortunately we do not currently have capacity to provide support for guest users.</p>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genLicenseInfoRow">
	<tr>
		<td class="page">
			<hr/>
			<p class="pageText">This work is licensed under a <a class="infoLink" rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.</p>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genStartPairingRow">
	<tr id="startPairingRow" hidden="">
		<td class="page">
			<button type="button" id="startPairingButt" class="action medium" data-action="flipPairing()">Make Available</button>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genUpdateAppRow">
	<tr id="updateAppRow" hidden="">
		<td class="page">
			<hr/>
			<p class="page">A new update is available</p>
			<p class="page">
				<button type="button" id="updateAppButt" class="actionAlert medium" data-action="updateApp()">Update Now</button>
			</p>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genSignOutRow">
	<tr id="signOutRow" hidden="">
		<td class="page">
			<button type="button" id="signOutButton" class="actionAlert medium" data-action="signOut()">Sign Out</button>
		</td>
	</tr>
</xsl:template>

<xsl:template name="genCacheMsgRow">
	<tr id="cacheMsgRow">
		<td id="cacheMsgCell" class="page"></td>
	</tr>
</xsl:template>

<xsl:template name="genClockButtonCell">
	<td class="page">
		<button type="button" class="nav medium" data-type="clockButton" data-action="flipClock()">Clock 🕐</button>
	</td>
</xsl:template>

<xsl:template name="genPageHeading">
	<h1 class="pageHeading">TouchTasks<xsl:text> </xsl:text><xsl:value-of select="$appVersion"/>
		<xsl:if test="../@appName!=''"><h2 class="pageHeading"><xsl:value-of select="../@appName"/></h2></xsl:if>
	</h1>
</xsl:template>

</xsl:stylesheet>
