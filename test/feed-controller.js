const sinon = require("sinon");
const mongoose = require('mongoose');

const { expect } = require('chai');

const Post = require("../models/post");
const User = require("../models/user");

const feedController = require("../controllers/feed");

describe("FeedController" , function() {
    this.timeout(5000); 
    before(function(done) {
        mongoose.connect('mongodb+srv://supran:1234@supran-cluster0-zzni5.mongodb.net/test-feed?retryWrites=true&w=majority')
        .then(result => {
            const user = new User({
                email:"test@testemail.com",
                name:"testname",
                password:"testpassword",
                _id:"5d5de9020dd2c127d4725845",
                posts:[]
            });
            return user.save();
        }).then(() => {
            done();
        })
    });

    it("should save the post to database and append the post id in the user" , function(done) {
        const req = {
            file: {
                path : "/dummyimage/path"
            },
            params: {},
            body: {
                title: "Dummy post title",
                content: "Dummy post content"
            },
            userId : "5d5de9020dd2c127d4725845"
        };

        const res = {
            statusCode : "",
            message : "",
            post: {},
            status : function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(obj) {
                this.message = obj.message;
                this.post = obj.post;
            }
        };

        feedController.createPost(req,res,() => {}).then(result => {
            User.findById("5d5de9020dd2c127d4725845").then(user => {
                expect(user.posts).to.have.length(1);
                expect(user.posts[0].toString()).to.equal(res.post._id.toString());
                done();
            });
        });

    });

    after(function(done) {
        User.findByIdAndRemove("5d5de9020dd2c127d4725845").then(result => {
            return mongoose.disconnect()
        }).then(result => {
            done();
        });
    });
});
