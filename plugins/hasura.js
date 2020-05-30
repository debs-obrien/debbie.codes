export default function ({ $http, env }, inject) {
  const $hasura = $http.create({
    prefixUrl: env.API_HASURA_URL
  })

  $hasura.setHeader('x-hasura-admin-secret', env.Hasura_Admin_Secret_Key)

  inject('hasura', $hasura.$post.bind($hasura, ''))
}
