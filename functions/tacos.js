exports.handler = async (event, context) => {
  const result = await {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hi there Tacos',
      event
    })
  }
  return result
}
