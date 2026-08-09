# V11 Local QA

## npm test
Exit: 0
```

> barberpro-saas-starter@0.1.0 test
> npm run test:unit && npm run test:contracts && npm run test:production


> barberpro-saas-starter@0.1.0 test:unit
> node tests/unit/time-overlap.test.mjs

time-overlap tests: OK

> barberpro-saas-starter@0.1.0 test:contracts
> node tests/integration/security.contract.test.mjs

permission contract tests: OK

> barberpro-saas-starter@0.1.0 test:production
> node tests/integration/production.contract.test.mjs

production contract tests: OK

```

## typecheck
Exit: 2
```
use no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(34,150): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(34,181): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(34,190): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(34,199): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(35,4): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(35,35): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(35,116): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(35,125): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(35,187): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(35,196): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(36,3): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(36,9): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
components/team/TeamManager.tsx(36,16): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
lib/auth.ts(1,26): error TS2307: Cannot find module 'next/navigation' or its corresponding type declarations.
lib/supabase.ts(1,37): error TS2307: Cannot find module '@supabase/ssr' or its corresponding type declarations.
lib/supabase.ts(4,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
lib/supabase.ts(5,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
lib/supabase/client.ts(1,37): error TS2307: Cannot find module '@supabase/ssr' or its corresponding type declarations.
lib/supabase/client.ts(4,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
lib/supabase/client.ts(5,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
lib/supabase/server.ts(1,36): error TS2307: Cannot find module '@supabase/ssr' or its corresponding type declarations.
lib/supabase/server.ts(2,25): error TS2307: Cannot find module 'next/headers' or its corresponding type declarations.
lib/supabase/server.ts(7,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
lib/supabase/server.ts(8,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
lib/supabase/server.ts(12,16): error TS7006: Parameter 'cookiesToSet' implicitly has an 'any' type.
lib/supabase/server.ts(14,36): error TS7031: Binding element 'name' implicitly has an 'any' type.
lib/supabase/server.ts(14,41): error TS7031: Binding element 'value' implicitly has an 'any' type.
lib/supabase/server.ts(14,47): error TS7031: Binding element 'options' implicitly has an 'any' type.
middleware.ts(1,36): error TS2307: Cannot find module '@supabase/ssr' or its corresponding type declarations.
middleware.ts(2,48): error TS2307: Cannot find module 'next/server' or its corresponding type declarations.
middleware.ts(7,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
middleware.ts(8,5): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
middleware.ts(12,16): error TS7006: Parameter 'cookiesToSet' implicitly has an 'any' type.
middleware.ts(13,34): error TS7031: Binding element 'name' implicitly has an 'any' type.
middleware.ts(13,39): error TS7031: Binding element 'value' implicitly has an 'any' type.
middleware.ts(15,34): error TS7031: Binding element 'name' implicitly has an 'any' type.
middleware.ts(15,39): error TS7031: Binding element 'value' implicitly has an 'any' type.
middleware.ts(15,45): error TS7031: Binding element 'options' implicitly has an 'any' type.
next.config.ts(1,33): error TS2307: Cannot find module 'next' or its corresponding type declarations.

```

## build
Exit: 127
```

> barberpro-saas-starter@0.1.0 build
> next build

sh: 1: next: Permission denied

```
