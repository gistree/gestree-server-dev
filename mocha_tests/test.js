'use strict';
const assert = require('assert');
const supertest = require('supertest');
const request = supertest.agent("http://localhost:3000");

let client1 = {
	"timestamp": "2016-11-15 14:33:51.77",
	"data": [
		// {
		// 	id_tree: 1,
		// 	species: "Tree1",
		// 	action: "I",
		// 	timestamp: "2016-12-15 14:34:51.77"
		// },
		// {
		// 	id_tree: 1,
		// 	species: "Tree1",
		// 	action: "D",
		// 	timestamp: "2016-12-15 14:40:51.79"
		// },
		// {
		// 	id_tree: 2,
		// 	species: "Tree2",
		// 	action: "I",
		// 	timestamp: "2016-12-15 14:42:51.79"
		// },
		// {
		// 	id_tree: 3,
		// 	species: "Tree3",
		// 	action: "I",
		// 	timestamp: "2016-12-15 14:43:51.79"
		// }
	]
};

describe('Sync Tests', function () {	
	it('Send Data...', function(done){
		request
			.post("/api/sync")
			.send(client1)
			.expect('Content-Type', /json/)
			.expect(res => {
				console.log(res.body);
			})
			.expect(200, done);
	});
});