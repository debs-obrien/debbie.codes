export default function ({ $http, env }, inject) {
  const $hasura = $http.create({
    prefixUrl: env.API_HASURA_URL
  })

  inject('hasura', $hasura.$post.bind($hasura, ''))
}
