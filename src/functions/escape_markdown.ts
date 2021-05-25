export function escape_markdown(string:string) {
    return string.replace(/[`\.\!\*\_\(\)\~\>\#\+\-\=\|\{\}\[\]\\]/g, '\\$&')
  }