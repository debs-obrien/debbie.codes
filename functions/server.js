exports.handler = async (event, context) => {
  const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET

  return HASURA_GRAPHQL_ADMIN_SECRET
}
