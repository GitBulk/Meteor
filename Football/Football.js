
TeamList = new Mongo.Collection("teams");
if (Meteor.isClient) {
    console.log("Hello client");
    Meteor.subscribe('theTeams');

    Template.teamsranking.helpers({
        'showTeams': function() {

            //var currentUserId = Meteor.userId();

            // get all and order by score desc, name asc
            //return TeamList.find({}, {sort: {score: -1, name: 1} });

            // get all by current user and order by score desc, name asc
            //return TeamList.find({createdBy: currentUserId}, {sort: {score: -1, name: 1}});

            // get all by current user or column createdBy is not exists
            // then, order by score desc, name asc
            // return TeamList.find({$or: [{createdBy: currentUserId}, {createdBy : {$exists: false }}] },
            //                      {sort: {score: -1, name: 1}});

            // we just get data published by server.
            return TeamList.find({}, {sort: {score: -1, name: 1}});
        },
        'selectedClass': function() {
            var teamId = this._id;
            var selectedTeam = Session.get("selectedTeam");
            if (teamId == selectedTeam) {
                return "selected";
            }
            return "";
        },
        'showSelectedTeam': function() {
            var selectedTeam = Session.get("selectedTeam");
            return TeamList.findOne(selectedTeam);
        }
    }); // end of helpers

    Template.teamsranking.events({
        'click li.team': function() {
            var teamId = this._id;
            Session.set("selectedTeam", teamId);
            //var selectedTeam = Session.get("selectedTeam");
            //console.log("You selected: " + selectedTeam);
        },
        'click .increment': function() {
            var selectedTeam = Session.get("selectedTeam");
            //console.log("You selected: " + selectedTeam);
            //TeamList.update(selectedTeam, {$inc: {score: 5} });
            Meteor.call('updateScore', selectedTeam, 5);
        },
        'click .decrement': function() {
            var selectedTeam = Session.get("selectedTeam");
            //console.log("You selected: " + selectedTeam);
            //TeamList.update(selectedTeam, {$inc: {score: -5} });

            Meteor.call('updateScore', selectedTeam, -5);
        },
        'click .remove': function() {
            var selectedTeam = Session.get("selectedTeam");

            //console.log("You selected: " + selectedTeam);
            //TeamList.remove(selectedTeam);

            Meteor.call('removeTeam', selectedTeam);
        }
    });

    Template.addTeamForm.events({
        'submit form': function(e) {
            //e.preventDefault();
            //console.log("Form submitted");
            //console.log(e.type);

            var teamName = e.target.teamName.value;
            //console.log("Team name: " + teamName);

            //var currentUserId = Meteor.userId();
            //console.log("currentUserId: " + currentUserId);

            Meteor.call('insertTeam', teamName);

            // Clear form
            e.target.teamName.value = "";

            // Prevent default form submit
            return false;
        }
    });
}

if (Meteor.isServer) {
    console.log("Hello server");
    //console.log(TeamList.find().fetch());
    Meteor.publish('theTeams', function() {
        //return TeamList.find();

        // cannot use Meteor.userId() in publish
        //var currentUserId = Meteor.userId();

        var currentUserId = this.userId;
        console.log("From server, current user id: " + currentUserId);
        return TeamList.find({$or: [{createdBy: currentUserId}, {createdBy : {$exists: false }}] });

    });

    Meteor.methods({
        'sendLogMessage': function() {
            console.log("Hello log");
        },
        // teamName should be a string value
        'insertTeam': function(teamName) {
            var currentUserId = Meteor.userId();
            TeamList.insert({name: teamName, score: 0, createdBy: currentUserId});
        },
        'removeTeam': function(selectedTeam) {
            // only allow a team to be removed from the list if that team belongs to the current user
            var currentUserId = Meteor.userId();
            TeamList.remove({_id: selectedTeam, createdBy: currentUserId});
        },
        'updateScore': function(selectedTeam, scoreValue) {
            var currentUserId = Meteor.userId();
            TeamList.update({_id: selectedTeam, createdBy: currentUserId}, {$inc: {score: scoreValue}});
        },
    });
}
