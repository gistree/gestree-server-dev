;(function(){
	'use strict';
	module.exports = (rep, pgp) => {
		const promise = require('bluebird');
		const dbHelper = require("../lib/db-helper")(pgp);
		const treesTable = dbHelper.getTreesColumnSet();
		const treesLogTable = dbHelper.getTreesLogColumnSet();
		return {
			syncServer: logs => {
				let queries = [];
				for(let i = 0, length = logs.length; i < length; i++){
					queries.push(_queryBuilder(logs[i]));
				}
				function _seqLogSource(index, data, delay){
					return this.any(queries[index]);
				};
				return rep.tx(function(t) {
					return t.sequence(_seqLogSource, null, queries.length);
				});
			},
			syncClient: values => rep.manyOrNone(_getLastLogs(values.last_timestamp))
	  	};
		function _queryBuilder(data){
			switch(data.action) {
				case "I":
					console.log("INSERT");
					return pgp.helpers.insert(data, treesTable);
					break;
				case "U":
					console.log("UPDATE");
					return pgp.helpers.update(data, treesTable);
					break;
				case "D":
					console.log("DELETE");
					return "DELETE FROM " + treesTable.table + " WHERE "+treesTable.columns[0].name+"=" + data.id_tree + ";";
					break;
				default:
					return "'Invalid Action: " + data.action + "'";
					break;	
			}
		};
		function _getLastLogs(last_timestamp){
			return "SELECT * FROM "+ treesLogTable.table +" WHERE insert_date > '" + last_timestamp + "' ORDER BY insert_date ASC;"
		};	
	};
})();
