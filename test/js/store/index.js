const chai = require("chai")
const expect = chai.expect

const dispatcher = require("../../../src/js/store/dispatcher")
const store = require("../../../src/js/store/index")

describe("store", function() {

  beforeEach(function() {
    expect(store.getState()).to.eql({
      filters: [],
      groupings: [],
      sorters: [],
      schema: null,
      data: null,
      resultFields: null,
      showCounts: false,
      groupSort: "desc",
      groupLimit: null,
      limit: null,
      analyse: null,
      calculatedFields: [],
      calculationsString: null,
      combineRemainder: false,
    })
  })

  afterEach(function() {
    store.resetState()
  })

  describe("saveJson", function() {
    it("should save json under the passed prop name", function() {
      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "schema", data: {foo: "string"}},
      })

      expect(store.getState().schema).to.eql({foo: "string"})
    })

    it("should reset filters, groupings and sortBy values to their defaults", function() {
      store.setState({
        filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}],
        groupings: ["bar"],
        sorters: ["baz"],
        limit: "aaa",
        analyse: "bbb",
        showCounts: true,
      })

      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")
      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().sorters).to.eql(["baz"])
      expect(store.getState().limit).to.eql("aaa")
      expect(store.getState().analyse).to.eql("bbb")
      expect(store.getState().showCounts).to.eql(true)

      dispatcher.dispatch({
        name: "saveJson",
        value: {name: "schema", data: {foo: "string"}},
      })

      expect(store.getState().filters).to.eql([])
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().sorters).to.eql([])
      expect(store.getState().limit).to.eql(null)
      expect(store.getState().analyse).to.eql(null)
      expect(store.getState().showCounts).to.eql(false)
    })
  })

  describe("updateResultFields", function() {
    it("should save field names", function() {
      dispatcher.dispatch({
        name: "updateResultFields",
        value: {fields: ["foo"]},
      })

      expect(store.getState().resultFields).to.eql(["foo"])
    })
  })

  describe("addFilter", function() {
    it("should add filter", function() {
      dispatcher.dispatch({
        name: "addFilter",
        value: {name: "foo"},
      })

      const filters = store.getState().filters
      expect(filters.length).to.eql(1)

      const filterJustAdded = filters[0]

      expect(filterJustAdded.id).to.be.a("string")
      delete filterJustAdded.id

      expect(filterJustAdded).to.eql({name: "foo", value: "", operator: "eq", active: true})
    })
  })

  describe("deleteFilter", function() {
    beforeEach(function() {
      store.setState({filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}]})
    })

    it("should delete filter", function() {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")

      dispatcher.dispatch({
        name: "deleteFilter",
        value: {id: 1},
      })

      expect(store.getState().filters).to.eql([])
    })
  })

  describe("updateFilter", function() {
    beforeEach(function() {
      store.setState({filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}]})
    })

    it("should update filter", function() {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].value).to.eql("")

      dispatcher.dispatch({
        name: "updateFilter",
        value: {id: 1, value: {value: "bar"}},
      })

      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].value).to.eql("bar")
    })
  })

  describe("limit", function() {
    it("limit", function() {
      dispatcher.dispatch({
        name: "limit",
        value: {number: 2},
      })

      expect(store.getState().limit).to.eql(2)
    })
  })

  describe("reset", function() {
    beforeEach(function() {
      store.setState({
        filters: [{id: 1, name: "foo", value: "", operator: "eq", active: true}],
        groupings: ["bar"],
        sorters: ["baz"],
        showCounts: true,
        groupSort: "asc",
        groupLimit: 10,
        limit: "aaa",
        analyse: "bbb",
        calculatedFields: ["dd"],
        calculationsString: "ff",
        data: "data",
        schema: "schema",
        resultFields: "resultFields",
      })
    })

    it("should reset filters, groupings and sortBy values to their defaults", function() {
      expect(store.getState().filters.length).to.eql(1)
      expect(store.getState().filters[0].name).to.eql("foo")
      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().sorters).to.eql(["baz"])
      expect(store.getState().showCounts).to.eql(true)
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().limit).to.eql("aaa")
      expect(store.getState().analyse).to.eql("bbb")

      dispatcher.dispatch({
        name: "reset",
        value: {},
      })

      expect(store.getState().filters).to.eql([])
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().sorters).to.eql([])
      expect(store.getState().showCounts).to.eql(false)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().limit).to.eql(null)
      expect(store.getState().analyse).to.eql(null)
    })

    it("should not reset some fields", function() {
      dispatcher.dispatch({
        name: "reset",
        value: {},
      })

      expect(store.getState().calculationsString).to.eql("ff")
      expect(store.getState().calculatedFields).to.eql(["dd"])
      expect(store.getState().data).to.eql("data")
      expect(store.getState().schema).to.eql("schema")
      expect(store.getState().resultFields).to.eql("resultFields")
    })
  })

  describe("addGrouping", function() {
    it("should add groupings and nullify analyse", function() {
      store.setState({analyse: "baz"})

      expect(store.getState().analyse).to.eql("baz")

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "foo"},
      })

      expect(store.getState().groupings).to.eql(["foo"])
      expect(store.getState().analyse).to.eql(null)
    })

    it("should ensure groupings field is included in results", function() {
      store.setState({resultFields: []})

      expect(store.getState().resultFields).to.eql([])

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql(["baz"])
      expect(store.getState().resultFields).to.eql(["baz"])
    })

    it("should make sure result fields array contains unique values", function() {
      store.setState({resultFields: ["foo", "bar"]})

      expect(store.getState().resultFields).to.eql(["foo", "bar"])

      dispatcher.dispatch({
        name: "addGrouping",
        value: {name: "bar"},
      })

      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().resultFields).to.eql(["foo", "bar"])
    })
  })

  describe("removeGrouping", function() {
    it("should remove field from grouping", function() {
      store.setState({groupings: ["baz"]})

      expect(store.getState().groupings).to.eql(["baz"])

      dispatcher.dispatch({
        name: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().groupings).to.eql([])
    })

    it("should reset showCounts, combineRemainder, groupSort and groupLimit if groupings is deselected", function() {
      store.setState({
        showCounts: true,
        groupSort: "asc",
        groupLimit: 10,
        groupings: ["baz"],
        combineRemainder: true,
      })

      expect(store.getState().showCounts).to.eql(true)
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      dispatcher.dispatch({
        name: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().showCounts).to.eql(false)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().combineRemainder).to.eql(false)
    })

    it("should not reset showCounts, combineRemainder, groupSort and groupLimit if groupings is still at least 1", function() {
      store.setState({
        showCounts: true,
        groupSort: "asc",
        groupLimit: 10,
        groupings: ["bar", "baz"],
        combineRemainder: true,
      })

      expect(store.getState().showCounts).to.eql(true)
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      dispatcher.dispatch({
        name: "removeGrouping",
        value: {name: "baz"},
      })

      expect(store.getState().showCounts).to.eql(true)
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)
    })
  })

  describe("addSorter", function() {
    it("should add sorter", function() {
      dispatcher.dispatch({
        name: "addSorter",
        value: {sorter: {field: "foo", direction: "desc"}},
      })

      expect(store.getState().sorters).to.eql([{field: "foo", direction: "desc"}])
    })
  })

  describe("removeSorter", function() {
    it("should remove sorter", function() {
      store.setState({sorters: [{field: "foo", direction: "desc"}]})

      dispatcher.dispatch({
        name: "removeSorter",
        value: {name: "foo"},
      })

      expect(store.getState().sorters).to.eql([])
    })
  })

  describe("showCounts", function() {
    it("should update showCounts", function() {
      dispatcher.dispatch({
        name: "showCounts",
        value: {showCounts: true},
      })

      expect(store.getState().showCounts).to.eql(true)
    })

    it("should reset groupSort, groupLimit and combineRemainder when set to false", function() {
      store.setState({groupSort: "asc", groupLimit: 10, combineRemainder: true})

      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      dispatcher.dispatch({
        name: "showCounts",
        value: {showCounts: false},
      })

      expect(store.getState().showCounts).to.eql(false)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().combineRemainder).to.eql(false)
    })
  })

  describe("analyse", function() {
    it("should add analyse and reset groupings, showCounts, combineRemainder, groupSort and groupLimit", function() {
      store.setState({
        groupings: ["bar"],
        showCounts: true,
        groupSort: "asc",
        groupLimit: 10,
        combineRemainder: true,
      })

      expect(store.getState().groupings).to.eql(["bar"])
      expect(store.getState().showCounts).to.eql(true)
      expect(store.getState().groupSort).to.eql("asc")
      expect(store.getState().groupLimit).to.eql(10)
      expect(store.getState().combineRemainder).to.eql(true)

      dispatcher.dispatch({
        name: "analyse",
        value: {name: "foo"},
      })

      expect(store.getState().analyse).to.eql("foo")
      expect(store.getState().groupings).to.eql([])
      expect(store.getState().showCounts).to.eql(false)
      expect(store.getState().groupSort).to.eql("desc")
      expect(store.getState().groupLimit).to.eql(null)
      expect(store.getState().combineRemainder).to.eql(false)
    })
  })

  describe("groupSort", function() {
    it("should add group sort", function() {
      dispatcher.dispatch({
        name: "groupSort",
        value: {groupSort: "foo"},
      })

      expect(store.getState().groupSort).to.eql("foo")
    })
  })

  describe("groupLimit", function() {
    it("should add group limit", function() {
      dispatcher.dispatch({
        name: "groupLimit",
        value: {groupLimit: "foo"},
      })

      expect(store.getState().groupLimit).to.eql("foo")
    })

    it("should add reset combineRemainder if group limit is unset", function() {
      store.setState({
        groupLimit: "foo",
        combineRemainder: true,
      })

      dispatcher.dispatch({
        name: "groupLimit",
        value: {groupLimit: null},
      })

      expect(store.getState().combineRemainder).to.eql(false)
    })
  })

  describe("combineRemainder", function() {
    it("should add group limit", function() {
      dispatcher.dispatch({
        name: "combineRemainder",
        value: {combineRemainder: "foo"},
      })

      expect(store.getState().combineRemainder).to.eql("foo")
    })
  })

  describe("saveCalculatedFields", function() {
    it("should save calculated fields", function() {
      dispatcher.dispatch({
        name: "saveCalculatedFields",
        value: {calculatedFields: "foo"},
      })

      expect(store.getState().calculatedFields).to.eql("foo")
    })
  })

  describe("saveCalculationsString", function() {
    it("should save the calculation string", function() {
      dispatcher.dispatch({
        name: "saveCalculationsString",
        value: {calculationsString: "foo"},
      })

      expect(store.getState().calculationsString).to.eql("foo")
    })
  })
})
