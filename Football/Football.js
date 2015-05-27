
TeamList = new Mongo.Collection("teams");
if (Meteor.isClient) {
    console.log("Hello client");

    Template.teamsranking.helpers({
        'showTeams': function() {

            //  get all and order by score desc, name asc
            return TeamList.find({}, {sort: {score: -1, name: 1} });
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
            TeamList.update(selectedTeam, {$inc: {score: 5} });
        },
        'click .decrement': function() {
            var selectedTeam = Session.get("selectedTeam");
            //console.log("You selected: " + selectedTeam);
            TeamList.update(selectedTeam, {$inc: {score: -5} });
        }
    });

    Template.addTeamForm.events({
        'submit form': function() {
            console.log("Form submitted");
        }
    });
}

if (Meteor.isServer) {
    console.log("Hello server");
}

