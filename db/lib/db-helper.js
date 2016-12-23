;(function(){
	'use strict';
	module.exports = (pgp) => {
		return {
			getTreesColumnSet: () => _treesColumnSet(),
			getTreesLogColumnSet: () => _treesLogColumnSet()
		};
			
		function _treesColumnSet(){
			return pgp.helpers.ColumnSet(['id_tree','species'], 
				{
					table:
						{
							schema:'dev', 
							table:'trees'
						}
					}
				);
		};

		function _treesLogColumnSet(){
			return pgp.helpers.ColumnSet(['id_tree','species', 'action'], 
				{
					table:
						{
							schema:'dev', 
							table:'trees_log'
						}
					}
				);
		};
	}
})();