export function escape_regexp(string:string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}