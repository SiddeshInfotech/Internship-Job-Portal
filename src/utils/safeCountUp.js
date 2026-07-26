import * as CountUpModule from 'react-countup';

// Defensive unwrap for react-countup's default export.
//
// react-countup's CJS build does `exports.default = CountUp; exports.useCountUp = ...`.
// Vite's dependency pre-bundler sometimes resolves this to `export default require_build()`
// (the whole CJS module object) instead of unwrapping `.default` for us — which makes
// `import CountUp from 'react-countup'` bind to `{ default: CountUp, useCountUp }`
// instead of the actual component. React then throws "Element type is invalid...got:
// object" the moment you render `<CountUp />`. This checks every plausible shape so the
// app works regardless of how the bundler resolved it.
const CountUp =
  typeof CountUpModule === 'function' ? CountUpModule :
  typeof CountUpModule.default === 'function' ? CountUpModule.default :
  typeof CountUpModule.default?.default === 'function' ? CountUpModule.default.default :
  CountUpModule;

export default CountUp;
