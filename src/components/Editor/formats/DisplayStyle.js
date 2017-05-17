import Quill from 'quill';

const Parchment = Quill.import('parchment');

const config = {
  scope: Parchment.Scope.INLINE,
  whitelist: ['none'],
};

const DisplayStyle = new Parchment.Attributor.Style('display', 'display', config);

export default DisplayStyle;

