const R = require("ramda")
const dispatcher = require("./helpers/dispatcher")

module.exports = {
  saveJson: function(name, data) {
    dispatcher.dispatch({
      name: "saveJson",
      value: {name: name, data: data},
    })

    if (name === "schema") {
      dispatcher.dispatch({
        name: "updateResultFields",
        value: {fields: R.keys(data)},
      })
    }
  },

  addFilter: function(name) {
    dispatcher.dispatch({
      name: "addFilter",
      value: {name: name},
    })
  },

  deleteFilter: function(id) {
    dispatcher.dispatch({
      name: "deleteFilter",
      value: {id: id},
    })
  },

  toggleFilter: function(id, active) {
    dispatcher.dispatch({
      name: "updateFilter",
      value: {id: id, value: {active: active}},
    })
  },

  updateFilter: function(id, value) {
    dispatcher.dispatch({
      name: "updateFilter",
      value: {id: id, value: value},
    })
  },

  limit: function(number) {
    dispatcher.dispatch({
      name: "limit",
      value: {number: number},
    })
  },

  reset: function() {
    dispatcher.dispatch({
      name: "reset",
      value: {},
    })
  },

  addGrouping: function(name) {
    dispatcher.dispatch({
      name: "addGrouping",
      value: {name: name},
    })
  },

  removeGrouping: function(name) {
    dispatcher.dispatch({
      name: "removeGrouping",
      value: {name: name},
    })
  },

  sortBy: function(name) {
    dispatcher.dispatch({
      name: "sortBy",
      value: {name: name},
    })
  },

  sortDirection: function(direction) {
    dispatcher.dispatch({
      name: "sortDirection",
      value: {direction: direction},
    })
  },

  sum: function(name) {
    dispatcher.dispatch({
      name: "sum",
      value: {name: name},
    })
  },

  average: function(name) {
    dispatcher.dispatch({
      name: "average",
      value: {name: name},
    })
  },

  goBack: function() {
    dispatcher.dispatch({
      name: "goBack",
      value: {},
    })
  },

  updateResultFields: function(fields) {
    dispatcher.dispatch({
      name: "updateResultFields",
      value: {fields: fields},
    })
  },

  showCounts: function(showCounts) {
    dispatcher.dispatch({
      name: "showCounts",
      value: {showCounts: showCounts},
    })
  },
}
