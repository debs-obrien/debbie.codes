export default function(_, inject) {
  inject('url', {
    base(path) {
      return process.env.baseImage + path
    },
    conference(path) {
      return process.env.conferenceImage + path
    },
    workshop(path) {
      return process.env.workshopImage + path
    },
  })
}
