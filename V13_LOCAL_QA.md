# V13 Local QA

## npm test
Exit: 0

```text

> barberpro-saas-starter@0.1.0 test
> npm run test:unit && npm run test:contracts && npm run test:production && npm run test:source && npm run test:security


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

> barberpro-saas-starter@0.1.0 test:security
> node tests/security/public-booking-surface.test.mjs && node tests/security/rls-contract.test.mjs

public booking surface tests: OK
RLS contract tests: OK

```

Dependency-based `typecheck`/`next build` still require a normal npm registry environment.
