const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const { expect } = require('chai');

const authMiddleware = require('../middlewares/is-auth');
describe("Auth middleware" , () => {
    it("should throw error when header does not have authorisation" , function() {
        const req = {
            get: () => null
        }
    
        expect(authMiddleware.bind(this,req,{} , () => "")).to.throw("User is not authorised!");
    });
    
    it("should throw error if it contains token without bearer" , function() {
        const req = {
            get: () => "xyz"
        }
    
        expect(authMiddleware.bind(this,req,{} , () => "")).to.throw();
    });
    it("should yield a userid after verifying token" , function() {
        const req = {
            get: () => "Bearer abc"
        }
        sinon.stub(jwt,"verify");
        jwt.verify.returns({userId : "abc"});

        authMiddleware(req,{} , () => "");
        jwt.verify.restore();
        expect(req).to.have.property("userId" , "abc");

    });
})
