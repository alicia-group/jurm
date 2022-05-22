
import tokens from './tokens.js'

function isNaturalNumber(word) {
  return Boolean(/^\d+$/.exec(word));
}

function isRegisterNumber(word) {
  return Boolean(/^r\d+$/.exec(word));
}

export default function lexer(code) {
  let words_per_line;
  let lines = code.split('\n');
  let tokens_read = [];
  for (let line of lines) {
    words_per_line = line.split(' ');
    for (let word of words_per_line) {
      if (word == 'ld') {
        tokens_read.push(tokens.LOAD);
        continue;
      }
      if (word == 'clear') {
        tokens_read.push(tokens.CLEAR);
        continue;
      }
      if (word == 'jp') {
        tokens_read.push(tokens.JUMP);
        continue;
      }
      if (isNaturalNumber(word)) {
        tokens_read.push(tokens.NATURAL_NUMBER);
        tokens_read.push(parseInt(word));
        continue;
      }
      if (isRegisterNumber(word)) {
        tokens_read.push(tokens.REGISTER_NUMBER);
        tokens_read.push(parseInt(word.substring(1)));
        continue;
      }
      if (word === '' || word === '\t') {
        continue;
      } else {
        return tokens_read;
      }
    }
    tokens_read.push(tokens.NEW_LINE)
  }
  tokens_read.pop();
  return tokens_read;
}
