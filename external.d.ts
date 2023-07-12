// external.d.ts

type Rule = {
  check: Function,
  text: string,
  detail: string,
  tmp: boolean | string | number,
}
declare let rules: Rule[];