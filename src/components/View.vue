<template>
  <div id="view">
    <main>
      <article>
        <div id="content" v-html="rendered"></div>
      </article>
    </main>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import Explorer from '../aws/Explorer';

const md = new MarkdownIt();

export default {
  name: 'view',
  data() {
    return ({
      rendered: '',
    });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const filePath = to.params.path;
      Explorer.getFile(filePath, Explorer.ObjectType.PUBLIC_FILE)
      .then((content) => {
        /* eslint no-param-reassign: ["off", { "props": true }] */
        const rendered = md.render(content);
        vm.rendered = rendered;
      });
    });
  },
};
</script>

<style>
#content {
  margin: 0 auto;
  max-width: 740px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 21px;
  font-family: "Times New Roman";
  color: rgba(0, 0, 0, 0.85);
}
h1 {
  font-size: 1.9em;
  margin: .67em 0;
}
h2 {
  font-size: 1.4em;
  margin: .75em 0;
}
h3 {
  font-size: 1.1em;
  margin: .83em 0;
}
h5 {
  font-size: .83em;
  margin: 1.5em 0;
}
h6 {
  font-size: .75em;
  margin: 1.67em 0;
}
h1, h2, h3, h4, h5, h6 {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: bolder;
}
p {
  line-height: 1.58;
  letter-spacing: -.003em;
}
pre {
  padding: 16px;
  overflow: auto;
  background-color: #f6f8fa;
  border-radius: 3px;
}
code {
  font-size: 75%;
  font-family: Consolas, monaco, monospace;
  background-color: #f6f8fa;
}
#view {
  overflow-y: scroll;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
</style>
