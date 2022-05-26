
import tokens from './tokens.js'

function isNaturalNumber(word) {
  return Boolean(/^\d+$/.exec(word));
}

function isRegisterNumber(word) {
  return Boolean(/^r\d+$/.exec(word));
}

class LexerResult {
  constructor() {
    this.tokens = [];
    this.unregonized_line = -1;
  }
}

export default function lexer(code) {
  let words_per_line;
  let lines = code.split('\n');
  let result = new LexerResult();
  let line_index = 0;
  for (let line of lines) {
    words_per_line = line.split(' ');
    for (let word of words_per_line) {
      if (word === 'copy') {
        result.tokens.push(tokens.COPY);
        continue;
      }
      if (word === 'zero') {
        result.tokens.push(tokens.ZERO);
        continue;
      }
      if (word === 'suc') {
        result.tokens.push(tokens.SUC);
        continue;
      }
      if (word === 'jump') {
        result.tokens.push(tokens.JUMP);
        continue;
      }
      if (isNaturalNumber(word)) {
        result.tokens.push(tokens.NATURAL_NUMBER);
        result.tokens.push(parseInt(word));
        continue;
      }
      if (isRegisterNumber(word)) {
        result.tokens.push(tokens.REGISTER_NUMBER);
        result.tokens.push(parseInt(word.substring(1)));
        continue;
      }
      if (word === '' || word === '\t') {
        continue;
      } else {
        result.unregonized_line = line_index;
        return result;
      }
    }
    line_index++;
    result.tokens.push(tokens.NEW_LINE)
  }
  result.tokens.pop();
  return result;
}
