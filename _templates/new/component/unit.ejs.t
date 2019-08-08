---
to: "components/<%= h.inflection.dasherize(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '' %><%= h.inflection.dasherize(name).toLowerCase() %>.unit.js"
---
<%
  const fileName =
    (h.inflection.dasherize(name).toLowerCase().slice(0, 5) === '_base' ? '_' : '') +
    h.inflection.dasherize(name).toLowerCase()
  const importName = h.inflection.camelize(fileName.replace(/-/g, '_'))
%>import <%= importName %> from './<%= fileName %>'

describe('@components/<%= fileName %>', () => {
  it('exports a valid component', () => {
    expect(<%= importName %>).toBeAComponent()
  })
})
