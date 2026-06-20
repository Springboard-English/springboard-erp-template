import * as v from "react";
import st, { useState as ge, useLayoutEffect as cr, useContext as qe, createContext as Nt, forwardRef as Qi, createElement as bi, useMemo as be, useRef as pe, useCallback as Ye, useEffect as ue, Fragment as ig, useId as og } from "react";
import * as ad from "react-dom";
import sg, { unstable_batchedUpdates as ag, createPortal as lg } from "react-dom";
import { useLocation as ld, useNavigate as cd } from "react-router-dom";
let ud = "https://api.springboard.vn";
function lP(e) {
  ud = e.baseUrl;
}
const yi = {
  get baseURL() {
    return ud;
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
function Ut(e) {
  return `${yi.baseURL}${yi.endpoints[e]}`;
}
function cg(e) {
  return `${yi.baseURL}/notifications/${encodeURIComponent(e)}`;
}
function aa(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Vr = { exports: {} }, Yn = {};
var Hl;
function ug() {
  if (Hl) return Yn;
  Hl = 1;
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
  return Yn.Fragment = t, Yn.jsx = n, Yn.jsxs = n, Yn;
}
var Hn = {};
var Ul;
function dg() {
  return Ul || (Ul = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(M) {
      if (M == null) return null;
      if (typeof M == "function")
        return M.$$typeof === P ? null : M.displayName || M.name || null;
      if (typeof M == "string") return M;
      switch (M) {
        case x:
          return "Fragment";
        case A:
          return "Profiler";
        case b:
          return "StrictMode";
        case C:
          return "Suspense";
        case O:
          return "SuspenseList";
        case E:
          return "Activity";
      }
      if (typeof M == "object")
        switch (typeof M.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), M.$$typeof) {
          case g:
            return "Portal";
          case S:
            return M.displayName || "Context";
          case w:
            return (M._context.displayName || "Context") + ".Consumer";
          case N:
            var U = M.render;
            return M = M.displayName, M || (M = U.displayName || U.name || "", M = M !== "" ? "ForwardRef(" + M + ")" : "ForwardRef"), M;
          case D:
            return U = M.displayName || null, U !== null ? U : e(M.type) || "Memo";
          case z:
            U = M._payload, M = M._init;
            try {
              return e(M(U));
            } catch {
            }
        }
      return null;
    }
    function t(M) {
      return "" + M;
    }
    function n(M) {
      try {
        t(M);
        var U = !1;
      } catch {
        U = !0;
      }
      if (U) {
        U = console;
        var k = U.error, X = typeof Symbol == "function" && Symbol.toStringTag && M[Symbol.toStringTag] || M.constructor.name || "Object";
        return k.call(
          U,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          X
        ), t(M);
      }
    }
    function r(M) {
      if (M === x) return "<>";
      if (typeof M == "object" && M !== null && M.$$typeof === z)
        return "<...>";
      try {
        var U = e(M);
        return U ? "<" + U + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var M = T.A;
      return M === null ? null : M.getOwner();
    }
    function o() {
      return Error("react-stack-top-frame");
    }
    function s(M) {
      if (Y.call(M, "key")) {
        var U = Object.getOwnPropertyDescriptor(M, "key").get;
        if (U && U.isReactWarning) return !1;
      }
      return M.key !== void 0;
    }
    function a(M, U) {
      function k() {
        I || (I = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          U
        ));
      }
      k.isReactWarning = !0, Object.defineProperty(M, "key", {
        get: k,
        configurable: !0
      });
    }
    function l() {
      var M = e(this.type);
      return F[M] || (F[M] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), M = this.props.ref, M !== void 0 ? M : null;
    }
    function c(M, U, k, X, K, W) {
      var Z = k.ref;
      return M = {
        $$typeof: m,
        type: M,
        key: U,
        props: k,
        _owner: X
      }, (Z !== void 0 ? Z : null) !== null ? Object.defineProperty(M, "ref", {
        enumerable: !1,
        get: l
      }) : Object.defineProperty(M, "ref", { enumerable: !1, value: null }), M._store = {}, Object.defineProperty(M._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(M, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(M, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: K
      }), Object.defineProperty(M, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: W
      }), Object.freeze && (Object.freeze(M.props), Object.freeze(M)), M;
    }
    function d(M, U, k, X, K, W) {
      var Z = U.children;
      if (Z !== void 0)
        if (X)
          if (R(Z)) {
            for (X = 0; X < Z.length; X++)
              u(Z[X]);
            Object.freeze && Object.freeze(Z);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(Z);
      if (Y.call(U, "key")) {
        Z = e(M);
        var q = Object.keys(U).filter(function(le) {
          return le !== "key";
        });
        X = 0 < q.length ? "{key: someKey, " + q.join(": ..., ") + ": ...}" : "{key: someKey}", y[Z + X] || (q = 0 < q.length ? "{" + q.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          X,
          Z,
          q,
          Z
        ), y[Z + X] = !0);
      }
      if (Z = null, k !== void 0 && (n(k), Z = "" + k), s(U) && (n(U.key), Z = "" + U.key), "key" in U) {
        k = {};
        for (var ee in U)
          ee !== "key" && (k[ee] = U[ee]);
      } else k = U;
      return Z && a(
        k,
        typeof M == "function" ? M.displayName || M.name || "Unknown" : M
      ), c(
        M,
        Z,
        k,
        i(),
        K,
        W
      );
    }
    function u(M) {
      p(M) ? M._store && (M._store.validated = 1) : typeof M == "object" && M !== null && M.$$typeof === z && (M._payload.status === "fulfilled" ? p(M._payload.value) && M._payload.value._store && (M._payload.value._store.validated = 1) : M._store && (M._store.validated = 1));
    }
    function p(M) {
      return typeof M == "object" && M !== null && M.$$typeof === m;
    }
    var h = st, m = /* @__PURE__ */ Symbol.for("react.transitional.element"), g = /* @__PURE__ */ Symbol.for("react.portal"), x = /* @__PURE__ */ Symbol.for("react.fragment"), b = /* @__PURE__ */ Symbol.for("react.strict_mode"), A = /* @__PURE__ */ Symbol.for("react.profiler"), w = /* @__PURE__ */ Symbol.for("react.consumer"), S = /* @__PURE__ */ Symbol.for("react.context"), N = /* @__PURE__ */ Symbol.for("react.forward_ref"), C = /* @__PURE__ */ Symbol.for("react.suspense"), O = /* @__PURE__ */ Symbol.for("react.suspense_list"), D = /* @__PURE__ */ Symbol.for("react.memo"), z = /* @__PURE__ */ Symbol.for("react.lazy"), E = /* @__PURE__ */ Symbol.for("react.activity"), P = /* @__PURE__ */ Symbol.for("react.client.reference"), T = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = Object.prototype.hasOwnProperty, R = Array.isArray, j = console.createTask ? console.createTask : function() {
      return null;
    };
    h = {
      react_stack_bottom_frame: function(M) {
        return M();
      }
    };
    var I, F = {}, B = h.react_stack_bottom_frame.bind(
      h,
      o
    )(), L = j(r(o)), y = {};
    Hn.Fragment = x, Hn.jsx = function(M, U, k) {
      var X = 1e4 > T.recentlyCreatedOwnerStacks++;
      return d(
        M,
        U,
        k,
        !1,
        X ? Error("react-stack-top-frame") : B,
        X ? j(r(M)) : L
      );
    }, Hn.jsxs = function(M, U, k) {
      var X = 1e4 > T.recentlyCreatedOwnerStacks++;
      return d(
        M,
        U,
        k,
        !0,
        X ? Error("react-stack-top-frame") : B,
        X ? j(r(M)) : L
      );
    };
  })()), Hn;
}
var Ql;
function fg() {
  return Ql || (Ql = 1, process.env.NODE_ENV === "production" ? Vr.exports = ug() : Vr.exports = dg()), Vr.exports;
}
var f = fg();
function dd(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var i = e.length;
    for (t = 0; t < i; t++) e[t] && (n = dd(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function fd() {
  for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = dd(e)) && (r && (r += " "), r += t);
  return r;
}
const Zl = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Vl = fd, hg = (e, t) => (n) => {
  var r;
  if (t?.variants == null) return Vl(e, n?.class, n?.className);
  const { variants: i, defaultVariants: o } = t, s = Object.keys(i).map((c) => {
    const d = n?.[c], u = o?.[c];
    if (d === null) return null;
    const p = Zl(d) || Zl(u);
    return i[c][p];
  }), a = n && Object.entries(n).reduce((c, d) => {
    let [u, p] = d;
    return p === void 0 || (c[u] = p), c;
  }, {}), l = t == null || (r = t.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((c, d) => {
    let { class: u, className: p, ...h } = d;
    return Object.entries(h).every((m) => {
      let [g, x] = m;
      return Array.isArray(x) ? x.includes({
        ...o,
        ...a
      }[g]) : {
        ...o,
        ...a
      }[g] === x;
    }) ? [
      ...c,
      u,
      p
    ] : c;
  }, []);
  return Vl(e, s, l, n?.class, n?.className);
};
function Wl(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Zi(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((i) => {
      const o = Wl(i, t);
      return !n && typeof o == "function" && (n = !0), o;
    });
    if (n)
      return () => {
        for (let i = 0; i < r.length; i++) {
          const o = r[i];
          typeof o == "function" ? o() : Wl(e[i], null);
        }
      };
  };
}
function je(...e) {
  return v.useCallback(Zi(...e), e);
}
// @__NO_SIDE_EFFECTS__
function rn(e) {
  const t = /* @__PURE__ */ mg(e), n = v.forwardRef((r, i) => {
    const { children: o, ...s } = r, a = v.Children.toArray(o), l = a.find(xg);
    if (l) {
      const c = l.props.children, d = a.map((u) => u === l ? v.Children.count(c) > 1 ? v.Children.only(null) : v.isValidElement(c) ? c.props.children : null : u);
      return /* @__PURE__ */ f.jsx(t, { ...s, ref: i, children: v.isValidElement(c) ? v.cloneElement(c, void 0, d) : null });
    }
    return /* @__PURE__ */ f.jsx(t, { ...s, ref: i, children: o });
  });
  return n.displayName = `${e}.Slot`, n;
}
var pg = /* @__PURE__ */ rn("Slot");
// @__NO_SIDE_EFFECTS__
function mg(e) {
  const t = v.forwardRef((n, r) => {
    const { children: i, ...o } = n;
    if (v.isValidElement(i)) {
      const s = yg(i), a = bg(o, i.props);
      return i.type !== v.Fragment && (a.ref = r ? Zi(r, s) : s), v.cloneElement(i, a);
    }
    return v.Children.count(i) > 1 ? v.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var gg = /* @__PURE__ */ Symbol("radix.slottable");
function xg(e) {
  return v.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === gg;
}
function bg(e, t) {
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
function yg(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var vg = [
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
], Ae = vg.reduce((e, t) => {
  const n = /* @__PURE__ */ rn(`Primitive.${t}`), r = v.forwardRef((i, o) => {
    const { asChild: s, ...a } = i, l = s ? n : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ f.jsx(l, { ...a, ref: o });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function hd(e, t) {
  e && ad.flushSync(() => e.dispatchEvent(t));
}
function wg(e, t) {
  const n = v.createContext(t), r = (o) => {
    const { children: s, ...a } = o, l = v.useMemo(() => a, Object.values(a));
    return /* @__PURE__ */ f.jsx(n.Provider, { value: l, children: s });
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
function un(e, t = []) {
  let n = [];
  function r(o, s) {
    const a = v.createContext(s), l = n.length;
    n = [...n, s];
    const c = (u) => {
      const { scope: p, children: h, ...m } = u, g = p?.[e]?.[l] || a, x = v.useMemo(() => m, Object.values(m));
      return /* @__PURE__ */ f.jsx(g.Provider, { value: x, children: h });
    };
    c.displayName = o + "Provider";
    function d(u, p) {
      const h = p?.[e]?.[l] || a, m = v.useContext(h);
      if (m) return m;
      if (s !== void 0) return s;
      throw new Error(`\`${u}\` must be used within \`${o}\``);
    }
    return [c, d];
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
  return i.scopeName = e, [r, Ag(i, ...t)];
}
function Ag(...e) {
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
function pd(e) {
  const t = e + "CollectionProvider", [n, r] = un(t), [i, o] = n(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), s = (g) => {
    const { scope: x, children: b } = g, A = st.useRef(null), w = st.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ f.jsx(i, { scope: x, itemMap: w, collectionRef: A, children: b });
  };
  s.displayName = t;
  const a = e + "CollectionSlot", l = /* @__PURE__ */ rn(a), c = st.forwardRef(
    (g, x) => {
      const { scope: b, children: A } = g, w = o(a, b), S = je(x, w.collectionRef);
      return /* @__PURE__ */ f.jsx(l, { ref: S, children: A });
    }
  );
  c.displayName = a;
  const d = e + "CollectionItemSlot", u = "data-radix-collection-item", p = /* @__PURE__ */ rn(d), h = st.forwardRef(
    (g, x) => {
      const { scope: b, children: A, ...w } = g, S = st.useRef(null), N = je(x, S), C = o(d, b);
      return st.useEffect(() => (C.itemMap.set(S, { ref: S, ...w }), () => {
        C.itemMap.delete(S);
      })), /* @__PURE__ */ f.jsx(p, { [u]: "", ref: N, children: A });
    }
  );
  h.displayName = d;
  function m(g) {
    const x = o(e + "CollectionConsumer", g);
    return st.useCallback(() => {
      const A = x.collectionRef.current;
      if (!A) return [];
      const w = Array.from(A.querySelectorAll(`[${u}]`));
      return Array.from(x.itemMap.values()).sort(
        (C, O) => w.indexOf(C.ref.current) - w.indexOf(O.ref.current)
      );
    }, [x.collectionRef, x.itemMap]);
  }
  return [
    { Provider: s, Slot: c, ItemSlot: h },
    m,
    r
  ];
}
function ie(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(i) {
    if (e?.(i), n === !1 || !i.defaultPrevented)
      return t?.(i);
  };
}
var Gt = globalThis?.document ? v.useLayoutEffect : () => {
}, kg = v[" useInsertionEffect ".trim().toString()] || Gt;
function Sr({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [i, o, s] = Eg({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, l = a ? e : i;
  {
    const d = v.useRef(e !== void 0);
    v.useEffect(() => {
      const u = d.current;
      u !== a && console.warn(
        `${r} is changing from ${u ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = a;
    }, [a, r]);
  }
  const c = v.useCallback(
    (d) => {
      if (a) {
        const u = Cg(d) ? d(e) : d;
        u !== e && s.current?.(u);
      } else
        o(d);
    },
    [a, e, o, s]
  );
  return [l, c];
}
function Eg({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = v.useState(e), i = v.useRef(n), o = v.useRef(t);
  return kg(() => {
    o.current = t;
  }, [t]), v.useEffect(() => {
    i.current !== n && (o.current?.(n), i.current = n);
  }, [n, i]), [n, r, o];
}
function Cg(e) {
  return typeof e == "function";
}
function Sg(e, t) {
  return v.useReducer((n, r) => t[n][r] ?? n, e);
}
var mt = (e) => {
  const { present: t, children: n } = e, r = Ng(t), i = typeof n == "function" ? n({ present: r.isPresent }) : v.Children.only(n), o = je(r.ref, jg(i));
  return typeof n == "function" || r.isPresent ? v.cloneElement(i, { ref: o }) : null;
};
mt.displayName = "Presence";
function Ng(e) {
  const [t, n] = v.useState(), r = v.useRef(null), i = v.useRef(e), o = v.useRef("none"), s = e ? "mounted" : "unmounted", [a, l] = Sg(s, {
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
    const c = Wr(r.current);
    o.current = a === "mounted" ? c : "none";
  }, [a]), Gt(() => {
    const c = r.current, d = i.current;
    if (d !== e) {
      const p = o.current, h = Wr(c);
      e ? l("MOUNT") : h === "none" || c?.display === "none" ? l("UNMOUNT") : l(d && p !== h ? "ANIMATION_OUT" : "UNMOUNT"), i.current = e;
    }
  }, [e, l]), Gt(() => {
    if (t) {
      let c;
      const d = t.ownerDocument.defaultView ?? window, u = (h) => {
        const g = Wr(r.current).includes(CSS.escape(h.animationName));
        if (h.target === t && g && (l("ANIMATION_END"), !i.current)) {
          const x = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", c = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = x);
          });
        }
      }, p = (h) => {
        h.target === t && (o.current = Wr(r.current));
      };
      return t.addEventListener("animationstart", p), t.addEventListener("animationcancel", u), t.addEventListener("animationend", u), () => {
        d.clearTimeout(c), t.removeEventListener("animationstart", p), t.removeEventListener("animationcancel", u), t.removeEventListener("animationend", u);
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
function Wr(e) {
  return e?.animationName || "none";
}
function jg(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var Mg = v[" useId ".trim().toString()] || (() => {
}), Ig = 0;
function Et(e) {
  const [t, n] = v.useState(Mg());
  return Gt(() => {
    n((r) => r ?? String(Ig++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var Pg = v.createContext(void 0);
function md(e) {
  const t = v.useContext(Pg);
  return e || t || "ltr";
}
function ht(e) {
  const t = v.useRef(e);
  return v.useEffect(() => {
    t.current = e;
  }), v.useMemo(() => (...n) => t.current?.(...n), []);
}
function Rg(e, t = globalThis?.document) {
  const n = ht(e);
  v.useEffect(() => {
    const r = (i) => {
      i.key === "Escape" && n(i);
    };
    return t.addEventListener("keydown", r, { capture: !0 }), () => t.removeEventListener("keydown", r, { capture: !0 });
  }, [n, t]);
}
var Dg = "DismissableLayer", ys = "dismissableLayer.update", Og = "dismissableLayer.pointerDownOutside", Tg = "dismissableLayer.focusOutside", Jl, gd = v.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Vi = v.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: i,
      onFocusOutside: o,
      onInteractOutside: s,
      onDismiss: a,
      ...l
    } = e, c = v.useContext(gd), [d, u] = v.useState(null), p = d?.ownerDocument ?? globalThis?.document, [, h] = v.useState({}), m = je(t, (O) => u(O)), g = Array.from(c.layers), [x] = [...c.layersWithOutsidePointerEventsDisabled].slice(-1), b = g.indexOf(x), A = d ? g.indexOf(d) : -1, w = c.layersWithOutsidePointerEventsDisabled.size > 0, S = A >= b, N = Lg((O) => {
      const D = O.target, z = [...c.branches].some((E) => E.contains(D));
      !S || z || (i?.(O), s?.(O), O.defaultPrevented || a?.());
    }, p), C = Fg((O) => {
      const D = O.target;
      [...c.branches].some((E) => E.contains(D)) || (o?.(O), s?.(O), O.defaultPrevented || a?.());
    }, p);
    return Rg((O) => {
      A === c.layers.size - 1 && (r?.(O), !O.defaultPrevented && a && (O.preventDefault(), a()));
    }, p), v.useEffect(() => {
      if (d)
        return n && (c.layersWithOutsidePointerEventsDisabled.size === 0 && (Jl = p.body.style.pointerEvents, p.body.style.pointerEvents = "none"), c.layersWithOutsidePointerEventsDisabled.add(d)), c.layers.add(d), ql(), () => {
          n && c.layersWithOutsidePointerEventsDisabled.size === 1 && (p.body.style.pointerEvents = Jl);
        };
    }, [d, p, n, c]), v.useEffect(() => () => {
      d && (c.layers.delete(d), c.layersWithOutsidePointerEventsDisabled.delete(d), ql());
    }, [d, c]), v.useEffect(() => {
      const O = () => h({});
      return document.addEventListener(ys, O), () => document.removeEventListener(ys, O);
    }, []), /* @__PURE__ */ f.jsx(
      Ae.div,
      {
        ...l,
        ref: m,
        style: {
          pointerEvents: w ? S ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: ie(e.onFocusCapture, C.onFocusCapture),
        onBlurCapture: ie(e.onBlurCapture, C.onBlurCapture),
        onPointerDownCapture: ie(
          e.onPointerDownCapture,
          N.onPointerDownCapture
        )
      }
    );
  }
);
Vi.displayName = Dg;
var zg = "DismissableLayerBranch", Bg = v.forwardRef((e, t) => {
  const n = v.useContext(gd), r = v.useRef(null), i = je(t, r);
  return v.useEffect(() => {
    const o = r.current;
    if (o)
      return n.branches.add(o), () => {
        n.branches.delete(o);
      };
  }, [n.branches]), /* @__PURE__ */ f.jsx(Ae.div, { ...e, ref: i });
});
Bg.displayName = zg;
function Lg(e, t = globalThis?.document) {
  const n = ht(e), r = v.useRef(!1), i = v.useRef(() => {
  });
  return v.useEffect(() => {
    const o = (a) => {
      if (a.target && !r.current) {
        let l = function() {
          xd(
            Og,
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
function Fg(e, t = globalThis?.document) {
  const n = ht(e), r = v.useRef(!1);
  return v.useEffect(() => {
    const i = (o) => {
      o.target && !r.current && xd(Tg, n, { originalEvent: o }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", i), () => t.removeEventListener("focusin", i);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function ql() {
  const e = new CustomEvent(ys);
  document.dispatchEvent(e);
}
function xd(e, t, n, { discrete: r }) {
  const i = n.originalEvent.target, o = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && i.addEventListener(e, t, { once: !0 }), r ? hd(i, o) : i.dispatchEvent(o);
}
var jo = "focusScope.autoFocusOnMount", Mo = "focusScope.autoFocusOnUnmount", Kl = { bubbles: !1, cancelable: !0 }, Gg = "FocusScope", Wi = v.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: i,
    onUnmountAutoFocus: o,
    ...s
  } = e, [a, l] = v.useState(null), c = ht(i), d = ht(o), u = v.useRef(null), p = je(t, (g) => l(g)), h = v.useRef({
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
        const S = w.target;
        a.contains(S) ? u.current = S : Tt(u.current, { select: !0 });
      }, x = function(w) {
        if (h.paused || !a) return;
        const S = w.relatedTarget;
        S !== null && (a.contains(S) || Tt(u.current, { select: !0 }));
      }, b = function(w) {
        if (document.activeElement === document.body)
          for (const N of w)
            N.removedNodes.length > 0 && Tt(a);
      };
      document.addEventListener("focusin", g), document.addEventListener("focusout", x);
      const A = new MutationObserver(b);
      return a && A.observe(a, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", g), document.removeEventListener("focusout", x), A.disconnect();
      };
    }
  }, [r, a, h.paused]), v.useEffect(() => {
    if (a) {
      _l.add(h);
      const g = document.activeElement;
      if (!a.contains(g)) {
        const b = new CustomEvent(jo, Kl);
        a.addEventListener(jo, c), a.dispatchEvent(b), b.defaultPrevented || (Yg(Vg(bd(a)), { select: !0 }), document.activeElement === g && Tt(a));
      }
      return () => {
        a.removeEventListener(jo, c), setTimeout(() => {
          const b = new CustomEvent(Mo, Kl);
          a.addEventListener(Mo, d), a.dispatchEvent(b), b.defaultPrevented || Tt(g ?? document.body, { select: !0 }), a.removeEventListener(Mo, d), _l.remove(h);
        }, 0);
      };
    }
  }, [a, c, d, h]);
  const m = v.useCallback(
    (g) => {
      if (!n && !r || h.paused) return;
      const x = g.key === "Tab" && !g.altKey && !g.ctrlKey && !g.metaKey, b = document.activeElement;
      if (x && b) {
        const A = g.currentTarget, [w, S] = Hg(A);
        w && S ? !g.shiftKey && b === S ? (g.preventDefault(), n && Tt(w, { select: !0 })) : g.shiftKey && b === w && (g.preventDefault(), n && Tt(S, { select: !0 })) : b === A && g.preventDefault();
      }
    },
    [n, r, h.paused]
  );
  return /* @__PURE__ */ f.jsx(Ae.div, { tabIndex: -1, ...s, ref: p, onKeyDown: m });
});
Wi.displayName = Gg;
function Yg(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (Tt(r, { select: t }), document.activeElement !== n) return;
}
function Hg(e) {
  const t = bd(e), n = Xl(t, e), r = Xl(t.reverse(), e);
  return [n, r];
}
function bd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const i = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Xl(e, t) {
  for (const n of e)
    if (!Ug(n, { upTo: t })) return n;
}
function Ug(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function Qg(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Tt(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Qg(e) && t && e.select();
  }
}
var _l = Zg();
function Zg() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && n?.pause(), e = $l(e, t), e.unshift(t);
    },
    remove(t) {
      e = $l(e, t), e[0]?.resume();
    }
  };
}
function $l(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function Vg(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Wg = "Portal", Ji = v.forwardRef((e, t) => {
  const { container: n, ...r } = e, [i, o] = v.useState(!1);
  Gt(() => o(!0), []);
  const s = n || i && globalThis?.document?.body;
  return s ? sg.createPortal(/* @__PURE__ */ f.jsx(Ae.div, { ...r, ref: t }), s) : null;
});
Ji.displayName = Wg;
var Io = 0;
function la() {
  v.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? ec()), document.body.insertAdjacentElement("beforeend", e[1] ?? ec()), Io++, () => {
      Io === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), Io--;
    };
  }, []);
}
function ec() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var lt = function() {
  return lt = Object.assign || function(t) {
    for (var n, r = 1, i = arguments.length; r < i; r++) {
      n = arguments[r];
      for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
    }
    return t;
  }, lt.apply(this, arguments);
};
function yd(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
  return n;
}
function Jg(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, i = t.length, o; r < i; r++)
    (o || !(r in t)) && (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
  return e.concat(o || Array.prototype.slice.call(t));
}
var ui = "right-scroll-bar-position", di = "width-before-scroll-bar", qg = "with-scroll-bars-hidden", Kg = "--removed-body-scroll-bar-size";
function Po(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Xg(e, t) {
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
var _g = typeof window < "u" ? v.useLayoutEffect : v.useEffect, tc = /* @__PURE__ */ new WeakMap();
function $g(e, t) {
  var n = Xg(null, function(r) {
    return e.forEach(function(i) {
      return Po(i, r);
    });
  });
  return _g(function() {
    var r = tc.get(n);
    if (r) {
      var i = new Set(r), o = new Set(e), s = n.current;
      i.forEach(function(a) {
        o.has(a) || Po(a, null);
      }), o.forEach(function(a) {
        i.has(a) || Po(a, s);
      });
    }
    tc.set(n, e);
  }, [e]), n;
}
function ex(e) {
  return e;
}
function tx(e, t) {
  t === void 0 && (t = ex);
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
        var d = s;
        s = [], d.forEach(o);
      }, c = function() {
        return Promise.resolve().then(l);
      };
      c(), n = {
        push: function(d) {
          s.push(d), c();
        },
        filter: function(d) {
          return s = s.filter(d), n;
        }
      };
    }
  };
  return i;
}
function nx(e) {
  e === void 0 && (e = {});
  var t = tx(null);
  return t.options = lt({ async: !0, ssr: !1 }, e), t;
}
var vd = function(e) {
  var t = e.sideCar, n = yd(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return v.createElement(r, lt({}, n));
};
vd.isSideCarExport = !0;
function rx(e, t) {
  return e.useMedium(t), vd;
}
var wd = nx(), Ro = function() {
}, qi = v.forwardRef(function(e, t) {
  var n = v.useRef(null), r = v.useState({
    onScrollCapture: Ro,
    onWheelCapture: Ro,
    onTouchMoveCapture: Ro
  }), i = r[0], o = r[1], s = e.forwardProps, a = e.children, l = e.className, c = e.removeScrollBar, d = e.enabled, u = e.shards, p = e.sideCar, h = e.noRelative, m = e.noIsolation, g = e.inert, x = e.allowPinchZoom, b = e.as, A = b === void 0 ? "div" : b, w = e.gapMode, S = yd(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), N = p, C = $g([n, t]), O = lt(lt({}, S), i);
  return v.createElement(
    v.Fragment,
    null,
    d && v.createElement(N, { sideCar: wd, removeScrollBar: c, shards: u, noRelative: h, noIsolation: m, inert: g, setCallbacks: o, allowPinchZoom: !!x, lockRef: n, gapMode: w }),
    s ? v.cloneElement(v.Children.only(a), lt(lt({}, O), { ref: C })) : v.createElement(A, lt({}, O, { className: l, ref: C }), a)
  );
});
qi.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
qi.classNames = {
  fullWidth: di,
  zeroRight: ui
};
var ix = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function ox() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = ix();
  return t && e.setAttribute("nonce", t), e;
}
function sx(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function ax(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var lx = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = ox()) && (sx(t, n), ax(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, cx = function() {
  var e = lx();
  return function(t, n) {
    v.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, Ad = function() {
  var e = cx(), t = function(n) {
    var r = n.styles, i = n.dynamic;
    return e(r, i), null;
  };
  return t;
}, ux = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Do = function(e) {
  return parseInt(e || "", 10) || 0;
}, dx = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], i = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Do(n), Do(r), Do(i)];
}, fx = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return ux;
  var t = dx(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, hx = Ad(), kn = "data-scroll-locked", px = function(e, t, n, r) {
  var i = e.left, o = e.top, s = e.right, a = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(qg, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(a, "px ").concat(r, `;
  }
  body[`).concat(kn, `] {
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
  
  .`).concat(ui, ` {
    right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(di, ` {
    margin-right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(ui, " .").concat(ui, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(di, " .").concat(di, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(kn, `] {
    `).concat(Kg, ": ").concat(a, `px;
  }
`);
}, nc = function() {
  var e = parseInt(document.body.getAttribute(kn) || "0", 10);
  return isFinite(e) ? e : 0;
}, mx = function() {
  v.useEffect(function() {
    return document.body.setAttribute(kn, (nc() + 1).toString()), function() {
      var e = nc() - 1;
      e <= 0 ? document.body.removeAttribute(kn) : document.body.setAttribute(kn, e.toString());
    };
  }, []);
}, gx = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, i = r === void 0 ? "margin" : r;
  mx();
  var o = v.useMemo(function() {
    return fx(i);
  }, [i]);
  return v.createElement(hx, { styles: px(o, !t, i, n ? "" : "!important") });
}, vs = !1;
if (typeof window < "u")
  try {
    var Jr = Object.defineProperty({}, "passive", {
      get: function() {
        return vs = !0, !0;
      }
    });
    window.addEventListener("test", Jr, Jr), window.removeEventListener("test", Jr, Jr);
  } catch {
    vs = !1;
  }
var gn = vs ? { passive: !1 } : !1, xx = function(e) {
  return e.tagName === "TEXTAREA";
}, kd = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !xx(e) && n[t] === "visible")
  );
}, bx = function(e) {
  return kd(e, "overflowY");
}, yx = function(e) {
  return kd(e, "overflowX");
}, rc = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var i = Ed(e, r);
    if (i) {
      var o = Cd(e, r), s = o[1], a = o[2];
      if (s > a)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, vx = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, wx = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, Ed = function(e, t) {
  return e === "v" ? bx(t) : yx(t);
}, Cd = function(e, t) {
  return e === "v" ? vx(t) : wx(t);
}, Ax = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, kx = function(e, t, n, r, i) {
  var o = Ax(e, window.getComputedStyle(t).direction), s = o * r, a = n.target, l = t.contains(a), c = !1, d = s > 0, u = 0, p = 0;
  do {
    if (!a)
      break;
    var h = Cd(e, a), m = h[0], g = h[1], x = h[2], b = g - x - o * m;
    (m || b) && Ed(e, a) && (u += b, p += m);
    var A = a.parentNode;
    a = A && A.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? A.host : A;
  } while (
    // portaled content
    !l && a !== document.body || // self content
    l && (t.contains(a) || t === a)
  );
  return (d && Math.abs(u) < 1 || !d && Math.abs(p) < 1) && (c = !0), c;
}, qr = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, ic = function(e) {
  return [e.deltaX, e.deltaY];
}, oc = function(e) {
  return e && "current" in e ? e.current : e;
}, Ex = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Cx = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Sx = 0, xn = [];
function Nx(e) {
  var t = v.useRef([]), n = v.useRef([0, 0]), r = v.useRef(), i = v.useState(Sx++)[0], o = v.useState(Ad)[0], s = v.useRef(e);
  v.useEffect(function() {
    s.current = e;
  }, [e]), v.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(i));
      var g = Jg([e.lockRef.current], (e.shards || []).map(oc), !0).filter(Boolean);
      return g.forEach(function(x) {
        return x.classList.add("allow-interactivity-".concat(i));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(i)), g.forEach(function(x) {
          return x.classList.remove("allow-interactivity-".concat(i));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var a = v.useCallback(function(g, x) {
    if ("touches" in g && g.touches.length === 2 || g.type === "wheel" && g.ctrlKey)
      return !s.current.allowPinchZoom;
    var b = qr(g), A = n.current, w = "deltaX" in g ? g.deltaX : A[0] - b[0], S = "deltaY" in g ? g.deltaY : A[1] - b[1], N, C = g.target, O = Math.abs(w) > Math.abs(S) ? "h" : "v";
    if ("touches" in g && O === "h" && C.type === "range")
      return !1;
    var D = window.getSelection(), z = D && D.anchorNode, E = z ? z === C || z.contains(C) : !1;
    if (E)
      return !1;
    var P = rc(O, C);
    if (!P)
      return !0;
    if (P ? N = O : (N = O === "v" ? "h" : "v", P = rc(O, C)), !P)
      return !1;
    if (!r.current && "changedTouches" in g && (w || S) && (r.current = N), !N)
      return !0;
    var T = r.current || N;
    return kx(T, x, g, T === "h" ? w : S);
  }, []), l = v.useCallback(function(g) {
    var x = g;
    if (!(!xn.length || xn[xn.length - 1] !== o)) {
      var b = "deltaY" in x ? ic(x) : qr(x), A = t.current.filter(function(N) {
        return N.name === x.type && (N.target === x.target || x.target === N.shadowParent) && Ex(N.delta, b);
      })[0];
      if (A && A.should) {
        x.cancelable && x.preventDefault();
        return;
      }
      if (!A) {
        var w = (s.current.shards || []).map(oc).filter(Boolean).filter(function(N) {
          return N.contains(x.target);
        }), S = w.length > 0 ? a(x, w[0]) : !s.current.noIsolation;
        S && x.cancelable && x.preventDefault();
      }
    }
  }, []), c = v.useCallback(function(g, x, b, A) {
    var w = { name: g, delta: x, target: b, should: A, shadowParent: jx(b) };
    t.current.push(w), setTimeout(function() {
      t.current = t.current.filter(function(S) {
        return S !== w;
      });
    }, 1);
  }, []), d = v.useCallback(function(g) {
    n.current = qr(g), r.current = void 0;
  }, []), u = v.useCallback(function(g) {
    c(g.type, ic(g), g.target, a(g, e.lockRef.current));
  }, []), p = v.useCallback(function(g) {
    c(g.type, qr(g), g.target, a(g, e.lockRef.current));
  }, []);
  v.useEffect(function() {
    return xn.push(o), e.setCallbacks({
      onScrollCapture: u,
      onWheelCapture: u,
      onTouchMoveCapture: p
    }), document.addEventListener("wheel", l, gn), document.addEventListener("touchmove", l, gn), document.addEventListener("touchstart", d, gn), function() {
      xn = xn.filter(function(g) {
        return g !== o;
      }), document.removeEventListener("wheel", l, gn), document.removeEventListener("touchmove", l, gn), document.removeEventListener("touchstart", d, gn);
    };
  }, []);
  var h = e.removeScrollBar, m = e.inert;
  return v.createElement(
    v.Fragment,
    null,
    m ? v.createElement(o, { styles: Cx(i) }) : null,
    h ? v.createElement(gx, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function jx(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const Mx = rx(wd, Nx);
var Ki = v.forwardRef(function(e, t) {
  return v.createElement(qi, lt({}, e, { ref: t, sideCar: Mx }));
});
Ki.classNames = qi.classNames;
var Ix = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, bn = /* @__PURE__ */ new WeakMap(), Kr = /* @__PURE__ */ new WeakMap(), Xr = {}, Oo = 0, Sd = function(e) {
  return e && (e.host || Sd(e.parentNode));
}, Px = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = Sd(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, Rx = function(e, t, n, r) {
  var i = Px(t, Array.isArray(e) ? e : [e]);
  Xr[n] || (Xr[n] = /* @__PURE__ */ new WeakMap());
  var o = Xr[n], s = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(u) {
    !u || a.has(u) || (a.add(u), c(u.parentNode));
  };
  i.forEach(c);
  var d = function(u) {
    !u || l.has(u) || Array.prototype.forEach.call(u.children, function(p) {
      if (a.has(p))
        d(p);
      else
        try {
          var h = p.getAttribute(r), m = h !== null && h !== "false", g = (bn.get(p) || 0) + 1, x = (o.get(p) || 0) + 1;
          bn.set(p, g), o.set(p, x), s.push(p), g === 1 && m && Kr.set(p, !0), x === 1 && p.setAttribute(n, "true"), m || p.setAttribute(r, "true");
        } catch (b) {
          console.error("aria-hidden: cannot operate on ", p, b);
        }
    });
  };
  return d(t), a.clear(), Oo++, function() {
    s.forEach(function(u) {
      var p = bn.get(u) - 1, h = o.get(u) - 1;
      bn.set(u, p), o.set(u, h), p || (Kr.has(u) || u.removeAttribute(r), Kr.delete(u)), h || u.removeAttribute(n);
    }), Oo--, Oo || (bn = /* @__PURE__ */ new WeakMap(), bn = /* @__PURE__ */ new WeakMap(), Kr = /* @__PURE__ */ new WeakMap(), Xr = {});
  };
}, ca = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), i = Ix(e);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), Rx(r, i, n, "aria-hidden")) : function() {
    return null;
  };
}, Xi = "Dialog", [Nd] = un(Xi), [Dx, it] = Nd(Xi), jd = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: i,
    onOpenChange: o,
    modal: s = !0
  } = e, a = v.useRef(null), l = v.useRef(null), [c, d] = Sr({
    prop: r,
    defaultProp: i ?? !1,
    onChange: o,
    caller: Xi
  });
  return /* @__PURE__ */ f.jsx(
    Dx,
    {
      scope: t,
      triggerRef: a,
      contentRef: l,
      contentId: Et(),
      titleId: Et(),
      descriptionId: Et(),
      open: c,
      onOpenChange: d,
      onOpenToggle: v.useCallback(() => d((u) => !u), [d]),
      modal: s,
      children: n
    }
  );
};
jd.displayName = Xi;
var Md = "DialogTrigger", Id = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = it(Md, n), o = je(t, i.triggerRef);
    return /* @__PURE__ */ f.jsx(
      Ae.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": i.open,
        "aria-controls": i.contentId,
        "data-state": fa(i.open),
        ...r,
        ref: o,
        onClick: ie(e.onClick, i.onOpenToggle)
      }
    );
  }
);
Id.displayName = Md;
var ua = "DialogPortal", [Ox, Pd] = Nd(ua, {
  forceMount: void 0
}), Rd = (e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: i } = e, o = it(ua, t);
  return /* @__PURE__ */ f.jsx(Ox, { scope: t, forceMount: n, children: v.Children.map(r, (s) => /* @__PURE__ */ f.jsx(mt, { present: n || o.open, children: /* @__PURE__ */ f.jsx(Ji, { asChild: !0, container: i, children: s }) })) });
};
Rd.displayName = ua;
var vi = "DialogOverlay", Dd = v.forwardRef(
  (e, t) => {
    const n = Pd(vi, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, o = it(vi, e.__scopeDialog);
    return o.modal ? /* @__PURE__ */ f.jsx(mt, { present: r || o.open, children: /* @__PURE__ */ f.jsx(zx, { ...i, ref: t }) }) : null;
  }
);
Dd.displayName = vi;
var Tx = /* @__PURE__ */ rn("DialogOverlay.RemoveScroll"), zx = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = it(vi, n);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ f.jsx(Ki, { as: Tx, allowPinchZoom: !0, shards: [i.contentRef], children: /* @__PURE__ */ f.jsx(
        Ae.div,
        {
          "data-state": fa(i.open),
          ...r,
          ref: t,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), on = "DialogContent", Od = v.forwardRef(
  (e, t) => {
    const n = Pd(on, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, o = it(on, e.__scopeDialog);
    return /* @__PURE__ */ f.jsx(mt, { present: r || o.open, children: o.modal ? /* @__PURE__ */ f.jsx(Bx, { ...i, ref: t }) : /* @__PURE__ */ f.jsx(Lx, { ...i, ref: t }) });
  }
);
Od.displayName = on;
var Bx = v.forwardRef(
  (e, t) => {
    const n = it(on, e.__scopeDialog), r = v.useRef(null), i = je(t, n.contentRef, r);
    return v.useEffect(() => {
      const o = r.current;
      if (o) return ca(o);
    }, []), /* @__PURE__ */ f.jsx(
      Td,
      {
        ...e,
        ref: i,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ie(e.onCloseAutoFocus, (o) => {
          o.preventDefault(), n.triggerRef.current?.focus();
        }),
        onPointerDownOutside: ie(e.onPointerDownOutside, (o) => {
          const s = o.detail.originalEvent, a = s.button === 0 && s.ctrlKey === !0;
          (s.button === 2 || a) && o.preventDefault();
        }),
        onFocusOutside: ie(
          e.onFocusOutside,
          (o) => o.preventDefault()
        )
      }
    );
  }
), Lx = v.forwardRef(
  (e, t) => {
    const n = it(on, e.__scopeDialog), r = v.useRef(!1), i = v.useRef(!1);
    return /* @__PURE__ */ f.jsx(
      Td,
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
), Td = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: i, onCloseAutoFocus: o, ...s } = e, a = it(on, n), l = v.useRef(null), c = je(t, l);
    return la(), /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx(
        Wi,
        {
          asChild: !0,
          loop: !0,
          trapped: r,
          onMountAutoFocus: i,
          onUnmountAutoFocus: o,
          children: /* @__PURE__ */ f.jsx(
            Vi,
            {
              role: "dialog",
              id: a.contentId,
              "aria-describedby": a.descriptionId,
              "aria-labelledby": a.titleId,
              "data-state": fa(a.open),
              ...s,
              ref: c,
              onDismiss: () => a.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
        /* @__PURE__ */ f.jsx(Fx, { titleId: a.titleId }),
        /* @__PURE__ */ f.jsx(Yx, { contentRef: l, descriptionId: a.descriptionId })
      ] })
    ] });
  }
), da = "DialogTitle", zd = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = it(da, n);
    return /* @__PURE__ */ f.jsx(Ae.h2, { id: i.titleId, ...r, ref: t });
  }
);
zd.displayName = da;
var Bd = "DialogDescription", Ld = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = it(Bd, n);
    return /* @__PURE__ */ f.jsx(Ae.p, { id: i.descriptionId, ...r, ref: t });
  }
);
Ld.displayName = Bd;
var Fd = "DialogClose", Gd = v.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, i = it(Fd, n);
    return /* @__PURE__ */ f.jsx(
      Ae.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: ie(e.onClick, () => i.onOpenChange(!1))
      }
    );
  }
);
Gd.displayName = Fd;
function fa(e) {
  return e ? "open" : "closed";
}
var Yd = "DialogTitleWarning", [cP, Hd] = wg(Yd, {
  contentName: on,
  titleName: da,
  docsSlug: "dialog"
}), Fx = ({ titleId: e }) => {
  const t = Hd(Yd), n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return v.useEffect(() => {
    e && (document.getElementById(e) || console.error(n));
  }, [n, e]), null;
}, Gx = "DialogDescriptionWarning", Yx = ({ contentRef: e, descriptionId: t }) => {
  const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Hd(Gx).contentName}}.`;
  return v.useEffect(() => {
    const i = e.current?.getAttribute("aria-describedby");
    t && i && (document.getElementById(t) || console.warn(r));
  }, [r, e, t]), null;
}, ha = jd, Ud = Id, pa = Rd, ma = Dd, ga = Od, xa = zd, Qd = Ld, Nr = Gd, _r = { exports: {} }, To = {};
var sc;
function Hx() {
  if (sc) return To;
  sc = 1;
  var e = st;
  function t(u, p) {
    return u === p && (u !== 0 || 1 / u === 1 / p) || u !== u && p !== p;
  }
  var n = typeof Object.is == "function" ? Object.is : t, r = e.useState, i = e.useEffect, o = e.useLayoutEffect, s = e.useDebugValue;
  function a(u, p) {
    var h = p(), m = r({ inst: { value: h, getSnapshot: p } }), g = m[0].inst, x = m[1];
    return o(
      function() {
        g.value = h, g.getSnapshot = p, l(g) && x({ inst: g });
      },
      [u, h, p]
    ), i(
      function() {
        return l(g) && x({ inst: g }), u(function() {
          l(g) && x({ inst: g });
        });
      },
      [u]
    ), s(h), h;
  }
  function l(u) {
    var p = u.getSnapshot;
    u = u.value;
    try {
      var h = p();
      return !n(u, h);
    } catch {
      return !0;
    }
  }
  function c(u, p) {
    return p();
  }
  var d = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : a;
  return To.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : d, To;
}
var zo = {};
var ac;
function Ux() {
  return ac || (ac = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(h, m) {
      return h === m && (h !== 0 || 1 / h === 1 / m) || h !== h && m !== m;
    }
    function t(h, m) {
      d || i.startTransition === void 0 || (d = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var g = m();
      if (!u) {
        var x = m();
        o(g, x) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), u = !0);
      }
      x = s({
        inst: { value: g, getSnapshot: m }
      });
      var b = x[0].inst, A = x[1];
      return l(
        function() {
          b.value = g, b.getSnapshot = m, n(b) && A({ inst: b });
        },
        [h, g, m]
      ), a(
        function() {
          return n(b) && A({ inst: b }), h(function() {
            n(b) && A({ inst: b });
          });
        },
        [h]
      ), c(g), g;
    }
    function n(h) {
      var m = h.getSnapshot;
      h = h.value;
      try {
        var g = m();
        return !o(h, g);
      } catch {
        return !0;
      }
    }
    function r(h, m) {
      return m();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var i = st, o = typeof Object.is == "function" ? Object.is : e, s = i.useState, a = i.useEffect, l = i.useLayoutEffect, c = i.useDebugValue, d = !1, u = !1, p = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? r : t;
    zo.useSyncExternalStore = i.useSyncExternalStore !== void 0 ? i.useSyncExternalStore : p, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), zo;
}
var lc;
function Qx() {
  return lc || (lc = 1, process.env.NODE_ENV === "production" ? _r.exports = Hx() : _r.exports = Ux()), _r.exports;
}
var Zx = Qx();
function Vx(e) {
  const [t, n] = v.useState(void 0);
  return Gt(() => {
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
const Wx = ["top", "right", "bottom", "left"], Yt = Math.min, Ge = Math.max, wi = Math.round, $r = Math.floor, dt = (e) => ({
  x: e,
  y: e
}), Jx = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function ws(e, t, n) {
  return Ge(e, Yt(t, n));
}
function Ct(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function St(e) {
  return e.split("-")[0];
}
function Dn(e) {
  return e.split("-")[1];
}
function ba(e) {
  return e === "x" ? "y" : "x";
}
function ya(e) {
  return e === "y" ? "height" : "width";
}
function ct(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function va(e) {
  return ba(ct(e));
}
function qx(e, t, n) {
  n === void 0 && (n = !1);
  const r = Dn(e), i = va(e), o = ya(i);
  let s = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[o] > t.floating[o] && (s = Ai(s)), [s, Ai(s)];
}
function Kx(e) {
  const t = Ai(e);
  return [As(e), t, As(t)];
}
function As(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const cc = ["left", "right"], uc = ["right", "left"], Xx = ["top", "bottom"], _x = ["bottom", "top"];
function $x(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? uc : cc : t ? cc : uc;
    case "left":
    case "right":
      return t ? Xx : _x;
    default:
      return [];
  }
}
function eb(e, t, n, r) {
  const i = Dn(e);
  let o = $x(St(e), n === "start", r);
  return i && (o = o.map((s) => s + "-" + i), t && (o = o.concat(o.map(As)))), o;
}
function Ai(e) {
  const t = St(e);
  return Jx[t] + e.slice(t.length);
}
function tb(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Zd(e) {
  return typeof e != "number" ? tb(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function ki(e) {
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
function dc(e, t, n) {
  let {
    reference: r,
    floating: i
  } = e;
  const o = ct(t), s = va(t), a = ya(s), l = St(t), c = o === "y", d = r.x + r.width / 2 - i.width / 2, u = r.y + r.height / 2 - i.height / 2, p = r[a] / 2 - i[a] / 2;
  let h;
  switch (l) {
    case "top":
      h = {
        x: d,
        y: r.y - i.height
      };
      break;
    case "bottom":
      h = {
        x: d,
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
  switch (Dn(t)) {
    case "start":
      h[s] -= p * (n && c ? -1 : 1);
      break;
    case "end":
      h[s] += p * (n && c ? -1 : 1);
      break;
  }
  return h;
}
async function nb(e, t) {
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
    rootBoundary: d = "viewport",
    elementContext: u = "floating",
    altBoundary: p = !1,
    padding: h = 0
  } = Ct(t, e), m = Zd(h), x = a[p ? u === "floating" ? "reference" : "floating" : u], b = ki(await o.getClippingRect({
    element: (n = await (o.isElement == null ? void 0 : o.isElement(x))) == null || n ? x : x.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: d,
    strategy: l
  })), A = u === "floating" ? {
    x: r,
    y: i,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, w = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), S = await (o.isElement == null ? void 0 : o.isElement(w)) ? await (o.getScale == null ? void 0 : o.getScale(w)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, N = ki(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: A,
    offsetParent: w,
    strategy: l
  }) : A);
  return {
    top: (b.top - N.top + m.top) / S.y,
    bottom: (N.bottom - b.bottom + m.bottom) / S.y,
    left: (b.left - N.left + m.left) / S.x,
    right: (N.right - b.right + m.right) / S.x
  };
}
const rb = 50, ib = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: o = [],
    platform: s
  } = n, a = s.detectOverflow ? s : {
    ...s,
    detectOverflow: nb
  }, l = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let c = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: i
  }), {
    x: d,
    y: u
  } = dc(c, r, l), p = r, h = 0;
  const m = {};
  for (let g = 0; g < o.length; g++) {
    const x = o[g];
    if (!x)
      continue;
    const {
      name: b,
      fn: A
    } = x, {
      x: w,
      y: S,
      data: N,
      reset: C
    } = await A({
      x: d,
      y: u,
      initialPlacement: r,
      placement: p,
      strategy: i,
      middlewareData: m,
      rects: c,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    d = w ?? d, u = S ?? u, m[b] = {
      ...m[b],
      ...N
    }, C && h < rb && (h++, typeof C == "object" && (C.placement && (p = C.placement), C.rects && (c = C.rects === !0 ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: i
    }) : C.rects), {
      x: d,
      y: u
    } = dc(c, p, l)), g = -1);
  }
  return {
    x: d,
    y: u,
    placement: p,
    strategy: i,
    middlewareData: m
  };
}, ob = (e) => ({
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
      padding: d = 0
    } = Ct(e, t) || {};
    if (c == null)
      return {};
    const u = Zd(d), p = {
      x: n,
      y: r
    }, h = va(i), m = ya(h), g = await s.getDimensions(c), x = h === "y", b = x ? "top" : "left", A = x ? "bottom" : "right", w = x ? "clientHeight" : "clientWidth", S = o.reference[m] + o.reference[h] - p[h] - o.floating[m], N = p[h] - o.reference[h], C = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(c));
    let O = C ? C[w] : 0;
    (!O || !await (s.isElement == null ? void 0 : s.isElement(C))) && (O = a.floating[w] || o.floating[m]);
    const D = S / 2 - N / 2, z = O / 2 - g[m] / 2 - 1, E = Yt(u[b], z), P = Yt(u[A], z), T = E, Y = O - g[m] - P, R = O / 2 - g[m] / 2 + D, j = ws(T, R, Y), I = !l.arrow && Dn(i) != null && R !== j && o.reference[m] / 2 - (R < T ? E : P) - g[m] / 2 < 0, F = I ? R < T ? R - T : R - Y : 0;
    return {
      [h]: p[h] + F,
      data: {
        [h]: j,
        centerOffset: R - j - F,
        ...I && {
          alignmentOffset: F
        }
      },
      reset: I
    };
  }
}), sb = function(e) {
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
        mainAxis: d = !0,
        crossAxis: u = !0,
        fallbackPlacements: p,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: m = "none",
        flipAlignment: g = !0,
        ...x
      } = Ct(e, t);
      if ((n = o.arrow) != null && n.alignmentOffset)
        return {};
      const b = St(i), A = ct(a), w = St(a) === a, S = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), N = p || (w || !g ? [Ai(a)] : Kx(a)), C = m !== "none";
      !p && C && N.push(...eb(a, g, m, S));
      const O = [a, ...N], D = await l.detectOverflow(t, x), z = [];
      let E = ((r = o.flip) == null ? void 0 : r.overflows) || [];
      if (d && z.push(D[b]), u) {
        const R = qx(i, s, S);
        z.push(D[R[0]], D[R[1]]);
      }
      if (E = [...E, {
        placement: i,
        overflows: z
      }], !z.every((R) => R <= 0)) {
        var P, T;
        const R = (((P = o.flip) == null ? void 0 : P.index) || 0) + 1, j = O[R];
        if (j && (!(u === "alignment" ? A !== ct(j) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        E.every((B) => ct(B.placement) === A ? B.overflows[0] > 0 : !0)))
          return {
            data: {
              index: R,
              overflows: E
            },
            reset: {
              placement: j
            }
          };
        let I = (T = E.filter((F) => F.overflows[0] <= 0).sort((F, B) => F.overflows[1] - B.overflows[1])[0]) == null ? void 0 : T.placement;
        if (!I)
          switch (h) {
            case "bestFit": {
              var Y;
              const F = (Y = E.filter((B) => {
                if (C) {
                  const L = ct(B.placement);
                  return L === A || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  L === "y";
                }
                return !0;
              }).map((B) => [B.placement, B.overflows.filter((L) => L > 0).reduce((L, y) => L + y, 0)]).sort((B, L) => B[1] - L[1])[0]) == null ? void 0 : Y[0];
              F && (I = F);
              break;
            }
            case "initialPlacement":
              I = a;
              break;
          }
        if (i !== I)
          return {
            reset: {
              placement: I
            }
          };
      }
      return {};
    }
  };
};
function fc(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function hc(e) {
  return Wx.some((t) => e[t] >= 0);
}
const ab = function(e) {
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
      } = Ct(e, t);
      switch (i) {
        case "referenceHidden": {
          const s = await r.detectOverflow(t, {
            ...o,
            elementContext: "reference"
          }), a = fc(s, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: hc(a)
            }
          };
        }
        case "escaped": {
          const s = await r.detectOverflow(t, {
            ...o,
            altBoundary: !0
          }), a = fc(s, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: hc(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Vd = /* @__PURE__ */ new Set(["left", "top"]);
async function lb(e, t) {
  const {
    placement: n,
    platform: r,
    elements: i
  } = e, o = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), s = St(n), a = Dn(n), l = ct(n) === "y", c = Vd.has(s) ? -1 : 1, d = o && l ? -1 : 1, u = Ct(t, e);
  let {
    mainAxis: p,
    crossAxis: h,
    alignmentAxis: m
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return a && typeof m == "number" && (h = a === "end" ? m * -1 : m), l ? {
    x: h * d,
    y: p * c
  } : {
    x: p * c,
    y: h * d
  };
}
const cb = function(e) {
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
      } = t, l = await lb(t, e);
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
}, ub = function(e) {
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
        ...c
      } = Ct(e, t), d = {
        x: n,
        y: r
      }, u = await o.detectOverflow(t, c), p = ct(St(i)), h = ba(p);
      let m = d[h], g = d[p];
      if (s) {
        const b = h === "y" ? "top" : "left", A = h === "y" ? "bottom" : "right", w = m + u[b], S = m - u[A];
        m = ws(w, m, S);
      }
      if (a) {
        const b = p === "y" ? "top" : "left", A = p === "y" ? "bottom" : "right", w = g + u[b], S = g - u[A];
        g = ws(w, g, S);
      }
      const x = l.fn({
        ...t,
        [h]: m,
        [p]: g
      });
      return {
        ...x,
        data: {
          x: x.x - n,
          y: x.y - r,
          enabled: {
            [h]: s,
            [p]: a
          }
        }
      };
    }
  };
}, db = function(e) {
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
      } = Ct(e, t), d = {
        x: n,
        y: r
      }, u = ct(i), p = ba(u);
      let h = d[p], m = d[u];
      const g = Ct(a, t), x = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (l) {
        const w = p === "y" ? "height" : "width", S = o.reference[p] - o.floating[w] + x.mainAxis, N = o.reference[p] + o.reference[w] - x.mainAxis;
        h < S ? h = S : h > N && (h = N);
      }
      if (c) {
        var b, A;
        const w = p === "y" ? "width" : "height", S = Vd.has(St(i)), N = o.reference[u] - o.floating[w] + (S && ((b = s.offset) == null ? void 0 : b[u]) || 0) + (S ? 0 : x.crossAxis), C = o.reference[u] + o.reference[w] + (S ? 0 : ((A = s.offset) == null ? void 0 : A[u]) || 0) - (S ? x.crossAxis : 0);
        m < N ? m = N : m > C && (m = C);
      }
      return {
        [p]: h,
        [u]: m
      };
    }
  };
}, fb = function(e) {
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
      } = Ct(e, t), d = await s.detectOverflow(t, c), u = St(i), p = Dn(i), h = ct(i) === "y", {
        width: m,
        height: g
      } = o.floating;
      let x, b;
      u === "top" || u === "bottom" ? (x = u, b = p === (await (s.isRTL == null ? void 0 : s.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (b = u, x = p === "end" ? "top" : "bottom");
      const A = g - d.top - d.bottom, w = m - d.left - d.right, S = Yt(g - d[x], A), N = Yt(m - d[b], w), C = !t.middlewareData.shift;
      let O = S, D = N;
      if ((n = t.middlewareData.shift) != null && n.enabled.x && (D = w), (r = t.middlewareData.shift) != null && r.enabled.y && (O = A), C && !p) {
        const E = Ge(d.left, 0), P = Ge(d.right, 0), T = Ge(d.top, 0), Y = Ge(d.bottom, 0);
        h ? D = m - 2 * (E !== 0 || P !== 0 ? E + P : Ge(d.left, d.right)) : O = g - 2 * (T !== 0 || Y !== 0 ? T + Y : Ge(d.top, d.bottom));
      }
      await l({
        ...t,
        availableWidth: D,
        availableHeight: O
      });
      const z = await s.getDimensions(a.floating);
      return m !== z.width || g !== z.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function _i() {
  return typeof window < "u";
}
function On(e) {
  return Wd(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Ue(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function gt(e) {
  var t;
  return (t = (Wd(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Wd(e) {
  return _i() ? e instanceof Node || e instanceof Ue(e).Node : !1;
}
function tt(e) {
  return _i() ? e instanceof Element || e instanceof Ue(e).Element : !1;
}
function jt(e) {
  return _i() ? e instanceof HTMLElement || e instanceof Ue(e).HTMLElement : !1;
}
function pc(e) {
  return !_i() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Ue(e).ShadowRoot;
}
function jr(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: i
  } = nt(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function hb(e) {
  return /^(table|td|th)$/.test(On(e));
}
function $i(e) {
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
const pb = /transform|translate|scale|rotate|perspective|filter/, mb = /paint|layout|strict|content/, Kt = (e) => !!e && e !== "none";
let Bo;
function wa(e) {
  const t = tt(e) ? nt(e) : e;
  return Kt(t.transform) || Kt(t.translate) || Kt(t.scale) || Kt(t.rotate) || Kt(t.perspective) || !Aa() && (Kt(t.backdropFilter) || Kt(t.filter)) || pb.test(t.willChange || "") || mb.test(t.contain || "");
}
function gb(e) {
  let t = Ht(e);
  for (; jt(t) && !Mn(t); ) {
    if (wa(t))
      return t;
    if ($i(t))
      return null;
    t = Ht(t);
  }
  return null;
}
function Aa() {
  return Bo == null && (Bo = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Bo;
}
function Mn(e) {
  return /^(html|body|#document)$/.test(On(e));
}
function nt(e) {
  return Ue(e).getComputedStyle(e);
}
function eo(e) {
  return tt(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function Ht(e) {
  if (On(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    pc(e) && e.host || // Fallback.
    gt(e)
  );
  return pc(t) ? t.host : t;
}
function Jd(e) {
  const t = Ht(e);
  return Mn(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : jt(t) && jr(t) ? t : Jd(t);
}
function ur(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const i = Jd(e), o = i === ((r = e.ownerDocument) == null ? void 0 : r.body), s = Ue(i);
  if (o) {
    const a = ks(s);
    return t.concat(s, s.visualViewport || [], jr(i) ? i : [], a && n ? ur(a) : []);
  } else
    return t.concat(i, ur(i, [], n));
}
function ks(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function qd(e) {
  const t = nt(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const i = jt(e), o = i ? e.offsetWidth : n, s = i ? e.offsetHeight : r, a = wi(n) !== o || wi(r) !== s;
  return a && (n = o, r = s), {
    width: n,
    height: r,
    $: a
  };
}
function ka(e) {
  return tt(e) ? e : e.contextElement;
}
function En(e) {
  const t = ka(e);
  if (!jt(t))
    return dt(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: i,
    $: o
  } = qd(t);
  let s = (o ? wi(n.width) : n.width) / r, a = (o ? wi(n.height) : n.height) / i;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const xb = /* @__PURE__ */ dt(0);
function Kd(e) {
  const t = Ue(e);
  return !Aa() || !t.visualViewport ? xb : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function bb(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== Ue(e) ? !1 : t;
}
function sn(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), o = ka(e);
  let s = dt(1);
  t && (r ? tt(r) && (s = En(r)) : s = En(e));
  const a = bb(o, n, r) ? Kd(o) : dt(0);
  let l = (i.left + a.x) / s.x, c = (i.top + a.y) / s.y, d = i.width / s.x, u = i.height / s.y;
  if (o) {
    const p = Ue(o), h = r && tt(r) ? Ue(r) : r;
    let m = p, g = ks(m);
    for (; g && r && h !== m; ) {
      const x = En(g), b = g.getBoundingClientRect(), A = nt(g), w = b.left + (g.clientLeft + parseFloat(A.paddingLeft)) * x.x, S = b.top + (g.clientTop + parseFloat(A.paddingTop)) * x.y;
      l *= x.x, c *= x.y, d *= x.x, u *= x.y, l += w, c += S, m = Ue(g), g = ks(m);
    }
  }
  return ki({
    width: d,
    height: u,
    x: l,
    y: c
  });
}
function to(e, t) {
  const n = eo(e).scrollLeft;
  return t ? t.left + n : sn(gt(e)).left + n;
}
function Xd(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - to(e, n), i = n.top + t.scrollTop;
  return {
    x: r,
    y: i
  };
}
function yb(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: i
  } = e;
  const o = i === "fixed", s = gt(r), a = t ? $i(t.floating) : !1;
  if (r === s || a && o)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = dt(1);
  const d = dt(0), u = jt(r);
  if ((u || !u && !o) && ((On(r) !== "body" || jr(s)) && (l = eo(r)), u)) {
    const h = sn(r);
    c = En(r), d.x = h.x + r.clientLeft, d.y = h.y + r.clientTop;
  }
  const p = s && !u && !o ? Xd(s, l) : dt(0);
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + d.x + p.x,
    y: n.y * c.y - l.scrollTop * c.y + d.y + p.y
  };
}
function vb(e) {
  return Array.from(e.getClientRects());
}
function wb(e) {
  const t = gt(e), n = eo(e), r = e.ownerDocument.body, i = Ge(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), o = Ge(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let s = -n.scrollLeft + to(e);
  const a = -n.scrollTop;
  return nt(r).direction === "rtl" && (s += Ge(t.clientWidth, r.clientWidth) - i), {
    width: i,
    height: o,
    x: s,
    y: a
  };
}
const mc = 25;
function Ab(e, t) {
  const n = Ue(e), r = gt(e), i = n.visualViewport;
  let o = r.clientWidth, s = r.clientHeight, a = 0, l = 0;
  if (i) {
    o = i.width, s = i.height;
    const d = Aa();
    (!d || d && t === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = to(r);
  if (c <= 0) {
    const d = r.ownerDocument, u = d.body, p = getComputedStyle(u), h = d.compatMode === "CSS1Compat" && parseFloat(p.marginLeft) + parseFloat(p.marginRight) || 0, m = Math.abs(r.clientWidth - u.clientWidth - h);
    m <= mc && (o -= m);
  } else c <= mc && (o += c);
  return {
    width: o,
    height: s,
    x: a,
    y: l
  };
}
function kb(e, t) {
  const n = sn(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, o = jt(e) ? En(e) : dt(1), s = e.clientWidth * o.x, a = e.clientHeight * o.y, l = i * o.x, c = r * o.y;
  return {
    width: s,
    height: a,
    x: l,
    y: c
  };
}
function gc(e, t, n) {
  let r;
  if (t === "viewport")
    r = Ab(e, n);
  else if (t === "document")
    r = wb(gt(e));
  else if (tt(t))
    r = kb(t, n);
  else {
    const i = Kd(e);
    r = {
      x: t.x - i.x,
      y: t.y - i.y,
      width: t.width,
      height: t.height
    };
  }
  return ki(r);
}
function _d(e, t) {
  const n = Ht(e);
  return n === t || !tt(n) || Mn(n) ? !1 : nt(n).position === "fixed" || _d(n, t);
}
function Eb(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = ur(e, [], !1).filter((a) => tt(a) && On(a) !== "body"), i = null;
  const o = nt(e).position === "fixed";
  let s = o ? Ht(e) : e;
  for (; tt(s) && !Mn(s); ) {
    const a = nt(s), l = wa(s);
    !l && a.position === "fixed" && (i = null), (o ? !l && !i : !l && a.position === "static" && !!i && (i.position === "absolute" || i.position === "fixed") || jr(s) && !l && _d(e, s)) ? r = r.filter((d) => d !== s) : i = a, s = Ht(s);
  }
  return t.set(e, r), r;
}
function Cb(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: i
  } = e;
  const s = [...n === "clippingAncestors" ? $i(t) ? [] : Eb(t, this._c) : [].concat(n), r], a = gc(t, s[0], i);
  let l = a.top, c = a.right, d = a.bottom, u = a.left;
  for (let p = 1; p < s.length; p++) {
    const h = gc(t, s[p], i);
    l = Ge(h.top, l), c = Yt(h.right, c), d = Yt(h.bottom, d), u = Ge(h.left, u);
  }
  return {
    width: c - u,
    height: d - l,
    x: u,
    y: l
  };
}
function Sb(e) {
  const {
    width: t,
    height: n
  } = qd(e);
  return {
    width: t,
    height: n
  };
}
function Nb(e, t, n) {
  const r = jt(t), i = gt(t), o = n === "fixed", s = sn(e, !0, o, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = dt(0);
  function c() {
    l.x = to(i);
  }
  if (r || !r && !o)
    if ((On(t) !== "body" || jr(i)) && (a = eo(t)), r) {
      const h = sn(t, !0, o, t);
      l.x = h.x + t.clientLeft, l.y = h.y + t.clientTop;
    } else i && c();
  o && !r && i && c();
  const d = i && !r && !o ? Xd(i, a) : dt(0), u = s.left + a.scrollLeft - l.x - d.x, p = s.top + a.scrollTop - l.y - d.y;
  return {
    x: u,
    y: p,
    width: s.width,
    height: s.height
  };
}
function Lo(e) {
  return nt(e).position === "static";
}
function xc(e, t) {
  if (!jt(e) || nt(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return gt(e) === n && (n = n.ownerDocument.body), n;
}
function $d(e, t) {
  const n = Ue(e);
  if ($i(e))
    return n;
  if (!jt(e)) {
    let i = Ht(e);
    for (; i && !Mn(i); ) {
      if (tt(i) && !Lo(i))
        return i;
      i = Ht(i);
    }
    return n;
  }
  let r = xc(e, t);
  for (; r && hb(r) && Lo(r); )
    r = xc(r, t);
  return r && Mn(r) && Lo(r) && !wa(r) ? n : r || gb(e) || n;
}
const jb = async function(e) {
  const t = this.getOffsetParent || $d, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: Nb(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Mb(e) {
  return nt(e).direction === "rtl";
}
const Ib = {
  convertOffsetParentRelativeRectToViewportRelativeRect: yb,
  getDocumentElement: gt,
  getClippingRect: Cb,
  getOffsetParent: $d,
  getElementRects: jb,
  getClientRects: vb,
  getDimensions: Sb,
  getScale: En,
  isElement: tt,
  isRTL: Mb
};
function ef(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Pb(e, t) {
  let n = null, r;
  const i = gt(e);
  function o() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), o();
    const c = e.getBoundingClientRect(), {
      left: d,
      top: u,
      width: p,
      height: h
    } = c;
    if (a || t(), !p || !h)
      return;
    const m = $r(u), g = $r(i.clientWidth - (d + p)), x = $r(i.clientHeight - (u + h)), b = $r(d), w = {
      rootMargin: -m + "px " + -g + "px " + -x + "px " + -b + "px",
      threshold: Ge(0, Yt(1, l)) || 1
    };
    let S = !0;
    function N(C) {
      const O = C[0].intersectionRatio;
      if (O !== l) {
        if (!S)
          return s();
        O ? s(!1, O) : r = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      O === 1 && !ef(c, e.getBoundingClientRect()) && s(), S = !1;
    }
    try {
      n = new IntersectionObserver(N, {
        ...w,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(N, w);
    }
    n.observe(e);
  }
  return s(!0), o;
}
function Rb(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: o = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = ka(e), d = i || o ? [...c ? ur(c) : [], ...t ? ur(t) : []] : [];
  d.forEach((b) => {
    i && b.addEventListener("scroll", n, {
      passive: !0
    }), o && b.addEventListener("resize", n);
  });
  const u = c && a ? Pb(c, n) : null;
  let p = -1, h = null;
  s && (h = new ResizeObserver((b) => {
    let [A] = b;
    A && A.target === c && h && t && (h.unobserve(t), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var w;
      (w = h) == null || w.observe(t);
    })), n();
  }), c && !l && h.observe(c), t && h.observe(t));
  let m, g = l ? sn(e) : null;
  l && x();
  function x() {
    const b = sn(e);
    g && !ef(g, b) && n(), g = b, m = requestAnimationFrame(x);
  }
  return n(), () => {
    var b;
    d.forEach((A) => {
      i && A.removeEventListener("scroll", n), o && A.removeEventListener("resize", n);
    }), u?.(), (b = h) == null || b.disconnect(), h = null, l && cancelAnimationFrame(m);
  };
}
const Db = cb, Ob = ub, Tb = sb, zb = fb, Bb = ab, bc = ob, Lb = db, Fb = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: Ib,
    ...n
  }, o = {
    ...i.platform,
    _c: r
  };
  return ib(e, t, {
    ...i,
    platform: o
  });
};
var Gb = typeof document < "u", Yb = function() {
}, fi = Gb ? cr : Yb;
function Ei(e, t) {
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
        if (!Ei(e[r], t[r]))
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
      if (!(o === "_owner" && e.$$typeof) && !Ei(e[o], t[o]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function tf(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function yc(e, t) {
  const n = tf(e);
  return Math.round(t * n) / n;
}
function Fo(e) {
  const t = v.useRef(e);
  return fi(() => {
    t.current = e;
  }), t;
}
function Hb(e) {
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
  } = e, [d, u] = v.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [p, h] = v.useState(r);
  Ei(p, r) || h(r);
  const [m, g] = v.useState(null), [x, b] = v.useState(null), A = v.useCallback((B) => {
    B !== C.current && (C.current = B, g(B));
  }, []), w = v.useCallback((B) => {
    B !== O.current && (O.current = B, b(B));
  }, []), S = o || m, N = s || x, C = v.useRef(null), O = v.useRef(null), D = v.useRef(d), z = l != null, E = Fo(l), P = Fo(i), T = Fo(c), Y = v.useCallback(() => {
    if (!C.current || !O.current)
      return;
    const B = {
      placement: t,
      strategy: n,
      middleware: p
    };
    P.current && (B.platform = P.current), Fb(C.current, O.current, B).then((L) => {
      const y = {
        ...L,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: T.current !== !1
      };
      R.current && !Ei(D.current, y) && (D.current = y, ad.flushSync(() => {
        u(y);
      }));
    });
  }, [p, t, n, P, T]);
  fi(() => {
    c === !1 && D.current.isPositioned && (D.current.isPositioned = !1, u((B) => ({
      ...B,
      isPositioned: !1
    })));
  }, [c]);
  const R = v.useRef(!1);
  fi(() => (R.current = !0, () => {
    R.current = !1;
  }), []), fi(() => {
    if (S && (C.current = S), N && (O.current = N), S && N) {
      if (E.current)
        return E.current(S, N, Y);
      Y();
    }
  }, [S, N, Y, E, z]);
  const j = v.useMemo(() => ({
    reference: C,
    floating: O,
    setReference: A,
    setFloating: w
  }), [A, w]), I = v.useMemo(() => ({
    reference: S,
    floating: N
  }), [S, N]), F = v.useMemo(() => {
    const B = {
      position: n,
      left: 0,
      top: 0
    };
    if (!I.floating)
      return B;
    const L = yc(I.floating, d.x), y = yc(I.floating, d.y);
    return a ? {
      ...B,
      transform: "translate(" + L + "px, " + y + "px)",
      ...tf(I.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: L,
      top: y
    };
  }, [n, a, I.floating, d.x, d.y]);
  return v.useMemo(() => ({
    ...d,
    update: Y,
    refs: j,
    elements: I,
    floatingStyles: F
  }), [d, Y, j, I, F]);
}
const Ub = (e) => {
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
      return r && t(r) ? r.current != null ? bc({
        element: r.current,
        padding: i
      }).fn(n) : {} : r ? bc({
        element: r,
        padding: i
      }).fn(n) : {};
    }
  };
}, Qb = (e, t) => {
  const n = Db(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Zb = (e, t) => {
  const n = Ob(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Vb = (e, t) => ({
  fn: Lb(e).fn,
  options: [e, t]
}), Wb = (e, t) => {
  const n = Tb(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Jb = (e, t) => {
  const n = zb(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, qb = (e, t) => {
  const n = Bb(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Kb = (e, t) => {
  const n = Ub(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var Xb = "Arrow", nf = v.forwardRef((e, t) => {
  const { children: n, width: r = 10, height: i = 5, ...o } = e;
  return /* @__PURE__ */ f.jsx(
    Ae.svg,
    {
      ...o,
      ref: t,
      width: r,
      height: i,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : /* @__PURE__ */ f.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
nf.displayName = Xb;
var _b = nf, Ea = "Popper", [rf, no] = un(Ea), [$b, of] = rf(Ea), sf = (e) => {
  const { __scopePopper: t, children: n } = e, [r, i] = v.useState(null);
  return /* @__PURE__ */ f.jsx($b, { scope: t, anchor: r, onAnchorChange: i, children: n });
};
sf.displayName = Ea;
var af = "PopperAnchor", lf = v.forwardRef(
  (e, t) => {
    const { __scopePopper: n, virtualRef: r, ...i } = e, o = of(af, n), s = v.useRef(null), a = je(t, s), l = v.useRef(null);
    return v.useEffect(() => {
      const c = l.current;
      l.current = r?.current || s.current, c !== l.current && o.onAnchorChange(l.current);
    }), r ? null : /* @__PURE__ */ f.jsx(Ae.div, { ...i, ref: a });
  }
);
lf.displayName = af;
var Ca = "PopperContent", [ey, ty] = rf(Ca), cf = v.forwardRef(
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
      collisionPadding: d = 0,
      sticky: u = "partial",
      hideWhenDetached: p = !1,
      updatePositionStrategy: h = "optimized",
      onPlaced: m,
      ...g
    } = e, x = of(Ca, n), [b, A] = v.useState(null), w = je(t, (Z) => A(Z)), [S, N] = v.useState(null), C = Vx(S), O = C?.width ?? 0, D = C?.height ?? 0, z = r + (o !== "center" ? "-" + o : ""), E = typeof d == "number" ? d : { top: 0, right: 0, bottom: 0, left: 0, ...d }, P = Array.isArray(c) ? c : [c], T = P.length > 0, Y = {
      padding: E,
      boundary: P.filter(ry),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: T
    }, { refs: R, floatingStyles: j, placement: I, isPositioned: F, middlewareData: B } = Hb({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: z,
      whileElementsMounted: (...Z) => Rb(...Z, {
        animationFrame: h === "always"
      }),
      elements: {
        reference: x.anchor
      },
      middleware: [
        Qb({ mainAxis: i + D, alignmentAxis: s }),
        l && Zb({
          mainAxis: !0,
          crossAxis: !1,
          limiter: u === "partial" ? Vb() : void 0,
          ...Y
        }),
        l && Wb({ ...Y }),
        Jb({
          ...Y,
          apply: ({ elements: Z, rects: q, availableWidth: ee, availableHeight: le }) => {
            const { width: Ee, height: Me } = q.reference, Se = Z.floating.style;
            Se.setProperty("--radix-popper-available-width", `${ee}px`), Se.setProperty("--radix-popper-available-height", `${le}px`), Se.setProperty("--radix-popper-anchor-width", `${Ee}px`), Se.setProperty("--radix-popper-anchor-height", `${Me}px`);
          }
        }),
        S && Kb({ element: S, padding: a }),
        iy({ arrowWidth: O, arrowHeight: D }),
        p && qb({ strategy: "referenceHidden", ...Y })
      ]
    }), [L, y] = ff(I), M = ht(m);
    Gt(() => {
      F && M?.();
    }, [F, M]);
    const U = B.arrow?.x, k = B.arrow?.y, X = B.arrow?.centerOffset !== 0, [K, W] = v.useState();
    return Gt(() => {
      b && W(window.getComputedStyle(b).zIndex);
    }, [b]), /* @__PURE__ */ f.jsx(
      "div",
      {
        ref: R.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...j,
          transform: F ? j.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: K,
          "--radix-popper-transform-origin": [
            B.transformOrigin?.x,
            B.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...B.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ f.jsx(
          ey,
          {
            scope: n,
            placedSide: L,
            onArrowChange: N,
            arrowX: U,
            arrowY: k,
            shouldHideArrow: X,
            children: /* @__PURE__ */ f.jsx(
              Ae.div,
              {
                "data-side": L,
                "data-align": y,
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
cf.displayName = Ca;
var uf = "PopperArrow", ny = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, df = v.forwardRef(function(t, n) {
  const { __scopePopper: r, ...i } = t, o = ty(uf, r), s = ny[o.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ f.jsx(
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
        children: /* @__PURE__ */ f.jsx(
          _b,
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
df.displayName = uf;
function ry(e) {
  return e !== null;
}
var iy = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    const { placement: n, rects: r, middlewareData: i } = t, s = i.arrow?.centerOffset !== 0, a = s ? 0 : e.arrowWidth, l = s ? 0 : e.arrowHeight, [c, d] = ff(n), u = { start: "0%", center: "50%", end: "100%" }[d], p = (i.arrow?.x ?? 0) + a / 2, h = (i.arrow?.y ?? 0) + l / 2;
    let m = "", g = "";
    return c === "bottom" ? (m = s ? u : `${p}px`, g = `${-l}px`) : c === "top" ? (m = s ? u : `${p}px`, g = `${r.floating.height + l}px`) : c === "right" ? (m = `${-l}px`, g = s ? u : `${h}px`) : c === "left" && (m = `${r.floating.width + l}px`, g = s ? u : `${h}px`), { data: { x: m, y: g } };
  }
});
function ff(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var Sa = sf, Na = lf, hf = cf, pf = df, Go = "rovingFocusGroup.onEntryFocus", oy = { bubbles: !1, cancelable: !0 }, Mr = "RovingFocusGroup", [Es, mf, sy] = pd(Mr), [ay, gf] = un(
  Mr,
  [sy]
), [ly, cy] = ay(Mr), xf = v.forwardRef(
  (e, t) => /* @__PURE__ */ f.jsx(Es.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ f.jsx(Es.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ f.jsx(uy, { ...e, ref: t }) }) })
);
xf.displayName = Mr;
var uy = v.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: n,
    orientation: r,
    loop: i = !1,
    dir: o,
    currentTabStopId: s,
    defaultCurrentTabStopId: a,
    onCurrentTabStopIdChange: l,
    onEntryFocus: c,
    preventScrollOnEntryFocus: d = !1,
    ...u
  } = e, p = v.useRef(null), h = je(t, p), m = md(o), [g, x] = Sr({
    prop: s,
    defaultProp: a ?? null,
    onChange: l,
    caller: Mr
  }), [b, A] = v.useState(!1), w = ht(c), S = mf(n), N = v.useRef(!1), [C, O] = v.useState(0);
  return v.useEffect(() => {
    const D = p.current;
    if (D)
      return D.addEventListener(Go, w), () => D.removeEventListener(Go, w);
  }, [w]), /* @__PURE__ */ f.jsx(
    ly,
    {
      scope: n,
      orientation: r,
      dir: m,
      loop: i,
      currentTabStopId: g,
      onItemFocus: v.useCallback(
        (D) => x(D),
        [x]
      ),
      onItemShiftTab: v.useCallback(() => A(!0), []),
      onFocusableItemAdd: v.useCallback(
        () => O((D) => D + 1),
        []
      ),
      onFocusableItemRemove: v.useCallback(
        () => O((D) => D - 1),
        []
      ),
      children: /* @__PURE__ */ f.jsx(
        Ae.div,
        {
          tabIndex: b || C === 0 ? -1 : 0,
          "data-orientation": r,
          ...u,
          ref: h,
          style: { outline: "none", ...e.style },
          onMouseDown: ie(e.onMouseDown, () => {
            N.current = !0;
          }),
          onFocus: ie(e.onFocus, (D) => {
            const z = !N.current;
            if (D.target === D.currentTarget && z && !b) {
              const E = new CustomEvent(Go, oy);
              if (D.currentTarget.dispatchEvent(E), !E.defaultPrevented) {
                const P = S().filter((I) => I.focusable), T = P.find((I) => I.active), Y = P.find((I) => I.id === g), j = [T, Y, ...P].filter(
                  Boolean
                ).map((I) => I.ref.current);
                vf(j, d);
              }
            }
            N.current = !1;
          }),
          onBlur: ie(e.onBlur, () => A(!1))
        }
      )
    }
  );
}), bf = "RovingFocusGroupItem", yf = v.forwardRef(
  (e, t) => {
    const {
      __scopeRovingFocusGroup: n,
      focusable: r = !0,
      active: i = !1,
      tabStopId: o,
      children: s,
      ...a
    } = e, l = Et(), c = o || l, d = cy(bf, n), u = d.currentTabStopId === c, p = mf(n), { onFocusableItemAdd: h, onFocusableItemRemove: m, currentTabStopId: g } = d;
    return v.useEffect(() => {
      if (r)
        return h(), () => m();
    }, [r, h, m]), /* @__PURE__ */ f.jsx(
      Es.ItemSlot,
      {
        scope: n,
        id: c,
        focusable: r,
        active: i,
        children: /* @__PURE__ */ f.jsx(
          Ae.span,
          {
            tabIndex: u ? 0 : -1,
            "data-orientation": d.orientation,
            ...a,
            ref: t,
            onMouseDown: ie(e.onMouseDown, (x) => {
              r ? d.onItemFocus(c) : x.preventDefault();
            }),
            onFocus: ie(e.onFocus, () => d.onItemFocus(c)),
            onKeyDown: ie(e.onKeyDown, (x) => {
              if (x.key === "Tab" && x.shiftKey) {
                d.onItemShiftTab();
                return;
              }
              if (x.target !== x.currentTarget) return;
              const b = hy(x, d.orientation, d.dir);
              if (b !== void 0) {
                if (x.metaKey || x.ctrlKey || x.altKey || x.shiftKey) return;
                x.preventDefault();
                let w = p().filter((S) => S.focusable).map((S) => S.ref.current);
                if (b === "last") w.reverse();
                else if (b === "prev" || b === "next") {
                  b === "prev" && w.reverse();
                  const S = w.indexOf(x.currentTarget);
                  w = d.loop ? py(w, S + 1) : w.slice(S + 1);
                }
                setTimeout(() => vf(w));
              }
            }),
            children: typeof s == "function" ? s({ isCurrentTabStop: u, hasTabStop: g != null }) : s
          }
        )
      }
    );
  }
);
yf.displayName = bf;
var dy = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function fy(e, t) {
  return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function hy(e, t, n) {
  const r = fy(e.key, n);
  if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return dy[r];
}
function vf(e, t = !1) {
  const n = document.activeElement;
  for (const r of e)
    if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function py(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var my = xf, gy = yf, Cs = ["Enter", " "], xy = ["ArrowDown", "PageUp", "Home"], wf = ["ArrowUp", "PageDown", "End"], by = [...xy, ...wf], yy = {
  ltr: [...Cs, "ArrowRight"],
  rtl: [...Cs, "ArrowLeft"]
}, vy = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
}, Ir = "Menu", [dr, wy, Ay] = pd(Ir), [dn, Af] = un(Ir, [
  Ay,
  no,
  gf
]), Pr = no(), kf = gf(), [Ef, Qt] = dn(Ir), [ky, Rr] = dn(Ir), Cf = (e) => {
  const { __scopeMenu: t, open: n = !1, children: r, dir: i, onOpenChange: o, modal: s = !0 } = e, a = Pr(t), [l, c] = v.useState(null), d = v.useRef(!1), u = ht(o), p = md(i);
  return v.useEffect(() => {
    const h = () => {
      d.current = !0, document.addEventListener("pointerdown", m, { capture: !0, once: !0 }), document.addEventListener("pointermove", m, { capture: !0, once: !0 });
    }, m = () => d.current = !1;
    return document.addEventListener("keydown", h, { capture: !0 }), () => {
      document.removeEventListener("keydown", h, { capture: !0 }), document.removeEventListener("pointerdown", m, { capture: !0 }), document.removeEventListener("pointermove", m, { capture: !0 });
    };
  }, []), /* @__PURE__ */ f.jsx(Sa, { ...a, children: /* @__PURE__ */ f.jsx(
    Ef,
    {
      scope: t,
      open: n,
      onOpenChange: u,
      content: l,
      onContentChange: c,
      children: /* @__PURE__ */ f.jsx(
        ky,
        {
          scope: t,
          onClose: v.useCallback(() => u(!1), [u]),
          isUsingKeyboardRef: d,
          dir: p,
          modal: s,
          children: r
        }
      )
    }
  ) });
};
Cf.displayName = Ir;
var Ey = "MenuAnchor", ja = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, i = Pr(n);
    return /* @__PURE__ */ f.jsx(Na, { ...i, ...r, ref: t });
  }
);
ja.displayName = Ey;
var Ma = "MenuPortal", [Cy, Sf] = dn(Ma, {
  forceMount: void 0
}), Nf = (e) => {
  const { __scopeMenu: t, forceMount: n, children: r, container: i } = e, o = Qt(Ma, t);
  return /* @__PURE__ */ f.jsx(Cy, { scope: t, forceMount: n, children: /* @__PURE__ */ f.jsx(mt, { present: n || o.open, children: /* @__PURE__ */ f.jsx(Ji, { asChild: !0, container: i, children: r }) }) });
};
Nf.displayName = Ma;
var Je = "MenuContent", [Sy, Ia] = dn(Je), jf = v.forwardRef(
  (e, t) => {
    const n = Sf(Je, e.__scopeMenu), { forceMount: r = n.forceMount, ...i } = e, o = Qt(Je, e.__scopeMenu), s = Rr(Je, e.__scopeMenu);
    return /* @__PURE__ */ f.jsx(dr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ f.jsx(mt, { present: r || o.open, children: /* @__PURE__ */ f.jsx(dr.Slot, { scope: e.__scopeMenu, children: s.modal ? /* @__PURE__ */ f.jsx(Ny, { ...i, ref: t }) : /* @__PURE__ */ f.jsx(jy, { ...i, ref: t }) }) }) });
  }
), Ny = v.forwardRef(
  (e, t) => {
    const n = Qt(Je, e.__scopeMenu), r = v.useRef(null), i = je(t, r);
    return v.useEffect(() => {
      const o = r.current;
      if (o) return ca(o);
    }, []), /* @__PURE__ */ f.jsx(
      Pa,
      {
        ...e,
        ref: i,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        disableOutsideScroll: !0,
        onFocusOutside: ie(
          e.onFocusOutside,
          (o) => o.preventDefault(),
          { checkForDefaultPrevented: !1 }
        ),
        onDismiss: () => n.onOpenChange(!1)
      }
    );
  }
), jy = v.forwardRef((e, t) => {
  const n = Qt(Je, e.__scopeMenu);
  return /* @__PURE__ */ f.jsx(
    Pa,
    {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1)
    }
  );
}), My = /* @__PURE__ */ rn("MenuContent.ScrollLock"), Pa = v.forwardRef(
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
      onPointerDownOutside: d,
      onFocusOutside: u,
      onInteractOutside: p,
      onDismiss: h,
      disableOutsideScroll: m,
      ...g
    } = e, x = Qt(Je, n), b = Rr(Je, n), A = Pr(n), w = kf(n), S = wy(n), [N, C] = v.useState(null), O = v.useRef(null), D = je(t, O, x.onContentChange), z = v.useRef(0), E = v.useRef(""), P = v.useRef(0), T = v.useRef(null), Y = v.useRef("right"), R = v.useRef(0), j = m ? Ki : v.Fragment, I = m ? { as: My, allowPinchZoom: !0 } : void 0, F = (L) => {
      const y = E.current + L, M = S().filter((Z) => !Z.disabled), U = document.activeElement, k = M.find((Z) => Z.ref.current === U)?.textValue, X = M.map((Z) => Z.textValue), K = Yy(X, y, k), W = M.find((Z) => Z.textValue === K)?.ref.current;
      (function Z(q) {
        E.current = q, window.clearTimeout(z.current), q !== "" && (z.current = window.setTimeout(() => Z(""), 1e3));
      })(y), W && setTimeout(() => W.focus());
    };
    v.useEffect(() => () => window.clearTimeout(z.current), []), la();
    const B = v.useCallback((L) => Y.current === T.current?.side && Uy(L, T.current?.area), []);
    return /* @__PURE__ */ f.jsx(
      Sy,
      {
        scope: n,
        searchRef: E,
        onItemEnter: v.useCallback(
          (L) => {
            B(L) && L.preventDefault();
          },
          [B]
        ),
        onItemLeave: v.useCallback(
          (L) => {
            B(L) || (O.current?.focus(), C(null));
          },
          [B]
        ),
        onTriggerLeave: v.useCallback(
          (L) => {
            B(L) && L.preventDefault();
          },
          [B]
        ),
        pointerGraceTimerRef: P,
        onPointerGraceIntentChange: v.useCallback((L) => {
          T.current = L;
        }, []),
        children: /* @__PURE__ */ f.jsx(j, { ...I, children: /* @__PURE__ */ f.jsx(
          Wi,
          {
            asChild: !0,
            trapped: i,
            onMountAutoFocus: ie(o, (L) => {
              L.preventDefault(), O.current?.focus({ preventScroll: !0 });
            }),
            onUnmountAutoFocus: s,
            children: /* @__PURE__ */ f.jsx(
              Vi,
              {
                asChild: !0,
                disableOutsidePointerEvents: a,
                onEscapeKeyDown: c,
                onPointerDownOutside: d,
                onFocusOutside: u,
                onInteractOutside: p,
                onDismiss: h,
                children: /* @__PURE__ */ f.jsx(
                  my,
                  {
                    asChild: !0,
                    ...w,
                    dir: b.dir,
                    orientation: "vertical",
                    loop: r,
                    currentTabStopId: N,
                    onCurrentTabStopIdChange: C,
                    onEntryFocus: ie(l, (L) => {
                      b.isUsingKeyboardRef.current || L.preventDefault();
                    }),
                    preventScrollOnEntryFocus: !0,
                    children: /* @__PURE__ */ f.jsx(
                      hf,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": Zf(x.open),
                        "data-radix-menu-content": "",
                        dir: b.dir,
                        ...A,
                        ...g,
                        ref: D,
                        style: { outline: "none", ...g.style },
                        onKeyDown: ie(g.onKeyDown, (L) => {
                          const M = L.target.closest("[data-radix-menu-content]") === L.currentTarget, U = L.ctrlKey || L.altKey || L.metaKey, k = L.key.length === 1;
                          M && (L.key === "Tab" && L.preventDefault(), !U && k && F(L.key));
                          const X = O.current;
                          if (L.target !== X || !by.includes(L.key)) return;
                          L.preventDefault();
                          const W = S().filter((Z) => !Z.disabled).map((Z) => Z.ref.current);
                          wf.includes(L.key) && W.reverse(), Fy(W);
                        }),
                        onBlur: ie(e.onBlur, (L) => {
                          L.currentTarget.contains(L.target) || (window.clearTimeout(z.current), E.current = "");
                        }),
                        onPointerMove: ie(
                          e.onPointerMove,
                          fr((L) => {
                            const y = L.target, M = R.current !== L.clientX;
                            if (L.currentTarget.contains(y) && M) {
                              const U = L.clientX > R.current ? "right" : "left";
                              Y.current = U, R.current = L.clientX;
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
jf.displayName = Je;
var Iy = "MenuGroup", Ra = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ f.jsx(Ae.div, { role: "group", ...r, ref: t });
  }
);
Ra.displayName = Iy;
var Py = "MenuLabel", Mf = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ f.jsx(Ae.div, { ...r, ref: t });
  }
);
Mf.displayName = Py;
var Ci = "MenuItem", vc = "menu.itemSelect", ro = v.forwardRef(
  (e, t) => {
    const { disabled: n = !1, onSelect: r, ...i } = e, o = v.useRef(null), s = Rr(Ci, e.__scopeMenu), a = Ia(Ci, e.__scopeMenu), l = je(t, o), c = v.useRef(!1), d = () => {
      const u = o.current;
      if (!n && u) {
        const p = new CustomEvent(vc, { bubbles: !0, cancelable: !0 });
        u.addEventListener(vc, (h) => r?.(h), { once: !0 }), hd(u, p), p.defaultPrevented ? c.current = !1 : s.onClose();
      }
    };
    return /* @__PURE__ */ f.jsx(
      If,
      {
        ...i,
        ref: l,
        disabled: n,
        onClick: ie(e.onClick, d),
        onPointerDown: (u) => {
          e.onPointerDown?.(u), c.current = !0;
        },
        onPointerUp: ie(e.onPointerUp, (u) => {
          c.current || u.currentTarget?.click();
        }),
        onKeyDown: ie(e.onKeyDown, (u) => {
          const p = a.searchRef.current !== "";
          n || p && u.key === " " || Cs.includes(u.key) && (u.currentTarget.click(), u.preventDefault());
        })
      }
    );
  }
);
ro.displayName = Ci;
var If = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, disabled: r = !1, textValue: i, ...o } = e, s = Ia(Ci, n), a = kf(n), l = v.useRef(null), c = je(t, l), [d, u] = v.useState(!1), [p, h] = v.useState("");
    return v.useEffect(() => {
      const m = l.current;
      m && h((m.textContent ?? "").trim());
    }, [o.children]), /* @__PURE__ */ f.jsx(
      dr.ItemSlot,
      {
        scope: n,
        disabled: r,
        textValue: i ?? p,
        children: /* @__PURE__ */ f.jsx(gy, { asChild: !0, ...a, focusable: !r, children: /* @__PURE__ */ f.jsx(
          Ae.div,
          {
            role: "menuitem",
            "data-highlighted": d ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...o,
            ref: c,
            onPointerMove: ie(
              e.onPointerMove,
              fr((m) => {
                r ? s.onItemLeave(m) : (s.onItemEnter(m), m.defaultPrevented || m.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: ie(
              e.onPointerLeave,
              fr((m) => s.onItemLeave(m))
            ),
            onFocus: ie(e.onFocus, () => u(!0)),
            onBlur: ie(e.onBlur, () => u(!1))
          }
        ) })
      }
    );
  }
), Ry = "MenuCheckboxItem", Pf = v.forwardRef(
  (e, t) => {
    const { checked: n = !1, onCheckedChange: r, ...i } = e;
    return /* @__PURE__ */ f.jsx(zf, { scope: e.__scopeMenu, checked: n, children: /* @__PURE__ */ f.jsx(
      ro,
      {
        role: "menuitemcheckbox",
        "aria-checked": Si(n) ? "mixed" : n,
        ...i,
        ref: t,
        "data-state": Ta(n),
        onSelect: ie(
          i.onSelect,
          () => r?.(Si(n) ? !0 : !n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Pf.displayName = Ry;
var Rf = "MenuRadioGroup", [Dy, Oy] = dn(
  Rf,
  { value: void 0, onValueChange: () => {
  } }
), Df = v.forwardRef(
  (e, t) => {
    const { value: n, onValueChange: r, ...i } = e, o = ht(r);
    return /* @__PURE__ */ f.jsx(Dy, { scope: e.__scopeMenu, value: n, onValueChange: o, children: /* @__PURE__ */ f.jsx(Ra, { ...i, ref: t }) });
  }
);
Df.displayName = Rf;
var Of = "MenuRadioItem", Tf = v.forwardRef(
  (e, t) => {
    const { value: n, ...r } = e, i = Oy(Of, e.__scopeMenu), o = n === i.value;
    return /* @__PURE__ */ f.jsx(zf, { scope: e.__scopeMenu, checked: o, children: /* @__PURE__ */ f.jsx(
      ro,
      {
        role: "menuitemradio",
        "aria-checked": o,
        ...r,
        ref: t,
        "data-state": Ta(o),
        onSelect: ie(
          r.onSelect,
          () => i.onValueChange?.(n),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
);
Tf.displayName = Of;
var Da = "MenuItemIndicator", [zf, Ty] = dn(
  Da,
  { checked: !1 }
), Bf = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, forceMount: r, ...i } = e, o = Ty(Da, n);
    return /* @__PURE__ */ f.jsx(
      mt,
      {
        present: r || Si(o.checked) || o.checked === !0,
        children: /* @__PURE__ */ f.jsx(
          Ae.span,
          {
            ...i,
            ref: t,
            "data-state": Ta(o.checked)
          }
        )
      }
    );
  }
);
Bf.displayName = Da;
var zy = "MenuSeparator", Lf = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e;
    return /* @__PURE__ */ f.jsx(
      Ae.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...r,
        ref: t
      }
    );
  }
);
Lf.displayName = zy;
var By = "MenuArrow", Ff = v.forwardRef(
  (e, t) => {
    const { __scopeMenu: n, ...r } = e, i = Pr(n);
    return /* @__PURE__ */ f.jsx(pf, { ...i, ...r, ref: t });
  }
);
Ff.displayName = By;
var Oa = "MenuSub", [Ly, Gf] = dn(Oa), Yf = (e) => {
  const { __scopeMenu: t, children: n, open: r = !1, onOpenChange: i } = e, o = Qt(Oa, t), s = Pr(t), [a, l] = v.useState(null), [c, d] = v.useState(null), u = ht(i);
  return v.useEffect(() => (o.open === !1 && u(!1), () => u(!1)), [o.open, u]), /* @__PURE__ */ f.jsx(Sa, { ...s, children: /* @__PURE__ */ f.jsx(
    Ef,
    {
      scope: t,
      open: r,
      onOpenChange: u,
      content: c,
      onContentChange: d,
      children: /* @__PURE__ */ f.jsx(
        Ly,
        {
          scope: t,
          contentId: Et(),
          triggerId: Et(),
          trigger: a,
          onTriggerChange: l,
          children: n
        }
      )
    }
  ) });
};
Yf.displayName = Oa;
var _n = "MenuSubTrigger", Hf = v.forwardRef(
  (e, t) => {
    const n = Qt(_n, e.__scopeMenu), r = Rr(_n, e.__scopeMenu), i = Gf(_n, e.__scopeMenu), o = Ia(_n, e.__scopeMenu), s = v.useRef(null), { pointerGraceTimerRef: a, onPointerGraceIntentChange: l } = o, c = { __scopeMenu: e.__scopeMenu }, d = v.useCallback(() => {
      s.current && window.clearTimeout(s.current), s.current = null;
    }, []);
    return v.useEffect(() => d, [d]), v.useEffect(() => {
      const u = a.current;
      return () => {
        window.clearTimeout(u), l(null);
      };
    }, [a, l]), /* @__PURE__ */ f.jsx(ja, { asChild: !0, ...c, children: /* @__PURE__ */ f.jsx(
      If,
      {
        id: i.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": n.open,
        "aria-controls": i.contentId,
        "data-state": Zf(n.open),
        ...e,
        ref: Zi(t, i.onTriggerChange),
        onClick: (u) => {
          e.onClick?.(u), !(e.disabled || u.defaultPrevented) && (u.currentTarget.focus(), n.open || n.onOpenChange(!0));
        },
        onPointerMove: ie(
          e.onPointerMove,
          fr((u) => {
            o.onItemEnter(u), !u.defaultPrevented && !e.disabled && !n.open && !s.current && (o.onPointerGraceIntentChange(null), s.current = window.setTimeout(() => {
              n.onOpenChange(!0), d();
            }, 100));
          })
        ),
        onPointerLeave: ie(
          e.onPointerLeave,
          fr((u) => {
            d();
            const p = n.content?.getBoundingClientRect();
            if (p) {
              const h = n.content?.dataset.side, m = h === "right", g = m ? -5 : 5, x = p[m ? "left" : "right"], b = p[m ? "right" : "left"];
              o.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: u.clientX + g, y: u.clientY },
                  { x, y: p.top },
                  { x: b, y: p.top },
                  { x: b, y: p.bottom },
                  { x, y: p.bottom }
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
        onKeyDown: ie(e.onKeyDown, (u) => {
          const p = o.searchRef.current !== "";
          e.disabled || p && u.key === " " || yy[r.dir].includes(u.key) && (n.onOpenChange(!0), n.content?.focus(), u.preventDefault());
        })
      }
    ) });
  }
);
Hf.displayName = _n;
var Uf = "MenuSubContent", Qf = v.forwardRef(
  (e, t) => {
    const n = Sf(Je, e.__scopeMenu), { forceMount: r = n.forceMount, ...i } = e, o = Qt(Je, e.__scopeMenu), s = Rr(Je, e.__scopeMenu), a = Gf(Uf, e.__scopeMenu), l = v.useRef(null), c = je(t, l);
    return /* @__PURE__ */ f.jsx(dr.Provider, { scope: e.__scopeMenu, children: /* @__PURE__ */ f.jsx(mt, { present: r || o.open, children: /* @__PURE__ */ f.jsx(dr.Slot, { scope: e.__scopeMenu, children: /* @__PURE__ */ f.jsx(
      Pa,
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
        onOpenAutoFocus: (d) => {
          s.isUsingKeyboardRef.current && l.current?.focus(), d.preventDefault();
        },
        onCloseAutoFocus: (d) => d.preventDefault(),
        onFocusOutside: ie(e.onFocusOutside, (d) => {
          d.target !== a.trigger && o.onOpenChange(!1);
        }),
        onEscapeKeyDown: ie(e.onEscapeKeyDown, (d) => {
          s.onClose(), d.preventDefault();
        }),
        onKeyDown: ie(e.onKeyDown, (d) => {
          const u = d.currentTarget.contains(d.target), p = vy[s.dir].includes(d.key);
          u && p && (o.onOpenChange(!1), a.trigger?.focus(), d.preventDefault());
        })
      }
    ) }) }) });
  }
);
Qf.displayName = Uf;
function Zf(e) {
  return e ? "open" : "closed";
}
function Si(e) {
  return e === "indeterminate";
}
function Ta(e) {
  return Si(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Fy(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function Gy(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
function Yy(e, t, n) {
  const i = t.length > 1 && Array.from(t).every((c) => c === t[0]) ? t[0] : t, o = n ? e.indexOf(n) : -1;
  let s = Gy(e, Math.max(o, 0));
  i.length === 1 && (s = s.filter((c) => c !== n));
  const l = s.find(
    (c) => c.toLowerCase().startsWith(i.toLowerCase())
  );
  return l !== n ? l : void 0;
}
function Hy(e, t) {
  const { x: n, y: r } = e;
  let i = !1;
  for (let o = 0, s = t.length - 1; o < t.length; s = o++) {
    const a = t[o], l = t[s], c = a.x, d = a.y, u = l.x, p = l.y;
    d > r != p > r && n < (u - c) * (r - d) / (p - d) + c && (i = !i);
  }
  return i;
}
function Uy(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return Hy(n, t);
}
function fr(e) {
  return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var Qy = Cf, Zy = ja, Vy = Nf, Wy = jf, Jy = Ra, qy = Mf, Ky = ro, Xy = Pf, _y = Df, $y = Tf, ev = Bf, tv = Lf, nv = Ff, rv = Yf, iv = Hf, ov = Qf, io = "DropdownMenu", [sv] = un(
  io,
  [Af]
), Pe = Af(), [av, Vf] = sv(io), Wf = (e) => {
  const {
    __scopeDropdownMenu: t,
    children: n,
    dir: r,
    open: i,
    defaultOpen: o,
    onOpenChange: s,
    modal: a = !0
  } = e, l = Pe(t), c = v.useRef(null), [d, u] = Sr({
    prop: i,
    defaultProp: o ?? !1,
    onChange: s,
    caller: io
  });
  return /* @__PURE__ */ f.jsx(
    av,
    {
      scope: t,
      triggerId: Et(),
      triggerRef: c,
      contentId: Et(),
      open: d,
      onOpenChange: u,
      onOpenToggle: v.useCallback(() => u((p) => !p), [u]),
      modal: a,
      children: /* @__PURE__ */ f.jsx(Qy, { ...l, open: d, onOpenChange: u, dir: r, modal: a, children: n })
    }
  );
};
Wf.displayName = io;
var Jf = "DropdownMenuTrigger", qf = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, disabled: r = !1, ...i } = e, o = Vf(Jf, n), s = Pe(n);
    return /* @__PURE__ */ f.jsx(Zy, { asChild: !0, ...s, children: /* @__PURE__ */ f.jsx(
      Ae.button,
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
        ref: Zi(t, o.triggerRef),
        onPointerDown: ie(e.onPointerDown, (a) => {
          !r && a.button === 0 && a.ctrlKey === !1 && (o.onOpenToggle(), o.open || a.preventDefault());
        }),
        onKeyDown: ie(e.onKeyDown, (a) => {
          r || (["Enter", " "].includes(a.key) && o.onOpenToggle(), a.key === "ArrowDown" && o.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(a.key) && a.preventDefault());
        })
      }
    ) });
  }
);
qf.displayName = Jf;
var lv = "DropdownMenuPortal", Kf = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e, r = Pe(t);
  return /* @__PURE__ */ f.jsx(Vy, { ...r, ...n });
};
Kf.displayName = lv;
var Xf = "DropdownMenuContent", _f = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Vf(Xf, n), o = Pe(n), s = v.useRef(!1);
    return /* @__PURE__ */ f.jsx(
      Wy,
      {
        id: i.contentId,
        "aria-labelledby": i.triggerId,
        ...o,
        ...r,
        ref: t,
        onCloseAutoFocus: ie(e.onCloseAutoFocus, (a) => {
          s.current || i.triggerRef.current?.focus(), s.current = !1, a.preventDefault();
        }),
        onInteractOutside: ie(e.onInteractOutside, (a) => {
          const l = a.detail.originalEvent, c = l.button === 0 && l.ctrlKey === !0, d = l.button === 2 || c;
          (!i.modal || d) && (s.current = !0);
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
_f.displayName = Xf;
var cv = "DropdownMenuGroup", $f = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
    return /* @__PURE__ */ f.jsx(Jy, { ...i, ...r, ref: t });
  }
);
$f.displayName = cv;
var uv = "DropdownMenuLabel", eh = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
    return /* @__PURE__ */ f.jsx(qy, { ...i, ...r, ref: t });
  }
);
eh.displayName = uv;
var dv = "DropdownMenuItem", th = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
    return /* @__PURE__ */ f.jsx(Ky, { ...i, ...r, ref: t });
  }
);
th.displayName = dv;
var fv = "DropdownMenuCheckboxItem", nh = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
  return /* @__PURE__ */ f.jsx(Xy, { ...i, ...r, ref: t });
});
nh.displayName = fv;
var hv = "DropdownMenuRadioGroup", rh = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
  return /* @__PURE__ */ f.jsx(_y, { ...i, ...r, ref: t });
});
rh.displayName = hv;
var pv = "DropdownMenuRadioItem", ih = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
  return /* @__PURE__ */ f.jsx($y, { ...i, ...r, ref: t });
});
ih.displayName = pv;
var mv = "DropdownMenuItemIndicator", oh = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
  return /* @__PURE__ */ f.jsx(ev, { ...i, ...r, ref: t });
});
oh.displayName = mv;
var gv = "DropdownMenuSeparator", sh = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
  return /* @__PURE__ */ f.jsx(tv, { ...i, ...r, ref: t });
});
sh.displayName = gv;
var xv = "DropdownMenuArrow", bv = v.forwardRef(
  (e, t) => {
    const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
    return /* @__PURE__ */ f.jsx(nv, { ...i, ...r, ref: t });
  }
);
bv.displayName = xv;
var yv = (e) => {
  const { __scopeDropdownMenu: t, children: n, open: r, onOpenChange: i, defaultOpen: o } = e, s = Pe(t), [a, l] = Sr({
    prop: r,
    defaultProp: o ?? !1,
    onChange: i,
    caller: "DropdownMenuSub"
  });
  return /* @__PURE__ */ f.jsx(rv, { ...s, open: a, onOpenChange: l, children: n });
}, vv = "DropdownMenuSubTrigger", ah = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
  return /* @__PURE__ */ f.jsx(iv, { ...i, ...r, ref: t });
});
ah.displayName = vv;
var wv = "DropdownMenuSubContent", lh = v.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e, i = Pe(n);
  return /* @__PURE__ */ f.jsx(
    ov,
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
lh.displayName = wv;
var Av = Wf, kv = qf, ch = Kf, Ev = _f, Cv = $f, Sv = eh, Nv = th, jv = nh, Mv = rh, Iv = ih, uh = oh, Pv = sh, Rv = yv, Dv = ah, Ov = lh, Tv = "Label", dh = v.forwardRef((e, t) => /* @__PURE__ */ f.jsx(
  Ae.label,
  {
    ...e,
    ref: t,
    onMouseDown: (n) => {
      n.target.closest("button, input, select, textarea") || (e.onMouseDown?.(n), !n.defaultPrevented && n.detail > 1 && n.preventDefault());
    }
  }
));
dh.displayName = Tv;
var zv = dh, oo = "Popover", [fh] = un(oo, [
  no
]), Dr = no(), [Bv, Zt] = fh(oo), hh = (e) => {
  const {
    __scopePopover: t,
    children: n,
    open: r,
    defaultOpen: i,
    onOpenChange: o,
    modal: s = !1
  } = e, a = Dr(t), l = v.useRef(null), [c, d] = v.useState(!1), [u, p] = Sr({
    prop: r,
    defaultProp: i ?? !1,
    onChange: o,
    caller: oo
  });
  return /* @__PURE__ */ f.jsx(Sa, { ...a, children: /* @__PURE__ */ f.jsx(
    Bv,
    {
      scope: t,
      contentId: Et(),
      triggerRef: l,
      open: u,
      onOpenChange: p,
      onOpenToggle: v.useCallback(() => p((h) => !h), [p]),
      hasCustomAnchor: c,
      onCustomAnchorAdd: v.useCallback(() => d(!0), []),
      onCustomAnchorRemove: v.useCallback(() => d(!1), []),
      modal: s,
      children: n
    }
  ) });
};
hh.displayName = oo;
var ph = "PopoverAnchor", Lv = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Zt(ph, n), o = Dr(n), { onCustomAnchorAdd: s, onCustomAnchorRemove: a } = i;
    return v.useEffect(() => (s(), () => a()), [s, a]), /* @__PURE__ */ f.jsx(Na, { ...o, ...r, ref: t });
  }
);
Lv.displayName = ph;
var mh = "PopoverTrigger", gh = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Zt(mh, n), o = Dr(n), s = je(t, i.triggerRef), a = /* @__PURE__ */ f.jsx(
      Ae.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": i.open,
        "aria-controls": i.contentId,
        "data-state": wh(i.open),
        ...r,
        ref: s,
        onClick: ie(e.onClick, i.onOpenToggle)
      }
    );
    return i.hasCustomAnchor ? a : /* @__PURE__ */ f.jsx(Na, { asChild: !0, ...o, children: a });
  }
);
gh.displayName = mh;
var za = "PopoverPortal", [Fv, Gv] = fh(za, {
  forceMount: void 0
}), xh = (e) => {
  const { __scopePopover: t, forceMount: n, children: r, container: i } = e, o = Zt(za, t);
  return /* @__PURE__ */ f.jsx(Fv, { scope: t, forceMount: n, children: /* @__PURE__ */ f.jsx(mt, { present: n || o.open, children: /* @__PURE__ */ f.jsx(Ji, { asChild: !0, container: i, children: r }) }) });
};
xh.displayName = za;
var In = "PopoverContent", bh = v.forwardRef(
  (e, t) => {
    const n = Gv(In, e.__scopePopover), { forceMount: r = n.forceMount, ...i } = e, o = Zt(In, e.__scopePopover);
    return /* @__PURE__ */ f.jsx(mt, { present: r || o.open, children: o.modal ? /* @__PURE__ */ f.jsx(Hv, { ...i, ref: t }) : /* @__PURE__ */ f.jsx(Uv, { ...i, ref: t }) });
  }
);
bh.displayName = In;
var Yv = /* @__PURE__ */ rn("PopoverContent.RemoveScroll"), Hv = v.forwardRef(
  (e, t) => {
    const n = Zt(In, e.__scopePopover), r = v.useRef(null), i = je(t, r), o = v.useRef(!1);
    return v.useEffect(() => {
      const s = r.current;
      if (s) return ca(s);
    }, []), /* @__PURE__ */ f.jsx(Ki, { as: Yv, allowPinchZoom: !0, children: /* @__PURE__ */ f.jsx(
      yh,
      {
        ...e,
        ref: i,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ie(e.onCloseAutoFocus, (s) => {
          s.preventDefault(), o.current || n.triggerRef.current?.focus();
        }),
        onPointerDownOutside: ie(
          e.onPointerDownOutside,
          (s) => {
            const a = s.detail.originalEvent, l = a.button === 0 && a.ctrlKey === !0, c = a.button === 2 || l;
            o.current = c;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: ie(
          e.onFocusOutside,
          (s) => s.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }
), Uv = v.forwardRef(
  (e, t) => {
    const n = Zt(In, e.__scopePopover), r = v.useRef(!1), i = v.useRef(!1);
    return /* @__PURE__ */ f.jsx(
      yh,
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
), yh = v.forwardRef(
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
      onInteractOutside: d,
      ...u
    } = e, p = Zt(In, n), h = Dr(n);
    return la(), /* @__PURE__ */ f.jsx(
      Wi,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: i,
        onUnmountAutoFocus: o,
        children: /* @__PURE__ */ f.jsx(
          Vi,
          {
            asChild: !0,
            disableOutsidePointerEvents: s,
            onInteractOutside: d,
            onEscapeKeyDown: a,
            onPointerDownOutside: l,
            onFocusOutside: c,
            onDismiss: () => p.onOpenChange(!1),
            children: /* @__PURE__ */ f.jsx(
              hf,
              {
                "data-state": wh(p.open),
                role: "dialog",
                id: p.contentId,
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
), vh = "PopoverClose", Qv = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Zt(vh, n);
    return /* @__PURE__ */ f.jsx(
      Ae.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: ie(e.onClick, () => i.onOpenChange(!1))
      }
    );
  }
);
Qv.displayName = vh;
var Zv = "PopoverArrow", Vv = v.forwardRef(
  (e, t) => {
    const { __scopePopover: n, ...r } = e, i = Dr(n);
    return /* @__PURE__ */ f.jsx(pf, { ...i, ...r, ref: t });
  }
);
Vv.displayName = Zv;
function wh(e) {
  return e ? "open" : "closed";
}
var Ba = hh, La = gh, Fa = xh, Ga = bh, Wv = "Separator", wc = "horizontal", Jv = ["horizontal", "vertical"], Ah = v.forwardRef((e, t) => {
  const { decorative: n, orientation: r = wc, ...i } = e, o = qv(r) ? r : wc, a = n ? { role: "none" } : { "aria-orientation": o === "vertical" ? o : void 0, role: "separator" };
  return /* @__PURE__ */ f.jsx(
    Ae.div,
    {
      "data-orientation": o,
      ...a,
      ...i,
      ref: t
    }
  );
});
Ah.displayName = Wv;
function qv(e) {
  return Jv.includes(e);
}
var Kv = Ah;
const Xv = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let r = 0; r < e.length; r++)
    n[r] = e[r];
  for (let r = 0; r < t.length; r++)
    n[e.length + r] = t[r];
  return n;
}, _v = (e, t) => ({
  classGroupId: e,
  validator: t
}), kh = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), Ni = "-", Ac = [], $v = "arbitrary..", ew = (e) => {
  const t = nw(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (s) => {
      if (s.startsWith("[") && s.endsWith("]"))
        return tw(s);
      const a = s.split(Ni), l = a[0] === "" && a.length > 1 ? 1 : 0;
      return Eh(a, l, t);
    },
    getConflictingClassGroupIds: (s, a) => {
      if (a) {
        const l = r[s], c = n[s];
        return l ? c ? Xv(c, l) : l : c || Ac;
      }
      return n[s] || Ac;
    }
  };
}, Eh = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const i = e[t], o = n.nextPart.get(i);
  if (o) {
    const c = Eh(e, t + 1, o);
    if (c) return c;
  }
  const s = n.validators;
  if (s === null)
    return;
  const a = t === 0 ? e.join(Ni) : e.slice(t).join(Ni), l = s.length;
  for (let c = 0; c < l; c++) {
    const d = s[c];
    if (d.validator(a))
      return d.classGroupId;
  }
}, tw = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
  return r ? $v + r : void 0;
})(), nw = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return rw(n, t);
}, rw = (e, t) => {
  const n = kh();
  for (const r in e) {
    const i = e[r];
    Ya(i, n, r, t);
  }
  return n;
}, Ya = (e, t, n, r) => {
  const i = e.length;
  for (let o = 0; o < i; o++) {
    const s = e[o];
    iw(s, t, n, r);
  }
}, iw = (e, t, n, r) => {
  if (typeof e == "string") {
    ow(e, t, n);
    return;
  }
  if (typeof e == "function") {
    sw(e, t, n, r);
    return;
  }
  aw(e, t, n, r);
}, ow = (e, t, n) => {
  const r = e === "" ? t : Ch(t, e);
  r.classGroupId = n;
}, sw = (e, t, n, r) => {
  if (lw(e)) {
    Ya(e(r), t, n, r);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(_v(n, e));
}, aw = (e, t, n, r) => {
  const i = Object.entries(e), o = i.length;
  for (let s = 0; s < o; s++) {
    const [a, l] = i[s];
    Ya(l, Ch(t, a), n, r);
  }
}, Ch = (e, t) => {
  let n = e;
  const r = t.split(Ni), i = r.length;
  for (let o = 0; o < i; o++) {
    const s = r[o];
    let a = n.nextPart.get(s);
    a || (a = kh(), n.nextPart.set(s, a)), n = a;
  }
  return n;
}, lw = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, cw = (e) => {
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
}, Ss = "!", kc = ":", uw = [], Ec = (e, t, n, r, i) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: r,
  isExternal: i
}), dw = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: n
  } = e;
  let r = (i) => {
    const o = [];
    let s = 0, a = 0, l = 0, c;
    const d = i.length;
    for (let g = 0; g < d; g++) {
      const x = i[g];
      if (s === 0 && a === 0) {
        if (x === kc) {
          o.push(i.slice(l, g)), l = g + 1;
          continue;
        }
        if (x === "/") {
          c = g;
          continue;
        }
      }
      x === "[" ? s++ : x === "]" ? s-- : x === "(" ? a++ : x === ")" && a--;
    }
    const u = o.length === 0 ? i : i.slice(l);
    let p = u, h = !1;
    u.endsWith(Ss) ? (p = u.slice(0, -1), h = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(Ss) && (p = u.slice(1), h = !0)
    );
    const m = c && c > l ? c - l : void 0;
    return Ec(o, h, p, m);
  };
  if (t) {
    const i = t + kc, o = r;
    r = (s) => s.startsWith(i) ? o(s.slice(i.length)) : Ec(uw, !1, s, void 0, !0);
  }
  if (n) {
    const i = r;
    r = (o) => n({
      className: o,
      parseClassName: i
    });
  }
  return r;
}, fw = (e) => {
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
}, hw = (e) => ({
  cache: cw(e.cacheSize),
  parseClassName: dw(e),
  sortModifiers: fw(e),
  ...ew(e)
}), pw = /\s+/, mw = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: i,
    sortModifiers: o
  } = t, s = [], a = e.trim().split(pw);
  let l = "";
  for (let c = a.length - 1; c >= 0; c -= 1) {
    const d = a[c], {
      isExternal: u,
      modifiers: p,
      hasImportantModifier: h,
      baseClassName: m,
      maybePostfixModifierPosition: g
    } = n(d);
    if (u) {
      l = d + (l.length > 0 ? " " + l : l);
      continue;
    }
    let x = !!g, b = r(x ? m.substring(0, g) : m);
    if (!b) {
      if (!x) {
        l = d + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (b = r(m), !b) {
        l = d + (l.length > 0 ? " " + l : l);
        continue;
      }
      x = !1;
    }
    const A = p.length === 0 ? "" : p.length === 1 ? p[0] : o(p).join(":"), w = h ? A + Ss : A, S = w + b;
    if (s.indexOf(S) > -1)
      continue;
    s.push(S);
    const N = i(b, x);
    for (let C = 0; C < N.length; ++C) {
      const O = N[C];
      s.push(w + O);
    }
    l = d + (l.length > 0 ? " " + l : l);
  }
  return l;
}, gw = (...e) => {
  let t = 0, n, r, i = "";
  for (; t < e.length; )
    (n = e[t++]) && (r = Sh(n)) && (i && (i += " "), i += r);
  return i;
}, Sh = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Sh(e[r])) && (n && (n += " "), n += t);
  return n;
}, xw = (e, ...t) => {
  let n, r, i, o;
  const s = (l) => {
    const c = t.reduce((d, u) => u(d), e());
    return n = hw(c), r = n.cache.get, i = n.cache.set, o = a, a(l);
  }, a = (l) => {
    const c = r(l);
    if (c)
      return c;
    const d = mw(l, n);
    return i(l, d), d;
  };
  return o = s, (...l) => o(gw(...l));
}, bw = [], Ne = (e) => {
  const t = (n) => n[e] || bw;
  return t.isThemeGetter = !0, t;
}, Nh = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, jh = /^\((?:(\w[\w-]*):)?(.+)\)$/i, yw = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, vw = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ww = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Aw = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, kw = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Ew = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Pt = (e) => yw.test(e), ae = (e) => !!e && !Number.isNaN(Number(e)), Rt = (e) => !!e && Number.isInteger(Number(e)), Yo = (e) => e.endsWith("%") && ae(e.slice(0, -1)), vt = (e) => vw.test(e), Mh = () => !0, Cw = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  ww.test(e) && !Aw.test(e)
), Ha = () => !1, Sw = (e) => kw.test(e), Nw = (e) => Ew.test(e), jw = (e) => !_(e) && !$(e), Mw = (e) => Vt(e, Rh, Ha), _ = (e) => Nh.test(e), Xt = (e) => Vt(e, Dh, Cw), Cc = (e) => Vt(e, Bw, ae), Iw = (e) => Vt(e, Th, Mh), Pw = (e) => Vt(e, Oh, Ha), Sc = (e) => Vt(e, Ih, Ha), Rw = (e) => Vt(e, Ph, Nw), ei = (e) => Vt(e, zh, Sw), $ = (e) => jh.test(e), Un = (e) => fn(e, Dh), Dw = (e) => fn(e, Oh), Nc = (e) => fn(e, Ih), Ow = (e) => fn(e, Rh), Tw = (e) => fn(e, Ph), ti = (e) => fn(e, zh, !0), zw = (e) => fn(e, Th, !0), Vt = (e, t, n) => {
  const r = Nh.exec(e);
  return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, fn = (e, t, n = !1) => {
  const r = jh.exec(e);
  return r ? r[1] ? t(r[1]) : n : !1;
}, Ih = (e) => e === "position" || e === "percentage", Ph = (e) => e === "image" || e === "url", Rh = (e) => e === "length" || e === "size" || e === "bg-size", Dh = (e) => e === "length", Bw = (e) => e === "number", Oh = (e) => e === "family-name", Th = (e) => e === "number" || e === "weight", zh = (e) => e === "shadow", Lw = () => {
  const e = Ne("color"), t = Ne("font"), n = Ne("text"), r = Ne("font-weight"), i = Ne("tracking"), o = Ne("leading"), s = Ne("breakpoint"), a = Ne("container"), l = Ne("spacing"), c = Ne("radius"), d = Ne("shadow"), u = Ne("inset-shadow"), p = Ne("text-shadow"), h = Ne("drop-shadow"), m = Ne("blur"), g = Ne("perspective"), x = Ne("aspect"), b = Ne("ease"), A = Ne("animate"), w = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], S = () => [
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
  ], N = () => [...S(), $, _], C = () => ["auto", "hidden", "clip", "visible", "scroll"], O = () => ["auto", "contain", "none"], D = () => [$, _, l], z = () => [Pt, "full", "auto", ...D()], E = () => [Rt, "none", "subgrid", $, _], P = () => ["auto", {
    span: ["full", Rt, $, _]
  }, Rt, $, _], T = () => [Rt, "auto", $, _], Y = () => ["auto", "min", "max", "fr", $, _], R = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], j = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], I = () => ["auto", ...D()], F = () => [Pt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...D()], B = () => [Pt, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...D()], L = () => [Pt, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...D()], y = () => [e, $, _], M = () => [...S(), Nc, Sc, {
    position: [$, _]
  }], U = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], k = () => ["auto", "cover", "contain", Ow, Mw, {
    size: [$, _]
  }], X = () => [Yo, Un, Xt], K = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    $,
    _
  ], W = () => ["", ae, Un, Xt], Z = () => ["solid", "dashed", "dotted", "double"], q = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ee = () => [ae, Yo, Nc, Sc], le = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    m,
    $,
    _
  ], Ee = () => ["none", ae, $, _], Me = () => ["none", ae, $, _], Se = () => [ae, $, _], It = () => [Pt, "full", ...D()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [vt],
      breakpoint: [vt],
      color: [Mh],
      container: [vt],
      "drop-shadow": [vt],
      ease: ["in", "out", "in-out"],
      font: [jw],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [vt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [vt],
      shadow: [vt],
      spacing: ["px", ae],
      text: [vt],
      "text-shadow": [vt],
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
        aspect: ["auto", "square", Pt, _, $, x]
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
        columns: [ae, _, $, a]
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
        object: N()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: C()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": C()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": C()
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
        inset: z()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": z()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": z()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": z(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: z()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": z(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: z()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": z()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": z()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: z()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: z()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: z()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: z()
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
        z: [Rt, "auto", $, _]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Pt, "full", "auto", a, ...D()]
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
        flex: [ae, Pt, "auto", "initial", "none", _]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", ae, $, _]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", ae, $, _]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Rt, "first", "last", "none", $, _]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": E()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: P()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": T()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": T()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": E()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: P()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": T()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": T()
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
        "auto-cols": Y()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Y()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: D()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": D()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": D()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...R(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...j(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...j()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...R()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...j(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...j(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": R()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...j(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...j()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: D()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: D()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: D()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: D()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: D()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: D()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: D()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: D()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: D()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: D()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: D()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: I()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: I()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: I()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: I()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: I()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: I()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: I()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: I()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: I()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: I()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: I()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": D()
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
        "space-y": D()
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
        inline: ["auto", ...B()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...B()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...B()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...L()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...L()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...L()]
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
        text: ["base", n, Un, Xt]
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
        font: [r, zw, Iw]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Yo, _]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Dw, Pw, t]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [_]
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
        tracking: [i, $, _]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [ae, "none", $, Cc]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          o,
          ...D()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", $, _]
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
        list: ["disc", "decimal", "none", $, _]
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
        placeholder: y()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: y()
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
        decoration: [...Z(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [ae, "from-font", "auto", $, Xt]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: y()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [ae, "auto", $, _]
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
        indent: D()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", $, _]
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
        content: ["none", $, _]
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
        bg: M()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: U()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: k()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Rt, $, _],
          radial: ["", $, _],
          conic: [Rt, $, _]
        }, Tw, Rw]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: y()
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
        from: y()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: y()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: y()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: K()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": K()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": K()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": K()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": K()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": K()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": K()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": K()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": K()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": K()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": K()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": K()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": K()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": K()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": K()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: W()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": W()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": W()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": W()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": W()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": W()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": W()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": W()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": W()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": W()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": W()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": W()
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
        "divide-y": W()
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
        border: [...Z(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...Z(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: y()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": y()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": y()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": y()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": y()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": y()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": y()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": y()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": y()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": y()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": y()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: y()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...Z(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [ae, $, _]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", ae, Un, Xt]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: y()
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
          d,
          ti,
          ei
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: y()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", u, ti, ei]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": y()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: W()
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
        ring: y()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [ae, Xt]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": y()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": W()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": y()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", p, ti, ei]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": y()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [ae, $, _]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...q(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": q()
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
        "mask-linear": [ae]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ee()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ee()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": y()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": y()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ee()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ee()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": y()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": y()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ee()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ee()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": y()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": y()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ee()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ee()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": y()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": y()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ee()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ee()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": y()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": y()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ee()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ee()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": y()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": y()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ee()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ee()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": y()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": y()
      }],
      "mask-image-radial": [{
        "mask-radial": [$, _]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ee()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ee()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": y()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": y()
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
        "mask-radial-at": S()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [ae]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ee()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ee()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": y()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": y()
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
        mask: M()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: U()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: k()
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
        mask: ["none", $, _]
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
          $,
          _
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: le()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [ae, $, _]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [ae, $, _]
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
          ti,
          ei
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": y()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", ae, $, _]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [ae, $, _]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", ae, $, _]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [ae, $, _]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", ae, $, _]
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
          $,
          _
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": le()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [ae, $, _]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [ae, $, _]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", ae, $, _]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [ae, $, _]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", ae, $, _]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [ae, $, _]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [ae, $, _]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", ae, $, _]
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
        "border-spacing": D()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": D()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": D()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", $, _]
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
        duration: [ae, "initial", $, _]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", b, $, _]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [ae, $, _]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", A, $, _]
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
        perspective: [g, $, _]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": N()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: Ee()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Ee()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Ee()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Ee()
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
        skew: Se()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Se()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Se()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [$, _, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: N()
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
        translate: It()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": It()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": It()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": It()
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
        accent: y()
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
        caret: y()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", $, _]
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
        "scroll-m": D()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": D()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": D()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": D()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": D()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": D()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": D()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": D()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": D()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": D()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": D()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": D()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": D()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": D()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": D()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": D()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": D()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": D()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": D()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": D()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": D()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": D()
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
        "will-change": ["auto", "scroll", "contents", "transform", $, _]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...y()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [ae, Un, Xt, Cc]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...y()]
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
}, Fw = /* @__PURE__ */ xw(Lw);
function H(...e) {
  return Fw(fd(e));
}
const Gw = hg(
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
  const o = r ? pg : "button";
  return /* @__PURE__ */ f.jsx(
    o,
    {
      "data-slot": "button",
      "data-variant": t,
      "data-size": n,
      className: H(Gw({ variant: t, size: n, className: e })),
      ...i
    }
  );
}
function en({ className: e, type: t, ...n }) {
  return /* @__PURE__ */ f.jsx(
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
function Cn({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    zv,
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
function Yw({
  className: e,
  orientation: t = "horizontal",
  decorative: n = !0,
  ...r
}) {
  return /* @__PURE__ */ f.jsx(
    Kv,
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
const Bh = (...e) => e.filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n).join(" ").trim();
const Hw = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Uw = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
const jc = (e) => {
  const t = Uw(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
var Ho = {
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
const Qw = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
  return !1;
}, Zw = Nt({}), Vw = () => qe(Zw), Ww = Qi(
  ({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: i = "", children: o, iconNode: s, ...a }, l) => {
    const {
      size: c = 24,
      strokeWidth: d = 2,
      absoluteStrokeWidth: u = !1,
      color: p = "currentColor",
      className: h = ""
    } = Vw() ?? {}, m = r ?? u ? Number(n ?? d) * 24 / Number(t ?? c) : n ?? d;
    return bi(
      "svg",
      {
        ref: l,
        ...Ho,
        width: t ?? c ?? Ho.width,
        height: t ?? c ?? Ho.height,
        stroke: e ?? p,
        strokeWidth: m,
        className: Bh("lucide", h, i),
        ...!o && !Qw(a) && { "aria-hidden": "true" },
        ...a
      },
      [
        ...s.map(([g, x]) => bi(g, x)),
        ...Array.isArray(o) ? o : [o]
      ]
    );
  }
);
const xe = (e, t) => {
  const n = Qi(
    ({ className: r, ...i }, o) => bi(Ww, {
      ref: o,
      iconNode: t,
      className: Bh(
        `lucide-${Hw(jc(e))}`,
        `lucide-${e}`,
        r
      ),
      ...i
    })
  );
  return n.displayName = jc(e), n;
};
const Jw = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], qw = xe("arrow-left", Jw);
const Kw = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
], Lh = xe("bell", Kw);
const Xw = [
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
], Or = xe("book-open-text", Xw);
const _w = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Ua = xe("check", _w);
const $w = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Qa = xe("chevron-down", $w);
const e0 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], Fh = xe("chevron-left", e0);
const t0 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Lt = xe("chevron-right", t0);
const n0 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], Ns = xe("chevron-up", n0);
const r0 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], i0 = xe("circle-alert", r0);
const o0 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], s0 = xe("circle-check", o0);
const a0 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]], l0 = xe("circle", a0);
const c0 = [
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
], u0 = xe("clipboard-list", c0);
const d0 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
], f0 = xe("clock", d0);
const h0 = [
  ["path", { d: "m15 15 6 6", key: "1s409w" }],
  ["path", { d: "m15 9 6-6", key: "ko1vev" }],
  ["path", { d: "M21 16v5h-5", key: "1ck2sf" }],
  ["path", { d: "M21 8V3h-5", key: "1qoq8a" }],
  ["path", { d: "M3 16v5h5", key: "1t08am" }],
  ["path", { d: "m3 21 6-6", key: "wwnumi" }],
  ["path", { d: "M3 8V3h5", key: "1ln10m" }],
  ["path", { d: "M9 9 3 3", key: "v551iv" }]
], Mc = xe("expand", h0);
const p0 = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
], m0 = xe("hash", p0);
const g0 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
], x0 = xe("info", g0);
const b0 = [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }]
], y0 = xe("languages", b0);
const v0 = [
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 19h8", key: "c3s6r1" }],
  ["path", { d: "M3 10a2 2 0 0 0 2 2h3", key: "1npucw" }],
  ["path", { d: "M3 5v12a2 2 0 0 0 2 2h3", key: "x1gjn2" }]
], w0 = xe("list-tree", v0);
const A0 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Za = xe("loader-circle", A0);
const k0 = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
], js = xe("monitor", k0);
const E0 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], ji = xe("moon", E0);
const C0 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
], Ic = xe("panel-right", C0);
const S0 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], N0 = xe("plus", S0);
const j0 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], M0 = xe("refresh-cw", j0);
const I0 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
], P0 = xe("save", I0);
const R0 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], D0 = xe("search", R0);
const O0 = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
], T0 = xe("sliders-horizontal", O0);
const z0 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], Mi = xe("sun", z0);
const B0 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
], L0 = xe("triangle-alert", B0);
const F0 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
], G0 = xe("user", F0);
const Y0 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Tr = xe("x", Y0), ne = (e) => typeof e == "string", Qn = () => {
  let e, t;
  const n = new Promise((r, i) => {
    e = r, t = i;
  });
  return n.resolve = e, n.reject = t, n;
}, Pc = (e) => e == null ? "" : String(e), H0 = (e, t, n) => {
  e.forEach((r) => {
    t[r] && (n[r] = t[r]);
  });
}, U0 = /###/g, Rc = (e) => e && e.includes("###") ? e.replace(U0, ".") : e, Dc = (e) => !e || ne(e), er = (e, t, n) => {
  const r = ne(t) ? t.split(".") : t;
  let i = 0;
  for (; i < r.length - 1; ) {
    if (Dc(e)) return {};
    const o = Rc(r[i]);
    !e[o] && n && (e[o] = new n()), Object.prototype.hasOwnProperty.call(e, o) ? e = e[o] : e = {}, ++i;
  }
  return Dc(e) ? {} : {
    obj: e,
    k: Rc(r[i])
  };
}, Oc = (e, t, n) => {
  const {
    obj: r,
    k: i
  } = er(e, t, Object);
  if (r !== void 0 || t.length === 1) {
    r[i] = n;
    return;
  }
  let o = t[t.length - 1], s = t.slice(0, t.length - 1), a = er(e, s, Object);
  for (; a.obj === void 0 && s.length; )
    o = `${s[s.length - 1]}.${o}`, s = s.slice(0, s.length - 1), a = er(e, s, Object), a?.obj && typeof a.obj[`${a.k}.${o}`] < "u" && (a.obj = void 0);
  a.obj[`${a.k}.${o}`] = n;
}, Q0 = (e, t, n, r) => {
  const {
    obj: i,
    k: o
  } = er(e, t, Object);
  i[o] = i[o] || [], i[o].push(n);
}, Ii = (e, t) => {
  const {
    obj: n,
    k: r
  } = er(e, t);
  if (n && Object.prototype.hasOwnProperty.call(n, r))
    return n[r];
}, Z0 = (e, t, n) => {
  const r = Ii(e, n);
  return r !== void 0 ? r : Ii(t, n);
}, Gh = (e, t, n) => {
  for (const r in t)
    r !== "__proto__" && r !== "constructor" && (r in e ? ne(e[r]) || e[r] instanceof String || ne(t[r]) || t[r] instanceof String ? n && (e[r] = t[r]) : Gh(e[r], t[r], n) : e[r] = t[r]);
  return e;
}, wt = (e) => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), V0 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
}, W0 = (e) => ne(e) ? e.replace(/[&<>"'\/]/g, (t) => V0[t]) : e;
class J0 {
  constructor(t) {
    this.capacity = t, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(t) {
    const n = this.regExpMap.get(t);
    if (n !== void 0)
      return n;
    const r = new RegExp(t);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(t, r), this.regExpQueue.push(t), r;
  }
}
const q0 = [" ", ",", "?", "!", ";"], K0 = new J0(20), X0 = (e, t, n) => {
  t = t || "", n = n || "";
  const r = q0.filter((s) => !t.includes(s) && !n.includes(s));
  if (r.length === 0) return !0;
  const i = K0.getRegExp(`(${r.map((s) => s === "?" ? "\\?" : s).join("|")})`);
  let o = !i.test(e);
  if (!o) {
    const s = e.indexOf(n);
    s > 0 && !i.test(e.substring(0, s)) && (o = !0);
  }
  return o;
}, Ms = (e, t, n = ".") => {
  if (!e) return;
  if (e[t])
    return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0;
  const r = t.split(n);
  let i = e;
  for (let o = 0; o < r.length; ) {
    if (!i || typeof i != "object")
      return;
    let s, a = "";
    for (let l = o; l < r.length; ++l)
      if (l !== o && (a += n), a += r[l], s = i[a], s !== void 0) {
        if (["string", "number", "boolean"].includes(typeof s) && l < r.length - 1)
          continue;
        o += l - o + 1;
        break;
      }
    i = s;
  }
  return i;
}, hr = (e) => e?.replace(/_/g, "-"), _0 = {
  type: "logger",
  log(e) {
    this.output("log", e);
  },
  warn(e) {
    this.output("warn", e);
  },
  error(e) {
    this.output("error", e);
  },
  output(e, t) {
    console?.[e]?.apply?.(console, t);
  }
};
class Pi {
  constructor(t, n = {}) {
    this.init(t, n);
  }
  init(t, n = {}) {
    this.prefix = n.prefix || "i18next:", this.logger = t || _0, this.options = n, this.debug = n.debug;
  }
  log(...t) {
    return this.forward(t, "log", "", !0);
  }
  warn(...t) {
    return this.forward(t, "warn", "", !0);
  }
  error(...t) {
    return this.forward(t, "error", "");
  }
  deprecate(...t) {
    return this.forward(t, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(t, n, r, i) {
    return i && !this.debug ? null : (t = t.map((o) => ne(o) ? o.replace(/[\r\n\x00-\x1F\x7F]/g, " ") : o), ne(t[0]) && (t[0] = `${r}${this.prefix} ${t[0]}`), this.logger[n](t));
  }
  create(t) {
    return new Pi(this.logger, {
      prefix: `${this.prefix}:${t}:`,
      ...this.options
    });
  }
  clone(t) {
    return t = t || this.options, t.prefix = t.prefix || this.prefix, new Pi(this.logger, t);
  }
}
var ut = new Pi();
class so {
  constructor() {
    this.observers = {};
  }
  on(t, n) {
    return t.split(" ").forEach((r) => {
      this.observers[r] || (this.observers[r] = /* @__PURE__ */ new Map());
      const i = this.observers[r].get(n) || 0;
      this.observers[r].set(n, i + 1);
    }), this;
  }
  off(t, n) {
    if (this.observers[t]) {
      if (!n) {
        delete this.observers[t];
        return;
      }
      this.observers[t].delete(n);
    }
  }
  once(t, n) {
    const r = (...i) => {
      n(...i), this.off(t, r);
    };
    return this.on(t, r), this;
  }
  emit(t, ...n) {
    this.observers[t] && Array.from(this.observers[t].entries()).forEach(([i, o]) => {
      for (let s = 0; s < o; s++)
        i(...n);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([i, o]) => {
      for (let s = 0; s < o; s++)
        i(t, ...n);
    });
  }
}
class Tc extends so {
  constructor(t, n = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super(), this.data = t || {}, this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(t) {
    this.options.ns.includes(t) || this.options.ns.push(t);
  }
  removeNamespaces(t) {
    const n = this.options.ns.indexOf(t);
    n > -1 && this.options.ns.splice(n, 1);
  }
  getResource(t, n, r, i = {}) {
    const o = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator, s = i.ignoreJSONStructure !== void 0 ? i.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let a;
    t.includes(".") ? a = t.split(".") : (a = [t, n], r && (Array.isArray(r) ? a.push(...r) : ne(r) && o ? a.push(...r.split(o)) : a.push(r)));
    const l = Ii(this.data, a);
    return !l && !n && !r && t.includes(".") && (t = a[0], n = a[1], r = a.slice(2).join(".")), l || !s || !ne(r) ? l : Ms(this.data?.[t]?.[n], r, o);
  }
  addResource(t, n, r, i, o = {
    silent: !1
  }) {
    const s = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator;
    let a = [t, n];
    r && (a = a.concat(s ? r.split(s) : r)), t.includes(".") && (a = t.split("."), i = n, n = a[1]), this.addNamespaces(n), Oc(this.data, a, i), o.silent || this.emit("added", t, n, r, i);
  }
  addResources(t, n, r, i = {
    silent: !1
  }) {
    for (const o in r)
      (ne(r[o]) || Array.isArray(r[o])) && this.addResource(t, n, o, r[o], {
        silent: !0
      });
    i.silent || this.emit("added", t, n, r);
  }
  addResourceBundle(t, n, r, i, o, s = {
    silent: !1,
    skipCopy: !1
  }) {
    let a = [t, n];
    t.includes(".") && (a = t.split("."), i = r, r = n, n = a[1]), this.addNamespaces(n);
    let l = Ii(this.data, a) || {};
    s.skipCopy || (r = JSON.parse(JSON.stringify(r))), i ? Gh(l, r, o) : l = {
      ...l,
      ...r
    }, Oc(this.data, a, l), s.silent || this.emit("added", t, n, r);
  }
  removeResourceBundle(t, n) {
    this.hasResourceBundle(t, n) && delete this.data[t][n], this.removeNamespaces(n), this.emit("removed", t, n);
  }
  hasResourceBundle(t, n) {
    return this.getResource(t, n) !== void 0;
  }
  getResourceBundle(t, n) {
    return n || (n = this.options.defaultNS), this.getResource(t, n);
  }
  getDataByLanguage(t) {
    return this.data[t];
  }
  hasLanguageSomeTranslations(t) {
    const n = this.getDataByLanguage(t);
    return !!(n && Object.keys(n) || []).find((i) => n[i] && Object.keys(n[i]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var Yh = {
  processors: {},
  addPostProcessor(e) {
    this.processors[e.name] = e;
  },
  handle(e, t, n, r, i) {
    return e.forEach((o) => {
      t = this.processors[o]?.process(t, n, r, i) ?? t;
    }), t;
  }
};
const Hh = /* @__PURE__ */ Symbol("i18next/PATH_KEY");
function $0() {
  const e = [], t = /* @__PURE__ */ Object.create(null);
  let n;
  return t.get = (r, i) => (n?.revoke?.(), i === Hh ? e : (e.push(i), n = Proxy.revocable(r, t), n.proxy)), Proxy.revocable(/* @__PURE__ */ Object.create(null), t).proxy;
}
function Sn(e, t) {
  const {
    [Hh]: n
  } = e($0()), r = t?.keySeparator ?? ".", i = t?.nsSeparator ?? ":", o = t?.enableSelector === "strict";
  if (n.length > 1 && i) {
    const s = t?.ns, a = o ? Array.isArray(s) ? s : s ? [s] : null : Array.isArray(s) ? s : null;
    if (a && (o ? a : a.length > 1 ? a.slice(1) : []).includes(n[0]))
      return `${n[0]}${i}${n.slice(1).join(r)}`;
  }
  return n.join(r);
}
const Uo = (e) => !ne(e) && typeof e != "boolean" && typeof e != "number";
class Ri extends so {
  constructor(t, n = {}) {
    super(), H0(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], t, this), this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = ut.create("translator"), this.checkedLoadedFor = {};
  }
  changeLanguage(t) {
    t && (this.language = t);
  }
  exists(t, n = {
    interpolation: {}
  }) {
    const r = {
      ...n
    };
    if (t == null) return !1;
    const i = this.resolve(t, r);
    if (i?.res === void 0) return !1;
    const o = Uo(i.res);
    return !(r.returnObjects === !1 && o);
  }
  extractFromKey(t, n) {
    let r = n.nsSeparator !== void 0 ? n.nsSeparator : this.options.nsSeparator;
    r === void 0 && (r = ":");
    const i = n.keySeparator !== void 0 ? n.keySeparator : this.options.keySeparator;
    let o = n.ns || this.options.defaultNS || [];
    const s = r && t.includes(r), a = !this.options.userDefinedKeySeparator && !n.keySeparator && !this.options.userDefinedNsSeparator && !n.nsSeparator && !X0(t, r, i);
    if (s && !a) {
      const l = t.match(this.interpolator.nestingRegexp);
      if (l && l.length > 0)
        return {
          key: t,
          namespaces: ne(o) ? [o] : o
        };
      const c = t.split(r);
      (r !== i || r === i && this.options.ns.includes(c[0])) && (o = c.shift()), t = c.join(i);
    }
    return {
      key: t,
      namespaces: ne(o) ? [o] : o
    };
  }
  translate(t, n, r) {
    let i = typeof n == "object" ? {
      ...n
    } : n;
    if (typeof i != "object" && this.options.overloadTranslationOptionHandler && (i = this.options.overloadTranslationOptionHandler(arguments)), typeof i == "object" && (i = {
      ...i
    }), i || (i = {}), t == null) return "";
    typeof t == "function" && (t = Sn(t, {
      ...this.options,
      ...i
    })), Array.isArray(t) || (t = [String(t)]), t = t.map((Y) => typeof Y == "function" ? Sn(Y, {
      ...this.options,
      ...i
    }) : String(Y));
    const o = i.returnDetails !== void 0 ? i.returnDetails : this.options.returnDetails, s = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator, {
      key: a,
      namespaces: l
    } = this.extractFromKey(t[t.length - 1], i), c = l[l.length - 1];
    let d = i.nsSeparator !== void 0 ? i.nsSeparator : this.options.nsSeparator;
    d === void 0 && (d = ":");
    const u = i.lng || this.language, p = i.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (u?.toLowerCase() === "cimode")
      return p ? o ? {
        res: `${c}${d}${a}`,
        usedKey: a,
        exactUsedKey: a,
        usedLng: u,
        usedNS: c,
        usedParams: this.getUsedParamsDetails(i)
      } : `${c}${d}${a}` : o ? {
        res: a,
        usedKey: a,
        exactUsedKey: a,
        usedLng: u,
        usedNS: c,
        usedParams: this.getUsedParamsDetails(i)
      } : a;
    const h = this.resolve(t, i);
    let m = h?.res;
    const g = h?.usedKey || a, x = h?.exactUsedKey || a, b = ["[object Number]", "[object Function]", "[object RegExp]"], A = i.joinArrays !== void 0 ? i.joinArrays : this.options.joinArrays, w = !this.i18nFormat || this.i18nFormat.handleAsObject, S = i.count !== void 0 && !ne(i.count), N = Ri.hasDefaultValue(i), C = S ? this.pluralResolver.getSuffix(u, i.count, i) : "", O = i.ordinal && S ? this.pluralResolver.getSuffix(u, i.count, {
      ordinal: !1
    }) : "", D = S && !i.ordinal && i.count === 0, z = D && i[`defaultValue${this.options.pluralSeparator}zero`] || i[`defaultValue${C}`] || i[`defaultValue${O}`] || i.defaultValue;
    let E = m;
    w && !m && N && (E = z);
    const P = Uo(E), T = Object.prototype.toString.apply(E);
    if (w && E && P && !b.includes(T) && !(ne(A) && Array.isArray(E))) {
      if (!i.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const Y = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(g, E, {
          ...i,
          ns: l
        }) : `key '${a} (${this.language})' returned an object instead of string.`;
        return o ? (h.res = Y, h.usedParams = this.getUsedParamsDetails(i), h) : Y;
      }
      if (s) {
        const Y = Array.isArray(E), R = Y ? [] : {}, j = Y ? x : g;
        for (const I in E)
          if (Object.prototype.hasOwnProperty.call(E, I)) {
            const F = `${j}${s}${I}`;
            N && !m ? R[I] = this.translate(F, {
              ...i,
              defaultValue: Uo(z) ? z[I] : void 0,
              joinArrays: !1,
              ns: l
            }) : R[I] = this.translate(F, {
              ...i,
              joinArrays: !1,
              ns: l
            }), R[I] === F && (R[I] = E[I]);
          }
        m = R;
      }
    } else if (w && ne(A) && Array.isArray(m))
      m = m.join(A), m && (m = this.extendTranslation(m, t, i, r));
    else {
      let Y = !1, R = !1;
      !this.isValidLookup(m) && N && (Y = !0, m = z), this.isValidLookup(m) || (R = !0, m = a);
      const I = (i.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && R ? void 0 : m, F = N && z !== m && this.options.updateMissing;
      if (R || Y || F) {
        if (this.logger.log(F ? "updateKey" : "missingKey", u, c, S && !F ? `${a}${this.pluralResolver.getSuffix(u, i.count, i)}` : a, F ? z : m), s) {
          const M = this.resolve(a, {
            ...i,
            keySeparator: !1
          });
          M && M.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let B = [];
        const L = this.languageUtils.getFallbackCodes(this.options.fallbackLng, i.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && L && L[0])
          for (let M = 0; M < L.length; M++)
            B.push(L[M]);
        else this.options.saveMissingTo === "all" ? B = this.languageUtils.toResolveHierarchy(i.lng || this.language) : B.push(i.lng || this.language);
        const y = (M, U, k) => {
          const X = N && k !== m ? k : I;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(M, c, U, X, F, i) : this.backendConnector?.saveMissing && this.backendConnector.saveMissing(M, c, U, X, F, i), this.emit("missingKey", M, c, U, m);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && S ? B.forEach((M) => {
          const U = this.pluralResolver.getSuffixes(M, i);
          D && i[`defaultValue${this.options.pluralSeparator}zero`] && !U.includes(`${this.options.pluralSeparator}zero`) && U.push(`${this.options.pluralSeparator}zero`), U.forEach((k) => {
            y([M], a + k, i[`defaultValue${k}`] || z);
          });
        }) : y(B, a, z));
      }
      m = this.extendTranslation(m, t, i, h, r), R && m === a && this.options.appendNamespaceToMissingKey && (m = `${c}${d}${a}`), (R || Y) && this.options.parseMissingKeyHandler && (m = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${c}${d}${a}` : a, Y ? m : void 0, i));
    }
    return o ? (h.res = m, h.usedParams = this.getUsedParamsDetails(i), h) : m;
  }
  extendTranslation(t, n, r, i, o) {
    if (this.i18nFormat?.parse)
      t = this.i18nFormat.parse(t, {
        ...this.options.interpolation.defaultVariables,
        ...r
      }, r.lng || this.language || i.usedLng, i.usedNS, i.usedKey, {
        resolved: i
      });
    else if (!r.skipInterpolation) {
      r.interpolation && this.interpolator.init({
        ...r,
        interpolation: {
          ...this.options.interpolation,
          ...r.interpolation
        }
      });
      const l = ne(t) && (r?.interpolation?.skipOnVariables !== void 0 ? r.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let c;
      if (l) {
        const u = t.match(this.interpolator.nestingRegexp);
        c = u && u.length;
      }
      let d = r.replace && !ne(r.replace) ? r.replace : r;
      if (this.options.interpolation.defaultVariables && (d = {
        ...this.options.interpolation.defaultVariables,
        ...d
      }), t = this.interpolator.interpolate(t, d, r.lng || this.language || i.usedLng, r), l) {
        const u = t.match(this.interpolator.nestingRegexp), p = u && u.length;
        c < p && (r.nest = !1);
      }
      !r.lng && i && i.res && (r.lng = this.language || i.usedLng), r.nest !== !1 && (t = this.interpolator.nest(t, (...u) => o?.[0] === u[0] && !r.context ? (this.logger.warn(`It seems you are nesting recursively key: ${u[0]} in key: ${n[0]}`), null) : this.translate(...u, n), r)), r.interpolation && this.interpolator.reset();
    }
    const s = r.postProcess || this.options.postProcess, a = ne(s) ? [s] : s;
    return t != null && a?.length && r.applyPostProcessor !== !1 && (t = Yh.handle(a, t, n, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...i,
        usedParams: this.getUsedParamsDetails(r)
      },
      ...r
    } : r, this)), t;
  }
  resolve(t, n = {}) {
    let r, i, o, s, a;
    return ne(t) && (t = [t]), Array.isArray(t) && (t = t.map((l) => typeof l == "function" ? Sn(l, {
      ...this.options,
      ...n
    }) : l)), t.forEach((l) => {
      if (this.isValidLookup(r)) return;
      const c = this.extractFromKey(l, n), d = c.key;
      i = d;
      let u = c.namespaces;
      this.options.fallbackNS && (u = u.concat(this.options.fallbackNS));
      const p = n.count !== void 0 && !ne(n.count), h = p && !n.ordinal && n.count === 0, m = n.context !== void 0 && (ne(n.context) || typeof n.context == "number") && n.context !== "", g = n.lngs ? n.lngs : this.languageUtils.toResolveHierarchy(n.lng || this.language, n.fallbackLng);
      u.forEach((x) => {
        this.isValidLookup(r) || (a = x, !this.checkedLoadedFor[`${g[0]}-${x}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(a) && (this.checkedLoadedFor[`${g[0]}-${x}`] = !0, this.logger.warn(`key "${i}" for languages "${g.join(", ")}" won't get resolved as namespace "${a}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), g.forEach((b) => {
          if (this.isValidLookup(r)) return;
          s = b;
          const A = [d];
          if (this.i18nFormat?.addLookupKeys)
            this.i18nFormat.addLookupKeys(A, d, b, x, n);
          else {
            let S;
            p && (S = this.pluralResolver.getSuffix(b, n.count, n));
            const N = `${this.options.pluralSeparator}zero`, C = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (p && (n.ordinal && S.startsWith(C) && A.push(d + S.replace(C, this.options.pluralSeparator)), A.push(d + S), h && A.push(d + N)), m) {
              const O = `${d}${this.options.contextSeparator || "_"}${n.context}`;
              A.push(O), p && (n.ordinal && S.startsWith(C) && A.push(O + S.replace(C, this.options.pluralSeparator)), A.push(O + S), h && A.push(O + N));
            }
          }
          let w;
          for (; w = A.pop(); )
            this.isValidLookup(r) || (o = w, r = this.getResource(b, x, w, n));
        }));
      });
    }), {
      res: r,
      usedKey: i,
      exactUsedKey: o,
      usedLng: s,
      usedNS: a
    };
  }
  isValidLookup(t) {
    return t !== void 0 && !(!this.options.returnNull && t === null) && !(!this.options.returnEmptyString && t === "");
  }
  getResource(t, n, r, i = {}) {
    return this.i18nFormat?.getResource ? this.i18nFormat.getResource(t, n, r, i) : this.resourceStore.getResource(t, n, r, i);
  }
  getUsedParamsDetails(t = {}) {
    const n = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], r = t.replace && !ne(t.replace);
    let i = r ? t.replace : t;
    if (r && typeof t.count < "u" && (i.count = t.count), this.options.interpolation.defaultVariables && (i = {
      ...this.options.interpolation.defaultVariables,
      ...i
    }), !r) {
      i = {
        ...i
      };
      for (const o of n)
        delete i[o];
    }
    return i;
  }
  static hasDefaultValue(t) {
    const n = "defaultValue";
    for (const r in t)
      if (Object.prototype.hasOwnProperty.call(t, r) && r.startsWith(n) && t[r] !== void 0)
        return !0;
    return !1;
  }
}
class zc {
  constructor(t) {
    this.options = t, this.supportedLngs = this.options.supportedLngs || !1, this.logger = ut.create("languageUtils");
  }
  getScriptPartFromCode(t) {
    if (t = hr(t), !t || !t.includes("-")) return null;
    const n = t.split("-");
    return n.length === 2 || (n.pop(), n[n.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(n.join("-"));
  }
  getLanguagePartFromCode(t) {
    if (t = hr(t), !t || !t.includes("-")) return t;
    const n = t.split("-");
    return this.formatLanguageCode(n[0]);
  }
  formatLanguageCode(t) {
    if (ne(t) && t.includes("-")) {
      let n;
      try {
        n = Intl.getCanonicalLocales(t)[0];
      } catch {
      }
      return n && this.options.lowerCaseLng && (n = n.toLowerCase()), n || (this.options.lowerCaseLng ? t.toLowerCase() : t);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? t.toLowerCase() : t;
  }
  isSupportedCode(t) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (t = this.getLanguagePartFromCode(t)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.includes(t);
  }
  getBestMatchFromCodes(t) {
    if (!t) return null;
    let n;
    return t.forEach((r) => {
      if (n) return;
      const i = this.formatLanguageCode(r);
      (!this.options.supportedLngs || this.isSupportedCode(i)) && (n = i);
    }), !n && this.options.supportedLngs && t.forEach((r) => {
      if (n) return;
      const i = this.getScriptPartFromCode(r);
      if (this.isSupportedCode(i)) return n = i;
      const o = this.getLanguagePartFromCode(r);
      if (this.isSupportedCode(o)) return n = o;
      n = this.options.supportedLngs.find((s) => s === o ? !0 : !s.includes("-") && !o.includes("-") ? !1 : !!(s.includes("-") && !o.includes("-") && s.slice(0, s.indexOf("-")) === o || s.startsWith(o) && o.length > 1));
    }), n || (n = this.getFallbackCodes(this.options.fallbackLng)[0]), n;
  }
  getFallbackCodes(t, n) {
    if (!t) return [];
    if (typeof t == "function" && (t = t(n)), ne(t) && (t = [t]), Array.isArray(t)) return t;
    if (!n) return t.default || [];
    let r = t[n];
    return r || (r = t[this.getScriptPartFromCode(n)]), r || (r = t[this.formatLanguageCode(n)]), r || (r = t[this.getLanguagePartFromCode(n)]), r || (r = t.default), r || [];
  }
  toResolveHierarchy(t, n) {
    const r = this.getFallbackCodes((n === !1 ? [] : n) || this.options.fallbackLng || [], t), i = [], o = (s) => {
      s && (this.isSupportedCode(s) ? i.push(s) : this.logger.warn(`rejecting language code not found in supportedLngs: ${s}`));
    };
    return ne(t) && (t.includes("-") || t.includes("_")) ? (this.options.load !== "languageOnly" && o(this.formatLanguageCode(t)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && o(this.getScriptPartFromCode(t)), this.options.load !== "currentOnly" && o(this.getLanguagePartFromCode(t))) : ne(t) && o(this.formatLanguageCode(t)), r.forEach((s) => {
      i.includes(s) || o(this.formatLanguageCode(s));
    }), i;
  }
}
const Bc = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, Lc = {
  select: (e) => e === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class e1 {
  constructor(t, n = {}) {
    this.languageUtils = t, this.options = n, this.logger = ut.create("pluralResolver"), this.pluralRulesCache = {};
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(t, n = {}) {
    const r = hr(t === "dev" ? "en" : t), i = n.ordinal ? "ordinal" : "cardinal", o = JSON.stringify({
      cleanedCode: r,
      type: i
    });
    if (o in this.pluralRulesCache)
      return this.pluralRulesCache[o];
    let s;
    try {
      s = new Intl.PluralRules(r, {
        type: i
      });
    } catch {
      if (typeof Intl > "u")
        return this.logger.error("No Intl support, please use an Intl polyfill!"), Lc;
      if (!t.match(/-|_/)) return Lc;
      const l = this.languageUtils.getLanguagePartFromCode(t);
      s = this.getRule(l, n);
    }
    return this.pluralRulesCache[o] = s, s;
  }
  needsPlural(t, n = {}) {
    let r = this.getRule(t, n);
    return r || (r = this.getRule("dev", n)), r?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(t, n, r = {}) {
    return this.getSuffixes(t, r).map((i) => `${n}${i}`);
  }
  getSuffixes(t, n = {}) {
    let r = this.getRule(t, n);
    return r || (r = this.getRule("dev", n)), r ? r.resolvedOptions().pluralCategories.sort((i, o) => Bc[i] - Bc[o]).map((i) => `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${i}`) : [];
  }
  getSuffix(t, n, r = {}) {
    const i = this.getRule(t, r);
    return i ? `${this.options.prepend}${r.ordinal ? `ordinal${this.options.prepend}` : ""}${i.select(n)}` : (this.logger.warn(`no plural rule found for: ${t}`), this.getSuffix("dev", n, r));
  }
}
const Fc = (e, t, n, r = ".", i = !0) => {
  let o = Z0(e, t, n);
  return !o && i && ne(n) && (o = Ms(e, n, r), o === void 0 && (o = Ms(t, n, r))), o;
}, Qo = (e) => e.replace(/\$/g, "$$$$");
class Gc {
  constructor(t = {}) {
    this.logger = ut.create("interpolator"), this.options = t, this.format = t?.interpolation?.format || ((n) => n), this.init(t);
  }
  init(t = {}) {
    t.interpolation || (t.interpolation = {
      escapeValue: !0
    });
    const {
      escape: n,
      escapeValue: r,
      useRawValueToEscape: i,
      prefix: o,
      prefixEscaped: s,
      suffix: a,
      suffixEscaped: l,
      formatSeparator: c,
      unescapeSuffix: d,
      unescapePrefix: u,
      nestingPrefix: p,
      nestingPrefixEscaped: h,
      nestingSuffix: m,
      nestingSuffixEscaped: g,
      nestingOptionsSeparator: x,
      maxReplaces: b,
      alwaysFormat: A
    } = t.interpolation;
    this.escape = n !== void 0 ? n : W0, this.escapeValue = r !== void 0 ? r : !0, this.useRawValueToEscape = i !== void 0 ? i : !1, this.prefix = o ? wt(o) : s || "{{", this.suffix = a ? wt(a) : l || "}}", this.formatSeparator = c || ",", this.unescapePrefix = d ? "" : u ? wt(u) : "-", this.unescapeSuffix = this.unescapePrefix ? "" : d ? wt(d) : "", this.nestingPrefix = p ? wt(p) : h || wt("$t("), this.nestingSuffix = m ? wt(m) : g || wt(")"), this.nestingOptionsSeparator = x || ",", this.maxReplaces = b || 1e3, this.alwaysFormat = A !== void 0 ? A : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const t = (n, r) => n?.source === r ? (n.lastIndex = 0, n) : new RegExp(r, "g");
    this.regexp = t(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = t(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = t(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(t, n, r, i) {
    let o, s, a;
    const l = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, c = (h) => {
      if (!h.includes(this.formatSeparator)) {
        const b = Fc(n, l, h, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(b, void 0, r, {
          ...i,
          ...n,
          interpolationkey: h
        }) : b;
      }
      const m = h.split(this.formatSeparator), g = m.shift().trim(), x = m.join(this.formatSeparator).trim();
      return this.format(Fc(n, l, g, this.options.keySeparator, this.options.ignoreJSONStructure), x, r, {
        ...i,
        ...n,
        interpolationkey: g
      });
    };
    this.resetRegExp(), !this.escapeValue && typeof t == "string" && /\$t\([^)]*\{[^}]*\{\{/.test(t) && this.logger.warn("nesting options string contains interpolated variables with escapeValue: false — if any of those values are attacker-controlled they can inject additional nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing it to t(), or keep escapeValue: true.");
    const d = i?.missingInterpolationHandler || this.options.missingInterpolationHandler, u = i?.interpolation?.skipOnVariables !== void 0 ? i.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (h) => Qo(h)
    }, {
      regex: this.regexp,
      safeValue: (h) => this.escapeValue ? Qo(this.escape(h)) : Qo(h)
    }].forEach((h) => {
      for (a = 0; o = h.regex.exec(t); ) {
        const m = o[1].trim();
        if (s = c(m), s === void 0)
          if (typeof d == "function") {
            const x = d(t, o, i);
            s = ne(x) ? x : "";
          } else if (i && Object.prototype.hasOwnProperty.call(i, m))
            s = "";
          else if (u) {
            s = o[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${m} for interpolating ${t}`), s = "";
        else !ne(s) && !this.useRawValueToEscape && (s = Pc(s));
        const g = h.safeValue(s);
        if (t = t.replace(o[0], g), u ? (h.regex.lastIndex += s.length, h.regex.lastIndex -= o[0].length) : h.regex.lastIndex = 0, a++, a >= this.maxReplaces)
          break;
      }
    }), t;
  }
  nest(t, n, r = {}) {
    let i, o, s;
    const a = (l, c) => {
      const d = this.nestingOptionsSeparator;
      if (!l.includes(d)) return l;
      const u = l.split(new RegExp(`${wt(d)}[ ]*{`));
      let p = `{${u[1]}`;
      l = u[0], p = this.interpolate(p, s);
      const h = p.match(/'/g), m = p.match(/"/g);
      ((h?.length ?? 0) % 2 === 0 && !m || (m?.length ?? 0) % 2 !== 0) && (p = p.replace(/'/g, '"'));
      try {
        s = JSON.parse(p), c && (s = {
          ...c,
          ...s
        });
      } catch (g) {
        return this.logger.warn(`failed parsing options string in nesting for key ${l}`, g), `${l}${d}${p}`;
      }
      return s.defaultValue && s.defaultValue.includes(this.prefix) && delete s.defaultValue, l;
    };
    for (; i = this.nestingRegexp.exec(t); ) {
      let l = [];
      s = {
        ...r
      }, s = s.replace && !ne(s.replace) ? s.replace : s, s.applyPostProcessor = !1, delete s.defaultValue;
      const c = /{.*}/.test(i[1]) ? i[1].lastIndexOf("}") + 1 : i[1].indexOf(this.formatSeparator);
      if (c !== -1 && (l = i[1].slice(c).split(this.formatSeparator).map((d) => d.trim()).filter(Boolean), i[1] = i[1].slice(0, c)), o = n(a.call(this, i[1].trim(), s), s), o && i[0] === t && !ne(o)) return o;
      ne(o) || (o = Pc(o)), o || (this.logger.warn(`missed to resolve ${i[1]} for nesting ${t}`), o = ""), l.length && (o = l.reduce((d, u) => this.format(d, u, r.lng, {
        ...r,
        interpolationkey: i[1].trim()
      }), o.trim())), t = t.replace(i[0], o), this.regexp.lastIndex = 0;
    }
    return t;
  }
}
const t1 = (e) => {
  let t = e.toLowerCase().trim();
  const n = {};
  if (e.includes("(")) {
    const r = e.split("(");
    t = r[0].toLowerCase().trim();
    const i = r[1].slice(0, -1);
    t === "currency" && !i.includes(":") ? n.currency || (n.currency = i.trim()) : t === "relativetime" && !i.includes(":") ? n.range || (n.range = i.trim()) : i.split(";").forEach((s) => {
      if (s) {
        const [a, ...l] = s.split(":"), c = l.join(":").trim().replace(/^'+|'+$/g, ""), d = a.trim();
        n[d] || (n[d] = c), c === "false" && (n[d] = !1), c === "true" && (n[d] = !0), isNaN(c) || (n[d] = parseInt(c, 10));
      }
    });
  }
  return {
    formatName: t,
    formatOptions: n
  };
}, Yc = (e) => {
  const t = {};
  return (n, r, i) => {
    let o = i;
    i && i.interpolationkey && i.formatParams && i.formatParams[i.interpolationkey] && i[i.interpolationkey] && (o = {
      ...o,
      [i.interpolationkey]: void 0
    });
    const s = r + JSON.stringify(o);
    let a = t[s];
    return a || (a = e(hr(r), i), t[s] = a), a(n);
  };
}, n1 = (e) => (t, n, r) => e(hr(n), r)(t);
class r1 {
  constructor(t = {}) {
    this.logger = ut.create("formatter"), this.options = t, this.init(t);
  }
  init(t, n = {
    interpolation: {}
  }) {
    this.formatSeparator = n.interpolation.formatSeparator || ",";
    const r = n.cacheInBuiltFormats ? Yc : n1;
    this.formats = {
      number: r((i, o) => {
        const s = new Intl.NumberFormat(i, {
          ...o
        });
        return (a) => s.format(a);
      }),
      currency: r((i, o) => {
        const s = new Intl.NumberFormat(i, {
          ...o,
          style: "currency"
        });
        return (a) => s.format(a);
      }),
      datetime: r((i, o) => {
        const s = new Intl.DateTimeFormat(i, {
          ...o
        });
        return (a) => s.format(a);
      }),
      relativetime: r((i, o) => {
        const s = new Intl.RelativeTimeFormat(i, {
          ...o
        });
        return (a) => s.format(a, o.range || "day");
      }),
      list: r((i, o) => {
        const s = new Intl.ListFormat(i, {
          ...o
        });
        return (a) => s.format(a);
      })
    };
  }
  add(t, n) {
    this.formats[t.toLowerCase().trim()] = n;
  }
  addCached(t, n) {
    this.formats[t.toLowerCase().trim()] = Yc(n);
  }
  format(t, n, r, i = {}) {
    if (!n || t == null) return t;
    const o = n.split(this.formatSeparator);
    if (o.length > 1 && o[0].indexOf("(") > 1 && !o[0].includes(")") && o.find((a) => a.includes(")"))) {
      const a = o.findIndex((l) => l.includes(")"));
      o[0] = [o[0], ...o.splice(1, a)].join(this.formatSeparator);
    }
    return o.reduce((a, l) => {
      const {
        formatName: c,
        formatOptions: d
      } = t1(l);
      if (this.formats[c]) {
        let u = a;
        try {
          const p = i?.formatParams?.[i.interpolationkey] || {}, h = p.locale || p.lng || i.locale || i.lng || r;
          u = this.formats[c](a, h, {
            ...d,
            ...i,
            ...p
          });
        } catch (p) {
          this.logger.warn(p);
        }
        return u;
      } else
        this.logger.warn(`there was no format function for ${c}`);
      return a;
    }, t);
  }
}
const i1 = (e, t) => {
  e.pending[t] !== void 0 && (delete e.pending[t], e.pendingCount--);
};
class o1 extends so {
  constructor(t, n, r, i = {}) {
    super(), this.backend = t, this.store = n, this.services = r, this.languageUtils = r.languageUtils, this.options = i, this.logger = ut.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = i.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = i.maxRetries >= 0 ? i.maxRetries : 5, this.retryTimeout = i.retryTimeout >= 1 ? i.retryTimeout : 350, this.state = {}, this.queue = [], this.backend?.init?.(r, i.backend, i);
  }
  queueLoad(t, n, r, i) {
    const o = {}, s = {}, a = {}, l = {};
    return t.forEach((c) => {
      let d = !0;
      n.forEach((u) => {
        const p = `${c}|${u}`;
        !r.reload && this.store.hasResourceBundle(c, u) ? this.state[p] = 2 : this.state[p] < 0 || (this.state[p] === 1 ? s[p] === void 0 && (s[p] = !0) : (this.state[p] = 1, d = !1, s[p] === void 0 && (s[p] = !0), o[p] === void 0 && (o[p] = !0), l[u] === void 0 && (l[u] = !0)));
      }), d || (a[c] = !0);
    }), (Object.keys(o).length || Object.keys(s).length) && this.queue.push({
      pending: s,
      pendingCount: Object.keys(s).length,
      loaded: {},
      errors: [],
      callback: i
    }), {
      toLoad: Object.keys(o),
      pending: Object.keys(s),
      toLoadLanguages: Object.keys(a),
      toLoadNamespaces: Object.keys(l)
    };
  }
  loaded(t, n, r) {
    const i = t.split("|"), o = i[0], s = i[1];
    n && this.emit("failedLoading", o, s, n), !n && r && this.store.addResourceBundle(o, s, r, void 0, void 0, {
      skipCopy: !0
    }), this.state[t] = n ? -1 : 2, n && r && (this.state[t] = 0);
    const a = {};
    this.queue.forEach((l) => {
      Q0(l.loaded, [o], s), i1(l, t), n && l.errors.push(n), l.pendingCount === 0 && !l.done && (Object.keys(l.loaded).forEach((c) => {
        a[c] || (a[c] = {});
        const d = l.loaded[c];
        d.length && d.forEach((u) => {
          a[c][u] === void 0 && (a[c][u] = !0);
        });
      }), l.done = !0, l.errors.length ? l.callback(l.errors) : l.callback());
    }), this.emit("loaded", a), this.queue = this.queue.filter((l) => !l.done);
  }
  read(t, n, r, i = 0, o = this.retryTimeout, s) {
    if (!t.length) return s(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: t,
        ns: n,
        fcName: r,
        tried: i,
        wait: o,
        callback: s
      });
      return;
    }
    this.readingCalls++;
    const a = (c, d) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const u = this.waitingReads.shift();
        this.read(u.lng, u.ns, u.fcName, u.tried, u.wait, u.callback);
      }
      if (c && d && i < this.maxRetries) {
        setTimeout(() => {
          this.read(t, n, r, i + 1, o * 2, s);
        }, o);
        return;
      }
      s(c, d);
    }, l = this.backend[r].bind(this.backend);
    if (l.length === 2) {
      try {
        const c = l(t, n);
        c && typeof c.then == "function" ? c.then((d) => a(null, d)).catch(a) : a(null, c);
      } catch (c) {
        a(c);
      }
      return;
    }
    return l(t, n, a);
  }
  prepareLoading(t, n, r = {}, i) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), i && i();
    ne(t) && (t = this.languageUtils.toResolveHierarchy(t)), ne(n) && (n = [n]);
    const o = this.queueLoad(t, n, r, i);
    if (!o.toLoad.length)
      return o.pending.length || i(), null;
    o.toLoad.forEach((s) => {
      this.loadOne(s);
    });
  }
  load(t, n, r) {
    this.prepareLoading(t, n, {}, r);
  }
  reload(t, n, r) {
    this.prepareLoading(t, n, {
      reload: !0
    }, r);
  }
  loadOne(t, n = "") {
    const r = t.split("|"), i = r[0], o = r[1];
    this.read(i, o, "read", void 0, void 0, (s, a) => {
      s && this.logger.warn(`${n}loading namespace ${o} for language ${i} failed`, s), !s && a && this.logger.log(`${n}loaded namespace ${o} for language ${i}`, a), this.loaded(t, s, a);
    });
  }
  saveMissing(t, n, r, i, o, s = {}, a = () => {
  }) {
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(n)) {
      this.logger.warn(`did not save key "${r}" as the namespace "${n}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(r == null || r === "")) {
      if (this.backend?.create) {
        const l = {
          ...s,
          isUpdate: o
        }, c = this.backend.create.bind(this.backend);
        if (c.length < 6)
          try {
            let d;
            c.length === 5 ? d = c(t, n, r, i, l) : d = c(t, n, r, i), d && typeof d.then == "function" ? d.then((u) => a(null, u)).catch(a) : a(null, d);
          } catch (d) {
            a(d);
          }
        else
          c(t, n, r, i, a, l);
      }
      !t || !t[0] || this.store.addResource(t[0], n, r, i);
    }
  }
}
const Zo = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  enableSelector: !1,
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (e) => {
    let t = {};
    if (typeof e[1] == "object" && (t = e[1]), ne(e[1]) && (t.defaultValue = e[1]), ne(e[2]) && (t.tDescription = e[2]), typeof e[2] == "object" || typeof e[3] == "object") {
      const n = e[3] || e[2];
      Object.keys(n).forEach((r) => {
        t[r] = n[r];
      });
    }
    return t;
  },
  interpolation: {
    escapeValue: !0,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  },
  cacheInBuiltFormats: !0
}), Hc = (e) => (ne(e.ns) && (e.ns = [e.ns]), ne(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]), ne(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]), e.supportedLngs && !e.supportedLngs.includes("cimode") && (e.supportedLngs = e.supportedLngs.concat(["cimode"])), e), ni = () => {
}, s1 = (e) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach((n) => {
    typeof e[n] == "function" && (e[n] = e[n].bind(e));
  });
};
class tr extends so {
  constructor(t = {}, n) {
    if (super(), this.options = Hc(t), this.services = {}, this.logger = ut, this.modules = {
      external: []
    }, s1(this), n && !this.isInitialized && !t.isClone) {
      if (!this.options.initAsync)
        return this.init(t, n), this;
      setTimeout(() => {
        this.init(t, n);
      }, 0);
    }
  }
  init(t = {}, n) {
    this.isInitializing = !0, typeof t == "function" && (n = t, t = {}), t.defaultNS == null && t.ns && (ne(t.ns) ? t.defaultNS = t.ns : t.ns.includes("translation") || (t.defaultNS = t.ns[0]));
    const r = Zo();
    this.options = {
      ...r,
      ...this.options,
      ...Hc(t)
    }, this.options.interpolation = {
      ...r.interpolation,
      ...this.options.interpolation
    }, t.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = t.keySeparator), t.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = t.nsSeparator), typeof this.options.overloadTranslationOptionHandler != "function" && (this.options.overloadTranslationOptionHandler = r.overloadTranslationOptionHandler);
    const i = (c) => c ? typeof c == "function" ? new c() : c : null;
    if (!this.options.isClone) {
      this.modules.logger ? ut.init(i(this.modules.logger), this.options) : ut.init(null, this.options);
      let c;
      this.modules.formatter ? c = this.modules.formatter : c = r1;
      const d = new zc(this.options);
      this.store = new Tc(this.options.resources, this.options);
      const u = this.services;
      u.logger = ut, u.resourceStore = this.store, u.languageUtils = d, u.pluralResolver = new e1(d, {
        prepend: this.options.pluralSeparator
      }), c && (u.formatter = i(c), u.formatter.init && u.formatter.init(u, this.options), this.options.interpolation.format = u.formatter.format.bind(u.formatter)), u.interpolator = new Gc(this.options), u.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, u.backendConnector = new o1(i(this.modules.backend), u.resourceStore, u, this.options), u.backendConnector.on("*", (p, ...h) => {
        this.emit(p, ...h);
      }), this.modules.languageDetector && (u.languageDetector = i(this.modules.languageDetector), u.languageDetector.init && u.languageDetector.init(u, this.options.detection, this.options)), this.modules.i18nFormat && (u.i18nFormat = i(this.modules.i18nFormat), u.i18nFormat.init && u.i18nFormat.init(this)), this.translator = new Ri(this.services, this.options), this.translator.on("*", (p, ...h) => {
        this.emit(p, ...h);
      }), this.modules.external.forEach((p) => {
        p.init && p.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, n || (n = ni), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const c = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      c.length > 0 && c[0] !== "dev" && (this.options.lng = c[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((c) => {
      this[c] = (...d) => this.store[c](...d);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((c) => {
      this[c] = (...d) => (this.store[c](...d), this);
    });
    const a = Qn(), l = () => {
      const c = (d, u) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), a.resolve(u), n(d, u);
      };
      if ((this.languages || this.isLanguageChangingTo) && !this.isInitialized) return c(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, c);
    };
    return this.options.resources || !this.options.initAsync ? l() : setTimeout(l, 0), a;
  }
  loadResources(t, n = ni) {
    let r = n;
    const i = ne(t) ? t : this.language;
    if (typeof t == "function" && (r = t), !this.options.resources || this.options.partialBundledLanguages) {
      if (i?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return r();
      const o = [], s = (a) => {
        if (!a || a === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(a).forEach((c) => {
          c !== "cimode" && (o.includes(c) || o.push(c));
        });
      };
      i ? s(i) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((l) => s(l)), this.options.preload?.forEach?.((a) => s(a)), this.services.backendConnector.load(o, this.options.ns, (a) => {
        !a && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), r(a);
      });
    } else
      r(null);
  }
  reloadResources(t, n, r) {
    const i = Qn();
    return typeof t == "function" && (r = t, t = void 0), typeof n == "function" && (r = n, n = void 0), t || (t = this.languages), n || (n = this.options.ns), r || (r = ni), this.services.backendConnector.reload(t, n, (o) => {
      i.resolve(), r(o);
    }), i;
  }
  use(t) {
    if (!t) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!t.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return t.type === "backend" && (this.modules.backend = t), (t.type === "logger" || t.log && t.warn && t.error) && (this.modules.logger = t), t.type === "languageDetector" && (this.modules.languageDetector = t), t.type === "i18nFormat" && (this.modules.i18nFormat = t), t.type === "postProcessor" && Yh.addPostProcessor(t), t.type === "formatter" && (this.modules.formatter = t), t.type === "3rdParty" && this.modules.external.push(t), this;
  }
  setResolvedLanguage(t) {
    if (!(!t || !this.languages) && !["cimode", "dev"].includes(t)) {
      for (let n = 0; n < this.languages.length; n++) {
        const r = this.languages[n];
        if (!["cimode", "dev"].includes(r) && this.store.hasLanguageSomeTranslations(r)) {
          this.resolvedLanguage = r;
          break;
        }
      }
      !this.resolvedLanguage && !this.languages.includes(t) && this.store.hasLanguageSomeTranslations(t) && (this.resolvedLanguage = t, this.languages.unshift(t));
    }
  }
  changeLanguage(t, n) {
    this.isLanguageChangingTo = t;
    const r = Qn();
    this.emit("languageChanging", t);
    const i = (a) => {
      this.language = a, this.languages = this.services.languageUtils.toResolveHierarchy(a), this.resolvedLanguage = void 0, this.setResolvedLanguage(a);
    }, o = (a, l) => {
      l ? this.isLanguageChangingTo === t && (i(l), this.translator.changeLanguage(l), this.isLanguageChangingTo = void 0, this.emit("languageChanged", l), this.logger.log("languageChanged", l)) : this.isLanguageChangingTo = void 0, r.resolve((...c) => this.t(...c)), n && n(a, (...c) => this.t(...c));
    }, s = (a) => {
      !t && !a && this.services.languageDetector && (a = []);
      const l = ne(a) ? a : a && a[0], c = this.store.hasLanguageSomeTranslations(l) ? l : this.services.languageUtils.getBestMatchFromCodes(ne(a) ? [a] : a);
      c && (this.language || i(c), this.translator.language || this.translator.changeLanguage(c), this.services.languageDetector?.cacheUserLanguage?.(c)), this.loadResources(c, (d) => {
        o(d, c);
      });
    };
    return !t && this.services.languageDetector && !this.services.languageDetector.async ? s(this.services.languageDetector.detect()) : !t && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(s) : this.services.languageDetector.detect(s) : s(t), r;
  }
  getFixedT(t, n, r, i) {
    const o = i?.scopeNs, s = (a, l, ...c) => {
      let d;
      typeof l != "object" ? d = this.options.overloadTranslationOptionHandler([a, l].concat(c)) : d = {
        ...l
      }, d.lng = d.lng || s.lng, d.lngs = d.lngs || s.lngs;
      const u = d.ns !== void 0 && d.ns !== null;
      d.ns = d.ns || s.ns, d.keyPrefix !== "" && (d.keyPrefix = d.keyPrefix || r || s.keyPrefix);
      const p = {
        ...this.options,
        ...d
      };
      Array.isArray(o) && !u && (p.ns = o), typeof d.keyPrefix == "function" && (d.keyPrefix = Sn(d.keyPrefix, p));
      const h = this.options.keySeparator || ".";
      let m;
      return d.keyPrefix && Array.isArray(a) ? m = a.map((g) => (typeof g == "function" && (g = Sn(g, p)), `${d.keyPrefix}${h}${g}`)) : (typeof a == "function" && (a = Sn(a, p)), m = d.keyPrefix ? `${d.keyPrefix}${h}${a}` : a), this.t(m, d);
    };
    return ne(t) ? s.lng = t : s.lngs = t, s.ns = n, s.keyPrefix = r, s;
  }
  t(...t) {
    return this.translator?.translate(...t);
  }
  exists(...t) {
    return this.translator?.exists(...t);
  }
  setDefaultNamespace(t) {
    this.options.defaultNS = t;
  }
  hasLoadedNamespace(t, n = {}) {
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const r = n.lng || this.resolvedLanguage || this.languages[0], i = this.options ? this.options.fallbackLng : !1, o = this.languages[this.languages.length - 1];
    if (r.toLowerCase() === "cimode") return !0;
    const s = (a, l) => {
      const c = this.services.backendConnector.state[`${a}|${l}`];
      return c === -1 || c === 0 || c === 2;
    };
    if (n.precheck) {
      const a = n.precheck(this, s);
      if (a !== void 0) return a;
    }
    return !!(this.hasResourceBundle(r, t) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || s(r, t) && (!i || s(o, t)));
  }
  loadNamespaces(t, n) {
    const r = Qn();
    return this.options.ns ? (ne(t) && (t = [t]), t.forEach((i) => {
      this.options.ns.includes(i) || this.options.ns.push(i);
    }), this.loadResources((i) => {
      r.resolve(), n && n(i);
    }), r) : (n && n(), Promise.resolve());
  }
  loadLanguages(t, n) {
    const r = Qn();
    ne(t) && (t = [t]);
    const i = this.options.preload || [], o = t.filter((s) => !i.includes(s) && this.services.languageUtils.isSupportedCode(s));
    return o.length ? (this.options.preload = i.concat(o), this.loadResources((s) => {
      r.resolve(), n && n(s);
    }), r) : (n && n(), Promise.resolve());
  }
  dir(t) {
    if (t || (t = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language)), !t) return "rtl";
    try {
      const i = new Intl.Locale(t);
      if (i && i.getTextInfo) {
        const o = i.getTextInfo();
        if (o && o.direction) return o.direction;
      }
    } catch {
    }
    const n = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], r = this.services?.languageUtils || new zc(Zo());
    return t.toLowerCase().indexOf("-latn") > 1 ? "ltr" : n.includes(r.getLanguagePartFromCode(t)) || t.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(t = {}, n) {
    const r = new tr(t, n);
    return r.createInstance = tr.createInstance, r;
  }
  cloneInstance(t = {}, n = ni) {
    const r = t.forkResourceStore;
    r && delete t.forkResourceStore;
    const i = {
      ...this.options,
      ...t,
      isClone: !0
    }, o = new tr(i);
    if ((t.debug !== void 0 || t.prefix !== void 0) && (o.logger = o.logger.clone(t)), ["store", "services", "language"].forEach((a) => {
      o[a] = this[a];
    }), o.services = {
      ...this.services
    }, o.services.utils = {
      hasLoadedNamespace: o.hasLoadedNamespace.bind(o)
    }, r) {
      const a = Object.keys(this.store.data).reduce((l, c) => (l[c] = {
        ...this.store.data[c]
      }, l[c] = Object.keys(l[c]).reduce((d, u) => (d[u] = {
        ...l[c][u]
      }, d), l[c]), l), {});
      o.store = new Tc(a, i), o.services.resourceStore = o.store;
    }
    if (t.interpolation) {
      const l = {
        ...Zo().interpolation,
        ...this.options.interpolation,
        ...t.interpolation
      }, c = {
        ...i,
        interpolation: l
      };
      o.services.interpolator = new Gc(c);
    }
    return o.translator = new Ri(o.services, i), o.translator.on("*", (a, ...l) => {
      o.emit(a, ...l);
    }), o.init(i, n), o.translator.options = i, o.translator.backendConnector.services.utils = {
      hasLoadedNamespace: o.hasLoadedNamespace.bind(o)
    }, o;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const ze = tr.createInstance(), a1 = ze.createInstance;
ze.dir;
ze.init;
ze.loadResources;
ze.reloadResources;
ze.use;
ze.changeLanguage;
ze.getFixedT;
ze.t;
ze.exists;
ze.setDefaultNamespace;
ze.hasLoadedNamespace;
ze.loadNamespaces;
ze.loadLanguages;
const l1 = (e, t, n, r) => {
  const i = [n, {
    code: t,
    ...r || {}
  }];
  if (e?.services?.logger?.forward)
    return e.services.logger.forward(i, "warn", "react-i18next::", !0);
  an(i[0]) && (i[0] = `react-i18next:: ${i[0]}`), e?.services?.logger?.warn ? e.services.logger.warn(...i) : console?.warn && console.warn(...i);
}, Uc = {}, Is = (e, t, n, r) => {
  an(n) && Uc[n] || (an(n) && (Uc[n] = /* @__PURE__ */ new Date()), l1(e, t, n, r));
}, Uh = (e, t) => () => {
  if (e.isInitialized)
    t();
  else {
    const n = () => {
      setTimeout(() => {
        e.off("initialized", n);
      }, 0), t();
    };
    e.on("initialized", n);
  }
}, Ps = (e, t, n) => {
  e.loadNamespaces(t, Uh(e, n));
}, Qc = (e, t, n, r) => {
  if (an(n) && (n = [n]), e.options.preload && e.options.preload.indexOf(t) > -1) return Ps(e, n, r);
  n.forEach((i) => {
    e.options.ns.indexOf(i) < 0 && e.options.ns.push(i);
  }), e.loadLanguages(t, Uh(e, r));
}, c1 = (e, t, n = {}) => !t.languages || !t.languages.length ? (Is(t, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
  languages: t.languages
}), !0) : t.hasLoadedNamespace(e, {
  lng: n.lng,
  precheck: (r, i) => {
    if (n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && r.services.backendConnector.backend && r.isLanguageChangingTo && !i(r.isLanguageChangingTo, e)) return !1;
  }
}), an = (e) => typeof e == "string", u1 = (e) => typeof e == "object" && e !== null, d1 = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, f1 = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
}, h1 = (e) => f1[e], p1 = (e) => e.replace(d1, h1);
let Rs = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: !0,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: !0,
  unescape: p1,
  transDefaultProps: void 0
};
const m1 = (e = {}) => {
  Rs = {
    ...Rs,
    ...e
  };
}, g1 = () => Rs;
let Qh;
const x1 = (e) => {
  Qh = e;
}, b1 = () => Qh, y1 = {
  type: "3rdParty",
  init(e) {
    m1(e.options.react), x1(e);
  }
}, Zh = Nt();
class v1 {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(t) {
    t.forEach((n) => {
      this.usedNamespaces[n] || (this.usedNamespaces[n] = !0);
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
const w1 = (e, t) => {
  if (an(t)) return t;
  if (u1(t) && an(t.defaultValue)) return t.defaultValue;
  if (typeof e == "function") return "";
  if (Array.isArray(e)) {
    const n = e[e.length - 1];
    return typeof n == "function" ? "" : n;
  }
  return e;
}, A1 = {
  t: w1,
  ready: !1
}, k1 = () => () => {
}, E1 = (e, t = {}) => {
  const {
    i18n: n
  } = t, {
    i18n: r,
    defaultNS: i
  } = qe(Zh) || {}, o = n || r || b1();
  o && !o.reportNamespaces && (o.reportNamespaces = new v1()), o || Is(o, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
  const s = be(() => ({
    ...g1(),
    ...o?.options?.react,
    ...t
  }), [o, t]), {
    useSuspense: a,
    keyPrefix: l
  } = s, c = i || o?.options?.defaultNS, d = an(c) ? [c] : c || ["translation"], u = be(() => d, d);
  o?.reportNamespaces?.addUsedNamespaces?.(u);
  const p = pe(0), h = Ye((z) => {
    if (!o) return k1;
    const {
      bindI18n: E,
      bindI18nStore: P
    } = s, T = () => {
      p.current += 1, z();
    };
    return E && o.on(E, T), P && o.store.on(P, T), () => {
      E && E.split(" ").forEach((Y) => o.off(Y, T)), P && P.split(" ").forEach((Y) => o.store.off(Y, T));
    };
  }, [o, s]), m = pe(), g = Ye(() => {
    if (!o)
      return A1;
    const z = !!(o.isInitialized || o.initializedStoreOnce) && u.every((j) => c1(j, o, s)), E = t.lng || o.language, P = p.current, T = m.current;
    if (T && T.ready === z && T.lng === E && T.keyPrefix === l && T.revision === P)
      return T;
    const R = {
      t: o.getFixedT(E, s.nsMode === "fallback" ? u : u[0], l, {
        scopeNs: u
      }),
      ready: z,
      lng: E,
      keyPrefix: l,
      revision: P
    };
    return m.current = R, R;
  }, [o, u, l, s, t.lng]), [x, b] = ge(0), {
    t: A,
    ready: w
  } = Zx.useSyncExternalStore(h, g, g);
  ue(() => {
    if (o && !w && !a) {
      const z = () => b((E) => E + 1);
      t.lng ? Qc(o, t.lng, u, z) : Ps(o, u, z);
    }
  }, [o, t.lng, u, w, a, x]);
  const S = o || {}, N = pe(null), C = pe(), O = (z) => {
    const E = Object.getOwnPropertyDescriptors(z);
    E.__original && delete E.__original;
    const P = Object.create(Object.getPrototypeOf(z), E);
    if (!Object.prototype.hasOwnProperty.call(P, "__original"))
      try {
        Object.defineProperty(P, "__original", {
          value: z,
          writable: !1,
          enumerable: !1,
          configurable: !1
        });
      } catch {
      }
    return P;
  }, D = be(() => {
    const z = S, E = z?.language;
    let P = z;
    z && (N.current && N.current.__original === z ? C.current !== E ? (P = O(z), N.current = P, C.current = E) : P = N.current : (P = O(z), N.current = P, C.current = E));
    const T = !w && !a ? (...R) => (Is(o, "USE_T_BEFORE_READY", "useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t."), A(...R)) : A, Y = [T, P, w];
    return Y.t = T, Y.i18n = P, Y.ready = w, Y;
  }, [A, S, w, S.resolvedLanguage, S.language, S.languages]);
  if (o && a && !w)
    throw new Promise((z) => {
      const E = () => z();
      t.lng ? Qc(o, t.lng, u, E) : Ps(o, u, E);
    });
  return D;
};
function C1({
  i18n: e,
  defaultNS: t,
  children: n
}) {
  const r = be(() => ({
    i18n: e,
    defaultNS: t
  }), [e, t]);
  return bi(Zh.Provider, {
    value: r
  }, n);
}
const hi = {
  "common.close": "Close",
  "common.cancel": "Cancel",
  "common.create": "Create",
  "common.save": "Save",
  "common.continue": "Continue",
  "common.loading": "Loading...",
  "common.search": "Search...",
  "common.filters": "Filters",
  "common.clearAll": "Clear all",
  "common.applyFilters": "Apply filters",
  "locale.selector": "Language",
  "locale.openSelector": "Select language",
  "locale.en": "English",
  "locale.vi": "Vietnamese",
  "searchableSelect.placeholder": "Select option",
  "searchableSelect.empty": "No options found.",
  "mobileCardList.empty": "No results found.",
  "mobileBottomBar.menu": "Menu",
  "mobileBottomBar.openMenu": "Open menu",
  "simpleDataTable.loading": "Loading...",
  "simpleDataTable.empty": "No records found.",
  "simpleDataTable.noResults": "No results",
  "simpleDataTable.showingRange": "Showing {start}-{end} of {total}",
  "simpleDataTable.showingRangePartial": "Showing {start}-{end}",
  "simpleDataTable.page": "Page {page} of {totalPages}",
  "simpleDataTable.pagePartial": "Page {page}",
  "simpleDataTable.rows": "Rows",
  "simpleDataTable.searchRows": "Search rows...",
  "simpleDataTable.previous": "Previous",
  "simpleDataTable.next": "Next",
  "pendingChanges.count.one": "1 unsaved change",
  "pendingChanges.count.other": "{count} unsaved changes",
  "pendingChanges.review": "Review",
  "pendingChanges.cancel": "Cancel",
  "pendingChanges.save": "Save changes",
  "pendingChanges.saving": "Saving...",
  "pendingChanges.keyLabel": "OBJECT",
  "pendingChanges.valueLabel": "Changed",
  "pendingChanges.generalSection": "General",
  "patchRecord.description": "Only modified fields will be included in the update request.",
  "patchRecord.enabled": "Enabled",
  "patchRecord.disabled": "Disabled",
  "patchRecord.searchField": "Search {label}...",
  "patchRecord.placeholder": "-- {label} --",
  "forgotPassword.title": "Reset password",
  "forgotPassword.description": "Enter your account's username, and we'll send you a link to reset your password.",
  "forgotPassword.username": "Username",
  "forgotPassword.usernamePlaceholder": "username",
  "forgotPassword.usernameRequired": "Username is required.",
  "forgotPassword.submit": "Continue",
  "forgotPassword.submitting": "Sending...",
  "forgotPassword.error": "Failed to request password reset. Please try again.",
  "resetPassword.title": "Reset password",
  "resetPassword.description": "Set a new password for your account using the reset link you received.",
  "resetPassword.username": "Username",
  "resetPassword.newPassword": "New password",
  "resetPassword.confirmPassword": "Confirm new password",
  "resetPassword.submit": "Reset password",
  "resetPassword.submitting": "Resetting password...",
  "resetPassword.backToSignIn": "Back to sign in",
  "resetPassword.tokenRequired": "Reset token is required.",
  "resetPassword.usernameRequired": "Username is required.",
  "resetPassword.passwordRequired": "New password is required.",
  "resetPassword.confirmRequired": "Please confirm your new password.",
  "resetPassword.passwordMismatch": "Passwords do not match.",
  "resetPassword.success": "Password reset successful. You can now sign in.",
  "resetPassword.error": "Failed to reset password. Please try again.",
  "signIn.learningPortal": "Learning Portal",
  "signIn.formTitle": "Sign in",
  "signIn.formDescription": "Welcome back - enter your credentials to continue.",
  "signIn.selectAccountType": "Select account type",
  "signIn.username": "Username",
  "signIn.password": "Password",
  "signIn.usernamePlaceholder": "username",
  "signIn.forgotPassword": "Forgot password?",
  "signIn.passwordSubmit": "Sign in with password",
  "signIn.signingIn": "Signing in...",
  "signIn.or": "or",
  "signIn.guideLink": "User Guide",
  "signIn.googleError": "Google sign-in failed. Please try again.",
  "signIn.invalidCredentials": "Invalid username or password.",
  "signIn.loginFailed": "Login failed. Please try again.",
  "signIn.selectAccountTypeError": "Please select an account type.",
  "signIn.enterUsername": "Please enter your username.",
  "signIn.passwordRequired": "Password is required.",
  "detail.close": "Close details",
  "detail.restorePanel": "Restore details panel",
  "detail.details": "Details",
  "detail.expandPanel": "Expand details panel",
  "detail.fullyCollapse": "Fully collapse details",
  "detail.collapse": "Collapse details",
  "detail.expandView": "Expand View",
  "detail.floatingView": "Floating View",
  "detail.openClass": "Open class",
  "detail.class": "Class",
  "notificationBell.ariaLabel": "Notifications{suffix}",
  "notificationBell.unreadSuffix": ", {count} unread",
  "notificationBell.title": "Notifications",
  "notificationBell.refresh": "Refresh notifications",
  "notificationBell.empty": "No new notifications",
  "notificationBell.dismiss": "Dismiss",
  "notification.immediateCount": "{count} notices",
  "notification.acknowledge": "Acknowledge",
  "notification.dismiss": "Dismiss notification"
};
function S1(e, t) {
  const n = a1(), r = Object.entries(t ?? {}).reduce(
    (i, [o, s]) => (i[o] = {
      translation: o === "en" ? { ...hi, ...s } : s
    }, i),
    {
      en: {
        translation: hi
      }
    }
  );
  return r[e] || (r[e] = {
    translation: e === "en" ? hi : {}
  }), n.use(y1).init({
    lng: e,
    fallbackLng: "en",
    interpolation: {
      escapeValue: !1
    },
    resources: r
  }), n;
}
const Vh = Nt(null);
function uP({
  children: e,
  locale: t,
  defaultLocale: n = "en",
  messages: r,
  messagesByLocale: i,
  storageKey: o
}) {
  const s = t ?? (typeof window < "u" && o && window.localStorage.getItem(o)?.trim() || n), [a, l] = ge(s), c = be(
    () => i ?? { [a]: r ?? {} },
    [a, r, i]
  ), d = be(
    () => Object.keys(c).sort((h, m) => h === "en" ? -1 : m === "en" ? 1 : h.localeCompare(m)),
    [c]
  );
  ue(() => {
    t && l(t);
  }, [t]), ue(() => {
    typeof document < "u" && (document.documentElement.lang = a), typeof window < "u" && o && window.localStorage.setItem(o, a);
  }, [a, o]);
  const u = be(
    () => S1(a, c),
    [a, c]
  ), p = be(
    () => ({
      locale: a,
      setLocale: l,
      availableLocales: d
    }),
    [a, d]
  );
  return /* @__PURE__ */ f.jsx(Vh.Provider, { value: p, children: /* @__PURE__ */ f.jsx(C1, { i18n: u, children: e }) });
}
function ke() {
  const { t: e, i18n: t } = E1(), n = qe(Vh), r = (i, o, s) => e(i, {
    ...s,
    defaultValue: hi[i] ?? o ?? i
  });
  return {
    locale: n?.locale ?? t.language ?? "en",
    setLocale: n?.setLocale ?? (() => {
    }),
    availableLocales: n?.availableLocales ?? [t.language ?? "en"],
    t: r
  };
}
function Va({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(ha, { "data-slot": "dialog", ...e });
}
function dP({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(Ud, { "data-slot": "dialog-trigger", ...e });
}
function N1({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(pa, { "data-slot": "dialog-portal", ...e });
}
function fP({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(Nr, { "data-slot": "dialog-close", ...e });
}
function j1({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    ma,
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
function Wa({
  className: e,
  children: t,
  showCloseButton: n = !0,
  ...r
}) {
  const { t: i } = ke();
  return /* @__PURE__ */ f.jsxs(N1, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ f.jsx(j1, {}),
    /* @__PURE__ */ f.jsxs(
      ga,
      {
        "data-slot": "dialog-content",
        className: H(
          "fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100vh-1rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
          e
        ),
        ...r,
        children: [
          t,
          n && /* @__PURE__ */ f.jsxs(
            Nr,
            {
              "data-slot": "dialog-close",
              className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ f.jsx(Tr, {}),
                /* @__PURE__ */ f.jsx("span", { className: "sr-only", children: i("common.close") })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function Ja({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: H("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function Wh({
  className: e,
  showCloseButton: t = !1,
  children: n,
  ...r
}) {
  const { t: i } = ke();
  return /* @__PURE__ */ f.jsxs(
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
        t && /* @__PURE__ */ f.jsx(Nr, { asChild: !0, children: /* @__PURE__ */ f.jsx(me, { variant: "outline", children: i("common.close") }) })
      ]
    }
  );
}
function qa({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    xa,
    {
      "data-slot": "dialog-title",
      className: H("text-lg leading-none font-semibold", e),
      ...t
    }
  );
}
function Jh({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    Qd,
    {
      "data-slot": "dialog-description",
      className: H("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
const Di = "auth.user";
function qh() {
  try {
    const e = localStorage.getItem(Di);
    return e ? JSON.parse(e) : null;
  } catch {
    return localStorage.removeItem(Di), null;
  }
}
function Ka() {
  localStorage.removeItem(Di);
}
function Kh(e) {
  localStorage.setItem(Di, JSON.stringify(e));
}
let ri = null, ii = null;
const M1 = 429, I1 = 1, Ds = "auth:session-expired";
function P1(e) {
  if (typeof e == "string")
    return e;
  if (e && typeof e == "object") {
    const t = e, n = t.message ?? t.detail ?? t.error;
    if (typeof n == "string")
      return n;
  }
  return "";
}
async function R1(e) {
  const t = e.clone(), n = t.headers.get("content-type") || "";
  try {
    if (n.includes("application/json")) {
      const r = await t.json();
      return P1(r);
    }
    return (await t.text()).trim();
  } catch {
    return "";
  }
}
function D1(e) {
  if (!e)
    return null;
  const t = Number(e);
  if (Number.isFinite(t) && t >= 0)
    return t * 1e3;
  const n = Date.parse(e);
  return Number.isNaN(n) ? null : Math.max(n - Date.now(), 0);
}
function O1(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function zr(e, t, n = I1) {
  const r = await fetch(e, {
    ...t,
    cache: t?.cache ?? "no-store"
  });
  if (r.status !== M1 || n <= 0)
    return r;
  const i = D1(r.headers.get("retry-after"));
  return i === null ? r : (await O1(i), zr(e, t, n - 1));
}
async function T1(e) {
  if (e.status !== 401)
    return !1;
  const t = (await R1(e)).toLowerCase();
  return t.includes("token") && t.includes("expired");
}
function z1() {
  const e = qh();
  if (!e)
    return null;
  const t = e.username ?? e.email ?? e.sub;
  return typeof t == "string" && t.trim() ? t.trim() : null;
}
async function B1() {
  return ri || (ri = (async () => {
    const e = z1();
    return e ? !!(await zr(Ut("refresh"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        username: e
      },
      credentials: "include"
    })).ok : !1;
  })().finally(() => {
    ri = null;
  })), ri;
}
async function L1() {
  return ii || (ii = (async () => {
    try {
      await zr(Ut("logout"), {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        credentials: "include"
      });
    } catch {
    } finally {
      window.dispatchEvent(new Event(Ds));
    }
  })().finally(() => {
    ii = null;
  })), ii;
}
async function Wt(e, t = {}) {
  const { skipRefresh: n = !1, ...r } = t, i = await zr(e, r);
  return n || !await T1(i) ? i : await B1() ? Wt(e, { ...r, skipRefresh: !0 }) : (await L1(), i);
}
const F1 = {
  error: {
    container: "border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/12",
    icon: i0
  },
  success: {
    container: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/12 dark:text-emerald-300",
    icon: s0
  },
  info: {
    container: "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/12 dark:text-sky-300",
    icon: x0
  }
};
function pr({
  children: e,
  className: t,
  variant: n = "info"
}) {
  const { container: r, icon: i } = F1[n];
  return /* @__PURE__ */ f.jsxs(
    "div",
    {
      role: n === "error" ? "alert" : "status",
      className: H(
        "flex items-start gap-3 rounded-xl border px-3 py-2 text-sm",
        r,
        t
      ),
      children: [
        /* @__PURE__ */ f.jsx(i, { className: "mt-0.5 size-4 shrink-0" }),
        /* @__PURE__ */ f.jsx("div", { children: e })
      ]
    }
  );
}
function G1({ open: e, handleClose: t }) {
  const { t: n } = ke(), [r, i] = v.useState(!1), [o, s] = v.useState(""), a = () => {
    s(""), t();
  }, l = (d) => {
    d || a();
  }, c = async (d) => {
    s("");
    const p = new FormData(d).get("username");
    if (!p || typeof p != "string") {
      s(n("forgotPassword.usernameRequired"));
      return;
    }
    i(!0);
    try {
      const h = new URLSearchParams();
      h.append("username", p);
      const m = await Wt(Ut("resetPassword"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        credentials: "include",
        body: h.toString()
      });
      if (!m.ok)
        throw new Error(`Reset password failed: ${m.status} ${m.statusText}`);
      a();
    } catch (h) {
      s(
        h instanceof Error ? h.message : n("forgotPassword.error")
      );
    } finally {
      i(!1);
    }
  };
  return /* @__PURE__ */ f.jsx(Va, { open: e, onOpenChange: l, children: /* @__PURE__ */ f.jsx(Wa, { className: "flex max-h-[92vh] w-[min(97vw,38rem)] max-w-none flex-col overflow-hidden border-border/70 bg-card/95 p-0", children: /* @__PURE__ */ f.jsxs(
    "form",
    {
      className: "flex min-h-0 flex-1 flex-col",
      onSubmit: (d) => {
        d.preventDefault(), d.stopPropagation(), c(d.currentTarget);
      },
      children: [
        /* @__PURE__ */ f.jsxs(Ja, { className: "border-b border-border/70 px-6 py-4 text-left", children: [
          /* @__PURE__ */ f.jsx(qa, { children: n("forgotPassword.title") }),
          /* @__PURE__ */ f.jsx(Jh, { children: n("forgotPassword.description") })
        ] }),
        /* @__PURE__ */ f.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-6 py-5", children: /* @__PURE__ */ f.jsxs("div", { className: "space-y-4", children: [
          o && /* @__PURE__ */ f.jsx(pr, { variant: "error", children: o }),
          /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ f.jsx(Cn, { htmlFor: "forgot-password-username", children: /* @__PURE__ */ f.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ f.jsx("span", { children: n("forgotPassword.username") }),
              /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
            ] }) }),
            /* @__PURE__ */ f.jsx(
              en,
              {
                autoFocus: !0,
                required: !0,
                id: "forgot-password-username",
                name: "username",
                placeholder: n("forgotPassword.usernamePlaceholder"),
                type: "text",
                disabled: r
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ f.jsxs(Wh, { className: "gap-2 border-t border-border/70 px-6 py-4 sm:justify-between", children: [
          /* @__PURE__ */ f.jsx(
            me,
            {
              type: "button",
              variant: "outline",
              onClick: a,
              disabled: r,
              children: n("common.cancel")
            }
          ),
          /* @__PURE__ */ f.jsx(me, { type: "submit", disabled: r, children: n(r ? "forgotPassword.submitting" : "forgotPassword.submit") })
        ] })
      ]
    }
  ) }) });
}
const Xh = "app-color-mode", _h = v.createContext({
  mode: "system",
  resolvedMode: "light",
  systemMode: "light",
  setMode: () => {
  }
});
function Y1() {
  if (typeof window > "u")
    return "system";
  const e = window.localStorage.getItem(Xh);
  return e === "light" || e === "dark" || e === "system" ? e : "system";
}
function H1() {
  return typeof window > "u" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function U1(e) {
  if (typeof document > "u")
    return;
  const t = document.documentElement;
  t.classList.toggle("dark", e === "dark"), t.dataset.theme = e, t.style.colorScheme = e;
}
function $h() {
  return v.useContext(_h);
}
function ep({ children: e, disableCustomTheme: t }) {
  const [n, r] = v.useState(() => Y1()), [i, o] = v.useState(() => H1()), s = n === "system" ? i : n;
  v.useEffect(() => {
    if (typeof window > "u")
      return;
    const l = window.matchMedia("(prefers-color-scheme: dark)"), c = (d) => {
      o(d.matches ? "dark" : "light");
    };
    return o(l.matches ? "dark" : "light"), l.addEventListener("change", c), () => {
      l.removeEventListener("change", c);
    };
  }, []), v.useEffect(() => {
    typeof window > "u" || window.localStorage.setItem(Xh, n);
  }, [n]), v.useEffect(() => {
    t || U1(s);
  }, [t, s]);
  const a = v.useMemo(() => ({
    mode: n,
    resolvedMode: s,
    systemMode: i,
    setMode: r
  }), [n, s, i]);
  return /* @__PURE__ */ f.jsx(_h.Provider, { value: a, children: e });
}
function ao({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(Av, { "data-slot": "dropdown-menu", ...e });
}
function hP({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(ch, { "data-slot": "dropdown-menu-portal", ...e });
}
function lo({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(
    kv,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function co({
  className: e,
  sideOffset: t = 4,
  ...n
}) {
  return /* @__PURE__ */ f.jsx(ch, { children: /* @__PURE__ */ f.jsx(
    Ev,
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
function pP({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(Cv, { "data-slot": "dropdown-menu-group", ...e });
}
function mP({
  className: e,
  inset: t,
  variant: n = "default",
  ...r
}) {
  return /* @__PURE__ */ f.jsx(
    Nv,
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
function gP({
  className: e,
  children: t,
  checked: n,
  ...r
}) {
  return /* @__PURE__ */ f.jsxs(
    jv,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: H(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      checked: n,
      ...r,
      children: [
        /* @__PURE__ */ f.jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ f.jsx(uh, { children: /* @__PURE__ */ f.jsx(Ua, { className: "size-4" }) }) }),
        t
      ]
    }
  );
}
function Xa({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(
    Mv,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function tn({
  className: e,
  children: t,
  ...n
}) {
  return /* @__PURE__ */ f.jsxs(
    Iv,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: H(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...n,
      children: [
        /* @__PURE__ */ f.jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ f.jsx(uh, { children: /* @__PURE__ */ f.jsx(l0, { className: "size-2 fill-current" }) }) }),
        t
      ]
    }
  );
}
function Q1({
  className: e,
  inset: t,
  ...n
}) {
  return /* @__PURE__ */ f.jsx(
    Sv,
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
function Z1({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    Pv,
    {
      "data-slot": "dropdown-menu-separator",
      className: H("-mx-1 my-1 h-px bg-border", e),
      ...t
    }
  );
}
function xP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
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
function bP({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(Rv, { "data-slot": "dropdown-menu-sub", ...e });
}
function yP({
  className: e,
  inset: t,
  children: n,
  ...r
}) {
  return /* @__PURE__ */ f.jsxs(
    Dv,
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
        /* @__PURE__ */ f.jsx(Lt, { className: "ml-auto size-4" })
      ]
    }
  );
}
function vP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    Ov,
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
function tp(e) {
  const { mode: t, setMode: n } = $h(), { className: r, ...i } = e, o = {
    system: "System",
    light: "Light",
    dark: "Dark"
  }, s = {
    system: /* @__PURE__ */ f.jsx(js, { className: "size-4" }),
    light: /* @__PURE__ */ f.jsx(Mi, { className: "size-4" }),
    dark: /* @__PURE__ */ f.jsx(ji, { className: "size-4" })
  };
  return /* @__PURE__ */ f.jsxs(ao, { children: [
    /* @__PURE__ */ f.jsx(lo, { asChild: !0, children: /* @__PURE__ */ f.jsxs(
      me,
      {
        "data-screenshot": "toggle-mode",
        variant: "outline",
        size: "sm",
        className: H(
          "rounded-full border-border/70 bg-background/85 px-3 shadow-sm backdrop-blur",
          r
        ),
        ...i,
        children: [
          s[t],
          /* @__PURE__ */ f.jsx("span", { className: "hidden sm:inline", children: o[t] })
        ]
      }
    ) }),
    /* @__PURE__ */ f.jsx(co, { align: "end", className: "w-36", children: /* @__PURE__ */ f.jsxs(
      Xa,
      {
        value: t,
        onValueChange: (a) => n(a),
        children: [
          /* @__PURE__ */ f.jsxs(tn, { value: "system", children: [
            /* @__PURE__ */ f.jsx(js, { className: "mr-2 size-4" }),
            "System"
          ] }),
          /* @__PURE__ */ f.jsxs(tn, { value: "light", children: [
            /* @__PURE__ */ f.jsx(Mi, { className: "mr-2 size-4" }),
            "Light"
          ] }),
          /* @__PURE__ */ f.jsxs(tn, { value: "dark", children: [
            /* @__PURE__ */ f.jsx(ji, { className: "mr-2 size-4" }),
            "Dark"
          ] })
        ]
      }
    ) })
  ] });
}
function V1(e) {
  const { locale: t, setLocale: n, availableLocales: r, t: i } = ke(), { className: o, localeLabels: s, ...a } = e, l = (c) => s?.[c] ? s[c] : c === "en" ? i("locale.en") : c === "vi" ? i("locale.vi") : c.toUpperCase();
  return /* @__PURE__ */ f.jsxs(ao, { children: [
    /* @__PURE__ */ f.jsx(lo, { asChild: !0, children: /* @__PURE__ */ f.jsxs(
      me,
      {
        variant: "outline",
        size: "sm",
        className: H(
          "rounded-full border-border/70 bg-background/85 px-3 shadow-sm backdrop-blur",
          o
        ),
        "aria-label": i("locale.openSelector"),
        ...a,
        children: [
          /* @__PURE__ */ f.jsx(y0, { className: "size-4" }),
          /* @__PURE__ */ f.jsx("span", { className: "hidden sm:inline", children: l(t) })
        ]
      }
    ) }),
    /* @__PURE__ */ f.jsx(co, { align: "end", className: "w-40", children: /* @__PURE__ */ f.jsx(Xa, { value: t, onValueChange: n, children: r.map((c) => /* @__PURE__ */ f.jsx(tn, { value: c, children: l(c) }, c)) }) })
  ] });
}
const W1 = "data:image/png;base64,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NqTSftvpM/mNx7tG2g8c6t20ffeJjW++f6TtxVe3r33jzd1L/uQvfjbr//nbJxv+4A+2XNUHgb17gVGaDfUMZuoPH+qfv29/d/uu/d1YfuemHTtPbdq6s2vTe9uOt73x/v51z765c/VTr7y14sff//GyHfuPrd59sLNtz+HO9t2HOjce7zjdNnAmvXY0U14yNlpquhgzao47vrcjsmv/sTm7d55o276rc+PWnT3tH+zua38P3fd2dW/asrNz03u7j69+d3dHK5ZTmxPRveR99OiYnXbK8UNHT8/csb9rLZbbvnVv56YPtqP8u062v7vjePs7249ueOv9o2tefmvfqqeff2flBzuOrtm5v79t38Ezm46fHGnvPp1rHxgpbxzNVtvODOfbTvWn2o+cHGjfub+r/b0dx9vefOfo2qee2rbsp7/cO+epV95pff75D+JPPvkku6RgF4lEHiie6IW34KnrXz7xztSfvfLmwq07jqzaerCjbfuhrk27j/ZuOtgx0N7Vn9rYnypuPJMpt43kym2nh4sbD3cNtu88cKr93X0nN7255+jGN7cdWfvzl/atfA3dt3Yfaftgz7H2rfs62nfs62zfsf/kpl37TrQfONzRdvh49/qOnr45I/l8XVdXJvzOO6BWhItICEBwQcElRhC04mqdgIMKpymc6wgQYgChJlBqxEolPvWdHccXvrPzxKqtu7vbdhw5s3H/iZH2rsHSxsFMsDFV4G3ZktM2mi+29QwMt+07dmrj3kOdGz44eHL9O3uPrn5+27Fl/8d//tuZP3np/fqenp4QcnNNnAJeW7b0hF461Ff/vVe2TX36/bfmv7XzyIp9x3vWHjjZ23bwZO/GPcd6Nx4/PbqxbzS/cTDvtGUcvj7t8vWn06W2A5397YdO9bcf7Opv34Pptx88tu69nceWvXFw97z/9rPnp/z3J7fEUDaigFVd0b0F27Nl//66p978YMqLO9+a/96+Y8v3HO9as7fjVNu+Ez0bdh3tattz8vTG/V1n2juHsxsH8s760bK/PuWItpTD2wayzsbj/an2gz1n2nefwHF/rK9t6+HOdduPdS7f09sz96dvvtn6o9dei16RMOckyo+cjo1khqd0Dw0tON7dt+oIcnOkowf77dSmvSd7N+3t7mvf3Xl6/dajx1c9v/PQyue3HVr5JW7mcgAAEABJREFUzsEj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";
function Os() {
  return /* @__PURE__ */ f.jsx("img", { src: W1, width: "150", alt: "Sitemark" });
}
var pi = { exports: {} }, J1 = pi.exports, Zc;
function q1() {
  return Zc || (Zc = 1, (function(e, t) {
    (function(n, r) {
      e.exports = r();
    })(J1, (function() {
      var n = 1e3, r = 6e4, i = 36e5, o = "millisecond", s = "second", a = "minute", l = "hour", c = "day", d = "week", u = "month", p = "quarter", h = "year", m = "date", g = "Invalid Date", x = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, b = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, A = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(R) {
        var j = ["th", "st", "nd", "rd"], I = R % 100;
        return "[" + R + (j[(I - 20) % 10] || j[I] || j[0]) + "]";
      } }, w = function(R, j, I) {
        var F = String(R);
        return !F || F.length >= j ? R : "" + Array(j + 1 - F.length).join(I) + R;
      }, S = { s: w, z: function(R) {
        var j = -R.utcOffset(), I = Math.abs(j), F = Math.floor(I / 60), B = I % 60;
        return (j <= 0 ? "+" : "-") + w(F, 2, "0") + ":" + w(B, 2, "0");
      }, m: function R(j, I) {
        if (j.date() < I.date()) return -R(I, j);
        var F = 12 * (I.year() - j.year()) + (I.month() - j.month()), B = j.clone().add(F, u), L = I - B < 0, y = j.clone().add(F + (L ? -1 : 1), u);
        return +(-(F + (I - B) / (L ? B - y : y - B)) || 0);
      }, a: function(R) {
        return R < 0 ? Math.ceil(R) || 0 : Math.floor(R);
      }, p: function(R) {
        return { M: u, y: h, w: d, d: c, D: m, h: l, m: a, s, ms: o, Q: p }[R] || String(R || "").toLowerCase().replace(/s$/, "");
      }, u: function(R) {
        return R === void 0;
      } }, N = "en", C = {};
      C[N] = A;
      var O = "$isDayjsObject", D = function(R) {
        return R instanceof T || !(!R || !R[O]);
      }, z = function R(j, I, F) {
        var B;
        if (!j) return N;
        if (typeof j == "string") {
          var L = j.toLowerCase();
          C[L] && (B = L), I && (C[L] = I, B = L);
          var y = j.split("-");
          if (!B && y.length > 1) return R(y[0]);
        } else {
          var M = j.name;
          C[M] = j, B = M;
        }
        return !F && B && (N = B), B || !F && N;
      }, E = function(R, j) {
        if (D(R)) return R.clone();
        var I = typeof j == "object" ? j : {};
        return I.date = R, I.args = arguments, new T(I);
      }, P = S;
      P.l = z, P.i = D, P.w = function(R, j) {
        return E(R, { locale: j.$L, utc: j.$u, x: j.$x, $offset: j.$offset });
      };
      var T = (function() {
        function R(I) {
          this.$L = z(I.locale, null, !0), this.parse(I), this.$x = this.$x || I.x || {}, this[O] = !0;
        }
        var j = R.prototype;
        return j.parse = function(I) {
          this.$d = (function(F) {
            var B = F.date, L = F.utc;
            if (B === null) return /* @__PURE__ */ new Date(NaN);
            if (P.u(B)) return /* @__PURE__ */ new Date();
            if (B instanceof Date) return new Date(B);
            if (typeof B == "string" && !/Z$/i.test(B)) {
              var y = B.match(x);
              if (y) {
                var M = y[2] - 1 || 0, U = (y[7] || "0").substring(0, 3);
                return L ? new Date(Date.UTC(y[1], M, y[3] || 1, y[4] || 0, y[5] || 0, y[6] || 0, U)) : new Date(y[1], M, y[3] || 1, y[4] || 0, y[5] || 0, y[6] || 0, U);
              }
            }
            return new Date(B);
          })(I), this.init();
        }, j.init = function() {
          var I = this.$d;
          this.$y = I.getFullYear(), this.$M = I.getMonth(), this.$D = I.getDate(), this.$W = I.getDay(), this.$H = I.getHours(), this.$m = I.getMinutes(), this.$s = I.getSeconds(), this.$ms = I.getMilliseconds();
        }, j.$utils = function() {
          return P;
        }, j.isValid = function() {
          return this.$d.toString() !== g;
        }, j.isSame = function(I, F) {
          var B = E(I);
          return this.startOf(F) <= B && B <= this.endOf(F);
        }, j.isAfter = function(I, F) {
          return E(I) < this.startOf(F);
        }, j.isBefore = function(I, F) {
          return this.endOf(F) < E(I);
        }, j.$g = function(I, F, B) {
          return P.u(I) ? this[F] : this.set(B, I);
        }, j.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, j.valueOf = function() {
          return this.$d.getTime();
        }, j.startOf = function(I, F) {
          var B = this, L = !!P.u(F) || F, y = P.p(I), M = function(ee, le) {
            var Ee = P.w(B.$u ? Date.UTC(B.$y, le, ee) : new Date(B.$y, le, ee), B);
            return L ? Ee : Ee.endOf(c);
          }, U = function(ee, le) {
            return P.w(B.toDate()[ee].apply(B.toDate("s"), (L ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(le)), B);
          }, k = this.$W, X = this.$M, K = this.$D, W = "set" + (this.$u ? "UTC" : "");
          switch (y) {
            case h:
              return L ? M(1, 0) : M(31, 11);
            case u:
              return L ? M(1, X) : M(0, X + 1);
            case d:
              var Z = this.$locale().weekStart || 0, q = (k < Z ? k + 7 : k) - Z;
              return M(L ? K - q : K + (6 - q), X);
            case c:
            case m:
              return U(W + "Hours", 0);
            case l:
              return U(W + "Minutes", 1);
            case a:
              return U(W + "Seconds", 2);
            case s:
              return U(W + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, j.endOf = function(I) {
          return this.startOf(I, !1);
        }, j.$set = function(I, F) {
          var B, L = P.p(I), y = "set" + (this.$u ? "UTC" : ""), M = (B = {}, B[c] = y + "Date", B[m] = y + "Date", B[u] = y + "Month", B[h] = y + "FullYear", B[l] = y + "Hours", B[a] = y + "Minutes", B[s] = y + "Seconds", B[o] = y + "Milliseconds", B)[L], U = L === c ? this.$D + (F - this.$W) : F;
          if (L === u || L === h) {
            var k = this.clone().set(m, 1);
            k.$d[M](U), k.init(), this.$d = k.set(m, Math.min(this.$D, k.daysInMonth())).$d;
          } else M && this.$d[M](U);
          return this.init(), this;
        }, j.set = function(I, F) {
          return this.clone().$set(I, F);
        }, j.get = function(I) {
          return this[P.p(I)]();
        }, j.add = function(I, F) {
          var B, L = this;
          I = Number(I);
          var y = P.p(F), M = function(X) {
            var K = E(L);
            return P.w(K.date(K.date() + Math.round(X * I)), L);
          };
          if (y === u) return this.set(u, this.$M + I);
          if (y === h) return this.set(h, this.$y + I);
          if (y === c) return M(1);
          if (y === d) return M(7);
          var U = (B = {}, B[a] = r, B[l] = i, B[s] = n, B)[y] || 1, k = this.$d.getTime() + I * U;
          return P.w(k, this);
        }, j.subtract = function(I, F) {
          return this.add(-1 * I, F);
        }, j.format = function(I) {
          var F = this, B = this.$locale();
          if (!this.isValid()) return B.invalidDate || g;
          var L = I || "YYYY-MM-DDTHH:mm:ssZ", y = P.z(this), M = this.$H, U = this.$m, k = this.$M, X = B.weekdays, K = B.months, W = B.meridiem, Z = function(le, Ee, Me, Se) {
            return le && (le[Ee] || le(F, L)) || Me[Ee].slice(0, Se);
          }, q = function(le) {
            return P.s(M % 12 || 12, le, "0");
          }, ee = W || function(le, Ee, Me) {
            var Se = le < 12 ? "AM" : "PM";
            return Me ? Se.toLowerCase() : Se;
          };
          return L.replace(b, (function(le, Ee) {
            return Ee || (function(Me) {
              switch (Me) {
                case "YY":
                  return String(F.$y).slice(-2);
                case "YYYY":
                  return P.s(F.$y, 4, "0");
                case "M":
                  return k + 1;
                case "MM":
                  return P.s(k + 1, 2, "0");
                case "MMM":
                  return Z(B.monthsShort, k, K, 3);
                case "MMMM":
                  return Z(K, k);
                case "D":
                  return F.$D;
                case "DD":
                  return P.s(F.$D, 2, "0");
                case "d":
                  return String(F.$W);
                case "dd":
                  return Z(B.weekdaysMin, F.$W, X, 2);
                case "ddd":
                  return Z(B.weekdaysShort, F.$W, X, 3);
                case "dddd":
                  return X[F.$W];
                case "H":
                  return String(M);
                case "HH":
                  return P.s(M, 2, "0");
                case "h":
                  return q(1);
                case "hh":
                  return q(2);
                case "a":
                  return ee(M, U, !0);
                case "A":
                  return ee(M, U, !1);
                case "m":
                  return String(U);
                case "mm":
                  return P.s(U, 2, "0");
                case "s":
                  return String(F.$s);
                case "ss":
                  return P.s(F.$s, 2, "0");
                case "SSS":
                  return P.s(F.$ms, 3, "0");
                case "Z":
                  return y;
              }
              return null;
            })(le) || y.replace(":", "");
          }));
        }, j.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, j.diff = function(I, F, B) {
          var L, y = this, M = P.p(F), U = E(I), k = (U.utcOffset() - this.utcOffset()) * r, X = this - U, K = function() {
            return P.m(y, U);
          };
          switch (M) {
            case h:
              L = K() / 12;
              break;
            case u:
              L = K();
              break;
            case p:
              L = K() / 3;
              break;
            case d:
              L = (X - k) / 6048e5;
              break;
            case c:
              L = (X - k) / 864e5;
              break;
            case l:
              L = X / i;
              break;
            case a:
              L = X / r;
              break;
            case s:
              L = X / n;
              break;
            default:
              L = X;
          }
          return B ? L : P.a(L);
        }, j.daysInMonth = function() {
          return this.endOf(u).$D;
        }, j.$locale = function() {
          return C[this.$L];
        }, j.locale = function(I, F) {
          if (!I) return this.$L;
          var B = this.clone(), L = z(I, F, !0);
          return L && (B.$L = L), B;
        }, j.clone = function() {
          return P.w(this.$d, this);
        }, j.toDate = function() {
          return new Date(this.valueOf());
        }, j.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, j.toISOString = function() {
          return this.$d.toISOString();
        }, j.toString = function() {
          return this.$d.toUTCString();
        }, R;
      })(), Y = T.prototype;
      return E.prototype = Y, [["$ms", o], ["$s", s], ["$m", a], ["$H", l], ["$W", c], ["$M", u], ["$y", h], ["$D", m]].forEach((function(R) {
        Y[R[1]] = function(j) {
          return this.$g(j, R[0], R[1]);
        };
      })), E.extend = function(R, j) {
        return R.$i || (R(j, T, E), R.$i = !0), E;
      }, E.locale = z, E.isDayjs = D, E.unix = function(R) {
        return E(1e3 * R);
      }, E.en = C[N], E.Ls = C, E.p = {}, E;
    }));
  })(pi)), pi.exports;
}
var K1 = q1();
const mr = /* @__PURE__ */ aa(K1), np = "YYYY-MM-DDTHH:mm:ss.SSSZ", X1 = "YYYY-MM-DDTHH:mm", Vc = "HH:mm";
function _1(e) {
  const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), i = String(e.getHours()).padStart(2, "0"), o = String(e.getMinutes()).padStart(2, "0"), s = String(e.getSeconds()).padStart(2, "0"), a = String(e.getMilliseconds()).padStart(3, "0"), l = -e.getTimezoneOffset(), c = l >= 0 ? "+" : "-", d = Math.abs(l), u = String(Math.floor(d / 60)).padStart(2, "0"), p = String(d % 60).padStart(2, "0");
  return `${t}-${n}-${r}T${i}:${o}:${s}.${a}${c}${u}:${p}`;
}
function $1(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? void 0 : t;
}
function eA(e) {
  const t = e.trim(), n = t.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])$/
  );
  if (n) {
    const [, l, c, d, u] = n, p = Number(l), h = Number(c), m = d ? Number(d) : 0;
    if (p < 1 || p > 12 || h < 0 || h > 59 || m < 0 || m > 59)
      return;
    const g = u.toLowerCase() === "pm" ? p % 12 + 12 : p % 12;
    return `${String(g).padStart(2, "0")}:${c}`;
  }
  const r = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!r)
    return;
  const [, i, o] = r, s = Number(i), a = Number(o);
  if (!(s < 0 || s > 23 || a < 0 || a > 59))
    return `${String(s).padStart(2, "0")}:${o}`;
}
function wP(e) {
  return e ? new Date(e).toLocaleDateString() : "-";
}
function AP(e) {
  if (!e)
    return "-";
  const t = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(e).toLocaleString(void 0, { timeZone: t });
}
function kP(e) {
  const t = e?.trim();
  if (!t)
    return;
  const n = mr(t);
  if (n.isValid())
    return n.format(np);
  const r = $1(t);
  return r ? _1(r) : void 0;
}
function EP(e, t) {
  const n = e?.trim();
  if (!n)
    return;
  const r = t === "start" ? mr(n).startOf("day") : mr(n).endOf("day");
  return r.isValid() ? r.format(np) : void 0;
}
function CP(e) {
  const t = e?.trim();
  if (!t)
    return "";
  const n = mr(t);
  return n.isValid() ? n.format(X1) : "";
}
function SP(e) {
  const t = e?.trim();
  if (!t)
    return;
  const n = mr(t, Vc);
  return n.isValid() ? n.format(Vc) : eA(t);
}
function NP(e, t = 2, n = 8) {
  const r = e ?? "", i = r.split(`
`).length, o = Math.ceil(r.length / 70);
  return Math.min(n, Math.max(t, i, o));
}
function tA(e) {
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
function nA(e) {
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
async function rA(e) {
  const t = new URLSearchParams();
  t.append("grant_type", "password"), t.append("username", e.username), t.append("password", e.password);
  const n = new URL(Ut("login"), window.location.origin);
  e.account_type && n.searchParams.append("account_type", e.account_type);
  const r = await zr(n.toString(), {
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
  return _a();
}
async function iA(e, t) {
  const n = new URLSearchParams();
  n.append("credential", e), t && n.append("account_type", t);
  const r = await Wt(
    `${Ut("authenticateGoogle")}?${n.toString()}`,
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
  return _a();
}
async function oA() {
  const e = await Wt(Ut("logout"), {
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
  Ka();
}
async function _a() {
  const e = await Wt(Ut("currentUser"), {
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
  const t = await e.json(), n = tA(nA(t));
  if (!n)
    throw new Error("Current user response did not contain a valid user");
  return Kh(n), n;
}
async function sA(e) {
  const t = new URLSearchParams();
  t.append("token", e.token), t.append("username", e.username), t.append("password", e.password);
  const n = await Wt(
    Ut("resetPasswordAuthorised"),
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
const rp = Nt(void 0);
function Wc() {
  localStorage.clear(), Ka();
}
function jP({ children: e }) {
  const [t, n] = ge(null), [r, i] = ge(!0);
  ue(() => {
    let l = !0;
    return (async () => {
      const d = qh();
      d && n(d);
      try {
        const u = await _a();
        if (!l)
          return;
        n(u);
      } catch {
        if (!l)
          return;
        n(null), Ka();
      } finally {
        l && i(!1);
      }
    })(), () => {
      l = !1;
    };
  }, []), ue(() => {
    const l = () => {
      Wc(), n(null);
    };
    return window.addEventListener(Ds, l), () => {
      window.removeEventListener(
        Ds,
        l
      );
    };
  }, []);
  const o = async (l) => {
    try {
      const c = await rA(l);
      n(c);
    } catch (c) {
      throw console.error("Login failed:", c), c;
    }
  }, s = (l) => {
    Kh(l), n(l);
  }, a = async () => {
    try {
      await oA();
    } catch (l) {
      console.error("Logout API failed:", l);
    } finally {
      Wc(), n(null);
    }
  };
  return /* @__PURE__ */ f.jsx(
    rp.Provider,
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
function $a() {
  const e = qe(rp);
  if (e === void 0)
    throw new Error("useAuth must be used within an AuthProvider");
  return e;
}
function el({
  id: e,
  value: t,
  options: n,
  placeholder: r,
  searchPlaceholder: i,
  emptyMessage: o,
  disabled: s = !1,
  className: a,
  contentClassName: l,
  onValueChange: c
}) {
  const { t: d } = ke(), [u, p] = ge(!1), [h, m] = ge(""), g = String(t ?? ""), x = r ?? d("searchableSelect.placeholder"), b = i ?? d("common.search"), A = o ?? d("searchableSelect.empty"), w = be(
    () => n.find((C) => C.value === g),
    [g, n]
  ), S = be(() => {
    const C = h.trim().toLowerCase();
    return C ? n.filter((O) => `${O.label} ${O.keywords ?? ""} ${O.value}`.toLowerCase().includes(C)) : n;
  }, [n, h]), N = (C) => {
    c(C), p(!1), m("");
  };
  return /* @__PURE__ */ f.jsxs(Ba, { open: u, onOpenChange: p, children: [
    /* @__PURE__ */ f.jsx(La, { asChild: !0, children: /* @__PURE__ */ f.jsxs(
      "button",
      {
        id: e,
        type: "button",
        disabled: s,
        className: H(
          "flex h-10 w-full min-w-0 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          a
        ),
        onClick: (C) => C.stopPropagation(),
        children: [
          /* @__PURE__ */ f.jsx("span", { className: H("min-w-0 flex-1 truncate text-left", !w && "text-muted-foreground"), children: w?.label ?? x }),
          /* @__PURE__ */ f.jsx(Qa, { className: "ml-2 size-4 shrink-0 text-muted-foreground" })
        ]
      }
    ) }),
    /* @__PURE__ */ f.jsx(Fa, { children: /* @__PURE__ */ f.jsxs(
      Ga,
      {
        sideOffset: 4,
        align: "start",
        className: H(
          "z-50 w-(--radix-popover-trigger-width) min-w-[12rem] max-h-[min(18rem,var(--radix-popover-content-available-height))] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          l
        ),
        onOpenAutoFocus: (C) => C.preventDefault(),
        onPointerDownOutside: () => m(""),
        onEscapeKeyDown: () => m(""),
        onClick: (C) => C.stopPropagation(),
        children: [
          /* @__PURE__ */ f.jsxs("div", { className: "relative mb-2", children: [
            /* @__PURE__ */ f.jsx(D0, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ f.jsx(
              "input",
              {
                value: h,
                onChange: (C) => m(C.target.value),
                placeholder: b,
                className: H(
                  "h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm shadow-xs outline-none transition",
                  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                ),
                autoFocus: !0
              }
            )
          ] }),
          /* @__PURE__ */ f.jsx(
            "div",
            {
              className: "max-h-56 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] touch-pan-y",
              style: { WebkitOverflowScrolling: "touch" },
              onWheelCapture: (C) => C.stopPropagation(),
              children: S.length === 0 ? /* @__PURE__ */ f.jsx("div", { className: "px-2 py-1.5 text-sm text-muted-foreground", children: A }) : S.map((C) => {
                const O = C.value === g;
                return /* @__PURE__ */ f.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => N(C.value),
                    disabled: C.disabled,
                    className: H(
                      "flex w-full min-w-0 cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm outline-none transition",
                      "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                      "disabled:pointer-events-none disabled:opacity-50"
                    ),
                    children: [
                      /* @__PURE__ */ f.jsx("span", { className: "min-w-0 flex-1 truncate", children: C.label }),
                      O ? /* @__PURE__ */ f.jsx(Ua, { className: "ml-2 size-4 shrink-0" }) : null
                    ]
                  },
                  C.value
                );
              })
            }
          )
        ]
      }
    ) })
  ] });
}
const aA = {}, lA = [
  { value: "employee", label: "Employee" },
  { value: "student", label: "Student" }
];
function MP(e) {
  const { t } = ke(), { login: n, setAuthenticatedUser: r } = $a(), i = v.useMemo(
    () => e.accountTypeOptions && e.accountTypeOptions.length > 0 ? e.accountTypeOptions : lA,
    [e.accountTypeOptions]
  ), o = v.useMemo(
    () => i.map((K) => `${K.value}:${K.label}`).join("|"),
    [i]
  ), s = e.accountTypeOverride?.trim() || "", a = !s, l = e.heroEyebrowText?.trim() || t("signIn.learningPortal"), c = e.heroTitleText?.trim() || "Lớp học", d = e.heroTitleAccentText?.trim() || "Nhà Xuân", u = e.formTitle?.trim() || t("signIn.formTitle"), p = e.formDescription?.trim() || t("signIn.formDescription"), [h, m] = v.useState(""), [g, x] = v.useState(""), [b, A] = v.useState(
    s || i[0]?.value || ""
  ), [w, S] = v.useState(""), [N, C] = v.useState(""), [O, D] = v.useState(""), [z, E] = v.useState(""), [P, T] = v.useState(""), [Y, R] = v.useState(!1), [j, I] = v.useState(!1), F = v.useRef(b);
  v.useEffect(() => {
    e.authNotice && T(e.authNotice);
  }, [e.authNotice]), v.useEffect(() => {
    if (s) {
      A(s), D("");
      return;
    }
    A((K) => K && i.some((W) => W.value === K) ? K : i[0]?.value || ""), D("");
  }, [i, o, s]), v.useEffect(() => {
    F.current = s || b;
  }, [b, s]), v.useEffect(() => {
    const K = e.googleClientId || (typeof import.meta < "u" ? aA?.VITE_GOOGLE_CLIENT_ID : void 0) || "";
    if (!K)
      return;
    const W = document.createElement("script");
    W.src = "https://accounts.google.com/gsi/client", W.async = !0, W.defer = !0, document.head.appendChild(W), W.onload = () => {
      window.google?.accounts?.id && (window.google.accounts.id.initialize({
        client_id: K,
        callback: U,
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
      ), window.google.accounts.id.prompt((Z) => {
        (Z.isNotDisplayed() || Z.isSkippedMoment()) && console.log("Google prompt status:", Z.getNotDisplayedReason());
      }));
    };
  }, [e.googleClientId]);
  const B = (K) => {
    K.preventDefault(), K.stopPropagation(), I(!0);
  }, L = () => {
    I(!1);
  }, y = () => F.current, M = i.find((K) => K.value === y())?.label, U = async (K) => {
    if (X({ includeCredentials: !1 })) {
      R(!0), E(""), T("");
      try {
        const W = await iA(K.credential, y());
        r(W);
      } catch (W) {
        E(
          W instanceof Error ? W.message : t("signIn.googleError")
        );
      } finally {
        R(!1);
      }
    }
  }, k = async (K) => {
    if (K.preventDefault(), !!X()) {
      R(!0), E("");
      try {
        await n({
          username: h.trim(),
          password: g,
          account_type: y()
        });
      } catch (W) {
        const Z = W instanceof Error ? W.message : "";
        if (Z.includes("401") || Z.includes("400")) {
          E(t("signIn.invalidCredentials"));
          return;
        }
        E(
          W instanceof Error ? W.message : t("signIn.loginFailed")
        );
      } finally {
        R(!1);
      }
    }
  }, X = ({ includeCredentials: K = !0 } = {}) => {
    let W = !0;
    return a && !b ? (D(t("signIn.selectAccountTypeError")), W = !1) : D(""), K && (h.trim() ? S("") : (S(t("signIn.enterUsername")), W = !1), g ? C("") : (C(t("signIn.passwordRequired")), W = !1)), W;
  };
  return /* @__PURE__ */ f.jsx(ep, { ...e, children: /* @__PURE__ */ f.jsxs("div", { className: "relative flex min-h-screen overflow-hidden bg-background", children: [
    /* @__PURE__ */ f.jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden", children: [
      /* @__PURE__ */ f.jsx("div", { className: "absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" }),
      /* @__PURE__ */ f.jsx("div", { className: "absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/4 blur-[100px]" }),
      /* @__PURE__ */ f.jsx("div", { className: "absolute left-1/3 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-sky-500/4 blur-[80px] dark:bg-sky-400/4" })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "relative hidden flex-col justify-between overflow-hidden border-r border-border/30 bg-card/20 p-12 backdrop-blur-sm lg:flex lg:w-[42%] xl:w-[38%]", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10", children: [
        /* @__PURE__ */ f.jsx("div", { className: "absolute -left-16 -top-16 h-72 w-72 rounded-full bg-primary/8 blur-3xl" }),
        /* @__PURE__ */ f.jsx("div", { className: "absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/6 blur-3xl" })
      ] }),
      /* @__PURE__ */ f.jsx(Os, {}),
      /* @__PURE__ */ f.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ f.jsx("p", { className: "font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary/80", children: l }),
        /* @__PURE__ */ f.jsxs("p", { className: "text-[2.75rem] font-bold leading-[1.15] tracking-tight text-foreground", children: [
          c,
          /* @__PURE__ */ f.jsx("br", {}),
          /* @__PURE__ */ f.jsx("span", { className: "text-primary", children: d })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "relative flex flex-1 flex-col", children: [
      /* @__PURE__ */ f.jsx("div", { className: "absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6", children: e.headerChildren ?? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
        /* @__PURE__ */ f.jsx(V1, {}),
        /* @__PURE__ */ f.jsx(tp, {})
      ] }) }),
      /* @__PURE__ */ f.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-10", children: [
        /* @__PURE__ */ f.jsx("div", { className: "mb-10 lg:hidden", children: /* @__PURE__ */ f.jsx(Os, {}) }),
        /* @__PURE__ */ f.jsxs("div", { className: "w-full max-w-[360px]", children: [
          /* @__PURE__ */ f.jsxs("div", { className: "mb-8 space-y-1.5", children: [
            /* @__PURE__ */ f.jsxs("h1", { className: "flex flex-wrap items-center gap-x-3 gap-y-2 text-3xl font-bold tracking-tight", children: [
              /* @__PURE__ */ f.jsx("span", { children: u }),
              /* @__PURE__ */ f.jsx("span", { className: "text-lg font-medium text-primary", children: "as" }),
              a ? /* @__PURE__ */ f.jsx(
                el,
                {
                  id: "account-type",
                  value: b,
                  options: i,
                  placeholder: t("signIn.selectAccountType"),
                  disabled: Y,
                  className: "h-11 w-auto min-w-[11rem] rounded-xl border-primary/25 bg-primary/5 px-4 text-base font-semibold text-primary",
                  contentClassName: "w-[14rem]",
                  onValueChange: (K) => {
                    A(K), O && D("");
                  }
                }
              ) : M ? /* @__PURE__ */ f.jsx("span", { className: "text-lg font-medium text-primary", children: M }) : null
            ] }),
            /* @__PURE__ */ f.jsx("p", { className: "text-sm text-muted-foreground", children: p }),
            O && /* @__PURE__ */ f.jsx("p", { className: "text-sm text-destructive", children: O })
          ] }),
          /* @__PURE__ */ f.jsxs("form", { className: "space-y-5", onSubmit: k, noValidate: !0, children: [
            z && /* @__PURE__ */ f.jsx(pr, { variant: "error", children: z }),
            P && /* @__PURE__ */ f.jsx(pr, { variant: "success", children: P }),
            /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ f.jsx(Cn, { htmlFor: "username", className: "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ f.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ f.jsx("span", { children: t("signIn.username") }),
                /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ f.jsx(
                en,
                {
                  "aria-invalid": !!w,
                  id: "username",
                  type: "text",
                  name: "username",
                  placeholder: t("signIn.usernamePlaceholder"),
                  autoComplete: "username",
                  autoFocus: !0,
                  required: !0,
                  value: h,
                  onChange: (K) => {
                    m(K.target.value), w && S("");
                  },
                  disabled: Y
                }
              ),
              w && /* @__PURE__ */ f.jsx("p", { className: "text-sm text-destructive", children: w })
            ] }),
            /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ f.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ f.jsx(Cn, { htmlFor: "password", className: "font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ f.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ f.jsx("span", { children: t("signIn.password") }),
                  /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                ] }) }),
                /* @__PURE__ */ f.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: B,
                    className: "text-xs font-medium text-primary transition hover:text-primary/75",
                    children: t("signIn.forgotPassword")
                  }
                )
              ] }),
              /* @__PURE__ */ f.jsx(
                en,
                {
                  "aria-invalid": !!N,
                  name: "password",
                  placeholder: "••••••",
                  type: "password",
                  id: "password",
                  autoComplete: "current-password",
                  required: !0,
                  value: g,
                  onChange: (K) => {
                    x(K.target.value), N && C("");
                  },
                  disabled: Y
                }
              ),
              N && /* @__PURE__ */ f.jsx("p", { className: "text-sm text-destructive", children: N })
            ] }),
            /* @__PURE__ */ f.jsx(
              me,
              {
                type: "submit",
                className: "h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-[0_14px_30px_-14px_color-mix(in_oklab,var(--primary)_65%,transparent)] transition-all hover:scale-[1.01] hover:bg-primary/92 hover:shadow-[0_18px_36px_-16px_color-mix(in_oklab,var(--primary)_72%,transparent)] disabled:scale-100 disabled:bg-primary disabled:shadow-none",
                size: "lg",
                disabled: Y,
                children: t(Y ? "signIn.signingIn" : "signIn.passwordSubmit")
              }
            ),
            e.googleClientId && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
              /* @__PURE__ */ f.jsxs("div", { className: "relative py-1", children: [
                /* @__PURE__ */ f.jsx(Yw, {}),
                /* @__PURE__ */ f.jsx("span", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground", children: t("signIn.or") })
              ] }),
              /* @__PURE__ */ f.jsx("div", { className: "rounded-2xl border border-dashed border-border/70 bg-muted/35 p-4", children: /* @__PURE__ */ f.jsx("div", { id: "google-btn", className: "flex min-h-10 justify-center" }) })
            ] })
          ] }),
          /* @__PURE__ */ f.jsx("div", { className: "mt-8 space-y-2 text-center", children: /* @__PURE__ */ f.jsx(
            "a",
            {
              href: "https://docs.google.com/document/d/1vueS_dzdvDkBex5BLe_F03GEFLzjtoiFbNi0VJa2_gE/edit?tab=t.0",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex text-xs font-medium text-muted-foreground/70 transition hover:text-muted-foreground",
              children: t("signIn.guideLink")
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(
      G1,
      {
        open: j,
        handleClose: L
      }
    )
  ] }) });
}
function cA({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
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
function uA({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
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
function dA({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: H("leading-none font-semibold", e),
      ...t
    }
  );
}
function fA({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: H("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function IP({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
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
function hA({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: H("px-6", e),
      ...t
    }
  );
}
function PP({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: H("flex items-center px-6 [.border-t]:pt-6", e),
      ...t
    }
  );
}
function RP(e) {
  const { t } = ke(), [n, r] = v.useState(""), [i, o] = v.useState(""), [s, a] = v.useState(""), [l, c] = v.useState(""), [d, u] = v.useState(""), [p, h] = v.useState(!1);
  v.useEffect(() => {
    const x = new URLSearchParams(window.location.search).get("token") || "";
    r(x);
  }, []);
  const m = async (g) => {
    if (g.preventDefault(), u(""), !n.trim()) {
      u(t("resetPassword.tokenRequired"));
      return;
    }
    if (!i.trim()) {
      u(t("resetPassword.usernameRequired"));
      return;
    }
    if (!s) {
      u(t("resetPassword.passwordRequired"));
      return;
    }
    if (!l) {
      u(t("resetPassword.confirmRequired"));
      return;
    }
    if (s !== l) {
      u(t("resetPassword.passwordMismatch"));
      return;
    }
    h(!0);
    try {
      await sA({
        token: n.trim(),
        username: i.trim(),
        password: s
      }), e.onNavigateToSignIn?.(t("resetPassword.success")), !e.onNavigateToSignIn && e.signInPath && window.location.assign(e.signInPath);
    } catch (x) {
      u(
        x instanceof Error ? x.message : t("resetPassword.error")
      );
    } finally {
      h(!1);
    }
  };
  return /* @__PURE__ */ f.jsx(ep, { ...e, children: /* @__PURE__ */ f.jsxs("div", { className: "relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8", children: [
    /* @__PURE__ */ f.jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_24%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" }),
    /* @__PURE__ */ f.jsx("div", { className: "pointer-events-none absolute bottom-[-8rem] right-[-3rem] -z-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" }),
    /* @__PURE__ */ f.jsx(tp, { className: "fixed right-4 top-4 z-20 sm:right-6 sm:top-6" }),
    /* @__PURE__ */ f.jsx("div", { className: "mx-auto flex w-full max-w-md flex-1 items-center", children: /* @__PURE__ */ f.jsxs(cA, { className: "w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur", children: [
      /* @__PURE__ */ f.jsxs(uA, { className: "gap-5 px-6 pt-6 sm:px-8 sm:pt-8", children: [
        /* @__PURE__ */ f.jsx("div", { className: "flex justify-center sm:justify-start", children: /* @__PURE__ */ f.jsx(Os, {}) }),
        /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ f.jsx(dA, { className: "text-3xl tracking-tight", children: t("resetPassword.title") }),
          /* @__PURE__ */ f.jsx(fA, { className: "text-sm leading-6", children: t("resetPassword.description") })
        ] })
      ] }),
      /* @__PURE__ */ f.jsx(hA, { className: "px-6 pb-6 sm:px-8 sm:pb-8", children: /* @__PURE__ */ f.jsxs(
        "form",
        {
          className: "space-y-4",
          onSubmit: m,
          noValidate: !0,
          children: [
            d && /* @__PURE__ */ f.jsx(pr, { variant: "error", children: d }),
            /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ f.jsx(Cn, { htmlFor: "username", children: /* @__PURE__ */ f.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ f.jsx("span", { children: t("resetPassword.username") }),
                /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ f.jsx(
                en,
                {
                  id: "username",
                  name: "username",
                  type: "text",
                  autoComplete: "username",
                  required: !0,
                  value: i,
                  onChange: (g) => o(g.target.value),
                  disabled: p
                }
              )
            ] }),
            /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ f.jsx(Cn, { htmlFor: "new-password", children: /* @__PURE__ */ f.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ f.jsx("span", { children: t("resetPassword.newPassword") }),
                /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ f.jsx(
                en,
                {
                  id: "new-password",
                  name: "new-password",
                  type: "password",
                  autoComplete: "new-password",
                  required: !0,
                  value: s,
                  onChange: (g) => a(g.target.value),
                  disabled: p
                }
              )
            ] }),
            /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ f.jsx(Cn, { htmlFor: "confirm-password", children: /* @__PURE__ */ f.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ f.jsx("span", { children: t("resetPassword.confirmPassword") }),
                /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
              ] }) }),
              /* @__PURE__ */ f.jsx(
                en,
                {
                  id: "confirm-password",
                  name: "confirm-password",
                  type: "password",
                  autoComplete: "new-password",
                  required: !0,
                  value: l,
                  onChange: (g) => c(g.target.value),
                  disabled: p
                }
              )
            ] }),
            /* @__PURE__ */ f.jsx(me, { type: "submit", className: "w-full", disabled: p, children: t(p ? "resetPassword.submitting" : "resetPassword.submit") }),
            /* @__PURE__ */ f.jsx(
              me,
              {
                type: "button",
                className: "w-full",
                variant: "outline",
                onClick: () => {
                  e.onNavigateToSignIn?.(), !e.onNavigateToSignIn && e.signInPath && window.location.assign(e.signInPath);
                },
                disabled: p,
                children: t("resetPassword.backToSignIn")
              }
            )
          ]
        }
      ) })
    ] }) })
  ] }) });
}
function pA(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n += 1)
    if (e[n]?.key !== t[n]?.key || e[n]?.value !== t[n]?.value)
      return !1;
  return !0;
}
function mA(e, t) {
  return e ? e.count === t.count && e.saving === t.saving && e.disabled === t.disabled && e.keyLabel === t.keyLabel && e.valueLabel === t.valueLabel && e.onSave === t.onSave && e.onCancel === t.onCancel && pA(e.items, t.items) : !1;
}
const ip = Nt(
  void 0
);
function DP({ children: e }) {
  const [t, n] = ge(null), [r, i] = ge(
    {}
  ), [o, s] = ge({}), a = Ye(
    (A, w) => {
      const S = A.trim();
      S && (s((N) => {
        const C = w.count;
        if (C <= 0) {
          if (!(S in N))
            return N;
          const O = { ...N };
          return delete O[S], O;
        }
        return N[S] === C ? N : {
          ...N,
          [S]: C
        };
      }), i((N) => {
        const C = N[S];
        return mA(C, w) ? N : {
          ...N,
          [S]: w
        };
      }));
    },
    []
  ), l = Ye((A) => {
    const w = A.trim();
    w && i((S) => {
      if (!(w in S))
        return S;
      const N = { ...S };
      return delete N[w], N;
    });
  }, []), c = be(() => Object.entries(r).flatMap(
    ([A, w]) => w.items.map((S) => ({
      section: A,
      key: S.key,
      value: S.value
    }))
  ), [r]), d = be(
    () => Object.values(r).reduce(
      (A, w) => A + w.count,
      0
    ),
    [r]
  ), u = be(() => {
    const A = Object.entries(r).reduce(
      (w, [S, N]) => (w[S] = N.count, w),
      {}
    );
    return {
      ...o,
      ...A
    };
  }, [o, r]), p = be(
    () => Object.entries(r).find(([, A]) => A.count > 0)?.[0] ?? null,
    [r]
  ), h = t && r[t] ? t : p, m = h ? r[h] ?? null : null, g = Ye(() => {
    if (m?.onSave)
      return m.onSave();
  }, [m]), x = Ye(() => {
    m?.onCancel?.();
  }, [m]), b = be(
    () => ({
      globalPendingCount: d,
      globalPendingItems: c,
      sectionPendingCounts: u,
      activeSection: h,
      activeSectionPendingCount: m?.count ?? 0,
      activeSectionSaving: m?.saving ?? !1,
      activeSectionDisabled: m?.disabled ?? !1,
      activeSectionKeyLabel: m?.keyLabel ?? "Name",
      activeSectionValueLabel: m?.valueLabel ?? "Changed",
      setActiveSection: n,
      registerSection: a,
      unregisterSection: l,
      handleSaveActiveSection: g,
      handleCancelActiveSection: x
    }),
    [
      h,
      m,
      d,
      c,
      u,
      x,
      g,
      a,
      l
    ]
  );
  return /* @__PURE__ */ f.jsx(ip.Provider, { value: b, children: e });
}
function OP() {
  const e = qe(ip);
  if (!e)
    throw new Error("usePendingChanges must be used within a PendingChangesProvider");
  return e;
}
function TP(e) {
  const { mode: t, systemMode: n, setMode: r } = $h(), { className: i, ...o } = e, a = (n || t) === "light" ? /* @__PURE__ */ f.jsx(Mi, { className: "size-4" }) : /* @__PURE__ */ f.jsx(ji, { className: "size-4" });
  return /* @__PURE__ */ f.jsxs(ao, { children: [
    /* @__PURE__ */ f.jsx(lo, { asChild: !0, children: /* @__PURE__ */ f.jsx(
      me,
      {
        "data-screenshot": "toggle-mode",
        variant: "ghost",
        size: "icon",
        className: H("rounded-full", i),
        "aria-label": "Toggle color mode",
        ...o,
        children: a
      }
    ) }),
    /* @__PURE__ */ f.jsxs(co, { align: "end", className: "w-44", children: [
      /* @__PURE__ */ f.jsx(Q1, { children: "Appearance" }),
      /* @__PURE__ */ f.jsx(Z1, {}),
      /* @__PURE__ */ f.jsxs(
        Xa,
        {
          value: t,
          onValueChange: (l) => r(l),
          children: [
            /* @__PURE__ */ f.jsxs(tn, { value: "system", children: [
              /* @__PURE__ */ f.jsx(js, { className: "mr-2 size-4" }),
              "System"
            ] }),
            /* @__PURE__ */ f.jsxs(tn, { value: "light", children: [
              /* @__PURE__ */ f.jsx(Mi, { className: "mr-2 size-4" }),
              "Light"
            ] }),
            /* @__PURE__ */ f.jsxs(tn, { value: "dark", children: [
              /* @__PURE__ */ f.jsx(ji, { className: "mr-2 size-4" }),
              "Dark"
            ] })
          ]
        }
      )
    ] })
  ] });
}
function zP() {
  return /* @__PURE__ */ f.jsx("div", { className: "flex min-h-[240px] w-full items-center justify-center", children: /* @__PURE__ */ f.jsx(Za, { className: "size-7 animate-spin text-muted-foreground" }) });
}
function Vo(e) {
  return Array.isArray(e) ? e.filter(
    (t) => typeof t == "string" && t.trim().length > 0
  ) : typeof e == "string" ? e.split(/\s+/).map((t) => t.trim()).filter(Boolean) : [];
}
function op(e) {
  return !!e && typeof e == "object";
}
function tl(e) {
  if (op(e)) {
    const t = Vo(e.roles);
    return t.length > 0 ? t : Vo(e.scope);
  }
  return Vo(e);
}
function BP(e, t) {
  return tl(e).includes(t);
}
function gA(e, t) {
  const n = tl(e);
  return t.some((r) => n.includes(r));
}
function LP(e) {
  return !op(e) || e.account_type !== "employee" ? !1 : gA(e, [
    "classes_get",
    "sessions_get",
    "schedules_get",
    "tests_get",
    "classes_feedbacks_get"
  ]);
}
const xA = ["payrolls_get", "tasks_get", "projects_get"];
function FP({
  value: e,
  onValueChange: t,
  additionalOptions: n,
  placeholder: r = "Select scopes"
}) {
  const i = be(() => tl(e), [e]), o = be(() => new Set(i), [i]), s = be(() => {
    const l = [...xA, ...n ?? [], ...i];
    return Array.from(new Set(l.filter(Boolean)));
  }, [n, i]), a = i.length > 0 ? i.join(" ") : r;
  return /* @__PURE__ */ f.jsx("div", { className: "w-full min-w-0", children: /* @__PURE__ */ f.jsxs(ao, { children: [
    /* @__PURE__ */ f.jsx(lo, { asChild: !0, children: /* @__PURE__ */ f.jsxs(
      "button",
      {
        type: "button",
        className: "grid h-10 w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-hidden rounded-md border border-input bg-background px-3 text-sm font-normal",
        children: [
          /* @__PURE__ */ f.jsx("span", { className: "block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left", children: a }),
          /* @__PURE__ */ f.jsx(Qa, { className: "size-4 shrink-0 opacity-60" })
        ]
      }
    ) }),
    /* @__PURE__ */ f.jsx(
      co,
      {
        align: "start",
        className: "w-[--radix-dropdown-menu-trigger-width] min-w-[260px] p-1",
        children: /* @__PURE__ */ f.jsx("div", { className: "max-h-64 overflow-auto", children: s.map((l) => {
          const c = o.has(l);
          return /* @__PURE__ */ f.jsxs(
            "button",
            {
              type: "button",
              className: "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted",
              onClick: () => {
                const d = c ? i.filter((u) => u !== l) : [...i, l];
                t(d.join(" "));
              },
              children: [
                /* @__PURE__ */ f.jsx("span", { children: l }),
                /* @__PURE__ */ f.jsx("span", { className: "ml-2 inline-flex size-4 items-center justify-center", children: c ? /* @__PURE__ */ f.jsx(Ua, { className: "size-4" }) : null })
              ]
            },
            l
          );
        }) })
      }
    )
  ] }) });
}
function bA({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
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
function yA({
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
  const { t: d } = ke();
  return /* @__PURE__ */ f.jsx(Va, { open: e, onOpenChange: (u) => !u && !t && a(), children: /* @__PURE__ */ f.jsxs(
    Wa,
    {
      showCloseButton: !t,
      className: "!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[calc(100%-1rem)] max-h-[calc(100svh-1rem)] !max-w-none sm:!w-[80vw] sm:max-h-[90vh] sm:!max-w-none flex flex-col overflow-hidden border-0 bg-card p-0 shadow-xl",
      children: [
        /* @__PURE__ */ f.jsxs(Ja, { className: "shrink-0 border-b border-border/60 px-4 py-3 text-left sm:px-5 sm:py-3.5", children: [
          /* @__PURE__ */ f.jsx(qa, { children: n }),
          r && /* @__PURE__ */ f.jsx(Jh, { children: r })
        ] }),
        /* @__PURE__ */ f.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4", children: /* @__PURE__ */ f.jsxs("div", { className: "flex min-h-full flex-col justify-center gap-3", children: [
          i && /* @__PURE__ */ f.jsx(pr, { variant: "error", children: i }),
          c
        ] }) }),
        /* @__PURE__ */ f.jsxs(Wh, { className: "shrink-0 border-t border-border/60 px-4 py-3 sm:px-5 sm:py-3.5", showCloseButton: !1, children: [
          /* @__PURE__ */ f.jsx(me, { type: "button", variant: "outline", onClick: a, disabled: t, children: d("common.cancel") }),
          /* @__PURE__ */ f.jsx(me, { type: "button", onClick: () => {
            l();
          }, disabled: t || s, children: o })
        ] })
      ]
    }
  ) });
}
function uo({ className: e, containerClassName: t, ...n }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: H("relative w-full overflow-x-auto", t),
      children: /* @__PURE__ */ f.jsx(
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
function sp({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: H("[&_tr]:border-b", e),
      ...t
    }
  );
}
function fo({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: H("[&_tr:last-child]:border-0", e),
      ...t
    }
  );
}
function GP({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
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
function kt({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
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
function ap({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
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
function ft({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: H("p-4 align-middle", e),
      ...t
    }
  );
}
function YP({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    "caption",
    {
      "data-slot": "table-caption",
      className: H("mt-4 text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function vA({ label: e = "", required: t = !1, helperText: n, children: r, className: i, align: o = "center", fullWidth: s = !1 }) {
  return s ? /* @__PURE__ */ f.jsx(kt, { className: H("block border-b border-border/60 hover:bg-transparent md:table-row", i), children: /* @__PURE__ */ f.jsxs(ft, { colSpan: 2, className: "block w-full px-3 py-3 md:table-cell", children: [
    e && /* @__PURE__ */ f.jsxs("div", { className: "mb-2 space-y-1", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: [
        /* @__PURE__ */ f.jsx("span", { children: e }),
        t && /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
      ] }),
      n && /* @__PURE__ */ f.jsx("p", { className: "text-xs normal-case leading-5 text-muted-foreground", children: n })
    ] }),
    r
  ] }) }) : /* @__PURE__ */ f.jsxs(kt, { className: H("block border-b border-border/60 hover:bg-transparent md:table-row", i), children: [
    /* @__PURE__ */ f.jsx(
      ft,
      {
        className: H(
          "block w-full px-3 pt-3 pb-1.5 align-top text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground md:table-cell md:w-[160px] md:px-3 md:py-2.5",
          o === "center" ? "md:align-middle" : "md:align-top"
        ),
        children: /* @__PURE__ */ f.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ f.jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ f.jsx("span", { children: e }),
            t && /* @__PURE__ */ f.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
          ] }),
          n && /* @__PURE__ */ f.jsx("p", { className: "text-xs normal-case leading-5 text-muted-foreground", children: n })
        ] })
      }
    ),
    /* @__PURE__ */ f.jsx(
      ft,
      {
        className: H(
          "block w-full min-w-0 px-3 pt-1.5 pb-3 text-sm md:table-cell md:px-3 md:py-2.5",
          o === "center" ? "md:align-middle" : "md:align-top"
        ),
        children: r
      }
    )
  ] });
}
function wA({ children: e }) {
  return /* @__PURE__ */ f.jsx("div", { className: "overflow-hidden rounded-2xl bg-transparent", children: /* @__PURE__ */ f.jsx(uo, { className: "w-full table-fixed", containerClassName: "overflow-x-hidden", children: /* @__PURE__ */ f.jsx(fo, { children: e }) }) });
}
function AA({
  open: e,
  saving: t = !1,
  title: n,
  description: r,
  error: i,
  submitLabel: o,
  submitDisabled: s = !1,
  onClose: a,
  onSubmit: l,
  children: c
}) {
  const { t: d } = ke();
  return /* @__PURE__ */ f.jsx(
    yA,
    {
      open: e,
      saving: t,
      title: n,
      description: r,
      error: i,
      submitLabel: o ?? d("common.create"),
      submitDisabled: s,
      onClose: a,
      onSubmit: l,
      children: /* @__PURE__ */ f.jsx(wA, { children: c })
    }
  );
}
function kA(e, t) {
  return e === "boolean" ? t === !0 : t == null ? "" : String(t);
}
function EA(e) {
  return e.includes(`
`) || e.length > 80;
}
function CA(e, t) {
  const n = e.split(`
`).length, r = Math.ceil(e.length / 90);
  return Math.min(12, Math.max(t ?? 3, n, r));
}
function SA(e) {
  return e === "number" ? "number" : e === "date" ? "date" : "text";
}
function HP({
  open: e,
  title: t,
  fields: n,
  initialValues: r,
  error: i,
  saving: o = !1,
  onClose: s,
  onSubmit: a
}) {
  const { t: l } = ke(), [c, d] = ge([]);
  ue(() => {
    e && d(n.map((h) => {
      const m = kA(h.type, r[h.key]);
      return {
        ...h,
        value: m,
        initialValue: m
      };
    }));
  }, [n, r, e]);
  const u = (h, m) => {
    d((g) => g.map((x) => x.key === h ? { ...x, value: m } : x));
  }, p = async () => {
    const h = c.reduce((m, g) => {
      if (g.value === g.initialValue || g.readOnly)
        return m;
      if (g.type === "boolean")
        return m[g.key] = !!g.value, m;
      const x = typeof g.value == "string" ? g.value.trim() : "";
      return x ? g.type === "number" ? (m[g.key] = Number(x), m) : (m[g.key] = x, m) : (m[g.key] = null, m);
    }, {});
    await a(h);
  };
  return /* @__PURE__ */ f.jsx(
    AA,
    {
      open: e,
      saving: o,
      title: t,
      description: l("patchRecord.description"),
      error: i,
      submitLabel: l("common.save"),
      onClose: s,
      onSubmit: p,
      children: c.map((h) => {
        const m = typeof h.value == "string" ? h.value : "", g = h.type === "text" && (h.multiline || EA(m));
        return /* @__PURE__ */ f.jsx(
          vA,
          {
            label: h.label,
            helperText: h.helperText,
            align: g ? "start" : "center",
            children: h.type === "boolean" ? /* @__PURE__ */ f.jsxs("label", { className: "inline-flex items-center gap-3 text-sm", children: [
              /* @__PURE__ */ f.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: !!h.value,
                  disabled: h.readOnly,
                  onChange: (x) => u(h.key, x.target.checked),
                  className: "size-4 rounded border-input accent-primary"
                }
              ),
              /* @__PURE__ */ f.jsx("span", { children: h.value ? l("patchRecord.enabled") : l("patchRecord.disabled") })
            ] }) : h.type === "select" ? /* @__PURE__ */ f.jsx(
              el,
              {
                value: m,
                onValueChange: (x) => u(h.key, x),
                disabled: h.readOnly,
                options: [
                  { value: "", label: l("patchRecord.placeholder", void 0, { label: h.label }) },
                  ...(h.options ?? []).map((x) => ({ value: x.value, label: x.label }))
                ],
                placeholder: l("patchRecord.placeholder", void 0, { label: h.label }),
                searchPlaceholder: l("patchRecord.searchField", void 0, { label: h.label.toLowerCase() })
              }
            ) : g ? /* @__PURE__ */ f.jsx(
              bA,
              {
                value: m,
                onChange: (x) => u(h.key, x.target.value),
                readOnly: h.readOnly,
                disabled: h.readOnly,
                rows: CA(m, h.minRows),
                placeholder: h.label,
                className: "resize-y"
              }
            ) : /* @__PURE__ */ f.jsx(
              en,
              {
                value: m,
                type: SA(h.type),
                onChange: (x) => u(h.key, x.target.value),
                readOnly: h.readOnly,
                disabled: h.readOnly,
                placeholder: h.label
              }
            )
          },
          h.key
        );
      })
    }
  );
}
var nl = Lr(), se = (e) => Br(e, nl), rl = Lr();
se.write = (e) => Br(e, rl);
var ho = Lr();
se.onStart = (e) => Br(e, ho);
var il = Lr();
se.onFrame = (e) => Br(e, il);
var ol = Lr();
se.onFinish = (e) => Br(e, ol);
var Nn = [];
se.setTimeout = (e, t) => {
  const n = se.now() + t, r = () => {
    const o = Nn.findIndex((s) => s.cancel == r);
    ~o && Nn.splice(o, 1), Bt -= ~o ? 1 : 0;
  }, i = { time: n, handler: e, cancel: r };
  return Nn.splice(lp(n), 0, i), Bt += 1, cp(), i;
};
var lp = (e) => ~(~Nn.findIndex((t) => t.time > e) || ~Nn.length);
se.cancel = (e) => {
  ho.delete(e), il.delete(e), ol.delete(e), nl.delete(e), rl.delete(e);
};
se.sync = (e) => {
  Ts = !0, se.batchedUpdates(e), Ts = !1;
};
se.throttle = (e) => {
  let t;
  function n() {
    try {
      e(...t);
    } finally {
      t = null;
    }
  }
  function r(...i) {
    t = i, se.onStart(n);
  }
  return r.handler = e, r.cancel = () => {
    ho.delete(n), t = null;
  }, r;
};
var sl = typeof window < "u" ? window.requestAnimationFrame : (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (() => {
  })
);
se.use = (e) => sl = e;
se.now = typeof performance < "u" ? () => performance.now() : Date.now;
se.batchedUpdates = (e) => e();
se.catch = console.error;
se.frameLoop = "always";
se.advance = () => {
  se.frameLoop !== "demand" ? console.warn(
    "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
  ) : dp();
};
var zt = -1, Bt = 0, Ts = !1;
function Br(e, t) {
  Ts ? (t.delete(e), e(0)) : (t.add(e), cp());
}
function cp() {
  zt < 0 && (zt = 0, se.frameLoop !== "demand" && sl(up));
}
function NA() {
  zt = -1;
}
function up() {
  ~zt && (sl(up), se.batchedUpdates(dp));
}
function dp() {
  const e = zt;
  zt = se.now();
  const t = lp(zt);
  if (t && (fp(Nn.splice(0, t), (n) => n.handler()), Bt -= t), !Bt) {
    NA();
    return;
  }
  ho.flush(), nl.flush(e ? Math.min(64, zt - e) : 16.667), il.flush(), rl.flush(), ol.flush();
}
function Lr() {
  let e = /* @__PURE__ */ new Set(), t = e;
  return {
    add(n) {
      Bt += t == e && !e.has(n) ? 1 : 0, e.add(n);
    },
    delete(n) {
      return Bt -= t == e && e.has(n) ? 1 : 0, e.delete(n);
    },
    flush(n) {
      t.size && (e = /* @__PURE__ */ new Set(), Bt -= t.size, fp(t, (r) => r(n) && e.add(r)), Bt += e.size, t = e);
    }
  };
}
function fp(e, t) {
  e.forEach((n) => {
    try {
      t(n);
    } catch (r) {
      se.catch(r);
    }
  });
}
var jA = Object.defineProperty, MA = (e, t) => {
  for (var n in t)
    jA(e, n, { get: t[n], enumerable: !0 });
}, rt = {};
MA(rt, {
  assign: () => PA,
  colors: () => Ft,
  createStringInterpolator: () => ll,
  skipAnimation: () => pp,
  to: () => hp,
  willAdvance: () => cl
});
function zs() {
}
var IA = (e, t, n) => Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 }), V = {
  arr: Array.isArray,
  obj: (e) => !!e && e.constructor.name === "Object",
  fun: (e) => typeof e == "function",
  str: (e) => typeof e == "string",
  num: (e) => typeof e == "number",
  und: (e) => e === void 0
};
function At(e, t) {
  if (V.arr(e)) {
    if (!V.arr(t) || e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++)
      if (e[n] !== t[n]) return !1;
    return !0;
  }
  return e === t;
}
var fe = (e, t) => e.forEach(t);
function pt(e, t, n) {
  if (V.arr(e)) {
    for (let r = 0; r < e.length; r++)
      t.call(n, e[r], `${r}`);
    return;
  }
  for (const r in e)
    e.hasOwnProperty(r) && t.call(n, e[r], r);
}
var He = (e) => V.und(e) ? [] : V.arr(e) ? e : [e];
function nr(e, t) {
  if (e.size) {
    const n = Array.from(e);
    e.clear(), fe(n, t);
  }
}
var $n = (e, ...t) => nr(e, (n) => n(...t)), al = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent), ll, hp, Ft = null, pp = !1, cl = zs, PA = (e) => {
  e.to && (hp = e.to), e.now && (se.now = e.now), e.colors !== void 0 && (Ft = e.colors), e.skipAnimation != null && (pp = e.skipAnimation), e.createStringInterpolator && (ll = e.createStringInterpolator), e.requestAnimationFrame && se.use(e.requestAnimationFrame), e.batchedUpdates && (se.batchedUpdates = e.batchedUpdates), e.willAdvance && (cl = e.willAdvance), e.frameLoop && (se.frameLoop = e.frameLoop);
}, rr = /* @__PURE__ */ new Set(), We = [], Wo = [], Oi = 0, po = {
  get idle() {
    return !rr.size && !We.length;
  },
  /** Advance the given animation on every frame until idle. */
  start(e) {
    Oi > e.priority ? (rr.add(e), se.onStart(RA)) : (mp(e), se(Bs));
  },
  /** Advance all animations by the given time. */
  advance: Bs,
  /** Call this when an animation's priority changes. */
  sort(e) {
    if (Oi)
      se.onFrame(() => po.sort(e));
    else {
      const t = We.indexOf(e);
      ~t && (We.splice(t, 1), gp(e));
    }
  },
  /**
   * Clear all animations. For testing purposes.
   *
   * ☠️ Never call this from within the frameloop.
   */
  clear() {
    We = [], rr.clear();
  }
};
function RA() {
  rr.forEach(mp), rr.clear(), se(Bs);
}
function mp(e) {
  We.includes(e) || gp(e);
}
function gp(e) {
  We.splice(
    DA(We, (t) => t.priority > e.priority),
    0,
    e
  );
}
function Bs(e) {
  const t = Wo;
  for (let n = 0; n < We.length; n++) {
    const r = We[n];
    Oi = r.priority, r.idle || (cl(r), r.advance(e), r.idle || t.push(r));
  }
  return Oi = 0, Wo = We, Wo.length = 0, We = t, We.length > 0;
}
function DA(e, t) {
  const n = e.findIndex(t);
  return n < 0 ? e.length : n;
}
var OA = {
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
}, $e = "[-+]?\\d*\\.?\\d+", Ti = $e + "%";
function mo(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
var TA = new RegExp("rgb" + mo($e, $e, $e)), zA = new RegExp("rgba" + mo($e, $e, $e, $e)), BA = new RegExp("hsl" + mo($e, Ti, Ti)), LA = new RegExp(
  "hsla" + mo($e, Ti, Ti, $e)
), FA = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, GA = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, YA = /^#([0-9a-fA-F]{6})$/, HA = /^#([0-9a-fA-F]{8})$/;
function UA(e) {
  let t;
  return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = YA.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Ft && Ft[e] !== void 0 ? Ft[e] : (t = TA.exec(e)) ? (yn(t[1]) << 24 | // r
  yn(t[2]) << 16 | // g
  yn(t[3]) << 8 | // b
  255) >>> // a
  0 : (t = zA.exec(e)) ? (yn(t[1]) << 24 | // r
  yn(t[2]) << 16 | // g
  yn(t[3]) << 8 | // b
  Kc(t[4])) >>> // a
  0 : (t = FA.exec(e)) ? parseInt(
    t[1] + t[1] + // r
    t[2] + t[2] + // g
    t[3] + t[3] + // b
    "ff",
    // a
    16
  ) >>> 0 : (t = HA.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = GA.exec(e)) ? parseInt(
    t[1] + t[1] + // r
    t[2] + t[2] + // g
    t[3] + t[3] + // b
    t[4] + t[4],
    // a
    16
  ) >>> 0 : (t = BA.exec(e)) ? (Jc(
    qc(t[1]),
    // h
    oi(t[2]),
    // s
    oi(t[3])
    // l
  ) | 255) >>> // a
  0 : (t = LA.exec(e)) ? (Jc(
    qc(t[1]),
    // h
    oi(t[2]),
    // s
    oi(t[3])
    // l
  ) | Kc(t[4])) >>> // a
  0 : null;
}
function Jo(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function Jc(e, t, n) {
  const r = n < 0.5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r, o = Jo(i, r, e + 1 / 3), s = Jo(i, r, e), a = Jo(i, r, e - 1 / 3);
  return Math.round(o * 255) << 24 | Math.round(s * 255) << 16 | Math.round(a * 255) << 8;
}
function yn(e) {
  const t = parseInt(e, 10);
  return t < 0 ? 0 : t > 255 ? 255 : t;
}
function qc(e) {
  return (parseFloat(e) % 360 + 360) % 360 / 360;
}
function Kc(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function oi(e) {
  const t = parseFloat(e);
  return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function Xc(e) {
  let t = UA(e);
  if (t === null) return e;
  t = t || 0;
  const n = (t & 4278190080) >>> 24, r = (t & 16711680) >>> 16, i = (t & 65280) >>> 8, o = (t & 255) / 255;
  return `rgba(${n}, ${r}, ${i}, ${o})`;
}
var gr = (e, t, n) => {
  if (V.fun(e))
    return e;
  if (V.arr(e))
    return gr({
      range: e,
      output: t,
      extrapolate: n
    });
  if (V.str(e.output[0]))
    return ll(e);
  const r = e, i = r.output, o = r.range || [0, 1], s = r.extrapolateLeft || r.extrapolate || "extend", a = r.extrapolateRight || r.extrapolate || "extend", l = r.easing || ((c) => c);
  return (c) => {
    const d = ZA(c, o);
    return QA(
      c,
      o[d],
      o[d + 1],
      i[d],
      i[d + 1],
      l,
      s,
      a,
      r.map
    );
  };
};
function QA(e, t, n, r, i, o, s, a, l) {
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
function ZA(e, t) {
  for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n)
    ;
  return n - 1;
}
var VA = {
  linear: (e) => e
}, xr = /* @__PURE__ */ Symbol.for("FluidValue.get"), Pn = /* @__PURE__ */ Symbol.for("FluidValue.observers"), Ze = (e) => !!(e && e[xr]), Te = (e) => e && e[xr] ? e[xr]() : e, _c = (e) => e[Pn] || null;
function WA(e, t) {
  e.eventObserved ? e.eventObserved(t) : e(t);
}
function br(e, t) {
  const n = e[Pn];
  n && n.forEach((r) => {
    WA(r, t);
  });
}
var xp = class {
  constructor(e) {
    if (!e && !(e = this.get))
      throw Error("Unknown getter");
    JA(this, e);
  }
}, JA = (e, t) => bp(e, xr, t);
function Tn(e, t) {
  if (e[xr]) {
    let n = e[Pn];
    n || bp(e, Pn, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
  }
  return t;
}
function yr(e, t) {
  const n = e[Pn];
  if (n && n.has(t)) {
    const r = n.size - 1;
    r ? n.delete(t) : e[Pn] = null, e.observerRemoved && e.observerRemoved(r, t);
  }
}
var bp = (e, t, n) => Object.defineProperty(e, t, {
  value: n,
  writable: !0,
  configurable: !0
}), mi = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, qA = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, $c = new RegExp(`(${mi.source})(%|[a-z]+)`, "i"), KA = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, go = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, yp = (e) => {
  const [t, n] = XA(e);
  if (!t || al())
    return e;
  const r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
  if (r)
    return r.trim();
  if (n && n.startsWith("--")) {
    const i = window.getComputedStyle(document.documentElement).getPropertyValue(n);
    return i || e;
  } else {
    if (n && go.test(n))
      return yp(n);
    if (n)
      return n;
  }
  return e;
}, XA = (e) => {
  const t = go.exec(e);
  if (!t) return [,];
  const [, n, r] = t;
  return [n, r];
}, qo, _A = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`, vp = (e) => {
  qo || (qo = Ft ? (
    // match color names, ignore partial matches
    new RegExp(`(${Object.keys(Ft).join("|")})(?!\\w)`, "g")
  ) : (
    // never match
    /^\b$/
  ));
  const t = e.output.map((o) => Te(o).replace(go, yp).replace(qA, Xc).replace(qo, Xc)), n = t.map((o) => o.match(mi).map(Number)), i = n[0].map(
    (o, s) => n.map((a) => {
      if (!(s in a))
        throw Error('The arity of each "output" value must be equal');
      return a[s];
    })
  ).map(
    (o) => gr({ ...e, output: o })
  );
  return (o) => {
    const s = !$c.test(t[0]) && t.find((l) => $c.test(l))?.replace(mi, "");
    let a = 0;
    return t[0].replace(
      mi,
      () => `${i[a++](o)}${s || ""}`
    ).replace(KA, _A);
  };
}, ul = "react-spring: ", wp = (e) => {
  const t = e;
  let n = !1;
  if (typeof t != "function")
    throw new TypeError(`${ul}once requires a function parameter`);
  return (...r) => {
    n || (t(...r), n = !0);
  };
}, $A = wp(console.warn);
function ek() {
  $A(
    `${ul}The "interpolate" function is deprecated in v9 (use "to" instead)`
  );
}
var tk = wp(console.warn);
function nk() {
  tk(
    `${ul}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`
  );
}
function xo(e) {
  return V.str(e) && (e[0] == "#" || /\d/.test(e) || // Do not identify a CSS variable as an AnimatedString if its SSR
  !al() && go.test(e) || e in (Ft || {}));
}
var dl = al() ? ue : cr, rk = () => {
  const e = pe(!1);
  return dl(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
};
function Ap() {
  const e = ge()[1], t = rk();
  return () => {
    t.current && e(Math.random());
  };
}
var kp = (e) => ue(e, ik), ik = [];
function eu(e) {
  const t = pe(void 0);
  return ue(() => {
    t.current = e;
  }), t.current;
}
var vr = /* @__PURE__ */ Symbol.for("Animated:node"), ok = (e) => !!e && e[vr] === e, at = (e) => e && e[vr], fl = (e, t) => IA(e, vr, t), bo = (e) => e && e[vr] && e[vr].getPayload(), Ep = class {
  constructor() {
    fl(this, this);
  }
  /** Get every `AnimatedValue` used by this node. */
  getPayload() {
    return this.payload || [];
  }
}, yo = class Cp extends Ep {
  constructor(t) {
    super(), this._value = t, this.done = !0, this.durationProgress = 0, V.num(this._value) && (this.lastPosition = this._value);
  }
  /** @internal */
  static create(t) {
    return new Cp(t);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(t, n) {
    return V.num(t) && (this.lastPosition = t, n && (t = Math.round(t / n) * n, this.done && (this.lastPosition = t))), this._value === t ? !1 : (this._value = t, !0);
  }
  reset() {
    const { done: t } = this;
    this.done = !1, V.num(this._value) && (this.elapsedTime = 0, this.durationProgress = 0, this.lastPosition = this._value, t && (this.lastVelocity = null), this.v0 = null);
  }
}, zi = class Sp extends yo {
  constructor(t) {
    super(0), this._string = null, this._toString = gr({
      output: [t, t]
    });
  }
  /** @internal */
  static create(t) {
    return new Sp(t);
  }
  getValue() {
    const t = this._string;
    return t ?? (this._string = this._toString(this._value));
  }
  setValue(t) {
    if (V.str(t)) {
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
    t && (this._toString = gr({
      output: [this.getValue(), t]
    })), this._value = 0, super.reset();
  }
}, Bi = { dependencies: null }, vo = class extends Ep {
  constructor(e) {
    super(), this.source = e, this.setValue(e);
  }
  getValue(e) {
    const t = {};
    return pt(this.source, (n, r) => {
      ok(n) ? t[r] = n.getValue(e) : Ze(n) ? t[r] = Te(n) : e || (t[r] = n);
    }), t;
  }
  /** Replace the raw object data */
  setValue(e) {
    this.source = e, this.payload = this._makePayload(e);
  }
  reset() {
    this.payload && fe(this.payload, (e) => e.reset());
  }
  /** Create a payload set. */
  _makePayload(e) {
    if (e) {
      const t = /* @__PURE__ */ new Set();
      return pt(e, this._addToPayload, t), Array.from(t);
    }
  }
  /** Add to a payload set. */
  _addToPayload(e) {
    Bi.dependencies && Ze(e) && Bi.dependencies.add(e);
    const t = bo(e);
    t && fe(t, (n) => this.add(n));
  }
}, sk = class Np extends vo {
  constructor(t) {
    super(t);
  }
  /** @internal */
  static create(t) {
    return new Np(t);
  }
  getValue() {
    return this.source.map((t) => t.getValue());
  }
  setValue(t) {
    const n = this.getPayload();
    return t.length == n.length ? n.map((r, i) => r.setValue(t[i])).some(Boolean) : (super.setValue(t.map(ak)), !0);
  }
};
function ak(e) {
  return (xo(e) ? zi : yo).create(e);
}
function Ls(e) {
  const t = at(e);
  return t ? t.constructor : V.arr(e) ? sk : xo(e) ? zi : yo;
}
var tu = (e, t) => {
  const n = (
    // Function components must use "forwardRef" to avoid being
    // re-rendered on every animation frame.
    !V.fun(e) || e.prototype && e.prototype.isReactComponent
  );
  return Qi((r, i) => {
    const o = pe(null), s = n && // eslint-disable-next-line react-hooks/rules-of-hooks
    Ye(
      (m) => {
        o.current = uk(i, m);
      },
      [i]
    ), [a, l] = ck(r, t), c = Ap(), d = () => {
      const m = o.current;
      if (n && !m)
        return;
      (m ? t.applyAnimatedValues(m, a.getValue(!0)) : !1) === !1 && c();
    }, u = new lk(d, l), p = pe(void 0);
    dl(() => (p.current = u, fe(l, (m) => Tn(m, u)), () => {
      p.current && (fe(
        p.current.deps,
        (m) => yr(m, p.current)
      ), se.cancel(p.current.update));
    })), ue(d, []), kp(() => () => {
      const m = p.current;
      fe(m.deps, (g) => yr(g, m));
    });
    const h = t.getComponentProps(a.getValue());
    return /* @__PURE__ */ v.createElement(e, { ...h, ref: s });
  });
}, lk = class {
  constructor(e, t) {
    this.update = e, this.deps = t;
  }
  eventObserved(e) {
    e.type == "change" && se.write(this.update);
  }
};
function ck(e, t) {
  const n = /* @__PURE__ */ new Set();
  return Bi.dependencies = n, e.style && (e = {
    ...e,
    style: t.createAnimatedStyle(e.style)
  }), e = new vo(e), Bi.dependencies = null, [e, n];
}
function uk(e, t) {
  return e && (V.fun(e) ? e(t) : e.current = t), t;
}
var nu = /* @__PURE__ */ Symbol.for("AnimatedComponent"), dk = (e, {
  applyAnimatedValues: t = () => !1,
  createAnimatedStyle: n = (i) => new vo(i),
  getComponentProps: r = (i) => i
} = {}) => {
  const i = {
    applyAnimatedValues: t,
    createAnimatedStyle: n,
    getComponentProps: r
  }, o = (s) => {
    const a = ru(s) || "Anonymous";
    return V.str(s) ? s = o[s] || (o[s] = tu(s, i)) : s = s[nu] || (s[nu] = tu(s, i)), s.displayName = `Animated(${a})`, s;
  };
  return pt(e, (s, a) => {
    V.arr(e) && (a = ru(s)), o[a] = o(s);
  }), {
    animated: o
  };
}, ru = (e) => V.str(e) ? e : e && V.str(e.displayName) ? e.displayName : V.fun(e) && e.name || null;
function $t(e, ...t) {
  return V.fun(e) ? e(...t) : e;
}
var ir = (e, t) => e === !0 || !!(t && e && (V.fun(e) ? e(t) : He(e).includes(t))), jp = (e, t) => V.obj(e) ? t && e[t] : e, Mp = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, fk = (e) => e, hl = (e, t = fk) => {
  let n = hk;
  e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
  const r = {};
  for (const i of n) {
    const o = t(e[i], i);
    V.und(o) || (r[i] = o);
  }
  return r;
}, hk = [
  "config",
  "onProps",
  "onStart",
  "onChange",
  "onPause",
  "onResume",
  "onRest"
], pk = {
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
function mk(e) {
  const t = {};
  let n = 0;
  if (pt(e, (r, i) => {
    pk[i] || (t[i] = r, n++);
  }), n)
    return t;
}
function Ip(e) {
  const t = mk(e);
  if (t) {
    const n = { to: t };
    return pt(e, (r, i) => i in t || (n[i] = r)), n;
  }
  return { ...e };
}
function wr(e) {
  return e = Te(e), V.arr(e) ? e.map(wr) : xo(e) ? rt.createStringInterpolator({
    range: [0, 1],
    output: [e, e]
  })(1) : e;
}
function gk(e) {
  for (const t in e) return !0;
  return !1;
}
function Fs(e) {
  return V.fun(e) || V.arr(e) && V.obj(e[0]);
}
function xk(e, t) {
  e.ref?.delete(e), t?.delete(e);
}
function bk(e, t) {
  t && e.ref !== t && (e.ref?.delete(e), t.add(e), e.ref = t);
}
var yk = {
  default: { tension: 170, friction: 26 }
}, Gs = {
  ...yk.default,
  mass: 1,
  damping: 1,
  easing: VA.linear,
  clamp: !1
}, vk = class {
  constructor() {
    this.velocity = 0, Object.assign(this, Gs);
  }
};
function wk(e, t, n) {
  n && (n = { ...n }, iu(n, t), t = { ...n, ...t }), iu(e, t), Object.assign(e, t);
  for (const s in Gs)
    e[s] == null && (e[s] = Gs[s]);
  let { frequency: r, damping: i } = e;
  const { mass: o } = e;
  return V.und(r) || (r < 0.01 && (r = 0.01), i < 0 && (i = 0), e.tension = Math.pow(2 * Math.PI / r, 2) * o, e.friction = 4 * Math.PI * i * o / r), e;
}
function iu(e, t) {
  if (!V.und(t.decay))
    e.duration = void 0;
  else {
    const n = !V.und(t.tension) || !V.und(t.friction);
    (n || !V.und(t.frequency) || !V.und(t.damping) || !V.und(t.mass)) && (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0);
  }
}
var ou = [], Ak = class {
  constructor() {
    this.changed = !1, this.values = ou, this.toValues = null, this.fromValues = ou, this.config = new vk(), this.immediate = !1;
  }
};
function Pp(e, { key: t, props: n, defaultProps: r, state: i, actions: o }) {
  return new Promise((s, a) => {
    let l, c, d = ir(n.cancel ?? r?.cancel, t);
    if (d)
      h();
    else {
      V.und(n.pause) || (i.paused = ir(n.pause, t));
      let m = r?.pause;
      m !== !0 && (m = i.paused || ir(m, t)), l = $t(n.delay || 0, t), m ? (i.resumeQueue.add(p), o.pause()) : (o.resume(), p());
    }
    function u() {
      i.resumeQueue.add(p), i.timeouts.delete(c), c.cancel(), l = c.time - se.now();
    }
    function p() {
      l > 0 && !rt.skipAnimation ? (i.delayed = !0, c = se.setTimeout(h, l), i.pauseQueue.add(u), i.timeouts.add(c)) : h();
    }
    function h() {
      i.delayed && (i.delayed = !1), i.pauseQueue.delete(u), i.timeouts.delete(c), e <= (i.cancelId || 0) && (d = !0);
      try {
        o.start({ ...n, callId: e, cancel: d }, s);
      } catch (m) {
        a(m);
      }
    }
  });
}
var pl = (e, t) => t.length == 1 ? t[0] : t.some((n) => n.cancelled) ? jn(e.get()) : t.every((n) => n.noop) ? Rp(e.get()) : _e(
  e.get(),
  t.every((n) => n.finished)
), Rp = (e) => ({
  value: e,
  noop: !0,
  finished: !0,
  cancelled: !1
}), _e = (e, t, n = !1) => ({
  value: e,
  finished: t,
  cancelled: n
}), jn = (e) => ({
  value: e,
  cancelled: !0,
  finished: !1
});
function Dp(e, t, n, r) {
  const { callId: i, parentId: o, onRest: s } = t, { asyncTo: a, promise: l } = n;
  return !o && e === a && !t.reset ? l : n.promise = (async () => {
    n.asyncId = i, n.asyncTo = e;
    const c = hl(
      t,
      (x, b) => (
        // The `onRest` prop is only called when the `runAsync` promise is resolved.
        b === "onRest" ? void 0 : x
      )
    );
    let d, u;
    const p = new Promise(
      (x, b) => (d = x, u = b)
    ), h = (x) => {
      const b = (
        // The `cancel` prop or `stop` method was used.
        i <= (n.cancelId || 0) && jn(r) || // The async `to` prop was replaced.
        i !== n.asyncId && _e(r, !1)
      );
      if (b)
        throw x.result = b, u(x), x;
    }, m = (x, b) => {
      const A = new su(), w = new au();
      return (async () => {
        if (rt.skipAnimation)
          throw Ar(n), w.result = _e(r, !1), u(w), w;
        h(A);
        const S = V.obj(x) ? { ...x } : { ...b, to: x };
        S.parentId = i, pt(c, (C, O) => {
          V.und(S[O]) && (S[O] = C);
        });
        const N = await r.start(S);
        return h(A), n.paused && await new Promise((C) => {
          n.resumeQueue.add(C);
        }), N;
      })();
    };
    let g;
    if (rt.skipAnimation)
      return Ar(n), _e(r, !1);
    try {
      let x;
      V.arr(e) ? x = (async (b) => {
        for (const A of b)
          await m(A);
      })(e) : x = Promise.resolve(e(m, r.stop.bind(r))), await Promise.all([x.then(d), p]), g = _e(r.get(), !0, !1);
    } catch (x) {
      if (x instanceof su)
        g = x.result;
      else if (x instanceof au)
        g = x.result;
      else
        throw x;
    } finally {
      i == n.asyncId && (n.asyncId = o, n.asyncTo = o ? a : void 0, n.promise = o ? l : void 0);
    }
    return V.fun(s) && se.batchedUpdates(() => {
      s(g, r, r.item);
    }), g;
  })();
}
function Ar(e, t) {
  nr(e.timeouts, (n) => n.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t);
}
var su = class extends Error {
  constructor() {
    super(
      "An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."
    );
  }
}, au = class extends Error {
  constructor() {
    super("SkipAnimationSignal");
  }
}, Ys = (e) => e instanceof ml, kk = 1, ml = class extends xp {
  constructor() {
    super(...arguments), this.id = kk++, this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(e) {
    this._priority != e && (this._priority = e, this._onPriorityChange(e));
  }
  /** Get the current value */
  get() {
    const e = at(this);
    return e && e.getValue();
  }
  /** Create a spring that maps our value to another value */
  to(...e) {
    return rt.to(this, e);
  }
  /** @deprecated Use the `to` method instead. */
  interpolate(...e) {
    return ek(), rt.to(this, e);
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
    br(this, {
      type: "change",
      parent: this,
      value: e,
      idle: t
    });
  }
  /** Tell our children about our new priority */
  _onPriorityChange(e) {
    this.idle || po.sort(this), br(this, {
      type: "priority",
      parent: this,
      priority: e
    });
  }
}, ln = /* @__PURE__ */ Symbol.for("SpringPhase"), Op = 1, Hs = 2, Us = 4, Ko = (e) => (e[ln] & Op) > 0, Dt = (e) => (e[ln] & Hs) > 0, Zn = (e) => (e[ln] & Us) > 0, lu = (e, t) => t ? e[ln] |= Hs | Op : e[ln] &= ~Hs, cu = (e, t) => t ? e[ln] |= Us : e[ln] &= ~Us, Ek = class extends ml {
  constructor(e, t) {
    if (super(), this.animation = new Ak(), this.defaultProps = {}, this._state = {
      paused: !1,
      delayed: !1,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    }, this._pendingCalls = /* @__PURE__ */ new Set(), this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !V.und(e) || !V.und(t)) {
      const n = V.obj(e) ? { ...e } : { ...t, from: e };
      V.und(n.default) && (n.default = !0), this.start(n);
    }
  }
  /** Equals true when not advancing on each frame. */
  get idle() {
    return !(Dt(this) || this._state.asyncTo) || Zn(this);
  }
  get goal() {
    return Te(this.animation.to);
  }
  get velocity() {
    const e = at(this);
    return e instanceof yo ? e.lastVelocity || 0 : e.getPayload().map((t) => t.lastVelocity || 0);
  }
  /**
   * When true, this value has been animated at least once.
   */
  get hasAnimated() {
    return Ko(this);
  }
  /**
   * When true, this value has an unfinished animation,
   * which is either active or paused.
   */
  get isAnimating() {
    return Dt(this);
  }
  /**
   * When true, all current and future animations are paused.
   */
  get isPaused() {
    return Zn(this);
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
    const { config: o } = r, s = bo(r.to);
    !s && Ze(r.to) && (i = He(Te(r.to))), r.values.forEach((c, d) => {
      if (c.done) return;
      const u = (
        // Animated strings always go from 0 to 1.
        c.constructor == zi ? 1 : s ? s[d].lastPosition : i[d]
      );
      let p = r.immediate, h = u;
      if (!p) {
        if (h = c.lastPosition, o.tension <= 0) {
          c.done = !0;
          return;
        }
        let m = c.elapsedTime += e;
        const g = r.fromValues[d], x = c.v0 != null ? c.v0 : c.v0 = V.arr(o.velocity) ? o.velocity[d] : o.velocity;
        let b;
        const A = o.precision || (g == u ? 5e-3 : Math.min(1, Math.abs(u - g) * 1e-3));
        if (V.und(o.duration))
          if (o.decay) {
            const w = o.decay === !0 ? 0.998 : o.decay, S = Math.exp(-(1 - w) * m);
            h = g + x / (1 - w) * (1 - S), p = Math.abs(c.lastPosition - h) <= A, b = x * S;
          } else {
            b = c.lastVelocity == null ? x : c.lastVelocity;
            const w = o.restVelocity || A / 10, S = o.clamp ? 0 : o.bounce, N = !V.und(S), C = g == u ? c.v0 > 0 : g < u;
            let O, D = !1;
            const z = 1, E = Math.ceil(e / z);
            for (let P = 0; P < E && (O = Math.abs(b) > w, !(!O && (p = Math.abs(u - h) <= A, p))); ++P) {
              N && (D = h == u || h > u == C, D && (b = -b * S, h = u));
              const T = -o.tension * 1e-6 * (h - u), Y = -o.friction * 1e-3 * b, R = (T + Y) / o.mass;
              b = b + R * z, h = h + b * z;
            }
          }
        else {
          let w = 1;
          o.duration > 0 && (this._memoizedDuration !== o.duration && (this._memoizedDuration = o.duration, c.durationProgress > 0 && (c.elapsedTime = o.duration * c.durationProgress, m = c.elapsedTime += e)), w = (o.progress || 0) + m / this._memoizedDuration, w = w > 1 ? 1 : w < 0 ? 0 : w, c.durationProgress = w), h = g + o.easing(w) * (u - g), b = (h - c.lastPosition) / e, p = w == 1;
        }
        c.lastVelocity = b, Number.isNaN(h) && (console.warn("Got NaN while animating:", this), p = !0);
      }
      s && !s[d].done && (p = !1), p ? c.done = !0 : t = !1, c.setValue(h, o.round) && (n = !0);
    });
    const a = at(this), l = a.getValue();
    if (t) {
      const c = Te(r.to);
      (l !== c || n) && !o.decay ? (a.setValue(c), this._onChange(c)) : n && o.decay && this._onChange(l), this._stop();
    } else n && this._onChange(l);
  }
  /** Set the current value, while stopping the current animation */
  set(e) {
    return se.batchedUpdates(() => {
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
    if (Dt(this)) {
      const { to: e, config: t } = this.animation;
      se.batchedUpdates(() => {
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
    return V.und(e) ? (n = this.queue || [], this.queue = []) : n = [V.obj(e) ? e : { ...t, to: e }], Promise.all(
      n.map((r) => this._update(r))
    ).then((r) => pl(this, r));
  }
  /**
   * Stop the current animation, and cancel any delayed updates.
   *
   * Pass `true` to call `onRest` with `cancelled: true`.
   */
  stop(e) {
    const { to: t } = this.animation;
    return this._focus(this.get()), Ar(this._state, e && this._lastCallId), se.batchedUpdates(() => this._stop(t, e)), this;
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
    n = V.obj(n) ? n[t] : n, (n == null || Fs(n)) && (n = void 0), r = V.obj(r) ? r[t] : r, r == null && (r = void 0);
    const i = { to: n, from: r };
    return Ko(this) || (e.reverse && ([n, r] = [r, n]), r = Te(r), V.und(r) ? at(this) || this._set(n) : this._set(r)), i;
  }
  /** Every update is processed by this method before merging. */
  _update({ ...e }, t) {
    const { key: n, defaultProps: r } = this;
    e.default && Object.assign(
      r,
      hl(
        e,
        (s, a) => /^on/.test(a) ? jp(s, n) : s
      )
    ), du(this, e, "onProps"), Wn(this, "onProps", e, this);
    const i = this._prepareNode(e);
    if (Object.isFrozen(this))
      throw Error(
        "Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?"
      );
    const o = this._state;
    return Pp(++this._lastCallId, {
      key: n,
      props: e,
      defaultProps: r,
      state: o,
      actions: {
        pause: () => {
          Zn(this) || (cu(this, !0), $n(o.pauseQueue), Wn(
            this,
            "onPause",
            _e(this, Vn(this, this.animation.to)),
            this
          ));
        },
        resume: () => {
          Zn(this) && (cu(this, !1), Dt(this) && this._resume(), $n(o.resumeQueue), Wn(
            this,
            "onResume",
            _e(this, Vn(this, this.animation.to)),
            this
          ));
        },
        start: this._merge.bind(this, i)
      }
    }).then((s) => {
      if (e.loop && s.finished && !(t && s.noop)) {
        const a = Tp(e);
        if (a)
          return this._update(a, !0);
      }
      return s;
    });
  }
  /** Merge props into the current animation */
  _merge(e, t, n) {
    if (t.cancel)
      return this.stop(!0), n(jn(this));
    const r = !V.und(e.to), i = !V.und(e.from);
    if (r || i)
      if (t.callId > this._lastToId)
        this._lastToId = t.callId;
      else
        return n(jn(this));
    const { key: o, defaultProps: s, animation: a } = this, { to: l, from: c } = a;
    let { to: d = l, from: u = c } = e;
    i && !r && (!t.default || V.und(d)) && (d = u), t.reverse && ([d, u] = [u, d]);
    const p = !At(u, c);
    p && (a.from = u), u = Te(u);
    const h = !At(d, l);
    h && this._focus(d);
    const m = Fs(t.to), { config: g } = a, { decay: x, velocity: b } = g;
    (r || i) && (g.velocity = 0), t.config && !m && wk(
      g,
      $t(t.config, o),
      // Avoid calling the same "config" prop twice.
      t.config !== s.config ? $t(s.config, o) : void 0
    );
    let A = at(this);
    if (!A || V.und(d))
      return n(_e(this, !0));
    const w = (
      // When `reset` is undefined, the `from` prop implies `reset: true`,
      // except for declarative updates. When `reset` is defined, there
      // must exist a value to animate from.
      V.und(t.reset) ? i && !t.default : !V.und(u) && ir(t.reset, o)
    ), S = w ? u : this.get(), N = wr(d), C = V.num(N) || V.arr(N) || xo(N), O = !m && (!C || ir(s.immediate || t.immediate, o));
    if (h) {
      const P = Ls(d);
      if (P !== A.constructor)
        if (O)
          A = this._set(N);
        else
          throw Error(
            `Cannot animate between ${A.constructor.name} and ${P.name}, as the "to" prop suggests`
          );
    }
    const D = A.constructor;
    let z = Ze(d), E = !1;
    if (!z) {
      const P = w || !Ko(this) && p;
      (h || P) && (E = At(wr(S), N), z = !E), (!At(a.immediate, O) && !O || !At(g.decay, x) || !At(g.velocity, b)) && (z = !0);
    }
    if (E && Dt(this) && (a.changed && !w ? z = !0 : z || this._stop(l)), !m && ((z || Ze(l)) && (a.values = A.getPayload(), a.toValues = Ze(d) ? null : D == zi ? [1] : He(N)), a.immediate != O && (a.immediate = O, !O && !w && this._set(l)), z)) {
      const { onRest: P } = a;
      fe(Sk, (Y) => du(this, t, Y));
      const T = _e(this, Vn(this, l));
      $n(this._pendingCalls, T), this._pendingCalls.add(n), a.changed && se.batchedUpdates(() => {
        a.changed = !w, P?.(T, this), w ? $t(s.onRest, T) : a.onStart?.(T, this);
      });
    }
    w && this._set(S), m ? n(Dp(t.to, t, this._state, this)) : z ? this._start() : Dt(this) && !h ? this._pendingCalls.add(n) : n(Rp(S));
  }
  /** Update the `animation.to` value, which might be a `FluidValue` */
  _focus(e) {
    const t = this.animation;
    e !== t.to && (_c(this) && this._detach(), t.to = e, _c(this) && this._attach());
  }
  _attach() {
    let e = 0;
    const { to: t } = this.animation;
    Ze(t) && (Tn(t, this), Ys(t) && (e = t.priority + 1)), this.priority = e;
  }
  _detach() {
    const { to: e } = this.animation;
    Ze(e) && yr(e, this);
  }
  /**
   * Update the current value from outside the frameloop,
   * and return the `Animated` node.
   */
  _set(e, t = !0) {
    const n = Te(e);
    if (!V.und(n)) {
      const r = at(this);
      if (!r || !At(n, r.getValue())) {
        const i = Ls(n);
        !r || r.constructor != i ? fl(this, i.create(n)) : r.setValue(n), r && se.batchedUpdates(() => {
          this._onChange(n, t);
        });
      }
    }
    return at(this);
  }
  _onStart() {
    const e = this.animation;
    e.changed || (e.changed = !0, Wn(
      this,
      "onStart",
      _e(this, Vn(this, e.to)),
      this
    ));
  }
  _onChange(e, t) {
    t || (this._onStart(), $t(this.animation.onChange, e, this)), $t(this.defaultProps.onChange, e, this), super._onChange(e, t);
  }
  // This method resets the animation state (even if already animating) to
  // ensure the latest from/to range is used, and it also ensures this spring
  // is added to the frameloop.
  _start() {
    const e = this.animation;
    at(this).reset(Te(e.to)), e.immediate || (e.fromValues = e.values.map((t) => t.lastPosition)), Dt(this) || (lu(this, !0), Zn(this) || this._resume());
  }
  _resume() {
    rt.skipAnimation ? this.finish() : po.start(this);
  }
  /**
   * Exit the frameloop and notify `onRest` listeners.
   *
   * Always wrap `_stop` calls with `batchedUpdates`.
   */
  _stop(e, t) {
    if (Dt(this)) {
      lu(this, !1);
      const n = this.animation;
      fe(n.values, (i) => {
        i.done = !0;
      }), n.toValues && (n.onChange = n.onPause = n.onResume = void 0), br(this, {
        type: "idle",
        parent: this
      });
      const r = t ? jn(this.get()) : _e(this.get(), Vn(this, e ?? n.to));
      $n(this._pendingCalls, r), n.changed && (n.changed = !1, Wn(this, "onRest", r, this));
    }
  }
};
function Vn(e, t) {
  const n = wr(t), r = wr(e.get());
  return At(r, n);
}
function Tp(e, t = e.loop, n = e.to) {
  const r = $t(t);
  if (r) {
    const i = r !== !0 && Ip(r), o = (i || e).reverse, s = !i || i.reset;
    return kr({
      ...e,
      loop: t,
      // Avoid updating default props when looping.
      default: !1,
      // Never loop the `pause` prop.
      pause: void 0,
      // For the "reverse" prop to loop as expected, the "to" prop
      // must be undefined. The "reverse" prop is ignored when the
      // "to" prop is an array or function.
      to: !o || Fs(n) ? n : void 0,
      // Ignore the "from" prop except on reset.
      from: s ? e.from : void 0,
      reset: s,
      // The "loop" prop can return a "useSpring" props object to
      // override any of the original props.
      ...i
    });
  }
}
function kr(e) {
  const { to: t, from: n } = e = Ip(e), r = /* @__PURE__ */ new Set();
  return V.obj(t) && uu(t, r), V.obj(n) && uu(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function Ck(e) {
  const t = kr(e);
  return V.und(t.default) && (t.default = hl(t)), t;
}
function uu(e, t) {
  pt(e, (n, r) => n != null && t.add(r));
}
var Sk = [
  "onStart",
  "onRest",
  "onChange",
  "onPause",
  "onResume"
];
function du(e, t, n) {
  e.animation[n] = t[n] !== Mp(t, n) ? jp(t[n], e.key) : void 0;
}
function Wn(e, t, ...n) {
  e.animation[t]?.(...n), e.defaultProps[t]?.(...n);
}
var Nk = ["onStart", "onChange", "onRest"], jk = 1, Mk = class {
  constructor(e, t) {
    this.id = jk++, this.springs = {}, this.queue = [], this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._state = {
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
      V.und(n) || this.springs[t].set(n);
    }
  }
  /** Push an update onto the queue of each value. */
  update(e) {
    return e && this.queue.push(kr(e)), this;
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
    return e ? t = He(e).map(kr) : this.queue = [], this._flush ? this._flush(this, t) : (Gp(this, t), Qs(this, t));
  }
  /** @internal */
  stop(e, t) {
    if (e !== !!e && (t = e), t) {
      const n = this.springs;
      fe(He(t), (r) => n[r].stop(!!e));
    } else
      Ar(this._state, this._lastAsyncId), this.each((n) => n.stop(!!e));
    return this;
  }
  /** Freeze the active animation in time */
  pause(e) {
    if (V.und(e))
      this.start({ pause: !0 });
    else {
      const t = this.springs;
      fe(He(e), (n) => t[n].pause());
    }
    return this;
  }
  /** Resume the animation if paused. */
  resume(e) {
    if (V.und(e))
      this.start({ pause: !1 });
    else {
      const t = this.springs;
      fe(He(e), (n) => t[n].resume());
    }
    return this;
  }
  /** Call a function once per spring value */
  each(e) {
    pt(this.springs, e);
  }
  /** @internal Called at the end of every animation frame */
  _onFrame() {
    const { onStart: e, onChange: t, onRest: n } = this._events, r = this._active.size > 0, i = this._changed.size > 0;
    (r && !this._started || i && !this._started) && (this._started = !0, nr(e, ([a, l]) => {
      l.value = this.get(), a(l, this, this._item);
    }));
    const o = !r && this._started, s = i || o && n.size ? this.get() : null;
    i && t.size && nr(t, ([a, l]) => {
      l.value = s, a(l, this, this._item);
    }), o && (this._started = !1, nr(n, ([a, l]) => {
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
    se.onFrame(this._onFrame);
  }
};
function Qs(e, t) {
  return Promise.all(t.map((n) => zp(e, n))).then(
    (n) => pl(e, n)
  );
}
async function zp(e, t, n) {
  const { keys: r, to: i, from: o, loop: s, onRest: a, onResolve: l } = t, c = V.obj(t.default) && t.default;
  s && (t.loop = !1), i === !1 && (t.to = null), o === !1 && (t.from = null);
  const d = V.arr(i) || V.fun(i) ? i : void 0;
  d ? (t.to = void 0, t.onRest = void 0, c && (c.onRest = void 0)) : fe(Nk, (g) => {
    const x = t[g];
    if (V.fun(x)) {
      const b = e._events[g];
      t[g] = ({ finished: A, cancelled: w }) => {
        const S = b.get(x);
        S ? (A || (S.finished = !1), w && (S.cancelled = !0)) : b.set(x, {
          value: null,
          finished: A || !1,
          cancelled: w || !1
        });
      }, c && (c[g] = t[g]);
    }
  });
  const u = e._state;
  t.pause === !u.paused ? (u.paused = t.pause, $n(t.pause ? u.pauseQueue : u.resumeQueue)) : u.paused && (t.pause = !0);
  const p = (r || Object.keys(e.springs)).map(
    (g) => e.springs[g].start(t)
  ), h = t.cancel === !0 || Mp(t, "cancel") === !0;
  (d || h && u.asyncId) && p.push(
    Pp(++e._lastAsyncId, {
      props: t,
      state: u,
      actions: {
        pause: zs,
        resume: zs,
        start(g, x) {
          h ? (Ar(u, e._lastAsyncId), x(jn(e))) : (g.onRest = a, x(
            Dp(
              d,
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
  const m = pl(e, await Promise.all(p));
  if (s && m.finished && !(n && m.noop)) {
    const g = Tp(t, s, i);
    if (g)
      return Gp(e, [g]), zp(e, g, !0);
  }
  return l && se.batchedUpdates(() => l(m, e, e.item)), m;
}
function fu(e, t) {
  const n = { ...e.springs };
  return t && fe(He(t), (r) => {
    V.und(r.keys) && (r = kr(r)), V.obj(r.to) || (r = { ...r, to: void 0 }), Fp(n, r, (i) => Lp(i));
  }), Bp(e, n), n;
}
function Bp(e, t) {
  pt(t, (n, r) => {
    e.springs[r] || (e.springs[r] = n, Tn(n, e));
  });
}
function Lp(e, t) {
  const n = new Ek();
  return n.key = e, t && Tn(n, t), n;
}
function Fp(e, t, n) {
  t.keys && fe(t.keys, (r) => {
    (e[r] || (e[r] = n(r)))._prepareNode(t);
  });
}
function Gp(e, t) {
  fe(t, (n) => {
    Fp(e.springs, n, (r) => Lp(r, e));
  });
}
var Ik = v.createContext({
  pause: !1,
  immediate: !1
}), Pk = () => {
  const e = [], t = function(r) {
    nk();
    const i = [];
    return fe(e, (o, s) => {
      if (V.und(r))
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
    return fe(e, (r) => r.pause(...arguments)), this;
  }, t.resume = function() {
    return fe(e, (r) => r.resume(...arguments)), this;
  }, t.set = function(r) {
    fe(e, (i, o) => {
      const s = V.fun(r) ? r(o, i) : r;
      s && i.set(s);
    });
  }, t.start = function(r) {
    const i = [];
    return fe(e, (o, s) => {
      if (V.und(r))
        i.push(o.start());
      else {
        const a = this._getProps(r, o, s);
        a && i.push(o.start(a));
      }
    }), i;
  }, t.stop = function() {
    return fe(e, (r) => r.stop(...arguments)), this;
  }, t.update = function(r) {
    return fe(e, (i, o) => i.update(this._getProps(r, i, o))), this;
  };
  const n = function(r, i, o) {
    return V.fun(r) ? r(o, i) : r;
  };
  return t._getProps = n, t;
};
function Rk(e, t, n) {
  const r = V.fun(t) && t;
  r && !n && (n = []);
  const i = be(
    () => r || arguments.length == 3 ? Pk() : void 0,
    []
  ), o = pe(0), s = Ap(), a = be(
    () => ({
      ctrls: [],
      queue: [],
      flush(b, A) {
        const w = fu(b, A);
        return o.current > 0 && !a.queue.length && !Object.keys(w).some((N) => !b.springs[N]) ? Qs(b, A) : new Promise((N) => {
          Bp(b, w), a.queue.push(() => {
            N(Qs(b, A));
          }), s();
        });
      }
    }),
    []
  ), l = pe([...a.ctrls]), c = pe([]), d = eu(e) || 0;
  be(() => {
    fe(l.current.slice(e, d), (b) => {
      xk(b, i), b.stop(!0);
    }), l.current.length = e, u(d, e);
  }, [e]), be(() => {
    u(0, Math.min(d, e));
  }, n);
  function u(b, A) {
    for (let w = b; w < A; w++) {
      const S = l.current[w] || (l.current[w] = new Mk(null, a.flush)), N = r ? r(w, S) : t[w];
      N && (c.current[w] = Ck(N));
    }
  }
  const p = l.current.map(
    (b, A) => fu(b, c.current[A])
  ), h = qe(Ik), m = eu(h), g = h !== m && gk(h);
  dl(() => {
    o.current++, a.ctrls = l.current;
    const { queue: b } = a;
    b.length && (a.queue = [], fe(b, (A) => A())), fe(l.current, (A, w) => {
      i?.add(A), g && A.start({ default: h });
      const S = c.current[w];
      S && (bk(A, S.ref), A.ref ? A.queue.push(S) : A.start(S));
    });
  }), kp(() => () => {
    fe(a.ctrls, (b) => b.stop(!0));
  });
  const x = p.map((b) => ({ ...b }));
  return i ? [x, i] : x;
}
function gl(e, t) {
  const n = V.fun(e), [[r], i] = Rk(
    1,
    n ? e : [e],
    n ? [] : t
  );
  return n || arguments.length == 2 ? [r, i] : r;
}
var Dk = class extends ml {
  constructor(e, t) {
    super(), this.source = e, this.idle = !0, this._active = /* @__PURE__ */ new Set(), this.calc = gr(...t);
    const n = this._get(), r = Ls(n);
    fl(this, r.create(n));
  }
  advance(e) {
    const t = this._get(), n = this.get();
    At(t, n) || (at(this).setValue(t), this._onChange(t, this.idle)), !this.idle && hu(this._active) && Xo(this);
  }
  _get() {
    const e = V.arr(this.source) ? this.source.map(Te) : He(Te(this.source));
    return this.calc(...e);
  }
  _start() {
    this.idle && !hu(this._active) && (this.idle = !1, fe(bo(this), (e) => {
      e.done = !1;
    }), rt.skipAnimation ? (se.batchedUpdates(() => this.advance()), Xo(this)) : po.start(this));
  }
  // Observe our sources only when we're observed.
  _attach() {
    let e = 1;
    fe(He(this.source), (t) => {
      Ze(t) && Tn(t, this), Ys(t) && (t.idle || this._active.add(t), e = Math.max(e, t.priority + 1));
    }), this.priority = e, this._start();
  }
  // Stop observing our sources once we have no observers.
  _detach() {
    fe(He(this.source), (e) => {
      Ze(e) && yr(e, this);
    }), this._active.clear(), Xo(this);
  }
  /** @internal */
  eventObserved(e) {
    e.type == "change" ? e.idle ? this.advance() : (this._active.add(e.parent), this._start()) : e.type == "idle" ? this._active.delete(e.parent) : e.type == "priority" && (this.priority = He(this.source).reduce(
      (t, n) => Math.max(t, (Ys(n) ? n.priority : 0) + 1),
      0
    ));
  }
};
function Ok(e) {
  return e.idle !== !1;
}
function hu(e) {
  return !e.size || Array.from(e).every(Ok);
}
function Xo(e) {
  e.idle || (e.idle = !0, fe(bo(e), (t) => {
    t.done = !0;
  }), br(e, {
    type: "idle",
    parent: e
  }));
}
rt.assign({
  createStringInterpolator: vp,
  to: (e, t) => new Dk(e, t)
});
var Yp = /^--/;
function Tk(e, t) {
  return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !Yp.test(e) && !(or.hasOwnProperty(e) && or[e]) ? t + "px" : ("" + t).trim();
}
var pu = {};
function zk(e, t) {
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
  } = t, d = Object.values(c), u = Object.keys(c).map(
    (p) => n || e.hasAttribute(p) ? p : pu[p] || (pu[p] = p.replace(
      /([A-Z])/g,
      // Attributes are written in dash case
      (h) => "-" + h.toLowerCase()
    ))
  );
  o !== void 0 && (e.textContent = o);
  for (const p in i)
    if (i.hasOwnProperty(p)) {
      const h = Tk(p, i[p]);
      Yp.test(p) ? e.style.setProperty(p, h) : e.style[p] = h;
    }
  u.forEach((p, h) => {
    e.setAttribute(p, d[h]);
  }), r !== void 0 && (e.className = r), s !== void 0 && (e.scrollTop = s), a !== void 0 && (e.scrollLeft = a), l !== void 0 && e.setAttribute("viewBox", l);
}
var or = {
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
}, Bk = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), Lk = ["Webkit", "Ms", "Moz", "O"];
or = Object.keys(or).reduce((e, t) => (Lk.forEach((n) => e[Bk(n, t)] = e[t]), e), or);
var Fk = /^(matrix|translate|scale|rotate|skew)/, Gk = /^(translate)/, Yk = /^(rotate|skew)/, _o = (e, t) => V.num(e) && e !== 0 ? e + t : e, gi = (e, t) => V.arr(e) ? e.every((n) => gi(n, t)) : V.num(e) ? e === t : parseFloat(e) === t, Hk = class extends vo {
  constructor({ x: e, y: t, z: n, ...r }) {
    const i = [], o = [];
    (e || t || n) && (i.push([e || 0, t || 0, n || 0]), o.push((s) => [
      `translate3d(${s.map((a) => _o(a, "px")).join(",")})`,
      // prettier-ignore
      gi(s, 0)
    ])), pt(r, (s, a) => {
      if (a === "transform")
        i.push([s || ""]), o.push((l) => [l, l === ""]);
      else if (Fk.test(a)) {
        if (delete r[a], V.und(s)) return;
        const l = Gk.test(a) ? "px" : Yk.test(a) ? "deg" : "";
        i.push(He(s)), o.push(
          a === "rotate3d" ? ([c, d, u, p]) => [
            `rotate3d(${c},${d},${u},${_o(p, l)})`,
            gi(p, 0)
          ] : (c) => [
            `${a}(${c.map((d) => _o(d, l)).join(",")})`,
            gi(c, a.startsWith("scale") ? 1 : 0)
          ]
        );
      }
    }), i.length && (r.transform = new Uk(i, o)), super(r);
  }
}, Uk = class extends xp {
  constructor(e, t) {
    super(), this.inputs = e, this.transforms = t, this._value = null;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let e = "", t = !0;
    return fe(this.inputs, (n, r) => {
      const i = Te(n[0]), [o, s] = this.transforms[r](
        V.arr(i) ? i : n.map(Te)
      );
      e += " " + o, t = t && s;
    }), t ? "none" : e;
  }
  // Start observing our inputs once we have an observer.
  observerAdded(e) {
    e == 1 && fe(
      this.inputs,
      (t) => fe(
        t,
        (n) => Ze(n) && Tn(n, this)
      )
    );
  }
  // Stop observing our inputs once we have no observers.
  observerRemoved(e) {
    e == 0 && fe(
      this.inputs,
      (t) => fe(
        t,
        (n) => Ze(n) && yr(n, this)
      )
    );
  }
  eventObserved(e) {
    e.type == "change" && (this._value = null), br(this, e);
  }
}, Qk = [
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
rt.assign({
  batchedUpdates: ag,
  createStringInterpolator: vp,
  colors: OA
});
var Zk = dk(Qk, {
  applyAnimatedValues: zk,
  createAnimatedStyle: (e) => new Hk(e),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getComponentProps: ({ scrollTop: e, scrollLeft: t, ...n }) => n
}), xl = Zk.animated;
const Vk = "Save changes", Wk = "Cancel", Jk = "Review", qk = "OBJECT", Kk = "Changed", Xk = 440, _k = {
  tension: 320,
  friction: 34
}, $k = 250, eE = 200;
function UP({
  pendingCount: e,
  pendingItems: t,
  saving: n = !1,
  onSave: r,
  onCancel: i,
  saveLabel: o = Vk,
  cancelLabel: s = Wk,
  viewUnsavedLabel: a = Jk,
  pendingKeyLabel: l = qk,
  pendingValueLabel: c = Kk,
  dimmed: d = !1,
  disabled: u = !1,
  expandMaxHeight: p = Xk,
  expandSpringConfig: h = _k,
  barTransitionMs: m = $k,
  chevronTransitionMs: g = eE
}) {
  const { t: x } = ke(), [b, A] = ge(!1), w = e > 0, S = be(
    () => Array.isArray(t) && t.length > 0,
    [t]
  ), N = be(
    () => (t ?? []).some((E) => !!E.section),
    [t]
  ), C = be(() => {
    const E = /* @__PURE__ */ new Map();
    return (t ?? []).forEach((P) => {
      const T = P.section?.trim() || x("pendingChanges.generalSection"), Y = E.get(T) ?? [];
      Y.push(P), E.set(T, Y);
    }), Array.from(E.entries()).map(([P, T]) => ({
      section: P,
      items: T
    }));
  }, [t]), [O, D] = gl(() => ({
    maxHeight: 0,
    opacity: 0,
    config: h
  }));
  if (ue(() => {
    w || A(!1);
  }, [w]), ue(() => {
    const E = b && S;
    D.start({
      maxHeight: E ? p : 0,
      opacity: E ? 1 : 0,
      config: h
    });
  }, [b, S, D, p, h]), typeof document > "u")
    return null;
  const z = e === 1 ? x("pendingChanges.count.one") : x("pendingChanges.count.other", void 0, { count: e });
  return lg(
    /* @__PURE__ */ f.jsx(
      "div",
      {
        className: H(
          "fixed bottom-[calc(4rem+0.75rem)] left-3 right-3 z-[35] transform-gpu transition-all md:bottom-6 md:left-[calc(18rem+1.5rem)] md:right-6",
          w ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-6 opacity-0 pointer-events-none"
        ),
        style: { transitionDuration: `${m}ms` },
        children: /* @__PURE__ */ f.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ f.jsx(
            xl.div,
            {
              style: {
                maxHeight: O.maxHeight,
                opacity: O.opacity
              },
              className: "overflow-hidden",
              children: /* @__PURE__ */ f.jsx(
                "div",
                {
                  className: H(
                    "pointer-events-auto mx-auto w-[calc(100%-7rem)] overflow-auto rounded-t-[28px] border border-b-0 border-border/70 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.5)] backdrop-blur",
                    d ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/95"
                  ),
                  children: /* @__PURE__ */ f.jsxs("table", { className: "w-full text-sm", children: [
                    /* @__PURE__ */ f.jsx("thead", { className: "sticky top-0 bg-muted/70", children: /* @__PURE__ */ f.jsxs("tr", { className: "border-b border-border/70", children: [
                      /* @__PURE__ */ f.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: l }),
                      /* @__PURE__ */ f.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: c })
                    ] }) }),
                    /* @__PURE__ */ f.jsx("tbody", { children: C.map((E, P) => /* @__PURE__ */ f.jsxs(ig, { children: [
                      N ? /* @__PURE__ */ f.jsx("tr", { className: "border-b border-border/70 bg-muted/45", children: /* @__PURE__ */ f.jsx(
                        "td",
                        {
                          colSpan: 2,
                          className: "px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                          children: E.section
                        }
                      ) }) : null,
                      E.items.map((T, Y) => /* @__PURE__ */ f.jsxs(
                        "tr",
                        {
                          className: "border-b border-border/60 last:border-b-0",
                          children: [
                            /* @__PURE__ */ f.jsx("td", { className: "px-4 py-2.5 align-top font-medium text-foreground", children: T.key }),
                            /* @__PURE__ */ f.jsx("td", { className: "px-4 py-2.5 align-top text-muted-foreground", children: T.value })
                          ]
                        },
                        `${E.section}-${T.key}-${T.value}-${Y}`
                      ))
                    ] }, `${E.section}-${P}`)) })
                  ] })
                }
              )
            }
          ),
          /* @__PURE__ */ f.jsxs(
            "div",
            {
              className: H(
                "pointer-events-auto relative flex min-h-[3.75rem] items-center justify-between gap-3 rounded-[999px] border border-border/70 px-4 py-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.4)] backdrop-blur-md",
                d ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/96"
              ),
              children: [
                /* @__PURE__ */ f.jsxs("div", { className: "flex min-w-0 shrink items-center gap-2.5 text-sm", children: [
                  /* @__PURE__ */ f.jsxs("span", { className: "relative flex size-2.5 shrink-0", children: [
                    /* @__PURE__ */ f.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" }),
                    /* @__PURE__ */ f.jsx("span", { className: "relative inline-flex size-2.5 rounded-full bg-amber-400" })
                  ] }),
                  /* @__PURE__ */ f.jsx("span", { className: "truncate font-medium text-foreground", children: z })
                ] }),
                /* @__PURE__ */ f.jsxs("div", { className: "flex shrink-0 flex-wrap items-center justify-end gap-1.5", children: [
                  S ? /* @__PURE__ */ f.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      disabled: n || u,
                      onClick: () => A((E) => !E),
                      children: [
                        /* @__PURE__ */ f.jsx(u0, { className: "size-4" }),
                        a,
                        /* @__PURE__ */ f.jsx(
                          Ns,
                          {
                            className: H(
                              "size-4 transition-transform",
                              b ? "rotate-0" : "rotate-180"
                            ),
                            style: { transitionDuration: `${g}ms` }
                          }
                        )
                      ]
                    }
                  ) : null,
                  i ? /* @__PURE__ */ f.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: i,
                      disabled: n || u,
                      children: [
                        /* @__PURE__ */ f.jsx(Tr, { className: "size-4" }),
                        s
                      ]
                    }
                  ) : null,
                  /* @__PURE__ */ f.jsxs(
                    me,
                    {
                      type: "button",
                      size: "sm",
                      onClick: r,
                      disabled: n || u,
                      children: [
                        n ? /* @__PURE__ */ f.jsx(Za, { className: "size-4 animate-spin" }) : /* @__PURE__ */ f.jsx(P0, { className: "size-4" }),
                        n ? x("pendingChanges.saving") : o
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
function QP({
  columns: e,
  rows: t,
  rowKey: n,
  loading: r = !1,
  loadingMessage: i,
  emptyMessage: o,
  page: s,
  pageSize: a,
  pageSizeOptions: l = [10, 25, 50],
  onPageChange: c,
  onPageSizeChange: d,
  onRowClick: u,
  paginationMode: p = "client",
  totalRowCount: h,
  sortBy: m = null,
  sortOrder: g = "asc",
  onSortChange: x,
  alignPaginationToLeft: b = !1,
  onLoadingChange: A,
  hoveredRow: w = null,
  onHoveredRowChange: S
}) {
  const { t: N } = ke(), C = i ?? N("simpleDataTable.loading"), O = o ?? N("simpleDataTable.empty"), D = og(), z = pe(null), E = pe(null), [P, T] = ge(null), Y = p === "server", R = Y ? h ?? t.length : t.length, j = Math.max(1, Math.ceil(R / a)), I = Math.min(s, j - 1), F = I * a, B = Y ? t : t.slice(F, F + a), L = R === 0 || B.length === 0 ? 0 : Math.min(F + B.length, R), y = I > 0, M = L < R, U = L === 0 ? N("simpleDataTable.noResults") : Y && M ? N("simpleDataTable.showingRangePartial", void 0, { start: F + 1, end: L }) : N("simpleDataTable.showingRange", void 0, { start: F + 1, end: L, total: R }), k = Y && M ? N("simpleDataTable.pagePartial", void 0, { page: I + 1 }) : N("simpleDataTable.page", void 0, { page: I + 1, totalPages: j }), X = Math.max(3, Math.min(a || 5, 8));
  ue(() => {
    if (A)
      return A(D, r, C), () => {
        A(D, !1);
      };
  }, [r, C, D, A]);
  const K = (q) => {
    if (!x)
      return;
    x(q, m === q && g === "asc" ? "desc" : "asc");
  }, W = w ? n(w) : null, Z = (q) => /* @__PURE__ */ f.jsx(
    kt,
    {
      className: H(
        "odd:bg-transparent even:bg-muted/20",
        u && "cursor-pointer",
        W === n(q) && "bg-muted/35"
      ),
      onClick: u ? () => u(q) : void 0,
      onMouseEnter: S ? () => S(q) : void 0,
      onFocus: S ? () => S(q) : void 0,
      children: e.map((ee) => /* @__PURE__ */ f.jsx(ft, { className: ee.cellClassName, children: ee.render(q) }, ee.id))
    },
    n(q)
  );
  return ue(() => {
    const q = () => {
      if (!z.current)
        return;
      const Me = z.current.closest("[data-detail-tab-content], [data-table-viewport]");
      if (!Me) {
        T(null);
        return;
      }
      const Se = Me;
      if (!Se)
        return;
      const It = z.current.getBoundingClientRect(), Hr = Se.getBoundingClientRect(), Ur = Math.max(0, It.top - Hr.top), Ln = Se.clientHeight, Qr = E.current?.offsetHeight ?? 80, Zr = 16;
      if (Ln <= 0) {
        T(null);
        return;
      }
      const pn = Ln - Ur - Zr;
      if (pn < 180) {
        const No = Math.max(40, pn - Qr - 8);
        T(Math.max(0, No));
        return;
      }
      const So = Math.max(100, Math.floor(pn - Qr - 8));
      T(So);
    };
    q();
    const ee = window.requestAnimationFrame(q);
    window.addEventListener("resize", q);
    const le = new ResizeObserver(q);
    z.current?.parentElement && le.observe(z.current.parentElement);
    const Ee = z.current?.closest("[data-detail-tab-content], [data-table-viewport]");
    return Ee && le.observe(Ee), le.observe(document.documentElement), () => {
      window.cancelAnimationFrame(ee), window.removeEventListener("resize", q), le.disconnect();
    };
  }, []), /* @__PURE__ */ f.jsxs(
    "div",
    {
      ref: z,
      className: "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
      children: [
        /* @__PURE__ */ f.jsx(
          "div",
          {
            className: "min-h-0 overflow-auto",
            style: P ? { maxHeight: `${P}px` } : void 0,
            children: /* @__PURE__ */ f.jsxs(uo, { containerClassName: "overflow-x-visible", children: [
              /* @__PURE__ */ f.jsx(sp, { children: /* @__PURE__ */ f.jsx(kt, { className: "hover:bg-transparent", children: e.map((q) => /* @__PURE__ */ f.jsx(
                ap,
                {
                  className: H("sticky top-0 z-[1] bg-card text-center", q.className),
                  children: q.sortable && x ? /* @__PURE__ */ f.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => K(q.id),
                      className: "inline-flex w-full cursor-pointer items-center justify-center gap-1 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                      children: [
                        /* @__PURE__ */ f.jsx("span", { children: q.header }),
                        m === q.id ? g === "asc" ? /* @__PURE__ */ f.jsx(Ns, { className: "size-3.5" }) : /* @__PURE__ */ f.jsx(Qa, { className: "size-3.5" }) : /* @__PURE__ */ f.jsx(Ns, { className: "size-3.5 opacity-30" })
                      ]
                    }
                  ) : q.header
                },
                q.id
              )) }) }),
              /* @__PURE__ */ f.jsx(fo, { children: r ? Array.from({ length: X }).map((q, ee) => /* @__PURE__ */ f.jsx(kt, { className: "hover:bg-transparent", children: e.map((le) => /* @__PURE__ */ f.jsx(ft, { className: le.cellClassName, children: /* @__PURE__ */ f.jsx("div", { className: "h-4 w-full animate-pulse rounded bg-muted/60" }) }, `${le.id}-skeleton-${ee}`)) }, `loading-skeleton-${ee}`)) : B.length === 0 ? /* @__PURE__ */ f.jsx(kt, { className: "hover:bg-transparent", children: /* @__PURE__ */ f.jsx(
                ft,
                {
                  colSpan: e.length,
                  className: "py-10 text-center text-sm text-muted-foreground",
                  children: O
                }
              ) }) : B.map((q) => Z(q)) })
            ] })
          }
        ),
        r && /* @__PURE__ */ f.jsx("div", { className: "sr-only", "aria-live": "polite", children: C }),
        /* @__PURE__ */ f.jsxs(
          "div",
          {
            ref: E,
            className: H(
              "flex-shrink-0 flex flex-col gap-3 border-t border-border/70 bg-card px-4 py-3 sm:flex-row sm:items-center",
              b ? "sm:justify-start" : "sm:justify-between"
            ),
            children: [
              /* @__PURE__ */ f.jsx("div", { className: "text-sm text-muted-foreground", children: U }),
              /* @__PURE__ */ f.jsxs("div", { className: H("flex flex-col gap-3 sm:flex-row sm:items-center", b ? "sm:ml-4" : ""), children: [
                /* @__PURE__ */ f.jsxs("label", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ f.jsx("span", { children: N("simpleDataTable.rows") }),
                  /* @__PURE__ */ f.jsx(
                    el,
                    {
                      value: a,
                      onValueChange: (q) => d(Number(q)),
                      options: l.map((q) => ({ value: String(q), label: String(q) })),
                      className: "h-9",
                      searchPlaceholder: N("simpleDataTable.searchRows")
                    }
                  )
                ] }),
                /* @__PURE__ */ f.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ f.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => c(I - 1),
                      disabled: !y,
                      children: [
                        /* @__PURE__ */ f.jsx(Fh, { className: "size-4" }),
                        N("simpleDataTable.previous")
                      ]
                    }
                  ),
                  /* @__PURE__ */ f.jsx("span", { className: "min-w-20 text-center text-sm text-muted-foreground", children: k }),
                  /* @__PURE__ */ f.jsxs(
                    me,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => c(I + 1),
                      disabled: !M,
                      children: [
                        N("simpleDataTable.next"),
                        /* @__PURE__ */ f.jsx(Lt, { className: "size-4" })
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
function ZP({
  label: e,
  value: t,
  className: n
}) {
  return /* @__PURE__ */ f.jsxs("div", { className: H("min-w-0 space-y-0.5", n), children: [
    /* @__PURE__ */ f.jsx("dt", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", children: e }),
    /* @__PURE__ */ f.jsx("dd", { className: "text-sm text-foreground", children: t ?? "-" })
  ] });
}
function $o() {
  return /* @__PURE__ */ f.jsxs("div", { className: "animate-pulse rounded-2xl border border-border/70 bg-card p-4", children: [
    /* @__PURE__ */ f.jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ f.jsx("div", { className: "h-5 w-1/2 rounded-md bg-muted" }),
      /* @__PURE__ */ f.jsx("div", { className: "h-5 w-16 rounded-full bg-muted" })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-3", children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ f.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ f.jsx("div", { className: "h-2 w-12 rounded bg-muted" }),
      /* @__PURE__ */ f.jsx("div", { className: "h-4 w-full rounded bg-muted" })
    ] }, t)) })
  ] });
}
function VP({
  rows: e,
  rowKey: t,
  renderCard: n,
  loading: r = !1,
  emptyMessage: i,
  page: o = 0,
  pageSize: s = 25,
  onPageChange: a,
  paginationMode: l = "client",
  totalRowCount: c,
  infiniteScroll: d = !1,
  hasMore: u = !1,
  onLoadMore: p,
  onInfiniteScrollReset: h,
  resetKey: m,
  className: g
}) {
  const { t: x } = ke(), b = i ?? x("mobileCardList.empty"), [A, w] = ge([]), S = pe(/* @__PURE__ */ new Map()), N = pe(t);
  N.current = t;
  const C = pe(m);
  ue(() => {
    if (!d || !p)
      return;
    if (m !== C.current) {
      C.current = m;
      const q = /* @__PURE__ */ new Map();
      for (const ee of e)
        q.set(N.current(ee), ee);
      S.current = q, w([...q.values()]);
      return;
    }
    let Z = !1;
    for (const q of e) {
      const ee = N.current(q);
      S.current.has(ee) || (S.current.set(ee, q), Z = !0);
    }
    Z && w([...S.current.values()]);
  }, [e, m, d, p]);
  const [O, D] = ge(s), [z, E] = ge(
    () => typeof window < "u" ? window.matchMedia("(max-width: 767px)").matches : !1
  ), P = pe(z);
  ue(() => {
    !d || p || D(s);
  }, [m, s, d, p]), ue(() => {
    if (typeof window > "u")
      return;
    const Z = window.matchMedia("(max-width: 767px)"), q = (ee) => {
      E(ee.matches);
    };
    return E(Z.matches), Z.addEventListener("change", q), () => Z.removeEventListener("change", q);
  }, []), ue(() => {
    if (!d || !p || !h)
      return;
    const Z = !P.current && z;
    P.current = z, !(!Z || o <= 0) && (S.current = /* @__PURE__ */ new Map(), w([]), h());
  }, [
    d,
    z,
    h,
    p,
    o
  ]);
  const T = pe(null), Y = pe(!1), R = pe(p), j = pe(!1), I = pe(o), F = pe(r), B = pe(null);
  R.current = p, I.current = o, F.current = r, d && (Y.current = p ? u : !r && O < e.length);
  const L = () => {
    R.current && (!j.current || !Y.current || F.current || B.current !== I.current && (B.current = I.current, R.current()));
  };
  ue(() => {
    if (!d)
      return;
    const Z = T.current;
    if (!Z)
      return;
    const q = new IntersectionObserver(
      ([ee]) => {
        if (j.current = ee.isIntersecting, !(!ee.isIntersecting || !Y.current)) {
          if (R.current) {
            L();
            return;
          }
          D((le) => le + s);
        }
      },
      { rootMargin: "300px" }
    );
    return q.observe(Z), () => q.disconnect();
  }, [d, s]), ue(() => {
    !d || !R.current || L();
  }, [u, d, r, o]), ue(() => {
    if (!d || !p)
      return;
    const Z = () => {
      const q = T.current;
      if (!q)
        return;
      const { top: ee } = q.getBoundingClientRect();
      ee - window.innerHeight <= 300 && (j.current = !0, L());
    };
    return window.addEventListener("scroll", Z, { passive: !0 }), window.addEventListener("resize", Z), Z(), () => {
      window.removeEventListener("scroll", Z), window.removeEventListener("resize", Z);
    };
  }, [d, p, o, u, r]);
  const y = p ? A : e.slice(0, O), M = l === "server" ? c ?? e.length : e.length, U = o > 0, k = (o + 1) * s < M, X = !d && (U || k), K = l === "client" ? e.slice(o * s, (o + 1) * s) : e, W = d ? y : K;
  return r && W.length === 0 ? /* @__PURE__ */ f.jsxs("div", { className: H("space-y-3 md:hidden", g), children: [
    /* @__PURE__ */ f.jsx($o, {}),
    /* @__PURE__ */ f.jsx($o, {}),
    /* @__PURE__ */ f.jsx($o, {})
  ] }) : !r && W.length === 0 ? /* @__PURE__ */ f.jsx("div", { className: H("md:hidden", g), children: /* @__PURE__ */ f.jsx("div", { className: "rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground", children: b }) }) : /* @__PURE__ */ f.jsxs("div", { className: H("space-y-3 md:hidden", g), children: [
    W.map((Z) => /* @__PURE__ */ f.jsx("div", { children: n(Z) }, t(Z))),
    d ? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("div", { ref: T, "aria-hidden": "true" }),
      r ? /* @__PURE__ */ f.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ f.jsx(Za, { className: "size-5 animate-spin text-muted-foreground" }) }) : null
    ] }) : null,
    X ? /* @__PURE__ */ f.jsxs("div", { className: "flex items-center justify-between border-t border-border/50 pt-3", children: [
      /* @__PURE__ */ f.jsxs(
        "button",
        {
          type: "button",
          disabled: !U,
          onClick: () => a?.(o - 1),
          className: "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
          children: [
            /* @__PURE__ */ f.jsx(Fh, { className: "size-4" }),
            "Previous"
          ]
        }
      ),
      /* @__PURE__ */ f.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        "Page ",
        o + 1
      ] }),
      /* @__PURE__ */ f.jsxs(
        "button",
        {
          type: "button",
          disabled: !k,
          onClick: () => a?.(o + 1),
          className: "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
          children: [
            "Next",
            /* @__PURE__ */ f.jsx(Lt, { className: "size-4" })
          ]
        }
      )
    ] }) : null
  ] });
}
function WP({
  activeTab: e,
  items: t,
  onTabSelect: n,
  onMenuOpen: r,
  menuButtonLabel: i,
  menuButtonAriaLabel: o,
  menuButtonIcon: s,
  className: a
}) {
  const { t: l } = ke(), c = i ?? l("mobileBottomBar.menu"), d = o ?? l("mobileBottomBar.openMenu"), u = t.length, p = t.findIndex((g) => g.id === e), h = gl({
    leftPct: p >= 0 && u > 0 ? p / u * 100 : 0,
    opacity: p >= 0 && u > 0 ? 1 : 0,
    config: { tension: 300, friction: 26 }
  }), m = "calc(100% - 4rem)";
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      className: H(
        "fixed inset-x-0 bottom-0 z-40 h-16 border-t border-border/70 bg-card/95 backdrop-blur md:hidden",
        a
      ),
      children: /* @__PURE__ */ f.jsxs("nav", { className: "relative flex h-full items-stretch", children: [
        /* @__PURE__ */ f.jsx(
          xl.div,
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute top-0 h-0.5 rounded-full bg-primary",
            style: {
              left: h.leftPct.to(
                (g) => `calc(${m} * ${g / 100})`
              ),
              width: h.leftPct.to(
                () => u > 0 ? `calc(${m} / ${u})` : "0px"
              ),
              opacity: h.opacity
            }
          }
        ),
        t.map((g) => {
          const x = e === g.id;
          return /* @__PURE__ */ f.jsxs(
            "button",
            {
              type: "button",
              className: H(
                "flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
                x ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              ),
              onClick: () => n?.(g.id),
              "aria-label": g.label,
              "aria-current": x ? "page" : void 0,
              children: [
                g.icon,
                /* @__PURE__ */ f.jsx("span", { className: "text-[10px] font-medium leading-none", children: g.label })
              ]
            },
            g.id
          );
        }),
        /* @__PURE__ */ f.jsx("div", { className: "w-16 shrink-0 border-l border-border/40", children: /* @__PURE__ */ f.jsxs(
          "button",
          {
            type: "button",
            className: "flex h-full w-full flex-col items-center justify-center gap-1 px-1 py-2 text-muted-foreground transition-colors hover:text-foreground",
            onClick: r,
            "aria-label": d,
            children: [
              s ?? /* @__PURE__ */ f.jsx(G0, { className: "size-5" }),
              /* @__PURE__ */ f.jsx("span", { className: "text-[10px] font-medium leading-none", children: c })
            ]
          }
        ) })
      ] })
    }
  );
}
function tE(e, t) {
  const n = {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const nE = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, rE = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, iE = {};
function mu(e, t) {
  return (iE.jsx ? rE : nE).test(e);
}
const oE = /[ \t\n\f\r]/g;
function sE(e) {
  return typeof e == "object" ? e.type === "text" ? gu(e.value) : !1 : gu(e);
}
function gu(e) {
  return e.replace(oE, "") === "";
}
class Fr {
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
Fr.prototype.normal = {};
Fr.prototype.property = {};
Fr.prototype.space = void 0;
function Hp(e, t) {
  const n = {}, r = {};
  for (const i of e)
    Object.assign(n, i.property), Object.assign(r, i.normal);
  return new Fr(n, r, t);
}
function Zs(e) {
  return e.toLowerCase();
}
class Be {
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
Be.prototype.attribute = "";
Be.prototype.booleanish = !1;
Be.prototype.boolean = !1;
Be.prototype.commaOrSpaceSeparated = !1;
Be.prototype.commaSeparated = !1;
Be.prototype.defined = !1;
Be.prototype.mustUseProperty = !1;
Be.prototype.number = !1;
Be.prototype.overloadedBoolean = !1;
Be.prototype.property = "";
Be.prototype.spaceSeparated = !1;
Be.prototype.space = void 0;
let aE = 0;
const re = hn(), Ce = hn(), Vs = hn(), Q = hn(), ve = hn(), nn = hn(), Fe = hn();
function hn() {
  return 2 ** ++aE;
}
const Ws = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: re,
  booleanish: Ce,
  commaOrSpaceSeparated: Fe,
  commaSeparated: nn,
  number: Q,
  overloadedBoolean: Vs,
  spaceSeparated: ve
}, Symbol.toStringTag, { value: "Module" })), es = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(Ws)
);
class bl extends Be {
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
    if (super(t, n), xu(this, "space", i), typeof r == "number")
      for (; ++o < es.length; ) {
        const s = es[o];
        xu(this, es[o], (r & Ws[s]) === Ws[s]);
      }
  }
}
bl.prototype.defined = !0;
function xu(e, t, n) {
  n && (e[t] = n);
}
function zn(e) {
  const t = {}, n = {};
  for (const [r, i] of Object.entries(e.properties)) {
    const o = new bl(
      r,
      e.transform(e.attributes || {}, r),
      i,
      e.space
    );
    e.mustUseProperty && e.mustUseProperty.includes(r) && (o.mustUseProperty = !0), t[r] = o, n[Zs(r)] = r, n[Zs(o.attribute)] = r;
  }
  return new Fr(t, n, e.space);
}
const Up = zn({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: Ce,
    ariaAutoComplete: null,
    ariaBusy: Ce,
    ariaChecked: Ce,
    ariaColCount: Q,
    ariaColIndex: Q,
    ariaColSpan: Q,
    ariaControls: ve,
    ariaCurrent: null,
    ariaDescribedBy: ve,
    ariaDetails: null,
    ariaDisabled: Ce,
    ariaDropEffect: ve,
    ariaErrorMessage: null,
    ariaExpanded: Ce,
    ariaFlowTo: ve,
    ariaGrabbed: Ce,
    ariaHasPopup: null,
    ariaHidden: Ce,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: ve,
    ariaLevel: Q,
    ariaLive: null,
    ariaModal: Ce,
    ariaMultiLine: Ce,
    ariaMultiSelectable: Ce,
    ariaOrientation: null,
    ariaOwns: ve,
    ariaPlaceholder: null,
    ariaPosInSet: Q,
    ariaPressed: Ce,
    ariaReadOnly: Ce,
    ariaRelevant: null,
    ariaRequired: Ce,
    ariaRoleDescription: ve,
    ariaRowCount: Q,
    ariaRowIndex: Q,
    ariaRowSpan: Q,
    ariaSelected: Ce,
    ariaSetSize: Q,
    ariaSort: null,
    ariaValueMax: Q,
    ariaValueMin: Q,
    ariaValueNow: Q,
    ariaValueText: null,
    role: null
  },
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
});
function Qp(e, t) {
  return t in e ? e[t] : t;
}
function Zp(e, t) {
  return Qp(e, t.toLowerCase());
}
const lE = zn({
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
    accept: nn,
    acceptCharset: ve,
    accessKey: ve,
    action: null,
    allow: null,
    allowFullScreen: re,
    allowPaymentRequest: re,
    allowUserMedia: re,
    alpha: re,
    alt: null,
    as: null,
    async: re,
    autoCapitalize: null,
    autoComplete: ve,
    autoFocus: re,
    autoPlay: re,
    blocking: ve,
    capture: null,
    charSet: null,
    checked: re,
    cite: null,
    className: ve,
    closedBy: null,
    colorSpace: null,
    cols: Q,
    colSpan: Q,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: Ce,
    controls: re,
    controlsList: ve,
    coords: Q | nn,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: re,
    defer: re,
    dir: null,
    dirName: null,
    disabled: re,
    download: Vs,
    draggable: Ce,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: re,
    formTarget: null,
    headers: ve,
    height: Q,
    hidden: Vs,
    high: Q,
    href: null,
    hrefLang: null,
    htmlFor: ve,
    httpEquiv: ve,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: re,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: re,
    itemId: null,
    itemProp: ve,
    itemRef: ve,
    itemScope: re,
    itemType: ve,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: re,
    low: Q,
    manifest: null,
    max: null,
    maxLength: Q,
    media: null,
    method: null,
    min: null,
    minLength: Q,
    multiple: re,
    muted: re,
    name: null,
    nonce: null,
    noModule: re,
    noValidate: re,
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
    open: re,
    optimum: Q,
    pattern: null,
    ping: ve,
    placeholder: null,
    playsInline: re,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: re,
    referrerPolicy: null,
    rel: ve,
    required: re,
    reversed: re,
    rows: Q,
    rowSpan: Q,
    sandbox: ve,
    scope: null,
    scoped: re,
    seamless: re,
    selected: re,
    shadowRootClonable: re,
    shadowRootCustomElementRegistry: re,
    shadowRootDelegatesFocus: re,
    shadowRootMode: null,
    shadowRootSerializable: re,
    shape: null,
    size: Q,
    sizes: null,
    slot: null,
    span: Q,
    spellCheck: Ce,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: Q,
    step: null,
    style: null,
    tabIndex: Q,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: re,
    useMap: null,
    value: Ce,
    width: Q,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: ve,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: Q,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: Q,
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
    compact: re,
    // Lists. Use CSS to reduce space between items instead
    declare: re,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: Q,
    // `<img>` and `<object>`
    leftMargin: Q,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: Q,
    // `<body>`
    marginWidth: Q,
    // `<body>`
    noResize: re,
    // `<frame>`
    noHref: re,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: re,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: re,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: Q,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: Ce,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: Q,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: Q,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: re,
    disablePictureInPicture: re,
    disableRemotePlayback: re,
    exportParts: nn,
    part: ve,
    prefix: null,
    property: null,
    results: Q,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: Zp
}), cE = zn({
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
    about: Fe,
    accentHeight: Q,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: Q,
    amplitude: Q,
    arabicForm: null,
    ascent: Q,
    attributeName: null,
    attributeType: null,
    azimuth: Q,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: Q,
    by: null,
    calcMode: null,
    capHeight: Q,
    className: ve,
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
    descent: Q,
    diffuseConstant: Q,
    direction: null,
    display: null,
    dur: null,
    divisor: Q,
    dominantBaseline: null,
    download: re,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: Q,
    enableBackground: null,
    end: null,
    event: null,
    exponent: Q,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: Q,
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
    g1: nn,
    g2: nn,
    glyphName: nn,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: Q,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: Q,
    horizOriginX: Q,
    horizOriginY: Q,
    id: null,
    ideographic: Q,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: Q,
    k: Q,
    k1: Q,
    k2: Q,
    k3: Q,
    k4: Q,
    kernelMatrix: Fe,
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
    limitingConeAngle: Q,
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
    mediaSize: Q,
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
    overlinePosition: Q,
    overlineThickness: Q,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: Q,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: ve,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: Q,
    pointsAtY: Q,
    pointsAtZ: Q,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: Fe,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: Fe,
    rev: Fe,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: Fe,
    requiredFeatures: Fe,
    requiredFonts: Fe,
    requiredFormats: Fe,
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
    specularConstant: Q,
    specularExponent: Q,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: Q,
    strikethroughThickness: Q,
    string: null,
    stroke: null,
    strokeDashArray: Fe,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: Q,
    strokeOpacity: Q,
    strokeWidth: null,
    style: null,
    surfaceScale: Q,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: Fe,
    tabIndex: Q,
    tableValues: null,
    target: null,
    targetX: Q,
    targetY: Q,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: Fe,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: Q,
    underlineThickness: Q,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: Q,
    values: null,
    vAlphabetic: Q,
    vMathematical: Q,
    vectorEffect: null,
    vHanging: Q,
    vIdeographic: Q,
    version: null,
    vertAdvY: Q,
    vertOriginX: Q,
    vertOriginY: Q,
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
    xHeight: Q,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Qp
}), Vp = zn({
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
}), Wp = zn({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: Zp
}), Jp = zn({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
}), uE = {
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
}, dE = /[A-Z]/g, bu = /-[a-z]/g, fE = /^data[-\w.:]+$/i;
function hE(e, t) {
  const n = Zs(t);
  let r = t, i = Be;
  if (n in e.normal)
    return e.property[e.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && fE.test(t)) {
    if (t.charAt(4) === "-") {
      const o = t.slice(5).replace(bu, mE);
      r = "data" + o.charAt(0).toUpperCase() + o.slice(1);
    } else {
      const o = t.slice(4);
      if (!bu.test(o)) {
        let s = o.replace(dE, pE);
        s.charAt(0) !== "-" && (s = "-" + s), t = "data" + s;
      }
    }
    i = bl;
  }
  return new i(r, t);
}
function pE(e) {
  return "-" + e.toLowerCase();
}
function mE(e) {
  return e.charAt(1).toUpperCase();
}
const gE = Hp([Up, lE, Vp, Wp, Jp], "html"), yl = Hp([Up, cE, Vp, Wp, Jp], "svg");
function xE(e) {
  return e.join(" ").trim();
}
var vn = {}, ts, yu;
function bE() {
  if (yu) return ts;
  yu = 1;
  var e = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, t = /\n/g, n = /^\s*/, r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, i = /^:\s*/, o = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, s = /^[;\s]*/, a = /^\s+|\s+$/g, l = `
`, c = "/", d = "*", u = "", p = "comment", h = "declaration";
  function m(x, b) {
    if (typeof x != "string")
      throw new TypeError("First argument must be a string");
    if (!x) return [];
    b = b || {};
    var A = 1, w = 1;
    function S(R) {
      var j = R.match(t);
      j && (A += j.length);
      var I = R.lastIndexOf(l);
      w = ~I ? R.length - I : w + R.length;
    }
    function N() {
      var R = { line: A, column: w };
      return function(j) {
        return j.position = new C(R), z(), j;
      };
    }
    function C(R) {
      this.start = R, this.end = { line: A, column: w }, this.source = b.source;
    }
    C.prototype.content = x;
    function O(R) {
      var j = new Error(
        b.source + ":" + A + ":" + w + ": " + R
      );
      if (j.reason = R, j.filename = b.source, j.line = A, j.column = w, j.source = x, !b.silent) throw j;
    }
    function D(R) {
      var j = R.exec(x);
      if (j) {
        var I = j[0];
        return S(I), x = x.slice(I.length), j;
      }
    }
    function z() {
      D(n);
    }
    function E(R) {
      var j;
      for (R = R || []; j = P(); )
        j !== !1 && R.push(j);
      return R;
    }
    function P() {
      var R = N();
      if (!(c != x.charAt(0) || d != x.charAt(1))) {
        for (var j = 2; u != x.charAt(j) && (d != x.charAt(j) || c != x.charAt(j + 1)); )
          ++j;
        if (j += 2, u === x.charAt(j - 1))
          return O("End of comment missing");
        var I = x.slice(2, j - 2);
        return w += 2, S(I), x = x.slice(j), w += 2, R({
          type: p,
          comment: I
        });
      }
    }
    function T() {
      var R = N(), j = D(r);
      if (j) {
        if (P(), !D(i)) return O("property missing ':'");
        var I = D(o), F = R({
          type: h,
          property: g(j[0].replace(e, u)),
          value: I ? g(I[0].replace(e, u)) : u
        });
        return D(s), F;
      }
    }
    function Y() {
      var R = [];
      E(R);
      for (var j; j = T(); )
        j !== !1 && (R.push(j), E(R));
      return R;
    }
    return z(), Y();
  }
  function g(x) {
    return x ? x.replace(a, u) : u;
  }
  return ts = m, ts;
}
var vu;
function yE() {
  if (vu) return vn;
  vu = 1;
  var e = vn && vn.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty(vn, "__esModule", { value: !0 }), vn.default = n;
  const t = e(bE());
  function n(r, i) {
    let o = null;
    if (!r || typeof r != "string")
      return o;
    const s = (0, t.default)(r), a = typeof i == "function";
    return s.forEach((l) => {
      if (l.type !== "declaration")
        return;
      const { property: c, value: d } = l;
      a ? i(c, d, l) : d && (o = o || {}, o[c] = d);
    }), o;
  }
  return vn;
}
var Jn = {}, wu;
function vE() {
  if (wu) return Jn;
  wu = 1, Object.defineProperty(Jn, "__esModule", { value: !0 }), Jn.camelCase = void 0;
  var e = /^--[a-zA-Z0-9_-]+$/, t = /-([a-z])/g, n = /^[^-]+$/, r = /^-(webkit|moz|ms|o|khtml)-/, i = /^-(ms)-/, o = function(c) {
    return !c || n.test(c) || e.test(c);
  }, s = function(c, d) {
    return d.toUpperCase();
  }, a = function(c, d) {
    return "".concat(d, "-");
  }, l = function(c, d) {
    return d === void 0 && (d = {}), o(c) ? c : (c = c.toLowerCase(), d.reactCompat ? c = c.replace(i, a) : c = c.replace(r, a), c.replace(t, s));
  };
  return Jn.camelCase = l, Jn;
}
var qn, Au;
function wE() {
  if (Au) return qn;
  Au = 1;
  var e = qn && qn.__importDefault || function(i) {
    return i && i.__esModule ? i : { default: i };
  }, t = e(yE()), n = vE();
  function r(i, o) {
    var s = {};
    return !i || typeof i != "string" || (0, t.default)(i, function(a, l) {
      a && l && (s[(0, n.camelCase)(a, o)] = l);
    }), s;
  }
  return r.default = r, qn = r, qn;
}
var AE = wE();
const kE = /* @__PURE__ */ aa(AE), qp = Kp("end"), vl = Kp("start");
function Kp(e) {
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
function EE(e) {
  const t = vl(e), n = qp(e);
  if (t && n)
    return { start: t, end: n };
}
function sr(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? ku(e.position) : "start" in e || "end" in e ? ku(e) : "line" in e || "column" in e ? Js(e) : "";
}
function Js(e) {
  return Eu(e && e.line) + ":" + Eu(e && e.column);
}
function ku(e) {
  return Js(e && e.start) + "-" + Js(e && e.end);
}
function Eu(e) {
  return e && typeof e == "number" ? e : 1;
}
class Re extends Error {
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
    this.ancestors = o.ancestors || void 0, this.cause = o.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = a ? a.line : void 0, this.name = sr(o.place) || "1:1", this.place = o.place || void 0, this.reason = this.message, this.ruleId = o.ruleId || void 0, this.source = o.source || void 0, this.stack = s && o.cause && typeof o.cause.stack == "string" ? o.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
Re.prototype.file = "";
Re.prototype.name = "";
Re.prototype.reason = "";
Re.prototype.message = "";
Re.prototype.stack = "";
Re.prototype.column = void 0;
Re.prototype.line = void 0;
Re.prototype.ancestors = void 0;
Re.prototype.cause = void 0;
Re.prototype.fatal = void 0;
Re.prototype.place = void 0;
Re.prototype.ruleId = void 0;
Re.prototype.source = void 0;
const wl = {}.hasOwnProperty, CE = /* @__PURE__ */ new Map(), SE = /[A-Z]/g, NE = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), jE = /* @__PURE__ */ new Set(["td", "th"]), Xp = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function ME(e, t) {
  if (!t || t.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const n = t.filePath || void 0;
  let r;
  if (t.development) {
    if (typeof t.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = BE(n, t.jsxDEV);
  } else {
    if (typeof t.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof t.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = zE(n, t.jsx, t.jsxs);
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
    schema: t.space === "svg" ? yl : gE,
    stylePropertyNameCase: t.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
  }, o = _p(i, e, void 0);
  return o && typeof o != "string" ? o : i.create(
    e,
    i.Fragment,
    { children: o || void 0 },
    void 0
  );
}
function _p(e, t, n) {
  if (t.type === "element")
    return IE(e, t, n);
  if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression")
    return PE(e, t);
  if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement")
    return DE(e, t, n);
  if (t.type === "mdxjsEsm")
    return RE(e, t);
  if (t.type === "root")
    return OE(e, t, n);
  if (t.type === "text")
    return TE(e, t);
}
function IE(e, t, n) {
  const r = e.schema;
  let i = r;
  t.tagName.toLowerCase() === "svg" && r.space === "html" && (i = yl, e.schema = i), e.ancestors.push(t);
  const o = em(e, t.tagName, !1), s = LE(e, t);
  let a = kl(e, t);
  return NE.has(t.tagName) && (a = a.filter(function(l) {
    return typeof l == "string" ? !sE(l) : !0;
  })), $p(e, s, o, t), Al(s, a), e.ancestors.pop(), e.schema = r, e.create(t, o, s, n);
}
function PE(e, t) {
  if (t.data && t.data.estree && e.evaluater) {
    const r = t.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    e.evaluater.evaluateExpression(r.expression);
  }
  Er(e, t.position);
}
function RE(e, t) {
  if (t.data && t.data.estree && e.evaluater)
    return (
      /** @type {Child | undefined} */
      e.evaluater.evaluateProgram(t.data.estree)
    );
  Er(e, t.position);
}
function DE(e, t, n) {
  const r = e.schema;
  let i = r;
  t.name === "svg" && r.space === "html" && (i = yl, e.schema = i), e.ancestors.push(t);
  const o = t.name === null ? e.Fragment : em(e, t.name, !0), s = FE(e, t), a = kl(e, t);
  return $p(e, s, o, t), Al(s, a), e.ancestors.pop(), e.schema = r, e.create(t, o, s, n);
}
function OE(e, t, n) {
  const r = {};
  return Al(r, kl(e, t)), e.create(t, e.Fragment, r, n);
}
function TE(e, t) {
  return t.value;
}
function $p(e, t, n, r) {
  typeof n != "string" && n !== e.Fragment && e.passNode && (t.node = r);
}
function Al(e, t) {
  if (t.length > 0) {
    const n = t.length > 1 ? t : t[0];
    n && (e.children = n);
  }
}
function zE(e, t, n) {
  return r;
  function r(i, o, s, a) {
    const c = Array.isArray(s.children) ? n : t;
    return a ? c(o, s, a) : c(o, s);
  }
}
function BE(e, t) {
  return n;
  function n(r, i, o, s) {
    const a = Array.isArray(o.children), l = vl(r);
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
function LE(e, t) {
  const n = {};
  let r, i;
  for (i in t.properties)
    if (i !== "children" && wl.call(t.properties, i)) {
      const o = GE(e, i, t.properties[i]);
      if (o) {
        const [s, a] = o;
        e.tableCellAlignToStyle && s === "align" && typeof a == "string" && jE.has(t.tagName) ? r = a : n[s] = a;
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
function FE(e, t) {
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
        Er(e, t.position);
    else {
      const i = r.name;
      let o;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && e.evaluater) {
          const a = r.value.data.estree.body[0];
          a.type, o = e.evaluater.evaluateExpression(a.expression);
        } else
          Er(e, t.position);
      else
        o = r.value === null ? !0 : r.value;
      n[i] = /** @type {Props[keyof Props]} */
      o;
    }
  return n;
}
function kl(e, t) {
  const n = [];
  let r = -1;
  const i = e.passKeys ? /* @__PURE__ */ new Map() : CE;
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
    const a = _p(e, o, s);
    a !== void 0 && n.push(a);
  }
  return n;
}
function GE(e, t, n) {
  const r = hE(e.schema, t);
  if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
    if (Array.isArray(n) && (n = r.commaSeparated ? tE(n) : xE(n)), r.property === "style") {
      let i = typeof n == "object" ? n : YE(e, String(n));
      return e.stylePropertyNameCase === "css" && (i = HE(i)), ["style", i];
    }
    return [
      e.elementAttributeNameCase === "react" && r.space ? uE[r.property] || r.property : r.attribute,
      n
    ];
  }
}
function YE(e, t) {
  try {
    return kE(t, { reactCompat: !0 });
  } catch (n) {
    if (e.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      n
    ), i = new Re("Cannot parse `style` attribute", {
      ancestors: e.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = e.filePath || void 0, i.url = Xp + "#cannot-parse-style-attribute", i;
  }
}
function em(e, t, n) {
  let r;
  if (!n)
    r = { type: "Literal", value: t };
  else if (t.includes(".")) {
    const i = t.split(".");
    let o = -1, s;
    for (; ++o < i.length; ) {
      const a = mu(i[o]) ? { type: "Identifier", name: i[o] } : { type: "Literal", value: i[o] };
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
    r = mu(t) && !/^[a-z]/.test(t) ? { type: "Identifier", name: t } : { type: "Literal", value: t };
  if (r.type === "Literal") {
    const i = (
      /** @type {string | number} */
      r.value
    );
    return wl.call(e.components, i) ? e.components[i] : i;
  }
  if (e.evaluater)
    return e.evaluater.evaluateExpression(r);
  Er(e);
}
function Er(e, t) {
  const n = new Re(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: e.ancestors,
      place: t,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw n.file = e.filePath || void 0, n.url = Xp + "#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function HE(e) {
  const t = {};
  let n;
  for (n in e)
    wl.call(e, n) && (t[UE(n)] = e[n]);
  return t;
}
function UE(e) {
  let t = e.replace(SE, QE);
  return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function QE(e) {
  return "-" + e.toLowerCase();
}
const ns = {
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
}, ZE = {};
function El(e, t) {
  const n = ZE, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return tm(e, r, i);
}
function tm(e, t, n) {
  if (VE(e)) {
    if ("value" in e)
      return e.type === "html" && !n ? "" : e.value;
    if (t && "alt" in e && e.alt)
      return e.alt;
    if ("children" in e)
      return Cu(e.children, t, n);
  }
  return Array.isArray(e) ? Cu(e, t, n) : "";
}
function Cu(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; )
    r[i] = tm(e[i], t, n);
  return r.join("");
}
function VE(e) {
  return !!(e && typeof e == "object");
}
const Su = document.createElement("i");
function Cl(e) {
  const t = "&" + e + ";";
  Su.innerHTML = t;
  const n = Su.textContent;
  return n.charCodeAt(n.length - 1) === 59 && e !== "semi" || n === t ? !1 : n;
}
function Qe(e, t, n, r) {
  const i = e.length;
  let o = 0, s;
  if (t < 0 ? t = -t > i ? 0 : i + t : t = t > i ? i : t, n = n > 0 ? n : 0, r.length < 1e4)
    s = Array.from(r), s.unshift(t, n), e.splice(...s);
  else
    for (n && e.splice(t, n); o < r.length; )
      s = r.slice(o, o + 1e4), s.unshift(t, 0), e.splice(...s), o += 1e4, t += 1e4;
}
function Ve(e, t) {
  return e.length > 0 ? (Qe(e, e.length, 0, t), e) : t;
}
const Nu = {}.hasOwnProperty;
function nm(e) {
  const t = {};
  let n = -1;
  for (; ++n < e.length; )
    WE(t, e[n]);
  return t;
}
function WE(e, t) {
  let n;
  for (n in t) {
    const i = (Nu.call(e, n) ? e[n] : void 0) || (e[n] = {}), o = t[n];
    let s;
    if (o)
      for (s in o) {
        Nu.call(i, s) || (i[s] = []);
        const a = o[s];
        JE(
          // @ts-expect-error Looks like a list.
          i[s],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function JE(e, t) {
  let n = -1;
  const r = [];
  for (; ++n < t.length; )
    (t[n].add === "after" ? e : r).push(t[n]);
  Qe(e, 0, 0, r);
}
function rm(e, t) {
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
function et(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const De = Jt(/[A-Za-z]/), Ie = Jt(/[\dA-Za-z]/), qE = Jt(/[#-'*+\--9=?A-Z^-~]/);
function Li(e) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    e !== null && (e < 32 || e === 127)
  );
}
const qs = Jt(/\d/), KE = Jt(/[\dA-Fa-f]/), XE = Jt(/[!-/:-@[-`{-~]/);
function te(e) {
  return e !== null && e < -2;
}
function we(e) {
  return e !== null && (e < 0 || e === 32);
}
function ce(e) {
  return e === -2 || e === -1 || e === 32;
}
const wo = Jt(new RegExp("\\p{P}|\\p{S}", "u")), cn = Jt(/\s/);
function Jt(e) {
  return t;
  function t(n) {
    return n !== null && n > -1 && e.test(String.fromCharCode(n));
  }
}
function Bn(e) {
  const t = [];
  let n = -1, r = 0, i = 0;
  for (; ++n < e.length; ) {
    const o = e.charCodeAt(n);
    let s = "";
    if (o === 37 && Ie(e.charCodeAt(n + 1)) && Ie(e.charCodeAt(n + 2)))
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
function he(e, t, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let o = 0;
  return s;
  function s(l) {
    return ce(l) ? (e.enter(n), a(l)) : t(l);
  }
  function a(l) {
    return ce(l) && o++ < i ? (e.consume(l), a) : (e.exit(n), t(l));
  }
}
const _E = {
  tokenize: $E
};
function $E(e) {
  const t = e.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return t;
  function r(a) {
    if (a === null) {
      e.consume(a);
      return;
    }
    return e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), he(e, t, "linePrefix");
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
    return te(a) ? (e.consume(a), e.exit("chunkText"), o) : (e.consume(a), s);
  }
}
const eC = {
  tokenize: tC
}, ju = {
  tokenize: nC
};
function tC(e) {
  const t = this, n = [];
  let r = 0, i, o, s;
  return a;
  function a(w) {
    if (r < n.length) {
      const S = n[r];
      return t.containerState = S[1], e.attempt(S[0].continuation, l, c)(w);
    }
    return c(w);
  }
  function l(w) {
    if (r++, t.containerState._closeFlow) {
      t.containerState._closeFlow = void 0, i && A();
      const S = t.events.length;
      let N = S, C;
      for (; N--; )
        if (t.events[N][0] === "exit" && t.events[N][1].type === "chunkFlow") {
          C = t.events[N][1].end;
          break;
        }
      b(r);
      let O = S;
      for (; O < t.events.length; )
        t.events[O][1].end = {
          ...C
        }, O++;
      return Qe(t.events, N + 1, 0, t.events.slice(S)), t.events.length = O, c(w);
    }
    return a(w);
  }
  function c(w) {
    if (r === n.length) {
      if (!i)
        return p(w);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return m(w);
      t.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return t.containerState = {}, e.check(ju, d, u)(w);
  }
  function d(w) {
    return i && A(), b(r), p(w);
  }
  function u(w) {
    return t.parser.lazy[t.now().line] = r !== n.length, s = t.now().offset, m(w);
  }
  function p(w) {
    return t.containerState = {}, e.attempt(ju, h, m)(w);
  }
  function h(w) {
    return r++, n.push([t.currentConstruct, t.containerState]), p(w);
  }
  function m(w) {
    if (w === null) {
      i && A(), b(0), e.consume(w);
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
      x(e.exit("chunkFlow"), !0), b(0), e.consume(w);
      return;
    }
    return te(w) ? (e.consume(w), x(e.exit("chunkFlow")), r = 0, t.interrupt = void 0, a) : (e.consume(w), g);
  }
  function x(w, S) {
    const N = t.sliceStream(w);
    if (S && N.push(null), w.previous = o, o && (o.next = w), o = w, i.defineSkip(w.start), i.write(N), t.parser.lazy[w.start.line]) {
      let C = i.events.length;
      for (; C--; )
        if (
          // The token starts before the line ending…
          i.events[C][1].start.offset < s && // …and either is not ended yet…
          (!i.events[C][1].end || // …or ends after it.
          i.events[C][1].end.offset > s)
        )
          return;
      const O = t.events.length;
      let D = O, z, E;
      for (; D--; )
        if (t.events[D][0] === "exit" && t.events[D][1].type === "chunkFlow") {
          if (z) {
            E = t.events[D][1].end;
            break;
          }
          z = !0;
        }
      for (b(r), C = O; C < t.events.length; )
        t.events[C][1].end = {
          ...E
        }, C++;
      Qe(t.events, D + 1, 0, t.events.slice(O)), t.events.length = C;
    }
  }
  function b(w) {
    let S = n.length;
    for (; S-- > w; ) {
      const N = n[S];
      t.containerState = N[1], N[0].exit.call(t, e);
    }
    n.length = w;
  }
  function A() {
    i.write([null]), o = void 0, i = void 0, t.containerState._closeFlow = void 0;
  }
}
function nC(e, t, n) {
  return he(e, e.attempt(this.parser.constructs.document, t, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function Rn(e) {
  if (e === null || we(e) || cn(e))
    return 1;
  if (wo(e))
    return 2;
}
function Ao(e, t, n) {
  const r = [];
  let i = -1;
  for (; ++i < e.length; ) {
    const o = e[i].resolveAll;
    o && !r.includes(o) && (t = o(t, n), r.push(o));
  }
  return t;
}
const Ks = {
  name: "attention",
  resolveAll: rC,
  tokenize: iC
};
function rC(e, t) {
  let n = -1, r, i, o, s, a, l, c, d;
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
          }, p = {
            ...e[n][1].start
          };
          Mu(u, -l), Mu(p, l), s = {
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
            end: p
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
          }, c = [], e[r][1].end.offset - e[r][1].start.offset && (c = Ve(c, [["enter", e[r][1], t], ["exit", e[r][1], t]])), c = Ve(c, [["enter", i, t], ["enter", s, t], ["exit", s, t], ["enter", o, t]]), c = Ve(c, Ao(t.parser.constructs.insideSpan.null, e.slice(r + 1, n), t)), c = Ve(c, [["exit", o, t], ["enter", a, t], ["exit", a, t], ["exit", i, t]]), e[n][1].end.offset - e[n][1].start.offset ? (d = 2, c = Ve(c, [["enter", e[n][1], t], ["exit", e[n][1], t]])) : d = 0, Qe(e, r - 1, n - r + 3, c), n = r + c.length - d - 2;
          break;
        }
    }
  for (n = -1; ++n < e.length; )
    e[n][1].type === "attentionSequence" && (e[n][1].type = "data");
  return e;
}
function iC(e, t) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = Rn(r);
  let o;
  return s;
  function s(l) {
    return o = l, e.enter("attentionSequence"), a(l);
  }
  function a(l) {
    if (l === o)
      return e.consume(l), a;
    const c = e.exit("attentionSequence"), d = Rn(l), u = !d || d === 2 && i || n.includes(l), p = !i || i === 2 && d || n.includes(r);
    return c._open = !!(o === 42 ? u : u && (i || !p)), c._close = !!(o === 42 ? p : p && (d || !u)), t(l);
  }
}
function Mu(e, t) {
  e.column += t, e.offset += t, e._bufferIndex += t;
}
const oC = {
  name: "autolink",
  tokenize: sC
};
function sC(e, t, n) {
  let r = 0;
  return i;
  function i(h) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), o;
  }
  function o(h) {
    return De(h) ? (e.consume(h), s) : h === 64 ? n(h) : c(h);
  }
  function s(h) {
    return h === 43 || h === 45 || h === 46 || Ie(h) ? (r = 1, a(h)) : c(h);
  }
  function a(h) {
    return h === 58 ? (e.consume(h), r = 0, l) : (h === 43 || h === 45 || h === 46 || Ie(h)) && r++ < 32 ? (e.consume(h), a) : (r = 0, c(h));
  }
  function l(h) {
    return h === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : h === null || h === 32 || h === 60 || Li(h) ? n(h) : (e.consume(h), l);
  }
  function c(h) {
    return h === 64 ? (e.consume(h), d) : qE(h) ? (e.consume(h), c) : n(h);
  }
  function d(h) {
    return Ie(h) ? u(h) : n(h);
  }
  function u(h) {
    return h === 46 ? (e.consume(h), r = 0, d) : h === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), t) : p(h);
  }
  function p(h) {
    if ((h === 45 || Ie(h)) && r++ < 63) {
      const m = h === 45 ? p : u;
      return e.consume(h), m;
    }
    return n(h);
  }
}
const Gr = {
  partial: !0,
  tokenize: aC
};
function aC(e, t, n) {
  return r;
  function r(o) {
    return ce(o) ? he(e, i, "linePrefix")(o) : i(o);
  }
  function i(o) {
    return o === null || te(o) ? t(o) : n(o);
  }
}
const im = {
  continuation: {
    tokenize: cC
  },
  exit: uC,
  name: "blockQuote",
  tokenize: lC
};
function lC(e, t, n) {
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
    return ce(s) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(s), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(s));
  }
}
function cC(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return ce(s) ? he(e, o, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(s) : o(s);
  }
  function o(s) {
    return e.attempt(im, t, n)(s);
  }
}
function uC(e) {
  e.exit("blockQuote");
}
const om = {
  name: "characterEscape",
  tokenize: dC
};
function dC(e, t, n) {
  return r;
  function r(o) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(o), e.exit("escapeMarker"), i;
  }
  function i(o) {
    return XE(o) ? (e.enter("characterEscapeValue"), e.consume(o), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : n(o);
  }
}
const sm = {
  name: "characterReference",
  tokenize: fC
};
function fC(e, t, n) {
  const r = this;
  let i = 0, o, s;
  return a;
  function a(u) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(u), e.exit("characterReferenceMarker"), l;
  }
  function l(u) {
    return u === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(u), e.exit("characterReferenceMarkerNumeric"), c) : (e.enter("characterReferenceValue"), o = 31, s = Ie, d(u));
  }
  function c(u) {
    return u === 88 || u === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(u), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), o = 6, s = KE, d) : (e.enter("characterReferenceValue"), o = 7, s = qs, d(u));
  }
  function d(u) {
    if (u === 59 && i) {
      const p = e.exit("characterReferenceValue");
      return s === Ie && !Cl(r.sliceSerialize(p)) ? n(u) : (e.enter("characterReferenceMarker"), e.consume(u), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
    }
    return s(u) && i++ < o ? (e.consume(u), d) : n(u);
  }
}
const Iu = {
  partial: !0,
  tokenize: pC
}, Pu = {
  concrete: !0,
  name: "codeFenced",
  tokenize: hC
};
function hC(e, t, n) {
  const r = this, i = {
    partial: !0,
    tokenize: N
  };
  let o = 0, s = 0, a;
  return l;
  function l(C) {
    return c(C);
  }
  function c(C) {
    const O = r.events[r.events.length - 1];
    return o = O && O[1].type === "linePrefix" ? O[2].sliceSerialize(O[1], !0).length : 0, a = C, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), d(C);
  }
  function d(C) {
    return C === a ? (s++, e.consume(C), d) : s < 3 ? n(C) : (e.exit("codeFencedFenceSequence"), ce(C) ? he(e, u, "whitespace")(C) : u(C));
  }
  function u(C) {
    return C === null || te(C) ? (e.exit("codeFencedFence"), r.interrupt ? t(C) : e.check(Iu, g, S)(C)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), p(C));
  }
  function p(C) {
    return C === null || te(C) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), u(C)) : ce(C) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), he(e, h, "whitespace")(C)) : C === 96 && C === a ? n(C) : (e.consume(C), p);
  }
  function h(C) {
    return C === null || te(C) ? u(C) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), m(C));
  }
  function m(C) {
    return C === null || te(C) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), u(C)) : C === 96 && C === a ? n(C) : (e.consume(C), m);
  }
  function g(C) {
    return e.attempt(i, S, x)(C);
  }
  function x(C) {
    return e.enter("lineEnding"), e.consume(C), e.exit("lineEnding"), b;
  }
  function b(C) {
    return o > 0 && ce(C) ? he(e, A, "linePrefix", o + 1)(C) : A(C);
  }
  function A(C) {
    return C === null || te(C) ? e.check(Iu, g, S)(C) : (e.enter("codeFlowValue"), w(C));
  }
  function w(C) {
    return C === null || te(C) ? (e.exit("codeFlowValue"), A(C)) : (e.consume(C), w);
  }
  function S(C) {
    return e.exit("codeFenced"), t(C);
  }
  function N(C, O, D) {
    let z = 0;
    return E;
    function E(j) {
      return C.enter("lineEnding"), C.consume(j), C.exit("lineEnding"), P;
    }
    function P(j) {
      return C.enter("codeFencedFence"), ce(j) ? he(C, T, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(j) : T(j);
    }
    function T(j) {
      return j === a ? (C.enter("codeFencedFenceSequence"), Y(j)) : D(j);
    }
    function Y(j) {
      return j === a ? (z++, C.consume(j), Y) : z >= s ? (C.exit("codeFencedFenceSequence"), ce(j) ? he(C, R, "whitespace")(j) : R(j)) : D(j);
    }
    function R(j) {
      return j === null || te(j) ? (C.exit("codeFencedFence"), O(j)) : D(j);
    }
  }
}
function pC(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return s === null ? n(s) : (e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), o);
  }
  function o(s) {
    return r.parser.lazy[r.now().line] ? n(s) : t(s);
  }
}
const rs = {
  name: "codeIndented",
  tokenize: gC
}, mC = {
  partial: !0,
  tokenize: xC
};
function gC(e, t, n) {
  const r = this;
  return i;
  function i(c) {
    return e.enter("codeIndented"), he(e, o, "linePrefix", 5)(c);
  }
  function o(c) {
    const d = r.events[r.events.length - 1];
    return d && d[1].type === "linePrefix" && d[2].sliceSerialize(d[1], !0).length >= 4 ? s(c) : n(c);
  }
  function s(c) {
    return c === null ? l(c) : te(c) ? e.attempt(mC, s, l)(c) : (e.enter("codeFlowValue"), a(c));
  }
  function a(c) {
    return c === null || te(c) ? (e.exit("codeFlowValue"), s(c)) : (e.consume(c), a);
  }
  function l(c) {
    return e.exit("codeIndented"), t(c);
  }
}
function xC(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return r.parser.lazy[r.now().line] ? n(s) : te(s) ? (e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), i) : he(e, o, "linePrefix", 5)(s);
  }
  function o(s) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(s) : te(s) ? i(s) : n(s);
  }
}
const bC = {
  name: "codeText",
  previous: vC,
  resolve: yC,
  tokenize: wC
};
function yC(e) {
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
function vC(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function wC(e, t, n) {
  let r = 0, i, o;
  return s;
  function s(u) {
    return e.enter("codeText"), e.enter("codeTextSequence"), a(u);
  }
  function a(u) {
    return u === 96 ? (e.consume(u), r++, a) : (e.exit("codeTextSequence"), l(u));
  }
  function l(u) {
    return u === null ? n(u) : u === 32 ? (e.enter("space"), e.consume(u), e.exit("space"), l) : u === 96 ? (o = e.enter("codeTextSequence"), i = 0, d(u)) : te(u) ? (e.enter("lineEnding"), e.consume(u), e.exit("lineEnding"), l) : (e.enter("codeTextData"), c(u));
  }
  function c(u) {
    return u === null || u === 32 || u === 96 || te(u) ? (e.exit("codeTextData"), l(u)) : (e.consume(u), c);
  }
  function d(u) {
    return u === 96 ? (e.consume(u), i++, d) : i === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(u)) : (o.type = "codeTextData", c(u));
  }
}
class AC {
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
    return r && Kn(this.left, r), o.reverse();
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
    this.setCursor(Number.POSITIVE_INFINITY), Kn(this.left, t);
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
    this.setCursor(0), Kn(this.right, t.reverse());
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
        Kn(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - t, Number.POSITIVE_INFINITY);
        Kn(this.left, n.reverse());
      }
  }
}
function Kn(e, t) {
  let n = 0;
  if (t.length < 1e4)
    e.push(...t);
  else
    for (; n < t.length; )
      e.push(...t.slice(n, n + 1e4)), n += 1e4;
}
function am(e) {
  const t = {};
  let n = -1, r, i, o, s, a, l, c;
  const d = new AC(e);
  for (; ++n < d.length; ) {
    for (; n in t; )
      n = t[n];
    if (r = d.get(n), n && r[1].type === "chunkFlow" && d.get(n - 1)[1].type === "listItemPrefix" && (l = r[1]._tokenizer.events, o = 0, o < l.length && l[o][1].type === "lineEndingBlank" && (o += 2), o < l.length && l[o][1].type === "content"))
      for (; ++o < l.length && l[o][1].type !== "content"; )
        l[o][1].type === "chunkText" && (l[o][1]._isInFirstContentOfListItem = !0, o++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(t, kC(d, n)), n = t[n], c = !0);
    else if (r[1]._container) {
      for (o = n, i = void 0; o--; )
        if (s = d.get(o), s[1].type === "lineEnding" || s[1].type === "lineEndingBlank")
          s[0] === "enter" && (i && (d.get(i)[1].type = "lineEndingBlank"), s[1].type = "lineEnding", i = o);
        else if (!(s[1].type === "linePrefix" || s[1].type === "listItemIndent")) break;
      i && (r[1].end = {
        ...d.get(i)[1].start
      }, a = d.slice(i, n), a.unshift(r), d.splice(i, n - i + 1, a));
    }
  }
  return Qe(e, 0, Number.POSITIVE_INFINITY, d.slice(0)), !c;
}
function kC(e, t) {
  const n = e.get(t)[1], r = e.get(t)[2];
  let i = t - 1;
  const o = [];
  let s = n._tokenizer;
  s || (s = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (s._contentTypeTextTrailing = !0));
  const a = s.events, l = [], c = {};
  let d, u, p = -1, h = n, m = 0, g = 0;
  const x = [g];
  for (; h; ) {
    for (; e.get(++i)[1] !== h; )
      ;
    o.push(i), h._tokenizer || (d = r.sliceStream(h), h.next || d.push(null), u && s.defineSkip(h.start), h._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = !0), s.write(d), h._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = void 0)), u = h, h = h.next;
  }
  for (h = n; ++p < a.length; )
    // Find a void token that includes a break.
    a[p][0] === "exit" && a[p - 1][0] === "enter" && a[p][1].type === a[p - 1][1].type && a[p][1].start.line !== a[p][1].end.line && (g = p + 1, x.push(g), h._tokenizer = void 0, h.previous = void 0, h = h.next);
  for (s.events = [], h ? (h._tokenizer = void 0, h.previous = void 0) : x.pop(), p = x.length; p--; ) {
    const b = a.slice(x[p], x[p + 1]), A = o.pop();
    l.push([A, A + b.length - 1]), e.splice(A, 2, b);
  }
  for (l.reverse(), p = -1; ++p < l.length; )
    c[m + l[p][0]] = m + l[p][1], m += l[p][1] - l[p][0] - 1;
  return c;
}
const EC = {
  resolve: SC,
  tokenize: NC
}, CC = {
  partial: !0,
  tokenize: jC
};
function SC(e) {
  return am(e), e;
}
function NC(e, t) {
  let n;
  return r;
  function r(a) {
    return e.enter("content"), n = e.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? o(a) : te(a) ? e.check(CC, s, o)(a) : (e.consume(a), i);
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
function jC(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), he(e, o, "linePrefix");
  }
  function o(s) {
    if (s === null || te(s))
      return n(s);
    const a = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? t(s) : e.interrupt(r.parser.constructs.flow, n, t)(s);
  }
}
function lm(e, t, n, r, i, o, s, a, l) {
  const c = l || Number.POSITIVE_INFINITY;
  let d = 0;
  return u;
  function u(b) {
    return b === 60 ? (e.enter(r), e.enter(i), e.enter(o), e.consume(b), e.exit(o), p) : b === null || b === 32 || b === 41 || Li(b) ? n(b) : (e.enter(r), e.enter(s), e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), g(b));
  }
  function p(b) {
    return b === 62 ? (e.enter(o), e.consume(b), e.exit(o), e.exit(i), e.exit(r), t) : (e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), h(b));
  }
  function h(b) {
    return b === 62 ? (e.exit("chunkString"), e.exit(a), p(b)) : b === null || b === 60 || te(b) ? n(b) : (e.consume(b), b === 92 ? m : h);
  }
  function m(b) {
    return b === 60 || b === 62 || b === 92 ? (e.consume(b), h) : h(b);
  }
  function g(b) {
    return !d && (b === null || b === 41 || we(b)) ? (e.exit("chunkString"), e.exit(a), e.exit(s), e.exit(r), t(b)) : d < c && b === 40 ? (e.consume(b), d++, g) : b === 41 ? (e.consume(b), d--, g) : b === null || b === 32 || b === 40 || Li(b) ? n(b) : (e.consume(b), b === 92 ? x : g);
  }
  function x(b) {
    return b === 40 || b === 41 || b === 92 ? (e.consume(b), g) : g(b);
  }
}
function cm(e, t, n, r, i, o) {
  const s = this;
  let a = 0, l;
  return c;
  function c(h) {
    return e.enter(r), e.enter(i), e.consume(h), e.exit(i), e.enter(o), d;
  }
  function d(h) {
    return a > 999 || h === null || h === 91 || h === 93 && !l || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    h === 94 && !a && "_hiddenFootnoteSupport" in s.parser.constructs ? n(h) : h === 93 ? (e.exit(o), e.enter(i), e.consume(h), e.exit(i), e.exit(r), t) : te(h) ? (e.enter("lineEnding"), e.consume(h), e.exit("lineEnding"), d) : (e.enter("chunkString", {
      contentType: "string"
    }), u(h));
  }
  function u(h) {
    return h === null || h === 91 || h === 93 || te(h) || a++ > 999 ? (e.exit("chunkString"), d(h)) : (e.consume(h), l || (l = !ce(h)), h === 92 ? p : u);
  }
  function p(h) {
    return h === 91 || h === 92 || h === 93 ? (e.consume(h), a++, u) : u(h);
  }
}
function um(e, t, n, r, i, o) {
  let s;
  return a;
  function a(p) {
    return p === 34 || p === 39 || p === 40 ? (e.enter(r), e.enter(i), e.consume(p), e.exit(i), s = p === 40 ? 41 : p, l) : n(p);
  }
  function l(p) {
    return p === s ? (e.enter(i), e.consume(p), e.exit(i), e.exit(r), t) : (e.enter(o), c(p));
  }
  function c(p) {
    return p === s ? (e.exit(o), l(s)) : p === null ? n(p) : te(p) ? (e.enter("lineEnding"), e.consume(p), e.exit("lineEnding"), he(e, c, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), d(p));
  }
  function d(p) {
    return p === s || p === null || te(p) ? (e.exit("chunkString"), c(p)) : (e.consume(p), p === 92 ? u : d);
  }
  function u(p) {
    return p === s || p === 92 ? (e.consume(p), d) : d(p);
  }
}
function ar(e, t) {
  let n;
  return r;
  function r(i) {
    return te(i) ? (e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), n = !0, r) : ce(i) ? he(e, r, n ? "linePrefix" : "lineSuffix")(i) : t(i);
  }
}
const MC = {
  name: "definition",
  tokenize: PC
}, IC = {
  partial: !0,
  tokenize: RC
};
function PC(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(h) {
    return e.enter("definition"), s(h);
  }
  function s(h) {
    return cm.call(
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
    return i = et(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), h === 58 ? (e.enter("definitionMarker"), e.consume(h), e.exit("definitionMarker"), l) : n(h);
  }
  function l(h) {
    return we(h) ? ar(e, c)(h) : c(h);
  }
  function c(h) {
    return lm(
      e,
      d,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(h);
  }
  function d(h) {
    return e.attempt(IC, u, u)(h);
  }
  function u(h) {
    return ce(h) ? he(e, p, "whitespace")(h) : p(h);
  }
  function p(h) {
    return h === null || te(h) ? (e.exit("definition"), r.parser.defined.push(i), t(h)) : n(h);
  }
}
function RC(e, t, n) {
  return r;
  function r(a) {
    return we(a) ? ar(e, i)(a) : n(a);
  }
  function i(a) {
    return um(e, o, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function o(a) {
    return ce(a) ? he(e, s, "whitespace")(a) : s(a);
  }
  function s(a) {
    return a === null || te(a) ? t(a) : n(a);
  }
}
const DC = {
  name: "hardBreakEscape",
  tokenize: OC
};
function OC(e, t, n) {
  return r;
  function r(o) {
    return e.enter("hardBreakEscape"), e.consume(o), i;
  }
  function i(o) {
    return te(o) ? (e.exit("hardBreakEscape"), t(o)) : n(o);
  }
}
const TC = {
  name: "headingAtx",
  resolve: zC,
  tokenize: BC
};
function zC(e, t) {
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
  }, Qe(e, r, n - r + 1, [["enter", i, t], ["enter", o, t], ["exit", o, t], ["exit", i, t]])), e;
}
function BC(e, t, n) {
  let r = 0;
  return i;
  function i(d) {
    return e.enter("atxHeading"), o(d);
  }
  function o(d) {
    return e.enter("atxHeadingSequence"), s(d);
  }
  function s(d) {
    return d === 35 && r++ < 6 ? (e.consume(d), s) : d === null || we(d) ? (e.exit("atxHeadingSequence"), a(d)) : n(d);
  }
  function a(d) {
    return d === 35 ? (e.enter("atxHeadingSequence"), l(d)) : d === null || te(d) ? (e.exit("atxHeading"), t(d)) : ce(d) ? he(e, a, "whitespace")(d) : (e.enter("atxHeadingText"), c(d));
  }
  function l(d) {
    return d === 35 ? (e.consume(d), l) : (e.exit("atxHeadingSequence"), a(d));
  }
  function c(d) {
    return d === null || d === 35 || we(d) ? (e.exit("atxHeadingText"), a(d)) : (e.consume(d), c);
  }
}
const LC = [
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
], Ru = ["pre", "script", "style", "textarea"], FC = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: HC,
  tokenize: UC
}, GC = {
  partial: !0,
  tokenize: ZC
}, YC = {
  partial: !0,
  tokenize: QC
};
function HC(e) {
  let t = e.length;
  for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"); )
    ;
  return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function UC(e, t, n) {
  const r = this;
  let i, o, s, a, l;
  return c;
  function c(k) {
    return d(k);
  }
  function d(k) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(k), u;
  }
  function u(k) {
    return k === 33 ? (e.consume(k), p) : k === 47 ? (e.consume(k), o = !0, g) : k === 63 ? (e.consume(k), i = 3, r.interrupt ? t : y) : De(k) ? (e.consume(k), s = String.fromCharCode(k), x) : n(k);
  }
  function p(k) {
    return k === 45 ? (e.consume(k), i = 2, h) : k === 91 ? (e.consume(k), i = 5, a = 0, m) : De(k) ? (e.consume(k), i = 4, r.interrupt ? t : y) : n(k);
  }
  function h(k) {
    return k === 45 ? (e.consume(k), r.interrupt ? t : y) : n(k);
  }
  function m(k) {
    const X = "CDATA[";
    return k === X.charCodeAt(a++) ? (e.consume(k), a === X.length ? r.interrupt ? t : T : m) : n(k);
  }
  function g(k) {
    return De(k) ? (e.consume(k), s = String.fromCharCode(k), x) : n(k);
  }
  function x(k) {
    if (k === null || k === 47 || k === 62 || we(k)) {
      const X = k === 47, K = s.toLowerCase();
      return !X && !o && Ru.includes(K) ? (i = 1, r.interrupt ? t(k) : T(k)) : LC.includes(s.toLowerCase()) ? (i = 6, X ? (e.consume(k), b) : r.interrupt ? t(k) : T(k)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(k) : o ? A(k) : w(k));
    }
    return k === 45 || Ie(k) ? (e.consume(k), s += String.fromCharCode(k), x) : n(k);
  }
  function b(k) {
    return k === 62 ? (e.consume(k), r.interrupt ? t : T) : n(k);
  }
  function A(k) {
    return ce(k) ? (e.consume(k), A) : E(k);
  }
  function w(k) {
    return k === 47 ? (e.consume(k), E) : k === 58 || k === 95 || De(k) ? (e.consume(k), S) : ce(k) ? (e.consume(k), w) : E(k);
  }
  function S(k) {
    return k === 45 || k === 46 || k === 58 || k === 95 || Ie(k) ? (e.consume(k), S) : N(k);
  }
  function N(k) {
    return k === 61 ? (e.consume(k), C) : ce(k) ? (e.consume(k), N) : w(k);
  }
  function C(k) {
    return k === null || k === 60 || k === 61 || k === 62 || k === 96 ? n(k) : k === 34 || k === 39 ? (e.consume(k), l = k, O) : ce(k) ? (e.consume(k), C) : D(k);
  }
  function O(k) {
    return k === l ? (e.consume(k), l = null, z) : k === null || te(k) ? n(k) : (e.consume(k), O);
  }
  function D(k) {
    return k === null || k === 34 || k === 39 || k === 47 || k === 60 || k === 61 || k === 62 || k === 96 || we(k) ? N(k) : (e.consume(k), D);
  }
  function z(k) {
    return k === 47 || k === 62 || ce(k) ? w(k) : n(k);
  }
  function E(k) {
    return k === 62 ? (e.consume(k), P) : n(k);
  }
  function P(k) {
    return k === null || te(k) ? T(k) : ce(k) ? (e.consume(k), P) : n(k);
  }
  function T(k) {
    return k === 45 && i === 2 ? (e.consume(k), I) : k === 60 && i === 1 ? (e.consume(k), F) : k === 62 && i === 4 ? (e.consume(k), M) : k === 63 && i === 3 ? (e.consume(k), y) : k === 93 && i === 5 ? (e.consume(k), L) : te(k) && (i === 6 || i === 7) ? (e.exit("htmlFlowData"), e.check(GC, U, Y)(k)) : k === null || te(k) ? (e.exit("htmlFlowData"), Y(k)) : (e.consume(k), T);
  }
  function Y(k) {
    return e.check(YC, R, U)(k);
  }
  function R(k) {
    return e.enter("lineEnding"), e.consume(k), e.exit("lineEnding"), j;
  }
  function j(k) {
    return k === null || te(k) ? Y(k) : (e.enter("htmlFlowData"), T(k));
  }
  function I(k) {
    return k === 45 ? (e.consume(k), y) : T(k);
  }
  function F(k) {
    return k === 47 ? (e.consume(k), s = "", B) : T(k);
  }
  function B(k) {
    if (k === 62) {
      const X = s.toLowerCase();
      return Ru.includes(X) ? (e.consume(k), M) : T(k);
    }
    return De(k) && s.length < 8 ? (e.consume(k), s += String.fromCharCode(k), B) : T(k);
  }
  function L(k) {
    return k === 93 ? (e.consume(k), y) : T(k);
  }
  function y(k) {
    return k === 62 ? (e.consume(k), M) : k === 45 && i === 2 ? (e.consume(k), y) : T(k);
  }
  function M(k) {
    return k === null || te(k) ? (e.exit("htmlFlowData"), U(k)) : (e.consume(k), M);
  }
  function U(k) {
    return e.exit("htmlFlow"), t(k);
  }
}
function QC(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return te(s) ? (e.enter("lineEnding"), e.consume(s), e.exit("lineEnding"), o) : n(s);
  }
  function o(s) {
    return r.parser.lazy[r.now().line] ? n(s) : t(s);
  }
}
function ZC(e, t, n) {
  return r;
  function r(i) {
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), e.attempt(Gr, t, n);
  }
}
const VC = {
  name: "htmlText",
  tokenize: WC
};
function WC(e, t, n) {
  const r = this;
  let i, o, s;
  return a;
  function a(y) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(y), l;
  }
  function l(y) {
    return y === 33 ? (e.consume(y), c) : y === 47 ? (e.consume(y), N) : y === 63 ? (e.consume(y), w) : De(y) ? (e.consume(y), D) : n(y);
  }
  function c(y) {
    return y === 45 ? (e.consume(y), d) : y === 91 ? (e.consume(y), o = 0, m) : De(y) ? (e.consume(y), A) : n(y);
  }
  function d(y) {
    return y === 45 ? (e.consume(y), h) : n(y);
  }
  function u(y) {
    return y === null ? n(y) : y === 45 ? (e.consume(y), p) : te(y) ? (s = u, F(y)) : (e.consume(y), u);
  }
  function p(y) {
    return y === 45 ? (e.consume(y), h) : u(y);
  }
  function h(y) {
    return y === 62 ? I(y) : y === 45 ? p(y) : u(y);
  }
  function m(y) {
    const M = "CDATA[";
    return y === M.charCodeAt(o++) ? (e.consume(y), o === M.length ? g : m) : n(y);
  }
  function g(y) {
    return y === null ? n(y) : y === 93 ? (e.consume(y), x) : te(y) ? (s = g, F(y)) : (e.consume(y), g);
  }
  function x(y) {
    return y === 93 ? (e.consume(y), b) : g(y);
  }
  function b(y) {
    return y === 62 ? I(y) : y === 93 ? (e.consume(y), b) : g(y);
  }
  function A(y) {
    return y === null || y === 62 ? I(y) : te(y) ? (s = A, F(y)) : (e.consume(y), A);
  }
  function w(y) {
    return y === null ? n(y) : y === 63 ? (e.consume(y), S) : te(y) ? (s = w, F(y)) : (e.consume(y), w);
  }
  function S(y) {
    return y === 62 ? I(y) : w(y);
  }
  function N(y) {
    return De(y) ? (e.consume(y), C) : n(y);
  }
  function C(y) {
    return y === 45 || Ie(y) ? (e.consume(y), C) : O(y);
  }
  function O(y) {
    return te(y) ? (s = O, F(y)) : ce(y) ? (e.consume(y), O) : I(y);
  }
  function D(y) {
    return y === 45 || Ie(y) ? (e.consume(y), D) : y === 47 || y === 62 || we(y) ? z(y) : n(y);
  }
  function z(y) {
    return y === 47 ? (e.consume(y), I) : y === 58 || y === 95 || De(y) ? (e.consume(y), E) : te(y) ? (s = z, F(y)) : ce(y) ? (e.consume(y), z) : I(y);
  }
  function E(y) {
    return y === 45 || y === 46 || y === 58 || y === 95 || Ie(y) ? (e.consume(y), E) : P(y);
  }
  function P(y) {
    return y === 61 ? (e.consume(y), T) : te(y) ? (s = P, F(y)) : ce(y) ? (e.consume(y), P) : z(y);
  }
  function T(y) {
    return y === null || y === 60 || y === 61 || y === 62 || y === 96 ? n(y) : y === 34 || y === 39 ? (e.consume(y), i = y, Y) : te(y) ? (s = T, F(y)) : ce(y) ? (e.consume(y), T) : (e.consume(y), R);
  }
  function Y(y) {
    return y === i ? (e.consume(y), i = void 0, j) : y === null ? n(y) : te(y) ? (s = Y, F(y)) : (e.consume(y), Y);
  }
  function R(y) {
    return y === null || y === 34 || y === 39 || y === 60 || y === 61 || y === 96 ? n(y) : y === 47 || y === 62 || we(y) ? z(y) : (e.consume(y), R);
  }
  function j(y) {
    return y === 47 || y === 62 || we(y) ? z(y) : n(y);
  }
  function I(y) {
    return y === 62 ? (e.consume(y), e.exit("htmlTextData"), e.exit("htmlText"), t) : n(y);
  }
  function F(y) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(y), e.exit("lineEnding"), B;
  }
  function B(y) {
    return ce(y) ? he(e, L, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(y) : L(y);
  }
  function L(y) {
    return e.enter("htmlTextData"), s(y);
  }
}
const Sl = {
  name: "labelEnd",
  resolveAll: XC,
  resolveTo: _C,
  tokenize: $C
}, JC = {
  tokenize: eS
}, qC = {
  tokenize: tS
}, KC = {
  tokenize: nS
};
function XC(e) {
  let t = -1;
  const n = [];
  for (; ++t < e.length; ) {
    const r = e[t][1];
    if (n.push(e[t]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const i = r.type === "labelImage" ? 4 : 2;
      r.type = "data", t += i;
    }
  }
  return e.length !== n.length && Qe(e, 0, e.length, n), e;
}
function _C(e, t) {
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
  }, d = {
    type: "labelText",
    start: {
      ...e[o + r + 2][1].end
    },
    end: {
      ...e[s - 2][1].start
    }
  };
  return a = [["enter", l, t], ["enter", c, t]], a = Ve(a, e.slice(o + 1, o + r + 3)), a = Ve(a, [["enter", d, t]]), a = Ve(a, Ao(t.parser.constructs.insideSpan.null, e.slice(o + r + 4, s - 3), t)), a = Ve(a, [["exit", d, t], e[s - 2], e[s - 1], ["exit", c, t]]), a = Ve(a, e.slice(s + 1)), a = Ve(a, [["exit", l, t]]), Qe(e, o, e.length, a), e;
}
function $C(e, t, n) {
  const r = this;
  let i = r.events.length, o, s;
  for (; i--; )
    if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
      o = r.events[i][1];
      break;
    }
  return a;
  function a(p) {
    return o ? o._inactive ? u(p) : (s = r.parser.defined.includes(et(r.sliceSerialize({
      start: o.end,
      end: r.now()
    }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(p), e.exit("labelMarker"), e.exit("labelEnd"), l) : n(p);
  }
  function l(p) {
    return p === 40 ? e.attempt(JC, d, s ? d : u)(p) : p === 91 ? e.attempt(qC, d, s ? c : u)(p) : s ? d(p) : u(p);
  }
  function c(p) {
    return e.attempt(KC, d, u)(p);
  }
  function d(p) {
    return t(p);
  }
  function u(p) {
    return o._balanced = !0, n(p);
  }
}
function eS(e, t, n) {
  return r;
  function r(u) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(u), e.exit("resourceMarker"), i;
  }
  function i(u) {
    return we(u) ? ar(e, o)(u) : o(u);
  }
  function o(u) {
    return u === 41 ? d(u) : lm(e, s, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(u);
  }
  function s(u) {
    return we(u) ? ar(e, l)(u) : d(u);
  }
  function a(u) {
    return n(u);
  }
  function l(u) {
    return u === 34 || u === 39 || u === 40 ? um(e, c, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(u) : d(u);
  }
  function c(u) {
    return we(u) ? ar(e, d)(u) : d(u);
  }
  function d(u) {
    return u === 41 ? (e.enter("resourceMarker"), e.consume(u), e.exit("resourceMarker"), e.exit("resource"), t) : n(u);
  }
}
function tS(e, t, n) {
  const r = this;
  return i;
  function i(a) {
    return cm.call(r, e, o, s, "reference", "referenceMarker", "referenceString")(a);
  }
  function o(a) {
    return r.parser.defined.includes(et(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? t(a) : n(a);
  }
  function s(a) {
    return n(a);
  }
}
function nS(e, t, n) {
  return r;
  function r(o) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), i;
  }
  function i(o) {
    return o === 93 ? (e.enter("referenceMarker"), e.consume(o), e.exit("referenceMarker"), e.exit("reference"), t) : n(o);
  }
}
const rS = {
  name: "labelStartImage",
  resolveAll: Sl.resolveAll,
  tokenize: iS
};
function iS(e, t, n) {
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
const oS = {
  name: "labelStartLink",
  resolveAll: Sl.resolveAll,
  tokenize: sS
};
function sS(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(s), e.exit("labelMarker"), e.exit("labelLink"), o;
  }
  function o(s) {
    return s === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(s) : t(s);
  }
}
const is = {
  name: "lineEnding",
  tokenize: aS
};
function aS(e, t) {
  return n;
  function n(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), he(e, t, "linePrefix");
  }
}
const xi = {
  name: "thematicBreak",
  tokenize: lS
};
function lS(e, t, n) {
  let r = 0, i;
  return o;
  function o(c) {
    return e.enter("thematicBreak"), s(c);
  }
  function s(c) {
    return i = c, a(c);
  }
  function a(c) {
    return c === i ? (e.enter("thematicBreakSequence"), l(c)) : r >= 3 && (c === null || te(c)) ? (e.exit("thematicBreak"), t(c)) : n(c);
  }
  function l(c) {
    return c === i ? (e.consume(c), r++, l) : (e.exit("thematicBreakSequence"), ce(c) ? he(e, a, "whitespace")(c) : a(c));
  }
}
const Oe = {
  continuation: {
    tokenize: fS
  },
  exit: pS,
  name: "list",
  tokenize: dS
}, cS = {
  partial: !0,
  tokenize: mS
}, uS = {
  partial: !0,
  tokenize: hS
};
function dS(e, t, n) {
  const r = this, i = r.events[r.events.length - 1];
  let o = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, s = 0;
  return a;
  function a(h) {
    const m = r.containerState.type || (h === 42 || h === 43 || h === 45 ? "listUnordered" : "listOrdered");
    if (m === "listUnordered" ? !r.containerState.marker || h === r.containerState.marker : qs(h)) {
      if (r.containerState.type || (r.containerState.type = m, e.enter(m, {
        _container: !0
      })), m === "listUnordered")
        return e.enter("listItemPrefix"), h === 42 || h === 45 ? e.check(xi, n, c)(h) : c(h);
      if (!r.interrupt || h === 49)
        return e.enter("listItemPrefix"), e.enter("listItemValue"), l(h);
    }
    return n(h);
  }
  function l(h) {
    return qs(h) && ++s < 10 ? (e.consume(h), l) : (!r.interrupt || s < 2) && (r.containerState.marker ? h === r.containerState.marker : h === 41 || h === 46) ? (e.exit("listItemValue"), c(h)) : n(h);
  }
  function c(h) {
    return e.enter("listItemMarker"), e.consume(h), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || h, e.check(
      Gr,
      // Can’t be empty when interrupting.
      r.interrupt ? n : d,
      e.attempt(cS, p, u)
    );
  }
  function d(h) {
    return r.containerState.initialBlankLine = !0, o++, p(h);
  }
  function u(h) {
    return ce(h) ? (e.enter("listItemPrefixWhitespace"), e.consume(h), e.exit("listItemPrefixWhitespace"), p) : n(h);
  }
  function p(h) {
    return r.containerState.size = o + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(h);
  }
}
function fS(e, t, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, e.check(Gr, i, o);
  function i(a) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, he(e, t, "listItemIndent", r.containerState.size + 1)(a);
  }
  function o(a) {
    return r.containerState.furtherBlankLines || !ce(a) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, s(a)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, e.attempt(uS, t, s)(a));
  }
  function s(a) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, he(e, e.attempt(Oe, t, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function hS(e, t, n) {
  const r = this;
  return he(e, i, "listItemIndent", r.containerState.size + 1);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return s && s[1].type === "listItemIndent" && s[2].sliceSerialize(s[1], !0).length === r.containerState.size ? t(o) : n(o);
  }
}
function pS(e) {
  e.exit(this.containerState.type);
}
function mS(e, t, n) {
  const r = this;
  return he(e, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return !ce(o) && s && s[1].type === "listItemPrefixWhitespace" ? t(o) : n(o);
  }
}
const Du = {
  name: "setextUnderline",
  resolveTo: gS,
  tokenize: xS
};
function gS(e, t) {
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
function xS(e, t, n) {
  const r = this;
  let i;
  return o;
  function o(c) {
    let d = r.events.length, u;
    for (; d--; )
      if (r.events[d][1].type !== "lineEnding" && r.events[d][1].type !== "linePrefix" && r.events[d][1].type !== "content") {
        u = r.events[d][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || u) ? (e.enter("setextHeadingLine"), i = c, s(c)) : n(c);
  }
  function s(c) {
    return e.enter("setextHeadingLineSequence"), a(c);
  }
  function a(c) {
    return c === i ? (e.consume(c), a) : (e.exit("setextHeadingLineSequence"), ce(c) ? he(e, l, "lineSuffix")(c) : l(c));
  }
  function l(c) {
    return c === null || te(c) ? (e.exit("setextHeadingLine"), t(c)) : n(c);
  }
}
const bS = {
  tokenize: yS
};
function yS(e) {
  const t = this, n = e.attempt(
    // Try to parse a blank line.
    Gr,
    r,
    // Try to parse initial flow (essentially, only code).
    e.attempt(this.parser.constructs.flowInitial, i, he(e, e.attempt(this.parser.constructs.flow, i, e.attempt(EC, i)), "linePrefix"))
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
const vS = {
  resolveAll: fm()
}, wS = dm("string"), AS = dm("text");
function dm(e) {
  return {
    resolveAll: fm(e === "text" ? kS : void 0),
    tokenize: t
  };
  function t(n) {
    const r = this, i = this.parser.constructs[e], o = n.attempt(i, s, a);
    return s;
    function s(d) {
      return c(d) ? o(d) : a(d);
    }
    function a(d) {
      if (d === null) {
        n.consume(d);
        return;
      }
      return n.enter("data"), n.consume(d), l;
    }
    function l(d) {
      return c(d) ? (n.exit("data"), o(d)) : (n.consume(d), l);
    }
    function c(d) {
      if (d === null)
        return !0;
      const u = i[d];
      let p = -1;
      if (u)
        for (; ++p < u.length; ) {
          const h = u[p];
          if (!h.previous || h.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function fm(e) {
  return t;
  function t(n, r) {
    let i = -1, o;
    for (; ++i <= n.length; )
      o === void 0 ? n[i] && n[i][1].type === "data" && (o = i, i++) : (!n[i] || n[i][1].type !== "data") && (i !== o + 2 && (n[o][1].end = n[i - 1][1].end, n.splice(o + 2, i - o - 2), i = o + 2), o = void 0);
    return e ? e(n, r) : n;
  }
}
function kS(e, t) {
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
const ES = {
  42: Oe,
  43: Oe,
  45: Oe,
  48: Oe,
  49: Oe,
  50: Oe,
  51: Oe,
  52: Oe,
  53: Oe,
  54: Oe,
  55: Oe,
  56: Oe,
  57: Oe,
  62: im
}, CS = {
  91: MC
}, SS = {
  [-2]: rs,
  [-1]: rs,
  32: rs
}, NS = {
  35: TC,
  42: xi,
  45: [Du, xi],
  60: FC,
  61: Du,
  95: xi,
  96: Pu,
  126: Pu
}, jS = {
  38: sm,
  92: om
}, MS = {
  [-5]: is,
  [-4]: is,
  [-3]: is,
  33: rS,
  38: sm,
  42: Ks,
  60: [oC, VC],
  91: oS,
  92: [DC, om],
  93: Sl,
  95: Ks,
  96: bC
}, IS = {
  null: [Ks, vS]
}, PS = {
  null: [42, 95]
}, RS = {
  null: []
}, DS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: PS,
  contentInitial: CS,
  disable: RS,
  document: ES,
  flow: NS,
  flowInitial: SS,
  insideSpan: IS,
  string: jS,
  text: MS
}, Symbol.toStringTag, { value: "Module" }));
function OS(e, t, n) {
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
    attempt: O(N),
    check: O(C),
    consume: A,
    enter: w,
    exit: S,
    interrupt: O(C, {
      interrupt: !0
    })
  }, c = {
    code: null,
    containerState: {},
    defineSkip: g,
    events: [],
    now: m,
    parser: e,
    previous: null,
    sliceSerialize: p,
    sliceStream: h,
    write: u
  };
  let d = t.tokenize.call(c, l);
  return t.resolveAll && o.push(t), c;
  function u(P) {
    return s = Ve(s, P), x(), s[s.length - 1] !== null ? [] : (D(t, 0), c.events = Ao(o, c.events, c), c.events);
  }
  function p(P, T) {
    return zS(h(P), T);
  }
  function h(P) {
    return TS(s, P);
  }
  function m() {
    const {
      _bufferIndex: P,
      _index: T,
      line: Y,
      column: R,
      offset: j
    } = r;
    return {
      _bufferIndex: P,
      _index: T,
      line: Y,
      column: R,
      offset: j
    };
  }
  function g(P) {
    i[P.line] = P.column, E();
  }
  function x() {
    let P;
    for (; r._index < s.length; ) {
      const T = s[r._index];
      if (typeof T == "string")
        for (P = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === P && r._bufferIndex < T.length; )
          b(T.charCodeAt(r._bufferIndex));
      else
        b(T);
    }
  }
  function b(P) {
    d = d(P);
  }
  function A(P) {
    te(P) ? (r.line++, r.column = 1, r.offset += P === -3 ? 2 : 1, E()) : P !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    s[r._index].length && (r._bufferIndex = -1, r._index++)), c.previous = P;
  }
  function w(P, T) {
    const Y = T || {};
    return Y.type = P, Y.start = m(), c.events.push(["enter", Y, c]), a.push(Y), Y;
  }
  function S(P) {
    const T = a.pop();
    return T.end = m(), c.events.push(["exit", T, c]), T;
  }
  function N(P, T) {
    D(P, T.from);
  }
  function C(P, T) {
    T.restore();
  }
  function O(P, T) {
    return Y;
    function Y(R, j, I) {
      let F, B, L, y;
      return Array.isArray(R) ? (
        /* c8 ignore next 1 */
        U(R)
      ) : "tokenize" in R ? (
        // Looks like a construct.
        U([
          /** @type {Construct} */
          R
        ])
      ) : M(R);
      function M(W) {
        return Z;
        function Z(q) {
          const ee = q !== null && W[q], le = q !== null && W.null, Ee = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(ee) ? ee : ee ? [ee] : [],
            ...Array.isArray(le) ? le : le ? [le] : []
          ];
          return U(Ee)(q);
        }
      }
      function U(W) {
        return F = W, B = 0, W.length === 0 ? I : k(W[B]);
      }
      function k(W) {
        return Z;
        function Z(q) {
          return y = z(), L = W, W.partial || (c.currentConstruct = W), W.name && c.parser.constructs.disable.null.includes(W.name) ? K() : W.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            T ? Object.assign(Object.create(c), T) : c,
            l,
            X,
            K
          )(q);
        }
      }
      function X(W) {
        return P(L, y), j;
      }
      function K(W) {
        return y.restore(), ++B < F.length ? k(F[B]) : I;
      }
    }
  }
  function D(P, T) {
    P.resolveAll && !o.includes(P) && o.push(P), P.resolve && Qe(c.events, T, c.events.length - T, P.resolve(c.events.slice(T), c)), P.resolveTo && (c.events = P.resolveTo(c.events, c));
  }
  function z() {
    const P = m(), T = c.previous, Y = c.currentConstruct, R = c.events.length, j = Array.from(a);
    return {
      from: R,
      restore: I
    };
    function I() {
      r = P, c.previous = T, c.currentConstruct = Y, c.events.length = R, a = j, E();
    }
  }
  function E() {
    r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
  }
}
function TS(e, t) {
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
function zS(e, t) {
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
function BS(e) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      nm([DS, ...(e || {}).extensions || []])
    ),
    content: i(_E),
    defined: [],
    document: i(eC),
    flow: i(bS),
    lazy: {},
    string: i(wS),
    text: i(AS)
  };
  return r;
  function i(o) {
    return s;
    function s(a) {
      return OS(r, o, a);
    }
  }
}
function LS(e) {
  for (; !am(e); )
    ;
  return e;
}
const Ou = /[\0\t\n\r]/g;
function FS() {
  let e = 1, t = "", n = !0, r;
  return i;
  function i(o, s, a) {
    const l = [];
    let c, d, u, p, h;
    for (o = t + (typeof o == "string" ? o.toString() : new TextDecoder(s || void 0).decode(o)), u = 0, t = "", n && (o.charCodeAt(0) === 65279 && u++, n = void 0); u < o.length; ) {
      if (Ou.lastIndex = u, c = Ou.exec(o), p = c && c.index !== void 0 ? c.index : o.length, h = o.charCodeAt(p), !c) {
        t = o.slice(u);
        break;
      }
      if (h === 10 && u === p && r)
        l.push(-3), r = void 0;
      else
        switch (r && (l.push(-5), r = void 0), u < p && (l.push(o.slice(u, p)), e += p - u), h) {
          case 0: {
            l.push(65533), e++;
            break;
          }
          case 9: {
            for (d = Math.ceil(e / 4) * 4, l.push(-2); e++ < d; ) l.push(-1);
            break;
          }
          case 10: {
            l.push(-4), e = 1;
            break;
          }
          default:
            r = !0, e = 1;
        }
      u = p + 1;
    }
    return a && (r && l.push(-5), t && l.push(t), l.push(null)), l;
  }
}
const GS = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function YS(e) {
  return e.replace(GS, HS);
}
function HS(e, t, n) {
  if (t)
    return t;
  if (n.charCodeAt(0) === 35) {
    const i = n.charCodeAt(1), o = i === 120 || i === 88;
    return rm(n.slice(o ? 2 : 1), o ? 16 : 10);
  }
  return Cl(n) || e;
}
const hm = {}.hasOwnProperty;
function US(e, t, n) {
  return t && typeof t == "object" && (n = t, t = void 0), QS(n)(LS(BS(n).document().write(FS()(e, t, !0))));
}
function QS(e) {
  const t = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: o(Zr),
      autolinkProtocol: z,
      autolinkEmail: z,
      atxHeading: o(Hr),
      blockQuote: o(le),
      characterEscape: z,
      characterReference: z,
      codeFenced: o(Ee),
      codeFencedFenceInfo: s,
      codeFencedFenceMeta: s,
      codeIndented: o(Ee, s),
      codeText: o(Me, s),
      codeTextData: z,
      data: z,
      codeFlowValue: z,
      definition: o(Se),
      definitionDestinationString: s,
      definitionLabelString: s,
      definitionTitleString: s,
      emphasis: o(It),
      hardBreakEscape: o(Ur),
      hardBreakTrailing: o(Ur),
      htmlFlow: o(Ln, s),
      htmlFlowData: z,
      htmlText: o(Ln, s),
      htmlTextData: z,
      image: o(Qr),
      label: s,
      link: o(Zr),
      listItem: o(Yl),
      listItemValue: p,
      listOrdered: o(pn, u),
      listUnordered: o(pn),
      paragraph: o(So),
      reference: k,
      referenceString: s,
      resourceDestinationString: s,
      resourceTitleString: s,
      setextHeading: o(Hr),
      strong: o(No),
      thematicBreak: o(rg)
    },
    exit: {
      atxHeading: l(),
      atxHeadingSequence: N,
      autolink: l(),
      autolinkEmail: ee,
      autolinkProtocol: q,
      blockQuote: l(),
      characterEscapeValue: E,
      characterReferenceMarkerHexadecimal: K,
      characterReferenceMarkerNumeric: K,
      characterReferenceValue: W,
      characterReference: Z,
      codeFenced: l(x),
      codeFencedFence: g,
      codeFencedFenceInfo: h,
      codeFencedFenceMeta: m,
      codeFlowValue: E,
      codeIndented: l(b),
      codeText: l(j),
      codeTextData: E,
      data: E,
      definition: l(),
      definitionDestinationString: S,
      definitionLabelString: A,
      definitionTitleString: w,
      emphasis: l(),
      hardBreakEscape: l(T),
      hardBreakTrailing: l(T),
      htmlFlow: l(Y),
      htmlFlowData: E,
      htmlText: l(R),
      htmlTextData: E,
      image: l(F),
      label: L,
      labelText: B,
      lineEnding: P,
      link: l(I),
      listItem: l(),
      listOrdered: l(),
      listUnordered: l(),
      paragraph: l(),
      referenceString: X,
      resourceDestinationString: y,
      resourceTitleString: M,
      resource: U,
      setextHeading: l(D),
      setextHeadingLineSequence: O,
      setextHeadingText: C,
      strong: l(),
      thematicBreak: l()
    }
  };
  pm(t, (e || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(G) {
    let J = {
      type: "root",
      children: []
    };
    const oe = {
      stack: [J],
      tokenStack: [],
      config: t,
      enter: a,
      exit: c,
      buffer: s,
      resume: d,
      data: n
    }, de = [];
    let ye = -1;
    for (; ++ye < G.length; )
      if (G[ye][1].type === "listOrdered" || G[ye][1].type === "listUnordered")
        if (G[ye][0] === "enter")
          de.push(ye);
        else {
          const Ke = de.pop();
          ye = i(G, Ke, ye);
        }
    for (ye = -1; ++ye < G.length; ) {
      const Ke = t[G[ye][0]];
      hm.call(Ke, G[ye][1].type) && Ke[G[ye][1].type].call(Object.assign({
        sliceSerialize: G[ye][2].sliceSerialize
      }, oe), G[ye][1]);
    }
    if (oe.tokenStack.length > 0) {
      const Ke = oe.tokenStack[oe.tokenStack.length - 1];
      (Ke[1] || Tu).call(oe, void 0, Ke[0]);
    }
    for (J.position = {
      start: Ot(G.length > 0 ? G[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: Ot(G.length > 0 ? G[G.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, ye = -1; ++ye < t.transforms.length; )
      J = t.transforms[ye](J) || J;
    return J;
  }
  function i(G, J, oe) {
    let de = J - 1, ye = -1, Ke = !1, qt, bt, Fn, Gn;
    for (; ++de <= oe; ) {
      const Le = G[de];
      switch (Le[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          Le[0] === "enter" ? ye++ : ye--, Gn = void 0;
          break;
        }
        case "lineEndingBlank": {
          Le[0] === "enter" && (qt && !Gn && !ye && !Fn && (Fn = de), Gn = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Gn = void 0;
      }
      if (!ye && Le[0] === "enter" && Le[1].type === "listItemPrefix" || ye === -1 && Le[0] === "exit" && (Le[1].type === "listUnordered" || Le[1].type === "listOrdered")) {
        if (qt) {
          let mn = de;
          for (bt = void 0; mn--; ) {
            const yt = G[mn];
            if (yt[1].type === "lineEnding" || yt[1].type === "lineEndingBlank") {
              if (yt[0] === "exit") continue;
              bt && (G[bt][1].type = "lineEndingBlank", Ke = !0), yt[1].type = "lineEnding", bt = mn;
            } else if (!(yt[1].type === "linePrefix" || yt[1].type === "blockQuotePrefix" || yt[1].type === "blockQuotePrefixWhitespace" || yt[1].type === "blockQuoteMarker" || yt[1].type === "listItemIndent")) break;
          }
          Fn && (!bt || Fn < bt) && (qt._spread = !0), qt.end = Object.assign({}, bt ? G[bt][1].start : Le[1].end), G.splice(bt || de, 0, ["exit", qt, Le[2]]), de++, oe++;
        }
        if (Le[1].type === "listItemPrefix") {
          const mn = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, Le[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          qt = mn, G.splice(de, 0, ["enter", mn, Le[2]]), de++, oe++, Fn = void 0, Gn = !0;
        }
      }
    }
    return G[J][1]._spread = Ke, oe;
  }
  function o(G, J) {
    return oe;
    function oe(de) {
      a.call(this, G(de), de), J && J.call(this, de);
    }
  }
  function s() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(G, J, oe) {
    this.stack[this.stack.length - 1].children.push(G), this.stack.push(G), this.tokenStack.push([J, oe || void 0]), G.position = {
      start: Ot(J.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function l(G) {
    return J;
    function J(oe) {
      G && G.call(this, oe), c.call(this, oe);
    }
  }
  function c(G, J) {
    const oe = this.stack.pop(), de = this.tokenStack.pop();
    if (de)
      de[0].type !== G.type && (J ? J.call(this, G, de[0]) : (de[1] || Tu).call(this, G, de[0]));
    else throw new Error("Cannot close `" + G.type + "` (" + sr({
      start: G.start,
      end: G.end
    }) + "): it’s not open");
    oe.position.end = Ot(G.end);
  }
  function d() {
    return El(this.stack.pop());
  }
  function u() {
    this.data.expectingFirstListItemValue = !0;
  }
  function p(G) {
    if (this.data.expectingFirstListItemValue) {
      const J = this.stack[this.stack.length - 2];
      J.start = Number.parseInt(this.sliceSerialize(G), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function h() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.lang = G;
  }
  function m() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.meta = G;
  }
  function g() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function x() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.value = G.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function b() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.value = G.replace(/(\r?\n|\r)$/g, "");
  }
  function A(G) {
    const J = this.resume(), oe = this.stack[this.stack.length - 1];
    oe.label = J, oe.identifier = et(this.sliceSerialize(G)).toLowerCase();
  }
  function w() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.title = G;
  }
  function S() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.url = G;
  }
  function N(G) {
    const J = this.stack[this.stack.length - 1];
    if (!J.depth) {
      const oe = this.sliceSerialize(G).length;
      J.depth = oe;
    }
  }
  function C() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function O(G) {
    const J = this.stack[this.stack.length - 1];
    J.depth = this.sliceSerialize(G).codePointAt(0) === 61 ? 1 : 2;
  }
  function D() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function z(G) {
    const oe = this.stack[this.stack.length - 1].children;
    let de = oe[oe.length - 1];
    (!de || de.type !== "text") && (de = ng(), de.position = {
      start: Ot(G.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, oe.push(de)), this.stack.push(de);
  }
  function E(G) {
    const J = this.stack.pop();
    J.value += this.sliceSerialize(G), J.position.end = Ot(G.end);
  }
  function P(G) {
    const J = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const oe = J.children[J.children.length - 1];
      oe.position.end = Ot(G.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(J.type) && (z.call(this, G), E.call(this, G));
  }
  function T() {
    this.data.atHardBreak = !0;
  }
  function Y() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.value = G;
  }
  function R() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.value = G;
  }
  function j() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.value = G;
  }
  function I() {
    const G = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const J = this.data.referenceType || "shortcut";
      G.type += "Reference", G.referenceType = J, delete G.url, delete G.title;
    } else
      delete G.identifier, delete G.label;
    this.data.referenceType = void 0;
  }
  function F() {
    const G = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const J = this.data.referenceType || "shortcut";
      G.type += "Reference", G.referenceType = J, delete G.url, delete G.title;
    } else
      delete G.identifier, delete G.label;
    this.data.referenceType = void 0;
  }
  function B(G) {
    const J = this.sliceSerialize(G), oe = this.stack[this.stack.length - 2];
    oe.label = YS(J), oe.identifier = et(J).toLowerCase();
  }
  function L() {
    const G = this.stack[this.stack.length - 1], J = this.resume(), oe = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, oe.type === "link") {
      const de = G.children;
      oe.children = de;
    } else
      oe.alt = J;
  }
  function y() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.url = G;
  }
  function M() {
    const G = this.resume(), J = this.stack[this.stack.length - 1];
    J.title = G;
  }
  function U() {
    this.data.inReference = void 0;
  }
  function k() {
    this.data.referenceType = "collapsed";
  }
  function X(G) {
    const J = this.resume(), oe = this.stack[this.stack.length - 1];
    oe.label = J, oe.identifier = et(this.sliceSerialize(G)).toLowerCase(), this.data.referenceType = "full";
  }
  function K(G) {
    this.data.characterReferenceType = G.type;
  }
  function W(G) {
    const J = this.sliceSerialize(G), oe = this.data.characterReferenceType;
    let de;
    oe ? (de = rm(J, oe === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : de = Cl(J);
    const ye = this.stack[this.stack.length - 1];
    ye.value += de;
  }
  function Z(G) {
    const J = this.stack.pop();
    J.position.end = Ot(G.end);
  }
  function q(G) {
    E.call(this, G);
    const J = this.stack[this.stack.length - 1];
    J.url = this.sliceSerialize(G);
  }
  function ee(G) {
    E.call(this, G);
    const J = this.stack[this.stack.length - 1];
    J.url = "mailto:" + this.sliceSerialize(G);
  }
  function le() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function Ee() {
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
  function Se() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function It() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function Hr() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function Ur() {
    return {
      type: "break"
    };
  }
  function Ln() {
    return {
      type: "html",
      value: ""
    };
  }
  function Qr() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Zr() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function pn(G) {
    return {
      type: "list",
      ordered: G.type === "listOrdered",
      start: null,
      spread: G._spread,
      children: []
    };
  }
  function Yl(G) {
    return {
      type: "listItem",
      spread: G._spread,
      checked: null,
      children: []
    };
  }
  function So() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function No() {
    return {
      type: "strong",
      children: []
    };
  }
  function ng() {
    return {
      type: "text",
      value: ""
    };
  }
  function rg() {
    return {
      type: "thematicBreak"
    };
  }
}
function Ot(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function pm(e, t) {
  let n = -1;
  for (; ++n < t.length; ) {
    const r = t[n];
    Array.isArray(r) ? pm(e, r) : ZS(e, r);
  }
}
function ZS(e, t) {
  let n;
  for (n in t)
    if (hm.call(t, n))
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
function Tu(e, t) {
  throw e ? new Error("Cannot close `" + e.type + "` (" + sr({
    start: e.start,
    end: e.end
  }) + "): a different token (`" + t.type + "`, " + sr({
    start: t.start,
    end: t.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + sr({
    start: t.start,
    end: t.end
  }) + ") is still open");
}
function VS(e) {
  const t = this;
  t.parser = n;
  function n(r) {
    return US(r, {
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
function WS(e, t) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: e.wrap(e.all(t), !0)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function JS(e, t) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return e.patch(t, n), [e.applyData(t, n), { type: "text", value: `
` }];
}
function qS(e, t) {
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
function KS(e, t) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function XS(e, t) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function _S(e, t) {
  const n = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", r = String(t.identifier).toUpperCase(), i = Bn(r.toLowerCase()), o = e.footnoteOrder.indexOf(r);
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
function $S(e, t) {
  const n = {
    type: "element",
    tagName: "h" + t.depth,
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function eN(e, t) {
  if (e.options.allowDangerousHtml) {
    const n = { type: "raw", value: t.value };
    return e.patch(t, n), e.applyData(t, n);
  }
}
function mm(e, t) {
  const n = t.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference")
    return [{ type: "text", value: "![" + t.alt + r }];
  const i = e.all(t), o = i[0];
  o && o.type === "text" ? o.value = "[" + o.value : i.unshift({ type: "text", value: "[" });
  const s = i[i.length - 1];
  return s && s.type === "text" ? s.value += r : i.push({ type: "text", value: r }), i;
}
function tN(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return mm(e, t);
  const i = { src: Bn(r.url || ""), alt: t.alt };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = { type: "element", tagName: "img", properties: i, children: [] };
  return e.patch(t, o), e.applyData(t, o);
}
function nN(e, t) {
  const n = { src: Bn(t.url) };
  t.alt !== null && t.alt !== void 0 && (n.alt = t.alt), t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return e.patch(t, r), e.applyData(t, r);
}
function rN(e, t) {
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
function iN(e, t) {
  const n = String(t.identifier).toUpperCase(), r = e.definitionById.get(n);
  if (!r)
    return mm(e, t);
  const i = { href: Bn(r.url || "") };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = {
    type: "element",
    tagName: "a",
    properties: i,
    children: e.all(t)
  };
  return e.patch(t, o), e.applyData(t, o);
}
function oN(e, t) {
  const n = { href: Bn(t.url) };
  t.title !== null && t.title !== void 0 && (n.title = t.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function sN(e, t, n) {
  const r = e.all(t), i = n ? aN(n) : gm(t), o = {}, s = [];
  if (typeof t.checked == "boolean") {
    const d = r[0];
    let u;
    d && d.type === "element" && d.tagName === "p" ? u = d : (u = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(u)), u.children.length > 0 && u.children.unshift({ type: "text", value: " " }), u.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: t.checked, disabled: !0 },
      children: []
    }), o.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < r.length; ) {
    const d = r[a];
    (i || a !== 0 || d.type !== "element" || d.tagName !== "p") && s.push({ type: "text", value: `
` }), d.type === "element" && d.tagName === "p" && !i ? s.push(...d.children) : s.push(d);
  }
  const l = r[r.length - 1];
  l && (i || l.type !== "element" || l.tagName !== "p") && s.push({ type: "text", value: `
` });
  const c = { type: "element", tagName: "li", properties: o, children: s };
  return e.patch(t, c), e.applyData(t, c);
}
function aN(e) {
  let t = !1;
  if (e.type === "list") {
    t = e.spread || !1;
    const n = e.children;
    let r = -1;
    for (; !t && ++r < n.length; )
      t = gm(n[r]);
  }
  return t;
}
function gm(e) {
  const t = e.spread;
  return t ?? e.children.length > 1;
}
function lN(e, t) {
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
function cN(e, t) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function uN(e, t) {
  const n = { type: "root", children: e.wrap(e.all(t)) };
  return e.patch(t, n), e.applyData(t, n);
}
function dN(e, t) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function fN(e, t) {
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
    }, a = vl(t.children[1]), l = qp(t.children[t.children.length - 1]);
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
function hN(e, t, n) {
  const r = n ? n.children : void 0, o = (r ? r.indexOf(t) : 1) === 0 ? "th" : "td", s = n && n.type === "table" ? n.align : void 0, a = s ? s.length : t.children.length;
  let l = -1;
  const c = [];
  for (; ++l < a; ) {
    const u = t.children[l], p = {}, h = s ? s[l] : void 0;
    h && (p.align = h);
    let m = { type: "element", tagName: o, properties: p, children: [] };
    u && (m.children = e.all(u), e.patch(u, m), m = e.applyData(u, m)), c.push(m);
  }
  const d = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: e.wrap(c, !0)
  };
  return e.patch(t, d), e.applyData(t, d);
}
function pN(e, t) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
const zu = 9, Bu = 32;
function mN(e) {
  const t = String(e), n = /\r?\n|\r/g;
  let r = n.exec(t), i = 0;
  const o = [];
  for (; r; )
    o.push(
      Lu(t.slice(i, r.index), i > 0, !0),
      r[0]
    ), i = r.index + r[0].length, r = n.exec(t);
  return o.push(Lu(t.slice(i), i > 0, !1)), o.join("");
}
function Lu(e, t, n) {
  let r = 0, i = e.length;
  if (t) {
    let o = e.codePointAt(r);
    for (; o === zu || o === Bu; )
      r++, o = e.codePointAt(r);
  }
  if (n) {
    let o = e.codePointAt(i - 1);
    for (; o === zu || o === Bu; )
      i--, o = e.codePointAt(i - 1);
  }
  return i > r ? e.slice(r, i) : "";
}
function gN(e, t) {
  const n = { type: "text", value: mN(String(t.value)) };
  return e.patch(t, n), e.applyData(t, n);
}
function xN(e, t) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return e.patch(t, n), e.applyData(t, n);
}
const bN = {
  blockquote: WS,
  break: JS,
  code: qS,
  delete: KS,
  emphasis: XS,
  footnoteReference: _S,
  heading: $S,
  html: eN,
  imageReference: tN,
  image: nN,
  inlineCode: rN,
  linkReference: iN,
  link: oN,
  listItem: sN,
  list: lN,
  paragraph: cN,
  // @ts-expect-error: root is different, but hard to type.
  root: uN,
  strong: dN,
  table: fN,
  tableCell: pN,
  tableRow: hN,
  text: gN,
  thematicBreak: xN,
  toml: si,
  yaml: si,
  definition: si,
  footnoteDefinition: si
};
function si() {
}
const xm = -1, ko = 0, lr = 1, Fi = 2, Nl = 3, jl = 4, Ml = 5, Il = 6, bm = 7, ym = 8, yN = typeof self == "object" ? self : globalThis, Fu = (e, t) => {
  switch (e) {
    case "Function":
    case "SharedWorker":
    case "Worker":
    case "eval":
    case "setInterval":
    case "setTimeout":
      throw new TypeError("unable to deserialize " + e);
  }
  return new yN[e](t);
}, vN = (e, t) => {
  const n = (i, o) => (e.set(o, i), i), r = (i) => {
    if (e.has(i))
      return e.get(i);
    const [o, s] = t[i];
    switch (o) {
      case ko:
      case xm:
        return n(s, i);
      case lr: {
        const a = n([], i);
        for (const l of s)
          a.push(r(l));
        return a;
      }
      case Fi: {
        const a = n({}, i);
        for (const [l, c] of s)
          a[r(l)] = r(c);
        return a;
      }
      case Nl:
        return n(new Date(s), i);
      case jl: {
        const { source: a, flags: l } = s;
        return n(new RegExp(a, l), i);
      }
      case Ml: {
        const a = n(/* @__PURE__ */ new Map(), i);
        for (const [l, c] of s)
          a.set(r(l), r(c));
        return a;
      }
      case Il: {
        const a = n(/* @__PURE__ */ new Set(), i);
        for (const l of s)
          a.add(r(l));
        return a;
      }
      case bm: {
        const { name: a, message: l } = s;
        return n(Fu(a, l), i);
      }
      case ym:
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
    return n(Fu(o, s), i);
  };
  return r;
}, Gu = (e) => vN(/* @__PURE__ */ new Map(), e)(0), wn = "", { toString: wN } = {}, { keys: AN } = Object, Xn = (e) => {
  const t = typeof e;
  if (t !== "object" || !e)
    return [ko, t];
  const n = wN.call(e).slice(8, -1);
  switch (n) {
    case "Array":
      return [lr, wn];
    case "Object":
      return [Fi, wn];
    case "Date":
      return [Nl, wn];
    case "RegExp":
      return [jl, wn];
    case "Map":
      return [Ml, wn];
    case "Set":
      return [Il, wn];
    case "DataView":
      return [lr, n];
  }
  return n.includes("Array") ? [lr, n] : n.includes("Error") ? [bm, n] : [Fi, n];
}, ai = ([e, t]) => e === ko && (t === "function" || t === "symbol"), kN = (e, t, n, r) => {
  const i = (s, a) => {
    const l = r.push(s) - 1;
    return n.set(a, l), l;
  }, o = (s) => {
    if (n.has(s))
      return n.get(s);
    let [a, l] = Xn(s);
    switch (a) {
      case ko: {
        let d = s;
        switch (l) {
          case "bigint":
            a = ym, d = s.toString();
            break;
          case "function":
          case "symbol":
            if (e)
              throw new TypeError("unable to serialize " + l);
            d = null;
            break;
          case "undefined":
            return i([xm], s);
        }
        return i([a, d], s);
      }
      case lr: {
        if (l) {
          let p = s;
          return l === "DataView" ? p = new Uint8Array(s.buffer) : l === "ArrayBuffer" && (p = new Uint8Array(s)), i([l, [...p]], s);
        }
        const d = [], u = i([a, d], s);
        for (const p of s)
          d.push(o(p));
        return u;
      }
      case Fi: {
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
        const d = [], u = i([a, d], s);
        for (const p of AN(s))
          (e || !ai(Xn(s[p]))) && d.push([o(p), o(s[p])]);
        return u;
      }
      case Nl:
        return i([a, s.toISOString()], s);
      case jl: {
        const { source: d, flags: u } = s;
        return i([a, { source: d, flags: u }], s);
      }
      case Ml: {
        const d = [], u = i([a, d], s);
        for (const [p, h] of s)
          (e || !(ai(Xn(p)) || ai(Xn(h)))) && d.push([o(p), o(h)]);
        return u;
      }
      case Il: {
        const d = [], u = i([a, d], s);
        for (const p of s)
          (e || !ai(Xn(p))) && d.push(o(p));
        return u;
      }
    }
    const { message: c } = s;
    return i([a, { name: l, message: c }], s);
  };
  return o;
}, Yu = (e, { json: t, lossy: n } = {}) => {
  const r = [];
  return kN(!(t || n), !!t, /* @__PURE__ */ new Map(), r)(e), r;
}, Gi = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (e, t) => t && ("json" in t || "lossy" in t) ? Gu(Yu(e, t)) : structuredClone(e)
) : (e, t) => Gu(Yu(e, t));
function EN(e, t) {
  const n = [{ type: "text", value: "↩" }];
  return t > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(t) }]
  }), n;
}
function CN(e, t) {
  return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function SN(e) {
  const t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-", n = e.options.footnoteBackContent || EN, r = e.options.footnoteBackLabel || CN, i = e.options.footnoteLabel || "Footnotes", o = e.options.footnoteLabelTagName || "h2", s = e.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let l = -1;
  for (; ++l < e.footnoteOrder.length; ) {
    const c = e.footnoteById.get(
      e.footnoteOrder[l]
    );
    if (!c)
      continue;
    const d = e.all(c), u = String(c.identifier).toUpperCase(), p = Bn(u.toLowerCase());
    let h = 0;
    const m = [], g = e.footnoteCounts.get(u);
    for (; g !== void 0 && ++h <= g; ) {
      m.length > 0 && m.push({ type: "text", value: " " });
      let A = typeof n == "string" ? n : n(l, h);
      typeof A == "string" && (A = { type: "text", value: A }), m.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + t + "fnref-" + p + (h > 1 ? "-" + h : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(l, h),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(A) ? A : [A]
      });
    }
    const x = d[d.length - 1];
    if (x && x.type === "element" && x.tagName === "p") {
      const A = x.children[x.children.length - 1];
      A && A.type === "text" ? A.value += " " : x.children.push({ type: "text", value: " " }), x.children.push(...m);
    } else
      d.push(...m);
    const b = {
      type: "element",
      tagName: "li",
      properties: { id: t + "fn-" + p },
      children: e.wrap(d, !0)
    };
    e.patch(c, b), a.push(b);
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
            ...Gi(s),
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
const Eo = (
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
      return IN;
    if (typeof e == "function")
      return Co(e);
    if (typeof e == "object")
      return Array.isArray(e) ? NN(e) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        jN(
          /** @type {Props} */
          e
        )
      );
    if (typeof e == "string")
      return MN(e);
    throw new Error("Expected function, string, or object as test");
  })
);
function NN(e) {
  const t = [];
  let n = -1;
  for (; ++n < e.length; )
    t[n] = Eo(e[n]);
  return Co(r);
  function r(...i) {
    let o = -1;
    for (; ++o < t.length; )
      if (t[o].apply(this, i)) return !0;
    return !1;
  }
}
function jN(e) {
  const t = (
    /** @type {Record<string, unknown>} */
    e
  );
  return Co(n);
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
function MN(e) {
  return Co(t);
  function t(n) {
    return n && n.type === e;
  }
}
function Co(e) {
  return t;
  function t(n, r, i) {
    return !!(PN(n) && e.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      i || void 0
    ));
  }
}
function IN() {
  return !0;
}
function PN(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
const vm = [], RN = !0, Xs = !1, DN = "skip";
function wm(e, t, n, r) {
  let i;
  typeof t == "function" && typeof n != "function" ? (r = n, n = t) : i = t;
  const o = Eo(i), s = r ? -1 : 1;
  a(e, void 0, [])();
  function a(l, c, d) {
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
      Object.defineProperty(p, "name", {
        value: "node (" + (l.type + (h ? "<" + h + ">" : "")) + ")"
      });
    }
    return p;
    function p() {
      let h = vm, m, g, x;
      if ((!t || o(l, c, d[d.length - 1] || void 0)) && (h = ON(n(l, d)), h[0] === Xs))
        return h;
      if ("children" in l && l.children) {
        const b = (
          /** @type {UnistParent} */
          l
        );
        if (b.children && h[0] !== DN)
          for (g = (r ? b.children.length : -1) + s, x = d.concat(b); g > -1 && g < b.children.length; ) {
            const A = b.children[g];
            if (m = a(A, g, x)(), m[0] === Xs)
              return m;
            g = typeof m[1] == "number" ? m[1] : g + s;
          }
      }
      return h;
    }
  }
}
function ON(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [RN, e] : e == null ? vm : [e];
}
function Pl(e, t, n, r) {
  let i, o, s;
  typeof t == "function" && typeof n != "function" ? (o = void 0, s = t, i = n) : (o = t, s = n, i = r), wm(e, o, a, i);
  function a(l, c) {
    const d = c[c.length - 1], u = d ? d.children.indexOf(l) : void 0;
    return s(l, u, d);
  }
}
const _s = {}.hasOwnProperty, TN = {};
function zN(e, t) {
  const n = t || TN, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = { ...bN, ...n.handlers }, a = {
    all: c,
    applyData: LN,
    definitionById: r,
    footnoteById: i,
    footnoteCounts: o,
    footnoteOrder: [],
    handlers: s,
    one: l,
    options: n,
    patch: BN,
    wrap: GN
  };
  return Pl(e, function(d) {
    if (d.type === "definition" || d.type === "footnoteDefinition") {
      const u = d.type === "definition" ? r : i, p = String(d.identifier).toUpperCase();
      u.has(p) || u.set(p, d);
    }
  }), a;
  function l(d, u) {
    const p = d.type, h = a.handlers[p];
    if (_s.call(a.handlers, p) && h)
      return h(a, d, u);
    if (a.options.passThrough && a.options.passThrough.includes(p)) {
      if ("children" in d) {
        const { children: g, ...x } = d, b = Gi(x);
        return b.children = a.all(d), b;
      }
      return Gi(d);
    }
    return (a.options.unknownHandler || FN)(a, d, u);
  }
  function c(d) {
    const u = [];
    if ("children" in d) {
      const p = d.children;
      let h = -1;
      for (; ++h < p.length; ) {
        const m = a.one(p[h], d);
        if (m) {
          if (h && p[h - 1].type === "break" && (!Array.isArray(m) && m.type === "text" && (m.value = Hu(m.value)), !Array.isArray(m) && m.type === "element")) {
            const g = m.children[0];
            g && g.type === "text" && (g.value = Hu(g.value));
          }
          Array.isArray(m) ? u.push(...m) : u.push(m);
        }
      }
    }
    return u;
  }
}
function BN(e, t) {
  e.position && (t.position = EE(e));
}
function LN(e, t) {
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
    n.type === "element" && o && Object.assign(n.properties, Gi(o)), "children" in n && n.children && i !== null && i !== void 0 && (n.children = i);
  }
  return n;
}
function FN(e, t) {
  const n = t.data || {}, r = "value" in t && !(_s.call(n, "hProperties") || _s.call(n, "hChildren")) ? { type: "text", value: t.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, r), e.applyData(t, r);
}
function GN(e, t) {
  const n = [];
  let r = -1;
  for (t && n.push({ type: "text", value: `
` }); ++r < e.length; )
    r && n.push({ type: "text", value: `
` }), n.push(e[r]);
  return t && e.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function Hu(e) {
  let t = 0, n = e.charCodeAt(t);
  for (; n === 9 || n === 32; )
    t++, n = e.charCodeAt(t);
  return e.slice(t);
}
function Uu(e, t) {
  const n = zN(e, t), r = n.one(e, void 0), i = SN(n), o = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return i && o.children.push({ type: "text", value: `
` }, i), o;
}
function YN(e, t) {
  return e && "run" in e ? async function(n, r) {
    const i = (
      /** @type {HastRoot} */
      Uu(n, { file: r, ...t })
    );
    await e.run(i, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      Uu(n, { file: r, ...e || t })
    );
  };
}
function Qu(e) {
  if (e)
    throw e;
}
var os, Zu;
function HN() {
  if (Zu) return os;
  Zu = 1;
  var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = function(c) {
    return typeof Array.isArray == "function" ? Array.isArray(c) : t.call(c) === "[object Array]";
  }, o = function(c) {
    if (!c || t.call(c) !== "[object Object]")
      return !1;
    var d = e.call(c, "constructor"), u = c.constructor && c.constructor.prototype && e.call(c.constructor.prototype, "isPrototypeOf");
    if (c.constructor && !d && !u)
      return !1;
    var p;
    for (p in c)
      ;
    return typeof p > "u" || e.call(c, p);
  }, s = function(c, d) {
    n && d.name === "__proto__" ? n(c, d.name, {
      enumerable: !0,
      configurable: !0,
      value: d.newValue,
      writable: !0
    }) : c[d.name] = d.newValue;
  }, a = function(c, d) {
    if (d === "__proto__")
      if (e.call(c, d)) {
        if (r)
          return r(c, d).value;
      } else return;
    return c[d];
  };
  return os = function l() {
    var c, d, u, p, h, m, g = arguments[0], x = 1, b = arguments.length, A = !1;
    for (typeof g == "boolean" && (A = g, g = arguments[1] || {}, x = 2), (g == null || typeof g != "object" && typeof g != "function") && (g = {}); x < b; ++x)
      if (c = arguments[x], c != null)
        for (d in c)
          u = a(g, d), p = a(c, d), g !== p && (A && p && (o(p) || (h = i(p))) ? (h ? (h = !1, m = u && i(u) ? u : []) : m = u && o(u) ? u : {}, s(g, { name: d, newValue: l(A, m, p) })) : typeof p < "u" && s(g, { name: d, newValue: p }));
    return g;
  }, os;
}
var UN = HN();
const ss = /* @__PURE__ */ aa(UN);
function $s(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function QN() {
  const e = [], t = { run: n, use: r };
  return t;
  function n(...i) {
    let o = -1;
    const s = i.pop();
    if (typeof s != "function")
      throw new TypeError("Expected function as last argument, not " + s);
    a(null, ...i);
    function a(l, ...c) {
      const d = e[++o];
      let u = -1;
      if (l) {
        s(l);
        return;
      }
      for (; ++u < i.length; )
        (c[u] === null || c[u] === void 0) && (c[u] = i[u]);
      i = c, d ? ZN(d, a)(...c) : s(null, ...c);
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
function ZN(e, t) {
  let n;
  return r;
  function r(...s) {
    const a = e.length > s.length;
    let l;
    a && s.push(i);
    try {
      l = e.apply(this, s);
    } catch (c) {
      const d = (
        /** @type {Error} */
        c
      );
      if (a && n)
        throw d;
      return i(d);
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
const ot = { basename: VN, dirname: WN, extname: JN, join: qN, sep: "/" };
function VN(e, t) {
  if (t !== void 0 && typeof t != "string")
    throw new TypeError('"ext" argument must be a string');
  Yr(e);
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
function WN(e) {
  if (Yr(e), e.length === 0)
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
function JN(e) {
  Yr(e);
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
function qN(...e) {
  let t = -1, n;
  for (; ++t < e.length; )
    Yr(e[t]), e[t] && (n = n === void 0 ? e[t] : n + "/" + e[t]);
  return n === void 0 ? "." : KN(n);
}
function KN(e) {
  Yr(e);
  const t = e.codePointAt(0) === 47;
  let n = XN(e, !t);
  return n.length === 0 && !t && (n = "."), n.length > 0 && e.codePointAt(e.length - 1) === 47 && (n += "/"), t ? "/" + n : n;
}
function XN(e, t) {
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
function Yr(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const _N = { cwd: $N };
function $N() {
  return "/";
}
function ea(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && // @ts-expect-error: indexing is fine.
  e.auth === void 0);
}
function ej(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!ea(e)) {
    const t = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    const t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return tj(e);
}
function tj(e) {
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
const as = (
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
class Am {
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
    t ? ea(t) ? n = { path: t } : typeof t == "string" || nj(t) ? n = { value: t } : n = t : n = {}, this.cwd = "cwd" in n ? "" : _N.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < as.length; ) {
      const o = as[r];
      o in n && n[o] !== void 0 && n[o] !== null && (this[o] = o === "history" ? [...n[o]] : n[o]);
    }
    let i;
    for (i in n)
      as.includes(i) || (this[i] = n[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? ot.basename(this.path) : void 0;
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
    cs(t, "basename"), ls(t, "basename"), this.path = ot.join(this.dirname || "", t);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? ot.dirname(this.path) : void 0;
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
    Vu(this.basename, "dirname"), this.path = ot.join(t || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? ot.extname(this.path) : void 0;
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
    if (ls(t, "extname"), Vu(this.dirname, "extname"), t) {
      if (t.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (t.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = ot.join(this.dirname, this.stem + (t || ""));
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
    ea(t) && (t = ej(t)), cs(t, "path"), this.path !== t && this.history.push(t);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? ot.basename(this.path, this.extname) : void 0;
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
    cs(t, "stem"), ls(t, "stem"), this.path = ot.join(this.dirname || "", t + (this.extname || ""));
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
    const i = new Re(
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
function ls(e, t) {
  if (e && e.includes(ot.sep))
    throw new Error(
      "`" + t + "` cannot be a path: did not expect `" + ot.sep + "`"
    );
}
function cs(e, t) {
  if (!e)
    throw new Error("`" + t + "` cannot be empty");
}
function Vu(e, t) {
  if (!e)
    throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function nj(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const rj = (
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
), ij = {}.hasOwnProperty;
class Rl extends rj {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = QN();
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
      new Rl()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      t.use(...r);
    }
    return t.data(ss(!0, {}, this.namespace)), t;
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
    return typeof t == "string" ? arguments.length === 2 ? (fs("data", this.frozen), this.namespace[t] = n, this) : ij.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (fs("data", this.frozen), this.namespace = t, this) : this.namespace;
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
    const n = li(t), r = this.parser || this.Parser;
    return us("parse", r), r(String(n), n);
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
    return this.freeze(), us("process", this.parser || this.Parser), ds("process", this.compiler || this.Compiler), n ? i(void 0, n) : new Promise(i);
    function i(o, s) {
      const a = li(t), l = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(a)
      );
      r.run(l, a, function(d, u, p) {
        if (d || !u || !p)
          return c(d);
        const h = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          u
        ), m = r.stringify(h, p);
        aj(m) ? p.value = m : p.result = m, c(
          d,
          /** @type {VFileWithOutput<CompileResult>} */
          p
        );
      });
      function c(d, u) {
        d || !u ? s(d) : o ? o(u) : n(void 0, u);
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
    return this.freeze(), us("processSync", this.parser || this.Parser), ds("processSync", this.compiler || this.Compiler), this.process(t, i), Ju("processSync", "process", n), r;
    function i(o, s) {
      n = !0, Qu(o), r = s;
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
    Wu(t), this.freeze();
    const i = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? o(void 0, r) : new Promise(o);
    function o(s, a) {
      const l = li(n);
      i.run(t, l, c);
      function c(d, u, p) {
        const h = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          u || t
        );
        d ? a(d) : s ? s(h) : r(void 0, h, p);
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
    return this.run(t, n, o), Ju("runSync", "run", r), i;
    function o(s, a) {
      Qu(s), i = a, r = !0;
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
    const r = li(n), i = this.compiler || this.Compiler;
    return ds("stringify", i), Wu(t), i(t, r);
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
    if (fs("use", this.frozen), t != null) if (typeof t == "function")
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
          const [d, ...u] = (
            /** @type {PluginTuple<Array<unknown>>} */
            c
          );
          l(d, u);
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
      a(c.plugins), c.settings && (i.settings = ss(!0, i.settings, c.settings));
    }
    function a(c) {
      let d = -1;
      if (c != null) if (Array.isArray(c))
        for (; ++d < c.length; ) {
          const u = c[d];
          o(u);
        }
      else
        throw new TypeError("Expected a list of plugins, not `" + c + "`");
    }
    function l(c, d) {
      let u = -1, p = -1;
      for (; ++u < r.length; )
        if (r[u][0] === c) {
          p = u;
          break;
        }
      if (p === -1)
        r.push([c, ...d]);
      else if (d.length > 0) {
        let [h, ...m] = d;
        const g = r[p][1];
        $s(g) && $s(h) && (h = ss(!0, g, h)), r[p] = [c, h, ...m];
      }
    }
  }
}
const oj = new Rl().freeze();
function us(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `parser`");
}
function ds(e, t) {
  if (typeof t != "function")
    throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function fs(e, t) {
  if (t)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function Wu(e) {
  if (!$s(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function Ju(e, t, n) {
  if (!n)
    throw new Error(
      "`" + e + "` finished async. Use `" + t + "` instead"
    );
}
function li(e) {
  return sj(e) ? e : new Am(e);
}
function sj(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function aj(e) {
  return typeof e == "string" || lj(e);
}
function lj(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
const cj = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", qu = [], Ku = { allowDangerousHtml: !0 }, uj = /^(https?|ircs?|mailto|xmpp)$/i, dj = [
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
function fj(e) {
  const t = hj(e), n = pj(e);
  return mj(t.runSync(t.parse(n), n), e);
}
function hj(e) {
  const t = e.rehypePlugins || qu, n = e.remarkPlugins || qu, r = e.remarkRehypeOptions ? { ...e.remarkRehypeOptions, ...Ku } : Ku;
  return oj().use(VS).use(n).use(YN, r).use(t);
}
function pj(e) {
  const t = e.children || "", n = new Am();
  return typeof t == "string" && (n.value = t), n;
}
function mj(e, t) {
  const n = t.allowedElements, r = t.allowElement, i = t.components, o = t.disallowedElements, s = t.skipHtml, a = t.unwrapDisallowed, l = t.urlTransform || gj;
  for (const d of dj)
    Object.hasOwn(t, d.from) && ("" + d.from + (d.to ? "use `" + d.to + "` instead" : "remove it") + cj + d.id, void 0);
  return Pl(e, c), ME(e, {
    Fragment: f.Fragment,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: f.jsx,
    jsxs: f.jsxs,
    passKeys: !0,
    passNode: !0
  });
  function c(d, u, p) {
    if (d.type === "raw" && p && typeof u == "number")
      return s ? p.children.splice(u, 1) : p.children[u] = { type: "text", value: d.value }, u;
    if (d.type === "element") {
      let h;
      for (h in ns)
        if (Object.hasOwn(ns, h) && Object.hasOwn(d.properties, h)) {
          const m = d.properties[h], g = ns[h];
          (g === null || g.includes(d.tagName)) && (d.properties[h] = l(String(m || ""), h, d));
        }
    }
    if (d.type === "element") {
      let h = n ? !n.includes(d.tagName) : o ? o.includes(d.tagName) : !1;
      if (!h && r && typeof u == "number" && (h = !r(d, u, p)), h && p && typeof u == "number")
        return a && d.children ? p.children.splice(u, 1, ...d.children) : p.children.splice(u, 1), u;
    }
  }
}
function gj(e) {
  const t = e.indexOf(":"), n = e.indexOf("?"), r = e.indexOf("#"), i = e.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    t === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && t > i || n !== -1 && t > n || r !== -1 && t > r || // It is a protocol, it should be allowed.
    uj.test(e.slice(0, t)) ? e : ""
  );
}
function Xu(e, t) {
  const n = String(e);
  if (typeof t != "string")
    throw new TypeError("Expected character");
  let r = 0, i = n.indexOf(t);
  for (; i !== -1; )
    r++, i = n.indexOf(t, i + t.length);
  return r;
}
function xj(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function bj(e, t, n) {
  const i = Eo((n || {}).ignore || []), o = yj(t);
  let s = -1;
  for (; ++s < o.length; )
    wm(e, "text", a);
  function a(c, d) {
    let u = -1, p;
    for (; ++u < d.length; ) {
      const h = d[u], m = p ? p.children : void 0;
      if (i(
        h,
        m ? m.indexOf(h) : void 0,
        p
      ))
        return;
      p = h;
    }
    if (p)
      return l(c, d);
  }
  function l(c, d) {
    const u = d[d.length - 1], p = o[s][0], h = o[s][1];
    let m = 0;
    const x = u.children.indexOf(c);
    let b = !1, A = [];
    p.lastIndex = 0;
    let w = p.exec(c.value);
    for (; w; ) {
      const S = w.index, N = {
        index: w.index,
        input: w.input,
        stack: [...d, c]
      };
      let C = h(...w, N);
      if (typeof C == "string" && (C = C.length > 0 ? { type: "text", value: C } : void 0), C === !1 ? p.lastIndex = S + 1 : (m !== S && A.push({
        type: "text",
        value: c.value.slice(m, S)
      }), Array.isArray(C) ? A.push(...C) : C && A.push(C), m = S + w[0].length, b = !0), !p.global)
        break;
      w = p.exec(c.value);
    }
    return b ? (m < c.value.length && A.push({ type: "text", value: c.value.slice(m) }), u.children.splice(x, 1, ...A)) : A = [c], x + A.length;
  }
}
function yj(e) {
  const t = [];
  if (!Array.isArray(e))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const n = !e[0] || Array.isArray(e[0]) ? e : [e];
  let r = -1;
  for (; ++r < n.length; ) {
    const i = n[r];
    t.push([vj(i[0]), wj(i[1])]);
  }
  return t;
}
function vj(e) {
  return typeof e == "string" ? new RegExp(xj(e), "g") : e;
}
function wj(e) {
  return typeof e == "function" ? e : function() {
    return e;
  };
}
const hs = "phrasing", ps = ["autolink", "link", "image", "label"];
function Aj() {
  return {
    transforms: [Mj],
    enter: {
      literalAutolink: Ej,
      literalAutolinkEmail: ms,
      literalAutolinkHttp: ms,
      literalAutolinkWww: ms
    },
    exit: {
      literalAutolink: jj,
      literalAutolinkEmail: Nj,
      literalAutolinkHttp: Cj,
      literalAutolinkWww: Sj
    }
  };
}
function kj() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: hs,
        notInConstruct: ps
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: hs,
        notInConstruct: ps
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: hs,
        notInConstruct: ps
      }
    ]
  };
}
function Ej(e) {
  this.enter({ type: "link", title: null, url: "", children: [] }, e);
}
function ms(e) {
  this.config.enter.autolinkProtocol.call(this, e);
}
function Cj(e) {
  this.config.exit.autolinkProtocol.call(this, e);
}
function Sj(e) {
  this.config.exit.data.call(this, e);
  const t = this.stack[this.stack.length - 1];
  t.type, t.url = "http://" + this.sliceSerialize(e);
}
function Nj(e) {
  this.config.exit.autolinkEmail.call(this, e);
}
function jj(e) {
  this.exit(e);
}
function Mj(e) {
  bj(
    e,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Ij],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), Pj]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function Ij(e, t, n, r, i) {
  let o = "";
  if (!km(i) || (/^w/i.test(t) && (n = t + n, t = "", o = "http://"), !Rj(n)))
    return !1;
  const s = Dj(n + r);
  if (!s[0]) return !1;
  const a = {
    type: "link",
    title: null,
    url: o + t + s[0],
    children: [{ type: "text", value: t + s[0] }]
  };
  return s[1] ? [a, { type: "text", value: s[1] }] : a;
}
function Pj(e, t, n, r) {
  return (
    // Not an expected previous character.
    !km(r, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(n) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + t + "@" + n,
      children: [{ type: "text", value: t + "@" + n }]
    }
  );
}
function Rj(e) {
  const t = e.split(".");
  return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function Dj(e) {
  const t = /[!"&'),.:;<>?\]}]+$/.exec(e);
  if (!t)
    return [e, void 0];
  e = e.slice(0, t.index);
  let n = t[0], r = n.indexOf(")");
  const i = Xu(e, "(");
  let o = Xu(e, ")");
  for (; r !== -1 && i > o; )
    e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), o++;
  return [e, n];
}
function km(e, t) {
  const n = e.input.charCodeAt(e.index - 1);
  return (e.index === 0 || cn(n) || wo(n)) && // If it’s an email, the previous character should not be a slash.
  (!t || n !== 47);
}
Em.peek = Hj;
function Oj() {
  this.buffer();
}
function Tj(e) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, e);
}
function zj() {
  this.buffer();
}
function Bj(e) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    e
  );
}
function Lj(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = et(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function Fj(e) {
  this.exit(e);
}
function Gj(e) {
  const t = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = et(
    this.sliceSerialize(e)
  ).toLowerCase(), n.label = t;
}
function Yj(e) {
  this.exit(e);
}
function Hj() {
  return "[";
}
function Em(e, t, n, r) {
  const i = n.createTracker(r);
  let o = i.move("[^");
  const s = n.enter("footnoteReference"), a = n.enter("reference");
  return o += i.move(
    n.safe(n.associationId(e), { after: "]", before: o })
  ), a(), s(), o += i.move("]"), o;
}
function Uj() {
  return {
    enter: {
      gfmFootnoteCallString: Oj,
      gfmFootnoteCall: Tj,
      gfmFootnoteDefinitionLabelString: zj,
      gfmFootnoteDefinition: Bj
    },
    exit: {
      gfmFootnoteCallString: Lj,
      gfmFootnoteCall: Fj,
      gfmFootnoteDefinitionLabelString: Gj,
      gfmFootnoteDefinition: Yj
    }
  };
}
function Qj(e) {
  let t = !1;
  return e && e.firstLineBlank && (t = !0), {
    handlers: { footnoteDefinition: n, footnoteReference: Em },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function n(r, i, o, s) {
    const a = o.createTracker(s);
    let l = a.move("[^");
    const c = o.enter("footnoteDefinition"), d = o.enter("label");
    return l += a.move(
      o.safe(o.associationId(r), { before: l, after: "]" })
    ), d(), l += a.move("]:"), r.children && r.children.length > 0 && (a.shift(4), l += a.move(
      (t ? `
` : " ") + o.indentLines(
        o.containerFlow(r, a.current()),
        t ? Cm : Zj
      )
    )), c(), l;
  }
}
function Zj(e, t, n) {
  return t === 0 ? e : Cm(e, t, n);
}
function Cm(e, t, n) {
  return (n ? "" : "    ") + e;
}
const Vj = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
Sm.peek = Xj;
function Wj() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: qj },
    exit: { strikethrough: Kj }
  };
}
function Jj() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: Vj
      }
    ],
    handlers: { delete: Sm }
  };
}
function qj(e) {
  this.enter({ type: "delete", children: [] }, e);
}
function Kj(e) {
  this.exit(e);
}
function Sm(e, t, n, r) {
  const i = n.createTracker(r), o = n.enter("strikethrough");
  let s = i.move("~~");
  return s += n.containerPhrasing(e, {
    ...i.current(),
    before: s,
    after: "~"
  }), s += i.move("~~"), o(), s;
}
function Xj() {
  return "~";
}
function _j(e) {
  return e.length;
}
function $j(e, t) {
  const n = t || {}, r = (n.align || []).concat(), i = n.stringLength || _j, o = [], s = [], a = [], l = [];
  let c = 0, d = -1;
  for (; ++d < e.length; ) {
    const g = [], x = [];
    let b = -1;
    for (e[d].length > c && (c = e[d].length); ++b < e[d].length; ) {
      const A = eM(e[d][b]);
      if (n.alignDelimiters !== !1) {
        const w = i(A);
        x[b] = w, (l[b] === void 0 || w > l[b]) && (l[b] = w);
      }
      g.push(A);
    }
    s[d] = g, a[d] = x;
  }
  let u = -1;
  if (typeof r == "object" && "length" in r)
    for (; ++u < c; )
      o[u] = _u(r[u]);
  else {
    const g = _u(r);
    for (; ++u < c; )
      o[u] = g;
  }
  u = -1;
  const p = [], h = [];
  for (; ++u < c; ) {
    const g = o[u];
    let x = "", b = "";
    g === 99 ? (x = ":", b = ":") : g === 108 ? x = ":" : g === 114 && (b = ":");
    let A = n.alignDelimiters === !1 ? 1 : Math.max(
      1,
      l[u] - x.length - b.length
    );
    const w = x + "-".repeat(A) + b;
    n.alignDelimiters !== !1 && (A = x.length + A + b.length, A > l[u] && (l[u] = A), h[u] = A), p[u] = w;
  }
  s.splice(1, 0, p), a.splice(1, 0, h), d = -1;
  const m = [];
  for (; ++d < s.length; ) {
    const g = s[d], x = a[d];
    u = -1;
    const b = [];
    for (; ++u < c; ) {
      const A = g[u] || "";
      let w = "", S = "";
      if (n.alignDelimiters !== !1) {
        const N = l[u] - (x[u] || 0), C = o[u];
        C === 114 ? w = " ".repeat(N) : C === 99 ? N % 2 ? (w = " ".repeat(N / 2 + 0.5), S = " ".repeat(N / 2 - 0.5)) : (w = " ".repeat(N / 2), S = w) : S = " ".repeat(N);
      }
      n.delimiterStart !== !1 && !u && b.push("|"), n.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(n.alignDelimiters === !1 && A === "") && (n.delimiterStart !== !1 || u) && b.push(" "), n.alignDelimiters !== !1 && b.push(w), b.push(A), n.alignDelimiters !== !1 && b.push(S), n.padding !== !1 && b.push(" "), (n.delimiterEnd !== !1 || u !== c - 1) && b.push("|");
    }
    m.push(
      n.delimiterEnd === !1 ? b.join("").replace(/ +$/, "") : b.join("")
    );
  }
  return m.join(`
`);
}
function eM(e) {
  return e == null ? "" : String(e);
}
function _u(e) {
  const t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function tM(e, t, n, r) {
  const i = n.enter("blockquote"), o = n.createTracker(r);
  o.move("> "), o.shift(2);
  const s = n.indentLines(
    n.containerFlow(e, o.current()),
    nM
  );
  return i(), s;
}
function nM(e, t, n) {
  return ">" + (n ? "" : " ") + e;
}
function rM(e, t) {
  return $u(e, t.inConstruct, !0) && !$u(e, t.notInConstruct, !1);
}
function $u(e, t, n) {
  if (typeof t == "string" && (t = [t]), !t || t.length === 0)
    return n;
  let r = -1;
  for (; ++r < t.length; )
    if (e.includes(t[r]))
      return !0;
  return !1;
}
function ed(e, t, n, r) {
  let i = -1;
  for (; ++i < n.unsafe.length; )
    if (n.unsafe[i].character === `
` && rM(n.stack, n.unsafe[i]))
      return /[ \t]/.test(r.before) ? "" : " ";
  return `\\
`;
}
function iM(e, t) {
  const n = String(e);
  let r = n.indexOf(t), i = r, o = 0, s = 0;
  if (typeof t != "string")
    throw new TypeError("Expected substring");
  for (; r !== -1; )
    r === i ? ++o > s && (s = o) : o = 1, i = r + t.length, r = n.indexOf(t, i);
  return s;
}
function oM(e, t) {
  return !!(t.options.fences === !1 && e.value && // If there’s no info…
  !e.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(e.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
function sM(e) {
  const t = e.options.fence || "`";
  if (t !== "`" && t !== "~")
    throw new Error(
      "Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return t;
}
function aM(e, t, n, r) {
  const i = sM(n), o = e.value || "", s = i === "`" ? "GraveAccent" : "Tilde";
  if (oM(e, n)) {
    const u = n.enter("codeIndented"), p = n.indentLines(o, lM);
    return u(), p;
  }
  const a = n.createTracker(r), l = i.repeat(Math.max(iM(o, i) + 1, 3)), c = n.enter("codeFenced");
  let d = a.move(l);
  if (e.lang) {
    const u = n.enter(`codeFencedLang${s}`);
    d += a.move(
      n.safe(e.lang, {
        before: d,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), u();
  }
  if (e.lang && e.meta) {
    const u = n.enter(`codeFencedMeta${s}`);
    d += a.move(" "), d += a.move(
      n.safe(e.meta, {
        before: d,
        after: `
`,
        encode: ["`"],
        ...a.current()
      })
    ), u();
  }
  return d += a.move(`
`), o && (d += a.move(o + `
`)), d += a.move(l), c(), d;
}
function lM(e, t, n) {
  return (n ? "" : "    ") + e;
}
function Dl(e) {
  const t = e.options.quote || '"';
  if (t !== '"' && t !== "'")
    throw new Error(
      "Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`"
    );
  return t;
}
function cM(e, t, n, r) {
  const i = Dl(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.enter("definition");
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
function uM(e) {
  const t = e.options.emphasis || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return t;
}
function Cr(e) {
  return "&#x" + e.toString(16).toUpperCase() + ";";
}
function Yi(e, t, n) {
  const r = Rn(e), i = Rn(t);
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
Nm.peek = dM;
function Nm(e, t, n, r) {
  const i = uM(n), o = n.enter("emphasis"), s = n.createTracker(r), a = s.move(i);
  let l = s.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = Yi(
    r.before.charCodeAt(r.before.length - 1),
    c,
    i
  );
  d.inside && (l = Cr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), p = Yi(r.after.charCodeAt(0), u, i);
  p.inside && (l = l.slice(0, -1) + Cr(u));
  const h = s.move(i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: p.outside,
    before: d.outside
  }, a + l + h;
}
function dM(e, t, n) {
  return n.options.emphasis || "*";
}
function fM(e, t) {
  let n = !1;
  return Pl(e, function(r) {
    if ("value" in r && /\r?\n|\r/.test(r.value) || r.type === "break")
      return n = !0, Xs;
  }), !!((!e.depth || e.depth < 3) && El(e) && (t.options.setext || n));
}
function hM(e, t, n, r) {
  const i = Math.max(Math.min(6, e.depth || 1), 1), o = n.createTracker(r);
  if (fM(e, n)) {
    const d = n.enter("headingSetext"), u = n.enter("phrasing"), p = n.containerPhrasing(e, {
      ...o.current(),
      before: `
`,
      after: `
`
    });
    return u(), d(), p + `
` + (i === 1 ? "=" : "-").repeat(
      // The whole size…
      p.length - // Minus the position of the character after the last EOL (or
      // 0 if there is none)…
      (Math.max(p.lastIndexOf("\r"), p.lastIndexOf(`
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
  return /^[\t ]/.test(c) && (c = Cr(c.charCodeAt(0)) + c.slice(1)), c = c ? s + " " + c : s, n.options.closeAtx && (c += " " + s), l(), a(), c;
}
jm.peek = pM;
function jm(e) {
  return e.value || "";
}
function pM() {
  return "<";
}
Mm.peek = mM;
function Mm(e, t, n, r) {
  const i = Dl(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.enter("image");
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
function mM() {
  return "!";
}
Im.peek = gM;
function Im(e, t, n, r) {
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
  const d = n.stack;
  n.stack = [], s = n.enter("reference");
  const u = n.safe(n.associationId(e), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), n.stack = d, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function gM() {
  return "!";
}
Pm.peek = xM;
function Pm(e, t, n) {
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
function xM() {
  return "`";
}
function Rm(e, t) {
  const n = El(e);
  return !!(!t.options.resourceLink && // If there’s a url…
  e.url && // And there’s a no title…
  !e.title && // And the content of `node` is a single text node…
  e.children && e.children.length === 1 && e.children[0].type === "text" && // And if the url is the same as the content…
  (n === e.url || "mailto:" + n === e.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(e.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(e.url));
}
Dm.peek = bM;
function Dm(e, t, n, r) {
  const i = Dl(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.createTracker(r);
  let a, l;
  if (Rm(e, n)) {
    const d = n.stack;
    n.stack = [], a = n.enter("autolink");
    let u = s.move("<");
    return u += s.move(
      n.containerPhrasing(e, {
        before: u,
        after: ">",
        ...s.current()
      })
    ), u += s.move(">"), a(), n.stack = d, u;
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
function bM(e, t, n) {
  return Rm(e, n) ? "<" : "[";
}
Om.peek = yM;
function Om(e, t, n, r) {
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
  const d = n.stack;
  n.stack = [], s = n.enter("reference");
  const u = n.safe(n.associationId(e), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), n.stack = d, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function yM() {
  return "[";
}
function Ol(e) {
  const t = e.options.bullet || "*";
  if (t !== "*" && t !== "+" && t !== "-")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return t;
}
function vM(e) {
  const t = Ol(e), n = e.options.bulletOther;
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
function wM(e) {
  const t = e.options.bulletOrdered || ".";
  if (t !== "." && t !== ")")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return t;
}
function Tm(e) {
  const t = e.options.rule || "*";
  if (t !== "*" && t !== "-" && t !== "_")
    throw new Error(
      "Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return t;
}
function AM(e, t, n, r) {
  const i = n.enter("list"), o = n.bulletCurrent;
  let s = e.ordered ? wM(n) : Ol(n);
  const a = e.ordered ? s === "." ? ")" : "." : vM(n);
  let l = t && n.bulletLastUsed ? s === n.bulletLastUsed : !1;
  if (!e.ordered) {
    const d = e.children ? e.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (s === "*" || s === "-") && // Empty first list item:
      d && (!d.children || !d.children[0]) && // Directly in two other list items:
      n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && // That are each the first child.
      n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (l = !0), Tm(n) === s && d
    ) {
      let u = -1;
      for (; ++u < e.children.length; ) {
        const p = e.children[u];
        if (p && p.type === "listItem" && p.children && p.children[0] && p.children[0].type === "thematicBreak") {
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
function kM(e) {
  const t = e.options.listItemIndent || "one";
  if (t !== "tab" && t !== "one" && t !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return t;
}
function EM(e, t, n, r) {
  const i = kM(n);
  let o = n.bulletCurrent || Ol(n);
  t && t.type === "list" && t.ordered && (o = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (n.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + o);
  let s = o.length + 1;
  (i === "tab" || i === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (s = Math.ceil(s / 4) * 4);
  const a = n.createTracker(r);
  a.move(o + " ".repeat(s - o.length)), a.shift(s);
  const l = n.enter("listItem"), c = n.indentLines(
    n.containerFlow(e, a.current()),
    d
  );
  return l(), c;
  function d(u, p, h) {
    return p ? (h ? "" : " ".repeat(s)) + u : (h ? o : o + " ".repeat(s - o.length)) + u;
  }
}
function CM(e, t, n, r) {
  const i = n.enter("paragraph"), o = n.enter("phrasing"), s = n.containerPhrasing(e, r);
  return o(), i(), s;
}
const SM = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  Eo([
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
function NM(e, t, n, r) {
  return (e.children.some(function(s) {
    return SM(s);
  }) ? n.containerPhrasing : n.containerFlow).call(n, e, r);
}
function jM(e) {
  const t = e.options.strong || "*";
  if (t !== "*" && t !== "_")
    throw new Error(
      "Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`"
    );
  return t;
}
zm.peek = MM;
function zm(e, t, n, r) {
  const i = jM(n), o = n.enter("strong"), s = n.createTracker(r), a = s.move(i + i);
  let l = s.move(
    n.containerPhrasing(e, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = Yi(
    r.before.charCodeAt(r.before.length - 1),
    c,
    i
  );
  d.inside && (l = Cr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), p = Yi(r.after.charCodeAt(0), u, i);
  p.inside && (l = l.slice(0, -1) + Cr(u));
  const h = s.move(i + i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: p.outside,
    before: d.outside
  }, a + l + h;
}
function MM(e, t, n) {
  return n.options.strong || "*";
}
function IM(e, t, n, r) {
  return n.safe(e.value, r);
}
function PM(e) {
  const t = e.options.ruleRepetition || 3;
  if (t < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return t;
}
function RM(e, t, n) {
  const r = (Tm(n) + (n.options.ruleSpaces ? " " : "")).repeat(PM(n));
  return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
const Bm = {
  blockquote: tM,
  break: ed,
  code: aM,
  definition: cM,
  emphasis: Nm,
  hardBreak: ed,
  heading: hM,
  html: jm,
  image: Mm,
  imageReference: Im,
  inlineCode: Pm,
  link: Dm,
  linkReference: Om,
  list: AM,
  listItem: EM,
  paragraph: CM,
  root: NM,
  strong: zm,
  text: IM,
  thematicBreak: RM
};
function DM() {
  return {
    enter: {
      table: OM,
      tableData: td,
      tableHeader: td,
      tableRow: zM
    },
    exit: {
      codeText: BM,
      table: TM,
      tableData: gs,
      tableHeader: gs,
      tableRow: gs
    }
  };
}
function OM(e) {
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
function TM(e) {
  this.exit(e), this.data.inTable = void 0;
}
function zM(e) {
  this.enter({ type: "tableRow", children: [] }, e);
}
function gs(e) {
  this.exit(e);
}
function td(e) {
  this.enter({ type: "tableCell", children: [] }, e);
}
function BM(e) {
  let t = this.resume();
  this.data.inTable && (t = t.replace(/\\([\\|])/g, LM));
  const n = this.stack[this.stack.length - 1];
  n.type, n.value = t, this.exit(e);
}
function LM(e, t) {
  return t === "|" ? t : e;
}
function FM(e) {
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
      inlineCode: p,
      table: s,
      tableCell: l,
      tableRow: a
    }
  };
  function s(h, m, g, x) {
    return c(d(h, g, x), h.align);
  }
  function a(h, m, g, x) {
    const b = u(h, g, x), A = c([b]);
    return A.slice(0, A.indexOf(`
`));
  }
  function l(h, m, g, x) {
    const b = g.enter("tableCell"), A = g.enter("phrasing"), w = g.containerPhrasing(h, {
      ...x,
      before: o,
      after: o
    });
    return A(), b(), w;
  }
  function c(h, m) {
    return $j(h, {
      align: m,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function d(h, m, g) {
    const x = h.children;
    let b = -1;
    const A = [], w = m.enter("table");
    for (; ++b < x.length; )
      A[b] = u(x[b], m, g);
    return w(), A;
  }
  function u(h, m, g) {
    const x = h.children;
    let b = -1;
    const A = [], w = m.enter("tableRow");
    for (; ++b < x.length; )
      A[b] = l(x[b], h, m, g);
    return w(), A;
  }
  function p(h, m, g) {
    let x = Bm.inlineCode(h, m, g);
    return g.stack.includes("tableCell") && (x = x.replace(/\|/g, "\\$&")), x;
  }
}
function GM() {
  return {
    exit: {
      taskListCheckValueChecked: nd,
      taskListCheckValueUnchecked: nd,
      paragraph: HM
    }
  };
}
function YM() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: UM }
  };
}
function nd(e) {
  const t = this.stack[this.stack.length - 2];
  t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function HM(e) {
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
function UM(e, t, n, r) {
  const i = e.children[0], o = typeof e.checked == "boolean" && i && i.type === "paragraph", s = "[" + (e.checked ? "x" : " ") + "] ", a = n.createTracker(r);
  o && a.move(s);
  let l = Bm.listItem(e, t, n, {
    ...r,
    ...a.current()
  });
  return o && (l = l.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, c)), l;
  function c(d) {
    return d + s;
  }
}
function QM() {
  return [
    Aj(),
    Uj(),
    Wj(),
    DM(),
    GM()
  ];
}
function ZM(e) {
  return {
    extensions: [
      kj(),
      Qj(e),
      Jj(),
      FM(e),
      YM()
    ]
  };
}
const VM = {
  tokenize: _M,
  partial: !0
}, Lm = {
  tokenize: $M,
  partial: !0
}, Fm = {
  tokenize: eI,
  partial: !0
}, Gm = {
  tokenize: tI,
  partial: !0
}, WM = {
  tokenize: nI,
  partial: !0
}, Ym = {
  name: "wwwAutolink",
  tokenize: KM,
  previous: Um
}, Hm = {
  name: "protocolAutolink",
  tokenize: XM,
  previous: Qm
}, Mt = {
  name: "emailAutolink",
  tokenize: qM,
  previous: Zm
}, xt = {};
function JM() {
  return {
    text: xt
  };
}
let _t = 48;
for (; _t < 123; )
  xt[_t] = Mt, _t++, _t === 58 ? _t = 65 : _t === 91 && (_t = 97);
xt[43] = Mt;
xt[45] = Mt;
xt[46] = Mt;
xt[95] = Mt;
xt[72] = [Mt, Hm];
xt[104] = [Mt, Hm];
xt[87] = [Mt, Ym];
xt[119] = [Mt, Ym];
function qM(e, t, n) {
  const r = this;
  let i, o;
  return s;
  function s(u) {
    return !ta(u) || !Zm.call(r, r.previous) || Tl(r.events) ? n(u) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), a(u));
  }
  function a(u) {
    return ta(u) ? (e.consume(u), a) : u === 64 ? (e.consume(u), l) : n(u);
  }
  function l(u) {
    return u === 46 ? e.check(WM, d, c)(u) : u === 45 || u === 95 || Ie(u) ? (o = !0, e.consume(u), l) : d(u);
  }
  function c(u) {
    return e.consume(u), i = !0, l;
  }
  function d(u) {
    return o && i && De(r.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(u)) : n(u);
  }
}
function KM(e, t, n) {
  const r = this;
  return i;
  function i(s) {
    return s !== 87 && s !== 119 || !Um.call(r, r.previous) || Tl(r.events) ? n(s) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(VM, e.attempt(Lm, e.attempt(Fm, o), n), n)(s));
  }
  function o(s) {
    return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(s);
  }
}
function XM(e, t, n) {
  const r = this;
  let i = "", o = !1;
  return s;
  function s(u) {
    return (u === 72 || u === 104) && Qm.call(r, r.previous) && !Tl(r.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), i += String.fromCodePoint(u), e.consume(u), a) : n(u);
  }
  function a(u) {
    if (De(u) && i.length < 5)
      return i += String.fromCodePoint(u), e.consume(u), a;
    if (u === 58) {
      const p = i.toLowerCase();
      if (p === "http" || p === "https")
        return e.consume(u), l;
    }
    return n(u);
  }
  function l(u) {
    return u === 47 ? (e.consume(u), o ? c : (o = !0, l)) : n(u);
  }
  function c(u) {
    return u === null || Li(u) || we(u) || cn(u) || wo(u) ? n(u) : e.attempt(Lm, e.attempt(Fm, d), n)(u);
  }
  function d(u) {
    return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(u);
  }
}
function _M(e, t, n) {
  let r = 0;
  return i;
  function i(s) {
    return (s === 87 || s === 119) && r < 3 ? (r++, e.consume(s), i) : s === 46 && r === 3 ? (e.consume(s), o) : n(s);
  }
  function o(s) {
    return s === null ? n(s) : t(s);
  }
}
function $M(e, t, n) {
  let r, i, o;
  return s;
  function s(c) {
    return c === 46 || c === 95 ? e.check(Gm, l, a)(c) : c === null || we(c) || cn(c) || c !== 45 && wo(c) ? l(c) : (o = !0, e.consume(c), s);
  }
  function a(c) {
    return c === 95 ? r = !0 : (i = r, r = void 0), e.consume(c), s;
  }
  function l(c) {
    return i || r || !o ? n(c) : t(c);
  }
}
function eI(e, t) {
  let n = 0, r = 0;
  return i;
  function i(s) {
    return s === 40 ? (n++, e.consume(s), i) : s === 41 && r < n ? o(s) : s === 33 || s === 34 || s === 38 || s === 39 || s === 41 || s === 42 || s === 44 || s === 46 || s === 58 || s === 59 || s === 60 || s === 63 || s === 93 || s === 95 || s === 126 ? e.check(Gm, t, o)(s) : s === null || we(s) || cn(s) ? t(s) : (e.consume(s), i);
  }
  function o(s) {
    return s === 41 && r++, e.consume(s), i;
  }
}
function tI(e, t, n) {
  return r;
  function r(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (e.consume(a), r) : a === 38 ? (e.consume(a), o) : a === 93 ? (e.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || we(a) || cn(a) ? t(a) : n(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || we(a) || cn(a) ? t(a) : r(a);
  }
  function o(a) {
    return De(a) ? s(a) : n(a);
  }
  function s(a) {
    return a === 59 ? (e.consume(a), r) : De(a) ? (e.consume(a), s) : n(a);
  }
}
function nI(e, t, n) {
  return r;
  function r(o) {
    return e.consume(o), i;
  }
  function i(o) {
    return Ie(o) ? n(o) : t(o);
  }
}
function Um(e) {
  return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || we(e);
}
function Qm(e) {
  return !De(e);
}
function Zm(e) {
  return !(e === 47 || ta(e));
}
function ta(e) {
  return e === 43 || e === 45 || e === 46 || e === 95 || Ie(e);
}
function Tl(e) {
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
const rI = {
  tokenize: dI,
  partial: !0
};
function iI() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: lI,
        continuation: {
          tokenize: cI
        },
        exit: uI
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: aI
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: oI,
        resolveTo: sI
      }
    }
  };
}
function oI(e, t, n) {
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
    const c = et(r.sliceSerialize({
      start: s.end,
      end: r.now()
    }));
    return c.codePointAt(0) !== 94 || !o.includes(c.slice(1)) ? n(l) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(l), e.exit("gfmFootnoteCallLabelMarker"), t(l));
  }
}
function sI(e, t) {
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
function aI(e, t, n) {
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
      u === null || u === 91 || we(u)
    )
      return n(u);
    if (u === 93) {
      e.exit("chunkString");
      const p = e.exit("gfmFootnoteCallString");
      return i.includes(et(r.sliceSerialize(p))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(u), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(u);
    }
    return we(u) || (s = !0), o++, e.consume(u), u === 92 ? d : c;
  }
  function d(u) {
    return u === 91 || u === 92 || u === 93 ? (e.consume(u), o++, c) : c(u);
  }
}
function lI(e, t, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o, s = 0, a;
  return l;
  function l(m) {
    return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(m), e.exit("gfmFootnoteDefinitionLabelMarker"), c;
  }
  function c(m) {
    return m === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(m), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", d) : n(m);
  }
  function d(m) {
    if (
      // Too long.
      s > 999 || // Closing brace with nothing.
      m === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      m === null || m === 91 || we(m)
    )
      return n(m);
    if (m === 93) {
      e.exit("chunkString");
      const g = e.exit("gfmFootnoteDefinitionLabelString");
      return o = et(r.sliceSerialize(g)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(m), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), p;
    }
    return we(m) || (a = !0), s++, e.consume(m), m === 92 ? u : d;
  }
  function u(m) {
    return m === 91 || m === 92 || m === 93 ? (e.consume(m), s++, d) : d(m);
  }
  function p(m) {
    return m === 58 ? (e.enter("definitionMarker"), e.consume(m), e.exit("definitionMarker"), i.includes(o) || i.push(o), he(e, h, "gfmFootnoteDefinitionWhitespace")) : n(m);
  }
  function h(m) {
    return t(m);
  }
}
function cI(e, t, n) {
  return e.check(Gr, t, e.attempt(rI, t, n));
}
function uI(e) {
  e.exit("gfmFootnoteDefinition");
}
function dI(e, t, n) {
  const r = this;
  return he(e, i, "gfmFootnoteDefinitionIndent", 5);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return s && s[1].type === "gfmFootnoteDefinitionIndent" && s[2].sliceSerialize(s[1], !0).length === 4 ? t(o) : n(o);
  }
}
function fI(e) {
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
            const d = {
              type: "strikethrough",
              start: Object.assign({}, s[c][1].start),
              end: Object.assign({}, s[l][1].end)
            }, u = {
              type: "strikethroughText",
              start: Object.assign({}, s[c][1].end),
              end: Object.assign({}, s[l][1].start)
            }, p = [["enter", d, a], ["enter", s[c][1], a], ["exit", s[c][1], a], ["enter", u, a]], h = a.parser.constructs.insideSpan.null;
            h && Qe(p, p.length, 0, Ao(h, s.slice(c + 1, l), a)), Qe(p, p.length, 0, [["exit", u, a], ["enter", s[l][1], a], ["exit", s[l][1], a], ["exit", d, a]]), Qe(s, c - 1, l - c + 3, p), l = c + p.length - 2;
            break;
          }
      }
    for (l = -1; ++l < s.length; )
      s[l][1].type === "strikethroughSequenceTemporary" && (s[l][1].type = "data");
    return s;
  }
  function o(s, a, l) {
    const c = this.previous, d = this.events;
    let u = 0;
    return p;
    function p(m) {
      return c === 126 && d[d.length - 1][1].type !== "characterEscape" ? l(m) : (s.enter("strikethroughSequenceTemporary"), h(m));
    }
    function h(m) {
      const g = Rn(c);
      if (m === 126)
        return u > 1 ? l(m) : (s.consume(m), u++, h);
      if (u < 2 && !n) return l(m);
      const x = s.exit("strikethroughSequenceTemporary"), b = Rn(m);
      return x._open = !b || b === 2 && !!g, x._close = !g || g === 2 && !!b, a(m);
    }
  }
}
class hI {
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
    pI(this, t, n, r);
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
function pI(e, t, n, r) {
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
function mI(e, t) {
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
function gI() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: xI,
        resolveAll: bI
      }
    }
  };
}
function xI(e, t, n) {
  const r = this;
  let i = 0, o = 0, s;
  return a;
  function a(E) {
    let P = r.events.length - 1;
    for (; P > -1; ) {
      const R = r.events[P][1].type;
      if (R === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      R === "linePrefix") P--;
      else break;
    }
    const T = P > -1 ? r.events[P][1].type : null, Y = T === "tableHead" || T === "tableRow" ? C : l;
    return Y === C && r.parser.lazy[r.now().line] ? n(E) : Y(E);
  }
  function l(E) {
    return e.enter("tableHead"), e.enter("tableRow"), c(E);
  }
  function c(E) {
    return E === 124 || (s = !0, o += 1), d(E);
  }
  function d(E) {
    return E === null ? n(E) : te(E) ? o > 1 ? (o = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(E), e.exit("lineEnding"), h) : n(E) : ce(E) ? he(e, d, "whitespace")(E) : (o += 1, s && (s = !1, i += 1), E === 124 ? (e.enter("tableCellDivider"), e.consume(E), e.exit("tableCellDivider"), s = !0, d) : (e.enter("data"), u(E)));
  }
  function u(E) {
    return E === null || E === 124 || we(E) ? (e.exit("data"), d(E)) : (e.consume(E), E === 92 ? p : u);
  }
  function p(E) {
    return E === 92 || E === 124 ? (e.consume(E), u) : u(E);
  }
  function h(E) {
    return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(E) : (e.enter("tableDelimiterRow"), s = !1, ce(E) ? he(e, m, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(E) : m(E));
  }
  function m(E) {
    return E === 45 || E === 58 ? x(E) : E === 124 ? (s = !0, e.enter("tableCellDivider"), e.consume(E), e.exit("tableCellDivider"), g) : N(E);
  }
  function g(E) {
    return ce(E) ? he(e, x, "whitespace")(E) : x(E);
  }
  function x(E) {
    return E === 58 ? (o += 1, s = !0, e.enter("tableDelimiterMarker"), e.consume(E), e.exit("tableDelimiterMarker"), b) : E === 45 ? (o += 1, b(E)) : E === null || te(E) ? S(E) : N(E);
  }
  function b(E) {
    return E === 45 ? (e.enter("tableDelimiterFiller"), A(E)) : N(E);
  }
  function A(E) {
    return E === 45 ? (e.consume(E), A) : E === 58 ? (s = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(E), e.exit("tableDelimiterMarker"), w) : (e.exit("tableDelimiterFiller"), w(E));
  }
  function w(E) {
    return ce(E) ? he(e, S, "whitespace")(E) : S(E);
  }
  function S(E) {
    return E === 124 ? m(E) : E === null || te(E) ? !s || i !== o ? N(E) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(E)) : N(E);
  }
  function N(E) {
    return n(E);
  }
  function C(E) {
    return e.enter("tableRow"), O(E);
  }
  function O(E) {
    return E === 124 ? (e.enter("tableCellDivider"), e.consume(E), e.exit("tableCellDivider"), O) : E === null || te(E) ? (e.exit("tableRow"), t(E)) : ce(E) ? he(e, O, "whitespace")(E) : (e.enter("data"), D(E));
  }
  function D(E) {
    return E === null || E === 124 || we(E) ? (e.exit("data"), O(E)) : (e.consume(E), E === 92 ? z : D);
  }
  function z(E) {
    return E === 92 || E === 124 ? (e.consume(E), D) : D(E);
  }
}
function bI(e, t) {
  let n = -1, r = !0, i = 0, o = [0, 0, 0, 0], s = [0, 0, 0, 0], a = !1, l = 0, c, d, u;
  const p = new hI();
  for (; ++n < e.length; ) {
    const h = e[n], m = h[1];
    h[0] === "enter" ? m.type === "tableHead" ? (a = !1, l !== 0 && (rd(p, t, l, c, d), d = void 0, l = 0), c = {
      type: "table",
      start: Object.assign({}, m.start),
      // Note: correct end is set later.
      end: Object.assign({}, m.end)
    }, p.add(n, 0, [["enter", c, t]])) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (r = !0, u = void 0, o = [0, 0, 0, 0], s = [0, n + 1, 0, 0], a && (a = !1, d = {
      type: "tableBody",
      start: Object.assign({}, m.start),
      // Note: correct end is set later.
      end: Object.assign({}, m.end)
    }, p.add(n, 0, [["enter", d, t]])), i = m.type === "tableDelimiterRow" ? 2 : d ? 3 : 1) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") ? (r = !1, s[2] === 0 && (o[1] !== 0 && (s[0] = s[1], u = ci(p, t, o, i, void 0, u), o = [0, 0, 0, 0]), s[2] = n)) : m.type === "tableCellDivider" && (r ? r = !1 : (o[1] !== 0 && (s[0] = s[1], u = ci(p, t, o, i, void 0, u)), o = s, s = [o[1], n, 0, 0])) : m.type === "tableHead" ? (a = !0, l = n) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (l = n, o[1] !== 0 ? (s[0] = s[1], u = ci(p, t, o, i, n, u)) : s[1] !== 0 && (u = ci(p, t, s, i, n, u)), i = 0) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") && (s[3] = n);
  }
  for (l !== 0 && rd(p, t, l, c, d), p.consume(t.events), n = -1; ++n < t.events.length; ) {
    const h = t.events[n];
    h[0] === "enter" && h[1].type === "table" && (h[1]._align = mI(t.events, n));
  }
  return e;
}
function ci(e, t, n, r, i, o) {
  const s = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  n[0] !== 0 && (o.end = Object.assign({}, An(t.events, n[0])), e.add(n[0], 0, [["exit", o, t]]));
  const l = An(t.events, n[1]);
  if (o = {
    type: s,
    start: Object.assign({}, l),
    // Note: correct end is set later.
    end: Object.assign({}, l)
  }, e.add(n[1], 0, [["enter", o, t]]), n[2] !== 0) {
    const c = An(t.events, n[2]), d = An(t.events, n[3]), u = {
      type: a,
      start: Object.assign({}, c),
      end: Object.assign({}, d)
    };
    if (e.add(n[2], 0, [["enter", u, t]]), r !== 2) {
      const p = t.events[n[2]], h = t.events[n[3]];
      if (p[1].end = Object.assign({}, h[1].end), p[1].type = "chunkText", p[1].contentType = "text", n[3] > n[2] + 1) {
        const m = n[2] + 1, g = n[3] - n[2] - 1;
        e.add(m, g, []);
      }
    }
    e.add(n[3] + 1, 0, [["exit", u, t]]);
  }
  return i !== void 0 && (o.end = Object.assign({}, An(t.events, i)), e.add(i, 0, [["exit", o, t]]), o = void 0), o;
}
function rd(e, t, n, r, i) {
  const o = [], s = An(t.events, n);
  i && (i.end = Object.assign({}, s), o.push(["exit", i, t])), r.end = Object.assign({}, s), o.push(["exit", r, t]), e.add(n + 1, 0, o);
}
function An(e, t) {
  const n = e[t], r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const yI = {
  name: "tasklistCheck",
  tokenize: wI
};
function vI() {
  return {
    text: {
      91: yI
    }
  };
}
function wI(e, t, n) {
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
    return we(l) ? (e.enter("taskListCheckValueUnchecked"), e.consume(l), e.exit("taskListCheckValueUnchecked"), s) : l === 88 || l === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(l), e.exit("taskListCheckValueChecked"), s) : n(l);
  }
  function s(l) {
    return l === 93 ? (e.enter("taskListCheckMarker"), e.consume(l), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), a) : n(l);
  }
  function a(l) {
    return te(l) ? t(l) : ce(l) ? e.check({
      tokenize: AI
    }, t, n)(l) : n(l);
  }
}
function AI(e, t, n) {
  return he(e, r, "whitespace");
  function r(i) {
    return i === null ? n(i) : t(i);
  }
}
function kI(e) {
  return nm([
    JM(),
    iI(),
    fI(e),
    gI(),
    vI()
  ]);
}
const EI = {};
function CI(e) {
  const t = (
    /** @type {Processor<Root>} */
    this
  ), n = e || EI, r = t.data(), i = r.micromarkExtensions || (r.micromarkExtensions = []), o = r.fromMarkdownExtensions || (r.fromMarkdownExtensions = []), s = r.toMarkdownExtensions || (r.toMarkdownExtensions = []);
  i.push(kI(n)), o.push(QM()), s.push(ZM(n));
}
function id(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}
function SI(e) {
  return e.split("-").filter(Boolean).map((t) => t[0].toUpperCase() + t.slice(1)).join(" ");
}
function NI(e, t) {
  const r = e.split(/\r?\n/).find((p) => p.startsWith("# ")), i = r ? r.replace(/^#\s+/, "").trim() : SI(t), o = e.replace(/^# .+$/m, "").trim(), s = o.search(/^##\s+/m), l = (s >= 0 ? o.slice(0, s) : o).split(/\r?\n/).map((p) => p.trim()).filter((p) => p.length > 0 && p !== "---").join(" "), c = s >= 0 ? o.slice(s).trim() : "", u = (c ? c.split(/\n(?=##\s+)/g).filter((p) => p.trim().length > 0) : []).map((p, h) => {
    const g = p.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? `Section ${h + 1}`, x = `section-${id(g)}-${h + 1}`, b = p.replace(/^##\s+.+$/m, "").trim(), A = Array.from(b.matchAll(/^###\s+(.+)$/gm)).map((w, S) => ({
      title: w[1].trim(),
      id: `${x}-sub-${id(w[1])}-${S + 1}`
    }));
    return { id: x, title: g, markdown: b, subHeadings: A };
  });
  return { slug: t, title: i, description: l, sections: u };
}
function jI(e) {
  return Object.entries(e).map(([t, n]) => {
    const r = t.split("/").pop()?.replace(/\.md$/i, "") ?? "guide";
    return NI(n, r);
  }).sort((t, n) => t.title.localeCompare(n.title));
}
function na(e) {
  return typeof e == "string" ? e : typeof e == "number" ? String(e) : Array.isArray(e) ? e.map(na).join("") : e && typeof e == "object" && "props" in e ? na(e.props?.children) : "";
}
function MI(e) {
  const t = e.match(/^\s*\[\!(TIP|NOTE|WARNING)\]\s*(.+)\s*$/i);
  return t ? {
    type: t[1].toUpperCase(),
    content: t[2].trim()
  } : null;
}
function II() {
  const [e, t] = ge(0);
  return ue(() => {
    const n = document.querySelector("[data-guides-scroll-container]");
    if (!n) return;
    const r = () => {
      const { scrollTop: i, scrollHeight: o, clientHeight: s } = n, a = o - s;
      t(a > 0 ? Math.min(100, i / a * 100) : 0);
    };
    return r(), n.addEventListener("scroll", r, { passive: !0 }), () => n.removeEventListener("scroll", r);
  }, []), e;
}
function ra(e) {
  const t = [
    { gradient: "from-primary/15", ring: "ring-primary/30", dot: "bg-primary/60" },
    { gradient: "from-sky-500/15", ring: "ring-sky-500/30", dot: "bg-sky-500/60" },
    { gradient: "from-emerald-500/15", ring: "ring-emerald-500/30", dot: "bg-emerald-500/60" },
    { gradient: "from-violet-500/15", ring: "ring-violet-500/30", dot: "bg-violet-500/60" },
    { gradient: "from-amber-500/15", ring: "ring-amber-500/30", dot: "bg-amber-500/60" }
  ], n = e.split("").reduce((r, i) => r + i.charCodeAt(0), 0) % t.length;
  return t[n];
}
function Vm(e) {
  return be(() => jI(e), [e]);
}
function Wm(e) {
  const t = ld(), n = cd(), i = be(() => new URLSearchParams(t.search), [t.search]).get("guide")?.trim() ?? "", o = e.find((a) => a.slug === i) ?? e[0] ?? null;
  return ue(() => {
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
function PI({
  markdown: e,
  sectionId: t,
  subHeadingIds: n,
  onImageClick: r
}) {
  let i = 0;
  return /* @__PURE__ */ f.jsx(
    fj,
    {
      remarkPlugins: [CI],
      components: {
        h3: ({ children: o }) => {
          const s = n[i] ?? `${t}-sub-${i + 1}`;
          return i += 1, /* @__PURE__ */ f.jsxs("h3", { id: s, className: "mt-7 scroll-mt-24 flex items-center gap-2.5 text-base font-semibold text-foreground", children: [
            /* @__PURE__ */ f.jsx("span", { className: "inline-block h-[1em] w-[3px] shrink-0 rounded-full bg-primary/50" }),
            o
          ] });
        },
        h4: ({ children: o }) => /* @__PURE__ */ f.jsx("h4", { className: "mt-5 text-sm font-semibold text-foreground/80", children: o }),
        p: ({ children: o }) => {
          const s = na(o), a = MI(s);
          if (!a)
            return /* @__PURE__ */ f.jsx("p", { className: "mt-3 text-sm leading-7 text-foreground/85", children: o });
          const l = a.type === "TIP" ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : a.type === "WARNING" ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:text-sky-300";
          return /* @__PURE__ */ f.jsxs("div", { className: H("mt-4 rounded-xl border px-3 py-3 text-sm leading-6", l), children: [
            /* @__PURE__ */ f.jsx("span", { className: "mr-2 inline-flex rounded border border-current/30 px-1.5 py-0.5 text-[10px] font-bold tracking-wide", children: a.type }),
            /* @__PURE__ */ f.jsx("span", { children: a.content })
          ] });
        },
        ul: ({ children: o }) => /* @__PURE__ */ f.jsx("ul", { className: "mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/85 marker:text-primary/50", children: o }),
        ol: ({ children: o }) => /* @__PURE__ */ f.jsx("ol", { className: "mt-3 list-decimal space-y-1 pl-5 text-sm text-foreground/85 marker:text-primary/60 marker:font-medium", children: o }),
        li: ({ children: o }) => /* @__PURE__ */ f.jsx("li", { className: "leading-7", children: o }),
        strong: ({ children: o }) => /* @__PURE__ */ f.jsx("strong", { className: "font-semibold text-foreground", children: o }),
        em: ({ children: o }) => /* @__PURE__ */ f.jsx("em", { className: "italic text-foreground/75", children: o }),
        a: ({ href: o, children: s }) => /* @__PURE__ */ f.jsx("a", { href: o, className: "font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary", children: s }),
        blockquote: ({ children: o }) => /* @__PURE__ */ f.jsx("div", { className: "mt-4 rounded-r-xl border-l-[3px] border-primary/50 bg-primary/[0.06] px-4 py-3 text-sm italic text-foreground/70", children: o }),
        hr: () => /* @__PURE__ */ f.jsxs("div", { className: "my-6 flex items-center gap-3", children: [
          /* @__PURE__ */ f.jsx("div", { className: "h-px flex-1 bg-border/50" }),
          /* @__PURE__ */ f.jsx("div", { className: "size-1 rounded-full bg-border" }),
          /* @__PURE__ */ f.jsx("div", { className: "h-px flex-1 bg-border/50" })
        ] }),
        pre: ({ children: o }) => /* @__PURE__ */ f.jsx("pre", { className: "mt-4 overflow-x-auto rounded-xl border border-border/50 bg-muted/60 p-4 text-xs leading-6 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit", children: o }),
        code: ({ children: o, className: s }) => /* @__PURE__ */ f.jsx("code", { className: H("rounded-md bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground/90", s), children: o }),
        table: ({ children: o }) => /* @__PURE__ */ f.jsx("div", { className: "mt-4 overflow-hidden rounded-xl border border-border/50", children: /* @__PURE__ */ f.jsx(uo, { children: o }) }),
        thead: ({ children: o }) => /* @__PURE__ */ f.jsx(sp, { children: o }),
        tbody: ({ children: o }) => /* @__PURE__ */ f.jsx(fo, { children: o }),
        tr: ({ children: o }) => /* @__PURE__ */ f.jsx(kt, { children: o }),
        th: ({ children: o }) => /* @__PURE__ */ f.jsx(ap, { className: "bg-muted/40 text-[11px] font-semibold uppercase tracking-wide", children: o }),
        td: ({ children: o }) => /* @__PURE__ */ f.jsx(ft, { children: o }),
        img: ({ src: o, alt: s }) => {
          const a = typeof o == "string" ? o.trim() : "";
          if (!a) return null;
          const l = s ?? "";
          return /* @__PURE__ */ f.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r?.({ src: a, alt: l }),
              className: "mt-4 block w-full rounded-xl border border-border/50 bg-muted/15 p-1.5 text-left transition-colors hover:bg-muted/30",
              children: [
                /* @__PURE__ */ f.jsx("img", { src: a, alt: l, className: "max-h-[28rem] w-full rounded-lg object-contain" }),
                /* @__PURE__ */ f.jsx("span", { className: "mt-2 block text-xs text-muted-foreground", children: "Click to expand" })
              ]
            }
          );
        }
      },
      children: e
    }
  );
}
function RI({
  image: e,
  onClose: t
}) {
  return /* @__PURE__ */ f.jsx(Va, { open: !!e, onOpenChange: (n) => !n && t(), children: /* @__PURE__ */ f.jsxs(Wa, { className: "flex w-[94vw] max-w-none flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-[94vw]", children: [
    /* @__PURE__ */ f.jsx(Ja, { className: "border-b border-border/70 px-6 py-4 text-left", children: /* @__PURE__ */ f.jsx(qa, { children: e?.alt?.trim() || "Image Preview" }) }),
    e ? /* @__PURE__ */ f.jsx("div", { className: "p-3", children: /* @__PURE__ */ f.jsx("img", { src: e.src, alt: e.alt, className: "max-h-[calc(100dvh-10rem)] w-full rounded-md object-contain" }) }) : null
  ] }) });
}
function DI({ guide: e }) {
  const t = e.sections.reduce((i, o) => i + o.markdown.split(/\s+/).length, 0), n = Math.max(1, Math.round(t / 200)), r = ra(e.slug);
  return /* @__PURE__ */ f.jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border/70 bg-card px-7 py-7 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]", children: [
    /* @__PURE__ */ f.jsx("div", { className: H("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent", r.gradient) }),
    /* @__PURE__ */ f.jsx("div", { className: "pointer-events-none absolute -right-12 -top-12 size-52 rounded-full bg-primary/[0.04]" }),
    /* @__PURE__ */ f.jsx("div", { className: "pointer-events-none absolute -right-5 -top-5 size-28 rounded-full bg-primary/[0.05]" }),
    /* @__PURE__ */ f.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "mb-3 flex items-center gap-1.5", children: [
        /* @__PURE__ */ f.jsx(Or, { className: "size-3.5 text-primary/70" }),
        /* @__PURE__ */ f.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "User Guide" })
      ] }),
      /* @__PURE__ */ f.jsx("h1", { className: "text-2xl font-bold text-foreground", children: e.title }),
      e.description ? /* @__PURE__ */ f.jsx("p", { className: "mt-3 max-w-3xl text-sm leading-7 text-foreground/75", children: e.description }) : null,
      /* @__PURE__ */ f.jsxs("div", { className: "mt-4 flex items-center gap-5", children: [
        /* @__PURE__ */ f.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ f.jsx(m0, { className: "size-3" }),
          /* @__PURE__ */ f.jsxs("span", { children: [
            e.sections.length,
            " ",
            e.sections.length === 1 ? "section" : "sections"
          ] })
        ] }),
        /* @__PURE__ */ f.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ f.jsx(f0, { className: "size-3" }),
          /* @__PURE__ */ f.jsxs("span", { children: [
            n,
            " min read"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function OI({ guidesDirectoryLabel: e = "src/content/guides" }) {
  return /* @__PURE__ */ f.jsxs("div", { className: "rounded-2xl border border-border/70 bg-card p-10 text-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)]", children: [
    /* @__PURE__ */ f.jsx(Or, { className: "mx-auto mb-3 size-9 text-muted-foreground/30" }),
    /* @__PURE__ */ f.jsx("p", { className: "text-sm font-semibold text-foreground/70", children: "No guides found" }),
    /* @__PURE__ */ f.jsxs("p", { className: "mt-1.5 text-xs text-muted-foreground", children: [
      "Add ",
      /* @__PURE__ */ f.jsx("code", { className: "rounded-md bg-muted px-1.5 py-0.5", children: "*.md" }),
      " files to",
      " ",
      /* @__PURE__ */ f.jsx("code", { className: "rounded-md bg-muted px-1.5 py-0.5", children: e })
    ] })
  ] });
}
function JP({ rawGuides: e, guidesDirectoryLabel: t }) {
  const n = II(), [r, i] = ge(null), o = Vm(e), { selectedGuide: s } = Wm(o);
  return s ? /* @__PURE__ */ f.jsxs("section", { className: "min-w-0 space-y-5", children: [
    /* @__PURE__ */ f.jsx("div", { className: "sticky top-0 z-10 -mx-4 md:-mx-6", children: /* @__PURE__ */ f.jsx("div", { className: "h-[3px] w-full bg-border/30", children: /* @__PURE__ */ f.jsx(
      "div",
      {
        className: "h-full bg-gradient-to-r from-primary via-primary/75 to-primary/40 transition-[width] duration-75 ease-out",
        style: { width: `${n}%` }
      }
    ) }) }),
    /* @__PURE__ */ f.jsx(DI, { guide: s }),
    s.sections.map((a, l) => /* @__PURE__ */ f.jsxs(
      "article",
      {
        id: a.id,
        className: "relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]",
        children: [
          /* @__PURE__ */ f.jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/55 via-primary/20 to-transparent" }),
          /* @__PURE__ */ f.jsx(
            "span",
            {
              className: "pointer-events-none absolute right-5 top-1 select-none font-bold leading-none text-foreground/[0.035]",
              style: { fontSize: "82px" },
              "aria-hidden": !0,
              children: String(l + 1).padStart(2, "0")
            }
          ),
          /* @__PURE__ */ f.jsx("div", { className: "relative border-b border-border/50 px-7 py-5", children: /* @__PURE__ */ f.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ f.jsx("span", { className: "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold tabular-nums text-primary/80", children: l + 1 }),
            /* @__PURE__ */ f.jsx("h2", { className: "text-lg font-semibold text-foreground", children: a.title })
          ] }) }),
          /* @__PURE__ */ f.jsx("div", { className: "px-7 py-6", children: /* @__PURE__ */ f.jsx(
            PI,
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
    /* @__PURE__ */ f.jsx(RI, { image: r, onClose: () => i(null) })
  ] }) : /* @__PURE__ */ f.jsx(OI, { guidesDirectoryLabel: t });
}
function qP({ rawGuides: e, collapsed: t }) {
  const [n, r] = ge(null), [i, o] = ge("files"), [s, a] = ge({}), [l, c] = ge(null), d = Vm(e), { selectedGuide: u, setSelectedGuide: p } = Wm(d);
  return ue(() => {
    let h = 0, m = !1;
    const g = () => {
      if (m) return;
      const x = document.querySelector("[data-guides-scroll-container]");
      if (x) {
        c(x);
        return;
      }
      h = requestAnimationFrame(g);
    };
    return g(), () => {
      m = !0, h && cancelAnimationFrame(h);
    };
  }, []), ue(() => {
    if (!u || !l) return;
    let h = 0, m = 0;
    const g = () => {
      const w = {}, S = l.getBoundingClientRect(), N = 140;
      let C = null, O = null, D = !1;
      for (const E of u.sections) {
        const P = document.getElementById(E.id);
        if (!P) {
          w[E.id] = 0;
          continue;
        }
        D = !0;
        const T = P.getBoundingClientRect(), Y = Math.max(T.height, 1), R = Math.max(T.top, S.top), j = Math.min(T.bottom, S.bottom), I = Math.max(0, j - R), F = Math.max(0, N - T.top), B = Math.min(100, Math.max(0, (F + I) / Y * 100));
        w[E.id] = B, O === null && T.bottom > S.top && T.top < S.bottom && (O = E.id), T.top <= N && (C = E.id);
      }
      if (!D) return;
      const z = C ?? O ?? u.sections[0]?.id ?? null;
      a(w), r(z);
    }, x = () => {
      h || (h = requestAnimationFrame(() => {
        h = 0, g();
      }));
    }, b = () => {
      m || (m = requestAnimationFrame(() => {
        m = 0, x();
      }));
    }, A = new MutationObserver(b);
    return A.observe(document.body, { childList: !0, subtree: !0 }), l.addEventListener("scroll", x, { passive: !0 }), window.addEventListener("scroll", x, { passive: !0 }), window.addEventListener("resize", x), x(), () => {
      A.disconnect(), h && cancelAnimationFrame(h), m && cancelAnimationFrame(m), l.removeEventListener("scroll", x), window.removeEventListener("scroll", x), window.removeEventListener("resize", x);
    };
  }, [l, u]), u ? /* @__PURE__ */ f.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ f.jsxs("div", { className: H("flex items-center gap-2 px-2", t && "justify-center"), children: [
      /* @__PURE__ */ f.jsx(Or, { className: "size-4 text-muted-foreground" }),
      t ? null : /* @__PURE__ */ f.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Guides" })
    ] }),
    (i === "files" || t) && /* @__PURE__ */ f.jsxs("div", { className: "space-y-1.5", children: [
      t ? null : /* @__PURE__ */ f.jsx("div", { className: "px-2 pb-1", children: /* @__PURE__ */ f.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60", children: "All files" }) }),
      t ? /* @__PURE__ */ f.jsx("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ f.jsx("div", { className: H("size-2 rounded-full", ra(u.slug).dot) }) }) : /* @__PURE__ */ f.jsx("div", { className: "space-y-1.5", children: d.map((h) => {
        const m = h.slug === u.slug, g = ra(h.slug);
        return /* @__PURE__ */ f.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              p(h.slug), o("toc");
            },
            className: H(
              "group relative w-full overflow-hidden rounded-xl border px-3.5 py-3 text-left transition-all duration-150",
              m ? "border-border/70 bg-secondary shadow-sm" : "border-border/40 bg-card hover:border-border/60 hover:bg-muted/30"
            ),
            children: [
              m ? /* @__PURE__ */ f.jsx("div", { className: H("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-50", g.gradient) }) : null,
              /* @__PURE__ */ f.jsxs("div", { className: "relative flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ f.jsx(
                  "span",
                  {
                    className: H(
                      "text-sm font-medium leading-snug",
                      m ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    ),
                    children: h.title
                  }
                ),
                m ? /* @__PURE__ */ f.jsx(Lt, { className: "size-3.5 shrink-0 text-muted-foreground" }) : null
              ] }),
              /* @__PURE__ */ f.jsxs("div", { className: "relative mt-1 text-[11px] text-muted-foreground/60", children: [
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
    i === "toc" && !t ? /* @__PURE__ */ f.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ f.jsxs(
        "button",
        {
          type: "button",
          onClick: () => o("files"),
          className: "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
          children: [
            /* @__PURE__ */ f.jsx(qw, { className: "size-3.5" }),
            "All guides"
          ]
        }
      ),
      /* @__PURE__ */ f.jsxs("div", { className: "flex items-center gap-1.5 px-2", children: [
        /* @__PURE__ */ f.jsx(w0, { className: "size-3 text-muted-foreground/60" }),
        /* @__PURE__ */ f.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60", children: "Contents" })
      ] }),
      /* @__PURE__ */ f.jsx("div", { className: "space-y-1", children: u.sections.map((h, m) => {
        const g = n === h.id, x = s[h.id] ?? 0;
        return /* @__PURE__ */ f.jsxs(
          "div",
          {
            className: H(
              "overflow-hidden rounded-xl border transition-colors duration-150",
              g ? "border-border/60 bg-secondary/50" : "border-transparent hover:border-border/40 hover:bg-muted/20"
            ),
            children: [
              /* @__PURE__ */ f.jsxs(
                "a",
                {
                  href: `#${h.id}`,
                  onClick: (b) => {
                    b.preventDefault(), document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  },
                  className: "flex items-center gap-2.5 px-3 py-2.5",
                  children: [
                    /* @__PURE__ */ f.jsx(
                      "span",
                      {
                        className: H(
                          "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-colors",
                          g ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        ),
                        children: m + 1
                      }
                    ),
                    /* @__PURE__ */ f.jsx("span", { className: H("text-xs font-medium leading-snug transition-colors", g ? "text-foreground" : "text-muted-foreground"), children: h.title })
                  ]
                }
              ),
              /* @__PURE__ */ f.jsx("div", { className: "mx-3 mb-2 h-[2px] overflow-hidden rounded-full bg-border/40", children: /* @__PURE__ */ f.jsx(
                "div",
                {
                  className: H("h-full rounded-full transition-[width] duration-150", g ? "bg-primary/70" : "bg-border/80"),
                  style: { width: `${x}%` }
                }
              ) }),
              h.subHeadings.length > 0 ? /* @__PURE__ */ f.jsx("div", { className: "mb-2.5 ml-10 space-y-px border-l border-border/40 pl-3", children: h.subHeadings.map((b) => /* @__PURE__ */ f.jsx(
                "a",
                {
                  href: `#${b.id}`,
                  onClick: (A) => {
                    A.preventDefault(), document.getElementById(b.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  },
                  className: "block py-1 text-[11px] leading-snug text-muted-foreground/65 transition-colors hover:text-foreground",
                  children: b.title
                },
                b.id
              )) }) : null
            ]
          },
          h.id
        );
      }) })
    ] }) : null
  ] }) : null;
}
function Jm({
  guideRoute: e,
  fallbackRoute: t,
  fallbackUnauthenticatedRoute: n,
  onAfterNavigate: r
}) {
  const { isAuthenticated: i } = $a(), o = ld(), s = cd(), a = o.pathname === e;
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
function KP({
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
  const { handleNavigate: d, inGuidesView: u } = Jm({
    guideRoute: e,
    fallbackRoute: t,
    fallbackUnauthenticatedRoute: n,
    onAfterNavigate: o
  });
  return /* @__PURE__ */ f.jsx(
    me,
    {
      type: "button",
      variant: a,
      size: l,
      className: H("rounded-full", s),
      "aria-current": u ? "page" : void 0,
      "aria-label": u ? i : r,
      title: u ? i : r,
      onClick: d,
      ...c,
      children: /* @__PURE__ */ f.jsx(Or, { className: "size-4" })
    }
  );
}
function XP({
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
  const { handleNavigate: c, inGuidesView: d } = Jm({
    guideRoute: e,
    fallbackRoute: t,
    fallbackUnauthenticatedRoute: n,
    onAfterNavigate: o
  });
  return /* @__PURE__ */ f.jsxs(
    "button",
    {
      type: a,
      className: H(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60",
        s
      ),
      "aria-current": d ? "page" : void 0,
      onClick: c,
      ...l,
      children: [
        /* @__PURE__ */ f.jsx(Or, { className: "size-4 text-muted-foreground" }),
        d ? i : r
      ]
    }
  );
}
const zl = "2", od = "returnUrl", Bl = "ui.detailViewMode", ia = `${Bl}:latest`, oa = "detail-view-mode-change", qm = {
  floating: !1,
  collapsed: "0"
}, sa = /* @__PURE__ */ new Map();
function Km() {
  const [e, t] = ge(
    () => typeof window > "u" ? "/" : window.location.pathname
  );
  return ue(() => {
    const n = () => t(window.location.pathname);
    return window.addEventListener("popstate", n), () => window.removeEventListener("popstate", n);
  }, []), e;
}
function TI(e) {
  return e ? e.length > 1 && e.endsWith("/") ? e.slice(0, -1) : e : "/";
}
function zI(e) {
  return e === "1" || e === zl ? e : "0";
}
function BI(e) {
  const t = e.floating === !0;
  return {
    floating: t,
    collapsed: t ? zI(e.collapsed) : "0"
  };
}
function Hi(e, t) {
  return e?.floating === t.floating && e.collapsed === t.collapsed;
}
function Xm(e) {
  const t = TI(e), n = t.split("/").filter(Boolean);
  if (n[0] !== "management")
    return t;
  if (n[1] === "classes" && n[2]) {
    const r = n[3], i = n[4];
    return i && (r === "schedules" || r === "sessions" || r === "tests" || r === "feedbacks") ? `/management/classes/${n[2]}/${r}/${i}` : `/management/classes/${n[2]}`;
  }
  return (n[1] === "schedules" || n[1] === "sessions" || n[1] === "tests" || n[1] === "feedbacks") && n[2] ? `/management/${n[1]}/${n[2]}` : t;
}
function Ui(e) {
  return sa.get(e) ?? null;
}
function LI() {
  typeof window > "u" || window.dispatchEvent(new Event(oa));
}
function _m(e) {
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
function $m(e, t) {
  const n = _m(e);
  if (!n)
    return e;
  const r = n.searchParams.get(od)?.trim();
  return r && t > 0 && n.searchParams.set(
    od,
    $m(r, t - 1)
  ), `${n.pathname}${n.search}${n.hash}`;
}
function FI(e) {
  return $m(e, 3);
}
function eg(e) {
  return Ui(
    `${Bl}:${Xm(e)}`
  ) ?? Ui(ia);
}
function sd(e, t) {
  const n = BI(t), r = `${Bl}:${Xm(e)}`, i = !Hi(
    Ui(r),
    n
  ), o = !Hi(
    Ui(ia),
    n
  );
  return sa.set(r, n), sa.set(ia, n), (i || o) && LI(), n;
}
function GI(e) {
  return eg(e) ?? qm;
}
function YI(e) {
  return FI(e);
}
function _P(e) {
  const t = _m(YI(e));
  return t ? {
    pathname: t.pathname,
    search: t.search,
    hash: t.hash
  } : null;
}
function HI(e = {}) {
  const t = Km(), n = e.enabled ?? !0, r = e.pathname ?? t, [i, o] = ge(0);
  return ue(() => {
    if (!n || typeof window > "u")
      return;
    const s = () => {
      o((a) => a + 1);
    };
    return window.addEventListener(
      oa,
      s
    ), () => {
      window.removeEventListener(
        oa,
        s
      );
    };
  }, [n]), be(() => n ? GI(r) : qm, [n, r, i]);
}
function UI(e = {}) {
  const t = Km(), n = e.enabled ?? !0, r = e.pathname ?? t, i = HI({
    enabled: n,
    pathname: r
  }), [o, s] = ge(i);
  ue(() => {
    s(
      (l) => Hi(l, i) ? l : i
    );
  }, [i]), ue(() => {
    n && (Hi(eg(r), o) || sd(r, o));
  }, [n, r, o]);
  const a = Ye(
    (l) => {
      n && s(sd(r, l));
    },
    [n, r]
  );
  return {
    ...o,
    isCollapsed: o.collapsed !== "0",
    hiddenCollapsed: o.collapsed === zl,
    setMode: a
  };
}
const xs = {
  tabPillSpring: {
    tension: 300,
    friction: 26
  },
  tabContentFadeOutMs: 100,
  tabContentFadeInMs: 200
};
let bs = {
  tabPillSpring: { ...xs.tabPillSpring },
  tabContentFadeOutMs: xs.tabContentFadeOutMs,
  tabContentFadeInMs: xs.tabContentFadeInMs
}, QI = 0;
function ZI() {
  return typeof window > "u" ? !1 : window.__DETAIL_TABS_DEBUG__ ? !0 : new URLSearchParams(window.location.search).get("detailTabsDebug") === "1";
}
function Xe(e, t, n) {
  ZI() && console.debug(`[DetailTabs:${e}] ${t}`, {
    path: typeof window > "u" ? void 0 : `${window.location.pathname}${window.location.search}`,
    ...n
  });
}
function VI() {
  return {
    tabPillSpring: { ...bs.tabPillSpring },
    tabContentFadeOutMs: bs.tabContentFadeOutMs,
    tabContentFadeInMs: bs.tabContentFadeInMs
  };
}
const Ll = Nt(null), WI = Nt(!1);
function $P({
  children: e,
  className: t = "w-full max-w-[1700px] space-y-4",
  isBackground: n,
  contentScrollable: r = !1,
  onCloseFloating: i
}) {
  const { t: o } = ke(), s = qe(WI), a = n ?? s, l = UI({ enabled: !a }), c = a ? !1 : l.floating, d = a ? !1 : l.isCollapsed, u = a ? !1 : l.hiddenCollapsed, p = (x, b, A = !1) => {
    if (a)
      return;
    const w = b ? A ? zl : "1" : "0";
    l.setMode({
      floating: x,
      collapsed: w
    });
  }, h = () => {
    a || !i || i();
  }, m = () => {
    p(!1, !1, !1);
  }, g = () => {
    p(!0, !1, !1);
  };
  return ue(() => {
    if (typeof document > "u" || !c)
      return;
    const x = document.body.style.overflow;
    return document.body.style.overflow = "hidden", () => {
      document.body.style.overflow = x;
    };
  }, [c]), /* @__PURE__ */ f.jsx(
    Ll.Provider,
    {
      value: {
        floating: c,
        collapsed: d,
        hiddenCollapsed: u,
        isBackground: a,
        contentScrollable: r,
        expandToNormalView: m,
        switchToFloatingView: g
      },
      children: /* @__PURE__ */ f.jsxs(
        "section",
        {
          className: H(
            c ? "fixed inset-0 z-50" : "w-full",
            c && u ? "pointer-events-none" : "",
            c && d && !u ? "pointer-events-none" : ""
          ),
          children: [
            c && !d ? /* @__PURE__ */ f.jsx(
              "button",
              {
                type: "button",
                "aria-label": o("detail.close"),
                onClick: h,
                className: "absolute inset-0 bg-background/45 backdrop-blur-md"
              }
            ) : null,
            c && u ? /* @__PURE__ */ f.jsx(
              me,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                "aria-label": o("detail.restorePanel"),
                onClick: () => p(!0, !0, !1),
                className: "pointer-events-auto absolute right-0 top-1/2 z-20 h-28 w-7 -translate-y-1/2 rounded-l-md rounded-r-none border-r-0 bg-background text-[10px] font-semibold uppercase tracking-[0.14em] shadow-md [writing-mode:vertical-rl]",
                children: o("detail.details")
              }
            ) : null,
            /* @__PURE__ */ f.jsxs(
              "div",
              {
                "data-floating-collapsed": c && d ? "true" : "false",
                className: H(
                  t,
                  r && "overflow-y-auto overflow-x-hidden pr-1",
                  c ? d ? u ? "floating-detail pointer-events-none absolute right-0 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 translate-x-[calc(100%-20px)] !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail pointer-events-auto absolute right-3 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail absolute left-1/2 top-1/2 z-10 w-[85dvw] -translate-x-1/2 -translate-y-1/2 !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : ""
                ),
                children: [
                  c && d ? u ? null : /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
                    /* @__PURE__ */ f.jsx(
                      me,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        "aria-label": o("detail.expandPanel"),
                        onClick: () => p(!0, !1),
                        className: "absolute left-3 top-1/2 z-20 h-8 w-8 -translate-y-[calc(100%+0.375rem)] rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur",
                        children: /* @__PURE__ */ f.jsx(Lt, { className: "h-4 w-4 rotate-180" })
                      }
                    ),
                    /* @__PURE__ */ f.jsx(
                      me,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        "aria-label": o("detail.fullyCollapse"),
                        onClick: () => p(!0, !0, !0),
                        className: "absolute left-3 top-1/2 z-20 h-8 w-8 translate-y-[0.375rem] rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur",
                        children: /* @__PURE__ */ f.jsx(Lt, { className: "h-4 w-4" })
                      }
                    )
                  ] }) : null,
                  c && !d ? /* @__PURE__ */ f.jsx(
                    me,
                    {
                      type: "button",
                      size: "icon",
                      variant: "outline",
                      "aria-label": o("detail.collapse"),
                      onClick: () => p(!0, !0, !1),
                      className: "absolute right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur",
                      children: /* @__PURE__ */ f.jsx(Lt, { className: "h-4 w-4" })
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
function eR({
  items: e,
  current: t
}) {
  return /* @__PURE__ */ f.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-base", children: [
    e.map((n, r) => /* @__PURE__ */ f.jsxs("div", { className: "contents", children: [
      n.onClick ? /* @__PURE__ */ f.jsx(
        me,
        {
          type: "button",
          variant: "link",
          size: "sm",
          className: "h-auto px-0 text-base no-underline hover:no-underline",
          onClick: n.onClick,
          children: n.label
        }
      ) : /* @__PURE__ */ f.jsx("span", { className: "text-base", children: n.label }),
      /* @__PURE__ */ f.jsx("span", { className: "text-muted-foreground", children: ">" })
    ] }, `${n.label}-${r}`)),
    /* @__PURE__ */ f.jsx("h2", { className: "min-w-0 break-words text-xl font-semibold tracking-tight", children: t })
  ] });
}
function tR({
  breadcrumbs: e,
  actions: t,
  className: n
}) {
  const { t: r } = ke(), i = qe(Ll), o = i?.floating && !i.collapsed, s = i && !i.floating;
  return /* @__PURE__ */ f.jsxs(
    "div",
    {
      "data-detail-header": !0,
      className: H(
        "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
        n
      ),
      children: [
        /* @__PURE__ */ f.jsx("div", { className: "min-w-0 flex-1", children: e }),
        t ? /* @__PURE__ */ f.jsxs("div", { className: "flex shrink-0 items-center gap-2 self-start", children: [
          o ? /* @__PURE__ */ f.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => i.expandToNormalView(),
              children: [
                /* @__PURE__ */ f.jsx(Mc, { className: "mr-2 h-4 w-4" }),
                r("detail.expandView")
              ]
            }
          ) : null,
          s ? /* @__PURE__ */ f.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => i.switchToFloatingView(),
              children: [
                /* @__PURE__ */ f.jsx(Ic, { className: "mr-2 h-4 w-4" }),
                r("detail.floatingView")
              ]
            }
          ) : null,
          t
        ] }) : o || s ? /* @__PURE__ */ f.jsxs("div", { className: "flex shrink-0 items-center gap-2 self-start", children: [
          o ? /* @__PURE__ */ f.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => i.expandToNormalView(),
              children: [
                /* @__PURE__ */ f.jsx(Mc, { className: "mr-2 h-4 w-4" }),
                r("detail.expandView")
              ]
            }
          ) : null,
          s ? /* @__PURE__ */ f.jsxs(
            me,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: () => i.switchToFloatingView(),
              children: [
                /* @__PURE__ */ f.jsx(Ic, { className: "mr-2 h-4 w-4" }),
                r("detail.floatingView")
              ]
            }
          ) : null
        ] }) : null
      ]
    }
  );
}
function nR({
  children: e,
  className: t = "grid gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)] md:grid-cols-4"
}) {
  return /* @__PURE__ */ f.jsx("div", { className: t, children: e });
}
function rR({ label: e, value: t }) {
  return /* @__PURE__ */ f.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ f.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ f.jsx("div", { className: "text-sm font-medium", children: t })
  ] });
}
function JI({
  children: e,
  className: t = "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]"
}) {
  return /* @__PURE__ */ f.jsx("section", { className: t, children: e });
}
function iR({
  label: e,
  value: t
}) {
  return /* @__PURE__ */ f.jsxs(JI, { children: [
    /* @__PURE__ */ f.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ f.jsx("p", { className: "mt-2 whitespace-pre-wrap break-words text-sm leading-6", children: t?.trim() || "-" })
  ] });
}
function oR({
  rows: e,
  className: t,
  tableClassName: n,
  labelColumnClassName: r,
  scrollable: i = !1,
  scrollContainerClassName: o
}) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      className: H(
        "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
        i && "min-h-0",
        t
      ),
      children: /* @__PURE__ */ f.jsx(
        uo,
        {
          className: H(
            "w-full table-fixed",
            n
          ),
          containerClassName: H(
            "overflow-x-auto",
            i && "h-full max-h-full overflow-y-auto",
            o
          ),
          children: /* @__PURE__ */ f.jsx(fo, { children: e.map((s, a) => {
            const l = s.key ?? `detail-row-${a}`;
            return s.type === "section" ? /* @__PURE__ */ f.jsx(
              kt,
              {
                className: H(
                  "border-b border-border/60 bg-muted/20 hover:bg-muted/20",
                  s.rowClassName
                ),
                children: /* @__PURE__ */ f.jsx(
                  ft,
                  {
                    colSpan: 2,
                    className: H(
                      "px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-foreground",
                      s.sectionClassName
                    ),
                    children: s.section
                  }
                )
              },
              l
            ) : /* @__PURE__ */ f.jsxs(
              kt,
              {
                className: H(
                  "block border-b border-border/60 hover:bg-transparent md:table-row",
                  s.rowClassName
                ),
                children: [
                  /* @__PURE__ */ f.jsx(
                    ft,
                    {
                      className: H(
                        "block w-full border-border/60 px-4 pt-4 pb-2 align-top text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground md:table-cell md:border-r md:px-4 md:py-3 md:align-middle",
                        r ?? "md:w-[220px]",
                        s.labelClassName
                      ),
                      children: s.label
                    }
                  ),
                  /* @__PURE__ */ f.jsx(
                    ft,
                    {
                      className: H(
                        "block w-full px-4 pt-0 pb-4 text-sm md:table-cell md:px-4 md:py-3 md:align-middle",
                        s.valueClassName
                      ),
                      children: s.value
                    }
                  )
                ]
              },
              l
            );
          }) })
        }
      )
    }
  );
}
function sR({
  className: e,
  classKey: t,
  onOpenClass: n,
  buttonLabel: r
}) {
  const { t: i } = ke(), o = t?.trim() || "", s = r ?? i("detail.openClass");
  return /* @__PURE__ */ f.jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ f.jsx("span", { className: "break-words", children: e?.trim() || "-" }),
    /* @__PURE__ */ f.jsx(
      me,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        onClick: n,
        disabled: !o,
        children: s
      }
    )
  ] });
}
function aR({
  label: e,
  classKey: t,
  onOpenClass: n
}) {
  const { t: r } = ke(), i = t?.trim() || "", o = e ?? r("detail.class");
  return /* @__PURE__ */ f.jsxs("span", { className: "inline-flex items-center gap-1", children: [
    /* @__PURE__ */ f.jsx("span", { children: o }),
    /* @__PURE__ */ f.jsx(
      me,
      {
        type: "button",
        size: "icon",
        variant: "ghost",
        className: "h-5 w-5 p-0 text-muted-foreground hover:text-foreground",
        onClick: n,
        disabled: !i,
        children: /* @__PURE__ */ f.jsx(Lt, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
function lR({
  title: e,
  children: t
}) {
  return /* @__PURE__ */ f.jsxs("aside", { className: "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]", children: [
    /* @__PURE__ */ f.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground", children: e }),
    /* @__PURE__ */ f.jsx("div", { className: "mt-3 flex flex-col gap-2", children: t })
  ] });
}
function qI({
  tabs: e,
  activeTab: t,
  onChange: n
}) {
  const r = pe(/* @__PURE__ */ new Map()), i = pe(null), o = pe(++QI), s = pe(!1), a = e.find((u) => u.value === t)?.value ?? e[0]?.value, [l, c] = gl(() => ({
    left: 0,
    width: 0
  })), d = Ye(
    (u) => {
      if (!a)
        return Xe(o.current, "updatePill:no-active-tab", {
          activeTab: t,
          resolvedActiveTab: a,
          animate: u,
          tabs: e.map((g) => g.value)
        }), !1;
      const p = r.current.get(a);
      if (!p)
        return Xe(o.current, "updatePill:no-button", {
          activeTab: t,
          resolvedActiveTab: a,
          animate: u,
          availableButtons: Array.from(r.current.keys())
        }), !1;
      const h = p.offsetWidth;
      if (h <= 0)
        return Xe(o.current, "updatePill:zero-width", {
          activeTab: t,
          resolvedActiveTab: a,
          animate: u,
          offsetLeft: p.offsetLeft,
          offsetWidth: h,
          rect: p.getBoundingClientRect().toJSON()
        }), !1;
      const m = VI();
      return Xe(o.current, "updatePill:start", {
        activeTab: t,
        resolvedActiveTab: a,
        animate: u,
        offsetLeft: p.offsetLeft,
        offsetWidth: h,
        buttonRect: p.getBoundingClientRect().toJSON(),
        tabListRect: i.current?.getBoundingClientRect().toJSON()
      }), c.start({
        left: p.offsetLeft,
        width: h,
        immediate: !u,
        config: {
          tension: m.tabPillSpring.tension,
          friction: m.tabPillSpring.friction,
          clamp: !0
        }
      }), !0;
    },
    [t, c, a, e]
  );
  return cr(() => {
    let u = 0, p = 0;
    const h = 8, m = () => {
      const g = d(s.current);
      Xe(o.current, "layout-effect:measure", {
        attempts: p,
        measured: g,
        initialized: s.current
      }), !g && p < h && (p += 1, u = requestAnimationFrame(m));
    };
    return m(), s.current = !0, () => {
      u && cancelAnimationFrame(u);
    };
  }, [d]), ue(() => {
    Xe(o.current, "render-state", {
      activeTab: t,
      resolvedActiveTab: a,
      tabs: e.map((u) => u.value)
    });
  }, [t, a, e]), ue(() => {
    const u = () => {
      Xe(o.current, "window:resize"), d(!0);
    };
    return window.addEventListener("resize", u), () => {
      window.removeEventListener("resize", u);
    };
  }, [d]), ue(() => {
    if (typeof ResizeObserver > "u")
      return;
    const u = i.current, p = a ? r.current.get(a) : null;
    if (!u && !p)
      return;
    const h = new ResizeObserver(() => {
      Xe(o.current, "resize-observer"), d(!0);
    });
    return u && h.observe(u), p && h.observe(p), () => {
      h.disconnect();
    };
  }, [a, d]), ue(() => {
    if (typeof document > "u" || !("fonts" in document))
      return;
    let u = !1;
    return document.fonts.ready.then(() => {
      u || (Xe(o.current, "fonts:ready", {
        status: document.fonts.status
      }), d(!0));
    }), () => {
      u = !0;
    };
  }, [d]), /* @__PURE__ */ f.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border/70 bg-card/70 p-1 drop-shadow-md", children: /* @__PURE__ */ f.jsxs("div", { ref: i, className: "relative flex min-w-max gap-2", children: [
    /* @__PURE__ */ f.jsx(
      xl.div,
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
    e.map((u) => /* @__PURE__ */ f.jsx(
      "button",
      {
        ref: (p) => {
          p ? r.current.set(u.value, p) : r.current.delete(u.value), Xe(o.current, "button:ref", {
            tabValue: u.value,
            mounted: !!p,
            activeTab: t,
            resolvedActiveTab: a,
            offsetLeft: p?.offsetLeft,
            offsetWidth: p?.offsetWidth
          }), p && u.value === t && d(s.current);
        },
        type: "button",
        onClick: () => {
          Xe(o.current, "button:click", {
            tabValue: u.value,
            activeTab: t,
            resolvedActiveTab: a
          }), u.value !== a && n(u.value);
        },
        className: H(
          "relative z-10 shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
          a === u.value ? "text-primary-foreground" : u.hasPendingChanges ? "font-bold text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-accent-foreground"
        ),
        children: u.label
      },
      u.value
    ))
  ] }) });
}
function cR({
  tabs: e,
  activeTab: t,
  onChange: n,
  children: r,
  className: i,
  contentClassName: o,
  contentScrollable: s,
  scrollResetKey: a
}) {
  const l = qe(Ll), c = s ?? l?.contentScrollable ?? !1, d = pe(null), u = pe(
    a
  ), p = pe(
    l?.floating
  );
  return cr(() => {
    a !== void 0 && u.current !== a && (u.current = a, d.current && (d.current.scrollTop = 0));
  }, [a]), cr(() => {
    const h = l?.floating;
    p.current !== h && (p.current = h, h && d.current && (d.current.scrollTop = 0));
  }, [l?.floating]), /* @__PURE__ */ f.jsxs("section", { className: H("flex min-h-0 flex-col", i), children: [
    /* @__PURE__ */ f.jsx(
      "div",
      {
        "data-detail-tabs-wrap": !0,
        className: "shrink-0 overflow-visible pb-2",
        children: /* @__PURE__ */ f.jsx(
          qI,
          {
            tabs: e,
            activeTab: t,
            onChange: n
          }
        )
      }
    ),
    /* @__PURE__ */ f.jsx(
      "div",
      {
        ref: d,
        "data-detail-tab-content": !0,
        className: H(
          "mt-4 min-h-0 flex-1",
          c && "overflow-y-auto overflow-x-hidden pr-1",
          o
        ),
        children: r
      }
    )
  ] });
}
function KI(e) {
  return Number.isFinite(e) ? Math.max(0, e) : 0;
}
function uR({
  topLabel: e,
  primaryLabel: t,
  secondaryLabel: n,
  percent: r,
  bottomLabel: i,
  bottomLeftLabel: o,
  bottomRightLabel: s
}) {
  const a = KI(r), l = a > 100, c = Math.min(100, a);
  return /* @__PURE__ */ f.jsxs("div", { className: "flex min-w-[220px] flex-col gap-1.5", children: [
    e ? /* @__PURE__ */ f.jsx("div", { className: "truncate text-[11px] text-muted-foreground", children: e }) : null,
    /* @__PURE__ */ f.jsxs("div", { className: "flex items-center justify-between gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ f.jsx("span", { className: "truncate", children: t }),
      n ? /* @__PURE__ */ f.jsx("span", { className: "shrink-0 tabular-nums", children: n }) : null
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted/70", children: /* @__PURE__ */ f.jsx(
      "div",
      {
        className: `h-full rounded-full transition-[width] ${l ? "bg-destructive" : "bg-primary"}`,
        style: { width: `${c}%` }
      }
    ) }),
    o || s ? /* @__PURE__ */ f.jsxs("div", { className: "flex items-center justify-between gap-3 text-[11px] text-muted-foreground", children: [
      /* @__PURE__ */ f.jsx("span", { className: "truncate", children: o }),
      /* @__PURE__ */ f.jsx("span", { className: "truncate text-right", children: s })
    ] }) : i ? /* @__PURE__ */ f.jsx("div", { className: "truncate text-[11px] text-muted-foreground", children: i }) : null
  ] });
}
function dR({
  open: e,
  onOpenChange: t,
  trigger: n,
  onClear: r,
  onApply: i,
  children: o,
  className: s,
  gridClassName: a
}) {
  const { t: l } = ke();
  return /* @__PURE__ */ f.jsxs(Ba, { open: e, onOpenChange: t, children: [
    /* @__PURE__ */ f.jsx(La, { asChild: !0, children: n }),
    /* @__PURE__ */ f.jsx(Fa, { children: /* @__PURE__ */ f.jsx(
      Ga,
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
        children: /* @__PURE__ */ f.jsxs(
          "div",
          {
            className: H(
              "rounded-lg border border-border/60 bg-background px-4 pb-4 pt-3 shadow-lg",
              s
            ),
            children: [
              /* @__PURE__ */ f.jsxs("div", { className: "mb-3 flex items-center gap-2.5", children: [
                /* @__PURE__ */ f.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50", children: l("common.filters") }),
                /* @__PURE__ */ f.jsx("div", { className: "h-px flex-1 bg-border/40" })
              ] }),
              /* @__PURE__ */ f.jsx(
                "div",
                {
                  className: H(
                    "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(18rem,100%),1fr))] [&>*]:min-w-0",
                    a
                  ),
                  children: o
                }
              ),
              (r || i) && /* @__PURE__ */ f.jsxs("div", { className: "mt-4 flex items-center justify-end gap-2 border-t border-border/30 pt-3", children: [
                r && /* @__PURE__ */ f.jsx(me, { type: "button", size: "sm", variant: "ghost", onClick: r, children: l("common.clearAll") }),
                i && /* @__PURE__ */ f.jsx(me, { type: "button", size: "sm", onClick: i, children: l("common.applyFilters") })
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
const fR = Qi(function({
  open: t,
  onToggle: n,
  activeCount: r = 0,
  className: i,
  onClick: o,
  ...s
}, a) {
  const { t: l } = ke(), c = r > 0, d = (u) => {
    o?.(u), u.defaultPrevented || n?.();
  };
  return /* @__PURE__ */ f.jsxs(
    me,
    {
      ref: a,
      type: "button",
      variant: t || c ? "secondary" : "outline",
      onClick: d,
      className: H("gap-1.5", i),
      ...s,
      children: [
        /* @__PURE__ */ f.jsx(T0, { className: "size-4" }),
        l("common.filters"),
        c && /* @__PURE__ */ f.jsx("span", { className: "flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground", children: r })
      ]
    }
  );
});
function hR(e, t, n = "") {
  return e.get(t) ?? n;
}
function pR(e, t, n, r = 0) {
  const i = e.get(t);
  if (!i)
    return n;
  const o = Number.parseInt(i, 10);
  return Number.isNaN(o) || o < r ? n : o;
}
function mR(e, t, n) {
  const r = e.get(t);
  return r === "1" ? !0 : r === "0" ? !1 : n;
}
function gR(e, t) {
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
function xR(e) {
  if (!(e instanceof Error))
    return !1;
  const t = e.message.toLowerCase();
  return t.includes("403") || t.includes("forbidden") || t.includes("insufficient permission") || t.includes("insufficient permissions");
}
const XI = "edited_at is older than the current value. refresh data and retry with a newer edited_at";
function bR(e) {
  return e instanceof Error ? e.message.toLowerCase().includes(XI) : !1;
}
function yR({ ...e }) {
  return /* @__PURE__ */ f.jsx(ha, { "data-slot": "sheet", ...e });
}
function vR({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(Ud, { "data-slot": "sheet-trigger", ...e });
}
function wR({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(Nr, { "data-slot": "sheet-close", ...e });
}
function _I({
  ...e
}) {
  return /* @__PURE__ */ f.jsx(pa, { "data-slot": "sheet-portal", ...e });
}
function $I({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    ma,
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
function AR({
  className: e,
  children: t,
  side: n = "right",
  showCloseButton: r = !0,
  ...i
}) {
  const { t: o } = ke();
  return /* @__PURE__ */ f.jsxs(_I, { children: [
    /* @__PURE__ */ f.jsx($I, {}),
    /* @__PURE__ */ f.jsxs(
      ga,
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
        ...i,
        children: [
          t,
          r && /* @__PURE__ */ f.jsxs(Nr, { className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
            /* @__PURE__ */ f.jsx(Tr, { className: "size-4" }),
            /* @__PURE__ */ f.jsx("span", { className: "sr-only", children: o("common.close") })
          ] })
        ]
      }
    )
  ] });
}
function kR({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: H("flex flex-col gap-1.5 p-4", e),
      ...t
    }
  );
}
function ER({ className: e, ...t }) {
  return /* @__PURE__ */ f.jsx(
    "div",
    {
      "data-slot": "sheet-footer",
      className: H("mt-auto flex flex-col gap-2 p-4", e),
      ...t
    }
  );
}
function CR({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    xa,
    {
      "data-slot": "sheet-title",
      className: H("font-semibold text-foreground", e),
      ...t
    }
  );
}
function SR({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ f.jsx(
    Qd,
    {
      "data-slot": "sheet-description",
      className: H("text-sm text-muted-foreground", e),
      ...t
    }
  );
}
function eP(e) {
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
async function tP() {
  const e = await Wt(
    `${yi.baseURL}/users/me/notifications`,
    { method: "GET", headers: { Accept: "application/json" }, credentials: "include" }
  );
  if (!e.ok)
    throw new Error(`Failed to fetch notifications: ${e.status} ${e.statusText}`);
  const t = await e.json();
  return (Array.isArray(t) ? t : Array.isArray(t?.notifications) ? t.notifications : []).map(eP).filter((r) => r !== null);
}
async function nP(e) {
  try {
    await Wt(cg(e), {
      method: "PATCH",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ dismissed: !0 })
    });
  } catch {
  }
}
function rP(e) {
  const t = Date.now();
  return !(e.start_time && new Date(e.start_time).getTime() > t || e.end_time && new Date(e.end_time).getTime() < t);
}
const tg = Nt(null);
function NR({ children: e }) {
  const { isAuthenticated: t } = $a(), [n, r] = ge([]), [i, o] = ge(/* @__PURE__ */ new Set()), [s, a] = ge(!1), l = pe(!1), c = Ye(async () => {
    if (!l.current) {
      l.current = !0, a(!0);
      try {
        const b = await tP();
        r(b);
      } catch {
      } finally {
        l.current = !1, a(!1);
      }
    }
  }, []), d = Ye(() => {
    c();
  }, [c]);
  ue(() => {
    if (!t) {
      r([]), o(/* @__PURE__ */ new Set());
      return;
    }
    c();
  }, [t]);
  const u = Ye((b) => {
    o((A) => /* @__PURE__ */ new Set([...A, b])), nP(b);
  }, []), p = n.filter(
    (b) => rP(b) && !i.has(b.appsheet_key)
  ), h = p.filter((b) => b.priority === "IMMEDIATE"), m = p.filter((b) => b.priority === "URGENT"), g = p.filter((b) => b.priority === "INFORMATIVE"), x = p.length;
  return /* @__PURE__ */ f.jsx(
    tg.Provider,
    {
      value: { immediate: h, urgent: m, informative: g, unreadCount: x, isLoading: s, dismiss: u, refetch: d },
      children: e
    }
  );
}
function Fl() {
  const e = qe(tg);
  if (!e) throw new Error("useNotifications must be used within NotificationProvider");
  return e;
}
const Gl = Nt({
  fab: null,
  setFAB: () => {
  }
});
function jR({ children: e }) {
  const [t, n] = ge(null), r = Ye(
    (i) => n(i),
    []
  );
  return /* @__PURE__ */ f.jsx(Gl.Provider, { value: { fab: t, setFAB: r }, children: e });
}
function iP() {
  return qe(Gl);
}
function MR(e, t = "Create") {
  const { setFAB: n } = qe(Gl), r = pe(null);
  r.current = e;
  const i = !!e;
  ue(() => {
    if (!i) {
      n(null);
      return;
    }
    return n({ onClick: () => r.current?.(), label: t }), () => n(null);
  }, [i, t, n]);
}
function IR({
  className: e,
  icon: t
}) {
  const { fab: n } = iP();
  return n ? /* @__PURE__ */ f.jsx(
    "button",
    {
      type: "button",
      className: H(
        "fixed bottom-20 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 md:hidden",
        e
      ),
      onClick: n.onClick,
      "aria-label": n.label ?? "Create",
      children: t ?? /* @__PURE__ */ f.jsx(N0, { className: "size-6" })
    }
  ) : null;
}
function PR() {
  const { t: e } = ke(), { informative: t, unreadCount: n, isLoading: r, dismiss: i, refetch: o } = Fl(), [s, a] = ge(!1), l = (c) => {
    !c && t.length > 0 && t.forEach((d) => i(d.appsheet_key)), a(c);
  };
  return /* @__PURE__ */ f.jsxs(Ba, { open: s, onOpenChange: l, children: [
    /* @__PURE__ */ f.jsx(La, { asChild: !0, children: /* @__PURE__ */ f.jsxs(
      "button",
      {
        type: "button",
        className: "relative flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-muted/45 text-foreground transition-colors hover:bg-muted",
        "aria-label": e("notificationBell.ariaLabel", void 0, {
          suffix: n > 0 ? e("notificationBell.unreadSuffix", void 0, { count: n }) : ""
        }),
        children: [
          /* @__PURE__ */ f.jsx(Lh, { className: "size-4" }),
          n > 0 && /* @__PURE__ */ f.jsx("span", { className: "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground", children: n > 99 ? "99+" : n })
        ]
      }
    ) }),
    /* @__PURE__ */ f.jsx(Fa, { children: /* @__PURE__ */ f.jsxs(
      Ga,
      {
        align: "end",
        sideOffset: 8,
        className: H(
          "z-50 w-80 rounded-xl border border-border/70 bg-popover shadow-lg outline-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
          "duration-150"
        ),
        children: [
          /* @__PURE__ */ f.jsxs("div", { className: "flex items-center justify-between border-b border-border/60 px-4 py-3", children: [
            /* @__PURE__ */ f.jsx("p", { className: "text-sm font-semibold text-foreground", children: e("notificationBell.title") }),
            /* @__PURE__ */ f.jsxs("div", { className: "flex items-center gap-2", children: [
              t.length > 0 && /* @__PURE__ */ f.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    t.forEach((c) => i(c.appsheet_key)), a(!1);
                  },
                  className: "text-xs text-muted-foreground transition-colors hover:text-foreground",
                  children: e("common.clearAll")
                }
              ),
              /* @__PURE__ */ f.jsx(
                "button",
                {
                  type: "button",
                  onClick: o,
                  disabled: r,
                  className: "text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
                  "aria-label": e("notificationBell.refresh"),
                  children: /* @__PURE__ */ f.jsx(M0, { className: H("size-3.5", r && "animate-spin") })
                }
              )
            ] })
          ] }),
          t.length === 0 ? /* @__PURE__ */ f.jsx("div", { className: "px-4 py-8 text-center text-sm text-muted-foreground", children: e("notificationBell.empty") }) : /* @__PURE__ */ f.jsx("ul", { className: "max-h-80 divide-y divide-border/50 overflow-y-auto", children: t.map((c) => /* @__PURE__ */ f.jsxs("li", { className: "flex items-start gap-3 px-4 py-3", children: [
            /* @__PURE__ */ f.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ f.jsx("p", { className: "text-sm font-medium leading-snug text-foreground", children: c.title }),
              c.description && /* @__PURE__ */ f.jsx("p", { className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground", children: c.description })
            ] }),
            /* @__PURE__ */ f.jsx(
              "button",
              {
                type: "button",
                onClick: () => i(c.appsheet_key),
                className: "mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground",
                "aria-label": e("notificationBell.dismiss"),
                children: /* @__PURE__ */ f.jsx(Tr, { className: "size-3.5" })
              }
            )
          ] }, c.appsheet_key)) })
        ]
      }
    ) })
  ] });
}
function RR() {
  const { t: e } = ke(), { immediate: t, dismiss: n } = Fl(), r = t[0] ?? null;
  return r ? /* @__PURE__ */ f.jsx(ha, { open: !0, children: /* @__PURE__ */ f.jsxs(pa, { children: [
    /* @__PURE__ */ f.jsx(ma, { className: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" }),
    /* @__PURE__ */ f.jsxs(
      ga,
      {
        onEscapeKeyDown: (i) => i.preventDefault(),
        onInteractOutside: (i) => i.preventDefault(),
        className: "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "aria-describedby": r.description ? "immediate-desc" : void 0,
        children: [
          /* @__PURE__ */ f.jsxs("div", { className: "flex flex-col items-center px-8 py-10 text-center", children: [
            /* @__PURE__ */ f.jsx("span", { className: "mb-5 flex size-10 items-center justify-center rounded-full bg-muted ring-1 ring-border", children: /* @__PURE__ */ f.jsx(Lh, { className: "size-4 text-foreground" }) }),
            t.length > 1 && /* @__PURE__ */ f.jsx("p", { className: "mb-1 text-xs text-muted-foreground", children: e("notification.immediateCount", void 0, { count: t.length }) }),
            /* @__PURE__ */ f.jsx(xa, { className: "text-lg font-semibold leading-snug text-foreground", children: r.title }),
            r.description && /* @__PURE__ */ f.jsx("p", { id: "immediate-desc", className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: r.description })
          ] }),
          /* @__PURE__ */ f.jsx("div", { className: "flex justify-center border-t border-border/60 px-6 py-4", children: /* @__PURE__ */ f.jsx(me, { onClick: () => n(r.appsheet_key), children: e("notification.acknowledge") }) })
        ]
      }
    )
  ] }) }) : null;
}
function DR() {
  const { t: e } = ke(), { urgent: t, dismiss: n } = Fl();
  return t.length === 0 ? null : /* @__PURE__ */ f.jsx("div", { className: "space-y-2", children: t.map((r) => /* @__PURE__ */ f.jsxs(
    "div",
    {
      role: "alert",
      className: "flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300",
      children: [
        /* @__PURE__ */ f.jsx(L0, { className: "mt-0.5 size-4 shrink-0 text-amber-500 dark:text-amber-400" }),
        /* @__PURE__ */ f.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ f.jsx("p", { className: "text-sm font-semibold leading-snug", children: r.title }),
          r.description && /* @__PURE__ */ f.jsx("p", { className: "mt-0.5 text-sm opacity-80", children: r.description })
        ] }),
        /* @__PURE__ */ f.jsx(
          "button",
          {
            type: "button",
            onClick: () => n(r.appsheet_key),
            className: "mt-0.5 shrink-0 opacity-60 transition-opacity hover:opacity-100",
            "aria-label": e("notification.dismiss"),
            children: /* @__PURE__ */ f.jsx(Tr, { className: "size-4" })
          }
        )
      ]
    },
    r.appsheet_key
  )) });
}
export {
  yi as API_CONFIG,
  dR as AdvancedFiltersPanel,
  fR as AdvancedFiltersToggle,
  ep as AppTheme,
  jP as AuthProvider,
  WI as BackgroundDetailViewContext,
  yA as BaseFormDialog,
  me as Button,
  cA as Card,
  IP as CardAction,
  hA as CardContent,
  fA as CardDescription,
  ZP as CardField,
  PP as CardFooter,
  uA as CardHeader,
  dA as CardTitle,
  TP as ColorModeIconDropdown,
  tp as ColorModeSelect,
  zl as DETAIL_HIDDEN_COLLAPSED_VALUE,
  lR as DetailActionPanel,
  eR as DetailBreadcrumbs,
  JI as DetailCard,
  aR as DetailClassHeaderLabel,
  sR as DetailClassLinkValue,
  oR as DetailFieldsTable,
  tR as DetailHeader,
  nR as DetailSummaryGrid,
  rR as DetailSummaryItem,
  cR as DetailTabbedSection,
  qI as DetailTabs,
  iR as DetailTextBlock,
  $P as DetailView,
  Va as Dialog,
  fP as DialogClose,
  Wa as DialogContent,
  Jh as DialogDescription,
  Wh as DialogFooter,
  Ja as DialogHeader,
  j1 as DialogOverlay,
  N1 as DialogPortal,
  qa as DialogTitle,
  dP as DialogTrigger,
  ao as DropdownMenu,
  gP as DropdownMenuCheckboxItem,
  co as DropdownMenuContent,
  pP as DropdownMenuGroup,
  mP as DropdownMenuItem,
  Q1 as DropdownMenuLabel,
  hP as DropdownMenuPortal,
  Xa as DropdownMenuRadioGroup,
  tn as DropdownMenuRadioItem,
  Z1 as DropdownMenuSeparator,
  xP as DropdownMenuShortcut,
  bP as DropdownMenuSub,
  vP as DropdownMenuSubContent,
  yP as DropdownMenuSubTrigger,
  lo as DropdownMenuTrigger,
  hi as ENGLISH_MESSAGES,
  G1 as ForgotPassword,
  AA as FormTableDialog,
  vA as FormTableRow,
  wA as FormTableSection,
  KP as GuideIconButton,
  XP as GuideMenuButton,
  qP as GuidesSidebarContent,
  uP as I18nProvider,
  RR as ImmediateNotificationDialog,
  en as Input,
  Cn as Label,
  zP as LazyViewFallback,
  V1 as LocaleSelect,
  WP as MobileBottomBar,
  VP as MobileCardList,
  jR as MobileFABProvider,
  IR as MobileFloatingActionButton,
  FP as MultiSelectDropdown,
  PR as NotificationBell,
  NR as NotificationProvider,
  $k as PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS,
  Wk as PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL,
  eE as PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS,
  Xk as PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT,
  qk as PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL,
  Kk as PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL,
  Vk as PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL,
  _k as PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG,
  Jk as PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL,
  HP as PatchRecordDialog,
  UP as PendingChangesBar,
  DP as PendingChangesProvider,
  uR as ProgressMetricCell,
  RP as ResetPassword,
  el as SearchableSelect,
  Yw as Separator,
  yR as Sheet,
  wR as SheetClose,
  AR as SheetContent,
  SR as SheetDescription,
  ER as SheetFooter,
  kR as SheetHeader,
  CR as SheetTitle,
  vR as SheetTrigger,
  MP as SignIn,
  QP as SimpleDataTable,
  Os as SitemarkIcon,
  pr as StatusBanner,
  uo as Table,
  fo as TableBody,
  YP as TableCaption,
  ft as TableCell,
  GP as TableFooter,
  ap as TableHead,
  sp as TableHeader,
  kt as TableRow,
  bA as Textarea,
  DR as UrgentNotificationBanner,
  JP as UserGuideView,
  jI as buildGuides,
  Gw as buttonVariants,
  LP as canAccessManagement,
  lP as configureApi,
  wP as formatDate,
  AP as formatUserTimestamp,
  _P as getDetailReturnLocation,
  mR as getQueryBoolean,
  pR as getQueryNumber,
  hR as getQueryParam,
  NP as getTextareaRows,
  tl as getUserScopes,
  gA as hasAnyUserScope,
  BP as hasUserScope,
  bR as isOutdatedEditedAtConflictError,
  xR as isPermissionDeniedError,
  NI as parseGuide,
  eg as readStoredDetailViewMode,
  GI as resolveDetailViewMode,
  FI as stripDetailViewModeFromPath,
  EP as toBackendBoundary,
  SP as toBackendTimeValue,
  kP as toBackendTimestamp,
  CP as toDateTimeLocalValue,
  YI as toDetailReturnUrl,
  gR as updateSearchParams,
  $a as useAuth,
  $h as useColorMode,
  UI as useDetailViewMode,
  ke as useI18n,
  MR as useMobileFAB,
  iP as useMobileFABContext,
  Fl as useNotifications,
  OP as usePendingChanges,
  HI as useResolvedDetailViewMode,
  sd as writeDetailViewMode
};
