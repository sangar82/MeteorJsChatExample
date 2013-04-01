Meteor.Router.add({
  '/': 'home',
  '/rooms/:id': function(id) {
    Session.set('currentRoomId', id);
    Session.set('entry', new Date());
    return 'room';
	}
});

Rooms = new Meteor.Collection("rooms");
Messages = new Meteor.Collection("messages");


Meteor.autorun(function() {
    var roomsHandle = Meteor.subscribe("rooms");
});

var messagesHandle = null;

// Always be subscribed to the messages for the selected chat.
Deps.autorun(function () {
  var currentRoomId = Session.get('currentRoomId');
  if (currentRoomId)
    messagesHandle = Meteor.subscribe('messages', currentRoomId);
  else
    messagesHandle = null;
});


/* ROOMS */
Template.rooms.nrooms = function(){
	var rooms = Rooms.find();
	return rooms.count();
};

Template.rooms.rooms = function () {
  return Rooms.find();
};

Template.rooms.createRoom = function () {
	var $msg  = $("#name");

	if ($msg.val()){

		Meteor.call("exists_chatroom", $msg.val(),  function(error, exists) {

			if (!exists){
				Meteor.call("create_chat", $msg.val(),(new Date()).toUTCString(),  function(error, chat_id) {
					$msg.val("");
					$msg.focus();
				});
			}
			else
			{
				bootbox.alert("The name is already taken. Choose another one.", function(){
					$msg.val("");
					$msg.focus();
				});

			}

		});

	}

};

Template.rooms.events = {

	"click .submit": function (){
		Template.rooms.createRoom();
	},

	"keydown #name": function (e){
		if (e.keyCode == 13)
			Template.rooms.createRoom();
	},

	"click .delete": function (){

		id = this._id;

		bootbox.confirm("Are you sure to delete this chat room?", function(result){

			if (result.toString() === "true")
			{
				Meteor.call("delete_chatroom", id,  function(error, deleted) {
				});
			}
		});
	}
};
/* ROOMS */

/* ROOM */
Template.room.chat = function () {
  return Rooms.findOne(Session.get('currentRoomId'));
};

Template.room.messages = function () {
  return Messages.find({'chat': Session.get('currentRoomId'), 'date': {$gt: Session.get('entry')}});
};

Template.room.events = {

	"keydown #text": function (e){
		if (e.keyCode == 13)
			Template.room.sendMsg();
	},

	"click .submit": function (){

		Template.room.sendMsg();
	},

	"click .changenick": function (){
		Template.room.askNick();
	}
};

Template.room.sendMsg = function () {

	if (!Session.get("nick"))
	{
		Template.room.askNick();
		return false;
	}

	if ($("#text").val())
	{
		Meteor.call("add_message", Session.get('currentRoomId'), $("#text").val(), Session.get("nick"), function(error, message_id) {
		});

		$("#text").val("");
		$("#text").focus();
		Meteor.flush();
	}
};

Template.room.askNick = function () {
	bootbox.prompt("What is your nick?", function(result) {
		if (result !== null)
		{
			Session.set("nick", result);
			$("#text").focus();
		}
	});
};

Template.room.goToDown = function () {
	Meteor.defer(function () {
		$("#chat").scrollTop($("#chat")[0].scrollHeight);
	});
};
/* ROOM */



