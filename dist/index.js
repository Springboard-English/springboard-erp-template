import * as v from "react";
import jt, { useState as ge, useLayoutEffect as $n, useContext as lt, createContext as nn, forwardRef as Ci, createElement as Qo, useEffect as de, useMemo as ke, useCallback as Ve, useRef as pe, Fragment as ap, useId as lp } from "react";
import * as mu from "react-dom";
import cp, { unstable_batchedUpdates as up, createPortal as dp } from "react-dom";
import { useLocation as hu, useNavigate as pu } from "react-router-dom";
let gu = "https://api.springboard.vn";
function xN(e) {
  gu = e.baseUrl;
}
const ri = {
  get baseURL() {
    return gu;
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
    ownNotifications: "/users/me/notifications",
    recordings: "/users/me/recordings"
  }
};
function zt(e) {
  return `${ri.baseURL}${ri.endpoints[e]}`;
}
function fp(e) {
  return `${ri.baseURL}/notifications/${encodeURIComponent(e)}`;
}
function Ss(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Or = { exports: {} }, On = {};
var dl;
function mp() {
  if (dl) return On;
  dl = 1;
  var e = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function n(r, i, o) {
    var s = null;
    if (o !== void 0 && (s = "" + o), i.key !== void 0 && (s = "" + i.key), "key" in i) {
      o = {};
      for (var a in i)
        a !== "key" && (o[a] = i[a]);
    } else o = i;
    return i = o.ref, {
      $$typeof: e,
      type: r,
      key: s,
      ref: i !== void 0 ? i : null,
      props: o
    };
  }
  return On.Fragment = t, On.jsx = n, On.jsxs = n, On;
}
var Tn = {};
var fl;
function hp() {
  return fl || (fl = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(N) {
      if (N == null) return null;
      if (typeof N == "function")
        return N.$$typeof === I ? null : N.displayName || N.name || null;
      if (typeof N == "string") return N;
      switch (N) {
        case y:
          return "Fragment";
        case k:
          return "Profiler";
        case x:
          return "StrictMode";
        case E:
          return "Suspense";
        case O:
          return "SuspenseList";
        case C:
          return "Activity";
      }
      if (typeof N == "object")
        switch (typeof N.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), N.$$typeof) {
          case g:
            return "Portal";
          case j:
            return N.displayName || "Context";
          case w:
            return (N._context.displayName || "Context") + ".Consumer";
          case S:
            var Y = N.render;
            return N = N.displayName, N || (N = Y.displayName || Y.name || "", N = N !== "" ? "ForwardRef(" + N + ")" : "ForwardRef"), N;
          case R:
            return Y = N.displayName || null, Y !== null ? Y : e(N.type) || "Memo";
          case B:
            Y = N._payload, N = N._init;
            try {
              return e(N(Y));
            } catch {
            }
        }
      return null;
    }
    function t(N) {
      return "" + N;
    }
    function n(N) {
      try {
        t(N);
        var Y = !1;
      } catch {
        Y = !0;
      }
      if (Y) {
        Y = console;
        var A = Y.error, X = typeof Symbol == "function" && Symbol.toStringTag && N[Symbol.toStringTag] || N.constructor.name || "Object";
        return A.call(
          Y,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          X
        ), t(N);
      }
    }
    function r(N) {
      if (N === y) return "<>";
      if (typeof N == "object" && N !== null && N.$$typeof === B)
        return "<...>";
      try {
        var Y = e(N);
        return Y ? "<" + Y + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var N = z.A;
      return N === null ? null : N.getOwner();
    }
    function o() {
      return Error("react-stack-top-frame");
    }
    function s(N) {
      if (W.call(N, "key")) {
        var Y = Object.getOwnPropertyDescriptor(N, "key").get;
        if (Y && Y.isReactWarning) return !1;
      }
      return N.key !== void 0;
    }
    function a(N, Y) {
      function A() {
        D || (D = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          Y
        ));
      }
      A.isReactWarning = !0, Object.defineProperty(N, "key", {
        get: A,
        configurable: !0
      });
    }
    function l() {
      var N = e(this.type);
      return F[N] || (F[N] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), N = this.props.ref, N !== void 0 ? N : null;
    }
    function c(N, Y, A, X, H, q) {
      var J = A.ref;
      return N = {
        $$typeof: p,
        type: N,
        key: Y,
        props: A,
        _owner: X
      }, (J !== void 0 ? J : null) !== null ? Object.defineProperty(N, "ref", {
        enumerable: !1,
        get: l
      }) : Object.defineProperty(N, "ref", { enumerable: !1, value: null }), N._store = {}, Object.defineProperty(N._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(N, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(N, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: H
      }), Object.defineProperty(N, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: q
      }), Object.freeze && (Object.freeze(N.props), Object.freeze(N)), N;
    }
    function f(N, Y, A, X, H, q) {
      var J = Y.children;
      if (J !== void 0)
        if (X)
          if (P(J)) {
            for (X = 0; X < J.length; X++)
              u(J[X]);
            Object.freeze && Object.freeze(J);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(J);
      if (W.call(Y, "key")) {
        J = e(N);
        var ae = Object.keys(Y).filter(function(fe) {
          return fe !== "key";
        });
        X = 0 < ae.length ? "{key: someKey, " + ae.join(": ..., ") + ": ...}" : "{key: someKey}", b[J + X] || (ae = 0 < ae.length ? "{" + ae.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          X,
          J,
          ae,
          J
        ), b[J + X] = !0);
      }
      if (J = null, A !== void 0 && (n(A), J = "" + A), s(Y) && (n(Y.key), J = "" + Y.key), "key" in Y) {
        A = {};
        for (var ie in Y)
          ie !== "key" && (A[ie] = Y[ie]);
      } else A = Y;
      return J && a(
        A,
        typeof N == "function" ? N.displayName || N.name || "Unknown" : N
      ), c(
        N,
        J,
        A,
        i(),
        H,
        q
      );
    }
    function u(N) {
      m(N) ? N._store && (N._store.validated = 1) : typeof N == "object" && N !== null && N.$$typeof === B && (N._payload.status === "fulfilled" ? m(N._payload.value) && N._payload.value._store && (N._payload.value._store.validated = 1) : N._store && (N._store.validated = 1));
    }
    function m(N) {
      return typeof N == "object" && N !== null && N.$$typeof === p;
    }
    var h = jt, p = /* @__PURE__ */ Symbol.for("react.transitional.element"), g = /* @__PURE__ */ Symbol.for("react.portal"), y = /* @__PURE__ */ Symbol.for("react.fragment"), x = /* @__PURE__ */ Symbol.for("react.strict_mode"), k = /* @__PURE__ */ Symbol.for("react.profiler"), w = /* @__PURE__ */ Symbol.for("react.consumer"), j = /* @__PURE__ */ Symbol.for("react.context"), S = /* @__PURE__ */ Symbol.for("react.forward_ref"), E = /* @__PURE__ */ Symbol.for("react.suspense"), O = /* @__PURE__ */ Symbol.for("react.suspense_list"), R = /* @__PURE__ */ Symbol.for("react.memo"), B = /* @__PURE__ */ Symbol.for("react.lazy"), C = /* @__PURE__ */ Symbol.for("react.activity"), I = /* @__PURE__ */ Symbol.for("react.client.reference"), z = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, W = Object.prototype.hasOwnProperty, P = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    h = {
      react_stack_bottom_frame: function(N) {
        return N();
      }
    };
    var D, F = {}, T = h.react_stack_bottom_frame.bind(
      h,
      o
    )(), G = M(r(o)), b = {};
    Tn.Fragment = y, Tn.jsx = function(N, Y, A) {
      var X = 1e4 > z.recentlyCreatedOwnerStacks++;
      return f(
        N,
        Y,
        A,
        !1,
        X ? Error("react-stack-top-frame") : T,
        X ? M(r(N)) : G
      );
    }, Tn.jsxs = function(N, Y, A) {
      var X = 1e4 > z.recentlyCreatedOwnerStacks++;
      return f(
        N,
        Y,
        A,
        !0,
        X ? Error("react-stack-top-frame") : T,
        X ? M(r(N)) : G
      );
    };
  })()), Tn;
}
var ml;
function pp() {
  return ml || (ml = 1, process.env.NODE_ENV === "production" ? Or.exports = mp() : Or.exports = hp()), Or.exports;
}
var d = pp();
function xu(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var i = e.length;
    for (t = 0; t < i; t++) e[t] && (n = xu(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function bu() {
  for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = xu(e)) && (r && (r += " "), r += t);
  return r;
}
const hl = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, pl = bu, gp = (e, t) => (n) => {
  var r;
  if (t?.variants == null) return pl(e, n?.class, n?.className);
  const { variants: i, defaultVariants: o } = t, s = Object.keys(i).map((c) => {
    const f = n?.[c], u = o?.[c];
    if (f === null) return null;
    const m = hl(f) || hl(u);
    return i[c][m];
  }), a = n && Object.entries(n).reduce((c, f) => {
    let [u, m] = f;
    return m === void 0 || (c[u] = m), c;
  }, {}), l = t == null || (r = t.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((c, f) => {
    let { class: u, className: m, ...h } = f;
    return Object.entries(h).every((p) => {
      let [g, y] = p;
      return Array.isArray(y) ? y.includes({
        ...o,
        ...a
      }[g]) : {
        ...o,
        ...a
      }[g] === y;
    }) ? [
      ...c,
      u,
      m
    ] : c;
  }, []);
  return pl(e, s, l, n?.class, n?.className);
};
function gl(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function ji(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((i) => {
      const o = gl(i, t);
      return !n && typeof o == "function" && (n = !0), o;
    });
    if (n)
      return () => {
        for (let i = 0; i < r.length; i++) {
          const o = r[i];
          typeof o == "function" ? o() : gl(e[i], null);
        }
      };
  };
}
function Ce(...e) {
  return v.useCallback(ji(...e), e);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
  const t = /* @__PURE__ */ bp(e), n = v.forwardRef((r, i) => {
    const { children: o, ...s } = r, a = v.Children.toArray(o), l = a.find(vp);
    if (l) {
      const c = l.props.children, f = a.map((u) => u === l ? v.Children.count(c) > 1 ? v.Children.only(null) : v.isValidElement(c) ? c.props.children : null : u);
      return /* @__PURE__ */ d.jsx(t, { ...s, ref: i, children: v.isValidElement(c) ? v.cloneElement(c, void 0, f) : null });
    }
    return /* @__PURE__ */ d.jsx(t, { ...s, ref: i, children: o });
  });
  return n.displayName = `${e}.Slot`, n;
}
var xp = /* @__PURE__ */ Kt("Slot");
// @__NO_SIDE_EFFECTS__
function bp(e) {
  const t = v.forwardRef((n, r) => {
    const { children: i, ...o } = n;
    if (v.isValidElement(i)) {
      const s = Ap(i), a = wp(o, i.props);
      return i.type !== v.Fragment && (a.ref = r ? ji(r, s) : s), v.cloneElement(i, a);
    }
    return v.Children.count(i) > 1 ? v.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var yp = /* @__PURE__ */ Symbol("radix.slottable");
function vp(e) {
  return v.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === yp;
}
function wp(e, t) {
  const n = { ...t };
  for (const r in t) {
    const i = e[r], o = t[r];
    /^on[A-Z]/.test(r) ? i && o ? n[r] = (...a) => {
      const l = o(...a);
      return i(...a), l;
    } : i && (n[r] = i) : r === "style" ? n[r] = { ...i, ...o } : r === "className" && (n[r] = [i, o].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function Ap(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var kp = [
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
], ve = kp.reduce((e, t) => {
  const n = /* @__PURE__ */ Kt(`Primitive.${t}`), r = v.forwardRef((i, o) => {
    const { asChild: s, ...a } = i, l = s ? n : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ d.jsx(l, { ...a, ref: o });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function yu(e, t) {
  e && mu.flushSync(() => e.dispatchEvent(t));
}
function Ep(e, t) {
  const n = v.createContext(t), r = (o) => {
    const { children: s, ...a } = o, l = v.useMemo(() => a, Object.values(a));
    return /* @__PURE__ */ d.jsx(n.Provider, { value: l, children: s });
  };
  r.displayName = e + "Provider";
  function i(o) {
    const s = v.useContext(n);
    if (s) return s;
    if (t !== void 0) return t;
    throw new Error(`\`${o}\` must be used within \`${e}\``);
  }
  return [r, i];
}
function rn(e, t = []) {
  let n = [];
  function r(o, s) {
    const a = v.createContext(s), l = n.length;
    n = [...n, s];
    const c = (u) => {
      const { scope: m, children: h, ...p } = u, g = m?.[e]?.[l] || a, y = v.useMemo(() => p, Object.values(p));
      return /* @__PURE__ */ d.jsx(g.Provider, { value: y, children: h });
    };
    c.displayName = o + "Provider";
    function f(u, m) {
      const h = m?.[e]?.[l] || a, p = v.useContext(h);
      if (p) return p;
      if (s !== void 0) return s;
      throw new Error(`\`${u}\` must be used within \`${o}\``);
    }
    return [c, f];
  }
  const i = () => {
    const o = n.map((s) => v.createContext(s));
    return function(a) {
      const l = a?.[e] || o;
      return v.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: l } }),
        [a, l]
      );
    };
  };
  return i.scopeName = e, [r, Cp(i, ...t)];
}
function Cp(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((i) => ({
      useScope: i(),
      scopeName: i.scopeName
    }));
    return function(o) {
      const s = r.reduce((a, { useScope: l, scopeName: c }) => {
        const u = l(o)[`__scope${c}`];
        return { ...a, ...u };
      }, {});
      return v.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
function vu(e) {
  const t = e + "CollectionProvider", [n, r] = rn(t), [i, o] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), s = (g) => {
    const { scope: y, children: x } = g, k = jt.useRef(null), w = jt.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ d.jsx(i, { scope: y, itemMap: w, collectionRef: k, children: x });
  };
  s.displayName = t;
  const a = e + "CollectionSlot", l = /* @__PURE__ */ Kt(a), c = jt.forwardRef(
    (g, y) => {
      const { scope: x, children: k } = g, w = o(a, x), j = Ce(y, w.collectionRef);
      return /* @__PURE__ */ d.jsx(l, { ref: j, children: k });
    }
  );
  c.displayName = a;
  const f = e + "CollectionItemSlot", u = "data-radix-collection-item", m = /* @__PURE__ */ Kt(f), h = jt.forwardRef(
    (g, y) => {
      const { scope: x, children: k, ...w } = g, j = jt.useRef(null), S = Ce(y, j), E = o(f, x);
      return jt.useEffect(() => (E.itemMap.set(j, { ref: j, ...w }), () => {
        E.itemMap.delete(j);
      })), /* @__PURE__ */ d.jsx(m, { [u]: "", ref: S, children: k });
    }
  );
  h.displayName = f;
  function p(g) {
    const y = o(e + "CollectionConsumer", g);
    return jt.useCallback(() => {
      const k = y.collectionRef.current;
      if (!k) return [];
      const w = Array.from(k.querySelectorAll(`[${u}]`));
      return Array.from(y.itemMap.values()).sort(
        (E, O) => w.indexOf(E.ref.current) - w.indexOf(O.ref.current)
      );
    }, [y.collectionRef, y.itemMap]);
  }
  return [
    { Provider: s, Slot: c, ItemSlot: h },
    p,
    r
  ];
}
function te(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(i) {
    if (e?.(i), n === !1 || !i.defaultPrevented)
      return t?.(i);
  };
}
var Pt = globalThis?.document ? v.useLayoutEffect : () => {
}, jp = v[" useInsertionEffect ".trim().toString()] || Pt;
function pr({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [i, o, s] = Mp({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, l = a ? e : i;
  {
    const f = v.useRef(e !== void 0);
    v.useEffect(() => {
      const u = f.current;
      u !== a && console.warn(
        `${r} is changing from ${u ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), f.current = a;
    }, [a, r]);
  }
  const c = v.useCallback(
    (f) => {
      if (a) {
        const u = Sp(f) ? f(e) : f;
        u !== e && s.current?.(u);
      } else
        o(f);
    },
    [a, e, o, s]
  );
  return [l, c];
}
function Mp({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = v.useState(e), i = v.useRef(n), o = v.useRef(t);
  return jp(() => {
    o.current = t;
  }, [t]), v.useEffect(() => {
    i.current !== n && (o.current?.(n), i.current = n);
  }, [n, i]), [n, r, o];
}
function Sp(e) {
  return typeof e == "function";
}
function Np(e, t) {
  return v.useReducer((n, r) => t[n][r] ?? n, e);
}
var ct = (e) => {
  const { present: t, children: n } = e, r = Ip(t), i = typeof n == "function" ? n({ present: r.isPresent }) : v.Children.only(n), o = Ce(r.ref, Dp(i));
  return typeof n == "function" || r.isPresent ? v.cloneElement(i, { ref: o }) : null;
};
ct.displayName = "Presence";
function Ip(e) {
  const [t, n] = v.useState(), r = v.useRef(null), i = v.useRef(e), o = v.useRef("none"), s = e ? "mounted" : "unmounted", [a, l] = Np(s, {
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
  return v.useEffect(() => {
    const c = Tr(r.current);
    o.current = a === "mounted" ? c : "none";
  }, [a]), Pt(() => {
    const c = r.current, f = i.current;
    if (f !== e) {
      const m = o.current, h = Tr(c);
      e ? l("MOUNT") : h === "none" || c?.display === "none" ? l("UNMOUNT") : l(f && m !== h ? "ANIMATION_OUT" : "UNMOUNT"), i.current = e;
    }
  }, [e, l]), Pt(() => {
    if (t) {
      let c;
      const f = t.ownerDocument.defaultView ?? window, u = (h) => {
        const g = Tr(r.current).includes(CSS.escape(h.animationName));
        if (h.target === t && g && (l("ANIMATION_END"), !i.current)) {
          const y = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", c = f.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = y);
          });
        }
      }, m = (h) => {
        h.target === t && (o.current = Tr(r.current));
      };
      return t.addEventListener("animationstart", m), t.addEventListener("animationcancel", u), t.addEventListener("animationend", u), () => {
        f.clearTimeout(c), t.removeEventListener("animationstart", m), t.removeEventListener("animationcancel", u), t.removeEventListener("animationend", u);
      };
    } else
      l("ANIMATION_END");
  }, [t, l]), {
    isPresent: ["mounted", "unmountSuspended"].includes(a),
    ref: v.useCallback((c) => {
      r.current = c ? getComputedStyle(c) : null, n(c);
    }, [])
  };
}
function Tr(e) {
  return e?.animationName || "none";
}
function Dp(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var Rp = v[" useId ".trim().toString()] || (() => {
}), Pp = 0;
function xt(e) {
  const [t, n] = v.useState(Rp());
  return Pt(() => {
    n((r) => r ?? String(Pp++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var Op = v.createContext(void 0);
function wu(e) {
  const t = v.useContext(Op);
  return e || t || "ltr";
}
function st(e) {
  const t = v.useRef(e);
  return v.useEffect(() => {
    t.current = e;
  }), v.useMemo(() => (...n) => t.current?.(...n), []);
}
function Tp(e, t = globalThis?.document) {
  const n = st(e);
  v.useEffect(() => {
    const r = (i) => {
      i.key === "Escape" && n(i);
    };
    return t.addEventListener("keydown", r, { capture: !0 }), () => t.removeEventListener("keydown", r, { capture: !0 });
  }, [n, t]);
}
var zp = "DismissableLayer", Uo = "dismissableLayer.update", Bp = "dismissableLayer.pointerDownOutside", Gp = "dismissableLayer.focusOutside", xl, Au = v.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Mi = v.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: i,
      onFocusOutside: o,
      onInteractOutside: s,
      onDismiss: a,
      ...l
    } = e, c = v.useContext(Au), [f, u] = v.useState(null), m = f?.ownerDocument ?? globalThis?.document, [, h] = v.useState({}), p = Ce(t, (O) => u(O)), g = Array.from(c.layers), [y] = [...c.layersWithOutsidePointerEventsDisabled].slice(-1), x = g.indexOf(y), k = f ? g.indexOf(f) : -1, w = c.layersWithOutsidePointerEventsDisabled.size > 0, j = k >= x, S = Yp((O) => {
      const R = O.target, B = [...c.branches].some((C) => C.contains(R));
      !j || B || (i?.(O), s?.(O), O.defaultPrevented || a?.());
    }, m), E = Hp((O) => {
      const R = O.target;
      [...c.branches].some((C) => C.contains(R)) || (o?.(O), s?.(O), O.defaultPrevented || a?.());
    }, m);
    return Tp((O) => {
      k === c.layers.size - 1 && (r?.(O), !O.defaultPrevented && a && (O.preventDefault(), a()));
    }, m), v.useEffect(() => {
      if (f)
        return n && (c.layersWithOutsidePointerEventsDisabled.size === 0 && (xl = m.body.style.pointerEvents, m.body.style.pointerEvents = "none"), c.layersWithOutsidePointerEventsDisabled.add(f)), c.layers.add(f), bl(), () => {
          n && c.layersWithOutsidePointerEventsDisabled.size === 1 && (m.body.style.pointerEvents = xl);
        };
    }, [f, m, n, c]), v.useEffect(() => () => {
      f && (c.layers.delete(f), c.layersWithOutsidePointerEventsDisabled.delete(f), bl());
    }, [f, c]), v.useEffect(() => {
      const O = () => h({});
      return document.addEventListener(Uo, O), () => document.removeEventListener(Uo, O);
    }, []), /* @__PURE__ */ d.jsx(
      ve.div,
      {
        ...l,
        ref: p,
        style: {
          pointerEvents: w ? j ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: te(e.onFocusCapture, E.onFocusCapture),
        onBlurCapture: te(e.onBlurCapture, E.onBlurCapture),
        onPointerDownCapture: te(
          e.onPointerDownCapture,
          S.onPointerDownCapture
        )
      }
    );
  }
);
Mi.displayName = zp;
var Fp = "DismissableLayerBranch", Lp = v.forwardRef((e, t) => {
  const n = v.useContext(Au), r = v.useRef(null), i = Ce(t, r);
  return v.useEffect(() => {
    const o = r.current;
    if (o)
      return n.branches.add(o), () => {
        n.branches.delete(o);
      };
  }, [n.branches]), /* @__PURE__ */ d.jsx(ve.div, { ...e, ref: i });
});
Lp.displayName = Fp;
function Yp(e, t = globalThis?.document) {
  const n = st(e), r = v.useRef(!1), i = v.useRef(() => {
  });
  return v.useEffect(() => {
    const o = (a) => {
      if (a.target && !r.current) {
        let l = function() {
          ku(
            Bp,
            n,
            c,
            { discrete: !0 }
          );
        };
        const c = { originalEvent: a };
        a.pointerType === "touch" ? (t.removeEventListener("click", i.current), i.current = l, t.addEventListener("click", i.current, { once: !0 })) : l();
      } else
        t.removeEventListener("click", i.current);
      r.current = !1;
    }, s = window.setTimeout(() => {
      t.addEventListener("pointerdown", o);
    }, 0);
    return () => {
      window.clearTimeout(s), t.removeEventListener("pointerdown", o), t.removeEventListener("click", i.current);
    };
  }, [t, n]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function Hp(e, t = globalThis?.document) {
  const n = st(e), r = v.useRef(!1);
  return v.useEffect(() => {
    const i = (o) => {
      o.target && !r.current && ku(Gp, n, { originalEvent: o }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", i), () => t.removeEventListener("focusin", i);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function bl() {
  const e = new CustomEvent(Uo);
  document.dispatchEvent(e);
}
function ku(e, t, n, { discrete: r }) {
  const i = n.originalEvent.target, o = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && i.addEventListener(e, t, { once: !0 }), r ? yu(i, o) : i.dispatchEvent(o);
}
var no = "focusScope.autoFocusOnMount", ro = "focusScope.autoFocusOnUnmount", yl = { bubbles: !1, cancelable: !0 }, Qp = "FocusScope", Si = v.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: i,
    onUnmountAutoFocus: o,
    ...s
  } = e, [a, l] = v.useState(null), c = st(i), f = st(o), u = v.useRef(null), m = Ce(t, (g) => l(g)), h = v.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  v.useEffect(() => {
    if (r) {
      let g = function(w) {
        if (h.paused || !a) return;
        const j = w.target;
        a.contains(j) ? u.current = j : Mt(u.current, { select: !0 });
      }, y = function(w) {
        if (h.paused || !a) return;
        const j = w.relatedTarget;
        j !== null && (a.contains(j) || Mt(u.current, { select: !0 }));
      }, x = function(w) {
        if (document.activeElement === document.body)
          for (const S of w)
            S.removedNodes.length > 0 && Mt(a);
      };
      document.addEventListener("focusin", g), document.addEventListener("focusout", y);
      const k = new MutationObserver(x);
      return a && k.observe(a, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", g), document.removeEventListener("focusout", y), k.disconnect();
      };
    }
  }, [r, a, h.paused]), v.useEffect(() => {
    if (a) {
      wl.add(h);
      const g = document.activeElement;
      if (!a.contains(g)) {
        const x = new CustomEvent(no, yl);
        a.addEventListener(no, c), a.dispatchEvent(x), x.defaultPrevented || (Up(qp(Eu(a)), { select: !0 }), document.activeElement === g && Mt(a));
      }
      return () => {
        a.removeEventListener(no, c), setTimeout(() => {
          const x = new CustomEvent(ro, yl);
          a.addEventListener(ro, f), a.dispatchEvent(x), x.defaultPrevented || Mt(g ?? document.body, { select: !0 }), a.removeEventListener(ro, f), wl.remove(h);
        }, 0);
      };
    }
  }, [a, c, f, h]);
  const p = v.useCallback(
    (g) => {
      if (!n && !r || h.paused) return;
      const y = g.key === "Tab" && !g.altKey && !g.ctrlKey && !g.metaKey, x = document.activeElement;
      if (y && x) {
        const k = g.currentTarget, [w, j] = Zp(k);
        w && j ? !g.shiftKey && x === j ? (g.preventDefault(), n && Mt(w, { select: !0 })) : g.shiftKey && x === w && (g.preventDefault(), n && Mt(j, { select: !0 })) : x === k && g.preventDefault();
      }
    },
    [n, r, h.paused]
  );
  return /* @__PURE__ */ d.jsx(ve.div, { tabIndex: -1, ...s, ref: m, onKeyDown: p });
});
Si.displayName = Qp;
function Up(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (Mt(r, { select: t }), document.activeElement !== n) return;
}
function Zp(e) {
  const t = Eu(e), n = vl(t, e), r = vl(t.reverse(), e);
  return [n, r];
}
function Eu(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const i = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function vl(e, t) {
  for (const n of e)
    if (!Wp(n, { upTo: t })) return n;
}
function Wp(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Jp(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Mt(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Jp(e) && t && e.select();
  }
}
var wl = Vp();
function Vp() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && n?.pause(), e = Al(e, t), e.unshift(t);
    },
    remove(t) {
      e = Al(e, t), e[0]?.resume();
    }
  };
}
function Al(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function qp(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Xp = "Portal", Ni = v.forwardRef((e, t) => {
  const { container: n, ...r } = e, [i, o] = v.useState(!1);
  Pt(() => o(!0), []);
  const s = n || i && globalThis?.document?.body;
  return s ? cp.createPortal(/* @__PURE__ */ d.jsx(ve.div, { ...r, ref: t }), s) : null;
});
Ni.displayName = Xp;
var io = 0;
function Ns() {
  v.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? kl()), document.body.insertAdjacentElement("beforeend", e[1] ?? kl()), io++, () => {
      io === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), io--;
    };
  }, []);
}
function kl() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var rt = function() {
  return rt = Object.assign || function(t) {
    for (var n, r = 1, i = arguments.length; r < i; r++) {
      n = arguments[r];
      for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
    }
    return t;
  }, rt.apply(this, arguments);
};
function Cu(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
  return n;
}
function Kp(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, o; r < i; r++)
    (o || !(r in t)) && (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
  return e.concat(o || Array.prototype.slice.call(t));
}
var Xr = "right-scroll-bar-position", Kr = "width-before-scroll-bar", _p = "with-scroll-bars-hidden", $p = "--removed-body-scroll-bar-size";
function oo(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function eg(e, t) {
  var n = ge(function() {
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
          var i = n.value;
          i !== r && (n.value = r, n.callback(r, i));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var tg = typeof window < "u" ? v.useLayoutEffect : v.useEffect, El = /* @__PURE__ */ new WeakMap();
function ng(e, t) {
  var n = eg(null, function(r) {
    return e.forEach(function(i) {
      return oo(i, r);
    });
  });
  return tg(function() {
    var r = El.get(n);
    if (r) {
      var i = new Set(r), o = new Set(e), s = n.current;
      i.forEach(function(a) {
        o.has(a) || oo(a, null);
      }), o.forEach(function(a) {
        i.has(a) || oo(a, s);
      });
    }
    El.set(n, e);
  }, [e]), n;
}
function rg(e) {
  return e;
}
function ig(e, t) {
  t === void 0 && (t = rg);
  var n = [], r = !1, i = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(o) {
      var s = t(o, r);
      return n.push(s), function() {
        n = n.filter(function(a) {
          return a !== s;
        });
      };
    },
    assignSyncMedium: function(o) {
      for (r = !0; n.length; ) {
        var s = n;
        n = [], s.forEach(o);
      }
      n = {
        push: function(a) {
          return o(a);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(o) {
      r = !0;
      var s = [];
      if (n.length) {
        var a = n;
        n = [], a.forEach(o), s = n;
      }
      var l = function() {
        var f = s;
        s = [], f.forEach(o);
      }, c = function() {
        return Promise.resolve().then(l);
      };
      c(), n = {
        push: function(f) {
          s.push(f), c();
        },
        filter: function(f) {
          return s = s.filter(f), n;
        }
      };
    }
  };
  return i;
}
function og(e) {
  e === void 0 && (e = {});
  var t = ig(null);
  return t.options = rt({ async: !0, ssr: !1 }, e), t;
}
var ju = function(e) {
  var t = e.sideCar, n = Cu(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return v.createElement(r, rt({}, n));
};
ju.isSideCarExport = !0;
function sg(e, t) {
  return e.useMedium(t), ju;
}
var Mu = og(), so = function() {
}, Ii = v.forwardRef(function(e, t) {
  var n = v.useRef(null), r = v.useState({
    onScrollCapture: so,
    onWheelCapture: so,
    onTouchMoveCapture: so
  }), i = r[0], o = r[1], s = e.forwardProps, a = e.children, l = e.className, c = e.removeScrollBar, f = e.enabled, u = e.shards, m = e.sideCar, h = e.noRelative, p = e.noIsolation, g = e.inert, y = e.allowPinchZoom, x = e.as, k = x === void 0 ? "div" : x, w = e.gapMode, j = Cu(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), S = m, E = ng([n, t]), O = rt(rt({}, j), i);
  return v.createElement(
    v.Fragment,
    null,
    f && v.createElement(S, { sideCar: Mu, removeScrollBar: c, shards: u, noRelative: h, noIsolation: p, inert: g, setCallbacks: o, allowPinchZoom: !!y, lockRef: n, gapMode: w }),
    s ? v.cloneElement(v.Children.only(a), rt(rt({}, O), { ref: E })) : v.createElement(k, rt({}, O, { className: l, ref: E }), a)
  );
});
Ii.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Ii.classNames = {
  fullWidth: Kr,
  zeroRight: Xr
};
var ag = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function lg() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = ag();
  return t && e.setAttribute("nonce", t), e;
}
function cg(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function ug(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var dg = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = lg()) && (cg(t, n), ug(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, fg = function() {
  var e = dg();
  return function(t, n) {
    v.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, Su = function() {
  var e = fg(), t = function(n) {
    var r = n.styles, i = n.dynamic;
    return e(r, i), null;
  };
  return t;
}, mg = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, ao = function(e) {
  return parseInt(e || "", 10) || 0;
}, hg = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], i = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [ao(n), ao(r), ao(i)];
}, pg = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return mg;
  var t = hg(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, gg = Su(), xn = "data-scroll-locked", xg = function(e, t, n, r) {
  var i = e.left, o = e.top, s = e.right, a = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(_p, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(a, "px ").concat(r, `;
  }
  body[`).concat(xn, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(r, ";"),
    n === "margin" && `
    padding-left: `.concat(i, `px;
    padding-top: `).concat(o, `px;
    padding-right: `).concat(s, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(a, "px ").concat(r, `;
    `),
    n === "padding" && "padding-right: ".concat(a, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Xr, ` {
    right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(Kr, ` {
    margin-right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(Xr, " .").concat(Xr, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(Kr, " .").concat(Kr, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(xn, `] {
    `).concat($p, ": ").concat(a, `px;
  }
`);
}, Cl = function() {
  var e = parseInt(document.body.getAttribute(xn) || "0", 10);
  return isFinite(e) ? e : 0;
}, bg = function() {
  v.useEffect(function() {
    return document.body.setAttribute(xn, (Cl() + 1).toString()), function() {
      var e = Cl() - 1;
      e <= 0 ? document.body.removeAttribute(xn) : document.body.setAttribute(xn, e.toString());
    };
  }, []);
}, yg = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, i = r === void 0 ? "margin" : r;
  bg();
  var o = v.useMemo(function() {
    return pg(i);
  }, [i]);
  return v.createElement(gg, { styles: xg(o, !t, i, n ? "" : "!important") });
}, Zo = !1;
if (typeof window < "u")
  try {
    var zr = Object.defineProperty({}, "passive", {
      get: function() {
        return Zo = !0, !0;
      }
    });
    window.addEventListener("test", zr, zr), window.removeEventListener("test", zr, zr);
  } catch {
    Zo = !1;
  }
var un = Zo ? { passive: !1 } : !1, vg = function(e) {
  return e.tagName === "TEXTAREA";
}, Nu = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !vg(e) && n[t] === "visible")
  );
}, wg = function(e) {
  return Nu(e, "overflowY");
}, Ag = function(e) {
  return Nu(e, "overflowX");
}, jl = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var i = Iu(e, r);
    if (i) {
      var o = Du(e, r), s = o[1], a = o[2];
      if (s > a)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, kg = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, Eg = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, Iu = function(e, t) {
  return e === "v" ? wg(t) : Ag(t);
}, Du = function(e, t) {
  return e === "v" ? kg(t) : Eg(t);
}, Cg = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, jg = function(e, t, n, r, i) {
  var o = Cg(e, window.getComputedStyle(t).direction), s = o * r, a = n.target, l = t.contains(a), c = !1, f = s > 0, u = 0, m = 0;
  do {
    if (!a)
      break;
    var h = Du(e, a), p = h[0], g = h[1], y = h[2], x = g - y - o * p;
    (p || x) && Iu(e, a) && (u += x, m += p);
    var k = a.parentNode;
    a = k && k.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? k.host : k;
  } while (
    // portaled content
    !l && a !== document.body || // self content
    l && (t.contains(a) || t === a)
  );
  return (f && Math.abs(u) < 1 || !f && Math.abs(m) < 1) && (c = !0), c;
}, Br = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Ml = function(e) {
  return [e.deltaX, e.deltaY];
}, Sl = function(e) {
  return e && "current" in e ? e.current : e;
}, Mg = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Sg = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Ng = 0, dn = [];
function Ig(e) {
  var t = v.useRef([]), n = v.useRef([0, 0]), r = v.useRef(), i = v.useState(Ng++)[0], o = v.useState(Su)[0], s = v.useRef(e);
  v.useEffect(function() {
    s.current = e;
  }, [e]), v.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(i));
      var g = Kp([e.lockRef.current], (e.shards || []).map(Sl), !0).filter(Boolean);
      return g.forEach(function(y) {
        return y.classList.add("allow-interactivity-".concat(i));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(i)), g.forEach(function(y) {
          return y.classList.remove("allow-interactivity-".concat(i));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var a = v.useCallback(function(g, y) {
    if ("touches" in g && g.touches.length === 2 || g.type === "wheel" && g.ctrlKey)
      return !s.current.allowPinchZoom;
    var x = Br(g), k = n.current, w = "deltaX" in g ? g.deltaX : k[0] - x[0], j = "deltaY" in g ? g.deltaY : k[1] - x[1], S, E = g.target, O = Math.abs(w) > Math.abs(j) ? "h" : "v";
    if ("touches" in g && O === "h" && E.type === "range")
      return !1;
    var R = window.getSelection(), B = R && R.anchorNode, C = B ? B === E || B.contains(E) : !1;
    if (C)
      return !1;
    var I = jl(O, E);
    if (!I)
      return !0;
    if (I ? S = O : (S = O === "v" ? "h" : "v", I = jl(O, E)), !I)
      return !1;
    if (!r.current && "changedTouches" in g && (w || j) && (r.current = S), !S)
      return !0;
    var z = r.current || S;
    return jg(z, y, g, z === "h" ? w : j);
  }, []), l = v.useCallback(function(g) {
    var y = g;
    if (!(!dn.length || dn[dn.length - 1] !== o)) {
      var x = "deltaY" in y ? Ml(y) : Br(y), k = t.current.filter(function(S) {
        return S.name === y.type && (S.target === y.target || y.target === S.shadowParent) && Mg(S.delta, x);
      })[0];
      if (k && k.should) {
        y.cancelable && y.preventDefault();
        return;
      }
      if (!k) {
        var w = (s.current.shards || []).map(Sl).filter(Boolean).filter(function(S) {
          return S.contains(y.target);
        }), j = w.length > 0 ? a(y, w[0]) : !s.current.noIsolation;
        j && y.cancelable && y.preventDefault();
      }
    }
  }, []), c = v.useCallback(function(g, y, x, k) {
    var w = { name: g, delta: y, target: x, should: k, shadowParent: Dg(x) };
    t.current.push(w), setTimeout(function() {
      t.current = t.current.filter(function(j) {
        return j !== w;
      });
    }, 1);
  }, []), f = v.useCallback(function(g) {
    n.current = Br(g), r.current = void 0;
  }, []), u = v.useCallback(function(g) {
    c(g.type, Ml(g), g.target, a(g, e.lockRef.current));
  }, []), m = v.useCallback(function(g) {
    c(g.type, Br(g), g.target, a(g, e.lockRef.current));
  }, []);
  v.useEffect(function() {
    return dn.push(o), e.setCallbacks({
      onScrollCapture: u,
      onWheelCapture: u,
      onTouchMoveCapture: m
    }), document.addEventListener("wheel", l, un), document.addEventListener("touchmove", l, un), document.addEventListener("touchstart", f, un), function() {
      dn = dn.filter(function(g) {
        return g !== o;
      }), document.removeEventListener("wheel", l, un), document.removeEventListener("touchmove", l, un), document.removeEventListener("touchstart", f, un);
    };
  }, []);
  var h = e.removeScrollBar, p = e.inert;
  return v.createElement(
    v.Fragment,
    null,
    p ? v.createElement(o, { styles: Sg(i) }) : null,
    h ? v.createElement(yg, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function Dg(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const Rg = sg(Mu, Ig);
var Di = v.forwardRef(function(e, t) {
  return v.createElement(Ii, rt({}, e, { ref: t, sideCar: Rg }));
});
Di.classNames = Ii.classNames;
var Pg = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, fn = /* @__PURE__ */ new WeakMap(), Gr = /* @__PURE__ */ new WeakMap(), Fr = {}, lo = 0, Ru = function(e) {
  return e && (e.host || Ru(e.parentNode));
}, Og = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = Ru(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Tg = function(e, t, n, r) {
  var i = Og(t, Array.isArray(e) ? e : [e]);
  Fr[n] || (Fr[n] = /* @__PURE__ */ new WeakMap());
  var o = Fr[n], s = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(u) {
    !u || a.has(u) || (a.add(u), c(u.parentNode));
  };
  i.forEach(c);
  var f = function(u) {
    !u || l.has(u) || Array.prototype.forEach.call(u.children, function(m) {
      if (a.has(m))
        f(m);
      else
        try {
          var h = m.getAttribute(r), p = h !== null && h !== "false", g = (fn.get(m) || 0) + 1, y = (o.get(m) || 0) + 1;
          fn.set(m, g), o.set(m, y), s.push(m), g === 1 && p && Gr.set(m, !0), y === 1 && m.setAttribute(n, "true"), p || m.setAttribute(r, "true");
        } catch (x) {
          console.error("aria-hidden: cannot operate on ", m, x);
        }
    });
  };
  return f(t), a.clear(), lo++, function() {
    s.forEach(function(u) {
      var m = fn.get(u) - 1, h = o.get(u) - 1;
      fn.set(u, m), o.set(u, h), m || (Gr.has(u) || u.removeAttribute(r), Gr.delete(u)), h || u.removeAttribute(n);
    }), lo--, lo || (fn = /* @__PURE__ */ new WeakMap(), fn = /* @__PURE__ */ new WeakMap(), Gr = /* @__PURE__ */ new WeakMap(), Fr = {});
  };
}, Is = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), i = Pg(e);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), Tg(r, i, n, "aria-hidden")) : function() {
    return null;
  };
}, Ri = "Dialog", [Pu] = rn(Ri), [zg, et] = Pu(Ri), Ou = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: i,
    onOpenChange: o,
    modal: s = !0
  } = e, a = v.useRef(null), l = v.useRef(null), [c, f] = pr({
    prop: r,
    defaultProp: i ?? !1,
    onChange: o,
    caller: Ri
  });
  return /* @__PURE__ */ d.jsx(
    zg,
    {
      scope: t,
      triggerRef: a,
      contentRef: l,
      contentId: xt(),
      titleId: xt(),
      descriptionId: xt(),
      open: c,
      onOpenChange: f,
      onOpenToggle: v.useCallback(() => f((u) => !u), [f]),
      modal: s,
      children: n
    }
  );
};
Ou.displayName = Ri;
var Tu = "DialogTrigger", zu = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = et(Tu, n), o = Ce(t, i.triggerRef);
    return /* @__PURE__ */ d.jsx(
      ve.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": i.open,
        "aria-controls": i.contentId,
        "data-state": Ps(i.open),
        ...r,
        ref: o,
        onClick: te(e.onClick, i.onOpenToggle)
      }
    );
  }
);
zu.displayName = Tu;
var Ds = "DialogPortal", [Bg, Bu] = Pu(Ds, {
  forceMount: void 0
}), Gu = (e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: i } = e, o = et(Ds, t);
  return /* @__PURE__ */ d.jsx(Bg, { scope: t, forceMount: n, children: v.Children.map(r, (s) => /* @__PURE__ */ d.jsx(ct, { present: n || o.open, children: /* @__PURE__ */ d.jsx(Ni, { asChild: !0, container: i, children: s }) })) });
};
Gu.displayName = Ds;
var ii = "DialogOverlay", Fu = v.forwardRef(
  (e, t) => {
    const n = Bu(ii, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, o = et(ii, e.__scopeDialog);
    return o.modal ? /* @__PURE__ */ d.jsx(ct, { present: r || o.open, children: /* @__PURE__ */ d.jsx(Fg, { ...i, ref: t }) }) : null;
  }
);
Fu.displayName = ii;
var Gg = /* @__PURE__ */ Kt("DialogOverlay.RemoveScroll"), Fg = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = et(ii, n);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ d.jsx(Di, { as: Gg, allowPinchZoom: !0, shards: [i.contentRef], children: /* @__PURE__ */ d.jsx(
        ve.div,
        {
          "data-state": Ps(i.open),
          ...r,
          ref: t,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), _t = "DialogContent", Lu = v.forwardRef(
  (e, t) => {
    const n = Bu(_t, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, o = et(_t, e.__scopeDialog);
    return /* @__PURE__ */ d.jsx(ct, { present: r || o.open, children: o.modal ? /* @__PURE__ */ d.jsx(Lg, { ...i, ref: t }) : /* @__PURE__ */ d.jsx(Yg, { ...i, ref: t }) });
  }
);
Lu.displayName = _t;
var Lg = v.forwardRef(
  (e, t) => {
    const n = et(_t, e.__scopeDialog), r = v.useRef(null), i = Ce(t, n.contentRef, r);
    return v.useEffect(() => {
      const o = r.current;
      if (o) return Is(o);
    }, []), /* @__PURE__ */ d.jsx(
      Yu,
      {
        ...e,
        ref: i,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: te(e.onCloseAutoFocus, (o) => {
          o.preventDefault(), n.triggerRef.current?.focus();
        }),
        onPointerDownOutside: te(e.onPointerDownOutside, (o) => {
          const s = o.detail.originalEvent, a = s.button === 0 && s.ctrlKey === !0;
          (s.button === 2 || a) && o.preventDefault();
        }),
        onFocusOutside: te(
          e.onFocusOutside,
          (o) => o.preventDefault()
        )
      }
    );
  }
), Yg = v.forwardRef(
  (e, t) => {
    const n = et(_t, e.__scopeDialog), r = v.useRef(!1), i = v.useRef(!1);
    return /* @__PURE__ */ d.jsx(
      Yu,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (o) => {
          e.onCloseAutoFocus?.(o), o.defaultPrevented || (r.current || n.triggerRef.current?.focus(), o.preventDefault()), r.current = !1, i.current = !1;
        },
        onInteractOutside: (o) => {
          e.onInteractOutside?.(o), o.defaultPrevented || (r.current = !0, o.detail.originalEvent.type === "pointerdown" && (i.current = !0));
          const s = o.target;
          n.triggerRef.current?.contains(s) && o.preventDefault(), o.detail.originalEvent.type === "focusin" && i.current && o.preventDefault();
        }
      }
    );
  }
), Yu = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: i, onCloseAutoFocus: o, ...s } = e, a = et(_t, n), l = v.useRef(null), c = Ce(t, l);
    return Ns(), /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx(
        Si,
        {
          asChild: !0,
          loop: !0,
          trapped: r,
          onMountAutoFocus: i,
          onUnmountAutoFocus: o,
          children: /* @__PURE__ */ d.jsx(
            Mi,
            {
              role: "dialog",
              id: a.contentId,
              "aria-describedby": a.descriptionId,
              "aria-labelledby": a.titleId,
              "data-state": Ps(a.open),
              ...s,
              ref: c,
              onDismiss: () => a.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
        /* @__PURE__ */ d.jsx(Hg, { titleId: a.titleId }),
        /* @__PURE__ */ d.jsx(Ug, { contentRef: l, descriptionId: a.descriptionId })
      ] })
    ] });
  }
), Rs = "DialogTitle", Hu = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = et(Rs, n);
    return /* @__PURE__ */ d.jsx(ve.h2, { id: i.titleId, ...r, ref: t });
  }
);
Hu.displayName = Rs;
var Qu = "DialogDescription", Uu = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = et(Qu, n);
    return /* @__PURE__ */ d.jsx(ve.p, { id: i.descriptionId, ...r, ref: t });
  }
);
Uu.displayName = Qu;
var Zu = "DialogClose", Wu = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = et(Zu, n);
    return /* @__PURE__ */ d.jsx(
      ve.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: te(e.onClick, () => i.onOpenChange(!1))
      }
    );
  }
);
Wu.displayName = Zu;
function Ps(e) {
  return e ? "open" : "closed";
}
var Ju = "DialogTitleWarning", [bN, Vu] = Ep(Ju, {
  contentName: _t,
  titleName: Rs,
  docsSlug: "dialog"
}), Hg = ({ titleId: e }) => {
  const t = Vu(Ju), n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return v.useEffect(() => {
    e && (document.getElementById(e) || console.error(n));
  }, [n, e]), null;
}, Qg = "DialogDescriptionWarning", Ug = ({ contentRef: e, descriptionId: t }) => {
  const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Vu(Qg).contentName}}.`;
  return v.useEffect(() => {
    const i = e.current?.getAttribute("aria-describedby");
    t && i && (document.getElementById(t) || console.warn(r));
  }, [r, e, t]), null;
}, Os = Ou, qu = zu, Ts = Gu, zs = Fu, Bs = Lu, Gs = Hu, Xu = Uu, gr = Wu;
function Zg(e) {
  const [t, n] = v.useState(void 0);
  return Pt(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((i) => {
        if (!Array.isArray(i) || !i.length)
          return;
        const o = i[0];
        let s, a;
        if ("borderBoxSize" in o) {
          const l = o.borderBoxSize, c = Array.isArray(l) ? l[0] : l;
          s = c.inlineSize, a = c.blockSize;
        } else
          s = e.offsetWidth, a = e.offsetHeight;
        n({ width: s, height: a });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
const Wg = ["top", "right", "bottom", "left"], Ot = Math.min, Be = Math.max, oi = Math.round, Lr = Math.floor, ot = (e) => ({
  x: e,
  y: e
}), Jg = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Wo(e, t, n) {
  return Be(e, Ot(t, n));
}
function bt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function yt(e) {
  return e.split("-")[0];
}
function jn(e) {
  return e.split("-")[1];
}
function Fs(e) {
  return e === "x" ? "y" : "x";
}
function Ls(e) {
  return e === "y" ? "height" : "width";
}
function it(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function Ys(e) {
  return Fs(it(e));
}
function Vg(e, t, n) {
  n === void 0 && (n = !1);
  const r = jn(e), i = Ys(e), o = Ls(i);
  let s = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[o] > t.floating[o] && (s = si(s)), [s, si(s)];
}
function qg(e) {
  const t = si(e);
  return [Jo(e), t, Jo(t)];
}
function Jo(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const Nl = ["left", "right"], Il = ["right", "left"], Xg = ["top", "bottom"], Kg = ["bottom", "top"];
function _g(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Il : Nl : t ? Nl : Il;
    case "left":
    case "right":
      return t ? Xg : Kg;
    default:
      return [];
  }
}
function $g(e, t, n, r) {
  const i = jn(e);
  let o = _g(yt(e), n === "start", r);
  return i && (o = o.map((s) => s + "-" + i), t && (o = o.concat(o.map(Jo)))), o;
}
function si(e) {
  const t = yt(e);
  return Jg[t] + e.slice(t.length);
}
function ex(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Ku(e) {
  return typeof e != "number" ? ex(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function ai(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: i
  } = e;
  return {
    width: r,
    height: i,
    top: n,
    left: t,
    right: t + r,
    bottom: n + i,
    x: t,
    y: n
  };
}
function Dl(e, t, n) {
  let {
    reference: r,
    floating: i
  } = e;
  const o = it(t), s = Ys(t), a = Ls(s), l = yt(t), c = o === "y", f = r.x + r.width / 2 - i.width / 2, u = r.y + r.height / 2 - i.height / 2, m = r[a] / 2 - i[a] / 2;
  let h;
  switch (l) {
    case "top":
      h = {
        x: f,
        y: r.y - i.height
      };
      break;
    case "bottom":
      h = {
        x: f,
        y: r.y + r.height
      };
      break;
    case "right":
      h = {
        x: r.x + r.width,
        y: u
      };
      break;
    case "left":
      h = {
        x: r.x - i.width,
        y: u
      };
      break;
    default:
      h = {
        x: r.x,
        y: r.y
      };
  }
  switch (jn(t)) {
    case "start":
      h[s] -= m * (n && c ? -1 : 1);
      break;
    case "end":
      h[s] += m * (n && c ? -1 : 1);
      break;
  }
  return h;
}
async function tx(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: i,
    platform: o,
    rects: s,
    elements: a,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: f = "viewport",
    elementContext: u = "floating",
    altBoundary: m = !1,
    padding: h = 0
  } = bt(t, e), p = Ku(h), y = a[m ? u === "floating" ? "reference" : "floating" : u], x = ai(await o.getClippingRect({
    element: (n = await (o.isElement == null ? void 0 : o.isElement(y))) == null || n ? y : y.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: f,
    strategy: l
  })), k = u === "floating" ? {
    x: r,
    y: i,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, w = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), j = await (o.isElement == null ? void 0 : o.isElement(w)) ? await (o.getScale == null ? void 0 : o.getScale(w)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, S = ai(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: k,
    offsetParent: w,
    strategy: l
  }) : k);
  return {
    top: (x.top - S.top + p.top) / j.y,
    bottom: (S.bottom - x.bottom + p.bottom) / j.y,
    left: (x.left - S.left + p.left) / j.x,
    right: (S.right - x.right + p.right) / j.x
  };
}
const nx = 50, rx = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: o = [],
    platform: s
  } = n, a = s.detectOverflow ? s : {
    ...s,
    detectOverflow: tx
  }, l = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let c = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: i
  }), {
    x: f,
    y: u
  } = Dl(c, r, l), m = r, h = 0;
  const p = {};
  for (let g = 0; g < o.length; g++) {
    const y = o[g];
    if (!y)
      continue;
    const {
      name: x,
      fn: k
    } = y, {
      x: w,
      y: j,
      data: S,
      reset: E
    } = await k({
      x: f,
      y: u,
      initialPlacement: r,
      placement: m,
      strategy: i,
      middlewareData: p,
      rects: c,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    f = w ?? f, u = j ?? u, p[x] = {
      ...p[x],
      ...S
    }, E && h < nx && (h++, typeof E == "object" && (E.placement && (m = E.placement), E.rects && (c = E.rects === !0 ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: i
    }) : E.rects), {
      x: f,
      y: u
    } = Dl(c, m, l)), g = -1);
  }
  return {
    x: f,
    y: u,
    placement: m,
    strategy: i,
    middlewareData: p
  };
}, ix = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: r,
      placement: i,
      rects: o,
      platform: s,
      elements: a,
      middlewareData: l
    } = t, {
      element: c,
      padding: f = 0
    } = bt(e, t) || {};
    if (c == null)
      return {};
    const u = Ku(f), m = {
      x: n,
      y: r
    }, h = Ys(i), p = Ls(h), g = await s.getDimensions(c), y = h === "y", x = y ? "top" : "left", k = y ? "bottom" : "right", w = y ? "clientHeight" : "clientWidth", j = o.reference[p] + o.reference[h] - m[h] - o.floating[p], S = m[h] - o.reference[h], E = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(c));
    let O = E ? E[w] : 0;
    (!O || !await (s.isElement == null ? void 0 : s.isElement(E))) && (O = a.floating[w] || o.floating[p]);
    const R = j / 2 - S / 2, B = O / 2 - g[p] / 2 - 1, C = Ot(u[x], B), I = Ot(u[k], B), z = C, W = O - g[p] - I, P = O / 2 - g[p] / 2 + R, M = Wo(z, P, W), D = !l.arrow && jn(i) != null && P !== M && o.reference[p] / 2 - (P < z ? C : I) - g[p] / 2 < 0, F = D ? P < z ? P - z : P - W : 0;
    return {
      [h]: m[h] + F,
      data: {
        [h]: M,
        centerOffset: P - M - F,
        ...D && {
          alignmentOffset: F
        }
      },
      reset: D
    };
  }
}), ox = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: i,
        middlewareData: o,
        rects: s,
        initialPlacement: a,
        platform: l,
        elements: c
      } = t, {
        mainAxis: f = !0,
        crossAxis: u = !0,
        fallbackPlacements: m,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: g = !0,
        ...y
      } = bt(e, t);
      if ((n = o.arrow) != null && n.alignmentOffset)
        return {};
      const x = yt(i), k = it(a), w = yt(a) === a, j = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), S = m || (w || !g ? [si(a)] : qg(a)), E = p !== "none";
      !m && E && S.push(...$g(a, g, p, j));
      const O = [a, ...S], R = await l.detectOverflow(t, y), B = [];
      let C = ((r = o.flip) == null ? void 0 : r.overflows) || [];
      if (f && B.push(R[x]), u) {
        const P = Vg(i, s, j);
        B.push(R[P[0]], R[P[1]]);
      }
      if (C = [...C, {
        placement: i,
        overflows: B
      }], !B.every((P) => P <= 0)) {
        var I, z;
        const P = (((I = o.flip) == null ? void 0 : I.index) || 0) + 1, M = O[P];
        if (M && (!(u === "alignment" ? k !== it(M) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        C.every((T) => it(T.placement) === k ? T.overflows[0] > 0 : !0)))
          return {
            data: {
              index: P,
              overflows: C
            },
            reset: {
              placement: M
            }
          };
        let D = (z = C.filter((F) => F.overflows[0] <= 0).sort((F, T) => F.overflows[1] - T.overflows[1])[0]) == null ? void 0 : z.placement;
        if (!D)
          switch (h) {
            case "bestFit": {
              var W;
              const F = (W = C.filter((T) => {
                if (E) {
                  const G = it(T.placement);
                  return G === k || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  G === "y";
                }
                return !0;
              }).map((T) => [T.placement, T.overflows.filter((G) => G > 0).reduce((G, b) => G + b, 0)]).sort((T, G) => T[1] - G[1])[0]) == null ? void 0 : W[0];
              F && (D = F);
              break;
            }
            case "initialPlacement":
              D = a;
              break;
          }
        if (i !== D)
          return {
            reset: {
              placement: D
            }
          };
      }
      return {};
    }
  };
};
function Rl(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function Pl(e) {
  return Wg.some((t) => e[t] >= 0);
}
const sx = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n,
        platform: r
      } = t, {
        strategy: i = "referenceHidden",
        ...o
      } = bt(e, t);
      switch (i) {
        case "referenceHidden": {
          const s = await r.detectOverflow(t, {
            ...o,
            elementContext: "reference"
          }), a = Rl(s, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Pl(a)
            }
          };
        }
        case "escaped": {
          const s = await r.detectOverflow(t, {
            ...o,
            altBoundary: !0
          }), a = Rl(s, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Pl(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, _u = /* @__PURE__ */ new Set(["left", "top"]);
async function ax(e, t) {
  const {
    placement: n,
    platform: r,
    elements: i
  } = e, o = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), s = yt(n), a = jn(n), l = it(n) === "y", c = _u.has(s) ? -1 : 1, f = o && l ? -1 : 1, u = bt(t, e);
  let {
    mainAxis: m,
    crossAxis: h,
    alignmentAxis: p
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return a && typeof p == "number" && (h = a === "end" ? p * -1 : p), l ? {
    x: h * f,
    y: m * c
  } : {
    x: m * c,
    y: h * f
  };
}
const lx = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r;
      const {
        x: i,
        y: o,
        placement: s,
        middlewareData: a
      } = t, l = await ax(t, e);
      return s === ((n = a.offset) == null ? void 0 : n.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: i + l.x,
        y: o + l.y,
        data: {
          ...l,
          placement: s
        }
      };
    }
  };
}, cx = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: i,
        platform: o
      } = t, {
        mainAxis: s = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (x) => {
            let {
              x: k,
              y: w
            } = x;
            return {
              x: k,
              y: w
            };
          }
        },
        ...c
      } = bt(e, t), f = {
        x: n,
        y: r
      }, u = await o.detectOverflow(t, c), m = it(yt(i)), h = Fs(m);
      let p = f[h], g = f[m];
      if (s) {
        const x = h === "y" ? "top" : "left", k = h === "y" ? "bottom" : "right", w = p + u[x], j = p - u[k];
        p = Wo(w, p, j);
      }
      if (a) {
        const x = m === "y" ? "top" : "left", k = m === "y" ? "bottom" : "right", w = g + u[x], j = g - u[k];
        g = Wo(w, g, j);
      }
      const y = l.fn({
        ...t,
        [h]: p,
        [m]: g
      });
      return {
        ...y,
        data: {
          x: y.x - n,
          y: y.y - r,
          enabled: {
            [h]: s,
            [m]: a
          }
        }
      };
    }
  };
}, ux = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: n,
        y: r,
        placement: i,
        rects: o,
        middlewareData: s
      } = t, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: c = !0
      } = bt(e, t), f = {
        x: n,
        y: r
      }, u = it(i), m = Fs(u);
      let h = f[m], p = f[u];
      const g = bt(a, t), y = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (l) {
        const w = m === "y" ? "height" : "width", j = o.reference[m] - o.floating[w] + y.mainAxis, S = o.reference[m] + o.reference[w] - y.mainAxis;
        h < j ? h = j : h > S && (h = S);
      }
      if (c) {
        var x, k;
        const w = m === "y" ? "width" : "height", j = _u.has(yt(i)), S = o.reference[u] - o.floating[w] + (j && ((x = s.offset) == null ? void 0 : x[u]) || 0) + (j ? 0 : y.crossAxis), E = o.reference[u] + o.reference[w] + (j ? 0 : ((k = s.offset) == null ? void 0 : k[u]) || 0) - (j ? y.crossAxis : 0);
        p < S ? p = S : p > E && (p = E);
      }
      return {
        [m]: h,
        [u]: p
      };
    }
  };
}, dx = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: i,
        rects: o,
        platform: s,
        elements: a
      } = t, {
        apply: l = () => {
        },
        ...c
      } = bt(e, t), f = await s.detectOverflow(t, c), u = yt(i), m = jn(i), h = it(i) === "y", {
        width: p,
        height: g
      } = o.floating;
      let y, x;
      u === "top" || u === "bottom" ? (y = u, x = m === (await (s.isRTL == null ? void 0 : s.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (x = u, y = m === "end" ? "top" : "bottom");
      const k = g - f.top - f.bottom, w = p - f.left - f.right, j = Ot(g - f[y], k), S = Ot(p - f[x], w), E = !t.middlewareData.shift;
      let O = j, R = S;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (R = w), (r = t.middlewareData.shift) != null && r.enabled.y && (O = k), E && !m) {
        const C = Be(f.left, 0), I = Be(f.right, 0), z = Be(f.top, 0), W = Be(f.bottom, 0);
        h ? R = p - 2 * (C !== 0 || I !== 0 ? C + I : Be(f.left, f.right)) : O = g - 2 * (z !== 0 || W !== 0 ? z + W : Be(f.top, f.bottom));
      }
      await l({
        ...t,
        availableWidth: R,
        availableHeight: O
      });
      const B = await s.getDimensions(a.floating);
      return p !== B.width || g !== B.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Pi() {
  return typeof window < "u";
}
function Mn(e) {
  return $u(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Fe(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ut(e) {
  var t;
  return (t = ($u(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function $u(e) {
  return Pi() ? e instanceof Node || e instanceof Fe(e).Node : !1;
}
function Ke(e) {
  return Pi() ? e instanceof Element || e instanceof Fe(e).Element : !1;
}
function vt(e) {
  return Pi() ? e instanceof HTMLElement || e instanceof Fe(e).HTMLElement : !1;
}
function Ol(e) {
  return !Pi() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Fe(e).ShadowRoot;
}
function xr(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: i
  } = _e(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function fx(e) {
  return /^(table|td|th)$/.test(Mn(e));
}
function Oi(e) {
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
const mx = /transform|translate|scale|rotate|perspective|filter/, hx = /paint|layout|strict|content/, Qt = (e) => !!e && e !== "none";
let co;
function Hs(e) {
  const t = Ke(e) ? _e(e) : e;
  return Qt(t.transform) || Qt(t.translate) || Qt(t.scale) || Qt(t.rotate) || Qt(t.perspective) || !Qs() && (Qt(t.backdropFilter) || Qt(t.filter)) || mx.test(t.willChange || "") || hx.test(t.contain || "");
}
function px(e) {
  let t = Tt(e);
  for (; vt(t) && !An(t); ) {
    if (Hs(t))
      return t;
    if (Oi(t))
      return null;
    t = Tt(t);
  }
  return null;
}
function Qs() {
  return co == null && (co = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), co;
}
function An(e) {
  return /^(html|body|#document)$/.test(Mn(e));
}
function _e(e) {
  return Fe(e).getComputedStyle(e);
}
function Ti(e) {
  return Ke(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function Tt(e) {
  if (Mn(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Ol(e) && e.host || // Fallback.
    ut(e)
  );
  return Ol(t) ? t.host : t;
}
function ed(e) {
  const t = Tt(e);
  return An(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : vt(t) && xr(t) ? t : ed(t);
}
function er(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const i = ed(e), o = i === ((r = e.ownerDocument) == null ? void 0 : r.body), s = Fe(i);
  if (o) {
    const a = Vo(s);
    return t.concat(s, s.visualViewport || [], xr(i) ? i : [], a && n ? er(a) : []);
  } else
    return t.concat(i, er(i, [], n));
}
function Vo(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function td(e) {
  const t = _e(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const i = vt(e), o = i ? e.offsetWidth : n, s = i ? e.offsetHeight : r, a = oi(n) !== o || oi(r) !== s;
  return a && (n = o, r = s), {
    width: n,
    height: r,
    $: a
  };
}
function Us(e) {
  return Ke(e) ? e : e.contextElement;
}
function bn(e) {
  const t = Us(e);
  if (!vt(t))
    return ot(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: i,
    $: o
  } = td(t);
  let s = (o ? oi(n.width) : n.width) / r, a = (o ? oi(n.height) : n.height) / i;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const gx = /* @__PURE__ */ ot(0);
function nd(e) {
  const t = Fe(e);
  return !Qs() || !t.visualViewport ? gx : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function xx(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== Fe(e) ? !1 : t;
}
function $t(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), o = Us(e);
  let s = ot(1);
  t && (r ? Ke(r) && (s = bn(r)) : s = bn(e));
  const a = xx(o, n, r) ? nd(o) : ot(0);
  let l = (i.left + a.x) / s.x, c = (i.top + a.y) / s.y, f = i.width / s.x, u = i.height / s.y;
  if (o) {
    const m = Fe(o), h = r && Ke(r) ? Fe(r) : r;
    let p = m, g = Vo(p);
    for (; g && r && h !== p; ) {
      const y = bn(g), x = g.getBoundingClientRect(), k = _e(g), w = x.left + (g.clientLeft + parseFloat(k.paddingLeft)) * y.x, j = x.top + (g.clientTop + parseFloat(k.paddingTop)) * y.y;
      l *= y.x, c *= y.y, f *= y.x, u *= y.y, l += w, c += j, p = Fe(g), g = Vo(p);
    }
  }
  return ai({
    width: f,
    height: u,
    x: l,
    y: c
  });
}
function zi(e, t) {
  const n = Ti(e).scrollLeft;
  return t ? t.left + n : $t(ut(e)).left + n;
}
function rd(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - zi(e, n), i = n.top + t.scrollTop;
  return {
    x: r,
    y: i
  };
}
function bx(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: i
  } = e;
  const o = i === "fixed", s = ut(r), a = t ? Oi(t.floating) : !1;
  if (r === s || a && o)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = ot(1);
  const f = ot(0), u = vt(r);
  if ((u || !u && !o) && ((Mn(r) !== "body" || xr(s)) && (l = Ti(r)), u)) {
    const h = $t(r);
    c = bn(r), f.x = h.x + r.clientLeft, f.y = h.y + r.clientTop;
  }
  const m = s && !u && !o ? rd(s, l) : ot(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + f.x + m.x,
    y: n.y * c.y - l.scrollTop * c.y + f.y + m.y
  };
}
function yx(e) {
  return Array.from(e.getClientRects());
}
function vx(e) {
  const t = ut(e), n = Ti(e), r = e.ownerDocument.body, i = Be(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), o = Be(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let s = -n.scrollLeft + zi(e);
  const a = -n.scrollTop;
  return _e(r).direction === "rtl" && (s += Be(t.clientWidth, r.clientWidth) - i), {
    width: i,
    height: o,
    x: s,
    y: a
  };
}
const Tl = 25;
function wx(e, t) {
  const n = Fe(e), r = ut(e), i = n.visualViewport;
  let o = r.clientWidth, s = r.clientHeight, a = 0, l = 0;
  if (i) {
    o = i.width, s = i.height;
    const f = Qs();
    (!f || f && t === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = zi(r);
  if (c <= 0) {
    const f = r.ownerDocument, u = f.body, m = getComputedStyle(u), h = f.compatMode === "CSS1Compat" && parseFloat(m.marginLeft) + parseFloat(m.marginRight) || 0, p = Math.abs(r.clientWidth - u.clientWidth - h);
    p <= Tl && (o -= p);
  } else c <= Tl && (o += c);
  return {
    width: o,
    height: s,
    x: a,
    y: l
  };
}
function Ax(e, t) {
  const n = $t(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, o = vt(e) ? bn(e) : ot(1), s = e.clientWidth * o.x, a = e.clientHeight * o.y, l = i * o.x, c = r * o.y;
  return {
    width: s,
    height: a,
    x: l,
    y: c
  };
}
function zl(e, t, n) {
  let r;
  if (t === "viewport")
    r = wx(e, n);
  else if (t === "document")
    r = vx(ut(e));
  else if (Ke(t))
    r = Ax(t, n);
  else {
    const i = nd(e);
    r = {
      x: t.x - i.x,
      y: t.y - i.y,
      width: t.width,
      height: t.height
    };
  }
  return ai(r);
}
function id(e, t) {
  const n = Tt(e);
  return n === t || !Ke(n) || An(n) ? !1 : _e(n).position === "fixed" || id(n, t);
}
function kx(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = er(e, [], !1).filter((a) => Ke(a) && Mn(a) !== "body"), i = null;
  const o = _e(e).position === "fixed";
  let s = o ? Tt(e) : e;
  for (; Ke(s) && !An(s); ) {
    const a = _e(s), l = Hs(s);
    !l && a.position === "fixed" && (i = null), (o ? !l && !i : !l && a.position === "static" && !!i && (i.position === "absolute" || i.position === "fixed") || xr(s) && !l && id(e, s)) ? r = r.filter((f) => f !== s) : i = a, s = Tt(s);
  }
  return t.set(e, r), r;
}
function Ex(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: i
  } = e;
  const s = [...n === "clippingAncestors" ? Oi(t) ? [] : kx(t, this._c) : [].concat(n), r], a = zl(t, s[0], i);
  let l = a.top, c = a.right, f = a.bottom, u = a.left;
  for (let m = 1; m < s.length; m++) {
    const h = zl(t, s[m], i);
    l = Be(h.top, l), c = Ot(h.right, c), f = Ot(h.bottom, f), u = Be(h.left, u);
  }
  return {
    width: c - u,
    height: f - l,
    x: u,
    y: l
  };
}
function Cx(e) {
  const {
    width: t,
    height: n
  } = td(e);
  return {
    width: t,
    height: n
  };
}
function jx(e, t, n) {
  const r = vt(t), i = ut(t), o = n === "fixed", s = $t(e, !0, o, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = ot(0);
  function c() {
    l.x = zi(i);
  }
  if (r || !r && !o)
    if ((Mn(t) !== "body" || xr(i)) && (a = Ti(t)), r) {
      const h = $t(t, !0, o, t);
      l.x = h.x + t.clientLeft, l.y = h.y + t.clientTop;
    } else i && c();
  o && !r && i && c();
  const f = i && !r && !o ? rd(i, a) : ot(0), u = s.left + a.scrollLeft - l.x - f.x, m = s.top + a.scrollTop - l.y - f.y;
  return {
    x: u,
    y: m,
    width: s.width,
    height: s.height
  };
}
function uo(e) {
  return _e(e).position === "static";
}
function Bl(e, t) {
  if (!vt(e) || _e(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return ut(e) === n && (n = n.ownerDocument.body), n;
}
function od(e, t) {
  const n = Fe(e);
  if (Oi(e))
    return n;
  if (!vt(e)) {
    let i = Tt(e);
    for (; i && !An(i); ) {
      if (Ke(i) && !uo(i))
        return i;
      i = Tt(i);
    }
    return n;
  }
  let r = Bl(e, t);
  for (; r && fx(r) && uo(r); )
    r = Bl(r, t);
  return r && An(r) && uo(r) && !Hs(r) ? n : r || px(e) || n;
}
const Mx = async function(e) {
  const t = this.getOffsetParent || od, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: jx(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Sx(e) {
  return _e(e).direction === "rtl";
}
const Nx = {
  convertOffsetParentRelativeRectToViewportRelativeRect: bx,
  getDocumentElement: ut,
  getClippingRect: Ex,
  getOffsetParent: od,
  getElementRects: Mx,
  getClientRects: yx,
  getDimensions: Cx,
  getScale: bn,
  isElement: Ke,
  isRTL: Sx
};
function sd(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Ix(e, t) {
  let n = null, r;
  const i = ut(e);
  function o() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), o();
    const c = e.getBoundingClientRect(), {
      left: f,
      top: u,
      width: m,
      height: h
    } = c;
    if (a || t(), !m || !h)
      return;
    const p = Lr(u), g = Lr(i.clientWidth - (f + m)), y = Lr(i.clientHeight - (u + h)), x = Lr(f), w = {
      rootMargin: -p + "px " + -g + "px " + -y + "px " + -x + "px",
      threshold: Be(0, Ot(1, l)) || 1
    };
    let j = !0;
    function S(E) {
      const O = E[0].intersectionRatio;
      if (O !== l) {
        if (!j)
          return s();
        O ? s(!1, O) : r = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      O === 1 && !sd(c, e.getBoundingClientRect()) && s(), j = !1;
    }
    try {
      n = new IntersectionObserver(S, {
        ...w,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(S, w);
    }
    n.observe(e);
  }
  return s(!0), o;
}
function Dx(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: o = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = Us(e), f = i || o ? [...c ? er(c) : [], ...t ? er(t) : []] : [];
  f.forEach((x) => {
    i && x.addEventListener("scroll", n, {
      passive: !0
    }), o && x.addEventListener("resize", n);
  });
  const u = c && a ? Ix(c, n) : null;
  let m = -1, h = null;
  s && (h = new ResizeObserver((x) => {
    let [k] = x;
    k && k.target === c && h && t && (h.unobserve(t), cancelAnimationFrame(m), m = requestAnimationFrame(() => {
      var w;
      (w = h) == null || w.observe(t);
    })), n();
  }), c && !l && h.observe(c), t && h.observe(t));
  let p, g = l ? $t(e) : null;
  l && y();
  function y() {
    const x = $t(e);
    g && !sd(g, x) && n(), g = x, p = requestAnimationFrame(y);
  }
  return n(), () => {
    var x;
    f.forEach((k) => {
      i && k.removeEventListener("scroll", n), o && k.removeEventListener("resize", n);
    }), u?.(), (x = h) == null || x.disconnect(), h = null, l && cancelAnimationFrame(p);
  };
}
const Rx = lx, Px = cx, Ox = ox, Tx = dx, zx = sx, Gl = ix, Bx = ux, Gx = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: Nx,
    ...n
  }, o = {
    ...i.platform,
    _c: r
  };
  return rx(e, t, {
    ...i,
    platform: o
  });
};
var Fx = typeof document < "u", Lx = function() {
}, _r = Fx ? $n : Lx;
function li(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, i;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!li(e[r], t[r]))
          return !1;
      return !0;
    }
    if (i = Object.keys(e), n = i.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!{}.hasOwnProperty.call(t, i[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const o = i[r];
      if (!(o === "_owner" && e.$$typeof) && !li(e[o], t[o]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function ad(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Fl(e, t) {
  const n = ad(e);
  return Math.round(t * n) / n;
}
function fo(e) {
  const t = v.useRef(e);
  return _r(() => {
    t.current = e;
  }), t;
}
function Yx(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: r = [],
    platform: i,
    elements: {
      reference: o,
      floating: s
    } = {},
    transform: a = !0,
    whileElementsMounted: l,
    open: c
  } = e, [f, u] = v.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [m, h] = v.useState(r);
  li(m, r) || h(r);
  const [p, g] = v.useState(null), [y, x] = v.useState(null), k = v.useCallback((T) => {
    T !== E.current && (E.current = T, g(T));
  }, []), w = v.useCallback((T) => {
    T !== O.current && (O.current = T, x(T));
  }, []), j = o || p, S = s || y, E = v.useRef(null), O = v.useRef(null), R = v.useRef(f), B = l != null, C = fo(l), I = fo(i), z = fo(c), W = v.useCallback(() => {
    if (!E.current || !O.current)
      return;
    const T = {
      placement: t,
      strategy: n,
      middleware: m
    };
    I.current && (T.platform = I.current), Gx(E.current, O.current, T).then((G) => {
      const b = {
        ...G,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: z.current !== !1
      };
      P.current && !li(R.current, b) && (R.current = b, mu.flushSync(() => {
        u(b);
      }));
    });
  }, [m, t, n, I, z]);
  _r(() => {
    c === !1 && R.current.isPositioned && (R.current.isPositioned = !1, u((T) => ({
      ...T,
      isPositioned: !1
    })));
  }, [c]);
  const P = v.useRef(!1);
  _r(() => (P.current = !0, () => {
    P.current = !1;
  }), []), _r(() => {
    if (j && (E.current = j), S && (O.current = S), j && S) {
      if (C.current)
        return C.current(j, S, W);
      W();
    }
  }, [j, S, W, C, B]);
  const M = v.useMemo(() => ({
    reference: E,
    floating: O,
    setReference: k,
    setFloating: w
  }), [k, w]), D = v.useMemo(() => ({
    reference: j,
    floating: S
  }), [j, S]), F = v.useMemo(() => {
    const T = {
      position: n,
      left: 0,
      top: 0
    };
    if (!D.floating)
      return T;
    const G = Fl(D.floating, f.x), b = Fl(D.floating, f.y);
    return a ? {
      ...T,
      transform: "translate(" + G + "px, " + b + "px)",
      ...ad(D.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: G,
      top: b
    };
  }, [n, a, D.floating, f.x, f.y]);
  return v.useMemo(() => ({
    ...f,
    update: W,
    refs: M,
    elements: D,
    floatingStyles: F
  }), [f, W, M, D, F]);
}
const Hx = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: r,
        padding: i
      } = typeof e == "function" ? e(n) : e;
      return r && t(r) ? r.current != null ? Gl({
        element: r.current,
        padding: i
      }).fn(n) : {} : r ? Gl({
        element: r,
        padding: i
      }).fn(n) : {};
    }
  };
}, Qx = (e, t) => {
  const n = Rx(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Ux = (e, t) => {
  const n = Px(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Zx = (e, t) => ({
  fn: Bx(e).fn,
  options: [e, t]
}), Wx = (e, t) => {
  const n = Ox(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Jx = (e, t) => {
  const n = Tx(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Vx = (e, t) => {
  const n = zx(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, qx = (e, t) => {
  const n = Hx(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var Xx = "Arrow", ld = v.forwardRef((e, t) => {
  const { children: n, width: r = 10, height: i = 5, ...o } = e;
  return /* @__PURE__ */ d.jsx(
    ve.svg,
    {
      ...o,
      ref: t,
      width: r,
      height: i,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ d.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
ld.displayName = Xx;
var Kx = ld, Zs = "Popper", [cd, Bi] = rn(Zs), [_x, ud] = cd(Zs), dd = (e) => {
  const { __scopePopper: t, children: n } = e, [r, i] = v.useState(null);
  return /* @__PURE__ */ d.jsx(_x, { scope: t, anchor: r, onAnchorChange: i, children: n });
};
dd.displayName = Zs;
var fd = "PopperAnchor", md = v.forwardRef(
  (e, t) => {
    const { __scopePopper: n, virtualRef: r, ...i } = e, o = ud(fd, n), s = v.useRef(null), a = Ce(t, s), l = v.useRef(null);
    return v.useEffect(() => {
      const c = l.current;
      l.current = r?.current || s.current, c !== l.current && o.onAnchorChange(l.current);
    }), r ? null : /* @__PURE__ */ d.jsx(ve.div, { ...i, ref: a });
  }
);
md.displayName = fd;
var Ws = "PopperContent", [$x, eb] = cd(Ws), hd = v.forwardRef(
  (e, t) => {
    const {
      __scopePopper: n,
      side: r = "bottom",
      sideOffset: i = 0,
      align: o = "center",
      alignOffset: s = 0,
      arrowPadding: a = 0,
      avoidCollisions: l = !0,
      collisionBoundary: c = [],
      collisionPadding: f = 0,
      sticky: u = "partial",
      hideWhenDetached: m = !1,
      updatePositionStrategy: h = "optimized",
      onPlaced: p,
      ...g
    } = e, y = ud(Ws, n), [x, k] = v.useState(null), w = Ce(t, (J) => k(J)), [j, S] = v.useState(null), E = Zg(j), O = E?.width ?? 0, R = E?.height ?? 0, B = r + (o !== "center" ? "-" + o : ""), C = typeof f == "number" ? f : { top: 0, right: 0, bottom: 0, left: 0, ...f }, I = Array.isArray(c) ? c : [c], z = I.length > 0, W = {
      padding: C,
      boundary: I.filter(nb),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: z
    }, { refs: P, floatingStyles: M, placement: D, isPositioned: F, middlewareData: T } = Yx({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: B,
      whileElementsMounted: (...J) => Dx(...J, {
        animationFrame: h === "always"
      }),
      elements: {
        reference: y.anchor
      },
      middleware: [
        Qx({ mainAxis: i + R, alignmentAxis: s }),
        l && Ux({
          mainAxis: !0,
          crossAxis: !1,
          limiter: u === "partial" ? Zx() : void 0,
          ...W
        }),
        l && Wx({ ...W }),
        Jx({
          ...W,
          apply: ({ elements: J, rects: ae, availableWidth: ie, availableHeight: fe }) => {
            const { width: we, height: Me } = ae.reference, je = J.floating.style;
            je.setProperty("--radix-popper-available-width", `${ie}px`), je.setProperty("--radix-popper-available-height", `${fe}px`), je.setProperty("--radix-popper-anchor-width", `${we}px`), je.setProperty("--radix-popper-anchor-height", `${Me}px`);
          }
        }),
        j && qx({ element: j, padding: a }),
        rb({ arrowWidth: O, arrowHeight: R }),
        m && Vx({ strategy: "referenceHidden", ...W })
      ]
    }), [G, b] = xd(D), N = st(p);
    Pt(() => {
      F && N?.();
    }, [F, N]);
    const Y = T.arrow?.x, A = T.arrow?.y, X = T.arrow?.centerOffset !== 0, [H, q] = v.useState();
    return Pt(() => {
      x && q(window.getComputedStyle(x).zIndex);
    }, [x]), /* @__PURE__ */ d.jsx(
      "div",
      {
        ref: P.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...M,
          transform: F ? M.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: H,
          "--radix-popper-transform-origin": [
            T.transformOrigin?.x,
            T.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...T.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ d.jsx(
          $x,
          {
            scope: n,
            placedSide: G,
            onArrowChange: S,
            arrowX: Y,
            arrowY: A,
            shouldHideArrow: X,
            children: /* @__PURE__ */ d.jsx(
              ve.div,
              {
                "data-side": G,
                "data-align": b,
                ...g,
                ref: w,
                style: {
                  ...g.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: F ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
hd.displayName = Ws;
var pd = "PopperArrow", tb = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, gd = v.forwardRef(function(t, n) {
  const { __scopePopper: r, ...i } = t, o = eb(pd, r), s = tb[o.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ d.jsx(
      "span",
      {
        ref: o.onArrowChange,
        style: {
          position: "absolute",
          left: o.arrowX,
          top: o.arrowY,
          [s]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[o.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[o.placedSide],
          visibility: o.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ d.jsx(
          Kx,
          {
            ...i,
            ref: n,
            style: {
              ...i.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
gd.displayName = pd;
function nb(e) {
  return e !== null;
}
var rb = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    const { placement: n, rects: r, middlewareData: i } = t, s = i.arrow?.centerOffset !== 0, a = s ? 0 : e.arrowWidth, l = s ? 0 : e.arrowHeight, [c, f] = xd(n), u = { start: "0%", center: "50%", end: "100%" }[f], m = (i.arrow?.x ?? 0) + a / 2, h = (i.arrow?.y ?? 0) + l / 2;
    let p = "", g = "";
    return c === "bottom" ? (p = s ? u : `${m}px`, g = `${-l}px`) : c === "top" ? (p = s ? u : `${m}px`, g = `${r.floating.height + l}px`) : c === "right" ? (p = `${-l}px`, g = s ? u : `${h}px`) : c === "left" && (p = `${r.floating.width + l}px`, g = s ? u : `${h}px`), { data: { x: p, y: g } };
  }
});
function xd(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var Js = dd, Vs = md, bd = hd, yd = gd, mo = "rovingFocusGroup.onEntryFocus", ib = { bubbles: !1, cancelable: !0 }, br = "RovingFocusGroup", [qo, vd, ob] = vu(br), [sb, wd] = rn(
  br,
  [ob]
), [ab, lb] = sb(br), Ad = v.forwardRef(
  (e, t) => /* @__PURE__ */ d.jsx(qo.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ d.jsx(qo.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ d.jsx(cb, { ...e, ref: t }) }) })
);
Ad.displayName = br;
var cb = v.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: r,
    loop: i = !1,
    dir: o,
    currentTabStopId: s,
    defaultCurrentTabStopId: a,
    onCurrentTabStopIdChange: l,
    onEntryFocus: c,
    preventScrollOnEntryFocus: f = !1,
    ...u
  } = e, m = v.useRef(null), h = Ce(t, m), p = wu(o), [g, y] = pr({
    prop: s,
    defaultProp: a ?? null,
    onChange: l,
    caller: br
  }), [x, k] = v.useState(!1), w = st(c), j = vd(n), S = v.useRef(!1), [E, O] = v.useState(0);
  return v.useEffect(() => {
    const R = m.current;
    if (R)
      return R.addEventListener(mo, w), () => R.removeEventListener(mo, w);
  }, [w]), /* @__PURE__ */ d.jsx(
    ab,
    {
      scope: n,
      orientation: r,
      dir: p,
      loop: i,
      currentTabStopId: g,
      onItemFocus: v.useCallback(
        (R) => y(R),
        [y]
      ),
      onItemShiftTab: v.useCallback(() => k(!0), []),
      onFocusableItemAdd: v.useCallback(
        () => O((R) => R + 1),
        []
      ),
      onFocusableItemRemove: v.useCallback(
        () => O((R) => R - 1),
        []
      ),
      children: /* @__PURE__ */ d.jsx(
        ve.div,
        {
          tabIndex: x || E === 0 ? -1 : 0,
          "data-orientation": r,
          ...u,
          ref: h,
          style: { outline: "none", ...e.style },
          onMouseDown: te(e.onMouseDown, () => {
            S.current = !0;
          }),
          onFocus: te(e.onFocus, (R) => {
            const B = !S.current;
            if (R.target === R.currentTarget && B && !x) {
              const C = new CustomEvent(mo, ib);
              if (R.currentTarget.dispatchEvent(C), !C.defaultPrevented) {
                const I = j().filter((D) => D.focusable), z = I.find((D) => D.active), W = I.find((D) => D.id === g), M = [z, W, ...I].filter(
                  Boolean
                ).map((D) => D.ref.current);
                Cd(M, f);
              }
            }
            S.current = !1;
          }),
          onBlur: te(e.onBlur, () => k(!1))
        }
      )
    }
  );
}), kd = "RovingFocusGroupItem", Ed = v.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: r = !0,
      active: i = !1,
      tabStopId: o,
      children: s,
      ...a
    } = e, l = xt(), c = o || l, f = lb(kd, n), u = f.currentTabStopId === c, m = vd(n), { onFocusableItemAdd: h, onFocusableItemRemove: p, currentTabStopId: g } = f;
    return v.useEffect(() => {
      if (r)
        return h(), () => p();
    }, [r, h, p]), /* @__PURE__ */ d.jsx(
      qo.ItemSlot,
      {
        scope: n,
        id: c,
        focusable: r,
        active: i,
        children: /* @__PURE__ */ d.jsx(
          ve.span,
          {
            tabIndex: u ? 0 : -1,
            "data-orientation": f.orientation,
            ...a,
            ref: t,
            onMouseDown: te(e.onMouseDown, (y) => {
              r ? f.onItemFocus(c) : y.preventDefault();
            }),
            onFocus: te(e.onFocus, () => f.onItemFocus(c)),
            onKeyDown: te(e.onKeyDown, (y) => {
              if (y.key === "Tab" && y.shiftKey) {
                f.onItemShiftTab();
                return;
              }
              if (y.target !== y.currentTarget) return;
              const x = fb(y, f.orientation, f.dir);
              if (x !== void 0) {
                if (y.metaKey || y.ctrlKey || y.altKey || y.shiftKey) return;
                y.preventDefault();
                let w = m().filter((j) => j.focusable).map((j) => j.ref.current);
                if (x === "last") w.reverse();
                else if (x === "prev" || x === "next") {
                  x === "prev" && w.reverse();
                  const j = w.indexOf(y.currentTarget);
                  w = f.loop ? mb(w, j + 1) : w.slice(j + 1);
                }
                setTimeout(() => Cd(w));
              }
            }),
            children: typeof s == "function" ? s({ isCurrentTabStop: u, hasTabStop: g != null }) : s
          }
        )
      }
    );
  }
);
Ed.displayName = kd;
var ub = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function db(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function fb(e, t, n) {
  const r = db(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return ub[r];
}
function Cd(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function mb(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var hb = Ad, pb = Ed, Xo = ["Enter", " "], gb = ["ArrowDown", "PageUp", "Home"], jd = ["ArrowUp", "PageDown", "End"], xb = [...gb, ...jd], bb = {
  ltr: [...Xo, "ArrowRight"],
  rtl: [...Xo, "ArrowLeft"]
}, yb = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, yr = "Menu", [tr, vb, wb] = vu(yr), [on, Md] = rn(yr, [
  wb,
  Bi,
  wd
]), vr = Bi(), Sd = wd(), [Nd, Bt] = on(yr), [Ab, wr] = on(yr), Id = (e) => {
  const { __scopeMenu: t, open: n = !1, children: r, dir: i, onOpenChange: o, modal: s = !0 } = e, a = vr(t), [l, c] = v.useState(null), f = v.useRef(!1), u = st(o), m = wu(i);
  return v.useEffect(() => {
    const h = () => {
      f.current = !0, document.addEventListener("pointerdown", p, { capture: !0, once: !0 }), document.addEventListener("pointermove", p, { capture: !0, once: !0 });
    }, p = () => f.current = !1;
    return document.addEventListener("keydown", h, { capture: !0 }), () => {
      document.removeEventListener("keydown", h, { capture: !0 }), document.removeEventListener("pointerdown", p, { capture: !0 }), document.removeEventListener("pointermove", p, { capture: !0 });
    };
  }, []), /* @__PURE__ */ d.jsx(Js, { ...a, children: /* @__PURE__ */ d.jsx(
    Nd,
    {
      scope: t,
      open: n,
      onOpenChange: u,
      content: l,
      onContentChange: c,
      children: /* @__PURE__ */ d.jsx(
        Ab,
        {
          scope: t,
          onClose: v.useCallback(() => u(!1), [u]),
          isUsingKeyboardRef: f,
          dir: m,
          modal: s,
          children: r
        }
      )
    }
  ) });
};
Id.displayName = yr;
var kb = "MenuAnchor", qs = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, i = vr(n);
    return /* @__PURE__ */ d.jsx(Vs, { ...i, ...r, ref: t });
  }
);
qs.displayName = kb;
var Xs = "MenuPortal", [Eb, Dd] = on(Xs, {
  forceMount: void 0
}), Rd = (e) => {
  const { __scopeMenu: t, forceMount: n, children: r, container: i } = e, o = Bt(Xs, t);
  return /* @__PURE__ */ d.jsx(Eb, { scope: t, forceMount: n, children: /* @__PURE__ */ d.jsx(ct, { present: n || o.open, children: /* @__PURE__ */ d.jsx(Ni, { asChild: !0, container: i, children: r }) }) });
};
Rd.displayName = Xs;
var Ue = "MenuContent", [Cb, Ks] = on(Ue), Pd = v.forwardRef(
  (e, t) => {
    const n = Dd(Ue, e.__scopeMenu), { forceMount: r = n.forceMount, ...i } = e, o = Bt(Ue, e.__scopeMenu), s = wr(Ue, e.__scopeMenu);
    return /* @__PURE__ */ d.jsx(tr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ d.jsx(ct, { present: r || o.open, children: /* @__PURE__ */ d.jsx(tr.Slot, { scope: e.__scopeMenu, children: s.modal ? /* @__PURE__ */ d.jsx(jb, { ...i, ref: t }) : /* @__PURE__ */ d.jsx(Mb, { ...i, ref: t }) }) }) });
  }
), jb = v.forwardRef(
  (e, t) => {
    const n = Bt(Ue, e.__scopeMenu), r = v.useRef(null), i = Ce(t, r);
    return v.useEffect(() => {
      const o = r.current;
      if (o) return Is(o);
    }, []), /* @__PURE__ */ d.jsx(
      _s,
      {
        ...e,
        ref: i,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        disableOutsideScroll: !0,
        onFocusOutside: te(
          e.onFocusOutside,
          (o) => o.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => n.onOpenChange(!1)
      }
    );
  }
), Mb = v.forwardRef((e, t) => {
  const n = Bt(Ue, e.__scopeMenu);
  return /* @__PURE__ */ d.jsx(
    _s,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1)
    }
  );
}), Sb = /* @__PURE__ */ Kt("MenuContent.ScrollLock"), _s = v.forwardRef(
  (e, t) => {
    const {
      __scopeMenu: n,
      loop: r = !1,
      trapFocus: i,
      onOpenAutoFocus: o,
      onCloseAutoFocus: s,
      disableOutsidePointerEvents: a,
      onEntryFocus: l,
      onEscapeKeyDown: c,
      onPointerDownOutside: f,
      onFocusOutside: u,
      onInteractOutside: m,
      onDismiss: h,
      disableOutsideScroll: p,
      ...g
    } = e, y = Bt(Ue, n), x = wr(Ue, n), k = vr(n), w = Sd(n), j = vb(n), [S, E] = v.useState(null), O = v.useRef(null), R = Ce(t, O, y.onContentChange), B = v.useRef(0), C = v.useRef(""), I = v.useRef(0), z = v.useRef(null), W = v.useRef("right"), P = v.useRef(0), M = p ? Di : v.Fragment, D = p ? { as: Sb, allowPinchZoom: !0 } : void 0, F = (G) => {
      const b = C.current + G, N = j().filter((J) => !J.disabled), Y = document.activeElement, A = N.find((J) => J.ref.current === Y)?.textValue, X = N.map((J) => J.textValue), H = Lb(X, b, A), q = N.find((J) => J.textValue === H)?.ref.current;
      (function J(ae) {
        C.current = ae, window.clearTimeout(B.current), ae !== "" && (B.current = window.setTimeout(() => J(""), 1e3));
      })(b), q && setTimeout(() => q.focus());
    };
    v.useEffect(() => () => window.clearTimeout(B.current), []), Ns();
    const T = v.useCallback((G) => W.current === z.current?.side && Hb(G, z.current?.area), []);
    return /* @__PURE__ */ d.jsx(
      Cb,
      {
        scope: n,
        searchRef: C,
        onItemEnter: v.useCallback(
          (G) => {
            T(G) && G.preventDefault();
          },
          [T]
        ),
        onItemLeave: v.useCallback(
          (G) => {
            T(G) || (O.current?.focus(), E(null));
          },
          [T]
        ),
        onTriggerLeave: v.useCallback(
          (G) => {
            T(G) && G.preventDefault();
          },
          [T]
        ),
        pointerGraceTimerRef: I,
        onPointerGraceIntentChange: v.useCallback((G) => {
          z.current = G;
        }, []),
        children: /* @__PURE__ */ d.jsx(M, { ...D, children: /* @__PURE__ */ d.jsx(
          Si,
          {
            asChild: !0,
            trapped: i,
            onMountAutoFocus: te(o, (G) => {
              G.preventDefault(), O.current?.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: s,
            children: /* @__PURE__ */ d.jsx(
              Mi,
              {
                asChild: !0,
                disableOutsidePointerEvents: a,
                onEscapeKeyDown: c,
                onPointerDownOutside: f,
                onFocusOutside: u,
                onInteractOutside: m,
                onDismiss: h,
                children: /* @__PURE__ */ d.jsx(
                  hb,
                  {
                    asChild: !0,
                    ...w,
                    dir: x.dir,
                    orientation: "vertical",
                    loop: r,
                    currentTabStopId: S,
                    onCurrentTabStopIdChange: E,
                    onEntryFocus: te(l, (G) => {
                      x.isUsingKeyboardRef.current || G.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ d.jsx(
                      bd,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": Xd(y.open),
                        "data-radix-menu-content": "",
                        dir: x.dir,
                        ...k,
                        ...g,
                        ref: R,
                        style: { outline: "none", ...g.style },
                        onKeyDown: te(g.onKeyDown, (G) => {
                          const N = G.target.closest("[data-radix-menu-content]") === G.currentTarget, Y = G.ctrlKey || G.altKey || G.metaKey, A = G.key.length === 1;
                          N && (G.key === "Tab" && G.preventDefault(), !Y && A && F(G.key));
                          const X = O.current;
                          if (G.target !== X || !xb.includes(G.key)) return;
                          G.preventDefault();
                          const q = j().filter((J) => !J.disabled).map((J) => J.ref.current);
                          jd.includes(G.key) && q.reverse(), Gb(q);
                        }),
                        onBlur: te(e.onBlur, (G) => {
                          G.currentTarget.contains(G.target) || (window.clearTimeout(B.current), C.current = "");
                        }),
                        onPointerMove: te(
                          e.onPointerMove,
                          nr((G) => {
                            const b = G.target, N = P.current !== G.clientX;
                            if (G.currentTarget.contains(b) && N) {
                              const Y = G.clientX > P.current ? "right" : "left";
                              W.current = Y, P.current = G.clientX;
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
Pd.displayName = Ue;
var Nb = "MenuGroup", $s = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ d.jsx(ve.div, { role: "group", ...r, ref: t });
  }
);
$s.displayName = Nb;
var Ib = "MenuLabel", Od = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ d.jsx(ve.div, { ...r, ref: t });
  }
);
Od.displayName = Ib;
var ci = "MenuItem", Ll = "menu.itemSelect", Gi = v.forwardRef(
  (e, t) => {
    const { disabled: n = !1, onSelect: r, ...i } = e, o = v.useRef(null), s = wr(ci, e.__scopeMenu), a = Ks(ci, e.__scopeMenu), l = Ce(t, o), c = v.useRef(!1), f = () => {
      const u = o.current;
      if (!n && u) {
        const m = new CustomEvent(Ll, { bubbles: !0, cancelable: !0 });
        u.addEventListener(Ll, (h) => r?.(h), { once: !0 }), yu(u, m), m.defaultPrevented ? c.current = !1 : s.onClose();
      }
    };
    return /* @__PURE__ */ d.jsx(
      Td,
      {
        ...i,
        ref: l,
        disabled: n,
        onClick: te(e.onClick, f),
        onPointerDown: (u) => {
          e.onPointerDown?.(u), c.current = !0;
        },
        onPointerUp: te(e.onPointerUp, (u) => {
          c.current || u.currentTarget?.click();
        }),
        onKeyDown: te(e.onKeyDown, (u) => {
          const m = a.searchRef.current !== "";
          n || m && u.key === " " || Xo.includes(u.key) && (u.currentTarget.click(), u.preventDefault());
        })
      }
    );
  }
);
Gi.displayName = ci;
var Td = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, disabled: r = !1, textValue: i, ...o } = e, s = Ks(ci, n), a = Sd(n), l = v.useRef(null), c = Ce(t, l), [f, u] = v.useState(!1), [m, h] = v.useState("");
    return v.useEffect(() => {
      const p = l.current;
      p && h((p.textContent ?? "").trim());
    }, [o.children]), /* @__PURE__ */ d.jsx(
      tr.ItemSlot,
      {
        scope: n,
        disabled: r,
        textValue: i ?? m,
        children: /* @__PURE__ */ d.jsx(pb, { asChild: !0, ...a, focusable: !r, children: /* @__PURE__ */ d.jsx(
          ve.div,
          {
            role: "menuitem",
            "data-highlighted": f ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...o,
            ref: c,
            onPointerMove: te(
              e.onPointerMove,
              nr((p) => {
                r ? s.onItemLeave(p) : (s.onItemEnter(p), p.defaultPrevented || p.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: te(
              e.onPointerLeave,
              nr((p) => s.onItemLeave(p))
            ),
            onFocus: te(e.onFocus, () => u(!0)),
            onBlur: te(e.onBlur, () => u(!1))
          }
        ) })
      }
    );
  }
), Db = "MenuCheckboxItem", zd = v.forwardRef(
  (e, t) => {
    const { checked: n = !1, onCheckedChange: r, ...i } = e;
    return /* @__PURE__ */ d.jsx(Yd, { scope: e.__scopeMenu, checked: n, children: /* @__PURE__ */ d.jsx(
      Gi,
      {
        role: "menuitemcheckbox",
        "aria-checked": ui(n) ? "mixed" : n,
        ...i,
        ref: t,
        "data-state": na(n),
        onSelect: te(
          i.onSelect,
          () => r?.(ui(n) ? !0 : !n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
zd.displayName = Db;
var Bd = "MenuRadioGroup", [Rb, Pb] = on(
  Bd,
  { value: void 0, onValueChange: () => {
  } }
), Gd = v.forwardRef(
  (e, t) => {
    const { value: n, onValueChange: r, ...i } = e, o = st(r);
    return /* @__PURE__ */ d.jsx(Rb, { scope: e.__scopeMenu, value: n, onValueChange: o, children: /* @__PURE__ */ d.jsx($s, { ...i, ref: t }) });
  }
);
Gd.displayName = Bd;
var Fd = "MenuRadioItem", Ld = v.forwardRef(
  (e, t) => {
    const { value: n, ...r } = e, i = Pb(Fd, e.__scopeMenu), o = n === i.value;
    return /* @__PURE__ */ d.jsx(Yd, { scope: e.__scopeMenu, checked: o, children: /* @__PURE__ */ d.jsx(
      Gi,
      {
        role: "menuitemradio",
        "aria-checked": o,
        ...r,
        ref: t,
        "data-state": na(o),
        onSelect: te(
          r.onSelect,
          () => i.onValueChange?.(n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Ld.displayName = Fd;
var ea = "MenuItemIndicator", [Yd, Ob] = on(
  ea,
  { checked: !1 }
), Hd = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, forceMount: r, ...i } = e, o = Ob(ea, n);
    return /* @__PURE__ */ d.jsx(
      ct,
      {
        present: r || ui(o.checked) || o.checked === !0,
        children: /* @__PURE__ */ d.jsx(
          ve.span,
          {
            ...i,
            ref: t,
            "data-state": na(o.checked)
          }
        )
      }
    );
  }
);
Hd.displayName = ea;
var Tb = "MenuSeparator", Qd = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ d.jsx(
      ve.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...r,
        ref: t
      }
    );
  }
);
Qd.displayName = Tb;
var zb = "MenuArrow", Ud = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, i = vr(n);
    return /* @__PURE__ */ d.jsx(yd, { ...i, ...r, ref: t });
  }
);
Ud.displayName = zb;
var ta = "MenuSub", [Bb, Zd] = on(ta), Wd = (e) => {
  const { __scopeMenu: t, children: n, open: r = !1, onOpenChange: i } = e, o = Bt(ta, t), s = vr(t), [a, l] = v.useState(null), [c, f] = v.useState(null), u = st(i);
  return v.useEffect(() => (o.open === !1 && u(!1), () => u(!1)), [o.open, u]), /* @__PURE__ */ d.jsx(Js, { ...s, children: /* @__PURE__ */ d.jsx(
    Nd,
    {
      scope: t,
      open: r,
      onOpenChange: u,
      content: c,
      onContentChange: f,
      children: /* @__PURE__ */ d.jsx(
        Bb,
        {
          scope: t,
          contentId: xt(),
          triggerId: xt(),
          trigger: a,
          onTriggerChange: l,
          children: n
        }
      )
    }
  ) });
};
Wd.displayName = ta;
var Un = "MenuSubTrigger", Jd = v.forwardRef(
  (e, t) => {
    const n = Bt(Un, e.__scopeMenu), r = wr(Un, e.__scopeMenu), i = Zd(Un, e.__scopeMenu), o = Ks(Un, e.__scopeMenu), s = v.useRef(null), { pointerGraceTimerRef: a, onPointerGraceIntentChange: l } = o, c = { __scopeMenu: e.__scopeMenu }, f = v.useCallback(() => {
      s.current && window.clearTimeout(s.current), s.current = null;
    }, []);
    return v.useEffect(() => f, [f]), v.useEffect(() => {
      const u = a.current;
      return () => {
        window.clearTimeout(u), l(null);
      };
    }, [a, l]), /* @__PURE__ */ d.jsx(qs, { asChild: !0, ...c, children: /* @__PURE__ */ d.jsx(
      Td,
      {
        id: i.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": n.open,
        "aria-controls": i.contentId,
        "data-state": Xd(n.open),
        ...e,
        ref: ji(t, i.onTriggerChange),
        onClick: (u) => {
          e.onClick?.(u), !(e.disabled || u.defaultPrevented) && (u.currentTarget.focus(), n.open || n.onOpenChange(!0));
        },
        onPointerMove: te(
          e.onPointerMove,
          nr((u) => {
            o.onItemEnter(u), !u.defaultPrevented && !e.disabled && !n.open && !s.current && (o.onPointerGraceIntentChange(null), s.current = window.setTimeout(() => {
              n.onOpenChange(!0), f();
            }, 100));
          })
        ),
        onPointerLeave: te(
          e.onPointerLeave,
          nr((u) => {
            f();
            const m = n.content?.getBoundingClientRect();
            if (m) {
              const h = n.content?.dataset.side, p = h === "right", g = p ? -5 : 5, y = m[p ? "left" : "right"], x = m[p ? "right" : "left"];
              o.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: u.clientX + g, y: u.clientY },
                  { x: y, y: m.top },
                  { x, y: m.top },
                  { x, y: m.bottom },
                  { x: y, y: m.bottom }
                ],
                side: h
              }), window.clearTimeout(a.current), a.current = window.setTimeout(
                () => o.onPointerGraceIntentChange(null),
                300
              );
            } else {
              if (o.onTriggerLeave(u), u.defaultPrevented) return;
              o.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: te(e.onKeyDown, (u) => {
          const m = o.searchRef.current !== "";
          e.disabled || m && u.key === " " || bb[r.dir].includes(u.key) && (n.onOpenChange(!0), n.content?.focus(), u.preventDefault());
        })
      }
    ) });
  }
);
Jd.displayName = Un;
var Vd = "MenuSubContent", qd = v.forwardRef(
  (e, t) => {
    const n = Dd(Ue, e.__scopeMenu), { forceMount: r = n.forceMount, ...i } = e, o = Bt(Ue, e.__scopeMenu), s = wr(Ue, e.__scopeMenu), a = Zd(Vd, e.__scopeMenu), l = v.useRef(null), c = Ce(t, l);
    return /* @__PURE__ */ d.jsx(tr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ d.jsx(ct, { present: r || o.open, children: /* @__PURE__ */ d.jsx(tr.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ d.jsx(
      _s,
      {
        id: a.contentId,
        "aria-labelledby": a.triggerId,
        ...i,
        ref: c,
        align: "start",
        side: s.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        trapFocus: !1,
        onOpenAutoFocus: (f) => {
          s.isUsingKeyboardRef.current && l.current?.focus(), f.preventDefault();
        },
        onCloseAutoFocus: (f) => f.preventDefault(),
        onFocusOutside: te(e.onFocusOutside, (f) => {
          f.target !== a.trigger && o.onOpenChange(!1);
        }),
        onEscapeKeyDown: te(e.onEscapeKeyDown, (f) => {
          s.onClose(), f.preventDefault();
        }),
        onKeyDown: te(e.onKeyDown, (f) => {
          const u = f.currentTarget.contains(f.target), m = yb[s.dir].includes(f.key);
          u && m && (o.onOpenChange(!1), a.trigger?.focus(), f.preventDefault());
        })
      }
    ) }) }) });
  }
);
qd.displayName = Vd;
function Xd(e) {
  return e ? "open" : "closed";
}
function ui(e) {
  return e === "indeterminate";
}
function na(e) {
  return ui(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Gb(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function Fb(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
function Lb(e, t, n) {
  const i = t.length > 1 && Array.from(t).every((c) => c === t[0]) ? t[0] : t, o = n ? e.indexOf(n) : -1;
  let s = Fb(e, Math.max(o, 0));
  i.length === 1 && (s = s.filter((c) => c !== n));
  const l = s.find(
    (c) => c.toLowerCase().startsWith(i.toLowerCase())
  );
  return l !== n ? l : void 0;
}
function Yb(e, t) {
  const { x: n, y: r } = e;
  let i = !1;
  for (let o = 0, s = t.length - 1; o < t.length; s = o++) {
    const a = t[o], l = t[s], c = a.x, f = a.y, u = l.x, m = l.y;
    f > r != m > r && n < (u - c) * (r - f) / (m - f) + c && (i = !i);
  }
  return i;
}
function Hb(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return Yb(n, t);
}
function nr(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var Qb = Id, Ub = qs, Zb = Rd, Wb = Pd, Jb = $s, Vb = Od, qb = Gi, Xb = zd, Kb = Gd, _b = Ld, $b = Hd, ey = Qd, ty = Ud, ny = Wd, ry = Jd, iy = qd, Fi = "DropdownMenu", [oy] = rn(
  Fi,
  [Md]
), Ne = Md(), [sy, Kd] = oy(Fi), _d = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: r,
    open: i,
    defaultOpen: o,
    onOpenChange: s,
    modal: a = !0
  } = e, l = Ne(t), c = v.useRef(null), [f, u] = pr({
    prop: i,
    defaultProp: o ?? !1,
    onChange: s,
    caller: Fi
  });
  return /* @__PURE__ */ d.jsx(
    sy,
    {
      scope: t,
      triggerId: xt(),
      triggerRef: c,
      contentId: xt(),
      open: f,
      onOpenChange: u,
      onOpenToggle: v.useCallback(() => u((m) => !m), [u]),
      modal: a,
      children: /* @__PURE__ */ d.jsx(Qb, { ...l, open: f, onOpenChange: u, dir: r, modal: a, children: n })
    }
  );
};
_d.displayName = Fi;
var $d = "DropdownMenuTrigger", ef = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, disabled: r = !1, ...i } = e, o = Kd($d, n), s = Ne(n);
    return /* @__PURE__ */ d.jsx(Ub, { asChild: !0, ...s, children: /* @__PURE__ */ d.jsx(
      ve.button,
      {
        type: "button",
        id: o.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": o.open,
        "aria-controls": o.open ? o.contentId : void 0,
        "data-state": o.open ? "open" : "closed",
        "data-disabled": r ? "" : void 0,
        disabled: r,
        ...i,
        ref: ji(t, o.triggerRef),
        onPointerDown: te(e.onPointerDown, (a) => {
          !r && a.button === 0 && a.ctrlKey === !1 && (o.onOpenToggle(), o.open || a.preventDefault());
        }),
        onKeyDown: te(e.onKeyDown, (a) => {
          r || (["Enter", " "].includes(a.key) && o.onOpenToggle(), a.key === "ArrowDown" && o.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(a.key) && a.preventDefault());
        })
      }
    ) });
  }
);
ef.displayName = $d;
var ay = "DropdownMenuPortal", tf = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e, r = Ne(t);
  return /* @__PURE__ */ d.jsx(Zb, { ...r, ...n });
};
tf.displayName = ay;
var nf = "DropdownMenuContent", rf = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Kd(nf, n), o = Ne(n), s = v.useRef(!1);
    return /* @__PURE__ */ d.jsx(
      Wb,
      {
        id: i.contentId,
        "aria-labelledby": i.triggerId,
        ...o,
        ...r,
        ref: t,
        onCloseAutoFocus: te(e.onCloseAutoFocus, (a) => {
          s.current || i.triggerRef.current?.focus(), s.current = !1, a.preventDefault();
        }),
        onInteractOutside: te(e.onInteractOutside, (a) => {
          const l = a.detail.originalEvent, c = l.button === 0 && l.ctrlKey === !0, f = l.button === 2 || c;
          (!i.modal || f) && (s.current = !0);
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
rf.displayName = nf;
var ly = "DropdownMenuGroup", of = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
    return /* @__PURE__ */ d.jsx(Jb, { ...i, ...r, ref: t });
  }
);
of.displayName = ly;
var cy = "DropdownMenuLabel", sf = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
    return /* @__PURE__ */ d.jsx(Vb, { ...i, ...r, ref: t });
  }
);
sf.displayName = cy;
var uy = "DropdownMenuItem", af = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
    return /* @__PURE__ */ d.jsx(qb, { ...i, ...r, ref: t });
  }
);
af.displayName = uy;
var dy = "DropdownMenuCheckboxItem", lf = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
  return /* @__PURE__ */ d.jsx(Xb, { ...i, ...r, ref: t });
});
lf.displayName = dy;
var fy = "DropdownMenuRadioGroup", cf = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
  return /* @__PURE__ */ d.jsx(Kb, { ...i, ...r, ref: t });
});
cf.displayName = fy;
var my = "DropdownMenuRadioItem", uf = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
  return /* @__PURE__ */ d.jsx(_b, { ...i, ...r, ref: t });
});
uf.displayName = my;
var hy = "DropdownMenuItemIndicator", df = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
  return /* @__PURE__ */ d.jsx($b, { ...i, ...r, ref: t });
});
df.displayName = hy;
var py = "DropdownMenuSeparator", ff = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
  return /* @__PURE__ */ d.jsx(ey, { ...i, ...r, ref: t });
});
ff.displayName = py;
var gy = "DropdownMenuArrow", xy = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
    return /* @__PURE__ */ d.jsx(ty, { ...i, ...r, ref: t });
  }
);
xy.displayName = gy;
var by = (e) => {
  const { __scopeDropdownMenu: t, children: n, open: r, onOpenChange: i, defaultOpen: o } = e, s = Ne(t), [a, l] = pr({
    prop: r,
    defaultProp: o ?? !1,
    onChange: i,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ d.jsx(ny, { ...s, open: a, onOpenChange: l, children: n });
}, yy = "DropdownMenuSubTrigger", mf = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
  return /* @__PURE__ */ d.jsx(ry, { ...i, ...r, ref: t });
});
mf.displayName = yy;
var vy = "DropdownMenuSubContent", hf = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Ne(n);
  return /* @__PURE__ */ d.jsx(
    iy,
    {
      ...i,
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
hf.displayName = vy;
var wy = _d, Ay = ef, pf = tf, ky = rf, Ey = of, Cy = sf, jy = af, My = lf, Sy = cf, Ny = uf, gf = df, Iy = ff, Dy = by, Ry = mf, Py = hf, Oy = "Label", xf = v.forwardRef((e, t) => /* @__PURE__ */ d.jsx(
  ve.label,
  {
    ...e,
    ref: t,
    onMouseDown: (n) => {
      n.target.closest("button, input, select, textarea") || (e.onMouseDown?.(n), !n.defaultPrevented && n.detail > 1 && n.preventDefault());
    }
  }
));
xf.displayName = Oy;
var Ty = xf, Li = "Popover", [bf] = rn(Li, [
  Bi
]), Ar = Bi(), [zy, Gt] = bf(Li), yf = (e) => {
  const {
    __scopePopover: t,
    children: n,
    open: r,
    defaultOpen: i,
    onOpenChange: o,
    modal: s = !1
  } = e, a = Ar(t), l = v.useRef(null), [c, f] = v.useState(!1), [u, m] = pr({
    prop: r,
    defaultProp: i ?? !1,
    onChange: o,
    caller: Li
  });
  return /* @__PURE__ */ d.jsx(Js, { ...a, children: /* @__PURE__ */ d.jsx(
    zy,
    {
      scope: t,
      contentId: xt(),
      triggerRef: l,
      open: u,
      onOpenChange: m,
      onOpenToggle: v.useCallback(() => m((h) => !h), [m]),
      hasCustomAnchor: c,
      onCustomAnchorAdd: v.useCallback(() => f(!0), []),
      onCustomAnchorRemove: v.useCallback(() => f(!1), []),
      modal: s,
      children: n
    }
  ) });
};
yf.displayName = Li;
var vf = "PopoverAnchor", By = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Gt(vf, n), o = Ar(n), { onCustomAnchorAdd: s, onCustomAnchorRemove: a } = i;
    return v.useEffect(() => (s(), () => a()), [s, a]), /* @__PURE__ */ d.jsx(Vs, { ...o, ...r, ref: t });
  }
);
By.displayName = vf;
var wf = "PopoverTrigger", Af = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Gt(wf, n), o = Ar(n), s = Ce(t, i.triggerRef), a = /* @__PURE__ */ d.jsx(
      ve.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": i.open,
        "aria-controls": i.contentId,
        "data-state": Mf(i.open),
        ...r,
        ref: s,
        onClick: te(e.onClick, i.onOpenToggle)
      }
    );
    return i.hasCustomAnchor ? a : /* @__PURE__ */ d.jsx(Vs, { asChild: !0, ...o, children: a });
  }
);
Af.displayName = wf;
var ra = "PopoverPortal", [Gy, Fy] = bf(ra, {
  forceMount: void 0
}), kf = (e) => {
  const { __scopePopover: t, forceMount: n, children: r, container: i } = e, o = Gt(ra, t);
  return /* @__PURE__ */ d.jsx(Gy, { scope: t, forceMount: n, children: /* @__PURE__ */ d.jsx(ct, { present: n || o.open, children: /* @__PURE__ */ d.jsx(Ni, { asChild: !0, container: i, children: r }) }) });
};
kf.displayName = ra;
var kn = "PopoverContent", Ef = v.forwardRef(
  (e, t) => {
    const n = Fy(kn, e.__scopePopover), { forceMount: r = n.forceMount, ...i } = e, o = Gt(kn, e.__scopePopover);
    return /* @__PURE__ */ d.jsx(ct, { present: r || o.open, children: o.modal ? /* @__PURE__ */ d.jsx(Yy, { ...i, ref: t }) : /* @__PURE__ */ d.jsx(Hy, { ...i, ref: t }) });
  }
);
Ef.displayName = kn;
var Ly = /* @__PURE__ */ Kt("PopoverContent.RemoveScroll"), Yy = v.forwardRef(
  (e, t) => {
    const n = Gt(kn, e.__scopePopover), r = v.useRef(null), i = Ce(t, r), o = v.useRef(!1);
    return v.useEffect(() => {
      const s = r.current;
      if (s) return Is(s);
    }, []), /* @__PURE__ */ d.jsx(Di, { as: Ly, allowPinchZoom: !0, children: /* @__PURE__ */ d.jsx(
      Cf,
      {
        ...e,
        ref: i,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: te(e.onCloseAutoFocus, (s) => {
          s.preventDefault(), o.current || n.triggerRef.current?.focus();
        }),
        onPointerDownOutside: te(
          e.onPointerDownOutside,
          (s) => {
            const a = s.detail.originalEvent, l = a.button === 0 && a.ctrlKey === !0, c = a.button === 2 || l;
            o.current = c;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: te(
          e.onFocusOutside,
          (s) => s.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
), Hy = v.forwardRef(
  (e, t) => {
    const n = Gt(kn, e.__scopePopover), r = v.useRef(!1), i = v.useRef(!1);
    return /* @__PURE__ */ d.jsx(
      Cf,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (o) => {
          e.onCloseAutoFocus?.(o), o.defaultPrevented || (r.current || n.triggerRef.current?.focus(), o.preventDefault()), r.current = !1, i.current = !1;
        },
        onInteractOutside: (o) => {
          e.onInteractOutside?.(o), o.defaultPrevented || (r.current = !0, o.detail.originalEvent.type === "pointerdown" && (i.current = !0));
          const s = o.target;
          n.triggerRef.current?.contains(s) && o.preventDefault(), o.detail.originalEvent.type === "focusin" && i.current && o.preventDefault();
        }
      }
    );
  }
), Cf = v.forwardRef(
  (e, t) => {
    const {
      __scopePopover: n,
      trapFocus: r,
      onOpenAutoFocus: i,
      onCloseAutoFocus: o,
      disableOutsidePointerEvents: s,
      onEscapeKeyDown: a,
      onPointerDownOutside: l,
      onFocusOutside: c,
      onInteractOutside: f,
      ...u
    } = e, m = Gt(kn, n), h = Ar(n);
    return Ns(), /* @__PURE__ */ d.jsx(
      Si,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: i,
        onUnmountAutoFocus: o,
        children: /* @__PURE__ */ d.jsx(
          Mi,
          {
            asChild: !0,
            disableOutsidePointerEvents: s,
            onInteractOutside: f,
            onEscapeKeyDown: a,
            onPointerDownOutside: l,
            onFocusOutside: c,
            onDismiss: () => m.onOpenChange(!1),
            children: /* @__PURE__ */ d.jsx(
              bd,
              {
                "data-state": Mf(m.open),
                role: "dialog",
                id: m.contentId,
                ...h,
                ...u,
                ref: t,
                style: {
                  ...u.style,
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
), jf = "PopoverClose", Qy = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Gt(jf, n);
    return /* @__PURE__ */ d.jsx(
      ve.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: te(e.onClick, () => i.onOpenChange(!1))
      }
    );
  }
);
Qy.displayName = jf;
var Uy = "PopoverArrow", Zy = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Ar(n);
    return /* @__PURE__ */ d.jsx(yd, { ...i, ...r, ref: t });
  }
);
Zy.displayName = Uy;
function Mf(e) {
  return e ? "open" : "closed";
}
var ia = yf, oa = Af, sa = kf, aa = Ef, Wy = "Separator", Yl = "horizontal", Jy = ["horizontal", "vertical"], Sf = v.forwardRef((e, t) => {
  const { decorative: n, orientation: r = Yl, ...i } = e, o = Vy(r) ? r : Yl, a = n ? { role: "none" } : { "aria-orientation": o === "vertical" ? o : void 0, role: "separator" };
  return /* @__PURE__ */ d.jsx(
    ve.div,
    {
      "data-orientation": o,
      ...a,
      ...i,
      ref: t
    }
  );
});
Sf.displayName = Wy;
function Vy(e) {
  return Jy.includes(e);
}
var qy = Sf;
const Xy = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let r = 0; r < e.length; r++)
    n[r] = e[r];
  for (let r = 0; r < t.length; r++)
    n[e.length + r] = t[r];
  return n;
}, Ky = (e, t) => ({
  classGroupId: e,
  validator: t
}), Nf = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), di = "-", Hl = [], _y = "arbitrary..", $y = (e) => {
  const t = tv(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (s) => {
      if (s.startsWith("[") && s.endsWith("]"))
        return ev(s);
      const a = s.split(di), l = a[0] === "" && a.length > 1 ? 1 : 0;
      return If(a, l, t);
    },
    getConflictingClassGroupIds: (s, a) => {
      if (a) {
        const l = r[s], c = n[s];
        return l ? c ? Xy(c, l) : l : c || Hl;
      }
      return n[s] || Hl;
    }
  };
}, If = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const i = e[t], o = n.nextPart.get(i);
  if (o) {
    const c = If(e, t + 1, o);
    if (c) return c;
  }
  const s = n.validators;
  if (s === null)
    return;
  const a = t === 0 ? e.join(di) : e.slice(t).join(di), l = s.length;
  for (let c = 0; c < l; c++) {
    const f = s[c];
    if (f.validator(a))
      return f.classGroupId;
  }
}, ev = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
  return r ? _y + r : void 0;
})(), tv = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return nv(n, t);
}, nv = (e, t) => {
  const n = Nf();
  for (const r in e) {
    const i = e[r];
    la(i, n, r, t);
  }
  return n;
}, la = (e, t, n, r) => {
  const i = e.length;
  for (let o = 0; o < i; o++) {
    const s = e[o];
    rv(s, t, n, r);
  }
}, rv = (e, t, n, r) => {
  if (typeof e == "string") {
    iv(e, t, n);
    return;
  }
  if (typeof e == "function") {
    ov(e, t, n, r);
    return;
  }
  sv(e, t, n, r);
}, iv = (e, t, n) => {
  const r = e === "" ? t : Df(t, e);
  r.classGroupId = n;
}, ov = (e, t, n, r) => {
  if (av(e)) {
    la(e(r), t, n, r);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(Ky(n, e));
}, sv = (e, t, n, r) => {
  const i = Object.entries(e), o = i.length;
  for (let s = 0; s < o; s++) {
    const [a, l] = i[s];
    la(l, Df(t, a), n, r);
  }
}, Df = (e, t) => {
  let n = e;
  const r = t.split(di), i = r.length;
  for (let o = 0; o < i; o++) {
    const s = r[o];
    let a = n.nextPart.get(s);
    a || (a = Nf(), n.nextPart.set(s, a)), n = a;
  }
  return n;
}, av = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, lv = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const i = (o, s) => {
    n[o] = s, t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(o) {
      let s = n[o];
      if (s !== void 0)
        return s;
      if ((s = r[o]) !== void 0)
        return i(o, s), s;
    },
    set(o, s) {
      o in n ? n[o] = s : i(o, s);
    }
  };
}, Ko = "!", Ql = ":", cv = [], Ul = (e, t, n, r, i) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: r,
  isExternal: i
}), uv = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: n
  } = e;
  let r = (i) => {
    const o = [];
    let s = 0, a = 0, l = 0, c;
    const f = i.length;
    for (let g = 0; g < f; g++) {
      const y = i[g];
      if (s === 0 && a === 0) {
        if (y === Ql) {
          o.push(i.slice(l, g)), l = g + 1;
          continue;
        }
        if (y === "/") {
          c = g;
          continue;
        }
      }
      y === "[" ? s++ : y === "]" ? s-- : y === "(" ? a++ : y === ")" && a--;
    }
    const u = o.length === 0 ? i : i.slice(l);
    let m = u, h = !1;
    u.endsWith(Ko) ? (m = u.slice(0, -1), h = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(Ko) && (m = u.slice(1), h = !0)
    );
    const p = c && c > l ? c - l : void 0;
    return Ul(o, h, m, p);
  };
  if (t) {
    const i = t + Ql, o = r;
    r = (s) => s.startsWith(i) ? o(s.slice(i.length)) : Ul(cv, !1, s, void 0, !0);
  }
  if (n) {
    const i = r;
    r = (o) => n({
      className: o,
      parseClassName: i
    });
  }
  return r;
}, dv = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, r) => {
    t.set(n, 1e6 + r);
  }), (n) => {
    const r = [];
    let i = [];
    for (let o = 0; o < n.length; o++) {
      const s = n[o], a = s[0] === "[", l = t.has(s);
      a || l ? (i.length > 0 && (i.sort(), r.push(...i), i = []), r.push(s)) : i.push(s);
    }
    return i.length > 0 && (i.sort(), r.push(...i)), r;
  };
}, fv = (e) => ({
  cache: lv(e.cacheSize),
  parseClassName: uv(e),
  sortModifiers: dv(e),
  ...$y(e)
}), mv = /\s+/, hv = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: i,
    sortModifiers: o
  } = t, s = [], a = e.trim().split(mv);
  let l = "";
  for (let c = a.length - 1; c >= 0; c -= 1) {
    const f = a[c], {
      isExternal: u,
      modifiers: m,
      hasImportantModifier: h,
      baseClassName: p,
      maybePostfixModifierPosition: g
    } = n(f);
    if (u) {
      l = f + (l.length > 0 ? " " + l : l);
      continue;
    }
    let y = !!g, x = r(y ? p.substring(0, g) : p);
    if (!x) {
      if (!y) {
        l = f + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (x = r(p), !x) {
        l = f + (l.length > 0 ? " " + l : l);
        continue;
      }
      y = !1;
    }
    const k = m.length === 0 ? "" : m.length === 1 ? m[0] : o(m).join(":"), w = h ? k + Ko : k, j = w + x;
    if (s.indexOf(j) > -1)
      continue;
    s.push(j);
    const S = i(x, y);
    for (let E = 0; E < S.length; ++E) {
      const O = S[E];
      s.push(w + O);
    }
    l = f + (l.length > 0 ? " " + l : l);
  }
  return l;
}, pv = (...e) => {
  let t = 0, n, r, i = "";
  for (; t < e.length; )
    (n = e[t++]) && (r = Rf(n)) && (i && (i += " "), i += r);
  return i;
}, Rf = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Rf(e[r])) && (n && (n += " "), n += t);
  return n;
}, gv = (e, ...t) => {
  let n, r, i, o;
  const s = (l) => {
    const c = t.reduce((f, u) => u(f), e());
    return n = fv(c), r = n.cache.get, i = n.cache.set, o = a, a(l);
  }, a = (l) => {
    const c = r(l);
    if (c)
      return c;
    const f = hv(l, n);
    return i(l, f), f;
  };
  return o = s, (...l) => o(pv(...l));
}, xv = [], Ee = (e) => {
  const t = (n) => n[e] || xv;
  return t.isThemeGetter = !0, t;
}, Pf = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Of = /^\((?:(\w[\w-]*):)?(.+)\)$/i, bv = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, yv = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, vv = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, wv = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Av = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, kv = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, At = (e) => bv.test(e), oe = (e) => !!e && !Number.isNaN(Number(e)), kt = (e) => !!e && Number.isInteger(Number(e)), ho = (e) => e.endsWith("%") && oe(e.slice(0, -1)), pt = (e) => yv.test(e), Tf = () => !0, Ev = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  vv.test(e) && !wv.test(e)
), ca = () => !1, Cv = (e) => Av.test(e), jv = (e) => kv.test(e), Mv = (e) => !K(e) && !_(e), Sv = (e) => Ft(e, Gf, ca), K = (e) => Pf.test(e), Ut = (e) => Ft(e, Ff, Ev), Zl = (e) => Ft(e, zv, oe), Nv = (e) => Ft(e, Yf, Tf), Iv = (e) => Ft(e, Lf, ca), Wl = (e) => Ft(e, zf, ca), Dv = (e) => Ft(e, Bf, jv), Yr = (e) => Ft(e, Hf, Cv), _ = (e) => Of.test(e), zn = (e) => sn(e, Ff), Rv = (e) => sn(e, Lf), Jl = (e) => sn(e, zf), Pv = (e) => sn(e, Gf), Ov = (e) => sn(e, Bf), Hr = (e) => sn(e, Hf, !0), Tv = (e) => sn(e, Yf, !0), Ft = (e, t, n) => {
  const r = Pf.exec(e);
  return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, sn = (e, t, n = !1) => {
  const r = Of.exec(e);
  return r ? r[1] ? t(r[1]) : n : !1;
}, zf = (e) => e === "position" || e === "percentage", Bf = (e) => e === "image" || e === "url", Gf = (e) => e === "length" || e === "size" || e === "bg-size", Ff = (e) => e === "length", zv = (e) => e === "number", Lf = (e) => e === "family-name", Yf = (e) => e === "number" || e === "weight", Hf = (e) => e === "shadow", Bv = () => {
  const e = Ee("color"), t = Ee("font"), n = Ee("text"), r = Ee("font-weight"), i = Ee("tracking"), o = Ee("leading"), s = Ee("breakpoint"), a = Ee("container"), l = Ee("spacing"), c = Ee("radius"), f = Ee("shadow"), u = Ee("inset-shadow"), m = Ee("text-shadow"), h = Ee("drop-shadow"), p = Ee("blur"), g = Ee("perspective"), y = Ee("aspect"), x = Ee("ease"), k = Ee("animate"), w = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], j = () => [
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
  ], S = () => [...j(), _, K], E = () => ["auto", "hidden", "clip", "visible", "scroll"], O = () => ["auto", "contain", "none"], R = () => [_, K, l], B = () => [At, "full", "auto", ...R()], C = () => [kt, "none", "subgrid", _, K], I = () => ["auto", {
    span: ["full", kt, _, K]
  }, kt, _, K], z = () => [kt, "auto", _, K], W = () => ["auto", "min", "max", "fr", _, K], P = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], M = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], D = () => ["auto", ...R()], F = () => [At, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...R()], T = () => [At, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...R()], G = () => [At, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...R()], b = () => [e, _, K], N = () => [...j(), Jl, Wl, {
    position: [_, K]
  }], Y = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], A = () => ["auto", "cover", "contain", Pv, Sv, {
    size: [_, K]
  }], X = () => [ho, zn, Ut], H = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    _,
    K
  ], q = () => ["", oe, zn, Ut], J = () => ["solid", "dashed", "dotted", "double"], ae = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ie = () => [oe, ho, Jl, Wl], fe = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    p,
    _,
    K
  ], we = () => ["none", oe, _, K], Me = () => ["none", oe, _, K], je = () => [oe, _, K], ft = () => [At, "full", ...R()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [pt],
      breakpoint: [pt],
      color: [Tf],
      container: [pt],
      "drop-shadow": [pt],
      ease: ["in", "out", "in-out"],
      font: [Mv],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [pt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [pt],
      shadow: [pt],
      spacing: ["px", oe],
      text: [pt],
      "text-shadow": [pt],
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
        aspect: ["auto", "square", At, K, _, y]
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
        columns: [oe, K, _, a]
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
        object: S()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: E()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": E()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": E()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: O()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": O()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": O()
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
        inset: B()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": B()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": B()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": B(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: B()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": B(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: B()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": B()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": B()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: B()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: B()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: B()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: B()
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
        z: [kt, "auto", _, K]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [At, "full", "auto", a, ...R()]
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
        flex: [oe, At, "auto", "initial", "none", K]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", oe, _, K]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", oe, _, K]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [kt, "first", "last", "none", _, K]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": C()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: I()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": z()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": z()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": C()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: I()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": z()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": z()
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
        "auto-cols": W()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": W()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: R()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": R()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": R()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...P(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...M(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...M()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...P()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...M(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...M(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": P()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...M(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...M()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: R()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: R()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: R()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: R()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: R()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: R()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: R()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: R()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: R()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: R()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: R()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: D()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: D()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: D()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: D()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: D()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: D()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: D()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: D()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: D()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: D()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: D()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": R()
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
        "space-y": R()
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
        size: F()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...T()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...T()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...T()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...G()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...G()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...G()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [a, "screen", ...F()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          a,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...F()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          a,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [s]
          },
          ...F()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...F()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...F()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...F()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, zn, Ut]
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
        font: [r, Tv, Nv]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", ho, K]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Rv, Iv, t]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [K]
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
        tracking: [i, _, K]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [oe, "none", _, Zl]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          o,
          ...R()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", _, K]
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
        list: ["disc", "decimal", "none", _, K]
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
        placeholder: b()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: b()
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
        decoration: [oe, "from-font", "auto", _, Ut]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: b()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [oe, "auto", _, K]
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
        indent: R()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", _, K]
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
        content: ["none", _, K]
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
        bg: N()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: Y()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: A()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, kt, _, K],
          radial: ["", _, K],
          conic: [kt, _, K]
        }, Ov, Dv]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: b()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: X()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: X()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: X()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: b()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: b()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: b()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: H()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": H()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": H()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": H()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": H()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": H()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": H()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": H()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": H()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": H()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": H()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": H()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": H()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": H()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": H()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: q()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": q()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": q()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": q()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": q()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": q()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": q()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": q()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": q()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": q()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": q()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": q()
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
        "divide-y": q()
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
        border: b()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": b()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": b()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": b()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": b()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": b()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": b()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": b()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": b()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": b()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": b()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: b()
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
        "outline-offset": [oe, _, K]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", oe, zn, Ut]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: b()
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
          Hr,
          Yr
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: b()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", u, Hr, Yr]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": b()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: q()
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
        ring: b()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [oe, Ut]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": b()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": q()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": b()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", m, Hr, Yr]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": b()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [oe, _, K]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ae(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ae()
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
        "mask-linear": [oe]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ie()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ie()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": b()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": b()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ie()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ie()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": b()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": b()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ie()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ie()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": b()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": b()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ie()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ie()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": b()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": b()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ie()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ie()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": b()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": b()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ie()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ie()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": b()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": b()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ie()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ie()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": b()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": b()
      }],
      "mask-image-radial": [{
        "mask-radial": [_, K]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ie()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ie()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": b()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": b()
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
        "mask-radial-at": j()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [oe]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ie()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ie()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": b()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": b()
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
        mask: N()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: Y()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: A()
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
        mask: ["none", _, K]
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
          _,
          K
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: fe()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [oe, _, K]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [oe, _, K]
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
          h,
          Hr,
          Yr
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": b()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", oe, _, K]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [oe, _, K]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", oe, _, K]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [oe, _, K]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", oe, _, K]
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
          _,
          K
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": fe()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [oe, _, K]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [oe, _, K]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", oe, _, K]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [oe, _, K]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", oe, _, K]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [oe, _, K]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [oe, _, K]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", oe, _, K]
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
        "border-spacing": R()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": R()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": R()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", _, K]
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
        duration: [oe, "initial", _, K]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", x, _, K]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [oe, _, K]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", k, _, K]
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
        perspective: [g, _, K]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": S()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: we()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": we()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": we()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": we()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: Me()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": Me()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": Me()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": Me()
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
        skew: je()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": je()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": je()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [_, K, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: S()
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
        translate: ft()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": ft()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": ft()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": ft()
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
        accent: b()
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
        caret: b()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", _, K]
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
        "scroll-m": R()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": R()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": R()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": R()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": R()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": R()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": R()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": R()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": R()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": R()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": R()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": R()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": R()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": R()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": R()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": R()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": R()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": R()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": R()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": R()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": R()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": R()
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
        "will-change": ["auto", "scroll", "contents", "transform", _, K]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...b()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [oe, zn, Ut, Zl]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...b()]
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
}, Gv = /* @__PURE__ */ gv(Bv);
function Q(...e) {
  return Gv(bu(e));
}
const Fv = gp(
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
function me({
  className: e,
  variant: t = "default",
  size: n = "default",
  asChild: r = !1,
  ...i
}) {
  const o = r ? xp : "button";
  return /* @__PURE__ */ d.jsx(
    o,
    {
      "data-slot": "button",
      "data-variant": t,
      "data-size": n,
      className: Q(Fv({ variant: t, size: n, className: e })),
      ...i
    }
  );
}
function Vt({ className: e, type: t, ...n }) {
  return /* @__PURE__ */ d.jsx(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: Q(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        e
      ),
      ...n
    }
  );
}
function qt({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    Ty,
    {
      "data-slot": "label",
      className: Q(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        e
      ),
      ...t
    }
  );
}
function Lv({
  className: e,
  orientation: t = "horizontal",
  decorative: n = !0,
  ...r
}) {
  return /* @__PURE__ */ d.jsx(
    qy,
    {
      "data-slot": "separator",
      decorative: n,
      orientation: t,
      className: Q(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        e
      ),
      ...r
    }
  );
}
const Qf = (...e) => e.filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n).join(" ").trim();
const Yv = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Hv = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
const Vl = (e) => {
  const t = Hv(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
var po = {
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
const Qv = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
}, Uv = nn({}), Zv = () => lt(Uv), Wv = Ci(
  ({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: i = "", children: o, iconNode: s, ...a }, l) => {
    const {
      size: c = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: u = !1,
      color: m = "currentColor",
      className: h = ""
    } = Zv() ?? {}, p = r ?? u ? Number(n ?? f) * 24 / Number(t ?? c) : n ?? f;
    return Qo(
      "svg",
      {
        ref: l,
        ...po,
        width: t ?? c ?? po.width,
        height: t ?? c ?? po.height,
        stroke: e ?? m,
        strokeWidth: p,
        className: Qf("lucide", h, i),
        ...!o && !Qv(a) && { "aria-hidden": "true" },
        ...a
      },
      [
        ...s.map(([g, y]) => Qo(g, y)),
        ...Array.isArray(o) ? o : [o]
      ]
    );
  }
);
const he = (e, t) => {
  const n = Ci(
    ({ className: r, ...i }, o) => Qo(Wv, {
      ref: o,
      iconNode: t,
      className: Qf(
        `lucide-${Yv(Vl(e))}`,
        `lucide-${e}`,
        r
      ),
      ...i
    })
  );
  return n.displayName = Vl(e), n;
};
const Jv = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], Vv = he("arrow-left", Jv);
const qv = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
], Uf = he("bell", qv);
const Xv = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  ["path", { d: "M16 12h2", key: "7q9ll5" }],
  ["path", { d: "M16 8h2", key: "msurwy" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ],
  ["path", { d: "M6 12h2", key: "32wvfc" }],
  ["path", { d: "M6 8h2", key: "30oboj" }]
], kr = he("book-open-text", Xv);
const Kv = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], ua = he("check", Kv);
const _v = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], da = he("chevron-down", _v);
const $v = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], Zf = he("chevron-left", $v);
const ew = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], It = he("chevron-right", ew);
const tw = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], _o = he("chevron-up", tw);
const nw = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], rw = he("circle-alert", nw);
const iw = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], ow = he("circle-check", iw);
const sw = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]], aw = he("circle", sw);
const lw = [
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
], cw = he("clipboard-list", lw);
const uw = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
], dw = he("clock", uw);
const fw = [
  ["path", { d: "m15 15 6 6", key: "1s409w" }],
  ["path", { d: "m15 9 6-6", key: "ko1vev" }],
  ["path", { d: "M21 16v5h-5", key: "1ck2sf" }],
  ["path", { d: "M21 8V3h-5", key: "1qoq8a" }],
  ["path", { d: "M3 16v5h5", key: "1t08am" }],
  ["path", { d: "m3 21 6-6", key: "wwnumi" }],
  ["path", { d: "M3 8V3h5", key: "1ln10m" }],
  ["path", { d: "M9 9 3 3", key: "v551iv" }]
], ql = he("expand", fw);
const mw = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
], hw = he("hash", mw);
const pw = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
], gw = he("info", pw);
const xw = [
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 19h8", key: "c3s6r1" }],
  ["path", { d: "M3 10a2 2 0 0 0 2 2h3", key: "1npucw" }],
  ["path", { d: "M3 5v12a2 2 0 0 0 2 2h3", key: "x1gjn2" }]
], bw = he("list-tree", xw);
const yw = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], fa = he("loader-circle", yw);
const vw = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
], $o = he("monitor", vw);
const ww = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], fi = he("moon", ww);
const Aw = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
], Xl = he("panel-right", Aw);
const kw = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Ew = he("plus", kw);
const Cw = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], jw = he("refresh-cw", Cw);
const Mw = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
], Sw = he("save", Mw);
const Nw = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], Iw = he("search", Nw);
const Dw = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
], Rw = he("sliders-horizontal", Dw);
const Pw = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], mi = he("sun", Pw);
const Ow = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
], Tw = he("triangle-alert", Ow);
const zw = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
], Bw = he("user", zw);
const Gw = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Er = he("x", Gw);
function ma({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(Os, { "data-slot": "dialog", ...e });
}
function yN({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(qu, { "data-slot": "dialog-trigger", ...e });
}
function Fw({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(Ts, { "data-slot": "dialog-portal", ...e });
}
function vN({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(gr, { "data-slot": "dialog-close", ...e });
}
function Lw({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    zs,
    {
      "data-slot": "dialog-overlay",
      className: Q(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        e
      ),
      ...t
    }
  );
}
function ha({
  className: e,
  children: t,
  showCloseButton: n = !0,
  ...r
}) {
  return /* @__PURE__ */ d.jsxs(Fw, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ d.jsx(Lw, {}),
    /* @__PURE__ */ d.jsxs(
      Bs,
      {
        "data-slot": "dialog-content",
        className: Q(
          "fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100vh-1rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
          e
        ),
        ...r,
        children: [
          t,
          n && /* @__PURE__ */ d.jsxs(
            gr,
            {
              "data-slot": "dialog-close",
              className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ d.jsx(Er, {}),
                /* @__PURE__ */ d.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function pa({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: Q("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function Wf({
  className: e,
  showCloseButton: t = !1,
  children: n,
  ...r
}) {
  return /* @__PURE__ */ d.jsxs(
    "div",
    {
      "data-slot": "dialog-footer",
      className: Q(
        "shrink-0 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        e
      ),
      ...r,
      children: [
        n,
        t && /* @__PURE__ */ d.jsx(gr, { asChild: !0, children: /* @__PURE__ */ d.jsx(me, { variant: "outline", children: "Close" }) })
      ]
    }
  );
}
function ga({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    Gs,
    {
      "data-slot": "dialog-title",
      className: Q("text-lg leading-none font-semibold", e),
      ...t
    }
  );
}
function Jf({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    Xu,
    {
      "data-slot": "dialog-description",
      className: Q("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
const hi = "auth.user";
function Vf() {
  try {
    const e = localStorage.getItem(hi);
    return e ? JSON.parse(e) : null;
  } catch {
    return localStorage.removeItem(hi), null;
  }
}
function xa() {
  localStorage.removeItem(hi);
}
function qf(e) {
  localStorage.setItem(hi, JSON.stringify(e));
}
let Qr = null, Ur = null;
const Yw = 429, Hw = 1, es = "auth:session-expired";
function Qw(e) {
  if (typeof e == "string")
    return e;
  if (e && typeof e == "object") {
    const t = e, n = t.message ?? t.detail ?? t.error;
    if (typeof n == "string")
      return n;
  }
  return "";
}
async function Uw(e) {
  const t = e.clone(), n = t.headers.get("content-type") || "";
  try {
    if (n.includes("application/json")) {
      const r = await t.json();
      return Qw(r);
    }
    return (await t.text()).trim();
  } catch {
    return "";
  }
}
function Zw(e) {
  if (!e)
    return null;
  const t = Number(e);
  if (Number.isFinite(t) && t >= 0)
    return t * 1e3;
  const n = Date.parse(e);
  return Number.isNaN(n) ? null : Math.max(n - Date.now(), 0);
}
function Ww(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function Cr(e, t, n = Hw) {
  const r = await fetch(e, {
    ...t,
    cache: t?.cache ?? "no-store"
  });
  if (r.status !== Yw || n <= 0)
    return r;
  const i = Zw(r.headers.get("retry-after"));
  return i === null ? r : (await Ww(i), Cr(e, t, n - 1));
}
async function Jw(e) {
  if (e.status !== 401)
    return !1;
  const t = (await Uw(e)).toLowerCase();
  return t.includes("token") && t.includes("expired");
}
function Vw() {
  const e = Vf();
  if (!e)
    return null;
  const t = e.username ?? e.email ?? e.sub;
  return typeof t == "string" && t.trim() ? t.trim() : null;
}
async function qw() {
  return Qr || (Qr = (async () => {
    const e = Vw();
    return e ? !!(await Cr(zt("refresh"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: e
      },
      credentials: "include"
    })).ok : !1;
  })().finally(() => {
    Qr = null;
  })), Qr;
}
async function Xw() {
  return Ur || (Ur = (async () => {
    try {
      await Cr(zt("logout"), {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        credentials: "include"
      });
    } catch {
    } finally {
      window.dispatchEvent(new Event(es));
    }
  })().finally(() => {
    Ur = null;
  })), Ur;
}
async function Lt(e, t = {}) {
  const { skipRefresh: n = !1, ...r } = t, i = await Cr(e, r);
  return n || !await Jw(i) ? i : await qw() ? Lt(e, { ...r, skipRefresh: !0 }) : (await Xw(), i);
}
const Kw = {
  error: {
    container: "border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/12",
    icon: rw
  },
  success: {
    container: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/12 dark:text-emerald-300",
    icon: ow
  },
  info: {
    container: "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/12 dark:text-sky-300",
    icon: gw
  }
};
function rr({
  children: e,
  className: t,
  variant: n = "info"
}) {
  const { container: r, icon: i } = Kw[n];
  return /* @__PURE__ */ d.jsxs(
    "div",
    {
      role: n === "error" ? "alert" : "status",
      className: Q(
        "flex items-start gap-3 rounded-xl border px-3 py-2 text-sm",
        r,
        t
      ),
      children: [
        /* @__PURE__ */ d.jsx(i, { className: "mt-0.5 size-4 shrink-0" }),
        /* @__PURE__ */ d.jsx("div", { children: e })
      ]
    }
  );
}
function _w({ open: e, handleClose: t }) {
  const [n, r] = v.useState(!1), [i, o] = v.useState(""), s = () => {
    o(""), t();
  }, a = (c) => {
    c || s();
  }, l = async (c) => {
    o("");
    const u = new FormData(c).get("username");
    if (!u || typeof u != "string") {
      o("Username is required.");
      return;
    }
    r(!0);
    try {
      const m = new URLSearchParams();
      m.append("username", u);
      const h = await Lt(zt("resetPassword"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        credentials: "include",
        body: m.toString()
      });
      if (!h.ok)
        throw new Error(`Reset password failed: ${h.status} ${h.statusText}`);
      s();
    } catch (m) {
      o(
        m instanceof Error ? m.message : "Failed to request password reset. Please try again."
      );
    } finally {
      r(!1);
    }
  };
  return /* @__PURE__ */ d.jsx(ma, { open: e, onOpenChange: a, children: /* @__PURE__ */ d.jsx(ha, { className: "flex max-h-[92vh] w-[min(97vw,38rem)] max-w-none flex-col overflow-hidden border-border/70 bg-card/95 p-0", children: /* @__PURE__ */ d.jsxs(
    "form",
    {
      className: "flex min-h-0 flex-1 flex-col",
      onSubmit: (c) => {
        c.preventDefault(), c.stopPropagation(), l(c.currentTarget);
      },
      children: [
        /* @__PURE__ */ d.jsxs(pa, { className: "border-b border-border/70 px-6 py-4 text-left", children: [
          /* @__PURE__ */ d.jsx(ga, { children: "Reset password" }),
          /* @__PURE__ */ d.jsx(Jf, { children: "Enter your account's username, and we'll send you a link to reset your password." })
        ] }),
        /* @__PURE__ */ d.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-6 py-5", children: /* @__PURE__ */ d.jsxs("div", { className: "space-y-4", children: [
          i && /* @__PURE__ */ d.jsx(rr, { variant: "error", children: i }),
          /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ d.jsx(qt, { htmlFor: "forgot-password-username", children: /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ d.jsx("span", { children: "Username" }),
              /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
            ] }) }),
            /* @__PURE__ */ d.jsx(
              Vt,
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
        /* @__PURE__ */ d.jsxs(Wf, { className: "gap-2 border-t border-border/70 px-6 py-4 sm:justify-between", children: [
          /* @__PURE__ */ d.jsx(
            me,
            {
              type: "button",
              variant: "outline",
              onClick: s,
              disabled: n,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ d.jsx(me, { type: "submit", disabled: n, children: n ? "Sending..." : "Continue" })
        ] })
      ]
    }
  ) }) });
}
const Xf = "app-color-mode", Kf = v.createContext({
  mode: "system",
  resolvedMode: "light",
  systemMode: "light",
  setMode: () => {
  }
});
function $w() {
  if (typeof window > "u")
    return "system";
  const e = window.localStorage.getItem(Xf);
  return e === "light" || e === "dark" || e === "system" ? e : "system";
}
function e0() {
  return typeof window > "u" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function t0(e) {
  if (typeof document > "u")
    return;
  const t = document.documentElement;
  t.classList.toggle("dark", e === "dark"), t.dataset.theme = e, t.style.colorScheme = e;
}
function _f() {
  return v.useContext(Kf);
}
function $f({ children: e, disableCustomTheme: t }) {
  const [n, r] = v.useState(() => $w()), [i, o] = v.useState(() => e0()), s = n === "system" ? i : n;
  v.useEffect(() => {
    if (typeof window > "u")
      return;
    const l = window.matchMedia("(prefers-color-scheme: dark)"), c = (f) => {
      o(f.matches ? "dark" : "light");
    };
    return o(l.matches ? "dark" : "light"), l.addEventListener("change", c), () => {
      l.removeEventListener("change", c);
    };
  }, []), v.useEffect(() => {
    typeof window > "u" || window.localStorage.setItem(Xf, n);
  }, [n]), v.useEffect(() => {
    t || t0(s);
  }, [t, s]);
  const a = v.useMemo(() => ({
    mode: n,
    resolvedMode: s,
    systemMode: i,
    setMode: r
  }), [n, s, i]);
  return /* @__PURE__ */ d.jsx(Kf.Provider, { value: a, children: e });
}
function ba({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(wy, { "data-slot": "dropdown-menu", ...e });
}
function wN({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(pf, { "data-slot": "dropdown-menu-portal", ...e });
}
function ya({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(
    Ay,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function va({
  className: e,
  sideOffset: t = 4,
  ...n
}) {
  return /* @__PURE__ */ d.jsx(pf, { children: /* @__PURE__ */ d.jsx(
    ky,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset: t,
      className: Q(
        "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...n
    }
  ) });
}
function AN({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(Ey, { "data-slot": "dropdown-menu-group", ...e });
}
function kN({
  className: e,
  inset: t,
  variant: n = "default",
  ...r
}) {
  return /* @__PURE__ */ d.jsx(
    jy,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": t,
      "data-variant": n,
      className: Q(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        e
      ),
      ...r
    }
  );
}
function EN({
  className: e,
  children: t,
  checked: n,
  ...r
}) {
  return /* @__PURE__ */ d.jsxs(
    My,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: Q(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      checked: n,
      ...r,
      children: [
        /* @__PURE__ */ d.jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ d.jsx(gf, { children: /* @__PURE__ */ d.jsx(ua, { className: "size-4" }) }) }),
        t
      ]
    }
  );
}
function em({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(
    Sy,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function yn({
  className: e,
  children: t,
  ...n
}) {
  return /* @__PURE__ */ d.jsxs(
    Ny,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: Q(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n,
      children: [
        /* @__PURE__ */ d.jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ d.jsx(gf, { children: /* @__PURE__ */ d.jsx(aw, { className: "size-2 fill-current" }) }) }),
        t
      ]
    }
  );
}
function n0({
  className: e,
  inset: t,
  ...n
}) {
  return /* @__PURE__ */ d.jsx(
    Cy,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": t,
      className: Q(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        e
      ),
      ...n
    }
  );
}
function r0({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    Iy,
    {
      "data-slot": "dropdown-menu-separator",
      className: Q("-mx-1 my-1 h-px bg-border", e),
      ...t
    }
  );
}
function CN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: Q(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        e
      ),
      ...t
    }
  );
}
function jN({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(Dy, { "data-slot": "dropdown-menu-sub", ...e });
}
function MN({
  className: e,
  inset: t,
  children: n,
  ...r
}) {
  return /* @__PURE__ */ d.jsxs(
    Ry,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": t,
      className: Q(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        e
      ),
      ...r,
      children: [
        n,
        /* @__PURE__ */ d.jsx(It, { className: "ml-auto size-4" })
      ]
    }
  );
}
function SN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    Py,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: Q(
        "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...t
    }
  );
}
function tm(e) {
  const { mode: t, setMode: n } = _f(), { className: r, ...i } = e, o = {
    system: "System",
    light: "Light",
    dark: "Dark"
  }, s = {
    system: /* @__PURE__ */ d.jsx($o, { className: "size-4" }),
    light: /* @__PURE__ */ d.jsx(mi, { className: "size-4" }),
    dark: /* @__PURE__ */ d.jsx(fi, { className: "size-4" })
  };
  return /* @__PURE__ */ d.jsxs(ba, { children: [
    /* @__PURE__ */ d.jsx(ya, { asChild: !0, children: /* @__PURE__ */ d.jsxs(
      me,
      {
        "data-screenshot": "toggle-mode",
        variant: "outline",
        size: "sm",
        className: Q(
          "rounded-full border-border/70 bg-background/85 px-3 shadow-sm backdrop-blur",
          r
        ),
        ...i,
        children: [
          s[t],
          /* @__PURE__ */ d.jsx("span", { className: "hidden sm:inline", children: o[t] })
        ]
      }
    ) }),
    /* @__PURE__ */ d.jsx(va, { align: "end", className: "w-36", children: /* @__PURE__ */ d.jsxs(
      em,
      {
        value: t,
        onValueChange: (a) => n(a),
        children: [
          /* @__PURE__ */ d.jsxs(yn, { value: "system", children: [
            /* @__PURE__ */ d.jsx($o, { className: "mr-2 size-4" }),
            "System"
          ] }),
          /* @__PURE__ */ d.jsxs(yn, { value: "light", children: [
            /* @__PURE__ */ d.jsx(mi, { className: "mr-2 size-4" }),
            "Light"
          ] }),
          /* @__PURE__ */ d.jsxs(yn, { value: "dark", children: [
            /* @__PURE__ */ d.jsx(fi, { className: "mr-2 size-4" }),
            "Dark"
          ] })
        ]
      }
    ) })
  ] });
}
const i0 = "data:image/png;base64,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NqTSftvpM/mNx7tG2g8c6t20ffeJjW++f6TtxVe3r33jzd1L/uQvfjbr//nbJxv+4A+2XNUHgb17gVGaDfUMZuoPH+qfv29/d/uu/d1YfuemHTtPbdq6s2vTe9uOt73x/v51z765c/VTr7y14sff//GyHfuPrd59sLNtz+HO9t2HOjce7zjdNnAmvXY0U14yNlpquhgzao47vrcjsmv/sTm7d55o276rc+PWnT3tH+zua38P3fd2dW/asrNz03u7j69+d3dHK5ZTmxPRveR99OiYnXbK8UNHT8/csb9rLZbbvnVv56YPtqP8u062v7vjePs7249ueOv9o2tefmvfqqeff2flBzuOrtm5v79t38Ezm46fHGnvPp1rHxgpbxzNVtvODOfbTvWn2o+cHGjfub+r/b0dx9vefOfo2qee2rbsp7/cO+epV95pff75D+JPPvkku6RgF4lEHiie6IW34KnrXz7xztSfvfLmwq07jqzaerCjbfuhrk27j/ZuOtgx0N7Vn9rYnypuPJMpt43kym2nh4sbD3cNtu88cKr93X0nN7255+jGN7cdWfvzl/atfA3dt3Yfaftgz7H2rfs62nfs62zfsf/kpl37TrQfONzRdvh49/qOnr45I/l8XVdXJvzOO6BWhItICEBwQcElRhC04mqdgIMKpymc6wgQYgChJlBqxEolPvWdHccXvrPzxKqtu7vbdhw5s3H/iZH2rsHSxsFMsDFV4G3ZktM2mi+29QwMt+07dmrj3kOdGz44eHL9O3uPrn5+27Fl/8d//tuZP3np/fqenp4QcnNNnAJeW7b0hF461Ff/vVe2TX36/bfmv7XzyIp9x3vWHjjZ23bwZO/GPcd6Nx4/PbqxbzS/cTDvtGUcvj7t8vWn06W2A5397YdO9bcf7Opv34Pptx88tu69nceWvXFw97z/9rPnp/z3J7fEUDaigFVd0b0F27Nl//66p978YMqLO9+a/96+Y8v3HO9as7fjVNu+Ez0bdh3tattz8vTG/V1n2juHsxsH8s760bK/PuWItpTD2wayzsbj/an2gz1n2nefwHF/rK9t6+HOdduPdS7f09sz96dvvtn6o9dei16RMOckyo+cjo1khqd0Dw0tON7dt+oIcnOkowf77dSmvSd7N+3t7mvf3Xl6/dajx1c9v/PQyue3HVr5JW7mcgAAEABJREFUzsEj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";
function ts() {
  return /* @__PURE__ */ d.jsx("img", { src: i0, width: "150", alt: "Sitemark" });
}
var $r = { exports: {} }, o0 = $r.exports, Kl;
function s0() {
  return Kl || (Kl = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r();
    })(o0, (function() {
      var n = 1e3, r = 6e4, i = 36e5, o = "millisecond", s = "second", a = "minute", l = "hour", c = "day", f = "week", u = "month", m = "quarter", h = "year", p = "date", g = "Invalid Date", y = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, x = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, k = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(P) {
        var M = ["th", "st", "nd", "rd"], D = P % 100;
        return "[" + P + (M[(D - 20) % 10] || M[D] || M[0]) + "]";
      } }, w = function(P, M, D) {
        var F = String(P);
        return !F || F.length >= M ? P : "" + Array(M + 1 - F.length).join(D) + P;
      }, j = { s: w, z: function(P) {
        var M = -P.utcOffset(), D = Math.abs(M), F = Math.floor(D / 60), T = D % 60;
        return (M <= 0 ? "+" : "-") + w(F, 2, "0") + ":" + w(T, 2, "0");
      }, m: function P(M, D) {
        if (M.date() < D.date()) return -P(D, M);
        var F = 12 * (D.year() - M.year()) + (D.month() - M.month()), T = M.clone().add(F, u), G = D - T < 0, b = M.clone().add(F + (G ? -1 : 1), u);
        return +(-(F + (D - T) / (G ? T - b : b - T)) || 0);
      }, a: function(P) {
        return P < 0 ? Math.ceil(P) || 0 : Math.floor(P);
      }, p: function(P) {
        return { M: u, y: h, w: f, d: c, D: p, h: l, m: a, s, ms: o, Q: m }[P] || String(P || "").toLowerCase().replace(/s$/, "");
      }, u: function(P) {
        return P === void 0;
      } }, S = "en", E = {};
      E[S] = k;
      var O = "$isDayjsObject", R = function(P) {
        return P instanceof z || !(!P || !P[O]);
      }, B = function P(M, D, F) {
        var T;
        if (!M) return S;
        if (typeof M == "string") {
          var G = M.toLowerCase();
          E[G] && (T = G), D && (E[G] = D, T = G);
          var b = M.split("-");
          if (!T && b.length > 1) return P(b[0]);
        } else {
          var N = M.name;
          E[N] = M, T = N;
        }
        return !F && T && (S = T), T || !F && S;
      }, C = function(P, M) {
        if (R(P)) return P.clone();
        var D = typeof M == "object" ? M : {};
        return D.date = P, D.args = arguments, new z(D);
      }, I = j;
      I.l = B, I.i = R, I.w = function(P, M) {
        return C(P, { locale: M.$L, utc: M.$u, x: M.$x, $offset: M.$offset });
      };
      var z = (function() {
        function P(D) {
          this.$L = B(D.locale, null, !0), this.parse(D), this.$x = this.$x || D.x || {}, this[O] = !0;
        }
        var M = P.prototype;
        return M.parse = function(D) {
          this.$d = (function(F) {
            var T = F.date, G = F.utc;
            if (T === null) return /* @__PURE__ */ new Date(NaN);
            if (I.u(T)) return /* @__PURE__ */ new Date();
            if (T instanceof Date) return new Date(T);
            if (typeof T == "string" && !/Z$/i.test(T)) {
              var b = T.match(y);
              if (b) {
                var N = b[2] - 1 || 0, Y = (b[7] || "0").substring(0, 3);
                return G ? new Date(Date.UTC(b[1], N, b[3] || 1, b[4] || 0, b[5] || 0, b[6] || 0, Y)) : new Date(b[1], N, b[3] || 1, b[4] || 0, b[5] || 0, b[6] || 0, Y);
              }
            }
            return new Date(T);
          })(D), this.init();
        }, M.init = function() {
          var D = this.$d;
          this.$y = D.getFullYear(), this.$M = D.getMonth(), this.$D = D.getDate(), this.$W = D.getDay(), this.$H = D.getHours(), this.$m = D.getMinutes(), this.$s = D.getSeconds(), this.$ms = D.getMilliseconds();
        }, M.$utils = function() {
          return I;
        }, M.isValid = function() {
          return this.$d.toString() !== g;
        }, M.isSame = function(D, F) {
          var T = C(D);
          return this.startOf(F) <= T && T <= this.endOf(F);
        }, M.isAfter = function(D, F) {
          return C(D) < this.startOf(F);
        }, M.isBefore = function(D, F) {
          return this.endOf(F) < C(D);
        }, M.$g = function(D, F, T) {
          return I.u(D) ? this[F] : this.set(T, D);
        }, M.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, M.valueOf = function() {
          return this.$d.getTime();
        }, M.startOf = function(D, F) {
          var T = this, G = !!I.u(F) || F, b = I.p(D), N = function(ie, fe) {
            var we = I.w(T.$u ? Date.UTC(T.$y, fe, ie) : new Date(T.$y, fe, ie), T);
            return G ? we : we.endOf(c);
          }, Y = function(ie, fe) {
            return I.w(T.toDate()[ie].apply(T.toDate("s"), (G ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(fe)), T);
          }, A = this.$W, X = this.$M, H = this.$D, q = "set" + (this.$u ? "UTC" : "");
          switch (b) {
            case h:
              return G ? N(1, 0) : N(31, 11);
            case u:
              return G ? N(1, X) : N(0, X + 1);
            case f:
              var J = this.$locale().weekStart || 0, ae = (A < J ? A + 7 : A) - J;
              return N(G ? H - ae : H + (6 - ae), X);
            case c:
            case p:
              return Y(q + "Hours", 0);
            case l:
              return Y(q + "Minutes", 1);
            case a:
              return Y(q + "Seconds", 2);
            case s:
              return Y(q + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, M.endOf = function(D) {
          return this.startOf(D, !1);
        }, M.$set = function(D, F) {
          var T, G = I.p(D), b = "set" + (this.$u ? "UTC" : ""), N = (T = {}, T[c] = b + "Date", T[p] = b + "Date", T[u] = b + "Month", T[h] = b + "FullYear", T[l] = b + "Hours", T[a] = b + "Minutes", T[s] = b + "Seconds", T[o] = b + "Milliseconds", T)[G], Y = G === c ? this.$D + (F - this.$W) : F;
          if (G === u || G === h) {
            var A = this.clone().set(p, 1);
            A.$d[N](Y), A.init(), this.$d = A.set(p, Math.min(this.$D, A.daysInMonth())).$d;
          } else N && this.$d[N](Y);
          return this.init(), this;
        }, M.set = function(D, F) {
          return this.clone().$set(D, F);
        }, M.get = function(D) {
          return this[I.p(D)]();
        }, M.add = function(D, F) {
          var T, G = this;
          D = Number(D);
          var b = I.p(F), N = function(X) {
            var H = C(G);
            return I.w(H.date(H.date() + Math.round(X * D)), G);
          };
          if (b === u) return this.set(u, this.$M + D);
          if (b === h) return this.set(h, this.$y + D);
          if (b === c) return N(1);
          if (b === f) return N(7);
          var Y = (T = {}, T[a] = r, T[l] = i, T[s] = n, T)[b] || 1, A = this.$d.getTime() + D * Y;
          return I.w(A, this);
        }, M.subtract = function(D, F) {
          return this.add(-1 * D, F);
        }, M.format = function(D) {
          var F = this, T = this.$locale();
          if (!this.isValid()) return T.invalidDate || g;
          var G = D || "YYYY-MM-DDTHH:mm:ssZ", b = I.z(this), N = this.$H, Y = this.$m, A = this.$M, X = T.weekdays, H = T.months, q = T.meridiem, J = function(fe, we, Me, je) {
            return fe && (fe[we] || fe(F, G)) || Me[we].slice(0, je);
          }, ae = function(fe) {
            return I.s(N % 12 || 12, fe, "0");
          }, ie = q || function(fe, we, Me) {
            var je = fe < 12 ? "AM" : "PM";
            return Me ? je.toLowerCase() : je;
          };
          return G.replace(x, (function(fe, we) {
            return we || (function(Me) {
              switch (Me) {
                case "YY":
                  return String(F.$y).slice(-2);
                case "YYYY":
                  return I.s(F.$y, 4, "0");
                case "M":
                  return A + 1;
                case "MM":
                  return I.s(A + 1, 2, "0");
                case "MMM":
                  return J(T.monthsShort, A, H, 3);
                case "MMMM":
                  return J(H, A);
                case "D":
                  return F.$D;
                case "DD":
                  return I.s(F.$D, 2, "0");
                case "d":
                  return String(F.$W);
                case "dd":
                  return J(T.weekdaysMin, F.$W, X, 2);
                case "ddd":
                  return J(T.weekdaysShort, F.$W, X, 3);
                case "dddd":
                  return X[F.$W];
                case "H":
                  return String(N);
                case "HH":
                  return I.s(N, 2, "0");
                case "h":
                  return ae(1);
                case "hh":
                  return ae(2);
                case "a":
                  return ie(N, Y, !0);
                case "A":
                  return ie(N, Y, !1);
                case "m":
                  return String(Y);
                case "mm":
                  return I.s(Y, 2, "0");
                case "s":
                  return String(F.$s);
                case "ss":
                  return I.s(F.$s, 2, "0");
                case "SSS":
                  return I.s(F.$ms, 3, "0");
                case "Z":
                  return b;
              }
              return null;
            })(fe) || b.replace(":", "");
          }));
        }, M.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, M.diff = function(D, F, T) {
          var G, b = this, N = I.p(F), Y = C(D), A = (Y.utcOffset() - this.utcOffset()) * r, X = this - Y, H = function() {
            return I.m(b, Y);
          };
          switch (N) {
            case h:
              G = H() / 12;
              break;
            case u:
              G = H();
              break;
            case m:
              G = H() / 3;
              break;
            case f:
              G = (X - A) / 6048e5;
              break;
            case c:
              G = (X - A) / 864e5;
              break;
            case l:
              G = X / i;
              break;
            case a:
              G = X / r;
              break;
            case s:
              G = X / n;
              break;
            default:
              G = X;
          }
          return T ? G : I.a(G);
        }, M.daysInMonth = function() {
          return this.endOf(u).$D;
        }, M.$locale = function() {
          return E[this.$L];
        }, M.locale = function(D, F) {
          if (!D) return this.$L;
          var T = this.clone(), G = B(D, F, !0);
          return G && (T.$L = G), T;
        }, M.clone = function() {
          return I.w(this.$d, this);
        }, M.toDate = function() {
          return new Date(this.valueOf());
        }, M.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, M.toISOString = function() {
          return this.$d.toISOString();
        }, M.toString = function() {
          return this.$d.toUTCString();
        }, P;
      })(), W = z.prototype;
      return C.prototype = W, [["$ms", o], ["$s", s], ["$m", a], ["$H", l], ["$W", c], ["$M", u], ["$y", h], ["$D", p]].forEach((function(P) {
        W[P[1]] = function(M) {
          return this.$g(M, P[0], P[1]);
        };
      })), C.extend = function(P, M) {
        return P.$i || (P(M, z, C), P.$i = !0), C;
      }, C.locale = B, C.isDayjs = R, C.unix = function(P) {
        return C(1e3 * P);
      }, C.en = E[S], C.Ls = E, C.p = {}, C;
    }));
  })($r)), $r.exports;
}
var a0 = s0();
const ir = /* @__PURE__ */ Ss(a0), nm = "YYYY-MM-DDTHH:mm:ss.SSSZ", l0 = "YYYY-MM-DDTHH:mm", _l = "HH:mm";
function c0(e) {
  const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), i = String(e.getHours()).padStart(2, "0"), o = String(e.getMinutes()).padStart(2, "0"), s = String(e.getSeconds()).padStart(2, "0"), a = String(e.getMilliseconds()).padStart(3, "0"), l = -e.getTimezoneOffset(), c = l >= 0 ? "+" : "-", f = Math.abs(l), u = String(Math.floor(f / 60)).padStart(2, "0"), m = String(f % 60).padStart(2, "0");
  return `${t}-${n}-${r}T${i}:${o}:${s}.${a}${c}${u}:${m}`;
}
function u0(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? void 0 : t;
}
function d0(e) {
  const t = e.trim(), n = t.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])$/
  );
  if (n) {
    const [, l, c, f, u] = n, m = Number(l), h = Number(c), p = f ? Number(f) : 0;
    if (m < 1 || m > 12 || h < 0 || h > 59 || p < 0 || p > 59)
      return;
    const g = u.toLowerCase() === "pm" ? m % 12 + 12 : m % 12;
    return `${String(g).padStart(2, "0")}:${c}`;
  }
  const r = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!r)
    return;
  const [, i, o] = r, s = Number(i), a = Number(o);
  if (!(s < 0 || s > 23 || a < 0 || a > 59))
    return `${String(s).padStart(2, "0")}:${o}`;
}
function NN(e) {
  return e ? new Date(e).toLocaleDateString() : "-";
}
function IN(e) {
  if (!e)
    return "-";
  const t = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(e).toLocaleString(void 0, { timeZone: t });
}
function DN(e) {
  const t = e?.trim();
  if (!t)
    return;
  const n = ir(t);
  if (n.isValid())
    return n.format(nm);
  const r = u0(t);
  return r ? c0(r) : void 0;
}
function RN(e, t) {
  const n = e?.trim();
  if (!n)
    return;
  const r = t === "start" ? ir(n).startOf("day") : ir(n).endOf("day");
  return r.isValid() ? r.format(nm) : void 0;
}
function PN(e) {
  const t = e?.trim();
  if (!t)
    return "";
  const n = ir(t);
  return n.isValid() ? n.format(l0) : "";
}
function ON(e) {
  const t = e?.trim();
  if (!t)
    return;
  const n = ir(t, _l);
  return n.isValid() ? n.format(_l) : d0(t);
}
function TN(e, t = 2, n = 8) {
  const r = e ?? "", i = r.split(`
`).length, o = Math.ceil(r.length / 70);
  return Math.min(n, Math.max(t, i, o));
}
function f0(e) {
  if (!e || typeof e != "object")
    return null;
  const t = e, n = t.name, r = t.username, i = t.sub, o = t.account_type;
  return typeof n != "string" || typeof r != "string" || typeof i != "string" || typeof o != "string" ? null : {
    ...t,
    name: n,
    username: r,
    sub: i,
    account_type: o
  };
}
function m0(e) {
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
async function h0(e) {
  const t = new URLSearchParams();
  t.append("grant_type", "password"), t.append("username", e.username), t.append("password", e.password);
  const n = new URL(zt("login"), window.location.origin);
  e.account_type && n.searchParams.append("account_type", e.account_type);
  const r = await Cr(n.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    credentials: "include",
    body: t.toString()
  });
  if (!r.ok)
    throw new Error(
      `Login failed: ${r.status} ${r.statusText}`
    );
  return wa();
}
async function p0(e, t) {
  const n = new URLSearchParams();
  n.append("credential", e), t && n.append("account_type", t);
  const r = await Lt(
    `${zt("authenticateGoogle")}?${n.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      credentials: "include"
    }
  );
  if (!r.ok)
    throw new Error(
      `Google login failed: ${r.status} ${r.statusText}`
    );
  return wa();
}
async function g0() {
  const e = await Lt(zt("logout"), {
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
  xa();
}
async function wa() {
  const e = await Lt(zt("currentUser"), {
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
  const t = await e.json(), n = f0(m0(t));
  if (!n)
    throw new Error("Current user response did not contain a valid user");
  return qf(n), n;
}
async function x0(e) {
  const t = new URLSearchParams();
  t.append("token", e.token), t.append("username", e.username), t.append("password", e.password);
  const n = await Lt(
    zt("resetPasswordAuthorised"),
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
const rm = nn(void 0);
function $l() {
  localStorage.clear(), xa();
}
function zN({ children: e }) {
  const [t, n] = ge(null), [r, i] = ge(!0);
  de(() => {
    let l = !0;
    return (async () => {
      const f = Vf();
      f && n(f);
      try {
        const u = await wa();
        if (!l)
          return;
        n(u);
      } catch {
        if (!l)
          return;
        n(null), xa();
      } finally {
        l && i(!1);
      }
    })(), () => {
      l = !1;
    };
  }, []), de(() => {
    const l = () => {
      $l(), n(null);
    };
    return window.addEventListener(es, l), () => {
      window.removeEventListener(
        es,
        l
      );
    };
  }, []);
  const o = async (l) => {
    try {
      const c = await h0(l);
      n(c);
    } catch (c) {
      throw console.error("Login failed:", c), c;
    }
  }, s = (l) => {
    qf(l), n(l);
  }, a = async () => {
    try {
      await g0();
    } catch (l) {
      console.error("Logout API failed:", l);
    } finally {
      $l(), n(null);
    }
  };
  return /* @__PURE__ */ d.jsx(
    rm.Provider,
    {
      value: {
        user: t,
        isLoading: r,
        isAuthenticated: !!t,
        login: o,
        setAuthenticatedUser: s,
        logout: a
      },
      children: e
    }
  );
}
function Aa() {
  const e = lt(rm);
  if (e === void 0)
    throw new Error("useAuth must be used within an AuthProvider");
  return e;
}
function ka({
  id: e,
  value: t,
  options: n,
  placeholder: r = "Select option",
  searchPlaceholder: i = "Search...",
  emptyMessage: o = "No options found.",
  disabled: s = !1,
  className: a,
  contentClassName: l,
  onValueChange: c
}) {
  const [f, u] = ge(!1), [m, h] = ge(""), p = String(t ?? ""), g = ke(
    () => n.find((k) => k.value === p),
    [p, n]
  ), y = ke(() => {
    const k = m.trim().toLowerCase();
    return k ? n.filter((w) => `${w.label} ${w.keywords ?? ""} ${w.value}`.toLowerCase().includes(k)) : n;
  }, [n, m]), x = (k) => {
    c(k), u(!1), h("");
  };
  return /* @__PURE__ */ d.jsxs(ia, { open: f, onOpenChange: u, children: [
    /* @__PURE__ */ d.jsx(oa, { asChild: !0, children: /* @__PURE__ */ d.jsxs(
      "button",
      {
        id: e,
        type: "button",
        disabled: s,
        className: Q(
          "flex h-10 w-full min-w-0 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          a
        ),
        onClick: (k) => k.stopPropagation(),
        children: [
          /* @__PURE__ */ d.jsx("span", { className: Q("min-w-0 flex-1 truncate text-left", !g && "text-muted-foreground"), children: g?.label ?? r }),
          /* @__PURE__ */ d.jsx(da, { className: "ml-2 size-4 shrink-0 text-muted-foreground" })
        ]
      }
    ) }),
    /* @__PURE__ */ d.jsx(sa, { children: /* @__PURE__ */ d.jsxs(
      aa,
      {
        sideOffset: 4,
        align: "start",
        className: Q(
          "z-50 w-(--radix-popover-trigger-width) min-w-[12rem] max-h-[min(18rem,var(--radix-popover-content-available-height))] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          l
        ),
        onOpenAutoFocus: (k) => k.preventDefault(),
        onPointerDownOutside: () => h(""),
        onEscapeKeyDown: () => h(""),
        onClick: (k) => k.stopPropagation(),
        children: [
          /* @__PURE__ */ d.jsxs("div", { className: "relative mb-2", children: [
            /* @__PURE__ */ d.jsx(Iw, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ d.jsx(
              "input",
              {
                value: m,
                onChange: (k) => h(k.target.value),
                placeholder: i,
                className: Q(
                  "h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm shadow-xs outline-none transition",
                  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                ),
                autoFocus: !0
              }
            )
          ] }),
          /* @__PURE__ */ d.jsx(
            "div",
            {
              className: "max-h-56 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] touch-pan-y",
              style: { WebkitOverflowScrolling: "touch" },
              onWheelCapture: (k) => k.stopPropagation(),
              children: y.length === 0 ? /* @__PURE__ */ d.jsx("div", { className: "px-2 py-1.5 text-sm text-muted-foreground", children: o }) : y.map((k) => {
                const w = k.value === p;
                return /* @__PURE__ */ d.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => x(k.value),
                    disabled: k.disabled,
                    className: Q(
                      "flex w-full min-w-0 cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm outline-none transition",
                      "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                      "disabled:pointer-events-none disabled:opacity-50"
                    ),
                    children: [
                      /* @__PURE__ */ d.jsx("span", { className: "min-w-0 flex-1 truncate", children: k.label }),
                      w ? /* @__PURE__ */ d.jsx(ua, { className: "ml-2 size-4 shrink-0" }) : null
                    ]
                  },
                  k.value
                );
              })
            }
          )
        ]
      }
    ) })
  ] });
}
const b0 = {}, y0 = [
  { value: "employee", label: "Employee" },
  { value: "student", label: "Student" }
];
function BN(e) {
  const { login: t, setAuthenticatedUser: n } = Aa(), r = v.useMemo(
    () => e.accountTypeOptions && e.accountTypeOptions.length > 0 ? e.accountTypeOptions : y0,
    [e.accountTypeOptions]
  ), i = e.accountTypeOverride?.trim() || "", o = !i, s = e.heroEyebrowText?.trim() || "Learning Portal", a = e.heroTitleText?.trim() || "Lớp học", l = e.heroTitleAccentText?.trim() || "Nhà Xuân", c = e.formTitle?.trim() || "Sign in", f = e.formDescription?.trim() || "Welcome back — enter your credentials to continue.", [u, m] = v.useState(""), [h, p] = v.useState(""), [g, y] = v.useState(
    i || r[0]?.value || ""
  ), [x, k] = v.useState(""), [w, j] = v.useState(""), [S, E] = v.useState(""), [O, R] = v.useState(""), [B, C] = v.useState(""), [I, z] = v.useState(!1), [W, P] = v.useState(!1);
  v.useEffect(() => {
    e.authNotice && C(e.authNotice);
  }, [e.authNotice]), v.useEffect(() => {
    y(i || r[0]?.value || ""), E("");
  }, [r, i]), v.useEffect(() => {
    const Y = e.googleClientId || (typeof import.meta < "u" ? b0?.VITE_GOOGLE_CLIENT_ID : void 0) || "";
    if (!Y)
      return;
    const A = document.createElement("script");
    A.src = "https://accounts.google.com/gsi/client", A.async = !0, A.defer = !0, document.head.appendChild(A), A.onload = () => {
      window.google?.accounts?.id && (window.google.accounts.id.initialize({
        client_id: Y,
        callback: G,
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
      ), window.google.accounts.id.prompt((X) => {
        (X.isNotDisplayed() || X.isSkippedMoment()) && console.log("Google prompt status:", X.getNotDisplayedReason());
      }));
    };
  }, [e.googleClientId]);
  const M = (Y) => {
    Y.preventDefault(), Y.stopPropagation(), P(!0);
  }, D = () => {
    P(!1);
  }, F = () => i || g, T = r.find((Y) => Y.value === F())?.label, G = async (Y) => {
    if (N({ includeCredentials: !1 })) {
      z(!0), R(""), C("");
      try {
        const A = await p0(Y.credential, F());
        n(A);
      } catch (A) {
        R(
          A instanceof Error ? A.message : "Google sign-in failed. Please try again."
        );
      } finally {
        z(!1);
      }
    }
  }, b = async (Y) => {
    if (Y.preventDefault(), !!N()) {
      z(!0), R("");
      try {
        await t({
          username: u.trim(),
          password: h,
          account_type: F()
        });
      } catch (A) {
        const X = A instanceof Error ? A.message : "";
        if (X.includes("401") || X.includes("400")) {
          R("Invalid username or password.");
          return;
        }
        R(
          A instanceof Error ? A.message : "Login failed. Please try again."
        );
      } finally {
        z(!1);
      }
    }
  }, N = ({ includeCredentials: Y = !0 } = {}) => {
    let A = !0;
    return o && !g ? (E("Please select an account type."), A = !1) : E(""), Y && (u.trim() ? k("") : (k("Please enter your username."), A = !1), h ? j("") : (j("Password is required."), A = !1)), A;
  };
  return /* @__PURE__ */ d.jsx($f, { ...e, children: /* @__PURE__ */ d.jsxs("div", { className: "relative flex min-h-screen overflow-hidden bg-background", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden", children: [
      /* @__PURE__ */ d.jsx("div", { className: "absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" }),
      /* @__PURE__ */ d.jsx("div", { className: "absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/4 blur-[100px]" }),
      /* @__PURE__ */ d.jsx("div", { className: "absolute left-1/3 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-sky-500/4 blur-[80px] dark:bg-sky-400/4" })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "relative hidden flex-col justify-between overflow-hidden border-r border-border/30 bg-card/20 p-12 backdrop-blur-sm lg:flex lg:w-[42%] xl:w-[38%]", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10", children: [
        /* @__PURE__ */ d.jsx("div", { className: "absolute -left-16 -top-16 h-72 w-72 rounded-full bg-primary/8 blur-3xl" }),
        /* @__PURE__ */ d.jsx("div", { className: "absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/6 blur-3xl" })
      ] }),
      /* @__PURE__ */ d.jsx(ts, {}),
      /* @__PURE__ */ d.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ d.jsx("p", { className: "font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary/80", children: s }),
        /* @__PURE__ */ d.jsxs("p", { className: "text-[2.75rem] font-bold leading-[1.15] tracking-tight text-foreground", children: [
          a,
          /* @__PURE__ */ d.jsx("br", {}),
          /* @__PURE__ */ d.jsx("span", { className: "text-primary", children: l })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "relative flex flex-1 flex-col", children: [
      /* @__PURE__ */ d.jsx("div", { className: "absolute right-4 top-4 z-20 sm:right-6 sm:top-6", children: /* @__PURE__ */ d.jsx(tm, {}) }),
      /* @__PURE__ */ d.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-10", children: [
        /* @__PURE__ */ d.jsx("div", { className: "mb-10 lg:hidden", children: /* @__PURE__ */ d.jsx(ts, {}) }),
        /* @__PURE__ */ d.jsxs("div", { className: "w-full max-w-[360px]", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "mb-8 space-y-1.5", children: [
            /* @__PURE__ */ d.jsxs("h1", { className: "text-3xl font-bold tracking-tight", children: [
              c,
              T ? /* @__PURE__ */ d.jsxs("span", { className: "block text-lg font-medium text-primary", children: [
                "as ",
                T
              ] }) : null
            ] }),
            /* @__PURE__ */ d.jsx("p", { className: "text-sm text-muted-foreground", children: f })
          ] }),
          /* @__PURE__ */ d.jsxs("form", { className: "space-y-5", onSubmit: b, noValidate: !0, children: [
            O && /* @__PURE__ */ d.jsx(rr, { variant: "error", children: O }),
            B && /* @__PURE__ */ d.jsx(rr, { variant: "success", children: B }),
            o && /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ d.jsx(qt, { htmlFor: "account-type", className: "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ d.jsx("span", { children: e.accountTypeLabel || "Account type" }),
                /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ d.jsx(
                ka,
                {
                  id: "account-type",
                  value: g,
                  options: r,
                  placeholder: "Select account type",
                  disabled: I,
                  className: "font-medium",
                  onValueChange: (Y) => {
                    y(Y), S && E("");
                  }
                }
              ),
              S && /* @__PURE__ */ d.jsx("p", { className: "text-sm text-destructive", children: S })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ d.jsx(qt, { htmlFor: "username", className: "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ d.jsx("span", { children: "Username" }),
                /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ d.jsx(
                Vt,
                {
                  "aria-invalid": !!x,
                  id: "username",
                  type: "text",
                  name: "username",
                  placeholder: "username",
                  autoComplete: "username",
                  autoFocus: !0,
                  required: !0,
                  value: u,
                  onChange: (Y) => {
                    m(Y.target.value), x && k("");
                  },
                  disabled: I
                }
              ),
              x && /* @__PURE__ */ d.jsx("p", { className: "text-sm text-destructive", children: x })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ d.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ d.jsx(qt, { htmlFor: "password", className: "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ d.jsx("span", { children: "Password" }),
                  /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                ] }) }),
                /* @__PURE__ */ d.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: M,
                    className: "text-xs font-medium text-primary transition hover:text-primary/75",
                    children: "Forgot password?"
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsx(
                Vt,
                {
                  "aria-invalid": !!w,
                  name: "password",
                  placeholder: "••••••",
                  type: "password",
                  id: "password",
                  autoComplete: "current-password",
                  required: !0,
                  value: h,
                  onChange: (Y) => {
                    p(Y.target.value), w && j("");
                  },
                  disabled: I
                }
              ),
              w && /* @__PURE__ */ d.jsx("p", { className: "text-sm text-destructive", children: w })
            ] }),
            /* @__PURE__ */ d.jsx(
              me,
              {
                type: "submit",
                className: "h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-[0_14px_30px_-14px_color-mix(in_oklab,var(--primary)_65%,transparent)] transition-all hover:scale-[1.01] hover:bg-primary/92 hover:shadow-[0_18px_36px_-16px_color-mix(in_oklab,var(--primary)_72%,transparent)] disabled:scale-100 disabled:bg-primary disabled:shadow-none",
                size: "lg",
                disabled: I,
                children: I ? "Signing in..." : "Sign in with password"
              }
            ),
            e.googleClientId && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
              /* @__PURE__ */ d.jsxs("div", { className: "relative py-1", children: [
                /* @__PURE__ */ d.jsx(Lv, {}),
                /* @__PURE__ */ d.jsx("span", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground", children: "or" })
              ] }),
              /* @__PURE__ */ d.jsx("div", { className: "rounded-2xl border border-dashed border-border/70 bg-muted/35 p-4", children: /* @__PURE__ */ d.jsx("div", { id: "google-btn", className: "flex min-h-10 justify-center" }) })
            ] })
          ] }),
          /* @__PURE__ */ d.jsx("div", { className: "mt-8 space-y-2 text-center", children: /* @__PURE__ */ d.jsx(
            "a",
            {
              href: "https://docs.google.com/document/d/1vueS_dzdvDkBex5BLe_F03GEFLzjtoiFbNi0VJa2_gE/edit?tab=t.0",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex text-xs font-medium text-muted-foreground/70 transition hover:text-muted-foreground",
              children: "Hướng dẫn sử dụng / User Guide"
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(
      _w,
      {
        open: W,
        handleClose: D
      }
    )
  ] }) });
}
function v0({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "card",
      className: Q(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        e
      ),
      ...t
    }
  );
}
function w0({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: Q(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        e
      ),
      ...t
    }
  );
}
function A0({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: Q("leading-none font-semibold", e),
      ...t
    }
  );
}
function k0({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: Q("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function GN({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "card-action",
      className: Q(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        e
      ),
      ...t
    }
  );
}
function E0({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: Q("px-6", e),
      ...t
    }
  );
}
function FN({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: Q("flex items-center px-6 [.border-t]:pt-6", e),
      ...t
    }
  );
}
function LN(e) {
  const [t, n] = v.useState(""), [r, i] = v.useState(""), [o, s] = v.useState(""), [a, l] = v.useState(""), [c, f] = v.useState(""), [u, m] = v.useState(!1);
  v.useEffect(() => {
    const g = new URLSearchParams(window.location.search).get("token") || "";
    n(g);
  }, []);
  const h = async (p) => {
    if (p.preventDefault(), f(""), !t.trim()) {
      f("Reset token is required.");
      return;
    }
    if (!r.trim()) {
      f("Username is required.");
      return;
    }
    if (!o) {
      f("New password is required.");
      return;
    }
    if (!a) {
      f("Please confirm your new password.");
      return;
    }
    if (o !== a) {
      f("Passwords do not match.");
      return;
    }
    m(!0);
    try {
      await x0({
        token: t.trim(),
        username: r.trim(),
        password: o
      }), e.onNavigateToSignIn?.("Password reset successful. You can now sign in."), !e.onNavigateToSignIn && e.signInPath && window.location.assign(e.signInPath);
    } catch (g) {
      f(
        g instanceof Error ? g.message : "Failed to reset password. Please try again."
      );
    } finally {
      m(!1);
    }
  };
  return /* @__PURE__ */ d.jsx($f, { ...e, children: /* @__PURE__ */ d.jsxs("div", { className: "relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8", children: [
    /* @__PURE__ */ d.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_24%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" }),
    /* @__PURE__ */ d.jsx("div", { className: "pointer-events-none absolute bottom-[-8rem] right-[-3rem] -z-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" }),
    /* @__PURE__ */ d.jsx(tm, { className: "fixed right-4 top-4 z-20 sm:right-6 sm:top-6" }),
    /* @__PURE__ */ d.jsx("div", { className: "mx-auto flex w-full max-w-md flex-1 items-center", children: /* @__PURE__ */ d.jsxs(v0, { className: "w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur", children: [
      /* @__PURE__ */ d.jsxs(w0, { className: "gap-5 px-6 pt-6 sm:px-8 sm:pt-8", children: [
        /* @__PURE__ */ d.jsx("div", { className: "flex justify-center sm:justify-start", children: /* @__PURE__ */ d.jsx(ts, {}) }),
        /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ d.jsx(A0, { className: "text-3xl tracking-tight", children: "Reset password" }),
          /* @__PURE__ */ d.jsx(k0, { className: "text-sm leading-6", children: "Set a new password for your account using the reset link you received." })
        ] })
      ] }),
      /* @__PURE__ */ d.jsx(E0, { className: "px-6 pb-6 sm:px-8 sm:pb-8", children: /* @__PURE__ */ d.jsxs(
        "form",
        {
          className: "space-y-4",
          onSubmit: h,
          noValidate: !0,
          children: [
            c && /* @__PURE__ */ d.jsx(rr, { variant: "error", children: c }),
            /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ d.jsx(qt, { htmlFor: "username", children: /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ d.jsx("span", { children: "Username" }),
                /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ d.jsx(
                Vt,
                {
                  id: "username",
                  name: "username",
                  type: "text",
                  autoComplete: "username",
                  required: !0,
                  value: r,
                  onChange: (p) => i(p.target.value),
                  disabled: u
                }
              )
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ d.jsx(qt, { htmlFor: "new-password", children: /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ d.jsx("span", { children: "New password" }),
                /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ d.jsx(
                Vt,
                {
                  id: "new-password",
                  name: "new-password",
                  type: "password",
                  autoComplete: "new-password",
                  required: !0,
                  value: o,
                  onChange: (p) => s(p.target.value),
                  disabled: u
                }
              )
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ d.jsx(qt, { htmlFor: "confirm-password", children: /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ d.jsx("span", { children: "Confirm new password" }),
                /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ d.jsx(
                Vt,
                {
                  id: "confirm-password",
                  name: "confirm-password",
                  type: "password",
                  autoComplete: "new-password",
                  required: !0,
                  value: a,
                  onChange: (p) => l(p.target.value),
                  disabled: u
                }
              )
            ] }),
            /* @__PURE__ */ d.jsx(me, { type: "submit", className: "w-full", disabled: u, children: u ? "Resetting password..." : "Reset password" }),
            /* @__PURE__ */ d.jsx(
              me,
              {
                type: "button",
                className: "w-full",
                variant: "outline",
                onClick: () => {
                  e.onNavigateToSignIn?.(), !e.onNavigateToSignIn && e.signInPath && window.location.assign(e.signInPath);
                },
                disabled: u,
                children: "Back to sign in"
              }
            )
          ]
        }
      ) })
    ] }) })
  ] }) });
}
function C0(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n += 1)
    if (e[n]?.key !== t[n]?.key || e[n]?.value !== t[n]?.value)
      return !1;
  return !0;
}
function j0(e, t) {
  return e ? e.count === t.count && e.saving === t.saving && e.disabled === t.disabled && e.keyLabel === t.keyLabel && e.valueLabel === t.valueLabel && e.onSave === t.onSave && e.onCancel === t.onCancel && C0(e.items, t.items) : !1;
}
const im = nn(
  void 0
);
function YN({ children: e }) {
  const [t, n] = ge(null), [r, i] = ge(
    {}
  ), [o, s] = ge({}), a = Ve(
    (k, w) => {
      const j = k.trim();
      j && (s((S) => {
        const E = w.count;
        if (E <= 0) {
          if (!(j in S))
            return S;
          const O = { ...S };
          return delete O[j], O;
        }
        return S[j] === E ? S : {
          ...S,
          [j]: E
        };
      }), i((S) => {
        const E = S[j];
        return j0(E, w) ? S : {
          ...S,
          [j]: w
        };
      }));
    },
    []
  ), l = Ve((k) => {
    const w = k.trim();
    w && i((j) => {
      if (!(w in j))
        return j;
      const S = { ...j };
      return delete S[w], S;
    });
  }, []), c = ke(() => Object.entries(r).flatMap(
    ([k, w]) => w.items.map((j) => ({
      section: k,
      key: j.key,
      value: j.value
    }))
  ), [r]), f = ke(
    () => Object.values(r).reduce(
      (k, w) => k + w.count,
      0
    ),
    [r]
  ), u = ke(() => {
    const k = Object.entries(r).reduce(
      (w, [j, S]) => (w[j] = S.count, w),
      {}
    );
    return {
      ...o,
      ...k
    };
  }, [o, r]), m = ke(
    () => Object.entries(r).find(([, k]) => k.count > 0)?.[0] ?? null,
    [r]
  ), h = t && r[t] ? t : m, p = h ? r[h] ?? null : null, g = Ve(() => {
    if (p?.onSave)
      return p.onSave();
  }, [p]), y = Ve(() => {
    p?.onCancel?.();
  }, [p]), x = ke(
    () => ({
      globalPendingCount: f,
      globalPendingItems: c,
      sectionPendingCounts: u,
      activeSection: h,
      activeSectionPendingCount: p?.count ?? 0,
      activeSectionSaving: p?.saving ?? !1,
      activeSectionDisabled: p?.disabled ?? !1,
      activeSectionKeyLabel: p?.keyLabel ?? "Name",
      activeSectionValueLabel: p?.valueLabel ?? "Changed",
      setActiveSection: n,
      registerSection: a,
      unregisterSection: l,
      handleSaveActiveSection: g,
      handleCancelActiveSection: y
    }),
    [
      h,
      p,
      f,
      c,
      u,
      y,
      g,
      a,
      l
    ]
  );
  return /* @__PURE__ */ d.jsx(im.Provider, { value: x, children: e });
}
function HN() {
  const e = lt(im);
  if (!e)
    throw new Error("usePendingChanges must be used within a PendingChangesProvider");
  return e;
}
function QN(e) {
  const { mode: t, systemMode: n, setMode: r } = _f(), { className: i, ...o } = e, a = (n || t) === "light" ? /* @__PURE__ */ d.jsx(mi, { className: "size-4" }) : /* @__PURE__ */ d.jsx(fi, { className: "size-4" });
  return /* @__PURE__ */ d.jsxs(ba, { children: [
    /* @__PURE__ */ d.jsx(ya, { asChild: !0, children: /* @__PURE__ */ d.jsx(
      me,
      {
        "data-screenshot": "toggle-mode",
        variant: "ghost",
        size: "icon",
        className: Q("rounded-full", i),
        "aria-label": "Toggle color mode",
        ...o,
        children: a
      }
    ) }),
    /* @__PURE__ */ d.jsxs(va, { align: "end", className: "w-44", children: [
      /* @__PURE__ */ d.jsx(n0, { children: "Appearance" }),
      /* @__PURE__ */ d.jsx(r0, {}),
      /* @__PURE__ */ d.jsxs(
        em,
        {
          value: t,
          onValueChange: (l) => r(l),
          children: [
            /* @__PURE__ */ d.jsxs(yn, { value: "system", children: [
              /* @__PURE__ */ d.jsx($o, { className: "mr-2 size-4" }),
              "System"
            ] }),
            /* @__PURE__ */ d.jsxs(yn, { value: "light", children: [
              /* @__PURE__ */ d.jsx(mi, { className: "mr-2 size-4" }),
              "Light"
            ] }),
            /* @__PURE__ */ d.jsxs(yn, { value: "dark", children: [
              /* @__PURE__ */ d.jsx(fi, { className: "mr-2 size-4" }),
              "Dark"
            ] })
          ]
        }
      )
    ] })
  ] });
}
function UN() {
  return /* @__PURE__ */ d.jsx("div", { className: "flex min-h-[240px] w-full items-center justify-center", children: /* @__PURE__ */ d.jsx(fa, { className: "size-7 animate-spin text-muted-foreground" }) });
}
function go(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.trim().length > 0
  ) : typeof e == "string" ? e.split(/\s+/).map((t) => t.trim()).filter(Boolean) : [];
}
function om(e) {
  return !!e && typeof e == "object";
}
function Ea(e) {
  if (om(e)) {
    const t = go(e.roles);
    return t.length > 0 ? t : go(e.scope);
  }
  return go(e);
}
function ZN(e, t) {
  return Ea(e).includes(t);
}
function M0(e, t) {
  const n = Ea(e);
  return t.some((r) => n.includes(r));
}
function WN(e) {
  return !om(e) || e.account_type !== "employee" ? !1 : M0(e, [
    "classes_get",
    "sessions_get",
    "schedules_get",
    "tests_get",
    "classes_feedbacks_get"
  ]);
}
const S0 = ["payrolls_get", "tasks_get", "projects_get"];
function JN({
  value: e,
  onValueChange: t,
  additionalOptions: n,
  placeholder: r = "Select scopes"
}) {
  const i = ke(() => Ea(e), [e]), o = ke(() => new Set(i), [i]), s = ke(() => {
    const l = [...S0, ...n ?? [], ...i];
    return Array.from(new Set(l.filter(Boolean)));
  }, [n, i]), a = i.length > 0 ? i.join(" ") : r;
  return /* @__PURE__ */ d.jsx("div", { className: "w-full min-w-0", children: /* @__PURE__ */ d.jsxs(ba, { children: [
    /* @__PURE__ */ d.jsx(ya, { asChild: !0, children: /* @__PURE__ */ d.jsxs(
      "button",
      {
        type: "button",
        className: "grid h-10 w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-hidden rounded-md border border-input bg-background px-3 text-sm font-normal",
        children: [
          /* @__PURE__ */ d.jsx("span", { className: "block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left", children: a }),
          /* @__PURE__ */ d.jsx(da, { className: "size-4 shrink-0 opacity-60" })
        ]
      }
    ) }),
    /* @__PURE__ */ d.jsx(
      va,
      {
        align: "start",
        className: "w-[--radix-dropdown-menu-trigger-width] min-w-[260px] p-1",
        children: /* @__PURE__ */ d.jsx("div", { className: "max-h-64 overflow-auto", children: s.map((l) => {
          const c = o.has(l);
          return /* @__PURE__ */ d.jsxs(
            "button",
            {
              type: "button",
              className: "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted",
              onClick: () => {
                const f = c ? i.filter((u) => u !== l) : [...i, l];
                t(f.join(" "));
              },
              children: [
                /* @__PURE__ */ d.jsx("span", { children: l }),
                /* @__PURE__ */ d.jsx("span", { className: "ml-2 inline-flex size-4 items-center justify-center", children: c ? /* @__PURE__ */ d.jsx(ua, { className: "size-4" }) : null })
              ]
            },
            l
          );
        }) })
      }
    )
  ] }) });
}
function N0({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: Q(
        "flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
        e
      ),
      ...t
    }
  );
}
function Yi({ className: e, containerClassName: t, ...n }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: Q("relative w-full overflow-x-auto", t),
      children: /* @__PURE__ */ d.jsx(
        "table",
        {
          "data-slot": "table",
          className: Q("w-full caption-bottom text-sm", e),
          ...n
        }
      )
    }
  );
}
function sm({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: Q("[&_tr]:border-b", e),
      ...t
    }
  );
}
function Hi({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: Q("[&_tr:last-child]:border-0", e),
      ...t
    }
  );
}
function VN({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: Q(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        e
      ),
      ...t
    }
  );
}
function Jt({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: Q(
        "border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted",
        e
      ),
      ...t
    }
  );
}
function am({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: Q(
        "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        e
      ),
      ...t
    }
  );
}
function Dt({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: Q("p-4 align-middle", e),
      ...t
    }
  );
}
function qN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    "caption",
    {
      "data-slot": "table-caption",
      className: Q("mt-4 text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function I0({ label: e, required: t = !1, helperText: n, children: r, className: i, align: o = "center" }) {
  return /* @__PURE__ */ d.jsxs(Jt, { className: Q("hover:bg-transparent", i), children: [
    /* @__PURE__ */ d.jsx(
      Dt,
      {
        className: Q(
          "w-[220px] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
          o === "center" ? "align-middle" : "align-top"
        ),
        children: /* @__PURE__ */ d.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ d.jsx("span", { children: e }),
            t && /* @__PURE__ */ d.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
          ] }),
          n && /* @__PURE__ */ d.jsx("p", { className: "text-xs normal-case leading-5 text-muted-foreground", children: n })
        ] })
      }
    ),
    /* @__PURE__ */ d.jsx(Dt, { className: Q("min-w-0 px-4 py-3 text-sm", o === "center" ? "align-middle" : "align-top"), children: r })
  ] });
}
function D0({
  open: e,
  saving: t = !1,
  title: n,
  description: r,
  error: i,
  submitLabel: o = "Create",
  submitDisabled: s = !1,
  onClose: a,
  onSubmit: l,
  children: c
}) {
  return /* @__PURE__ */ d.jsx(ma, { open: e, onOpenChange: (f) => !f && !t && a(), children: /* @__PURE__ */ d.jsxs(
    ha,
    {
      showCloseButton: !t,
      className: "!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[80vw] max-h-[92vh] !max-w-none flex flex-col overflow-hidden border-0 bg-card p-0 shadow-none",
      children: [
        /* @__PURE__ */ d.jsxs(pa, { className: "border-b border-border/60 px-6 py-4 text-left", children: [
          /* @__PURE__ */ d.jsx(ga, { children: n }),
          r && /* @__PURE__ */ d.jsx(Jf, { children: r })
        ] }),
        /* @__PURE__ */ d.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-6 py-5", children: /* @__PURE__ */ d.jsxs("div", { className: "flex min-h-full flex-col justify-center gap-4", children: [
          i && /* @__PURE__ */ d.jsx(rr, { variant: "error", children: i }),
          /* @__PURE__ */ d.jsx("div", { className: "overflow-hidden rounded-2xl bg-transparent", children: /* @__PURE__ */ d.jsx(Yi, { className: "table-fixed", containerClassName: "overflow-x-hidden", children: /* @__PURE__ */ d.jsx(Hi, { className: "[&_tr]:border-b-0", children: c }) }) })
        ] }) }),
        /* @__PURE__ */ d.jsxs(Wf, { className: "border-t border-border/60 px-6 py-4", showCloseButton: !1, children: [
          /* @__PURE__ */ d.jsx(me, { type: "button", variant: "outline", onClick: a, disabled: t, children: "Cancel" }),
          /* @__PURE__ */ d.jsx(me, { type: "button", onClick: () => {
            l();
          }, disabled: t || s, children: o })
        ] })
      ]
    }
  ) });
}
function R0(e, t) {
  return e === "boolean" ? t === !0 : t == null ? "" : String(t);
}
function P0(e) {
  return e.includes(`
`) || e.length > 80;
}
function O0(e, t) {
  const n = e.split(`
`).length, r = Math.ceil(e.length / 90);
  return Math.min(12, Math.max(t ?? 3, n, r));
}
function T0(e) {
  return e === "number" ? "number" : e === "date" ? "date" : "text";
}
function XN({
  open: e,
  title: t,
  fields: n,
  initialValues: r,
  error: i,
  saving: o = !1,
  onClose: s,
  onSubmit: a
}) {
  const [l, c] = ge([]);
  de(() => {
    e && c(n.map((m) => {
      const h = R0(m.type, r[m.key]);
      return {
        ...m,
        value: h,
        initialValue: h
      };
    }));
  }, [n, r, e]);
  const f = (m, h) => {
    c((p) => p.map((g) => g.key === m ? { ...g, value: h } : g));
  }, u = async () => {
    const m = l.reduce((h, p) => {
      if (p.value === p.initialValue || p.readOnly)
        return h;
      if (p.type === "boolean")
        return h[p.key] = !!p.value, h;
      const g = typeof p.value == "string" ? p.value.trim() : "";
      return g ? p.type === "number" ? (h[p.key] = Number(g), h) : (h[p.key] = g, h) : (h[p.key] = null, h);
    }, {});
    await a(m);
  };
  return /* @__PURE__ */ d.jsx(
    D0,
    {
      open: e,
      saving: o,
      title: t,
      description: "Only modified fields will be included in the update request.",
      error: i,
      submitLabel: "Save",
      onClose: s,
      onSubmit: u,
      children: l.map((m) => {
        const h = typeof m.value == "string" ? m.value : "", p = m.type === "text" && (m.multiline || P0(h));
        return /* @__PURE__ */ d.jsx(
          I0,
          {
            label: m.label,
            helperText: m.helperText,
            align: p ? "start" : "center",
            children: m.type === "boolean" ? /* @__PURE__ */ d.jsxs("label", { className: "inline-flex items-center gap-3 text-sm", children: [
              /* @__PURE__ */ d.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!m.value,
                  disabled: m.readOnly,
                  onChange: (g) => f(m.key, g.target.checked),
                  className: "size-4 rounded border-input accent-primary"
                }
              ),
              /* @__PURE__ */ d.jsx("span", { children: m.value ? "Enabled" : "Disabled" })
            ] }) : m.type === "select" ? /* @__PURE__ */ d.jsx(
              ka,
              {
                value: h,
                onValueChange: (g) => f(m.key, g),
                disabled: m.readOnly,
                options: [
                  { value: "", label: `-- ${m.label} --` },
                  ...(m.options ?? []).map((g) => ({ value: g.value, label: g.label }))
                ],
                placeholder: `-- ${m.label} --`,
                searchPlaceholder: `Search ${m.label.toLowerCase()}...`
              }
            ) : p ? /* @__PURE__ */ d.jsx(
              N0,
              {
                value: h,
                onChange: (g) => f(m.key, g.target.value),
                readOnly: m.readOnly,
                disabled: m.readOnly,
                rows: O0(h, m.minRows),
                placeholder: m.label,
                className: "resize-y"
              }
            ) : /* @__PURE__ */ d.jsx(
              Vt,
              {
                value: h,
                type: T0(m.type),
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
var Ca = Mr(), re = (e) => jr(e, Ca), ja = Mr();
re.write = (e) => jr(e, ja);
var Qi = Mr();
re.onStart = (e) => jr(e, Qi);
var Ma = Mr();
re.onFrame = (e) => jr(e, Ma);
var Sa = Mr();
re.onFinish = (e) => jr(e, Sa);
var vn = [];
re.setTimeout = (e, t) => {
  const n = re.now() + t, r = () => {
    const o = vn.findIndex((s) => s.cancel == r);
    ~o && vn.splice(o, 1), Nt -= ~o ? 1 : 0;
  }, i = { time: n, handler: e, cancel: r };
  return vn.splice(lm(n), 0, i), Nt += 1, cm(), i;
};
var lm = (e) => ~(~vn.findIndex((t) => t.time > e) || ~vn.length);
re.cancel = (e) => {
  Qi.delete(e), Ma.delete(e), Sa.delete(e), Ca.delete(e), ja.delete(e);
};
re.sync = (e) => {
  ns = !0, re.batchedUpdates(e), ns = !1;
};
re.throttle = (e) => {
  let t;
  function n() {
    try {
      e(...t);
    } finally {
      t = null;
    }
  }
  function r(...i) {
    t = i, re.onStart(n);
  }
  return r.handler = e, r.cancel = () => {
    Qi.delete(n), t = null;
  }, r;
};
var Na = typeof window < "u" ? window.requestAnimationFrame : (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (() => {
  })
);
re.use = (e) => Na = e;
re.now = typeof performance < "u" ? () => performance.now() : Date.now;
re.batchedUpdates = (e) => e();
re.catch = console.error;
re.frameLoop = "always";
re.advance = () => {
  re.frameLoop !== "demand" ? console.warn(
    "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
  ) : dm();
};
var St = -1, Nt = 0, ns = !1;
function jr(e, t) {
  ns ? (t.delete(e), e(0)) : (t.add(e), cm());
}
function cm() {
  St < 0 && (St = 0, re.frameLoop !== "demand" && Na(um));
}
function z0() {
  St = -1;
}
function um() {
  ~St && (Na(um), re.batchedUpdates(dm));
}
function dm() {
  const e = St;
  St = re.now();
  const t = lm(St);
  if (t && (fm(vn.splice(0, t), (n) => n.handler()), Nt -= t), !Nt) {
    z0();
    return;
  }
  Qi.flush(), Ca.flush(e ? Math.min(64, St - e) : 16.667), Ma.flush(), ja.flush(), Sa.flush();
}
function Mr() {
  let e = /* @__PURE__ */ new Set(), t = e;
  return {
    add(n) {
      Nt += t == e && !e.has(n) ? 1 : 0, e.add(n);
    },
    delete(n) {
      return Nt -= t == e && e.has(n) ? 1 : 0, e.delete(n);
    },
    flush(n) {
      t.size && (e = /* @__PURE__ */ new Set(), Nt -= t.size, fm(t, (r) => r(n) && e.add(r)), Nt += e.size, t = e);
    }
  };
}
function fm(e, t) {
  e.forEach((n) => {
    try {
      t(n);
    } catch (r) {
      re.catch(r);
    }
  });
}
var B0 = Object.defineProperty, G0 = (e, t) => {
  for (var n in t)
    B0(e, n, { get: t[n], enumerable: !0 });
}, $e = {};
G0($e, {
  assign: () => L0,
  colors: () => Rt,
  createStringInterpolator: () => Da,
  skipAnimation: () => hm,
  to: () => mm,
  willAdvance: () => Ra
});
function rs() {
}
var F0 = (e, t, n) => Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 }), Z = {
  arr: Array.isArray,
  obj: (e) => !!e && e.constructor.name === "Object",
  fun: (e) => typeof e == "function",
  str: (e) => typeof e == "string",
  num: (e) => typeof e == "number",
  und: (e) => e === void 0
};
function gt(e, t) {
  if (Z.arr(e)) {
    if (!Z.arr(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++)
      if (e[n] !== t[n]) return !1;
    return !0;
  }
  return e === t;
}
var ce = (e, t) => e.forEach(t);
function at(e, t, n) {
  if (Z.arr(e)) {
    for (let r = 0; r < e.length; r++)
      t.call(n, e[r], `${r}`);
    return;
  }
  for (const r in e)
    e.hasOwnProperty(r) && t.call(n, e[r], r);
}
var Ge = (e) => Z.und(e) ? [] : Z.arr(e) ? e : [e];
function Wn(e, t) {
  if (e.size) {
    const n = Array.from(e);
    e.clear(), ce(n, t);
  }
}
var Zn = (e, ...t) => Wn(e, (n) => n(...t)), Ia = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent), Da, mm, Rt = null, hm = !1, Ra = rs, L0 = (e) => {
  e.to && (mm = e.to), e.now && (re.now = e.now), e.colors !== void 0 && (Rt = e.colors), e.skipAnimation != null && (hm = e.skipAnimation), e.createStringInterpolator && (Da = e.createStringInterpolator), e.requestAnimationFrame && re.use(e.requestAnimationFrame), e.batchedUpdates && (re.batchedUpdates = e.batchedUpdates), e.willAdvance && (Ra = e.willAdvance), e.frameLoop && (re.frameLoop = e.frameLoop);
}, Jn = /* @__PURE__ */ new Set(), Qe = [], xo = [], pi = 0, Ui = {
  get idle() {
    return !Jn.size && !Qe.length;
  },
  /** Advance the given animation on every frame until idle. */
  start(e) {
    pi > e.priority ? (Jn.add(e), re.onStart(Y0)) : (pm(e), re(is));
  },
  /** Advance all animations by the given time. */
  advance: is,
  /** Call this when an animation's priority changes. */
  sort(e) {
    if (pi)
      re.onFrame(() => Ui.sort(e));
    else {
      const t = Qe.indexOf(e);
      ~t && (Qe.splice(t, 1), gm(e));
    }
  },
  /**
   * Clear all animations. For testing purposes.
   *
   * ☠️ Never call this from within the frameloop.
   */
  clear() {
    Qe = [], Jn.clear();
  }
};
function Y0() {
  Jn.forEach(pm), Jn.clear(), re(is);
}
function pm(e) {
  Qe.includes(e) || gm(e);
}
function gm(e) {
  Qe.splice(
    H0(Qe, (t) => t.priority > e.priority),
    0,
    e
  );
}
function is(e) {
  const t = xo;
  for (let n = 0; n < Qe.length; n++) {
    const r = Qe[n];
    pi = r.priority, r.idle || (Ra(r), r.advance(e), r.idle || t.push(r));
  }
  return pi = 0, xo = Qe, xo.length = 0, Qe = t, Qe.length > 0;
}
function H0(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
var Q0 = {
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
}, qe = "[-+]?\\d*\\.?\\d+", gi = qe + "%";
function Zi(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
var U0 = new RegExp("rgb" + Zi(qe, qe, qe)), Z0 = new RegExp("rgba" + Zi(qe, qe, qe, qe)), W0 = new RegExp("hsl" + Zi(qe, gi, gi)), J0 = new RegExp(
  "hsla" + Zi(qe, gi, gi, qe)
), V0 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, q0 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, X0 = /^#([0-9a-fA-F]{6})$/, K0 = /^#([0-9a-fA-F]{8})$/;
function _0(e) {
  let t;
  return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = X0.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Rt && Rt[e] !== void 0 ? Rt[e] : (t = U0.exec(e)) ? (mn(t[1]) << 24 | // r
  mn(t[2]) << 16 | // g
  mn(t[3]) << 8 | // b
  255) >>> // a
  0 : (t = Z0.exec(e)) ? (mn(t[1]) << 24 | // r
  mn(t[2]) << 16 | // g
  mn(t[3]) << 8 | // b
  nc(t[4])) >>> // a
  0 : (t = V0.exec(e)) ? parseInt(
    t[1] + t[1] + // r
    t[2] + t[2] + // g
    t[3] + t[3] + // b
    "ff",
    // a
    16
  ) >>> 0 : (t = K0.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = q0.exec(e)) ? parseInt(
    t[1] + t[1] + // r
    t[2] + t[2] + // g
    t[3] + t[3] + // b
    t[4] + t[4],
    // a
    16
  ) >>> 0 : (t = W0.exec(e)) ? (ec(
    tc(t[1]),
    // h
    Zr(t[2]),
    // s
    Zr(t[3])
    // l
  ) | 255) >>> // a
  0 : (t = J0.exec(e)) ? (ec(
    tc(t[1]),
    // h
    Zr(t[2]),
    // s
    Zr(t[3])
    // l
  ) | nc(t[4])) >>> // a
  0 : null;
}
function bo(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function ec(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r, o = bo(i, r, e + 1 / 3), s = bo(i, r, e), a = bo(i, r, e - 1 / 3);
  return Math.round(o * 255) << 24 | Math.round(s * 255) << 16 | Math.round(a * 255) << 8;
}
function mn(e) {
  const t = parseInt(e, 10);
  return t < 0 ? 0 : t > 255 ? 255 : t;
}
function tc(e) {
  return (parseFloat(e) % 360 + 360) % 360 / 360;
}
function nc(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function Zr(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function rc(e) {
  let t = _0(e);
  if (t === null) return e;
  t = t || 0;
  const n = (t & 4278190080) >>> 24, r = (t & 16711680) >>> 16, i = (t & 65280) >>> 8, o = (t & 255) / 255;
  return `rgba(${n}, ${r}, ${i}, ${o})`;
}
var or = (e, t, n) => {
  if (Z.fun(e))
    return e;
  if (Z.arr(e))
    return or({
      range: e,
      output: t,
      extrapolate: n
    });
  if (Z.str(e.output[0]))
    return Da(e);
  const r = e, i = r.output, o = r.range || [0, 1], s = r.extrapolateLeft || r.extrapolate || "extend", a = r.extrapolateRight || r.extrapolate || "extend", l = r.easing || ((c) => c);
  return (c) => {
    const f = eA(c, o);
    return $0(
      c,
      o[f],
      o[f + 1],
      i[f],
      i[f + 1],
      l,
      s,
      a,
      r.map
    );
  };
};
function $0(e, t, n, r, i, o, s, a, l) {
  let c = l ? l(e) : e;
  if (c < t) {
    if (s === "identity") return c;
    s === "clamp" && (c = t);
  }
  if (c > n) {
    if (a === "identity") return c;
    a === "clamp" && (c = n);
  }
  return r === i ? r : t === n ? e <= t ? r : i : (t === -1 / 0 ? c = -c : n === 1 / 0 ? c = c - t : c = (c - t) / (n - t), c = o(c), r === -1 / 0 ? c = -c : i === 1 / 0 ? c = c + r : c = c * (i - r) + r, c);
}
function eA(e, t) {
  for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n)
    ;
  return n - 1;
}
var tA = {
  linear: (e) => e
}, sr = /* @__PURE__ */ Symbol.for("FluidValue.get"), En = /* @__PURE__ */ Symbol.for("FluidValue.observers"), Ye = (e) => !!(e && e[sr]), Pe = (e) => e && e[sr] ? e[sr]() : e, ic = (e) => e[En] || null;
function nA(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function ar(e, t) {
  const n = e[En];
  n && n.forEach((r) => {
    nA(r, t);
  });
}
var xm = class {
  constructor(e) {
    if (!e && !(e = this.get))
      throw Error("Unknown getter");
    rA(this, e);
  }
}, rA = (e, t) => bm(e, sr, t);
function Sn(e, t) {
  if (e[sr]) {
    let n = e[En];
    n || bm(e, En, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function lr(e, t) {
  const n = e[En];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : e[En] = null, e.observerRemoved && e.observerRemoved(r, t);
  }
}
var bm = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), ei = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, iA = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, oc = new RegExp(`(${ei.source})(%|[a-z]+)`, "i"), oA = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, Wi = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, ym = (e) => {
  const [t, n] = sA(e);
  if (!t || Ia())
    return e;
  const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
  if (r)
    return r.trim();
  if (n && n.startsWith("--")) {
    const i = window.getComputedStyle(document.documentElement).getPropertyValue(n);
    return i || e;
  } else {
    if (n && Wi.test(n))
      return ym(n);
    if (n)
      return n;
  }
  return e;
}, sA = (e) => {
  const t = Wi.exec(e);
  if (!t) return [,];
  const [, n, r] = t;
  return [n, r];
}, yo, aA = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`, vm = (e) => {
  yo || (yo = Rt ? (
    // match color names, ignore partial matches
    new RegExp(`(${Object.keys(Rt).join("|")})(?!\\w)`, "g")
  ) : (
    // never match
    /^\b$/
  ));
  const t = e.output.map((o) => Pe(o).replace(Wi, ym).replace(iA, rc).replace(yo, rc)), n = t.map((o) => o.match(ei).map(Number)), i = n[0].map(
    (o, s) => n.map((a) => {
      if (!(s in a))
        throw Error('The arity of each "output" value must be equal');
      return a[s];
    })
  ).map(
    (o) => or({ ...e, output: o })
  );
  return (o) => {
    const s = !oc.test(t[0]) && t.find((l) => oc.test(l))?.replace(ei, "");
    let a = 0;
    return t[0].replace(
      ei,
      () => `${i[a++](o)}${s || ""}`
    ).replace(oA, aA);
  };
}, Pa = "react-spring: ", wm = (e) => {
  const t = e;
  let n = !1;
  if (typeof t != "function")
    throw new TypeError(`${Pa}once requires a function parameter`);
  return (...r) => {
    n || (t(...r), n = !0);
  };
}, lA = wm(console.warn);
function cA() {
  lA(
    `${Pa}The "interpolate" function is deprecated in v9 (use "to" instead)`
  );
}
var uA = wm(console.warn);
function dA() {
  uA(
    `${Pa}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`
  );
}
function Ji(e) {
  return Z.str(e) && (e[0] == "#" || /\d/.test(e) || // Do not identify a CSS variable as an AnimatedString if its SSR
  !Ia() && Wi.test(e) || e in (Rt || {}));
}
var Oa = Ia() ? de : $n, fA = () => {
  const e = pe(!1);
  return Oa(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
};
function Am() {
  const e = ge()[1], t = fA();
  return () => {
    t.current && e(Math.random());
  };
}
var km = (e) => de(e, mA), mA = [];
function sc(e) {
  const t = pe(void 0);
  return de(() => {
    t.current = e;
  }), t.current;
}
var cr = /* @__PURE__ */ Symbol.for("Animated:node"), hA = (e) => !!e && e[cr] === e, nt = (e) => e && e[cr], Ta = (e, t) => F0(e, cr, t), Vi = (e) => e && e[cr] && e[cr].getPayload(), Em = class {
  constructor() {
    Ta(this, this);
  }
  /** Get every `AnimatedValue` used by this node. */
  getPayload() {
    return this.payload || [];
  }
}, qi = class Cm extends Em {
  constructor(t) {
    super(), this._value = t, this.done = !0, this.durationProgress = 0, Z.num(this._value) && (this.lastPosition = this._value);
  }
  /** @internal */
  static create(t) {
    return new Cm(t);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(t, n) {
    return Z.num(t) && (this.lastPosition = t, n && (t = Math.round(t / n) * n, this.done && (this.lastPosition = t))), this._value === t ? !1 : (this._value = t, !0);
  }
  reset() {
    const { done: t } = this;
    this.done = !1, Z.num(this._value) && (this.elapsedTime = 0, this.durationProgress = 0, this.lastPosition = this._value, t && (this.lastVelocity = null), this.v0 = null);
  }
}, xi = class jm extends qi {
  constructor(t) {
    super(0), this._string = null, this._toString = or({
      output: [t, t]
    });
  }
  /** @internal */
  static create(t) {
    return new jm(t);
  }
  getValue() {
    const t = this._string;
    return t ?? (this._string = this._toString(this._value));
  }
  setValue(t) {
    if (Z.str(t)) {
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
    t && (this._toString = or({
      output: [this.getValue(), t]
    })), this._value = 0, super.reset();
  }
}, bi = { dependencies: null }, Xi = class extends Em {
  constructor(e) {
    super(), this.source = e, this.setValue(e);
  }
  getValue(e) {
    const t = {};
    return at(this.source, (n, r) => {
      hA(n) ? t[r] = n.getValue(e) : Ye(n) ? t[r] = Pe(n) : e || (t[r] = n);
    }), t;
  }
  /** Replace the raw object data */
  setValue(e) {
    this.source = e, this.payload = this._makePayload(e);
  }
  reset() {
    this.payload && ce(this.payload, (e) => e.reset());
  }
  /** Create a payload set. */
  _makePayload(e) {
    if (e) {
      const t = /* @__PURE__ */ new Set();
      return at(e, this._addToPayload, t), Array.from(t);
    }
  }
  /** Add to a payload set. */
  _addToPayload(e) {
    bi.dependencies && Ye(e) && bi.dependencies.add(e);
    const t = Vi(e);
    t && ce(t, (n) => this.add(n));
  }
}, pA = class Mm extends Xi {
  constructor(t) {
    super(t);
  }
  /** @internal */
  static create(t) {
    return new Mm(t);
  }
  getValue() {
    return this.source.map((t) => t.getValue());
  }
  setValue(t) {
    const n = this.getPayload();
    return t.length == n.length ? n.map((r, i) => r.setValue(t[i])).some(Boolean) : (super.setValue(t.map(gA)), !0);
  }
};
function gA(e) {
  return (Ji(e) ? xi : qi).create(e);
}
function os(e) {
  const t = nt(e);
  return t ? t.constructor : Z.arr(e) ? pA : Ji(e) ? xi : qi;
}
var ac = (e, t) => {
  const n = (
    // Function components must use "forwardRef" to avoid being
    // re-rendered on every animation frame.
    !Z.fun(e) || e.prototype && e.prototype.isReactComponent
  );
  return Ci((r, i) => {
    const o = pe(null), s = n && // eslint-disable-next-line react-hooks/rules-of-hooks
    Ve(
      (p) => {
        o.current = yA(i, p);
      },
      [i]
    ), [a, l] = bA(r, t), c = Am(), f = () => {
      const p = o.current;
      if (n && !p)
        return;
      (p ? t.applyAnimatedValues(p, a.getValue(!0)) : !1) === !1 && c();
    }, u = new xA(f, l), m = pe(void 0);
    Oa(() => (m.current = u, ce(l, (p) => Sn(p, u)), () => {
      m.current && (ce(
        m.current.deps,
        (p) => lr(p, m.current)
      ), re.cancel(m.current.update));
    })), de(f, []), km(() => () => {
      const p = m.current;
      ce(p.deps, (g) => lr(g, p));
    });
    const h = t.getComponentProps(a.getValue());
    return /* @__PURE__ */ v.createElement(e, { ...h, ref: s });
  });
}, xA = class {
  constructor(e, t) {
    this.update = e, this.deps = t;
  }
  eventObserved(e) {
    e.type == "change" && re.write(this.update);
  }
};
function bA(e, t) {
  const n = /* @__PURE__ */ new Set();
  return bi.dependencies = n, e.style && (e = {
    ...e,
    style: t.createAnimatedStyle(e.style)
  }), e = new Xi(e), bi.dependencies = null, [e, n];
}
function yA(e, t) {
  return e && (Z.fun(e) ? e(t) : e.current = t), t;
}
var lc = /* @__PURE__ */ Symbol.for("AnimatedComponent"), vA = (e, {
  applyAnimatedValues: t = () => !1,
  createAnimatedStyle: n = (i) => new Xi(i),
  getComponentProps: r = (i) => i
} = {}) => {
  const i = {
    applyAnimatedValues: t,
    createAnimatedStyle: n,
    getComponentProps: r
  }, o = (s) => {
    const a = cc(s) || "Anonymous";
    return Z.str(s) ? s = o[s] || (o[s] = ac(s, i)) : s = s[lc] || (s[lc] = ac(s, i)), s.displayName = `Animated(${a})`, s;
  };
  return at(e, (s, a) => {
    Z.arr(e) && (a = cc(s)), o[a] = o(s);
  }), {
    animated: o
  };
}, cc = (e) => Z.str(e) ? e : e && Z.str(e.displayName) ? e.displayName : Z.fun(e) && e.name || null;
function Wt(e, ...t) {
  return Z.fun(e) ? e(...t) : e;
}
var Vn = (e, t) => e === !0 || !!(t && e && (Z.fun(e) ? e(t) : Ge(e).includes(t))), Sm = (e, t) => Z.obj(e) ? t && e[t] : e, Nm = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, wA = (e) => e, za = (e, t = wA) => {
  let n = AA;
  e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
  const r = {};
  for (const i of n) {
    const o = t(e[i], i);
    Z.und(o) || (r[i] = o);
  }
  return r;
}, AA = [
  "config",
  "onProps",
  "onStart",
  "onChange",
  "onPause",
  "onResume",
  "onRest"
], kA = {
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
function EA(e) {
  const t = {};
  let n = 0;
  if (at(e, (r, i) => {
    kA[i] || (t[i] = r, n++);
  }), n)
    return t;
}
function Im(e) {
  const t = EA(e);
  if (t) {
    const n = { to: t };
    return at(e, (r, i) => i in t || (n[i] = r)), n;
  }
  return { ...e };
}
function ur(e) {
  return e = Pe(e), Z.arr(e) ? e.map(ur) : Ji(e) ? $e.createStringInterpolator({
    range: [0, 1],
    output: [e, e]
  })(1) : e;
}
function CA(e) {
  for (const t in e) return !0;
  return !1;
}
function ss(e) {
  return Z.fun(e) || Z.arr(e) && Z.obj(e[0]);
}
function jA(e, t) {
  e.ref?.delete(e), t?.delete(e);
}
function MA(e, t) {
  t && e.ref !== t && (e.ref?.delete(e), t.add(e), e.ref = t);
}
var SA = {
  default: { tension: 170, friction: 26 }
}, as = {
  ...SA.default,
  mass: 1,
  damping: 1,
  easing: tA.linear,
  clamp: !1
}, NA = class {
  constructor() {
    this.velocity = 0, Object.assign(this, as);
  }
};
function IA(e, t, n) {
  n && (n = { ...n }, uc(n, t), t = { ...n, ...t }), uc(e, t), Object.assign(e, t);
  for (const s in as)
    e[s] == null && (e[s] = as[s]);
  let { frequency: r, damping: i } = e;
  const { mass: o } = e;
  return Z.und(r) || (r < 0.01 && (r = 0.01), i < 0 && (i = 0), e.tension = Math.pow(2 * Math.PI / r, 2) * o, e.friction = 4 * Math.PI * i * o / r), e;
}
function uc(e, t) {
  if (!Z.und(t.decay))
    e.duration = void 0;
  else {
    const n = !Z.und(t.tension) || !Z.und(t.friction);
    (n || !Z.und(t.frequency) || !Z.und(t.damping) || !Z.und(t.mass)) && (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0);
  }
}
var dc = [], DA = class {
  constructor() {
    this.changed = !1, this.values = dc, this.toValues = null, this.fromValues = dc, this.config = new NA(), this.immediate = !1;
  }
};
function Dm(e, { key: t, props: n, defaultProps: r, state: i, actions: o }) {
  return new Promise((s, a) => {
    let l, c, f = Vn(n.cancel ?? r?.cancel, t);
    if (f)
      h();
    else {
      Z.und(n.pause) || (i.paused = Vn(n.pause, t));
      let p = r?.pause;
      p !== !0 && (p = i.paused || Vn(p, t)), l = Wt(n.delay || 0, t), p ? (i.resumeQueue.add(m), o.pause()) : (o.resume(), m());
    }
    function u() {
      i.resumeQueue.add(m), i.timeouts.delete(c), c.cancel(), l = c.time - re.now();
    }
    function m() {
      l > 0 && !$e.skipAnimation ? (i.delayed = !0, c = re.setTimeout(h, l), i.pauseQueue.add(u), i.timeouts.add(c)) : h();
    }
    function h() {
      i.delayed && (i.delayed = !1), i.pauseQueue.delete(u), i.timeouts.delete(c), e <= (i.cancelId || 0) && (f = !0);
      try {
        o.start({ ...n, callId: e, cancel: f }, s);
      } catch (p) {
        a(p);
      }
    }
  });
}
var Ba = (e, t) => t.length == 1 ? t[0] : t.some((n) => n.cancelled) ? wn(e.get()) : t.every((n) => n.noop) ? Rm(e.get()) : Je(
  e.get(),
  t.every((n) => n.finished)
), Rm = (e) => ({
  value: e,
  noop: !0,
  finished: !0,
  cancelled: !1
}), Je = (e, t, n = !1) => ({
  value: e,
  finished: t,
  cancelled: n
}), wn = (e) => ({
  value: e,
  cancelled: !0,
  finished: !1
});
function Pm(e, t, n, r) {
  const { callId: i, parentId: o, onRest: s } = t, { asyncTo: a, promise: l } = n;
  return !o && e === a && !t.reset ? l : n.promise = (async () => {
    n.asyncId = i, n.asyncTo = e;
    const c = za(
      t,
      (y, x) => (
        // The `onRest` prop is only called when the `runAsync` promise is resolved.
        x === "onRest" ? void 0 : y
      )
    );
    let f, u;
    const m = new Promise(
      (y, x) => (f = y, u = x)
    ), h = (y) => {
      const x = (
        // The `cancel` prop or `stop` method was used.
        i <= (n.cancelId || 0) && wn(r) || // The async `to` prop was replaced.
        i !== n.asyncId && Je(r, !1)
      );
      if (x)
        throw y.result = x, u(y), y;
    }, p = (y, x) => {
      const k = new fc(), w = new mc();
      return (async () => {
        if ($e.skipAnimation)
          throw dr(n), w.result = Je(r, !1), u(w), w;
        h(k);
        const j = Z.obj(y) ? { ...y } : { ...x, to: y };
        j.parentId = i, at(c, (E, O) => {
          Z.und(j[O]) && (j[O] = E);
        });
        const S = await r.start(j);
        return h(k), n.paused && await new Promise((E) => {
          n.resumeQueue.add(E);
        }), S;
      })();
    };
    let g;
    if ($e.skipAnimation)
      return dr(n), Je(r, !1);
    try {
      let y;
      Z.arr(e) ? y = (async (x) => {
        for (const k of x)
          await p(k);
      })(e) : y = Promise.resolve(e(p, r.stop.bind(r))), await Promise.all([y.then(f), m]), g = Je(r.get(), !0, !1);
    } catch (y) {
      if (y instanceof fc)
        g = y.result;
      else if (y instanceof mc)
        g = y.result;
      else
        throw y;
    } finally {
      i == n.asyncId && (n.asyncId = o, n.asyncTo = o ? a : void 0, n.promise = o ? l : void 0);
    }
    return Z.fun(s) && re.batchedUpdates(() => {
      s(g, r, r.item);
    }), g;
  })();
}
function dr(e, t) {
  Wn(e.timeouts, (n) => n.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t);
}
var fc = class extends Error {
  constructor() {
    super(
      "An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."
    );
  }
}, mc = class extends Error {
  constructor() {
    super("SkipAnimationSignal");
  }
}, ls = (e) => e instanceof Ga, RA = 1, Ga = class extends xm {
  constructor() {
    super(...arguments), this.id = RA++, this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(e) {
    this._priority != e && (this._priority = e, this._onPriorityChange(e));
  }
  /** Get the current value */
  get() {
    const e = nt(this);
    return e && e.getValue();
  }
  /** Create a spring that maps our value to another value */
  to(...e) {
    return $e.to(this, e);
  }
  /** @deprecated Use the `to` method instead. */
  interpolate(...e) {
    return cA(), $e.to(this, e);
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
    ar(this, {
      type: "change",
      parent: this,
      value: e,
      idle: t
    });
  }
  /** Tell our children about our new priority */
  _onPriorityChange(e) {
    this.idle || Ui.sort(this), ar(this, {
      type: "priority",
      parent: this,
      priority: e
    });
  }
}, en = /* @__PURE__ */ Symbol.for("SpringPhase"), Om = 1, cs = 2, us = 4, vo = (e) => (e[en] & Om) > 0, Et = (e) => (e[en] & cs) > 0, Bn = (e) => (e[en] & us) > 0, hc = (e, t) => t ? e[en] |= cs | Om : e[en] &= ~cs, pc = (e, t) => t ? e[en] |= us : e[en] &= ~us, PA = class extends Ga {
  constructor(e, t) {
    if (super(), this.animation = new DA(), this.defaultProps = {}, this._state = {
      paused: !1,
      delayed: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._pendingCalls = /* @__PURE__ */ new Set(), this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !Z.und(e) || !Z.und(t)) {
      const n = Z.obj(e) ? { ...e } : { ...t, from: e };
      Z.und(n.default) && (n.default = !0), this.start(n);
    }
  }
  /** Equals true when not advancing on each frame. */
  get idle() {
    return !(Et(this) || this._state.asyncTo) || Bn(this);
  }
  get goal() {
    return Pe(this.animation.to);
  }
  get velocity() {
    const e = nt(this);
    return e instanceof qi ? e.lastVelocity || 0 : e.getPayload().map((t) => t.lastVelocity || 0);
  }
  /**
   * When true, this value has been animated at least once.
   */
  get hasAnimated() {
    return vo(this);
  }
  /**
   * When true, this value has an unfinished animation,
   * which is either active or paused.
   */
  get isAnimating() {
    return Et(this);
  }
  /**
   * When true, all current and future animations are paused.
   */
  get isPaused() {
    return Bn(this);
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
    let { toValues: i } = r;
    const { config: o } = r, s = Vi(r.to);
    !s && Ye(r.to) && (i = Ge(Pe(r.to))), r.values.forEach((c, f) => {
      if (c.done) return;
      const u = (
        // Animated strings always go from 0 to 1.
        c.constructor == xi ? 1 : s ? s[f].lastPosition : i[f]
      );
      let m = r.immediate, h = u;
      if (!m) {
        if (h = c.lastPosition, o.tension <= 0) {
          c.done = !0;
          return;
        }
        let p = c.elapsedTime += e;
        const g = r.fromValues[f], y = c.v0 != null ? c.v0 : c.v0 = Z.arr(o.velocity) ? o.velocity[f] : o.velocity;
        let x;
        const k = o.precision || (g == u ? 5e-3 : Math.min(1, Math.abs(u - g) * 1e-3));
        if (Z.und(o.duration))
          if (o.decay) {
            const w = o.decay === !0 ? 0.998 : o.decay, j = Math.exp(-(1 - w) * p);
            h = g + y / (1 - w) * (1 - j), m = Math.abs(c.lastPosition - h) <= k, x = y * j;
          } else {
            x = c.lastVelocity == null ? y : c.lastVelocity;
            const w = o.restVelocity || k / 10, j = o.clamp ? 0 : o.bounce, S = !Z.und(j), E = g == u ? c.v0 > 0 : g < u;
            let O, R = !1;
            const B = 1, C = Math.ceil(e / B);
            for (let I = 0; I < C && (O = Math.abs(x) > w, !(!O && (m = Math.abs(u - h) <= k, m))); ++I) {
              S && (R = h == u || h > u == E, R && (x = -x * j, h = u));
              const z = -o.tension * 1e-6 * (h - u), W = -o.friction * 1e-3 * x, P = (z + W) / o.mass;
              x = x + P * B, h = h + x * B;
            }
          }
        else {
          let w = 1;
          o.duration > 0 && (this._memoizedDuration !== o.duration && (this._memoizedDuration = o.duration, c.durationProgress > 0 && (c.elapsedTime = o.duration * c.durationProgress, p = c.elapsedTime += e)), w = (o.progress || 0) + p / this._memoizedDuration, w = w > 1 ? 1 : w < 0 ? 0 : w, c.durationProgress = w), h = g + o.easing(w) * (u - g), x = (h - c.lastPosition) / e, m = w == 1;
        }
        c.lastVelocity = x, Number.isNaN(h) && (console.warn("Got NaN while animating:", this), m = !0);
      }
      s && !s[f].done && (m = !1), m ? c.done = !0 : t = !1, c.setValue(h, o.round) && (n = !0);
    });
    const a = nt(this), l = a.getValue();
    if (t) {
      const c = Pe(r.to);
      (l !== c || n) && !o.decay ? (a.setValue(c), this._onChange(c)) : n && o.decay && this._onChange(l), this._stop();
    } else n && this._onChange(l);
  }
  /** Set the current value, while stopping the current animation */
  set(e) {
    return re.batchedUpdates(() => {
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
    if (Et(this)) {
      const { to: e, config: t } = this.animation;
      re.batchedUpdates(() => {
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
    return Z.und(e) ? (n = this.queue || [], this.queue = []) : n = [Z.obj(e) ? e : { ...t, to: e }], Promise.all(
      n.map((r) => this._update(r))
    ).then((r) => Ba(this, r));
  }
  /**
   * Stop the current animation, and cancel any delayed updates.
   *
   * Pass `true` to call `onRest` with `cancelled: true`.
   */
  stop(e) {
    const { to: t } = this.animation;
    return this._focus(this.get()), dr(this._state, e && this._lastCallId), re.batchedUpdates(() => this._stop(t, e)), this;
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
    n = Z.obj(n) ? n[t] : n, (n == null || ss(n)) && (n = void 0), r = Z.obj(r) ? r[t] : r, r == null && (r = void 0);
    const i = { to: n, from: r };
    return vo(this) || (e.reverse && ([n, r] = [r, n]), r = Pe(r), Z.und(r) ? nt(this) || this._set(n) : this._set(r)), i;
  }
  /** Every update is processed by this method before merging. */
  _update({ ...e }, t) {
    const { key: n, defaultProps: r } = this;
    e.default && Object.assign(
      r,
      za(
        e,
        (s, a) => /^on/.test(a) ? Sm(s, n) : s
      )
    ), xc(this, e, "onProps"), Fn(this, "onProps", e, this);
    const i = this._prepareNode(e);
    if (Object.isFrozen(this))
      throw Error(
        "Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?"
      );
    const o = this._state;
    return Dm(++this._lastCallId, {
      key: n,
      props: e,
      defaultProps: r,
      state: o,
      actions: {
        pause: () => {
          Bn(this) || (pc(this, !0), Zn(o.pauseQueue), Fn(
            this,
            "onPause",
            Je(this, Gn(this, this.animation.to)),
            this
          ));
        },
        resume: () => {
          Bn(this) && (pc(this, !1), Et(this) && this._resume(), Zn(o.resumeQueue), Fn(
            this,
            "onResume",
            Je(this, Gn(this, this.animation.to)),
            this
          ));
        },
        start: this._merge.bind(this, i)
      }
    }).then((s) => {
      if (e.loop && s.finished && !(t && s.noop)) {
        const a = Tm(e);
        if (a)
          return this._update(a, !0);
      }
      return s;
    });
  }
  /** Merge props into the current animation */
  _merge(e, t, n) {
    if (t.cancel)
      return this.stop(!0), n(wn(this));
    const r = !Z.und(e.to), i = !Z.und(e.from);
    if (r || i)
      if (t.callId > this._lastToId)
        this._lastToId = t.callId;
      else
        return n(wn(this));
    const { key: o, defaultProps: s, animation: a } = this, { to: l, from: c } = a;
    let { to: f = l, from: u = c } = e;
    i && !r && (!t.default || Z.und(f)) && (f = u), t.reverse && ([f, u] = [u, f]);
    const m = !gt(u, c);
    m && (a.from = u), u = Pe(u);
    const h = !gt(f, l);
    h && this._focus(f);
    const p = ss(t.to), { config: g } = a, { decay: y, velocity: x } = g;
    (r || i) && (g.velocity = 0), t.config && !p && IA(
      g,
      Wt(t.config, o),
      // Avoid calling the same "config" prop twice.
      t.config !== s.config ? Wt(s.config, o) : void 0
    );
    let k = nt(this);
    if (!k || Z.und(f))
      return n(Je(this, !0));
    const w = (
      // When `reset` is undefined, the `from` prop implies `reset: true`,
      // except for declarative updates. When `reset` is defined, there
      // must exist a value to animate from.
      Z.und(t.reset) ? i && !t.default : !Z.und(u) && Vn(t.reset, o)
    ), j = w ? u : this.get(), S = ur(f), E = Z.num(S) || Z.arr(S) || Ji(S), O = !p && (!E || Vn(s.immediate || t.immediate, o));
    if (h) {
      const I = os(f);
      if (I !== k.constructor)
        if (O)
          k = this._set(S);
        else
          throw Error(
            `Cannot animate between ${k.constructor.name} and ${I.name}, as the "to" prop suggests`
          );
    }
    const R = k.constructor;
    let B = Ye(f), C = !1;
    if (!B) {
      const I = w || !vo(this) && m;
      (h || I) && (C = gt(ur(j), S), B = !C), (!gt(a.immediate, O) && !O || !gt(g.decay, y) || !gt(g.velocity, x)) && (B = !0);
    }
    if (C && Et(this) && (a.changed && !w ? B = !0 : B || this._stop(l)), !p && ((B || Ye(l)) && (a.values = k.getPayload(), a.toValues = Ye(f) ? null : R == xi ? [1] : Ge(S)), a.immediate != O && (a.immediate = O, !O && !w && this._set(l)), B)) {
      const { onRest: I } = a;
      ce(TA, (W) => xc(this, t, W));
      const z = Je(this, Gn(this, l));
      Zn(this._pendingCalls, z), this._pendingCalls.add(n), a.changed && re.batchedUpdates(() => {
        a.changed = !w, I?.(z, this), w ? Wt(s.onRest, z) : a.onStart?.(z, this);
      });
    }
    w && this._set(j), p ? n(Pm(t.to, t, this._state, this)) : B ? this._start() : Et(this) && !h ? this._pendingCalls.add(n) : n(Rm(j));
  }
  /** Update the `animation.to` value, which might be a `FluidValue` */
  _focus(e) {
    const t = this.animation;
    e !== t.to && (ic(this) && this._detach(), t.to = e, ic(this) && this._attach());
  }
  _attach() {
    let e = 0;
    const { to: t } = this.animation;
    Ye(t) && (Sn(t, this), ls(t) && (e = t.priority + 1)), this.priority = e;
  }
  _detach() {
    const { to: e } = this.animation;
    Ye(e) && lr(e, this);
  }
  /**
   * Update the current value from outside the frameloop,
   * and return the `Animated` node.
   */
  _set(e, t = !0) {
    const n = Pe(e);
    if (!Z.und(n)) {
      const r = nt(this);
      if (!r || !gt(n, r.getValue())) {
        const i = os(n);
        !r || r.constructor != i ? Ta(this, i.create(n)) : r.setValue(n), r && re.batchedUpdates(() => {
          this._onChange(n, t);
        });
      }
    }
    return nt(this);
  }
  _onStart() {
    const e = this.animation;
    e.changed || (e.changed = !0, Fn(
      this,
      "onStart",
      Je(this, Gn(this, e.to)),
      this
    ));
  }
  _onChange(e, t) {
    t || (this._onStart(), Wt(this.animation.onChange, e, this)), Wt(this.defaultProps.onChange, e, this), super._onChange(e, t);
  }
  // This method resets the animation state (even if already animating) to
  // ensure the latest from/to range is used, and it also ensures this spring
  // is added to the frameloop.
  _start() {
    const e = this.animation;
    nt(this).reset(Pe(e.to)), e.immediate || (e.fromValues = e.values.map((t) => t.lastPosition)), Et(this) || (hc(this, !0), Bn(this) || this._resume());
  }
  _resume() {
    $e.skipAnimation ? this.finish() : Ui.start(this);
  }
  /**
   * Exit the frameloop and notify `onRest` listeners.
   *
   * Always wrap `_stop` calls with `batchedUpdates`.
   */
  _stop(e, t) {
    if (Et(this)) {
      hc(this, !1);
      const n = this.animation;
      ce(n.values, (i) => {
        i.done = !0;
      }), n.toValues && (n.onChange = n.onPause = n.onResume = void 0), ar(this, {
        type: "idle",
        parent: this
      });
      const r = t ? wn(this.get()) : Je(this.get(), Gn(this, e ?? n.to));
      Zn(this._pendingCalls, r), n.changed && (n.changed = !1, Fn(this, "onRest", r, this));
    }
  }
};
function Gn(e, t) {
  const n = ur(t), r = ur(e.get());
  return gt(r, n);
}
function Tm(e, t = e.loop, n = e.to) {
  const r = Wt(t);
  if (r) {
    const i = r !== !0 && Im(r), o = (i || e).reverse, s = !i || i.reset;
    return fr({
      ...e,
      loop: t,
      // Avoid updating default props when looping.
      default: !1,
      // Never loop the `pause` prop.
      pause: void 0,
      // For the "reverse" prop to loop as expected, the "to" prop
      // must be undefined. The "reverse" prop is ignored when the
      // "to" prop is an array or function.
      to: !o || ss(n) ? n : void 0,
      // Ignore the "from" prop except on reset.
      from: s ? e.from : void 0,
      reset: s,
      // The "loop" prop can return a "useSpring" props object to
      // override any of the original props.
      ...i
    });
  }
}
function fr(e) {
  const { to: t, from: n } = e = Im(e), r = /* @__PURE__ */ new Set();
  return Z.obj(t) && gc(t, r), Z.obj(n) && gc(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function OA(e) {
  const t = fr(e);
  return Z.und(t.default) && (t.default = za(t)), t;
}
function gc(e, t) {
  at(e, (n, r) => n != null && t.add(r));
}
var TA = [
  "onStart",
  "onRest",
  "onChange",
  "onPause",
  "onResume"
];
function xc(e, t, n) {
  e.animation[n] = t[n] !== Nm(t, n) ? Sm(t[n], e.key) : void 0;
}
function Fn(e, t, ...n) {
  e.animation[t]?.(...n), e.defaultProps[t]?.(...n);
}
var zA = ["onStart", "onChange", "onRest"], BA = 1, GA = class {
  constructor(e, t) {
    this.id = BA++, this.springs = {}, this.queue = [], this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._state = {
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
      Z.und(n) || this.springs[t].set(n);
    }
  }
  /** Push an update onto the queue of each value. */
  update(e) {
    return e && this.queue.push(fr(e)), this;
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
    return e ? t = Ge(e).map(fr) : this.queue = [], this._flush ? this._flush(this, t) : (Lm(this, t), ds(this, t));
  }
  /** @internal */
  stop(e, t) {
    if (e !== !!e && (t = e), t) {
      const n = this.springs;
      ce(Ge(t), (r) => n[r].stop(!!e));
    } else
      dr(this._state, this._lastAsyncId), this.each((n) => n.stop(!!e));
    return this;
  }
  /** Freeze the active animation in time */
  pause(e) {
    if (Z.und(e))
      this.start({ pause: !0 });
    else {
      const t = this.springs;
      ce(Ge(e), (n) => t[n].pause());
    }
    return this;
  }
  /** Resume the animation if paused. */
  resume(e) {
    if (Z.und(e))
      this.start({ pause: !1 });
    else {
      const t = this.springs;
      ce(Ge(e), (n) => t[n].resume());
    }
    return this;
  }
  /** Call a function once per spring value */
  each(e) {
    at(this.springs, e);
  }
  /** @internal Called at the end of every animation frame */
  _onFrame() {
    const { onStart: e, onChange: t, onRest: n } = this._events, r = this._active.size > 0, i = this._changed.size > 0;
    (r && !this._started || i && !this._started) && (this._started = !0, Wn(e, ([a, l]) => {
      l.value = this.get(), a(l, this, this._item);
    }));
    const o = !r && this._started, s = i || o && n.size ? this.get() : null;
    i && t.size && Wn(t, ([a, l]) => {
      l.value = s, a(l, this, this._item);
    }), o && (this._started = !1, Wn(n, ([a, l]) => {
      l.value = s, a(l, this, this._item);
    }));
  }
  /** @internal */
  eventObserved(e) {
    if (e.type == "change")
      this._changed.add(e.parent), e.idle || this._active.add(e.parent);
    else if (e.type == "idle")
      this._active.delete(e.parent);
    else return;
    re.onFrame(this._onFrame);
  }
};
function ds(e, t) {
  return Promise.all(t.map((n) => zm(e, n))).then(
    (n) => Ba(e, n)
  );
}
async function zm(e, t, n) {
  const { keys: r, to: i, from: o, loop: s, onRest: a, onResolve: l } = t, c = Z.obj(t.default) && t.default;
  s && (t.loop = !1), i === !1 && (t.to = null), o === !1 && (t.from = null);
  const f = Z.arr(i) || Z.fun(i) ? i : void 0;
  f ? (t.to = void 0, t.onRest = void 0, c && (c.onRest = void 0)) : ce(zA, (g) => {
    const y = t[g];
    if (Z.fun(y)) {
      const x = e._events[g];
      t[g] = ({ finished: k, cancelled: w }) => {
        const j = x.get(y);
        j ? (k || (j.finished = !1), w && (j.cancelled = !0)) : x.set(y, {
          value: null,
          finished: k || !1,
          cancelled: w || !1
        });
      }, c && (c[g] = t[g]);
    }
  });
  const u = e._state;
  t.pause === !u.paused ? (u.paused = t.pause, Zn(t.pause ? u.pauseQueue : u.resumeQueue)) : u.paused && (t.pause = !0);
  const m = (r || Object.keys(e.springs)).map(
    (g) => e.springs[g].start(t)
  ), h = t.cancel === !0 || Nm(t, "cancel") === !0;
  (f || h && u.asyncId) && m.push(
    Dm(++e._lastAsyncId, {
      props: t,
      state: u,
      actions: {
        pause: rs,
        resume: rs,
        start(g, y) {
          h ? (dr(u, e._lastAsyncId), y(wn(e))) : (g.onRest = a, y(
            Pm(
              f,
              g,
              u,
              e
            )
          ));
        }
      }
    })
  ), u.paused && await new Promise((g) => {
    u.resumeQueue.add(g);
  });
  const p = Ba(e, await Promise.all(m));
  if (s && p.finished && !(n && p.noop)) {
    const g = Tm(t, s, i);
    if (g)
      return Lm(e, [g]), zm(e, g, !0);
  }
  return l && re.batchedUpdates(() => l(p, e, e.item)), p;
}
function bc(e, t) {
  const n = { ...e.springs };
  return t && ce(Ge(t), (r) => {
    Z.und(r.keys) && (r = fr(r)), Z.obj(r.to) || (r = { ...r, to: void 0 }), Fm(n, r, (i) => Gm(i));
  }), Bm(e, n), n;
}
function Bm(e, t) {
  at(t, (n, r) => {
    e.springs[r] || (e.springs[r] = n, Sn(n, e));
  });
}
function Gm(e, t) {
  const n = new PA();
  return n.key = e, t && Sn(n, t), n;
}
function Fm(e, t, n) {
  t.keys && ce(t.keys, (r) => {
    (e[r] || (e[r] = n(r)))._prepareNode(t);
  });
}
function Lm(e, t) {
  ce(t, (n) => {
    Fm(e.springs, n, (r) => Gm(r, e));
  });
}
var FA = v.createContext({
  pause: !1,
  immediate: !1
}), LA = () => {
  const e = [], t = function(r) {
    dA();
    const i = [];
    return ce(e, (o, s) => {
      if (Z.und(r))
        i.push(o.start());
      else {
        const a = n(r, o, s);
        a && i.push(o.start(a));
      }
    }), i;
  };
  t.current = e, t.add = function(r) {
    e.includes(r) || e.push(r);
  }, t.delete = function(r) {
    const i = e.indexOf(r);
    ~i && e.splice(i, 1);
  }, t.pause = function() {
    return ce(e, (r) => r.pause(...arguments)), this;
  }, t.resume = function() {
    return ce(e, (r) => r.resume(...arguments)), this;
  }, t.set = function(r) {
    ce(e, (i, o) => {
      const s = Z.fun(r) ? r(o, i) : r;
      s && i.set(s);
    });
  }, t.start = function(r) {
    const i = [];
    return ce(e, (o, s) => {
      if (Z.und(r))
        i.push(o.start());
      else {
        const a = this._getProps(r, o, s);
        a && i.push(o.start(a));
      }
    }), i;
  }, t.stop = function() {
    return ce(e, (r) => r.stop(...arguments)), this;
  }, t.update = function(r) {
    return ce(e, (i, o) => i.update(this._getProps(r, i, o))), this;
  };
  const n = function(r, i, o) {
    return Z.fun(r) ? r(o, i) : r;
  };
  return t._getProps = n, t;
};
function YA(e, t, n) {
  const r = Z.fun(t) && t;
  r && !n && (n = []);
  const i = ke(
    () => r || arguments.length == 3 ? LA() : void 0,
    []
  ), o = pe(0), s = Am(), a = ke(
    () => ({
      ctrls: [],
      queue: [],
      flush(x, k) {
        const w = bc(x, k);
        return o.current > 0 && !a.queue.length && !Object.keys(w).some((S) => !x.springs[S]) ? ds(x, k) : new Promise((S) => {
          Bm(x, w), a.queue.push(() => {
            S(ds(x, k));
          }), s();
        });
      }
    }),
    []
  ), l = pe([...a.ctrls]), c = pe([]), f = sc(e) || 0;
  ke(() => {
    ce(l.current.slice(e, f), (x) => {
      jA(x, i), x.stop(!0);
    }), l.current.length = e, u(f, e);
  }, [e]), ke(() => {
    u(0, Math.min(f, e));
  }, n);
  function u(x, k) {
    for (let w = x; w < k; w++) {
      const j = l.current[w] || (l.current[w] = new GA(null, a.flush)), S = r ? r(w, j) : t[w];
      S && (c.current[w] = OA(S));
    }
  }
  const m = l.current.map(
    (x, k) => bc(x, c.current[k])
  ), h = lt(FA), p = sc(h), g = h !== p && CA(h);
  Oa(() => {
    o.current++, a.ctrls = l.current;
    const { queue: x } = a;
    x.length && (a.queue = [], ce(x, (k) => k())), ce(l.current, (k, w) => {
      i?.add(k), g && k.start({ default: h });
      const j = c.current[w];
      j && (MA(k, j.ref), k.ref ? k.queue.push(j) : k.start(j));
    });
  }), km(() => () => {
    ce(a.ctrls, (x) => x.stop(!0));
  });
  const y = m.map((x) => ({ ...x }));
  return i ? [y, i] : y;
}
function Fa(e, t) {
  const n = Z.fun(e), [[r], i] = YA(
    1,
    n ? e : [e],
    n ? [] : t
  );
  return n || arguments.length == 2 ? [r, i] : r;
}
var HA = class extends Ga {
  constructor(e, t) {
    super(), this.source = e, this.idle = !0, this._active = /* @__PURE__ */ new Set(), this.calc = or(...t);
    const n = this._get(), r = os(n);
    Ta(this, r.create(n));
  }
  advance(e) {
    const t = this._get(), n = this.get();
    gt(t, n) || (nt(this).setValue(t), this._onChange(t, this.idle)), !this.idle && yc(this._active) && wo(this);
  }
  _get() {
    const e = Z.arr(this.source) ? this.source.map(Pe) : Ge(Pe(this.source));
    return this.calc(...e);
  }
  _start() {
    this.idle && !yc(this._active) && (this.idle = !1, ce(Vi(this), (e) => {
      e.done = !1;
    }), $e.skipAnimation ? (re.batchedUpdates(() => this.advance()), wo(this)) : Ui.start(this));
  }
  // Observe our sources only when we're observed.
  _attach() {
    let e = 1;
    ce(Ge(this.source), (t) => {
      Ye(t) && Sn(t, this), ls(t) && (t.idle || this._active.add(t), e = Math.max(e, t.priority + 1));
    }), this.priority = e, this._start();
  }
  // Stop observing our sources once we have no observers.
  _detach() {
    ce(Ge(this.source), (e) => {
      Ye(e) && lr(e, this);
    }), this._active.clear(), wo(this);
  }
  /** @internal */
  eventObserved(e) {
    e.type == "change" ? e.idle ? this.advance() : (this._active.add(e.parent), this._start()) : e.type == "idle" ? this._active.delete(e.parent) : e.type == "priority" && (this.priority = Ge(this.source).reduce(
      (t, n) => Math.max(t, (ls(n) ? n.priority : 0) + 1),
      0
    ));
  }
};
function QA(e) {
  return e.idle !== !1;
}
function yc(e) {
  return !e.size || Array.from(e).every(QA);
}
function wo(e) {
  e.idle || (e.idle = !0, ce(Vi(e), (t) => {
    t.done = !0;
  }), ar(e, {
    type: "idle",
    parent: e
  }));
}
$e.assign({
  createStringInterpolator: vm,
  to: (e, t) => new HA(e, t)
});
var Ym = /^--/;
function UA(e, t) {
  return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !Ym.test(e) && !(qn.hasOwnProperty(e) && qn[e]) ? t + "px" : ("" + t).trim();
}
var vc = {};
function ZA(e, t) {
  if (!e.nodeType || !e.setAttribute)
    return !1;
  const n = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter", {
    className: r,
    style: i,
    children: o,
    scrollTop: s,
    scrollLeft: a,
    viewBox: l,
    ...c
  } = t, f = Object.values(c), u = Object.keys(c).map(
    (m) => n || e.hasAttribute(m) ? m : vc[m] || (vc[m] = m.replace(
      /([A-Z])/g,
      // Attributes are written in dash case
      (h) => "-" + h.toLowerCase()
    ))
  );
  o !== void 0 && (e.textContent = o);
  for (const m in i)
    if (i.hasOwnProperty(m)) {
      const h = UA(m, i[m]);
      Ym.test(m) ? e.style.setProperty(m, h) : e.style[m] = h;
    }
  u.forEach((m, h) => {
    e.setAttribute(m, f[h]);
  }), r !== void 0 && (e.className = r), s !== void 0 && (e.scrollTop = s), a !== void 0 && (e.scrollLeft = a), l !== void 0 && e.setAttribute("viewBox", l);
}
var qn = {
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
}, WA = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), JA = ["Webkit", "Ms", "Moz", "O"];
qn = Object.keys(qn).reduce((e, t) => (JA.forEach((n) => e[WA(n, t)] = e[t]), e), qn);
var VA = /^(matrix|translate|scale|rotate|skew)/, qA = /^(translate)/, XA = /^(rotate|skew)/, Ao = (e, t) => Z.num(e) && e !== 0 ? e + t : e, ti = (e, t) => Z.arr(e) ? e.every((n) => ti(n, t)) : Z.num(e) ? e === t : parseFloat(e) === t, KA = class extends Xi {
  constructor({ x: e, y: t, z: n, ...r }) {
    const i = [], o = [];
    (e || t || n) && (i.push([e || 0, t || 0, n || 0]), o.push((s) => [
      `translate3d(${s.map((a) => Ao(a, "px")).join(",")})`,
      // prettier-ignore
      ti(s, 0)
    ])), at(r, (s, a) => {
      if (a === "transform")
        i.push([s || ""]), o.push((l) => [l, l === ""]);
      else if (VA.test(a)) {
        if (delete r[a], Z.und(s)) return;
        const l = qA.test(a) ? "px" : XA.test(a) ? "deg" : "";
        i.push(Ge(s)), o.push(
          a === "rotate3d" ? ([c, f, u, m]) => [
            `rotate3d(${c},${f},${u},${Ao(m, l)})`,
            ti(m, 0)
          ] : (c) => [
            `${a}(${c.map((f) => Ao(f, l)).join(",")})`,
            ti(c, a.startsWith("scale") ? 1 : 0)
          ]
        );
      }
    }), i.length && (r.transform = new _A(i, o)), super(r);
  }
}, _A = class extends xm {
  constructor(e, t) {
    super(), this.inputs = e, this.transforms = t, this._value = null;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let e = "", t = !0;
    return ce(this.inputs, (n, r) => {
      const i = Pe(n[0]), [o, s] = this.transforms[r](
        Z.arr(i) ? i : n.map(Pe)
      );
      e += " " + o, t = t && s;
    }), t ? "none" : e;
  }
  // Start observing our inputs once we have an observer.
  observerAdded(e) {
    e == 1 && ce(
      this.inputs,
      (t) => ce(
        t,
        (n) => Ye(n) && Sn(n, this)
      )
    );
  }
  // Stop observing our inputs once we have no observers.
  observerRemoved(e) {
    e == 0 && ce(
      this.inputs,
      (t) => ce(
        t,
        (n) => Ye(n) && lr(n, this)
      )
    );
  }
  eventObserved(e) {
    e.type == "change" && (this._value = null), ar(this, e);
  }
}, $A = [
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
$e.assign({
  batchedUpdates: up,
  createStringInterpolator: vm,
  colors: Q0
});
var e1 = vA($A, {
  applyAnimatedValues: ZA,
  createAnimatedStyle: (e) => new KA(e),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getComponentProps: ({ scrollTop: e, scrollLeft: t, ...n }) => n
}), La = e1.animated;
const t1 = "Save changes", n1 = "Cancel", r1 = "Review", i1 = "OBJECT", o1 = "Changed", s1 = 440, a1 = {
  tension: 320,
  friction: 34
}, l1 = 250, c1 = 200;
function KN({
  pendingCount: e,
  pendingItems: t,
  saving: n = !1,
  onSave: r,
  onCancel: i,
  saveLabel: o = t1,
  cancelLabel: s = n1,
  viewUnsavedLabel: a = r1,
  pendingKeyLabel: l = i1,
  pendingValueLabel: c = o1,
  dimmed: f = !1,
  disabled: u = !1,
  expandMaxHeight: m = s1,
  expandSpringConfig: h = a1,
  barTransitionMs: p = l1,
  chevronTransitionMs: g = c1
}) {
  const [y, x] = ge(!1), k = e > 0, w = ke(
    () => Array.isArray(t) && t.length > 0,
    [t]
  ), j = ke(
    () => (t ?? []).some((B) => !!B.section),
    [t]
  ), S = ke(() => {
    const B = /* @__PURE__ */ new Map();
    return (t ?? []).forEach((C) => {
      const I = C.section?.trim() || "General", z = B.get(I) ?? [];
      z.push(C), B.set(I, z);
    }), Array.from(B.entries()).map(([C, I]) => ({
      section: C,
      items: I
    }));
  }, [t]), [E, O] = Fa(() => ({
    maxHeight: 0,
    opacity: 0,
    config: h
  }));
  if (de(() => {
    k || x(!1);
  }, [k]), de(() => {
    const B = y && w;
    O.start({
      maxHeight: B ? m : 0,
      opacity: B ? 1 : 0,
      config: h
    });
  }, [y, w, O, m, h]), typeof document > "u")
    return null;
  const R = e === 1 ? "1 unsaved change" : `${e} unsaved changes`;
  return dp(
    /* @__PURE__ */ d.jsx(
      "div",
      {
        className: Q(
          "fixed bottom-3 left-3 right-3 z-[35] transform-gpu transition-all md:bottom-6 md:left-[calc(18rem+1.5rem)] md:right-6",
          k ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-6 opacity-0 pointer-events-none"
        ),
        style: { transitionDuration: `${p}ms` },
        children: /* @__PURE__ */ d.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ d.jsx(
            La.div,
            {
              style: {
                maxHeight: E.maxHeight,
                opacity: E.opacity
              },
              className: "overflow-hidden",
              children: /* @__PURE__ */ d.jsx(
                "div",
                {
                  className: Q(
                    "pointer-events-auto mx-auto w-[calc(100%-7rem)] overflow-auto rounded-t-[28px] border border-b-0 border-border/70 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.5)] backdrop-blur",
                    f ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/95"
                  ),
                  children: /* @__PURE__ */ d.jsxs("table", { className: "w-full text-sm", children: [
                    /* @__PURE__ */ d.jsx("thead", { className: "sticky top-0 bg-muted/70", children: /* @__PURE__ */ d.jsxs("tr", { className: "border-b border-border/70", children: [
                      /* @__PURE__ */ d.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: l }),
                      /* @__PURE__ */ d.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: c })
                    ] }) }),
                    /* @__PURE__ */ d.jsx("tbody", { children: S.map((B, C) => /* @__PURE__ */ d.jsxs(ap, { children: [
                      j ? /* @__PURE__ */ d.jsx("tr", { className: "border-b border-border/70 bg-muted/45", children: /* @__PURE__ */ d.jsx(
                        "td",
                        {
                          colSpan: 2,
                          className: "px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                          children: B.section
                        }
                      ) }) : null,
                      B.items.map((I, z) => /* @__PURE__ */ d.jsxs(
                        "tr",
                        {
                          className: "border-b border-border/60 last:border-b-0",
                          children: [
                            /* @__PURE__ */ d.jsx("td", { className: "px-4 py-2.5 align-top font-medium text-foreground", children: I.key }),
                            /* @__PURE__ */ d.jsx("td", { className: "px-4 py-2.5 align-top text-muted-foreground", children: I.value })
                          ]
                        },
                        `${B.section}-${I.key}-${I.value}-${z}`
                      ))
                    ] }, `${B.section}-${C}`)) })
                  ] })
                }
              )
            }
          ),
          /* @__PURE__ */ d.jsxs(
            "div",
            {
              className: Q(
                "pointer-events-auto relative flex min-h-[3.75rem] items-center justify-between gap-3 rounded-[999px] border border-border/70 px-4 py-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.4)] backdrop-blur-md",
                f ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/96"
              ),
              children: [
                /* @__PURE__ */ d.jsxs("div", { className: "flex min-w-0 shrink items-center gap-2.5 text-sm", children: [
                  /* @__PURE__ */ d.jsxs("span", { className: "relative flex size-2.5 shrink-0", children: [
                    /* @__PURE__ */ d.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" }),
                    /* @__PURE__ */ d.jsx("span", { className: "relative inline-flex size-2.5 rounded-full bg-amber-400" })
                  ] }),
                  /* @__PURE__ */ d.jsx("span", { className: "truncate font-medium text-foreground", children: R })
                ] }),
                /* @__PURE__ */ d.jsxs("div", { className: "flex shrink-0 flex-wrap items-center justify-end gap-1.5", children: [
                  w ? /* @__PURE__ */ d.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      disabled: n || u,
                      onClick: () => x((B) => !B),
                      children: [
                        /* @__PURE__ */ d.jsx(cw, { className: "size-4" }),
                        a,
                        /* @__PURE__ */ d.jsx(
                          _o,
                          {
                            className: Q(
                              "size-4 transition-transform",
                              y ? "rotate-0" : "rotate-180"
                            ),
                            style: { transitionDuration: `${g}ms` }
                          }
                        )
                      ]
                    }
                  ) : null,
                  i ? /* @__PURE__ */ d.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: i,
                      disabled: n || u,
                      children: [
                        /* @__PURE__ */ d.jsx(Er, { className: "size-4" }),
                        s
                      ]
                    }
                  ) : null,
                  /* @__PURE__ */ d.jsxs(
                    me,
                    {
                      type: "button",
                      size: "sm",
                      onClick: r,
                      disabled: n || u,
                      children: [
                        n ? /* @__PURE__ */ d.jsx(fa, { className: "size-4 animate-spin" }) : /* @__PURE__ */ d.jsx(Sw, { className: "size-4" }),
                        n ? "Saving…" : o
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
function _N({
  columns: e,
  rows: t,
  rowKey: n,
  loading: r = !1,
  loadingMessage: i = "Loading...",
  emptyMessage: o = "No records found.",
  page: s,
  pageSize: a,
  pageSizeOptions: l = [10, 25, 50],
  onPageChange: c,
  onPageSizeChange: f,
  onRowClick: u,
  paginationMode: m = "client",
  totalRowCount: h,
  sortBy: p = null,
  sortOrder: g = "asc",
  onSortChange: y,
  alignPaginationToLeft: x = !1,
  onLoadingChange: k,
  hoveredRow: w = null,
  onHoveredRowChange: j
}) {
  const S = lp(), E = pe(null), O = pe(null), [R, B] = ge(null), C = m === "server", I = C ? h ?? t.length : t.length, z = Math.max(1, Math.ceil(I / a)), W = Math.min(s, z - 1), P = W * a, M = C ? t : t.slice(P, P + a), D = I === 0 || M.length === 0 ? 0 : Math.min(P + M.length, I), F = W > 0, T = D < I, G = D === 0 ? "No results" : C && T ? `Showing ${P + 1}-${D}` : `Showing ${P + 1}-${D} of ${I}`, b = C && T ? `Page ${W + 1}` : `Page ${W + 1} of ${z}`, N = Math.max(3, Math.min(a || 5, 8));
  de(() => {
    if (k)
      return k(S, r, i), () => {
        k(S, !1);
      };
  }, [r, i, S, k]);
  const Y = (H) => {
    if (!y)
      return;
    y(H, p === H && g === "asc" ? "desc" : "asc");
  }, A = w ? n(w) : null, X = (H) => /* @__PURE__ */ d.jsx(
    Jt,
    {
      className: Q(
        "odd:bg-transparent even:bg-muted/20",
        u && "cursor-pointer",
        A === n(H) && "bg-muted/35"
      ),
      onClick: u ? () => u(H) : void 0,
      onMouseEnter: j ? () => j(H) : void 0,
      onFocus: j ? () => j(H) : void 0,
      children: e.map((q) => /* @__PURE__ */ d.jsx(Dt, { className: q.cellClassName, children: q.render(H) }, q.id))
    },
    n(H)
  );
  return de(() => {
    const H = () => {
      if (!E.current)
        return;
      const ie = E.current.closest("[data-detail-tab-content], [data-table-viewport]");
      if (!ie) {
        B(null);
        return;
      }
      const fe = ie;
      if (!fe)
        return;
      const we = E.current.getBoundingClientRect(), Me = fe.getBoundingClientRect(), je = Math.max(0, we.top - Me.top), ft = fe.clientHeight, Dn = O.current?.offsetHeight ?? 80, Dr = 16;
      if (ft <= 0) {
        B(null);
        return;
      }
      const ln = ft - je - Dr;
      if (ln < 180) {
        const Pr = Math.max(40, ln - Dn - 8);
        B(Math.max(0, Pr));
        return;
      }
      const Rr = Math.max(100, Math.floor(ln - Dn - 8));
      B(Rr);
    };
    H();
    const q = window.requestAnimationFrame(H);
    window.addEventListener("resize", H);
    const J = new ResizeObserver(H);
    E.current?.parentElement && J.observe(E.current.parentElement);
    const ae = E.current?.closest("[data-detail-tab-content], [data-table-viewport]");
    return ae && J.observe(ae), J.observe(document.documentElement), () => {
      window.cancelAnimationFrame(q), window.removeEventListener("resize", H), J.disconnect();
    };
  }, []), /* @__PURE__ */ d.jsxs(
    "div",
    {
      ref: E,
      className: "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
      children: [
        /* @__PURE__ */ d.jsx(
          "div",
          {
            className: "min-h-0 overflow-auto",
            style: R ? { maxHeight: `${R}px` } : void 0,
            children: /* @__PURE__ */ d.jsxs(Yi, { containerClassName: "overflow-x-visible", children: [
              /* @__PURE__ */ d.jsx(sm, { children: /* @__PURE__ */ d.jsx(Jt, { className: "hover:bg-transparent", children: e.map((H) => /* @__PURE__ */ d.jsx(
                am,
                {
                  className: Q("sticky top-0 z-[1] bg-card text-center", H.className),
                  children: H.sortable && y ? /* @__PURE__ */ d.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => Y(H.id),
                      className: "inline-flex w-full cursor-pointer items-center justify-center gap-1 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                      children: [
                        /* @__PURE__ */ d.jsx("span", { children: H.header }),
                        p === H.id ? g === "asc" ? /* @__PURE__ */ d.jsx(_o, { className: "size-3.5" }) : /* @__PURE__ */ d.jsx(da, { className: "size-3.5" }) : /* @__PURE__ */ d.jsx(_o, { className: "size-3.5 opacity-30" })
                      ]
                    }
                  ) : H.header
                },
                H.id
              )) }) }),
              /* @__PURE__ */ d.jsx(Hi, { children: r ? Array.from({ length: N }).map((H, q) => /* @__PURE__ */ d.jsx(Jt, { className: "hover:bg-transparent", children: e.map((J) => /* @__PURE__ */ d.jsx(Dt, { className: J.cellClassName, children: /* @__PURE__ */ d.jsx("div", { className: "h-4 w-full animate-pulse rounded bg-muted/60" }) }, `${J.id}-skeleton-${q}`)) }, `loading-skeleton-${q}`)) : M.length === 0 ? /* @__PURE__ */ d.jsx(Jt, { className: "hover:bg-transparent", children: /* @__PURE__ */ d.jsx(
                Dt,
                {
                  colSpan: e.length,
                  className: "py-10 text-center text-sm text-muted-foreground",
                  children: o
                }
              ) }) : M.map((H) => X(H)) })
            ] })
          }
        ),
        r && /* @__PURE__ */ d.jsx("div", { className: "sr-only", "aria-live": "polite", children: i }),
        /* @__PURE__ */ d.jsxs(
          "div",
          {
            ref: O,
            className: Q(
              "flex-shrink-0 flex flex-col gap-3 border-t border-border/70 bg-card px-4 py-3 sm:flex-row sm:items-center",
              x ? "sm:justify-start" : "sm:justify-between"
            ),
            children: [
              /* @__PURE__ */ d.jsx("div", { className: "text-sm text-muted-foreground", children: G }),
              /* @__PURE__ */ d.jsxs("div", { className: Q("flex flex-col gap-3 sm:flex-row sm:items-center", x ? "sm:ml-4" : ""), children: [
                /* @__PURE__ */ d.jsxs("label", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ d.jsx("span", { children: "Rows" }),
                  /* @__PURE__ */ d.jsx(
                    ka,
                    {
                      value: a,
                      onValueChange: (H) => f(Number(H)),
                      options: l.map((H) => ({ value: String(H), label: String(H) })),
                      className: "h-9",
                      searchPlaceholder: "Search rows..."
                    }
                  )
                ] }),
                /* @__PURE__ */ d.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ d.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => c(W - 1),
                      disabled: !F,
                      children: [
                        /* @__PURE__ */ d.jsx(Zf, { className: "size-4" }),
                        "Previous"
                      ]
                    }
                  ),
                  /* @__PURE__ */ d.jsx("span", { className: "min-w-20 text-center text-sm text-muted-foreground", children: b }),
                  /* @__PURE__ */ d.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => c(W + 1),
                      disabled: !T,
                      children: [
                        "Next",
                        /* @__PURE__ */ d.jsx(It, { className: "size-4" })
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
function $N({
  label: e,
  value: t,
  className: n
}) {
  return /* @__PURE__ */ d.jsxs("div", { className: Q("min-w-0 space-y-0.5", n), children: [
    /* @__PURE__ */ d.jsx("dt", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: e }),
    /* @__PURE__ */ d.jsx("dd", { className: "text-sm text-foreground", children: t ?? "-" })
  ] });
}
function ko() {
  return /* @__PURE__ */ d.jsxs("div", { className: "animate-pulse rounded-2xl border border-border/70 bg-card p-4", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ d.jsx("div", { className: "h-5 w-1/2 rounded-md bg-muted" }),
      /* @__PURE__ */ d.jsx("div", { className: "h-5 w-16 rounded-full bg-muted" })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-3", children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ d.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ d.jsx("div", { className: "h-2 w-12 rounded bg-muted" }),
      /* @__PURE__ */ d.jsx("div", { className: "h-4 w-full rounded bg-muted" })
    ] }, t)) })
  ] });
}
function eI({
  rows: e,
  rowKey: t,
  renderCard: n,
  loading: r = !1,
  emptyMessage: i = "No results found.",
  page: o = 0,
  pageSize: s = 25,
  onPageChange: a,
  paginationMode: l = "client",
  totalRowCount: c,
  infiniteScroll: f = !1,
  hasMore: u = !1,
  onLoadMore: m,
  onInfiniteScrollReset: h,
  resetKey: p,
  className: g
}) {
  const [y, x] = ge([]), k = pe(/* @__PURE__ */ new Map()), w = pe(t);
  w.current = t;
  const j = pe(p);
  de(() => {
    if (!f || !m)
      return;
    if (p !== j.current) {
      j.current = p;
      const q = /* @__PURE__ */ new Map();
      for (const J of e)
        q.set(w.current(J), J);
      k.current = q, x([...q.values()]);
      return;
    }
    let H = !1;
    for (const q of e) {
      const J = w.current(q);
      k.current.has(J) || (k.current.set(J, q), H = !0);
    }
    H && x([...k.current.values()]);
  }, [e, p, f, m]);
  const [S, E] = ge(s), [O, R] = ge(
    () => typeof window < "u" ? window.matchMedia("(max-width: 767px)").matches : !1
  ), B = pe(O);
  de(() => {
    !f || m || E(s);
  }, [p, s, f, m]), de(() => {
    if (typeof window > "u")
      return;
    const H = window.matchMedia("(max-width: 767px)"), q = (J) => {
      R(J.matches);
    };
    return R(H.matches), H.addEventListener("change", q), () => H.removeEventListener("change", q);
  }, []), de(() => {
    if (!f || !m || !h)
      return;
    const H = !B.current && O;
    B.current = O, !(!H || o <= 0) && (k.current = /* @__PURE__ */ new Map(), x([]), h());
  }, [
    f,
    O,
    h,
    m,
    o
  ]);
  const C = pe(null), I = pe(!1), z = pe(m), W = pe(!1), P = pe(o), M = pe(r), D = pe(null);
  z.current = m, P.current = o, M.current = r, f && (I.current = m ? u : !r && S < e.length);
  const F = () => {
    z.current && (!W.current || !I.current || M.current || D.current !== P.current && (D.current = P.current, z.current()));
  };
  de(() => {
    if (!f)
      return;
    const H = C.current;
    if (!H)
      return;
    const q = new IntersectionObserver(
      ([J]) => {
        if (W.current = J.isIntersecting, !(!J.isIntersecting || !I.current)) {
          if (z.current) {
            F();
            return;
          }
          E((ae) => ae + s);
        }
      },
      { rootMargin: "300px" }
    );
    return q.observe(H), () => q.disconnect();
  }, [f, s]), de(() => {
    !f || !z.current || F();
  }, [u, f, r, o]), de(() => {
    if (!f || !m)
      return;
    const H = () => {
      const q = C.current;
      if (!q)
        return;
      const { top: J } = q.getBoundingClientRect();
      J - window.innerHeight <= 300 && (W.current = !0, F());
    };
    return window.addEventListener("scroll", H, { passive: !0 }), window.addEventListener("resize", H), H(), () => {
      window.removeEventListener("scroll", H), window.removeEventListener("resize", H);
    };
  }, [f, m, o, u, r]);
  const T = m ? y : e.slice(0, S), G = l === "server" ? c ?? e.length : e.length, b = o > 0, N = (o + 1) * s < G, Y = !f && (b || N), A = l === "client" ? e.slice(o * s, (o + 1) * s) : e, X = f ? T : A;
  return r && X.length === 0 ? /* @__PURE__ */ d.jsxs("div", { className: Q("space-y-3 md:hidden", g), children: [
    /* @__PURE__ */ d.jsx(ko, {}),
    /* @__PURE__ */ d.jsx(ko, {}),
    /* @__PURE__ */ d.jsx(ko, {})
  ] }) : !r && X.length === 0 ? /* @__PURE__ */ d.jsx("div", { className: Q("md:hidden", g), children: /* @__PURE__ */ d.jsx("div", { className: "rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground", children: i }) }) : /* @__PURE__ */ d.jsxs("div", { className: Q("space-y-3 md:hidden", g), children: [
    X.map((H) => /* @__PURE__ */ d.jsx("div", { children: n(H) }, t(H))),
    f ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("div", { ref: C, "aria-hidden": "true" }),
      r ? /* @__PURE__ */ d.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ d.jsx(fa, { className: "size-5 animate-spin text-muted-foreground" }) }) : null
    ] }) : null,
    Y ? /* @__PURE__ */ d.jsxs("div", { className: "flex items-center justify-between border-t border-border/50 pt-3", children: [
      /* @__PURE__ */ d.jsxs(
        "button",
        {
          type: "button",
          disabled: !b,
          onClick: () => a?.(o - 1),
          className: "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
          children: [
            /* @__PURE__ */ d.jsx(Zf, { className: "size-4" }),
            "Previous"
          ]
        }
      ),
      /* @__PURE__ */ d.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        "Page ",
        o + 1
      ] }),
      /* @__PURE__ */ d.jsxs(
        "button",
        {
          type: "button",
          disabled: !N,
          onClick: () => a?.(o + 1),
          className: "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
          children: [
            "Next",
            /* @__PURE__ */ d.jsx(It, { className: "size-4" })
          ]
        }
      )
    ] }) : null
  ] });
}
function tI({
  activeTab: e,
  items: t,
  onTabSelect: n,
  onMenuOpen: r,
  menuButtonLabel: i = "Menu",
  menuButtonAriaLabel: o = "Open menu",
  menuButtonIcon: s,
  className: a
}) {
  const l = t.length, c = t.findIndex((m) => m.id === e), f = Fa({
    leftPct: c >= 0 && l > 0 ? c / l * 100 : 0,
    opacity: c >= 0 && l > 0 ? 1 : 0,
    config: { tension: 300, friction: 26 }
  }), u = "calc(100% - 4rem)";
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      className: Q(
        "fixed inset-x-0 bottom-0 z-40 h-16 border-t border-border/70 bg-card/95 backdrop-blur md:hidden",
        a
      ),
      children: /* @__PURE__ */ d.jsxs("nav", { className: "relative flex h-full items-stretch", children: [
        /* @__PURE__ */ d.jsx(
          La.div,
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute top-0 h-0.5 rounded-full bg-primary",
            style: {
              left: f.leftPct.to(
                (m) => `calc(${u} * ${m / 100})`
              ),
              width: f.leftPct.to(
                () => l > 0 ? `calc(${u} / ${l})` : "0px"
              ),
              opacity: f.opacity
            }
          }
        ),
        t.map((m) => {
          const h = e === m.id;
          return /* @__PURE__ */ d.jsxs(
            "button",
            {
              type: "button",
              className: Q(
                "flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
                h ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              ),
              onClick: () => n?.(m.id),
              "aria-label": m.label,
              "aria-current": h ? "page" : void 0,
              children: [
                m.icon,
                /* @__PURE__ */ d.jsx("span", { className: "text-[10px] font-medium leading-none", children: m.label })
              ]
            },
            m.id
          );
        }),
        /* @__PURE__ */ d.jsx("div", { className: "w-16 shrink-0 border-l border-border/40", children: /* @__PURE__ */ d.jsxs(
          "button",
          {
            type: "button",
            className: "flex h-full w-full flex-col items-center justify-center gap-1 px-1 py-2 text-muted-foreground transition-colors hover:text-foreground",
            onClick: r,
            "aria-label": o,
            children: [
              s ?? /* @__PURE__ */ d.jsx(Bw, { className: "size-5" }),
              /* @__PURE__ */ d.jsx("span", { className: "text-[10px] font-medium leading-none", children: i })
            ]
          }
        ) })
      ] })
    }
  );
}
function u1(e, t) {
  const n = {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const d1 = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, f1 = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, m1 = {};
function wc(e, t) {
  return (m1.jsx ? f1 : d1).test(e);
}
const h1 = /[ \t\n\f\r]/g;
function p1(e) {
  return typeof e == "object" ? e.type === "text" ? Ac(e.value) : !1 : Ac(e);
}
function Ac(e) {
  return e.replace(h1, "") === "";
}
class Sr {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(t, n, r) {
    this.normal = n, this.property = t, r && (this.space = r);
  }
}
Sr.prototype.normal = {};
Sr.prototype.property = {};
Sr.prototype.space = void 0;
function Hm(e, t) {
  const n = {}, r = {};
  for (const i of e)
    Object.assign(n, i.property), Object.assign(r, i.normal);
  return new Sr(n, r, t);
}
function fs(e) {
  return e.toLowerCase();
}
class Oe {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(t, n) {
    this.attribute = n, this.property = t;
  }
}
Oe.prototype.attribute = "";
Oe.prototype.booleanish = !1;
Oe.prototype.boolean = !1;
Oe.prototype.commaOrSpaceSeparated = !1;
Oe.prototype.commaSeparated = !1;
Oe.prototype.defined = !1;
Oe.prototype.mustUseProperty = !1;
Oe.prototype.number = !1;
Oe.prototype.overloadedBoolean = !1;
Oe.prototype.property = "";
Oe.prototype.spaceSeparated = !1;
Oe.prototype.space = void 0;
let g1 = 0;
const ee = an(), Ae = an(), ms = an(), U = an(), be = an(), Xt = an(), ze = an();
function an() {
  return 2 ** ++g1;
}
const hs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: ee,
  booleanish: Ae,
  commaOrSpaceSeparated: ze,
  commaSeparated: Xt,
  number: U,
  overloadedBoolean: ms,
  spaceSeparated: be
}, Symbol.toStringTag, { value: "Module" })), Eo = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(hs)
);
class Ya extends Oe {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(t, n, r, i) {
    let o = -1;
    if (super(t, n), kc(this, "space", i), typeof r == "number")
      for (; ++o < Eo.length; ) {
        const s = Eo[o];
        kc(this, Eo[o], (r & hs[s]) === hs[s]);
      }
  }
}
Ya.prototype.defined = !0;
function kc(e, t, n) {
  n && (e[t] = n);
}
function Nn(e) {
  const t = {}, n = {};
  for (const [r, i] of Object.entries(e.properties)) {
    const o = new Ya(
      r,
      e.transform(e.attributes || {}, r),
      i,
      e.space
    );
    e.mustUseProperty && e.mustUseProperty.includes(r) && (o.mustUseProperty = !0), t[r] = o, n[fs(r)] = r, n[fs(o.attribute)] = r;
  }
  return new Sr(t, n, e.space);
}
const Qm = Nn({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: Ae,
    ariaAutoComplete: null,
    ariaBusy: Ae,
    ariaChecked: Ae,
    ariaColCount: U,
    ariaColIndex: U,
    ariaColSpan: U,
    ariaControls: be,
    ariaCurrent: null,
    ariaDescribedBy: be,
    ariaDetails: null,
    ariaDisabled: Ae,
    ariaDropEffect: be,
    ariaErrorMessage: null,
    ariaExpanded: Ae,
    ariaFlowTo: be,
    ariaGrabbed: Ae,
    ariaHasPopup: null,
    ariaHidden: Ae,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: be,
    ariaLevel: U,
    ariaLive: null,
    ariaModal: Ae,
    ariaMultiLine: Ae,
    ariaMultiSelectable: Ae,
    ariaOrientation: null,
    ariaOwns: be,
    ariaPlaceholder: null,
    ariaPosInSet: U,
    ariaPressed: Ae,
    ariaReadOnly: Ae,
    ariaRelevant: null,
    ariaRequired: Ae,
    ariaRoleDescription: be,
    ariaRowCount: U,
    ariaRowIndex: U,
    ariaRowSpan: U,
    ariaSelected: Ae,
    ariaSetSize: U,
    ariaSort: null,
    ariaValueMax: U,
    ariaValueMin: U,
    ariaValueNow: U,
    ariaValueText: null,
    role: null
  },
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
});
function Um(e, t) {
  return t in e ? e[t] : t;
}
function Zm(e, t) {
  return Um(e, t.toLowerCase());
}
const x1 = Nn({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: Xt,
    acceptCharset: be,
    accessKey: be,
    action: null,
    allow: null,
    allowFullScreen: ee,
    allowPaymentRequest: ee,
    allowUserMedia: ee,
    alpha: ee,
    alt: null,
    as: null,
    async: ee,
    autoCapitalize: null,
    autoComplete: be,
    autoFocus: ee,
    autoPlay: ee,
    blocking: be,
    capture: null,
    charSet: null,
    checked: ee,
    cite: null,
    className: be,
    closedBy: null,
    colorSpace: null,
    cols: U,
    colSpan: U,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: Ae,
    controls: ee,
    controlsList: be,
    coords: U | Xt,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: ee,
    defer: ee,
    dir: null,
    dirName: null,
    disabled: ee,
    download: ms,
    draggable: Ae,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: ee,
    formTarget: null,
    headers: be,
    height: U,
    hidden: ms,
    high: U,
    href: null,
    hrefLang: null,
    htmlFor: be,
    httpEquiv: be,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: ee,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: ee,
    itemId: null,
    itemProp: be,
    itemRef: be,
    itemScope: ee,
    itemType: be,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: ee,
    low: U,
    manifest: null,
    max: null,
    maxLength: U,
    media: null,
    method: null,
    min: null,
    minLength: U,
    multiple: ee,
    muted: ee,
    name: null,
    nonce: null,
    noModule: ee,
    noValidate: ee,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: ee,
    optimum: U,
    pattern: null,
    ping: be,
    placeholder: null,
    playsInline: ee,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: ee,
    referrerPolicy: null,
    rel: be,
    required: ee,
    reversed: ee,
    rows: U,
    rowSpan: U,
    sandbox: be,
    scope: null,
    scoped: ee,
    seamless: ee,
    selected: ee,
    shadowRootClonable: ee,
    shadowRootCustomElementRegistry: ee,
    shadowRootDelegatesFocus: ee,
    shadowRootMode: null,
    shadowRootSerializable: ee,
    shape: null,
    size: U,
    sizes: null,
    slot: null,
    span: U,
    spellCheck: Ae,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: U,
    step: null,
    style: null,
    tabIndex: U,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: ee,
    useMap: null,
    value: Ae,
    width: U,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: be,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: U,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: U,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: ee,
    // Lists. Use CSS to reduce space between items instead
    declare: ee,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: U,
    // `<img>` and `<object>`
    leftMargin: U,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: U,
    // `<body>`
    marginWidth: U,
    // `<body>`
    noResize: ee,
    // `<frame>`
    noHref: ee,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: ee,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: ee,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: U,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: Ae,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: U,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: U,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: ee,
    disablePictureInPicture: ee,
    disableRemotePlayback: ee,
    exportParts: Xt,
    part: be,
    prefix: null,
    property: null,
    results: U,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: Zm
}), b1 = Nn({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: ze,
    accentHeight: U,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: U,
    amplitude: U,
    arabicForm: null,
    ascent: U,
    attributeName: null,
    attributeType: null,
    azimuth: U,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: U,
    by: null,
    calcMode: null,
    capHeight: U,
    className: be,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: U,
    diffuseConstant: U,
    direction: null,
    display: null,
    dur: null,
    divisor: U,
    dominantBaseline: null,
    download: ee,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: U,
    enableBackground: null,
    end: null,
    event: null,
    exponent: U,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: U,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: Xt,
    g2: Xt,
    glyphName: Xt,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: U,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: U,
    horizOriginX: U,
    horizOriginY: U,
    id: null,
    ideographic: U,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: U,
    k: U,
    k1: U,
    k2: U,
    k3: U,
    k4: U,
    kernelMatrix: ze,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: U,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: U,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: U,
    overlineThickness: U,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: U,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: be,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: U,
    pointsAtY: U,
    pointsAtZ: U,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: ze,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: ze,
    rev: ze,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: ze,
    requiredFeatures: ze,
    requiredFonts: ze,
    requiredFormats: ze,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: U,
    specularExponent: U,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: U,
    strikethroughThickness: U,
    string: null,
    stroke: null,
    strokeDashArray: ze,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: U,
    strokeOpacity: U,
    strokeWidth: null,
    style: null,
    surfaceScale: U,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: ze,
    tabIndex: U,
    tableValues: null,
    target: null,
    targetX: U,
    targetY: U,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: ze,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: U,
    underlineThickness: U,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: U,
    values: null,
    vAlphabetic: U,
    vMathematical: U,
    vectorEffect: null,
    vHanging: U,
    vIdeographic: U,
    version: null,
    vertAdvY: U,
    vertOriginX: U,
    vertOriginY: U,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: U,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Um
}), Wm = Nn({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  }
}), Jm = Nn({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: Zm
}), Vm = Nn({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
}), y1 = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
}, v1 = /[A-Z]/g, Ec = /-[a-z]/g, w1 = /^data[-\w.:]+$/i;
function A1(e, t) {
  const n = fs(t);
  let r = t, i = Oe;
  if (n in e.normal)
    return e.property[e.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && w1.test(t)) {
    if (t.charAt(4) === "-") {
      const o = t.slice(5).replace(Ec, E1);
      r = "data" + o.charAt(0).toUpperCase() + o.slice(1);
    } else {
      const o = t.slice(4);
      if (!Ec.test(o)) {
        let s = o.replace(v1, k1);
        s.charAt(0) !== "-" && (s = "-" + s), t = "data" + s;
      }
    }
    i = Ya;
  }
  return new i(r, t);
}
function k1(e) {
  return "-" + e.toLowerCase();
}
function E1(e) {
  return e.charAt(1).toUpperCase();
}
const C1 = Hm([Qm, x1, Wm, Jm, Vm], "html"), Ha = Hm([Qm, b1, Wm, Jm, Vm], "svg");
function j1(e) {
  return e.join(" ").trim();
}
var hn = {}, Co, Cc;
function M1() {
  if (Cc) return Co;
  Cc = 1;
  var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, t = /\n/g, n = /^\s*/, r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, i = /^:\s*/, o = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, s = /^[;\s]*/, a = /^\s+|\s+$/g, l = `
`, c = "/", f = "*", u = "", m = "comment", h = "declaration";
  function p(y, x) {
    if (typeof y != "string")
      throw new TypeError("First argument must be a string");
    if (!y) return [];
    x = x || {};
    var k = 1, w = 1;
    function j(P) {
      var M = P.match(t);
      M && (k += M.length);
      var D = P.lastIndexOf(l);
      w = ~D ? P.length - D : w + P.length;
    }
    function S() {
      var P = { line: k, column: w };
      return function(M) {
        return M.position = new E(P), B(), M;
      };
    }
    function E(P) {
      this.start = P, this.end = { line: k, column: w }, this.source = x.source;
    }
    E.prototype.content = y;
    function O(P) {
      var M = new Error(
        x.source + ":" + k + ":" + w + ": " + P
      );
      if (M.reason = P, M.filename = x.source, M.line = k, M.column = w, M.source = y, !x.silent) throw M;
    }
    function R(P) {
      var M = P.exec(y);
      if (M) {
        var D = M[0];
        return j(D), y = y.slice(D.length), M;
      }
    }
    function B() {
      R(n);
    }
    function C(P) {
      var M;
      for (P = P || []; M = I(); )
        M !== !1 && P.push(M);
      return P;
    }
    function I() {
      var P = S();
      if (!(c != y.charAt(0) || f != y.charAt(1))) {
        for (var M = 2; u != y.charAt(M) && (f != y.charAt(M) || c != y.charAt(M + 1)); )
          ++M;
        if (M += 2, u === y.charAt(M - 1))
          return O("End of comment missing");
        var D = y.slice(2, M - 2);
        return w += 2, j(D), y = y.slice(M), w += 2, P({
          type: m,
          comment: D
        });
      }
    }
    function z() {
      var P = S(), M = R(r);
      if (M) {
        if (I(), !R(i)) return O("property missing ':'");
        var D = R(o), F = P({
          type: h,
          property: g(M[0].replace(e, u)),
          value: D ? g(D[0].replace(e, u)) : u
        });
        return R(s), F;
      }
    }
    function W() {
      var P = [];
      C(P);
      for (var M; M = z(); )
        M !== !1 && (P.push(M), C(P));
      return P;
    }
    return B(), W();
  }
  function g(y) {
    return y ? y.replace(a, u) : u;
  }
  return Co = p, Co;
}
var jc;
function S1() {
  if (jc) return hn;
  jc = 1;
  var e = hn && hn.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty(hn, "__esModule", { value: !0 }), hn.default = n;
  const t = e(M1());
  function n(r, i) {
    let o = null;
    if (!r || typeof r != "string")
      return o;
    const s = (0, t.default)(r), a = typeof i == "function";
    return s.forEach((l) => {
      if (l.type !== "declaration")
        return;
      const { property: c, value: f } = l;
      a ? i(c, f, l) : f && (o = o || {}, o[c] = f);
    }), o;
  }
  return hn;
}
var Ln = {}, Mc;
function N1() {
  if (Mc) return Ln;
  Mc = 1, Object.defineProperty(Ln, "__esModule", { value: !0 }), Ln.camelCase = void 0;
  var e = /^--[a-zA-Z0-9_-]+$/, t = /-([a-z])/g, n = /^[^-]+$/, r = /^-(webkit|moz|ms|o|khtml)-/, i = /^-(ms)-/, o = function(c) {
    return !c || n.test(c) || e.test(c);
  }, s = function(c, f) {
    return f.toUpperCase();
  }, a = function(c, f) {
    return "".concat(f, "-");
  }, l = function(c, f) {
    return f === void 0 && (f = {}), o(c) ? c : (c = c.toLowerCase(), f.reactCompat ? c = c.replace(i, a) : c = c.replace(r, a), c.replace(t, s));
  };
  return Ln.camelCase = l, Ln;
}
var Yn, Sc;
function I1() {
  if (Sc) return Yn;
  Sc = 1;
  var e = Yn && Yn.__importDefault || function(i) {
    return i && i.__esModule ? i : { default: i };
  }, t = e(S1()), n = N1();
  function r(i, o) {
    var s = {};
    return !i || typeof i != "string" || (0, t.default)(i, function(a, l) {
      a && l && (s[(0, n.camelCase)(a, o)] = l);
    }), s;
  }
  return r.default = r, Yn = r, Yn;
}
var D1 = I1();
const R1 = /* @__PURE__ */ Ss(D1), qm = Xm("end"), Qa = Xm("start");
function Xm(e) {
  return t;
  function t(n) {
    const r = n && n.position && n.position[e] || {};
    if (typeof r.line == "number" && r.line > 0 && typeof r.column == "number" && r.column > 0)
      return {
        line: r.line,
        column: r.column,
        offset: typeof r.offset == "number" && r.offset > -1 ? r.offset : void 0
      };
  }
}
function P1(e) {
  const t = Qa(e), n = qm(e);
  if (t && n)
    return { start: t, end: n };
}
function Xn(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? Nc(e.position) : "start" in e || "end" in e ? Nc(e) : "line" in e || "column" in e ? ps(e) : "";
}
function ps(e) {
  return Ic(e && e.line) + ":" + Ic(e && e.column);
}
function Nc(e) {
  return ps(e && e.start) + "-" + ps(e && e.end);
}
function Ic(e) {
  return e && typeof e == "number" ? e : 1;
}
class Ie extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(t, n, r) {
    super(), typeof n == "string" && (r = n, n = void 0);
    let i = "", o = {}, s = !1;
    if (n && ("line" in n && "column" in n ? o = { place: n } : "start" in n && "end" in n ? o = { place: n } : "type" in n ? o = {
      ancestors: [n],
      place: n.position
    } : o = { ...n }), typeof t == "string" ? i = t : !o.cause && t && (s = !0, i = t.message, o.cause = t), !o.ruleId && !o.source && typeof r == "string") {
      const l = r.indexOf(":");
      l === -1 ? o.ruleId = r : (o.source = r.slice(0, l), o.ruleId = r.slice(l + 1));
    }
    if (!o.place && o.ancestors && o.ancestors) {
      const l = o.ancestors[o.ancestors.length - 1];
      l && (o.place = l.position);
    }
    const a = o.place && "start" in o.place ? o.place.start : o.place;
    this.ancestors = o.ancestors || void 0, this.cause = o.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = a ? a.line : void 0, this.name = Xn(o.place) || "1:1", this.place = o.place || void 0, this.reason = this.message, this.ruleId = o.ruleId || void 0, this.source = o.source || void 0, this.stack = s && o.cause && typeof o.cause.stack == "string" ? o.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
Ie.prototype.file = "";
Ie.prototype.name = "";
Ie.prototype.reason = "";
Ie.prototype.message = "";
Ie.prototype.stack = "";
Ie.prototype.column = void 0;
Ie.prototype.line = void 0;
Ie.prototype.ancestors = void 0;
Ie.prototype.cause = void 0;
Ie.prototype.fatal = void 0;
Ie.prototype.place = void 0;
Ie.prototype.ruleId = void 0;
Ie.prototype.source = void 0;
const Ua = {}.hasOwnProperty, O1 = /* @__PURE__ */ new Map(), T1 = /[A-Z]/g, z1 = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), B1 = /* @__PURE__ */ new Set(["td", "th"]), Km = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function G1(e, t) {
  if (!t || t.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const n = t.filePath || void 0;
  let r;
  if (t.development) {
    if (typeof t.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = W1(n, t.jsxDEV);
  } else {
    if (typeof t.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof t.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = Z1(n, t.jsx, t.jsxs);
  }
  const i = {
    Fragment: t.Fragment,
    ancestors: [],
    components: t.components || {},
    create: r,
    elementAttributeNameCase: t.elementAttributeNameCase || "react",
    evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
    filePath: n,
    ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
    passKeys: t.passKeys !== !1,
    passNode: t.passNode || !1,
    schema: t.space === "svg" ? Ha : C1,
    stylePropertyNameCase: t.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
  }, o = _m(i, e, void 0);
  return o && typeof o != "string" ? o : i.create(
    e,
    i.Fragment,
    { children: o || void 0 },
    void 0
  );
}
function _m(e, t, n) {
  if (t.type === "element")
    return F1(e, t, n);
  if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression")
    return L1(e, t);
  if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement")
    return H1(e, t, n);
  if (t.type === "mdxjsEsm")
    return Y1(e, t);
  if (t.type === "root")
    return Q1(e, t, n);
  if (t.type === "text")
    return U1(e, t);
}
function F1(e, t, n) {
  const r = e.schema;
  let i = r;
  t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = Ha, e.schema = i), e.ancestors.push(t);
  const o = eh(e, t.tagName, !1), s = J1(e, t);
  let a = Wa(e, t);
  return z1.has(t.tagName) && (a = a.filter(function(l) {
    return typeof l == "string" ? !p1(l) : !0;
  })), $m(e, s, o, t), Za(s, a), e.ancestors.pop(), e.schema = r, e.create(t, o, s, n);
}
function L1(e, t) {
  if (t.data && t.data.estree && e.evaluater) {
    const r = t.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    e.evaluater.evaluateExpression(r.expression);
  }
  mr(e, t.position);
}
function Y1(e, t) {
  if (t.data && t.data.estree && e.evaluater)
    return (
      /** @type {Child | undefined} */
      e.evaluater.evaluateProgram(t.data.estree)
    );
  mr(e, t.position);
}
function H1(e, t, n) {
  const r = e.schema;
  let i = r;
  t.name === "svg" && r.space === "html" && (i = Ha, e.schema = i), e.ancestors.push(t);
  const o = t.name === null ? e.Fragment : eh(e, t.name, !0), s = V1(e, t), a = Wa(e, t);
  return $m(e, s, o, t), Za(s, a), e.ancestors.pop(), e.schema = r, e.create(t, o, s, n);
}
function Q1(e, t, n) {
  const r = {};
  return Za(r, Wa(e, t)), e.create(t, e.Fragment, r, n);
}
function U1(e, t) {
  return t.value;
}
function $m(e, t, n, r) {
  typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function Za(e, t) {
  if (t.length > 0) {
    const n = t.length > 1 ? t : t[0];
    n && (e.children = n);
  }
}
function Z1(e, t, n) {
  return r;
  function r(i, o, s, a) {
    const c = Array.isArray(s.children) ? n : t;
    return a ? c(o, s, a) : c(o, s);
  }
}
function W1(e, t) {
  return n;
  function n(r, i, o, s) {
    const a = Array.isArray(o.children), l = Qa(r);
    return t(
      i,
      o,
      s,
      a,
      {
        columnNumber: l ? l.column - 1 : void 0,
        fileName: e,
        lineNumber: l ? l.line : void 0
      },
      void 0
    );
  }
}
function J1(e, t) {
  const n = {};
  let r, i;
  for (i in t.properties)
    if (i !== "children" && Ua.call(t.properties, i)) {
      const o = q1(e, i, t.properties[i]);
      if (o) {
        const [s, a] = o;
        e.tableCellAlignToStyle && s === "align" && typeof a == "string" && B1.has(t.tagName) ? r = a : n[s] = a;
      }
    }
  if (r) {
    const o = (
      /** @type {Style} */
      n.style || (n.style = {})
    );
    o[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
  }
  return n;
}
function V1(e, t) {
  const n = {};
  for (const r of t.attributes)
    if (r.type === "mdxJsxExpressionAttribute")
      if (r.data && r.data.estree && e.evaluater) {
        const o = r.data.estree.body[0];
        o.type;
        const s = o.expression;
        s.type;
        const a = s.properties[0];
        a.type, Object.assign(
          n,
          e.evaluater.evaluateExpression(a.argument)
        );
      } else
        mr(e, t.position);
    else {
      const i = r.name;
      let o;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && e.evaluater) {
          const a = r.value.data.estree.body[0];
          a.type, o = e.evaluater.evaluateExpression(a.expression);
        } else
          mr(e, t.position);
      else
        o = r.value === null ? !0 : r.value;
      n[i] = /** @type {Props[keyof Props]} */
      o;
    }
  return n;
}
function Wa(e, t) {
  const n = [];
  let r = -1;
  const i = e.passKeys ? /* @__PURE__ */ new Map() : O1;
  for (; ++r < t.children.length; ) {
    const o = t.children[r];
    let s;
    if (e.passKeys) {
      const l = o.type === "element" ? o.tagName : o.type === "mdxJsxFlowElement" || o.type === "mdxJsxTextElement" ? o.name : void 0;
      if (l) {
        const c = i.get(l) || 0;
        s = l + "-" + c, i.set(l, c + 1);
      }
    }
    const a = _m(e, o, s);
    a !== void 0 && n.push(a);
  }
  return n;
}
function q1(e, t, n) {
  const r = A1(e.schema, t);
  if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
    if (Array.isArray(n) && (n = r.commaSeparated ? u1(n) : j1(n)), r.property === "style") {
      let i = typeof n == "object" ? n : X1(e, String(n));
      return e.stylePropertyNameCase === "css" && (i = K1(i)), ["style", i];
    }
    return [
      e.elementAttributeNameCase === "react" && r.space ? y1[r.property] || r.property : r.attribute,
      n
    ];
  }
}
function X1(e, t) {
  try {
    return R1(t, { reactCompat: !0 });
  } catch (n) {
    if (e.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      n
    ), i = new Ie("Cannot parse `style` attribute", {
      ancestors: e.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = e.filePath || void 0, i.url = Km + "#cannot-parse-style-attribute", i;
  }
}
function eh(e, t, n) {
  let r;
  if (!n)
    r = { type: "Literal", value: t };
  else if (t.includes(".")) {
    const i = t.split(".");
    let o = -1, s;
    for (; ++o < i.length; ) {
      const a = wc(i[o]) ? { type: "Identifier", name: i[o] } : { type: "Literal", value: i[o] };
      s = s ? {
        type: "MemberExpression",
        object: s,
        property: a,
        computed: !!(o && a.type === "Literal"),
        optional: !1
      } : a;
    }
    r = s;
  } else
    r = wc(t) && !/^[a-z]/.test(t) ? { type: "Identifier", name: t } : { type: "Literal", value: t };
  if (r.type === "Literal") {
    const i = (
      /** @type {string | number} */
      r.value
    );
    return Ua.call(e.components, i) ? e.components[i] : i;
  }
  if (e.evaluater)
    return e.evaluater.evaluateExpression(r);
  mr(e);
}
function mr(e, t) {
  const n = new Ie(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: e.ancestors,
      place: t,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw n.file = e.filePath || void 0, n.url = Km + "#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function K1(e) {
  const t = {};
  let n;
  for (n in e)
    Ua.call(e, n) && (t[_1(n)] = e[n]);
  return t;
}
function _1(e) {
  let t = e.replace(T1, $1);
  return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function $1(e) {
  return "-" + e.toLowerCase();
}
const jo = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: [
    "audio",
    "embed",
    "iframe",
    "img",
    "input",
    "script",
    "source",
    "track",
    "video"
  ]
}, ek = {};
function Ja(e, t) {
  const n = ek, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return th(e, r, i);
}
function th(e, t, n) {
  if (tk(e)) {
    if ("value" in e)
      return e.type === "html" && !n ? "" : e.value;
    if (t && "alt" in e && e.alt)
      return e.alt;
    if ("children" in e)
      return Dc(e.children, t, n);
  }
  return Array.isArray(e) ? Dc(e, t, n) : "";
}
function Dc(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; )
    r[i] = th(e[i], t, n);
  return r.join("");
}
function tk(e) {
  return !!(e && typeof e == "object");
}
const Rc = document.createElement("i");
function Va(e) {
  const t = "&" + e + ";";
  Rc.innerHTML = t;
  const n = Rc.textContent;
  return n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n;
}
function Le(e, t, n, r) {
  const i = e.length;
  let o = 0, s;
  if (t < 0 ? t = -t > i ? 0 : i + t : t = t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4)
    s = Array.from(r), s.unshift(t, n), e.splice(...s);
  else
    for (n && e.splice(t, n); o < r.length; )
      s = r.slice(o, o + 1e4), s.unshift(t, 0), e.splice(...s), o += 1e4, t += 1e4;
}
function He(e, t) {
  return e.length > 0 ? (Le(e, e.length, 0, t), e) : t;
}
const Pc = {}.hasOwnProperty;
function nh(e) {
  const t = {};
  let n = -1;
  for (; ++n < e.length; )
    nk(t, e[n]);
  return t;
}
function nk(e, t) {
  let n;
  for (n in t) {
    const i = (Pc.call(e, n) ? e[n] : void 0) || (e[n] = {}), o = t[n];
    let s;
    if (o)
      for (s in o) {
        Pc.call(i, s) || (i[s] = []);
        const a = o[s];
        rk(
          // @ts-expect-error Looks like a list.
          i[s],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function rk(e, t) {
  let n = -1;
  const r = [];
  for (; ++n < t.length; )
    (t[n].add === "after" ? e : r).push(t[n]);
  Le(e, 0, 0, r);
}
function rh(e, t) {
  const n = Number.parseInt(e, t);
  return (
    // C0 except for HT, LF, FF, CR, space.
    n < 9 || n === 11 || n > 13 && n < 32 || // Control character (DEL) of C0, and C1 controls.
    n > 126 && n < 160 || // Lone high surrogates and low surrogates.
    n > 55295 && n < 57344 || // Noncharacters.
    n > 64975 && n < 65008 || /* eslint-disable no-bitwise */
    (n & 65535) === 65535 || (n & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    n > 1114111 ? "�" : String.fromCodePoint(n)
  );
}
function Xe(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const De = Yt(/[A-Za-z]/), Se = Yt(/[\dA-Za-z]/), ik = Yt(/[#-'*+\--9=?A-Z^-~]/);
function yi(e) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    e !== null && (e < 32 || e === 127)
  );
}
const gs = Yt(/\d/), ok = Yt(/[\dA-Fa-f]/), sk = Yt(/[!-/:-@[-`{-~]/);
function $(e) {
  return e !== null && e < -2;
}
function ye(e) {
  return e !== null && (e < 0 || e === 32);
}
function se(e) {
  return e === -2 || e === -1 || e === 32;
}
const Ki = Yt(new RegExp("\\p{P}|\\p{S}", "u")), tn = Yt(/\s/);
function Yt(e) {
  return t;
  function t(n) {
    return n !== null && n > -1 && e.test(String.fromCharCode(n));
  }
}
function In(e) {
  const t = [];
  let n = -1, r = 0, i = 0;
  for (; ++n < e.length; ) {
    const o = e.charCodeAt(n);
    let s = "";
    if (o === 37 && Se(e.charCodeAt(n + 1)) && Se(e.charCodeAt(n + 2)))
      i = 2;
    else if (o < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o)) || (s = String.fromCharCode(o));
    else if (o > 55295 && o < 57344) {
      const a = e.charCodeAt(n + 1);
      o < 56320 && a > 56319 && a < 57344 ? (s = String.fromCharCode(o, a), i = 1) : s = "�";
    } else
      s = String.fromCharCode(o);
    s && (t.push(e.slice(r, n), encodeURIComponent(s)), r = n + i + 1, s = ""), i && (n += i, i = 0);
  }
  return t.join("") + e.slice(r);
}
function ue(e, t, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let o = 0;
  return s;
  function s(l) {
    return se(l) ? (e.enter(n), a(l)) : t(l);
  }
  function a(l) {
    return se(l) && o++ < i ? (e.consume(l), a) : (e.exit(n), t(l));
  }
}
const ak = {
  tokenize: lk
};
function lk(e) {
  const t = e.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return t;
  function r(a) {
    if (a === null) {
      e.consume(a);
      return;
    }
    return e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), ue(e, t, "linePrefix");
  }
  function i(a) {
    return e.enter("paragraph"), o(a);
  }
  function o(a) {
    const l = e.enter("chunkText", {
      contentType: "text",
      previous: n
    });
    return n && (n.next = l), n = l, s(a);
  }
  function s(a) {
    if (a === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(a);
      return;
    }
    return $(a) ? (e.consume(a), e.exit("chunkText"), o) : (e.consume(a), s);
  }
}
const ck = {
  tokenize: uk
}, Oc = {
  tokenize: dk
};
function uk(e) {
  const t = this, n = [];
  let r = 0, i, o, s;
  return a;
  function a(w) {
    if (r < n.length) {
      const j = n[r];
      return t.containerState = j[1], e.attempt(j[0].continuation, l, c)(w);
    }
    return c(w);
  }
  function l(w) {
    if (r++, t.containerState._closeFlow) {
      t.containerState._closeFlow = void 0, i && k();
      const j = t.events.length;
      let S = j, E;
      for (; S--; )
        if (t.events[S][0] === "exit" && t.events[S][1].type === "chunkFlow") {
          E = t.events[S][1].end;
          break;
        }
      x(r);
      let O = j;
      for (; O < t.events.length; )
        t.events[O][1].end = {
          ...E
        }, O++;
      return Le(t.events, S + 1, 0, t.events.slice(j)), t.events.length = O, c(w);
    }
    return a(w);
  }
  function c(w) {
    if (r === n.length) {
      if (!i)
        return m(w);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return p(w);
      t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return t.containerState = {}, e.check(Oc, f, u)(w);
  }
  function f(w) {
    return i && k(), x(r), m(w);
  }
  function u(w) {
    return t.parser.lazy[t.now().line] = r !== n.length, s = t.now().offset, p(w);
  }
  function m(w) {
    return t.containerState = {}, e.attempt(Oc, h, p)(w);
  }
  function h(w) {
    return r++, n.push([t.currentConstruct, t.containerState]), m(w);
  }
  function p(w) {
    if (w === null) {
      i && k(), x(0), e.consume(w);
      return;
    }
    return i = i || t.parser.flow(t.now()), e.enter("chunkFlow", {
      _tokenizer: i,
      contentType: "flow",
      previous: o
    }), g(w);
  }
  function g(w) {
    if (w === null) {
      y(e.exit("chunkFlow"), !0), x(0), e.consume(w);
      return;
    }
    return $(w) ? (e.consume(w), y(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, a) : (e.consume(w), g);
  }
  function y(w, j) {
    const S = t.sliceStream(w);
    if (j && S.push(null), w.previous = o, o && (o.next = w), o = w, i.defineSkip(w.start), i.write(S), t.parser.lazy[w.start.line]) {
      let E = i.events.length;
      for (; E--; )
        if (
          // The token starts before the line ending…
          i.events[E][1].start.offset < s && // …and either is not ended yet…
          (!i.events[E][1].end || // …or ends after it.
          i.events[E][1].end.offset > s)
        )
          return;
      const O = t.events.length;
      let R = O, B, C;
      for (; R--; )
        if (t.events[R][0] === "exit" && t.events[R][1].type === "chunkFlow") {
          if (B) {
            C = t.events[R][1].end;
            break;
          }
          B = !0;
        }
      for (x(r), E = O; E < t.events.length; )
        t.events[E][1].end = {
          ...C
        }, E++;
      Le(t.events, R + 1, 0, t.events.slice(O)), t.events.length = E;
    }
  }
  function x(w) {
    let j = n.length;
    for (; j-- > w; ) {
      const S = n[j];
      t.containerState = S[1], S[0].exit.call(t, e);
    }
    n.length = w;
  }
  function k() {
    i.write([null]), o = void 0, i = void 0, t.containerState._closeFlow = void 0;
  }
}
function dk(e, t, n) {
  return ue(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function Cn(e) {
  if (e === null || ye(e) || tn(e))
    return 1;
  if (Ki(e))
    return 2;
}
function _i(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; ) {
    const o = e[i].resolveAll;
    o && !r.includes(o) && (t = o(t, n), r.push(o));
  }
  return t;
}
const xs = {
  name: "attention",
  resolveAll: fk,
  tokenize: mk
};
function fk(e, t) {
  let n = -1, r, i, o, s, a, l, c, f;
  for (; ++n < e.length; )
    if (e[n][0] === "enter" && e[n][1].type === "attentionSequence" && e[n][1]._close) {
      for (r = n; r--; )
        if (e[r][0] === "exit" && e[r][1].type === "attentionSequence" && e[r][1]._open && // If the markers are the same:
        t.sliceSerialize(e[r][1]).charCodeAt(0) === t.sliceSerialize(e[n][1]).charCodeAt(0)) {
          if ((e[r][1]._close || e[n][1]._open) && (e[n][1].end.offset - e[n][1].start.offset) % 3 && !((e[r][1].end.offset - e[r][1].start.offset + e[n][1].end.offset - e[n][1].start.offset) % 3))
            continue;
          l = e[r][1].end.offset - e[r][1].start.offset > 1 && e[n][1].end.offset - e[n][1].start.offset > 1 ? 2 : 1;
          const u = {
            ...e[r][1].end
          }, m = {
            ...e[n][1].start
          };
          Tc(u, -l), Tc(m, l), s = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: u,
            end: {
              ...e[r][1].end
            }
          }, a = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...e[n][1].start
            },
            end: m
          }, o = {
            type: l > 1 ? "strongText" : "emphasisText",
            start: {
              ...e[r][1].end
            },
            end: {
              ...e[n][1].start
            }
          }, i = {
            type: l > 1 ? "strong" : "emphasis",
            start: {
              ...s.start
            },
            end: {
              ...a.end
            }
          }, e[r][1].end = {
            ...s.start
          }, e[n][1].start = {
            ...a.end
          }, c = [], e[r][1].end.offset - e[r][1].start.offset && (c = He(c, [["enter", e[r][1], t], ["exit", e[r][1], t]])), c = He(c, [["enter", i, t], ["enter", s, t], ["exit", s, t], ["enter", o, t]]), c = He(c, _i(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), c = He(c, [["exit", o, t], ["enter", a, t], ["exit", a, t], ["exit", i, t]]), e[n][1].end.offset - e[n][1].start.offset ? (f = 2, c = He(c, [["enter", e[n][1], t], ["exit", e[n][1], t]])) : f = 0, Le(e, r - 1, n - r + 3, c), n = r + c.length - f - 2;
          break;
        }
    }
  for (n = -1; ++n < e.length; )
    e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
  return e;
}
function mk(e, t) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = Cn(r);
  let o;
  return s;
  function s(l) {
    return o = l, e.enter("attentionSequence"), a(l);
  }
  function a(l) {
    if (l === o)
      return e.consume(l), a;
    const c = e.exit("attentionSequence"), f = Cn(l), u = !f || f === 2 && i || n.includes(l), m = !i || i === 2 && f || n.includes(r);
    return c._open = !!(o === 42 ? u : u && (i || !m)), c._close = !!(o === 42 ? m : m && (f || !u)), t(l);
  }
}
function Tc(e, t) {
  e.column += t, e.offset += t, e._bufferIndex += t;
}
const hk = {
  name: "autolink",
  tokenize: pk
};
function pk(e, t, n) {
  let r = 0;
  return i;
  function i(h) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), o;
  }
  function o(h) {
    return De(h) ? (e.consume(h), s) : h === 64 ? n(h) : c(h);
  }
  function s(h) {
    return h === 43 || h === 45 || h === 46 || Se(h) ? (r = 1, a(h)) : c(h);
  }
  function a(h) {
    return h === 58 ? (e.consume(h), r = 0, l) : (h === 43 || h === 45 || h === 46 || Se(h)) && r++ < 32 ? (e.consume(h), a) : (r = 0, c(h));
  }
  function l(h) {
    return h === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : h === null || h === 32 || h === 60 || yi(h) ? n(h) : (e.consume(h), l);
  }
  function c(h) {
    return h === 64 ? (e.consume(h), f) : ik(h) ? (e.consume(h), c) : n(h);
  }
  function f(h) {
    return Se(h) ? u(h) : n(h);
  }
  function u(h) {
    return h === 46 ? (e.consume(h), r = 0, f) : h === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : m(h);
  }
  function m(h) {
    if ((h === 45 || Se(h)) && r++ < 63) {
      const p = h === 45 ? m : u;
      return e.consume(h), p;
    }
    return n(h);
  }
}
const Nr = {
  partial: !0,
  tokenize: gk
};
function gk(e, t, n) {
  return r;
  function r(o) {
    return se(o) ? ue(e, i, "linePrefix")(o) : i(o);
  }
  function i(o) {
    return o === null || $(o) ? t(o) : n(o);
  }
}
const ih = {
  continuation: {
    tokenize: bk
  },
  exit: yk,
  name: "blockQuote",
  tokenize: xk
};
function xk(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    if (s === 62) {
      const a = r.containerState;
      return a.open || (e.enter("blockQuote", {
        _container: !0
      }), a.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(s), e.exit("blockQuoteMarker"), o;
    }
    return n(s);
  }
  function o(s) {
    return se(s) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(s), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(s));
  }
}
function bk(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return se(s) ? ue(e, o, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(s) : o(s);
  }
  function o(s) {
    return e.attempt(ih, t, n)(s);
  }
}
function yk(e) {
  e.exit("blockQuote");
}
const oh = {
  name: "characterEscape",
  tokenize: vk
};
function vk(e, t, n) {
  return r;
  function r(o) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(o), e.exit("escapeMarker"), i;
  }
  function i(o) {
    return sk(o) ? (e.enter("characterEscapeValue"), e.consume(o), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(o);
  }
}
const sh = {
  name: "characterReference",
  tokenize: wk
};
function wk(e, t, n) {
  const r = this;
  let i = 0, o, s;
  return a;
  function a(u) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(u), e.exit("characterReferenceMarker"), l;
  }
  function l(u) {
    return u === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(u), e.exit("characterReferenceMarkerNumeric"), c) : (e.enter("characterReferenceValue"), o = 31, s = Se, f(u));
  }
  function c(u) {
    return u === 88 || u === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(u), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), o = 6, s = ok, f) : (e.enter("characterReferenceValue"), o = 7, s = gs, f(u));
  }
  function f(u) {
    if (u === 59 && i) {
      const m = e.exit("characterReferenceValue");
      return s === Se && !Va(r.sliceSerialize(m)) ? n(u) : (e.enter("characterReferenceMarker"), e.consume(u), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
    }
    return s(u) && i++ < o ? (e.consume(u), f) : n(u);
  }
}
const zc = {
  partial: !0,
  tokenize: kk
}, Bc = {
  concrete: !0,
  name: "codeFenced",
  tokenize: Ak
};
function Ak(e, t, n) {
  const r = this, i = {
    partial: !0,
    tokenize: S
  };
  let o = 0, s = 0, a;
  return l;
  function l(E) {
    return c(E);
  }
  function c(E) {
    const O = r.events[r.events.length - 1];
    return o = O && O[1].type === "linePrefix" ? O[2].sliceSerialize(O[1], !0).length : 0, a = E, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), f(E);
  }
  function f(E) {
    return E === a ? (s++, e.consume(E), f) : s < 3 ? n(E) : (e.exit("codeFencedFenceSequence"), se(E) ? ue(e, u, "whitespace")(E) : u(E));
  }
  function u(E) {
    return E === null || $(E) ? (e.exit("codeFencedFence"), r.interrupt ? t(E) : e.check(zc, g, j)(E)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), m(E));
  }
  function m(E) {
    return E === null || $(E) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), u(E)) : se(E) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), ue(e, h, "whitespace")(E)) : E === 96 && E === a ? n(E) : (e.consume(E), m);
  }
  function h(E) {
    return E === null || $(E) ? u(E) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), p(E));
  }
  function p(E) {
    return E === null || $(E) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), u(E)) : E === 96 && E === a ? n(E) : (e.consume(E), p);
  }
  function g(E) {
    return e.attempt(i, j, y)(E);
  }
  function y(E) {
    return e.enter("lineEnding"), e.consume(E), e.exit("lineEnding"), x;
  }
  function x(E) {
    return o > 0 && se(E) ? ue(e, k, "linePrefix", o + 1)(E) : k(E);
  }
  function k(E) {
    return E === null || $(E) ? e.check(zc, g, j)(E) : (e.enter("codeFlowValue"), w(E));
  }
  function w(E) {
    return E === null || $(E) ? (e.exit("codeFlowValue"), k(E)) : (e.consume(E), w);
  }
  function j(E) {
    return e.exit("codeFenced"), t(E);
  }
  function S(E, O, R) {
    let B = 0;
    return C;
    function C(M) {
      return E.enter("lineEnding"), E.consume(M), E.exit("lineEnding"), I;
    }
    function I(M) {
      return E.enter("codeFencedFence"), se(M) ? ue(E, z, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(M) : z(M);
    }
    function z(M) {
      return M === a ? (E.enter("codeFencedFenceSequence"), W(M)) : R(M);
    }
    function W(M) {
      return M === a ? (B++, E.consume(M), W) : B >= s ? (E.exit("codeFencedFenceSequence"), se(M) ? ue(E, P, "whitespace")(M) : P(M)) : R(M);
    }
    function P(M) {
      return M === null || $(M) ? (E.exit("codeFencedFence"), O(M)) : R(M);
    }
  }
}
function kk(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return s === null ? n(s) : (e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), o);
  }
  function o(s) {
    return r.parser.lazy[r.now().line] ? n(s) : t(s);
  }
}
const Mo = {
  name: "codeIndented",
  tokenize: Ck
}, Ek = {
  partial: !0,
  tokenize: jk
};
function Ck(e, t, n) {
  const r = this;
  return i;
  function i(c) {
    return e.enter("codeIndented"), ue(e, o, "linePrefix", 5)(c);
  }
  function o(c) {
    const f = r.events[r.events.length - 1];
    return f && f[1].type === "linePrefix" && f[2].sliceSerialize(f[1], !0).length >= 4 ? s(c) : n(c);
  }
  function s(c) {
    return c === null ? l(c) : $(c) ? e.attempt(Ek, s, l)(c) : (e.enter("codeFlowValue"), a(c));
  }
  function a(c) {
    return c === null || $(c) ? (e.exit("codeFlowValue"), s(c)) : (e.consume(c), a);
  }
  function l(c) {
    return e.exit("codeIndented"), t(c);
  }
}
function jk(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return r.parser.lazy[r.now().line] ? n(s) : $(s) ? (e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), i) : ue(e, o, "linePrefix", 5)(s);
  }
  function o(s) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(s) : $(s) ? i(s) : n(s);
  }
}
const Mk = {
  name: "codeText",
  previous: Nk,
  resolve: Sk,
  tokenize: Ik
};
function Sk(e) {
  let t = e.length - 4, n = 3, r, i;
  if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
    for (r = n; ++r < t; )
      if (e[r][1].type === "codeTextData") {
        e[n][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", n += 2, t -= 2;
        break;
      }
  }
  for (r = n - 1, t++; ++r <= t; )
    i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "codeTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
  return e;
}
function Nk(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function Ik(e, t, n) {
  let r = 0, i, o;
  return s;
  function s(u) {
    return e.enter("codeText"), e.enter("codeTextSequence"), a(u);
  }
  function a(u) {
    return u === 96 ? (e.consume(u), r++, a) : (e.exit("codeTextSequence"), l(u));
  }
  function l(u) {
    return u === null ? n(u) : u === 32 ? (e.enter("space"), e.consume(u), e.exit("space"), l) : u === 96 ? (o = e.enter("codeTextSequence"), i = 0, f(u)) : $(u) ? (e.enter("lineEnding"), e.consume(u), e.exit("lineEnding"), l) : (e.enter("codeTextData"), c(u));
  }
  function c(u) {
    return u === null || u === 32 || u === 96 || $(u) ? (e.exit("codeTextData"), l(u)) : (e.consume(u), c);
  }
  function f(u) {
    return u === 96 ? (e.consume(u), i++, f) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(u)) : (o.type = "codeTextData", c(u));
  }
}
class Dk {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(t) {
    this.left = t ? [...t] : [], this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(t) {
    if (t < 0 || t >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + t + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return t < this.left.length ? this.left[t] : this.right[this.right.length - t + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(t, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length ? this.left.slice(t, r) : t > this.left.length ? this.right.slice(this.right.length - r + this.left.length, this.right.length - t + this.left.length).reverse() : this.left.slice(t).concat(this.right.slice(this.right.length - r + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(t, n, r) {
    const i = n || 0;
    this.setCursor(Math.trunc(t));
    const o = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return r && Hn(this.left, r), o.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(t) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(t);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(t) {
    this.setCursor(Number.POSITIVE_INFINITY), Hn(this.left, t);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(t) {
    this.setCursor(0), this.right.push(t);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(t) {
    this.setCursor(0), Hn(this.right, t.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(t) {
    if (!(t === this.left.length || t > this.left.length && this.right.length === 0 || t < 0 && this.left.length === 0))
      if (t < this.left.length) {
        const n = this.left.splice(t, Number.POSITIVE_INFINITY);
        Hn(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - t, Number.POSITIVE_INFINITY);
        Hn(this.left, n.reverse());
      }
  }
}
function Hn(e, t) {
  let n = 0;
  if (t.length < 1e4)
    e.push(...t);
  else
    for (; n < t.length; )
      e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
function ah(e) {
  const t = {};
  let n = -1, r, i, o, s, a, l, c;
  const f = new Dk(e);
  for (; ++n < f.length; ) {
    for (; n in t; )
      n = t[n];
    if (r = f.get(n), n && r[1].type === "chunkFlow" && f.get(n - 1)[1].type === "listItemPrefix" && (l = r[1]._tokenizer.events, o = 0, o < l.length && l[o][1].type === "lineEndingBlank" && (o += 2), o < l.length && l[o][1].type === "content"))
      for (; ++o < l.length && l[o][1].type !== "content"; )
        l[o][1].type === "chunkText" && (l[o][1]._isInFirstContentOfListItem = !0, o++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(t, Rk(f, n)), n = t[n], c = !0);
    else if (r[1]._container) {
      for (o = n, i = void 0; o--; )
        if (s = f.get(o), s[1].type === "lineEnding" || s[1].type === "lineEndingBlank")
          s[0] === "enter" && (i && (f.get(i)[1].type = "lineEndingBlank"), s[1].type = "lineEnding", i = o);
        else if (!(s[1].type === "linePrefix" || s[1].type === "listItemIndent")) break;
      i && (r[1].end = {
        ...f.get(i)[1].start
      }, a = f.slice(i, n), a.unshift(r), f.splice(i, n - i + 1, a));
    }
  }
  return Le(e, 0, Number.POSITIVE_INFINITY, f.slice(0)), !c;
}
function Rk(e, t) {
  const n = e.get(t)[1], r = e.get(t)[2];
  let i = t - 1;
  const o = [];
  let s = n._tokenizer;
  s || (s = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (s._contentTypeTextTrailing = !0));
  const a = s.events, l = [], c = {};
  let f, u, m = -1, h = n, p = 0, g = 0;
  const y = [g];
  for (; h; ) {
    for (; e.get(++i)[1] !== h; )
      ;
    o.push(i), h._tokenizer || (f = r.sliceStream(h), h.next || f.push(null), u && s.defineSkip(h.start), h._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = !0), s.write(f), h._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = void 0)), u = h, h = h.next;
  }
  for (h = n; ++m < a.length; )
    // Find a void token that includes a break.
    a[m][0] === "exit" && a[m - 1][0] === "enter" && a[m][1].type === a[m - 1][1].type && a[m][1].start.line !== a[m][1].end.line && (g = m + 1, y.push(g), h._tokenizer = void 0, h.previous = void 0, h = h.next);
  for (s.events = [], h ? (h._tokenizer = void 0, h.previous = void 0) : y.pop(), m = y.length; m--; ) {
    const x = a.slice(y[m], y[m + 1]), k = o.pop();
    l.push([k, k + x.length - 1]), e.splice(k, 2, x);
  }
  for (l.reverse(), m = -1; ++m < l.length; )
    c[p + l[m][0]] = p + l[m][1], p += l[m][1] - l[m][0] - 1;
  return c;
}
const Pk = {
  resolve: Tk,
  tokenize: zk
}, Ok = {
  partial: !0,
  tokenize: Bk
};
function Tk(e) {
  return ah(e), e;
}
function zk(e, t) {
  let n;
  return r;
  function r(a) {
    return e.enter("content"), n = e.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? o(a) : $(a) ? e.check(Ok, s, o)(a) : (e.consume(a), i);
  }
  function o(a) {
    return e.exit("chunkContent"), e.exit("content"), t(a);
  }
  function s(a) {
    return e.consume(a), e.exit("chunkContent"), n.next = e.enter("chunkContent", {
      contentType: "content",
      previous: n
    }), n = n.next, i;
  }
}
function Bk(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), ue(e, o, "linePrefix");
  }
  function o(s) {
    if (s === null || $(s))
      return n(s);
    const a = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(s) : e.interrupt(r.parser.constructs.flow, n, t)(s);
  }
}
function lh(e, t, n, r, i, o, s, a, l) {
  const c = l || Number.POSITIVE_INFINITY;
  let f = 0;
  return u;
  function u(x) {
    return x === 60 ? (e.enter(r), e.enter(i), e.enter(o), e.consume(x), e.exit(o), m) : x === null || x === 32 || x === 41 || yi(x) ? n(x) : (e.enter(r), e.enter(s), e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), g(x));
  }
  function m(x) {
    return x === 62 ? (e.enter(o), e.consume(x), e.exit(o), e.exit(i), e.exit(r), t) : (e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), h(x));
  }
  function h(x) {
    return x === 62 ? (e.exit("chunkString"), e.exit(a), m(x)) : x === null || x === 60 || $(x) ? n(x) : (e.consume(x), x === 92 ? p : h);
  }
  function p(x) {
    return x === 60 || x === 62 || x === 92 ? (e.consume(x), h) : h(x);
  }
  function g(x) {
    return !f && (x === null || x === 41 || ye(x)) ? (e.exit("chunkString"), e.exit(a), e.exit(s), e.exit(r), t(x)) : f < c && x === 40 ? (e.consume(x), f++, g) : x === 41 ? (e.consume(x), f--, g) : x === null || x === 32 || x === 40 || yi(x) ? n(x) : (e.consume(x), x === 92 ? y : g);
  }
  function y(x) {
    return x === 40 || x === 41 || x === 92 ? (e.consume(x), g) : g(x);
  }
}
function ch(e, t, n, r, i, o) {
  const s = this;
  let a = 0, l;
  return c;
  function c(h) {
    return e.enter(r), e.enter(i), e.consume(h), e.exit(i), e.enter(o), f;
  }
  function f(h) {
    return a > 999 || h === null || h === 91 || h === 93 && !l || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    h === 94 && !a && "_hiddenFootnoteSupport" in s.parser.constructs ? n(h) : h === 93 ? (e.exit(o), e.enter(i), e.consume(h), e.exit(i), e.exit(r), t) : $(h) ? (e.enter("lineEnding"), e.consume(h), e.exit("lineEnding"), f) : (e.enter("chunkString", {
      contentType: "string"
    }), u(h));
  }
  function u(h) {
    return h === null || h === 91 || h === 93 || $(h) || a++ > 999 ? (e.exit("chunkString"), f(h)) : (e.consume(h), l || (l = !se(h)), h === 92 ? m : u);
  }
  function m(h) {
    return h === 91 || h === 92 || h === 93 ? (e.consume(h), a++, u) : u(h);
  }
}
function uh(e, t, n, r, i, o) {
  let s;
  return a;
  function a(m) {
    return m === 34 || m === 39 || m === 40 ? (e.enter(r), e.enter(i), e.consume(m), e.exit(i), s = m === 40 ? 41 : m, l) : n(m);
  }
  function l(m) {
    return m === s ? (e.enter(i), e.consume(m), e.exit(i), e.exit(r), t) : (e.enter(o), c(m));
  }
  function c(m) {
    return m === s ? (e.exit(o), l(s)) : m === null ? n(m) : $(m) ? (e.enter("lineEnding"), e.consume(m), e.exit("lineEnding"), ue(e, c, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), f(m));
  }
  function f(m) {
    return m === s || m === null || $(m) ? (e.exit("chunkString"), c(m)) : (e.consume(m), m === 92 ? u : f);
  }
  function u(m) {
    return m === s || m === 92 ? (e.consume(m), f) : f(m);
  }
}
function Kn(e, t) {
  let n;
  return r;
  function r(i) {
    return $(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : se(i) ? ue(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
  }
}
const Gk = {
  name: "definition",
  tokenize: Lk
}, Fk = {
  partial: !0,
  tokenize: Yk
};
function Lk(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(h) {
    return e.enter("definition"), s(h);
  }
  function s(h) {
    return ch.call(
      r,
      e,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(h);
  }
  function a(h) {
    return i = Xe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), h === 58 ? (e.enter("definitionMarker"), e.consume(h), e.exit("definitionMarker"), l) : n(h);
  }
  function l(h) {
    return ye(h) ? Kn(e, c)(h) : c(h);
  }
  function c(h) {
    return lh(
      e,
      f,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(h);
  }
  function f(h) {
    return e.attempt(Fk, u, u)(h);
  }
  function u(h) {
    return se(h) ? ue(e, m, "whitespace")(h) : m(h);
  }
  function m(h) {
    return h === null || $(h) ? (e.exit("definition"), r.parser.defined.push(i), t(h)) : n(h);
  }
}
function Yk(e, t, n) {
  return r;
  function r(a) {
    return ye(a) ? Kn(e, i)(a) : n(a);
  }
  function i(a) {
    return uh(e, o, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function o(a) {
    return se(a) ? ue(e, s, "whitespace")(a) : s(a);
  }
  function s(a) {
    return a === null || $(a) ? t(a) : n(a);
  }
}
const Hk = {
  name: "hardBreakEscape",
  tokenize: Qk
};
function Qk(e, t, n) {
  return r;
  function r(o) {
    return e.enter("hardBreakEscape"), e.consume(o), i;
  }
  function i(o) {
    return $(o) ? (e.exit("hardBreakEscape"), t(o)) : n(o);
  }
}
const Uk = {
  name: "headingAtx",
  resolve: Zk,
  tokenize: Wk
};
function Zk(e, t) {
  let n = e.length - 2, r = 3, i, o;
  return e[r][1].type === "whitespace" && (r += 2), n - 2 > r && e[n][1].type === "whitespace" && (n -= 2), e[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && e[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
    type: "atxHeadingText",
    start: e[r][1].start,
    end: e[n][1].end
  }, o = {
    type: "chunkText",
    start: e[r][1].start,
    end: e[n][1].end,
    contentType: "text"
  }, Le(e, r, n - r + 1, [["enter", i, t], ["enter", o, t], ["exit", o, t], ["exit", i, t]])), e;
}
function Wk(e, t, n) {
  let r = 0;
  return i;
  function i(f) {
    return e.enter("atxHeading"), o(f);
  }
  function o(f) {
    return e.enter("atxHeadingSequence"), s(f);
  }
  function s(f) {
    return f === 35 && r++ < 6 ? (e.consume(f), s) : f === null || ye(f) ? (e.exit("atxHeadingSequence"), a(f)) : n(f);
  }
  function a(f) {
    return f === 35 ? (e.enter("atxHeadingSequence"), l(f)) : f === null || $(f) ? (e.exit("atxHeading"), t(f)) : se(f) ? ue(e, a, "whitespace")(f) : (e.enter("atxHeadingText"), c(f));
  }
  function l(f) {
    return f === 35 ? (e.consume(f), l) : (e.exit("atxHeadingSequence"), a(f));
  }
  function c(f) {
    return f === null || f === 35 || ye(f) ? (e.exit("atxHeadingText"), a(f)) : (e.consume(f), c);
  }
}
const Jk = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], Gc = ["pre", "script", "style", "textarea"], Vk = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: Kk,
  tokenize: _k
}, qk = {
  partial: !0,
  tokenize: eE
}, Xk = {
  partial: !0,
  tokenize: $k
};
function Kk(e) {
  let t = e.length;
  for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"); )
    ;
  return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function _k(e, t, n) {
  const r = this;
  let i, o, s, a, l;
  return c;
  function c(A) {
    return f(A);
  }
  function f(A) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(A), u;
  }
  function u(A) {
    return A === 33 ? (e.consume(A), m) : A === 47 ? (e.consume(A), o = !0, g) : A === 63 ? (e.consume(A), i = 3, r.interrupt ? t : b) : De(A) ? (e.consume(A), s = String.fromCharCode(A), y) : n(A);
  }
  function m(A) {
    return A === 45 ? (e.consume(A), i = 2, h) : A === 91 ? (e.consume(A), i = 5, a = 0, p) : De(A) ? (e.consume(A), i = 4, r.interrupt ? t : b) : n(A);
  }
  function h(A) {
    return A === 45 ? (e.consume(A), r.interrupt ? t : b) : n(A);
  }
  function p(A) {
    const X = "CDATA[";
    return A === X.charCodeAt(a++) ? (e.consume(A), a === X.length ? r.interrupt ? t : z : p) : n(A);
  }
  function g(A) {
    return De(A) ? (e.consume(A), s = String.fromCharCode(A), y) : n(A);
  }
  function y(A) {
    if (A === null || A === 47 || A === 62 || ye(A)) {
      const X = A === 47, H = s.toLowerCase();
      return !X && !o && Gc.includes(H) ? (i = 1, r.interrupt ? t(A) : z(A)) : Jk.includes(s.toLowerCase()) ? (i = 6, X ? (e.consume(A), x) : r.interrupt ? t(A) : z(A)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(A) : o ? k(A) : w(A));
    }
    return A === 45 || Se(A) ? (e.consume(A), s += String.fromCharCode(A), y) : n(A);
  }
  function x(A) {
    return A === 62 ? (e.consume(A), r.interrupt ? t : z) : n(A);
  }
  function k(A) {
    return se(A) ? (e.consume(A), k) : C(A);
  }
  function w(A) {
    return A === 47 ? (e.consume(A), C) : A === 58 || A === 95 || De(A) ? (e.consume(A), j) : se(A) ? (e.consume(A), w) : C(A);
  }
  function j(A) {
    return A === 45 || A === 46 || A === 58 || A === 95 || Se(A) ? (e.consume(A), j) : S(A);
  }
  function S(A) {
    return A === 61 ? (e.consume(A), E) : se(A) ? (e.consume(A), S) : w(A);
  }
  function E(A) {
    return A === null || A === 60 || A === 61 || A === 62 || A === 96 ? n(A) : A === 34 || A === 39 ? (e.consume(A), l = A, O) : se(A) ? (e.consume(A), E) : R(A);
  }
  function O(A) {
    return A === l ? (e.consume(A), l = null, B) : A === null || $(A) ? n(A) : (e.consume(A), O);
  }
  function R(A) {
    return A === null || A === 34 || A === 39 || A === 47 || A === 60 || A === 61 || A === 62 || A === 96 || ye(A) ? S(A) : (e.consume(A), R);
  }
  function B(A) {
    return A === 47 || A === 62 || se(A) ? w(A) : n(A);
  }
  function C(A) {
    return A === 62 ? (e.consume(A), I) : n(A);
  }
  function I(A) {
    return A === null || $(A) ? z(A) : se(A) ? (e.consume(A), I) : n(A);
  }
  function z(A) {
    return A === 45 && i === 2 ? (e.consume(A), D) : A === 60 && i === 1 ? (e.consume(A), F) : A === 62 && i === 4 ? (e.consume(A), N) : A === 63 && i === 3 ? (e.consume(A), b) : A === 93 && i === 5 ? (e.consume(A), G) : $(A) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(qk, Y, W)(A)) : A === null || $(A) ? (e.exit("htmlFlowData"), W(A)) : (e.consume(A), z);
  }
  function W(A) {
    return e.check(Xk, P, Y)(A);
  }
  function P(A) {
    return e.enter("lineEnding"), e.consume(A), e.exit("lineEnding"), M;
  }
  function M(A) {
    return A === null || $(A) ? W(A) : (e.enter("htmlFlowData"), z(A));
  }
  function D(A) {
    return A === 45 ? (e.consume(A), b) : z(A);
  }
  function F(A) {
    return A === 47 ? (e.consume(A), s = "", T) : z(A);
  }
  function T(A) {
    if (A === 62) {
      const X = s.toLowerCase();
      return Gc.includes(X) ? (e.consume(A), N) : z(A);
    }
    return De(A) && s.length < 8 ? (e.consume(A), s += String.fromCharCode(A), T) : z(A);
  }
  function G(A) {
    return A === 93 ? (e.consume(A), b) : z(A);
  }
  function b(A) {
    return A === 62 ? (e.consume(A), N) : A === 45 && i === 2 ? (e.consume(A), b) : z(A);
  }
  function N(A) {
    return A === null || $(A) ? (e.exit("htmlFlowData"), Y(A)) : (e.consume(A), N);
  }
  function Y(A) {
    return e.exit("htmlFlow"), t(A);
  }
}
function $k(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return $(s) ? (e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), o) : n(s);
  }
  function o(s) {
    return r.parser.lazy[r.now().line] ? n(s) : t(s);
  }
}
function eE(e, t, n) {
  return r;
  function r(i) {
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), e.attempt(Nr, t, n);
  }
}
const tE = {
  name: "htmlText",
  tokenize: nE
};
function nE(e, t, n) {
  const r = this;
  let i, o, s;
  return a;
  function a(b) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(b), l;
  }
  function l(b) {
    return b === 33 ? (e.consume(b), c) : b === 47 ? (e.consume(b), S) : b === 63 ? (e.consume(b), w) : De(b) ? (e.consume(b), R) : n(b);
  }
  function c(b) {
    return b === 45 ? (e.consume(b), f) : b === 91 ? (e.consume(b), o = 0, p) : De(b) ? (e.consume(b), k) : n(b);
  }
  function f(b) {
    return b === 45 ? (e.consume(b), h) : n(b);
  }
  function u(b) {
    return b === null ? n(b) : b === 45 ? (e.consume(b), m) : $(b) ? (s = u, F(b)) : (e.consume(b), u);
  }
  function m(b) {
    return b === 45 ? (e.consume(b), h) : u(b);
  }
  function h(b) {
    return b === 62 ? D(b) : b === 45 ? m(b) : u(b);
  }
  function p(b) {
    const N = "CDATA[";
    return b === N.charCodeAt(o++) ? (e.consume(b), o === N.length ? g : p) : n(b);
  }
  function g(b) {
    return b === null ? n(b) : b === 93 ? (e.consume(b), y) : $(b) ? (s = g, F(b)) : (e.consume(b), g);
  }
  function y(b) {
    return b === 93 ? (e.consume(b), x) : g(b);
  }
  function x(b) {
    return b === 62 ? D(b) : b === 93 ? (e.consume(b), x) : g(b);
  }
  function k(b) {
    return b === null || b === 62 ? D(b) : $(b) ? (s = k, F(b)) : (e.consume(b), k);
  }
  function w(b) {
    return b === null ? n(b) : b === 63 ? (e.consume(b), j) : $(b) ? (s = w, F(b)) : (e.consume(b), w);
  }
  function j(b) {
    return b === 62 ? D(b) : w(b);
  }
  function S(b) {
    return De(b) ? (e.consume(b), E) : n(b);
  }
  function E(b) {
    return b === 45 || Se(b) ? (e.consume(b), E) : O(b);
  }
  function O(b) {
    return $(b) ? (s = O, F(b)) : se(b) ? (e.consume(b), O) : D(b);
  }
  function R(b) {
    return b === 45 || Se(b) ? (e.consume(b), R) : b === 47 || b === 62 || ye(b) ? B(b) : n(b);
  }
  function B(b) {
    return b === 47 ? (e.consume(b), D) : b === 58 || b === 95 || De(b) ? (e.consume(b), C) : $(b) ? (s = B, F(b)) : se(b) ? (e.consume(b), B) : D(b);
  }
  function C(b) {
    return b === 45 || b === 46 || b === 58 || b === 95 || Se(b) ? (e.consume(b), C) : I(b);
  }
  function I(b) {
    return b === 61 ? (e.consume(b), z) : $(b) ? (s = I, F(b)) : se(b) ? (e.consume(b), I) : B(b);
  }
  function z(b) {
    return b === null || b === 60 || b === 61 || b === 62 || b === 96 ? n(b) : b === 34 || b === 39 ? (e.consume(b), i = b, W) : $(b) ? (s = z, F(b)) : se(b) ? (e.consume(b), z) : (e.consume(b), P);
  }
  function W(b) {
    return b === i ? (e.consume(b), i = void 0, M) : b === null ? n(b) : $(b) ? (s = W, F(b)) : (e.consume(b), W);
  }
  function P(b) {
    return b === null || b === 34 || b === 39 || b === 60 || b === 61 || b === 96 ? n(b) : b === 47 || b === 62 || ye(b) ? B(b) : (e.consume(b), P);
  }
  function M(b) {
    return b === 47 || b === 62 || ye(b) ? B(b) : n(b);
  }
  function D(b) {
    return b === 62 ? (e.consume(b), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(b);
  }
  function F(b) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(b), e.exit("lineEnding"), T;
  }
  function T(b) {
    return se(b) ? ue(e, G, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(b) : G(b);
  }
  function G(b) {
    return e.enter("htmlTextData"), s(b);
  }
}
const qa = {
  name: "labelEnd",
  resolveAll: sE,
  resolveTo: aE,
  tokenize: lE
}, rE = {
  tokenize: cE
}, iE = {
  tokenize: uE
}, oE = {
  tokenize: dE
};
function sE(e) {
  let t = -1;
  const n = [];
  for (; ++t < e.length; ) {
    const r = e[t][1];
    if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const i = r.type === "labelImage" ? 4 : 2;
      r.type = "data", t += i;
    }
  }
  return e.length !== n.length && Le(e, 0, e.length, n), e;
}
function aE(e, t) {
  let n = e.length, r = 0, i, o, s, a;
  for (; n--; )
    if (i = e[n][1], o) {
      if (i.type === "link" || i.type === "labelLink" && i._inactive)
        break;
      e[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (s) {
      if (e[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (o = n, i.type !== "labelLink")) {
        r = 2;
        break;
      }
    } else i.type === "labelEnd" && (s = n);
  const l = {
    type: e[o][1].type === "labelLink" ? "link" : "image",
    start: {
      ...e[o][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  }, c = {
    type: "label",
    start: {
      ...e[o][1].start
    },
    end: {
      ...e[s][1].end
    }
  }, f = {
    type: "labelText",
    start: {
      ...e[o + r + 2][1].end
    },
    end: {
      ...e[s - 2][1].start
    }
  };
  return a = [["enter", l, t], ["enter", c, t]], a = He(a, e.slice(o + 1, o + r + 3)), a = He(a, [["enter", f, t]]), a = He(a, _i(t.parser.constructs.insideSpan.null, e.slice(o + r + 4, s - 3), t)), a = He(a, [["exit", f, t], e[s - 2], e[s - 1], ["exit", c, t]]), a = He(a, e.slice(s + 1)), a = He(a, [["exit", l, t]]), Le(e, o, e.length, a), e;
}
function lE(e, t, n) {
  const r = this;
  let i = r.events.length, o, s;
  for (; i--; )
    if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
      o = r.events[i][1];
      break;
    }
  return a;
  function a(m) {
    return o ? o._inactive ? u(m) : (s = r.parser.defined.includes(Xe(r.sliceSerialize({
      start: o.end,
      end: r.now()
    }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(m), e.exit("labelMarker"), e.exit("labelEnd"), l) : n(m);
  }
  function l(m) {
    return m === 40 ? e.attempt(rE, f, s ? f : u)(m) : m === 91 ? e.attempt(iE, f, s ? c : u)(m) : s ? f(m) : u(m);
  }
  function c(m) {
    return e.attempt(oE, f, u)(m);
  }
  function f(m) {
    return t(m);
  }
  function u(m) {
    return o._balanced = !0, n(m);
  }
}
function cE(e, t, n) {
  return r;
  function r(u) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(u), e.exit("resourceMarker"), i;
  }
  function i(u) {
    return ye(u) ? Kn(e, o)(u) : o(u);
  }
  function o(u) {
    return u === 41 ? f(u) : lh(e, s, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(u);
  }
  function s(u) {
    return ye(u) ? Kn(e, l)(u) : f(u);
  }
  function a(u) {
    return n(u);
  }
  function l(u) {
    return u === 34 || u === 39 || u === 40 ? uh(e, c, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(u) : f(u);
  }
  function c(u) {
    return ye(u) ? Kn(e, f)(u) : f(u);
  }
  function f(u) {
    return u === 41 ? (e.enter("resourceMarker"), e.consume(u), e.exit("resourceMarker"), e.exit("resource"), t) : n(u);
  }
}
function uE(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return ch.call(r, e, o, s, "reference", "referenceMarker", "referenceString")(a);
  }
  function o(a) {
    return r.parser.defined.includes(Xe(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(a) : n(a);
  }
  function s(a) {
    return n(a);
  }
}
function dE(e, t, n) {
  return r;
  function r(o) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), i;
  }
  function i(o) {
    return o === 93 ? (e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), e.exit("reference"), t) : n(o);
  }
}
const fE = {
  name: "labelStartImage",
  resolveAll: qa.resolveAll,
  tokenize: mE
};
function mE(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(a), e.exit("labelImageMarker"), o;
  }
  function o(a) {
    return a === 91 ? (e.enter("labelMarker"), e.consume(a), e.exit("labelMarker"), e.exit("labelImage"), s) : n(a);
  }
  function s(a) {
    return a === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(a) : t(a);
  }
}
const hE = {
  name: "labelStartLink",
  resolveAll: qa.resolveAll,
  tokenize: pE
};
function pE(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(s), e.exit("labelMarker"), e.exit("labelLink"), o;
  }
  function o(s) {
    return s === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(s) : t(s);
  }
}
const So = {
  name: "lineEnding",
  tokenize: gE
};
function gE(e, t) {
  return n;
  function n(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), ue(e, t, "linePrefix");
  }
}
const ni = {
  name: "thematicBreak",
  tokenize: xE
};
function xE(e, t, n) {
  let r = 0, i;
  return o;
  function o(c) {
    return e.enter("thematicBreak"), s(c);
  }
  function s(c) {
    return i = c, a(c);
  }
  function a(c) {
    return c === i ? (e.enter("thematicBreakSequence"), l(c)) : r >= 3 && (c === null || $(c)) ? (e.exit("thematicBreak"), t(c)) : n(c);
  }
  function l(c) {
    return c === i ? (e.consume(c), r++, l) : (e.exit("thematicBreakSequence"), se(c) ? ue(e, a, "whitespace")(c) : a(c));
  }
}
const Re = {
  continuation: {
    tokenize: wE
  },
  exit: kE,
  name: "list",
  tokenize: vE
}, bE = {
  partial: !0,
  tokenize: EE
}, yE = {
  partial: !0,
  tokenize: AE
};
function vE(e, t, n) {
  const r = this, i = r.events[r.events.length - 1];
  let o = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, s = 0;
  return a;
  function a(h) {
    const p = r.containerState.type || (h === 42 || h === 43 || h === 45 ? "listUnordered" : "listOrdered");
    if (p === "listUnordered" ? !r.containerState.marker || h === r.containerState.marker : gs(h)) {
      if (r.containerState.type || (r.containerState.type = p, e.enter(p, {
        _container: !0
      })), p === "listUnordered")
        return e.enter("listItemPrefix"), h === 42 || h === 45 ? e.check(ni, n, c)(h) : c(h);
      if (!r.interrupt || h === 49)
        return e.enter("listItemPrefix"), e.enter("listItemValue"), l(h);
    }
    return n(h);
  }
  function l(h) {
    return gs(h) && ++s < 10 ? (e.consume(h), l) : (!r.interrupt || s < 2) && (r.containerState.marker ? h === r.containerState.marker : h === 41 || h === 46) ? (e.exit("listItemValue"), c(h)) : n(h);
  }
  function c(h) {
    return e.enter("listItemMarker"), e.consume(h), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || h, e.check(
      Nr,
      // Can’t be empty when interrupting.
      r.interrupt ? n : f,
      e.attempt(bE, m, u)
    );
  }
  function f(h) {
    return r.containerState.initialBlankLine = !0, o++, m(h);
  }
  function u(h) {
    return se(h) ? (e.enter("listItemPrefixWhitespace"), e.consume(h), e.exit("listItemPrefixWhitespace"), m) : n(h);
  }
  function m(h) {
    return r.containerState.size = o + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(h);
  }
}
function wE(e, t, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, e.check(Nr, i, o);
  function i(a) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, ue(e, t, "listItemIndent", r.containerState.size + 1)(a);
  }
  function o(a) {
    return r.containerState.furtherBlankLines || !se(a) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, s(a)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(yE, t, s)(a));
  }
  function s(a) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, ue(e, e.attempt(Re, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function AE(e, t, n) {
  const r = this;
  return ue(e, i, "listItemIndent", r.containerState.size + 1);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return s && s[1].type === "listItemIndent" && s[2].sliceSerialize(s[1], !0).length === r.containerState.size ? t(o) : n(o);
  }
}
function kE(e) {
  e.exit(this.containerState.type);
}
function EE(e, t, n) {
  const r = this;
  return ue(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return !se(o) && s && s[1].type === "listItemPrefixWhitespace" ? t(o) : n(o);
  }
}
const Fc = {
  name: "setextUnderline",
  resolveTo: CE,
  tokenize: jE
};
function CE(e, t) {
  let n = e.length, r, i, o;
  for (; n--; )
    if (e[n][0] === "enter") {
      if (e[n][1].type === "content") {
        r = n;
        break;
      }
      e[n][1].type === "paragraph" && (i = n);
    } else
      e[n][1].type === "content" && e.splice(n, 1), !o && e[n][1].type === "definition" && (o = n);
  const s = {
    type: "setextHeading",
    start: {
      ...e[r][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  };
  return e[i][1].type = "setextHeadingText", o ? (e.splice(i, 0, ["enter", s, t]), e.splice(o + 1, 0, ["exit", e[r][1], t]), e[r][1].end = {
    ...e[o][1].end
  }) : e[r][1] = s, e.push(["exit", s, t]), e;
}
function jE(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(c) {
    let f = r.events.length, u;
    for (; f--; )
      if (r.events[f][1].type !== "lineEnding" && r.events[f][1].type !== "linePrefix" && r.events[f][1].type !== "content") {
        u = r.events[f][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || u) ? (e.enter("setextHeadingLine"), i = c, s(c)) : n(c);
  }
  function s(c) {
    return e.enter("setextHeadingLineSequence"), a(c);
  }
  function a(c) {
    return c === i ? (e.consume(c), a) : (e.exit("setextHeadingLineSequence"), se(c) ? ue(e, l, "lineSuffix")(c) : l(c));
  }
  function l(c) {
    return c === null || $(c) ? (e.exit("setextHeadingLine"), t(c)) : n(c);
  }
}
const ME = {
  tokenize: SE
};
function SE(e) {
  const t = this, n = e.attempt(
    // Try to parse a blank line.
    Nr,
    r,
    // Try to parse initial flow (essentially, only code).
    e.attempt(this.parser.constructs.flowInitial, i, ue(e, e.attempt(this.parser.constructs.flow, i, e.attempt(Pk, i)), "linePrefix"))
  );
  return n;
  function r(o) {
    if (o === null) {
      e.consume(o);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(o), e.exit("lineEndingBlank"), t.currentConstruct = void 0, n;
  }
  function i(o) {
    if (o === null) {
      e.consume(o);
      return;
    }
    return e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), t.currentConstruct = void 0, n;
  }
}
const NE = {
  resolveAll: fh()
}, IE = dh("string"), DE = dh("text");
function dh(e) {
  return {
    resolveAll: fh(e === "text" ? RE : void 0),
    tokenize: t
  };
  function t(n) {
    const r = this, i = this.parser.constructs[e], o = n.attempt(i, s, a);
    return s;
    function s(f) {
      return c(f) ? o(f) : a(f);
    }
    function a(f) {
      if (f === null) {
        n.consume(f);
        return;
      }
      return n.enter("data"), n.consume(f), l;
    }
    function l(f) {
      return c(f) ? (n.exit("data"), o(f)) : (n.consume(f), l);
    }
    function c(f) {
      if (f === null)
        return !0;
      const u = i[f];
      let m = -1;
      if (u)
        for (; ++m < u.length; ) {
          const h = u[m];
          if (!h.previous || h.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function fh(e) {
  return t;
  function t(n, r) {
    let i = -1, o;
    for (; ++i <= n.length; )
      o === void 0 ? n[i] && n[i][1].type === "data" && (o = i, i++) : (!n[i] || n[i][1].type !== "data") && (i !== o + 2 && (n[o][1].end = n[i - 1][1].end, n.splice(o + 2, i - o - 2), i = o + 2), o = void 0);
    return e ? e(n, r) : n;
  }
}
function RE(e, t) {
  let n = 0;
  for (; ++n <= e.length; )
    if ((n === e.length || e[n][1].type === "lineEnding") && e[n - 1][1].type === "data") {
      const r = e[n - 1][1], i = t.sliceStream(r);
      let o = i.length, s = -1, a = 0, l;
      for (; o--; ) {
        const c = i[o];
        if (typeof c == "string") {
          for (s = c.length; c.charCodeAt(s - 1) === 32; )
            a++, s--;
          if (s) break;
          s = -1;
        } else if (c === -2)
          l = !0, a++;
        else if (c !== -1) {
          o++;
          break;
        }
      }
      if (t._contentTypeTextTrailing && n === e.length && (a = 0), a) {
        const c = {
          type: n === e.length || l || a < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: o ? s : r.start._bufferIndex + s,
            _index: r.start._index + o,
            line: r.end.line,
            column: r.end.column - a,
            offset: r.end.offset - a
          },
          end: {
            ...r.end
          }
        };
        r.end = {
          ...c.start
        }, r.start.offset === r.end.offset ? Object.assign(r, c) : (e.splice(n, 0, ["enter", c, t], ["exit", c, t]), n += 2);
      }
      n++;
    }
  return e;
}
const PE = {
  42: Re,
  43: Re,
  45: Re,
  48: Re,
  49: Re,
  50: Re,
  51: Re,
  52: Re,
  53: Re,
  54: Re,
  55: Re,
  56: Re,
  57: Re,
  62: ih
}, OE = {
  91: Gk
}, TE = {
  [-2]: Mo,
  [-1]: Mo,
  32: Mo
}, zE = {
  35: Uk,
  42: ni,
  45: [Fc, ni],
  60: Vk,
  61: Fc,
  95: ni,
  96: Bc,
  126: Bc
}, BE = {
  38: sh,
  92: oh
}, GE = {
  [-5]: So,
  [-4]: So,
  [-3]: So,
  33: fE,
  38: sh,
  42: xs,
  60: [hk, tE],
  91: hE,
  92: [Hk, oh],
  93: qa,
  95: xs,
  96: Mk
}, FE = {
  null: [xs, NE]
}, LE = {
  null: [42, 95]
}, YE = {
  null: []
}, HE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: LE,
  contentInitial: OE,
  disable: YE,
  document: PE,
  flow: zE,
  flowInitial: TE,
  insideSpan: FE,
  string: BE,
  text: GE
}, Symbol.toStringTag, { value: "Module" }));
function QE(e, t, n) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: n && n.line || 1,
    column: n && n.column || 1,
    offset: n && n.offset || 0
  };
  const i = {}, o = [];
  let s = [], a = [];
  const l = {
    attempt: O(S),
    check: O(E),
    consume: k,
    enter: w,
    exit: j,
    interrupt: O(E, {
      interrupt: !0
    })
  }, c = {
    code: null,
    containerState: {},
    defineSkip: g,
    events: [],
    now: p,
    parser: e,
    previous: null,
    sliceSerialize: m,
    sliceStream: h,
    write: u
  };
  let f = t.tokenize.call(c, l);
  return t.resolveAll && o.push(t), c;
  function u(I) {
    return s = He(s, I), y(), s[s.length - 1] !== null ? [] : (R(t, 0), c.events = _i(o, c.events, c), c.events);
  }
  function m(I, z) {
    return ZE(h(I), z);
  }
  function h(I) {
    return UE(s, I);
  }
  function p() {
    const {
      _bufferIndex: I,
      _index: z,
      line: W,
      column: P,
      offset: M
    } = r;
    return {
      _bufferIndex: I,
      _index: z,
      line: W,
      column: P,
      offset: M
    };
  }
  function g(I) {
    i[I.line] = I.column, C();
  }
  function y() {
    let I;
    for (; r._index < s.length; ) {
      const z = s[r._index];
      if (typeof z == "string")
        for (I = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === I && r._bufferIndex < z.length; )
          x(z.charCodeAt(r._bufferIndex));
      else
        x(z);
    }
  }
  function x(I) {
    f = f(I);
  }
  function k(I) {
    $(I) ? (r.line++, r.column = 1, r.offset += I === -3 ? 2 : 1, C()) : I !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    s[r._index].length && (r._bufferIndex = -1, r._index++)), c.previous = I;
  }
  function w(I, z) {
    const W = z || {};
    return W.type = I, W.start = p(), c.events.push(["enter", W, c]), a.push(W), W;
  }
  function j(I) {
    const z = a.pop();
    return z.end = p(), c.events.push(["exit", z, c]), z;
  }
  function S(I, z) {
    R(I, z.from);
  }
  function E(I, z) {
    z.restore();
  }
  function O(I, z) {
    return W;
    function W(P, M, D) {
      let F, T, G, b;
      return Array.isArray(P) ? (
        /* c8 ignore next 1 */
        Y(P)
      ) : "tokenize" in P ? (
        // Looks like a construct.
        Y([
          /** @type {Construct} */
          P
        ])
      ) : N(P);
      function N(q) {
        return J;
        function J(ae) {
          const ie = ae !== null && q[ae], fe = ae !== null && q.null, we = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(ie) ? ie : ie ? [ie] : [],
            ...Array.isArray(fe) ? fe : fe ? [fe] : []
          ];
          return Y(we)(ae);
        }
      }
      function Y(q) {
        return F = q, T = 0, q.length === 0 ? D : A(q[T]);
      }
      function A(q) {
        return J;
        function J(ae) {
          return b = B(), G = q, q.partial || (c.currentConstruct = q), q.name && c.parser.constructs.disable.null.includes(q.name) ? H() : q.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            z ? Object.assign(Object.create(c), z) : c,
            l,
            X,
            H
          )(ae);
        }
      }
      function X(q) {
        return I(G, b), M;
      }
      function H(q) {
        return b.restore(), ++T < F.length ? A(F[T]) : D;
      }
    }
  }
  function R(I, z) {
    I.resolveAll && !o.includes(I) && o.push(I), I.resolve && Le(c.events, z, c.events.length - z, I.resolve(c.events.slice(z), c)), I.resolveTo && (c.events = I.resolveTo(c.events, c));
  }
  function B() {
    const I = p(), z = c.previous, W = c.currentConstruct, P = c.events.length, M = Array.from(a);
    return {
      from: P,
      restore: D
    };
    function D() {
      r = I, c.previous = z, c.currentConstruct = W, c.events.length = P, a = M, C();
    }
  }
  function C() {
    r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
  }
}
function UE(e, t) {
  const n = t.start._index, r = t.start._bufferIndex, i = t.end._index, o = t.end._bufferIndex;
  let s;
  if (n === i)
    s = [e[n].slice(r, o)];
  else {
    if (s = e.slice(n, i), r > -1) {
      const a = s[0];
      typeof a == "string" ? s[0] = a.slice(r) : s.shift();
    }
    o > 0 && s.push(e[i].slice(0, o));
  }
  return s;
}
function ZE(e, t) {
  let n = -1;
  const r = [];
  let i;
  for (; ++n < e.length; ) {
    const o = e[n];
    let s;
    if (typeof o == "string")
      s = o;
    else switch (o) {
      case -5: {
        s = "\r";
        break;
      }
      case -4: {
        s = `
`;
        break;
      }
      case -3: {
        s = `\r
`;
        break;
      }
      case -2: {
        s = t ? " " : "	";
        break;
      }
      case -1: {
        if (!t && i) continue;
        s = " ";
        break;
      }
      default:
        s = String.fromCharCode(o);
    }
    i = o === -2, r.push(s);
  }
  return r.join("");
}
function WE(e) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      nh([HE, ...(e || {}).extensions || []])
    ),
    content: i(ak),
    defined: [],
    document: i(ck),
    flow: i(ME),
    lazy: {},
    string: i(IE),
    text: i(DE)
  };
  return r;
  function i(o) {
    return s;
    function s(a) {
      return QE(r, o, a);
    }
  }
}
function JE(e) {
  for (; !ah(e); )
    ;
  return e;
}
const Lc = /[\0\t\n\r]/g;
function VE() {
  let e = 1, t = "", n = !0, r;
  return i;
  function i(o, s, a) {
    const l = [];
    let c, f, u, m, h;
    for (o = t + (typeof o == "string" ? o.toString() : new TextDecoder(s || void 0).decode(o)), u = 0, t = "", n && (o.charCodeAt(0) === 65279 && u++, n = void 0); u < o.length; ) {
      if (Lc.lastIndex = u, c = Lc.exec(o), m = c && c.index !== void 0 ? c.index : o.length, h = o.charCodeAt(m), !c) {
        t = o.slice(u);
        break;
      }
      if (h === 10 && u === m && r)
        l.push(-3), r = void 0;
      else
        switch (r && (l.push(-5), r = void 0), u < m && (l.push(o.slice(u, m)), e += m - u), h) {
          case 0: {
            l.push(65533), e++;
            break;
          }
          case 9: {
            for (f = Math.ceil(e / 4) * 4, l.push(-2); e++ < f; ) l.push(-1);
            break;
          }
          case 10: {
            l.push(-4), e = 1;
            break;
          }
          default:
            r = !0, e = 1;
        }
      u = m + 1;
    }
    return a && (r && l.push(-5), t && l.push(t), l.push(null)), l;
  }
}
const qE = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function XE(e) {
  return e.replace(qE, KE);
}
function KE(e, t, n) {
  if (t)
    return t;
  if (n.charCodeAt(0) === 35) {
    const i = n.charCodeAt(1), o = i === 120 || i === 88;
    return rh(n.slice(o ? 2 : 1), o ? 16 : 10);
  }
  return Va(n) || e;
}
const mh = {}.hasOwnProperty;
function _E(e, t, n) {
  return t && typeof t == "object" && (n = t, t = void 0), $E(n)(JE(WE(n).document().write(VE()(e, t, !0))));
}
function $E(e) {
  const t = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: o(Rr),
      autolinkProtocol: B,
      autolinkEmail: B,
      atxHeading: o(Dn),
      blockQuote: o(fe),
      characterEscape: B,
      characterReference: B,
      codeFenced: o(we),
      codeFencedFenceInfo: s,
      codeFencedFenceMeta: s,
      codeIndented: o(we, s),
      codeText: o(Me, s),
      codeTextData: B,
      data: B,
      codeFlowValue: B,
      definition: o(je),
      definitionDestinationString: s,
      definitionLabelString: s,
      definitionTitleString: s,
      emphasis: o(ft),
      hardBreakEscape: o(Dr),
      hardBreakTrailing: o(Dr),
      htmlFlow: o(ln, s),
      htmlFlowData: B,
      htmlText: o(ln, s),
      htmlTextData: B,
      image: o(ul),
      label: s,
      link: o(Rr),
      listItem: o(np),
      listItemValue: m,
      listOrdered: o(Pr, u),
      listUnordered: o(Pr),
      paragraph: o(rp),
      reference: A,
      referenceString: s,
      resourceDestinationString: s,
      resourceTitleString: s,
      setextHeading: o(Dn),
      strong: o(ip),
      thematicBreak: o(sp)
    },
    exit: {
      atxHeading: l(),
      atxHeadingSequence: S,
      autolink: l(),
      autolinkEmail: ie,
      autolinkProtocol: ae,
      blockQuote: l(),
      characterEscapeValue: C,
      characterReferenceMarkerHexadecimal: H,
      characterReferenceMarkerNumeric: H,
      characterReferenceValue: q,
      characterReference: J,
      codeFenced: l(y),
      codeFencedFence: g,
      codeFencedFenceInfo: h,
      codeFencedFenceMeta: p,
      codeFlowValue: C,
      codeIndented: l(x),
      codeText: l(M),
      codeTextData: C,
      data: C,
      definition: l(),
      definitionDestinationString: j,
      definitionLabelString: k,
      definitionTitleString: w,
      emphasis: l(),
      hardBreakEscape: l(z),
      hardBreakTrailing: l(z),
      htmlFlow: l(W),
      htmlFlowData: C,
      htmlText: l(P),
      htmlTextData: C,
      image: l(F),
      label: G,
      labelText: T,
      lineEnding: I,
      link: l(D),
      listItem: l(),
      listOrdered: l(),
      listUnordered: l(),
      paragraph: l(),
      referenceString: X,
      resourceDestinationString: b,
      resourceTitleString: N,
      resource: Y,
      setextHeading: l(R),
      setextHeadingLineSequence: O,
      setextHeadingText: E,
      strong: l(),
      thematicBreak: l()
    }
  };
  hh(t, (e || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(L) {
    let V = {
      type: "root",
      children: []
    };
    const ne = {
      stack: [V],
      tokenStack: [],
      config: t,
      enter: a,
      exit: c,
      buffer: s,
      resume: f,
      data: n
    }, le = [];
    let xe = -1;
    for (; ++xe < L.length; )
      if (L[xe][1].type === "listOrdered" || L[xe][1].type === "listUnordered")
        if (L[xe][0] === "enter")
          le.push(xe);
        else {
          const Ze = le.pop();
          xe = i(L, Ze, xe);
        }
    for (xe = -1; ++xe < L.length; ) {
      const Ze = t[L[xe][0]];
      mh.call(Ze, L[xe][1].type) && Ze[L[xe][1].type].call(Object.assign({
        sliceSerialize: L[xe][2].sliceSerialize
      }, ne), L[xe][1]);
    }
    if (ne.tokenStack.length > 0) {
      const Ze = ne.tokenStack[ne.tokenStack.length - 1];
      (Ze[1] || Yc).call(ne, void 0, Ze[0]);
    }
    for (V.position = {
      start: Ct(L.length > 0 ? L[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: Ct(L.length > 0 ? L[L.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, xe = -1; ++xe < t.transforms.length; )
      V = t.transforms[xe](V) || V;
    return V;
  }
  function i(L, V, ne) {
    let le = V - 1, xe = -1, Ze = !1, Ht, mt, Rn, Pn;
    for (; ++le <= ne; ) {
      const Te = L[le];
      switch (Te[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          Te[0] === "enter" ? xe++ : xe--, Pn = void 0;
          break;
        }
        case "lineEndingBlank": {
          Te[0] === "enter" && (Ht && !Pn && !xe && !Rn && (Rn = le), Pn = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Pn = void 0;
      }
      if (!xe && Te[0] === "enter" && Te[1].type === "listItemPrefix" || xe === -1 && Te[0] === "exit" && (Te[1].type === "listUnordered" || Te[1].type === "listOrdered")) {
        if (Ht) {
          let cn = le;
          for (mt = void 0; cn--; ) {
            const ht = L[cn];
            if (ht[1].type === "lineEnding" || ht[1].type === "lineEndingBlank") {
              if (ht[0] === "exit") continue;
              mt && (L[mt][1].type = "lineEndingBlank", Ze = !0), ht[1].type = "lineEnding", mt = cn;
            } else if (!(ht[1].type === "linePrefix" || ht[1].type === "blockQuotePrefix" || ht[1].type === "blockQuotePrefixWhitespace" || ht[1].type === "blockQuoteMarker" || ht[1].type === "listItemIndent")) break;
          }
          Rn && (!mt || Rn < mt) && (Ht._spread = !0), Ht.end = Object.assign({}, mt ? L[mt][1].start : Te[1].end), L.splice(mt || le, 0, ["exit", Ht, Te[2]]), le++, ne++;
        }
        if (Te[1].type === "listItemPrefix") {
          const cn = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, Te[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Ht = cn, L.splice(le, 0, ["enter", cn, Te[2]]), le++, ne++, Rn = void 0, Pn = !0;
        }
      }
    }
    return L[V][1]._spread = Ze, ne;
  }
  function o(L, V) {
    return ne;
    function ne(le) {
      a.call(this, L(le), le), V && V.call(this, le);
    }
  }
  function s() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(L, V, ne) {
    this.stack[this.stack.length - 1].children.push(L), this.stack.push(L), this.tokenStack.push([V, ne || void 0]), L.position = {
      start: Ct(V.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function l(L) {
    return V;
    function V(ne) {
      L && L.call(this, ne), c.call(this, ne);
    }
  }
  function c(L, V) {
    const ne = this.stack.pop(), le = this.tokenStack.pop();
    if (le)
      le[0].type !== L.type && (V ? V.call(this, L, le[0]) : (le[1] || Yc).call(this, L, le[0]));
    else throw new Error("Cannot close `" + L.type + "` (" + Xn({
      start: L.start,
      end: L.end
    }) + "): it’s not open");
    ne.position.end = Ct(L.end);
  }
  function f() {
    return Ja(this.stack.pop());
  }
  function u() {
    this.data.expectingFirstListItemValue = !0;
  }
  function m(L) {
    if (this.data.expectingFirstListItemValue) {
      const V = this.stack[this.stack.length - 2];
      V.start = Number.parseInt(this.sliceSerialize(L), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function h() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.lang = L;
  }
  function p() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.meta = L;
  }
  function g() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function y() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.value = L.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function x() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.value = L.replace(/(\r?\n|\r)$/g, "");
  }
  function k(L) {
    const V = this.resume(), ne = this.stack[this.stack.length - 1];
    ne.label = V, ne.identifier = Xe(this.sliceSerialize(L)).toLowerCase();
  }
  function w() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.title = L;
  }
  function j() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.url = L;
  }
  function S(L) {
    const V = this.stack[this.stack.length - 1];
    if (!V.depth) {
      const ne = this.sliceSerialize(L).length;
      V.depth = ne;
    }
  }
  function E() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function O(L) {
    const V = this.stack[this.stack.length - 1];
    V.depth = this.sliceSerialize(L).codePointAt(0) === 61 ? 1 : 2;
  }
  function R() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function B(L) {
    const ne = this.stack[this.stack.length - 1].children;
    let le = ne[ne.length - 1];
    (!le || le.type !== "text") && (le = op(), le.position = {
      start: Ct(L.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, ne.push(le)), this.stack.push(le);
  }
  function C(L) {
    const V = this.stack.pop();
    V.value += this.sliceSerialize(L), V.position.end = Ct(L.end);
  }
  function I(L) {
    const V = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const ne = V.children[V.children.length - 1];
      ne.position.end = Ct(L.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(V.type) && (B.call(this, L), C.call(this, L));
  }
  function z() {
    this.data.atHardBreak = !0;
  }
  function W() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.value = L;
  }
  function P() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.value = L;
  }
  function M() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.value = L;
  }
  function D() {
    const L = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const V = this.data.referenceType || "shortcut";
      L.type += "Reference", L.referenceType = V, delete L.url, delete L.title;
    } else
      delete L.identifier, delete L.label;
    this.data.referenceType = void 0;
  }
  function F() {
    const L = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const V = this.data.referenceType || "shortcut";
      L.type += "Reference", L.referenceType = V, delete L.url, delete L.title;
    } else
      delete L.identifier, delete L.label;
    this.data.referenceType = void 0;
  }
  function T(L) {
    const V = this.sliceSerialize(L), ne = this.stack[this.stack.length - 2];
    ne.label = XE(V), ne.identifier = Xe(V).toLowerCase();
  }
  function G() {
    const L = this.stack[this.stack.length - 1], V = this.resume(), ne = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, ne.type === "link") {
      const le = L.children;
      ne.children = le;
    } else
      ne.alt = V;
  }
  function b() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.url = L;
  }
  function N() {
    const L = this.resume(), V = this.stack[this.stack.length - 1];
    V.title = L;
  }
  function Y() {
    this.data.inReference = void 0;
  }
  function A() {
    this.data.referenceType = "collapsed";
  }
  function X(L) {
    const V = this.resume(), ne = this.stack[this.stack.length - 1];
    ne.label = V, ne.identifier = Xe(this.sliceSerialize(L)).toLowerCase(), this.data.referenceType = "full";
  }
  function H(L) {
    this.data.characterReferenceType = L.type;
  }
  function q(L) {
    const V = this.sliceSerialize(L), ne = this.data.characterReferenceType;
    let le;
    ne ? (le = rh(V, ne === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : le = Va(V);
    const xe = this.stack[this.stack.length - 1];
    xe.value += le;
  }
  function J(L) {
    const V = this.stack.pop();
    V.position.end = Ct(L.end);
  }
  function ae(L) {
    C.call(this, L);
    const V = this.stack[this.stack.length - 1];
    V.url = this.sliceSerialize(L);
  }
  function ie(L) {
    C.call(this, L);
    const V = this.stack[this.stack.length - 1];
    V.url = "mailto:" + this.sliceSerialize(L);
  }
  function fe() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function we() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function Me() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function je() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function ft() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function Dn() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function Dr() {
    return {
      type: "break"
    };
  }
  function ln() {
    return {
      type: "html",
      value: ""
    };
  }
  function ul() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Rr() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function Pr(L) {
    return {
      type: "list",
      ordered: L.type === "listOrdered",
      start: null,
      spread: L._spread,
      children: []
    };
  }
  function np(L) {
    return {
      type: "listItem",
      spread: L._spread,
      checked: null,
      children: []
    };
  }
  function rp() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function ip() {
    return {
      type: "strong",
      children: []
    };
  }
  function op() {
    return {
      type: "text",
      value: ""
    };
  }
  function sp() {
    return {
      type: "thematicBreak"
    };
  }
}
function Ct(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function hh(e, t) {
  let n = -1;
  for (; ++n < t.length; ) {
    const r = t[n];
    Array.isArray(r) ? hh(e, r) : eC(e, r);
  }
}
function eC(e, t) {
  let n;
  for (n in t)
    if (mh.call(t, n))
      switch (n) {
        case "canContainEols": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "transforms": {
          const r = t[n];
          r && e[n].push(...r);
          break;
        }
        case "enter":
        case "exit": {
          const r = t[n];
          r && Object.assign(e[n], r);
          break;
        }
      }
}
function Yc(e, t) {
  throw e ? new Error("Cannot close `" + e.type + "` (" + Xn({
    start: e.start,
    end: e.end
  }) + "): a different token (`" + t.type + "`, " + Xn({
    start: t.start,
    end: t.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + Xn({
    start: t.start,
    end: t.end
  }) + ") is still open");
}
function tC(e) {
  const t = this;
  t.parser = n;
  function n(r) {
    return _E(r, {
      ...t.data("settings"),
      ...e,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: t.data("micromarkExtensions") || [],
      mdastExtensions: t.data("fromMarkdownExtensions") || []
    });
  }
}
function nC(e, t) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: e.wrap(e.all(t), !0)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function rC(e, t) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return e.patch(t, n), [e.applyData(t, n), { type: "text", value: `
` }];
}
function iC(e, t) {
  const n = t.value ? t.value + `
` : "", r = {}, i = t.lang ? t.lang.split(/\s+/) : [];
  i.length > 0 && (r.className = ["language-" + i[0]]);
  let o = {
    type: "element",
    tagName: "code",
    properties: r,
    children: [{ type: "text", value: n }]
  };
  return t.meta && (o.data = { meta: t.meta }), e.patch(t, o), o = e.applyData(t, o), o = { type: "element", tagName: "pre", properties: {}, children: [o] }, e.patch(t, o), o;
}
function oC(e, t) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function sC(e, t) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function aC(e, t) {
  const n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = In(r.toLowerCase()), o = e.footnoteOrder.indexOf(r);
  let s, a = e.footnoteCounts.get(r);
  a === void 0 ? (a = 0, e.footnoteOrder.push(r), s = e.footnoteOrder.length) : s = o + 1, a += 1, e.footnoteCounts.set(r, a);
  const l = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + i,
      id: n + "fnref-" + i + (a > 1 ? "-" + a : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(s) }]
  };
  e.patch(t, l);
  const c = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [l]
  };
  return e.patch(t, c), e.applyData(t, c);
}
function lC(e, t) {
  const n = {
    type: "element",
    tagName: "h" + t.depth,
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function cC(e, t) {
  if (e.options.allowDangerousHtml) {
    const n = { type: "raw", value: t.value };
    return e.patch(t, n), e.applyData(t, n);
  }
}
function ph(e, t) {
  const n = t.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference")
    return [{ type: "text", value: "![" + t.alt + r }];
  const i = e.all(t), o = i[0];
  o && o.type === "text" ? o.value = "[" + o.value : i.unshift({ type: "text", value: "[" });
  const s = i[i.length - 1];
  return s && s.type === "text" ? s.value += r : i.push({ type: "text", value: r }), i;
}
function uC(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return ph(e, t);
  const i = { src: In(r.url || ""), alt: t.alt };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = { type: "element", tagName: "img", properties: i, children: [] };
  return e.patch(t, o), e.applyData(t, o);
}
function dC(e, t) {
  const n = { src: In(t.url) };
  t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return e.patch(t, r), e.applyData(t, r);
}
function fC(e, t) {
  const n = { type: "text", value: t.value.replace(/\r?\n|\r/g, " ") };
  e.patch(t, n);
  const r = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [n]
  };
  return e.patch(t, r), e.applyData(t, r);
}
function mC(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return ph(e, t);
  const i = { href: In(r.url || "") };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = {
    type: "element",
    tagName: "a",
    properties: i,
    children: e.all(t)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function hC(e, t) {
  const n = { href: In(t.url) };
  t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function pC(e, t, n) {
  const r = e.all(t), i = n ? gC(n) : gh(t), o = {}, s = [];
  if (typeof t.checked == "boolean") {
    const f = r[0];
    let u;
    f && f.type === "element" && f.tagName === "p" ? u = f : (u = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(u)), u.children.length > 0 && u.children.unshift({ type: "text", value: " " }), u.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: t.checked, disabled: !0 },
      children: []
    }), o.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < r.length; ) {
    const f = r[a];
    (i || a !== 0 || f.type !== "element" || f.tagName !== "p") && s.push({ type: "text", value: `
` }), f.type === "element" && f.tagName === "p" && !i ? s.push(...f.children) : s.push(f);
  }
  const l = r[r.length - 1];
  l && (i || l.type !== "element" || l.tagName !== "p") && s.push({ type: "text", value: `
` });
  const c = { type: "element", tagName: "li", properties: o, children: s };
  return e.patch(t, c), e.applyData(t, c);
}
function gC(e) {
  let t = !1;
  if (e.type === "list") {
    t = e.spread || !1;
    const n = e.children;
    let r = -1;
    for (; !t && ++r < n.length; )
      t = gh(n[r]);
  }
  return t;
}
function gh(e) {
  const t = e.spread;
  return t ?? e.children.length > 1;
}
function xC(e, t) {
  const n = {}, r = e.all(t);
  let i = -1;
  for (typeof t.start == "number" && t.start !== 1 && (n.start = t.start); ++i < r.length; ) {
    const s = r[i];
    if (s.type === "element" && s.tagName === "li" && s.properties && Array.isArray(s.properties.className) && s.properties.className.includes("task-list-item")) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  const o = {
    type: "element",
    tagName: t.ordered ? "ol" : "ul",
    properties: n,
    children: e.wrap(r, !0)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function bC(e, t) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function yC(e, t) {
  const n = { type: "root", children: e.wrap(e.all(t)) };
  return e.patch(t, n), e.applyData(t, n);
}
function vC(e, t) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function wC(e, t) {
  const n = e.all(t), r = n.shift(), i = [];
  if (r) {
    const s = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: e.wrap([r], !0)
    };
    e.patch(t.children[0], s), i.push(s);
  }
  if (n.length > 0) {
    const s = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: e.wrap(n, !0)
    }, a = Qa(t.children[1]), l = qm(t.children[t.children.length - 1]);
    a && l && (s.position = { start: a, end: l }), i.push(s);
  }
  const o = {
    type: "element",
    tagName: "table",
    properties: {},
    children: e.wrap(i, !0)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function AC(e, t, n) {
  const r = n ? n.children : void 0, o = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", s = n && n.type === "table" ? n.align : void 0, a = s ? s.length : t.children.length;
  let l = -1;
  const c = [];
  for (; ++l < a; ) {
    const u = t.children[l], m = {}, h = s ? s[l] : void 0;
    h && (m.align = h);
    let p = { type: "element", tagName: o, properties: m, children: [] };
    u && (p.children = e.all(u), e.patch(u, p), p = e.applyData(u, p)), c.push(p);
  }
  const f = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: e.wrap(c, !0)
  };
  return e.patch(t, f), e.applyData(t, f);
}
function kC(e, t) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
const Hc = 9, Qc = 32;
function EC(e) {
  const t = String(e), n = /\r?\n|\r/g;
  let r = n.exec(t), i = 0;
  const o = [];
  for (; r; )
    o.push(
      Uc(t.slice(i, r.index), i > 0, !0),
      r[0]
    ), i = r.index + r[0].length, r = n.exec(t);
  return o.push(Uc(t.slice(i), i > 0, !1)), o.join("");
}
function Uc(e, t, n) {
  let r = 0, i = e.length;
  if (t) {
    let o = e.codePointAt(r);
    for (; o === Hc || o === Qc; )
      r++, o = e.codePointAt(r);
  }
  if (n) {
    let o = e.codePointAt(i - 1);
    for (; o === Hc || o === Qc; )
      i--, o = e.codePointAt(i - 1);
  }
  return i > r ? e.slice(r, i) : "";
}
function CC(e, t) {
  const n = { type: "text", value: EC(String(t.value)) };
  return e.patch(t, n), e.applyData(t, n);
}
function jC(e, t) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return e.patch(t, n), e.applyData(t, n);
}
const MC = {
  blockquote: nC,
  break: rC,
  code: iC,
  delete: oC,
  emphasis: sC,
  footnoteReference: aC,
  heading: lC,
  html: cC,
  imageReference: uC,
  image: dC,
  inlineCode: fC,
  linkReference: mC,
  link: hC,
  listItem: pC,
  list: xC,
  paragraph: bC,
  // @ts-expect-error: root is different, but hard to type.
  root: yC,
  strong: vC,
  table: wC,
  tableCell: kC,
  tableRow: AC,
  text: CC,
  thematicBreak: jC,
  toml: Wr,
  yaml: Wr,
  definition: Wr,
  footnoteDefinition: Wr
};
function Wr() {
}
const xh = -1, $i = 0, _n = 1, vi = 2, Xa = 3, Ka = 4, _a = 5, $a = 6, bh = 7, yh = 8, SC = typeof self == "object" ? self : globalThis, Zc = (e, t) => {
  switch (e) {
    case "Function":
    case "SharedWorker":
    case "Worker":
    case "eval":
    case "setInterval":
    case "setTimeout":
      throw new TypeError("unable to deserialize " + e);
  }
  return new SC[e](t);
}, NC = (e, t) => {
  const n = (i, o) => (e.set(o, i), i), r = (i) => {
    if (e.has(i))
      return e.get(i);
    const [o, s] = t[i];
    switch (o) {
      case $i:
      case xh:
        return n(s, i);
      case _n: {
        const a = n([], i);
        for (const l of s)
          a.push(r(l));
        return a;
      }
      case vi: {
        const a = n({}, i);
        for (const [l, c] of s)
          a[r(l)] = r(c);
        return a;
      }
      case Xa:
        return n(new Date(s), i);
      case Ka: {
        const { source: a, flags: l } = s;
        return n(new RegExp(a, l), i);
      }
      case _a: {
        const a = n(/* @__PURE__ */ new Map(), i);
        for (const [l, c] of s)
          a.set(r(l), r(c));
        return a;
      }
      case $a: {
        const a = n(/* @__PURE__ */ new Set(), i);
        for (const l of s)
          a.add(r(l));
        return a;
      }
      case bh: {
        const { name: a, message: l } = s;
        return n(Zc(a, l), i);
      }
      case yh:
        return n(BigInt(s), i);
      case "BigInt":
        return n(Object(BigInt(s)), i);
      case "ArrayBuffer":
        return n(new Uint8Array(s).buffer, s);
      case "DataView": {
        const { buffer: a } = new Uint8Array(s);
        return n(new DataView(a), s);
      }
    }
    return n(Zc(o, s), i);
  };
  return r;
}, Wc = (e) => NC(/* @__PURE__ */ new Map(), e)(0), pn = "", { toString: IC } = {}, { keys: DC } = Object, Qn = (e) => {
  const t = typeof e;
  if (t !== "object" || !e)
    return [$i, t];
  const n = IC.call(e).slice(8, -1);
  switch (n) {
    case "Array":
      return [_n, pn];
    case "Object":
      return [vi, pn];
    case "Date":
      return [Xa, pn];
    case "RegExp":
      return [Ka, pn];
    case "Map":
      return [_a, pn];
    case "Set":
      return [$a, pn];
    case "DataView":
      return [_n, n];
  }
  return n.includes("Array") ? [_n, n] : n.includes("Error") ? [bh, n] : [vi, n];
}, Jr = ([e, t]) => e === $i && (t === "function" || t === "symbol"), RC = (e, t, n, r) => {
  const i = (s, a) => {
    const l = r.push(s) - 1;
    return n.set(a, l), l;
  }, o = (s) => {
    if (n.has(s))
      return n.get(s);
    let [a, l] = Qn(s);
    switch (a) {
      case $i: {
        let f = s;
        switch (l) {
          case "bigint":
            a = yh, f = s.toString();
            break;
          case "function":
          case "symbol":
            if (e)
              throw new TypeError("unable to serialize " + l);
            f = null;
            break;
          case "undefined":
            return i([xh], s);
        }
        return i([a, f], s);
      }
      case _n: {
        if (l) {
          let m = s;
          return l === "DataView" ? m = new Uint8Array(s.buffer) : l === "ArrayBuffer" && (m = new Uint8Array(s)), i([l, [...m]], s);
        }
        const f = [], u = i([a, f], s);
        for (const m of s)
          f.push(o(m));
        return u;
      }
      case vi: {
        if (l)
          switch (l) {
            case "BigInt":
              return i([l, s.toString()], s);
            case "Boolean":
            case "Number":
            case "String":
              return i([l, s.valueOf()], s);
          }
        if (t && "toJSON" in s)
          return o(s.toJSON());
        const f = [], u = i([a, f], s);
        for (const m of DC(s))
          (e || !Jr(Qn(s[m]))) && f.push([o(m), o(s[m])]);
        return u;
      }
      case Xa:
        return i([a, s.toISOString()], s);
      case Ka: {
        const { source: f, flags: u } = s;
        return i([a, { source: f, flags: u }], s);
      }
      case _a: {
        const f = [], u = i([a, f], s);
        for (const [m, h] of s)
          (e || !(Jr(Qn(m)) || Jr(Qn(h)))) && f.push([o(m), o(h)]);
        return u;
      }
      case $a: {
        const f = [], u = i([a, f], s);
        for (const m of s)
          (e || !Jr(Qn(m))) && f.push(o(m));
        return u;
      }
    }
    const { message: c } = s;
    return i([a, { name: l, message: c }], s);
  };
  return o;
}, Jc = (e, { json: t, lossy: n } = {}) => {
  const r = [];
  return RC(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, wi = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (e, t) => t && ("json" in t || "lossy" in t) ? Wc(Jc(e, t)) : structuredClone(e)
) : (e, t) => Wc(Jc(e, t));
function PC(e, t) {
  const n = [{ type: "text", value: "↩" }];
  return t > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(t) }]
  }), n;
}
function OC(e, t) {
  return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function TC(e) {
  const t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || PC, r = e.options.footnoteBackLabel || OC, i = e.options.footnoteLabel || "Footnotes", o = e.options.footnoteLabelTagName || "h2", s = e.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let l = -1;
  for (; ++l < e.footnoteOrder.length; ) {
    const c = e.footnoteById.get(
      e.footnoteOrder[l]
    );
    if (!c)
      continue;
    const f = e.all(c), u = String(c.identifier).toUpperCase(), m = In(u.toLowerCase());
    let h = 0;
    const p = [], g = e.footnoteCounts.get(u);
    for (; g !== void 0 && ++h <= g; ) {
      p.length > 0 && p.push({ type: "text", value: " " });
      let k = typeof n == "string" ? n : n(l, h);
      typeof k == "string" && (k = { type: "text", value: k }), p.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + t + "fnref-" + m + (h > 1 ? "-" + h : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(l, h),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(k) ? k : [k]
      });
    }
    const y = f[f.length - 1];
    if (y && y.type === "element" && y.tagName === "p") {
      const k = y.children[y.children.length - 1];
      k && k.type === "text" ? k.value += " " : y.children.push({ type: "text", value: " " }), y.children.push(...p);
    } else
      f.push(...p);
    const x = {
      type: "element",
      tagName: "li",
      properties: { id: t + "fn-" + m },
      children: e.wrap(f, !0)
    };
    e.patch(c, x), a.push(x);
  }
  if (a.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: o,
          properties: {
            ...wi(s),
            id: "footnote-label"
          },
          children: [{ type: "text", value: i }]
        },
        { type: "text", value: `
` },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: e.wrap(a, !0)
        },
        { type: "text", value: `
` }
      ]
    };
}
const eo = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  (function(e) {
    if (e == null)
      return FC;
    if (typeof e == "function")
      return to(e);
    if (typeof e == "object")
      return Array.isArray(e) ? zC(e) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        BC(
          /** @type {Props} */
          e
        )
      );
    if (typeof e == "string")
      return GC(e);
    throw new Error("Expected function, string, or object as test");
  })
);
function zC(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = eo(e[n]);
  return to(r);
  function r(...i) {
    let o = -1;
    for (; ++o < t.length; )
      if (t[o].apply(this, i)) return !0;
    return !1;
  }
}
function BC(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return to(n);
  function n(r) {
    const i = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let o;
    for (o in e)
      if (i[o] !== t[o]) return !1;
    return !0;
  }
}
function GC(e) {
  return to(t);
  function t(n) {
    return n && n.type === e;
  }
}
function to(e) {
  return t;
  function t(n, r, i) {
    return !!(LC(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      i || void 0
    ));
  }
}
function FC() {
  return !0;
}
function LC(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const vh = [], YC = !0, bs = !1, HC = "skip";
function wh(e, t, n, r) {
  let i;
  typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
  const o = eo(i), s = r ? -1 : 1;
  a(e, void 0, [])();
  function a(l, c, f) {
    const u = (
      /** @type {Record<string, unknown>} */
      l && typeof l == "object" ? l : {}
    );
    if (typeof u.type == "string") {
      const h = (
        // `hast`
        typeof u.tagName == "string" ? u.tagName : (
          // `xast`
          typeof u.name == "string" ? u.name : void 0
        )
      );
      Object.defineProperty(m, "name", {
        value: "node (" + (l.type + (h ? "<" + h + ">" : "")) + ")"
      });
    }
    return m;
    function m() {
      let h = vh, p, g, y;
      if ((!t || o(l, c, f[f.length - 1] || void 0)) && (h = QC(n(l, f)), h[0] === bs))
        return h;
      if ("children" in l && l.children) {
        const x = (
          /** @type {UnistParent} */
          l
        );
        if (x.children && h[0] !== HC)
          for (g = (r ? x.children.length : -1) + s, y = f.concat(x); g > -1 && g < x.children.length; ) {
            const k = x.children[g];
            if (p = a(k, g, y)(), p[0] === bs)
              return p;
            g = typeof p[1] == "number" ? p[1] : g + s;
          }
      }
      return h;
    }
  }
}
function QC(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [YC, e] : e == null ? vh : [e];
}
function el(e, t, n, r) {
  let i, o, s;
  typeof t == "function" && typeof n != "function" ? (o = void 0, s = t, i = n) : (o = t, s = n, i = r), wh(e, o, a, i);
  function a(l, c) {
    const f = c[c.length - 1], u = f ? f.children.indexOf(l) : void 0;
    return s(l, u, f);
  }
}
const ys = {}.hasOwnProperty, UC = {};
function ZC(e, t) {
  const n = t || UC, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = { ...MC, ...n.handlers }, a = {
    all: c,
    applyData: JC,
    definitionById: r,
    footnoteById: i,
    footnoteCounts: o,
    footnoteOrder: [],
    handlers: s,
    one: l,
    options: n,
    patch: WC,
    wrap: qC
  };
  return el(e, function(f) {
    if (f.type === "definition" || f.type === "footnoteDefinition") {
      const u = f.type === "definition" ? r : i, m = String(f.identifier).toUpperCase();
      u.has(m) || u.set(m, f);
    }
  }), a;
  function l(f, u) {
    const m = f.type, h = a.handlers[m];
    if (ys.call(a.handlers, m) && h)
      return h(a, f, u);
    if (a.options.passThrough && a.options.passThrough.includes(m)) {
      if ("children" in f) {
        const { children: g, ...y } = f, x = wi(y);
        return x.children = a.all(f), x;
      }
      return wi(f);
    }
    return (a.options.unknownHandler || VC)(a, f, u);
  }
  function c(f) {
    const u = [];
    if ("children" in f) {
      const m = f.children;
      let h = -1;
      for (; ++h < m.length; ) {
        const p = a.one(m[h], f);
        if (p) {
          if (h && m[h - 1].type === "break" && (!Array.isArray(p) && p.type === "text" && (p.value = Vc(p.value)), !Array.isArray(p) && p.type === "element")) {
            const g = p.children[0];
            g && g.type === "text" && (g.value = Vc(g.value));
          }
          Array.isArray(p) ? u.push(...p) : u.push(p);
        }
      }
    }
    return u;
  }
}
function WC(e, t) {
  e.position && (t.position = P1(e));
}
function JC(e, t) {
  let n = t;
  if (e && e.data) {
    const r = e.data.hName, i = e.data.hChildren, o = e.data.hProperties;
    if (typeof r == "string")
      if (n.type === "element")
        n.tagName = r;
      else {
        const s = "children" in n ? n.children : [n];
        n = { type: "element", tagName: r, properties: {}, children: s };
      }
    n.type === "element" && o && Object.assign(n.properties, wi(o)), "children" in n && n.children && i !== null && i !== void 0 && (n.children = i);
  }
  return n;
}
function VC(e, t) {
  const n = t.data || {}, r = "value" in t && !(ys.call(n, "hProperties") || ys.call(n, "hChildren")) ? { type: "text", value: t.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function qC(e, t) {
  const n = [];
  let r = -1;
  for (t && n.push({ type: "text", value: `
` }); ++r < e.length; )
    r && n.push({ type: "text", value: `
` }), n.push(e[r]);
  return t && e.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function Vc(e) {
  let t = 0, n = e.charCodeAt(t);
  for (; n === 9 || n === 32; )
    t++, n = e.charCodeAt(t);
  return e.slice(t);
}
function qc(e, t) {
  const n = ZC(e, t), r = n.one(e, void 0), i = TC(n), o = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return i && o.children.push({ type: "text", value: `
` }, i), o;
}
function XC(e, t) {
  return e && "run" in e ? async function(n, r) {
    const i = (
      /** @type {HastRoot} */
      qc(n, { file: r, ...t })
    );
    await e.run(i, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      qc(n, { file: r, ...e || t })
    );
  };
}
function Xc(e) {
  if (e)
    throw e;
}
var No, Kc;
function KC() {
  if (Kc) return No;
  Kc = 1;
  var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = function(c) {
    return typeof Array.isArray == "function" ? Array.isArray(c) : t.call(c) === "[object Array]";
  }, o = function(c) {
    if (!c || t.call(c) !== "[object Object]")
      return !1;
    var f = e.call(c, "constructor"), u = c.constructor && c.constructor.prototype && e.call(c.constructor.prototype, "isPrototypeOf");
    if (c.constructor && !f && !u)
      return !1;
    var m;
    for (m in c)
      ;
    return typeof m > "u" || e.call(c, m);
  }, s = function(c, f) {
    n && f.name === "__proto__" ? n(c, f.name, {
      enumerable: !0,
      configurable: !0,
      value: f.newValue,
      writable: !0
    }) : c[f.name] = f.newValue;
  }, a = function(c, f) {
    if (f === "__proto__")
      if (e.call(c, f)) {
        if (r)
          return r(c, f).value;
      } else return;
    return c[f];
  };
  return No = function l() {
    var c, f, u, m, h, p, g = arguments[0], y = 1, x = arguments.length, k = !1;
    for (typeof g == "boolean" && (k = g, g = arguments[1] || {}, y = 2), (g == null || typeof g != "object" && typeof g != "function") && (g = {}); y < x; ++y)
      if (c = arguments[y], c != null)
        for (f in c)
          u = a(g, f), m = a(c, f), g !== m && (k && m && (o(m) || (h = i(m))) ? (h ? (h = !1, p = u && i(u) ? u : []) : p = u && o(u) ? u : {}, s(g, { name: f, newValue: l(k, p, m) })) : typeof m < "u" && s(g, { name: f, newValue: m }));
    return g;
  }, No;
}
var _C = KC();
const Io = /* @__PURE__ */ Ss(_C);
function vs(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function $C() {
  const e = [], t = { run: n, use: r };
  return t;
  function n(...i) {
    let o = -1;
    const s = i.pop();
    if (typeof s != "function")
      throw new TypeError("Expected function as last argument, not " + s);
    a(null, ...i);
    function a(l, ...c) {
      const f = e[++o];
      let u = -1;
      if (l) {
        s(l);
        return;
      }
      for (; ++u < i.length; )
        (c[u] === null || c[u] === void 0) && (c[u] = i[u]);
      i = c, f ? ej(f, a)(...c) : s(null, ...c);
    }
  }
  function r(i) {
    if (typeof i != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + i
      );
    return e.push(i), t;
  }
}
function ej(e, t) {
  let n;
  return r;
  function r(...s) {
    const a = e.length > s.length;
    let l;
    a && s.push(i);
    try {
      l = e.apply(this, s);
    } catch (c) {
      const f = (
        /** @type {Error} */
        c
      );
      if (a && n)
        throw f;
      return i(f);
    }
    a || (l && l.then && typeof l.then == "function" ? l.then(o, i) : l instanceof Error ? i(l) : o(l));
  }
  function i(s, ...a) {
    n || (n = !0, t(s, ...a));
  }
  function o(s) {
    i(null, s);
  }
}
const tt = { basename: tj, dirname: nj, extname: rj, join: ij, sep: "/" };
function tj(e, t) {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  Ir(e);
  let n = 0, r = -1, i = e.length, o;
  if (t === void 0 || t.length === 0 || t.length > e.length) {
    for (; i--; )
      if (e.codePointAt(i) === 47) {
        if (o) {
          n = i + 1;
          break;
        }
      } else r < 0 && (o = !0, r = i + 1);
    return r < 0 ? "" : e.slice(n, r);
  }
  if (t === e)
    return "";
  let s = -1, a = t.length - 1;
  for (; i--; )
    if (e.codePointAt(i) === 47) {
      if (o) {
        n = i + 1;
        break;
      }
    } else
      s < 0 && (o = !0, s = i + 1), a > -1 && (e.codePointAt(i) === t.codePointAt(a--) ? a < 0 && (r = i) : (a = -1, r = s));
  return n === r ? r = s : r < 0 && (r = e.length), e.slice(n, r);
}
function nj(e) {
  if (Ir(e), e.length === 0)
    return ".";
  let t = -1, n = e.length, r;
  for (; --n; )
    if (e.codePointAt(n) === 47) {
      if (r) {
        t = n;
        break;
      }
    } else r || (r = !0);
  return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function rj(e) {
  Ir(e);
  let t = e.length, n = -1, r = 0, i = -1, o = 0, s;
  for (; t--; ) {
    const a = e.codePointAt(t);
    if (a === 47) {
      if (s) {
        r = t + 1;
        break;
      }
      continue;
    }
    n < 0 && (s = !0, n = t + 1), a === 46 ? i < 0 ? i = t : o !== 1 && (o = 1) : i > -1 && (o = -1);
  }
  return i < 0 || n < 0 || // We saw a non-dot character immediately before the dot.
  o === 0 || // The (right-most) trimmed path component is exactly `..`.
  o === 1 && i === n - 1 && i === r + 1 ? "" : e.slice(i, n);
}
function ij(...e) {
  let t = -1, n;
  for (; ++t < e.length; )
    Ir(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
  return n === void 0 ? "." : oj(n);
}
function oj(e) {
  Ir(e);
  const t = e.codePointAt(0) === 47;
  let n = sj(e, !t);
  return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function sj(e, t) {
  let n = "", r = 0, i = -1, o = 0, s = -1, a, l;
  for (; ++s <= e.length; ) {
    if (s < e.length)
      a = e.codePointAt(s);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(i === s - 1 || o === 1)) if (i !== s - 1 && o === 2) {
        if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
          if (n.length > 2) {
            if (l = n.lastIndexOf("/"), l !== n.length - 1) {
              l < 0 ? (n = "", r = 0) : (n = n.slice(0, l), r = n.length - 1 - n.lastIndexOf("/")), i = s, o = 0;
              continue;
            }
          } else if (n.length > 0) {
            n = "", r = 0, i = s, o = 0;
            continue;
          }
        }
        t && (n = n.length > 0 ? n + "/.." : "..", r = 2);
      } else
        n.length > 0 ? n += "/" + e.slice(i + 1, s) : n = e.slice(i + 1, s), r = s - i - 1;
      i = s, o = 0;
    } else a === 46 && o > -1 ? o++ : o = -1;
  }
  return n;
}
function Ir(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const aj = { cwd: lj };
function lj() {
  return "/";
}
function ws(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function cj(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!ws(e)) {
    const t = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    const t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return uj(e);
}
function uj(e) {
  if (e.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const t = e.pathname;
  let n = -1;
  for (; ++n < t.length; )
    if (t.codePointAt(n) === 37 && t.codePointAt(n + 1) === 50) {
      const r = t.codePointAt(n + 2);
      if (r === 70 || r === 102) {
        const i = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw i.code = "ERR_INVALID_FILE_URL_PATH", i;
      }
    }
  return decodeURIComponent(t);
}
const Do = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class Ah {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(t) {
    let n;
    t ? ws(t) ? n = { path: t } : typeof t == "string" || dj(t) ? n = { value: t } : n = t : n = {}, this.cwd = "cwd" in n ? "" : aj.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < Do.length; ) {
      const o = Do[r];
      o in n && n[o] !== void 0 && n[o] !== null && (this[o] = o === "history" ? [...n[o]] : n[o]);
    }
    let i;
    for (i in n)
      Do.includes(i) || (this[i] = n[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? tt.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(t) {
    Po(t, "basename"), Ro(t, "basename"), this.path = tt.join(this.dirname || "", t);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? tt.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(t) {
    _c(this.basename, "dirname"), this.path = tt.join(t || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? tt.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(t) {
    if (Ro(t, "extname"), _c(this.dirname, "extname"), t) {
      if (t.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (t.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = tt.join(this.dirname, this.stem + (t || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(t) {
    ws(t) && (t = cj(t)), Po(t, "path"), this.path !== t && this.history.push(t);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? tt.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(t) {
    Po(t, "stem"), Ro(t, "stem"), this.path = tt.join(this.dirname || "", t + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(t, n, r) {
    const i = this.message(t, n, r);
    throw i.fatal = !0, i;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(t, n, r) {
    const i = this.message(t, n, r);
    return i.fatal = void 0, i;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(t, n, r) {
    const i = new Ie(
      // @ts-expect-error: the overloads are fine.
      t,
      n,
      r
    );
    return this.path && (i.name = this.path + ":" + i.name, i.file = this.path), i.fatal = !1, this.messages.push(i), i;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(t) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(t || void 0).decode(this.value);
  }
}
function Ro(e, t) {
  if (e && e.includes(tt.sep))
    throw new Error(
      "`" + t + "` cannot be a path: did not expect `" + tt.sep + "`"
    );
}
function Po(e, t) {
  if (!e)
    throw new Error("`" + t + "` cannot be empty");
}
function _c(e, t) {
  if (!e)
    throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function dj(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const fj = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  (function(e) {
    const r = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), i = r[e], o = function() {
      return i.apply(o, arguments);
    };
    return Object.setPrototypeOf(o, r), o;
  })
), mj = {}.hasOwnProperty;
class tl extends fj {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = $C();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const t = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new tl()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      t.use(...r);
    }
    return t.data(Io(!0, {}, this.namespace)), t;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(t, n) {
    return typeof t == "string" ? arguments.length === 2 ? (zo("data", this.frozen), this.namespace[t] = n, this) : mj.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (zo("data", this.frozen), this.namespace = t, this) : this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen)
      return this;
    const t = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [n, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const i = n.call(t, ...r);
      typeof i == "function" && this.transformers.use(i);
    }
    return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(t) {
    this.freeze();
    const n = Vr(t), r = this.parser || this.Parser;
    return Oo("parse", r), r(String(n), n);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(t, n) {
    const r = this;
    return this.freeze(), Oo("process", this.parser || this.Parser), To("process", this.compiler || this.Compiler), n ? i(void 0, n) : new Promise(i);
    function i(o, s) {
      const a = Vr(t), l = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(a)
      );
      r.run(l, a, function(f, u, m) {
        if (f || !u || !m)
          return c(f);
        const h = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          u
        ), p = r.stringify(h, m);
        gj(p) ? m.value = p : m.result = p, c(
          f,
          /** @type {VFileWithOutput<CompileResult>} */
          m
        );
      });
      function c(f, u) {
        f || !u ? s(f) : o ? o(u) : n(void 0, u);
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(t) {
    let n = !1, r;
    return this.freeze(), Oo("processSync", this.parser || this.Parser), To("processSync", this.compiler || this.Compiler), this.process(t, i), eu("processSync", "process", n), r;
    function i(o, s) {
      n = !0, Xc(o), r = s;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(t, n, r) {
    $c(t), this.freeze();
    const i = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? o(void 0, r) : new Promise(o);
    function o(s, a) {
      const l = Vr(n);
      i.run(t, l, c);
      function c(f, u, m) {
        const h = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          u || t
        );
        f ? a(f) : s ? s(h) : r(void 0, h, m);
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(t, n) {
    let r = !1, i;
    return this.run(t, n, o), eu("runSync", "run", r), i;
    function o(s, a) {
      Xc(s), i = a, r = !0;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(t, n) {
    this.freeze();
    const r = Vr(n), i = this.compiler || this.Compiler;
    return To("stringify", i), $c(t), i(t, r);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(t, ...n) {
    const r = this.attachers, i = this.namespace;
    if (zo("use", this.frozen), t != null) if (typeof t == "function")
      l(t, n);
    else if (typeof t == "object")
      Array.isArray(t) ? a(t) : s(t);
    else
      throw new TypeError("Expected usable value, not `" + t + "`");
    return this;
    function o(c) {
      if (typeof c == "function")
        l(c, []);
      else if (typeof c == "object")
        if (Array.isArray(c)) {
          const [f, ...u] = (
            /** @type {PluginTuple<Array<unknown>>} */
            c
          );
          l(f, u);
        } else
          s(c);
      else
        throw new TypeError("Expected usable value, not `" + c + "`");
    }
    function s(c) {
      if (!("plugins" in c) && !("settings" in c))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      a(c.plugins), c.settings && (i.settings = Io(!0, i.settings, c.settings));
    }
    function a(c) {
      let f = -1;
      if (c != null) if (Array.isArray(c))
        for (; ++f < c.length; ) {
          const u = c[f];
          o(u);
        }
      else
        throw new TypeError("Expected a list of plugins, not `" + c + "`");
    }
    function l(c, f) {
      let u = -1, m = -1;
      for (; ++u < r.length; )
        if (r[u][0] === c) {
          m = u;
          break;
        }
      if (m === -1)
        r.push([c, ...f]);
      else if (f.length > 0) {
        let [h, ...p] = f;
        const g = r[m][1];
        vs(g) && vs(h) && (h = Io(!0, g, h)), r[m] = [c, h, ...p];
      }
    }
  }
}
const hj = new tl().freeze();
function Oo(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function To(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function zo(e, t) {
  if (t)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function $c(e) {
  if (!vs(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function eu(e, t, n) {
  if (!n)
    throw new Error(
      "`" + e + "` finished async. Use `" + t + "` instead"
    );
}
function Vr(e) {
  return pj(e) ? e : new Ah(e);
}
function pj(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function gj(e) {
  return typeof e == "string" || xj(e);
}
function xj(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const bj = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", tu = [], nu = { allowDangerousHtml: !0 }, yj = /^(https?|ircs?|mailto|xmpp)$/i, vj = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  { from: "className", id: "remove-classname" },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function wj(e) {
  const t = Aj(e), n = kj(e);
  return Ej(t.runSync(t.parse(n), n), e);
}
function Aj(e) {
  const t = e.rehypePlugins || tu, n = e.remarkPlugins || tu, r = e.remarkRehypeOptions ? { ...e.remarkRehypeOptions, ...nu } : nu;
  return hj().use(tC).use(n).use(XC, r).use(t);
}
function kj(e) {
  const t = e.children || "", n = new Ah();
  return typeof t == "string" && (n.value = t), n;
}
function Ej(e, t) {
  const n = t.allowedElements, r = t.allowElement, i = t.components, o = t.disallowedElements, s = t.skipHtml, a = t.unwrapDisallowed, l = t.urlTransform || Cj;
  for (const f of vj)
    Object.hasOwn(t, f.from) && ("" + f.from + (f.to ? "use `" + f.to + "` instead" : "remove it") + bj + f.id, void 0);
  return el(e, c), G1(e, {
    Fragment: d.Fragment,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: d.jsx,
    jsxs: d.jsxs,
    passKeys: !0,
    passNode: !0
  });
  function c(f, u, m) {
    if (f.type === "raw" && m && typeof u == "number")
      return s ? m.children.splice(u, 1) : m.children[u] = { type: "text", value: f.value }, u;
    if (f.type === "element") {
      let h;
      for (h in jo)
        if (Object.hasOwn(jo, h) && Object.hasOwn(f.properties, h)) {
          const p = f.properties[h], g = jo[h];
          (g === null || g.includes(f.tagName)) && (f.properties[h] = l(String(p || ""), h, f));
        }
    }
    if (f.type === "element") {
      let h = n ? !n.includes(f.tagName) : o ? o.includes(f.tagName) : !1;
      if (!h && r && typeof u == "number" && (h = !r(f, u, m)), h && m && typeof u == "number")
        return a && f.children ? m.children.splice(u, 1, ...f.children) : m.children.splice(u, 1), u;
    }
  }
}
function Cj(e) {
  const t = e.indexOf(":"), n = e.indexOf("?"), r = e.indexOf("#"), i = e.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    t === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && t > i || n !== -1 && t > n || r !== -1 && t > r || // It is a protocol, it should be allowed.
    yj.test(e.slice(0, t)) ? e : ""
  );
}
function ru(e, t) {
  const n = String(e);
  if (typeof t != "string")
    throw new TypeError("Expected character");
  let r = 0, i = n.indexOf(t);
  for (; i !== -1; )
    r++, i = n.indexOf(t, i + t.length);
  return r;
}
function jj(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function Mj(e, t, n) {
  const i = eo((n || {}).ignore || []), o = Sj(t);
  let s = -1;
  for (; ++s < o.length; )
    wh(e, "text", a);
  function a(c, f) {
    let u = -1, m;
    for (; ++u < f.length; ) {
      const h = f[u], p = m ? m.children : void 0;
      if (i(
        h,
        p ? p.indexOf(h) : void 0,
        m
      ))
        return;
      m = h;
    }
    if (m)
      return l(c, f);
  }
  function l(c, f) {
    const u = f[f.length - 1], m = o[s][0], h = o[s][1];
    let p = 0;
    const y = u.children.indexOf(c);
    let x = !1, k = [];
    m.lastIndex = 0;
    let w = m.exec(c.value);
    for (; w; ) {
      const j = w.index, S = {
        index: w.index,
        input: w.input,
        stack: [...f, c]
      };
      let E = h(...w, S);
      if (typeof E == "string" && (E = E.length > 0 ? { type: "text", value: E } : void 0), E === !1 ? m.lastIndex = j + 1 : (p !== j && k.push({
        type: "text",
        value: c.value.slice(p, j)
      }), Array.isArray(E) ? k.push(...E) : E && k.push(E), p = j + w[0].length, x = !0), !m.global)
        break;
      w = m.exec(c.value);
    }
    return x ? (p < c.value.length && k.push({ type: "text", value: c.value.slice(p) }), u.children.splice(y, 1, ...k)) : k = [c], y + k.length;
  }
}
function Sj(e) {
  const t = [];
  if (!Array.isArray(e))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const n = !e[0] || Array.isArray(e[0]) ? e : [e];
  let r = -1;
  for (; ++r < n.length; ) {
    const i = n[r];
    t.push([Nj(i[0]), Ij(i[1])]);
  }
  return t;
}
function Nj(e) {
  return typeof e == "string" ? new RegExp(jj(e), "g") : e;
}
function Ij(e) {
  return typeof e == "function" ? e : function() {
    return e;
  };
}
const Bo = "phrasing", Go = ["autolink", "link", "image", "label"];
function Dj() {
  return {
    transforms: [Gj],
    enter: {
      literalAutolink: Pj,
      literalAutolinkEmail: Fo,
      literalAutolinkHttp: Fo,
      literalAutolinkWww: Fo
    },
    exit: {
      literalAutolink: Bj,
      literalAutolinkEmail: zj,
      literalAutolinkHttp: Oj,
      literalAutolinkWww: Tj
    }
  };
}
function Rj() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: Bo,
        notInConstruct: Go
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: Bo,
        notInConstruct: Go
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: Bo,
        notInConstruct: Go
      }
    ]
  };
}
function Pj(e) {
  this.enter({ type: "link", title: null, url: "", children: [] }, e);
}
function Fo(e) {
  this.config.enter.autolinkProtocol.call(this, e);
}
function Oj(e) {
  this.config.exit.autolinkProtocol.call(this, e);
}
function Tj(e) {
  this.config.exit.data.call(this, e);
  const t = this.stack[this.stack.length - 1];
  t.type, t.url = "http://" + this.sliceSerialize(e);
}
function zj(e) {
  this.config.exit.autolinkEmail.call(this, e);
}
function Bj(e) {
  this.exit(e);
}
function Gj(e) {
  Mj(
    e,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Fj],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), Lj]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function Fj(e, t, n, r, i) {
  let o = "";
  if (!kh(i) || (/^w/i.test(t) && (n = t + n, t = "", o = "http://"), !Yj(n)))
    return !1;
  const s = Hj(n + r);
  if (!s[0]) return !1;
  const a = {
    type: "link",
    title: null,
    url: o + t + s[0],
    children: [{ type: "text", value: t + s[0] }]
  };
  return s[1] ? [a, { type: "text", value: s[1] }] : a;
}
function Lj(e, t, n, r) {
  return (
    // Not an expected previous character.
    !kh(r, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(n) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + t + "@" + n,
      children: [{ type: "text", value: t + "@" + n }]
    }
  );
}
function Yj(e) {
  const t = e.split(".");
  return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function Hj(e) {
  const t = /[!"&'),.:;<>?\]}]+$/.exec(e);
  if (!t)
    return [e, void 0];
  e = e.slice(0, t.index);
  let n = t[0], r = n.indexOf(")");
  const i = ru(e, "(");
  let o = ru(e, ")");
  for (; r !== -1 && i > o; )
    e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), o++;
  return [e, n];
}
function kh(e, t) {
  const n = e.input.charCodeAt(e.index - 1);
  return (e.index === 0 || tn(n) || Ki(n)) && // If it’s an email, the previous character should not be a slash.
  (!t || n !== 47);
}
Eh.peek = Kj;
function Qj() {
  this.buffer();
}
function Uj(e) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, e);
}
function Zj() {
  this.buffer();
}
function Wj(e) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    e
  );
}
function Jj(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = Xe(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function Vj(e) {
  this.exit(e);
}
function qj(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = Xe(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function Xj(e) {
  this.exit(e);
}
function Kj() {
  return "[";
}
function Eh(e, t, n, r) {
  const i = n.createTracker(r);
  let o = i.move("[^");
  const s = n.enter("footnoteReference"), a = n.enter("reference");
  return o += i.move(
    n.safe(n.associationId(e), { after: "]", before: o })
  ), a(), s(), o += i.move("]"), o;
}
function _j() {
  return {
    enter: {
      gfmFootnoteCallString: Qj,
      gfmFootnoteCall: Uj,
      gfmFootnoteDefinitionLabelString: Zj,
      gfmFootnoteDefinition: Wj
    },
    exit: {
      gfmFootnoteCallString: Jj,
      gfmFootnoteCall: Vj,
      gfmFootnoteDefinitionLabelString: qj,
      gfmFootnoteDefinition: Xj
    }
  };
}
function $j(e) {
  let t = !1;
  return e && e.firstLineBlank && (t = !0), {
    handlers: { footnoteDefinition: n, footnoteReference: Eh },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function n(r, i, o, s) {
    const a = o.createTracker(s);
    let l = a.move("[^");
    const c = o.enter("footnoteDefinition"), f = o.enter("label");
    return l += a.move(
      o.safe(o.associationId(r), { before: l, after: "]" })
    ), f(), l += a.move("]:"), r.children && r.children.length > 0 && (a.shift(4), l += a.move(
      (t ? `
` : " ") + o.indentLines(
        o.containerFlow(r, a.current()),
        t ? Ch : eM
      )
    )), c(), l;
  }
}
function eM(e, t, n) {
  return t === 0 ? e : Ch(e, t, n);
}
function Ch(e, t, n) {
  return (n ? "" : "    ") + e;
}
const tM = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
jh.peek = sM;
function nM() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: iM },
    exit: { strikethrough: oM }
  };
}
function rM() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: tM
      }
    ],
    handlers: { delete: jh }
  };
}
function iM(e) {
  this.enter({ type: "delete", children: [] }, e);
}
function oM(e) {
  this.exit(e);
}
function jh(e, t, n, r) {
  const i = n.createTracker(r), o = n.enter("strikethrough");
  let s = i.move("~~");
  return s += n.containerPhrasing(e, {
    ...i.current(),
    before: s,
    after: "~"
  }), s += i.move("~~"), o(), s;
}
function sM() {
  return "~";
}
function aM(e) {
  return e.length;
}
function lM(e, t) {
  const n = t || {}, r = (n.align || []).concat(), i = n.stringLength || aM, o = [], s = [], a = [], l = [];
  let c = 0, f = -1;
  for (; ++f < e.length; ) {
    const g = [], y = [];
    let x = -1;
    for (e[f].length > c && (c = e[f].length); ++x < e[f].length; ) {
      const k = cM(e[f][x]);
      if (n.alignDelimiters !== !1) {
        const w = i(k);
        y[x] = w, (l[x] === void 0 || w > l[x]) && (l[x] = w);
      }
      g.push(k);
    }
    s[f] = g, a[f] = y;
  }
  let u = -1;
  if (typeof r == "object" && "length" in r)
    for (; ++u < c; )
      o[u] = iu(r[u]);
  else {
    const g = iu(r);
    for (; ++u < c; )
      o[u] = g;
  }
  u = -1;
  const m = [], h = [];
  for (; ++u < c; ) {
    const g = o[u];
    let y = "", x = "";
    g === 99 ? (y = ":", x = ":") : g === 108 ? y = ":" : g === 114 && (x = ":");
    let k = n.alignDelimiters === !1 ? 1 : Math.max(
      1,
      l[u] - y.length - x.length
    );
    const w = y + "-".repeat(k) + x;
    n.alignDelimiters !== !1 && (k = y.length + k + x.length, k > l[u] && (l[u] = k), h[u] = k), m[u] = w;
  }
  s.splice(1, 0, m), a.splice(1, 0, h), f = -1;
  const p = [];
  for (; ++f < s.length; ) {
    const g = s[f], y = a[f];
    u = -1;
    const x = [];
    for (; ++u < c; ) {
      const k = g[u] || "";
      let w = "", j = "";
      if (n.alignDelimiters !== !1) {
        const S = l[u] - (y[u] || 0), E = o[u];
        E === 114 ? w = " ".repeat(S) : E === 99 ? S % 2 ? (w = " ".repeat(S / 2 + 0.5), j = " ".repeat(S / 2 - 0.5)) : (w = " ".repeat(S / 2), j = w) : j = " ".repeat(S);
      }
      n.delimiterStart !== !1 && !u && x.push("|"), n.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(n.alignDelimiters === !1 && k === "") && (n.delimiterStart !== !1 || u) && x.push(" "), n.alignDelimiters !== !1 && x.push(w), x.push(k), n.alignDelimiters !== !1 && x.push(j), n.padding !== !1 && x.push(" "), (n.delimiterEnd !== !1 || u !== c - 1) && x.push("|");
    }
    p.push(
      n.delimiterEnd === !1 ? x.join("").replace(/ +$/, "") : x.join("")
    );
  }
  return p.join(`
`);
}
function cM(e) {
  return e == null ? "" : String(e);
}
function iu(e) {
  const t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function uM(e, t, n, r) {
  const i = n.enter("blockquote"), o = n.createTracker(r);
  o.move("> "), o.shift(2);
  const s = n.indentLines(
    n.containerFlow(e, o.current()),
    dM
  );
  return i(), s;
}
function dM(e, t, n) {
  return ">" + (n ? "" : " ") + e;
}
function fM(e, t) {
  return ou(e, t.inConstruct, !0) && !ou(e, t.notInConstruct, !1);
}
function ou(e, t, n) {
  if (typeof t == "string" && (t = [t]), !t || t.length === 0)
    return n;
  let r = -1;
  for (; ++r < t.length; )
    if (e.includes(t[r]))
      return !0;
  return !1;
}
function su(e, t, n, r) {
  let i = -1;
  for (; ++i < n.unsafe.length; )
    if (n.unsafe[i].character === `
` && fM(n.stack, n.unsafe[i]))
      return /[ \t]/.test(r.before) ? "" : " ";
  return `\\
`;
}
function mM(e, t) {
  const n = String(e);
  let r = n.indexOf(t), i = r, o = 0, s = 0;
  if (typeof t != "string")
    throw new TypeError("Expected substring");
  for (; r !== -1; )
    r === i ? ++o > s && (s = o) : o = 1, i = r + t.length, r = n.indexOf(t, i);
  return s;
}
function hM(e, t) {
  return !!(t.options.fences === !1 && e.value && // If there’s no info…
  !e.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(e.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
function pM(e) {
  const t = e.options.fence || "`";
  if (t !== "`" && t !== "~")
    throw new Error(
      "Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return t;
}
function gM(e, t, n, r) {
  const i = pM(n), o = e.value || "", s = i === "`" ? "GraveAccent" : "Tilde";
  if (hM(e, n)) {
    const u = n.enter("codeIndented"), m = n.indentLines(o, xM);
    return u(), m;
  }
  const a = n.createTracker(r), l = i.repeat(Math.max(mM(o, i) + 1, 3)), c = n.enter("codeFenced");
  let f = a.move(l);
  if (e.lang) {
    const u = n.enter(`codeFencedLang${s}`);
    f += a.move(
      n.safe(e.lang, {
        before: f,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), u();
  }
  if (e.lang && e.meta) {
    const u = n.enter(`codeFencedMeta${s}`);
    f += a.move(" "), f += a.move(
      n.safe(e.meta, {
        before: f,
        after: `
`,
        encode: ["`"],
        ...a.current()
      })
    ), u();
  }
  return f += a.move(`
`), o && (f += a.move(o + `
`)), f += a.move(l), c(), f;
}
function xM(e, t, n) {
  return (n ? "" : "    ") + e;
}
function nl(e) {
  const t = e.options.quote || '"';
  if (t !== '"' && t !== "'")
    throw new Error(
      "Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`"
    );
  return t;
}
function bM(e, t, n, r) {
  const i = nl(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.enter("definition");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let c = l.move("[");
  return c += l.move(
    n.safe(n.associationId(e), {
      before: c,
      after: "]",
      ...l.current()
    })
  ), c += l.move("]: "), a(), // If there’s no url, or…
  !e.url || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), c += l.move("<"), c += l.move(
    n.safe(e.url, { before: c, after: ">", ...l.current() })
  ), c += l.move(">")) : (a = n.enter("destinationRaw"), c += l.move(
    n.safe(e.url, {
      before: c,
      after: e.title ? " " : `
`,
      ...l.current()
    })
  )), a(), e.title && (a = n.enter(`title${o}`), c += l.move(" " + i), c += l.move(
    n.safe(e.title, {
      before: c,
      after: i,
      ...l.current()
    })
  ), c += l.move(i), a()), s(), c;
}
function yM(e) {
  const t = e.options.emphasis || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return t;
}
function hr(e) {
  return "&#x" + e.toString(16).toUpperCase() + ";";
}
function Ai(e, t, n) {
  const r = Cn(e), i = Cn(t);
  return r === void 0 ? i === void 0 ? (
    // Letter inside:
    // we have to encode *both* letters for `_` as it is looser.
    // it already forms for `*` (and GFMs `~`).
    n === "_" ? { inside: !0, outside: !0 } : { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (letter, whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: encode outer (letter)
    { inside: !1, outside: !0 }
  ) : r === 1 ? i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode inner (whitespace).
    { inside: !0, outside: !1 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  );
}
Mh.peek = vM;
function Mh(e, t, n, r) {
  const i = yM(n), o = n.enter("emphasis"), s = n.createTracker(r), a = s.move(i);
  let l = s.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), f = Ai(
    r.before.charCodeAt(r.before.length - 1),
    c,
    i
  );
  f.inside && (l = hr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), m = Ai(r.after.charCodeAt(0), u, i);
  m.inside && (l = l.slice(0, -1) + hr(u));
  const h = s.move(i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: m.outside,
    before: f.outside
  }, a + l + h;
}
function vM(e, t, n) {
  return n.options.emphasis || "*";
}
function wM(e, t) {
  let n = !1;
  return el(e, function(r) {
    if ("value" in r && /\r?\n|\r/.test(r.value) || r.type === "break")
      return n = !0, bs;
  }), !!((!e.depth || e.depth < 3) && Ja(e) && (t.options.setext || n));
}
function AM(e, t, n, r) {
  const i = Math.max(Math.min(6, e.depth || 1), 1), o = n.createTracker(r);
  if (wM(e, n)) {
    const f = n.enter("headingSetext"), u = n.enter("phrasing"), m = n.containerPhrasing(e, {
      ...o.current(),
      before: `
`,
      after: `
`
    });
    return u(), f(), m + `
` + (i === 1 ? "=" : "-").repeat(
      // The whole size…
      m.length - // Minus the position of the character after the last EOL (or
      // 0 if there is none)…
      (Math.max(m.lastIndexOf("\r"), m.lastIndexOf(`
`)) + 1)
    );
  }
  const s = "#".repeat(i), a = n.enter("headingAtx"), l = n.enter("phrasing");
  o.move(s + " ");
  let c = n.containerPhrasing(e, {
    before: "# ",
    after: `
`,
    ...o.current()
  });
  return /^[\t ]/.test(c) && (c = hr(c.charCodeAt(0)) + c.slice(1)), c = c ? s + " " + c : s, n.options.closeAtx && (c += " " + s), l(), a(), c;
}
Sh.peek = kM;
function Sh(e) {
  return e.value || "";
}
function kM() {
  return "<";
}
Nh.peek = EM;
function Nh(e, t, n, r) {
  const i = nl(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.enter("image");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let c = l.move("![");
  return c += l.move(
    n.safe(e.alt, { before: c, after: "]", ...l.current() })
  ), c += l.move("]("), a(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (a = n.enter("destinationLiteral"), c += l.move("<"), c += l.move(
    n.safe(e.url, { before: c, after: ">", ...l.current() })
  ), c += l.move(">")) : (a = n.enter("destinationRaw"), c += l.move(
    n.safe(e.url, {
      before: c,
      after: e.title ? " " : ")",
      ...l.current()
    })
  )), a(), e.title && (a = n.enter(`title${o}`), c += l.move(" " + i), c += l.move(
    n.safe(e.title, {
      before: c,
      after: i,
      ...l.current()
    })
  ), c += l.move(i), a()), c += l.move(")"), s(), c;
}
function EM() {
  return "!";
}
Ih.peek = CM;
function Ih(e, t, n, r) {
  const i = e.referenceType, o = n.enter("imageReference");
  let s = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("![");
  const c = n.safe(e.alt, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(c + "]["), s();
  const f = n.stack;
  n.stack = [], s = n.enter("reference");
  const u = n.safe(n.associationId(e), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), n.stack = f, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function CM() {
  return "!";
}
Dh.peek = jM;
function Dh(e, t, n) {
  let r = e.value || "", i = "`", o = -1;
  for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(r); )
    i += "`";
  for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++o < n.unsafe.length; ) {
    const s = n.unsafe[o], a = n.compilePattern(s);
    let l;
    if (s.atBreak)
      for (; l = a.exec(r); ) {
        let c = l.index;
        r.charCodeAt(c) === 10 && r.charCodeAt(c - 1) === 13 && c--, r = r.slice(0, c) + " " + r.slice(l.index + 1);
      }
  }
  return i + r + i;
}
function jM() {
  return "`";
}
function Rh(e, t) {
  const n = Ja(e);
  return !!(!t.options.resourceLink && // If there’s a url…
  e.url && // And there’s a no title…
  !e.title && // And the content of `node` is a single text node…
  e.children && e.children.length === 1 && e.children[0].type === "text" && // And if the url is the same as the content…
  (n === e.url || "mailto:" + n === e.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(e.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(e.url));
}
Ph.peek = MM;
function Ph(e, t, n, r) {
  const i = nl(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.createTracker(r);
  let a, l;
  if (Rh(e, n)) {
    const f = n.stack;
    n.stack = [], a = n.enter("autolink");
    let u = s.move("<");
    return u += s.move(
      n.containerPhrasing(e, {
        before: u,
        after: ">",
        ...s.current()
      })
    ), u += s.move(">"), a(), n.stack = f, u;
  }
  a = n.enter("link"), l = n.enter("label");
  let c = s.move("[");
  return c += s.move(
    n.containerPhrasing(e, {
      before: c,
      after: "](",
      ...s.current()
    })
  ), c += s.move("]("), l(), // If there’s no url but there is a title…
  !e.url && e.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(e.url) ? (l = n.enter("destinationLiteral"), c += s.move("<"), c += s.move(
    n.safe(e.url, { before: c, after: ">", ...s.current() })
  ), c += s.move(">")) : (l = n.enter("destinationRaw"), c += s.move(
    n.safe(e.url, {
      before: c,
      after: e.title ? " " : ")",
      ...s.current()
    })
  )), l(), e.title && (l = n.enter(`title${o}`), c += s.move(" " + i), c += s.move(
    n.safe(e.title, {
      before: c,
      after: i,
      ...s.current()
    })
  ), c += s.move(i), l()), c += s.move(")"), a(), c;
}
function MM(e, t, n) {
  return Rh(e, n) ? "<" : "[";
}
Oh.peek = SM;
function Oh(e, t, n, r) {
  const i = e.referenceType, o = n.enter("linkReference");
  let s = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("[");
  const c = n.containerPhrasing(e, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(c + "]["), s();
  const f = n.stack;
  n.stack = [], s = n.enter("reference");
  const u = n.safe(n.associationId(e), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), n.stack = f, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function SM() {
  return "[";
}
function rl(e) {
  const t = e.options.bullet || "*";
  if (t !== "*" && t !== "+" && t !== "-")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return t;
}
function NM(e) {
  const t = rl(e), n = e.options.bulletOther;
  if (!n)
    return t === "*" ? "-" : "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
    );
  if (n === t)
    throw new Error(
      "Expected `bullet` (`" + t + "`) and `bulletOther` (`" + n + "`) to be different"
    );
  return n;
}
function IM(e) {
  const t = e.options.bulletOrdered || ".";
  if (t !== "." && t !== ")")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return t;
}
function Th(e) {
  const t = e.options.rule || "*";
  if (t !== "*" && t !== "-" && t !== "_")
    throw new Error(
      "Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return t;
}
function DM(e, t, n, r) {
  const i = n.enter("list"), o = n.bulletCurrent;
  let s = e.ordered ? IM(n) : rl(n);
  const a = e.ordered ? s === "." ? ")" : "." : NM(n);
  let l = t && n.bulletLastUsed ? s === n.bulletLastUsed : !1;
  if (!e.ordered) {
    const f = e.children ? e.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (s === "*" || s === "-") && // Empty first list item:
      f && (!f.children || !f.children[0]) && // Directly in two other list items:
      n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && // That are each the first child.
      n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (l = !0), Th(n) === s && f
    ) {
      let u = -1;
      for (; ++u < e.children.length; ) {
        const m = e.children[u];
        if (m && m.type === "listItem" && m.children && m.children[0] && m.children[0].type === "thematicBreak") {
          l = !0;
          break;
        }
      }
    }
  }
  l && (s = a), n.bulletCurrent = s;
  const c = n.containerFlow(e, r);
  return n.bulletLastUsed = s, n.bulletCurrent = o, i(), c;
}
function RM(e) {
  const t = e.options.listItemIndent || "one";
  if (t !== "tab" && t !== "one" && t !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return t;
}
function PM(e, t, n, r) {
  const i = RM(n);
  let o = n.bulletCurrent || rl(n);
  t && t.type === "list" && t.ordered && (o = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (n.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + o);
  let s = o.length + 1;
  (i === "tab" || i === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (s = Math.ceil(s / 4) * 4);
  const a = n.createTracker(r);
  a.move(o + " ".repeat(s - o.length)), a.shift(s);
  const l = n.enter("listItem"), c = n.indentLines(
    n.containerFlow(e, a.current()),
    f
  );
  return l(), c;
  function f(u, m, h) {
    return m ? (h ? "" : " ".repeat(s)) + u : (h ? o : o + " ".repeat(s - o.length)) + u;
  }
}
function OM(e, t, n, r) {
  const i = n.enter("paragraph"), o = n.enter("phrasing"), s = n.containerPhrasing(e, r);
  return o(), i(), s;
}
const TM = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  eo([
    "break",
    "delete",
    "emphasis",
    // To do: next major: removed since footnotes were added to GFM.
    "footnote",
    "footnoteReference",
    "image",
    "imageReference",
    "inlineCode",
    // Enabled by `mdast-util-math`:
    "inlineMath",
    "link",
    "linkReference",
    // Enabled by `mdast-util-mdx`:
    "mdxJsxTextElement",
    // Enabled by `mdast-util-mdx`:
    "mdxTextExpression",
    "strong",
    "text",
    // Enabled by `mdast-util-directive`:
    "textDirective"
  ])
);
function zM(e, t, n, r) {
  return (e.children.some(function(s) {
    return TM(s);
  }) ? n.containerPhrasing : n.containerFlow).call(n, e, r);
}
function BM(e) {
  const t = e.options.strong || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`"
    );
  return t;
}
zh.peek = GM;
function zh(e, t, n, r) {
  const i = BM(n), o = n.enter("strong"), s = n.createTracker(r), a = s.move(i + i);
  let l = s.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), f = Ai(
    r.before.charCodeAt(r.before.length - 1),
    c,
    i
  );
  f.inside && (l = hr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), m = Ai(r.after.charCodeAt(0), u, i);
  m.inside && (l = l.slice(0, -1) + hr(u));
  const h = s.move(i + i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: m.outside,
    before: f.outside
  }, a + l + h;
}
function GM(e, t, n) {
  return n.options.strong || "*";
}
function FM(e, t, n, r) {
  return n.safe(e.value, r);
}
function LM(e) {
  const t = e.options.ruleRepetition || 3;
  if (t < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return t;
}
function YM(e, t, n) {
  const r = (Th(n) + (n.options.ruleSpaces ? " " : "")).repeat(LM(n));
  return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
const Bh = {
  blockquote: uM,
  break: su,
  code: gM,
  definition: bM,
  emphasis: Mh,
  hardBreak: su,
  heading: AM,
  html: Sh,
  image: Nh,
  imageReference: Ih,
  inlineCode: Dh,
  link: Ph,
  linkReference: Oh,
  list: DM,
  listItem: PM,
  paragraph: OM,
  root: zM,
  strong: zh,
  text: FM,
  thematicBreak: YM
};
function HM() {
  return {
    enter: {
      table: QM,
      tableData: au,
      tableHeader: au,
      tableRow: ZM
    },
    exit: {
      codeText: WM,
      table: UM,
      tableData: Lo,
      tableHeader: Lo,
      tableRow: Lo
    }
  };
}
function QM(e) {
  const t = e._align;
  this.enter(
    {
      type: "table",
      align: t.map(function(n) {
        return n === "none" ? null : n;
      }),
      children: []
    },
    e
  ), this.data.inTable = !0;
}
function UM(e) {
  this.exit(e), this.data.inTable = void 0;
}
function ZM(e) {
  this.enter({ type: "tableRow", children: [] }, e);
}
function Lo(e) {
  this.exit(e);
}
function au(e) {
  this.enter({ type: "tableCell", children: [] }, e);
}
function WM(e) {
  let t = this.resume();
  this.data.inTable && (t = t.replace(/\\([\\|])/g, JM));
  const n = this.stack[this.stack.length - 1];
  n.type, n.value = t, this.exit(e);
}
function JM(e, t) {
  return t === "|" ? t : e;
}
function VM(e) {
  const t = e || {}, n = t.tableCellPadding, r = t.tablePipeAlign, i = t.stringLength, o = n ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      { character: `
`, inConstruct: "tableCell" },
      // A pipe, when followed by a tab or space (padding), or a dash or colon
      // (unpadded delimiter row), could result in a table.
      { atBreak: !0, character: "|", after: "[	 :-]" },
      // A pipe in a cell must be encoded.
      { character: "|", inConstruct: "tableCell" },
      // A colon must be followed by a dash, in which case it could start a
      // delimiter row.
      { atBreak: !0, character: ":", after: "-" },
      // A delimiter row can also start with a dash, when followed by more
      // dashes, a colon, or a pipe.
      // This is a stricter version than the built in check for lists, thematic
      // breaks, and setex heading underlines though:
      // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
      { atBreak: !0, character: "-", after: "[:|-]" }
    ],
    handlers: {
      inlineCode: m,
      table: s,
      tableCell: l,
      tableRow: a
    }
  };
  function s(h, p, g, y) {
    return c(f(h, g, y), h.align);
  }
  function a(h, p, g, y) {
    const x = u(h, g, y), k = c([x]);
    return k.slice(0, k.indexOf(`
`));
  }
  function l(h, p, g, y) {
    const x = g.enter("tableCell"), k = g.enter("phrasing"), w = g.containerPhrasing(h, {
      ...y,
      before: o,
      after: o
    });
    return k(), x(), w;
  }
  function c(h, p) {
    return lM(h, {
      align: p,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function f(h, p, g) {
    const y = h.children;
    let x = -1;
    const k = [], w = p.enter("table");
    for (; ++x < y.length; )
      k[x] = u(y[x], p, g);
    return w(), k;
  }
  function u(h, p, g) {
    const y = h.children;
    let x = -1;
    const k = [], w = p.enter("tableRow");
    for (; ++x < y.length; )
      k[x] = l(y[x], h, p, g);
    return w(), k;
  }
  function m(h, p, g) {
    let y = Bh.inlineCode(h, p, g);
    return g.stack.includes("tableCell") && (y = y.replace(/\|/g, "\\$&")), y;
  }
}
function qM() {
  return {
    exit: {
      taskListCheckValueChecked: lu,
      taskListCheckValueUnchecked: lu,
      paragraph: KM
    }
  };
}
function XM() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: _M }
  };
}
function lu(e) {
  const t = this.stack[this.stack.length - 2];
  t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function KM(e) {
  const t = this.stack[this.stack.length - 2];
  if (t && t.type === "listItem" && typeof t.checked == "boolean") {
    const n = this.stack[this.stack.length - 1];
    n.type;
    const r = n.children[0];
    if (r && r.type === "text") {
      const i = t.children;
      let o = -1, s;
      for (; ++o < i.length; ) {
        const a = i[o];
        if (a.type === "paragraph") {
          s = a;
          break;
        }
      }
      s === n && (r.value = r.value.slice(1), r.value.length === 0 ? n.children.shift() : n.position && r.position && typeof r.position.start.offset == "number" && (r.position.start.column++, r.position.start.offset++, n.position.start = Object.assign({}, r.position.start)));
    }
  }
  this.exit(e);
}
function _M(e, t, n, r) {
  const i = e.children[0], o = typeof e.checked == "boolean" && i && i.type === "paragraph", s = "[" + (e.checked ? "x" : " ") + "] ", a = n.createTracker(r);
  o && a.move(s);
  let l = Bh.listItem(e, t, n, {
    ...r,
    ...a.current()
  });
  return o && (l = l.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, c)), l;
  function c(f) {
    return f + s;
  }
}
function $M() {
  return [
    Dj(),
    _j(),
    nM(),
    HM(),
    qM()
  ];
}
function eS(e) {
  return {
    extensions: [
      Rj(),
      $j(e),
      rM(),
      VM(e),
      XM()
    ]
  };
}
const tS = {
  tokenize: aS,
  partial: !0
}, Gh = {
  tokenize: lS,
  partial: !0
}, Fh = {
  tokenize: cS,
  partial: !0
}, Lh = {
  tokenize: uS,
  partial: !0
}, nS = {
  tokenize: dS,
  partial: !0
}, Yh = {
  name: "wwwAutolink",
  tokenize: oS,
  previous: Qh
}, Hh = {
  name: "protocolAutolink",
  tokenize: sS,
  previous: Uh
}, wt = {
  name: "emailAutolink",
  tokenize: iS,
  previous: Zh
}, dt = {};
function rS() {
  return {
    text: dt
  };
}
let Zt = 48;
for (; Zt < 123; )
  dt[Zt] = wt, Zt++, Zt === 58 ? Zt = 65 : Zt === 91 && (Zt = 97);
dt[43] = wt;
dt[45] = wt;
dt[46] = wt;
dt[95] = wt;
dt[72] = [wt, Hh];
dt[104] = [wt, Hh];
dt[87] = [wt, Yh];
dt[119] = [wt, Yh];
function iS(e, t, n) {
  const r = this;
  let i, o;
  return s;
  function s(u) {
    return !As(u) || !Zh.call(r, r.previous) || il(r.events) ? n(u) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), a(u));
  }
  function a(u) {
    return As(u) ? (e.consume(u), a) : u === 64 ? (e.consume(u), l) : n(u);
  }
  function l(u) {
    return u === 46 ? e.check(nS, f, c)(u) : u === 45 || u === 95 || Se(u) ? (o = !0, e.consume(u), l) : f(u);
  }
  function c(u) {
    return e.consume(u), i = !0, l;
  }
  function f(u) {
    return o && i && De(r.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(u)) : n(u);
  }
}
function oS(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return s !== 87 && s !== 119 || !Qh.call(r, r.previous) || il(r.events) ? n(s) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(tS, e.attempt(Gh, e.attempt(Fh, o), n), n)(s));
  }
  function o(s) {
    return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(s);
  }
}
function sS(e, t, n) {
  const r = this;
  let i = "", o = !1;
  return s;
  function s(u) {
    return (u === 72 || u === 104) && Uh.call(r, r.previous) && !il(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), i += String.fromCodePoint(u), e.consume(u), a) : n(u);
  }
  function a(u) {
    if (De(u) && i.length < 5)
      return i += String.fromCodePoint(u), e.consume(u), a;
    if (u === 58) {
      const m = i.toLowerCase();
      if (m === "http" || m === "https")
        return e.consume(u), l;
    }
    return n(u);
  }
  function l(u) {
    return u === 47 ? (e.consume(u), o ? c : (o = !0, l)) : n(u);
  }
  function c(u) {
    return u === null || yi(u) || ye(u) || tn(u) || Ki(u) ? n(u) : e.attempt(Gh, e.attempt(Fh, f), n)(u);
  }
  function f(u) {
    return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(u);
  }
}
function aS(e, t, n) {
  let r = 0;
  return i;
  function i(s) {
    return (s === 87 || s === 119) && r < 3 ? (r++, e.consume(s), i) : s === 46 && r === 3 ? (e.consume(s), o) : n(s);
  }
  function o(s) {
    return s === null ? n(s) : t(s);
  }
}
function lS(e, t, n) {
  let r, i, o;
  return s;
  function s(c) {
    return c === 46 || c === 95 ? e.check(Lh, l, a)(c) : c === null || ye(c) || tn(c) || c !== 45 && Ki(c) ? l(c) : (o = !0, e.consume(c), s);
  }
  function a(c) {
    return c === 95 ? r = !0 : (i = r, r = void 0), e.consume(c), s;
  }
  function l(c) {
    return i || r || !o ? n(c) : t(c);
  }
}
function cS(e, t) {
  let n = 0, r = 0;
  return i;
  function i(s) {
    return s === 40 ? (n++, e.consume(s), i) : s === 41 && r < n ? o(s) : s === 33 || s === 34 || s === 38 || s === 39 || s === 41 || s === 42 || s === 44 || s === 46 || s === 58 || s === 59 || s === 60 || s === 63 || s === 93 || s === 95 || s === 126 ? e.check(Lh, t, o)(s) : s === null || ye(s) || tn(s) ? t(s) : (e.consume(s), i);
  }
  function o(s) {
    return s === 41 && r++, e.consume(s), i;
  }
}
function uS(e, t, n) {
  return r;
  function r(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (e.consume(a), r) : a === 38 ? (e.consume(a), o) : a === 93 ? (e.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || ye(a) || tn(a) ? t(a) : n(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || ye(a) || tn(a) ? t(a) : r(a);
  }
  function o(a) {
    return De(a) ? s(a) : n(a);
  }
  function s(a) {
    return a === 59 ? (e.consume(a), r) : De(a) ? (e.consume(a), s) : n(a);
  }
}
function dS(e, t, n) {
  return r;
  function r(o) {
    return e.consume(o), i;
  }
  function i(o) {
    return Se(o) ? n(o) : t(o);
  }
}
function Qh(e) {
  return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || ye(e);
}
function Uh(e) {
  return !De(e);
}
function Zh(e) {
  return !(e === 47 || As(e));
}
function As(e) {
  return e === 43 || e === 45 || e === 46 || e === 95 || Se(e);
}
function il(e) {
  let t = e.length, n = !1;
  for (; t--; ) {
    const r = e[t][1];
    if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
      n = !0;
      break;
    }
    if (r._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
const fS = {
  tokenize: vS,
  partial: !0
};
function mS() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: xS,
        continuation: {
          tokenize: bS
        },
        exit: yS
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: gS
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: hS,
        resolveTo: pS
      }
    }
  };
}
function hS(e, t, n) {
  const r = this;
  let i = r.events.length;
  const o = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let s;
  for (; i--; ) {
    const l = r.events[i][1];
    if (l.type === "labelImage") {
      s = l;
      break;
    }
    if (l.type === "gfmFootnoteCall" || l.type === "labelLink" || l.type === "label" || l.type === "image" || l.type === "link")
      break;
  }
  return a;
  function a(l) {
    if (!s || !s._balanced)
      return n(l);
    const c = Xe(r.sliceSerialize({
      start: s.end,
      end: r.now()
    }));
    return c.codePointAt(0) !== 94 || !o.includes(c.slice(1)) ? n(l) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(l), e.exit("gfmFootnoteCallLabelMarker"), t(l));
  }
}
function pS(e, t) {
  let n = e.length;
  for (; n--; )
    if (e[n][1].type === "labelImage" && e[n][0] === "enter") {
      e[n][1];
      break;
    }
  e[n + 1][1].type = "data", e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
  const r = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, e[n + 3][1].start),
    end: Object.assign({}, e[e.length - 1][1].end)
  }, i = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, e[n + 3][1].end),
    end: Object.assign({}, e[n + 3][1].end)
  };
  i.end.column++, i.end.offset++, i.end._bufferIndex++;
  const o = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, i.end),
    end: Object.assign({}, e[e.length - 1][1].start)
  }, s = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, o.start),
    end: Object.assign({}, o.end)
  }, a = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    e[n + 1],
    e[n + 2],
    ["enter", r, t],
    // The `[`
    e[n + 3],
    e[n + 4],
    // The `^`.
    ["enter", i, t],
    ["exit", i, t],
    // Everything in between.
    ["enter", o, t],
    ["enter", s, t],
    ["exit", s, t],
    ["exit", o, t],
    // The ending (`]`, properly parsed and labelled).
    e[e.length - 2],
    e[e.length - 1],
    ["exit", r, t]
  ];
  return e.splice(n, e.length - n + 1, ...a), e;
}
function gS(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o = 0, s;
  return a;
  function a(u) {
    return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(u), e.exit("gfmFootnoteCallLabelMarker"), l;
  }
  function l(u) {
    return u !== 94 ? n(u) : (e.enter("gfmFootnoteCallMarker"), e.consume(u), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", c);
  }
  function c(u) {
    if (
      // Too long.
      o > 999 || // Closing brace with nothing.
      u === 93 && !s || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      u === null || u === 91 || ye(u)
    )
      return n(u);
    if (u === 93) {
      e.exit("chunkString");
      const m = e.exit("gfmFootnoteCallString");
      return i.includes(Xe(r.sliceSerialize(m))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(u), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(u);
    }
    return ye(u) || (s = !0), o++, e.consume(u), u === 92 ? f : c;
  }
  function f(u) {
    return u === 91 || u === 92 || u === 93 ? (e.consume(u), o++, c) : c(u);
  }
}
function xS(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o, s = 0, a;
  return l;
  function l(p) {
    return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(p), e.exit("gfmFootnoteDefinitionLabelMarker"), c;
  }
  function c(p) {
    return p === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(p), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", f) : n(p);
  }
  function f(p) {
    if (
      // Too long.
      s > 999 || // Closing brace with nothing.
      p === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      p === null || p === 91 || ye(p)
    )
      return n(p);
    if (p === 93) {
      e.exit("chunkString");
      const g = e.exit("gfmFootnoteDefinitionLabelString");
      return o = Xe(r.sliceSerialize(g)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(p), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), m;
    }
    return ye(p) || (a = !0), s++, e.consume(p), p === 92 ? u : f;
  }
  function u(p) {
    return p === 91 || p === 92 || p === 93 ? (e.consume(p), s++, f) : f(p);
  }
  function m(p) {
    return p === 58 ? (e.enter("definitionMarker"), e.consume(p), e.exit("definitionMarker"), i.includes(o) || i.push(o), ue(e, h, "gfmFootnoteDefinitionWhitespace")) : n(p);
  }
  function h(p) {
    return t(p);
  }
}
function bS(e, t, n) {
  return e.check(Nr, t, e.attempt(fS, t, n));
}
function yS(e) {
  e.exit("gfmFootnoteDefinition");
}
function vS(e, t, n) {
  const r = this;
  return ue(e, i, "gfmFootnoteDefinitionIndent", 5);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return s && s[1].type === "gfmFootnoteDefinitionIndent" && s[2].sliceSerialize(s[1], !0).length === 4 ? t(o) : n(o);
  }
}
function wS(e) {
  let n = (e || {}).singleTilde;
  const r = {
    name: "strikethrough",
    tokenize: o,
    resolveAll: i
  };
  return n == null && (n = !0), {
    text: {
      126: r
    },
    insideSpan: {
      null: [r]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function i(s, a) {
    let l = -1;
    for (; ++l < s.length; )
      if (s[l][0] === "enter" && s[l][1].type === "strikethroughSequenceTemporary" && s[l][1]._close) {
        let c = l;
        for (; c--; )
          if (s[c][0] === "exit" && s[c][1].type === "strikethroughSequenceTemporary" && s[c][1]._open && // If the sizes are the same:
          s[l][1].end.offset - s[l][1].start.offset === s[c][1].end.offset - s[c][1].start.offset) {
            s[l][1].type = "strikethroughSequence", s[c][1].type = "strikethroughSequence";
            const f = {
              type: "strikethrough",
              start: Object.assign({}, s[c][1].start),
              end: Object.assign({}, s[l][1].end)
            }, u = {
              type: "strikethroughText",
              start: Object.assign({}, s[c][1].end),
              end: Object.assign({}, s[l][1].start)
            }, m = [["enter", f, a], ["enter", s[c][1], a], ["exit", s[c][1], a], ["enter", u, a]], h = a.parser.constructs.insideSpan.null;
            h && Le(m, m.length, 0, _i(h, s.slice(c + 1, l), a)), Le(m, m.length, 0, [["exit", u, a], ["enter", s[l][1], a], ["exit", s[l][1], a], ["exit", f, a]]), Le(s, c - 1, l - c + 3, m), l = c + m.length - 2;
            break;
          }
      }
    for (l = -1; ++l < s.length; )
      s[l][1].type === "strikethroughSequenceTemporary" && (s[l][1].type = "data");
    return s;
  }
  function o(s, a, l) {
    const c = this.previous, f = this.events;
    let u = 0;
    return m;
    function m(p) {
      return c === 126 && f[f.length - 1][1].type !== "characterEscape" ? l(p) : (s.enter("strikethroughSequenceTemporary"), h(p));
    }
    function h(p) {
      const g = Cn(c);
      if (p === 126)
        return u > 1 ? l(p) : (s.consume(p), u++, h);
      if (u < 2 && !n) return l(p);
      const y = s.exit("strikethroughSequenceTemporary"), x = Cn(p);
      return y._open = !x || x === 2 && !!g, y._close = !g || g === 2 && !!x, a(p);
    }
  }
}
class AS {
  /**
   * Create a new edit map.
   */
  constructor() {
    this.map = [];
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   * @param {number} remove
   * @param {Array<Event>} add
   * @returns {undefined}
   */
  add(t, n, r) {
    kS(this, t, n, r);
  }
  // To do: add this when moving to `micromark`.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {undefined}
  //  */
  // addBefore(index, remove, add) {
  //   addImplementation(this, index, remove, add, true)
  // }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   * @returns {undefined}
   */
  consume(t) {
    if (this.map.sort(function(o, s) {
      return o[0] - s[0];
    }), this.map.length === 0)
      return;
    let n = this.map.length;
    const r = [];
    for (; n > 0; )
      n -= 1, r.push(t.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]), t.length = this.map[n][0];
    r.push(t.slice()), t.length = 0;
    let i = r.pop();
    for (; i; ) {
      for (const o of i)
        t.push(o);
      i = r.pop();
    }
    this.map.length = 0;
  }
}
function kS(e, t, n, r) {
  let i = 0;
  if (!(n === 0 && r.length === 0)) {
    for (; i < e.map.length; ) {
      if (e.map[i][0] === t) {
        e.map[i][1] += n, e.map[i][2].push(...r);
        return;
      }
      i += 1;
    }
    e.map.push([t, n, r]);
  }
}
function ES(e, t) {
  let n = !1;
  const r = [];
  for (; t < e.length; ) {
    const i = e[t];
    if (n) {
      if (i[0] === "enter")
        i[1].type === "tableContent" && r.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (e[t - 1][1].type === "tableDelimiterMarker") {
          const o = r.length - 1;
          r[o] = r[o] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow")
        break;
    } else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
    t += 1;
  }
  return r;
}
function CS() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: jS,
        resolveAll: MS
      }
    }
  };
}
function jS(e, t, n) {
  const r = this;
  let i = 0, o = 0, s;
  return a;
  function a(C) {
    let I = r.events.length - 1;
    for (; I > -1; ) {
      const P = r.events[I][1].type;
      if (P === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      P === "linePrefix") I--;
      else break;
    }
    const z = I > -1 ? r.events[I][1].type : null, W = z === "tableHead" || z === "tableRow" ? E : l;
    return W === E && r.parser.lazy[r.now().line] ? n(C) : W(C);
  }
  function l(C) {
    return e.enter("tableHead"), e.enter("tableRow"), c(C);
  }
  function c(C) {
    return C === 124 || (s = !0, o += 1), f(C);
  }
  function f(C) {
    return C === null ? n(C) : $(C) ? o > 1 ? (o = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(C), e.exit("lineEnding"), h) : n(C) : se(C) ? ue(e, f, "whitespace")(C) : (o += 1, s && (s = !1, i += 1), C === 124 ? (e.enter("tableCellDivider"), e.consume(C), e.exit("tableCellDivider"), s = !0, f) : (e.enter("data"), u(C)));
  }
  function u(C) {
    return C === null || C === 124 || ye(C) ? (e.exit("data"), f(C)) : (e.consume(C), C === 92 ? m : u);
  }
  function m(C) {
    return C === 92 || C === 124 ? (e.consume(C), u) : u(C);
  }
  function h(C) {
    return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(C) : (e.enter("tableDelimiterRow"), s = !1, se(C) ? ue(e, p, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(C) : p(C));
  }
  function p(C) {
    return C === 45 || C === 58 ? y(C) : C === 124 ? (s = !0, e.enter("tableCellDivider"), e.consume(C), e.exit("tableCellDivider"), g) : S(C);
  }
  function g(C) {
    return se(C) ? ue(e, y, "whitespace")(C) : y(C);
  }
  function y(C) {
    return C === 58 ? (o += 1, s = !0, e.enter("tableDelimiterMarker"), e.consume(C), e.exit("tableDelimiterMarker"), x) : C === 45 ? (o += 1, x(C)) : C === null || $(C) ? j(C) : S(C);
  }
  function x(C) {
    return C === 45 ? (e.enter("tableDelimiterFiller"), k(C)) : S(C);
  }
  function k(C) {
    return C === 45 ? (e.consume(C), k) : C === 58 ? (s = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(C), e.exit("tableDelimiterMarker"), w) : (e.exit("tableDelimiterFiller"), w(C));
  }
  function w(C) {
    return se(C) ? ue(e, j, "whitespace")(C) : j(C);
  }
  function j(C) {
    return C === 124 ? p(C) : C === null || $(C) ? !s || i !== o ? S(C) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(C)) : S(C);
  }
  function S(C) {
    return n(C);
  }
  function E(C) {
    return e.enter("tableRow"), O(C);
  }
  function O(C) {
    return C === 124 ? (e.enter("tableCellDivider"), e.consume(C), e.exit("tableCellDivider"), O) : C === null || $(C) ? (e.exit("tableRow"), t(C)) : se(C) ? ue(e, O, "whitespace")(C) : (e.enter("data"), R(C));
  }
  function R(C) {
    return C === null || C === 124 || ye(C) ? (e.exit("data"), O(C)) : (e.consume(C), C === 92 ? B : R);
  }
  function B(C) {
    return C === 92 || C === 124 ? (e.consume(C), R) : R(C);
  }
}
function MS(e, t) {
  let n = -1, r = !0, i = 0, o = [0, 0, 0, 0], s = [0, 0, 0, 0], a = !1, l = 0, c, f, u;
  const m = new AS();
  for (; ++n < e.length; ) {
    const h = e[n], p = h[1];
    h[0] === "enter" ? p.type === "tableHead" ? (a = !1, l !== 0 && (cu(m, t, l, c, f), f = void 0, l = 0), c = {
      type: "table",
      start: Object.assign({}, p.start),
      // Note: correct end is set later.
      end: Object.assign({}, p.end)
    }, m.add(n, 0, [["enter", c, t]])) : p.type === "tableRow" || p.type === "tableDelimiterRow" ? (r = !0, u = void 0, o = [0, 0, 0, 0], s = [0, n + 1, 0, 0], a && (a = !1, f = {
      type: "tableBody",
      start: Object.assign({}, p.start),
      // Note: correct end is set later.
      end: Object.assign({}, p.end)
    }, m.add(n, 0, [["enter", f, t]])), i = p.type === "tableDelimiterRow" ? 2 : f ? 3 : 1) : i && (p.type === "data" || p.type === "tableDelimiterMarker" || p.type === "tableDelimiterFiller") ? (r = !1, s[2] === 0 && (o[1] !== 0 && (s[0] = s[1], u = qr(m, t, o, i, void 0, u), o = [0, 0, 0, 0]), s[2] = n)) : p.type === "tableCellDivider" && (r ? r = !1 : (o[1] !== 0 && (s[0] = s[1], u = qr(m, t, o, i, void 0, u)), o = s, s = [o[1], n, 0, 0])) : p.type === "tableHead" ? (a = !0, l = n) : p.type === "tableRow" || p.type === "tableDelimiterRow" ? (l = n, o[1] !== 0 ? (s[0] = s[1], u = qr(m, t, o, i, n, u)) : s[1] !== 0 && (u = qr(m, t, s, i, n, u)), i = 0) : i && (p.type === "data" || p.type === "tableDelimiterMarker" || p.type === "tableDelimiterFiller") && (s[3] = n);
  }
  for (l !== 0 && cu(m, t, l, c, f), m.consume(t.events), n = -1; ++n < t.events.length; ) {
    const h = t.events[n];
    h[0] === "enter" && h[1].type === "table" && (h[1]._align = ES(t.events, n));
  }
  return e;
}
function qr(e, t, n, r, i, o) {
  const s = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  n[0] !== 0 && (o.end = Object.assign({}, gn(t.events, n[0])), e.add(n[0], 0, [["exit", o, t]]));
  const l = gn(t.events, n[1]);
  if (o = {
    type: s,
    start: Object.assign({}, l),
    // Note: correct end is set later.
    end: Object.assign({}, l)
  }, e.add(n[1], 0, [["enter", o, t]]), n[2] !== 0) {
    const c = gn(t.events, n[2]), f = gn(t.events, n[3]), u = {
      type: a,
      start: Object.assign({}, c),
      end: Object.assign({}, f)
    };
    if (e.add(n[2], 0, [["enter", u, t]]), r !== 2) {
      const m = t.events[n[2]], h = t.events[n[3]];
      if (m[1].end = Object.assign({}, h[1].end), m[1].type = "chunkText", m[1].contentType = "text", n[3] > n[2] + 1) {
        const p = n[2] + 1, g = n[3] - n[2] - 1;
        e.add(p, g, []);
      }
    }
    e.add(n[3] + 1, 0, [["exit", u, t]]);
  }
  return i !== void 0 && (o.end = Object.assign({}, gn(t.events, i)), e.add(i, 0, [["exit", o, t]]), o = void 0), o;
}
function cu(e, t, n, r, i) {
  const o = [], s = gn(t.events, n);
  i && (i.end = Object.assign({}, s), o.push(["exit", i, t])), r.end = Object.assign({}, s), o.push(["exit", r, t]), e.add(n + 1, 0, o);
}
function gn(e, t) {
  const n = e[t], r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const SS = {
  name: "tasklistCheck",
  tokenize: IS
};
function NS() {
  return {
    text: {
      91: SS
    }
  };
}
function IS(e, t, n) {
  const r = this;
  return i;
  function i(l) {
    return (
      // Exit if there’s stuff before.
      r.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !r._gfmTasklistFirstContentOfListItem ? n(l) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(l), e.exit("taskListCheckMarker"), o)
    );
  }
  function o(l) {
    return ye(l) ? (e.enter("taskListCheckValueUnchecked"), e.consume(l), e.exit("taskListCheckValueUnchecked"), s) : l === 88 || l === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(l), e.exit("taskListCheckValueChecked"), s) : n(l);
  }
  function s(l) {
    return l === 93 ? (e.enter("taskListCheckMarker"), e.consume(l), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), a) : n(l);
  }
  function a(l) {
    return $(l) ? t(l) : se(l) ? e.check({
      tokenize: DS
    }, t, n)(l) : n(l);
  }
}
function DS(e, t, n) {
  return ue(e, r, "whitespace");
  function r(i) {
    return i === null ? n(i) : t(i);
  }
}
function RS(e) {
  return nh([
    rS(),
    mS(),
    wS(e),
    CS(),
    NS()
  ]);
}
const PS = {};
function OS(e) {
  const t = (
    /** @type {Processor<Root>} */
    this
  ), n = e || PS, r = t.data(), i = r.micromarkExtensions || (r.micromarkExtensions = []), o = r.fromMarkdownExtensions || (r.fromMarkdownExtensions = []), s = r.toMarkdownExtensions || (r.toMarkdownExtensions = []);
  i.push(RS(n)), o.push($M()), s.push(eS(n));
}
function uu(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}
function TS(e) {
  return e.split("-").filter(Boolean).map((t) => t[0].toUpperCase() + t.slice(1)).join(" ");
}
function zS(e, t) {
  const r = e.split(/\r?\n/).find((m) => m.startsWith("# ")), i = r ? r.replace(/^#\s+/, "").trim() : TS(t), o = e.replace(/^# .+$/m, "").trim(), s = o.search(/^##\s+/m), l = (s >= 0 ? o.slice(0, s) : o).split(/\r?\n/).map((m) => m.trim()).filter((m) => m.length > 0 && m !== "---").join(" "), c = s >= 0 ? o.slice(s).trim() : "", u = (c ? c.split(/\n(?=##\s+)/g).filter((m) => m.trim().length > 0) : []).map((m, h) => {
    const g = m.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? `Section ${h + 1}`, y = `section-${uu(g)}-${h + 1}`, x = m.replace(/^##\s+.+$/m, "").trim(), k = Array.from(x.matchAll(/^###\s+(.+)$/gm)).map((w, j) => ({
      title: w[1].trim(),
      id: `${y}-sub-${uu(w[1])}-${j + 1}`
    }));
    return { id: y, title: g, markdown: x, subHeadings: k };
  });
  return { slug: t, title: i, description: l, sections: u };
}
function BS(e) {
  return Object.entries(e).map(([t, n]) => {
    const r = t.split("/").pop()?.replace(/\.md$/i, "") ?? "guide";
    return zS(n, r);
  }).sort((t, n) => t.title.localeCompare(n.title));
}
function ks(e) {
  return typeof e == "string" ? e : typeof e == "number" ? String(e) : Array.isArray(e) ? e.map(ks).join("") : e && typeof e == "object" && "props" in e ? ks(e.props?.children) : "";
}
function GS(e) {
  const t = e.match(/^\s*\[\!(TIP|NOTE|WARNING)\]\s*(.+)\s*$/i);
  return t ? {
    type: t[1].toUpperCase(),
    content: t[2].trim()
  } : null;
}
function FS() {
  const [e, t] = ge(0);
  return de(() => {
    const n = document.querySelector("[data-guides-scroll-container]");
    if (!n) return;
    const r = () => {
      const { scrollTop: i, scrollHeight: o, clientHeight: s } = n, a = o - s;
      t(a > 0 ? Math.min(100, i / a * 100) : 0);
    };
    return r(), n.addEventListener("scroll", r, { passive: !0 }), () => n.removeEventListener("scroll", r);
  }, []), e;
}
function Es(e) {
  const t = [
    { gradient: "from-primary/15", ring: "ring-primary/30", dot: "bg-primary/60" },
    { gradient: "from-sky-500/15", ring: "ring-sky-500/30", dot: "bg-sky-500/60" },
    { gradient: "from-emerald-500/15", ring: "ring-emerald-500/30", dot: "bg-emerald-500/60" },
    { gradient: "from-violet-500/15", ring: "ring-violet-500/30", dot: "bg-violet-500/60" },
    { gradient: "from-amber-500/15", ring: "ring-amber-500/30", dot: "bg-amber-500/60" }
  ], n = e.split("").reduce((r, i) => r + i.charCodeAt(0), 0) % t.length;
  return t[n];
}
function Wh(e) {
  return ke(() => BS(e), [e]);
}
function Jh(e) {
  const t = hu(), n = pu(), i = ke(() => new URLSearchParams(t.search), [t.search]).get("guide")?.trim() ?? "", o = e.find((a) => a.slug === i) ?? e[0] ?? null;
  return de(() => {
    if (!o || i === o.slug) return;
    const a = new URLSearchParams(t.search);
    a.set("guide", o.slug), n(
      {
        pathname: t.pathname,
        search: `?${a.toString()}`,
        hash: t.hash
      },
      { replace: !0, state: t.state }
    );
  }, [t.hash, t.pathname, t.search, t.state, n, o, i]), { selectedGuide: o, selectedSlug: i, setSelectedGuide: (a) => {
    const l = new URLSearchParams(t.search);
    l.set("guide", a), n(
      {
        pathname: t.pathname,
        search: `?${l.toString()}`,
        hash: t.hash
      },
      { state: t.state }
    );
  } };
}
function LS({
  markdown: e,
  sectionId: t,
  subHeadingIds: n,
  onImageClick: r
}) {
  let i = 0;
  return /* @__PURE__ */ d.jsx(
    wj,
    {
      remarkPlugins: [OS],
      components: {
        h3: ({ children: o }) => {
          const s = n[i] ?? `${t}-sub-${i + 1}`;
          return i += 1, /* @__PURE__ */ d.jsxs("h3", { id: s, className: "mt-7 scroll-mt-24 flex items-center gap-2.5 text-base font-semibold text-foreground", children: [
            /* @__PURE__ */ d.jsx("span", { className: "inline-block h-[1em] w-[3px] shrink-0 rounded-full bg-primary/50" }),
            o
          ] });
        },
        h4: ({ children: o }) => /* @__PURE__ */ d.jsx("h4", { className: "mt-5 text-sm font-semibold text-foreground/80", children: o }),
        p: ({ children: o }) => {
          const s = ks(o), a = GS(s);
          if (!a)
            return /* @__PURE__ */ d.jsx("p", { className: "mt-3 text-sm leading-7 text-foreground/85", children: o });
          const l = a.type === "TIP" ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : a.type === "WARNING" ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:text-sky-300";
          return /* @__PURE__ */ d.jsxs("div", { className: Q("mt-4 rounded-xl border px-3 py-3 text-sm leading-6", l), children: [
            /* @__PURE__ */ d.jsx("span", { className: "mr-2 inline-flex rounded border border-current/30 px-1.5 py-0.5 text-[10px] font-bold tracking-wide", children: a.type }),
            /* @__PURE__ */ d.jsx("span", { children: a.content })
          ] });
        },
        ul: ({ children: o }) => /* @__PURE__ */ d.jsx("ul", { className: "mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/85 marker:text-primary/50", children: o }),
        ol: ({ children: o }) => /* @__PURE__ */ d.jsx("ol", { className: "mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground/85 marker:text-primary/60 marker:font-medium", children: o }),
        li: ({ children: o }) => /* @__PURE__ */ d.jsx("li", { className: "leading-7", children: o }),
        strong: ({ children: o }) => /* @__PURE__ */ d.jsx("strong", { className: "font-semibold text-foreground", children: o }),
        em: ({ children: o }) => /* @__PURE__ */ d.jsx("em", { className: "italic text-foreground/75", children: o }),
        a: ({ href: o, children: s }) => /* @__PURE__ */ d.jsx("a", { href: o, className: "font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary", children: s }),
        blockquote: ({ children: o }) => /* @__PURE__ */ d.jsx("div", { className: "mt-4 rounded-r-xl border-l-[3px] border-primary/50 bg-primary/[0.06] px-4 py-3 text-sm italic text-foreground/70", children: o }),
        hr: () => /* @__PURE__ */ d.jsxs("div", { className: "my-6 flex items-center gap-3", children: [
          /* @__PURE__ */ d.jsx("div", { className: "h-px flex-1 bg-border/50" }),
          /* @__PURE__ */ d.jsx("div", { className: "size-1 rounded-full bg-border" }),
          /* @__PURE__ */ d.jsx("div", { className: "h-px flex-1 bg-border/50" })
        ] }),
        pre: ({ children: o }) => /* @__PURE__ */ d.jsx("pre", { className: "mt-4 overflow-x-auto rounded-xl border border-border/50 bg-muted/60 p-4 text-xs leading-6 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit", children: o }),
        code: ({ children: o, className: s }) => /* @__PURE__ */ d.jsx("code", { className: Q("rounded-md bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground/90", s), children: o }),
        table: ({ children: o }) => /* @__PURE__ */ d.jsx("div", { className: "mt-4 overflow-hidden rounded-xl border border-border/50", children: /* @__PURE__ */ d.jsx(Yi, { children: o }) }),
        thead: ({ children: o }) => /* @__PURE__ */ d.jsx(sm, { children: o }),
        tbody: ({ children: o }) => /* @__PURE__ */ d.jsx(Hi, { children: o }),
        tr: ({ children: o }) => /* @__PURE__ */ d.jsx(Jt, { children: o }),
        th: ({ children: o }) => /* @__PURE__ */ d.jsx(am, { className: "bg-muted/40 text-[11px] font-semibold uppercase tracking-wide", children: o }),
        td: ({ children: o }) => /* @__PURE__ */ d.jsx(Dt, { children: o }),
        img: ({ src: o, alt: s }) => {
          const a = typeof o == "string" ? o.trim() : "";
          if (!a) return null;
          const l = s ?? "";
          return /* @__PURE__ */ d.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r?.({ src: a, alt: l }),
              className: "mt-4 block w-full rounded-xl border border-border/50 bg-muted/15 p-1.5 text-left transition-colors hover:bg-muted/30",
              children: [
                /* @__PURE__ */ d.jsx("img", { src: a, alt: l, className: "max-h-[28rem] w-full rounded-lg object-contain" }),
                /* @__PURE__ */ d.jsx("span", { className: "mt-2 block text-xs text-muted-foreground", children: "Click to expand" })
              ]
            }
          );
        }
      },
      children: e
    }
  );
}
function YS({
  image: e,
  onClose: t
}) {
  return /* @__PURE__ */ d.jsx(ma, { open: !!e, onOpenChange: (n) => !n && t(), children: /* @__PURE__ */ d.jsxs(ha, { className: "flex w-[94vw] max-w-none flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-[94vw]", children: [
    /* @__PURE__ */ d.jsx(pa, { className: "border-b border-border/70 px-6 py-4 text-left", children: /* @__PURE__ */ d.jsx(ga, { children: e?.alt?.trim() || "Image Preview" }) }),
    e ? /* @__PURE__ */ d.jsx("div", { className: "p-3", children: /* @__PURE__ */ d.jsx("img", { src: e.src, alt: e.alt, className: "max-h-[calc(100dvh-10rem)] w-full rounded-md object-contain" }) }) : null
  ] }) });
}
function HS({ guide: e }) {
  const t = e.sections.reduce((i, o) => i + o.markdown.split(/\s+/).length, 0), n = Math.max(1, Math.round(t / 200)), r = Es(e.slug);
  return /* @__PURE__ */ d.jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border/70 bg-card px-7 py-7 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]", children: [
    /* @__PURE__ */ d.jsx("div", { className: Q("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent", r.gradient) }),
    /* @__PURE__ */ d.jsx("div", { className: "pointer-events-none absolute -right-12 -top-12 size-52 rounded-full bg-primary/[0.04]" }),
    /* @__PURE__ */ d.jsx("div", { className: "pointer-events-none absolute -right-5 -top-5 size-28 rounded-full bg-primary/[0.05]" }),
    /* @__PURE__ */ d.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ d.jsx(kr, { className: "size-3.5 text-primary/70" }),
        /* @__PURE__ */ d.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "User Guide" })
      ] }),
      /* @__PURE__ */ d.jsx("h1", { className: "text-2xl font-bold text-foreground", children: e.title }),
      e.description ? /* @__PURE__ */ d.jsx("p", { className: "mt-3 max-w-3xl text-sm leading-7 text-foreground/75", children: e.description }) : null,
      /* @__PURE__ */ d.jsxs("div", { className: "mt-4 flex items-center gap-5", children: [
        /* @__PURE__ */ d.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ d.jsx(hw, { className: "size-3" }),
          /* @__PURE__ */ d.jsxs("span", { children: [
            e.sections.length,
            " ",
            e.sections.length === 1 ? "section" : "sections"
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ d.jsx(dw, { className: "size-3" }),
          /* @__PURE__ */ d.jsxs("span", { children: [
            n,
            " min read"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function QS({ guidesDirectoryLabel: e = "src/content/guides" }) {
  return /* @__PURE__ */ d.jsxs("div", { className: "rounded-2xl border border-border/70 bg-card p-10 text-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]", children: [
    /* @__PURE__ */ d.jsx(kr, { className: "mx-auto mb-3 size-9 text-muted-foreground/30" }),
    /* @__PURE__ */ d.jsx("p", { className: "text-sm font-semibold text-foreground/70", children: "No guides found" }),
    /* @__PURE__ */ d.jsxs("p", { className: "mt-1.5 text-xs text-muted-foreground", children: [
      "Add ",
      /* @__PURE__ */ d.jsx("code", { className: "rounded-md bg-muted px-1.5 py-0.5", children: "*.md" }),
      " files to",
      " ",
      /* @__PURE__ */ d.jsx("code", { className: "rounded-md bg-muted px-1.5 py-0.5", children: e })
    ] })
  ] });
}
function nI({ rawGuides: e, guidesDirectoryLabel: t }) {
  const n = FS(), [r, i] = ge(null), o = Wh(e), { selectedGuide: s } = Jh(o);
  return s ? /* @__PURE__ */ d.jsxs("section", { className: "min-w-0 space-y-5", children: [
    /* @__PURE__ */ d.jsx("div", { className: "sticky top-0 z-10 -mx-4 md:-mx-6", children: /* @__PURE__ */ d.jsx("div", { className: "h-[3px] w-full bg-border/30", children: /* @__PURE__ */ d.jsx(
      "div",
      {
        className: "h-full bg-gradient-to-r from-primary via-primary/75 to-primary/40 transition-[width] duration-75 ease-out",
        style: { width: `${n}%` }
      }
    ) }) }),
    /* @__PURE__ */ d.jsx(HS, { guide: s }),
    s.sections.map((a, l) => /* @__PURE__ */ d.jsxs(
      "article",
      {
        id: a.id,
        className: "relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]",
        children: [
          /* @__PURE__ */ d.jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/55 via-primary/20 to-transparent" }),
          /* @__PURE__ */ d.jsx(
            "span",
            {
              className: "pointer-events-none absolute right-5 top-1 select-none font-bold leading-none text-foreground/[0.035]",
              style: { fontSize: "82px" },
              "aria-hidden": !0,
              children: String(l + 1).padStart(2, "0")
            }
          ),
          /* @__PURE__ */ d.jsx("div", { className: "relative border-b border-border/50 px-7 py-5", children: /* @__PURE__ */ d.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ d.jsx("span", { className: "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold tabular-nums text-primary/80", children: l + 1 }),
            /* @__PURE__ */ d.jsx("h2", { className: "text-lg font-semibold text-foreground", children: a.title })
          ] }) }),
          /* @__PURE__ */ d.jsx("div", { className: "px-7 py-6", children: /* @__PURE__ */ d.jsx(
            LS,
            {
              markdown: a.markdown,
              sectionId: a.id,
              subHeadingIds: a.subHeadings.map((c) => c.id),
              onImageClick: i
            }
          ) })
        ]
      },
      a.id
    )),
    /* @__PURE__ */ d.jsx(YS, { image: r, onClose: () => i(null) })
  ] }) : /* @__PURE__ */ d.jsx(QS, { guidesDirectoryLabel: t });
}
function rI({ rawGuides: e, collapsed: t }) {
  const [n, r] = ge(null), [i, o] = ge("files"), [s, a] = ge({}), [l, c] = ge(null), f = Wh(e), { selectedGuide: u, setSelectedGuide: m } = Jh(f);
  return de(() => {
    let h = 0, p = !1;
    const g = () => {
      if (p) return;
      const y = document.querySelector("[data-guides-scroll-container]");
      if (y) {
        c(y);
        return;
      }
      h = requestAnimationFrame(g);
    };
    return g(), () => {
      p = !0, h && cancelAnimationFrame(h);
    };
  }, []), de(() => {
    if (!u || !l) return;
    let h = 0, p = 0;
    const g = () => {
      const w = {}, j = l.getBoundingClientRect(), S = 140;
      let E = null, O = null, R = !1;
      for (const C of u.sections) {
        const I = document.getElementById(C.id);
        if (!I) {
          w[C.id] = 0;
          continue;
        }
        R = !0;
        const z = I.getBoundingClientRect(), W = Math.max(z.height, 1), P = Math.max(z.top, j.top), M = Math.min(z.bottom, j.bottom), D = Math.max(0, M - P), F = Math.max(0, S - z.top), T = Math.min(100, Math.max(0, (F + D) / W * 100));
        w[C.id] = T, O === null && z.bottom > j.top && z.top < j.bottom && (O = C.id), z.top <= S && (E = C.id);
      }
      if (!R) return;
      const B = E ?? O ?? u.sections[0]?.id ?? null;
      a(w), r(B);
    }, y = () => {
      h || (h = requestAnimationFrame(() => {
        h = 0, g();
      }));
    }, x = () => {
      p || (p = requestAnimationFrame(() => {
        p = 0, y();
      }));
    }, k = new MutationObserver(x);
    return k.observe(document.body, { childList: !0, subtree: !0 }), l.addEventListener("scroll", y, { passive: !0 }), window.addEventListener("scroll", y, { passive: !0 }), window.addEventListener("resize", y), y(), () => {
      k.disconnect(), h && cancelAnimationFrame(h), p && cancelAnimationFrame(p), l.removeEventListener("scroll", y), window.removeEventListener("scroll", y), window.removeEventListener("resize", y);
    };
  }, [l, u]), u ? /* @__PURE__ */ d.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ d.jsxs("div", { className: Q("flex items-center gap-2 px-2", t && "justify-center"), children: [
      /* @__PURE__ */ d.jsx(kr, { className: "size-4 text-muted-foreground" }),
      t ? null : /* @__PURE__ */ d.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Guides" })
    ] }),
    (i === "files" || t) && /* @__PURE__ */ d.jsxs("div", { className: "space-y-1.5", children: [
      t ? null : /* @__PURE__ */ d.jsx("div", { className: "px-2 pb-1", children: /* @__PURE__ */ d.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60", children: "All files" }) }),
      t ? /* @__PURE__ */ d.jsx("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ d.jsx("div", { className: Q("size-2 rounded-full", Es(u.slug).dot) }) }) : /* @__PURE__ */ d.jsx("div", { className: "space-y-1.5", children: f.map((h) => {
        const p = h.slug === u.slug, g = Es(h.slug);
        return /* @__PURE__ */ d.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              m(h.slug), o("toc");
            },
            className: Q(
              "group relative w-full overflow-hidden rounded-xl border px-3.5 py-3 text-left transition-all duration-150",
              p ? "border-border/70 bg-secondary shadow-sm" : "border-border/40 bg-card hover:border-border/60 hover:bg-muted/30"
            ),
            children: [
              p ? /* @__PURE__ */ d.jsx("div", { className: Q("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-50", g.gradient) }) : null,
              /* @__PURE__ */ d.jsxs("div", { className: "relative flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ d.jsx(
                  "span",
                  {
                    className: Q(
                      "text-sm font-medium leading-snug",
                      p ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    ),
                    children: h.title
                  }
                ),
                p ? /* @__PURE__ */ d.jsx(It, { className: "size-3.5 shrink-0 text-muted-foreground" }) : null
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "relative mt-1 text-[11px] text-muted-foreground/60", children: [
                h.sections.length,
                " ",
                h.sections.length === 1 ? "section" : "sections"
              ] })
            ]
          },
          h.slug
        );
      }) })
    ] }),
    i === "toc" && !t ? /* @__PURE__ */ d.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ d.jsxs(
        "button",
        {
          type: "button",
          onClick: () => o("files"),
          className: "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
          children: [
            /* @__PURE__ */ d.jsx(Vv, { className: "size-3.5" }),
            "All guides"
          ]
        }
      ),
      /* @__PURE__ */ d.jsxs("div", { className: "flex items-center gap-1.5 px-2", children: [
        /* @__PURE__ */ d.jsx(bw, { className: "size-3 text-muted-foreground/60" }),
        /* @__PURE__ */ d.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60", children: "Contents" })
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "space-y-1", children: u.sections.map((h, p) => {
        const g = n === h.id, y = s[h.id] ?? 0;
        return /* @__PURE__ */ d.jsxs(
          "div",
          {
            className: Q(
              "overflow-hidden rounded-xl border transition-colors duration-150",
              g ? "border-border/60 bg-secondary/50" : "border-transparent hover:border-border/40 hover:bg-muted/20"
            ),
            children: [
              /* @__PURE__ */ d.jsxs(
                "a",
                {
                  href: `#${h.id}`,
                  onClick: (x) => {
                    x.preventDefault(), document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  },
                  className: "flex items-center gap-2.5 px-3 py-2.5",
                  children: [
                    /* @__PURE__ */ d.jsx(
                      "span",
                      {
                        className: Q(
                          "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-colors",
                          g ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        ),
                        children: p + 1
                      }
                    ),
                    /* @__PURE__ */ d.jsx("span", { className: Q("text-xs font-medium leading-snug transition-colors", g ? "text-foreground" : "text-muted-foreground"), children: h.title })
                  ]
                }
              ),
              /* @__PURE__ */ d.jsx("div", { className: "mx-3 mb-2 h-[2px] overflow-hidden rounded-full bg-border/40", children: /* @__PURE__ */ d.jsx(
                "div",
                {
                  className: Q("h-full rounded-full transition-[width] duration-150", g ? "bg-primary/70" : "bg-border/80"),
                  style: { width: `${y}%` }
                }
              ) }),
              h.subHeadings.length > 0 ? /* @__PURE__ */ d.jsx("div", { className: "mb-2.5 ml-10 space-y-px border-l border-border/40 pl-3", children: h.subHeadings.map((x) => /* @__PURE__ */ d.jsx(
                "a",
                {
                  href: `#${x.id}`,
                  onClick: (k) => {
                    k.preventDefault(), document.getElementById(x.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  },
                  className: "block py-1 text-[11px] leading-snug text-muted-foreground/65 transition-colors hover:text-foreground",
                  children: x.title
                },
                x.id
              )) }) : null
            ]
          },
          h.id
        );
      }) })
    ] }) : null
  ] }) : null;
}
function Vh({
  guideRoute: e,
  fallbackRoute: t,
  fallbackUnauthenticatedRoute: n,
  onAfterNavigate: r
}) {
  const { isAuthenticated: i } = Aa(), o = hu(), s = pu(), a = o.pathname === e;
  return { handleNavigate: () => {
    if (a) {
      const c = o.state?.from;
      s(
        c && c !== o.pathname ? c : i ? t : n ?? t
      ), r?.();
      return;
    }
    s(e, {
      state: {
        from: `${o.pathname}${o.search}${o.hash}`
      }
    }), r?.();
  }, inGuidesView: a };
}
function iI({
  guideRoute: e,
  fallbackRoute: t,
  fallbackUnauthenticatedRoute: n,
  openLabel: r = "Open guides",
  closeLabel: i = "Close guides",
  onAfterNavigate: o,
  className: s,
  variant: a = "ghost",
  size: l = "icon-sm",
  ...c
}) {
  const { handleNavigate: f, inGuidesView: u } = Vh({
    guideRoute: e,
    fallbackRoute: t,
    fallbackUnauthenticatedRoute: n,
    onAfterNavigate: o
  });
  return /* @__PURE__ */ d.jsx(
    me,
    {
      type: "button",
      variant: a,
      size: l,
      className: Q("rounded-full", s),
      "aria-current": u ? "page" : void 0,
      "aria-label": u ? i : r,
      title: u ? i : r,
      onClick: f,
      ...c,
      children: /* @__PURE__ */ d.jsx(kr, { className: "size-4" })
    }
  );
}
function oI({
  guideRoute: e,
  fallbackRoute: t,
  fallbackUnauthenticatedRoute: n,
  openLabel: r = "User guide",
  closeLabel: i = "Close guides",
  onAfterNavigate: o,
  className: s,
  type: a = "button",
  ...l
}) {
  const { handleNavigate: c, inGuidesView: f } = Vh({
    guideRoute: e,
    fallbackRoute: t,
    fallbackUnauthenticatedRoute: n,
    onAfterNavigate: o
  });
  return /* @__PURE__ */ d.jsxs(
    "button",
    {
      type: a,
      className: Q(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60",
        s
      ),
      "aria-current": f ? "page" : void 0,
      onClick: c,
      ...l,
      children: [
        /* @__PURE__ */ d.jsx(kr, { className: "size-4 text-muted-foreground" }),
        f ? i : r
      ]
    }
  );
}
const ol = "2", du = "returnUrl", sl = "ui.detailViewMode", Cs = `${sl}:latest`, js = "detail-view-mode-change", qh = {
  floating: !1,
  collapsed: "0"
}, Ms = /* @__PURE__ */ new Map();
function Xh() {
  const [e, t] = ge(
    () => typeof window > "u" ? "/" : window.location.pathname
  );
  return de(() => {
    const n = () => t(window.location.pathname);
    return window.addEventListener("popstate", n), () => window.removeEventListener("popstate", n);
  }, []), e;
}
function US(e) {
  return e ? e.length > 1 && e.endsWith("/") ? e.slice(0, -1) : e : "/";
}
function ZS(e) {
  return e === "1" || e === ol ? e : "0";
}
function WS(e) {
  const t = e.floating === !0;
  return {
    floating: t,
    collapsed: t ? ZS(e.collapsed) : "0"
  };
}
function ki(e, t) {
  return e?.floating === t.floating && e.collapsed === t.collapsed;
}
function Kh(e) {
  const t = US(e), n = t.split("/").filter(Boolean);
  if (n[0] !== "management")
    return t;
  if (n[1] === "classes" && n[2]) {
    const r = n[3], i = n[4];
    return i && (r === "schedules" || r === "sessions" || r === "tests" || r === "feedbacks") ? `/management/classes/${n[2]}/${r}/${i}` : `/management/classes/${n[2]}`;
  }
  return (n[1] === "schedules" || n[1] === "sessions" || n[1] === "tests" || n[1] === "feedbacks") && n[2] ? `/management/${n[1]}/${n[2]}` : t;
}
function Ei(e) {
  return Ms.get(e) ?? null;
}
function JS() {
  typeof window > "u" || window.dispatchEvent(new Event(js));
}
function _h(e) {
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
function $h(e, t) {
  const n = _h(e);
  if (!n)
    return e;
  const r = n.searchParams.get(du)?.trim();
  return r && t > 0 && n.searchParams.set(
    du,
    $h(r, t - 1)
  ), `${n.pathname}${n.search}${n.hash}`;
}
function VS(e) {
  return $h(e, 3);
}
function ep(e) {
  return Ei(
    `${sl}:${Kh(e)}`
  ) ?? Ei(Cs);
}
function fu(e, t) {
  const n = WS(t), r = `${sl}:${Kh(e)}`, i = !ki(
    Ei(r),
    n
  ), o = !ki(
    Ei(Cs),
    n
  );
  return Ms.set(r, n), Ms.set(Cs, n), (i || o) && JS(), n;
}
function qS(e) {
  return ep(e) ?? qh;
}
function XS(e) {
  return VS(e);
}
function sI(e) {
  const t = _h(XS(e));
  return t ? {
    pathname: t.pathname,
    search: t.search,
    hash: t.hash
  } : null;
}
function KS(e = {}) {
  const t = Xh(), n = e.enabled ?? !0, r = e.pathname ?? t, [i, o] = ge(0);
  return de(() => {
    if (!n || typeof window > "u")
      return;
    const s = () => {
      o((a) => a + 1);
    };
    return window.addEventListener(
      js,
      s
    ), () => {
      window.removeEventListener(
        js,
        s
      );
    };
  }, [n]), ke(() => n ? qS(r) : qh, [n, r, i]);
}
function _S(e = {}) {
  const t = Xh(), n = e.enabled ?? !0, r = e.pathname ?? t, i = KS({
    enabled: n,
    pathname: r
  }), [o, s] = ge(i);
  de(() => {
    s(
      (l) => ki(l, i) ? l : i
    );
  }, [i]), de(() => {
    n && (ki(ep(r), o) || fu(r, o));
  }, [n, r, o]);
  const a = Ve(
    (l) => {
      n && s(fu(r, l));
    },
    [n, r]
  );
  return {
    ...o,
    isCollapsed: o.collapsed !== "0",
    hiddenCollapsed: o.collapsed === ol,
    setMode: a
  };
}
const Yo = {
  tabPillSpring: {
    tension: 300,
    friction: 26
  },
  tabContentFadeOutMs: 100,
  tabContentFadeInMs: 200
};
let Ho = {
  tabPillSpring: { ...Yo.tabPillSpring },
  tabContentFadeOutMs: Yo.tabContentFadeOutMs,
  tabContentFadeInMs: Yo.tabContentFadeInMs
}, $S = 0;
function eN() {
  return typeof window > "u" ? !1 : window.__DETAIL_TABS_DEBUG__ ? !0 : new URLSearchParams(window.location.search).get("detailTabsDebug") === "1";
}
function We(e, t, n) {
  eN() && console.debug(`[DetailTabs:${e}] ${t}`, {
    path: typeof window > "u" ? void 0 : `${window.location.pathname}${window.location.search}`,
    ...n
  });
}
function tN() {
  return {
    tabPillSpring: { ...Ho.tabPillSpring },
    tabContentFadeOutMs: Ho.tabContentFadeOutMs,
    tabContentFadeInMs: Ho.tabContentFadeInMs
  };
}
const al = nn(null), nN = nn(!1);
function aI({
  children: e,
  className: t = "w-full max-w-[1700px] space-y-4",
  isBackground: n,
  onCloseFloating: r
}) {
  const i = lt(nN), o = n ?? i, s = _S({ enabled: !o }), a = o ? !1 : s.floating, l = o ? !1 : s.isCollapsed, c = o ? !1 : s.hiddenCollapsed, f = (p, g, y = !1) => {
    if (o)
      return;
    const x = g ? y ? ol : "1" : "0";
    s.setMode({
      floating: p,
      collapsed: x
    });
  }, u = () => {
    o || !r || r();
  }, m = () => {
    f(!1, !1, !1);
  }, h = () => {
    f(!0, !1, !1);
  };
  return de(() => {
    if (typeof document > "u" || !a)
      return;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", () => {
      document.body.style.overflow = p;
    };
  }, [a]), /* @__PURE__ */ d.jsx(
    al.Provider,
    {
      value: {
        floating: a,
        collapsed: l,
        hiddenCollapsed: c,
        isBackground: o,
        expandToNormalView: m,
        switchToFloatingView: h
      },
      children: /* @__PURE__ */ d.jsxs(
        "section",
        {
          className: Q(
            a ? "fixed inset-0 z-50" : "w-full",
            a && c ? "pointer-events-none" : "",
            a && l && !c ? "pointer-events-none" : ""
          ),
          children: [
            a && !l ? /* @__PURE__ */ d.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Close details",
                onClick: u,
                className: "absolute inset-0 bg-background/45 backdrop-blur-md"
              }
            ) : null,
            a && c ? /* @__PURE__ */ d.jsx(
              me,
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
            /* @__PURE__ */ d.jsxs(
              "div",
              {
                "data-floating-collapsed": a && l ? "true" : "false",
                className: Q(
                  t,
                  a ? l ? c ? "floating-detail pointer-events-none absolute right-0 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 translate-x-[calc(100%-20px)] !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail pointer-events-auto absolute right-3 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail absolute left-1/2 top-1/2 z-10 w-[85dvw] -translate-x-1/2 -translate-y-1/2 !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : ""
                ),
                children: [
                  a && l ? c ? null : /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
                    /* @__PURE__ */ d.jsx(
                      me,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        "aria-label": "Expand details panel",
                        onClick: () => f(!0, !1),
                        className: "absolute left-3 top-1/2 z-20 h-8 w-8 -translate-y-[calc(100%+0.375rem)] rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur",
                        children: /* @__PURE__ */ d.jsx(It, { className: "h-4 w-4 rotate-180" })
                      }
                    ),
                    /* @__PURE__ */ d.jsx(
                      me,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        "aria-label": "Fully collapse details",
                        onClick: () => f(!0, !0, !0),
                        className: "absolute left-3 top-1/2 z-20 h-8 w-8 translate-y-[0.375rem] rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur",
                        children: /* @__PURE__ */ d.jsx(It, { className: "h-4 w-4" })
                      }
                    )
                  ] }) : null,
                  a && !l ? /* @__PURE__ */ d.jsx(
                    me,
                    {
                      type: "button",
                      size: "icon",
                      variant: "outline",
                      "aria-label": "Collapse details",
                      onClick: () => f(!0, !0, !1),
                      className: "absolute right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur",
                      children: /* @__PURE__ */ d.jsx(It, { className: "h-4 w-4" })
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
function lI({
  items: e,
  current: t
}) {
  return /* @__PURE__ */ d.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-base", children: [
    e.map((n, r) => /* @__PURE__ */ d.jsxs("div", { className: "contents", children: [
      n.onClick ? /* @__PURE__ */ d.jsx(
        me,
        {
          type: "button",
          variant: "link",
          size: "sm",
          className: "h-auto px-0 text-base no-underline hover:no-underline",
          onClick: n.onClick,
          children: n.label
        }
      ) : /* @__PURE__ */ d.jsx("span", { className: "text-base", children: n.label }),
      /* @__PURE__ */ d.jsx("span", { className: "text-muted-foreground", children: ">" })
    ] }, `${n.label}-${r}`)),
    /* @__PURE__ */ d.jsx("h2", { className: "min-w-0 break-words text-xl font-semibold tracking-tight", children: t })
  ] });
}
function cI({
  breadcrumbs: e,
  actions: t,
  className: n
}) {
  const r = lt(al), i = r?.floating && !r.collapsed, o = r && !r.floating;
  return /* @__PURE__ */ d.jsxs(
    "div",
    {
      "data-detail-header": !0,
      className: Q(
        "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
        n
      ),
      children: [
        /* @__PURE__ */ d.jsx("div", { className: "min-w-0 flex-1", children: e }),
        t ? /* @__PURE__ */ d.jsxs("div", { className: "flex shrink-0 items-center gap-2 self-start", children: [
          i ? /* @__PURE__ */ d.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.expandToNormalView(),
              children: [
                /* @__PURE__ */ d.jsx(ql, { className: "mr-2 h-4 w-4" }),
                "Expand View"
              ]
            }
          ) : null,
          o ? /* @__PURE__ */ d.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.switchToFloatingView(),
              children: [
                /* @__PURE__ */ d.jsx(Xl, { className: "mr-2 h-4 w-4" }),
                "Floating View"
              ]
            }
          ) : null,
          t
        ] }) : i || o ? /* @__PURE__ */ d.jsxs("div", { className: "flex shrink-0 items-center gap-2 self-start", children: [
          i ? /* @__PURE__ */ d.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.expandToNormalView(),
              children: [
                /* @__PURE__ */ d.jsx(ql, { className: "mr-2 h-4 w-4" }),
                "Expand View"
              ]
            }
          ) : null,
          o ? /* @__PURE__ */ d.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => r.switchToFloatingView(),
              children: [
                /* @__PURE__ */ d.jsx(Xl, { className: "mr-2 h-4 w-4" }),
                "Floating View"
              ]
            }
          ) : null
        ] }) : null
      ]
    }
  );
}
function uI({
  children: e,
  className: t = "grid gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)] md:grid-cols-4"
}) {
  return /* @__PURE__ */ d.jsx("div", { className: t, children: e });
}
function dI({ label: e, value: t }) {
  return /* @__PURE__ */ d.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ d.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ d.jsx("div", { className: "text-sm font-medium", children: t })
  ] });
}
function rN({
  children: e,
  className: t = "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]"
}) {
  return /* @__PURE__ */ d.jsx("section", { className: t, children: e });
}
function fI({
  label: e,
  value: t
}) {
  return /* @__PURE__ */ d.jsxs(rN, { children: [
    /* @__PURE__ */ d.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ d.jsx("p", { className: "mt-2 whitespace-pre-wrap break-words text-sm leading-6", children: t?.trim() || "-" })
  ] });
}
function mI({
  rows: e,
  className: t,
  tableClassName: n,
  labelColumnClassName: r
}) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      className: Q(
        "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
        t
      ),
      children: /* @__PURE__ */ d.jsx(
        Yi,
        {
          className: Q(
            "min-w-[40rem] table-fixed",
            n
          ),
          children: /* @__PURE__ */ d.jsx(Hi, { children: e.map((i, o) => /* @__PURE__ */ d.jsxs(
            Jt,
            {
              className: Q(
                "hover:bg-transparent",
                i.rowClassName
              ),
              children: [
                /* @__PURE__ */ d.jsx(
                  Dt,
                  {
                    className: Q(
                      "border-r border-border/60 px-4 py-3 align-middle text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                      r ?? "w-[220px]",
                      i.labelClassName
                    ),
                    children: i.label
                  }
                ),
                /* @__PURE__ */ d.jsx(
                  Dt,
                  {
                    className: Q(
                      "px-4 py-3 align-middle text-sm",
                      i.valueClassName
                    ),
                    children: i.value
                  }
                )
              ]
            },
            i.key ?? `detail-row-${o}`
          )) })
        }
      )
    }
  );
}
function hI({
  className: e,
  classKey: t,
  onOpenClass: n,
  buttonLabel: r = "Open class"
}) {
  const i = t?.trim() || "";
  return /* @__PURE__ */ d.jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ d.jsx("span", { className: "break-words", children: e?.trim() || "-" }),
    /* @__PURE__ */ d.jsx(
      me,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        onClick: n,
        disabled: !i,
        children: r
      }
    )
  ] });
}
function pI({
  label: e = "Class",
  classKey: t,
  onOpenClass: n
}) {
  const r = t?.trim() || "";
  return /* @__PURE__ */ d.jsxs("span", { className: "inline-flex items-center gap-1", children: [
    /* @__PURE__ */ d.jsx("span", { children: e }),
    /* @__PURE__ */ d.jsx(
      me,
      {
        type: "button",
        size: "icon",
        variant: "ghost",
        className: "h-5 w-5 p-0 text-muted-foreground hover:text-foreground",
        onClick: n,
        disabled: !r,
        children: /* @__PURE__ */ d.jsx(It, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
function gI({
  title: e,
  children: t
}) {
  return /* @__PURE__ */ d.jsxs("aside", { className: "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]", children: [
    /* @__PURE__ */ d.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ d.jsx("div", { className: "mt-3 flex flex-col gap-2", children: t })
  ] });
}
function iN({
  tabs: e,
  activeTab: t,
  onChange: n
}) {
  const r = pe(/* @__PURE__ */ new Map()), i = pe(null), o = pe(++$S), s = pe(!1), a = e.find((u) => u.value === t)?.value ?? e[0]?.value, [l, c] = Fa(() => ({
    left: 0,
    width: 0
  })), f = Ve(
    (u) => {
      if (!a)
        return We(o.current, "updatePill:no-active-tab", {
          activeTab: t,
          resolvedActiveTab: a,
          animate: u,
          tabs: e.map((g) => g.value)
        }), !1;
      const m = r.current.get(a);
      if (!m)
        return We(o.current, "updatePill:no-button", {
          activeTab: t,
          resolvedActiveTab: a,
          animate: u,
          availableButtons: Array.from(r.current.keys())
        }), !1;
      const h = m.offsetWidth;
      if (h <= 0)
        return We(o.current, "updatePill:zero-width", {
          activeTab: t,
          resolvedActiveTab: a,
          animate: u,
          offsetLeft: m.offsetLeft,
          offsetWidth: h,
          rect: m.getBoundingClientRect().toJSON()
        }), !1;
      const p = tN();
      return We(o.current, "updatePill:start", {
        activeTab: t,
        resolvedActiveTab: a,
        animate: u,
        offsetLeft: m.offsetLeft,
        offsetWidth: h,
        buttonRect: m.getBoundingClientRect().toJSON(),
        tabListRect: i.current?.getBoundingClientRect().toJSON()
      }), c.start({
        left: m.offsetLeft,
        width: h,
        immediate: !u,
        config: {
          tension: p.tabPillSpring.tension,
          friction: p.tabPillSpring.friction,
          clamp: !0
        }
      }), !0;
    },
    [t, c, a, e]
  );
  return $n(() => {
    let u = 0, m = 0;
    const h = 8, p = () => {
      const g = f(s.current);
      We(o.current, "layout-effect:measure", {
        attempts: m,
        measured: g,
        initialized: s.current
      }), !g && m < h && (m += 1, u = requestAnimationFrame(p));
    };
    return p(), s.current = !0, () => {
      u && cancelAnimationFrame(u);
    };
  }, [f]), de(() => {
    We(o.current, "render-state", {
      activeTab: t,
      resolvedActiveTab: a,
      tabs: e.map((u) => u.value)
    });
  }, [t, a, e]), de(() => {
    const u = () => {
      We(o.current, "window:resize"), f(!0);
    };
    return window.addEventListener("resize", u), () => {
      window.removeEventListener("resize", u);
    };
  }, [f]), de(() => {
    if (typeof ResizeObserver > "u")
      return;
    const u = i.current, m = a ? r.current.get(a) : null;
    if (!u && !m)
      return;
    const h = new ResizeObserver(() => {
      We(o.current, "resize-observer"), f(!0);
    });
    return u && h.observe(u), m && h.observe(m), () => {
      h.disconnect();
    };
  }, [a, f]), de(() => {
    if (typeof document > "u" || !("fonts" in document))
      return;
    let u = !1;
    return document.fonts.ready.then(() => {
      u || (We(o.current, "fonts:ready", {
        status: document.fonts.status
      }), f(!0));
    }), () => {
      u = !0;
    };
  }, [f]), /* @__PURE__ */ d.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border/70 bg-card/70 p-1 drop-shadow-md", children: /* @__PURE__ */ d.jsxs("div", { ref: i, className: "relative flex min-w-max gap-2", children: [
    /* @__PURE__ */ d.jsx(
      La.div,
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute left-0 top-0 h-full rounded-xl bg-primary shadow-sm",
        style: {
          left: l.left,
          width: l.width,
          opacity: l.width.to(
            (u) => u > 0 ? 1 : 0
          )
        }
      }
    ),
    e.map((u) => /* @__PURE__ */ d.jsx(
      "button",
      {
        ref: (m) => {
          m ? r.current.set(u.value, m) : r.current.delete(u.value), We(o.current, "button:ref", {
            tabValue: u.value,
            mounted: !!m,
            activeTab: t,
            resolvedActiveTab: a,
            offsetLeft: m?.offsetLeft,
            offsetWidth: m?.offsetWidth
          }), m && u.value === t && f(s.current);
        },
        type: "button",
        onClick: () => {
          We(o.current, "button:click", {
            tabValue: u.value,
            activeTab: t,
            resolvedActiveTab: a
          }), u.value !== a && n(u.value);
        },
        className: Q(
          "relative z-10 shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
          a === u.value ? "text-primary-foreground" : u.hasPendingChanges ? "font-bold text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-accent-foreground"
        ),
        children: u.label
      },
      u.value
    ))
  ] }) });
}
function xI({
  tabs: e,
  activeTab: t,
  onChange: n,
  children: r,
  className: i,
  contentClassName: o,
  contentScrollable: s = !1,
  scrollResetKey: a
}) {
  const l = lt(al), c = pe(null), f = pe(
    a
  ), u = pe(
    l?.floating
  );
  return $n(() => {
    a !== void 0 && f.current !== a && (f.current = a, c.current && (c.current.scrollTop = 0));
  }, [a]), $n(() => {
    const m = l?.floating;
    u.current !== m && (u.current = m, m && c.current && (c.current.scrollTop = 0));
  }, [l?.floating]), /* @__PURE__ */ d.jsxs("section", { className: Q("flex min-h-0 flex-col", i), children: [
    /* @__PURE__ */ d.jsx(
      "div",
      {
        "data-detail-tabs-wrap": !0,
        className: "shrink-0 overflow-visible pb-2",
        children: /* @__PURE__ */ d.jsx(
          iN,
          {
            tabs: e,
            activeTab: t,
            onChange: n
          }
        )
      }
    ),
    /* @__PURE__ */ d.jsx(
      "div",
      {
        ref: c,
        "data-detail-tab-content": !0,
        className: Q(
          "mt-4 min-h-0 flex-1",
          s && "overflow-y-auto overflow-x-hidden pr-1",
          o
        ),
        children: r
      }
    )
  ] });
}
function oN(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
function bI({
  topLabel: e,
  primaryLabel: t,
  secondaryLabel: n,
  percent: r,
  bottomLabel: i,
  bottomLeftLabel: o,
  bottomRightLabel: s
}) {
  const a = oN(r), l = a > 100, c = Math.min(100, a);
  return /* @__PURE__ */ d.jsxs("div", { className: "flex min-w-[220px] flex-col gap-1.5", children: [
    e ? /* @__PURE__ */ d.jsx("div", { className: "truncate text-[11px] text-muted-foreground", children: e }) : null,
    /* @__PURE__ */ d.jsxs("div", { className: "flex items-center justify-between gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ d.jsx("span", { className: "truncate", children: t }),
      n ? /* @__PURE__ */ d.jsx("span", { className: "shrink-0 tabular-nums", children: n }) : null
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted/70", children: /* @__PURE__ */ d.jsx(
      "div",
      {
        className: `h-full rounded-full transition-[width] ${l ? "bg-destructive" : "bg-primary"}`,
        style: { width: `${c}%` }
      }
    ) }),
    o || s ? /* @__PURE__ */ d.jsxs("div", { className: "flex items-center justify-between gap-3 text-[11px] text-muted-foreground", children: [
      /* @__PURE__ */ d.jsx("span", { className: "truncate", children: o }),
      /* @__PURE__ */ d.jsx("span", { className: "truncate text-right", children: s })
    ] }) : i ? /* @__PURE__ */ d.jsx("div", { className: "truncate text-[11px] text-muted-foreground", children: i }) : null
  ] });
}
function yI({
  open: e,
  onOpenChange: t,
  trigger: n,
  onClear: r,
  onApply: i,
  children: o,
  className: s,
  gridClassName: a
}) {
  return /* @__PURE__ */ d.jsxs(ia, { open: e, onOpenChange: t, children: [
    /* @__PURE__ */ d.jsx(oa, { asChild: !0, children: n }),
    /* @__PURE__ */ d.jsx(sa, { children: /* @__PURE__ */ d.jsx(
      aa,
      {
        align: "start",
        side: "bottom",
        sideOffset: 6,
        className: Q(
          "z-20 w-[min(calc(100vw-2rem),72rem)]",
          "outline-none data-[state=closed]:pointer-events-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        ),
        children: /* @__PURE__ */ d.jsxs(
          "div",
          {
            className: Q(
              "rounded-lg border border-border/60 bg-background px-4 pb-4 pt-3 shadow-lg",
              s
            ),
            children: [
              /* @__PURE__ */ d.jsxs("div", { className: "mb-3 flex items-center gap-2.5", children: [
                /* @__PURE__ */ d.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50", children: "Filters" }),
                /* @__PURE__ */ d.jsx("div", { className: "h-px flex-1 bg-border/40" })
              ] }),
              /* @__PURE__ */ d.jsx(
                "div",
                {
                  className: Q(
                    "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(18rem,100%),1fr))] [&>*]:min-w-0",
                    a
                  ),
                  children: o
                }
              ),
              (r || i) && /* @__PURE__ */ d.jsxs("div", { className: "mt-4 flex items-center justify-end gap-2 border-t border-border/30 pt-3", children: [
                r && /* @__PURE__ */ d.jsx(me, { type: "button", size: "sm", variant: "ghost", onClick: r, children: "Clear all" }),
                i && /* @__PURE__ */ d.jsx(me, { type: "button", size: "sm", onClick: i, children: "Apply filters" })
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
const vI = Ci(function({
  open: t,
  onToggle: n,
  activeCount: r = 0,
  className: i,
  onClick: o,
  ...s
}, a) {
  const l = r > 0, c = (f) => {
    o?.(f), f.defaultPrevented || n?.();
  };
  return /* @__PURE__ */ d.jsxs(
    me,
    {
      ref: a,
      type: "button",
      variant: t || l ? "secondary" : "outline",
      onClick: c,
      className: Q("gap-1.5", i),
      ...s,
      children: [
        /* @__PURE__ */ d.jsx(Rw, { className: "size-4" }),
        "Filters",
        l && /* @__PURE__ */ d.jsx("span", { className: "flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground", children: r })
      ]
    }
  );
});
function wI(e, t, n = "") {
  return e.get(t) ?? n;
}
function AI(e, t, n, r = 0) {
  const i = e.get(t);
  if (!i)
    return n;
  const o = Number.parseInt(i, 10);
  return Number.isNaN(o) || o < r ? n : o;
}
function kI(e, t, n) {
  const r = e.get(t);
  return r === "1" ? !0 : r === "0" ? !1 : n;
}
function EI(e, t) {
  const n = new URLSearchParams(e);
  return Object.entries(t).forEach(([r, i]) => {
    if (i == null || i === "" || i === !1) {
      n.delete(r);
      return;
    }
    if (i === !0) {
      n.set(r, "1");
      return;
    }
    n.set(r, String(i));
  }), n;
}
function CI(e) {
  if (!(e instanceof Error))
    return !1;
  const t = e.message.toLowerCase();
  return t.includes("403") || t.includes("forbidden") || t.includes("insufficient permission") || t.includes("insufficient permissions");
}
const sN = "edited_at is older than the current value. refresh data and retry with a newer edited_at";
function jI(e) {
  return e instanceof Error ? e.message.toLowerCase().includes(sN) : !1;
}
function MI({ ...e }) {
  return /* @__PURE__ */ d.jsx(Os, { "data-slot": "sheet", ...e });
}
function SI({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(qu, { "data-slot": "sheet-trigger", ...e });
}
function NI({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(gr, { "data-slot": "sheet-close", ...e });
}
function aN({
  ...e
}) {
  return /* @__PURE__ */ d.jsx(Ts, { "data-slot": "sheet-portal", ...e });
}
function lN({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    zs,
    {
      "data-slot": "sheet-overlay",
      className: Q(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        e
      ),
      ...t
    }
  );
}
function II({
  className: e,
  children: t,
  side: n = "right",
  showCloseButton: r = !0,
  ...i
}) {
  return /* @__PURE__ */ d.jsxs(aN, { children: [
    /* @__PURE__ */ d.jsx(lN, {}),
    /* @__PURE__ */ d.jsxs(
      Bs,
      {
        "data-slot": "sheet-content",
        className: Q(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500",
          n === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          n === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          n === "top" && "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          n === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          e
        ),
        ...i,
        children: [
          t,
          r && /* @__PURE__ */ d.jsxs(gr, { className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
            /* @__PURE__ */ d.jsx(Er, { className: "size-4" }),
            /* @__PURE__ */ d.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function DI({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: Q("flex flex-col gap-1.5 p-4", e),
      ...t
    }
  );
}
function RI({ className: e, ...t }) {
  return /* @__PURE__ */ d.jsx(
    "div",
    {
      "data-slot": "sheet-footer",
      className: Q("mt-auto flex flex-col gap-2 p-4", e),
      ...t
    }
  );
}
function PI({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    Gs,
    {
      "data-slot": "sheet-title",
      className: Q("font-semibold text-foreground", e),
      ...t
    }
  );
}
function OI({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ d.jsx(
    Xu,
    {
      "data-slot": "sheet-description",
      className: Q("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function cN(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  return typeof t.appsheet_key != "string" || typeof t.title != "string" ? null : {
    appsheet_key: t.appsheet_key,
    title: t.title,
    description: typeof t.description == "string" ? t.description : null,
    priority: typeof t.priority == "string" ? t.priority : null,
    start_time: typeof t.start_time == "string" ? t.start_time : null,
    end_time: typeof t.end_time == "string" ? t.end_time : null,
    created_at: typeof t.created_at == "string" ? t.created_at : null
  };
}
async function uN() {
  const e = await Lt(
    `${ri.baseURL}/users/me/notifications`,
    { method: "GET", headers: { Accept: "application/json" }, credentials: "include" }
  );
  if (!e.ok)
    throw new Error(`Failed to fetch notifications: ${e.status} ${e.statusText}`);
  const t = await e.json();
  return (Array.isArray(t) ? t : Array.isArray(t?.notifications) ? t.notifications : []).map(cN).filter((r) => r !== null);
}
async function dN(e) {
  try {
    await Lt(fp(e), {
      method: "PATCH",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ dismissed: !0 })
    });
  } catch {
  }
}
function fN(e) {
  const t = Date.now();
  return !(e.start_time && new Date(e.start_time).getTime() > t || e.end_time && new Date(e.end_time).getTime() < t);
}
const tp = nn(null);
function TI({ children: e }) {
  const { isAuthenticated: t } = Aa(), [n, r] = ge([]), [i, o] = ge(/* @__PURE__ */ new Set()), [s, a] = ge(!1), l = pe(!1), c = Ve(async () => {
    if (!l.current) {
      l.current = !0, a(!0);
      try {
        const x = await uN();
        r(x);
      } catch {
      } finally {
        l.current = !1, a(!1);
      }
    }
  }, []), f = Ve(() => {
    c();
  }, [c]);
  de(() => {
    if (!t) {
      r([]), o(/* @__PURE__ */ new Set());
      return;
    }
    c();
  }, [t]);
  const u = Ve((x) => {
    o((k) => /* @__PURE__ */ new Set([...k, x])), dN(x);
  }, []), m = n.filter(
    (x) => fN(x) && !i.has(x.appsheet_key)
  ), h = m.filter((x) => x.priority === "IMMEDIATE"), p = m.filter((x) => x.priority === "URGENT"), g = m.filter((x) => x.priority === "INFORMATIVE"), y = m.length;
  return /* @__PURE__ */ d.jsx(
    tp.Provider,
    {
      value: { immediate: h, urgent: p, informative: g, unreadCount: y, isLoading: s, dismiss: u, refetch: f },
      children: e
    }
  );
}
function ll() {
  const e = lt(tp);
  if (!e) throw new Error("useNotifications must be used within NotificationProvider");
  return e;
}
const cl = nn({
  fab: null,
  setFAB: () => {
  }
});
function zI({ children: e }) {
  const [t, n] = ge(null), r = Ve(
    (i) => n(i),
    []
  );
  return /* @__PURE__ */ d.jsx(cl.Provider, { value: { fab: t, setFAB: r }, children: e });
}
function mN() {
  return lt(cl);
}
function BI(e, t = "Create") {
  const { setFAB: n } = lt(cl), r = pe(null);
  r.current = e;
  const i = !!e;
  de(() => {
    if (!i) {
      n(null);
      return;
    }
    return n({ onClick: () => r.current?.(), label: t }), () => n(null);
  }, [i, t, n]);
}
function GI({
  className: e,
  icon: t
}) {
  const { fab: n } = mN();
  return n ? /* @__PURE__ */ d.jsx(
    "button",
    {
      type: "button",
      className: Q(
        "fixed bottom-20 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 md:hidden",
        e
      ),
      onClick: n.onClick,
      "aria-label": n.label ?? "Create",
      children: t ?? /* @__PURE__ */ d.jsx(Ew, { className: "size-6" })
    }
  ) : null;
}
function FI() {
  const { informative: e, unreadCount: t, isLoading: n, dismiss: r, refetch: i } = ll(), [o, s] = ge(!1), a = (l) => {
    !l && e.length > 0 && e.forEach((c) => r(c.appsheet_key)), s(l);
  };
  return /* @__PURE__ */ d.jsxs(ia, { open: o, onOpenChange: a, children: [
    /* @__PURE__ */ d.jsx(oa, { asChild: !0, children: /* @__PURE__ */ d.jsxs(
      "button",
      {
        type: "button",
        className: "relative flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-muted/45 text-foreground transition-colors hover:bg-muted",
        "aria-label": `Notifications${t > 0 ? `, ${t} unread` : ""}`,
        children: [
          /* @__PURE__ */ d.jsx(Uf, { className: "size-4" }),
          t > 0 && /* @__PURE__ */ d.jsx("span", { className: "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground", children: t > 99 ? "99+" : t })
        ]
      }
    ) }),
    /* @__PURE__ */ d.jsx(sa, { children: /* @__PURE__ */ d.jsxs(
      aa,
      {
        align: "end",
        sideOffset: 8,
        className: Q(
          "z-50 w-80 rounded-xl border border-border/70 bg-popover shadow-lg outline-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
          "duration-150"
        ),
        children: [
          /* @__PURE__ */ d.jsxs("div", { className: "flex items-center justify-between border-b border-border/60 px-4 py-3", children: [
            /* @__PURE__ */ d.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Notifications" }),
            /* @__PURE__ */ d.jsxs("div", { className: "flex items-center gap-2", children: [
              e.length > 0 && /* @__PURE__ */ d.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    e.forEach((l) => r(l.appsheet_key)), s(!1);
                  },
                  className: "text-xs text-muted-foreground transition-colors hover:text-foreground",
                  children: "Clear all"
                }
              ),
              /* @__PURE__ */ d.jsx(
                "button",
                {
                  type: "button",
                  onClick: i,
                  disabled: n,
                  className: "text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
                  "aria-label": "Refresh notifications",
                  children: /* @__PURE__ */ d.jsx(jw, { className: Q("size-3.5", n && "animate-spin") })
                }
              )
            ] })
          ] }),
          e.length === 0 ? /* @__PURE__ */ d.jsx("div", { className: "px-4 py-8 text-center text-sm text-muted-foreground", children: "No new notifications" }) : /* @__PURE__ */ d.jsx("ul", { className: "max-h-80 divide-y divide-border/50 overflow-y-auto", children: e.map((l) => /* @__PURE__ */ d.jsxs("li", { className: "flex items-start gap-3 px-4 py-3", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ d.jsx("p", { className: "text-sm font-medium leading-snug text-foreground", children: l.title }),
              l.description && /* @__PURE__ */ d.jsx("p", { className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground", children: l.description })
            ] }),
            /* @__PURE__ */ d.jsx(
              "button",
              {
                type: "button",
                onClick: () => r(l.appsheet_key),
                className: "mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground",
                "aria-label": "Dismiss",
                children: /* @__PURE__ */ d.jsx(Er, { className: "size-3.5" })
              }
            )
          ] }, l.appsheet_key)) })
        ]
      }
    ) })
  ] });
}
function LI() {
  const { immediate: e, dismiss: t } = ll(), n = e[0] ?? null;
  return n ? /* @__PURE__ */ d.jsx(Os, { open: !0, children: /* @__PURE__ */ d.jsxs(Ts, { children: [
    /* @__PURE__ */ d.jsx(zs, { className: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" }),
    /* @__PURE__ */ d.jsxs(
      Bs,
      {
        onEscapeKeyDown: (r) => r.preventDefault(),
        onInteractOutside: (r) => r.preventDefault(),
        className: "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "aria-describedby": n.description ? "immediate-desc" : void 0,
        children: [
          /* @__PURE__ */ d.jsxs("div", { className: "flex flex-col items-center px-8 py-10 text-center", children: [
            /* @__PURE__ */ d.jsx("span", { className: "mb-5 flex size-10 items-center justify-center rounded-full bg-muted ring-1 ring-border", children: /* @__PURE__ */ d.jsx(Uf, { className: "size-4 text-foreground" }) }),
            e.length > 1 && /* @__PURE__ */ d.jsxs("p", { className: "mb-1 text-xs text-muted-foreground", children: [
              e.length,
              " notices"
            ] }),
            /* @__PURE__ */ d.jsx(Gs, { className: "text-lg font-semibold leading-snug text-foreground", children: n.title }),
            n.description && /* @__PURE__ */ d.jsx("p", { id: "immediate-desc", className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: n.description })
          ] }),
          /* @__PURE__ */ d.jsx("div", { className: "flex justify-center border-t border-border/60 px-6 py-4", children: /* @__PURE__ */ d.jsx(me, { onClick: () => t(n.appsheet_key), children: "Acknowledge" }) })
        ]
      }
    )
  ] }) }) : null;
}
function YI() {
  const { urgent: e, dismiss: t } = ll();
  return e.length === 0 ? null : /* @__PURE__ */ d.jsx("div", { className: "space-y-2", children: e.map((n) => /* @__PURE__ */ d.jsxs(
    "div",
    {
      role: "alert",
      className: "flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300",
      children: [
        /* @__PURE__ */ d.jsx(Tw, { className: "mt-0.5 size-4 shrink-0 text-amber-500 dark:text-amber-400" }),
        /* @__PURE__ */ d.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ d.jsx("p", { className: "text-sm font-semibold leading-snug", children: n.title }),
          n.description && /* @__PURE__ */ d.jsx("p", { className: "mt-0.5 text-sm opacity-80", children: n.description })
        ] }),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            type: "button",
            onClick: () => t(n.appsheet_key),
            className: "mt-0.5 shrink-0 opacity-60 transition-opacity hover:opacity-100",
            "aria-label": "Dismiss notification",
            children: /* @__PURE__ */ d.jsx(Er, { className: "size-4" })
          }
        )
      ]
    },
    n.appsheet_key
  )) });
}
export {
  ri as API_CONFIG,
  yI as AdvancedFiltersPanel,
  vI as AdvancedFiltersToggle,
  $f as AppTheme,
  zN as AuthProvider,
  nN as BackgroundDetailViewContext,
  me as Button,
  v0 as Card,
  GN as CardAction,
  E0 as CardContent,
  k0 as CardDescription,
  $N as CardField,
  FN as CardFooter,
  w0 as CardHeader,
  A0 as CardTitle,
  QN as ColorModeIconDropdown,
  tm as ColorModeSelect,
  ol as DETAIL_HIDDEN_COLLAPSED_VALUE,
  gI as DetailActionPanel,
  lI as DetailBreadcrumbs,
  rN as DetailCard,
  pI as DetailClassHeaderLabel,
  hI as DetailClassLinkValue,
  mI as DetailFieldsTable,
  cI as DetailHeader,
  uI as DetailSummaryGrid,
  dI as DetailSummaryItem,
  xI as DetailTabbedSection,
  iN as DetailTabs,
  fI as DetailTextBlock,
  aI as DetailView,
  ma as Dialog,
  vN as DialogClose,
  ha as DialogContent,
  Jf as DialogDescription,
  Wf as DialogFooter,
  pa as DialogHeader,
  Lw as DialogOverlay,
  Fw as DialogPortal,
  ga as DialogTitle,
  yN as DialogTrigger,
  ba as DropdownMenu,
  EN as DropdownMenuCheckboxItem,
  va as DropdownMenuContent,
  AN as DropdownMenuGroup,
  kN as DropdownMenuItem,
  n0 as DropdownMenuLabel,
  wN as DropdownMenuPortal,
  em as DropdownMenuRadioGroup,
  yn as DropdownMenuRadioItem,
  r0 as DropdownMenuSeparator,
  CN as DropdownMenuShortcut,
  jN as DropdownMenuSub,
  SN as DropdownMenuSubContent,
  MN as DropdownMenuSubTrigger,
  ya as DropdownMenuTrigger,
  _w as ForgotPassword,
  D0 as FormTableDialog,
  I0 as FormTableRow,
  iI as GuideIconButton,
  oI as GuideMenuButton,
  rI as GuidesSidebarContent,
  LI as ImmediateNotificationDialog,
  Vt as Input,
  qt as Label,
  UN as LazyViewFallback,
  tI as MobileBottomBar,
  eI as MobileCardList,
  zI as MobileFABProvider,
  GI as MobileFloatingActionButton,
  JN as MultiSelectDropdown,
  FI as NotificationBell,
  TI as NotificationProvider,
  l1 as PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS,
  n1 as PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL,
  c1 as PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS,
  s1 as PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT,
  i1 as PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL,
  o1 as PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL,
  t1 as PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL,
  a1 as PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG,
  r1 as PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL,
  XN as PatchRecordDialog,
  KN as PendingChangesBar,
  YN as PendingChangesProvider,
  bI as ProgressMetricCell,
  LN as ResetPassword,
  ka as SearchableSelect,
  Lv as Separator,
  MI as Sheet,
  NI as SheetClose,
  II as SheetContent,
  OI as SheetDescription,
  RI as SheetFooter,
  DI as SheetHeader,
  PI as SheetTitle,
  SI as SheetTrigger,
  BN as SignIn,
  _N as SimpleDataTable,
  ts as SitemarkIcon,
  rr as StatusBanner,
  Yi as Table,
  Hi as TableBody,
  qN as TableCaption,
  Dt as TableCell,
  VN as TableFooter,
  am as TableHead,
  sm as TableHeader,
  Jt as TableRow,
  N0 as Textarea,
  YI as UrgentNotificationBanner,
  nI as UserGuideView,
  BS as buildGuides,
  Fv as buttonVariants,
  WN as canAccessManagement,
  xN as configureApi,
  NN as formatDate,
  IN as formatUserTimestamp,
  sI as getDetailReturnLocation,
  kI as getQueryBoolean,
  AI as getQueryNumber,
  wI as getQueryParam,
  TN as getTextareaRows,
  Ea as getUserScopes,
  M0 as hasAnyUserScope,
  ZN as hasUserScope,
  jI as isOutdatedEditedAtConflictError,
  CI as isPermissionDeniedError,
  zS as parseGuide,
  ep as readStoredDetailViewMode,
  qS as resolveDetailViewMode,
  VS as stripDetailViewModeFromPath,
  RN as toBackendBoundary,
  ON as toBackendTimeValue,
  DN as toBackendTimestamp,
  PN as toDateTimeLocalValue,
  XS as toDetailReturnUrl,
  EI as updateSearchParams,
  Aa as useAuth,
  _f as useColorMode,
  _S as useDetailViewMode,
  BI as useMobileFAB,
  mN as useMobileFABContext,
  ll as useNotifications,
  HN as usePendingChanges,
  KS as useResolvedDetailViewMode,
  fu as writeDetailViewMode
};
