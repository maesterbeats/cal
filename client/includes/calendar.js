calendarSubs = Meteor.subscribe('calendar');

Meteor.startup(function () {
    Session.set('calendarTemplateRendered', false);
});

//  Event Types....
var userEvent = {
    color: "blue",
    editable: true,
    backgroundColor: "blue"
};

var notUserEvent = {
    color: "red",
    editable: false,
    backgroundColor: "red",
    title: "Unavailable"
};


// Event formater constructor....
var _formatEvent = function(options) {
    var _options = options;
    return function(evt) {
        return _.extend(evt, _options);
    };
};

var enableEvent = _formatEvent(userEvent);
var disableEvent = _formatEvent(notUserEvent);

var ownsItem = function(i) {
    if(i.userId == Meteor.userId()){
        return true;
    }
    return false;
};

Deps.autorun(function () {
    if (Session.equals('calendarTemplateRendered', false) || 
        !calendarSubs.ready() ||
        typeof Calendar === 'undefined') {
            return;
    }
    var _entries = Calendar.find().fetch(),
        $calendar = $('#calendar');


    var entries = _.map(_entries, function(entry) {
        if(ownsItem(entry)){
            return enableEvent(entry);
        } else {
            return disableEvent(entry);
        }
    });

    $calendar.html('').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        events: entries
    });
});

Template.calendar.rendered = function () {
    Session.set('calendarTemplateRendered', true);
    $('div.fc-event').livequery(function () {
        $(this).click(function () {
            var title = $(this).find('span.fc-event-title').text(),
                $modal = $('#event-details-modal'),
                calEvent = Calendar.findOne({title: title});

            $modal.modal('show');
            $modal.find('div.modal-header').find('h3').text(title);
            $modal.find('div.modal-body').html('').append([
                $('<li>').text('Start: ' + calEvent.start),
                $('<li>').text('Description: ' + calEvent.description)
            ]);
        });
    });
};

Template.calendar.events({
    'click div.fc-square, click td.fc-day' : function (event) {
        var target = event.target, 
            $modal = $('#new-event-modal'),
            date = $(target).parents('.fc-day').attr('data-date') || $(target).attr('data-date');

        $modal.modal('show');
        $modal.find('input[name=date]').val(date);
    }
});

Template.new_event_modal.events({
    'click input[type=radio]' : function (event) {
        if (event.target.value === 'has-time') {
            $('#time-input').show();
        } else {
            $('#time-input').hide();
        }
    },
    'click div.modal-body div.alert button.close' : function (event) {
        var $parent = $(event.target).parent();
        $parent.addClass('hide');
    }
});
