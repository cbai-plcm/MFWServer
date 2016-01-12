var mysql  = require('mysql');  
var Sequelize = require('sequelize');

var sequelize = new Sequelize('mfwserver', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  name: {
    type: Sequelize.STRING
  },
  email:{
    type: Sequelize.STRING
  },
  password:{
    type: Sequelize.STRING
  },
  profile:{
    type: Sequelize.STRING
  }
});

var Topic = sequelize.define('topic', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  name: {
    type: Sequelize.STRING
  }
});

var Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  type: {
    type: Sequelize.STRING
  },
  userid:{
    type: Sequelize.INTEGER
  },
  groupid:{
    type: Sequelize.INTEGER
  },
  topicid:{
    type: Sequelize.INTEGER
  },
  time: {
    type: Sequelize.TIME
  }
});

var Group = sequelize.define('group', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true
  },
  name: {
    type: Sequelize.STRING
  }
});

User.belongsToMany(Group,{through:"UserGroup"});
Group.belongsToMany(User,{through:"UserGroup"});

Topic.belongsToMany(User,{through:"UserTopic"});
User.belongsToMany(Topic,{through:"UserTopic"});

Topic.belongsTo(Group);
Group.hasMany(Topic);


/*
group = {id:1,name:"g1"};
topic = {id:1,name:"t1",groupid:1}

Group.create(group).then(function (t){


});

Topic.create(topic).then(function (t){


});
*/

group = { name:"g2"};
t1 = {name:"t1"};
t2 = {name:"t2"};

Group.findOne({where: {id: 2}}).then(function(g)
{
   Topic.findOne().then(function (t)
   {
    //t.setGroup(g);
    g.setTopics([t]).then(function(e){console.log("done")});

   }); 

   User.findOne().then(function(user){
      g.addUser(user);
   }); 
});


//Group.create(group);

//group.addTopic(t1).then(function(t){console.log("done")});

/*
Topic.findOne().then(function(t) {
 
  t.getGroup().then(function(g) {
    console.log(g.name);
  });
});
*/

function verifyUser(user, callback)
{
    var id ;
    User.findOne( {attributes: ['id','name'], where: {id: user.id,password:user.password } }).then( function (user) {
       callback(user);
    });
}

function newUser(user, callback){

    var us = {name:"t1",email:"",password:"",profile:""};
    User.create(us).then(function (t){


    });
}

function getGroupMemberArray(groupID,callback){
    Group.findOne({where: {id : groupID}}).then(function (group){
        group.getUsers().then(function (users){
            console.log(users.length);
            console.log(users[0].get({plain:true}));
        });
    });
}


// Get all topic Names for one user in A group
function GetTopicNameArray(data, options){
  var self = this;
  var  selectSql = 'select t.topicID, t.topicName from user_topic as ut left join topics as t on t.topicID=ut.topicID where t.groupID=data.groupID and ut.userID=data.userID;';
  
  self.connection.query(selectSql,function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }      
  });
}

// Add a group
function InsertGroup (data, options) {
  var self = this;
  var  userGroupSql = 'INSERT INTO groups(groupName) VALUES (?)';
  var  userGroupSql_Params = [data.groupName];
  
  self.connection.query(userGroupSql,userGroupSql_Params,function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }
  });

  var  selectSql = 'select groupID from groups where groups.groupName=data.groupName;';
  var  groupID;
  
  connection.query(selectSql,function (err, result) {
      if(err){
        console.log('[select ERROR] - ',err.message);
        return;
      }
      groupID = result;
  });


  var  insertSql = 'INSERT INTO user_group(userID,groupID) VALUES (?,?)';
  
  connection.query(insertSql,function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }
  });
}


//new a topic for one exist user
function InsertTopic (data, options) {
  var  self = this;
  var  insertTopicSql = 'INSERT INTO topics(topicName,groupID) VALUES (?,?)';
  var  insertTopicSql_Params = [data.topicName,data.groupID];
  
  connection.query(insertTopicSql,insertTopicSql_Params,function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }      
  });


  var  selectSql = 'select topicID from topics where topics.topicName=data.topicName;';
  var  topicID;
  
  connection.query(selectSql,function (err, result) {
      if(err){
        console.log('[select ERROR] - ',err.message);
        return;
      }
      topicID = result;
  });


  var  insertSql = 'INSERT INTO user_topic(topicID,userID) VALUES (?,?)';
  
  connection.query(insertSql,function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }
  });

}

// Add a new user
function InsertNewUser(req, options) {
  var self = this;
  var  userAddSql = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
  var  userAddSql_Params = ['userinfo','UserName','UserMail','UserPwd','UserProfile',req.UserName, req.UserMail,req.UserPwd,req.UserProfile];
  query = mysql.format(userAddSql,userAddSql_Params);
  connection.query(userAddSql,function (err, result) {
      if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
      }
  });
}





//module.exports = connection;


exports.verifyUser = verifyUser;
exports.getGroupMemberArray = getGroupMemberArray;
