export const state = () => ({
  CloudinaryConfLogos:
    'https://res.cloudinary.com/debsobrien/image/upload/c_scale,w_150,q_auto,f_auto/v1565547670/debbie.codes/conferences/',
  CloudinaryWorkshopProfile:
    'https://res.cloudinary.com/debsobrien/image/upload/c_thumb,w_150,h_150,q_auto,f_auto/v1565547670/debbie.codes/workshops/',

  blogPosts: [],
})

export const mutations = {
  setBlogPosts(state, list) {
    state.blogPosts = list
  },
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const files = await require.context(
      '~/assets/content/blog/',
      false,
      /\.json$/
    )
    const blogPosts = files.keys().map((key) => {
      const res = files(key)
      res.slug = key.slice(2, -5)
      return res
    })
    await commit('setBlogPosts', blogPosts)
  },
}
