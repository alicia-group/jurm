
import {EditorState, RangeSetBuilder, StateField, Annotation} from "@codemirror/state";
import {EditorView, ViewPlugin, Decoration} from "@codemirror/view";
import {basicSetup} from '@codemirror/basic-setup';
import React from 'react';

import initial_code from '../initial_code.js';

const error_line_decoration = Decoration.line({
  attributes: {
    "class": ".cm-editor-error-line",
    "style": "background-color: #ff000080;"
  }
})

const next_line_decoration = Decoration.line({
  attributes: {
    "class": ".cm-editor-next-line",
    "style": "background-color: #00ff0080;"
  }
})

const line_with_error_field = StateField.define({
  create() {return -1},
  update(value, tr) {
    let changed_editor = tr.annotations[0].value !== "select.pointer";
    let changed_line_error = tr.annotations[0].value === "custom.error_line_change";
    if (changed_editor && (!changed_line_error)) {
      return -1;
    }
    if (changed_line_error) {
      return tr.error_line;
    } else {
      return value;
    }
  }
})

const next_line_field = StateField.define({
  create() {return -1},
  update(value, tr) {
    let changed_editor = tr.annotations[0].value !== "select.pointer";
    let changed_next_line = tr.annotations[0].value === "custom.next_line_change";
    if (changed_editor && (!changed_next_line)) {
      return -1;
    }
    if (changed_next_line) {
      return tr.next_line;
    } else {
      return value;
    }
  }
})

function highlight_lines_decoration(view) {
  let builder = new RangeSetBuilder();
  let line_with_error = view.state.field(line_with_error_field);
  let next_line_debugger = view.state.field(next_line_field);
  if (line_with_error !== -1 || next_line_debugger !== -1) {
    for (let {from, to} of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        let line = view.state.doc.lineAt(pos)
        if (line.number === line_with_error) {
          builder.add(line.from, line.from, error_line_decoration)
        }
        if (line.number === next_line_debugger) {
          builder.add(line.from, line.from, next_line_decoration)
        }
        pos = line.to + 1
      }
    }
  }
  return builder.finish()
}

const highlight_plugin = ViewPlugin.fromClass(class {

  constructor(view) {
    this.decorations = highlight_lines_decoration(view);
  }

  update(update) {
    this.decorations = highlight_lines_decoration(update.view);
  }
}, {
  decorations: v => v.decorations
})

export default class Editor extends React.Component {

  constructor() {
    super();
    this.view = null;
    this.state = {
      code: initial_code
    }
  }

  componentDidMount() {
    let editor_component = document.getElementById('cm-editor-root');
    let editor_was_not_mount = editor_component.children.length === 0;
    if (editor_was_not_mount) {
      console.log('Mounting editor')
      let defaultThemeOption = EditorView.theme({
        '&': {
          'height': '200px',
          'width': '80%'
        },
      });
      let updateDoc = EditorView.updateListener.of((vu) => {
        if (vu.docChanged) {
          let doc = vu.state.doc;
          let value = doc.toString();
          this.setState({code: value})
        }
      });
      let startState = EditorState.create({
        doc: this.state.code,
        extensions: [basicSetup, updateDoc, defaultThemeOption, line_with_error_field, next_line_field, highlight_plugin]
      })
      this.view = new EditorView({
        state: startState,
        parent: editor_component
      })
    }
  }

  setErrorLine(error_line) {
    let highlight_annotation = new Annotation()
    highlight_annotation.value = "custom.error_line_change";
    highlight_annotation.type = {};
    let transaction = this.view.state.update({annotations: highlight_annotation});
    transaction.error_line = error_line;
    this.view.dispatch(transaction);
  }

  setNextLine(next_line) {
    let highlight_annotation = new Annotation()
    highlight_annotation.value = "custom.next_line_change";
    highlight_annotation.type = {};
    let transaction = this.view.state.update({annotations: highlight_annotation});
    transaction.next_line = next_line;
    this.view.dispatch(transaction);
  }

  render() {
    return (
      <div id="cm-editor-root">
      </div>
    )
  }

}