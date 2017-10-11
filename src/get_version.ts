const MAJOR = 0;
const MINOR = 0;
const PATCH = 0;
const BUILD = 9265;

export default function getVersion(): string {
  return `v.${MAJOR}.${MINOR}.${PATCH}-${BUILD}`;
}