const R = require("ramda")

module.exports = {
  round: R.curry(function(decimals, num) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }),

  updateWhere(find, update, data) {
    const index = R.findIndex(R.whereEq(find), data)
    return R.adjust(R.merge(R.__, update), index, data)
  },

  getMax(arr) {
    return Math.max.apply(null, arr)
  },

  getMin(arr) {
    return Math.min.apply(null, arr)
  },

  rainbow(count, index) {
    const value = 360 / count * index
    return `hsl(${value}, 90%, 60%)`
  },

  getCumulative(data) {
    const mapIndexed = R.addIndex(R.map)

    return mapIndexed(function(val, idx) {
      return R.compose(R.sum, R.slice(0, idx + 1))(data)
    }, data)
  },
}
