// eslint-disable-next-line require-await
export default async function ({ query, enablePreview }) {
  if (query.preview) {
    enablePreview()
  }
}
