const React = require("react")

const testSchema = {
  Album: "string",
  Artist: "string",
  Genre: "string",
  Length: "number",
  Size: "string",
  Title: "string",
  Track: "number",
  Year: "date",
}

const testUrl = "http://jsonquery.co.uk/test-data.json"

const Url = React.createClass({
  displayName: "Url",

  getInitialState() {
    return {
      url: testUrl,
      schema: JSON.stringify(testSchema, null, 2),
      checked: false,
    }
  },

  onUrlChange(e) {
    this.setState({
      url: e.target.value,
      schema: "",
    })
  },

  onSchemaChange(e) {
    this.setState({
      schema: e.target.value,
    })
  },

  onCheckboxChange() {
    this.setState({
      checked: !this.state.checked,
    })
  },

  onGo() {
    if (!this.state.url) {
      alert("You must supply a url")
      return
    }

    const url = encodeURIComponent(this.state.url)
    const schema = (this.state.schema.length) ? `&schema=${encodeURIComponent(this.state.schema)}` : ""
    const withCredentials = (this.state.checked) ? "&withCredentials" : ""
    window.location = `?dataUrl=${url}${schema}${withCredentials}`
  },

  render() {
    return (
      <div>
        <p>You can also load in data via the url. The data must be in JSON format and depending on the size of the data set, it may take a long time to load in.</p>
        <p><input type="text" className="url" value={this.state.url} onChange={this.onUrlChange} /></p>
        <p>
          <label className="checkbox-label">
            <input type="checkbox" name="withCredentials" checked={this.state.checked} onChange={this.onCheckboxChange} />
            Send cookies with request
          </label>
        </p>
        <p>If you wanted to override the automatic schema generation you can also supply your own schema, but this is optional. The schema must be valid JSON and gets URL encoded when turned into a URL parameter.</p>
        <textarea className="urlSchema" value={this.state.schema} onChange={this.onSchemaChange} />
        <button onClick={this.onGo}>Go</button>
      </div>
    )
  },
})

module.exports = Url
