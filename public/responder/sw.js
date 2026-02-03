
const swVersion = "79";
const cacheName = "resp";
var cache;
var noOfUrls;
var curUrlNo;
var cacheOkReported = false;

//console.log("swVersion: "+swVersion);

// install

self.swVersion = swVersion;

self.addEventListener("install", install);

async function install(installEvent) {
	console.log("install, version: "+swVersion);
}

// Caching

async function checkCache(inclNirs) {
	console.log("checkCache, version: "+swVersion);
	cacheOkReported = false;
	curClients = await self.clients.matchAll();
	if (curClients.length > 0) {
		const cacheExists = await caches.has(cacheName);
		cache = await caches.open(cacheName);
		const keys = await cache.keys();
		const urls = await getUrls(inclNirs);
		if (cacheExists) {
			console.log("cacheExists");
			if (keys.length >= urls.length) {
				console.log("cache complete");
				reportCacheOk();
			}
			else {
				updateCache(inclNirs);
			}
		}
		else {
			updateCache(inclNirs);
		}
	}
	else {
		console.log("checkCache, no clients");
	}
}

async function deleteCache() {
	console.log("deleteCache, version: "+swVersion);
	deleted = await caches.delete(cacheName);
	cache = await caches.open(cacheName);
	const keys = await cache.keys();
	console.log(keys);
}

async function getUrls(inclNirs) {
	console.log("getUrls, version: "+swVersion);
	const url = "urls.php?inclNirs="+inclNirs;
	console.log("url: "+url);
	const urlListResp = await fetch(url);
	if (urlListResp) {
		if (urlListResp.ok) {
			const urlList = await urlListResp.text();
			if (urlList) {
				return urlList.split(",");
			}
			else {
				console.log("no urlList");
			}
		}
		else {
			console.log("urlListResp not ok");
		}
	}
	else {
		console.log("no urlListResp");
	}
}

async function updateCache(inclNirs) {
	console.log("updateCache, version: "+swVersion);
	cacheOkReported = false;
	var curClients = await self.clients.matchAll();
	if (curClients.length > 0) {
		const urls = await getUrls(inclNirs);
		if (urls) {
			noOfUrls = urls.length;
			cache = await caches.open(cacheName);
			console.log("cache open", cache);
			if (cache) {
				// Process URLs in batches to avoid overwhelming the network
				// Process 10 URLs at a time instead of sequentially
				const batchSize = 10;
				for (let batchStart = 0; batchStart < noOfUrls; batchStart += batchSize) {
					const batchEnd = Math.min(batchStart + batchSize, noOfUrls);
					const batch = urls.slice(batchStart, batchEnd);
					
					// Process batch in parallel with Promise.allSettled (continues even if some fail)
					await Promise.allSettled(
						batch.map((url, index) => {
							curUrlNo = batchStart + index;
							console.log("curUrlNo: "+curUrlNo+ ", url: "+url);
							return addToCache(url, curUrlNo);
						})
					);
					
					// Small delay between batches to avoid overwhelming the server
					if (batchEnd < noOfUrls) {
						await new Promise(resolve => setTimeout(resolve, 100));
					}
				}
			}
			else {
				console.log("no cache");
			}
		}
		else {
			console.log("no urls");
		}
	}
	else {
		console.log("updateCache, no clients");
	}
}

async function addToCache(url, curUrlNo) {
	console.log("addToCache, url: "+url);
	try {
		// Add timeout to prevent hanging on slow/failed requests
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
		
		const response = await fetch(url, { signal: controller.signal });
		clearTimeout(timeoutId);
		
		if (response.ok) {
			// Clone response before putting in cache (response can only be consumed once)
			const responseClone = response.clone();
			cache.put(url, responseClone).then(
				function(){reportCached(cache, url, true, true, curUrlNo)}, 
				function(err){
					console.error("cache.put failed for "+url+":", err);
					reportCached(cache, url, true, false, curUrlNo);
				}
			);
		}
		else {
			console.warn("fetch not ok for "+url+", status: "+response.status);
			reportCached(cache, url, false, false, curUrlNo);
		}
	} catch (error) {
		console.error("addToCache error for "+url+":", error);
		// Continue even if this URL fails - don't stop the whole caching process
		reportCached(cache, url, false, false, curUrlNo);
	}
}

async function reportCached(cache, url, respOk, putOk, urlNo) {
	console.log("reportCached, url: "+url);
	if (!cacheOkReported) {
		var curClients = await self.clients.matchAll();
		if (curClients.length > 0) {
			var data = Object();
			data.msg = "cached";
			data.url = url;
			data.respOk = respOk;
			data.putOk = putOk;
			data.urlNo = urlNo;
			data.noOfUrls = noOfUrls;
			curClients.forEach(function(client){client.postMessage(data)});
			cache.keys().then(function(keys){reportIfCacheOk(keys.length)});
			//console.log("respOk: "+respOk+", putOk:"+putOk+", keys: "+keys+", noOfUrls: "+noOfUrls);
			//if (keys == noOfUrls) {
			//	reportCacheOk();
			//}
		}
		else {
			console.log("reportCached, no clients");
		}
	}
	else {
		console.log("cacheOkReported: "+cacheOkReported);
	}
}

function reportIfCacheOk(noOfKeys) {
	console.log("reportIfCacheOk, noOfKeys: "+noOfKeys+", noOfUrls: "+noOfUrls);
	if (noOfKeys >= noOfUrls) {
		reportCacheOk();
	}
}

async function reportCacheOk() {
	console.log("reportCacheOk");
	if (!cacheOkReported) {
		cacheOkReported = true;
		var curClients = await self.clients.matchAll();
		if (curClients.length > 0) {
			var data = Object();
			data.msg = "cacheOk";
			curClients.forEach(function(client){client.postMessage(data)});
		}
		else {
			console.log("reportCacheOk, no clients");
		}
	}
	else {
		console.log("cacheOkReported: "+cacheOkReported);
	}
}

async function reportVersion() {
	console.log("reportVersion");
	var curClients = await self.clients.matchAll();
	if (curClients.length > 0) {
		var data = Object();
		data.msg = "version";
		data.version = swVersion;
		curClients.forEach(function(client){client.postMessage(data)});
	}
	else {
		console.log("reportVersion, no clients");
	}
}

// activate

self.addEventListener("activate", activate);

async function activate(activateEvent) {
	console.log("activate, version: "+swVersion);
}

// message

self.addEventListener("message", message);

async function message(event) {
	const data = event.data;
	console.log("message", data);
	var msg = data.msg;
	console.log("msg", msg);
	var inclNirs = data.inclNirs;
	console.log("inclNirs", inclNirs);
	switch (msg) {
		case "updateCache":
			console.log("inclNirs: "+inclNirs);
			await updateCache(inclNirs);
			break;
		case "checkCache":
			console.log("inclNirs: "+inclNirs);
			await checkCache(inclNirs);
			break;
		case "deleteCache":
			console.log("deleteCache");
			console.log("inclNirs: "+inclNirs);
			await deleteCache();
			break;
		case "reportVersion":
			console.log("reportVersion");
			await reportVersion();
			break;
	}
}

self.addEventListener("fetch",
	function(event) {
		event.respondWith(
		caches.match(event.request)
		.then(
				function(response) {
					if (response) {
						console.log("cached, url: "+event.request.url);
						return response;
					}
					else {
						console.log("retrieved, url: "+event.request.url);
						return fetch(event.request);
					}
				}
			)
		)
	}
);
