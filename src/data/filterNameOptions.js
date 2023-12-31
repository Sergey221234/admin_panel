const filterNameOptions = [
  { label: 'campaignId', value: 'campaignID' },
  { label: 'campaignName', value: 'campaignName' },
  { label: 'offerName', value: 'offerName' },
  { label: 'dynamicPayout', value: 'dynamicPayout' },
  { label: 'profit', value: 'profit' },
  { label: 'roi', value: 'roi' },
  { label: 'param1', value: 'param1' },
  { label: 'conversions', value: 'conversions' },
  { label: 'locationRegion', value: 'locationRegion' },
  { label: 'visitID', value: 'visitID' },
  { label: 'externalID', value: 'externalID' },
  { label: 'connectionReferrer', value: 'connectionReferrer' },
  { label: 'connectionReferrerDomain', value: 'connectionReferrerDomain' },
  { label: 'deviceOS', value: 'deviceOS' },
  { label: 'deviceOsVersion', value: 'deviceOsVersion' },
  { label: 'deviceModel', value: 'deviceModel' },
  { label: 'deviceMainLanguage', value: 'deviceMainLanguage' },
  { label: 'offerID', value: 'offerID' },
  { label: 'landingID', value: 'landingID' },
  { label: 'connectionISP', value: 'connectionISP' },
  { label: 'connectionIP', value: 'connectionIP' },
  { label: 'deviceType', value: 'deviceType' },
  { label: 'locationCountry', value: 'locationCountry' },
  { label: 'connectionType', value: 'connectionType' },
  { label: 'locationCity', value: 'locationCity' },
  { label: 'deviceBrowser', value: 'deviceBrowser' },
  { label: 'deviceBrand', value: 'deviceBrand' },
  { label: 'deviceBrowserVersion', value: 'deviceBrowserVersion' },
  { label: 'trafficSourceID', value: 'trafficSourceID' },
  { label: 'flowID', value: 'flowID' },
  { label: 'nodeID', value: 'nodeID' },
  { label: 'nodesPath', value: 'nodesPath' },
  { label: 'affiliateNetworkID', value: 'affiliateNetworkID' },
  { label: 'deviceUserAgent', value: 'deviceUserAgent' },
  { label: 'botScore', value: 'botScore' },
  { label: 'queryStringRotation', value: 'queryStringRotation' },
  { label: 'date', value: 'date' },
  { label: 'dateTime', value: 'dateTime' },
  { label: 'clickId', value: 'clickID' },
  { label: 'visits', value: 'visits' },
  { label: 'uniqueVisits', value: 'uniqueVisits' },
  { label: 'uniqueClicks', value: 'uniqueClicks' },
  { label: 'prelanderClicks', value: 'prelanderClicks' },
  { label: 'prelanderCtr', value: 'prelanderCtr' },
  { label: 'clicks', value: 'clicks' },
  { label: 'revenue', value: 'revenue' },
  { label: 'ctr', value: 'ctr' },
  { label: 'epv', value: 'epv' },
  { label: 'epc', value: 'epc' },
  { label: 'visitCvr', value: 'visitCvr' },
  { label: 'cvr', value: 'cvr' },
  { label: 'hourOfDay', value: 'hourOfDay' },
  { label: 'dayOfWeek', value: 'dayOfWeek' },
  { label: 'startOfMonth', value: 'startOfMonth' },
  { label: 'archived', value: 'archived' },
  { label: 'cost', value: 'cost' },
  { label: 'cpv', value: 'cpv' },
  { label: 'cpa', value: 'cpa' },
  { label: 'roas', value: 'roas' },
  { label: 'likelyBotVisits', value: 'likelyBotVisits' },
  { label: 'trackingField1', value: 'trackingField1' },
  { label: 'trackingField2', value: 'trackingField2' },
  { label: 'trackingField3', value: 'trackingField3' },
  { label: 'trackingField6', value: 'trackingField6' },
  { label: 'trackingField7', value: 'trackingField7' },
  { label: 'trackingField8', value: 'trackingField8' },
  { label: 'trackingField9', value: 'trackingField9' },
  { label: 'trackingField10', value: 'trackingField10' },
  { label: 'trackingField11', value: 'trackingField11' },
  { label: 'trackingField12', value: 'trackingField12' },
  { label: 'trackingField13', value: 'trackingField13' },
  { label: 'trackingField14', value: 'trackingField14' },
  { label: 'trackingField15', value: 'trackingField15' },
  { label: 'trackingField16', value: 'trackingField16' },
  { label: 'trackingField17', value: 'trackingField17' },
  { label: 'trackingField18', value: 'trackingField18' },
  { label: 'trackingField19', value: 'trackingField19' },
  { label: 'trackingField20', value: 'trackingField20' },
  { label: 'customConversion1', value: 'customConversion1' },
  { label: 'customConversion2', value: 'customConversion2' },
  { label: 'customConversion3', value: 'customConversion3' },
  { label: 'customConversion4', value: 'customConversion4' },
  { label: 'customConversion5', value: 'customConversion5' },
  { label: 'customConversion6', value: 'customConversion6' },
  { label: 'customConversion7', value: 'customConversion7' },
  { label: 'customConversion8', value: 'customConversion8' },
  { label: 'customConversion9', value: 'customConversion9' },
  { label: 'customConversion10', value: 'customConversion10' },
  { label: 'customConversion11', value: 'customConversion11' },
  { label: 'customConversion12', value: 'customConversion12' },
  { label: 'customConversion13', value: 'customConversion13' },
  { label: 'customConversion14', value: 'customConversion14' },
  { label: 'customConversion15', value: 'customConversion15' },
  { label: 'customConversion16', value: 'customConversion16' },
  { label: 'customConversion17', value: 'customConversion17' },
  { label: 'customConversion18', value: 'customConversion18' },
  { label: 'customConversion19', value: 'customConversion19' },
  { label: 'customConversion20', value: 'customConversion20' },
  { label: 'param2', value: 'param2' },
  { label: 'param3', value: 'param3' },
  { label: 'param4', value: 'param4' },
  { label: 'param5', value: 'param5' },
  { label: 'param6', value: 'param6' },
  { label: 'param7', value: 'param7' },
  { label: 'param8', value: 'param8' },
  { label: 'param9', value: 'param9' },
  { label: 'param10', value: 'param10' },
  { label: 'param11', value: 'param11' },
  { label: 'param12', value: 'param12' },
  { label: 'param13', value: 'param13' },
  { label: 'param14', value: 'param14' },
  { label: 'param15', value: 'param15' },
  { label: 'param16', value: 'param16' },
  { label: 'param17', value: 'param17' },
  { label: 'param18', value: 'param18' },
  { label: 'param19', value: 'param19' },
  { label: 'param20', value: 'param20' },
  { label: 'customRevenue1', value: 'customRevenue1' },
  { label: 'customRevenue2', value: 'customRevenue2' },
  { label: 'customRevenue3', value: 'customRevenue3' },
  { label: 'customRevenue4', value: 'customRevenue4' },
  { label: 'customRevenue5', value: 'customRevenue5' },
  { label: 'customRevenue6', value: 'customRevenue6' },
  { label: 'customRevenue7', value: 'customRevenue7' },
  { label: 'customRevenue8', value: 'customRevenue8' },
  { label: 'customRevenue9', value: 'customRevenue9' },
  { label: 'customRevenue10', value: 'customRevenue10' },
  { label: 'customRevenue11', value: 'customRevenue11' },
  { label: 'customRevenue12', value: 'customRevenue12' },
  { label: 'customRevenue13', value: 'customRevenue13' },
  { label: 'customRevenue14', value: 'customRevenue14' },
  { label: 'customRevenue15', value: 'customRevenue15' },
  { label: 'customRevenue16', value: 'customRevenue16' },
  { label: 'customRevenue17', value: 'customRevenue17' },
  { label: 'customRevenue18', value: 'customRevenue18' },
  { label: 'customRevenue19', value: 'customRevenue19' },
  { label: 'customRevenue20', value: 'customRevenue20' },
  { label: 'trafficSourceCostEstimated', value: 'trafficSourceCostEstimated' },
  { label: 'campaignCreatedAt', value: 'campaignCreatedAt' },
  { label: 'campaignUpdatedAt', value: 'campaignUpdatedAt' },
  { label: 'campaignNotes', value: 'campaignNotes' },
  { label: 'campaignUrl', value: 'campaignUrl' },
  { label: 'campaignTrackingType', value: 'campaignTrackingType' },
  { label: 'campaignTrafficSourceId', value: 'campaignTrafficSourceId' },
  { label: 'campaignCountry', value: 'campaignCountry' },
  { label: 'campaignDevice', value: 'campaignDevice' },
  { label: 'landingName', value: 'landingName' },
  { label: 'landingCtaCount', value: 'landingCtaCount' },
  { label: 'landingUrl', value: 'landingUrl' },
  { label: 'landingNotes', value: 'landingNotes' },
  { label: 'landingCreatedAt', value: 'landingCreatedAt' },
  { label: 'landingUpdatedAt', value: 'landingUpdatedAt' },
  { label: 'offerPayout', value: 'offerPayout' },
  { label: 'offerNotes', value: 'offerNotes' },
  { label: 'offerUrl', value: 'offerUrl' },
  { label: 'offerCreatedAt', value: 'offerCreatedAt' },
  { label: 'offerUpdatedAt', value: 'offerUpdatedAt' },
  { label: 'offerAffiliateNetworkId', value: 'offerAffiliateNetworkId' },
  { label: 'trafficSourceName', value: 'trafficSourceName' },
  { label: 'trafficSourceNotes', value: 'trafficSourceNotes' },
  { label: 'trafficSourceCurrency', value: 'trafficSourceCurrency' },
  { label: 'trafficSourceParams', value: 'trafficSourceParams' },
  { label: 'trafficSourceCreatedAt', value: 'trafficSourceCreatedAt' },
  { label: 'trafficSourceUpdatedAt', value: 'trafficSourceUpdatedAt' },
  { label: 'affiliateNetworkName', value: 'affiliateNetworkName' },
  { label: 'affiliateNetworkNotes', value: 'affiliateNetworkNotes' },
  { label: 'affiliateNetworkCreatedAt', value: 'affiliateNetworkCreatedAt' },
  { label: 'affiliateNetworkUpdatedAt', value: 'affiliateNetworkUpdatedAt' },
  { label: 'flowName', value: 'flowName' },
  { label: 'flowNotes', value: 'flowNotes' },
  { label: 'flowTransition', value: 'flowTransition' },
  { label: 'flowCreatedAt', value: 'flowCreatedAt' },
  { label: 'flowUpdatedAt', value: 'flowUpdatedAt' },
]
export default filterNameOptions
