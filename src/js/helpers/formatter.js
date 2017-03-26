const R = require("ramda")
const moment = require("moment")

const isSameDayAs = R.curry(function(filterValue, dataValue) {
  return moment(dataValue).isSame(filterValue, "day")
})

const isBefore = R.curry(function(filterValue, dataValue) {
  return moment(dataValue).isBefore(filterValue)
})

const isAfter = R.curry(function(filterValue, dataValue) {
  return moment(dataValue).isAfter(filterValue)
})

const isBetweenDates = R.curry(function(start, end, dataValue) {
  return moment(dataValue).isBetween(start, end)
})

function isValidDate(date) {
  return moment(date, "YYYYMMDD").isValid()
}

const isOneOf = R.curry(function(filterValue, dataValue) {
  dataValue = (!R.isNil(dataValue)) ? dataValue.toString() : ""
  return R.compose(R.contains(dataValue), R.split(","), R.defaultTo(""))(filterValue)
})

const isBetween = R.curry(function(start, end, dataValue) {
  return R.allPass([R.gt(R.__, start), R.lt(R.__, end)])(dataValue)
})

const matches = R.curry(function(filterValue, dataValue) {
  const regParts = filterValue.match(/^\/(.*?)\/([gim]*)$/)
  const regex = (regParts) ? new RegExp(regParts[1], regParts[2]) : new RegExp(filterValue)
  return R.test(regex, dataValue)
})

const round = R.curry(function(decimals, num) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
})

function getMax(arr) {
  return Math.max.apply(null, arr)
}

function getMin(arr) {
  return Math.min.apply(null, arr)
}

function addStringFilter(filter) {
  const acc = {}

  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") acc[filter.name] = R.equals(filter.value)
    if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(filter.value))
    if (filter.operator === "iof") acc[filter.name] = isOneOf(filter.value)
    if (filter.operator === "inof") acc[filter.name] = R.compose(R.not, isOneOf(filter.value))
    if (filter.operator === "rgm") acc[filter.name] = matches(filter.value)
  }

  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "nnl") acc[filter.name] = R.compose(R.not, R.isNil)

  return acc
}

function addIntFilter(filter) {
  const acc = {}

  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") acc[filter.name] = R.equals(parseFloat(filter.value))
    if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(parseFloat(filter.value)))
    if (filter.operator === "gt") acc[filter.name] = R.gt(R.__, parseFloat(filter.value))
    if (filter.operator === "gte") acc[filter.name] = R.gte(R.__, parseFloat(filter.value))
    if (filter.operator === "lt") acc[filter.name] = R.lt(R.__, parseFloat(filter.value))
    if (filter.operator === "lte") acc[filter.name] = R.lte(R.__, parseFloat(filter.value))
    if (filter.operator === "iof") acc[filter.name] = isOneOf(filter.value)
    if (filter.operator === "inof") acc[filter.name] = R.compose(R.not, isOneOf(filter.value))

    if (filter.value1 && filter.value1.length) {
      if (filter.operator === "btw") acc[filter.name] = isBetween(parseFloat(filter.value), parseFloat(filter.value1))
    }
  }

  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "nnl") acc[filter.name] = R.compose(R.not, R.isNil)

  return acc
}

function addBoolFilter(filter) {
  const acc = {}

  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "nnl") acc[filter.name] = R.compose(R.not, R.isNil)
  if (filter.operator === "true") acc[filter.name] = R.equals(true)
  if (filter.operator === "false") acc[filter.name] = R.equals(false)

  return acc
}

function addDateFilter(filter) {
  const acc = {}

  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") acc[filter.name] = R.equals(filter.value)
    if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(filter.value))

    if (filter.value.length === 8 && isValidDate(filter.value)) {
      if (filter.operator === "sd") acc[filter.name] = isSameDayAs(filter.value)
      if (filter.operator === "be") acc[filter.name] = isBefore(filter.value)
      if (filter.operator === "af") acc[filter.name] = isAfter(filter.value)
    }

    if (filter.value1 && filter.value1.length === 8 && isValidDate(filter.value1)) {
      if (filter.operator === "btw") acc[filter.name] = isBetweenDates(filter.value, filter.value1)
    }
  }

  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "nnl") acc[filter.name] = R.compose(R.not, R.isNil)

  return acc
}

function addArrayFilter(filter) {
  const acc = {}

  if (filter.value && filter.value.length) {
    if (filter.operator === "cos") acc[filter.name] = R.contains(filter.value)
    if (filter.operator === "con") acc[filter.name] = R.contains(parseFloat(filter.value))
    if (filter.operator === "hl") acc[filter.name] = R.compose(R.equals(parseInt(filter.value, 10)), R.length)
    if (filter.operator === "dhl") acc[filter.name] = R.compose(R.not, R.equals(parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hlgt") acc[filter.name] = R.compose(R.gt(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hlgte") acc[filter.name] = R.compose(R.gte(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hllt") acc[filter.name] = R.compose(R.lt(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hllte") acc[filter.name] = R.compose(R.lte(R.__, parseInt(filter.value, 10)), R.length)
  }

  return acc
}

const _sortAndCount = R.pipe(
  R.map(R.length),
  R.toPairs,
  R.sortBy(R.prop(1)),
  R.reverse,
  R.map(R.join(": "))
)

const _group = R.curry(function(groupings, showCounts, data) {
  data = R.groupBy(R.prop(groupings[0]), data)
  groupings = R.tail(groupings)
  if (!groupings.length) return (showCounts) ? _sortAndCount(data) : data

  return R.map(_group(groupings, showCounts), data)
})

const _getGroupLengths = R.pipe(
  R.toPairs,
  R.map(function(pair) {
    if (Array.isArray(pair[1])) return R.length(pair[1])
    return _getGroupLengths(pair[1])
  }),
  R.flatten
)

module.exports = {
  filter: function(data, schema, filters) {
    const builtFilters = R.reduce(function(acc, filter) {
      if (!filter.active) return acc

      const type = schema[filter.name]

      if (type === "string") acc = R.merge(acc, addStringFilter(filter))
      if (type === "int") acc = R.merge(acc, addIntFilter(filter))
      if (type === "bool") acc = R.merge(acc, addBoolFilter(filter))
      if (type === "date") acc = R.merge(acc, addDateFilter(filter))
      if (type === "array") acc = R.merge(acc, addArrayFilter(filter))

      return acc
    }, {}, filters)

    return R.filter(R.where(builtFilters), data)
  },

  group: function(groupings, showCounts, data) {
    return _group(groupings, showCounts, data)
  },

  sort: function(sortBy, sortDirection, data) {
    const sorted = R.sortBy(R.prop(sortBy), data)
    if (sortDirection === "desc") return R.reverse(sorted)
    return sorted
  },

  getGroupStats: function(grouped) {
    const groupLengths = _getGroupLengths(grouped)

    const count = {name: "No. of Groups", value: groupLengths.length}
    const max = {name: "Max Group Size", value: getMax(groupLengths)}
    const min = {name: "Min Group Size", value: getMin(groupLengths)}
    const mean = {name: "Average Group Size", value: R.compose(round(2), R.mean)(groupLengths)}

    return (count.value) ? [count, max, min, mean] : []
  },

  round: R.curry(function(decimals, num) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }),
}