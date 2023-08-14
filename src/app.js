// css
require('./styles/base.less')

let Framework = require('./Framework').default
new Framework({
  renderTarget: '#app',
})
