# Senior Angular Interview — Deep-Dive Bank

Questions about **real mechanics**, not API surface. The goal is to tell apart someone who understands *how things actually work under the hood* (browser, change detection, DI, RxJS, signals) from someone who's merely comfortable using the framework. This is a companion to the basic set: warm up with the basics, dig with these.

Current for **Angular 21/22 (2026)**: zoneless by default, signals in the core, signal-based inputs/forms, incremental hydration.

> **Fitting into 30 min.** These questions are "expensive" — 3–5 min each with proper follow-up, and the bank is deliberately wider than the slot. In one interview you can realistically take **4–6** of them deep + 1–2 puzzles. Use the ⭐-marked ones as the core, the rest depending on the candidate's direction. For each: ✅ strong answer / 🚩 red flag.

---

## 1. Browser internals & rendering

**1.1 ⭐ Describe the critical rendering path. What are reflow, repaint and composite, and how do they differ in cost?**
- ✅ DOM + CSSOM → render tree (visible only) → **layout/reflow** (geometry) → **paint** (filling pixels into layers) → **composite** (compositing layers on the GPU). Reflow is the most expensive, composite the cheapest.
- ✅✅ Knows that `transform`/`opacity` go through composite only (skipping layout+paint), so animating `transform: translate` is cheaper than `top`/`left`. Knows about layout thrashing (read-after-write — `el.offsetHeight` after a style change forces a synchronous layout).
- 🚩 Confuses reflow and repaint; doesn't get why `transform` beats `top` for animations.

