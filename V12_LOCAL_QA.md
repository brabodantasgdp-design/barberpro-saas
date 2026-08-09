# V12 QA RESULT

## npm test
Exit: 0
```

> barberpro-saas-starter@0.1.0 test
> npm run test:unit && npm run test:contracts && npm run test:production && npm run test:source


> barberpro-saas-starter@0.1.0 test:unit
> node tests/unit/time-overlap.test.mjs

time-overlap tests: OK

> barberpro-saas-starter@0.1.0 test:contracts
> node tests/integration/security.contract.test.mjs

permission contract tests: OK

> barberpro-saas-starter@0.1.0 test:production
> node tests/integration/production.contract.test.mjs

production contract tests: OK

> barberpro-saas-starter@0.1.0 test:source
> node tests/integration/source-integrity.test.mjs

source integrity tests: OK

```

## npm registry probe (`next`)
Exit: 1
```
npm error code E404
npm error 404 Not Found - GET https://packages.applied-caas-gateway1.internal.api.openai.org/artifactory/api/npm/npm-public/next
npm error 404
npm error 404  'next@*' is not in this registry.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
npm error A complete log of this run can be found in: /home/oai/.npm/_logs/2026-08-09T02_18_16_739Z-debug-0.log

```

Typecheck/build are intentionally NOT reported as passing because dependencies cannot be installed in this sandbox registry.
