export default function getPosition(element) {
  const {
    sourcepos, // #:#-#:#
  } = element.dataset;
  if (!sourcepos) {
    return getPosition(element.parentElement);
  }
  const start = parseInt(sourcepos, 10) - 1;
  const dashIndex = sourcepos.indexOf('-');
  const end = parseInt(sourcepos.substring(dashIndex + 1), 10) - 1;
  return {
    start,
    end,
  };
}
