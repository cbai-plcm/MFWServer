var connection = require("../database/connection.js")


function userFound(user,res)
{
  user.getGroups().then(function(a){
    console.log(a.length);
    console.log(a[0].get({plain:true}));
    res.jason({"Message" : "post World !"});
  });
}


function REST_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

REST_ROUTER.prototype.handleRoutes = function(router) {
    var self = this;
    /*router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
        

        //connection.verifyUser({id:1, password:'hahahahahahah'},userFound);
        //connection.getGroupMemberArray(2,userFound);
    });

    res.location('/foo/bar');
res.location('http://example.com');
res.location('back');
*/
   // http://localhost:3000/users/100/groups/2/topics/3
    router.get("/users/:user_id/groups/:group_id/topics/:topic_id",function(req,res){
        res.json({userid:req.params.user_id, groupid:req.params.group_id, topicid:req.params.topic_id});
    });

    router.post("/verify",function(req,res){        
        connection.verifyUser({id:req.body.email, password:req.body.pwd},userFound);
       // res.location('chat/dd');
    });

    router.put("/users",function(req,res){
    });

    router.delete("/users/:email",function(req,res){
    });
}

module.exports = REST_ROUTER;