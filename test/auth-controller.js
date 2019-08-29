const sinon = require("sinon");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { expect } = require('chai');

const User = require("../models/user");

const authController = require("../controllers/auth");

describe("Auth Controller" , function() {
    before(function(done) {
        mongoose.connect('mongodb+srv://supran:1234@supran-cluster0-zzni5.mongodb.net/test-feed?retryWrites=true&w=majority')
        .then(result => {
            return bcrypt.hash("123456",12);
            
        }).then(password => {
            return new User({
                email:"test@testemail.com",
                name:"testname",
                password,
                _id:"5d5de9020dd2c127d4725845"
            });
        })
        .then(user => {
            return user.save();
        }).then(result => {
            done();
        });
    });

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
    it("should generate a token if user exist in database" , function() {
        const req = {
         body: {
            email:"test@testemail.com",
            password:"123456"
         }
        };
        const res = {
            statusCode: "",
            token: "",
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(obj) {
                this.token = obj.token; 
            }
        }

        authController.loginUser(req,res,() => {}).then( result => {
             expect(res.statusCode).equal(200);
        }  );
    });

    after(function(done) {
        User.findByIdAndRemove("5d5de9020dd2c127d4725845").then(result => {
            return mongoose.disconnect()
        }).then(result => {
            done();
        });
    })
});