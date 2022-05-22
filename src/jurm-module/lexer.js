
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
    this.unregonized = "";
  }
}

export default function lexer(code) {
  let words_per_line;
  let lines = code.split('\n');
  let result = new LexerResult();
  for (let line of lines) {
    words_per_line = line.split(' ');
    for (let word of words_per_line) {
      if (word == 'ld') {
        result.tokens.push(tokens.LOAD);
        continue;
      }
      if (word == 'clear') {
        result.tokens.push(tokens.CLEAR);
        continue;
      }
      if (word == 'jp') {
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
        return result;
      }
    }
    result.tokens.push(tokens.NEW_LINE)
  }
  result.tokens.pop();
  return result;
}
