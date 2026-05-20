import * as h from "react";
import Ue, { useState as me, useLayoutEffect as yo, useContext as Pt, createContext as dn, forwardRef as or, createElement as Xr, useEffect as se, useCallback as ct, useMemo as fe, useRef as ve, Fragment as Ou, useId as zu } from "react";
import * as Sa from "react-dom";
import Bu, { unstable_batchedUpdates as Gu, createPortal as Tu } from "react-dom";
let Da = "https://api.springboard.vn";
function Yb(e) {
  Da = e.baseUrl;
}
const gs = {
  get baseURL() {
    return Da;
  },
  endpoints: {
    login: "/login/password",
    authenticateGoogle: "/authenticate/google",
    currentUser: "/users/me",
    refresh: "/refresh",
    logout: "/logout",
    resetPassword: "/reset/password",
    resetPasswordAuthorised: "/authenticate/reset",
    sessions: "/users/me/sessions",
    managementSessions: "/sessions",
    managementTests: "/tests",
    managementClasses: "/classes",
    managementGroups: "/groups",
    managementUsers: "/users",
    managementAccounts: "/accounts",
    managementDayblocks: "/dayblocks",
    managementSchedules: "/schedules",
    managementFeedbacks: "/feedbacks",
    managementRegistrations: "/registrations",
    ownRegistrations: "/users/me/registrations",
    ownAssessments: "/users/me/assessments",
    recordings: "/users/me/recordings"
  }
};
function tt(e) {
  return `${gs.baseURL}${gs.endpoints[e]}`;
}
function Yu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var En = { exports: {} }, Yt = {};
var vs;
function Hu() {
  if (vs) return Yt;
  vs = 1;
  var e = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function n(r, o, s) {
    var c = null;
    if (s !== void 0 && (c = "" + s), o.key !== void 0 && (c = "" + o.key), "key" in o) {
      s = {};
      for (var i in o)
        i !== "key" && (s[i] = o[i]);
    } else s = o;
    return o = s.ref, {
      $$typeof: e,
      type: r,
      key: c,
      ref: o !== void 0 ? o : null,
      props: s
    };
  }
  return Yt.Fragment = t, Yt.jsx = n, Yt.jsxs = n, Yt;
}
var Ht = {};
var xs;
function Fu() {
  return xs || (xs = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(y) {
      if (y == null) return null;
      if (typeof y == "function")
        return y.$$typeof === z ? null : y.displayName || y.name || null;
      if (typeof y == "string") return y;
      switch (y) {
        case x:
          return "Fragment";
        case A:
          return "Profiler";
        case b:
          return "StrictMode";
        case P:
          return "Suspense";
        case k:
          return "SuspenseList";
        case Y:
          return "Activity";
      }
      if (typeof y == "object")
        switch (typeof y.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), y.$$typeof) {
          case g:
            return "Portal";
          case E:
            return y.displayName || "Context";
          case w:
            return (y._context.displayName || "Context") + ".Consumer";
          case j:
            var T = y.render;
            return y = y.displayName, y || (y = T.displayName || T.name || "", y = y !== "" ? "ForwardRef(" + y + ")" : "ForwardRef"), y;
          case M:
            return T = y.displayName || null, T !== null ? T : e(y.type) || "Memo";
          case D:
            T = y._payload, y = y._init;
            try {
              return e(y(T));
            } catch {
            }
        }
      return null;
    }
    function t(y) {
      return "" + y;
    }
    function n(y) {
      try {
        t(y);
        var T = !1;
      } catch {
        T = !0;
      }
      if (T) {
        T = console;
        var Q = T.error, W = typeof Symbol == "function" && Symbol.toStringTag && y[Symbol.toStringTag] || y.constructor.name || "Object";
        return Q.call(
          T,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          W
        ), t(y);
      }
    }
    function r(y) {
      if (y === x) return "<>";
      if (typeof y == "object" && y !== null && y.$$typeof === D)
        return "<...>";
      try {
        var T = e(y);
        return T ? "<" + T + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function o() {
      var y = Z.A;
      return y === null ? null : y.getOwner();
    }
    function s() {
      return Error("react-stack-top-frame");
    }
    function c(y) {
      if (q.call(y, "key")) {
        var T = Object.getOwnPropertyDescriptor(y, "key").get;
        if (T && T.isReactWarning) return !1;
      }
      return y.key !== void 0;
    }
    function i(y, T) {
      function Q() {
        C || (C = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          T
        ));
      }
      Q.isReactWarning = !0, Object.defineProperty(y, "key", {
        get: Q,
        configurable: !0
      });
    }
    function u() {
      var y = e(this.type);
      return O[y] || (O[y] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), y = this.props.ref, y !== void 0 ? y : null;
    }
    function l(y, T, Q, W, X, _) {
      var J = Q.ref;
      return y = {
        $$typeof: v,
        type: y,
        key: T,
        props: Q,
        _owner: W
      }, (J !== void 0 ? J : null) !== null ? Object.defineProperty(y, "ref", {
        enumerable: !1,
        get: u
      }) : Object.defineProperty(y, "ref", { enumerable: !1, value: null }), y._store = {}, Object.defineProperty(y._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(y, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(y, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: X
      }), Object.defineProperty(y, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: _
      }), Object.freeze && (Object.freeze(y.props), Object.freeze(y)), y;
    }
    function f(y, T, Q, W, X, _) {
      var J = T.children;
      if (J !== void 0)
        if (W)
          if (G(J)) {
            for (W = 0; W < J.length; W++)
              d(J[W]);
            Object.freeze && Object.freeze(J);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else d(J);
      if (q.call(T, "key")) {
        J = e(y);
        var oe = Object.keys(T).filter(function(ne) {
          return ne !== "key";
        });
        W = 0 < oe.length ? "{key: someKey, " + oe.join(": ..., ") + ": ...}" : "{key: someKey}", I[J + W] || (oe = 0 < oe.length ? "{" + oe.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          W,
          J,
          oe,
          J
        ), I[J + W] = !0);
      }
      if (J = null, Q !== void 0 && (n(Q), J = "" + Q), c(T) && (n(T.key), J = "" + T.key), "key" in T) {
        Q = {};
        for (var ee in T)
          ee !== "key" && (Q[ee] = T[ee]);
      } else Q = T;
      return J && i(
        Q,
        typeof y == "function" ? y.displayName || y.name || "Unknown" : y
      ), l(
        y,
        J,
        Q,
        o(),
        X,
        _
      );
    }
    function d(y) {
      m(y) ? y._store && (y._store.validated = 1) : typeof y == "object" && y !== null && y.$$typeof === D && (y._payload.status === "fulfilled" ? m(y._payload.value) && y._payload.value._store && (y._payload.value._store.validated = 1) : y._store && (y._store.validated = 1));
    }
    function m(y) {
      return typeof y == "object" && y !== null && y.$$typeof === v;
    }
    var p = Ue, v = /* @__PURE__ */ Symbol.for("react.transitional.element"), g = /* @__PURE__ */ Symbol.for("react.portal"), x = /* @__PURE__ */ Symbol.for("react.fragment"), b = /* @__PURE__ */ Symbol.for("react.strict_mode"), A = /* @__PURE__ */ Symbol.for("react.profiler"), w = /* @__PURE__ */ Symbol.for("react.consumer"), E = /* @__PURE__ */ Symbol.for("react.context"), j = /* @__PURE__ */ Symbol.for("react.forward_ref"), P = /* @__PURE__ */ Symbol.for("react.suspense"), k = /* @__PURE__ */ Symbol.for("react.suspense_list"), M = /* @__PURE__ */ Symbol.for("react.memo"), D = /* @__PURE__ */ Symbol.for("react.lazy"), Y = /* @__PURE__ */ Symbol.for("react.activity"), z = /* @__PURE__ */ Symbol.for("react.client.reference"), Z = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = Object.prototype.hasOwnProperty, G = Array.isArray, R = console.createTask ? console.createTask : function() {
      return null;
    };
    p = {
      react_stack_bottom_frame: function(y) {
        return y();
      }
    };
    var C, O = {}, N = p.react_stack_bottom_frame.bind(
      p,
      s
    )(), S = R(r(s)), I = {};
    Ht.Fragment = x, Ht.jsx = function(y, T, Q) {
      var W = 1e4 > Z.recentlyCreatedOwnerStacks++;
      return f(
        y,
        T,
        Q,
        !1,
        W ? Error("react-stack-top-frame") : N,
        W ? R(r(y)) : S
      );
    }, Ht.jsxs = function(y, T, Q) {
      var W = 1e4 > Z.recentlyCreatedOwnerStacks++;
      return f(
        y,
        T,
        Q,
        !0,
        W ? Error("react-stack-top-frame") : N,
        W ? R(r(y)) : S
      );
    };
  })()), Ht;
}
var bs;
function Lu() {
  return bs || (bs = 1, process.env.NODE_ENV === "production" ? En.exports = Hu() : En.exports = Fu()), En.exports;
}
var a = Lu();
function ka(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = ka(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function Ra() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = ka(e)) && (r && (r += " "), r += t);
  return r;
}
const ws = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, As = Ra, Qu = (e, t) => (n) => {
  var r;
  if (t?.variants == null) return As(e, n?.class, n?.className);
  const { variants: o, defaultVariants: s } = t, c = Object.keys(o).map((l) => {
    const f = n?.[l], d = s?.[l];
    if (f === null) return null;
    const m = ws(f) || ws(d);
    return o[l][m];
  }), i = n && Object.entries(n).reduce((l, f) => {
    let [d, m] = f;
    return m === void 0 || (l[d] = m), l;
  }, {}), u = t == null || (r = t.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((l, f) => {
    let { class: d, className: m, ...p } = f;
    return Object.entries(p).every((v) => {
      let [g, x] = v;
      return Array.isArray(x) ? x.includes({
        ...s,
        ...i
      }[g]) : {
        ...s,
        ...i
      }[g] === x;
    }) ? [
      ...l,
      d,
      m
    ] : l;
  }, []);
  return As(e, c, u, n?.class, n?.className);
};
function ys(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function sr(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = ys(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : ys(e[o], null);
        }
      };
  };
}
function ce(...e) {
  return h.useCallback(sr(...e), e);
}
// @__NO_SIDE_EFFECTS__
function dt(e) {
  const t = /* @__PURE__ */ Ju(e), n = h.forwardRef((r, o) => {
    const { children: s, ...c } = r, i = h.Children.toArray(s), u = i.find(Uu);
    if (u) {
      const l = u.props.children, f = i.map((d) => d === u ? h.Children.count(l) > 1 ? h.Children.only(null) : h.isValidElement(l) ? l.props.children : null : d);
      return /* @__PURE__ */ a.jsx(t, { ...c, ref: o, children: h.isValidElement(l) ? h.cloneElement(l, void 0, f) : null });
    }
    return /* @__PURE__ */ a.jsx(t, { ...c, ref: o, children: s });
  });
  return n.displayName = `${e}.Slot`, n;
}
var Zu = /* @__PURE__ */ dt("Slot");
// @__NO_SIDE_EFFECTS__
function Ju(e) {
  const t = h.forwardRef((n, r) => {
    const { children: o, ...s } = n;
    if (h.isValidElement(o)) {
      const c = qu(o), i = Vu(s, o.props);
      return o.type !== h.Fragment && (i.ref = r ? sr(r, c) : c), h.cloneElement(o, i);
    }
    return h.Children.count(o) > 1 ? h.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Wu = /* @__PURE__ */ Symbol("radix.slottable");
function Uu(e) {
  return h.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Wu;
}
function Vu(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], s = t[r];
    /^on[A-Z]/.test(r) ? o && s ? n[r] = (...i) => {
      const u = s(...i);
      return o(...i), u;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...s } : r === "className" && (n[r] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function qu(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var Xu = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], re = Xu.reduce((e, t) => {
  const n = /* @__PURE__ */ dt(`Primitive.${t}`), r = h.forwardRef((o, s) => {
    const { asChild: c, ...i } = o, u = c ? n : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ a.jsx(u, { ...i, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function Pa(e, t) {
  e && Sa.flushSync(() => e.dispatchEvent(t));
}
function Ku(e, t) {
  const n = h.createContext(t), r = (s) => {
    const { children: c, ...i } = s, u = h.useMemo(() => i, Object.values(i));
    return /* @__PURE__ */ a.jsx(n.Provider, { value: u, children: c });
  };
  r.displayName = e + "Provider";
  function o(s) {
    const c = h.useContext(n);
    if (c) return c;
    if (t !== void 0) return t;
    throw new Error(`\`${s}\` must be used within \`${e}\``);
  }
  return [r, o];
}
function pt(e, t = []) {
  let n = [];
  function r(s, c) {
    const i = h.createContext(c), u = n.length;
    n = [...n, c];
    const l = (d) => {
      const { scope: m, children: p, ...v } = d, g = m?.[e]?.[u] || i, x = h.useMemo(() => v, Object.values(v));
      return /* @__PURE__ */ a.jsx(g.Provider, { value: x, children: p });
    };
    l.displayName = s + "Provider";
    function f(d, m) {
      const p = m?.[e]?.[u] || i, v = h.useContext(p);
      if (v) return v;
      if (c !== void 0) return c;
      throw new Error(`\`${d}\` must be used within \`${s}\``);
    }
    return [l, f];
  }
  const o = () => {
    const s = n.map((c) => h.createContext(c));
    return function(i) {
      const u = i?.[e] || s;
      return h.useMemo(
        () => ({ [`__scope${e}`]: { ...i, [e]: u } }),
        [i, u]
      );
    };
  };
  return o.scopeName = e, [r, _u(o, ...t)];
}
function _u(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(s) {
      const c = r.reduce((i, { useScope: u, scopeName: l }) => {
        const d = u(s)[`__scope${l}`];
        return { ...i, ...d };
      }, {});
      return h.useMemo(() => ({ [`__scope${t.scopeName}`]: c }), [c]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
function Oa(e) {
  const t = e + "CollectionProvider", [n, r] = pt(t), [o, s] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), c = (g) => {
    const { scope: x, children: b } = g, A = Ue.useRef(null), w = Ue.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ a.jsx(o, { scope: x, itemMap: w, collectionRef: A, children: b });
  };
  c.displayName = t;
  const i = e + "CollectionSlot", u = /* @__PURE__ */ dt(i), l = Ue.forwardRef(
    (g, x) => {
      const { scope: b, children: A } = g, w = s(i, b), E = ce(x, w.collectionRef);
      return /* @__PURE__ */ a.jsx(u, { ref: E, children: A });
    }
  );
  l.displayName = i;
  const f = e + "CollectionItemSlot", d = "data-radix-collection-item", m = /* @__PURE__ */ dt(f), p = Ue.forwardRef(
    (g, x) => {
      const { scope: b, children: A, ...w } = g, E = Ue.useRef(null), j = ce(x, E), P = s(f, b);
      return Ue.useEffect(() => (P.itemMap.set(E, { ref: E, ...w }), () => {
        P.itemMap.delete(E);
      })), /* @__PURE__ */ a.jsx(m, { [d]: "", ref: j, children: A });
    }
  );
  p.displayName = f;
  function v(g) {
    const x = s(e + "CollectionConsumer", g);
    return Ue.useCallback(() => {
      const A = x.collectionRef.current;
      if (!A) return [];
      const w = Array.from(A.querySelectorAll(`[${d}]`));
      return Array.from(x.itemMap.values()).sort(
        (P, k) => w.indexOf(P.ref.current) - w.indexOf(k.ref.current)
      );
    }, [x.collectionRef, x.itemMap]);
  }
  return [
    { Provider: c, Slot: l, ItemSlot: p },
    v,
    r
  ];
}
function U(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e?.(o), n === !1 || !o.defaultPrevented)
      return t?.(o);
  };
}
var _e = globalThis?.document ? h.useLayoutEffect : () => {
}, $u = h[" useInsertionEffect ".trim().toString()] || _e;
function fn({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, s, c] = ed({
    defaultProp: t,
    onChange: n
  }), i = e !== void 0, u = i ? e : o;
  {
    const f = h.useRef(e !== void 0);
    h.useEffect(() => {
      const d = f.current;
      d !== i && console.warn(
        `${r} is changing from ${d ? "controlled" : "uncontrolled"} to ${i ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), f.current = i;
    }, [i, r]);
  }
  const l = h.useCallback(
    (f) => {
      if (i) {
        const d = td(f) ? f(e) : f;
        d !== e && c.current?.(d);
      } else
        s(f);
    },
    [i, e, s, c]
  );
  return [u, l];
}
function ed({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = h.useState(e), o = h.useRef(n), s = h.useRef(t);
  return $u(() => {
    s.current = t;
  }, [t]), h.useEffect(() => {
    o.current !== n && (s.current?.(n), o.current = n);
  }, [n, o]), [n, r, s];
}
function td(e) {
  return typeof e == "function";
}
function nd(e, t) {
  return h.useReducer((n, r) => t[n][r] ?? n, e);
}
var Be = (e) => {
  const { present: t, children: n } = e, r = rd(t), o = typeof n == "function" ? n({ present: r.isPresent }) : h.Children.only(n), s = ce(r.ref, od(o));
  return typeof n == "function" || r.isPresent ? h.cloneElement(o, { ref: s }) : null;
};
Be.displayName = "Presence";
function rd(e) {
  const [t, n] = h.useState(), r = h.useRef(null), o = h.useRef(e), s = h.useRef("none"), c = e ? "mounted" : "unmounted", [i, u] = nd(c, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return h.useEffect(() => {
    const l = Mn(r.current);
    s.current = i === "mounted" ? l : "none";
  }, [i]), _e(() => {
    const l = r.current, f = o.current;
    if (f !== e) {
      const m = s.current, p = Mn(l);
      e ? u("MOUNT") : p === "none" || l?.display === "none" ? u("UNMOUNT") : u(f && m !== p ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, u]), _e(() => {
    if (t) {
      let l;
      const f = t.ownerDocument.defaultView ?? window, d = (p) => {
        const g = Mn(r.current).includes(CSS.escape(p.animationName));
        if (p.target === t && g && (u("ANIMATION_END"), !o.current)) {
          const x = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", l = f.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = x);
          });
        }
      }, m = (p) => {
        p.target === t && (s.current = Mn(r.current));
      };
      return t.addEventListener("animationstart", m), t.addEventListener("animationcancel", d), t.addEventListener("animationend", d), () => {
        f.clearTimeout(l), t.removeEventListener("animationstart", m), t.removeEventListener("animationcancel", d), t.removeEventListener("animationend", d);
      };
    } else
      u("ANIMATION_END");
  }, [t, u]), {
    isPresent: ["mounted", "unmountSuspended"].includes(i),
    ref: h.useCallback((l) => {
      r.current = l ? getComputedStyle(l) : null, n(l);
    }, [])
  };
}
function Mn(e) {
  return e?.animationName || "none";
}
function od(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var sd = h[" useId ".trim().toString()] || (() => {
}), ad = 0;
function He(e) {
  const [t, n] = h.useState(sd());
  return _e(() => {
    n((r) => r ?? String(ad++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var id = h.createContext(void 0);
function za(e) {
  const t = h.useContext(id);
  return e || t || "ltr";
}
function Oe(e) {
  const t = h.useRef(e);
  return h.useEffect(() => {
    t.current = e;
  }), h.useMemo(() => (...n) => t.current?.(...n), []);
}
function cd(e, t = globalThis?.document) {
  const n = Oe(e);
  h.useEffect(() => {
    const r = (o) => {
      o.key === "Escape" && n(o);
    };
    return t.addEventListener("keydown", r, { capture: !0 }), () => t.removeEventListener("keydown", r, { capture: !0 });
  }, [n, t]);
}
var ld = "DismissableLayer", Kr = "dismissableLayer.update", ud = "dismissableLayer.pointerDownOutside", dd = "dismissableLayer.focusOutside", Es, Ba = h.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), ar = h.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: o,
      onFocusOutside: s,
      onInteractOutside: c,
      onDismiss: i,
      ...u
    } = e, l = h.useContext(Ba), [f, d] = h.useState(null), m = f?.ownerDocument ?? globalThis?.document, [, p] = h.useState({}), v = ce(t, (k) => d(k)), g = Array.from(l.layers), [x] = [...l.layersWithOutsidePointerEventsDisabled].slice(-1), b = g.indexOf(x), A = f ? g.indexOf(f) : -1, w = l.layersWithOutsidePointerEventsDisabled.size > 0, E = A >= b, j = hd((k) => {
      const M = k.target, D = [...l.branches].some((Y) => Y.contains(M));
      !E || D || (o?.(k), c?.(k), k.defaultPrevented || i?.());
    }, m), P = pd((k) => {
      const M = k.target;
      [...l.branches].some((Y) => Y.contains(M)) || (s?.(k), c?.(k), k.defaultPrevented || i?.());
    }, m);
    return cd((k) => {
      A === l.layers.size - 1 && (r?.(k), !k.defaultPrevented && i && (k.preventDefault(), i()));
    }, m), h.useEffect(() => {
      if (f)
        return n && (l.layersWithOutsidePointerEventsDisabled.size === 0 && (Es = m.body.style.pointerEvents, m.body.style.pointerEvents = "none"), l.layersWithOutsidePointerEventsDisabled.add(f)), l.layers.add(f), Ms(), () => {
          n && l.layersWithOutsidePointerEventsDisabled.size === 1 && (m.body.style.pointerEvents = Es);
        };
    }, [f, m, n, l]), h.useEffect(() => () => {
      f && (l.layers.delete(f), l.layersWithOutsidePointerEventsDisabled.delete(f), Ms());
    }, [f, l]), h.useEffect(() => {
      const k = () => p({});
      return document.addEventListener(Kr, k), () => document.removeEventListener(Kr, k);
    }, []), /* @__PURE__ */ a.jsx(
      re.div,
      {
        ...u,
        ref: v,
        style: {
          pointerEvents: w ? E ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: U(e.onFocusCapture, P.onFocusCapture),
        onBlurCapture: U(e.onBlurCapture, P.onBlurCapture),
        onPointerDownCapture: U(
          e.onPointerDownCapture,
          j.onPointerDownCapture
        )
      }
    );
  }
);
ar.displayName = ld;
var fd = "DismissableLayerBranch", md = h.forwardRef((e, t) => {
  const n = h.useContext(Ba), r = h.useRef(null), o = ce(t, r);
  return h.useEffect(() => {
    const s = r.current;
    if (s)
      return n.branches.add(s), () => {
        n.branches.delete(s);
      };
  }, [n.branches]), /* @__PURE__ */ a.jsx(re.div, { ...e, ref: o });
});
md.displayName = fd;
function hd(e, t = globalThis?.document) {
  const n = Oe(e), r = h.useRef(!1), o = h.useRef(() => {
  });
  return h.useEffect(() => {
    const s = (i) => {
      if (i.target && !r.current) {
        let u = function() {
          Ga(
            ud,
            n,
            l,
            { discrete: !0 }
          );
        };
        const l = { originalEvent: i };
        i.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = u, t.addEventListener("click", o.current, { once: !0 })) : u();
      } else
        t.removeEventListener("click", o.current);
      r.current = !1;
    }, c = window.setTimeout(() => {
      t.addEventListener("pointerdown", s);
    }, 0);
    return () => {
      window.clearTimeout(c), t.removeEventListener("pointerdown", s), t.removeEventListener("click", o.current);
    };
  }, [t, n]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function pd(e, t = globalThis?.document) {
  const n = Oe(e), r = h.useRef(!1);
  return h.useEffect(() => {
    const o = (s) => {
      s.target && !r.current && Ga(dd, n, { originalEvent: s }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function Ms() {
  const e = new CustomEvent(Kr);
  document.dispatchEvent(e);
}
function Ga(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? Pa(o, s) : o.dispatchEvent(s);
}
var Ir = "focusScope.autoFocusOnMount", Sr = "focusScope.autoFocusOnUnmount", Cs = { bubbles: !1, cancelable: !0 }, gd = "FocusScope", ir = h.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: s,
    ...c
  } = e, [i, u] = h.useState(null), l = Oe(o), f = Oe(s), d = h.useRef(null), m = ce(t, (g) => u(g)), p = h.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  h.useEffect(() => {
    if (r) {
      let g = function(w) {
        if (p.paused || !i) return;
        const E = w.target;
        i.contains(E) ? d.current = E : Ve(d.current, { select: !0 });
      }, x = function(w) {
        if (p.paused || !i) return;
        const E = w.relatedTarget;
        E !== null && (i.contains(E) || Ve(d.current, { select: !0 }));
      }, b = function(w) {
        if (document.activeElement === document.body)
          for (const j of w)
            j.removedNodes.length > 0 && Ve(i);
      };
      document.addEventListener("focusin", g), document.addEventListener("focusout", x);
      const A = new MutationObserver(b);
      return i && A.observe(i, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", g), document.removeEventListener("focusout", x), A.disconnect();
      };
    }
  }, [r, i, p.paused]), h.useEffect(() => {
    if (i) {
      Ns.add(p);
      const g = document.activeElement;
      if (!i.contains(g)) {
        const b = new CustomEvent(Ir, Cs);
        i.addEventListener(Ir, l), i.dispatchEvent(b), b.defaultPrevented || (vd(yd(Ta(i)), { select: !0 }), document.activeElement === g && Ve(i));
      }
      return () => {
        i.removeEventListener(Ir, l), setTimeout(() => {
          const b = new CustomEvent(Sr, Cs);
          i.addEventListener(Sr, f), i.dispatchEvent(b), b.defaultPrevented || Ve(g ?? document.body, { select: !0 }), i.removeEventListener(Sr, f), Ns.remove(p);
        }, 0);
      };
    }
  }, [i, l, f, p]);
  const v = h.useCallback(
    (g) => {
      if (!n && !r || p.paused) return;
      const x = g.key === "Tab" && !g.altKey && !g.ctrlKey && !g.metaKey, b = document.activeElement;
      if (x && b) {
        const A = g.currentTarget, [w, E] = xd(A);
        w && E ? !g.shiftKey && b === E ? (g.preventDefault(), n && Ve(w, { select: !0 })) : g.shiftKey && b === w && (g.preventDefault(), n && Ve(E, { select: !0 })) : b === A && g.preventDefault();
      }
    },
    [n, r, p.paused]
  );
  return /* @__PURE__ */ a.jsx(re.div, { tabIndex: -1, ...c, ref: m, onKeyDown: v });
});
ir.displayName = gd;
function vd(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (Ve(r, { select: t }), document.activeElement !== n) return;
}
function xd(e) {
  const t = Ta(e), n = js(t, e), r = js(t.reverse(), e);
  return [n, r];
}
function Ta(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function js(e, t) {
  for (const n of e)
    if (!bd(n, { upTo: t })) return n;
}
function bd(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function wd(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Ve(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && wd(e) && t && e.select();
  }
}
var Ns = Ad();
function Ad() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && n?.pause(), e = Is(e, t), e.unshift(t);
    },
    remove(t) {
      e = Is(e, t), e[0]?.resume();
    }
  };
}
function Is(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function yd(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Ed = "Portal", cr = h.forwardRef((e, t) => {
  const { container: n, ...r } = e, [o, s] = h.useState(!1);
  _e(() => s(!0), []);
  const c = n || o && globalThis?.document?.body;
  return c ? Bu.createPortal(/* @__PURE__ */ a.jsx(re.div, { ...r, ref: t }), c) : null;
});
cr.displayName = Ed;
var Dr = 0;
function Eo() {
  h.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? Ss()), document.body.insertAdjacentElement("beforeend", e[1] ?? Ss()), Dr++, () => {
      Dr === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), Dr--;
    };
  }, []);
}
function Ss() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var ke = function() {
  return ke = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
    }
    return t;
  }, ke.apply(this, arguments);
};
function Ya(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function Md(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, s; r < o; r++)
    (s || !(r in t)) && (s || (s = Array.prototype.slice.call(t, 0, r)), s[r] = t[r]);
  return e.concat(s || Array.prototype.slice.call(t));
}
var zn = "right-scroll-bar-position", Bn = "width-before-scroll-bar", Cd = "with-scroll-bars-hidden", jd = "--removed-body-scroll-bar-size";
function kr(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Nd(e, t) {
  var n = me(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && (n.value = r, n.callback(r, o));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var Id = typeof window < "u" ? h.useLayoutEffect : h.useEffect, Ds = /* @__PURE__ */ new WeakMap();
function Sd(e, t) {
  var n = Nd(null, function(r) {
    return e.forEach(function(o) {
      return kr(o, r);
    });
  });
  return Id(function() {
    var r = Ds.get(n);
    if (r) {
      var o = new Set(r), s = new Set(e), c = n.current;
      o.forEach(function(i) {
        s.has(i) || kr(i, null);
      }), s.forEach(function(i) {
        o.has(i) || kr(i, c);
      });
    }
    Ds.set(n, e);
  }, [e]), n;
}
function Dd(e) {
  return e;
}
function kd(e, t) {
  t === void 0 && (t = Dd);
  var n = [], r = !1, o = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(s) {
      var c = t(s, r);
      return n.push(c), function() {
        n = n.filter(function(i) {
          return i !== c;
        });
      };
    },
    assignSyncMedium: function(s) {
      for (r = !0; n.length; ) {
        var c = n;
        n = [], c.forEach(s);
      }
      n = {
        push: function(i) {
          return s(i);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(s) {
      r = !0;
      var c = [];
      if (n.length) {
        var i = n;
        n = [], i.forEach(s), c = n;
      }
      var u = function() {
        var f = c;
        c = [], f.forEach(s);
      }, l = function() {
        return Promise.resolve().then(u);
      };
      l(), n = {
        push: function(f) {
          c.push(f), l();
        },
        filter: function(f) {
          return c = c.filter(f), n;
        }
      };
    }
  };
  return o;
}
function Rd(e) {
  e === void 0 && (e = {});
  var t = kd(null);
  return t.options = ke({ async: !0, ssr: !1 }, e), t;
}
var Ha = function(e) {
  var t = e.sideCar, n = Ya(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return h.createElement(r, ke({}, n));
};
Ha.isSideCarExport = !0;
function Pd(e, t) {
  return e.useMedium(t), Ha;
}
var Fa = Rd(), Rr = function() {
}, lr = h.forwardRef(function(e, t) {
  var n = h.useRef(null), r = h.useState({
    onScrollCapture: Rr,
    onWheelCapture: Rr,
    onTouchMoveCapture: Rr
  }), o = r[0], s = r[1], c = e.forwardProps, i = e.children, u = e.className, l = e.removeScrollBar, f = e.enabled, d = e.shards, m = e.sideCar, p = e.noRelative, v = e.noIsolation, g = e.inert, x = e.allowPinchZoom, b = e.as, A = b === void 0 ? "div" : b, w = e.gapMode, E = Ya(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), j = m, P = Sd([n, t]), k = ke(ke({}, E), o);
  return h.createElement(
    h.Fragment,
    null,
    f && h.createElement(j, { sideCar: Fa, removeScrollBar: l, shards: d, noRelative: p, noIsolation: v, inert: g, setCallbacks: s, allowPinchZoom: !!x, lockRef: n, gapMode: w }),
    c ? h.cloneElement(h.Children.only(i), ke(ke({}, k), { ref: P })) : h.createElement(A, ke({}, k, { className: u, ref: P }), i)
  );
});
lr.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
lr.classNames = {
  fullWidth: Bn,
  zeroRight: zn
};
var Od = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function zd() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Od();
  return t && e.setAttribute("nonce", t), e;
}
function Bd(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Gd(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Td = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = zd()) && (Bd(t, n), Gd(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Yd = function() {
  var e = Td();
  return function(t, n) {
    h.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, La = function() {
  var e = Yd(), t = function(n) {
    var r = n.styles, o = n.dynamic;
    return e(r, o), null;
  };
  return t;
}, Hd = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Pr = function(e) {
  return parseInt(e || "", 10) || 0;
}, Fd = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Pr(n), Pr(r), Pr(o)];
}, Ld = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return Hd;
  var t = Fd(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, Qd = La(), Et = "data-scroll-locked", Zd = function(e, t, n, r) {
  var o = e.left, s = e.top, c = e.right, i = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(Cd, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(i, "px ").concat(r, `;
  }
  body[`).concat(Et, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(r, ";"),
    n === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(s, `px;
    padding-right: `).concat(c, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i, "px ").concat(r, `;
    `),
    n === "padding" && "padding-right: ".concat(i, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(zn, ` {
    right: `).concat(i, "px ").concat(r, `;
  }
  
  .`).concat(Bn, ` {
    margin-right: `).concat(i, "px ").concat(r, `;
  }
  
  .`).concat(zn, " .").concat(zn, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(Bn, " .").concat(Bn, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Et, `] {
    `).concat(jd, ": ").concat(i, `px;
  }
`);
}, ks = function() {
  var e = parseInt(document.body.getAttribute(Et) || "0", 10);
  return isFinite(e) ? e : 0;
}, Jd = function() {
  h.useEffect(function() {
    return document.body.setAttribute(Et, (ks() + 1).toString()), function() {
      var e = ks() - 1;
      e <= 0 ? document.body.removeAttribute(Et) : document.body.setAttribute(Et, e.toString());
    };
  }, []);
}, Wd = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, o = r === void 0 ? "margin" : r;
  Jd();
  var s = h.useMemo(function() {
    return Ld(o);
  }, [o]);
  return h.createElement(Qd, { styles: Zd(s, !t, o, n ? "" : "!important") });
}, _r = !1;
if (typeof window < "u")
  try {
    var Cn = Object.defineProperty({}, "passive", {
      get: function() {
        return _r = !0, !0;
      }
    });
    window.addEventListener("test", Cn, Cn), window.removeEventListener("test", Cn, Cn);
  } catch {
    _r = !1;
  }
var xt = _r ? { passive: !1 } : !1, Ud = function(e) {
  return e.tagName === "TEXTAREA";
}, Qa = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !Ud(e) && n[t] === "visible")
  );
}, Vd = function(e) {
  return Qa(e, "overflowY");
}, qd = function(e) {
  return Qa(e, "overflowX");
}, Rs = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var o = Za(e, r);
    if (o) {
      var s = Ja(e, r), c = s[1], i = s[2];
      if (c > i)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, Xd = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, Kd = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, Za = function(e, t) {
  return e === "v" ? Vd(t) : qd(t);
}, Ja = function(e, t) {
  return e === "v" ? Xd(t) : Kd(t);
}, _d = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, $d = function(e, t, n, r, o) {
  var s = _d(e, window.getComputedStyle(t).direction), c = s * r, i = n.target, u = t.contains(i), l = !1, f = c > 0, d = 0, m = 0;
  do {
    if (!i)
      break;
    var p = Ja(e, i), v = p[0], g = p[1], x = p[2], b = g - x - s * v;
    (v || b) && Za(e, i) && (d += b, m += v);
    var A = i.parentNode;
    i = A && A.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? A.host : A;
  } while (
    // portaled content
    !u && i !== document.body || // self content
    u && (t.contains(i) || t === i)
  );
  return (f && Math.abs(d) < 1 || !f && Math.abs(m) < 1) && (l = !0), l;
}, jn = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Ps = function(e) {
  return [e.deltaX, e.deltaY];
}, Os = function(e) {
  return e && "current" in e ? e.current : e;
}, ef = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, tf = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, nf = 0, bt = [];
function rf(e) {
  var t = h.useRef([]), n = h.useRef([0, 0]), r = h.useRef(), o = h.useState(nf++)[0], s = h.useState(La)[0], c = h.useRef(e);
  h.useEffect(function() {
    c.current = e;
  }, [e]), h.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var g = Md([e.lockRef.current], (e.shards || []).map(Os), !0).filter(Boolean);
      return g.forEach(function(x) {
        return x.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), g.forEach(function(x) {
          return x.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var i = h.useCallback(function(g, x) {
    if ("touches" in g && g.touches.length === 2 || g.type === "wheel" && g.ctrlKey)
      return !c.current.allowPinchZoom;
    var b = jn(g), A = n.current, w = "deltaX" in g ? g.deltaX : A[0] - b[0], E = "deltaY" in g ? g.deltaY : A[1] - b[1], j, P = g.target, k = Math.abs(w) > Math.abs(E) ? "h" : "v";
    if ("touches" in g && k === "h" && P.type === "range")
      return !1;
    var M = window.getSelection(), D = M && M.anchorNode, Y = D ? D === P || D.contains(P) : !1;
    if (Y)
      return !1;
    var z = Rs(k, P);
    if (!z)
      return !0;
    if (z ? j = k : (j = k === "v" ? "h" : "v", z = Rs(k, P)), !z)
      return !1;
    if (!r.current && "changedTouches" in g && (w || E) && (r.current = j), !j)
      return !0;
    var Z = r.current || j;
    return $d(Z, x, g, Z === "h" ? w : E);
  }, []), u = h.useCallback(function(g) {
    var x = g;
    if (!(!bt.length || bt[bt.length - 1] !== s)) {
      var b = "deltaY" in x ? Ps(x) : jn(x), A = t.current.filter(function(j) {
        return j.name === x.type && (j.target === x.target || x.target === j.shadowParent) && ef(j.delta, b);
      })[0];
      if (A && A.should) {
        x.cancelable && x.preventDefault();
        return;
      }
      if (!A) {
        var w = (c.current.shards || []).map(Os).filter(Boolean).filter(function(j) {
          return j.contains(x.target);
        }), E = w.length > 0 ? i(x, w[0]) : !c.current.noIsolation;
        E && x.cancelable && x.preventDefault();
      }
    }
  }, []), l = h.useCallback(function(g, x, b, A) {
    var w = { name: g, delta: x, target: b, should: A, shadowParent: of(b) };
    t.current.push(w), setTimeout(function() {
      t.current = t.current.filter(function(E) {
        return E !== w;
      });
    }, 1);
  }, []), f = h.useCallback(function(g) {
    n.current = jn(g), r.current = void 0;
  }, []), d = h.useCallback(function(g) {
    l(g.type, Ps(g), g.target, i(g, e.lockRef.current));
  }, []), m = h.useCallback(function(g) {
    l(g.type, jn(g), g.target, i(g, e.lockRef.current));
  }, []);
  h.useEffect(function() {
    return bt.push(s), e.setCallbacks({
      onScrollCapture: d,
      onWheelCapture: d,
      onTouchMoveCapture: m
    }), document.addEventListener("wheel", u, xt), document.addEventListener("touchmove", u, xt), document.addEventListener("touchstart", f, xt), function() {
      bt = bt.filter(function(g) {
        return g !== s;
      }), document.removeEventListener("wheel", u, xt), document.removeEventListener("touchmove", u, xt), document.removeEventListener("touchstart", f, xt);
    };
  }, []);
  var p = e.removeScrollBar, v = e.inert;
  return h.createElement(
    h.Fragment,
    null,
    v ? h.createElement(s, { styles: tf(o) }) : null,
    p ? h.createElement(Wd, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function of(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const sf = Pd(Fa, rf);
var ur = h.forwardRef(function(e, t) {
  return h.createElement(lr, ke({}, e, { ref: t, sideCar: sf }));
});
ur.classNames = lr.classNames;
var af = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, wt = /* @__PURE__ */ new WeakMap(), Nn = /* @__PURE__ */ new WeakMap(), In = {}, Or = 0, Wa = function(e) {
  return e && (e.host || Wa(e.parentNode));
}, cf = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = Wa(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, lf = function(e, t, n, r) {
  var o = cf(t, Array.isArray(e) ? e : [e]);
  In[n] || (In[n] = /* @__PURE__ */ new WeakMap());
  var s = In[n], c = [], i = /* @__PURE__ */ new Set(), u = new Set(o), l = function(d) {
    !d || i.has(d) || (i.add(d), l(d.parentNode));
  };
  o.forEach(l);
  var f = function(d) {
    !d || u.has(d) || Array.prototype.forEach.call(d.children, function(m) {
      if (i.has(m))
        f(m);
      else
        try {
          var p = m.getAttribute(r), v = p !== null && p !== "false", g = (wt.get(m) || 0) + 1, x = (s.get(m) || 0) + 1;
          wt.set(m, g), s.set(m, x), c.push(m), g === 1 && v && Nn.set(m, !0), x === 1 && m.setAttribute(n, "true"), v || m.setAttribute(r, "true");
        } catch (b) {
          console.error("aria-hidden: cannot operate on ", m, b);
        }
    });
  };
  return f(t), i.clear(), Or++, function() {
    c.forEach(function(d) {
      var m = wt.get(d) - 1, p = s.get(d) - 1;
      wt.set(d, m), s.set(d, p), m || (Nn.has(d) || d.removeAttribute(r), Nn.delete(d)), p || d.removeAttribute(n);
    }), Or--, Or || (wt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), Nn = /* @__PURE__ */ new WeakMap(), In = {});
  };
}, Mo = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), o = af(e);
  return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), lf(r, o, n, "aria-hidden")) : function() {
    return null;
  };
}, dr = "Dialog", [Ua] = pt(dr), [uf, Se] = Ua(dr), Va = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: s,
    modal: c = !0
  } = e, i = h.useRef(null), u = h.useRef(null), [l, f] = fn({
    prop: r,
    defaultProp: o ?? !1,
    onChange: s,
    caller: dr
  });
  return /* @__PURE__ */ a.jsx(
    uf,
    {
      scope: t,
      triggerRef: i,
      contentRef: u,
      contentId: He(),
      titleId: He(),
      descriptionId: He(),
      open: l,
      onOpenChange: f,
      onOpenToggle: h.useCallback(() => f((d) => !d), [f]),
      modal: c,
      children: n
    }
  );
};
Va.displayName = dr;
var qa = "DialogTrigger", Xa = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Se(qa, n), s = ce(t, o.triggerRef);
    return /* @__PURE__ */ a.jsx(
      re.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": No(o.open),
        ...r,
        ref: s,
        onClick: U(e.onClick, o.onOpenToggle)
      }
    );
  }
);
Xa.displayName = qa;
var Co = "DialogPortal", [df, Ka] = Ua(Co, {
  forceMount: void 0
}), _a = (e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: o } = e, s = Se(Co, t);
  return /* @__PURE__ */ a.jsx(df, { scope: t, forceMount: n, children: h.Children.map(r, (c) => /* @__PURE__ */ a.jsx(Be, { present: n || s.open, children: /* @__PURE__ */ a.jsx(cr, { asChild: !0, container: o, children: c }) })) });
};
_a.displayName = Co;
var Fn = "DialogOverlay", $a = h.forwardRef(
  (e, t) => {
    const n = Ka(Fn, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, s = Se(Fn, e.__scopeDialog);
    return s.modal ? /* @__PURE__ */ a.jsx(Be, { present: r || s.open, children: /* @__PURE__ */ a.jsx(mf, { ...o, ref: t }) }) : null;
  }
);
$a.displayName = Fn;
var ff = /* @__PURE__ */ dt("DialogOverlay.RemoveScroll"), mf = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Se(Fn, n);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ a.jsx(ur, { as: ff, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ a.jsx(
        re.div,
        {
          "data-state": No(o.open),
          ...r,
          ref: t,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), ft = "DialogContent", ei = h.forwardRef(
  (e, t) => {
    const n = Ka(ft, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, s = Se(ft, e.__scopeDialog);
    return /* @__PURE__ */ a.jsx(Be, { present: r || s.open, children: s.modal ? /* @__PURE__ */ a.jsx(hf, { ...o, ref: t }) : /* @__PURE__ */ a.jsx(pf, { ...o, ref: t }) });
  }
);
ei.displayName = ft;
var hf = h.forwardRef(
  (e, t) => {
    const n = Se(ft, e.__scopeDialog), r = h.useRef(null), o = ce(t, n.contentRef, r);
    return h.useEffect(() => {
      const s = r.current;
      if (s) return Mo(s);
    }, []), /* @__PURE__ */ a.jsx(
      ti,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: U(e.onCloseAutoFocus, (s) => {
          s.preventDefault(), n.triggerRef.current?.focus();
        }),
        onPointerDownOutside: U(e.onPointerDownOutside, (s) => {
          const c = s.detail.originalEvent, i = c.button === 0 && c.ctrlKey === !0;
          (c.button === 2 || i) && s.preventDefault();
        }),
        onFocusOutside: U(
          e.onFocusOutside,
          (s) => s.preventDefault()
        )
      }
    );
  }
), pf = h.forwardRef(
  (e, t) => {
    const n = Se(ft, e.__scopeDialog), r = h.useRef(!1), o = h.useRef(!1);
    return /* @__PURE__ */ a.jsx(
      ti,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (s) => {
          e.onCloseAutoFocus?.(s), s.defaultPrevented || (r.current || n.triggerRef.current?.focus(), s.preventDefault()), r.current = !1, o.current = !1;
        },
        onInteractOutside: (s) => {
          e.onInteractOutside?.(s), s.defaultPrevented || (r.current = !0, s.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const c = s.target;
          n.triggerRef.current?.contains(c) && s.preventDefault(), s.detail.originalEvent.type === "focusin" && o.current && s.preventDefault();
        }
      }
    );
  }
), ti = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: s, ...c } = e, i = Se(ft, n), u = h.useRef(null), l = ce(t, u);
    return Eo(), /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx(
        ir,
        {
          asChild: !0,
          loop: !0,
          trapped: r,
          onMountAutoFocus: o,
          onUnmountAutoFocus: s,
          children: /* @__PURE__ */ a.jsx(
            ar,
            {
              role: "dialog",
              id: i.contentId,
              "aria-describedby": i.descriptionId,
              "aria-labelledby": i.titleId,
              "data-state": No(i.open),
              ...c,
              ref: l,
              onDismiss: () => i.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx(gf, { titleId: i.titleId }),
        /* @__PURE__ */ a.jsx(xf, { contentRef: u, descriptionId: i.descriptionId })
      ] })
    ] });
  }
), jo = "DialogTitle", ni = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Se(jo, n);
    return /* @__PURE__ */ a.jsx(re.h2, { id: o.titleId, ...r, ref: t });
  }
);
ni.displayName = jo;
var ri = "DialogDescription", oi = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Se(ri, n);
    return /* @__PURE__ */ a.jsx(re.p, { id: o.descriptionId, ...r, ref: t });
  }
);
oi.displayName = ri;
var si = "DialogClose", ai = h.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Se(si, n);
    return /* @__PURE__ */ a.jsx(
      re.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: U(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
ai.displayName = si;
function No(e) {
  return e ? "open" : "closed";
}
var ii = "DialogTitleWarning", [Hb, ci] = Ku(ii, {
  contentName: ft,
  titleName: jo,
  docsSlug: "dialog"
}), gf = ({ titleId: e }) => {
  const t = ci(ii), n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return h.useEffect(() => {
    e && (document.getElementById(e) || console.error(n));
  }, [n, e]), null;
}, vf = "DialogDescriptionWarning", xf = ({ contentRef: e, descriptionId: t }) => {
  const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${ci(vf).contentName}}.`;
  return h.useEffect(() => {
    const o = e.current?.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(r));
  }, [r, e, t]), null;
}, li = Va, ui = Xa, di = _a, fi = $a, mi = ei, hi = ni, pi = oi, mn = ai;
function bf(e) {
  const [t, n] = h.useState(void 0);
  return _e(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const s = o[0];
        let c, i;
        if ("borderBoxSize" in s) {
          const u = s.borderBoxSize, l = Array.isArray(u) ? u[0] : u;
          c = l.inlineSize, i = l.blockSize;
        } else
          c = e.offsetWidth, i = e.offsetHeight;
        n({ width: c, height: i });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
const wf = ["top", "right", "bottom", "left"], $e = Math.min, ge = Math.max, Ln = Math.round, Sn = Math.floor, Pe = (e) => ({
  x: e,
  y: e
}), Af = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function $r(e, t, n) {
  return ge(e, $e(t, n));
}
function Fe(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Le(e) {
  return e.split("-")[0];
}
function Ot(e) {
  return e.split("-")[1];
}
function Io(e) {
  return e === "x" ? "y" : "x";
}
function So(e) {
  return e === "y" ? "height" : "width";
}
function Re(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function Do(e) {
  return Io(Re(e));
}
function yf(e, t, n) {
  n === void 0 && (n = !1);
  const r = Ot(e), o = Do(e), s = So(o);
  let c = o === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (c = Qn(c)), [c, Qn(c)];
}
function Ef(e) {
  const t = Qn(e);
  return [eo(e), t, eo(t)];
}
function eo(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const zs = ["left", "right"], Bs = ["right", "left"], Mf = ["top", "bottom"], Cf = ["bottom", "top"];
function jf(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Bs : zs : t ? zs : Bs;
    case "left":
    case "right":
      return t ? Mf : Cf;
    default:
      return [];
  }
}
function Nf(e, t, n, r) {
  const o = Ot(e);
  let s = jf(Le(e), n === "start", r);
  return o && (s = s.map((c) => c + "-" + o), t && (s = s.concat(s.map(eo)))), s;
}
function Qn(e) {
  const t = Le(e);
  return Af[t] + e.slice(t.length);
}
function If(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function gi(e) {
  return typeof e != "number" ? If(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Zn(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: o
  } = e;
  return {
    width: r,
    height: o,
    top: n,
    left: t,
    right: t + r,
    bottom: n + o,
    x: t,
    y: n
  };
}
function Gs(e, t, n) {
  let {
    reference: r,
    floating: o
  } = e;
  const s = Re(t), c = Do(t), i = So(c), u = Le(t), l = s === "y", f = r.x + r.width / 2 - o.width / 2, d = r.y + r.height / 2 - o.height / 2, m = r[i] / 2 - o[i] / 2;
  let p;
  switch (u) {
    case "top":
      p = {
        x: f,
        y: r.y - o.height
      };
      break;
    case "bottom":
      p = {
        x: f,
        y: r.y + r.height
      };
      break;
    case "right":
      p = {
        x: r.x + r.width,
        y: d
      };
      break;
    case "left":
      p = {
        x: r.x - o.width,
        y: d
      };
      break;
    default:
      p = {
        x: r.x,
        y: r.y
      };
  }
  switch (Ot(t)) {
    case "start":
      p[c] -= m * (n && l ? -1 : 1);
      break;
    case "end":
      p[c] += m * (n && l ? -1 : 1);
      break;
  }
  return p;
}
async function Sf(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: o,
    platform: s,
    rects: c,
    elements: i,
    strategy: u
  } = e, {
    boundary: l = "clippingAncestors",
    rootBoundary: f = "viewport",
    elementContext: d = "floating",
    altBoundary: m = !1,
    padding: p = 0
  } = Fe(t, e), v = gi(p), x = i[m ? d === "floating" ? "reference" : "floating" : d], b = Zn(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(x))) == null || n ? x : x.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(i.floating)),
    boundary: l,
    rootBoundary: f,
    strategy: u
  })), A = d === "floating" ? {
    x: r,
    y: o,
    width: c.floating.width,
    height: c.floating.height
  } : c.reference, w = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(i.floating)), E = await (s.isElement == null ? void 0 : s.isElement(w)) ? await (s.getScale == null ? void 0 : s.getScale(w)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, j = Zn(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: i,
    rect: A,
    offsetParent: w,
    strategy: u
  }) : A);
  return {
    top: (b.top - j.top + v.top) / E.y,
    bottom: (j.bottom - b.bottom + v.bottom) / E.y,
    left: (b.left - j.left + v.left) / E.x,
    right: (j.right - b.right + v.right) / E.x
  };
}
const Df = 50, kf = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: s = [],
    platform: c
  } = n, i = c.detectOverflow ? c : {
    ...c,
    detectOverflow: Sf
  }, u = await (c.isRTL == null ? void 0 : c.isRTL(t));
  let l = await c.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: f,
    y: d
  } = Gs(l, r, u), m = r, p = 0;
  const v = {};
  for (let g = 0; g < s.length; g++) {
    const x = s[g];
    if (!x)
      continue;
    const {
      name: b,
      fn: A
    } = x, {
      x: w,
      y: E,
      data: j,
      reset: P
    } = await A({
      x: f,
      y: d,
      initialPlacement: r,
      placement: m,
      strategy: o,
      middlewareData: v,
      rects: l,
      platform: i,
      elements: {
        reference: e,
        floating: t
      }
    });
    f = w ?? f, d = E ?? d, v[b] = {
      ...v[b],
      ...j
    }, P && p < Df && (p++, typeof P == "object" && (P.placement && (m = P.placement), P.rects && (l = P.rects === !0 ? await c.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : P.rects), {
      x: f,
      y: d
    } = Gs(l, m, u)), g = -1);
  }
  return {
    x: f,
    y: d,
    placement: m,
    strategy: o,
    middlewareData: v
  };
}, Rf = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: r,
      placement: o,
      rects: s,
      platform: c,
      elements: i,
      middlewareData: u
    } = t, {
      element: l,
      padding: f = 0
    } = Fe(e, t) || {};
    if (l == null)
      return {};
    const d = gi(f), m = {
      x: n,
      y: r
    }, p = Do(o), v = So(p), g = await c.getDimensions(l), x = p === "y", b = x ? "top" : "left", A = x ? "bottom" : "right", w = x ? "clientHeight" : "clientWidth", E = s.reference[v] + s.reference[p] - m[p] - s.floating[v], j = m[p] - s.reference[p], P = await (c.getOffsetParent == null ? void 0 : c.getOffsetParent(l));
    let k = P ? P[w] : 0;
    (!k || !await (c.isElement == null ? void 0 : c.isElement(P))) && (k = i.floating[w] || s.floating[v]);
    const M = E / 2 - j / 2, D = k / 2 - g[v] / 2 - 1, Y = $e(d[b], D), z = $e(d[A], D), Z = Y, q = k - g[v] - z, G = k / 2 - g[v] / 2 + M, R = $r(Z, G, q), C = !u.arrow && Ot(o) != null && G !== R && s.reference[v] / 2 - (G < Z ? Y : z) - g[v] / 2 < 0, O = C ? G < Z ? G - Z : G - q : 0;
    return {
      [p]: m[p] + O,
      data: {
        [p]: R,
        centerOffset: G - R - O,
        ...C && {
          alignmentOffset: O
        }
      },
      reset: C
    };
  }
}), Pf = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        middlewareData: s,
        rects: c,
        initialPlacement: i,
        platform: u,
        elements: l
      } = t, {
        mainAxis: f = !0,
        crossAxis: d = !0,
        fallbackPlacements: m,
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: g = !0,
        ...x
      } = Fe(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const b = Le(o), A = Re(i), w = Le(i) === i, E = await (u.isRTL == null ? void 0 : u.isRTL(l.floating)), j = m || (w || !g ? [Qn(i)] : Ef(i)), P = v !== "none";
      !m && P && j.push(...Nf(i, g, v, E));
      const k = [i, ...j], M = await u.detectOverflow(t, x), D = [];
      let Y = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (f && D.push(M[b]), d) {
        const G = yf(o, c, E);
        D.push(M[G[0]], M[G[1]]);
      }
      if (Y = [...Y, {
        placement: o,
        overflows: D
      }], !D.every((G) => G <= 0)) {
        var z, Z;
        const G = (((z = s.flip) == null ? void 0 : z.index) || 0) + 1, R = k[G];
        if (R && (!(d === "alignment" ? A !== Re(R) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        Y.every((N) => Re(N.placement) === A ? N.overflows[0] > 0 : !0)))
          return {
            data: {
              index: G,
              overflows: Y
            },
            reset: {
              placement: R
            }
          };
        let C = (Z = Y.filter((O) => O.overflows[0] <= 0).sort((O, N) => O.overflows[1] - N.overflows[1])[0]) == null ? void 0 : Z.placement;
        if (!C)
          switch (p) {
            case "bestFit": {
              var q;
              const O = (q = Y.filter((N) => {
                if (P) {
                  const S = Re(N.placement);
                  return S === A || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  S === "y";
                }
                return !0;
              }).map((N) => [N.placement, N.overflows.filter((S) => S > 0).reduce((S, I) => S + I, 0)]).sort((N, S) => N[1] - S[1])[0]) == null ? void 0 : q[0];
              O && (C = O);
              break;
            }
            case "initialPlacement":
              C = i;
              break;
          }
        if (o !== C)
          return {
            reset: {
              placement: C
            }
          };
      }
      return {};
    }
  };
};
function Ts(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function Ys(e) {
  return wf.some((t) => e[t] >= 0);
}
const Of = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n,
        platform: r
      } = t, {
        strategy: o = "referenceHidden",
        ...s
      } = Fe(e, t);
      switch (o) {
        case "referenceHidden": {
          const c = await r.detectOverflow(t, {
            ...s,
            elementContext: "reference"
          }), i = Ts(c, n.reference);
          return {
            data: {
              referenceHiddenOffsets: i,
              referenceHidden: Ys(i)
            }
          };
        }
        case "escaped": {
          const c = await r.detectOverflow(t, {
            ...s,
            altBoundary: !0
          }), i = Ts(c, n.floating);
          return {
            data: {
              escapedOffsets: i,
              escaped: Ys(i)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, vi = /* @__PURE__ */ new Set(["left", "top"]);
async function zf(e, t) {
  const {
    placement: n,
    platform: r,
    elements: o
  } = e, s = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), c = Le(n), i = Ot(n), u = Re(n) === "y", l = vi.has(c) ? -1 : 1, f = s && u ? -1 : 1, d = Fe(t, e);
  let {
    mainAxis: m,
    crossAxis: p,
    alignmentAxis: v
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return i && typeof v == "number" && (p = i === "end" ? v * -1 : v), u ? {
    x: p * f,
    y: m * l
  } : {
    x: m * l,
    y: p * f
  };
}
const Bf = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r;
      const {
        x: o,
        y: s,
        placement: c,
        middlewareData: i
      } = t, u = await zf(t, e);
      return c === ((n = i.offset) == null ? void 0 : n.placement) && (r = i.arrow) != null && r.alignmentOffset ? {} : {
        x: o + u.x,
        y: s + u.y,
        data: {
          ...u,
          placement: c
        }
      };
    }
  };
}, Gf = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: o,
        platform: s
      } = t, {
        mainAxis: c = !0,
        crossAxis: i = !1,
        limiter: u = {
          fn: (b) => {
            let {
              x: A,
              y: w
            } = b;
            return {
              x: A,
              y: w
            };
          }
        },
        ...l
      } = Fe(e, t), f = {
        x: n,
        y: r
      }, d = await s.detectOverflow(t, l), m = Re(Le(o)), p = Io(m);
      let v = f[p], g = f[m];
      if (c) {
        const b = p === "y" ? "top" : "left", A = p === "y" ? "bottom" : "right", w = v + d[b], E = v - d[A];
        v = $r(w, v, E);
      }
      if (i) {
        const b = m === "y" ? "top" : "left", A = m === "y" ? "bottom" : "right", w = g + d[b], E = g - d[A];
        g = $r(w, g, E);
      }
      const x = u.fn({
        ...t,
        [p]: v,
        [m]: g
      });
      return {
        ...x,
        data: {
          x: x.x - n,
          y: x.y - r,
          enabled: {
            [p]: c,
            [m]: i
          }
        }
      };
    }
  };
}, Tf = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: n,
        y: r,
        placement: o,
        rects: s,
        middlewareData: c
      } = t, {
        offset: i = 0,
        mainAxis: u = !0,
        crossAxis: l = !0
      } = Fe(e, t), f = {
        x: n,
        y: r
      }, d = Re(o), m = Io(d);
      let p = f[m], v = f[d];
      const g = Fe(i, t), x = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (u) {
        const w = m === "y" ? "height" : "width", E = s.reference[m] - s.floating[w] + x.mainAxis, j = s.reference[m] + s.reference[w] - x.mainAxis;
        p < E ? p = E : p > j && (p = j);
      }
      if (l) {
        var b, A;
        const w = m === "y" ? "width" : "height", E = vi.has(Le(o)), j = s.reference[d] - s.floating[w] + (E && ((b = c.offset) == null ? void 0 : b[d]) || 0) + (E ? 0 : x.crossAxis), P = s.reference[d] + s.reference[w] + (E ? 0 : ((A = c.offset) == null ? void 0 : A[d]) || 0) - (E ? x.crossAxis : 0);
        v < j ? v = j : v > P && (v = P);
      }
      return {
        [m]: p,
        [d]: v
      };
    }
  };
}, Yf = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        rects: s,
        platform: c,
        elements: i
      } = t, {
        apply: u = () => {
        },
        ...l
      } = Fe(e, t), f = await c.detectOverflow(t, l), d = Le(o), m = Ot(o), p = Re(o) === "y", {
        width: v,
        height: g
      } = s.floating;
      let x, b;
      d === "top" || d === "bottom" ? (x = d, b = m === (await (c.isRTL == null ? void 0 : c.isRTL(i.floating)) ? "start" : "end") ? "left" : "right") : (b = d, x = m === "end" ? "top" : "bottom");
      const A = g - f.top - f.bottom, w = v - f.left - f.right, E = $e(g - f[x], A), j = $e(v - f[b], w), P = !t.middlewareData.shift;
      let k = E, M = j;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (M = w), (r = t.middlewareData.shift) != null && r.enabled.y && (k = A), P && !m) {
        const Y = ge(f.left, 0), z = ge(f.right, 0), Z = ge(f.top, 0), q = ge(f.bottom, 0);
        p ? M = v - 2 * (Y !== 0 || z !== 0 ? Y + z : ge(f.left, f.right)) : k = g - 2 * (Z !== 0 || q !== 0 ? Z + q : ge(f.top, f.bottom));
      }
      await u({
        ...t,
        availableWidth: M,
        availableHeight: k
      });
      const D = await c.getDimensions(i.floating);
      return v !== D.width || g !== D.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function fr() {
  return typeof window < "u";
}
function zt(e) {
  return xi(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function be(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Ge(e) {
  var t;
  return (t = (xi(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function xi(e) {
  return fr() ? e instanceof Node || e instanceof be(e).Node : !1;
}
function je(e) {
  return fr() ? e instanceof Element || e instanceof be(e).Element : !1;
}
function Qe(e) {
  return fr() ? e instanceof HTMLElement || e instanceof be(e).HTMLElement : !1;
}
function Hs(e) {
  return !fr() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof be(e).ShadowRoot;
}
function hn(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: o
  } = Ne(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && o !== "inline" && o !== "contents";
}
function Hf(e) {
  return /^(table|td|th)$/.test(zt(e));
}
function mr(e) {
  try {
    if (e.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
const Ff = /transform|translate|scale|rotate|perspective|filter/, Lf = /paint|layout|strict|content/, st = (e) => !!e && e !== "none";
let zr;
function ko(e) {
  const t = je(e) ? Ne(e) : e;
  return st(t.transform) || st(t.translate) || st(t.scale) || st(t.rotate) || st(t.perspective) || !Ro() && (st(t.backdropFilter) || st(t.filter)) || Ff.test(t.willChange || "") || Lf.test(t.contain || "");
}
function Qf(e) {
  let t = et(e);
  for (; Qe(t) && !Dt(t); ) {
    if (ko(t))
      return t;
    if (mr(t))
      return null;
    t = et(t);
  }
  return null;
}
function Ro() {
  return zr == null && (zr = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), zr;
}
function Dt(e) {
  return /^(html|body|#document)$/.test(zt(e));
}
function Ne(e) {
  return be(e).getComputedStyle(e);
}
function hr(e) {
  return je(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function et(e) {
  if (zt(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Hs(e) && e.host || // Fallback.
    Ge(e)
  );
  return Hs(t) ? t.host : t;
}
function bi(e) {
  const t = et(e);
  return Dt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Qe(t) && hn(t) ? t : bi(t);
}
function Kt(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const o = bi(e), s = o === ((r = e.ownerDocument) == null ? void 0 : r.body), c = be(o);
  if (s) {
    const i = to(c);
    return t.concat(c, c.visualViewport || [], hn(o) ? o : [], i && n ? Kt(i) : []);
  } else
    return t.concat(o, Kt(o, [], n));
}
function to(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function wi(e) {
  const t = Ne(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const o = Qe(e), s = o ? e.offsetWidth : n, c = o ? e.offsetHeight : r, i = Ln(n) !== s || Ln(r) !== c;
  return i && (n = s, r = c), {
    width: n,
    height: r,
    $: i
  };
}
function Po(e) {
  return je(e) ? e : e.contextElement;
}
function Mt(e) {
  const t = Po(e);
  if (!Qe(t))
    return Pe(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: o,
    $: s
  } = wi(t);
  let c = (s ? Ln(n.width) : n.width) / r, i = (s ? Ln(n.height) : n.height) / o;
  return (!c || !Number.isFinite(c)) && (c = 1), (!i || !Number.isFinite(i)) && (i = 1), {
    x: c,
    y: i
  };
}
const Zf = /* @__PURE__ */ Pe(0);
function Ai(e) {
  const t = be(e);
  return !Ro() || !t.visualViewport ? Zf : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Jf(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== be(e) ? !1 : t;
}
function mt(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const o = e.getBoundingClientRect(), s = Po(e);
  let c = Pe(1);
  t && (r ? je(r) && (c = Mt(r)) : c = Mt(e));
  const i = Jf(s, n, r) ? Ai(s) : Pe(0);
  let u = (o.left + i.x) / c.x, l = (o.top + i.y) / c.y, f = o.width / c.x, d = o.height / c.y;
  if (s) {
    const m = be(s), p = r && je(r) ? be(r) : r;
    let v = m, g = to(v);
    for (; g && r && p !== v; ) {
      const x = Mt(g), b = g.getBoundingClientRect(), A = Ne(g), w = b.left + (g.clientLeft + parseFloat(A.paddingLeft)) * x.x, E = b.top + (g.clientTop + parseFloat(A.paddingTop)) * x.y;
      u *= x.x, l *= x.y, f *= x.x, d *= x.y, u += w, l += E, v = be(g), g = to(v);
    }
  }
  return Zn({
    width: f,
    height: d,
    x: u,
    y: l
  });
}
function pr(e, t) {
  const n = hr(e).scrollLeft;
  return t ? t.left + n : mt(Ge(e)).left + n;
}
function yi(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - pr(e, n), o = n.top + t.scrollTop;
  return {
    x: r,
    y: o
  };
}
function Wf(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: o
  } = e;
  const s = o === "fixed", c = Ge(r), i = t ? mr(t.floating) : !1;
  if (r === c || i && s)
    return n;
  let u = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = Pe(1);
  const f = Pe(0), d = Qe(r);
  if ((d || !d && !s) && ((zt(r) !== "body" || hn(c)) && (u = hr(r)), d)) {
    const p = mt(r);
    l = Mt(r), f.x = p.x + r.clientLeft, f.y = p.y + r.clientTop;
  }
  const m = c && !d && !s ? yi(c, u) : Pe(0);
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - u.scrollLeft * l.x + f.x + m.x,
    y: n.y * l.y - u.scrollTop * l.y + f.y + m.y
  };
}
function Uf(e) {
  return Array.from(e.getClientRects());
}
function Vf(e) {
  const t = Ge(e), n = hr(e), r = e.ownerDocument.body, o = ge(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), s = ge(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let c = -n.scrollLeft + pr(e);
  const i = -n.scrollTop;
  return Ne(r).direction === "rtl" && (c += ge(t.clientWidth, r.clientWidth) - o), {
    width: o,
    height: s,
    x: c,
    y: i
  };
}
const Fs = 25;
function qf(e, t) {
  const n = be(e), r = Ge(e), o = n.visualViewport;
  let s = r.clientWidth, c = r.clientHeight, i = 0, u = 0;
  if (o) {
    s = o.width, c = o.height;
    const f = Ro();
    (!f || f && t === "fixed") && (i = o.offsetLeft, u = o.offsetTop);
  }
  const l = pr(r);
  if (l <= 0) {
    const f = r.ownerDocument, d = f.body, m = getComputedStyle(d), p = f.compatMode === "CSS1Compat" && parseFloat(m.marginLeft) + parseFloat(m.marginRight) || 0, v = Math.abs(r.clientWidth - d.clientWidth - p);
    v <= Fs && (s -= v);
  } else l <= Fs && (s += l);
  return {
    width: s,
    height: c,
    x: i,
    y: u
  };
}
function Xf(e, t) {
  const n = mt(e, !0, t === "fixed"), r = n.top + e.clientTop, o = n.left + e.clientLeft, s = Qe(e) ? Mt(e) : Pe(1), c = e.clientWidth * s.x, i = e.clientHeight * s.y, u = o * s.x, l = r * s.y;
  return {
    width: c,
    height: i,
    x: u,
    y: l
  };
}
function Ls(e, t, n) {
  let r;
  if (t === "viewport")
    r = qf(e, n);
  else if (t === "document")
    r = Vf(Ge(e));
  else if (je(t))
    r = Xf(t, n);
  else {
    const o = Ai(e);
    r = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return Zn(r);
}
function Ei(e, t) {
  const n = et(e);
  return n === t || !je(n) || Dt(n) ? !1 : Ne(n).position === "fixed" || Ei(n, t);
}
function Kf(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = Kt(e, [], !1).filter((i) => je(i) && zt(i) !== "body"), o = null;
  const s = Ne(e).position === "fixed";
  let c = s ? et(e) : e;
  for (; je(c) && !Dt(c); ) {
    const i = Ne(c), u = ko(c);
    !u && i.position === "fixed" && (o = null), (s ? !u && !o : !u && i.position === "static" && !!o && (o.position === "absolute" || o.position === "fixed") || hn(c) && !u && Ei(e, c)) ? r = r.filter((f) => f !== c) : o = i, c = et(c);
  }
  return t.set(e, r), r;
}
function _f(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: o
  } = e;
  const c = [...n === "clippingAncestors" ? mr(t) ? [] : Kf(t, this._c) : [].concat(n), r], i = Ls(t, c[0], o);
  let u = i.top, l = i.right, f = i.bottom, d = i.left;
  for (let m = 1; m < c.length; m++) {
    const p = Ls(t, c[m], o);
    u = ge(p.top, u), l = $e(p.right, l), f = $e(p.bottom, f), d = ge(p.left, d);
  }
  return {
    width: l - d,
    height: f - u,
    x: d,
    y: u
  };
}
function $f(e) {
  const {
    width: t,
    height: n
  } = wi(e);
  return {
    width: t,
    height: n
  };
}
function em(e, t, n) {
  const r = Qe(t), o = Ge(t), s = n === "fixed", c = mt(e, !0, s, t);
  let i = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = Pe(0);
  function l() {
    u.x = pr(o);
  }
  if (r || !r && !s)
    if ((zt(t) !== "body" || hn(o)) && (i = hr(t)), r) {
      const p = mt(t, !0, s, t);
      u.x = p.x + t.clientLeft, u.y = p.y + t.clientTop;
    } else o && l();
  s && !r && o && l();
  const f = o && !r && !s ? yi(o, i) : Pe(0), d = c.left + i.scrollLeft - u.x - f.x, m = c.top + i.scrollTop - u.y - f.y;
  return {
    x: d,
    y: m,
    width: c.width,
    height: c.height
  };
}
function Br(e) {
  return Ne(e).position === "static";
}
function Qs(e, t) {
  if (!Qe(e) || Ne(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return Ge(e) === n && (n = n.ownerDocument.body), n;
}
function Mi(e, t) {
  const n = be(e);
  if (mr(e))
    return n;
  if (!Qe(e)) {
    let o = et(e);
    for (; o && !Dt(o); ) {
      if (je(o) && !Br(o))
        return o;
      o = et(o);
    }
    return n;
  }
  let r = Qs(e, t);
  for (; r && Hf(r) && Br(r); )
    r = Qs(r, t);
  return r && Dt(r) && Br(r) && !ko(r) ? n : r || Qf(e) || n;
}
const tm = async function(e) {
  const t = this.getOffsetParent || Mi, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: em(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function nm(e) {
  return Ne(e).direction === "rtl";
}
const rm = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Wf,
  getDocumentElement: Ge,
  getClippingRect: _f,
  getOffsetParent: Mi,
  getElementRects: tm,
  getClientRects: Uf,
  getDimensions: $f,
  getScale: Mt,
  isElement: je,
  isRTL: nm
};
function Ci(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function om(e, t) {
  let n = null, r;
  const o = Ge(e);
  function s() {
    var i;
    clearTimeout(r), (i = n) == null || i.disconnect(), n = null;
  }
  function c(i, u) {
    i === void 0 && (i = !1), u === void 0 && (u = 1), s();
    const l = e.getBoundingClientRect(), {
      left: f,
      top: d,
      width: m,
      height: p
    } = l;
    if (i || t(), !m || !p)
      return;
    const v = Sn(d), g = Sn(o.clientWidth - (f + m)), x = Sn(o.clientHeight - (d + p)), b = Sn(f), w = {
      rootMargin: -v + "px " + -g + "px " + -x + "px " + -b + "px",
      threshold: ge(0, $e(1, u)) || 1
    };
    let E = !0;
    function j(P) {
      const k = P[0].intersectionRatio;
      if (k !== u) {
        if (!E)
          return c();
        k ? c(!1, k) : r = setTimeout(() => {
          c(!1, 1e-7);
        }, 1e3);
      }
      k === 1 && !Ci(l, e.getBoundingClientRect()) && c(), E = !1;
    }
    try {
      n = new IntersectionObserver(j, {
        ...w,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(j, w);
    }
    n.observe(e);
  }
  return c(!0), s;
}
function sm(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: s = !0,
    elementResize: c = typeof ResizeObserver == "function",
    layoutShift: i = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = r, l = Po(e), f = o || s ? [...l ? Kt(l) : [], ...t ? Kt(t) : []] : [];
  f.forEach((b) => {
    o && b.addEventListener("scroll", n, {
      passive: !0
    }), s && b.addEventListener("resize", n);
  });
  const d = l && i ? om(l, n) : null;
  let m = -1, p = null;
  c && (p = new ResizeObserver((b) => {
    let [A] = b;
    A && A.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(m), m = requestAnimationFrame(() => {
      var w;
      (w = p) == null || w.observe(t);
    })), n();
  }), l && !u && p.observe(l), t && p.observe(t));
  let v, g = u ? mt(e) : null;
  u && x();
  function x() {
    const b = mt(e);
    g && !Ci(g, b) && n(), g = b, v = requestAnimationFrame(x);
  }
  return n(), () => {
    var b;
    f.forEach((A) => {
      o && A.removeEventListener("scroll", n), s && A.removeEventListener("resize", n);
    }), d?.(), (b = p) == null || b.disconnect(), p = null, u && cancelAnimationFrame(v);
  };
}
const am = Bf, im = Gf, cm = Pf, lm = Yf, um = Of, Zs = Rf, dm = Tf, fm = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), o = {
    platform: rm,
    ...n
  }, s = {
    ...o.platform,
    _c: r
  };
  return kf(e, t, {
    ...o,
    platform: s
  });
};
var mm = typeof document < "u", hm = function() {
}, Gn = mm ? yo : hm;
function Jn(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Jn(e[r], t[r]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!{}.hasOwnProperty.call(t, o[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const s = o[r];
      if (!(s === "_owner" && e.$$typeof) && !Jn(e[s], t[s]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function ji(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Js(e, t) {
  const n = ji(e);
  return Math.round(t * n) / n;
}
function Gr(e) {
  const t = h.useRef(e);
  return Gn(() => {
    t.current = e;
  }), t;
}
function pm(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: r = [],
    platform: o,
    elements: {
      reference: s,
      floating: c
    } = {},
    transform: i = !0,
    whileElementsMounted: u,
    open: l
  } = e, [f, d] = h.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [m, p] = h.useState(r);
  Jn(m, r) || p(r);
  const [v, g] = h.useState(null), [x, b] = h.useState(null), A = h.useCallback((N) => {
    N !== P.current && (P.current = N, g(N));
  }, []), w = h.useCallback((N) => {
    N !== k.current && (k.current = N, b(N));
  }, []), E = s || v, j = c || x, P = h.useRef(null), k = h.useRef(null), M = h.useRef(f), D = u != null, Y = Gr(u), z = Gr(o), Z = Gr(l), q = h.useCallback(() => {
    if (!P.current || !k.current)
      return;
    const N = {
      placement: t,
      strategy: n,
      middleware: m
    };
    z.current && (N.platform = z.current), fm(P.current, k.current, N).then((S) => {
      const I = {
        ...S,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: Z.current !== !1
      };
      G.current && !Jn(M.current, I) && (M.current = I, Sa.flushSync(() => {
        d(I);
      }));
    });
  }, [m, t, n, z, Z]);
  Gn(() => {
    l === !1 && M.current.isPositioned && (M.current.isPositioned = !1, d((N) => ({
      ...N,
      isPositioned: !1
    })));
  }, [l]);
  const G = h.useRef(!1);
  Gn(() => (G.current = !0, () => {
    G.current = !1;
  }), []), Gn(() => {
    if (E && (P.current = E), j && (k.current = j), E && j) {
      if (Y.current)
        return Y.current(E, j, q);
      q();
    }
  }, [E, j, q, Y, D]);
  const R = h.useMemo(() => ({
    reference: P,
    floating: k,
    setReference: A,
    setFloating: w
  }), [A, w]), C = h.useMemo(() => ({
    reference: E,
    floating: j
  }), [E, j]), O = h.useMemo(() => {
    const N = {
      position: n,
      left: 0,
      top: 0
    };
    if (!C.floating)
      return N;
    const S = Js(C.floating, f.x), I = Js(C.floating, f.y);
    return i ? {
      ...N,
      transform: "translate(" + S + "px, " + I + "px)",
      ...ji(C.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: S,
      top: I
    };
  }, [n, i, C.floating, f.x, f.y]);
  return h.useMemo(() => ({
    ...f,
    update: q,
    refs: R,
    elements: C,
    floatingStyles: O
  }), [f, q, R, C, O]);
}
const gm = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: r,
        padding: o
      } = typeof e == "function" ? e(n) : e;
      return r && t(r) ? r.current != null ? Zs({
        element: r.current,
        padding: o
      }).fn(n) : {} : r ? Zs({
        element: r,
        padding: o
      }).fn(n) : {};
    }
  };
}, vm = (e, t) => {
  const n = am(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, xm = (e, t) => {
  const n = im(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, bm = (e, t) => ({
  fn: dm(e).fn,
  options: [e, t]
}), wm = (e, t) => {
  const n = cm(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Am = (e, t) => {
  const n = lm(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, ym = (e, t) => {
  const n = um(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Em = (e, t) => {
  const n = gm(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var Mm = "Arrow", Ni = h.forwardRef((e, t) => {
  const { children: n, width: r = 10, height: o = 5, ...s } = e;
  return /* @__PURE__ */ a.jsx(
    re.svg,
    {
      ...s,
      ref: t,
      width: r,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ a.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Ni.displayName = Mm;
var Cm = Ni, Oo = "Popper", [Ii, gr] = pt(Oo), [jm, Si] = Ii(Oo), Di = (e) => {
  const { __scopePopper: t, children: n } = e, [r, o] = h.useState(null);
  return /* @__PURE__ */ a.jsx(jm, { scope: t, anchor: r, onAnchorChange: o, children: n });
};
Di.displayName = Oo;
var ki = "PopperAnchor", Ri = h.forwardRef(
  (e, t) => {
    const { __scopePopper: n, virtualRef: r, ...o } = e, s = Si(ki, n), c = h.useRef(null), i = ce(t, c), u = h.useRef(null);
    return h.useEffect(() => {
      const l = u.current;
      u.current = r?.current || c.current, l !== u.current && s.onAnchorChange(u.current);
    }), r ? null : /* @__PURE__ */ a.jsx(re.div, { ...o, ref: i });
  }
);
Ri.displayName = ki;
var zo = "PopperContent", [Nm, Im] = Ii(zo), Pi = h.forwardRef(
  (e, t) => {
    const {
      __scopePopper: n,
      side: r = "bottom",
      sideOffset: o = 0,
      align: s = "center",
      alignOffset: c = 0,
      arrowPadding: i = 0,
      avoidCollisions: u = !0,
      collisionBoundary: l = [],
      collisionPadding: f = 0,
      sticky: d = "partial",
      hideWhenDetached: m = !1,
      updatePositionStrategy: p = "optimized",
      onPlaced: v,
      ...g
    } = e, x = Si(zo, n), [b, A] = h.useState(null), w = ce(t, (J) => A(J)), [E, j] = h.useState(null), P = bf(E), k = P?.width ?? 0, M = P?.height ?? 0, D = r + (s !== "center" ? "-" + s : ""), Y = typeof f == "number" ? f : { top: 0, right: 0, bottom: 0, left: 0, ...f }, z = Array.isArray(l) ? l : [l], Z = z.length > 0, q = {
      padding: Y,
      boundary: z.filter(Dm),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: Z
    }, { refs: G, floatingStyles: R, placement: C, isPositioned: O, middlewareData: N } = pm({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: D,
      whileElementsMounted: (...J) => sm(...J, {
        animationFrame: p === "always"
      }),
      elements: {
        reference: x.anchor
      },
      middleware: [
        vm({ mainAxis: o + M, alignmentAxis: c }),
        u && xm({
          mainAxis: !0,
          crossAxis: !1,
          limiter: d === "partial" ? bm() : void 0,
          ...q
        }),
        u && wm({ ...q }),
        Am({
          ...q,
          apply: ({ elements: J, rects: oe, availableWidth: ee, availableHeight: ne }) => {
            const { width: le, height: he } = oe.reference, ue = J.floating.style;
            ue.setProperty("--radix-popper-available-width", `${ee}px`), ue.setProperty("--radix-popper-available-height", `${ne}px`), ue.setProperty("--radix-popper-anchor-width", `${le}px`), ue.setProperty("--radix-popper-anchor-height", `${he}px`);
          }
        }),
        E && Em({ element: E, padding: i }),
        km({ arrowWidth: k, arrowHeight: M }),
        m && ym({ strategy: "referenceHidden", ...q })
      ]
    }), [S, I] = Bi(C), y = Oe(v);
    _e(() => {
      O && y?.();
    }, [O, y]);
    const T = N.arrow?.x, Q = N.arrow?.y, W = N.arrow?.centerOffset !== 0, [X, _] = h.useState();
    return _e(() => {
      b && _(window.getComputedStyle(b).zIndex);
    }, [b]), /* @__PURE__ */ a.jsx(
      "div",
      {
        ref: G.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...R,
          transform: O ? R.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: X,
          "--radix-popper-transform-origin": [
            N.transformOrigin?.x,
            N.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...N.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ a.jsx(
          Nm,
          {
            scope: n,
            placedSide: S,
            onArrowChange: j,
            arrowX: T,
            arrowY: Q,
            shouldHideArrow: W,
            children: /* @__PURE__ */ a.jsx(
              re.div,
              {
                "data-side": S,
                "data-align": I,
                ...g,
                ref: w,
                style: {
                  ...g.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: O ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
Pi.displayName = zo;
var Oi = "PopperArrow", Sm = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, zi = h.forwardRef(function(t, n) {
  const { __scopePopper: r, ...o } = t, s = Im(Oi, r), c = Sm[s.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ a.jsx(
      "span",
      {
        ref: s.onArrowChange,
        style: {
          position: "absolute",
          left: s.arrowX,
          top: s.arrowY,
          [c]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[s.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[s.placedSide],
          visibility: s.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ a.jsx(
          Cm,
          {
            ...o,
            ref: n,
            style: {
              ...o.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
zi.displayName = Oi;
function Dm(e) {
  return e !== null;
}
var km = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    const { placement: n, rects: r, middlewareData: o } = t, c = o.arrow?.centerOffset !== 0, i = c ? 0 : e.arrowWidth, u = c ? 0 : e.arrowHeight, [l, f] = Bi(n), d = { start: "0%", center: "50%", end: "100%" }[f], m = (o.arrow?.x ?? 0) + i / 2, p = (o.arrow?.y ?? 0) + u / 2;
    let v = "", g = "";
    return l === "bottom" ? (v = c ? d : `${m}px`, g = `${-u}px`) : l === "top" ? (v = c ? d : `${m}px`, g = `${r.floating.height + u}px`) : l === "right" ? (v = `${-u}px`, g = c ? d : `${p}px`) : l === "left" && (v = `${r.floating.width + u}px`, g = c ? d : `${p}px`), { data: { x: v, y: g } };
  }
});
function Bi(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var Bo = Di, Go = Ri, Gi = Pi, Ti = zi, Tr = "rovingFocusGroup.onEntryFocus", Rm = { bubbles: !1, cancelable: !0 }, pn = "RovingFocusGroup", [no, Yi, Pm] = Oa(pn), [Om, Hi] = pt(
  pn,
  [Pm]
), [zm, Bm] = Om(pn), Fi = h.forwardRef(
  (e, t) => /* @__PURE__ */ a.jsx(no.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ a.jsx(no.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ a.jsx(Gm, { ...e, ref: t }) }) })
);
Fi.displayName = pn;
var Gm = h.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: r,
    loop: o = !1,
    dir: s,
    currentTabStopId: c,
    defaultCurrentTabStopId: i,
    onCurrentTabStopIdChange: u,
    onEntryFocus: l,
    preventScrollOnEntryFocus: f = !1,
    ...d
  } = e, m = h.useRef(null), p = ce(t, m), v = za(s), [g, x] = fn({
    prop: c,
    defaultProp: i ?? null,
    onChange: u,
    caller: pn
  }), [b, A] = h.useState(!1), w = Oe(l), E = Yi(n), j = h.useRef(!1), [P, k] = h.useState(0);
  return h.useEffect(() => {
    const M = m.current;
    if (M)
      return M.addEventListener(Tr, w), () => M.removeEventListener(Tr, w);
  }, [w]), /* @__PURE__ */ a.jsx(
    zm,
    {
      scope: n,
      orientation: r,
      dir: v,
      loop: o,
      currentTabStopId: g,
      onItemFocus: h.useCallback(
        (M) => x(M),
        [x]
      ),
      onItemShiftTab: h.useCallback(() => A(!0), []),
      onFocusableItemAdd: h.useCallback(
        () => k((M) => M + 1),
        []
      ),
      onFocusableItemRemove: h.useCallback(
        () => k((M) => M - 1),
        []
      ),
      children: /* @__PURE__ */ a.jsx(
        re.div,
        {
          tabIndex: b || P === 0 ? -1 : 0,
          "data-orientation": r,
          ...d,
          ref: p,
          style: { outline: "none", ...e.style },
          onMouseDown: U(e.onMouseDown, () => {
            j.current = !0;
          }),
          onFocus: U(e.onFocus, (M) => {
            const D = !j.current;
            if (M.target === M.currentTarget && D && !b) {
              const Y = new CustomEvent(Tr, Rm);
              if (M.currentTarget.dispatchEvent(Y), !Y.defaultPrevented) {
                const z = E().filter((C) => C.focusable), Z = z.find((C) => C.active), q = z.find((C) => C.id === g), R = [Z, q, ...z].filter(
                  Boolean
                ).map((C) => C.ref.current);
                Zi(R, f);
              }
            }
            j.current = !1;
          }),
          onBlur: U(e.onBlur, () => A(!1))
        }
      )
    }
  );
}), Li = "RovingFocusGroupItem", Qi = h.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: r = !0,
      active: o = !1,
      tabStopId: s,
      children: c,
      ...i
    } = e, u = He(), l = s || u, f = Bm(Li, n), d = f.currentTabStopId === l, m = Yi(n), { onFocusableItemAdd: p, onFocusableItemRemove: v, currentTabStopId: g } = f;
    return h.useEffect(() => {
      if (r)
        return p(), () => v();
    }, [r, p, v]), /* @__PURE__ */ a.jsx(
      no.ItemSlot,
      {
        scope: n,
        id: l,
        focusable: r,
        active: o,
        children: /* @__PURE__ */ a.jsx(
          re.span,
          {
            tabIndex: d ? 0 : -1,
            "data-orientation": f.orientation,
            ...i,
            ref: t,
            onMouseDown: U(e.onMouseDown, (x) => {
              r ? f.onItemFocus(l) : x.preventDefault();
            }),
            onFocus: U(e.onFocus, () => f.onItemFocus(l)),
            onKeyDown: U(e.onKeyDown, (x) => {
              if (x.key === "Tab" && x.shiftKey) {
                f.onItemShiftTab();
                return;
              }
              if (x.target !== x.currentTarget) return;
              const b = Hm(x, f.orientation, f.dir);
              if (b !== void 0) {
                if (x.metaKey || x.ctrlKey || x.altKey || x.shiftKey) return;
                x.preventDefault();
                let w = m().filter((E) => E.focusable).map((E) => E.ref.current);
                if (b === "last") w.reverse();
                else if (b === "prev" || b === "next") {
                  b === "prev" && w.reverse();
                  const E = w.indexOf(x.currentTarget);
                  w = f.loop ? Fm(w, E + 1) : w.slice(E + 1);
                }
                setTimeout(() => Zi(w));
              }
            }),
            children: typeof c == "function" ? c({ isCurrentTabStop: d, hasTabStop: g != null }) : c
          }
        )
      }
    );
  }
);
Qi.displayName = Li;
var Tm = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Ym(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function Hm(e, t, n) {
  const r = Ym(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return Tm[r];
}
function Zi(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function Fm(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var Lm = Fi, Qm = Qi, ro = ["Enter", " "], Zm = ["ArrowDown", "PageUp", "Home"], Ji = ["ArrowUp", "PageDown", "End"], Jm = [...Zm, ...Ji], Wm = {
  ltr: [...ro, "ArrowRight"],
  rtl: [...ro, "ArrowLeft"]
}, Um = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, gn = "Menu", [_t, Vm, qm] = Oa(gn), [gt, Wi] = pt(gn, [
  qm,
  gr,
  Hi
]), vn = gr(), Ui = Hi(), [Vi, nt] = gt(gn), [Xm, xn] = gt(gn), qi = (e) => {
  const { __scopeMenu: t, open: n = !1, children: r, dir: o, onOpenChange: s, modal: c = !0 } = e, i = vn(t), [u, l] = h.useState(null), f = h.useRef(!1), d = Oe(s), m = za(o);
  return h.useEffect(() => {
    const p = () => {
      f.current = !0, document.addEventListener("pointerdown", v, { capture: !0, once: !0 }), document.addEventListener("pointermove", v, { capture: !0, once: !0 });
    }, v = () => f.current = !1;
    return document.addEventListener("keydown", p, { capture: !0 }), () => {
      document.removeEventListener("keydown", p, { capture: !0 }), document.removeEventListener("pointerdown", v, { capture: !0 }), document.removeEventListener("pointermove", v, { capture: !0 });
    };
  }, []), /* @__PURE__ */ a.jsx(Bo, { ...i, children: /* @__PURE__ */ a.jsx(
    Vi,
    {
      scope: t,
      open: n,
      onOpenChange: d,
      content: u,
      onContentChange: l,
      children: /* @__PURE__ */ a.jsx(
        Xm,
        {
          scope: t,
          onClose: h.useCallback(() => d(!1), [d]),
          isUsingKeyboardRef: f,
          dir: m,
          modal: c,
          children: r
        }
      )
    }
  ) });
};
qi.displayName = gn;
var Km = "MenuAnchor", To = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, o = vn(n);
    return /* @__PURE__ */ a.jsx(Go, { ...o, ...r, ref: t });
  }
);
To.displayName = Km;
var Yo = "MenuPortal", [_m, Xi] = gt(Yo, {
  forceMount: void 0
}), Ki = (e) => {
  const { __scopeMenu: t, forceMount: n, children: r, container: o } = e, s = nt(Yo, t);
  return /* @__PURE__ */ a.jsx(_m, { scope: t, forceMount: n, children: /* @__PURE__ */ a.jsx(Be, { present: n || s.open, children: /* @__PURE__ */ a.jsx(cr, { asChild: !0, container: o, children: r }) }) });
};
Ki.displayName = Yo;
var ye = "MenuContent", [$m, Ho] = gt(ye), _i = h.forwardRef(
  (e, t) => {
    const n = Xi(ye, e.__scopeMenu), { forceMount: r = n.forceMount, ...o } = e, s = nt(ye, e.__scopeMenu), c = xn(ye, e.__scopeMenu);
    return /* @__PURE__ */ a.jsx(_t.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ a.jsx(Be, { present: r || s.open, children: /* @__PURE__ */ a.jsx(_t.Slot, { scope: e.__scopeMenu, children: c.modal ? /* @__PURE__ */ a.jsx(eh, { ...o, ref: t }) : /* @__PURE__ */ a.jsx(th, { ...o, ref: t }) }) }) });
  }
), eh = h.forwardRef(
  (e, t) => {
    const n = nt(ye, e.__scopeMenu), r = h.useRef(null), o = ce(t, r);
    return h.useEffect(() => {
      const s = r.current;
      if (s) return Mo(s);
    }, []), /* @__PURE__ */ a.jsx(
      Fo,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        disableOutsideScroll: !0,
        onFocusOutside: U(
          e.onFocusOutside,
          (s) => s.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => n.onOpenChange(!1)
      }
    );
  }
), th = h.forwardRef((e, t) => {
  const n = nt(ye, e.__scopeMenu);
  return /* @__PURE__ */ a.jsx(
    Fo,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1)
    }
  );
}), nh = /* @__PURE__ */ dt("MenuContent.ScrollLock"), Fo = h.forwardRef(
  (e, t) => {
    const {
      __scopeMenu: n,
      loop: r = !1,
      trapFocus: o,
      onOpenAutoFocus: s,
      onCloseAutoFocus: c,
      disableOutsidePointerEvents: i,
      onEntryFocus: u,
      onEscapeKeyDown: l,
      onPointerDownOutside: f,
      onFocusOutside: d,
      onInteractOutside: m,
      onDismiss: p,
      disableOutsideScroll: v,
      ...g
    } = e, x = nt(ye, n), b = xn(ye, n), A = vn(n), w = Ui(n), E = Vm(n), [j, P] = h.useState(null), k = h.useRef(null), M = ce(t, k, x.onContentChange), D = h.useRef(0), Y = h.useRef(""), z = h.useRef(0), Z = h.useRef(null), q = h.useRef("right"), G = h.useRef(0), R = v ? ur : h.Fragment, C = v ? { as: nh, allowPinchZoom: !0 } : void 0, O = (S) => {
      const I = Y.current + S, y = E().filter((J) => !J.disabled), T = document.activeElement, Q = y.find((J) => J.ref.current === T)?.textValue, W = y.map((J) => J.textValue), X = hh(W, I, Q), _ = y.find((J) => J.textValue === X)?.ref.current;
      (function J(oe) {
        Y.current = oe, window.clearTimeout(D.current), oe !== "" && (D.current = window.setTimeout(() => J(""), 1e3));
      })(I), _ && setTimeout(() => _.focus());
    };
    h.useEffect(() => () => window.clearTimeout(D.current), []), Eo();
    const N = h.useCallback((S) => q.current === Z.current?.side && gh(S, Z.current?.area), []);
    return /* @__PURE__ */ a.jsx(
      $m,
      {
        scope: n,
        searchRef: Y,
        onItemEnter: h.useCallback(
          (S) => {
            N(S) && S.preventDefault();
          },
          [N]
        ),
        onItemLeave: h.useCallback(
          (S) => {
            N(S) || (k.current?.focus(), P(null));
          },
          [N]
        ),
        onTriggerLeave: h.useCallback(
          (S) => {
            N(S) && S.preventDefault();
          },
          [N]
        ),
        pointerGraceTimerRef: z,
        onPointerGraceIntentChange: h.useCallback((S) => {
          Z.current = S;
        }, []),
        children: /* @__PURE__ */ a.jsx(R, { ...C, children: /* @__PURE__ */ a.jsx(
          ir,
          {
            asChild: !0,
            trapped: o,
            onMountAutoFocus: U(s, (S) => {
              S.preventDefault(), k.current?.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: c,
            children: /* @__PURE__ */ a.jsx(
              ar,
              {
                asChild: !0,
                disableOutsidePointerEvents: i,
                onEscapeKeyDown: l,
                onPointerDownOutside: f,
                onFocusOutside: d,
                onInteractOutside: m,
                onDismiss: p,
                children: /* @__PURE__ */ a.jsx(
                  Lm,
                  {
                    asChild: !0,
                    ...w,
                    dir: b.dir,
                    orientation: "vertical",
                    loop: r,
                    currentTabStopId: j,
                    onCurrentTabStopIdChange: P,
                    onEntryFocus: U(u, (S) => {
                      b.isUsingKeyboardRef.current || S.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ a.jsx(
                      Gi,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": pc(x.open),
                        "data-radix-menu-content": "",
                        dir: b.dir,
                        ...A,
                        ...g,
                        ref: M,
                        style: { outline: "none", ...g.style },
                        onKeyDown: U(g.onKeyDown, (S) => {
                          const y = S.target.closest("[data-radix-menu-content]") === S.currentTarget, T = S.ctrlKey || S.altKey || S.metaKey, Q = S.key.length === 1;
                          y && (S.key === "Tab" && S.preventDefault(), !T && Q && O(S.key));
                          const W = k.current;
                          if (S.target !== W || !Jm.includes(S.key)) return;
                          S.preventDefault();
                          const _ = E().filter((J) => !J.disabled).map((J) => J.ref.current);
                          Ji.includes(S.key) && _.reverse(), fh(_);
                        }),
                        onBlur: U(e.onBlur, (S) => {
                          S.currentTarget.contains(S.target) || (window.clearTimeout(D.current), Y.current = "");
                        }),
                        onPointerMove: U(
                          e.onPointerMove,
                          $t((S) => {
                            const I = S.target, y = G.current !== S.clientX;
                            if (S.currentTarget.contains(I) && y) {
                              const T = S.clientX > G.current ? "right" : "left";
                              q.current = T, G.current = S.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
_i.displayName = ye;
var rh = "MenuGroup", Lo = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ a.jsx(re.div, { role: "group", ...r, ref: t });
  }
);
Lo.displayName = rh;
var oh = "MenuLabel", $i = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ a.jsx(re.div, { ...r, ref: t });
  }
);
$i.displayName = oh;
var Wn = "MenuItem", Ws = "menu.itemSelect", vr = h.forwardRef(
  (e, t) => {
    const { disabled: n = !1, onSelect: r, ...o } = e, s = h.useRef(null), c = xn(Wn, e.__scopeMenu), i = Ho(Wn, e.__scopeMenu), u = ce(t, s), l = h.useRef(!1), f = () => {
      const d = s.current;
      if (!n && d) {
        const m = new CustomEvent(Ws, { bubbles: !0, cancelable: !0 });
        d.addEventListener(Ws, (p) => r?.(p), { once: !0 }), Pa(d, m), m.defaultPrevented ? l.current = !1 : c.onClose();
      }
    };
    return /* @__PURE__ */ a.jsx(
      ec,
      {
        ...o,
        ref: u,
        disabled: n,
        onClick: U(e.onClick, f),
        onPointerDown: (d) => {
          e.onPointerDown?.(d), l.current = !0;
        },
        onPointerUp: U(e.onPointerUp, (d) => {
          l.current || d.currentTarget?.click();
        }),
        onKeyDown: U(e.onKeyDown, (d) => {
          const m = i.searchRef.current !== "";
          n || m && d.key === " " || ro.includes(d.key) && (d.currentTarget.click(), d.preventDefault());
        })
      }
    );
  }
);
vr.displayName = Wn;
var ec = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, disabled: r = !1, textValue: o, ...s } = e, c = Ho(Wn, n), i = Ui(n), u = h.useRef(null), l = ce(t, u), [f, d] = h.useState(!1), [m, p] = h.useState("");
    return h.useEffect(() => {
      const v = u.current;
      v && p((v.textContent ?? "").trim());
    }, [s.children]), /* @__PURE__ */ a.jsx(
      _t.ItemSlot,
      {
        scope: n,
        disabled: r,
        textValue: o ?? m,
        children: /* @__PURE__ */ a.jsx(Qm, { asChild: !0, ...i, focusable: !r, children: /* @__PURE__ */ a.jsx(
          re.div,
          {
            role: "menuitem",
            "data-highlighted": f ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...s,
            ref: l,
            onPointerMove: U(
              e.onPointerMove,
              $t((v) => {
                r ? c.onItemLeave(v) : (c.onItemEnter(v), v.defaultPrevented || v.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: U(
              e.onPointerLeave,
              $t((v) => c.onItemLeave(v))
            ),
            onFocus: U(e.onFocus, () => d(!0)),
            onBlur: U(e.onBlur, () => d(!1))
          }
        ) })
      }
    );
  }
), sh = "MenuCheckboxItem", tc = h.forwardRef(
  (e, t) => {
    const { checked: n = !1, onCheckedChange: r, ...o } = e;
    return /* @__PURE__ */ a.jsx(ac, { scope: e.__scopeMenu, checked: n, children: /* @__PURE__ */ a.jsx(
      vr,
      {
        role: "menuitemcheckbox",
        "aria-checked": Un(n) ? "mixed" : n,
        ...o,
        ref: t,
        "data-state": Jo(n),
        onSelect: U(
          o.onSelect,
          () => r?.(Un(n) ? !0 : !n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
tc.displayName = sh;
var nc = "MenuRadioGroup", [ah, ih] = gt(
  nc,
  { value: void 0, onValueChange: () => {
  } }
), rc = h.forwardRef(
  (e, t) => {
    const { value: n, onValueChange: r, ...o } = e, s = Oe(r);
    return /* @__PURE__ */ a.jsx(ah, { scope: e.__scopeMenu, value: n, onValueChange: s, children: /* @__PURE__ */ a.jsx(Lo, { ...o, ref: t }) });
  }
);
rc.displayName = nc;
var oc = "MenuRadioItem", sc = h.forwardRef(
  (e, t) => {
    const { value: n, ...r } = e, o = ih(oc, e.__scopeMenu), s = n === o.value;
    return /* @__PURE__ */ a.jsx(ac, { scope: e.__scopeMenu, checked: s, children: /* @__PURE__ */ a.jsx(
      vr,
      {
        role: "menuitemradio",
        "aria-checked": s,
        ...r,
        ref: t,
        "data-state": Jo(s),
        onSelect: U(
          r.onSelect,
          () => o.onValueChange?.(n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
sc.displayName = oc;
var Qo = "MenuItemIndicator", [ac, ch] = gt(
  Qo,
  { checked: !1 }
), ic = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, forceMount: r, ...o } = e, s = ch(Qo, n);
    return /* @__PURE__ */ a.jsx(
      Be,
      {
        present: r || Un(s.checked) || s.checked === !0,
        children: /* @__PURE__ */ a.jsx(
          re.span,
          {
            ...o,
            ref: t,
            "data-state": Jo(s.checked)
          }
        )
      }
    );
  }
);
ic.displayName = Qo;
var lh = "MenuSeparator", cc = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ a.jsx(
      re.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...r,
        ref: t
      }
    );
  }
);
cc.displayName = lh;
var uh = "MenuArrow", lc = h.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, o = vn(n);
    return /* @__PURE__ */ a.jsx(Ti, { ...o, ...r, ref: t });
  }
);
lc.displayName = uh;
var Zo = "MenuSub", [dh, uc] = gt(Zo), dc = (e) => {
  const { __scopeMenu: t, children: n, open: r = !1, onOpenChange: o } = e, s = nt(Zo, t), c = vn(t), [i, u] = h.useState(null), [l, f] = h.useState(null), d = Oe(o);
  return h.useEffect(() => (s.open === !1 && d(!1), () => d(!1)), [s.open, d]), /* @__PURE__ */ a.jsx(Bo, { ...c, children: /* @__PURE__ */ a.jsx(
    Vi,
    {
      scope: t,
      open: r,
      onOpenChange: d,
      content: l,
      onContentChange: f,
      children: /* @__PURE__ */ a.jsx(
        dh,
        {
          scope: t,
          contentId: He(),
          triggerId: He(),
          trigger: i,
          onTriggerChange: u,
          children: n
        }
      )
    }
  ) });
};
dc.displayName = Zo;
var Jt = "MenuSubTrigger", fc = h.forwardRef(
  (e, t) => {
    const n = nt(Jt, e.__scopeMenu), r = xn(Jt, e.__scopeMenu), o = uc(Jt, e.__scopeMenu), s = Ho(Jt, e.__scopeMenu), c = h.useRef(null), { pointerGraceTimerRef: i, onPointerGraceIntentChange: u } = s, l = { __scopeMenu: e.__scopeMenu }, f = h.useCallback(() => {
      c.current && window.clearTimeout(c.current), c.current = null;
    }, []);
    return h.useEffect(() => f, [f]), h.useEffect(() => {
      const d = i.current;
      return () => {
        window.clearTimeout(d), u(null);
      };
    }, [i, u]), /* @__PURE__ */ a.jsx(To, { asChild: !0, ...l, children: /* @__PURE__ */ a.jsx(
      ec,
      {
        id: o.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": n.open,
        "aria-controls": o.contentId,
        "data-state": pc(n.open),
        ...e,
        ref: sr(t, o.onTriggerChange),
        onClick: (d) => {
          e.onClick?.(d), !(e.disabled || d.defaultPrevented) && (d.currentTarget.focus(), n.open || n.onOpenChange(!0));
        },
        onPointerMove: U(
          e.onPointerMove,
          $t((d) => {
            s.onItemEnter(d), !d.defaultPrevented && !e.disabled && !n.open && !c.current && (s.onPointerGraceIntentChange(null), c.current = window.setTimeout(() => {
              n.onOpenChange(!0), f();
            }, 100));
          })
        ),
        onPointerLeave: U(
          e.onPointerLeave,
          $t((d) => {
            f();
            const m = n.content?.getBoundingClientRect();
            if (m) {
              const p = n.content?.dataset.side, v = p === "right", g = v ? -5 : 5, x = m[v ? "left" : "right"], b = m[v ? "right" : "left"];
              s.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: d.clientX + g, y: d.clientY },
                  { x, y: m.top },
                  { x: b, y: m.top },
                  { x: b, y: m.bottom },
                  { x, y: m.bottom }
                ],
                side: p
              }), window.clearTimeout(i.current), i.current = window.setTimeout(
                () => s.onPointerGraceIntentChange(null),
                300
              );
            } else {
              if (s.onTriggerLeave(d), d.defaultPrevented) return;
              s.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: U(e.onKeyDown, (d) => {
          const m = s.searchRef.current !== "";
          e.disabled || m && d.key === " " || Wm[r.dir].includes(d.key) && (n.onOpenChange(!0), n.content?.focus(), d.preventDefault());
        })
      }
    ) });
  }
);
fc.displayName = Jt;
var mc = "MenuSubContent", hc = h.forwardRef(
  (e, t) => {
    const n = Xi(ye, e.__scopeMenu), { forceMount: r = n.forceMount, ...o } = e, s = nt(ye, e.__scopeMenu), c = xn(ye, e.__scopeMenu), i = uc(mc, e.__scopeMenu), u = h.useRef(null), l = ce(t, u);
    return /* @__PURE__ */ a.jsx(_t.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ a.jsx(Be, { present: r || s.open, children: /* @__PURE__ */ a.jsx(_t.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ a.jsx(
      Fo,
      {
        id: i.contentId,
        "aria-labelledby": i.triggerId,
        ...o,
        ref: l,
        align: "start",
        side: c.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        trapFocus: !1,
        onOpenAutoFocus: (f) => {
          c.isUsingKeyboardRef.current && u.current?.focus(), f.preventDefault();
        },
        onCloseAutoFocus: (f) => f.preventDefault(),
        onFocusOutside: U(e.onFocusOutside, (f) => {
          f.target !== i.trigger && s.onOpenChange(!1);
        }),
        onEscapeKeyDown: U(e.onEscapeKeyDown, (f) => {
          c.onClose(), f.preventDefault();
        }),
        onKeyDown: U(e.onKeyDown, (f) => {
          const d = f.currentTarget.contains(f.target), m = Um[c.dir].includes(f.key);
          d && m && (s.onOpenChange(!1), i.trigger?.focus(), f.preventDefault());
        })
      }
    ) }) }) });
  }
);
hc.displayName = mc;
function pc(e) {
  return e ? "open" : "closed";
}
function Un(e) {
  return e === "indeterminate";
}
function Jo(e) {
  return Un(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function fh(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function mh(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
function hh(e, t, n) {
  const o = t.length > 1 && Array.from(t).every((l) => l === t[0]) ? t[0] : t, s = n ? e.indexOf(n) : -1;
  let c = mh(e, Math.max(s, 0));
  o.length === 1 && (c = c.filter((l) => l !== n));
  const u = c.find(
    (l) => l.toLowerCase().startsWith(o.toLowerCase())
  );
  return u !== n ? u : void 0;
}
function ph(e, t) {
  const { x: n, y: r } = e;
  let o = !1;
  for (let s = 0, c = t.length - 1; s < t.length; c = s++) {
    const i = t[s], u = t[c], l = i.x, f = i.y, d = u.x, m = u.y;
    f > r != m > r && n < (d - l) * (r - f) / (m - f) + l && (o = !o);
  }
  return o;
}
function gh(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return ph(n, t);
}
function $t(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var vh = qi, xh = To, bh = Ki, wh = _i, Ah = Lo, yh = $i, Eh = vr, Mh = tc, Ch = rc, jh = sc, Nh = ic, Ih = cc, Sh = lc, Dh = dc, kh = fc, Rh = hc, xr = "DropdownMenu", [Ph] = pt(
  xr,
  [Wi]
), de = Wi(), [Oh, gc] = Ph(xr), vc = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: r,
    open: o,
    defaultOpen: s,
    onOpenChange: c,
    modal: i = !0
  } = e, u = de(t), l = h.useRef(null), [f, d] = fn({
    prop: o,
    defaultProp: s ?? !1,
    onChange: c,
    caller: xr
  });
  return /* @__PURE__ */ a.jsx(
    Oh,
    {
      scope: t,
      triggerId: He(),
      triggerRef: l,
      contentId: He(),
      open: f,
      onOpenChange: d,
      onOpenToggle: h.useCallback(() => d((m) => !m), [d]),
      modal: i,
      children: /* @__PURE__ */ a.jsx(vh, { ...u, open: f, onOpenChange: d, dir: r, modal: i, children: n })
    }
  );
};
vc.displayName = xr;
var xc = "DropdownMenuTrigger", bc = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, disabled: r = !1, ...o } = e, s = gc(xc, n), c = de(n);
    return /* @__PURE__ */ a.jsx(xh, { asChild: !0, ...c, children: /* @__PURE__ */ a.jsx(
      re.button,
      {
        type: "button",
        id: s.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": s.open,
        "aria-controls": s.open ? s.contentId : void 0,
        "data-state": s.open ? "open" : "closed",
        "data-disabled": r ? "" : void 0,
        disabled: r,
        ...o,
        ref: sr(t, s.triggerRef),
        onPointerDown: U(e.onPointerDown, (i) => {
          !r && i.button === 0 && i.ctrlKey === !1 && (s.onOpenToggle(), s.open || i.preventDefault());
        }),
        onKeyDown: U(e.onKeyDown, (i) => {
          r || (["Enter", " "].includes(i.key) && s.onOpenToggle(), i.key === "ArrowDown" && s.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(i.key) && i.preventDefault());
        })
      }
    ) });
  }
);
bc.displayName = xc;
var zh = "DropdownMenuPortal", wc = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e, r = de(t);
  return /* @__PURE__ */ a.jsx(bh, { ...r, ...n });
};
wc.displayName = zh;
var Ac = "DropdownMenuContent", yc = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = gc(Ac, n), s = de(n), c = h.useRef(!1);
    return /* @__PURE__ */ a.jsx(
      wh,
      {
        id: o.contentId,
        "aria-labelledby": o.triggerId,
        ...s,
        ...r,
        ref: t,
        onCloseAutoFocus: U(e.onCloseAutoFocus, (i) => {
          c.current || o.triggerRef.current?.focus(), c.current = !1, i.preventDefault();
        }),
        onInteractOutside: U(e.onInteractOutside, (i) => {
          const u = i.detail.originalEvent, l = u.button === 0 && u.ctrlKey === !0, f = u.button === 2 || l;
          (!o.modal || f) && (c.current = !0);
        }),
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    );
  }
);
yc.displayName = Ac;
var Bh = "DropdownMenuGroup", Ec = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
    return /* @__PURE__ */ a.jsx(Ah, { ...o, ...r, ref: t });
  }
);
Ec.displayName = Bh;
var Gh = "DropdownMenuLabel", Mc = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
    return /* @__PURE__ */ a.jsx(yh, { ...o, ...r, ref: t });
  }
);
Mc.displayName = Gh;
var Th = "DropdownMenuItem", Cc = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
    return /* @__PURE__ */ a.jsx(Eh, { ...o, ...r, ref: t });
  }
);
Cc.displayName = Th;
var Yh = "DropdownMenuCheckboxItem", jc = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
  return /* @__PURE__ */ a.jsx(Mh, { ...o, ...r, ref: t });
});
jc.displayName = Yh;
var Hh = "DropdownMenuRadioGroup", Nc = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
  return /* @__PURE__ */ a.jsx(Ch, { ...o, ...r, ref: t });
});
Nc.displayName = Hh;
var Fh = "DropdownMenuRadioItem", Ic = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
  return /* @__PURE__ */ a.jsx(jh, { ...o, ...r, ref: t });
});
Ic.displayName = Fh;
var Lh = "DropdownMenuItemIndicator", Sc = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
  return /* @__PURE__ */ a.jsx(Nh, { ...o, ...r, ref: t });
});
Sc.displayName = Lh;
var Qh = "DropdownMenuSeparator", Dc = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
  return /* @__PURE__ */ a.jsx(Ih, { ...o, ...r, ref: t });
});
Dc.displayName = Qh;
var Zh = "DropdownMenuArrow", Jh = h.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
    return /* @__PURE__ */ a.jsx(Sh, { ...o, ...r, ref: t });
  }
);
Jh.displayName = Zh;
var Wh = (e) => {
  const { __scopeDropdownMenu: t, children: n, open: r, onOpenChange: o, defaultOpen: s } = e, c = de(t), [i, u] = fn({
    prop: r,
    defaultProp: s ?? !1,
    onChange: o,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ a.jsx(Dh, { ...c, open: i, onOpenChange: u, children: n });
}, Uh = "DropdownMenuSubTrigger", kc = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
  return /* @__PURE__ */ a.jsx(kh, { ...o, ...r, ref: t });
});
kc.displayName = Uh;
var Vh = "DropdownMenuSubContent", Rc = h.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, o = de(n);
  return /* @__PURE__ */ a.jsx(
    Rh,
    {
      ...o,
      ...r,
      ref: t,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
Rc.displayName = Vh;
var qh = vc, Xh = bc, Pc = wc, Kh = yc, _h = Ec, $h = Mc, ep = Cc, tp = jc, np = Nc, rp = Ic, Oc = Sc, op = Dc, sp = Wh, ap = kc, ip = Rc, cp = "Label", zc = h.forwardRef((e, t) => /* @__PURE__ */ a.jsx(
  re.label,
  {
    ...e,
    ref: t,
    onMouseDown: (n) => {
      n.target.closest("button, input, select, textarea") || (e.onMouseDown?.(n), !n.defaultPrevented && n.detail > 1 && n.preventDefault());
    }
  }
));
zc.displayName = cp;
var lp = zc, br = "Popover", [Bc] = pt(br, [
  gr
]), bn = gr(), [up, rt] = Bc(br), Gc = (e) => {
  const {
    __scopePopover: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: s,
    modal: c = !1
  } = e, i = bn(t), u = h.useRef(null), [l, f] = h.useState(!1), [d, m] = fn({
    prop: r,
    defaultProp: o ?? !1,
    onChange: s,
    caller: br
  });
  return /* @__PURE__ */ a.jsx(Bo, { ...i, children: /* @__PURE__ */ a.jsx(
    up,
    {
      scope: t,
      contentId: He(),
      triggerRef: u,
      open: d,
      onOpenChange: m,
      onOpenToggle: h.useCallback(() => m((p) => !p), [m]),
      hasCustomAnchor: l,
      onCustomAnchorAdd: h.useCallback(() => f(!0), []),
      onCustomAnchorRemove: h.useCallback(() => f(!1), []),
      modal: c,
      children: n
    }
  ) });
};
Gc.displayName = br;
var Tc = "PopoverAnchor", dp = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = rt(Tc, n), s = bn(n), { onCustomAnchorAdd: c, onCustomAnchorRemove: i } = o;
    return h.useEffect(() => (c(), () => i()), [c, i]), /* @__PURE__ */ a.jsx(Go, { ...s, ...r, ref: t });
  }
);
dp.displayName = Tc;
var Yc = "PopoverTrigger", Hc = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = rt(Yc, n), s = bn(n), c = ce(t, o.triggerRef), i = /* @__PURE__ */ a.jsx(
      re.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Jc(o.open),
        ...r,
        ref: c,
        onClick: U(e.onClick, o.onOpenToggle)
      }
    );
    return o.hasCustomAnchor ? i : /* @__PURE__ */ a.jsx(Go, { asChild: !0, ...s, children: i });
  }
);
Hc.displayName = Yc;
var Wo = "PopoverPortal", [fp, mp] = Bc(Wo, {
  forceMount: void 0
}), Fc = (e) => {
  const { __scopePopover: t, forceMount: n, children: r, container: o } = e, s = rt(Wo, t);
  return /* @__PURE__ */ a.jsx(fp, { scope: t, forceMount: n, children: /* @__PURE__ */ a.jsx(Be, { present: n || s.open, children: /* @__PURE__ */ a.jsx(cr, { asChild: !0, container: o, children: r }) }) });
};
Fc.displayName = Wo;
var kt = "PopoverContent", Lc = h.forwardRef(
  (e, t) => {
    const n = mp(kt, e.__scopePopover), { forceMount: r = n.forceMount, ...o } = e, s = rt(kt, e.__scopePopover);
    return /* @__PURE__ */ a.jsx(Be, { present: r || s.open, children: s.modal ? /* @__PURE__ */ a.jsx(pp, { ...o, ref: t }) : /* @__PURE__ */ a.jsx(gp, { ...o, ref: t }) });
  }
);
Lc.displayName = kt;
var hp = /* @__PURE__ */ dt("PopoverContent.RemoveScroll"), pp = h.forwardRef(
  (e, t) => {
    const n = rt(kt, e.__scopePopover), r = h.useRef(null), o = ce(t, r), s = h.useRef(!1);
    return h.useEffect(() => {
      const c = r.current;
      if (c) return Mo(c);
    }, []), /* @__PURE__ */ a.jsx(ur, { as: hp, allowPinchZoom: !0, children: /* @__PURE__ */ a.jsx(
      Qc,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: U(e.onCloseAutoFocus, (c) => {
          c.preventDefault(), s.current || n.triggerRef.current?.focus();
        }),
        onPointerDownOutside: U(
          e.onPointerDownOutside,
          (c) => {
            const i = c.detail.originalEvent, u = i.button === 0 && i.ctrlKey === !0, l = i.button === 2 || u;
            s.current = l;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: U(
          e.onFocusOutside,
          (c) => c.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
), gp = h.forwardRef(
  (e, t) => {
    const n = rt(kt, e.__scopePopover), r = h.useRef(!1), o = h.useRef(!1);
    return /* @__PURE__ */ a.jsx(
      Qc,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (s) => {
          e.onCloseAutoFocus?.(s), s.defaultPrevented || (r.current || n.triggerRef.current?.focus(), s.preventDefault()), r.current = !1, o.current = !1;
        },
        onInteractOutside: (s) => {
          e.onInteractOutside?.(s), s.defaultPrevented || (r.current = !0, s.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const c = s.target;
          n.triggerRef.current?.contains(c) && s.preventDefault(), s.detail.originalEvent.type === "focusin" && o.current && s.preventDefault();
        }
      }
    );
  }
), Qc = h.forwardRef(
  (e, t) => {
    const {
      __scopePopover: n,
      trapFocus: r,
      onOpenAutoFocus: o,
      onCloseAutoFocus: s,
      disableOutsidePointerEvents: c,
      onEscapeKeyDown: i,
      onPointerDownOutside: u,
      onFocusOutside: l,
      onInteractOutside: f,
      ...d
    } = e, m = rt(kt, n), p = bn(n);
    return Eo(), /* @__PURE__ */ a.jsx(
      ir,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: o,
        onUnmountAutoFocus: s,
        children: /* @__PURE__ */ a.jsx(
          ar,
          {
            asChild: !0,
            disableOutsidePointerEvents: c,
            onInteractOutside: f,
            onEscapeKeyDown: i,
            onPointerDownOutside: u,
            onFocusOutside: l,
            onDismiss: () => m.onOpenChange(!1),
            children: /* @__PURE__ */ a.jsx(
              Gi,
              {
                "data-state": Jc(m.open),
                role: "dialog",
                id: m.contentId,
                ...p,
                ...d,
                ref: t,
                style: {
                  ...d.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }
), Zc = "PopoverClose", vp = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = rt(Zc, n);
    return /* @__PURE__ */ a.jsx(
      re.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: U(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
vp.displayName = Zc;
var xp = "PopoverArrow", bp = h.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, o = bn(n);
    return /* @__PURE__ */ a.jsx(Ti, { ...o, ...r, ref: t });
  }
);
bp.displayName = xp;
function Jc(e) {
  return e ? "open" : "closed";
}
var Wc = Gc, Uc = Hc, Vc = Fc, qc = Lc, wp = "Separator", Us = "horizontal", Ap = ["horizontal", "vertical"], Xc = h.forwardRef((e, t) => {
  const { decorative: n, orientation: r = Us, ...o } = e, s = yp(r) ? r : Us, i = n ? { role: "none" } : { "aria-orientation": s === "vertical" ? s : void 0, role: "separator" };
  return /* @__PURE__ */ a.jsx(
    re.div,
    {
      "data-orientation": s,
      ...i,
      ...o,
      ref: t
    }
  );
});
Xc.displayName = wp;
function yp(e) {
  return Ap.includes(e);
}
var Ep = Xc;
const Mp = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let r = 0; r < e.length; r++)
    n[r] = e[r];
  for (let r = 0; r < t.length; r++)
    n[e.length + r] = t[r];
  return n;
}, Cp = (e, t) => ({
  classGroupId: e,
  validator: t
}), Kc = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), Vn = "-", Vs = [], jp = "arbitrary..", Np = (e) => {
  const t = Sp(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (c) => {
      if (c.startsWith("[") && c.endsWith("]"))
        return Ip(c);
      const i = c.split(Vn), u = i[0] === "" && i.length > 1 ? 1 : 0;
      return _c(i, u, t);
    },
    getConflictingClassGroupIds: (c, i) => {
      if (i) {
        const u = r[c], l = n[c];
        return u ? l ? Mp(l, u) : u : l || Vs;
      }
      return n[c] || Vs;
    }
  };
}, _c = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const o = e[t], s = n.nextPart.get(o);
  if (s) {
    const l = _c(e, t + 1, s);
    if (l) return l;
  }
  const c = n.validators;
  if (c === null)
    return;
  const i = t === 0 ? e.join(Vn) : e.slice(t).join(Vn), u = c.length;
  for (let l = 0; l < u; l++) {
    const f = c[l];
    if (f.validator(i))
      return f.classGroupId;
  }
}, Ip = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
  return r ? jp + r : void 0;
})(), Sp = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return Dp(n, t);
}, Dp = (e, t) => {
  const n = Kc();
  for (const r in e) {
    const o = e[r];
    Uo(o, n, r, t);
  }
  return n;
}, Uo = (e, t, n, r) => {
  const o = e.length;
  for (let s = 0; s < o; s++) {
    const c = e[s];
    kp(c, t, n, r);
  }
}, kp = (e, t, n, r) => {
  if (typeof e == "string") {
    Rp(e, t, n);
    return;
  }
  if (typeof e == "function") {
    Pp(e, t, n, r);
    return;
  }
  Op(e, t, n, r);
}, Rp = (e, t, n) => {
  const r = e === "" ? t : $c(t, e);
  r.classGroupId = n;
}, Pp = (e, t, n, r) => {
  if (zp(e)) {
    Uo(e(r), t, n, r);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(Cp(n, e));
}, Op = (e, t, n, r) => {
  const o = Object.entries(e), s = o.length;
  for (let c = 0; c < s; c++) {
    const [i, u] = o[c];
    Uo(u, $c(t, i), n, r);
  }
}, $c = (e, t) => {
  let n = e;
  const r = t.split(Vn), o = r.length;
  for (let s = 0; s < o; s++) {
    const c = r[s];
    let i = n.nextPart.get(c);
    i || (i = Kc(), n.nextPart.set(c, i)), n = i;
  }
  return n;
}, zp = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Bp = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const o = (s, c) => {
    n[s] = c, t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(s) {
      let c = n[s];
      if (c !== void 0)
        return c;
      if ((c = r[s]) !== void 0)
        return o(s, c), c;
    },
    set(s, c) {
      s in n ? n[s] = c : o(s, c);
    }
  };
}, oo = "!", qs = ":", Gp = [], Xs = (e, t, n, r, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: r,
  isExternal: o
}), Tp = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: n
  } = e;
  let r = (o) => {
    const s = [];
    let c = 0, i = 0, u = 0, l;
    const f = o.length;
    for (let g = 0; g < f; g++) {
      const x = o[g];
      if (c === 0 && i === 0) {
        if (x === qs) {
          s.push(o.slice(u, g)), u = g + 1;
          continue;
        }
        if (x === "/") {
          l = g;
          continue;
        }
      }
      x === "[" ? c++ : x === "]" ? c-- : x === "(" ? i++ : x === ")" && i--;
    }
    const d = s.length === 0 ? o : o.slice(u);
    let m = d, p = !1;
    d.endsWith(oo) ? (m = d.slice(0, -1), p = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      d.startsWith(oo) && (m = d.slice(1), p = !0)
    );
    const v = l && l > u ? l - u : void 0;
    return Xs(s, p, m, v);
  };
  if (t) {
    const o = t + qs, s = r;
    r = (c) => c.startsWith(o) ? s(c.slice(o.length)) : Xs(Gp, !1, c, void 0, !0);
  }
  if (n) {
    const o = r;
    r = (s) => n({
      className: s,
      parseClassName: o
    });
  }
  return r;
}, Yp = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, r) => {
    t.set(n, 1e6 + r);
  }), (n) => {
    const r = [];
    let o = [];
    for (let s = 0; s < n.length; s++) {
      const c = n[s], i = c[0] === "[", u = t.has(c);
      i || u ? (o.length > 0 && (o.sort(), r.push(...o), o = []), r.push(c)) : o.push(c);
    }
    return o.length > 0 && (o.sort(), r.push(...o)), r;
  };
}, Hp = (e) => ({
  cache: Bp(e.cacheSize),
  parseClassName: Tp(e),
  sortModifiers: Yp(e),
  ...Np(e)
}), Fp = /\s+/, Lp = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: o,
    sortModifiers: s
  } = t, c = [], i = e.trim().split(Fp);
  let u = "";
  for (let l = i.length - 1; l >= 0; l -= 1) {
    const f = i[l], {
      isExternal: d,
      modifiers: m,
      hasImportantModifier: p,
      baseClassName: v,
      maybePostfixModifierPosition: g
    } = n(f);
    if (d) {
      u = f + (u.length > 0 ? " " + u : u);
      continue;
    }
    let x = !!g, b = r(x ? v.substring(0, g) : v);
    if (!b) {
      if (!x) {
        u = f + (u.length > 0 ? " " + u : u);
        continue;
      }
      if (b = r(v), !b) {
        u = f + (u.length > 0 ? " " + u : u);
        continue;
      }
      x = !1;
    }
    const A = m.length === 0 ? "" : m.length === 1 ? m[0] : s(m).join(":"), w = p ? A + oo : A, E = w + b;
    if (c.indexOf(E) > -1)
      continue;
    c.push(E);
    const j = o(b, x);
    for (let P = 0; P < j.length; ++P) {
      const k = j[P];
      c.push(w + k);
    }
    u = f + (u.length > 0 ? " " + u : u);
  }
  return u;
}, Qp = (...e) => {
  let t = 0, n, r, o = "";
  for (; t < e.length; )
    (n = e[t++]) && (r = el(n)) && (o && (o += " "), o += r);
  return o;
}, el = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = el(e[r])) && (n && (n += " "), n += t);
  return n;
}, Zp = (e, ...t) => {
  let n, r, o, s;
  const c = (u) => {
    const l = t.reduce((f, d) => d(f), e());
    return n = Hp(l), r = n.cache.get, o = n.cache.set, s = i, i(u);
  }, i = (u) => {
    const l = r(u);
    if (l)
      return l;
    const f = Lp(u, n);
    return o(u, f), f;
  };
  return s = c, (...u) => s(Qp(...u));
}, Jp = [], ie = (e) => {
  const t = (n) => n[e] || Jp;
  return t.isThemeGetter = !0, t;
}, tl = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, nl = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Wp = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Up = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Vp = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, qp = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Xp = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Kp = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ze = (e) => Wp.test(e), K = (e) => !!e && !Number.isNaN(Number(e)), Je = (e) => !!e && Number.isInteger(Number(e)), Yr = (e) => e.endsWith("%") && K(e.slice(0, -1)), Te = (e) => Up.test(e), rl = () => !0, _p = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Vp.test(e) && !qp.test(e)
), Vo = () => !1, $p = (e) => Xp.test(e), eg = (e) => Kp.test(e), tg = (e) => !F(e) && !L(e), ng = (e) => ot(e, al, Vo), F = (e) => tl.test(e), at = (e) => ot(e, il, _p), Ks = (e) => ot(e, ug, K), rg = (e) => ot(e, ll, rl), og = (e) => ot(e, cl, Vo), _s = (e) => ot(e, ol, Vo), sg = (e) => ot(e, sl, eg), Dn = (e) => ot(e, ul, $p), L = (e) => nl.test(e), Ft = (e) => vt(e, il), ag = (e) => vt(e, cl), $s = (e) => vt(e, ol), ig = (e) => vt(e, al), cg = (e) => vt(e, sl), kn = (e) => vt(e, ul, !0), lg = (e) => vt(e, ll, !0), ot = (e, t, n) => {
  const r = tl.exec(e);
  return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, vt = (e, t, n = !1) => {
  const r = nl.exec(e);
  return r ? r[1] ? t(r[1]) : n : !1;
}, ol = (e) => e === "position" || e === "percentage", sl = (e) => e === "image" || e === "url", al = (e) => e === "length" || e === "size" || e === "bg-size", il = (e) => e === "length", ug = (e) => e === "number", cl = (e) => e === "family-name", ll = (e) => e === "number" || e === "weight", ul = (e) => e === "shadow", dg = () => {
  const e = ie("color"), t = ie("font"), n = ie("text"), r = ie("font-weight"), o = ie("tracking"), s = ie("leading"), c = ie("breakpoint"), i = ie("container"), u = ie("spacing"), l = ie("radius"), f = ie("shadow"), d = ie("inset-shadow"), m = ie("text-shadow"), p = ie("drop-shadow"), v = ie("blur"), g = ie("perspective"), x = ie("aspect"), b = ie("ease"), A = ie("animate"), w = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], E = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], j = () => [...E(), L, F], P = () => ["auto", "hidden", "clip", "visible", "scroll"], k = () => ["auto", "contain", "none"], M = () => [L, F, u], D = () => [Ze, "full", "auto", ...M()], Y = () => [Je, "none", "subgrid", L, F], z = () => ["auto", {
    span: ["full", Je, L, F]
  }, Je, L, F], Z = () => [Je, "auto", L, F], q = () => ["auto", "min", "max", "fr", L, F], G = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], R = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], C = () => ["auto", ...M()], O = () => [Ze, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...M()], N = () => [Ze, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...M()], S = () => [Ze, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...M()], I = () => [e, L, F], y = () => [...E(), $s, _s, {
    position: [L, F]
  }], T = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Q = () => ["auto", "cover", "contain", ig, ng, {
    size: [L, F]
  }], W = () => [Yr, Ft, at], X = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    l,
    L,
    F
  ], _ = () => ["", K, Ft, at], J = () => ["solid", "dashed", "dotted", "double"], oe = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ee = () => [K, Yr, $s, _s], ne = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    v,
    L,
    F
  ], le = () => ["none", K, L, F], he = () => ["none", K, L, F], ue = () => [K, L, F], Tt = () => [Ze, "full", ...M()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Te],
      breakpoint: [Te],
      color: [rl],
      container: [Te],
      "drop-shadow": [Te],
      ease: ["in", "out", "in-out"],
      font: [tg],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Te],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Te],
      shadow: [Te],
      spacing: ["px", K],
      text: [Te],
      "text-shadow": [Te],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", Ze, F, L, x]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [K, F, L, i]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": w()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": w()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: j()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: P()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": P()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": P()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: k()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": k()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": k()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: D()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": D()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": D()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": D(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: D()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": D(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: D()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": D()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": D()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: D()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: D()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: D()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: D()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [Je, "auto", L, F]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Ze, "full", "auto", i, ...M()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [K, Ze, "auto", "initial", "none", F]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", K, L, F]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", K, L, F]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Je, "first", "last", "none", L, F]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": Y()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: z()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": Z()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": Z()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": Y()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: z()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": Z()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": Z()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": q()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": q()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: M()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": M()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": M()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...G(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...R(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...R()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...G()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...R(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...R(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": G()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...R(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...R()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: M()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: M()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: M()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: M()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: M()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: M()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: M()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: M()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: M()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: M()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: M()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: C()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: C()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: C()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: C()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: C()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: C()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: C()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: C()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: C()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: C()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: C()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": M()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": M()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: O()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...N()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...N()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...N()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...S()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...S()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...S()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [i, "screen", ...O()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          i,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...O()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          i,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [c]
          },
          ...O()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...O()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...O()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...O()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, Ft, at]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [r, lg, rg]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Yr, F]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [ag, og, t]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [F]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [o, L, F]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [K, "none", L, Ks]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          s,
          ...M()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", L, F]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", L, F]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: I()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: I()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...J(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [K, "from-font", "auto", L, at]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: I()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [K, "auto", L, F]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: M()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", L, F]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", L, F]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: y()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: T()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Q()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Je, L, F],
          radial: ["", L, F],
          conic: [Je, L, F]
        }, cg, sg]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: I()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: W()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: W()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: W()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: I()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: I()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: I()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: X()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": X()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": X()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": X()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": X()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": X()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": X()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": X()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": X()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": X()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": X()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": X()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": X()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": X()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": X()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: _()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": _()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": _()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": _()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": _()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": _()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": _()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": _()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": _()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": _()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": _()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": _()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": _()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...J(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...J(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: I()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": I()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": I()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": I()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": I()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": I()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": I()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": I()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": I()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": I()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": I()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: I()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...J(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [K, L, F]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", K, Ft, at]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: I()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          f,
          kn,
          Dn
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: I()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", d, kn, Dn]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": I()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: _()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: I()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [K, at]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": I()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": _()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": I()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", m, kn, Dn]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": I()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [K, L, F]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...oe(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": oe()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [K]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ee()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ee()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": I()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": I()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ee()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ee()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": I()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": I()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ee()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ee()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": I()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": I()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ee()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ee()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": I()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": I()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ee()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ee()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": I()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": I()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ee()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ee()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": I()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": I()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ee()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ee()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": I()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": I()
      }],
      "mask-image-radial": [{
        "mask-radial": [L, F]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ee()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ee()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": I()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": I()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": E()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [K]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ee()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ee()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": I()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": I()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: y()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: T()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Q()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", L, F]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          L,
          F
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: ne()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [K, L, F]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [K, L, F]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          p,
          kn,
          Dn
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": I()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", K, L, F]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [K, L, F]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", K, L, F]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [K, L, F]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", K, L, F]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          L,
          F
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": ne()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [K, L, F]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [K, L, F]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", K, L, F]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [K, L, F]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", K, L, F]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [K, L, F]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [K, L, F]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", K, L, F]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": M()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": M()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": M()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", L, F]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [K, "initial", L, F]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", b, L, F]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [K, L, F]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", A, L, F]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [g, L, F]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": j()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: le()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": le()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": le()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": le()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: he()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": he()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": he()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": he()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: ue()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ue()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ue()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [L, F, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: j()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: Tt()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Tt()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Tt()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Tt()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: I()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: I()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", L, F]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": M()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": M()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": M()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": M()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": M()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": M()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": M()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": M()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": M()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": M()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": M()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": M()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": M()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": M()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": M()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": M()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": M()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": M()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": M()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": M()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": M()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": M()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", L, F]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...I()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [K, Ft, at, Ks]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...I()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, fg = /* @__PURE__ */ Zp(dg);
function H(...e) {
  return fg(Ra(e));
}
const mg = Qu(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function te({
  className: e,
  variant: t = "default",
  size: n = "default",
  asChild: r = !1,
  ...o
}) {
  const s = r ? Zu : "button";
  return /* @__PURE__ */ a.jsx(
    s,
    {
      "data-slot": "button",
      "data-variant": t,
      "data-size": n,
      className: H(mg({ variant: t, size: n, className: e })),
      ...o
    }
  );
}
function dl({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "card",
      className: H(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        e
      ),
      ...t
    }
  );
}
function fl({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: H(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        e
      ),
      ...t
    }
  );
}
function ml({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: H("leading-none font-semibold", e),
      ...t
    }
  );
}
function hg({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: H("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function Fb({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "card-action",
      className: H(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        e
      ),
      ...t
    }
  );
}
function hl({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: H("px-6", e),
      ...t
    }
  );
}
function Lb({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: H("flex items-center px-6 [.border-t]:pt-6", e),
      ...t
    }
  );
}
function lt({ className: e, type: t, ...n }) {
  return /* @__PURE__ */ a.jsx(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: H(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        e
      ),
      ...n
    }
  );
}
function Ct({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    lp,
    {
      "data-slot": "label",
      className: H(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        e
      ),
      ...t
    }
  );
}
function pg({
  className: e,
  orientation: t = "horizontal",
  decorative: n = !0,
  ...r
}) {
  return /* @__PURE__ */ a.jsx(
    Ep,
    {
      "data-slot": "separator",
      decorative: n,
      orientation: t,
      className: H(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        e
      ),
      ...r
    }
  );
}
const pl = (...e) => e.filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n).join(" ").trim();
const gg = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const vg = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
const ea = (e) => {
  const t = vg(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
var Hr = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const xg = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
}, bg = dn({}), wg = () => Pt(bg), Ag = or(
  ({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: o = "", children: s, iconNode: c, ...i }, u) => {
    const {
      size: l = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: d = !1,
      color: m = "currentColor",
      className: p = ""
    } = wg() ?? {}, v = r ?? d ? Number(n ?? f) * 24 / Number(t ?? l) : n ?? f;
    return Xr(
      "svg",
      {
        ref: u,
        ...Hr,
        width: t ?? l ?? Hr.width,
        height: t ?? l ?? Hr.height,
        stroke: e ?? m,
        strokeWidth: v,
        className: pl("lucide", p, o),
        ...!s && !xg(i) && { "aria-hidden": "true" },
        ...i
      },
      [
        ...c.map(([g, x]) => Xr(g, x)),
        ...Array.isArray(s) ? s : [s]
      ]
    );
  }
);
const ae = (e, t) => {
  const n = or(
    ({ className: r, ...o }, s) => Xr(Ag, {
      ref: s,
      iconNode: t,
      className: pl(
        `lucide-${gg(ea(e))}`,
        `lucide-${e}`,
        r
      ),
      ...o
    })
  );
  return n.displayName = ea(e), n;
};
const yg = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], gl = ae("check", yg);
const Eg = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], vl = ae("chevron-down", Eg);
const Mg = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], Cg = ae("chevron-left", Mg);
const jg = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], jt = ae("chevron-right", jg);
const Ng = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], so = ae("chevron-up", Ng);
const Ig = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], Sg = ae("circle-alert", Ig);
const Dg = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], kg = ae("circle-check", Dg);
const Rg = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]], Pg = ae("circle", Rg);
const Og = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
], zg = ae("clipboard-list", Og);
const Bg = [
  ["path", { d: "m15 15 6 6", key: "1s409w" }],
  ["path", { d: "m15 9 6-6", key: "ko1vev" }],
  ["path", { d: "M21 16v5h-5", key: "1ck2sf" }],
  ["path", { d: "M21 8V3h-5", key: "1qoq8a" }],
  ["path", { d: "M3 16v5h5", key: "1t08am" }],
  ["path", { d: "m3 21 6-6", key: "wwnumi" }],
  ["path", { d: "M3 8V3h5", key: "1ln10m" }],
  ["path", { d: "M9 9 3 3", key: "v551iv" }]
], ta = ae("expand", Bg);
const Gg = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
], Tg = ae("info", Gg);
const Yg = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], xl = ae("loader-circle", Yg);
const Hg = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
], ao = ae("monitor", Hg);
const Fg = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], qn = ae("moon", Fg);
const Lg = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
], na = ae("panel-right", Lg);
const Qg = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
], Zg = ae("save", Qg);
const Jg = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], Wg = ae("search", Jg);
const Ug = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
], Vg = ae("sliders-horizontal", Ug);
const qg = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], Xn = ae("sun", qg);
const Xg = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], qo = ae("x", Xg);
function bl({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(li, { "data-slot": "dialog", ...e });
}
function Qb({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(ui, { "data-slot": "dialog-trigger", ...e });
}
function Kg({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(di, { "data-slot": "dialog-portal", ...e });
}
function Zb({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(mn, { "data-slot": "dialog-close", ...e });
}
function _g({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    fi,
    {
      "data-slot": "dialog-overlay",
      className: H(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        e
      ),
      ...t
    }
  );
}
function wl({
  className: e,
  children: t,
  showCloseButton: n = !0,
  ...r
}) {
  return /* @__PURE__ */ a.jsxs(Kg, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ a.jsx(_g, {}),
    /* @__PURE__ */ a.jsxs(
      mi,
      {
        "data-slot": "dialog-content",
        className: H(
          "fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100vh-1rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
          e
        ),
        ...r,
        children: [
          t,
          n && /* @__PURE__ */ a.jsxs(
            mn,
            {
              "data-slot": "dialog-close",
              className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ a.jsx(qo, {}),
                /* @__PURE__ */ a.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function Al({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: H("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function yl({
  className: e,
  showCloseButton: t = !1,
  children: n,
  ...r
}) {
  return /* @__PURE__ */ a.jsxs(
    "div",
    {
      "data-slot": "dialog-footer",
      className: H(
        "shrink-0 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        e
      ),
      ...r,
      children: [
        n,
        t && /* @__PURE__ */ a.jsx(mn, { asChild: !0, children: /* @__PURE__ */ a.jsx(te, { variant: "outline", children: "Close" }) })
      ]
    }
  );
}
function El({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    hi,
    {
      "data-slot": "dialog-title",
      className: H("text-lg leading-none font-semibold", e),
      ...t
    }
  );
}
function Ml({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    pi,
    {
      "data-slot": "dialog-description",
      className: H("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
const Kn = "auth.user";
function Cl() {
  try {
    const e = localStorage.getItem(Kn);
    return e ? JSON.parse(e) : null;
  } catch {
    return localStorage.removeItem(Kn), null;
  }
}
function Xo() {
  localStorage.removeItem(Kn);
}
function jl(e) {
  localStorage.setItem(Kn, JSON.stringify(e));
}
let Rn = null, Pn = null;
const $g = 429, ev = 1, io = "auth:session-expired";
function tv(e) {
  if (typeof e == "string")
    return e;
  if (e && typeof e == "object") {
    const t = e, n = t.message ?? t.detail ?? t.error;
    if (typeof n == "string")
      return n;
  }
  return "";
}
async function nv(e) {
  const t = e.clone(), n = t.headers.get("content-type") || "";
  try {
    if (n.includes("application/json")) {
      const r = await t.json();
      return tv(r);
    }
    return (await t.text()).trim();
  } catch {
    return "";
  }
}
function rv(e) {
  if (!e)
    return null;
  const t = Number(e);
  if (Number.isFinite(t) && t >= 0)
    return t * 1e3;
  const n = Date.parse(e);
  return Number.isNaN(n) ? null : Math.max(n - Date.now(), 0);
}
function ov(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function wn(e, t, n = ev) {
  const r = await fetch(e, {
    ...t,
    cache: t?.cache ?? "no-store"
  });
  if (r.status !== $g || n <= 0)
    return r;
  const o = rv(r.headers.get("retry-after"));
  return o === null ? r : (await ov(o), wn(e, t, n - 1));
}
async function sv(e) {
  if (e.status !== 401)
    return !1;
  const t = (await nv(e)).toLowerCase();
  return t.includes("token") && t.includes("expired");
}
function av() {
  const e = Cl();
  if (!e)
    return null;
  const t = e.username ?? e.email ?? e.sub;
  return typeof t == "string" && t.trim() ? t.trim() : null;
}
async function iv() {
  return Rn || (Rn = (async () => {
    const e = av();
    return e ? !!(await wn(tt("refresh"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: e
      },
      credentials: "include"
    })).ok : !1;
  })().finally(() => {
    Rn = null;
  })), Rn;
}
async function cv() {
  return Pn || (Pn = (async () => {
    try {
      await wn(tt("logout"), {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        credentials: "include"
      });
    } catch {
    } finally {
      window.dispatchEvent(new Event(io));
    }
  })().finally(() => {
    Pn = null;
  })), Pn;
}
async function Bt(e, t = {}) {
  const { skipRefresh: n = !1, ...r } = t, o = await wn(e, r);
  return n || !await sv(o) ? o : await iv() ? Bt(e, { ...r, skipRefresh: !0 }) : (await cv(), o);
}
const lv = {
  error: {
    container: "border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/12",
    icon: Sg
  },
  success: {
    container: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/12 dark:text-emerald-300",
    icon: kg
  },
  info: {
    container: "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/12 dark:text-sky-300",
    icon: Tg
  }
};
function en({
  children: e,
  className: t,
  variant: n = "info"
}) {
  const { container: r, icon: o } = lv[n];
  return /* @__PURE__ */ a.jsxs(
    "div",
    {
      role: n === "error" ? "alert" : "status",
      className: H(
        "flex items-start gap-3 rounded-xl border px-3 py-2 text-sm",
        r,
        t
      ),
      children: [
        /* @__PURE__ */ a.jsx(o, { className: "mt-0.5 size-4 shrink-0" }),
        /* @__PURE__ */ a.jsx("div", { children: e })
      ]
    }
  );
}
function uv({ open: e, handleClose: t }) {
  const [n, r] = h.useState(!1), [o, s] = h.useState(""), c = () => {
    s(""), t();
  }, i = (l) => {
    l || c();
  }, u = async (l) => {
    s("");
    const d = new FormData(l).get("username");
    if (!d || typeof d != "string") {
      s("Username is required.");
      return;
    }
    r(!0);
    try {
      const m = new URLSearchParams();
      m.append("username", d);
      const p = await Bt(tt("resetPassword"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        credentials: "include",
        body: m.toString()
      });
      if (!p.ok)
        throw new Error(`Reset password failed: ${p.status} ${p.statusText}`);
      c();
    } catch (m) {
      s(
        m instanceof Error ? m.message : "Failed to request password reset. Please try again."
      );
    } finally {
      r(!1);
    }
  };
  return /* @__PURE__ */ a.jsx(bl, { open: e, onOpenChange: i, children: /* @__PURE__ */ a.jsx(wl, { className: "flex max-h-[92vh] w-[min(97vw,38rem)] max-w-none flex-col overflow-hidden border-border/70 bg-card/95 p-0", children: /* @__PURE__ */ a.jsxs(
    "form",
    {
      className: "flex min-h-0 flex-1 flex-col",
      onSubmit: (l) => {
        l.preventDefault(), l.stopPropagation(), u(l.currentTarget);
      },
      children: [
        /* @__PURE__ */ a.jsxs(Al, { className: "border-b border-border/70 px-6 py-4 text-left", children: [
          /* @__PURE__ */ a.jsx(El, { children: "Reset password" }),
          /* @__PURE__ */ a.jsx(Ml, { children: "Enter your account's username, and we'll send you a link to reset your password." })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-6 py-5", children: /* @__PURE__ */ a.jsxs("div", { className: "space-y-4", children: [
          o && /* @__PURE__ */ a.jsx(en, { variant: "error", children: o }),
          /* @__PURE__ */ a.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ a.jsx(Ct, { htmlFor: "forgot-password-username", children: /* @__PURE__ */ a.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ a.jsx("span", { children: "Username" }),
              /* @__PURE__ */ a.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
            ] }) }),
            /* @__PURE__ */ a.jsx(
              lt,
              {
                autoFocus: !0,
                required: !0,
                id: "forgot-password-username",
                name: "username",
                placeholder: "username",
                type: "text",
                disabled: n
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ a.jsxs(yl, { className: "gap-2 border-t border-border/70 px-6 py-4 sm:justify-between", children: [
          /* @__PURE__ */ a.jsx(
            te,
            {
              type: "button",
              variant: "outline",
              onClick: c,
              disabled: n,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ a.jsx(te, { type: "submit", disabled: n, children: n ? "Sending..." : "Continue" })
        ] })
      ]
    }
  ) }) });
}
const Nl = "app-color-mode", Il = h.createContext({
  mode: "system",
  resolvedMode: "light",
  systemMode: "light",
  setMode: () => {
  }
});
function dv() {
  if (typeof window > "u")
    return "system";
  const e = window.localStorage.getItem(Nl);
  return e === "light" || e === "dark" || e === "system" ? e : "system";
}
function fv() {
  return typeof window > "u" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function mv(e) {
  if (typeof document > "u")
    return;
  const t = document.documentElement;
  t.classList.toggle("dark", e === "dark"), t.dataset.theme = e, t.style.colorScheme = e;
}
function Sl() {
  return h.useContext(Il);
}
function Dl({ children: e, disableCustomTheme: t }) {
  const [n, r] = h.useState(() => dv()), [o, s] = h.useState(() => fv()), c = n === "system" ? o : n;
  h.useEffect(() => {
    if (typeof window > "u")
      return;
    const u = window.matchMedia("(prefers-color-scheme: dark)"), l = (f) => {
      s(f.matches ? "dark" : "light");
    };
    return s(u.matches ? "dark" : "light"), u.addEventListener("change", l), () => {
      u.removeEventListener("change", l);
    };
  }, []), h.useEffect(() => {
    typeof window > "u" || window.localStorage.setItem(Nl, n);
  }, [n]), h.useEffect(() => {
    t || mv(c);
  }, [t, c]);
  const i = h.useMemo(() => ({
    mode: n,
    resolvedMode: c,
    systemMode: o,
    setMode: r
  }), [n, c, o]);
  return /* @__PURE__ */ a.jsx(Il.Provider, { value: i, children: e });
}
function kl({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(qh, { "data-slot": "dropdown-menu", ...e });
}
function Jb({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(Pc, { "data-slot": "dropdown-menu-portal", ...e });
}
function Rl({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(
    Xh,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function Pl({
  className: e,
  sideOffset: t = 4,
  ...n
}) {
  return /* @__PURE__ */ a.jsx(Pc, { children: /* @__PURE__ */ a.jsx(
    Kh,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset: t,
      className: H(
        "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...n
    }
  ) });
}
function Wb({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(_h, { "data-slot": "dropdown-menu-group", ...e });
}
function Ub({
  className: e,
  inset: t,
  variant: n = "default",
  ...r
}) {
  return /* @__PURE__ */ a.jsx(
    ep,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": t,
      "data-variant": n,
      className: H(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        e
      ),
      ...r
    }
  );
}
function Vb({
  className: e,
  children: t,
  checked: n,
  ...r
}) {
  return /* @__PURE__ */ a.jsxs(
    tp,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: H(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      checked: n,
      ...r,
      children: [
        /* @__PURE__ */ a.jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ a.jsx(Oc, { children: /* @__PURE__ */ a.jsx(gl, { className: "size-4" }) }) }),
        t
      ]
    }
  );
}
function Ol({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(
    np,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function Nt({
  className: e,
  children: t,
  ...n
}) {
  return /* @__PURE__ */ a.jsxs(
    rp,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: H(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n,
      children: [
        /* @__PURE__ */ a.jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ a.jsx(Oc, { children: /* @__PURE__ */ a.jsx(Pg, { className: "size-2 fill-current" }) }) }),
        t
      ]
    }
  );
}
function hv({
  className: e,
  inset: t,
  ...n
}) {
  return /* @__PURE__ */ a.jsx(
    $h,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": t,
      className: H(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        e
      ),
      ...n
    }
  );
}
function pv({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    op,
    {
      "data-slot": "dropdown-menu-separator",
      className: H("-mx-1 my-1 h-px bg-border", e),
      ...t
    }
  );
}
function qb({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: H(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        e
      ),
      ...t
    }
  );
}
function Xb({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(sp, { "data-slot": "dropdown-menu-sub", ...e });
}
function Kb({
  className: e,
  inset: t,
  children: n,
  ...r
}) {
  return /* @__PURE__ */ a.jsxs(
    ap,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": t,
      className: H(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        e
      ),
      ...r,
      children: [
        n,
        /* @__PURE__ */ a.jsx(jt, { className: "ml-auto size-4" })
      ]
    }
  );
}
function _b({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    ip,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: H(
        "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...t
    }
  );
}
function zl(e) {
  const { mode: t, setMode: n } = Sl(), { className: r, ...o } = e, s = {
    system: "System",
    light: "Light",
    dark: "Dark"
  }, c = {
    system: /* @__PURE__ */ a.jsx(ao, { className: "size-4" }),
    light: /* @__PURE__ */ a.jsx(Xn, { className: "size-4" }),
    dark: /* @__PURE__ */ a.jsx(qn, { className: "size-4" })
  };
  return /* @__PURE__ */ a.jsxs(kl, { children: [
    /* @__PURE__ */ a.jsx(Rl, { asChild: !0, children: /* @__PURE__ */ a.jsxs(
      te,
      {
        "data-screenshot": "toggle-mode",
        variant: "outline",
        size: "sm",
        className: H(
          "rounded-full border-border/70 bg-background/85 px-3 shadow-sm backdrop-blur",
          r
        ),
        ...o,
        children: [
          c[t],
          /* @__PURE__ */ a.jsx("span", { className: "hidden sm:inline", children: s[t] })
        ]
      }
    ) }),
    /* @__PURE__ */ a.jsx(Pl, { align: "end", className: "w-36", children: /* @__PURE__ */ a.jsxs(
      Ol,
      {
        value: t,
        onValueChange: (i) => n(i),
        children: [
          /* @__PURE__ */ a.jsxs(Nt, { value: "system", children: [
            /* @__PURE__ */ a.jsx(ao, { className: "mr-2 size-4" }),
            "System"
          ] }),
          /* @__PURE__ */ a.jsxs(Nt, { value: "light", children: [
            /* @__PURE__ */ a.jsx(Xn, { className: "mr-2 size-4" }),
            "Light"
          ] }),
          /* @__PURE__ */ a.jsxs(Nt, { value: "dark", children: [
            /* @__PURE__ */ a.jsx(qn, { className: "mr-2 size-4" }),
            "Dark"
          ] })
        ]
      }
    ) })
  ] });
}
const gv = "data:image/png;base64,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NqTSftvpM/mNx7tG2g8c6t20ffeJjW++f6TtxVe3r33jzd1L/uQvfjbr//nbJxv+4A+2XNUHgb17gVGaDfUMZuoPH+qfv29/d/uu/d1YfuemHTtPbdq6s2vTe9uOt73x/v51z765c/VTr7y14sff//GyHfuPrd59sLNtz+HO9t2HOjce7zjdNnAmvXY0U14yNlpquhgzao47vrcjsmv/sTm7d55o276rc+PWnT3tH+zua38P3fd2dW/asrNz03u7j69+d3dHK5ZTmxPRveR99OiYnXbK8UNHT8/csb9rLZbbvnVv56YPtqP8u062v7vjePs7249ueOv9o2tefmvfqqeff2flBzuOrtm5v79t38Ezm46fHGnvPp1rHxgpbxzNVtvODOfbTvWn2o+cHGjfub+r/b0dx9vefOfo2qee2rbsp7/cO+epV95pff75D+JPPvkku6RgF4lEHiie6IW34KnrXz7xztSfvfLmwq07jqzaerCjbfuhrk27j/ZuOtgx0N7Vn9rYnypuPJMpt43kym2nh4sbD3cNtu88cKr93X0nN7255+jGN7cdWfvzl/atfA3dt3Yfaftgz7H2rfs62nfs62zfsf/kpl37TrQfONzRdvh49/qOnr45I/l8XVdXJvzOO6BWhItICEBwQcElRhC04mqdgIMKpymc6wgQYgChJlBqxEolPvWdHccXvrPzxKqtu7vbdhw5s3H/iZH2rsHSxsFMsDFV4G3ZktM2mi+29QwMt+07dmrj3kOdGz44eHL9O3uPrn5+27Fl/8d//tuZP3np/fqenp4QcnNNnAJeW7b0hF461Ff/vVe2TX36/bfmv7XzyIp9x3vWHjjZ23bwZO/GPcd6Nx4/PbqxbzS/cTDvtGUcvj7t8vWn06W2A5397YdO9bcf7Opv34Pptx88tu69nceWvXFw97z/9rPnp/z3J7fEUDaigFVd0b0F27Nl//66p978YMqLO9+a/96+Y8v3HO9as7fjVNu+Ez0bdh3tattz8vTG/V1n2juHsxsH8s760bK/PuWItpTD2wayzsbj/an2gz1n2nefwHF/rK9t6+HOdduPdS7f09sz96dvvtn6o9dei16RMOckyo+cjo1khqd0Dw0tON7dt+oIcnOkowf77dSmvSd7N+3t7mvf3Xl6/dajx1c9v/PQyue3HVr5JW7mcgAAEABJREFUzsEj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";
function Bl() {
  return /* @__PURE__ */ a.jsx("img", { src: gv, width: "150", alt: "Sitemark" });
}
var Tn = { exports: {} }, vv = Tn.exports, ra;
function xv() {
  return ra || (ra = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r();
    })(vv, (function() {
      var n = 1e3, r = 6e4, o = 36e5, s = "millisecond", c = "second", i = "minute", u = "hour", l = "day", f = "week", d = "month", m = "quarter", p = "year", v = "date", g = "Invalid Date", x = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, b = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, A = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(G) {
        var R = ["th", "st", "nd", "rd"], C = G % 100;
        return "[" + G + (R[(C - 20) % 10] || R[C] || R[0]) + "]";
      } }, w = function(G, R, C) {
        var O = String(G);
        return !O || O.length >= R ? G : "" + Array(R + 1 - O.length).join(C) + G;
      }, E = { s: w, z: function(G) {
        var R = -G.utcOffset(), C = Math.abs(R), O = Math.floor(C / 60), N = C % 60;
        return (R <= 0 ? "+" : "-") + w(O, 2, "0") + ":" + w(N, 2, "0");
      }, m: function G(R, C) {
        if (R.date() < C.date()) return -G(C, R);
        var O = 12 * (C.year() - R.year()) + (C.month() - R.month()), N = R.clone().add(O, d), S = C - N < 0, I = R.clone().add(O + (S ? -1 : 1), d);
        return +(-(O + (C - N) / (S ? N - I : I - N)) || 0);
      }, a: function(G) {
        return G < 0 ? Math.ceil(G) || 0 : Math.floor(G);
      }, p: function(G) {
        return { M: d, y: p, w: f, d: l, D: v, h: u, m: i, s: c, ms: s, Q: m }[G] || String(G || "").toLowerCase().replace(/s$/, "");
      }, u: function(G) {
        return G === void 0;
      } }, j = "en", P = {};
      P[j] = A;
      var k = "$isDayjsObject", M = function(G) {
        return G instanceof Z || !(!G || !G[k]);
      }, D = function G(R, C, O) {
        var N;
        if (!R) return j;
        if (typeof R == "string") {
          var S = R.toLowerCase();
          P[S] && (N = S), C && (P[S] = C, N = S);
          var I = R.split("-");
          if (!N && I.length > 1) return G(I[0]);
        } else {
          var y = R.name;
          P[y] = R, N = y;
        }
        return !O && N && (j = N), N || !O && j;
      }, Y = function(G, R) {
        if (M(G)) return G.clone();
        var C = typeof R == "object" ? R : {};
        return C.date = G, C.args = arguments, new Z(C);
      }, z = E;
      z.l = D, z.i = M, z.w = function(G, R) {
        return Y(G, { locale: R.$L, utc: R.$u, x: R.$x, $offset: R.$offset });
      };
      var Z = (function() {
        function G(C) {
          this.$L = D(C.locale, null, !0), this.parse(C), this.$x = this.$x || C.x || {}, this[k] = !0;
        }
        var R = G.prototype;
        return R.parse = function(C) {
          this.$d = (function(O) {
            var N = O.date, S = O.utc;
            if (N === null) return /* @__PURE__ */ new Date(NaN);
            if (z.u(N)) return /* @__PURE__ */ new Date();
            if (N instanceof Date) return new Date(N);
            if (typeof N == "string" && !/Z$/i.test(N)) {
              var I = N.match(x);
              if (I) {
                var y = I[2] - 1 || 0, T = (I[7] || "0").substring(0, 3);
                return S ? new Date(Date.UTC(I[1], y, I[3] || 1, I[4] || 0, I[5] || 0, I[6] || 0, T)) : new Date(I[1], y, I[3] || 1, I[4] || 0, I[5] || 0, I[6] || 0, T);
              }
            }
            return new Date(N);
          })(C), this.init();
        }, R.init = function() {
          var C = this.$d;
          this.$y = C.getFullYear(), this.$M = C.getMonth(), this.$D = C.getDate(), this.$W = C.getDay(), this.$H = C.getHours(), this.$m = C.getMinutes(), this.$s = C.getSeconds(), this.$ms = C.getMilliseconds();
        }, R.$utils = function() {
          return z;
        }, R.isValid = function() {
          return this.$d.toString() !== g;
        }, R.isSame = function(C, O) {
          var N = Y(C);
          return this.startOf(O) <= N && N <= this.endOf(O);
        }, R.isAfter = function(C, O) {
          return Y(C) < this.startOf(O);
        }, R.isBefore = function(C, O) {
          return this.endOf(O) < Y(C);
        }, R.$g = function(C, O, N) {
          return z.u(C) ? this[O] : this.set(N, C);
        }, R.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, R.valueOf = function() {
          return this.$d.getTime();
        }, R.startOf = function(C, O) {
          var N = this, S = !!z.u(O) || O, I = z.p(C), y = function(ee, ne) {
            var le = z.w(N.$u ? Date.UTC(N.$y, ne, ee) : new Date(N.$y, ne, ee), N);
            return S ? le : le.endOf(l);
          }, T = function(ee, ne) {
            return z.w(N.toDate()[ee].apply(N.toDate("s"), (S ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(ne)), N);
          }, Q = this.$W, W = this.$M, X = this.$D, _ = "set" + (this.$u ? "UTC" : "");
          switch (I) {
            case p:
              return S ? y(1, 0) : y(31, 11);
            case d:
              return S ? y(1, W) : y(0, W + 1);
            case f:
              var J = this.$locale().weekStart || 0, oe = (Q < J ? Q + 7 : Q) - J;
              return y(S ? X - oe : X + (6 - oe), W);
            case l:
            case v:
              return T(_ + "Hours", 0);
            case u:
              return T(_ + "Minutes", 1);
            case i:
              return T(_ + "Seconds", 2);
            case c:
              return T(_ + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, R.endOf = function(C) {
          return this.startOf(C, !1);
        }, R.$set = function(C, O) {
          var N, S = z.p(C), I = "set" + (this.$u ? "UTC" : ""), y = (N = {}, N[l] = I + "Date", N[v] = I + "Date", N[d] = I + "Month", N[p] = I + "FullYear", N[u] = I + "Hours", N[i] = I + "Minutes", N[c] = I + "Seconds", N[s] = I + "Milliseconds", N)[S], T = S === l ? this.$D + (O - this.$W) : O;
          if (S === d || S === p) {
            var Q = this.clone().set(v, 1);
            Q.$d[y](T), Q.init(), this.$d = Q.set(v, Math.min(this.$D, Q.daysInMonth())).$d;
          } else y && this.$d[y](T);
          return this.init(), this;
        }, R.set = function(C, O) {
          return this.clone().$set(C, O);
        }, R.get = function(C) {
          return this[z.p(C)]();
        }, R.add = function(C, O) {
          var N, S = this;
          C = Number(C);
          var I = z.p(O), y = function(W) {
            var X = Y(S);
            return z.w(X.date(X.date() + Math.round(W * C)), S);
          };
          if (I === d) return this.set(d, this.$M + C);
          if (I === p) return this.set(p, this.$y + C);
          if (I === l) return y(1);
          if (I === f) return y(7);
          var T = (N = {}, N[i] = r, N[u] = o, N[c] = n, N)[I] || 1, Q = this.$d.getTime() + C * T;
          return z.w(Q, this);
        }, R.subtract = function(C, O) {
          return this.add(-1 * C, O);
        }, R.format = function(C) {
          var O = this, N = this.$locale();
          if (!this.isValid()) return N.invalidDate || g;
          var S = C || "YYYY-MM-DDTHH:mm:ssZ", I = z.z(this), y = this.$H, T = this.$m, Q = this.$M, W = N.weekdays, X = N.months, _ = N.meridiem, J = function(ne, le, he, ue) {
            return ne && (ne[le] || ne(O, S)) || he[le].slice(0, ue);
          }, oe = function(ne) {
            return z.s(y % 12 || 12, ne, "0");
          }, ee = _ || function(ne, le, he) {
            var ue = ne < 12 ? "AM" : "PM";
            return he ? ue.toLowerCase() : ue;
          };
          return S.replace(b, (function(ne, le) {
            return le || (function(he) {
              switch (he) {
                case "YY":
                  return String(O.$y).slice(-2);
                case "YYYY":
                  return z.s(O.$y, 4, "0");
                case "M":
                  return Q + 1;
                case "MM":
                  return z.s(Q + 1, 2, "0");
                case "MMM":
                  return J(N.monthsShort, Q, X, 3);
                case "MMMM":
                  return J(X, Q);
                case "D":
                  return O.$D;
                case "DD":
                  return z.s(O.$D, 2, "0");
                case "d":
                  return String(O.$W);
                case "dd":
                  return J(N.weekdaysMin, O.$W, W, 2);
                case "ddd":
                  return J(N.weekdaysShort, O.$W, W, 3);
                case "dddd":
                  return W[O.$W];
                case "H":
                  return String(y);
                case "HH":
                  return z.s(y, 2, "0");
                case "h":
                  return oe(1);
                case "hh":
                  return oe(2);
                case "a":
                  return ee(y, T, !0);
                case "A":
                  return ee(y, T, !1);
                case "m":
                  return String(T);
                case "mm":
                  return z.s(T, 2, "0");
                case "s":
                  return String(O.$s);
                case "ss":
                  return z.s(O.$s, 2, "0");
                case "SSS":
                  return z.s(O.$ms, 3, "0");
                case "Z":
                  return I;
              }
              return null;
            })(ne) || I.replace(":", "");
          }));
        }, R.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, R.diff = function(C, O, N) {
          var S, I = this, y = z.p(O), T = Y(C), Q = (T.utcOffset() - this.utcOffset()) * r, W = this - T, X = function() {
            return z.m(I, T);
          };
          switch (y) {
            case p:
              S = X() / 12;
              break;
            case d:
              S = X();
              break;
            case m:
              S = X() / 3;
              break;
            case f:
              S = (W - Q) / 6048e5;
              break;
            case l:
              S = (W - Q) / 864e5;
              break;
            case u:
              S = W / o;
              break;
            case i:
              S = W / r;
              break;
            case c:
              S = W / n;
              break;
            default:
              S = W;
          }
          return N ? S : z.a(S);
        }, R.daysInMonth = function() {
          return this.endOf(d).$D;
        }, R.$locale = function() {
          return P[this.$L];
        }, R.locale = function(C, O) {
          if (!C) return this.$L;
          var N = this.clone(), S = D(C, O, !0);
          return S && (N.$L = S), N;
        }, R.clone = function() {
          return z.w(this.$d, this);
        }, R.toDate = function() {
          return new Date(this.valueOf());
        }, R.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, R.toISOString = function() {
          return this.$d.toISOString();
        }, R.toString = function() {
          return this.$d.toUTCString();
        }, G;
      })(), q = Z.prototype;
      return Y.prototype = q, [["$ms", s], ["$s", c], ["$m", i], ["$H", u], ["$W", l], ["$M", d], ["$y", p], ["$D", v]].forEach((function(G) {
        q[G[1]] = function(R) {
          return this.$g(R, G[0], G[1]);
        };
      })), Y.extend = function(G, R) {
        return G.$i || (G(R, Z, Y), G.$i = !0), Y;
      }, Y.locale = D, Y.isDayjs = M, Y.unix = function(G) {
        return Y(1e3 * G);
      }, Y.en = P[j], Y.Ls = P, Y.p = {}, Y;
    }));
  })(Tn)), Tn.exports;
}
var bv = xv();
const tn = /* @__PURE__ */ Yu(bv), Gl = "YYYY-MM-DDTHH:mm:ss.SSSZ", wv = "YYYY-MM-DDTHH:mm", oa = "HH:mm";
function Av(e) {
  const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), o = String(e.getHours()).padStart(2, "0"), s = String(e.getMinutes()).padStart(2, "0"), c = String(e.getSeconds()).padStart(2, "0"), i = String(e.getMilliseconds()).padStart(3, "0"), u = -e.getTimezoneOffset(), l = u >= 0 ? "+" : "-", f = Math.abs(u), d = String(Math.floor(f / 60)).padStart(2, "0"), m = String(f % 60).padStart(2, "0");
  return `${t}-${n}-${r}T${o}:${s}:${c}.${i}${l}${d}:${m}`;
}
function yv(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? void 0 : t;
}
function Ev(e) {
  const t = e.trim(), n = t.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])$/
  );
  if (n) {
    const [, u, l, f, d] = n, m = Number(u), p = Number(l), v = f ? Number(f) : 0;
    if (m < 1 || m > 12 || p < 0 || p > 59 || v < 0 || v > 59)
      return;
    const g = d.toLowerCase() === "pm" ? m % 12 + 12 : m % 12;
    return `${String(g).padStart(2, "0")}:${l}`;
  }
  const r = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!r)
    return;
  const [, o, s] = r, c = Number(o), i = Number(s);
  if (!(c < 0 || c > 23 || i < 0 || i > 59))
    return `${String(c).padStart(2, "0")}:${s}`;
}
function $b(e) {
  return e ? new Date(e).toLocaleDateString() : "-";
}
function ew(e) {
  if (!e)
    return "-";
  const t = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(e).toLocaleString(void 0, { timeZone: t });
}
function tw(e) {
  const t = e?.trim();
  if (!t)
    return;
  const n = tn(t);
  if (n.isValid())
    return n.format(Gl);
  const r = yv(t);
  return r ? Av(r) : void 0;
}
function nw(e, t) {
  const n = e?.trim();
  if (!n)
    return;
  const r = t === "start" ? tn(n).startOf("day") : tn(n).endOf("day");
  return r.isValid() ? r.format(Gl) : void 0;
}
function rw(e) {
  const t = e?.trim();
  if (!t)
    return "";
  const n = tn(t);
  return n.isValid() ? n.format(wv) : "";
}
function ow(e) {
  const t = e?.trim();
  if (!t)
    return;
  const n = tn(t, oa);
  return n.isValid() ? n.format(oa) : Ev(t);
}
function sw(e, t = 2, n = 8) {
  const r = e ?? "", o = r.split(`
`).length, s = Math.ceil(r.length / 70);
  return Math.min(n, Math.max(t, o, s));
}
function Mv(e) {
  if (!e || typeof e != "object")
    return null;
  const t = e, n = t.name, r = t.username, o = t.sub, s = t.account_type;
  return typeof n != "string" || typeof r != "string" || typeof o != "string" || typeof s != "string" ? null : {
    ...t,
    name: n,
    username: r,
    sub: o,
    account_type: s
  };
}
function Cv(e) {
  if (!e || typeof e != "object")
    return e;
  const t = e;
  if (t.user)
    return t.user;
  if (t.data && typeof t.data == "object") {
    const n = t.data;
    if (n.user)
      return n.user;
  }
  return e;
}
async function jv(e) {
  const t = new URLSearchParams();
  t.append("grant_type", "password"), t.append("username", e.username), t.append("password", e.password);
  const n = await wn(tt("login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    credentials: "include",
    body: t.toString()
  });
  if (!n.ok)
    throw new Error(
      `Login failed: ${n.status} ${n.statusText}`
    );
  return Ko();
}
async function Nv(e) {
  const t = new URLSearchParams();
  t.append("credential", e);
  const n = await Bt(
    `${tt("authenticateGoogle")}?${t.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      credentials: "include"
    }
  );
  if (!n.ok)
    throw new Error(
      `Google login failed: ${n.status} ${n.statusText}`
    );
  return Ko();
}
async function Iv() {
  const e = await Bt(tt("logout"), {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    credentials: "include"
  });
  if (!e.ok)
    throw new Error(
      `Logout failed: ${e.status} ${e.statusText}`
    );
  Xo();
}
async function Ko() {
  const e = await Bt(tt("currentUser"), {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    credentials: "include"
  });
  if (!e.ok)
    throw new Error(
      `Failed to fetch current user: ${e.status} ${e.statusText}`
    );
  const t = await e.json(), n = Mv(Cv(t));
  if (!n)
    throw new Error("Current user response did not contain a valid user");
  return jl(n), n;
}
async function Sv(e) {
  const t = new URLSearchParams();
  t.append("token", e.token), t.append("username", e.username), t.append("password", e.password);
  const n = await Bt(
    tt("resetPasswordAuthorised"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      credentials: "include",
      body: t.toString()
    }
  );
  if (!n.ok)
    throw new Error(
      `Password reset failed: ${n.status} ${n.statusText}`
    );
}
const Tl = dn(void 0);
function sa() {
  localStorage.clear(), Xo();
}
function aw({ children: e }) {
  const [t, n] = me(null), [r, o] = me(!0);
  se(() => {
    let u = !0;
    return (async () => {
      const f = Cl();
      f && n(f);
      try {
        const d = await Ko();
        if (!u)
          return;
        n(d);
      } catch {
        if (!u)
          return;
        n(null), Xo();
      } finally {
        u && o(!1);
      }
    })(), () => {
      u = !1;
    };
  }, []), se(() => {
    const u = () => {
      sa(), n(null);
    };
    return window.addEventListener(io, u), () => {
      window.removeEventListener(
        io,
        u
      );
    };
  }, []);
  const s = async (u) => {
    try {
      const l = await jv(u);
      n(l);
    } catch (l) {
      throw console.error("Login failed:", l), l;
    }
  }, c = (u) => {
    jl(u), n(u);
  }, i = async () => {
    try {
      await Iv();
    } catch (u) {
      console.error("Logout API failed:", u);
    } finally {
      sa(), n(null);
    }
  };
  return /* @__PURE__ */ a.jsx(
    Tl.Provider,
    {
      value: {
        user: t,
        isLoading: r,
        isAuthenticated: !!t,
        login: s,
        setAuthenticatedUser: c,
        logout: i
      },
      children: e
    }
  );
}
function Dv() {
  const e = Pt(Tl);
  if (e === void 0)
    throw new Error("useAuth must be used within an AuthProvider");
  return e;
}
const kv = {};
function iw(e) {
  const { login: t, setAuthenticatedUser: n } = Dv(), [r, o] = h.useState(""), [s, c] = h.useState(""), [i, u] = h.useState(""), [l, f] = h.useState(""), [d, m] = h.useState(""), [p, v] = h.useState(""), [g, x] = h.useState(!1), [b, A] = h.useState(!1);
  h.useEffect(() => {
    e.authNotice && v(e.authNotice);
  }, [e.authNotice]), h.useEffect(() => {
    const M = e.googleClientId || (typeof import.meta < "u" ? kv?.VITE_GOOGLE_CLIENT_ID : void 0) || "";
    if (!M)
      return;
    const D = document.createElement("script");
    D.src = "https://accounts.google.com/gsi/client", D.async = !0, D.defer = !0, document.head.appendChild(D), D.onload = () => {
      window.google?.accounts?.id && (window.google.accounts.id.initialize({
        client_id: M,
        callback: j,
        use_fedcm_for_prompt: !0,
        auto_select: !1,
        context: "signin"
      }), window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        {
          theme: "outline",
          size: "large",
          text: "continue_with"
        }
      ), window.google.accounts.id.prompt((Y) => {
        (Y.isNotDisplayed() || Y.isSkippedMoment()) && console.log("Google prompt status:", Y.getNotDisplayedReason());
      }));
    };
  }, [e.googleClientId]);
  const w = (M) => {
    M.preventDefault(), M.stopPropagation(), A(!0);
  }, E = () => {
    A(!1);
  }, j = async (M) => {
    x(!0), m(""), v("");
    try {
      const D = await Nv(M.credential);
      n(D);
    } catch (D) {
      m(
        D instanceof Error ? D.message : "Google sign-in failed. Please try again."
      );
    } finally {
      x(!1);
    }
  }, P = async (M) => {
    if (M.preventDefault(), !!k()) {
      x(!0), m("");
      try {
        await t({ username: r.trim(), password: s });
      } catch (D) {
        const Y = D instanceof Error ? D.message : "";
        if (Y.includes("401") || Y.includes("400")) {
          m("Invalid username or password.");
          return;
        }
        m(
          D instanceof Error ? D.message : "Login failed. Please try again."
        );
      } finally {
        x(!1);
      }
    }
  }, k = () => {
    let M = !0;
    return r.trim() ? u("") : (u("Please enter your username."), M = !1), s ? f("") : (f("Password is required."), M = !1), M;
  };
  return /* @__PURE__ */ a.jsx(Dl, { ...e, children: /* @__PURE__ */ a.jsxs("div", { className: "relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),transparent_32%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),transparent_28%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" }),
    /* @__PURE__ */ a.jsx("div", { className: "pointer-events-none absolute inset-x-0 top-[-10rem] -z-10 mx-auto h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10" }),
    /* @__PURE__ */ a.jsx(zl, { className: "fixed right-4 top-4 z-20 sm:right-6 sm:top-6" }),
    /* @__PURE__ */ a.jsx("div", { className: "mx-auto flex w-full max-w-md flex-1 items-center", children: /* @__PURE__ */ a.jsxs(dl, { className: "w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur", children: [
      /* @__PURE__ */ a.jsxs(fl, { className: "gap-5 px-6 pt-6 sm:px-8 sm:pt-8", children: [
        /* @__PURE__ */ a.jsx("div", { className: "flex justify-center sm:justify-start", children: /* @__PURE__ */ a.jsx(Bl, {}) }),
        /* @__PURE__ */ a.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ a.jsx(ml, { className: "text-3xl tracking-tight", children: "Sign in" }) })
      ] }),
      /* @__PURE__ */ a.jsx(hl, { className: "space-y-5 px-6 pb-6 sm:px-8 sm:pb-8", children: /* @__PURE__ */ a.jsxs(
        "form",
        {
          className: "space-y-4",
          onSubmit: P,
          noValidate: !0,
          children: [
            d && /* @__PURE__ */ a.jsx(en, { variant: "error", children: d }),
            p && /* @__PURE__ */ a.jsx(en, { variant: "success", children: p }),
            /* @__PURE__ */ a.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ a.jsx(Ct, { htmlFor: "username", children: /* @__PURE__ */ a.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ a.jsx("span", { children: "Username" }),
                /* @__PURE__ */ a.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ a.jsx(
                lt,
                {
                  "aria-invalid": !!i,
                  id: "username",
                  type: "text",
                  name: "username",
                  placeholder: "username",
                  autoComplete: "username",
                  autoFocus: !0,
                  required: !0,
                  value: r,
                  onChange: (M) => {
                    o(M.target.value), i && u("");
                  },
                  disabled: g
                }
              ),
              i && /* @__PURE__ */ a.jsx("p", { className: "text-sm text-destructive", children: i })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ a.jsx(Ct, { htmlFor: "password", children: /* @__PURE__ */ a.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ a.jsx("span", { children: "Password" }),
                /* @__PURE__ */ a.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ a.jsx(
                lt,
                {
                  "aria-invalid": !!l,
                  name: "password",
                  placeholder: "••••••",
                  type: "password",
                  id: "password",
                  autoComplete: "current-password",
                  required: !0,
                  value: s,
                  onChange: (M) => {
                    c(M.target.value), l && f("");
                  },
                  disabled: g
                }
              ),
              l && /* @__PURE__ */ a.jsx("p", { className: "text-sm text-destructive", children: l })
            ] }),
            /* @__PURE__ */ a.jsx(te, { type: "submit", className: "w-full", disabled: g, children: g ? "Signing in..." : "Sign in" }),
            /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                onClick: w,
                className: "mx-auto block text-sm font-medium text-primary transition hover:text-primary/80",
                children: "Forgot your password?"
              }
            ),
            e.googleClientId && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
              /* @__PURE__ */ a.jsxs("div", { className: "relative py-1", children: [
                /* @__PURE__ */ a.jsx(pg, {}),
                /* @__PURE__ */ a.jsx("span", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground", children: "or continue with" })
              ] }),
              /* @__PURE__ */ a.jsx("div", { className: "rounded-2xl border border-dashed border-border/70 bg-muted/35 p-4", children: /* @__PURE__ */ a.jsx(
                "div",
                {
                  id: "google-btn",
                  className: "flex min-h-10 justify-center"
                }
              ) })
            ] })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ a.jsx(
      uv,
      {
        open: b,
        handleClose: E
      }
    ),
    /* @__PURE__ */ a.jsxs("div", { className: "space-y-3 pt-6 text-center", children: [
      /* @__PURE__ */ a.jsx(
        "a",
        {
          href: "https://docs.google.com/document/d/1vueS_dzdvDkBex5BLe_F03GEFLzjtoiFbNi0VJa2_gE/edit?tab=t.0",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex text-sm font-medium text-muted-foreground transition hover:text-foreground",
          children: "Hướng dẫn sử dụng / User Guide"
        }
      ),
      /* @__PURE__ */ a.jsx("p", { className: "text-sm text-muted-foreground", children: "© 2026 Springboard English" })
    ] })
  ] }) });
}
function cw(e) {
  const [t, n] = h.useState(""), [r, o] = h.useState(""), [s, c] = h.useState(""), [i, u] = h.useState(""), [l, f] = h.useState(""), [d, m] = h.useState(!1);
  h.useEffect(() => {
    const g = new URLSearchParams(window.location.search).get("token") || "";
    n(g);
  }, []);
  const p = async (v) => {
    if (v.preventDefault(), f(""), !t.trim()) {
      f("Reset token is required.");
      return;
    }
    if (!r.trim()) {
      f("Username is required.");
      return;
    }
    if (!s) {
      f("New password is required.");
      return;
    }
    if (!i) {
      f("Please confirm your new password.");
      return;
    }
    if (s !== i) {
      f("Passwords do not match.");
      return;
    }
    m(!0);
    try {
      await Sv({
        token: t.trim(),
        username: r.trim(),
        password: s
      }), e.onNavigateToSignIn?.("Password reset successful. You can now sign in."), !e.onNavigateToSignIn && e.signInPath && window.location.assign(e.signInPath);
    } catch (g) {
      f(
        g instanceof Error ? g.message : "Failed to reset password. Please try again."
      );
    } finally {
      m(!1);
    }
  };
  return /* @__PURE__ */ a.jsx(Dl, { ...e, children: /* @__PURE__ */ a.jsxs("div", { className: "relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_24%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" }),
    /* @__PURE__ */ a.jsx("div", { className: "pointer-events-none absolute bottom-[-8rem] right-[-3rem] -z-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" }),
    /* @__PURE__ */ a.jsx(zl, { className: "fixed right-4 top-4 z-20 sm:right-6 sm:top-6" }),
    /* @__PURE__ */ a.jsx("div", { className: "mx-auto flex w-full max-w-md flex-1 items-center", children: /* @__PURE__ */ a.jsxs(dl, { className: "w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur", children: [
      /* @__PURE__ */ a.jsxs(fl, { className: "gap-5 px-6 pt-6 sm:px-8 sm:pt-8", children: [
        /* @__PURE__ */ a.jsx("div", { className: "flex justify-center sm:justify-start", children: /* @__PURE__ */ a.jsx(Bl, {}) }),
        /* @__PURE__ */ a.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ a.jsx(ml, { className: "text-3xl tracking-tight", children: "Reset password" }),
          /* @__PURE__ */ a.jsx(hg, { className: "text-sm leading-6", children: "Set a new password for your account using the reset link you received." })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(hl, { className: "px-6 pb-6 sm:px-8 sm:pb-8", children: /* @__PURE__ */ a.jsxs(
        "form",
        {
          className: "space-y-4",
          onSubmit: p,
          noValidate: !0,
          children: [
            l && /* @__PURE__ */ a.jsx(en, { variant: "error", children: l }),
            /* @__PURE__ */ a.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ a.jsx(Ct, { htmlFor: "username", children: /* @__PURE__ */ a.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ a.jsx("span", { children: "Username" }),
                /* @__PURE__ */ a.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ a.jsx(
                lt,
                {
                  id: "username",
                  name: "username",
                  type: "text",
                  autoComplete: "username",
                  required: !0,
                  value: r,
                  onChange: (v) => o(v.target.value),
                  disabled: d
                }
              )
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ a.jsx(Ct, { htmlFor: "new-password", children: /* @__PURE__ */ a.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ a.jsx("span", { children: "New password" }),
                /* @__PURE__ */ a.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ a.jsx(
                lt,
                {
                  id: "new-password",
                  name: "new-password",
                  type: "password",
                  autoComplete: "new-password",
                  required: !0,
                  value: s,
                  onChange: (v) => c(v.target.value),
                  disabled: d
                }
              )
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ a.jsx(Ct, { htmlFor: "confirm-password", children: /* @__PURE__ */ a.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ a.jsx("span", { children: "Confirm new password" }),
                /* @__PURE__ */ a.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ a.jsx(
                lt,
                {
                  id: "confirm-password",
                  name: "confirm-password",
                  type: "password",
                  autoComplete: "new-password",
                  required: !0,
                  value: i,
                  onChange: (v) => u(v.target.value),
                  disabled: d
                }
              )
            ] }),
            /* @__PURE__ */ a.jsx(te, { type: "submit", className: "w-full", disabled: d, children: d ? "Resetting password..." : "Reset password" }),
            /* @__PURE__ */ a.jsx(
              te,
              {
                type: "button",
                className: "w-full",
                variant: "outline",
                onClick: () => {
                  e.onNavigateToSignIn?.(), !e.onNavigateToSignIn && e.signInPath && window.location.assign(e.signInPath);
                },
                disabled: d,
                children: "Back to sign in"
              }
            )
          ]
        }
      ) })
    ] }) })
  ] }) });
}
function Rv(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n += 1)
    if (e[n]?.key !== t[n]?.key || e[n]?.value !== t[n]?.value)
      return !1;
  return !0;
}
function Pv(e, t) {
  return e ? e.count === t.count && e.saving === t.saving && e.disabled === t.disabled && e.keyLabel === t.keyLabel && e.valueLabel === t.valueLabel && e.onSave === t.onSave && e.onCancel === t.onCancel && Rv(e.items, t.items) : !1;
}
const Yl = dn(
  void 0
);
function lw({ children: e }) {
  const [t, n] = me(null), [r, o] = me(
    {}
  ), [s, c] = me({}), i = ct(
    (A, w) => {
      const E = A.trim();
      E && (c((j) => {
        const P = w.count;
        if (P <= 0) {
          if (!(E in j))
            return j;
          const k = { ...j };
          return delete k[E], k;
        }
        return j[E] === P ? j : {
          ...j,
          [E]: P
        };
      }), o((j) => {
        const P = j[E];
        return Pv(P, w) ? j : {
          ...j,
          [E]: w
        };
      }));
    },
    []
  ), u = ct((A) => {
    const w = A.trim();
    w && o((E) => {
      if (!(w in E))
        return E;
      const j = { ...E };
      return delete j[w], j;
    });
  }, []), l = fe(() => Object.entries(r).flatMap(
    ([A, w]) => w.items.map((E) => ({
      section: A,
      key: E.key,
      value: E.value
    }))
  ), [r]), f = fe(
    () => Object.values(r).reduce(
      (A, w) => A + w.count,
      0
    ),
    [r]
  ), d = fe(() => {
    const A = Object.entries(r).reduce(
      (w, [E, j]) => (w[E] = j.count, w),
      {}
    );
    return {
      ...s,
      ...A
    };
  }, [s, r]), m = fe(
    () => Object.entries(r).find(([, A]) => A.count > 0)?.[0] ?? null,
    [r]
  ), p = t && r[t] ? t : m, v = p ? r[p] ?? null : null, g = ct(() => {
    if (v?.onSave)
      return v.onSave();
  }, [v]), x = ct(() => {
    v?.onCancel?.();
  }, [v]), b = fe(
    () => ({
      globalPendingCount: f,
      globalPendingItems: l,
      sectionPendingCounts: d,
      activeSection: p,
      activeSectionPendingCount: v?.count ?? 0,
      activeSectionSaving: v?.saving ?? !1,
      activeSectionDisabled: v?.disabled ?? !1,
      activeSectionKeyLabel: v?.keyLabel ?? "Name",
      activeSectionValueLabel: v?.valueLabel ?? "Changed",
      setActiveSection: n,
      registerSection: i,
      unregisterSection: u,
      handleSaveActiveSection: g,
      handleCancelActiveSection: x
    }),
    [
      p,
      v,
      f,
      l,
      d,
      x,
      g,
      i,
      u
    ]
  );
  return /* @__PURE__ */ a.jsx(Yl.Provider, { value: b, children: e });
}
function uw() {
  const e = Pt(Yl);
  if (!e)
    throw new Error("usePendingChanges must be used within a PendingChangesProvider");
  return e;
}
function dw(e) {
  const { mode: t, systemMode: n, setMode: r } = Sl(), { className: o, ...s } = e, i = (n || t) === "light" ? /* @__PURE__ */ a.jsx(Xn, { className: "size-4" }) : /* @__PURE__ */ a.jsx(qn, { className: "size-4" });
  return /* @__PURE__ */ a.jsxs(kl, { children: [
    /* @__PURE__ */ a.jsx(Rl, { asChild: !0, children: /* @__PURE__ */ a.jsx(
      te,
      {
        "data-screenshot": "toggle-mode",
        variant: "ghost",
        size: "icon",
        className: H("rounded-full", o),
        "aria-label": "Toggle color mode",
        ...s,
        children: i
      }
    ) }),
    /* @__PURE__ */ a.jsxs(Pl, { align: "end", className: "w-44", children: [
      /* @__PURE__ */ a.jsx(hv, { children: "Appearance" }),
      /* @__PURE__ */ a.jsx(pv, {}),
      /* @__PURE__ */ a.jsxs(
        Ol,
        {
          value: t,
          onValueChange: (u) => r(u),
          children: [
            /* @__PURE__ */ a.jsxs(Nt, { value: "system", children: [
              /* @__PURE__ */ a.jsx(ao, { className: "mr-2 size-4" }),
              "System"
            ] }),
            /* @__PURE__ */ a.jsxs(Nt, { value: "light", children: [
              /* @__PURE__ */ a.jsx(Xn, { className: "mr-2 size-4" }),
              "Light"
            ] }),
            /* @__PURE__ */ a.jsxs(Nt, { value: "dark", children: [
              /* @__PURE__ */ a.jsx(qn, { className: "mr-2 size-4" }),
              "Dark"
            ] })
          ]
        }
      )
    ] })
  ] });
}
function fw() {
  return /* @__PURE__ */ a.jsx("div", { className: "flex min-h-[240px] w-full items-center justify-center", children: /* @__PURE__ */ a.jsx(xl, { className: "size-7 animate-spin text-muted-foreground" }) });
}
function Hl({
  id: e,
  value: t,
  options: n,
  placeholder: r = "Select option",
  searchPlaceholder: o = "Search...",
  emptyMessage: s = "No options found.",
  disabled: c = !1,
  className: i,
  contentClassName: u,
  onValueChange: l
}) {
  const [f, d] = me(!1), [m, p] = me(""), v = String(t ?? ""), g = fe(
    () => n.find((A) => A.value === v),
    [v, n]
  ), x = fe(() => {
    const A = m.trim().toLowerCase();
    return A ? n.filter((w) => `${w.label} ${w.keywords ?? ""} ${w.value}`.toLowerCase().includes(A)) : n;
  }, [n, m]), b = (A) => {
    l(A), d(!1), p("");
  };
  return /* @__PURE__ */ a.jsxs(Wc, { open: f, onOpenChange: d, children: [
    /* @__PURE__ */ a.jsx(Uc, { asChild: !0, children: /* @__PURE__ */ a.jsxs(
      "button",
      {
        id: e,
        type: "button",
        disabled: c,
        className: H(
          "flex h-10 w-full min-w-0 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          i
        ),
        onClick: (A) => A.stopPropagation(),
        children: [
          /* @__PURE__ */ a.jsx("span", { className: H("min-w-0 flex-1 truncate text-left", !g && "text-muted-foreground"), children: g?.label ?? r }),
          /* @__PURE__ */ a.jsx(vl, { className: "ml-2 size-4 shrink-0 text-muted-foreground" })
        ]
      }
    ) }),
    /* @__PURE__ */ a.jsx(Vc, { children: /* @__PURE__ */ a.jsxs(
      qc,
      {
        sideOffset: 4,
        align: "start",
        className: H(
          "z-50 w-(--radix-popover-trigger-width) min-w-[12rem] max-h-[min(18rem,var(--radix-popover-content-available-height))] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          u
        ),
        onOpenAutoFocus: (A) => A.preventDefault(),
        onPointerDownOutside: () => p(""),
        onEscapeKeyDown: () => p(""),
        onClick: (A) => A.stopPropagation(),
        children: [
          /* @__PURE__ */ a.jsxs("div", { className: "relative mb-2", children: [
            /* @__PURE__ */ a.jsx(Wg, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ a.jsx(
              "input",
              {
                value: m,
                onChange: (A) => p(A.target.value),
                placeholder: o,
                className: H(
                  "h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm shadow-xs outline-none transition",
                  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                ),
                autoFocus: !0
              }
            )
          ] }),
          /* @__PURE__ */ a.jsx(
            "div",
            {
              className: "max-h-56 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] touch-pan-y",
              style: { WebkitOverflowScrolling: "touch" },
              onWheelCapture: (A) => A.stopPropagation(),
              children: x.length === 0 ? /* @__PURE__ */ a.jsx("div", { className: "px-2 py-1.5 text-sm text-muted-foreground", children: s }) : x.map((A) => {
                const w = A.value === v;
                return /* @__PURE__ */ a.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => b(A.value),
                    disabled: A.disabled,
                    className: H(
                      "flex w-full min-w-0 cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm outline-none transition",
                      "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                      "disabled:pointer-events-none disabled:opacity-50"
                    ),
                    children: [
                      /* @__PURE__ */ a.jsx("span", { className: "min-w-0 flex-1 truncate", children: A.label }),
                      w ? /* @__PURE__ */ a.jsx(gl, { className: "ml-2 size-4 shrink-0" }) : null
                    ]
                  },
                  A.value
                );
              })
            }
          )
        ]
      }
    ) })
  ] });
}
function Ov({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: H(
        "flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
        e
      ),
      ...t
    }
  );
}
function _o({ className: e, containerClassName: t, ...n }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: H("relative w-full overflow-x-auto", t),
      children: /* @__PURE__ */ a.jsx(
        "table",
        {
          "data-slot": "table",
          className: H("w-full caption-bottom text-sm", e),
          ...n
        }
      )
    }
  );
}
function zv({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: H("[&_tr]:border-b", e),
      ...t
    }
  );
}
function $o({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: H("[&_tr:last-child]:border-0", e),
      ...t
    }
  );
}
function mw({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: H(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        e
      ),
      ...t
    }
  );
}
function yt({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: H(
        "border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted",
        e
      ),
      ...t
    }
  );
}
function Bv({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: H(
        "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        e
      ),
      ...t
    }
  );
}
function ut({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: H("p-4 align-middle", e),
      ...t
    }
  );
}
function hw({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    "caption",
    {
      "data-slot": "table-caption",
      className: H("mt-4 text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function Gv({ label: e, required: t = !1, helperText: n, children: r, className: o, align: s = "center" }) {
  return /* @__PURE__ */ a.jsxs(yt, { className: H("hover:bg-transparent", o), children: [
    /* @__PURE__ */ a.jsx(
      ut,
      {
        className: H(
          "w-[220px] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
          s === "center" ? "align-middle" : "align-top"
        ),
        children: /* @__PURE__ */ a.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ a.jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ a.jsx("span", { children: e }),
            t && /* @__PURE__ */ a.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
          ] }),
          n && /* @__PURE__ */ a.jsx("p", { className: "text-xs normal-case leading-5 text-muted-foreground", children: n })
        ] })
      }
    ),
    /* @__PURE__ */ a.jsx(ut, { className: H("min-w-0 px-4 py-3 text-sm", s === "center" ? "align-middle" : "align-top"), children: r })
  ] });
}
function Tv({
  open: e,
  saving: t = !1,
  title: n,
  description: r,
  error: o,
  submitLabel: s = "Create",
  submitDisabled: c = !1,
  onClose: i,
  onSubmit: u,
  children: l
}) {
  return /* @__PURE__ */ a.jsx(bl, { open: e, onOpenChange: (f) => !f && !t && i(), children: /* @__PURE__ */ a.jsxs(
    wl,
    {
      showCloseButton: !t,
      className: "!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[80vw] max-h-[92vh] !max-w-none flex flex-col overflow-hidden border-0 bg-card p-0 shadow-none",
      children: [
        /* @__PURE__ */ a.jsxs(Al, { className: "border-b border-border/60 px-6 py-4 text-left", children: [
          /* @__PURE__ */ a.jsx(El, { children: n }),
          r && /* @__PURE__ */ a.jsx(Ml, { children: r })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-6 py-5", children: /* @__PURE__ */ a.jsxs("div", { className: "flex min-h-full flex-col justify-center gap-4", children: [
          o && /* @__PURE__ */ a.jsx(en, { variant: "error", children: o }),
          /* @__PURE__ */ a.jsx("div", { className: "overflow-hidden rounded-2xl bg-transparent", children: /* @__PURE__ */ a.jsx(_o, { className: "table-fixed", containerClassName: "overflow-x-hidden", children: /* @__PURE__ */ a.jsx($o, { className: "[&_tr]:border-b-0", children: l }) }) })
        ] }) }),
        /* @__PURE__ */ a.jsxs(yl, { className: "border-t border-border/60 px-6 py-4", showCloseButton: !1, children: [
          /* @__PURE__ */ a.jsx(te, { type: "button", variant: "outline", onClick: i, disabled: t, children: "Cancel" }),
          /* @__PURE__ */ a.jsx(te, { type: "button", onClick: () => {
            u();
          }, disabled: t || c, children: s })
        ] })
      ]
    }
  ) });
}
function Yv(e, t) {
  return e === "boolean" ? t === !0 : t == null ? "" : String(t);
}
function Hv(e) {
  return e.includes(`
`) || e.length > 80;
}
function Fv(e, t) {
  const n = e.split(`
`).length, r = Math.ceil(e.length / 90);
  return Math.min(12, Math.max(t ?? 3, n, r));
}
function Lv(e) {
  return e === "number" ? "number" : e === "date" ? "date" : "text";
}
function pw({
  open: e,
  title: t,
  fields: n,
  initialValues: r,
  error: o,
  saving: s = !1,
  onClose: c,
  onSubmit: i
}) {
  const [u, l] = me([]);
  se(() => {
    e && l(n.map((m) => {
      const p = Yv(m.type, r[m.key]);
      return {
        ...m,
        value: p,
        initialValue: p
      };
    }));
  }, [n, r, e]);
  const f = (m, p) => {
    l((v) => v.map((g) => g.key === m ? { ...g, value: p } : g));
  }, d = async () => {
    const m = u.reduce((p, v) => {
      if (v.value === v.initialValue || v.readOnly)
        return p;
      if (v.type === "boolean")
        return p[v.key] = !!v.value, p;
      const g = typeof v.value == "string" ? v.value.trim() : "";
      return g ? v.type === "number" ? (p[v.key] = Number(g), p) : (p[v.key] = g, p) : (p[v.key] = null, p);
    }, {});
    await i(m);
  };
  return /* @__PURE__ */ a.jsx(
    Tv,
    {
      open: e,
      saving: s,
      title: t,
      description: "Only modified fields will be included in the update request.",
      error: o,
      submitLabel: "Save",
      onClose: c,
      onSubmit: d,
      children: u.map((m) => {
        const p = typeof m.value == "string" ? m.value : "", v = m.type === "text" && (m.multiline || Hv(p));
        return /* @__PURE__ */ a.jsx(
          Gv,
          {
            label: m.label,
            helperText: m.helperText,
            align: v ? "start" : "center",
            children: m.type === "boolean" ? /* @__PURE__ */ a.jsxs("label", { className: "inline-flex items-center gap-3 text-sm", children: [
              /* @__PURE__ */ a.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!m.value,
                  disabled: m.readOnly,
                  onChange: (g) => f(m.key, g.target.checked),
                  className: "size-4 rounded border-input accent-primary"
                }
              ),
              /* @__PURE__ */ a.jsx("span", { children: m.value ? "Enabled" : "Disabled" })
            ] }) : m.type === "select" ? /* @__PURE__ */ a.jsx(
              Hl,
              {
                value: p,
                onValueChange: (g) => f(m.key, g),
                disabled: m.readOnly,
                options: [
                  { value: "", label: `-- ${m.label} --` },
                  ...(m.options ?? []).map((g) => ({ value: g.value, label: g.label }))
                ],
                placeholder: `-- ${m.label} --`,
                searchPlaceholder: `Search ${m.label.toLowerCase()}...`
              }
            ) : v ? /* @__PURE__ */ a.jsx(
              Ov,
              {
                value: p,
                onChange: (g) => f(m.key, g.target.value),
                readOnly: m.readOnly,
                disabled: m.readOnly,
                rows: Fv(p, m.minRows),
                placeholder: m.label,
                className: "resize-y"
              }
            ) : /* @__PURE__ */ a.jsx(
              lt,
              {
                value: p,
                type: Lv(m.type),
                onChange: (g) => f(m.key, g.target.value),
                readOnly: m.readOnly,
                disabled: m.readOnly,
                placeholder: m.label
              }
            )
          },
          m.key
        );
      })
    }
  );
}
var es = yn(), V = (e) => An(e, es), ts = yn();
V.write = (e) => An(e, ts);
var wr = yn();
V.onStart = (e) => An(e, wr);
var ns = yn();
V.onFrame = (e) => An(e, ns);
var rs = yn();
V.onFinish = (e) => An(e, rs);
var It = [];
V.setTimeout = (e, t) => {
  const n = V.now() + t, r = () => {
    const s = It.findIndex((c) => c.cancel == r);
    ~s && It.splice(s, 1), Xe -= ~s ? 1 : 0;
  }, o = { time: n, handler: e, cancel: r };
  return It.splice(Fl(n), 0, o), Xe += 1, Ll(), o;
};
var Fl = (e) => ~(~It.findIndex((t) => t.time > e) || ~It.length);
V.cancel = (e) => {
  wr.delete(e), ns.delete(e), rs.delete(e), es.delete(e), ts.delete(e);
};
V.sync = (e) => {
  co = !0, V.batchedUpdates(e), co = !1;
};
V.throttle = (e) => {
  let t;
  function n() {
    try {
      e(...t);
    } finally {
      t = null;
    }
  }
  function r(...o) {
    t = o, V.onStart(n);
  }
  return r.handler = e, r.cancel = () => {
    wr.delete(n), t = null;
  }, r;
};
var os = typeof window < "u" ? window.requestAnimationFrame : (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (() => {
  })
);
V.use = (e) => os = e;
V.now = typeof performance < "u" ? () => performance.now() : Date.now;
V.batchedUpdates = (e) => e();
V.catch = console.error;
V.frameLoop = "always";
V.advance = () => {
  V.frameLoop !== "demand" ? console.warn(
    "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
  ) : Zl();
};
var qe = -1, Xe = 0, co = !1;
function An(e, t) {
  co ? (t.delete(e), e(0)) : (t.add(e), Ll());
}
function Ll() {
  qe < 0 && (qe = 0, V.frameLoop !== "demand" && os(Ql));
}
function Qv() {
  qe = -1;
}
function Ql() {
  ~qe && (os(Ql), V.batchedUpdates(Zl));
}
function Zl() {
  const e = qe;
  qe = V.now();
  const t = Fl(qe);
  if (t && (Jl(It.splice(0, t), (n) => n.handler()), Xe -= t), !Xe) {
    Qv();
    return;
  }
  wr.flush(), es.flush(e ? Math.min(64, qe - e) : 16.667), ns.flush(), ts.flush(), rs.flush();
}
function yn() {
  let e = /* @__PURE__ */ new Set(), t = e;
  return {
    add(n) {
      Xe += t == e && !e.has(n) ? 1 : 0, e.add(n);
    },
    delete(n) {
      return Xe -= t == e && e.has(n) ? 1 : 0, e.delete(n);
    },
    flush(n) {
      t.size && (e = /* @__PURE__ */ new Set(), Xe -= t.size, Jl(t, (r) => r(n) && e.add(r)), Xe += e.size, t = e);
    }
  };
}
function Jl(e, t) {
  e.forEach((n) => {
    try {
      t(n);
    } catch (r) {
      V.catch(r);
    }
  });
}
var Zv = Object.defineProperty, Jv = (e, t) => {
  for (var n in t)
    Zv(e, n, { get: t[n], enumerable: !0 });
}, Ie = {};
Jv(Ie, {
  assign: () => Uv,
  colors: () => Ke,
  createStringInterpolator: () => as,
  skipAnimation: () => Ul,
  to: () => Wl,
  willAdvance: () => is
});
function lo() {
}
var Wv = (e, t, n) => Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 }), B = {
  arr: Array.isArray,
  obj: (e) => !!e && e.constructor.name === "Object",
  fun: (e) => typeof e == "function",
  str: (e) => typeof e == "string",
  num: (e) => typeof e == "number",
  und: (e) => e === void 0
};
function Ye(e, t) {
  if (B.arr(e)) {
    if (!B.arr(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++)
      if (e[n] !== t[n]) return !1;
    return !0;
  }
  return e === t;
}
var $ = (e, t) => e.forEach(t);
function ze(e, t, n) {
  if (B.arr(e)) {
    for (let r = 0; r < e.length; r++)
      t.call(n, e[r], `${r}`);
    return;
  }
  for (const r in e)
    e.hasOwnProperty(r) && t.call(n, e[r], r);
}
var xe = (e) => B.und(e) ? [] : B.arr(e) ? e : [e];
function Ut(e, t) {
  if (e.size) {
    const n = Array.from(e);
    e.clear(), $(n, t);
  }
}
var Wt = (e, ...t) => Ut(e, (n) => n(...t)), ss = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent), as, Wl, Ke = null, Ul = !1, is = lo, Uv = (e) => {
  e.to && (Wl = e.to), e.now && (V.now = e.now), e.colors !== void 0 && (Ke = e.colors), e.skipAnimation != null && (Ul = e.skipAnimation), e.createStringInterpolator && (as = e.createStringInterpolator), e.requestAnimationFrame && V.use(e.requestAnimationFrame), e.batchedUpdates && (V.batchedUpdates = e.batchedUpdates), e.willAdvance && (is = e.willAdvance), e.frameLoop && (V.frameLoop = e.frameLoop);
}, Vt = /* @__PURE__ */ new Set(), Ae = [], Fr = [], _n = 0, Ar = {
  get idle() {
    return !Vt.size && !Ae.length;
  },
  /** Advance the given animation on every frame until idle. */
  start(e) {
    _n > e.priority ? (Vt.add(e), V.onStart(Vv)) : (Vl(e), V(uo));
  },
  /** Advance all animations by the given time. */
  advance: uo,
  /** Call this when an animation's priority changes. */
  sort(e) {
    if (_n)
      V.onFrame(() => Ar.sort(e));
    else {
      const t = Ae.indexOf(e);
      ~t && (Ae.splice(t, 1), ql(e));
    }
  },
  /**
   * Clear all animations. For testing purposes.
   *
   * ☠️ Never call this from within the frameloop.
   */
  clear() {
    Ae = [], Vt.clear();
  }
};
function Vv() {
  Vt.forEach(Vl), Vt.clear(), V(uo);
}
function Vl(e) {
  Ae.includes(e) || ql(e);
}
function ql(e) {
  Ae.splice(
    qv(Ae, (t) => t.priority > e.priority),
    0,
    e
  );
}
function uo(e) {
  const t = Fr;
  for (let n = 0; n < Ae.length; n++) {
    const r = Ae[n];
    _n = r.priority, r.idle || (is(r), r.advance(e), r.idle || t.push(r));
  }
  return _n = 0, Fr = Ae, Fr.length = 0, Ae = t, Ae.length > 0;
}
function qv(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
var Xv = {
  transparent: 0,
  aliceblue: 4042850303,
  antiquewhite: 4209760255,
  aqua: 16777215,
  aquamarine: 2147472639,
  azure: 4043309055,
  beige: 4126530815,
  bisque: 4293182719,
  black: 255,
  blanchedalmond: 4293643775,
  blue: 65535,
  blueviolet: 2318131967,
  brown: 2771004159,
  burlywood: 3736635391,
  burntsienna: 3934150143,
  cadetblue: 1604231423,
  chartreuse: 2147418367,
  chocolate: 3530104575,
  coral: 4286533887,
  cornflowerblue: 1687547391,
  cornsilk: 4294499583,
  crimson: 3692313855,
  cyan: 16777215,
  darkblue: 35839,
  darkcyan: 9145343,
  darkgoldenrod: 3095792639,
  darkgray: 2846468607,
  darkgreen: 6553855,
  darkgrey: 2846468607,
  darkkhaki: 3182914559,
  darkmagenta: 2332068863,
  darkolivegreen: 1433087999,
  darkorange: 4287365375,
  darkorchid: 2570243327,
  darkred: 2332033279,
  darksalmon: 3918953215,
  darkseagreen: 2411499519,
  darkslateblue: 1211993087,
  darkslategray: 793726975,
  darkslategrey: 793726975,
  darkturquoise: 13554175,
  darkviolet: 2483082239,
  deeppink: 4279538687,
  deepskyblue: 12582911,
  dimgray: 1768516095,
  dimgrey: 1768516095,
  dodgerblue: 512819199,
  firebrick: 2988581631,
  floralwhite: 4294635775,
  forestgreen: 579543807,
  fuchsia: 4278255615,
  gainsboro: 3705462015,
  ghostwhite: 4177068031,
  gold: 4292280575,
  goldenrod: 3668254975,
  gray: 2155905279,
  green: 8388863,
  greenyellow: 2919182335,
  grey: 2155905279,
  honeydew: 4043305215,
  hotpink: 4285117695,
  indianred: 3445382399,
  indigo: 1258324735,
  ivory: 4294963455,
  khaki: 4041641215,
  lavender: 3873897215,
  lavenderblush: 4293981695,
  lawngreen: 2096890111,
  lemonchiffon: 4294626815,
  lightblue: 2916673279,
  lightcoral: 4034953471,
  lightcyan: 3774873599,
  lightgoldenrodyellow: 4210742015,
  lightgray: 3553874943,
  lightgreen: 2431553791,
  lightgrey: 3553874943,
  lightpink: 4290167295,
  lightsalmon: 4288707327,
  lightseagreen: 548580095,
  lightskyblue: 2278488831,
  lightslategray: 2005441023,
  lightslategrey: 2005441023,
  lightsteelblue: 2965692159,
  lightyellow: 4294959359,
  lime: 16711935,
  limegreen: 852308735,
  linen: 4210091775,
  magenta: 4278255615,
  maroon: 2147483903,
  mediumaquamarine: 1724754687,
  mediumblue: 52735,
  mediumorchid: 3126187007,
  mediumpurple: 2473647103,
  mediumseagreen: 1018393087,
  mediumslateblue: 2070474495,
  mediumspringgreen: 16423679,
  mediumturquoise: 1221709055,
  mediumvioletred: 3340076543,
  midnightblue: 421097727,
  mintcream: 4127193855,
  mistyrose: 4293190143,
  moccasin: 4293178879,
  navajowhite: 4292783615,
  navy: 33023,
  oldlace: 4260751103,
  olive: 2155872511,
  olivedrab: 1804477439,
  orange: 4289003775,
  orangered: 4282712319,
  orchid: 3664828159,
  palegoldenrod: 4008225535,
  palegreen: 2566625535,
  paleturquoise: 2951671551,
  palevioletred: 3681588223,
  papayawhip: 4293907967,
  peachpuff: 4292524543,
  peru: 3448061951,
  pink: 4290825215,
  plum: 3718307327,
  powderblue: 2967529215,
  purple: 2147516671,
  rebeccapurple: 1714657791,
  red: 4278190335,
  rosybrown: 3163525119,
  royalblue: 1097458175,
  saddlebrown: 2336560127,
  salmon: 4202722047,
  sandybrown: 4104413439,
  seagreen: 780883967,
  seashell: 4294307583,
  sienna: 2689740287,
  silver: 3233857791,
  skyblue: 2278484991,
  slateblue: 1784335871,
  slategray: 1887473919,
  slategrey: 1887473919,
  snow: 4294638335,
  springgreen: 16744447,
  steelblue: 1182971135,
  tan: 3535047935,
  teal: 8421631,
  thistle: 3636451583,
  tomato: 4284696575,
  turquoise: 1088475391,
  violet: 4001558271,
  wheat: 4125012991,
  white: 4294967295,
  whitesmoke: 4126537215,
  yellow: 4294902015,
  yellowgreen: 2597139199
}, Ce = "[-+]?\\d*\\.?\\d+", $n = Ce + "%";
function yr(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
var Kv = new RegExp("rgb" + yr(Ce, Ce, Ce)), _v = new RegExp("rgba" + yr(Ce, Ce, Ce, Ce)), $v = new RegExp("hsl" + yr(Ce, $n, $n)), ex = new RegExp(
  "hsla" + yr(Ce, $n, $n, Ce)
), tx = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, nx = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, rx = /^#([0-9a-fA-F]{6})$/, ox = /^#([0-9a-fA-F]{8})$/;
function sx(e) {
  let t;
  return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = rx.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Ke && Ke[e] !== void 0 ? Ke[e] : (t = Kv.exec(e)) ? (At(t[1]) << 24 | // r
  At(t[2]) << 16 | // g
  At(t[3]) << 8 | // b
  255) >>> // a
  0 : (t = _v.exec(e)) ? (At(t[1]) << 24 | // r
  At(t[2]) << 16 | // g
  At(t[3]) << 8 | // b
  ca(t[4])) >>> // a
  0 : (t = tx.exec(e)) ? parseInt(
    t[1] + t[1] + // r
    t[2] + t[2] + // g
    t[3] + t[3] + // b
    "ff",
    // a
    16
  ) >>> 0 : (t = ox.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = nx.exec(e)) ? parseInt(
    t[1] + t[1] + // r
    t[2] + t[2] + // g
    t[3] + t[3] + // b
    t[4] + t[4],
    // a
    16
  ) >>> 0 : (t = $v.exec(e)) ? (aa(
    ia(t[1]),
    // h
    On(t[2]),
    // s
    On(t[3])
    // l
  ) | 255) >>> // a
  0 : (t = ex.exec(e)) ? (aa(
    ia(t[1]),
    // h
    On(t[2]),
    // s
    On(t[3])
    // l
  ) | ca(t[4])) >>> // a
  0 : null;
}
function Lr(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function aa(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t, o = 2 * n - r, s = Lr(o, r, e + 1 / 3), c = Lr(o, r, e), i = Lr(o, r, e - 1 / 3);
  return Math.round(s * 255) << 24 | Math.round(c * 255) << 16 | Math.round(i * 255) << 8;
}
function At(e) {
  const t = parseInt(e, 10);
  return t < 0 ? 0 : t > 255 ? 255 : t;
}
function ia(e) {
  return (parseFloat(e) % 360 + 360) % 360 / 360;
}
function ca(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function On(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function la(e) {
  let t = sx(e);
  if (t === null) return e;
  t = t || 0;
  const n = (t & 4278190080) >>> 24, r = (t & 16711680) >>> 16, o = (t & 65280) >>> 8, s = (t & 255) / 255;
  return `rgba(${n}, ${r}, ${o}, ${s})`;
}
var nn = (e, t, n) => {
  if (B.fun(e))
    return e;
  if (B.arr(e))
    return nn({
      range: e,
      output: t,
      extrapolate: n
    });
  if (B.str(e.output[0]))
    return as(e);
  const r = e, o = r.output, s = r.range || [0, 1], c = r.extrapolateLeft || r.extrapolate || "extend", i = r.extrapolateRight || r.extrapolate || "extend", u = r.easing || ((l) => l);
  return (l) => {
    const f = ix(l, s);
    return ax(
      l,
      s[f],
      s[f + 1],
      o[f],
      o[f + 1],
      u,
      c,
      i,
      r.map
    );
  };
};
function ax(e, t, n, r, o, s, c, i, u) {
  let l = u ? u(e) : e;
  if (l < t) {
    if (c === "identity") return l;
    c === "clamp" && (l = t);
  }
  if (l > n) {
    if (i === "identity") return l;
    i === "clamp" && (l = n);
  }
  return r === o ? r : t === n ? e <= t ? r : o : (t === -1 / 0 ? l = -l : n === 1 / 0 ? l = l - t : l = (l - t) / (n - t), l = s(l), r === -1 / 0 ? l = -l : o === 1 / 0 ? l = l + r : l = l * (o - r) + r, l);
}
function ix(e, t) {
  for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n)
    ;
  return n - 1;
}
var cx = {
  linear: (e) => e
}, rn = /* @__PURE__ */ Symbol.for("FluidValue.get"), Rt = /* @__PURE__ */ Symbol.for("FluidValue.observers"), we = (e) => !!(e && e[rn]), pe = (e) => e && e[rn] ? e[rn]() : e, ua = (e) => e[Rt] || null;
function lx(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function on(e, t) {
  const n = e[Rt];
  n && n.forEach((r) => {
    lx(r, t);
  });
}
var Xl = class {
  constructor(e) {
    if (!e && !(e = this.get))
      throw Error("Unknown getter");
    ux(this, e);
  }
}, ux = (e, t) => Kl(e, rn, t);
function Gt(e, t) {
  if (e[rn]) {
    let n = e[Rt];
    n || Kl(e, Rt, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function sn(e, t) {
  const n = e[Rt];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : e[Rt] = null, e.observerRemoved && e.observerRemoved(r, t);
  }
}
var Kl = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), Yn = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, dx = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, da = new RegExp(`(${Yn.source})(%|[a-z]+)`, "i"), fx = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, Er = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, _l = (e) => {
  const [t, n] = mx(e);
  if (!t || ss())
    return e;
  const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
  if (r)
    return r.trim();
  if (n && n.startsWith("--")) {
    const o = window.getComputedStyle(document.documentElement).getPropertyValue(n);
    return o || e;
  } else {
    if (n && Er.test(n))
      return _l(n);
    if (n)
      return n;
  }
  return e;
}, mx = (e) => {
  const t = Er.exec(e);
  if (!t) return [,];
  const [, n, r] = t;
  return [n, r];
}, Qr, hx = (e, t, n, r, o) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${o})`, $l = (e) => {
  Qr || (Qr = Ke ? (
    // match color names, ignore partial matches
    new RegExp(`(${Object.keys(Ke).join("|")})(?!\\w)`, "g")
  ) : (
    // never match
    /^\b$/
  ));
  const t = e.output.map((s) => pe(s).replace(Er, _l).replace(dx, la).replace(Qr, la)), n = t.map((s) => s.match(Yn).map(Number)), o = n[0].map(
    (s, c) => n.map((i) => {
      if (!(c in i))
        throw Error('The arity of each "output" value must be equal');
      return i[c];
    })
  ).map(
    (s) => nn({ ...e, output: s })
  );
  return (s) => {
    const c = !da.test(t[0]) && t.find((u) => da.test(u))?.replace(Yn, "");
    let i = 0;
    return t[0].replace(
      Yn,
      () => `${o[i++](s)}${c || ""}`
    ).replace(fx, hx);
  };
}, cs = "react-spring: ", eu = (e) => {
  const t = e;
  let n = !1;
  if (typeof t != "function")
    throw new TypeError(`${cs}once requires a function parameter`);
  return (...r) => {
    n || (t(...r), n = !0);
  };
}, px = eu(console.warn);
function gx() {
  px(
    `${cs}The "interpolate" function is deprecated in v9 (use "to" instead)`
  );
}
var vx = eu(console.warn);
function xx() {
  vx(
    `${cs}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`
  );
}
function Mr(e) {
  return B.str(e) && (e[0] == "#" || /\d/.test(e) || // Do not identify a CSS variable as an AnimatedString if its SSR
  !ss() && Er.test(e) || e in (Ke || {}));
}
var ls = ss() ? se : yo, bx = () => {
  const e = ve(!1);
  return ls(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
};
function tu() {
  const e = me()[1], t = bx();
  return () => {
    t.current && e(Math.random());
  };
}
var nu = (e) => se(e, wx), wx = [];
function fa(e) {
  const t = ve(void 0);
  return se(() => {
    t.current = e;
  }), t.current;
}
var an = /* @__PURE__ */ Symbol.for("Animated:node"), Ax = (e) => !!e && e[an] === e, De = (e) => e && e[an], us = (e, t) => Wv(e, an, t), Cr = (e) => e && e[an] && e[an].getPayload(), ru = class {
  constructor() {
    us(this, this);
  }
  /** Get every `AnimatedValue` used by this node. */
  getPayload() {
    return this.payload || [];
  }
}, jr = class ou extends ru {
  constructor(t) {
    super(), this._value = t, this.done = !0, this.durationProgress = 0, B.num(this._value) && (this.lastPosition = this._value);
  }
  /** @internal */
  static create(t) {
    return new ou(t);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(t, n) {
    return B.num(t) && (this.lastPosition = t, n && (t = Math.round(t / n) * n, this.done && (this.lastPosition = t))), this._value === t ? !1 : (this._value = t, !0);
  }
  reset() {
    const { done: t } = this;
    this.done = !1, B.num(this._value) && (this.elapsedTime = 0, this.durationProgress = 0, this.lastPosition = this._value, t && (this.lastVelocity = null), this.v0 = null);
  }
}, er = class su extends jr {
  constructor(t) {
    super(0), this._string = null, this._toString = nn({
      output: [t, t]
    });
  }
  /** @internal */
  static create(t) {
    return new su(t);
  }
  getValue() {
    const t = this._string;
    return t ?? (this._string = this._toString(this._value));
  }
  setValue(t) {
    if (B.str(t)) {
      if (t == this._string)
        return !1;
      this._string = t, this._value = 1;
    } else if (super.setValue(t))
      this._string = null;
    else
      return !1;
    return !0;
  }
  reset(t) {
    t && (this._toString = nn({
      output: [this.getValue(), t]
    })), this._value = 0, super.reset();
  }
}, tr = { dependencies: null }, Nr = class extends ru {
  constructor(e) {
    super(), this.source = e, this.setValue(e);
  }
  getValue(e) {
    const t = {};
    return ze(this.source, (n, r) => {
      Ax(n) ? t[r] = n.getValue(e) : we(n) ? t[r] = pe(n) : e || (t[r] = n);
    }), t;
  }
  /** Replace the raw object data */
  setValue(e) {
    this.source = e, this.payload = this._makePayload(e);
  }
  reset() {
    this.payload && $(this.payload, (e) => e.reset());
  }
  /** Create a payload set. */
  _makePayload(e) {
    if (e) {
      const t = /* @__PURE__ */ new Set();
      return ze(e, this._addToPayload, t), Array.from(t);
    }
  }
  /** Add to a payload set. */
  _addToPayload(e) {
    tr.dependencies && we(e) && tr.dependencies.add(e);
    const t = Cr(e);
    t && $(t, (n) => this.add(n));
  }
}, yx = class au extends Nr {
  constructor(t) {
    super(t);
  }
  /** @internal */
  static create(t) {
    return new au(t);
  }
  getValue() {
    return this.source.map((t) => t.getValue());
  }
  setValue(t) {
    const n = this.getPayload();
    return t.length == n.length ? n.map((r, o) => r.setValue(t[o])).some(Boolean) : (super.setValue(t.map(Ex)), !0);
  }
};
function Ex(e) {
  return (Mr(e) ? er : jr).create(e);
}
function fo(e) {
  const t = De(e);
  return t ? t.constructor : B.arr(e) ? yx : Mr(e) ? er : jr;
}
var ma = (e, t) => {
  const n = (
    // Function components must use "forwardRef" to avoid being
    // re-rendered on every animation frame.
    !B.fun(e) || e.prototype && e.prototype.isReactComponent
  );
  return or((r, o) => {
    const s = ve(null), c = n && // eslint-disable-next-line react-hooks/rules-of-hooks
    ct(
      (v) => {
        s.current = jx(o, v);
      },
      [o]
    ), [i, u] = Cx(r, t), l = tu(), f = () => {
      const v = s.current;
      if (n && !v)
        return;
      (v ? t.applyAnimatedValues(v, i.getValue(!0)) : !1) === !1 && l();
    }, d = new Mx(f, u), m = ve(void 0);
    ls(() => (m.current = d, $(u, (v) => Gt(v, d)), () => {
      m.current && ($(
        m.current.deps,
        (v) => sn(v, m.current)
      ), V.cancel(m.current.update));
    })), se(f, []), nu(() => () => {
      const v = m.current;
      $(v.deps, (g) => sn(g, v));
    });
    const p = t.getComponentProps(i.getValue());
    return /* @__PURE__ */ h.createElement(e, { ...p, ref: c });
  });
}, Mx = class {
  constructor(e, t) {
    this.update = e, this.deps = t;
  }
  eventObserved(e) {
    e.type == "change" && V.write(this.update);
  }
};
function Cx(e, t) {
  const n = /* @__PURE__ */ new Set();
  return tr.dependencies = n, e.style && (e = {
    ...e,
    style: t.createAnimatedStyle(e.style)
  }), e = new Nr(e), tr.dependencies = null, [e, n];
}
function jx(e, t) {
  return e && (B.fun(e) ? e(t) : e.current = t), t;
}
var ha = /* @__PURE__ */ Symbol.for("AnimatedComponent"), Nx = (e, {
  applyAnimatedValues: t = () => !1,
  createAnimatedStyle: n = (o) => new Nr(o),
  getComponentProps: r = (o) => o
} = {}) => {
  const o = {
    applyAnimatedValues: t,
    createAnimatedStyle: n,
    getComponentProps: r
  }, s = (c) => {
    const i = pa(c) || "Anonymous";
    return B.str(c) ? c = s[c] || (s[c] = ma(c, o)) : c = c[ha] || (c[ha] = ma(c, o)), c.displayName = `Animated(${i})`, c;
  };
  return ze(e, (c, i) => {
    B.arr(e) && (i = pa(c)), s[i] = s(c);
  }), {
    animated: s
  };
}, pa = (e) => B.str(e) ? e : e && B.str(e.displayName) ? e.displayName : B.fun(e) && e.name || null;
function it(e, ...t) {
  return B.fun(e) ? e(...t) : e;
}
var qt = (e, t) => e === !0 || !!(t && e && (B.fun(e) ? e(t) : xe(e).includes(t))), iu = (e, t) => B.obj(e) ? t && e[t] : e, cu = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, Ix = (e) => e, ds = (e, t = Ix) => {
  let n = Sx;
  e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
  const r = {};
  for (const o of n) {
    const s = t(e[o], o);
    B.und(s) || (r[o] = s);
  }
  return r;
}, Sx = [
  "config",
  "onProps",
  "onStart",
  "onChange",
  "onPause",
  "onResume",
  "onRest"
], Dx = {
  config: 1,
  from: 1,
  to: 1,
  ref: 1,
  loop: 1,
  reset: 1,
  pause: 1,
  cancel: 1,
  reverse: 1,
  immediate: 1,
  default: 1,
  delay: 1,
  onProps: 1,
  onStart: 1,
  onChange: 1,
  onPause: 1,
  onResume: 1,
  onRest: 1,
  onResolve: 1,
  // Transition props
  items: 1,
  trail: 1,
  sort: 1,
  expires: 1,
  initial: 1,
  enter: 1,
  update: 1,
  leave: 1,
  children: 1,
  onDestroyed: 1,
  // Internal props
  keys: 1,
  callId: 1,
  parentId: 1
};
function kx(e) {
  const t = {};
  let n = 0;
  if (ze(e, (r, o) => {
    Dx[o] || (t[o] = r, n++);
  }), n)
    return t;
}
function lu(e) {
  const t = kx(e);
  if (t) {
    const n = { to: t };
    return ze(e, (r, o) => o in t || (n[o] = r)), n;
  }
  return { ...e };
}
function cn(e) {
  return e = pe(e), B.arr(e) ? e.map(cn) : Mr(e) ? Ie.createStringInterpolator({
    range: [0, 1],
    output: [e, e]
  })(1) : e;
}
function Rx(e) {
  for (const t in e) return !0;
  return !1;
}
function mo(e) {
  return B.fun(e) || B.arr(e) && B.obj(e[0]);
}
function Px(e, t) {
  e.ref?.delete(e), t?.delete(e);
}
function Ox(e, t) {
  t && e.ref !== t && (e.ref?.delete(e), t.add(e), e.ref = t);
}
var zx = {
  default: { tension: 170, friction: 26 }
}, ho = {
  ...zx.default,
  mass: 1,
  damping: 1,
  easing: cx.linear,
  clamp: !1
}, Bx = class {
  constructor() {
    this.velocity = 0, Object.assign(this, ho);
  }
};
function Gx(e, t, n) {
  n && (n = { ...n }, ga(n, t), t = { ...n, ...t }), ga(e, t), Object.assign(e, t);
  for (const c in ho)
    e[c] == null && (e[c] = ho[c]);
  let { frequency: r, damping: o } = e;
  const { mass: s } = e;
  return B.und(r) || (r < 0.01 && (r = 0.01), o < 0 && (o = 0), e.tension = Math.pow(2 * Math.PI / r, 2) * s, e.friction = 4 * Math.PI * o * s / r), e;
}
function ga(e, t) {
  if (!B.und(t.decay))
    e.duration = void 0;
  else {
    const n = !B.und(t.tension) || !B.und(t.friction);
    (n || !B.und(t.frequency) || !B.und(t.damping) || !B.und(t.mass)) && (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0);
  }
}
var va = [], Tx = class {
  constructor() {
    this.changed = !1, this.values = va, this.toValues = null, this.fromValues = va, this.config = new Bx(), this.immediate = !1;
  }
};
function uu(e, { key: t, props: n, defaultProps: r, state: o, actions: s }) {
  return new Promise((c, i) => {
    let u, l, f = qt(n.cancel ?? r?.cancel, t);
    if (f)
      p();
    else {
      B.und(n.pause) || (o.paused = qt(n.pause, t));
      let v = r?.pause;
      v !== !0 && (v = o.paused || qt(v, t)), u = it(n.delay || 0, t), v ? (o.resumeQueue.add(m), s.pause()) : (s.resume(), m());
    }
    function d() {
      o.resumeQueue.add(m), o.timeouts.delete(l), l.cancel(), u = l.time - V.now();
    }
    function m() {
      u > 0 && !Ie.skipAnimation ? (o.delayed = !0, l = V.setTimeout(p, u), o.pauseQueue.add(d), o.timeouts.add(l)) : p();
    }
    function p() {
      o.delayed && (o.delayed = !1), o.pauseQueue.delete(d), o.timeouts.delete(l), e <= (o.cancelId || 0) && (f = !0);
      try {
        s.start({ ...n, callId: e, cancel: f }, c);
      } catch (v) {
        i(v);
      }
    }
  });
}
var fs = (e, t) => t.length == 1 ? t[0] : t.some((n) => n.cancelled) ? St(e.get()) : t.every((n) => n.noop) ? du(e.get()) : Me(
  e.get(),
  t.every((n) => n.finished)
), du = (e) => ({
  value: e,
  noop: !0,
  finished: !0,
  cancelled: !1
}), Me = (e, t, n = !1) => ({
  value: e,
  finished: t,
  cancelled: n
}), St = (e) => ({
  value: e,
  cancelled: !0,
  finished: !1
});
function fu(e, t, n, r) {
  const { callId: o, parentId: s, onRest: c } = t, { asyncTo: i, promise: u } = n;
  return !s && e === i && !t.reset ? u : n.promise = (async () => {
    n.asyncId = o, n.asyncTo = e;
    const l = ds(
      t,
      (x, b) => (
        // The `onRest` prop is only called when the `runAsync` promise is resolved.
        b === "onRest" ? void 0 : x
      )
    );
    let f, d;
    const m = new Promise(
      (x, b) => (f = x, d = b)
    ), p = (x) => {
      const b = (
        // The `cancel` prop or `stop` method was used.
        o <= (n.cancelId || 0) && St(r) || // The async `to` prop was replaced.
        o !== n.asyncId && Me(r, !1)
      );
      if (b)
        throw x.result = b, d(x), x;
    }, v = (x, b) => {
      const A = new xa(), w = new ba();
      return (async () => {
        if (Ie.skipAnimation)
          throw ln(n), w.result = Me(r, !1), d(w), w;
        p(A);
        const E = B.obj(x) ? { ...x } : { ...b, to: x };
        E.parentId = o, ze(l, (P, k) => {
          B.und(E[k]) && (E[k] = P);
        });
        const j = await r.start(E);
        return p(A), n.paused && await new Promise((P) => {
          n.resumeQueue.add(P);
        }), j;
      })();
    };
    let g;
    if (Ie.skipAnimation)
      return ln(n), Me(r, !1);
    try {
      let x;
      B.arr(e) ? x = (async (b) => {
        for (const A of b)
          await v(A);
      })(e) : x = Promise.resolve(e(v, r.stop.bind(r))), await Promise.all([x.then(f), m]), g = Me(r.get(), !0, !1);
    } catch (x) {
      if (x instanceof xa)
        g = x.result;
      else if (x instanceof ba)
        g = x.result;
      else
        throw x;
    } finally {
      o == n.asyncId && (n.asyncId = s, n.asyncTo = s ? i : void 0, n.promise = s ? u : void 0);
    }
    return B.fun(c) && V.batchedUpdates(() => {
      c(g, r, r.item);
    }), g;
  })();
}
function ln(e, t) {
  Ut(e.timeouts, (n) => n.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t);
}
var xa = class extends Error {
  constructor() {
    super(
      "An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."
    );
  }
}, ba = class extends Error {
  constructor() {
    super("SkipAnimationSignal");
  }
}, po = (e) => e instanceof ms, Yx = 1, ms = class extends Xl {
  constructor() {
    super(...arguments), this.id = Yx++, this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(e) {
    this._priority != e && (this._priority = e, this._onPriorityChange(e));
  }
  /** Get the current value */
  get() {
    const e = De(this);
    return e && e.getValue();
  }
  /** Create a spring that maps our value to another value */
  to(...e) {
    return Ie.to(this, e);
  }
  /** @deprecated Use the `to` method instead. */
  interpolate(...e) {
    return gx(), Ie.to(this, e);
  }
  toJSON() {
    return this.get();
  }
  observerAdded(e) {
    e == 1 && this._attach();
  }
  observerRemoved(e) {
    e == 0 && this._detach();
  }
  /** Called when the first child is added. */
  _attach() {
  }
  /** Called when the last child is removed. */
  _detach() {
  }
  /** Tell our children about our new value */
  _onChange(e, t = !1) {
    on(this, {
      type: "change",
      parent: this,
      value: e,
      idle: t
    });
  }
  /** Tell our children about our new priority */
  _onPriorityChange(e) {
    this.idle || Ar.sort(this), on(this, {
      type: "priority",
      parent: this,
      priority: e
    });
  }
}, ht = /* @__PURE__ */ Symbol.for("SpringPhase"), mu = 1, go = 2, vo = 4, Zr = (e) => (e[ht] & mu) > 0, We = (e) => (e[ht] & go) > 0, Lt = (e) => (e[ht] & vo) > 0, wa = (e, t) => t ? e[ht] |= go | mu : e[ht] &= ~go, Aa = (e, t) => t ? e[ht] |= vo : e[ht] &= ~vo, Hx = class extends ms {
  constructor(e, t) {
    if (super(), this.animation = new Tx(), this.defaultProps = {}, this._state = {
      paused: !1,
      delayed: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._pendingCalls = /* @__PURE__ */ new Set(), this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !B.und(e) || !B.und(t)) {
      const n = B.obj(e) ? { ...e } : { ...t, from: e };
      B.und(n.default) && (n.default = !0), this.start(n);
    }
  }
  /** Equals true when not advancing on each frame. */
  get idle() {
    return !(We(this) || this._state.asyncTo) || Lt(this);
  }
  get goal() {
    return pe(this.animation.to);
  }
  get velocity() {
    const e = De(this);
    return e instanceof jr ? e.lastVelocity || 0 : e.getPayload().map((t) => t.lastVelocity || 0);
  }
  /**
   * When true, this value has been animated at least once.
   */
  get hasAnimated() {
    return Zr(this);
  }
  /**
   * When true, this value has an unfinished animation,
   * which is either active or paused.
   */
  get isAnimating() {
    return We(this);
  }
  /**
   * When true, all current and future animations are paused.
   */
  get isPaused() {
    return Lt(this);
  }
  /**
   *
   *
   */
  get isDelayed() {
    return this._state.delayed;
  }
  /** Advance the current animation by a number of milliseconds */
  advance(e) {
    let t = !0, n = !1;
    const r = this.animation;
    let { toValues: o } = r;
    const { config: s } = r, c = Cr(r.to);
    !c && we(r.to) && (o = xe(pe(r.to))), r.values.forEach((l, f) => {
      if (l.done) return;
      const d = (
        // Animated strings always go from 0 to 1.
        l.constructor == er ? 1 : c ? c[f].lastPosition : o[f]
      );
      let m = r.immediate, p = d;
      if (!m) {
        if (p = l.lastPosition, s.tension <= 0) {
          l.done = !0;
          return;
        }
        let v = l.elapsedTime += e;
        const g = r.fromValues[f], x = l.v0 != null ? l.v0 : l.v0 = B.arr(s.velocity) ? s.velocity[f] : s.velocity;
        let b;
        const A = s.precision || (g == d ? 5e-3 : Math.min(1, Math.abs(d - g) * 1e-3));
        if (B.und(s.duration))
          if (s.decay) {
            const w = s.decay === !0 ? 0.998 : s.decay, E = Math.exp(-(1 - w) * v);
            p = g + x / (1 - w) * (1 - E), m = Math.abs(l.lastPosition - p) <= A, b = x * E;
          } else {
            b = l.lastVelocity == null ? x : l.lastVelocity;
            const w = s.restVelocity || A / 10, E = s.clamp ? 0 : s.bounce, j = !B.und(E), P = g == d ? l.v0 > 0 : g < d;
            let k, M = !1;
            const D = 1, Y = Math.ceil(e / D);
            for (let z = 0; z < Y && (k = Math.abs(b) > w, !(!k && (m = Math.abs(d - p) <= A, m))); ++z) {
              j && (M = p == d || p > d == P, M && (b = -b * E, p = d));
              const Z = -s.tension * 1e-6 * (p - d), q = -s.friction * 1e-3 * b, G = (Z + q) / s.mass;
              b = b + G * D, p = p + b * D;
            }
          }
        else {
          let w = 1;
          s.duration > 0 && (this._memoizedDuration !== s.duration && (this._memoizedDuration = s.duration, l.durationProgress > 0 && (l.elapsedTime = s.duration * l.durationProgress, v = l.elapsedTime += e)), w = (s.progress || 0) + v / this._memoizedDuration, w = w > 1 ? 1 : w < 0 ? 0 : w, l.durationProgress = w), p = g + s.easing(w) * (d - g), b = (p - l.lastPosition) / e, m = w == 1;
        }
        l.lastVelocity = b, Number.isNaN(p) && (console.warn("Got NaN while animating:", this), m = !0);
      }
      c && !c[f].done && (m = !1), m ? l.done = !0 : t = !1, l.setValue(p, s.round) && (n = !0);
    });
    const i = De(this), u = i.getValue();
    if (t) {
      const l = pe(r.to);
      (u !== l || n) && !s.decay ? (i.setValue(l), this._onChange(l)) : n && s.decay && this._onChange(u), this._stop();
    } else n && this._onChange(u);
  }
  /** Set the current value, while stopping the current animation */
  set(e) {
    return V.batchedUpdates(() => {
      this._stop(), this._focus(e), this._set(e);
    }), this;
  }
  /**
   * Freeze the active animation in time, as well as any updates merged
   * before `resume` is called.
   */
  pause() {
    this._update({ pause: !0 });
  }
  /** Resume the animation if paused. */
  resume() {
    this._update({ pause: !1 });
  }
  /** Skip to the end of the current animation. */
  finish() {
    if (We(this)) {
      const { to: e, config: t } = this.animation;
      V.batchedUpdates(() => {
        this._onStart(), t.decay || this._set(e, !1), this._stop();
      });
    }
    return this;
  }
  /** Push props into the pending queue. */
  update(e) {
    return (this.queue || (this.queue = [])).push(e), this;
  }
  start(e, t) {
    let n;
    return B.und(e) ? (n = this.queue || [], this.queue = []) : n = [B.obj(e) ? e : { ...t, to: e }], Promise.all(
      n.map((r) => this._update(r))
    ).then((r) => fs(this, r));
  }
  /**
   * Stop the current animation, and cancel any delayed updates.
   *
   * Pass `true` to call `onRest` with `cancelled: true`.
   */
  stop(e) {
    const { to: t } = this.animation;
    return this._focus(this.get()), ln(this._state, e && this._lastCallId), V.batchedUpdates(() => this._stop(t, e)), this;
  }
  /** Restart the animation. */
  reset() {
    this._update({ reset: !0 });
  }
  /** @internal */
  eventObserved(e) {
    e.type == "change" ? this._start() : e.type == "priority" && (this.priority = e.priority + 1);
  }
  /**
   * Parse the `to` and `from` range from the given `props` object.
   *
   * This also ensures the initial value is available to animated components
   * during the render phase.
   */
  _prepareNode(e) {
    const t = this.key || "";
    let { to: n, from: r } = e;
    n = B.obj(n) ? n[t] : n, (n == null || mo(n)) && (n = void 0), r = B.obj(r) ? r[t] : r, r == null && (r = void 0);
    const o = { to: n, from: r };
    return Zr(this) || (e.reverse && ([n, r] = [r, n]), r = pe(r), B.und(r) ? De(this) || this._set(n) : this._set(r)), o;
  }
  /** Every update is processed by this method before merging. */
  _update({ ...e }, t) {
    const { key: n, defaultProps: r } = this;
    e.default && Object.assign(
      r,
      ds(
        e,
        (c, i) => /^on/.test(i) ? iu(c, n) : c
      )
    ), Ea(this, e, "onProps"), Zt(this, "onProps", e, this);
    const o = this._prepareNode(e);
    if (Object.isFrozen(this))
      throw Error(
        "Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?"
      );
    const s = this._state;
    return uu(++this._lastCallId, {
      key: n,
      props: e,
      defaultProps: r,
      state: s,
      actions: {
        pause: () => {
          Lt(this) || (Aa(this, !0), Wt(s.pauseQueue), Zt(
            this,
            "onPause",
            Me(this, Qt(this, this.animation.to)),
            this
          ));
        },
        resume: () => {
          Lt(this) && (Aa(this, !1), We(this) && this._resume(), Wt(s.resumeQueue), Zt(
            this,
            "onResume",
            Me(this, Qt(this, this.animation.to)),
            this
          ));
        },
        start: this._merge.bind(this, o)
      }
    }).then((c) => {
      if (e.loop && c.finished && !(t && c.noop)) {
        const i = hu(e);
        if (i)
          return this._update(i, !0);
      }
      return c;
    });
  }
  /** Merge props into the current animation */
  _merge(e, t, n) {
    if (t.cancel)
      return this.stop(!0), n(St(this));
    const r = !B.und(e.to), o = !B.und(e.from);
    if (r || o)
      if (t.callId > this._lastToId)
        this._lastToId = t.callId;
      else
        return n(St(this));
    const { key: s, defaultProps: c, animation: i } = this, { to: u, from: l } = i;
    let { to: f = u, from: d = l } = e;
    o && !r && (!t.default || B.und(f)) && (f = d), t.reverse && ([f, d] = [d, f]);
    const m = !Ye(d, l);
    m && (i.from = d), d = pe(d);
    const p = !Ye(f, u);
    p && this._focus(f);
    const v = mo(t.to), { config: g } = i, { decay: x, velocity: b } = g;
    (r || o) && (g.velocity = 0), t.config && !v && Gx(
      g,
      it(t.config, s),
      // Avoid calling the same "config" prop twice.
      t.config !== c.config ? it(c.config, s) : void 0
    );
    let A = De(this);
    if (!A || B.und(f))
      return n(Me(this, !0));
    const w = (
      // When `reset` is undefined, the `from` prop implies `reset: true`,
      // except for declarative updates. When `reset` is defined, there
      // must exist a value to animate from.
      B.und(t.reset) ? o && !t.default : !B.und(d) && qt(t.reset, s)
    ), E = w ? d : this.get(), j = cn(f), P = B.num(j) || B.arr(j) || Mr(j), k = !v && (!P || qt(c.immediate || t.immediate, s));
    if (p) {
      const z = fo(f);
      if (z !== A.constructor)
        if (k)
          A = this._set(j);
        else
          throw Error(
            `Cannot animate between ${A.constructor.name} and ${z.name}, as the "to" prop suggests`
          );
    }
    const M = A.constructor;
    let D = we(f), Y = !1;
    if (!D) {
      const z = w || !Zr(this) && m;
      (p || z) && (Y = Ye(cn(E), j), D = !Y), (!Ye(i.immediate, k) && !k || !Ye(g.decay, x) || !Ye(g.velocity, b)) && (D = !0);
    }
    if (Y && We(this) && (i.changed && !w ? D = !0 : D || this._stop(u)), !v && ((D || we(u)) && (i.values = A.getPayload(), i.toValues = we(f) ? null : M == er ? [1] : xe(j)), i.immediate != k && (i.immediate = k, !k && !w && this._set(u)), D)) {
      const { onRest: z } = i;
      $(Lx, (q) => Ea(this, t, q));
      const Z = Me(this, Qt(this, u));
      Wt(this._pendingCalls, Z), this._pendingCalls.add(n), i.changed && V.batchedUpdates(() => {
        i.changed = !w, z?.(Z, this), w ? it(c.onRest, Z) : i.onStart?.(Z, this);
      });
    }
    w && this._set(E), v ? n(fu(t.to, t, this._state, this)) : D ? this._start() : We(this) && !p ? this._pendingCalls.add(n) : n(du(E));
  }
  /** Update the `animation.to` value, which might be a `FluidValue` */
  _focus(e) {
    const t = this.animation;
    e !== t.to && (ua(this) && this._detach(), t.to = e, ua(this) && this._attach());
  }
  _attach() {
    let e = 0;
    const { to: t } = this.animation;
    we(t) && (Gt(t, this), po(t) && (e = t.priority + 1)), this.priority = e;
  }
  _detach() {
    const { to: e } = this.animation;
    we(e) && sn(e, this);
  }
  /**
   * Update the current value from outside the frameloop,
   * and return the `Animated` node.
   */
  _set(e, t = !0) {
    const n = pe(e);
    if (!B.und(n)) {
      const r = De(this);
      if (!r || !Ye(n, r.getValue())) {
        const o = fo(n);
        !r || r.constructor != o ? us(this, o.create(n)) : r.setValue(n), r && V.batchedUpdates(() => {
          this._onChange(n, t);
        });
      }
    }
    return De(this);
  }
  _onStart() {
    const e = this.animation;
    e.changed || (e.changed = !0, Zt(
      this,
      "onStart",
      Me(this, Qt(this, e.to)),
      this
    ));
  }
  _onChange(e, t) {
    t || (this._onStart(), it(this.animation.onChange, e, this)), it(this.defaultProps.onChange, e, this), super._onChange(e, t);
  }
  // This method resets the animation state (even if already animating) to
  // ensure the latest from/to range is used, and it also ensures this spring
  // is added to the frameloop.
  _start() {
    const e = this.animation;
    De(this).reset(pe(e.to)), e.immediate || (e.fromValues = e.values.map((t) => t.lastPosition)), We(this) || (wa(this, !0), Lt(this) || this._resume());
  }
  _resume() {
    Ie.skipAnimation ? this.finish() : Ar.start(this);
  }
  /**
   * Exit the frameloop and notify `onRest` listeners.
   *
   * Always wrap `_stop` calls with `batchedUpdates`.
   */
  _stop(e, t) {
    if (We(this)) {
      wa(this, !1);
      const n = this.animation;
      $(n.values, (o) => {
        o.done = !0;
      }), n.toValues && (n.onChange = n.onPause = n.onResume = void 0), on(this, {
        type: "idle",
        parent: this
      });
      const r = t ? St(this.get()) : Me(this.get(), Qt(this, e ?? n.to));
      Wt(this._pendingCalls, r), n.changed && (n.changed = !1, Zt(this, "onRest", r, this));
    }
  }
};
function Qt(e, t) {
  const n = cn(t), r = cn(e.get());
  return Ye(r, n);
}
function hu(e, t = e.loop, n = e.to) {
  const r = it(t);
  if (r) {
    const o = r !== !0 && lu(r), s = (o || e).reverse, c = !o || o.reset;
    return un({
      ...e,
      loop: t,
      // Avoid updating default props when looping.
      default: !1,
      // Never loop the `pause` prop.
      pause: void 0,
      // For the "reverse" prop to loop as expected, the "to" prop
      // must be undefined. The "reverse" prop is ignored when the
      // "to" prop is an array or function.
      to: !s || mo(n) ? n : void 0,
      // Ignore the "from" prop except on reset.
      from: c ? e.from : void 0,
      reset: c,
      // The "loop" prop can return a "useSpring" props object to
      // override any of the original props.
      ...o
    });
  }
}
function un(e) {
  const { to: t, from: n } = e = lu(e), r = /* @__PURE__ */ new Set();
  return B.obj(t) && ya(t, r), B.obj(n) && ya(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function Fx(e) {
  const t = un(e);
  return B.und(t.default) && (t.default = ds(t)), t;
}
function ya(e, t) {
  ze(e, (n, r) => n != null && t.add(r));
}
var Lx = [
  "onStart",
  "onRest",
  "onChange",
  "onPause",
  "onResume"
];
function Ea(e, t, n) {
  e.animation[n] = t[n] !== cu(t, n) ? iu(t[n], e.key) : void 0;
}
function Zt(e, t, ...n) {
  e.animation[t]?.(...n), e.defaultProps[t]?.(...n);
}
var Qx = ["onStart", "onChange", "onRest"], Zx = 1, Jx = class {
  constructor(e, t) {
    this.id = Zx++, this.springs = {}, this.queue = [], this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._state = {
      paused: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._events = {
      onStart: /* @__PURE__ */ new Map(),
      onChange: /* @__PURE__ */ new Map(),
      onRest: /* @__PURE__ */ new Map()
    }, this._onFrame = this._onFrame.bind(this), t && (this._flush = t), e && this.start({ default: !0, ...e });
  }
  /**
   * Equals `true` when no spring values are in the frameloop, and
   * no async animation is currently active.
   */
  get idle() {
    return !this._state.asyncTo && Object.values(this.springs).every((e) => e.idle && !e.isDelayed && !e.isPaused);
  }
  get item() {
    return this._item;
  }
  set item(e) {
    this._item = e;
  }
  /** Get the current values of our springs */
  get() {
    const e = {};
    return this.each((t, n) => e[n] = t.get()), e;
  }
  /** Set the current values without animating. */
  set(e) {
    for (const t in e) {
      const n = e[t];
      B.und(n) || this.springs[t].set(n);
    }
  }
  /** Push an update onto the queue of each value. */
  update(e) {
    return e && this.queue.push(un(e)), this;
  }
  /**
   * Start the queued animations for every spring, and resolve the returned
   * promise once all queued animations have finished or been cancelled.
   *
   * When you pass a queue (instead of nothing), that queue is used instead of
   * the queued animations added with the `update` method, which are left alone.
   */
  start(e) {
    let { queue: t } = this;
    return e ? t = xe(e).map(un) : this.queue = [], this._flush ? this._flush(this, t) : (bu(this, t), xo(this, t));
  }
  /** @internal */
  stop(e, t) {
    if (e !== !!e && (t = e), t) {
      const n = this.springs;
      $(xe(t), (r) => n[r].stop(!!e));
    } else
      ln(this._state, this._lastAsyncId), this.each((n) => n.stop(!!e));
    return this;
  }
  /** Freeze the active animation in time */
  pause(e) {
    if (B.und(e))
      this.start({ pause: !0 });
    else {
      const t = this.springs;
      $(xe(e), (n) => t[n].pause());
    }
    return this;
  }
  /** Resume the animation if paused. */
  resume(e) {
    if (B.und(e))
      this.start({ pause: !1 });
    else {
      const t = this.springs;
      $(xe(e), (n) => t[n].resume());
    }
    return this;
  }
  /** Call a function once per spring value */
  each(e) {
    ze(this.springs, e);
  }
  /** @internal Called at the end of every animation frame */
  _onFrame() {
    const { onStart: e, onChange: t, onRest: n } = this._events, r = this._active.size > 0, o = this._changed.size > 0;
    (r && !this._started || o && !this._started) && (this._started = !0, Ut(e, ([i, u]) => {
      u.value = this.get(), i(u, this, this._item);
    }));
    const s = !r && this._started, c = o || s && n.size ? this.get() : null;
    o && t.size && Ut(t, ([i, u]) => {
      u.value = c, i(u, this, this._item);
    }), s && (this._started = !1, Ut(n, ([i, u]) => {
      u.value = c, i(u, this, this._item);
    }));
  }
  /** @internal */
  eventObserved(e) {
    if (e.type == "change")
      this._changed.add(e.parent), e.idle || this._active.add(e.parent);
    else if (e.type == "idle")
      this._active.delete(e.parent);
    else return;
    V.onFrame(this._onFrame);
  }
};
function xo(e, t) {
  return Promise.all(t.map((n) => pu(e, n))).then(
    (n) => fs(e, n)
  );
}
async function pu(e, t, n) {
  const { keys: r, to: o, from: s, loop: c, onRest: i, onResolve: u } = t, l = B.obj(t.default) && t.default;
  c && (t.loop = !1), o === !1 && (t.to = null), s === !1 && (t.from = null);
  const f = B.arr(o) || B.fun(o) ? o : void 0;
  f ? (t.to = void 0, t.onRest = void 0, l && (l.onRest = void 0)) : $(Qx, (g) => {
    const x = t[g];
    if (B.fun(x)) {
      const b = e._events[g];
      t[g] = ({ finished: A, cancelled: w }) => {
        const E = b.get(x);
        E ? (A || (E.finished = !1), w && (E.cancelled = !0)) : b.set(x, {
          value: null,
          finished: A || !1,
          cancelled: w || !1
        });
      }, l && (l[g] = t[g]);
    }
  });
  const d = e._state;
  t.pause === !d.paused ? (d.paused = t.pause, Wt(t.pause ? d.pauseQueue : d.resumeQueue)) : d.paused && (t.pause = !0);
  const m = (r || Object.keys(e.springs)).map(
    (g) => e.springs[g].start(t)
  ), p = t.cancel === !0 || cu(t, "cancel") === !0;
  (f || p && d.asyncId) && m.push(
    uu(++e._lastAsyncId, {
      props: t,
      state: d,
      actions: {
        pause: lo,
        resume: lo,
        start(g, x) {
          p ? (ln(d, e._lastAsyncId), x(St(e))) : (g.onRest = i, x(
            fu(
              f,
              g,
              d,
              e
            )
          ));
        }
      }
    })
  ), d.paused && await new Promise((g) => {
    d.resumeQueue.add(g);
  });
  const v = fs(e, await Promise.all(m));
  if (c && v.finished && !(n && v.noop)) {
    const g = hu(t, c, o);
    if (g)
      return bu(e, [g]), pu(e, g, !0);
  }
  return u && V.batchedUpdates(() => u(v, e, e.item)), v;
}
function Ma(e, t) {
  const n = { ...e.springs };
  return t && $(xe(t), (r) => {
    B.und(r.keys) && (r = un(r)), B.obj(r.to) || (r = { ...r, to: void 0 }), xu(n, r, (o) => vu(o));
  }), gu(e, n), n;
}
function gu(e, t) {
  ze(t, (n, r) => {
    e.springs[r] || (e.springs[r] = n, Gt(n, e));
  });
}
function vu(e, t) {
  const n = new Hx();
  return n.key = e, t && Gt(n, t), n;
}
function xu(e, t, n) {
  t.keys && $(t.keys, (r) => {
    (e[r] || (e[r] = n(r)))._prepareNode(t);
  });
}
function bu(e, t) {
  $(t, (n) => {
    xu(e.springs, n, (r) => vu(r, e));
  });
}
var Wx = h.createContext({
  pause: !1,
  immediate: !1
}), Ux = () => {
  const e = [], t = function(r) {
    xx();
    const o = [];
    return $(e, (s, c) => {
      if (B.und(r))
        o.push(s.start());
      else {
        const i = n(r, s, c);
        i && o.push(s.start(i));
      }
    }), o;
  };
  t.current = e, t.add = function(r) {
    e.includes(r) || e.push(r);
  }, t.delete = function(r) {
    const o = e.indexOf(r);
    ~o && e.splice(o, 1);
  }, t.pause = function() {
    return $(e, (r) => r.pause(...arguments)), this;
  }, t.resume = function() {
    return $(e, (r) => r.resume(...arguments)), this;
  }, t.set = function(r) {
    $(e, (o, s) => {
      const c = B.fun(r) ? r(s, o) : r;
      c && o.set(c);
    });
  }, t.start = function(r) {
    const o = [];
    return $(e, (s, c) => {
      if (B.und(r))
        o.push(s.start());
      else {
        const i = this._getProps(r, s, c);
        i && o.push(s.start(i));
      }
    }), o;
  }, t.stop = function() {
    return $(e, (r) => r.stop(...arguments)), this;
  }, t.update = function(r) {
    return $(e, (o, s) => o.update(this._getProps(r, o, s))), this;
  };
  const n = function(r, o, s) {
    return B.fun(r) ? r(s, o) : r;
  };
  return t._getProps = n, t;
};
function Vx(e, t, n) {
  const r = B.fun(t) && t;
  r && !n && (n = []);
  const o = fe(
    () => r || arguments.length == 3 ? Ux() : void 0,
    []
  ), s = ve(0), c = tu(), i = fe(
    () => ({
      ctrls: [],
      queue: [],
      flush(b, A) {
        const w = Ma(b, A);
        return s.current > 0 && !i.queue.length && !Object.keys(w).some((j) => !b.springs[j]) ? xo(b, A) : new Promise((j) => {
          gu(b, w), i.queue.push(() => {
            j(xo(b, A));
          }), c();
        });
      }
    }),
    []
  ), u = ve([...i.ctrls]), l = ve([]), f = fa(e) || 0;
  fe(() => {
    $(u.current.slice(e, f), (b) => {
      Px(b, o), b.stop(!0);
    }), u.current.length = e, d(f, e);
  }, [e]), fe(() => {
    d(0, Math.min(f, e));
  }, n);
  function d(b, A) {
    for (let w = b; w < A; w++) {
      const E = u.current[w] || (u.current[w] = new Jx(null, i.flush)), j = r ? r(w, E) : t[w];
      j && (l.current[w] = Fx(j));
    }
  }
  const m = u.current.map(
    (b, A) => Ma(b, l.current[A])
  ), p = Pt(Wx), v = fa(p), g = p !== v && Rx(p);
  ls(() => {
    s.current++, i.ctrls = u.current;
    const { queue: b } = i;
    b.length && (i.queue = [], $(b, (A) => A())), $(u.current, (A, w) => {
      o?.add(A), g && A.start({ default: p });
      const E = l.current[w];
      E && (Ox(A, E.ref), A.ref ? A.queue.push(E) : A.start(E));
    });
  }), nu(() => () => {
    $(i.ctrls, (b) => b.stop(!0));
  });
  const x = m.map((b) => ({ ...b }));
  return o ? [x, o] : x;
}
function wu(e, t) {
  const n = B.fun(e), [[r], o] = Vx(
    1,
    n ? e : [e],
    n ? [] : t
  );
  return n || arguments.length == 2 ? [r, o] : r;
}
var qx = class extends ms {
  constructor(e, t) {
    super(), this.source = e, this.idle = !0, this._active = /* @__PURE__ */ new Set(), this.calc = nn(...t);
    const n = this._get(), r = fo(n);
    us(this, r.create(n));
  }
  advance(e) {
    const t = this._get(), n = this.get();
    Ye(t, n) || (De(this).setValue(t), this._onChange(t, this.idle)), !this.idle && Ca(this._active) && Jr(this);
  }
  _get() {
    const e = B.arr(this.source) ? this.source.map(pe) : xe(pe(this.source));
    return this.calc(...e);
  }
  _start() {
    this.idle && !Ca(this._active) && (this.idle = !1, $(Cr(this), (e) => {
      e.done = !1;
    }), Ie.skipAnimation ? (V.batchedUpdates(() => this.advance()), Jr(this)) : Ar.start(this));
  }
  // Observe our sources only when we're observed.
  _attach() {
    let e = 1;
    $(xe(this.source), (t) => {
      we(t) && Gt(t, this), po(t) && (t.idle || this._active.add(t), e = Math.max(e, t.priority + 1));
    }), this.priority = e, this._start();
  }
  // Stop observing our sources once we have no observers.
  _detach() {
    $(xe(this.source), (e) => {
      we(e) && sn(e, this);
    }), this._active.clear(), Jr(this);
  }
  /** @internal */
  eventObserved(e) {
    e.type == "change" ? e.idle ? this.advance() : (this._active.add(e.parent), this._start()) : e.type == "idle" ? this._active.delete(e.parent) : e.type == "priority" && (this.priority = xe(this.source).reduce(
      (t, n) => Math.max(t, (po(n) ? n.priority : 0) + 1),
      0
    ));
  }
};
function Xx(e) {
  return e.idle !== !1;
}
function Ca(e) {
  return !e.size || Array.from(e).every(Xx);
}
function Jr(e) {
  e.idle || (e.idle = !0, $(Cr(e), (t) => {
    t.done = !0;
  }), on(e, {
    type: "idle",
    parent: e
  }));
}
Ie.assign({
  createStringInterpolator: $l,
  to: (e, t) => new qx(e, t)
});
var Au = /^--/;
function Kx(e, t) {
  return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !Au.test(e) && !(Xt.hasOwnProperty(e) && Xt[e]) ? t + "px" : ("" + t).trim();
}
var ja = {};
function _x(e, t) {
  if (!e.nodeType || !e.setAttribute)
    return !1;
  const n = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter", {
    className: r,
    style: o,
    children: s,
    scrollTop: c,
    scrollLeft: i,
    viewBox: u,
    ...l
  } = t, f = Object.values(l), d = Object.keys(l).map(
    (m) => n || e.hasAttribute(m) ? m : ja[m] || (ja[m] = m.replace(
      /([A-Z])/g,
      // Attributes are written in dash case
      (p) => "-" + p.toLowerCase()
    ))
  );
  s !== void 0 && (e.textContent = s);
  for (const m in o)
    if (o.hasOwnProperty(m)) {
      const p = Kx(m, o[m]);
      Au.test(m) ? e.style.setProperty(m, p) : e.style[m] = p;
    }
  d.forEach((m, p) => {
    e.setAttribute(m, f[p]);
  }), r !== void 0 && (e.className = r), c !== void 0 && (e.scrollTop = c), i !== void 0 && (e.scrollLeft = i), u !== void 0 && e.setAttribute("viewBox", u);
}
var Xt = {
  animationIterationCount: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  // SVG-related properties
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, $x = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), eb = ["Webkit", "Ms", "Moz", "O"];
Xt = Object.keys(Xt).reduce((e, t) => (eb.forEach((n) => e[$x(n, t)] = e[t]), e), Xt);
var tb = /^(matrix|translate|scale|rotate|skew)/, nb = /^(translate)/, rb = /^(rotate|skew)/, Wr = (e, t) => B.num(e) && e !== 0 ? e + t : e, Hn = (e, t) => B.arr(e) ? e.every((n) => Hn(n, t)) : B.num(e) ? e === t : parseFloat(e) === t, ob = class extends Nr {
  constructor({ x: e, y: t, z: n, ...r }) {
    const o = [], s = [];
    (e || t || n) && (o.push([e || 0, t || 0, n || 0]), s.push((c) => [
      `translate3d(${c.map((i) => Wr(i, "px")).join(",")})`,
      // prettier-ignore
      Hn(c, 0)
    ])), ze(r, (c, i) => {
      if (i === "transform")
        o.push([c || ""]), s.push((u) => [u, u === ""]);
      else if (tb.test(i)) {
        if (delete r[i], B.und(c)) return;
        const u = nb.test(i) ? "px" : rb.test(i) ? "deg" : "";
        o.push(xe(c)), s.push(
          i === "rotate3d" ? ([l, f, d, m]) => [
            `rotate3d(${l},${f},${d},${Wr(m, u)})`,
            Hn(m, 0)
          ] : (l) => [
            `${i}(${l.map((f) => Wr(f, u)).join(",")})`,
            Hn(l, i.startsWith("scale") ? 1 : 0)
          ]
        );
      }
    }), o.length && (r.transform = new sb(o, s)), super(r);
  }
}, sb = class extends Xl {
  constructor(e, t) {
    super(), this.inputs = e, this.transforms = t, this._value = null;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let e = "", t = !0;
    return $(this.inputs, (n, r) => {
      const o = pe(n[0]), [s, c] = this.transforms[r](
        B.arr(o) ? o : n.map(pe)
      );
      e += " " + s, t = t && c;
    }), t ? "none" : e;
  }
  // Start observing our inputs once we have an observer.
  observerAdded(e) {
    e == 1 && $(
      this.inputs,
      (t) => $(
        t,
        (n) => we(n) && Gt(n, this)
      )
    );
  }
  // Stop observing our inputs once we have no observers.
  observerRemoved(e) {
    e == 0 && $(
      this.inputs,
      (t) => $(
        t,
        (n) => we(n) && sn(n, this)
      )
    );
  }
  eventObserved(e) {
    e.type == "change" && (this._value = null), on(this, e);
  }
}, ab = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  // SVG
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
];
Ie.assign({
  batchedUpdates: Gu,
  createStringInterpolator: $l,
  colors: Xv
});
var ib = Nx(ab, {
  applyAnimatedValues: _x,
  createAnimatedStyle: (e) => new ob(e),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getComponentProps: ({ scrollTop: e, scrollLeft: t, ...n }) => n
}), yu = ib.animated;
const cb = "Save changes", lb = "Cancel", ub = "Review", db = "OBJECT", fb = "Changed", mb = 440, hb = {
  tension: 320,
  friction: 34
}, pb = 250, gb = 200;
function gw({
  pendingCount: e,
  pendingItems: t,
  saving: n = !1,
  onSave: r,
  onCancel: o,
  saveLabel: s = cb,
  cancelLabel: c = lb,
  viewUnsavedLabel: i = ub,
  pendingKeyLabel: u = db,
  pendingValueLabel: l = fb,
  dimmed: f = !1,
  disabled: d = !1,
  expandMaxHeight: m = mb,
  expandSpringConfig: p = hb,
  barTransitionMs: v = pb,
  chevronTransitionMs: g = gb
}) {
  const [x, b] = me(!1), A = e > 0, w = fe(
    () => Array.isArray(t) && t.length > 0,
    [t]
  ), E = fe(
    () => (t ?? []).some((D) => !!D.section),
    [t]
  ), j = fe(() => {
    const D = /* @__PURE__ */ new Map();
    return (t ?? []).forEach((Y) => {
      const z = Y.section?.trim() || "General", Z = D.get(z) ?? [];
      Z.push(Y), D.set(z, Z);
    }), Array.from(D.entries()).map(([Y, z]) => ({
      section: Y,
      items: z
    }));
  }, [t]), [P, k] = wu(() => ({
    maxHeight: 0,
    opacity: 0,
    config: p
  }));
  if (se(() => {
    A || b(!1);
  }, [A]), se(() => {
    const D = x && w;
    k.start({
      maxHeight: D ? m : 0,
      opacity: D ? 1 : 0,
      config: p
    });
  }, [x, w, k, m, p]), typeof document > "u")
    return null;
  const M = e === 1 ? "1 unsaved change" : `${e} unsaved changes`;
  return Tu(
    /* @__PURE__ */ a.jsx(
      "div",
      {
        className: H(
          "fixed bottom-3 left-3 right-3 z-[35] transform-gpu transition-all md:bottom-6 md:left-[calc(18rem+1.5rem)] md:right-6",
          A ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-6 opacity-0 pointer-events-none"
        ),
        style: { transitionDuration: `${v}ms` },
        children: /* @__PURE__ */ a.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ a.jsx(
            yu.div,
            {
              style: {
                maxHeight: P.maxHeight,
                opacity: P.opacity
              },
              className: "overflow-hidden",
              children: /* @__PURE__ */ a.jsx(
                "div",
                {
                  className: H(
                    "pointer-events-auto mx-auto w-[calc(100%-7rem)] overflow-auto rounded-t-[28px] border border-b-0 border-border/70 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.5)] backdrop-blur",
                    f ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/95"
                  ),
                  children: /* @__PURE__ */ a.jsxs("table", { className: "w-full text-sm", children: [
                    /* @__PURE__ */ a.jsx("thead", { className: "sticky top-0 bg-muted/70", children: /* @__PURE__ */ a.jsxs("tr", { className: "border-b border-border/70", children: [
                      /* @__PURE__ */ a.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: u }),
                      /* @__PURE__ */ a.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: l })
                    ] }) }),
                    /* @__PURE__ */ a.jsx("tbody", { children: j.map((D, Y) => /* @__PURE__ */ a.jsxs(Ou, { children: [
                      E ? /* @__PURE__ */ a.jsx("tr", { className: "border-b border-border/70 bg-muted/45", children: /* @__PURE__ */ a.jsx(
                        "td",
                        {
                          colSpan: 2,
                          className: "px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                          children: D.section
                        }
                      ) }) : null,
                      D.items.map((z, Z) => /* @__PURE__ */ a.jsxs(
                        "tr",
                        {
                          className: "border-b border-border/60 last:border-b-0",
                          children: [
                            /* @__PURE__ */ a.jsx("td", { className: "px-4 py-2.5 align-top font-medium text-foreground", children: z.key }),
                            /* @__PURE__ */ a.jsx("td", { className: "px-4 py-2.5 align-top text-muted-foreground", children: z.value })
                          ]
                        },
                        `${D.section}-${z.key}-${z.value}-${Z}`
                      ))
                    ] }, `${D.section}-${Y}`)) })
                  ] })
                }
              )
            }
          ),
          /* @__PURE__ */ a.jsxs(
            "div",
            {
              className: H(
                "pointer-events-auto relative flex min-h-[3.75rem] items-center justify-between gap-3 rounded-[999px] border border-border/70 px-4 py-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.4)] backdrop-blur-md",
                f ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/96"
              ),
              children: [
                /* @__PURE__ */ a.jsxs("div", { className: "flex min-w-0 shrink items-center gap-2.5 text-sm", children: [
                  /* @__PURE__ */ a.jsxs("span", { className: "relative flex size-2.5 shrink-0", children: [
                    /* @__PURE__ */ a.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" }),
                    /* @__PURE__ */ a.jsx("span", { className: "relative inline-flex size-2.5 rounded-full bg-amber-400" })
                  ] }),
                  /* @__PURE__ */ a.jsx("span", { className: "truncate font-medium text-foreground", children: M })
                ] }),
                /* @__PURE__ */ a.jsxs("div", { className: "flex shrink-0 flex-wrap items-center justify-end gap-1.5", children: [
                  w ? /* @__PURE__ */ a.jsxs(
                    te,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      disabled: n || d,
                      onClick: () => b((D) => !D),
                      children: [
                        /* @__PURE__ */ a.jsx(zg, { className: "size-4" }),
                        i,
                        /* @__PURE__ */ a.jsx(
                          so,
                          {
                            className: H(
                              "size-4 transition-transform",
                              x ? "rotate-0" : "rotate-180"
                            ),
                            style: { transitionDuration: `${g}ms` }
                          }
                        )
                      ]
                    }
                  ) : null,
                  o ? /* @__PURE__ */ a.jsxs(
                    te,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: o,
                      disabled: n || d,
                      children: [
                        /* @__PURE__ */ a.jsx(qo, { className: "size-4" }),
                        c
                      ]
                    }
                  ) : null,
                  /* @__PURE__ */ a.jsxs(
                    te,
                    {
                      type: "button",
                      size: "sm",
                      onClick: r,
                      disabled: n || d,
                      children: [
                        n ? /* @__PURE__ */ a.jsx(xl, { className: "size-4 animate-spin" }) : /* @__PURE__ */ a.jsx(Zg, { className: "size-4" }),
                        n ? "Saving…" : s
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      }
    ),
    document.body
  );
}
function vw({
  columns: e,
  rows: t,
  rowKey: n,
  loading: r = !1,
  loadingMessage: o = "Loading...",
  emptyMessage: s = "No records found.",
  page: c,
  pageSize: i,
  pageSizeOptions: u = [10, 25, 50],
  onPageChange: l,
  onPageSizeChange: f,
  onRowClick: d,
  paginationMode: m = "client",
  totalRowCount: p,
  sortBy: v = null,
  sortOrder: g = "asc",
  onSortChange: x,
  alignPaginationToLeft: b = !1,
  onLoadingChange: A
}) {
  const w = zu(), E = ve(null), j = ve(null), [P, k] = me(null), M = m === "server", D = M ? p ?? t.length : t.length, Y = Math.max(1, Math.ceil(D / i)), z = Math.min(c, Y - 1), Z = z * i, q = M ? t : t.slice(Z, Z + i), G = D === 0 || q.length === 0 ? 0 : Math.min(Z + q.length, D), R = z > 0, C = G < D, O = G === 0 ? "No results" : M && C ? `Showing ${Z + 1}-${G}` : `Showing ${Z + 1}-${G} of ${D}`, N = M && C ? `Page ${z + 1}` : `Page ${z + 1} of ${Y}`, S = Math.max(3, Math.min(i || 5, 8));
  se(() => {
    if (A)
      return A(w, r, o), () => {
        A(w, !1);
      };
  }, [r, o, w, A]);
  const I = (y) => {
    if (!x)
      return;
    x(y, v === y && g === "asc" ? "desc" : "asc");
  };
  return se(() => {
    const y = () => {
      if (!E.current)
        return;
      const X = E.current.closest("[data-detail-tab-content], [data-table-viewport]");
      if (!X) {
        k(null);
        return;
      }
      const _ = X;
      if (!_)
        return;
      const J = E.current.getBoundingClientRect(), oe = _.getBoundingClientRect(), ee = Math.max(0, J.top - oe.top), ne = _.clientHeight, le = j.current?.offsetHeight ?? 80, he = 16;
      if (ne <= 0) {
        k(null);
        return;
      }
      const ue = ne - ee - he;
      if (ue < 180) {
        const Pu = Math.max(40, ue - le - 8);
        k(Math.max(0, Pu));
        return;
      }
      const Ru = Math.max(100, Math.floor(ue - le - 8));
      k(Ru);
    };
    y();
    const T = window.requestAnimationFrame(y);
    window.addEventListener("resize", y);
    const Q = new ResizeObserver(y);
    E.current?.parentElement && Q.observe(E.current.parentElement);
    const W = E.current?.closest("[data-detail-tab-content], [data-table-viewport]");
    return W && Q.observe(W), Q.observe(document.documentElement), () => {
      window.cancelAnimationFrame(T), window.removeEventListener("resize", y), Q.disconnect();
    };
  }, []), /* @__PURE__ */ a.jsxs(
    "div",
    {
      ref: E,
      className: "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
      children: [
        /* @__PURE__ */ a.jsx(
          "div",
          {
            className: "min-h-0 overflow-auto",
            style: P ? { maxHeight: `${P}px` } : void 0,
            children: /* @__PURE__ */ a.jsxs(_o, { containerClassName: "overflow-x-visible", children: [
              /* @__PURE__ */ a.jsx(zv, { children: /* @__PURE__ */ a.jsx(yt, { className: "hover:bg-transparent", children: e.map((y) => /* @__PURE__ */ a.jsx(
                Bv,
                {
                  className: H("sticky top-0 z-[1] bg-card text-center", y.className),
                  children: y.sortable && x ? /* @__PURE__ */ a.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => I(y.id),
                      className: "inline-flex w-full cursor-pointer items-center justify-center gap-1 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                      children: [
                        /* @__PURE__ */ a.jsx("span", { children: y.header }),
                        v === y.id ? g === "asc" ? /* @__PURE__ */ a.jsx(so, { className: "size-3.5" }) : /* @__PURE__ */ a.jsx(vl, { className: "size-3.5" }) : /* @__PURE__ */ a.jsx(so, { className: "size-3.5 opacity-30" })
                      ]
                    }
                  ) : y.header
                },
                y.id
              )) }) }),
              /* @__PURE__ */ a.jsx($o, { children: r ? Array.from({ length: S }).map((y, T) => /* @__PURE__ */ a.jsx(yt, { className: "hover:bg-transparent", children: e.map((Q) => /* @__PURE__ */ a.jsx(ut, { className: Q.cellClassName, children: /* @__PURE__ */ a.jsx("div", { className: "h-4 w-full animate-pulse rounded bg-muted/60" }) }, `${Q.id}-skeleton-${T}`)) }, `loading-skeleton-${T}`)) : q.length === 0 ? /* @__PURE__ */ a.jsx(yt, { className: "hover:bg-transparent", children: /* @__PURE__ */ a.jsx(
                ut,
                {
                  colSpan: e.length,
                  className: "py-10 text-center text-sm text-muted-foreground",
                  children: s
                }
              ) }) : q.map((y) => /* @__PURE__ */ a.jsx(
                yt,
                {
                  className: H("odd:bg-transparent even:bg-muted/20", d && "cursor-pointer"),
                  onClick: d ? () => d(y) : void 0,
                  children: e.map((T) => /* @__PURE__ */ a.jsx(ut, { className: T.cellClassName, children: T.render(y) }, T.id))
                },
                n(y)
              )) })
            ] })
          }
        ),
        r && /* @__PURE__ */ a.jsx("div", { className: "sr-only", "aria-live": "polite", children: o }),
        /* @__PURE__ */ a.jsxs(
          "div",
          {
            ref: j,
            className: H(
              "flex-shrink-0 flex flex-col gap-3 border-t border-border/70 bg-card px-4 py-3 sm:flex-row sm:items-center",
              b ? "sm:justify-start" : "sm:justify-between"
            ),
            children: [
              /* @__PURE__ */ a.jsx("div", { className: "text-sm text-muted-foreground", children: O }),
              /* @__PURE__ */ a.jsxs("div", { className: H("flex flex-col gap-3 sm:flex-row sm:items-center", b ? "sm:ml-4" : ""), children: [
                /* @__PURE__ */ a.jsxs("label", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ a.jsx("span", { children: "Rows" }),
                  /* @__PURE__ */ a.jsx(
                    Hl,
                    {
                      value: i,
                      onValueChange: (y) => f(Number(y)),
                      options: u.map((y) => ({ value: String(y), label: String(y) })),
                      className: "h-9",
                      searchPlaceholder: "Search rows..."
                    }
                  )
                ] }),
                /* @__PURE__ */ a.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ a.jsxs(
                    te,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => l(z - 1),
                      disabled: !R,
                      children: [
                        /* @__PURE__ */ a.jsx(Cg, { className: "size-4" }),
                        "Previous"
                      ]
                    }
                  ),
                  /* @__PURE__ */ a.jsx("span", { className: "min-w-20 text-center text-sm text-muted-foreground", children: N }),
                  /* @__PURE__ */ a.jsxs(
                    te,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => l(z + 1),
                      disabled: !C,
                      children: [
                        "Next",
                        /* @__PURE__ */ a.jsx(jt, { className: "size-4" })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
const hs = "2", Na = "returnUrl", ps = "ui.detailViewMode", bo = `${ps}:latest`, wo = "detail-view-mode-change", Eu = {
  floating: !1,
  collapsed: "0"
}, Ao = /* @__PURE__ */ new Map();
function Mu() {
  const [e, t] = me(
    () => typeof window > "u" ? "/" : window.location.pathname
  );
  return se(() => {
    const n = () => t(window.location.pathname);
    return window.addEventListener("popstate", n), () => window.removeEventListener("popstate", n);
  }, []), e;
}
function vb(e) {
  return e ? e.length > 1 && e.endsWith("/") ? e.slice(0, -1) : e : "/";
}
function xb(e) {
  return e === "1" || e === hs ? e : "0";
}
function bb(e) {
  const t = e.floating === !0;
  return {
    floating: t,
    collapsed: t ? xb(e.collapsed) : "0"
  };
}
function nr(e, t) {
  return e?.floating === t.floating && e.collapsed === t.collapsed;
}
function Cu(e) {
  const t = vb(e), n = t.split("/").filter(Boolean);
  if (n[0] !== "management")
    return t;
  if (n[1] === "classes" && n[2]) {
    const r = n[3], o = n[4];
    return o && (r === "schedules" || r === "sessions" || r === "tests" || r === "feedbacks") ? `/management/classes/${n[2]}/${r}/${o}` : `/management/classes/${n[2]}`;
  }
  return (n[1] === "schedules" || n[1] === "sessions" || n[1] === "tests" || n[1] === "feedbacks") && n[2] ? `/management/${n[1]}/${n[2]}` : t;
}
function rr(e) {
  return Ao.get(e) ?? null;
}
function wb() {
  typeof window > "u" || window.dispatchEvent(new Event(wo));
}
function ju(e) {
  const t = e.trim();
  if (!t)
    return null;
  const n = typeof window > "u" ? "http://localhost" : window.location.origin;
  try {
    return new URL(t, n);
  } catch {
    return null;
  }
}
function Nu(e, t) {
  const n = ju(e);
  if (!n)
    return e;
  const r = n.searchParams.get(Na)?.trim();
  return r && t > 0 && n.searchParams.set(
    Na,
    Nu(r, t - 1)
  ), `${n.pathname}${n.search}${n.hash}`;
}
function Ab(e) {
  return Nu(e, 3);
}
function Iu(e) {
  return rr(
    `${ps}:${Cu(e)}`
  ) ?? rr(bo);
}
function Ia(e, t) {
  const n = bb(t), r = `${ps}:${Cu(e)}`, o = !nr(
    rr(r),
    n
  ), s = !nr(
    rr(bo),
    n
  );
  return Ao.set(r, n), Ao.set(bo, n), (o || s) && wb(), n;
}
function yb(e) {
  return Iu(e) ?? Eu;
}
function Eb(e) {
  return Ab(e);
}
function xw(e) {
  const t = ju(Eb(e));
  return t ? {
    pathname: t.pathname,
    search: t.search,
    hash: t.hash
  } : null;
}
function Mb(e = {}) {
  const t = Mu(), n = e.enabled ?? !0, r = e.pathname ?? t, [o, s] = me(0);
  return se(() => {
    if (!n || typeof window > "u")
      return;
    const c = () => {
      s((i) => i + 1);
    };
    return window.addEventListener(
      wo,
      c
    ), () => {
      window.removeEventListener(
        wo,
        c
      );
    };
  }, [n]), fe(() => n ? yb(r) : Eu, [n, r, o]);
}
function Cb(e = {}) {
  const t = Mu(), n = e.enabled ?? !0, r = e.pathname ?? t, o = Mb({
    enabled: n,
    pathname: r
  }), [s, c] = me(o);
  se(() => {
    c(
      (u) => nr(u, o) ? u : o
    );
  }, [o]), se(() => {
    n && (nr(Iu(r), s) || Ia(r, s));
  }, [n, r, s]);
  const i = ct(
    (u) => {
      n && c(Ia(r, u));
    },
    [n, r]
  );
  return {
    ...s,
    isCollapsed: s.collapsed !== "0",
    hiddenCollapsed: s.collapsed === hs,
    setMode: i
  };
}
const Ur = {
  tabPillSpring: {
    tension: 300,
    friction: 26
  },
  tabContentFadeOutMs: 100,
  tabContentFadeInMs: 200
};
let Vr = {
  tabPillSpring: { ...Ur.tabPillSpring },
  tabContentFadeOutMs: Ur.tabContentFadeOutMs,
  tabContentFadeInMs: Ur.tabContentFadeInMs
}, jb = 0;
function Nb() {
  return typeof window > "u" ? !1 : window.__DETAIL_TABS_DEBUG__ ? !0 : new URLSearchParams(window.location.search).get("detailTabsDebug") === "1";
}
function Ee(e, t, n) {
  Nb() && console.debug(`[DetailTabs:${e}] ${t}`, {
    path: typeof window > "u" ? void 0 : `${window.location.pathname}${window.location.search}`,
    ...n
  });
}
function Ib() {
  return {
    tabPillSpring: { ...Vr.tabPillSpring },
    tabContentFadeOutMs: Vr.tabContentFadeOutMs,
    tabContentFadeInMs: Vr.tabContentFadeInMs
  };
}
const Su = dn(null), Sb = dn(!1);
function bw({
  children: e,
  className: t = "w-full max-w-[1700px] space-y-4",
  isBackground: n,
  onCloseFloating: r
}) {
  const o = Pt(Sb), s = n ?? o, c = Cb({ enabled: !s }), i = s ? !1 : c.floating, u = s ? !1 : c.isCollapsed, l = s ? !1 : c.hiddenCollapsed, f = (v, g, x = !1) => {
    if (s)
      return;
    const b = g ? x ? hs : "1" : "0";
    c.setMode({
      floating: v,
      collapsed: b
    });
  }, d = () => {
    s || !r || r();
  }, m = () => {
    f(!1, !1, !1);
  }, p = () => {
    f(!0, !1, !1);
  };
  return se(() => {
    if (typeof document > "u" || !i)
      return;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", () => {
      document.body.style.overflow = v;
    };
  }, [i]), /* @__PURE__ */ a.jsx(
    Su.Provider,
    {
      value: {
        floating: i,
        collapsed: u,
        hiddenCollapsed: l,
        isBackground: s,
        expandToNormalView: m,
        switchToFloatingView: p
      },
      children: /* @__PURE__ */ a.jsxs(
        "section",
        {
          className: H(
            i ? "fixed inset-0 z-50" : "w-full",
            i && l ? "pointer-events-none" : "",
            i && u && !l ? "pointer-events-none" : ""
          ),
          children: [
            i && !u ? /* @__PURE__ */ a.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Close details",
                onClick: d,
                className: "absolute inset-0 bg-background/45 backdrop-blur-md"
              }
            ) : null,
            i && l ? /* @__PURE__ */ a.jsx(
              te,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                "aria-label": "Restore details panel",
                onClick: () => f(!0, !0, !1),
                className: "pointer-events-auto absolute right-0 top-1/2 z-20 h-28 w-7 -translate-y-1/2 rounded-l-md rounded-r-none border-r-0 bg-background text-[10px] font-semibold uppercase tracking-[0.14em] shadow-md [writing-mode:vertical-rl]",
                children: "Details"
              }
            ) : null,
            /* @__PURE__ */ a.jsxs(
              "div",
              {
                "data-floating-collapsed": i && u ? "true" : "false",
                className: H(
                  t,
                  i ? u ? l ? "floating-detail pointer-events-none absolute right-0 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 translate-x-[calc(100%-20px)] !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail pointer-events-auto absolute right-3 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail absolute left-1/2 top-1/2 z-10 w-[85dvw] -translate-x-1/2 -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : ""
                ),
                children: [
                  i && u ? l ? null : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
                    /* @__PURE__ */ a.jsx(
                      te,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        "aria-label": "Expand details panel",
                        onClick: () => f(!0, !1),
                        className: "absolute -left-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md",
                        children: /* @__PURE__ */ a.jsx(jt, { className: "h-4 w-4 rotate-180" })
                      }
                    ),
                    /* @__PURE__ */ a.jsx(
                      te,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        "aria-label": "Fully collapse details",
                        onClick: () => f(!0, !0, !0),
                        className: "absolute -left-4 top-[calc(50%+2.5rem)] z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md",
                        children: /* @__PURE__ */ a.jsx(jt, { className: "h-4 w-4" })
                      }
                    )
                  ] }) : null,
                  i && !u ? /* @__PURE__ */ a.jsx(
                    te,
                    {
                      type: "button",
                      size: "icon",
                      variant: "outline",
                      "aria-label": "Collapse details",
                      onClick: () => f(!0, !0, !1),
                      className: "absolute -right-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md",
                      children: /* @__PURE__ */ a.jsx(jt, { className: "h-4 w-4" })
                    }
                  ) : null,
                  e
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function ww({
  items: e,
  current: t
}) {
  return /* @__PURE__ */ a.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-base", children: [
    e.map((n, r) => /* @__PURE__ */ a.jsxs("div", { className: "contents", children: [
      n.onClick ? /* @__PURE__ */ a.jsx(
        te,
        {
          type: "button",
          variant: "link",
          size: "sm",
          className: "h-auto px-0 text-base no-underline hover:no-underline",
          onClick: n.onClick,
          children: n.label
        }
      ) : /* @__PURE__ */ a.jsx("span", { className: "text-base", children: n.label }),
      /* @__PURE__ */ a.jsx("span", { className: "text-muted-foreground", children: ">" })
    ] }, `${n.label}-${r}`)),
    /* @__PURE__ */ a.jsx("h2", { className: "min-w-0 break-words text-xl font-semibold tracking-tight", children: t })
  ] });
}
function Aw({
  breadcrumbs: e,
  actions: t,
  className: n
}) {
  const r = Pt(Su), o = r?.floating && !r.collapsed, s = r && !r.floating;
  return /* @__PURE__ */ a.jsxs(
    "div",
    {
      "data-detail-header": !0,
      className: H(
        "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
        n
      ),
      children: [
        /* @__PURE__ */ a.jsx("div", { className: "min-w-0 flex-1", children: e }),
        t ? /* @__PURE__ */ a.jsxs("div", { className: "flex shrink-0 items-center gap-2 self-start", children: [
          o ? /* @__PURE__ */ a.jsxs(
            te,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.expandToNormalView(),
              children: [
                /* @__PURE__ */ a.jsx(ta, { className: "mr-2 h-4 w-4" }),
                "Expand View"
              ]
            }
          ) : null,
          s ? /* @__PURE__ */ a.jsxs(
            te,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.switchToFloatingView(),
              children: [
                /* @__PURE__ */ a.jsx(na, { className: "mr-2 h-4 w-4" }),
                "Floating View"
              ]
            }
          ) : null,
          t
        ] }) : o || s ? /* @__PURE__ */ a.jsxs("div", { className: "flex shrink-0 items-center gap-2 self-start", children: [
          o ? /* @__PURE__ */ a.jsxs(
            te,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.expandToNormalView(),
              children: [
                /* @__PURE__ */ a.jsx(ta, { className: "mr-2 h-4 w-4" }),
                "Expand View"
              ]
            }
          ) : null,
          s ? /* @__PURE__ */ a.jsxs(
            te,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.switchToFloatingView(),
              children: [
                /* @__PURE__ */ a.jsx(na, { className: "mr-2 h-4 w-4" }),
                "Floating View"
              ]
            }
          ) : null
        ] }) : null
      ]
    }
  );
}
function yw({
  children: e,
  className: t = "grid gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)] md:grid-cols-4"
}) {
  return /* @__PURE__ */ a.jsx("div", { className: t, children: e });
}
function Ew({ label: e, value: t }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ a.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ a.jsx("div", { className: "text-sm font-medium", children: t })
  ] });
}
function Db({
  children: e,
  className: t = "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]"
}) {
  return /* @__PURE__ */ a.jsx("section", { className: t, children: e });
}
function Mw({
  label: e,
  value: t
}) {
  return /* @__PURE__ */ a.jsxs(Db, { children: [
    /* @__PURE__ */ a.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ a.jsx("p", { className: "mt-2 whitespace-pre-wrap break-words text-sm leading-6", children: t?.trim() || "-" })
  ] });
}
function Cw({
  rows: e,
  className: t,
  tableClassName: n,
  labelColumnClassName: r
}) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      className: H(
        "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
        t
      ),
      children: /* @__PURE__ */ a.jsx(
        _o,
        {
          className: H(
            "min-w-[40rem] table-fixed",
            n
          ),
          children: /* @__PURE__ */ a.jsx($o, { children: e.map((o, s) => /* @__PURE__ */ a.jsxs(
            yt,
            {
              className: H(
                "hover:bg-transparent",
                o.rowClassName
              ),
              children: [
                /* @__PURE__ */ a.jsx(
                  ut,
                  {
                    className: H(
                      "border-r border-border/60 px-4 py-3 align-middle text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                      r ?? "w-[220px]",
                      o.labelClassName
                    ),
                    children: o.label
                  }
                ),
                /* @__PURE__ */ a.jsx(
                  ut,
                  {
                    className: H(
                      "px-4 py-3 align-middle text-sm",
                      o.valueClassName
                    ),
                    children: o.value
                  }
                )
              ]
            },
            o.key ?? `detail-row-${s}`
          )) })
        }
      )
    }
  );
}
function jw({
  className: e,
  classKey: t,
  onOpenClass: n,
  buttonLabel: r = "Open class"
}) {
  const o = t?.trim() || "";
  return /* @__PURE__ */ a.jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ a.jsx("span", { className: "break-words", children: e?.trim() || "-" }),
    /* @__PURE__ */ a.jsx(
      te,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        onClick: n,
        disabled: !o,
        children: r
      }
    )
  ] });
}
function Nw({
  label: e = "Class",
  classKey: t,
  onOpenClass: n
}) {
  const r = t?.trim() || "";
  return /* @__PURE__ */ a.jsxs("span", { className: "inline-flex items-center gap-1", children: [
    /* @__PURE__ */ a.jsx("span", { children: e }),
    /* @__PURE__ */ a.jsx(
      te,
      {
        type: "button",
        size: "icon",
        variant: "ghost",
        className: "h-5 w-5 p-0 text-muted-foreground hover:text-foreground",
        onClick: n,
        disabled: !r,
        children: /* @__PURE__ */ a.jsx(jt, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
function Iw({
  title: e,
  children: t
}) {
  return /* @__PURE__ */ a.jsxs("aside", { className: "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]", children: [
    /* @__PURE__ */ a.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ a.jsx("div", { className: "mt-3 flex flex-col gap-2", children: t })
  ] });
}
function kb({
  tabs: e,
  activeTab: t,
  onChange: n
}) {
  const r = ve(/* @__PURE__ */ new Map()), o = ve(null), s = ve(++jb), c = ve(!1), i = e.find((d) => d.value === t)?.value ?? e[0]?.value, [u, l] = wu(() => ({
    left: 0,
    width: 0
  })), f = ct(
    (d) => {
      if (!i)
        return Ee(s.current, "updatePill:no-active-tab", {
          activeTab: t,
          resolvedActiveTab: i,
          animate: d,
          tabs: e.map((g) => g.value)
        }), !1;
      const m = r.current.get(i);
      if (!m)
        return Ee(s.current, "updatePill:no-button", {
          activeTab: t,
          resolvedActiveTab: i,
          animate: d,
          availableButtons: Array.from(r.current.keys())
        }), !1;
      const p = m.offsetWidth;
      if (p <= 0)
        return Ee(s.current, "updatePill:zero-width", {
          activeTab: t,
          resolvedActiveTab: i,
          animate: d,
          offsetLeft: m.offsetLeft,
          offsetWidth: p,
          rect: m.getBoundingClientRect().toJSON()
        }), !1;
      const v = Ib();
      return Ee(s.current, "updatePill:start", {
        activeTab: t,
        resolvedActiveTab: i,
        animate: d,
        offsetLeft: m.offsetLeft,
        offsetWidth: p,
        buttonRect: m.getBoundingClientRect().toJSON(),
        tabListRect: o.current?.getBoundingClientRect().toJSON()
      }), l.start({
        left: m.offsetLeft,
        width: p,
        immediate: !d,
        config: {
          tension: v.tabPillSpring.tension,
          friction: v.tabPillSpring.friction,
          clamp: !0
        }
      }), !0;
    },
    [t, l, i, e]
  );
  return yo(() => {
    let d = 0, m = 0;
    const p = 8, v = () => {
      const g = f(c.current);
      Ee(s.current, "layout-effect:measure", {
        attempts: m,
        measured: g,
        initialized: c.current
      }), !g && m < p && (m += 1, d = requestAnimationFrame(v));
    };
    return v(), c.current = !0, () => {
      d && cancelAnimationFrame(d);
    };
  }, [f]), se(() => {
    Ee(s.current, "render-state", {
      activeTab: t,
      resolvedActiveTab: i,
      tabs: e.map((d) => d.value)
    });
  }, [t, i, e]), se(() => {
    const d = () => {
      Ee(s.current, "window:resize"), f(!0);
    };
    return window.addEventListener("resize", d), () => {
      window.removeEventListener("resize", d);
    };
  }, [f]), se(() => {
    if (typeof ResizeObserver > "u")
      return;
    const d = o.current, m = i ? r.current.get(i) : null;
    if (!d && !m)
      return;
    const p = new ResizeObserver(() => {
      Ee(s.current, "resize-observer"), f(!0);
    });
    return d && p.observe(d), m && p.observe(m), () => {
      p.disconnect();
    };
  }, [i, f]), se(() => {
    if (typeof document > "u" || !("fonts" in document))
      return;
    let d = !1;
    return document.fonts.ready.then(() => {
      d || (Ee(s.current, "fonts:ready", {
        status: document.fonts.status
      }), f(!0));
    }), () => {
      d = !0;
    };
  }, [f]), /* @__PURE__ */ a.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border/70 bg-card/70 p-1 drop-shadow-md", children: /* @__PURE__ */ a.jsxs("div", { ref: o, className: "relative flex min-w-max gap-2", children: [
    /* @__PURE__ */ a.jsx(
      yu.div,
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute left-0 top-0 h-full rounded-xl bg-primary shadow-sm",
        style: {
          left: u.left,
          width: u.width,
          opacity: u.width.to(
            (d) => d > 0 ? 1 : 0
          )
        }
      }
    ),
    e.map((d) => /* @__PURE__ */ a.jsx(
      "button",
      {
        ref: (m) => {
          m ? r.current.set(d.value, m) : r.current.delete(d.value), Ee(s.current, "button:ref", {
            tabValue: d.value,
            mounted: !!m,
            activeTab: t,
            resolvedActiveTab: i,
            offsetLeft: m?.offsetLeft,
            offsetWidth: m?.offsetWidth
          }), m && d.value === t && f(c.current);
        },
        type: "button",
        onClick: () => {
          Ee(s.current, "button:click", {
            tabValue: d.value,
            activeTab: t,
            resolvedActiveTab: i
          }), d.value !== i && n(d.value);
        },
        className: H(
          "relative z-10 shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
          i === d.value ? "text-primary-foreground" : d.hasPendingChanges ? "font-bold text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-accent-foreground"
        ),
        children: d.label
      },
      d.value
    ))
  ] }) });
}
function Sw({
  tabs: e,
  activeTab: t,
  onChange: n,
  children: r,
  className: o,
  contentClassName: s
}) {
  return /* @__PURE__ */ a.jsxs("section", { className: H("flex min-h-0 flex-col", o), children: [
    /* @__PURE__ */ a.jsx(
      "div",
      {
        "data-detail-tabs-wrap": !0,
        className: "shrink-0 overflow-visible pb-2",
        children: /* @__PURE__ */ a.jsx(
          kb,
          {
            tabs: e,
            activeTab: t,
            onChange: n
          }
        )
      }
    ),
    /* @__PURE__ */ a.jsx(
      "div",
      {
        "data-detail-tab-content": !0,
        className: H(
          "mt-4 flex min-h-0 flex-1 flex-col",
          s
        ),
        children: r
      }
    )
  ] });
}
function Rb(e) {
  return !Number.isFinite(e) || e < 0 ? 0 : e;
}
function Dw({
  primaryLabel: e,
  secondaryLabel: t,
  percent: n
}) {
  const r = Rb(n), o = r > 100, s = Math.min(100, r);
  return /* @__PURE__ */ a.jsxs("div", { className: "flex min-w-[220px] flex-col gap-1.5", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "flex items-center justify-between gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ a.jsx("span", { className: "truncate", children: e }),
      t ? /* @__PURE__ */ a.jsx("span", { className: "shrink-0 tabular-nums", children: t }) : null
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted/70", children: /* @__PURE__ */ a.jsx(
      "div",
      {
        className: `h-full rounded-full transition-[width] ${o ? "bg-destructive" : "bg-primary"}`,
        style: { width: `${s}%` }
      }
    ) })
  ] });
}
function kw({
  open: e,
  onOpenChange: t,
  trigger: n,
  onClear: r,
  onApply: o,
  children: s,
  className: c,
  gridClassName: i
}) {
  return /* @__PURE__ */ a.jsxs(Wc, { open: e, onOpenChange: t, children: [
    /* @__PURE__ */ a.jsx(Uc, { asChild: !0, children: n }),
    /* @__PURE__ */ a.jsx(Vc, { children: /* @__PURE__ */ a.jsx(
      qc,
      {
        align: "start",
        side: "bottom",
        sideOffset: 6,
        className: H(
          "z-20 w-[min(calc(100vw-2rem),72rem)]",
          "outline-none data-[state=closed]:pointer-events-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        ),
        children: /* @__PURE__ */ a.jsxs(
          "div",
          {
            className: H(
              "rounded-lg border border-border/60 bg-background px-4 pb-4 pt-3 shadow-lg",
              c
            ),
            children: [
              /* @__PURE__ */ a.jsxs("div", { className: "mb-3 flex items-center gap-2.5", children: [
                /* @__PURE__ */ a.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50", children: "Filters" }),
                /* @__PURE__ */ a.jsx("div", { className: "h-px flex-1 bg-border/40" })
              ] }),
              /* @__PURE__ */ a.jsx(
                "div",
                {
                  className: H(
                    "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(18rem,100%),1fr))] [&>*]:min-w-0",
                    i
                  ),
                  children: s
                }
              ),
              (r || o) && /* @__PURE__ */ a.jsxs("div", { className: "mt-4 flex items-center justify-end gap-2 border-t border-border/30 pt-3", children: [
                r && /* @__PURE__ */ a.jsx(te, { type: "button", size: "sm", variant: "ghost", onClick: r, children: "Clear all" }),
                o && /* @__PURE__ */ a.jsx(te, { type: "button", size: "sm", onClick: o, children: "Apply filters" })
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
const Rw = or(function({
  open: t,
  onToggle: n,
  activeCount: r = 0,
  className: o,
  onClick: s,
  ...c
}, i) {
  const u = r > 0, l = (f) => {
    s?.(f), f.defaultPrevented || n?.();
  };
  return /* @__PURE__ */ a.jsxs(
    te,
    {
      ref: i,
      type: "button",
      variant: t || u ? "secondary" : "outline",
      onClick: l,
      className: H("gap-1.5", o),
      ...c,
      children: [
        /* @__PURE__ */ a.jsx(Vg, { className: "size-4" }),
        "Filters",
        u && /* @__PURE__ */ a.jsx("span", { className: "flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground", children: r })
      ]
    }
  );
});
function Pw(e, t, n = "") {
  return e.get(t) ?? n;
}
function Ow(e, t, n, r = 0) {
  const o = e.get(t);
  if (!o)
    return n;
  const s = Number.parseInt(o, 10);
  return Number.isNaN(s) || s < r ? n : s;
}
function zw(e, t, n) {
  const r = e.get(t);
  return r === "1" ? !0 : r === "0" ? !1 : n;
}
function Bw(e, t) {
  const n = new URLSearchParams(e);
  return Object.entries(t).forEach(([r, o]) => {
    if (o == null || o === "" || o === !1) {
      n.delete(r);
      return;
    }
    if (o === !0) {
      n.set(r, "1");
      return;
    }
    n.set(r, String(o));
  }), n;
}
function qr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.trim().length > 0
  ) : typeof e == "string" ? e.split(/\s+/).map((t) => t.trim()).filter(Boolean) : [];
}
function Du(e) {
  return !!e && typeof e == "object";
}
function ku(e) {
  if (Du(e)) {
    const t = qr(e.roles);
    return t.length > 0 ? t : qr(e.scope);
  }
  return qr(e);
}
function Gw(e, t) {
  return ku(e).includes(t);
}
function Pb(e, t) {
  const n = ku(e);
  return t.some((r) => n.includes(r));
}
function Tw(e) {
  return !Du(e) || e.account_type !== "employee" ? !1 : Pb(e, [
    "classes_get",
    "sessions_get",
    "schedules_get",
    "tests_get",
    "classes_feedbacks_get"
  ]);
}
function Yw(e) {
  if (!(e instanceof Error))
    return !1;
  const t = e.message.toLowerCase();
  return t.includes("403") || t.includes("forbidden") || t.includes("insufficient permission") || t.includes("insufficient permissions");
}
const Ob = "edited_at is older than the current value. refresh data and retry with a newer edited_at";
function Hw(e) {
  return e instanceof Error ? e.message.toLowerCase().includes(Ob) : !1;
}
function Fw({ ...e }) {
  return /* @__PURE__ */ a.jsx(li, { "data-slot": "sheet", ...e });
}
function Lw({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(ui, { "data-slot": "sheet-trigger", ...e });
}
function Qw({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(mn, { "data-slot": "sheet-close", ...e });
}
function zb({
  ...e
}) {
  return /* @__PURE__ */ a.jsx(di, { "data-slot": "sheet-portal", ...e });
}
function Bb({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    fi,
    {
      "data-slot": "sheet-overlay",
      className: H(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        e
      ),
      ...t
    }
  );
}
function Zw({
  className: e,
  children: t,
  side: n = "right",
  showCloseButton: r = !0,
  ...o
}) {
  return /* @__PURE__ */ a.jsxs(zb, { children: [
    /* @__PURE__ */ a.jsx(Bb, {}),
    /* @__PURE__ */ a.jsxs(
      mi,
      {
        "data-slot": "sheet-content",
        className: H(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500",
          n === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          n === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          n === "top" && "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          n === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          e
        ),
        ...o,
        children: [
          t,
          r && /* @__PURE__ */ a.jsxs(mn, { className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
            /* @__PURE__ */ a.jsx(qo, { className: "size-4" }),
            /* @__PURE__ */ a.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function Jw({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: H("flex flex-col gap-1.5 p-4", e),
      ...t
    }
  );
}
function Ww({ className: e, ...t }) {
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "data-slot": "sheet-footer",
      className: H("mt-auto flex flex-col gap-2 p-4", e),
      ...t
    }
  );
}
function Uw({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    hi,
    {
      "data-slot": "sheet-title",
      className: H("font-semibold text-foreground", e),
      ...t
    }
  );
}
function Vw({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a.jsx(
    pi,
    {
      "data-slot": "sheet-description",
      className: H("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
export {
  gs as API_CONFIG,
  kw as AdvancedFiltersPanel,
  Rw as AdvancedFiltersToggle,
  Dl as AppTheme,
  aw as AuthProvider,
  Sb as BackgroundDetailViewContext,
  te as Button,
  dl as Card,
  Fb as CardAction,
  hl as CardContent,
  hg as CardDescription,
  Lb as CardFooter,
  fl as CardHeader,
  ml as CardTitle,
  dw as ColorModeIconDropdown,
  zl as ColorModeSelect,
  hs as DETAIL_HIDDEN_COLLAPSED_VALUE,
  Iw as DetailActionPanel,
  ww as DetailBreadcrumbs,
  Db as DetailCard,
  Nw as DetailClassHeaderLabel,
  jw as DetailClassLinkValue,
  Cw as DetailFieldsTable,
  Aw as DetailHeader,
  yw as DetailSummaryGrid,
  Ew as DetailSummaryItem,
  Sw as DetailTabbedSection,
  kb as DetailTabs,
  Mw as DetailTextBlock,
  bw as DetailView,
  bl as Dialog,
  Zb as DialogClose,
  wl as DialogContent,
  Ml as DialogDescription,
  yl as DialogFooter,
  Al as DialogHeader,
  _g as DialogOverlay,
  Kg as DialogPortal,
  El as DialogTitle,
  Qb as DialogTrigger,
  kl as DropdownMenu,
  Vb as DropdownMenuCheckboxItem,
  Pl as DropdownMenuContent,
  Wb as DropdownMenuGroup,
  Ub as DropdownMenuItem,
  hv as DropdownMenuLabel,
  Jb as DropdownMenuPortal,
  Ol as DropdownMenuRadioGroup,
  Nt as DropdownMenuRadioItem,
  pv as DropdownMenuSeparator,
  qb as DropdownMenuShortcut,
  Xb as DropdownMenuSub,
  _b as DropdownMenuSubContent,
  Kb as DropdownMenuSubTrigger,
  Rl as DropdownMenuTrigger,
  uv as ForgotPassword,
  Tv as FormTableDialog,
  Gv as FormTableRow,
  lt as Input,
  Ct as Label,
  fw as LazyViewFallback,
  pb as PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS,
  lb as PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL,
  gb as PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS,
  mb as PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT,
  db as PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL,
  fb as PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL,
  cb as PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL,
  hb as PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG,
  ub as PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL,
  pw as PatchRecordDialog,
  gw as PendingChangesBar,
  lw as PendingChangesProvider,
  Dw as ProgressMetricCell,
  cw as ResetPassword,
  Hl as SearchableSelect,
  pg as Separator,
  Fw as Sheet,
  Qw as SheetClose,
  Zw as SheetContent,
  Vw as SheetDescription,
  Ww as SheetFooter,
  Jw as SheetHeader,
  Uw as SheetTitle,
  Lw as SheetTrigger,
  iw as SignIn,
  vw as SimpleDataTable,
  Bl as SitemarkIcon,
  en as StatusBanner,
  _o as Table,
  $o as TableBody,
  hw as TableCaption,
  ut as TableCell,
  mw as TableFooter,
  Bv as TableHead,
  zv as TableHeader,
  yt as TableRow,
  Ov as Textarea,
  mg as buttonVariants,
  Tw as canAccessManagement,
  Yb as configureApi,
  $b as formatDate,
  ew as formatUserTimestamp,
  xw as getDetailReturnLocation,
  zw as getQueryBoolean,
  Ow as getQueryNumber,
  Pw as getQueryParam,
  sw as getTextareaRows,
  ku as getUserScopes,
  Pb as hasAnyUserScope,
  Gw as hasUserScope,
  Hw as isOutdatedEditedAtConflictError,
  Yw as isPermissionDeniedError,
  Iu as readStoredDetailViewMode,
  yb as resolveDetailViewMode,
  Ab as stripDetailViewModeFromPath,
  nw as toBackendBoundary,
  ow as toBackendTimeValue,
  tw as toBackendTimestamp,
  rw as toDateTimeLocalValue,
  Eb as toDetailReturnUrl,
  Bw as updateSearchParams,
  Dv as useAuth,
  Sl as useColorMode,
  Cb as useDetailViewMode,
  uw as usePendingChanges,
  Mb as useResolvedDetailViewMode,
  Ia as writeDetailViewMode
};
