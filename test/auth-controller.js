const sinon = require("sinon");

const { expect } = require('chai');

const User = require("../models/user");

const authController = require("../controllers/auth");

describe("Auth Controller" , function() {
    it("should throw an error with status code 500 for database failure" , function(done) {
        sinon.stub(User,"findOne");
        User.findOne.throws();
        const req = {
            body: {
                email:"test@tets.com",
                password:"123456"
            }
        }
        authController.loginUser(req,{} , ()=> "").then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode",500);
            done();
        });
       
        User.findOne.restore();
    });
});