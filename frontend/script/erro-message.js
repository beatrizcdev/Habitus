export function styledError(msg) {
  console.error(
    '%c[ ERRO ]%c ' + msg,
    'background: white; color: black; font-weight: bold; padding: 2px 6px; border-radius: 30px;',
    'color: red;'
  );
}