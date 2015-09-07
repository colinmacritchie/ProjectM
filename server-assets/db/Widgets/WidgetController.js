var Widgets = require('./WidgetModel');

function getWidgets(req, res) {
    Widgets.find().exec(function (err, widgets) {
        if (err) {
            return res.send(err);
        } else {
            return res.send(widgets);
        }
    });
}

function getWidget(req, res) {
    Widgets.findOne({ _id: req.params.id }, function (err, widget) {
        if (err) {
            return res.send(err);
        }
        return res.send(widget);
    });
};

function addWidget(req, res) {
    new Widgets(req.body.widget).save(function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({ message: 'Successfully added widget' });
    });
}

function editWidget(req, res) {
    Widgets.findOneAndUpdate({ _id: req.body.widget._id }, req.body.widget, function (err, widget) {
        if (err) {
            return res.send(err);
        }
        return res.send(widget);
    });
}

function removeWidget(req, res) {
    Widgets.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send({ message: 'Widget was removed' });
    });
}

module.exports = {
    add: addWidget,
    remove: removeWidget,
    edit: editWidget,
    getWidgets: getWidgets,
    getWidget: getWidget
};