**1.2 ⭐ Explain the browser event loop: where do `setTimeout`, promises and `requestAnimationFrame` land? When does rendering happen?**
- ✅ The loop: run one macrotask → **fully** drain the microtask queue → (possibly) `rAF` callbacks → render (style/layout/paint) → next macrotask. Promises are microtasks (before the next paint, earlier than `setTimeout`); `setTimeout` is a macrotask.
- ✅✅ Understands that a flood of microtasks can starve rendering (it won't happen until the microtask queue empties); `rAF` is synced to the frame.
- 🚩 "A promise and `setTimeout(0)` are the same thing."

**1.3 How does Zone.js hook into the event loop and why does Angular need it?**
- ✅ It patches async APIs — both macrotasks (`setTimeout`, DOM events, XHR) and microtasks (`Promise`) — to know when async work has finished and to run CD after the turn.
- ✅✅ Connects this to the move to **zoneless**: without the zone, CD is triggered explicitly (signals / `markForCheck` / events via the new scheduler), smaller bundle, cleaner stack traces.
- 🚩 Doesn't understand the Zone.js ↔ change detection link.

**1.4 (bank) `<script>` vs `async` vs `defer` vs `type="module"` — how does each affect parsing and rendering? Why is CSS render-blocking?**
- ✅ A plain `<script>` blocks parsing; `async` — loads in parallel, executes as soon as it's downloaded (no order guarantee); `defer` — in parallel, executes after parsing, in order; `module` — `defer` by default. CSS blocks rendering because the browser needs the CSSOM before building the render tree.

---

## 2. Change detection in depth

**2.1 ⭐⭐ Whose change detection does content projected via `<ng-content>` belong to — the parent that declares it, or the child containing `<ng-content>`?**
- ✅ The **parent that declares it**. Projected nodes logically belong to the parent component's view (its template created them), so they're checked as part of the parent's CD — even if the component containing `<ng-content>` is `OnPush` and not marked dirty. The child's own template, meanwhile, only updates if the child is marked dirty.
- ✅✅ Knows `ngAfterContentInit/Checked` fire **before** `ngAfterViewInit/Checked`; connects it to `viewProviders` (see 4.4).
- 🚩 "The child is OnPush, therefore nothing inside it updates."

**2.2 ⭐ What is `ExpressionChangedAfterItHasBeenCheckedError`, when does it occur, and how do you fix it properly (not via `setTimeout`)?**
- ✅ Dev mode only: after a CD pass Angular runs a second, verification pass; if a bound value changed between the passes it throws. The cause is mutating a bound value during CD itself (state change in `ngAfterViewInit`, a getter returning a new object every time, a child emitting to the parent during CD).
- ✅✅ Proper fixes: move the state change to `ngOnInit` / before CD, a deliberate `cdr.detectChanges()`, restructuring. `Promise.resolve().then()` is a last resort and they understand **why** it works (microtask after CD).
- 🚩 "Just wrap it in `setTimeout`" without understanding the cause.

**2.3 How does the `async` pipe actually work internally? Why does it "play nice" with OnPush?**
- ✅ Subscribes on the first emission, stores the latest value, calls `cdr.markForCheck()` on each emission (so OnPush updates), returns the current value on each CD, unsubscribes in `ngOnDestroy`, re-subscribes to a new Observable when the reference changes.
- 🚩 Thinks the `async` pipe updates "magically" without the change detector.

**2.4 (bank) What triggers CD in zoneless mode? What breaks without the zone?**
- ✅ Signals, `markForCheck`, events via the scheduler, the `async` pipe. Mutation-based patterns break (UI silently doesn't update); third-party libraries that relied on Zone need auditing.

---

## 3. Signals reactivity under the hood

**3.1 ⭐⭐ How does the signals dependency graph work? What does it mean that `computed` is "lazy" and memoized?**
- ✅ There are producers (`signal`/`computed`) and consumers (`computed`/`effect`). Reading a signal inside a computed/effect establishes a dependency. Changing a signal doesn't recompute immediately — it just marks dependents "dirty" (push); the `computed` recomputes **lazily on the next read** (pull) and is cached until dependencies change. Versioning gives glitch-free consistency.
- ✅✅ Understands that a `computed` won't run at all if nobody reads it; that the graph is **dynamic** — dependencies are re-determined on every run (conditional branches).
- 🚩 Thinks a `computed` recomputes on every change of any signal regardless of use.

**3.2 ⭐ When does `effect()` run and why `untracked()`? Why is writing to a signal inside an effect dangerous?**
- ✅ `effect` registers dependencies from the signals it reads and re-runs when they change; execution is scheduled (after the current CD), it has a cleanup callback. `untracked()` reads a signal without creating a dependency. Writing to a signal from an effect risks loops/cascades; it's discouraged by default (historically — `allowSignalWrites`).
- ✅✅ Understands that **derived state** needs `computed`, not an "effect that writes back."
- 🚩 Uses an effect for derived state or for synchronization that creates loops.

**3.3 ⭐ Why do two objects with the same contents "update" a signal, while mutation doesn't? How does equality work and when do you set a custom `equal`?**
- ✅ By default a signal compares via `Object.is`/`===`: `set` with the same reference won't notify, mutating a field won't either, but a **new** object with the same contents will (different reference). For meaningful comparison — a custom `equal`.
- 🚩 Mutates an object inside a signal and expects an update; doesn't know about `equal`.

**3.4 (bank) `toSignal`/`toObservable`, `linkedSignal`, `resource()`/`rxResource()` — what for and what are the pitfalls?**
- ✅ `toSignal` — an RxJS→signal bridge (needs an injection context, has an initial value / `requireSync`); `toObservable` — the reverse. `linkedSignal` (19+) — writable state that resets when its source changes. `resource()`/`rxResource()` — declarative async loading with loading/error/value state on signals.

---

## 4. Dependency Injection — under the hood

**4.1 ⭐⭐ What kinds of injectors exist in Angular and in what order is a dependency resolved?**
- ✅ Two parallel trees. **ElementInjector** (follows the component/DOM tree, created on elements with `providers`/`viewProviders`/directives) and **EnvironmentInjector / ModuleInjector** (NullInjector → Platform → root → children for lazy routes). Resolution: first up the ElementInjector tree from the requester to the root element, **then** it falls through to the Environment tree (current → root → platform), and finally **NullInjector** throws `NullInjectorError`.
- ✅✅ Knows `PlatformInjector` (shared across multiple apps on the page) and that route-level `providers` create a separate `EnvironmentInjector` for the route subtree.
- 🚩 "There's one injector per app"; doesn't know about the two trees.

**4.2 ⭐⭐ What happens to DI in a lazy-loaded module/route? Explain the classic "two singleton instances" bug.**
- ✅ A lazy route gets its **own child** `EnvironmentInjector`. A service with `providedIn: 'root'` stays single per app (a tree-shakable singleton). But if you put the service in a lazy module's/route's `providers`, a **separate** instance is created, distinct from the root one. Hence the bug: a state/auth "singleton" is duplicated, and eager and lazy parts see different copies.
- ✅✅ Explains `providedIn: 'root'` vs `'any'` (a separate instance per injector that requests it → each lazy gets its own) vs `'platform'`; why the `forRoot()/forChild()` pattern exists.
- 🚩 Doesn't know that `providers` in a lazy module breaks singleton-ness.

**4.3 ⭐ What are `@Self`, `@SkipSelf`, `@Optional`, `@Host` for? Give a real case for `@Host`.**
- ✅ `@Optional` — `null` instead of an error; `@Self` — look only in the current injector; `@SkipSelf` — start from the parent; `@Host` — walk up the ElementInjector tree but **stop at the component's host element** (the boundary). `@Host` case: a directive in projected content that must take a provider specifically from the host component, not from the whole app.
- 🚩 Knows the names but can't explain `@Self` vs `@Host` or give a case.

**4.4 ⭐⭐ `providers` vs `viewProviders` on a component — what's the difference? How is it related to `<ng-content>`?**
- ✅ `providers` are visible to both the component's own view and **projected content**. `viewProviders` are visible **only to the component's own view**, but **not** to content projected via `<ng-content>`. So a directive inside `<ng-content>` will get what's in the host's `providers`, but not what's in `viewProviders`.
- 🚩 Doesn't know about `viewProviders` or thinks it's the same as `providers`.

---

## 5. RxJS under the hood

**5.1 ⭐ What is an Observable "physically"? Describe the contract between Observable and Observer.**
- ✅ Essentially a function that takes an observer and returns teardown logic. The contract: any number of `next`, then **at most one** `error` OR `complete`, after which there are no more emissions and cleanup happens.
- ✅✅ Understands that cold = the producer is created per subscription (unicast), while a Subject makes it hot/multicast (a Subject is both an observer and an observable).
- 🚩 "An Observable is just a promise that returns many values."

**5.2 ⭐ What RxJS schedulers exist and how do they map onto the event loop? When do you need `observeOn`/`subscribeOn`?**
- ✅ `asyncScheduler` → `setTimeout` (macrotask); `asapScheduler` → microtask (`Promise`); `queueScheduler` → synchronous but queued (saves you from stack overflow on recursion); `animationFrameScheduler` → `rAF`. `subscribeOn` controls **when subscription happens**; `observeOn` — **when emissions are delivered**.
- 🚩 Hasn't heard of schedulers at all.

**5.3 ⭐ What is a "glitch" in reactivity? Why can a naive `combineLatest` emit an intermediate state while `computed` (signals) doesn't?**
- ✅ A glitch is a brief inconsistent intermediate state when a shared source updates and derived values recompute inconsistently. `computed` is built glitch-free (push-then-pull dependency graph, a synchronous consistent snapshot); `combineLatest` over a shared source can emit an intermediate combination.
- ✅✅ Mentions this is one reason synchronous derived state shifted to signals.
- 🚩 Has never run into extra/intermediate emissions.

**5.4 (bank) `shareReplay` — what for and what's the `refCount` pitfall?**
- ✅ Multicasts + replays the latest values to new subscribers (e.g., to cache HTTP). Pitfall: `shareReplay()` without `refCount: true` keeps the inner subscription alive even after everyone has unsubscribed → leak / "eternal" upstream.

---

## 6. The HTTP layer: interceptors & the request flow

**6.1 ⭐ How do HTTP interceptors work? Explain the execution order and give 3 real use cases. Why are functional interceptors (15+) better than class-based ones?**
- ✅ Interceptors form a chain around the request: "on the way out" they run in registration order, "on the way back" (on the response) — in reverse. Use cases: injecting an auth token, retry/backoff, logging/tracing, caching, global loading/error handling. Functional ones (`HttpInterceptorFn`) are simpler, tree-shakable, without extra DI boilerplate, and use `inject()`.
- ✅✅ Knows `HttpContext`/`HttpContextToken` for per-request config (e.g., "skip auth for this request"); that `next(req)` returns an Observable you can process/replace.
- 🚩 Doesn't understand the chain/order or thinks an interceptor only sees the request, not the response.

**6.2 (bank) Why is an HttpClient request canceled automatically with `switchMap`? How does that work?**
- ✅ HttpClient is cold; unsubscribing from it (which `switchMap` does on a new emission) triggers teardown → the browser aborts the XHR/fetch (`abort`). Hence the "free" cancellation of stale requests in a typeahead.

---

## 7. Forms & custom controls

**7.1 ⭐⭐ Implement a custom form control. What is `ControlValueAccessor` and what are its methods?**
- ✅ CVA is the bridge between a native/custom input and the Angular Forms API. Four methods: `writeValue` (model→view), `registerOnChange` (view→model), `registerOnTouched`, `setDisabledState`. Registered via the `NG_VALUE_ACCESSOR` provider with `multi: true` and `useExisting`/`forwardRef`.
- ✅✅ Knows why `forwardRef` is needed; how to integrate validation (`NG_VALIDATORS`); that CVA makes `formControlName`/`ngModel` work out of the box.
- 🚩 Doesn't know all four methods or why `NG_VALUE_ACCESSOR`.

**7.2 ⭐ Reactive vs template-driven — when to use which? How do you write a cross-field and an async validator?**
- ✅ Reactive — for complex/dynamic/testable forms (model in code, synchronous). Template-driven — for simple ones. A cross-field validator is attached to the `FormGroup` (it sees several controls); an async one returns an `Observable`/`Promise` with an error or `null`, governed by `updateOn` ('change'/'blur'/'submit') to control frequency.
- 🚩 "Always reactive/template"; doesn't know a cross-field validator lives on the group.

**7.3 (bank) Signal Forms (21/22) — what is it and how does it differ from reactive forms?**
- ✅ A new, signal-driven forms system: state/validity as signals, less boilerplate and fewer subscriptions, aligned with the signal-first direction. Stabilizing in v22.

---

## 8. Component composition & design

**8.1 ⭐⭐ How do you compose behavior without inheritance? What is `hostDirectives` (15+)?**
- ✅ `hostDirectives` let you declaratively "attach" directives to a component's host (composition over inheritance) and even forward their inputs/outputs. It's the modern replacement for mixins/inheritance for reusing behavior (a11y, analytics, tooltip, etc.).
- 🚩 Reaches for component inheritance or copy-paste to share behavior.

**8.2 ⭐ Multi-slot projection: how do you make several `<ng-content>` and conditional projection?**
- ✅ `<ng-content select="[header]">`, `select=".footer"` — distribution by CSS selector/attribute. Knows that projection is static (one instance per slot), and conditional display needs tricks (a wrapper / `@if` around the slot), remembering that the parent creates the content.
- 🚩 Doesn't know about `select`; thinks you can freely duplicate a single `ng-content`.

**8.3 ⭐ Signal inputs (`input()`/`input.required()`), `model()`, input transforms — why are they better than the classic `@Input`?**
- ✅ `input()` gives a reactive, type-safe, read-only input that's read in `computed`/`effect` without `ngOnChanges`; `input.required()` — required-ness at the type level; `model()` — two-way binding on a signal; transforms (`booleanAttribute`/`numberAttribute`) normalize input.
- ✅✅ Understands that signal inputs remove part of the need for `ngOnChanges` and fit zoneless naturally.
- 🚩 Knows only the `@Input()` decorator and `ngOnChanges`.

---

## 9. TypeScript — advanced level

**9.1 ⭐ What is variance? Why does `strictFunctionTypes` about function parameters matter?**
- ✅ Covariance/contravariance: where it's "safe" to substitute subtypes. Function parameters are contravariant (under `strictFunctionTypes`), the return type is covariant. This affects the compatibility of function types (callbacks).
- 🚩 Doesn't understand why a wider parameter type isn't always assignable.

**9.2 ⭐ Conditional types and `infer` — give an example. How does `unknown` differ from `any` and `never`?**
- ✅ `T extends U ? X : Y`, `infer` extracts a type inside the condition (like `ReturnType<T>`). `any` disables checks; `unknown` — a safe top type (you must narrow before using); `never` — the bottom type (the empty set, for the unreachable/exhaustiveness).
- ✅✅ Does an exhaustiveness check via assignment to `never` in `default`.
- 🚩 `any` everywhere; doesn't see the difference from `unknown`.

**9.3 (bank) Mapped types, template literal types, `as const`, branded types — where have you used them in real code?**
- ✅ Concrete cases: type-safe keys/DTO transformers, autocompletion for string unions, immutable literals, nominal typing for IDs.

---

## 10. Performance, Web Vitals, bundle

**10.1 ⭐ Name the Core Web Vitals and what each metric measures. (Hint: one changed in 2024.)**
- ✅ **LCP** (how fast the main content appears), **INP** (responsiveness to interaction — replaced FID), **CLS** (visual stability/shifts). Knows how to improve each.
- 🚩 Names only "load time"; hasn't heard of INP.

**10.2 ⭐ Why is `providedIn: 'root'` tree-shakable while registration in `NgModule.providers` isn't? How does tree-shaking work?**
- ✅ `providedIn: 'root'` makes the service self-referential → if nobody injects it, the bundler drops it. Providers in a module's array are "hard"-referenced by the module, so they stay. Tree-shaking removes unreachable code provided there are no side effects (`sideEffects: false`).
- 🚩 Doesn't know about tree-shaking or thinks there's no difference.

**10.3 (bank) Real techniques to fight re-renders/memory.**
- ✅ OnPush + signals, `track` in `@for`, `@defer`, virtual scroll, moving heavy computation out of the template into `computed`, `runOutsideAngular` for high-frequency events (scroll/mousemove), hunting for detached DOM nodes and "dangling" subscriptions in the memory profiler.

---

## 11. Web platform, observers & a11y

**11.1 ⭐ `IntersectionObserver`, `ResizeObserver`, `MutationObserver` — what's each for? Which one is behind `@defer (on viewport)`?**
- ✅ Intersection — visibility/intersection with the viewport (lazy-load, infinite scroll, impression analytics); Resize — element size changes; Mutation — DOM subtree changes. Behind `@defer (on viewport)` is `IntersectionObserver`. All are async and don't force layout (unlike manually reading sizes in a loop).
- 🚩 Builds infinite scroll on a `scroll` listener with manual `offsetTop` reads (layout thrashing).

**11.2 ⭐ When do you offload work to a Web Worker and what are the constraints? How do you combine it with Angular?**
- ✅ Heavy CPU work (parsing, crypto, processing large arrays) so as not to block the main thread/render. Constraints: no DOM access, exchange via `postMessage` (serialization / transferable / `structuredClone`), a separate context. Angular has a worker generator in the CLI.
- 🚩 Tries to touch the DOM/Angular services from the worker; doesn't get the cost of serialization.

**11.3 ⭐ How do you ensure accessibility in complex UI (modals, dropdowns, lists)? What does CDK a11y / Angular Aria give you?**
- ✅ Semantic roles/ARIA, focus management (focus trap in a modal, returning focus), keyboard navigation, announcements for screen readers. CDK a11y: `FocusTrap`, `LiveAnnouncer`, `FocusMonitor`, `cdkTrapFocus`; Angular Aria (21/22) — ready-made accessible primitives.
- 🚩 a11y "later"; doesn't know about focus trap or `LiveAnnouncer`; puts a `div` with `(click)` without a role/keyboard.

---

## 12. Testing in depth

**12.1 ⭐ How do you test RxJS logic deterministically? What are marble tests?**
- ✅ `TestScheduler` + marble diagrams (`-`, `a`, `|`, `#`, `()`) for virtual time — you deterministically check emissions/timings (debounce, retry, switchMap). For time-dependent code outside streams — `fakeAsync` + `tick`/`flush`.
- 🚩 Tests async via real timers/`setTimeout` in the test.

**12.2 ⭐ `fakeAsync`/`tick` vs `whenStable` — when to use which? How do you test OnPush and signals?**
- ✅ `fakeAsync` gives synchronous control over time/microtasks (`tick`, `flush`, `flushMicrotasks`); `whenStable` waits for async tasks to actually finish. An OnPush component: deliberately call `fixture.detectChanges()` after changing inputs (with a new reference); signals — set/read and check `computed` synchronously.
- 🚩 Doesn't understand why an OnPush component "doesn't update" in a test without the right CD trigger.

**12.3 (bank) CDK Component Harnesses — what for?**
- ✅ A stable API for interacting with components in tests (both unit and e2e) without clinging to brittle CSS selectors/internal markup.

---

## 13. Security & networking (frontend senior)

**13.1 ⭐ Explain CORS and preflight. Which request triggers `OPTIONS`?**
- ✅ The browser enforces the same-origin policy; cross-origin needs `Access-Control-Allow-*` from the server. **Preflight (`OPTIONS`)** is sent for "non-simple" requests: methods other than GET/POST/HEAD, custom headers, or a `Content-Type` outside the three simple ones — so a `POST` with `application/json` triggers a preflight. Cookies: `withCredentials` + a specific origin (not `*`) + `Allow-Credentials: true`.
- 🚩 "CORS is configured on the frontend"; doesn't know it's a browser restriction and a server-side decision.

**13.2 ⭐ How does Angular protect against XSS? Why are `bypassSecurityTrust*` and `[innerHTML]` dangerous?**
- ✅ Auto-sanitization of interpolation and bindings by context (HTML/style/URL/resource URL). `bypassSecurityTrust*` disables protection — an XSS vector. The resource-URL context (e.g., a script's `src`) is the most dangerous.
- 🚩 Happily pours arbitrary HTML through `bypassSecurityTrustHtml`, unaware of the risk.

**13.3 (bank) CSRF and cookies: `SameSite`, `HttpOnly`, `Secure`. What does Angular's built-in XSRF protection do?**
- ✅ `HttpOnly` hides the cookie from JS, `Secure` — HTTPS only, `SameSite` restricts cross-site sending. Angular reads the XSRF token from the cookie and sends it as a header on non-GET requests.

---

## 14. Architectural patterns & the rendering model

**14.1 ⭐ Which architectural model does Angular implement? How do components map onto MVVM?**
- ✅ Closest is **MVVM**: Model = data/business logic (services, domain, state), View = the template (HTML), **ViewModel = the component class** (exposes data and command-methods to the view). The "binder" role between View and ViewModel is played by the data-binding system (interpolation, property/event binding, two-way via `[(...)]`/`model()`), which syncs them automatically — that's the essence of MVVM.
- ✅✅ Clarifies it's not a dogmatic fit: Angular is primarily **component-based**; AngularJS used to be called MVC/MVW ("Model-View-Whatever"). Signals shift the ViewModel toward explicit reactivity, but the component's role as the ViewModel remains.
- 🚩 Confidently says "MVC" without explaining the roles; can't map component / template / service onto the pattern's parts.

**14.2 ⭐⭐ What is `Renderer2` for and which pattern does it implement? Why not touch the DOM directly?**
- ✅ `Renderer2` is an **abstraction over the rendering platform** (bridge / abstract-factory style): the code describes operations (`createElement`, `setAttribute`, `listen`, `setStyle`), and the concrete implementation depends on the platform — browser DOM, SSR (where there's no `document`), historically web workers. Direct access to `document`/`nativeElement` breaks SSR, bypasses sanitization (XSS), and ties code to the browser.
- ✅✅ Knows that instances are created by `RendererFactory2`; that this very abstraction lets the same component code render both on the server and the client.
- 🚩 "Renderer2 is just a wrapper, it's easier to grab `nativeElement`"; doesn't see the link to SSR/security.

**14.3 ⭐⭐ Break down the abstractions for working with views: `ElementRef`, `TemplateRef`, `ViewContainerRef`, `ViewRef`/`EmbeddedViewRef`. Who's responsible for what?**
- ✅
  - `ElementRef` — a thin wrapper around the native element (`nativeElement`), an escape hatch to the DOM (discouraged).
  - `TemplateRef` — a reference to an `<ng-template>`, a **blueprint** for an embedded view (by itself it renders nothing).
  - `ViewContainerRef` — a **container / insertion point**: `createEmbeddedView(templateRef)`, `createComponent(...)`, `insert/move/remove/clear`. The key abstraction for dynamic rendering.
  - `ViewRef`/`EmbeddedViewRef` — a **handle to a created view** (for CD and destruction); `ViewRef` extends `ChangeDetectorRef` (`detectChanges`, `markForCheck`, `detach`, `reattach`).
- ✅✅ Connects: `*ngIf`/`@if`, `*ngFor`/`@for`, `ngTemplateOutlet`, `ngComponentOutlet` under the hood are `TemplateRef` + `ViewContainerRef`. Mentions `ComponentRef` for dynamic components and that since v13+ `ComponentFactoryResolver` isn't needed (`vcr.createComponent(Cmp)`).
- 🚩 Confuses `TemplateRef` and `ViewContainerRef`; doesn't know `ViewRef` has change-detection methods.

**14.4 ⭐ Name the design patterns Angular uses systematically, with an example of each.**
- ✅ **DI / IoC** (injectors, providers); **Observer** (RxJS, `EventEmitter`, signals); **Singleton** (`providedIn: 'root'`); **Factory** (`useFactory`, `RendererFactory2`); **Strategy** (`ChangeDetectionStrategy`, per-platform renderers, validators); **Decorator** (`@Component`/`@Injectable` metadata, attribute directives as host "decorators"); **Adapter** (`ControlValueAccessor`, pipes); **Template Method** (lifecycle hooks); **Composite** (the component/injector tree); **Facade/Mediator** (services over subsystems); **Redux/Flux** (NgRx, unidirectional flow).
- ✅✅ Doesn't just list, but explains *why* that pattern solves the problem (Strategy for OnPush vs Default; Template Method for hooks; Adapter for CVA).
- 🚩 Knows only "DI" and "Observer", then gets stuck; or rattles off names without examples.

**14.5 (bank) Which pattern is behind lifecycle hooks and why does the framework call them, not you?**
- ✅ **Template Method / Inversion of Control**: Angular owns the lifecycle algorithm (creation → checks → destruction) and calls your "hooks" (`ngOnInit`, `ngOnChanges`, `ngAfterViewInit`, `ngOnDestroy`) at defined points. You fill in the steps, you don't control the sequence — hence the rule "don't call hooks manually."
- 🚩 Doesn't understand IoC; thinks hooks can/should be called yourself.

---

## 15. Routing: guards, resolvers & router middleware

**15.1 ⭐ What kinds of guards exist and why are functional ones (14+) better than class-based? Explain `CanMatch` vs `CanActivate`.**
- ✅ Guards: `CanActivate`, `CanActivateChild`, `CanDeactivate`, `CanMatch` (replaced `CanLoad`), plus the `Resolve` resolver. Functional ones (`CanActivateFn`, `CanMatchFn`, `ResolveFn`) are plain functions with `inject()` inside: less boilerplate, easy to compose, tree-shakable. They return `boolean | UrlTree | Observable<...> | Promise<...>`; returning a **`UrlTree`** = redirect (better than an imperative `router.navigate` inside the guard), `false` = cancel navigation.
- ✅✅ `CanMatch` runs in the route **matching phase**: if it returns false, the router treats the route as "no match" and tries the next one (conditional routes by role / feature flag / A-B, and it's exactly what gates lazy loading). `CanActivate` runs **after** the route is already matched, before activation.
- 🚩 Knows only `CanActivate`; doesn't get the `CanMatch`/`CanActivate` difference; redirects via `router.navigate` instead of a `UrlTree`.

**15.2 ⭐⭐ In what order does the navigation pipeline (guards + resolvers) run? Why must a guard/resolver Observable complete?**
- ✅ Simplified: `CanMatch` (matching) → `CanDeactivate` (for routes being left) → `CanActivate`/`CanActivateChild` (for those being entered, top-down) → **resolvers** → component activation. If any guard returns false/`UrlTree`, navigation is canceled/redirected (a `NavigationCancel` event).
- ✅✅ The router **waits for the Observable to complete**: it takes the value and waits for `complete`. If the stream doesn't complete (e.g., a `Subject` that emits but never completes), **navigation hangs forever**. Hence `take(1)`/`first()`. `HttpClient` completes on its own, so it's fine.
- 🚩 Doesn't know the order; thinks a guard on an infinite stream will "somehow" work.

**15.3 ⭐ What are resolvers for and what are their trade-offs? When is it better NOT to use a resolver?**
- ✅ A resolver (`ResolveFn`) prefetches data **before** activation — the component renders with data ready (no empty-state flash), data in `ActivatedRoute.data`/`snapshot.data`. Trade-off: the router **blocks navigation** until the resolver completes → a slow backend = "stuck" navigation; a resolver error cancels navigation (must be caught).
- ✅✅ Often it's better **not** to use a resolver but to load in the component with a skeleton (signals / `resource()`/`rxResource()`) — better perceived performance. A resolver is justified when data is critical before render: SSR/SEO, avoiding layout shift, shared data for the route subtree. Mentions `runGuardsAndResolvers` ('paramsChange'/'pathParamsChange'/'always') to control re-running on navigation within the same component.
- 🚩 Stuffs all requests into resolvers "because it's cleaner", doesn't see the navigation blocking.

**15.4 ⭐ How do you do cross-cutting logic via router events (loading bar, analytics, scroll)? Name the key events.**
- ✅ `Router.events` — a stream: `NavigationStart`, `RoutesRecognized`, `GuardsCheckStart/End`, `ResolveStart/End`, `NavigationEnd`, `NavigationCancel`, `NavigationError`, `NavigationSkipped`. On Start/End you hang a global loader; on `NavigationEnd` — page-view analytics; `NavigationCancel` has a `code` (why it was canceled — guard, redirect).
- ✅✅ Knows `withInMemoryScrolling` (scroll position restoration + anchor scrolling) instead of manual scroll handling; that events must be filtered by type (`filter(e => e instanceof NavigationEnd)`).
- 🚩 Builds the loader/analytics clumsily (manual flags in every component) instead of subscribing to events.

**15.5 ⭐ What "middleware" do the router providers give you? (`withComponentInputBinding`, `withViewTransitions`, preloading, `TitleStrategy`…)**
- ✅ `provideRouter(routes, ...features)`: `withComponentInputBinding()` — route params/query/data are forwarded into the component's `input()`/`@Input` automatically (16+, fewer `ActivatedRoute` injections); `withViewTransitions()` — transition animations via the View Transitions API (17+); `withPreloading(PreloadAllModules)` or a custom `PreloadingStrategy` — prefetch lazy chunks (e.g., on idle/network); `withInMemoryScrolling`, `withRouterConfig` (`onSameUrlNavigation`, `paramsInheritanceStrategy`), `withHashLocation`, `withEnabledBlockingInitialNavigation`. `TitleStrategy`/`title` on a route — per-route document title.
- ✅✅ Understands this is "functional" configuration replacing the old `RouterModule.forRoot(routes, {...})`; knows why a custom preloading strategy matters (balancing "fast first render" vs "next screens ready").
- 🚩 Knows only the basic `RouterModule.forRoot`; hasn't heard of input binding or preloading strategies.

**15.6 (bank) What is `RouteReuseStrategy` and when do you need it?**
- ✅ Controls whether route component instances are **reused/detached** on navigation (by default the same component isn't recreated when only params change). A custom `RouteReuseStrategy` lets you cache a screen (preserve scroll/tab state) and return it without recreating — e.g., tab navigation, heavy lists.
- 🚩 Doesn't know the component isn't recreated when only params change (hence the "data didn't update" bug — you need to subscribe to `paramMap`, not read in `ngOnInit`).

---

## 16. Multicasting operators in RxJS

**16.1 ⭐ What is multicasting and why? Explain unicast vs multicast.**
- ✅ A plain (cold) Observable is **unicast**: each subscription triggers a separate execution of the producer (e.g., 3 subscriptions to `http.get` = 3 requests). **Multicast** — a single execution/subscription is shared among many consumers (one producer, many consumers). Technically a **Subject** sits in the middle and hands values to subscribers. Multicasting "warms up" cold→hot as long as there's at least one subscriber.
- 🚩 Thinks `http.get` passed into several `| async` makes one request; doesn't understand unicast.

**16.2 ⭐⭐ The Subject family as the basis of multicasting: `Subject` / `BehaviorSubject` / `ReplaySubject` / `AsyncSubject` — what does each give new subscribers?**
- ✅ `Subject` — no memory, late subscribers don't see past emissions; `BehaviorSubject(initial)` — immediately gives the **current** value (needs a default); `ReplaySubject(n, time?)` — replays the last N (and/or within a window); `AsyncSubject` — only the **last** value and only on `complete`. All of them are both Observer and Observable.
- ✅✅ Knows that the choice of connector Subject is exactly what defines a multicasting operator's behavior (e.g., `share` with a `ReplaySubject` = `shareReplay`).
- 🚩 Knows only `Subject`; doesn't understand why `Behavior`/`Replay`.

**16.3 ⭐⭐ `share()` vs `shareReplay()` — how do they work, what are reference counting and reset? What's the `shareReplay` pitfall?**
- ✅ `share()` — multicasts via a `Subject` with **reference counting**: subscribes the source on the first subscriber, unsubscribes on the last (by default `resetOnRefCountZero: true` → the next subscriber re-runs the cold logic). Late subscribers see only **future** emissions. `shareReplay()` = `share` + a `ReplaySubject`: it also **replays** a buffer to late subscribers (a cache).
- ✅✅ Pitfall: `shareReplay()` **without** `{ refCount: true }` keeps the source subscription alive even after everyone has unsubscribed → leak / "eternal" upstream. For caching: `shareReplay({ bufferSize: 1, refCount: true })`. Knows the `share({ connector, resetOnError, resetOnComplete, resetOnRefCountZero })` options.
- 🚩 Slaps `shareReplay()` everywhere without understanding reset/refCount; treats `share` and `shareReplay` as interchangeable.

**16.4 ⭐ What are `connectable()`/`connect()` for and which race do they solve? What about legacy `multicast`/`publish*`/`refCount`?**
- ✅ `connectable(source, { connector })` (7.5+) returns an object that **doesn't subscribe** to the source until you call `.connect()` — letting you wire up all subscribers first and then start (saves you from the race where the source emits synchronously and late `subscribe`s would miss values). `connect(selector)` — the operator form: multicasts the source inside the selector so you can subscribe to it several times without re-executing it.
- ✅✅ Knows that the **entire legacy family** — `multicast`, `publish`, `publishReplay`, `publishBehavior`, `publishLast`, `refCount`, the `ConnectableObservable` class — is deprecated in RxJS 7 and **removed in 8**; migration: `publish()`→`share({ resetOnRefCountZero: false })`/`connectable`, `publishReplay(n)`→`shareReplay`, `multicast`→`connectable`/`connect`.
- 🚩 Still writes `publish().refCount()`/`multicast(...)`; doesn't know the modern replacements.

**16.5 (bank) Real multicasting use cases and when NOT to.**
- ✅ Caching a single HTTP request for several consumers → `shareReplay({ bufferSize: 1, refCount: true })`; sharing a WebSocket/SSE/`interval` among subscribers → `share()`; broadcasting one computed stream to several `| async` pipes without re-running the pipeline. Not worth it when each consumer needs its **own** independent run (e.g., a separate parameterized request) — there a multicast yields a shared/stale result.
- 🚩 Multicasts where an independent run is needed and gets "stuck" data; or, conversely, forgets to share an expensive stream and makes N requests.

---

## 17. The `this` keyword

**17.1 ⭐ How is `this` determined? Name the binding rules and their precedence.**
- ✅ `this` is determined by the **call site**, not where the function is defined (except arrows). Rules: **default** (standalone call → `undefined` in strict/modules, `window` in sloppy); **implicit** (`obj.fn()` → `obj`); **explicit** (`call`/`apply`/`bind` → the given value); **`new`** (→ a fresh instance). Precedence: `new` > explicit > implicit > default.
- ✅✅ Knows ES modules and class bodies are **always** strict → a standalone `this` is `undefined` (not `window`); the difference between `call` vs `apply` (args array) vs `bind` (returns a new permanently-bound function + partial application).
- 🚩 "`this` is the object where the function is defined"; thinks a standalone `this` is always `window`.

**17.2 ⭐⭐ How do arrow functions differ for `this`? Why are they the go-to for callbacks?**
- ✅ Arrows have **no own `this`** — they capture it **lexically** from the enclosing scope at definition time. `call`/`apply`/`bind` **can't** change an arrow's `this`. So an arrow callback inside a method keeps the method's `this` — hence `.subscribe(v => this.handle(v))`, `setTimeout(() => this.x, 0)`.
- ✅✅ Knows arrows can't be constructors (`new` throws), have no `arguments`/`prototype`; the old `const self = this` is the pre-arrow equivalent.
- 🚩 Thinks `bind` works on an arrow; writes a regular `function` in a callback and loses `this`.

**17.3 ⭐⭐ Explain "lost `this`" when passing a method as a callback, and the fixes. (Angular/RxJS context.)**
- ✅ `setTimeout(obj.method, 100)` / `obs.subscribe(this.handler)` → the method is detached from its object, so `this` falls back to default (undefined in strict). Fixes: an arrow wrapper `() => this.handler()`, `this.handler.bind(this)`, or a **class-field arrow** `handler = () => {...}` (bound per instance). In Angular this bites in `subscribe`, `addEventListener`, `setTimeout`; the template `(click)="onClick()"` is fine because Angular invokes the method on the instance.
- ✅✅ Knows the class-field-arrow trade-off: per-instance (memory, not on the prototype, harder to override/spy) vs a prototype method + `bind`.
- 🚩 Can't explain why `subscribe(this.handler)` breaks; "just add bind" without knowing why.

**17.4 ⭐ `this` in nested regular functions, event handlers, getters; strict vs sloppy.**
- ✅ A nested regular `function` inside a method gets its **own** `this` (default → undefined in strict) — a classic bug; fix with an arrow or `bind`. In a DOM handler that's a regular function, `this` = the element; an arrow handler captures the lexical `this`. In a getter/setter, `this` = the object the property is accessed on. Strict/modules: default `this` = `undefined`; sloppy: `window`.
- 🚩 Expects the inner `function` to keep the outer `this`.

**17.5 (bank) Edge cases: `new` + `bind`, double-bind, static methods, `thisArg`.**
- ✅ A bound function called with `new` uses the **new instance** (the bound `this` is ignored; bound args still apply). `bind` is one-shot — re-binding doesn't override. Static class methods → `this` is the class itself. Some APIs take a `thisArg` (`Array.prototype.map(fn, thisArg)`, `Array.from(x, fn, thisArg)`).
- 🚩 Doesn't know `new` overrides a bound `this`.

---

## 18. Resource hints: `preconnect`, `prefetch`, `prerender`, etc.

**18.1 ⭐ Break the resource-hints family into two groups. What does each do?**
- ✅ Two groups. **Prime a connection** (download nothing): `dns-prefetch` — DNS resolution only (domain→IP, the cheapest); `preconnect` — a full connection ahead of time (DNS + TCP + TLS). **Fetch a resource**: `preload` — a specific resource for the **current** page, early and high-priority; `modulepreload` — the same for an ES module (also parses it, can fetch its dependency graph); `prefetch` — a resource for a **future** navigation at **low** priority, during idle, into cache; `prerender` — renders a whole page in the background (heavy).
- ✅✅ Knows 103 Early Hints (the server sends `Link: rel=preload/preconnect` before the full response) and the `fetchpriority` attribute (high/low/auto) as a modern complement.
- 🚩 Confuses "prime a connection" with "fetch a resource"; thinks `preload` and `prefetch` are the same.

**18.2 ⭐⭐ `preconnect` — what exactly does it do, what's the cost, and when do you use it?**
- ✅ It does the whole network handshake ahead of time: **DNS + TCP + TLS**, so when the request fires the connection is ready. It's more expensive (holds an open connection), and the browser **limits** how many, so it's only for **critical** third-party origins you'll definitely need soon (fonts, CDN, API). Often paired with a `dns-prefetch` to the same domain as a fallback for older browsers.
- ✅✅ Understands that excess `preconnect`s hurt (hold sockets, compete for bandwidth); that cross-origin with cookies/fonts needs `crossorigin`.
- 🚩 Puts `preconnect` on a dozen domains "just in case".

**18.3 ⭐ `prefetch` vs `preload` — what's the difference and what's mandatory for `preload`?**
- ✅ `preload` — "I need this **now**, on **this** page": an early, high-priority fetch (hero image, critical font/CSS/JS), fetch-only (doesn't execute). Mandatory **`as`** attribute (script/style/font/image…), and for fonts/CORS — also **`crossorigin`**, otherwise you get a double fetch. `prefetch` — "probably needed **later**": low priority, for the next navigation, during idle, into cache.
- 🚩 Doesn't know about the mandatory `as`/`crossorigin` for `preload`; hangs `preload` on everything (hurting the priority of critical resources).

**18.4 ⭐⭐ `prerender` — what did it do and why is `<link rel="prerender">` effectively deprecated? What replaced it?**
- ✅ `<link rel="prerender">` rendered a whole future page in the background (very expensive in CPU/memory/traffic) and is effectively **deprecated**. The modern approach is the **Speculation Rules API** (`<script type="speculationrules">`) with `prefetch`/`prerender`, eagerness levels (conservative/moderate/eager), and modern prerendering infrastructure.
- ✅✅ Knows the constraints: mostly same-origin (with limited cross-origin support), and that a prerendered page must behave correctly until activation — not fire side effects/analytics early, and react to `prerenderingchange` / Page Visibility (`document.prerendering`).
- 🚩 Recommends `<link rel="prerender">` as current; hasn't heard of Speculation Rules; ignores the premature-side-effects problem.

**18.5 (bank) How does this map to Angular, and where do the hints live?**
- ✅ Hints live in `index.html`'s `<head>` or via `Link` headers / 103 Early Hints from the server/CDN. In practice: `preconnect` to the API/CDN/fonts; `preload` a critical font; while "future screens" in Angular are usually prepared via **route preloading** (`withPreloading(PreloadAllModules)` / a custom `PreloadingStrategy`, see 15.5), not manual `prefetch`. SSR/SSG pairs well with Early Hints.
- 🚩 Doesn't see the route-preloading ↔ resource-hints link; drops hints haphazardly and overloads the network.

---

## 19. New HTML & CSS spec features (recent years)

> This block checks whether the candidate keeps up with the platform. A senior is expected not just to have "read an article" but to understand **what problem each feature solves and what hack it replaces**.

**19.0 ⭐⭐ `<meta name="viewport">` — what is it, why does it exist, and what happens without it on mobile?**
- ✅ Without the `viewport` meta tag, a mobile browser renders the page into a **"virtual viewport"** (typically 980 px wide) and then scales it down to fit the physical screen — you get a shrunken desktop version. The tag tells the browser: "viewport = device screen width, scale 1:1."
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ```
  `width=device-width` — logical viewport width = device CSS pixels; `initial-scale=1` — no initial zoom; `minimum-scale`/`maximum-scale` constrain zoom (but `maximum-scale=1` disables pinch-to-zoom → accessibility issue).
- ✅✅ Knows the difference between **physical pixels** (hardware) and **CSS pixels** (logical, device-independent); **device pixel ratio** (DPR) — on Retina/HiDPI DPR=2–3, meaning 1 CSS pixel = 2–3 physical pixels. Hence `srcset`/`@2x` assets are needed for sharp images. Knows `<meta name="viewport" content="interactive-widget=resizes-content">` (controls behavior when the on-screen keyboard appears — a new option).
- 🚩 Doesn't know why the `viewport` tag exists; thinks mobile browsers sort everything out automatically; doesn't understand CSS px vs physical px.

**19.0.1 (bank) Viewport units — `vw`/`vh` vs `svh`/`lvh`/`dvh` — what's the `vh` problem on mobile?**
- ✅ `100vh` on mobile is often taller than the visible screen because the browser measures `vh` against the **full** viewport (address bar included), which hides on scroll → content overflows. Three new units (2023): `svh` (small — **minimum** viewport, address bar visible), `lvh` (large — **maximum**, address bar hidden), `dvh` (dynamic — **current**, updates on scroll). In practice: for hero sections, modals, fullscreen layouts — use `dvh` or `svh` instead of `vh`. Same for `svw`/`lvw`/`dvw`.



**19.1 ⭐ CSS Container Queries (`@container`) — why and why are they better than Media Queries?**
- ✅ `@container` adapts styles to the **size of a parent container**, not the viewport. Solves the classic pain: a component/card should behave differently depending on how much space it's been given — not the window width. Before: JS hacks (ResizeObserver), CSS variables, or completely different classes. `container-type: inline-size/size`, named containers (`container-name`). **Container Style Queries** (`@container style(--variant: card)`) — conditions on CSS variables.
- ✅✅ Knows `cqw`/`cqh`/`cqi`/`cqb` (container query units); that `@container` and `@media` can be combined; the gotcha (an element can't react to its own size, only its parent's `container`).
- 🚩 "Container queries are just like media queries but better"; can't name a concrete case.

**19.2 ⭐ CSS `:has()` — what is it and what problem does it solve?**
- ✅ The **"parent" / "relational" selector**: `a:has(> img)` — a link that contains an image; `form:has(input:invalid)` — a form with an invalid field; `li:has(+ li:last-child)` — the second-to-last item. Previously impossible in CSS — required JS or extra classes. Also negated: `:not(:has(...))`.
- ✅✅ Understands the performance implications (the browser engine walks "backwards" up the tree — potentially more expensive matching); in practice it has opened new component-architecture patterns without JS.
- 🚩 Doesn't know `:has()`; or knows it but thinks it only targets "children".

**19.3 ⭐ CSS Cascade Layers (`@layer`) — what for?**
- ✅ `@layer base, components, utilities` — explicit **cascade ordering of layers**: styles in a higher-priority layer always win over a lower one, regardless of specificity. Solves "specificity hell" in large CSS (design system vs customization, third-party libraries). An unnamed (anonymous) `@layer` is the lowest priority; un-layered styles always beat any layer.
- 🚩 Fights specificity via `!important` and ever-longer selectors.

**19.4 ⭐⭐ CSS Subgrid — how does it complement Grid and what does it solve?**
- ✅ `grid-template-columns: subgrid` / `grid-template-rows: subgrid` — a child grid item **inherits the parent's tracks** instead of creating its own. Solves the classic problem of aligning nested-card content (labels, form fields) along a shared axis without JS or magic padding. Before: manually duplicating track definitions or JS alignment.
- 🚩 Hasn't heard of it; or knows CSS Grid but not subgrid.

**19.5 ⭐ CSS `@scope` — what for?**
- ✅ Limits style application to a **DOM range** (`@scope (.card) to (.card__footer)` — from `.card` down to but not including `.card__footer`). Gives native scoping without CSS Modules / BEM / Shadow DOM. Reduces the need for long selectors and high specificity.
- 🚩 Doesn't know it; solves scoping only via BEM or CSS-in-JS.

**19.6 ⭐ CSS `color-mix()`, `oklch`, `light-dark()` — what do modern color APIs give you?**
- ✅ `color-mix(in oklch, red 50%, blue)` — native color mixing without preprocessors. `oklch` (perceptually uniform space) gives predictable gradients and accessible contrast — unlike `hsl`/`rgb` where identical lightness looks different. `light-dark(white, black)` — automatic choice based on `prefers-color-scheme` without JS or media queries in rules.
- 🚩 Knows only `hex`/`rgb`/`hsl`; doesn't know why `hsl` gradients go "grey" in the middle.

**19.7 ⭐⭐ CSS Anchor Positioning — what does it solve?**
- ✅ `anchor-name: --btn` / `position-anchor: --btn` / `anchor()` / `position-try-fallbacks` — native positioning of an element **relative to an arbitrary "anchor" element**, even if they're not parent/child. Solves tooltip/dropdown/popover positioning without JS coordinate calculation (`getBoundingClientRect`). `position-try-fallbacks` — automatic flipping when the element goes out of the viewport.
- ✅✅ Connects it to the `popover` API and `<dialog>` — the trio of native UI without JS.
- 🚩 Positions all floating UI elements via JS coordinates or Floating UI/Popper.

**19.8 ⭐ HTML `popover` API and `<dialog>` — how do they differ and why `top-layer`?**
- ✅ `popover` (attribute) — a lightweight, non-modal overlay with native dismiss (click outside, Escape), `popovertarget`/`popovertargetaction` without JS; `<dialog>` — modal or non-modal dialog with focus trap, `::backdrop`. Both render in the **top layer** (above everything, including `z-index: 9999`), solving the stacking-context problem for good.
- ✅✅ Knows the difference: `popover` — lightweight/simple, no focus blocking; `<dialog modal>` — with focus trap and backdrop; `<dialog>` without `showModal()` — just non-modal. `::backdrop` is styleable for both.
- 🚩 Builds modals via `div` + `z-index` + a custom focus trap; hasn't heard of top layer.

**19.9 ⭐ `<select>` customization and `<datalist>` — where is this now?**
- ✅ Native `<select>` customization is finally moving: `appearance: base-select` (Chrome 135+) lets you style a native select and its `<option>` elements; `<selectlist>` (Chromium experiment) — a fully customizable native component with slots. `<datalist>` — native autocomplete/suggestions for `<input>`.
- 🚩 "You can't style `<select>`" and always reaches for a custom component.

**19.10 ⭐ CSS `@starting-style`, `transition-behavior: allow-discrete`, `overlay` — what do they give for animations?**
- ✅ `@starting-style` — starting styles **for an element appearing for the first time** (an intro animation without JS): the browser treats the first paint as a transition from `@starting-style` to the current styles. `transition-behavior: allow-discrete` — enables transitions on **discrete** properties (`display: none`↔`block`, `visibility`). `overlay` — transition out of the top layer (`popover`/`dialog`). Together they give native enter/exit animations without JS.
- 🚩 Animates show/hide only via JS class-toggling or `@keyframes` without native transition primitives.

**19.11 ⭐ View Transitions API — what is it and how does Angular use it?**
- ✅ `document.startViewTransition(callback)` — an animated transition between two DOM states with native cross-fade (and custom `::view-transition-*` CSS); MPA variant — via `@view-transition { navigation: auto }`. Angular integrates via `withViewTransitions()` in the router (17+), automatically wrapping navigation in `startViewTransition`.
- ✅✅ Knows `view-transition-name` for element pairs (shared element transition); that `prefers-reduced-motion` must be respected.
- 🚩 Animates route transitions manually via `AnimationBuilder`/CSS classes.

**19.12 (bank) Other features worth mentioning as a "follows the platform" signal.**
- ✅ **CSS nesting** (`&`) — native, no preprocessor; **`@property`** — CSS Houdini, a typed custom property with animation support; **`text-wrap: balance/pretty`** — balanced text in headings without JS; **`content-visibility: auto`** — skips paint for off-screen elements (performance); **Scroll-driven animations** (`animation-timeline: scroll()/view()`) — scroll-position–linked animations without JS; **CSS `if()`** (Chrome 137+) — conditions in CSS; **`field-sizing: content`** — a self-expanding `<textarea>`.


---

## 20. HTML & CSS — deep-dive questions

> This section tests not just knowledge of new features but the mechanics of how the browser handles HTML/CSS — specificity, stacking contexts, BFC, the box model, flexbox/grid trade-offs. A senior is expected to understand **why** the browser behaves as it does.

**20.1 ⭐⭐ Explain CSS specificity. How is it calculated and what beats `!important`?**
- ✅ Specificity is a four-dimensional vector `(inline, id, class/attr/pseudo-class, tag/pseudo-element)`: `style=""` → `(1,0,0,0)`; `#id` → `(0,1,0,0)`; `.class`/`[attr]`/`:hover` → `(0,0,1,0)`; `div`/`::before` → `(0,0,0,1)`. The higher vector wins (column by column). `!important` moves a declaration into a separate "layer" and beats everything; if two `!important` declarations conflict, specificity is compared between them. A `@layer` with a lower priority loses even to lower specificity in a higher layer. The universal selector `*` and `:where()` have specificity `(0,0,0,0)`.
- ✅✅ `:is()` and `:not()` take the specificity of their **most specific** argument; `:where()` is always zero (handy for reset styles). Knows `@layer` is a more predictable mechanism than `!important`.
- 🚩 Thinks more selectors = higher specificity; doesn't understand `!important` vs `@layer`.

**20.2 ⭐⭐ What is a stacking context? What creates one and how does it relate to `z-index`?**
- ✅ A stacking context is an independent Z-axis rendering "stack": child elements can never escape their context relative to elements outside it, regardless of `z-index`. A new context is created by: `position: relative/absolute/fixed/sticky` with `z-index ≠ auto`; `opacity < 1`; `transform`/`filter`/`clip-path`/`perspective`; `will-change: transform`, etc.; `isolation: isolate` (the explicit way); top layer (`dialog`/`popover`).
- ✅✅ Knows `z-index` without `position` (except sticky) has no effect; that `z-index: 9999` on a child can lose to `z-index: 1` on a sibling if their parents are in different contexts; that `isolation: isolate` is the cleanest way to create a context without side effects.
- 🚩 "I'll just increase `z-index`" without understanding stacking contexts; doesn't know why `transform` breaks `position: fixed`.

**20.3 ⭐⭐ What is a Block Formatting Context (BFC) and what triggers one? What practical problem does it solve?**
- ✅ A BFC is a region where block-level elements are laid out by their own rules, isolated from the outer flow. Triggered by: `overflow` (not `visible`/`clip`); `display: flow-root` (the cleanest way); `float`; `position: absolute/fixed`; `display: flex/grid` (they're their own FC, but lay children in their own). Practically: **clearfix** (a BFC container "embraces" floated children — replacing `::after { clear: both }`); **margin-collapse prevention** (a BFC container doesn't merge its margins with the outer parent); **float overlap** (a BFC block won't be overlapped by an adjacent float).
- ✅✅ Knows `display: flow-root` as the modern clearfix replacement; understands `overflow: hidden` as a clearfix is a hack with side effects (hides overflow).
- 🚩 Doesn't know BFC; solves clearfix only via `::after { clear: both }` or `overflow: hidden` without understanding the mechanics.

**20.4 ⭐ Box model: `content-box` vs `border-box`. Why is `border-box` the de-facto standard?**
- ✅ `content-box` (default): `width`/`height` = content only, padding and border are added on top → the actual size is unpredictable when you add padding. `border-box`: `width`/`height` = content + padding + border → size stays fixed when padding/border change. Hence in every reset/boilerplate: `*, *::before, *::after { box-sizing: border-box }`. `margin` is in neither — it's always added outside.
- 🚩 Doesn't know the difference; surprised when an element overflows its container after adding padding.

**20.5 ⭐ Margin collapsing — when does it happen and when doesn't it?**
- ✅ Adjacent **block-level** element margins **collapse** (the larger wins) in three cases: adjacent siblings; parent and first/last child (if no border/padding/BFC/clearance between them); an empty block (its own margin-top and margin-bottom). **Doesn't collapse** in: flex/grid containers; between inline elements; when separated by a border, padding, or BFC; float/absolute/fixed.
- ✅✅ Knows margin collapsing is **vertical only** (block axis) in normal flow. In flex/grid — it doesn't happen at all.
- 🚩 Treats margin collapsing as a bug; adds `overflow: hidden` to the parent as a "fix" without understanding why.

**20.6 ⭐⭐ Flexbox vs Grid — when to use which? How do they differ fundamentally?**
- ✅ Flex is **one-dimensional**: lays out along one axis (main axis), wrapping onto new rows where each row is independent (elements don't align across rows). Grid is **two-dimensional**: an explicit grid on both axes, elements align both along rows and columns. Rule of thumb: **Grid for page/section layout** (you know the structure upfront); **Flex for components and rows** (unknown element count, just line things up).
- ✅✅ Knows flex children can grow/shrink (`flex-grow`/`flex-shrink`/`flex-basis`); in grid you can place explicitly (`grid-column: 2 / 4`); `gap` works in both; `align-content` vs `align-items` in flex (multi-line vs per-item).
- 🚩 "Flex and Grid are the same, Grid is just more complex"; doesn't get the one- vs two-dimensional distinction.

**20.7 ⭐ `position: sticky` — how does it work and where does it break?**
- ✅ `sticky` is a hybrid of `relative` and `fixed`: scrolls with its parent, but "sticks" to a given offset (`top`, `left`...) while the parent is visible in the viewport. Breaks/doesn't work when: the parent has `overflow: hidden/auto/scroll` (sticky can't escape its scroll container); in flex/grid without the right axis setup; no threshold is set (`top`/`left`...); the parent is too small (nothing to stick to).
- 🚩 "Sticky doesn't work" and adds `overflow: hidden` to the parent (that's exactly what breaks it).

**20.8 ⭐ What is `will-change` and when should/shouldn't you set it?**
- ✅ A hint to the browser to prepare a GPU layer for an element in advance (`will-change: transform` / `opacity`). Helps avoid a "jump" at the start of an animation (the browser promotes the element to its own composite layer early). But: **keeps the layer in GPU memory at all times** → overuse = more memory consumption, sometimes slower. Rule: add it **just before** an animation starts and remove it after; don't set it globally on dozens of elements.
- 🚩 Puts `will-change: transform` on everything "for performance".

**20.9 ⭐ `display: none` vs `visibility: hidden` vs `opacity: 0` vs `content-visibility: hidden` — how do they differ?**
- ✅ `display: none` — element is **removed from the flow**, takes no space, not rendered, inaccessible to AT; `visibility: hidden` — space is kept, not visible, inaccessible to AT, inherited (can "restore" a child via `visibility: visible`); `opacity: 0` — space kept, transparent, but still **accessible** to events and AT; `content-visibility: hidden` — like `display: none` for rendering (skips paint/layout), but **preserves render state** (no recalculation on re-show → efficient for large off-screen sections).
- 🚩 Uses only `display: none`; doesn't know `opacity: 0` is still clickable.

**20.10 ⭐ CSS Custom Properties (`--var`) vs preprocessor variables (`$var`) — what's the fundamental difference?**
- ✅ Preprocessor variables (Sass `$var`, Less `@var`) are static, replaced **at compile time**, unavailable at runtime/in JS. CSS Custom Properties **live in the browser**: they cascade, are inherited, can be changed via JS (`el.style.setProperty('--x', val)`), read via `getComputedStyle`, and animated via `@property`. They enable **theming** without recompilation, adaptive values (media queries), and a component API (`--card-bg: ...` from outside).
- ✅✅ Knows `@property` (Houdini) for typed custom properties with animation and inheritance; fallback `var(--x, default)`; that custom properties cascade down the tree and can be overridden at the component level.
- 🚩 "CSS variables are the same as Sass variables"; doesn't know about cascading/JS access.

**20.11 ⭐ Semantic markup: why and which tags do you use? What does `<section>` give you over `<div>`?**
- ✅ Semantics → accessibility (screen readers), SEO (better structural understanding), code readability. `<section>` — thematically related content with a heading; `<article>` — self-contained content (a post, product card); `<aside>` — sidebar/supplementary content; `<nav>` — navigation; `<main>` — main content (one per page); `<header>`/`<footer>` — header/footer of a section or page. `<div>` and `<span>` — for styling/grouping without semantics. Landmark roles — AT navigation through sections.
- ✅✅ Knows `<figure>`/`<figcaption>`, `<time datetime>`, `<address>`, `<details>`/`<summary>`, `<dialog>`, `<search>` (new). ARIA as a supplement to native semantics (not a replacement).
- 🚩 "`<div>` for everything"; doesn't understand how `<section>` differs from `<div class="section">`.

**20.12 ⭐ How does the browser load and apply CSS? Why is `@import` in CSS worse than `<link>`?**
- ✅ The browser starts parsing HTML → hits `<link rel="stylesheet">` → fetches CSS in parallel (render-blocking); on completion, builds the CSSOM → merges with DOM → render tree. `@import` inside CSS is **sequential** loading (the browser doesn't know about the nested file until it's parsed the parent) → waterfall delay. Hence in production, `@import` is replaced with multiple `<link>` tags or a bundler (Vite/webpack).
- ✅✅ Knows the `media` attribute on `<link>` for conditional loading; `preload` for critical CSS; that CSS-in-JS avoids render-blocking but has its own cost (JS execution).
- 🚩 "`@import` is more convenient, there's no difference"; doesn't understand the waterfall.

---

## 21. HTML semantics — in depth

> Semantics isn't a list of tags to memorize — it's understanding **why**: accessibility, SEO, document structure, the contract with the browser and AT. A senior is expected to justify tag choices and know the pitfalls.

**21.1 ⭐ What is semantic markup and why does it matter? Three concrete consequences.**
- ✅ (1) **Accessibility**: screen readers and AT navigate by landmark roles (`<main>`, `<nav>`, `<aside>`…), announcing the role/name/state of interactive elements (a `<button>` vs a `div` with onclick behave very differently in NVDA/VoiceOver). (2) **SEO**: search bots understand content hierarchy better (`<h1>`–`<h6>`, `<article>`, `<time>`); structured data (JSON-LD) enhances rich snippets. (3) **Readability and maintainability**: HTML as a document with meaning, not a soup of `<div>`s — easier to review and change.
- 🚩 "Semantics is for SEO"; doesn't see the link to accessibility.

**21.2 ⭐⭐ Break down the landmark tags: `<header>`, `<footer>`, `<main>`, `<nav>`, `<aside>`, `<section>`, `<article>`. How many of each can appear on a page?**
- ✅
  - `<main>` — **one** per page (main content, skip-link target for screen readers); landmark role `main`.
  - `<header>`/`<footer>` — one site-wide, but they can also appear **inside** `<article>`/`<section>` (then it's the header/footer of that section, not the `banner`/`contentinfo` role).
  - `<nav>` — **multiple** (main menu, breadcrumbs, pagination); AT announce "navigation landmark". Use `aria-label` to distinguish them.
  - `<aside>` — related but non-main content (sidebar, callout, ad); landmark role `complementary`.
  - `<section>` — a thematic group **with a heading** (without a heading, use `<div>`); AT landmark only with `aria-label`/`aria-labelledby`.
  - `<article>` — self-contained, independently distributable content (post, comment, product card, tweet).
- ✅✅ Knows a `<header>` inside `<article>` doesn't have the `banner` role (only the site-level `<header>` does); `<footer>` inside `<article>` ≠ `contentinfo`.
- 🚩 "You can have multiple `<main>`"; puts `<section>` everywhere instead of `<div>` "because it's more semantic".

**21.3 ⭐ `<article>` vs `<section>` vs `<div>` — how do you choose? Give 2 real use cases for each.**
- ✅ `<article>` — if the content is **self-contained and makes sense on its own** outside the page: a blog post, a comment, a product card in a catalogue, a tweet, a news item. `<section>` — if it's a **thematic part** of a larger whole with an explicit heading: "About us", "Reviews", "Related products" within a page. `<div>` — a purely **structural/styling wrapper** with no semantic meaning: a flex container, an animation wrapper, a grid cell.
- The test: "Could this block stand alone as an article in an RSS feed?" → yes → `<article>`; "Does it have a heading and a topic?" → yes → `<section>`; otherwise → `<div>`.
- 🚩 Reflexively puts `<article>` on every card and `<section>` on every container.

**21.4 ⭐ Headings `<h1>`–`<h6>`: hierarchy rules, common mistakes, and how they affect AT.**
- ✅ Headings are the **skeleton of the document**: AT allow navigation by heading (the `H` key in NVDA). Rules: one `<h1>` per page (the topic of the whole document); don't skip levels (`<h1>` → `<h2>` → `<h3>`, not `<h1>` → `<h3>`); the level is determined by **hierarchy**, not visual size. Common mistakes: `<h3>` "because a smaller font is needed" (style it with CSS); no `<h1>` or multiple `<h1>`s.
- ✅✅ Knows in Angular `<h1>` may change with the route; `TitleStrategy` and `<title>` are partners to `<h1>`.
- 🚩 Picks the heading level by size; skips levels.

**21.5 ⭐⭐ Interactive elements: when `<button>` vs `<a>` vs `<div role="button">`? What does a native element give you for free?**
- ✅ `<button>` — **an action without navigation** (submit, toggle, open a modal). `<a href>` — **navigation** (URL, route; without `href` — not a link). Native elements give you for free: the correct role for AT, focusability (no `tabindex` needed), keyboard activation (Enter/Space for button, Enter for a), `:focus-visible` styling, form association (`<button type="submit">`). `<div role="button">` is always the worse choice: you must manually add `tabindex="0"`, `onkeydown` for Enter/Space, and the correct `aria-*`; it's easy to forget something.
- ✅✅ Knows `<button type="button">` (without `type` in a form — submit by default → accidental submission); `<a>` without `href` — not interactive and not focusable.
- 🚩 Uses `<div>` with `(click)` and `cursor: pointer`; thinks `<a href="#">` is fine for "nothing".

**21.6 ⭐ Forms: `<label>`, `<fieldset>`/`<legend>`, `<input type>`, `autocomplete`. What does each do?**
- ✅ `<label for="id">` / `<label><input>` — associates the label with a control (clicking the label → focuses the input; AT reads the field name). Without a label, AT doesn't know what the field is for. `<fieldset>`/`<legend>` — groups related controls (radio group, address block) and gives them a shared name; AT reads the legend before each field in the group. `type` on `<input>` (email/tel/number/date/search/url) → correct keyboard on mobile + built-in validation. `autocomplete` (name/email/cc-number/bday…) → browser fills in saved data → fewer errors, better UX.
- 🚩 Doesn't use `<label>`; doesn't know what `<fieldset>` is for; puts `type="text"` on everything.

**21.7 ⭐ Media tags: `<img>`, `<picture>`, `<figure>`/`<figcaption>`. What is `alt` and when is it empty?**
- ✅ `alt` — a text alternative: AT reads it; shown if the image doesn't load. Decorative images — `alt=""` (AT skips it). A missing `alt` altogether — AT reads the filename (bad). `<picture>` + `<source media>` / `srcset` — responsive images for different viewports/sizes/formats (avif/webp fallback). `<figure>`/`<figcaption>` — an image (or code, quote) with a caption as a semantic unit; `aria-labelledby` on `<figure>` → AT reads `<figcaption>` as the description.
- ✅✅ Knows `loading="lazy"` / `fetchpriority="high"` for LCP images; `decoding="async"`; `sizes` + `srcset` for pixel density / viewport width.
- 🚩 `alt="image"` everywhere or no `alt` at all; doesn't know `<picture>`.

**21.8 ⭐ `<time>`, `<address>`, `<abbr>`, `<cite>`, `<blockquote>`/`<q>` — when do you actually use them?**
- ✅ `<time datetime="2025-06-01">` — machine-readable date/time (search bots, AT, calendar apps); without `datetime` it's just the word "time". `<address>` — contact information for the nearest `<article>` or `<body>` (author/organization), not for arbitrary postal addresses. `<abbr title="HyperText Markup Language">HTML</abbr>` — expands an abbreviation (tooltip, AT reads it). `<cite>` — the name of a creative work (book, film, song). `<blockquote cite="url">` — a long quotation; `<q>` — a short inline quote (browser adds quotation marks).
- 🚩 Uses `<address>` for postal addresses "just because"; writes dates as plain text.

**21.9 ⭐ `<details>`/`<summary>`, `<dialog>`, `<search>` — new native interactive elements.**
- ✅ `<details>`/`<summary>` — a native accordion/spoiler without JS: the browser manages the `open` attribute, there's a `toggle` event. `<dialog>` — modal (`showModal()`, focus trap, `::backdrop`, Escape) or non-modal (`show()`); returns focus on close. `<search>` (new, 2023) — a landmark for a search form (role `search`), replaces `<div role="search">`.
- ✅✅ Knows `<details name="group">` (2024, Chrome 120+) — an exclusive accordion (only one `<details>` with the same `name` is open at a time, like radio buttons). Knows the `popover` attribute API vs `<dialog>`.
- 🚩 Writes a custom JS accordion not knowing about native `<details>`; doesn't know `<search>`.

**21.10 ⭐ `<table>` — when is it justified and how do you make it accessible?**
- ✅ `<table>` is for **tabular data** (rows and columns have a relationship). Not for layout. An accessible `<table>`: `<caption>` (overall name, AT reads it first); `<th scope="col/row">` (AT associates the heading with its cells); `<thead>`/`<tbody>`/`<tfoot>` (structure and navigation); `headers` + `id` for complex tables; `<colgroup>`/`<col>` for column styling.
- 🚩 Still uses `<table>` for layout; doesn't know `scope` and `caption`.

**21.11 (bank) ARIA: when to use it and the golden rule "No ARIA > bad ARIA".**
- ✅ ARIA (`role`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-live`…) supplements native semantics, it doesn't replace it. The golden rule: if a native element exists — use it; ARIA is only for custom components (dropdown, toolbar, tab panel) where there's no native equivalent. An incorrect `role` or a missing `aria-expanded` is worse than no ARIA at all. `aria-live="polite"/"assertive"` — announces dynamic content without moving focus (notifications, counters).
- 🚩 Puts `role="button"` on `<div>` instead of using `<button>`; reaches for `aria-label` before trying a native `<label>`.

---

## Board / live-coding puzzles

Moved to a separate file — **`senior-angular-puzzles-bank-en.md`**.

It holds every puzzle from this section plus ~80 more, and its numbering mirrors this bank's sections: `P4.2` is a puzzle for "4. Dependency Injection". So right after a theory question you can pull a puzzle on the same topic and test the same knowledge as code.

It also has sections this file doesn't: execution context and closures (22), type coercion and equality (23), promises and `async/await` (24).

---

## How to read the level
- **Strong mid:** knows the "what" and "how" of the API, but is shaky "under the hood" (event loop, the signals graph, the two injector trees, who owns projection, glitches); guesses the CD / DI / signals puzzles from the bank at random.
- **Senior+/staff:** immediately thinks in mechanics and trade-offs, on puzzles explains *why*, not just the result; catches edge cases on their own; honestly delineates the limits of their knowledge instead of bluffing.
