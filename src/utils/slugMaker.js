export const slugify = (text="") => {
  return text
    .toString()
    .trim() // extra space remove
    .toLowerCase() // lowercase
    .replace(/\s+/g, '-') // space -> hyphen
    .replace(/[^\w\-]+/g, '') // special char remove
    .replace(/\-\-+/g, '-') // multiple hyphen -> single
    .replace(/^-+/, '') // starting hyphen remove
    .replace(/-+$/, ''); // ending hyphen remove
}