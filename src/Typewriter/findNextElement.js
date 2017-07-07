export default function findNextElement(element, rootElement) {
  if (element === rootElement) {
    return null;
  }
  return element.nextElementSibling
  ? element.nextElementSibling
  : findNextElement(element.parentElement, rootElement);
}
