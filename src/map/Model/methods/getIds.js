import {
    IP
} from '@/config/superMap/layersName'

const SEARCH_URL = '/iserver/services/data-ShenZuoYuGangShuJuFuWu/rest/data'

function doSqlQuery( name, callback ) {
    var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
    getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: "smid>0",
        fields: [ 'SmID' ]
        /*fields: ["SmID", "VEL", "PCODE","D20130914","D20131016","D20131117","D20131207","D20140108","D20140124","D20140209","D20140313","D20140325","D20140410","D20140528","D20140617","D20140629","D20140719","D20140804","D20140905","D20140917","D20141003","D20141120","D20141124","D20141210","D20141226","D20150123","D20150208","D20150228","D20150312","D20150328","D20150417","D20150429","D20150519","D20150531","D20150620","D20150706","D20150722","D20150807","D20150823","D20150908","D20150924","D20151010","D20151107","D20151123","D20151213","D20160114","D20160302","D20160318","D20160505","D20160606","D20160712","D20160724","D20160805","D20160825","D20160926","D20161012","D20161024","D20161028","D20161125","D20161129","D20170217","D20170418","D20170524"]*/
    });
    getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        maxFeatures: 2000,
        datasetNames: [ "SK_YG_2000:" + name ]
    });
    var url = IP + SEARCH_URL

    getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService( url, {
        eventListeners: {
            "processCompleted": ( data ) => {
                onQueryComplete( data )
                callback( data.result.features )
            },
            "processFailed": processFailed
        }
    });
    getFeatureBySQLService.processAsync( getFeatureBySQLParams )
}

function processFailed( queryEventArgs ) {
    console.log( '<<< onQueryFailed:', queryEventArgs )
}

function onQueryComplete( data ) {
    console.log( '>>> onQueryComplete:', data )
}

export default ( layer, callback ) => {
    console.log( `>>> 查询所有ID:`, layer.name )
    doSqlQuery( layer.name, callback )
}
