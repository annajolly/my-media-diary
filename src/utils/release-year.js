// Release dates come in mixed formats ("2005", "2005-03", "2005-03-14", or
// full ISO strings). Read the year from the string itself so a year-only
// value isn't shifted into the previous year by timezone conversion.
export const getReleaseYear = (releaseDate) => {
  const text = (releaseDate ?? '').toString().trim();
  if (!text) {
    return null;
  }

  const leadingYear = text.match(/^(\d{4})/);
  if (leadingYear) {
    return Number(leadingYear[1]);
  }

  const parsedDate = new Date(text);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.getFullYear();
};
