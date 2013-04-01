// Collections
Rooms    = new Meteor.Collection("rooms");
Messages = new Meteor.Collection("messages");

// Publish complete set of chats to all clients.
Meteor.publish('rooms', function () {
  return Rooms.find();
});

Meteor.publish("messages", function(id) {
    return Messages.find({chat: id});
});

// Methods for BD
Meteor.methods({
    create_chat: function(name, created_at) {
        console.log("Creating Chat");
        var chat_id = Rooms.insert({'name': name, 'created_at': created_at});
        return chat_id;
    },

    add_message: function(room, message, nick) {
        console.log("Add Message to channel"+room);
        var message_id = Messages.insert({'message': message, 'chat':room, 'nick': nick, 'date': new Date()});
        return message_id;
    },

    exists_chatroom: function(name){
		var exists = Rooms.findOne({'name': name});
		return exists;
    },

	delete_chatroom: function(id){
		var deleted = Rooms.remove({_id:id});
		return deleted;
    }
});

// Deny users to write directly to collections from client code
Rooms.deny({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});

Messages.deny({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});

