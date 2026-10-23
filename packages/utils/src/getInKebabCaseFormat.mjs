function getInKebabCaseFormat(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .toLowerCase()
    .replace(/\./g, '') // remove dots
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // remove special characters
    .replace(/-+/g, '-') // replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // trim hyphens from start and end
}

export default getInKebabCaseFormat;
