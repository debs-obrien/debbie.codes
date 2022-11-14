export function formatDate(string: string) {
  const options: Object = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(string).toLocaleDateString('en-US', options);
  return date;
}
