import * as e from "react";
import t, { Fragment as n, createContext as r, createElement as i, forwardRef as a, useCallback as o, useContext as s, useEffect as c, useId as l, useLayoutEffect as u, useMemo as d, useRef as f, useState as p } from "react";
import * as m from "react-dom";
import h, { createPortal as g, unstable_batchedUpdates as _ } from "react-dom";
//#region \0rolldown/runtime.js
var v = Object.create, y = Object.defineProperty, b = Object.getOwnPropertyDescriptor, x = Object.getOwnPropertyNames, S = Object.getPrototypeOf, C = Object.prototype.hasOwnProperty, w = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), T = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = x(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !C.call(e, s) && s !== n && y(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = b(t, s)) || r.enumerable
	});
	return e;
}, E = (e, t, n) => (n = e == null ? {} : v(S(e)), T(t || !e || !e.__esModule ? y(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), D = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), O = "https://api.springboard.vn";
function k(e) {
	O = e.baseUrl;
}
var A = {
	get baseURL() {
		return O;
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
function j(e) {
	return `${A.baseURL}${A.endpoints[e]}`;
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function M(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = M(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function N() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = M(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/class-variance-authority/dist/index.mjs
var P = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, F = N, I = (e, t) => (n) => {
	if (t?.variants == null) return F(e, n?.class, n?.className);
	let { variants: r, defaultVariants: i } = t, a = Object.keys(r).map((e) => {
		let t = n?.[e], a = i?.[e];
		if (t === null) return null;
		let o = P(t) || P(a);
		return r[e][o];
	}), o = n && Object.entries(n).reduce((e, t) => {
		let [n, r] = t;
		return r === void 0 || (e[n] = r), e;
	}, {});
	return F(e, a, t?.compoundVariants?.reduce((e, t) => {
		let { class: n, className: r, ...a } = t;
		return Object.entries(a).every((e) => {
			let [t, n] = e;
			return Array.isArray(n) ? n.includes({
				...i,
				...o
			}[t]) : {
				...i,
				...o
			}[t] === n;
		}) ? [
			...e,
			n,
			r
		] : e;
	}, []), n?.class, n?.className);
};
//#endregion
//#region node_modules/@radix-ui/react-compose-refs/dist/index.mjs
function ee(e, t) {
	if (typeof e == "function") return e(t);
	e != null && (e.current = t);
}
function te(...e) {
	return (t) => {
		let n = !1, r = e.map((e) => {
			let r = ee(e, t);
			return !n && typeof r == "function" && (n = !0), r;
		});
		if (n) return () => {
			for (let t = 0; t < r.length; t++) {
				let n = r[t];
				typeof n == "function" ? n() : ee(e[t], null);
			}
		};
	};
}
function L(...t) {
	return e.useCallback(te(...t), t);
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var ne = /* @__PURE__ */ w(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), R = /* @__PURE__ */ w(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === k ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case _: return "Fragment";
				case y: return "Profiler";
				case v: return "StrictMode";
				case C: return "Suspense";
				case w: return "SuspenseList";
				case O: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case g: return "Portal";
				case x: return e.displayName || "Context";
				case b: return (e._context.displayName || "Context") + ".Consumer";
				case S:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case T: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case E:
					n = e._payload, e = e._init;
					try {
						return t(e(n));
					} catch {}
			}
			return null;
		}
		function n(e) {
			return "" + e;
		}
		function r(e) {
			try {
				n(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var r = t.error, i = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return r.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", i), n(e);
			}
		}
		function i(e) {
			if (e === _) return "<>";
			if (typeof e == "object" && e && e.$$typeof === E) return "<...>";
			try {
				var n = t(e);
				return n ? "<" + n + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function a() {
			var e = A.A;
			return e === null ? null : e.getOwner();
		}
		function o() {
			return Error("react-stack-top-frame");
		}
		function s(e) {
			if (j.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function c(e, t) {
			function n() {
				P || (P = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function l() {
			var e = t(this.type);
			return F[e] || (F[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function u(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: h,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: l
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function d(e, n, i, o, l, d) {
			var p = n.children;
			if (p !== void 0) if (o) if (M(p)) {
				for (o = 0; o < p.length; o++) f(p[o]);
				Object.freeze && Object.freeze(p);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else f(p);
			if (j.call(n, "key")) {
				p = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", te[p + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, p, m, p), te[p + o] = !0);
			}
			if (p = null, i !== void 0 && (r(i), p = "" + i), s(n) && (r(n.key), p = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return p && c(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), u(e, p, i, a(), l, d);
		}
		function f(e) {
			p(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === E && (e._payload.status === "fulfilled" ? p(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function p(e) {
			return typeof e == "object" && !!e && e.$$typeof === h;
		}
		var m = D("react"), h = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), b = Symbol.for("react.consumer"), x = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), w = Symbol.for("react.suspense_list"), T = Symbol.for("react.memo"), E = Symbol.for("react.lazy"), O = Symbol.for("react.activity"), k = Symbol.for("react.client.reference"), A = m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, j = Object.prototype.hasOwnProperty, M = Array.isArray, N = console.createTask ? console.createTask : function() {
			return null;
		};
		m = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var P, F = {}, I = m.react_stack_bottom_frame.bind(m, o)(), ee = N(i(o)), te = {};
		e.Fragment = _, e.jsx = function(e, t, n) {
			var r = 1e4 > A.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !1, r ? Error("react-stack-top-frame") : I, r ? N(i(e)) : ee);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > A.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !0, r ? Error("react-stack-top-frame") : I, r ? N(i(e)) : ee);
		};
	})();
})), z = (/* @__PURE__ */ w(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = ne() : t.exports = R();
})))();
/* @__NO_SIDE_EFFECTS__ */
function re(t) {
	let n = /* @__PURE__ */ B(t), r = e.forwardRef((t, r) => {
		let { children: i, ...a } = t, o = e.Children.toArray(i), s = o.find(oe);
		if (s) {
			let t = s.props.children, i = o.map((n) => n === s ? e.Children.count(t) > 1 ? e.Children.only(null) : e.isValidElement(t) ? t.props.children : null : n);
			return /* @__PURE__ */ (0, z.jsx)(n, {
				...a,
				ref: r,
				children: e.isValidElement(t) ? e.cloneElement(t, void 0, i) : null
			});
		}
		return /* @__PURE__ */ (0, z.jsx)(n, {
			...a,
			ref: r,
			children: i
		});
	});
	return r.displayName = `${t}.Slot`, r;
}
var ie = /* @__PURE__ */ re("Slot");
/* @__NO_SIDE_EFFECTS__ */
function B(t) {
	let n = e.forwardRef((t, n) => {
		let { children: r, ...i } = t;
		if (e.isValidElement(r)) {
			let t = ce(r), a = se(i, r.props);
			return r.type !== e.Fragment && (a.ref = n ? te(n, t) : t), e.cloneElement(r, a);
		}
		return e.Children.count(r) > 1 ? e.Children.only(null) : null;
	});
	return n.displayName = `${t}.SlotClone`, n;
}
var ae = Symbol("radix.slottable");
function oe(t) {
	return e.isValidElement(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === ae;
}
function se(e, t) {
	let n = { ...t };
	for (let r in t) {
		let i = e[r], a = t[r];
		/^on[A-Z]/.test(r) ? i && a ? n[r] = (...e) => {
			let t = a(...e);
			return i(...e), t;
		} : i && (n[r] = i) : r === "style" ? n[r] = {
			...i,
			...a
		} : r === "className" && (n[r] = [i, a].filter(Boolean).join(" "));
	}
	return {
		...e,
		...n
	};
}
function ce(e) {
	let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
	return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
//#endregion
//#region node_modules/@radix-ui/react-primitive/dist/index.mjs
var V = [
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
].reduce((t, n) => {
	let r = /* @__PURE__ */ re(`Primitive.${n}`), i = e.forwardRef((e, t) => {
		let { asChild: i, ...a } = e, o = i ? r : n;
		return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ (0, z.jsx)(o, {
			...a,
			ref: t
		});
	});
	return i.displayName = `Primitive.${n}`, {
		...t,
		[n]: i
	};
}, {});
function le(e, t) {
	e && m.flushSync(() => e.dispatchEvent(t));
}
//#endregion
//#region node_modules/@radix-ui/react-context/dist/index.mjs
function ue(t, n) {
	let r = e.createContext(n), i = (t) => {
		let { children: n, ...i } = t, a = e.useMemo(() => i, Object.values(i));
		return /* @__PURE__ */ (0, z.jsx)(r.Provider, {
			value: a,
			children: n
		});
	};
	i.displayName = t + "Provider";
	function a(i) {
		let a = e.useContext(r);
		if (a) return a;
		if (n !== void 0) return n;
		throw Error(`\`${i}\` must be used within \`${t}\``);
	}
	return [i, a];
}
function de(t, n = []) {
	let r = [];
	function i(n, i) {
		let a = e.createContext(i), o = r.length;
		r = [...r, i];
		let s = (n) => {
			let { scope: r, children: i, ...s } = n, c = r?.[t]?.[o] || a, l = e.useMemo(() => s, Object.values(s));
			return /* @__PURE__ */ (0, z.jsx)(c.Provider, {
				value: l,
				children: i
			});
		};
		s.displayName = n + "Provider";
		function c(r, s) {
			let c = s?.[t]?.[o] || a, l = e.useContext(c);
			if (l) return l;
			if (i !== void 0) return i;
			throw Error(`\`${r}\` must be used within \`${n}\``);
		}
		return [s, c];
	}
	let a = () => {
		let n = r.map((t) => e.createContext(t));
		return function(r) {
			let i = r?.[t] || n;
			return e.useMemo(() => ({ [`__scope${t}`]: {
				...r,
				[t]: i
			} }), [r, i]);
		};
	};
	return a.scopeName = t, [i, fe(a, ...n)];
}
function fe(...t) {
	let n = t[0];
	if (t.length === 1) return n;
	let r = () => {
		let r = t.map((e) => ({
			useScope: e(),
			scopeName: e.scopeName
		}));
		return function(t) {
			let i = r.reduce((e, { useScope: n, scopeName: r }) => {
				let i = n(t)[`__scope${r}`];
				return {
					...e,
					...i
				};
			}, {});
			return e.useMemo(() => ({ [`__scope${n.scopeName}`]: i }), [i]);
		};
	};
	return r.scopeName = n.scopeName, r;
}
//#endregion
//#region node_modules/@radix-ui/react-collection/dist/index.mjs
function pe(e) {
	let n = e + "CollectionProvider", [r, i] = de(n), [a, o] = r(n, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	}), s = (e) => {
		let { scope: n, children: r } = e, i = t.useRef(null), o = t.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ (0, z.jsx)(a, {
			scope: n,
			itemMap: o,
			collectionRef: i,
			children: r
		});
	};
	s.displayName = n;
	let c = e + "CollectionSlot", l = /* @__PURE__ */ re(c), u = t.forwardRef((e, t) => {
		let { scope: n, children: r } = e;
		return /* @__PURE__ */ (0, z.jsx)(l, {
			ref: L(t, o(c, n).collectionRef),
			children: r
		});
	});
	u.displayName = c;
	let d = e + "CollectionItemSlot", f = "data-radix-collection-item", p = /* @__PURE__ */ re(d), m = t.forwardRef((e, n) => {
		let { scope: r, children: i, ...a } = e, s = t.useRef(null), c = L(n, s), l = o(d, r);
		return t.useEffect(() => (l.itemMap.set(s, {
			ref: s,
			...a
		}), () => void l.itemMap.delete(s))), /* @__PURE__ */ (0, z.jsx)(p, {
			[f]: "",
			ref: c,
			children: i
		});
	});
	m.displayName = d;
	function h(n) {
		let r = o(e + "CollectionConsumer", n);
		return t.useCallback(() => {
			let e = r.collectionRef.current;
			if (!e) return [];
			let t = Array.from(e.querySelectorAll(`[${f}]`));
			return Array.from(r.itemMap.values()).sort((e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current));
		}, [r.collectionRef, r.itemMap]);
	}
	return [
		{
			Provider: s,
			Slot: u,
			ItemSlot: m
		},
		h,
		i
	];
}
typeof window < "u" && window.document && window.document.createElement;
function H(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
	return function(r) {
		if (e?.(r), n === !1 || !r.defaultPrevented) return t?.(r);
	};
}
//#endregion
//#region node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var me = globalThis?.document ? e.useLayoutEffect : () => {}, he = e.useInsertionEffect || me;
function ge({ prop: t, defaultProp: n, onChange: r = () => {}, caller: i }) {
	let [a, o, s] = _e({
		defaultProp: n,
		onChange: r
	}), c = t !== void 0, l = c ? t : a;
	{
		let n = e.useRef(t !== void 0);
		e.useEffect(() => {
			let e = n.current;
			e !== c && console.warn(`${i} is changing from ${e ? "controlled" : "uncontrolled"} to ${c ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`), n.current = c;
		}, [c, i]);
	}
	return [l, e.useCallback((e) => {
		if (c) {
			let n = ve(e) ? e(t) : e;
			n !== t && s.current?.(n);
		} else o(e);
	}, [
		c,
		t,
		o,
		s
	])];
}
function _e({ defaultProp: t, onChange: n }) {
	let [r, i] = e.useState(t), a = e.useRef(r), o = e.useRef(n);
	return he(() => {
		o.current = n;
	}, [n]), e.useEffect(() => {
		a.current !== r && (o.current?.(r), a.current = r);
	}, [r, a]), [
		r,
		i,
		o
	];
}
function ve(e) {
	return typeof e == "function";
}
//#endregion
//#region node_modules/@radix-ui/react-presence/dist/index.mjs
function ye(t, n) {
	return e.useReducer((e, t) => n[e][t] ?? e, t);
}
var be = (t) => {
	let { present: n, children: r } = t, i = xe(n), a = typeof r == "function" ? r({ present: i.isPresent }) : e.Children.only(r), o = L(i.ref, Ce(a));
	return typeof r == "function" || i.isPresent ? e.cloneElement(a, { ref: o }) : null;
};
be.displayName = "Presence";
function xe(t) {
	let [n, r] = e.useState(), i = e.useRef(null), a = e.useRef(t), o = e.useRef("none"), [s, c] = ye(t ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	return e.useEffect(() => {
		let e = Se(i.current);
		o.current = s === "mounted" ? e : "none";
	}, [s]), me(() => {
		let e = i.current, n = a.current;
		if (n !== t) {
			let r = o.current, i = Se(e);
			t ? c("MOUNT") : i === "none" || e?.display === "none" ? c("UNMOUNT") : c(n && r !== i ? "ANIMATION_OUT" : "UNMOUNT"), a.current = t;
		}
	}, [t, c]), me(() => {
		if (n) {
			let e, t = n.ownerDocument.defaultView ?? window, r = (r) => {
				let o = Se(i.current).includes(CSS.escape(r.animationName));
				if (r.target === n && o && (c("ANIMATION_END"), !a.current)) {
					let r = n.style.animationFillMode;
					n.style.animationFillMode = "forwards", e = t.setTimeout(() => {
						n.style.animationFillMode === "forwards" && (n.style.animationFillMode = r);
					});
				}
			}, s = (e) => {
				e.target === n && (o.current = Se(i.current));
			};
			return n.addEventListener("animationstart", s), n.addEventListener("animationcancel", r), n.addEventListener("animationend", r), () => {
				t.clearTimeout(e), n.removeEventListener("animationstart", s), n.removeEventListener("animationcancel", r), n.removeEventListener("animationend", r);
			};
		} else c("ANIMATION_END");
	}, [n, c]), {
		isPresent: ["mounted", "unmountSuspended"].includes(s),
		ref: e.useCallback((e) => {
			i.current = e ? getComputedStyle(e) : null, r(e);
		}, [])
	};
}
function Se(e) {
	return e?.animationName || "none";
}
function Ce(e) {
	let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
	return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
//#endregion
//#region node_modules/@radix-ui/react-id/dist/index.mjs
var we = e.useId || (() => void 0), Te = 0;
function Ee(t) {
	let [n, r] = e.useState(we());
	return me(() => {
		t || r((e) => e ?? String(Te++));
	}, [t]), t || (n ? `radix-${n}` : "");
}
//#endregion
//#region node_modules/@radix-ui/react-direction/dist/index.mjs
var De = e.createContext(void 0);
function Oe(t) {
	let n = e.useContext(De);
	return t || n || "ltr";
}
//#endregion
//#region node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
function ke(t) {
	let n = e.useRef(t);
	return e.useEffect(() => {
		n.current = t;
	}), e.useMemo(() => (...e) => n.current?.(...e), []);
}
//#endregion
//#region node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
function Ae(t, n = globalThis?.document) {
	let r = ke(t);
	e.useEffect(() => {
		let e = (e) => {
			e.key === "Escape" && r(e);
		};
		return n.addEventListener("keydown", e, { capture: !0 }), () => n.removeEventListener("keydown", e, { capture: !0 });
	}, [r, n]);
}
//#endregion
//#region node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var je = "DismissableLayer", Me = "dismissableLayer.update", Ne = "dismissableLayer.pointerDownOutside", Pe = "dismissableLayer.focusOutside", Fe, Ie = e.createContext({
	layers: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set()
}), Le = e.forwardRef((t, n) => {
	let { disableOutsidePointerEvents: r = !1, onEscapeKeyDown: i, onPointerDownOutside: a, onFocusOutside: o, onInteractOutside: s, onDismiss: c, ...l } = t, u = e.useContext(Ie), [d, f] = e.useState(null), p = d?.ownerDocument ?? globalThis?.document, [, m] = e.useState({}), h = L(n, (e) => f(e)), g = Array.from(u.layers), [_] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1), v = g.indexOf(_), y = d ? g.indexOf(d) : -1, b = u.layersWithOutsidePointerEventsDisabled.size > 0, x = y >= v, S = Be((e) => {
		let t = e.target, n = [...u.branches].some((e) => e.contains(t));
		!x || n || (a?.(e), s?.(e), e.defaultPrevented || c?.());
	}, p), C = Ve((e) => {
		let t = e.target;
		[...u.branches].some((e) => e.contains(t)) || (o?.(e), s?.(e), e.defaultPrevented || c?.());
	}, p);
	return Ae((e) => {
		y === u.layers.size - 1 && (i?.(e), !e.defaultPrevented && c && (e.preventDefault(), c()));
	}, p), e.useEffect(() => {
		if (d) return r && (u.layersWithOutsidePointerEventsDisabled.size === 0 && (Fe = p.body.style.pointerEvents, p.body.style.pointerEvents = "none"), u.layersWithOutsidePointerEventsDisabled.add(d)), u.layers.add(d), He(), () => {
			r && u.layersWithOutsidePointerEventsDisabled.size === 1 && (p.body.style.pointerEvents = Fe);
		};
	}, [
		d,
		p,
		r,
		u
	]), e.useEffect(() => () => {
		d && (u.layers.delete(d), u.layersWithOutsidePointerEventsDisabled.delete(d), He());
	}, [d, u]), e.useEffect(() => {
		let e = () => m({});
		return document.addEventListener(Me, e), () => document.removeEventListener(Me, e);
	}, []), /* @__PURE__ */ (0, z.jsx)(V.div, {
		...l,
		ref: h,
		style: {
			pointerEvents: b ? x ? "auto" : "none" : void 0,
			...t.style
		},
		onFocusCapture: H(t.onFocusCapture, C.onFocusCapture),
		onBlurCapture: H(t.onBlurCapture, C.onBlurCapture),
		onPointerDownCapture: H(t.onPointerDownCapture, S.onPointerDownCapture)
	});
});
Le.displayName = je;
var Re = "DismissableLayerBranch", ze = e.forwardRef((t, n) => {
	let r = e.useContext(Ie), i = e.useRef(null), a = L(n, i);
	return e.useEffect(() => {
		let e = i.current;
		if (e) return r.branches.add(e), () => {
			r.branches.delete(e);
		};
	}, [r.branches]), /* @__PURE__ */ (0, z.jsx)(V.div, {
		...t,
		ref: a
	});
});
ze.displayName = Re;
function Be(t, n = globalThis?.document) {
	let r = ke(t), i = e.useRef(!1), a = e.useRef(() => {});
	return e.useEffect(() => {
		let e = (e) => {
			if (e.target && !i.current) {
				let t = function() {
					Ue(Ne, r, i, { discrete: !0 });
				}, i = { originalEvent: e };
				e.pointerType === "touch" ? (n.removeEventListener("click", a.current), a.current = t, n.addEventListener("click", a.current, { once: !0 })) : t();
			} else n.removeEventListener("click", a.current);
			i.current = !1;
		}, t = window.setTimeout(() => {
			n.addEventListener("pointerdown", e);
		}, 0);
		return () => {
			window.clearTimeout(t), n.removeEventListener("pointerdown", e), n.removeEventListener("click", a.current);
		};
	}, [n, r]), { onPointerDownCapture: () => i.current = !0 };
}
function Ve(t, n = globalThis?.document) {
	let r = ke(t), i = e.useRef(!1);
	return e.useEffect(() => {
		let e = (e) => {
			e.target && !i.current && Ue(Pe, r, { originalEvent: e }, { discrete: !1 });
		};
		return n.addEventListener("focusin", e), () => n.removeEventListener("focusin", e);
	}, [n, r]), {
		onFocusCapture: () => i.current = !0,
		onBlurCapture: () => i.current = !1
	};
}
function He() {
	let e = new CustomEvent(Me);
	document.dispatchEvent(e);
}
function Ue(e, t, n, { discrete: r }) {
	let i = n.originalEvent.target, a = new CustomEvent(e, {
		bubbles: !1,
		cancelable: !0,
		detail: n
	});
	t && i.addEventListener(e, t, { once: !0 }), r ? le(i, a) : i.dispatchEvent(a);
}
//#endregion
//#region node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var We = "focusScope.autoFocusOnMount", Ge = "focusScope.autoFocusOnUnmount", Ke = {
	bubbles: !1,
	cancelable: !0
}, qe = "FocusScope", Je = e.forwardRef((t, n) => {
	let { loop: r = !1, trapped: i = !1, onMountAutoFocus: a, onUnmountAutoFocus: o, ...s } = t, [c, l] = e.useState(null), u = ke(a), d = ke(o), f = e.useRef(null), p = L(n, (e) => l(e)), m = e.useRef({
		paused: !1,
		pause() {
			this.paused = !0;
		},
		resume() {
			this.paused = !1;
		}
	}).current;
	e.useEffect(() => {
		if (i) {
			let e = function(e) {
				if (m.paused || !c) return;
				let t = e.target;
				c.contains(t) ? f.current = t : tt(f.current, { select: !0 });
			}, t = function(e) {
				if (m.paused || !c) return;
				let t = e.relatedTarget;
				t !== null && (c.contains(t) || tt(f.current, { select: !0 }));
			}, n = function(e) {
				if (document.activeElement === document.body) for (let t of e) t.removedNodes.length > 0 && tt(c);
			};
			document.addEventListener("focusin", e), document.addEventListener("focusout", t);
			let r = new MutationObserver(n);
			return c && r.observe(c, {
				childList: !0,
				subtree: !0
			}), () => {
				document.removeEventListener("focusin", e), document.removeEventListener("focusout", t), r.disconnect();
			};
		}
	}, [
		i,
		c,
		m.paused
	]), e.useEffect(() => {
		if (c) {
			nt.add(m);
			let e = document.activeElement;
			if (!c.contains(e)) {
				let t = new CustomEvent(We, Ke);
				c.addEventListener(We, u), c.dispatchEvent(t), t.defaultPrevented || (Ye(at(Ze(c)), { select: !0 }), document.activeElement === e && tt(c));
			}
			return () => {
				c.removeEventListener(We, u), setTimeout(() => {
					let t = new CustomEvent(Ge, Ke);
					c.addEventListener(Ge, d), c.dispatchEvent(t), t.defaultPrevented || tt(e ?? document.body, { select: !0 }), c.removeEventListener(Ge, d), nt.remove(m);
				}, 0);
			};
		}
	}, [
		c,
		u,
		d,
		m
	]);
	let h = e.useCallback((e) => {
		if (!r && !i || m.paused) return;
		let t = e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey, n = document.activeElement;
		if (t && n) {
			let t = e.currentTarget, [i, a] = Xe(t);
			i && a ? !e.shiftKey && n === a ? (e.preventDefault(), r && tt(i, { select: !0 })) : e.shiftKey && n === i && (e.preventDefault(), r && tt(a, { select: !0 })) : n === t && e.preventDefault();
		}
	}, [
		r,
		i,
		m.paused
	]);
	return /* @__PURE__ */ (0, z.jsx)(V.div, {
		tabIndex: -1,
		...s,
		ref: p,
		onKeyDown: h
	});
});
Je.displayName = qe;
function Ye(e, { select: t = !1 } = {}) {
	let n = document.activeElement;
	for (let r of e) if (tt(r, { select: t }), document.activeElement !== n) return;
}
function Xe(e) {
	let t = Ze(e);
	return [Qe(t, e), Qe(t.reverse(), e)];
}
function Ze(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (e) => {
		let t = e.tagName === "INPUT" && e.type === "hidden";
		return e.disabled || e.hidden || t ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (; n.nextNode();) t.push(n.currentNode);
	return t;
}
function Qe(e, t) {
	for (let n of e) if (!$e(n, { upTo: t })) return n;
}
function $e(e, { upTo: t }) {
	if (getComputedStyle(e).visibility === "hidden") return !0;
	for (; e;) {
		if (t !== void 0 && e === t) return !1;
		if (getComputedStyle(e).display === "none") return !0;
		e = e.parentElement;
	}
	return !1;
}
function et(e) {
	return e instanceof HTMLInputElement && "select" in e;
}
function tt(e, { select: t = !1 } = {}) {
	if (e && e.focus) {
		let n = document.activeElement;
		e.focus({ preventScroll: !0 }), e !== n && et(e) && t && e.select();
	}
}
var nt = rt();
function rt() {
	let e = [];
	return {
		add(t) {
			let n = e[0];
			t !== n && n?.pause(), e = it(e, t), e.unshift(t);
		},
		remove(t) {
			e = it(e, t), e[0]?.resume();
		}
	};
}
function it(e, t) {
	let n = [...e], r = n.indexOf(t);
	return r !== -1 && n.splice(r, 1), n;
}
function at(e) {
	return e.filter((e) => e.tagName !== "A");
}
//#endregion
//#region node_modules/@radix-ui/react-portal/dist/index.mjs
var ot = "Portal", st = e.forwardRef((t, n) => {
	let { container: r, ...i } = t, [a, o] = e.useState(!1);
	me(() => o(!0), []);
	let s = r || a && globalThis?.document?.body;
	return s ? h.createPortal(/* @__PURE__ */ (0, z.jsx)(V.div, {
		...i,
		ref: n
	}), s) : null;
});
st.displayName = ot;
//#endregion
//#region node_modules/@radix-ui/react-focus-guards/dist/index.mjs
var ct = 0;
function lt() {
	e.useEffect(() => {
		let e = document.querySelectorAll("[data-radix-focus-guard]");
		return document.body.insertAdjacentElement("afterbegin", e[0] ?? ut()), document.body.insertAdjacentElement("beforeend", e[1] ?? ut()), ct++, () => {
			ct === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((e) => e.remove()), ct--;
		};
	}, []);
}
function ut() {
	let e = document.createElement("span");
	return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
//#endregion
//#region node_modules/tslib/tslib.es6.mjs
var dt = function() {
	return dt = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, dt.apply(this, arguments);
};
function ft(e, t) {
	var n = {};
	for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && typeof Object.getOwnPropertySymbols == "function") for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++) t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
	return n;
}
function pt(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
//#endregion
//#region node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var mt = "right-scroll-bar-position", ht = "width-before-scroll-bar", gt = "with-scroll-bars-hidden", _t = "--removed-body-scroll-bar-size";
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/assignRef.js
function vt(e, t) {
	return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/useRef.js
function yt(e, t) {
	var n = p(function() {
		return {
			value: e,
			callback: t,
			facade: {
				get current() {
					return n.value;
				},
				set current(e) {
					var t = n.value;
					t !== e && (n.value = e, n.callback(e, t));
				}
			}
		};
	})[0];
	return n.callback = t, n.facade;
}
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var bt = typeof window < "u" ? e.useLayoutEffect : e.useEffect, xt = /* @__PURE__ */ new WeakMap();
function St(e, t) {
	var n = yt(t || null, function(t) {
		return e.forEach(function(e) {
			return vt(e, t);
		});
	});
	return bt(function() {
		var t = xt.get(n);
		if (t) {
			var r = new Set(t), i = new Set(e), a = n.current;
			r.forEach(function(e) {
				i.has(e) || vt(e, null);
			}), i.forEach(function(e) {
				r.has(e) || vt(e, a);
			});
		}
		xt.set(n, e);
	}, [e]), n;
}
//#endregion
//#region node_modules/use-sidecar/dist/es2015/medium.js
function Ct(e) {
	return e;
}
function wt(e, t) {
	t === void 0 && (t = Ct);
	var n = [], r = !1;
	return {
		read: function() {
			if (r) throw Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			return n.length ? n[n.length - 1] : e;
		},
		useMedium: function(e) {
			var i = t(e, r);
			return n.push(i), function() {
				n = n.filter(function(e) {
					return e !== i;
				});
			};
		},
		assignSyncMedium: function(e) {
			for (r = !0; n.length;) {
				var t = n;
				n = [], t.forEach(e);
			}
			n = {
				push: function(t) {
					return e(t);
				},
				filter: function() {
					return n;
				}
			};
		},
		assignMedium: function(e) {
			r = !0;
			var t = [];
			if (n.length) {
				var i = n;
				n = [], i.forEach(e), t = n;
			}
			var a = function() {
				var n = t;
				t = [], n.forEach(e);
			}, o = function() {
				return Promise.resolve().then(a);
			};
			o(), n = {
				push: function(e) {
					t.push(e), o();
				},
				filter: function(e) {
					return t = t.filter(e), n;
				}
			};
		}
	};
}
function Tt(e) {
	e === void 0 && (e = {});
	var t = wt(null);
	return t.options = dt({
		async: !0,
		ssr: !1
	}, e), t;
}
//#endregion
//#region node_modules/use-sidecar/dist/es2015/exports.js
var Et = function(t) {
	var n = t.sideCar, r = ft(t, ["sideCar"]);
	if (!n) throw Error("Sidecar: please provide `sideCar` property to import the right car");
	var i = n.read();
	if (!i) throw Error("Sidecar medium not found");
	return e.createElement(i, dt({}, r));
};
Et.isSideCarExport = !0;
function Dt(e, t) {
	return e.useMedium(t), Et;
}
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/medium.js
var Ot = Tt(), kt = function() {}, At = e.forwardRef(function(t, n) {
	var r = e.useRef(null), i = e.useState({
		onScrollCapture: kt,
		onWheelCapture: kt,
		onTouchMoveCapture: kt
	}), a = i[0], o = i[1], s = t.forwardProps, c = t.children, l = t.className, u = t.removeScrollBar, d = t.enabled, f = t.shards, p = t.sideCar, m = t.noRelative, h = t.noIsolation, g = t.inert, _ = t.allowPinchZoom, v = t.as, y = v === void 0 ? "div" : v, b = t.gapMode, x = ft(t, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]), S = p, C = St([r, n]), w = dt(dt({}, x), a);
	return e.createElement(e.Fragment, null, d && e.createElement(S, {
		sideCar: Ot,
		removeScrollBar: u,
		shards: f,
		noRelative: m,
		noIsolation: h,
		inert: g,
		setCallbacks: o,
		allowPinchZoom: !!_,
		lockRef: r,
		gapMode: b
	}), s ? e.cloneElement(e.Children.only(c), dt(dt({}, w), { ref: C })) : e.createElement(y, dt({}, w, {
		className: l,
		ref: C
	}), c));
});
At.defaultProps = {
	enabled: !0,
	removeScrollBar: !0,
	inert: !1
}, At.classNames = {
	fullWidth: ht,
	zeroRight: mt
};
//#endregion
//#region node_modules/get-nonce/dist/es2015/index.js
var jt, Mt = function() {
	if (jt) return jt;
	if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
//#endregion
//#region node_modules/react-style-singleton/dist/es2015/singleton.js
function Nt() {
	if (!document) return null;
	var e = document.createElement("style");
	e.type = "text/css";
	var t = Mt();
	return t && e.setAttribute("nonce", t), e;
}
function Pt(e, t) {
	e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Ft(e) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(e);
}
var It = function() {
	var e = 0, t = null;
	return {
		add: function(n) {
			e == 0 && (t = Nt()) && (Pt(t, n), Ft(t)), e++;
		},
		remove: function() {
			e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
		}
	};
}, Lt = function() {
	var t = It();
	return function(n, r) {
		e.useEffect(function() {
			return t.add(n), function() {
				t.remove();
			};
		}, [n && r]);
	};
}, Rt = function() {
	var e = Lt();
	return function(t) {
		var n = t.styles, r = t.dynamic;
		return e(n, r), null;
	};
}, zt = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
}, Bt = function(e) {
	return parseInt(e || "", 10) || 0;
}, Vt = function(e) {
	var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], i = t[e === "padding" ? "paddingRight" : "marginRight"];
	return [
		Bt(n),
		Bt(r),
		Bt(i)
	];
}, Ht = function(e) {
	if (e === void 0 && (e = "margin"), typeof window > "u") return zt;
	var t = Vt(e), n = document.documentElement.clientWidth, r = window.innerWidth;
	return {
		left: t[0],
		top: t[1],
		right: t[2],
		gap: Math.max(0, r - n + t[2] - t[0])
	};
}, Ut = Rt(), Wt = "data-scroll-locked", Gt = function(e, t, n, r) {
	var i = e.left, a = e.top, o = e.right, s = e.gap;
	return n === void 0 && (n = "margin"), `
  .${gt} {
   overflow: hidden ${r};
   padding-right: ${s}px ${r};
  }
  body[${Wt}] {
    overflow: hidden ${r};
    overscroll-behavior: contain;
    ${[
		t && `position: relative ${r};`,
		n === "margin" && `
    padding-left: ${i}px;
    padding-top: ${a}px;
    padding-right: ${o}px;
    margin-left:0;
    margin-top:0;
    margin-right: ${s}px ${r};
    `,
		n === "padding" && `padding-right: ${s}px ${r};`
	].filter(Boolean).join("")}
  }
  
  .${mt} {
    right: ${s}px ${r};
  }
  
  .${ht} {
    margin-right: ${s}px ${r};
  }
  
  .${mt} .${mt} {
    right: 0 ${r};
  }
  
  .${ht} .${ht} {
    margin-right: 0 ${r};
  }
  
  body[${Wt}] {
    ${_t}: ${s}px;
  }
`;
}, Kt = function() {
	var e = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(e) ? e : 0;
}, qt = function() {
	e.useEffect(function() {
		return document.body.setAttribute(Wt, (Kt() + 1).toString()), function() {
			var e = Kt() - 1;
			e <= 0 ? document.body.removeAttribute(Wt) : document.body.setAttribute(Wt, e.toString());
		};
	}, []);
}, Jt = function(t) {
	var n = t.noRelative, r = t.noImportant, i = t.gapMode, a = i === void 0 ? "margin" : i;
	qt();
	var o = e.useMemo(function() {
		return Ht(a);
	}, [a]);
	return e.createElement(Ut, { styles: Gt(o, !n, a, r ? "" : "!important") });
}, Yt = !1;
if (typeof window < "u") try {
	var Xt = Object.defineProperty({}, "passive", { get: function() {
		return Yt = !0, !0;
	} });
	window.addEventListener("test", Xt, Xt), window.removeEventListener("test", Xt, Xt);
} catch {
	Yt = !1;
}
var Zt = Yt ? { passive: !1 } : !1, Qt = function(e) {
	return e.tagName === "TEXTAREA";
}, $t = function(e, t) {
	if (!(e instanceof Element)) return !1;
	var n = window.getComputedStyle(e);
	return n[t] !== "hidden" && !(n.overflowY === n.overflowX && !Qt(e) && n[t] === "visible");
}, en = function(e) {
	return $t(e, "overflowY");
}, tn = function(e) {
	return $t(e, "overflowX");
}, nn = function(e, t) {
	var n = t.ownerDocument, r = t;
	do {
		if (typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host), on(e, r)) {
			var i = sn(e, r);
			if (i[1] > i[2]) return !0;
		}
		r = r.parentNode;
	} while (r && r !== n.body);
	return !1;
}, rn = function(e) {
	return [
		e.scrollTop,
		e.scrollHeight,
		e.clientHeight
	];
}, an = function(e) {
	return [
		e.scrollLeft,
		e.scrollWidth,
		e.clientWidth
	];
}, on = function(e, t) {
	return e === "v" ? en(t) : tn(t);
}, sn = function(e, t) {
	return e === "v" ? rn(t) : an(t);
}, cn = function(e, t) {
	return e === "h" && t === "rtl" ? -1 : 1;
}, ln = function(e, t, n, r, i) {
	var a = cn(e, window.getComputedStyle(t).direction), o = a * r, s = n.target, c = t.contains(s), l = !1, u = o > 0, d = 0, f = 0;
	do {
		if (!s) break;
		var p = sn(e, s), m = p[0], h = p[1] - p[2] - a * m;
		(m || h) && on(e, s) && (d += h, f += m);
		var g = s.parentNode;
		s = g && g.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? g.host : g;
	} while (!c && s !== document.body || c && (t.contains(s) || t === s));
	return (u && (i && Math.abs(d) < 1 || !i && o > d) || !u && (i && Math.abs(f) < 1 || !i && -o > f)) && (l = !0), l;
}, un = function(e) {
	return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, dn = function(e) {
	return [e.deltaX, e.deltaY];
}, fn = function(e) {
	return e && "current" in e ? e.current : e;
}, pn = function(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}, mn = function(e) {
	return `
  .block-interactivity-${e} {pointer-events: none;}
  .allow-interactivity-${e} {pointer-events: all;}
`;
}, hn = 0, gn = [];
function _n(t) {
	var n = e.useRef([]), r = e.useRef([0, 0]), i = e.useRef(), a = e.useState(hn++)[0], o = e.useState(Rt)[0], s = e.useRef(t);
	e.useEffect(function() {
		s.current = t;
	}, [t]), e.useEffect(function() {
		if (t.inert) {
			document.body.classList.add(`block-interactivity-${a}`);
			var e = pt([t.lockRef.current], (t.shards || []).map(fn), !0).filter(Boolean);
			return e.forEach(function(e) {
				return e.classList.add(`allow-interactivity-${a}`);
			}), function() {
				document.body.classList.remove(`block-interactivity-${a}`), e.forEach(function(e) {
					return e.classList.remove(`allow-interactivity-${a}`);
				});
			};
		}
	}, [
		t.inert,
		t.lockRef.current,
		t.shards
	]);
	var c = e.useCallback(function(e, t) {
		if ("touches" in e && e.touches.length === 2 || e.type === "wheel" && e.ctrlKey) return !s.current.allowPinchZoom;
		var n = un(e), a = r.current, o = "deltaX" in e ? e.deltaX : a[0] - n[0], c = "deltaY" in e ? e.deltaY : a[1] - n[1], l, u = e.target, d = Math.abs(o) > Math.abs(c) ? "h" : "v";
		if ("touches" in e && d === "h" && u.type === "range") return !1;
		var f = window.getSelection(), p = f && f.anchorNode;
		if (p && (p === u || p.contains(u))) return !1;
		var m = nn(d, u);
		if (!m) return !0;
		if (m ? l = d : (l = d === "v" ? "h" : "v", m = nn(d, u)), !m) return !1;
		if (!i.current && "changedTouches" in e && (o || c) && (i.current = l), !l) return !0;
		var h = i.current || l;
		return ln(h, t, e, h === "h" ? o : c, !0);
	}, []), l = e.useCallback(function(e) {
		var t = e;
		if (!(!gn.length || gn[gn.length - 1] !== o)) {
			var r = "deltaY" in t ? dn(t) : un(t), i = n.current.filter(function(e) {
				return e.name === t.type && (e.target === t.target || t.target === e.shadowParent) && pn(e.delta, r);
			})[0];
			if (i && i.should) {
				t.cancelable && t.preventDefault();
				return;
			}
			if (!i) {
				var a = (s.current.shards || []).map(fn).filter(Boolean).filter(function(e) {
					return e.contains(t.target);
				});
				(a.length > 0 ? c(t, a[0]) : !s.current.noIsolation) && t.cancelable && t.preventDefault();
			}
		}
	}, []), u = e.useCallback(function(e, t, r, i) {
		var a = {
			name: e,
			delta: t,
			target: r,
			should: i,
			shadowParent: vn(r)
		};
		n.current.push(a), setTimeout(function() {
			n.current = n.current.filter(function(e) {
				return e !== a;
			});
		}, 1);
	}, []), d = e.useCallback(function(e) {
		r.current = un(e), i.current = void 0;
	}, []), f = e.useCallback(function(e) {
		u(e.type, dn(e), e.target, c(e, t.lockRef.current));
	}, []), p = e.useCallback(function(e) {
		u(e.type, un(e), e.target, c(e, t.lockRef.current));
	}, []);
	e.useEffect(function() {
		return gn.push(o), t.setCallbacks({
			onScrollCapture: f,
			onWheelCapture: f,
			onTouchMoveCapture: p
		}), document.addEventListener("wheel", l, Zt), document.addEventListener("touchmove", l, Zt), document.addEventListener("touchstart", d, Zt), function() {
			gn = gn.filter(function(e) {
				return e !== o;
			}), document.removeEventListener("wheel", l, Zt), document.removeEventListener("touchmove", l, Zt), document.removeEventListener("touchstart", d, Zt);
		};
	}, []);
	var m = t.removeScrollBar, h = t.inert;
	return e.createElement(e.Fragment, null, h ? e.createElement(o, { styles: mn(a) }) : null, m ? e.createElement(Jt, {
		noRelative: t.noRelative,
		gapMode: t.gapMode
	}) : null);
}
function vn(e) {
	for (var t = null; e !== null;) e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
	return t;
}
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/sidecar.js
var yn = Dt(Ot, _n), bn = e.forwardRef(function(t, n) {
	return e.createElement(At, dt({}, t, {
		ref: n,
		sideCar: yn
	}));
});
bn.classNames = At.classNames;
//#endregion
//#region node_modules/aria-hidden/dist/es2015/index.js
var xn = function(e) {
	return typeof document > "u" ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body;
}, Sn = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ new WeakMap(), wn = {}, Tn = 0, En = function(e) {
	return e && (e.host || En(e.parentNode));
}, Dn = function(e, t) {
	return t.map(function(t) {
		if (e.contains(t)) return t;
		var n = En(t);
		return n && e.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", e, ". Doing nothing"), null);
	}).filter(function(e) {
		return !!e;
	});
}, On = function(e, t, n, r) {
	var i = Dn(t, Array.isArray(e) ? e : [e]);
	wn[n] || (wn[n] = /* @__PURE__ */ new WeakMap());
	var a = wn[n], o = [], s = /* @__PURE__ */ new Set(), c = new Set(i), l = function(e) {
		!e || s.has(e) || (s.add(e), l(e.parentNode));
	};
	i.forEach(l);
	var u = function(e) {
		!e || c.has(e) || Array.prototype.forEach.call(e.children, function(e) {
			if (s.has(e)) u(e);
			else try {
				var t = e.getAttribute(r), i = t !== null && t !== "false", c = (Sn.get(e) || 0) + 1, l = (a.get(e) || 0) + 1;
				Sn.set(e, c), a.set(e, l), o.push(e), c === 1 && i && Cn.set(e, !0), l === 1 && e.setAttribute(n, "true"), i || e.setAttribute(r, "true");
			} catch (t) {
				console.error("aria-hidden: cannot operate on ", e, t);
			}
		});
	};
	return u(t), s.clear(), Tn++, function() {
		o.forEach(function(e) {
			var t = Sn.get(e) - 1, i = a.get(e) - 1;
			Sn.set(e, t), a.set(e, i), t || (Cn.has(e) || e.removeAttribute(r), Cn.delete(e)), i || e.removeAttribute(n);
		}), Tn--, Tn || (Sn = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ new WeakMap(), Cn = /* @__PURE__ */ new WeakMap(), wn = {});
	};
}, kn = function(e, t, n) {
	n === void 0 && (n = "data-aria-hidden");
	var r = Array.from(Array.isArray(e) ? e : [e]), i = t || xn(e);
	return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), On(r, i, n, "aria-hidden")) : function() {
		return null;
	};
}, An = "Dialog", [jn, Mn] = de(An), [Nn, Pn] = jn(An), Fn = (t) => {
	let { __scopeDialog: n, children: r, open: i, defaultOpen: a, onOpenChange: o, modal: s = !0 } = t, c = e.useRef(null), l = e.useRef(null), [u, d] = ge({
		prop: i,
		defaultProp: a ?? !1,
		onChange: o,
		caller: An
	});
	return /* @__PURE__ */ (0, z.jsx)(Nn, {
		scope: n,
		triggerRef: c,
		contentRef: l,
		contentId: Ee(),
		titleId: Ee(),
		descriptionId: Ee(),
		open: u,
		onOpenChange: d,
		onOpenToggle: e.useCallback(() => d((e) => !e), [d]),
		modal: s,
		children: r
	});
};
Fn.displayName = An;
var In = "DialogTrigger", Ln = e.forwardRef((e, t) => {
	let { __scopeDialog: n, ...r } = e, i = Pn(In, n), a = L(t, i.triggerRef);
	return /* @__PURE__ */ (0, z.jsx)(V.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": i.open,
		"aria-controls": i.contentId,
		"data-state": rr(i.open),
		...r,
		ref: a,
		onClick: H(e.onClick, i.onOpenToggle)
	});
});
Ln.displayName = In;
var Rn = "DialogPortal", [zn, Bn] = jn(Rn, { forceMount: void 0 }), Vn = (t) => {
	let { __scopeDialog: n, forceMount: r, children: i, container: a } = t, o = Pn(Rn, n);
	return /* @__PURE__ */ (0, z.jsx)(zn, {
		scope: n,
		forceMount: r,
		children: e.Children.map(i, (e) => /* @__PURE__ */ (0, z.jsx)(be, {
			present: r || o.open,
			children: /* @__PURE__ */ (0, z.jsx)(st, {
				asChild: !0,
				container: a,
				children: e
			})
		}))
	});
};
Vn.displayName = Rn;
var Hn = "DialogOverlay", Un = e.forwardRef((e, t) => {
	let n = Bn(Hn, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, a = Pn(Hn, e.__scopeDialog);
	return a.modal ? /* @__PURE__ */ (0, z.jsx)(be, {
		present: r || a.open,
		children: /* @__PURE__ */ (0, z.jsx)(Gn, {
			...i,
			ref: t
		})
	}) : null;
});
Un.displayName = Hn;
var Wn = /* @__PURE__ */ re("DialogOverlay.RemoveScroll"), Gn = e.forwardRef((e, t) => {
	let { __scopeDialog: n, ...r } = e, i = Pn(Hn, n);
	return /* @__PURE__ */ (0, z.jsx)(bn, {
		as: Wn,
		allowPinchZoom: !0,
		shards: [i.contentRef],
		children: /* @__PURE__ */ (0, z.jsx)(V.div, {
			"data-state": rr(i.open),
			...r,
			ref: t,
			style: {
				pointerEvents: "auto",
				...r.style
			}
		})
	});
}), Kn = "DialogContent", qn = e.forwardRef((e, t) => {
	let n = Bn(Kn, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, a = Pn(Kn, e.__scopeDialog);
	return /* @__PURE__ */ (0, z.jsx)(be, {
		present: r || a.open,
		children: a.modal ? /* @__PURE__ */ (0, z.jsx)(Jn, {
			...i,
			ref: t
		}) : /* @__PURE__ */ (0, z.jsx)(Yn, {
			...i,
			ref: t
		})
	});
});
qn.displayName = Kn;
var Jn = e.forwardRef((t, n) => {
	let r = Pn(Kn, t.__scopeDialog), i = e.useRef(null), a = L(n, r.contentRef, i);
	return e.useEffect(() => {
		let e = i.current;
		if (e) return kn(e);
	}, []), /* @__PURE__ */ (0, z.jsx)(Xn, {
		...t,
		ref: a,
		trapFocus: r.open,
		disableOutsidePointerEvents: !0,
		onCloseAutoFocus: H(t.onCloseAutoFocus, (e) => {
			e.preventDefault(), r.triggerRef.current?.focus();
		}),
		onPointerDownOutside: H(t.onPointerDownOutside, (e) => {
			let t = e.detail.originalEvent, n = t.button === 0 && t.ctrlKey === !0;
			(t.button === 2 || n) && e.preventDefault();
		}),
		onFocusOutside: H(t.onFocusOutside, (e) => e.preventDefault())
	});
}), Yn = e.forwardRef((t, n) => {
	let r = Pn(Kn, t.__scopeDialog), i = e.useRef(!1), a = e.useRef(!1);
	return /* @__PURE__ */ (0, z.jsx)(Xn, {
		...t,
		ref: n,
		trapFocus: !1,
		disableOutsidePointerEvents: !1,
		onCloseAutoFocus: (e) => {
			t.onCloseAutoFocus?.(e), e.defaultPrevented || (i.current || r.triggerRef.current?.focus(), e.preventDefault()), i.current = !1, a.current = !1;
		},
		onInteractOutside: (e) => {
			t.onInteractOutside?.(e), e.defaultPrevented || (i.current = !0, e.detail.originalEvent.type === "pointerdown" && (a.current = !0));
			let n = e.target;
			r.triggerRef.current?.contains(n) && e.preventDefault(), e.detail.originalEvent.type === "focusin" && a.current && e.preventDefault();
		}
	});
}), Xn = e.forwardRef((t, n) => {
	let { __scopeDialog: r, trapFocus: i, onOpenAutoFocus: a, onCloseAutoFocus: o, ...s } = t, c = Pn(Kn, r), l = e.useRef(null), u = L(n, l);
	return lt(), /* @__PURE__ */ (0, z.jsxs)(z.Fragment, { children: [/* @__PURE__ */ (0, z.jsx)(Je, {
		asChild: !0,
		loop: !0,
		trapped: i,
		onMountAutoFocus: a,
		onUnmountAutoFocus: o,
		children: /* @__PURE__ */ (0, z.jsx)(Le, {
			role: "dialog",
			id: c.contentId,
			"aria-describedby": c.descriptionId,
			"aria-labelledby": c.titleId,
			"data-state": rr(c.open),
			...s,
			ref: u,
			onDismiss: () => c.onOpenChange(!1)
		})
	}), /* @__PURE__ */ (0, z.jsxs)(z.Fragment, { children: [/* @__PURE__ */ (0, z.jsx)(sr, { titleId: c.titleId }), /* @__PURE__ */ (0, z.jsx)(lr, {
		contentRef: l,
		descriptionId: c.descriptionId
	})] })] });
}), Zn = "DialogTitle", Qn = e.forwardRef((e, t) => {
	let { __scopeDialog: n, ...r } = e, i = Pn(Zn, n);
	return /* @__PURE__ */ (0, z.jsx)(V.h2, {
		id: i.titleId,
		...r,
		ref: t
	});
});
Qn.displayName = Zn;
var $n = "DialogDescription", er = e.forwardRef((e, t) => {
	let { __scopeDialog: n, ...r } = e, i = Pn($n, n);
	return /* @__PURE__ */ (0, z.jsx)(V.p, {
		id: i.descriptionId,
		...r,
		ref: t
	});
});
er.displayName = $n;
var tr = "DialogClose", nr = e.forwardRef((e, t) => {
	let { __scopeDialog: n, ...r } = e, i = Pn(tr, n);
	return /* @__PURE__ */ (0, z.jsx)(V.button, {
		type: "button",
		...r,
		ref: t,
		onClick: H(e.onClick, () => i.onOpenChange(!1))
	});
});
nr.displayName = tr;
function rr(e) {
	return e ? "open" : "closed";
}
var ir = "DialogTitleWarning", [ar, or] = ue(ir, {
	contentName: Kn,
	titleName: Zn,
	docsSlug: "dialog"
}), sr = ({ titleId: t }) => {
	let n = or(ir), r = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
	return e.useEffect(() => {
		t && (document.getElementById(t) || console.error(r));
	}, [r, t]), null;
}, cr = "DialogDescriptionWarning", lr = ({ contentRef: t, descriptionId: n }) => {
	let r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${or(cr).contentName}}.`;
	return e.useEffect(() => {
		let e = t.current?.getAttribute("aria-describedby");
		n && e && (document.getElementById(n) || console.warn(r));
	}, [
		r,
		t,
		n
	]), null;
}, ur = Fn, dr = Ln, fr = Vn, pr = Un, mr = qn, hr = Qn, gr = er, _r = nr;
//#endregion
//#region node_modules/@radix-ui/react-use-size/dist/index.mjs
function vr(t) {
	let [n, r] = e.useState(void 0);
	return me(() => {
		if (t) {
			r({
				width: t.offsetWidth,
				height: t.offsetHeight
			});
			let e = new ResizeObserver((e) => {
				if (!Array.isArray(e) || !e.length) return;
				let n = e[0], i, a;
				if ("borderBoxSize" in n) {
					let e = n.borderBoxSize, t = Array.isArray(e) ? e[0] : e;
					i = t.inlineSize, a = t.blockSize;
				} else i = t.offsetWidth, a = t.offsetHeight;
				r({
					width: i,
					height: a
				});
			});
			return e.observe(t, { box: "border-box" }), () => e.unobserve(t);
		} else r(void 0);
	}, [t]), n;
}
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var yr = [
	"top",
	"right",
	"bottom",
	"left"
], br = Math.min, xr = Math.max, Sr = Math.round, Cr = Math.floor, wr = (e) => ({
	x: e,
	y: e
}), Tr = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function Er(e, t, n) {
	return xr(e, br(t, n));
}
function Dr(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function Or(e) {
	return e.split("-")[0];
}
function kr(e) {
	return e.split("-")[1];
}
function Ar(e) {
	return e === "x" ? "y" : "x";
}
function jr(e) {
	return e === "y" ? "height" : "width";
}
function Mr(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function Nr(e) {
	return Ar(Mr(e));
}
function Pr(e, t, n) {
	n === void 0 && (n = !1);
	let r = kr(e), i = Nr(e), a = jr(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Ur(o)), [o, Ur(o)];
}
function Fr(e) {
	let t = Ur(e);
	return [
		Ir(e),
		t,
		Ir(t)
	];
}
function Ir(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var Lr = ["left", "right"], Rr = ["right", "left"], zr = ["top", "bottom"], Br = ["bottom", "top"];
function Vr(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? Rr : Lr : t ? Lr : Rr;
		case "left":
		case "right": return t ? zr : Br;
		default: return [];
	}
}
function Hr(e, t, n, r) {
	let i = kr(e), a = Vr(Or(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(Ir)))), a;
}
function Ur(e) {
	let t = Or(e);
	return Tr[t] + e.slice(t.length);
}
function Wr(e) {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...e
	};
}
function Gr(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Wr(e);
}
function Kr(e) {
	let { x: t, y: n, width: r, height: i } = e;
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
//#endregion
//#region node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function qr(e, t, n) {
	let { reference: r, floating: i } = e, a = Mr(t), o = Nr(t), s = jr(o), c = Or(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
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
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	switch (kr(t)) {
		case "start":
			p[o] -= f * (n && l ? -1 : 1);
			break;
		case "end":
			p[o] += f * (n && l ? -1 : 1);
			break;
	}
	return p;
}
async function Jr(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = Dr(t, e), p = Gr(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Kr(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = Kr(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var Yr = 50, Xr = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Jr
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = qr(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < Yr && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = qr(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Zr = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = Dr(e, t) || {};
		if (l == null) return {};
		let d = Gr(u), f = {
			x: n,
			y: r
		}, p = Nr(i), m = jr(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		(!C || !await (o.isElement == null ? void 0 : o.isElement(S))) && (C = s.floating[y] || a.floating[m]);
		let w = b / 2 - x / 2, T = C / 2 - h[m] / 2 - 1, E = br(d[_], T), D = br(d[v], T), O = E, k = C - h[m] - D, A = C / 2 - h[m] / 2 + w, j = Er(O, A, k), M = !c.arrow && kr(i) != null && A !== j && a.reference[m] / 2 - (A < O ? E : D) - h[m] / 2 < 0, N = M ? A < O ? A - O : A - k : 0;
		return {
			[p]: f[p] + N,
			data: {
				[p]: j,
				centerOffset: A - j - N,
				...M && { alignmentOffset: N }
			},
			reset: M
		};
	}
}), Qr = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = Dr(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = Or(r), _ = Mr(o), v = Or(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Ur(o)] : Fr(o)), x = p !== "none";
			!d && x && b.push(...Hr(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), w = [], T = i.flip?.overflows || [];
			if (l && w.push(C[g]), u) {
				let e = Pr(r, a, y);
				w.push(C[e[0]], C[e[1]]);
			}
			if (T = [...T, {
				placement: r,
				overflows: w
			}], !w.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (!(u === "alignment" && _ !== Mr(t)) || T.every((e) => Mr(e.placement) === _ ? e.overflows[0] > 0 : !0))) return {
					data: {
						index: e,
						overflows: T
					},
					reset: { placement: t }
				};
				let n = T.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = T.filter((e) => {
							if (x) {
								let t = Mr(e.placement);
								return t === _ || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement":
						n = o;
						break;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
};
function $r(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function ei(e) {
	return yr.some((t) => e[t] >= 0);
}
var ti = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = Dr(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = $r(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: ei(e)
					} };
				}
				case "escaped": {
					let e = $r(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: ei(e)
					} };
				}
				default: return {};
			}
		}
	};
}, ni = /* @__PURE__ */ new Set(["left", "top"]);
async function ri(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Or(n), s = kr(n), c = Mr(n) === "y", l = ni.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = Dr(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), c ? {
		x: p * u,
		y: f * l
	} : {
		x: f * l,
		y: p * u
	};
}
var ii = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await ri(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, ai = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...l } = Dr(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Mr(Or(i)), p = Ar(f), m = u[p], h = u[f];
			if (o) {
				let e = p === "y" ? "top" : "left", t = p === "y" ? "bottom" : "right", n = m + d[e], r = m - d[t];
				m = Er(n, m, r);
			}
			if (s) {
				let e = f === "y" ? "top" : "left", t = f === "y" ? "bottom" : "right", n = h + d[e], r = h - d[t];
				h = Er(n, h, r);
			}
			let g = c.fn({
				...t,
				[p]: m,
				[f]: h
			});
			return {
				...g,
				data: {
					x: g.x - n,
					y: g.y - r,
					enabled: {
						[p]: o,
						[f]: s
					}
				}
			};
		}
	};
}, oi = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = Dr(e, t), u = {
				x: n,
				y: r
			}, d = Mr(i), f = Ar(d), p = u[f], m = u[d], h = Dr(s, t), g = typeof h == "number" ? {
				mainAxis: h,
				crossAxis: 0
			} : {
				mainAxis: 0,
				crossAxis: 0,
				...h
			};
			if (c) {
				let e = f === "y" ? "height" : "width", t = a.reference[f] - a.floating[e] + g.mainAxis, n = a.reference[f] + a.reference[e] - g.mainAxis;
				p < t ? p = t : p > n && (p = n);
			}
			if (l) {
				let e = f === "y" ? "width" : "height", t = ni.has(Or(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, si = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			var n, r;
			let { placement: i, rects: a, platform: o, elements: s } = t, { apply: c = () => {}, ...l } = Dr(e, t), u = await o.detectOverflow(t, l), d = Or(i), f = kr(i), p = Mr(i) === "y", { width: m, height: h } = a.floating, g, _;
			d === "top" || d === "bottom" ? (g = d, _ = f === (await (o.isRTL == null ? void 0 : o.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (_ = d, g = f === "end" ? "top" : "bottom");
			let v = h - u.top - u.bottom, y = m - u.left - u.right, b = br(h - u[g], v), x = br(m - u[_], y), S = !t.middlewareData.shift, C = b, w = x;
			if ((n = t.middlewareData.shift) != null && n.enabled.x && (w = y), (r = t.middlewareData.shift) != null && r.enabled.y && (C = v), S && !f) {
				let e = xr(u.left, 0), t = xr(u.right, 0), n = xr(u.top, 0), r = xr(u.bottom, 0);
				p ? w = m - 2 * (e !== 0 || t !== 0 ? e + t : xr(u.left, u.right)) : C = h - 2 * (n !== 0 || r !== 0 ? n + r : xr(u.top, u.bottom));
			}
			await c({
				...t,
				availableWidth: w,
				availableHeight: C
			});
			let T = await o.getDimensions(s.floating);
			return m !== T.width || h !== T.height ? { reset: { rects: !0 } } : {};
		}
	};
};
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function ci() {
	return typeof window < "u";
}
function li(e) {
	return fi(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function ui(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function di(e) {
	return ((fi(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function fi(e) {
	return ci() ? e instanceof Node || e instanceof ui(e).Node : !1;
}
function pi(e) {
	return ci() ? e instanceof Element || e instanceof ui(e).Element : !1;
}
function mi(e) {
	return ci() ? e instanceof HTMLElement || e instanceof ui(e).HTMLElement : !1;
}
function hi(e) {
	return !ci() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof ui(e).ShadowRoot;
}
function gi(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = Di(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function _i(e) {
	return /^(table|td|th)$/.test(li(e));
}
function vi(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var yi = /transform|translate|scale|rotate|perspective|filter/, bi = /paint|layout|strict|content/, xi = (e) => !!e && e !== "none", Si;
function Ci(e) {
	let t = pi(e) ? Di(e) : e;
	return xi(t.transform) || xi(t.translate) || xi(t.scale) || xi(t.rotate) || xi(t.perspective) || !Ti() && (xi(t.backdropFilter) || xi(t.filter)) || yi.test(t.willChange || "") || bi.test(t.contain || "");
}
function wi(e) {
	let t = ki(e);
	for (; mi(t) && !Ei(t);) {
		if (Ci(t)) return t;
		if (vi(t)) return null;
		t = ki(t);
	}
	return null;
}
function Ti() {
	return Si ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), Si;
}
function Ei(e) {
	return /^(html|body|#document)$/.test(li(e));
}
function Di(e) {
	return ui(e).getComputedStyle(e);
}
function Oi(e) {
	return pi(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function ki(e) {
	if (li(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || hi(e) && e.host || di(e);
	return hi(t) ? t.host : t;
}
function Ai(e) {
	let t = ki(e);
	return Ei(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : mi(t) && gi(t) ? t : Ai(t);
}
function ji(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = Ai(e), i = r === e.ownerDocument?.body, a = ui(r);
	if (i) {
		let e = Mi(a);
		return t.concat(a, a.visualViewport || [], gi(r) ? r : [], e && n ? ji(e) : []);
	} else return t.concat(r, ji(r, [], n));
}
function Mi(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
//#endregion
//#region node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function Ni(e) {
	let t = Di(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = mi(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = Sr(n) !== a || Sr(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function Pi(e) {
	return pi(e) ? e : e.contextElement;
}
function Fi(e) {
	let t = Pi(e);
	if (!mi(t)) return wr(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = Ni(t), o = (a ? Sr(n.width) : n.width) / r, s = (a ? Sr(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var Ii = /* @__PURE__ */ wr(0);
function Li(e) {
	let t = ui(e);
	return !Ti() || !t.visualViewport ? Ii : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Ri(e, t, n) {
	return t === void 0 && (t = !1), !n || t && n !== ui(e) ? !1 : t;
}
function zi(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = Pi(e), o = wr(1);
	t && (r ? pi(r) && (o = Fi(r)) : o = Fi(e));
	let s = Ri(a, n, r) ? Li(a) : wr(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a) {
		let e = ui(a), t = r && pi(r) ? ui(r) : r, n = e, i = Mi(n);
		for (; i && r && t !== n;) {
			let e = Fi(i), t = i.getBoundingClientRect(), r = Di(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = ui(i), i = Mi(n);
		}
	}
	return Kr({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Bi(e, t) {
	let n = Oi(e).scrollLeft;
	return t ? t.left + n : zi(di(e)).left + n;
}
function Vi(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Bi(e, n),
		y: n.top + t.scrollTop
	};
}
function Hi(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = di(r), s = t ? vi(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = wr(1), u = wr(0), d = mi(r);
	if ((d || !d && !a) && ((li(r) !== "body" || gi(o)) && (c = Oi(r)), d)) {
		let e = zi(r);
		l = Fi(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Vi(o, c) : wr(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Ui(e) {
	return Array.from(e.getClientRects());
}
function Wi(e) {
	let t = di(e), n = Oi(e), r = e.ownerDocument.body, i = xr(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), a = xr(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight), o = -n.scrollLeft + Bi(e), s = -n.scrollTop;
	return Di(r).direction === "rtl" && (o += xr(t.clientWidth, r.clientWidth) - i), {
		width: i,
		height: a,
		x: o,
		y: s
	};
}
var Gi = 25;
function Ki(e, t) {
	let n = ui(e), r = di(e), i = n.visualViewport, a = r.clientWidth, o = r.clientHeight, s = 0, c = 0;
	if (i) {
		a = i.width, o = i.height;
		let e = Ti();
		(!e || e && t === "fixed") && (s = i.offsetLeft, c = i.offsetTop);
	}
	let l = Bi(r);
	if (l <= 0) {
		let e = r.ownerDocument, t = e.body, n = getComputedStyle(t), i = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, o = Math.abs(r.clientWidth - t.clientWidth - i);
		o <= Gi && (a -= o);
	} else l <= Gi && (a += l);
	return {
		width: a,
		height: o,
		x: s,
		y: c
	};
}
function qi(e, t) {
	let n = zi(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = mi(e) ? Fi(e) : wr(1);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Ji(e, t, n) {
	let r;
	if (t === "viewport") r = Ki(e, n);
	else if (t === "document") r = Wi(di(e));
	else if (pi(t)) r = qi(t, n);
	else {
		let n = Li(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Kr(r);
}
function Yi(e, t) {
	let n = ki(e);
	return n === t || !pi(n) || Ei(n) ? !1 : Di(n).position === "fixed" || Yi(n, t);
}
function Xi(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = ji(e, [], !1).filter((e) => pi(e) && li(e) !== "body"), i = null, a = Di(e).position === "fixed", o = a ? ki(e) : e;
	for (; pi(o) && !Ei(o);) {
		let t = Di(o), n = Ci(o);
		!n && t.position === "fixed" && (i = null), (a ? !n && !i : !n && t.position === "static" && i && (i.position === "absolute" || i.position === "fixed") || gi(o) && !n && Yi(e, o)) ? r = r.filter((e) => e !== o) : i = t, o = ki(o);
	}
	return t.set(e, r), r;
}
function Zi(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? vi(t) ? [] : Xi(t, this._c) : [].concat(n), r], o = Ji(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Ji(t, a[e], i);
		s = xr(n.top, s), c = br(n.right, c), l = br(n.bottom, l), u = xr(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Qi(e) {
	let { width: t, height: n } = Ni(e);
	return {
		width: t,
		height: n
	};
}
function $i(e, t, n) {
	let r = mi(t), i = di(t), a = n === "fixed", o = zi(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = wr(0);
	function l() {
		c.x = Bi(i);
	}
	if (r || !r && !a) if ((li(t) !== "body" || gi(i)) && (s = Oi(t)), r) {
		let e = zi(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	} else i && l();
	a && !r && i && l();
	let u = i && !r && !a ? Vi(i, s) : wr(0);
	return {
		x: o.left + s.scrollLeft - c.x - u.x,
		y: o.top + s.scrollTop - c.y - u.y,
		width: o.width,
		height: o.height
	};
}
function ea(e) {
	return Di(e).position === "static";
}
function ta(e, t) {
	if (!mi(e) || Di(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return di(e) === n && (n = n.ownerDocument.body), n;
}
function na(e, t) {
	let n = ui(e);
	if (vi(e)) return n;
	if (!mi(e)) {
		let t = ki(e);
		for (; t && !Ei(t);) {
			if (pi(t) && !ea(t)) return t;
			t = ki(t);
		}
		return n;
	}
	let r = ta(e, t);
	for (; r && _i(r) && ea(r);) r = ta(r, t);
	return r && Ei(r) && ea(r) && !Ci(r) ? n : r || wi(e) || n;
}
var ra = async function(e) {
	let t = this.getOffsetParent || na, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: $i(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function ia(e) {
	return Di(e).direction === "rtl";
}
var aa = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Hi,
	getDocumentElement: di,
	getClippingRect: Zi,
	getOffsetParent: na,
	getElementRects: ra,
	getClientRects: Ui,
	getDimensions: Qi,
	getScale: Fi,
	isElement: pi,
	isRTL: ia
};
function oa(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function sa(e, t) {
	let n = null, r, i = di(e);
	function a() {
		var e;
		clearTimeout(r), (e = n) == null || e.disconnect(), n = null;
	}
	function o(s, c) {
		s === void 0 && (s = !1), c === void 0 && (c = 1), a();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (s || t(), !f || !p) return;
		let m = Cr(d), h = Cr(i.clientWidth - (u + f)), g = Cr(i.clientHeight - (d + p)), _ = Cr(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: xr(0, br(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (n !== c) {
				if (!y) return o();
				n ? o(!1, n) : r = setTimeout(() => {
					o(!1, 1e-7);
				}, 1e3);
			}
			n === 1 && !oa(l, e.getBoundingClientRect()) && o(), y = !1;
		}
		try {
			n = new IntersectionObserver(b, {
				...v,
				root: i.ownerDocument
			});
		} catch {
			n = new IntersectionObserver(b, v);
		}
		n.observe(e);
	}
	return o(!0), a;
}
function ca(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = Pi(e), u = i || a ? [...l ? ji(l) : [], ...t ? ji(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n, { passive: !0 }), a && e.addEventListener("resize", n);
	});
	let d = l && s ? sa(l, n) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? zi(e) : null;
	c && g();
	function g() {
		let t = zi(e);
		h && !oa(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var la = ii, ua = ai, da = Qr, fa = si, pa = ti, ma = Zr, ha = oi, ga = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = {
		platform: aa,
		...n
	}, a = {
		...i.platform,
		_c: r
	};
	return Xr(e, t, {
		...i,
		platform: a
	});
}, _a = typeof document < "u" ? u : function() {};
function va(e, t) {
	if (e === t) return !0;
	if (typeof e != typeof t) return !1;
	if (typeof e == "function" && e.toString() === t.toString()) return !0;
	let n, r, i;
	if (e && t && typeof e == "object") {
		if (Array.isArray(e)) {
			if (n = e.length, n !== t.length) return !1;
			for (r = n; r-- !== 0;) if (!va(e[r], t[r])) return !1;
			return !0;
		}
		if (i = Object.keys(e), n = i.length, n !== Object.keys(t).length) return !1;
		for (r = n; r-- !== 0;) if (!{}.hasOwnProperty.call(t, i[r])) return !1;
		for (r = n; r-- !== 0;) {
			let n = i[r];
			if (!(n === "_owner" && e.$$typeof) && !va(e[n], t[n])) return !1;
		}
		return !0;
	}
	return e !== e && t !== t;
}
function ya(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function ba(e, t) {
	let n = ya(e);
	return Math.round(t * n) / n;
}
function xa(t) {
	let n = e.useRef(t);
	return _a(() => {
		n.current = t;
	}), n;
}
function Sa(t) {
	t === void 0 && (t = {});
	let { placement: n = "bottom", strategy: r = "absolute", middleware: i = [], platform: a, elements: { reference: o, floating: s } = {}, transform: c = !0, whileElementsMounted: l, open: u } = t, [d, f] = e.useState({
		x: 0,
		y: 0,
		strategy: r,
		placement: n,
		middlewareData: {},
		isPositioned: !1
	}), [p, h] = e.useState(i);
	va(p, i) || h(i);
	let [g, _] = e.useState(null), [v, y] = e.useState(null), b = e.useCallback((e) => {
		e !== w.current && (w.current = e, _(e));
	}, []), x = e.useCallback((e) => {
		e !== T.current && (T.current = e, y(e));
	}, []), S = o || g, C = s || v, w = e.useRef(null), T = e.useRef(null), E = e.useRef(d), D = l != null, O = xa(l), k = xa(a), A = xa(u), j = e.useCallback(() => {
		if (!w.current || !T.current) return;
		let e = {
			placement: n,
			strategy: r,
			middleware: p
		};
		k.current && (e.platform = k.current), ga(w.current, T.current, e).then((e) => {
			let t = {
				...e,
				isPositioned: A.current !== !1
			};
			M.current && !va(E.current, t) && (E.current = t, m.flushSync(() => {
				f(t);
			}));
		});
	}, [
		p,
		n,
		r,
		k,
		A
	]);
	_a(() => {
		u === !1 && E.current.isPositioned && (E.current.isPositioned = !1, f((e) => ({
			...e,
			isPositioned: !1
		})));
	}, [u]);
	let M = e.useRef(!1);
	_a(() => (M.current = !0, () => {
		M.current = !1;
	}), []), _a(() => {
		if (S && (w.current = S), C && (T.current = C), S && C) {
			if (O.current) return O.current(S, C, j);
			j();
		}
	}, [
		S,
		C,
		j,
		O,
		D
	]);
	let N = e.useMemo(() => ({
		reference: w,
		floating: T,
		setReference: b,
		setFloating: x
	}), [b, x]), P = e.useMemo(() => ({
		reference: S,
		floating: C
	}), [S, C]), F = e.useMemo(() => {
		let e = {
			position: r,
			left: 0,
			top: 0
		};
		if (!P.floating) return e;
		let t = ba(P.floating, d.x), n = ba(P.floating, d.y);
		return c ? {
			...e,
			transform: "translate(" + t + "px, " + n + "px)",
			...ya(P.floating) >= 1.5 && { willChange: "transform" }
		} : {
			position: r,
			left: t,
			top: n
		};
	}, [
		r,
		c,
		P.floating,
		d.x,
		d.y
	]);
	return e.useMemo(() => ({
		...d,
		update: j,
		refs: N,
		elements: P,
		floatingStyles: F
	}), [
		d,
		j,
		N,
		P,
		F
	]);
}
var Ca = (e) => {
	function t(e) {
		return {}.hasOwnProperty.call(e, "current");
	}
	return {
		name: "arrow",
		options: e,
		fn(n) {
			let { element: r, padding: i } = typeof e == "function" ? e(n) : e;
			return r && t(r) ? r.current == null ? {} : ma({
				element: r.current,
				padding: i
			}).fn(n) : r ? ma({
				element: r,
				padding: i
			}).fn(n) : {};
		}
	};
}, wa = (e, t) => {
	let n = la(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Ta = (e, t) => {
	let n = ua(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Ea = (e, t) => ({
	fn: ha(e).fn,
	options: [e, t]
}), Da = (e, t) => {
	let n = da(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Oa = (e, t) => {
	let n = fa(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, ka = (e, t) => {
	let n = pa(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, Aa = (e, t) => {
	let n = Ca(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, ja = "Arrow", Ma = e.forwardRef((e, t) => {
	let { children: n, width: r = 10, height: i = 5, ...a } = e;
	return /* @__PURE__ */ (0, z.jsx)(V.svg, {
		...a,
		ref: t,
		width: r,
		height: i,
		viewBox: "0 0 30 10",
		preserveAspectRatio: "none",
		children: e.asChild ? n : /* @__PURE__ */ (0, z.jsx)("polygon", { points: "0,0 30,0 15,10" })
	});
});
Ma.displayName = ja;
var Na = Ma, Pa = "Popper", [Fa, Ia] = de(Pa), [La, Ra] = Fa(Pa), za = (t) => {
	let { __scopePopper: n, children: r } = t, [i, a] = e.useState(null);
	return /* @__PURE__ */ (0, z.jsx)(La, {
		scope: n,
		anchor: i,
		onAnchorChange: a,
		children: r
	});
};
za.displayName = Pa;
var Ba = "PopperAnchor", Va = e.forwardRef((t, n) => {
	let { __scopePopper: r, virtualRef: i, ...a } = t, o = Ra(Ba, r), s = e.useRef(null), c = L(n, s), l = e.useRef(null);
	return e.useEffect(() => {
		let e = l.current;
		l.current = i?.current || s.current, e !== l.current && o.onAnchorChange(l.current);
	}), i ? null : /* @__PURE__ */ (0, z.jsx)(V.div, {
		...a,
		ref: c
	});
});
Va.displayName = Ba;
var Ha = "PopperContent", [Ua, Wa] = Fa(Ha), Ga = e.forwardRef((t, n) => {
	let { __scopePopper: r, side: i = "bottom", sideOffset: a = 0, align: o = "center", alignOffset: s = 0, arrowPadding: c = 0, avoidCollisions: l = !0, collisionBoundary: u = [], collisionPadding: d = 0, sticky: f = "partial", hideWhenDetached: p = !1, updatePositionStrategy: m = "optimized", onPlaced: h, ...g } = t, _ = Ra(Ha, r), [v, y] = e.useState(null), b = L(n, (e) => y(e)), [x, S] = e.useState(null), C = vr(x), w = C?.width ?? 0, T = C?.height ?? 0, E = i + (o === "center" ? "" : "-" + o), D = typeof d == "number" ? d : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...d
	}, O = Array.isArray(u) ? u : [u], k = O.length > 0, A = {
		padding: D,
		boundary: O.filter(Ya),
		altBoundary: k
	}, { refs: j, floatingStyles: M, placement: N, isPositioned: P, middlewareData: F } = Sa({
		strategy: "fixed",
		placement: E,
		whileElementsMounted: (...e) => ca(...e, { animationFrame: m === "always" }),
		elements: { reference: _.anchor },
		middleware: [
			wa({
				mainAxis: a + T,
				alignmentAxis: s
			}),
			l && Ta({
				mainAxis: !0,
				crossAxis: !1,
				limiter: f === "partial" ? Ea() : void 0,
				...A
			}),
			l && Da({ ...A }),
			Oa({
				...A,
				apply: ({ elements: e, rects: t, availableWidth: n, availableHeight: r }) => {
					let { width: i, height: a } = t.reference, o = e.floating.style;
					o.setProperty("--radix-popper-available-width", `${n}px`), o.setProperty("--radix-popper-available-height", `${r}px`), o.setProperty("--radix-popper-anchor-width", `${i}px`), o.setProperty("--radix-popper-anchor-height", `${a}px`);
				}
			}),
			x && Aa({
				element: x,
				padding: c
			}),
			Xa({
				arrowWidth: w,
				arrowHeight: T
			}),
			p && ka({
				strategy: "referenceHidden",
				...A
			})
		]
	}), [I, ee] = Za(N), te = ke(h);
	me(() => {
		P && te?.();
	}, [P, te]);
	let ne = F.arrow?.x, R = F.arrow?.y, re = F.arrow?.centerOffset !== 0, [ie, B] = e.useState();
	return me(() => {
		v && B(window.getComputedStyle(v).zIndex);
	}, [v]), /* @__PURE__ */ (0, z.jsx)("div", {
		ref: j.setFloating,
		"data-radix-popper-content-wrapper": "",
		style: {
			...M,
			transform: P ? M.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: ie,
			"--radix-popper-transform-origin": [F.transformOrigin?.x, F.transformOrigin?.y].join(" "),
			...F.hide?.referenceHidden && {
				visibility: "hidden",
				pointerEvents: "none"
			}
		},
		dir: t.dir,
		children: /* @__PURE__ */ (0, z.jsx)(Ua, {
			scope: r,
			placedSide: I,
			onArrowChange: S,
			arrowX: ne,
			arrowY: R,
			shouldHideArrow: re,
			children: /* @__PURE__ */ (0, z.jsx)(V.div, {
				"data-side": I,
				"data-align": ee,
				...g,
				ref: b,
				style: {
					...g.style,
					animation: P ? void 0 : "none"
				}
			})
		})
	});
});
Ga.displayName = Ha;
var Ka = "PopperArrow", qa = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
}, Ja = e.forwardRef(function(e, t) {
	let { __scopePopper: n, ...r } = e, i = Wa(Ka, n), a = qa[i.placedSide];
	return /* @__PURE__ */ (0, z.jsx)("span", {
		ref: i.onArrowChange,
		style: {
			position: "absolute",
			left: i.arrowX,
			top: i.arrowY,
			[a]: 0,
			transformOrigin: {
				top: "",
				right: "0 0",
				bottom: "center 0",
				left: "100% 0"
			}[i.placedSide],
			transform: {
				top: "translateY(100%)",
				right: "translateY(50%) rotate(90deg) translateX(-50%)",
				bottom: "rotate(180deg)",
				left: "translateY(50%) rotate(-90deg) translateX(50%)"
			}[i.placedSide],
			visibility: i.shouldHideArrow ? "hidden" : void 0
		},
		children: /* @__PURE__ */ (0, z.jsx)(Na, {
			...r,
			ref: t,
			style: {
				...r.style,
				display: "block"
			}
		})
	});
});
Ja.displayName = Ka;
function Ya(e) {
	return e !== null;
}
var Xa = (e) => ({
	name: "transformOrigin",
	options: e,
	fn(t) {
		let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = Za(n), u = {
			start: "0%",
			center: "50%",
			end: "100%"
		}[l], d = (i.arrow?.x ?? 0) + o / 2, f = (i.arrow?.y ?? 0) + s / 2, p = "", m = "";
		return c === "bottom" ? (p = a ? u : `${d}px`, m = `${-s}px`) : c === "top" ? (p = a ? u : `${d}px`, m = `${r.floating.height + s}px`) : c === "right" ? (p = `${-s}px`, m = a ? u : `${f}px`) : c === "left" && (p = `${r.floating.width + s}px`, m = a ? u : `${f}px`), { data: {
			x: p,
			y: m
		} };
	}
});
function Za(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
var Qa = za, $a = Va, eo = Ga, to = Ja, no = "rovingFocusGroup.onEntryFocus", ro = {
	bubbles: !1,
	cancelable: !0
}, io = "RovingFocusGroup", [ao, oo, so] = pe(io), [co, lo] = de(io, [so]), [uo, fo] = co(io), po = e.forwardRef((e, t) => /* @__PURE__ */ (0, z.jsx)(ao.Provider, {
	scope: e.__scopeRovingFocusGroup,
	children: /* @__PURE__ */ (0, z.jsx)(ao.Slot, {
		scope: e.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ (0, z.jsx)(mo, {
			...e,
			ref: t
		})
	})
}));
po.displayName = io;
var mo = e.forwardRef((t, n) => {
	let { __scopeRovingFocusGroup: r, orientation: i, loop: a = !1, dir: o, currentTabStopId: s, defaultCurrentTabStopId: c, onCurrentTabStopIdChange: l, onEntryFocus: u, preventScrollOnEntryFocus: d = !1, ...f } = t, p = e.useRef(null), m = L(n, p), h = Oe(o), [g, _] = ge({
		prop: s,
		defaultProp: c ?? null,
		onChange: l,
		caller: io
	}), [v, y] = e.useState(!1), b = ke(u), x = oo(r), S = e.useRef(!1), [C, w] = e.useState(0);
	return e.useEffect(() => {
		let e = p.current;
		if (e) return e.addEventListener(no, b), () => e.removeEventListener(no, b);
	}, [b]), /* @__PURE__ */ (0, z.jsx)(uo, {
		scope: r,
		orientation: i,
		dir: h,
		loop: a,
		currentTabStopId: g,
		onItemFocus: e.useCallback((e) => _(e), [_]),
		onItemShiftTab: e.useCallback(() => y(!0), []),
		onFocusableItemAdd: e.useCallback(() => w((e) => e + 1), []),
		onFocusableItemRemove: e.useCallback(() => w((e) => e - 1), []),
		children: /* @__PURE__ */ (0, z.jsx)(V.div, {
			tabIndex: v || C === 0 ? -1 : 0,
			"data-orientation": i,
			...f,
			ref: m,
			style: {
				outline: "none",
				...t.style
			},
			onMouseDown: H(t.onMouseDown, () => {
				S.current = !0;
			}),
			onFocus: H(t.onFocus, (e) => {
				let t = !S.current;
				if (e.target === e.currentTarget && t && !v) {
					let t = new CustomEvent(no, ro);
					if (e.currentTarget.dispatchEvent(t), !t.defaultPrevented) {
						let e = x().filter((e) => e.focusable);
						bo([
							e.find((e) => e.active),
							e.find((e) => e.id === g),
							...e
						].filter(Boolean).map((e) => e.ref.current), d);
					}
				}
				S.current = !1;
			}),
			onBlur: H(t.onBlur, () => y(!1))
		})
	});
}), ho = "RovingFocusGroupItem", go = e.forwardRef((t, n) => {
	let { __scopeRovingFocusGroup: r, focusable: i = !0, active: a = !1, tabStopId: o, children: s, ...c } = t, l = Ee(), u = o || l, d = fo(ho, r), f = d.currentTabStopId === u, p = oo(r), { onFocusableItemAdd: m, onFocusableItemRemove: h, currentTabStopId: g } = d;
	return e.useEffect(() => {
		if (i) return m(), () => h();
	}, [
		i,
		m,
		h
	]), /* @__PURE__ */ (0, z.jsx)(ao.ItemSlot, {
		scope: r,
		id: u,
		focusable: i,
		active: a,
		children: /* @__PURE__ */ (0, z.jsx)(V.span, {
			tabIndex: f ? 0 : -1,
			"data-orientation": d.orientation,
			...c,
			ref: n,
			onMouseDown: H(t.onMouseDown, (e) => {
				i ? d.onItemFocus(u) : e.preventDefault();
			}),
			onFocus: H(t.onFocus, () => d.onItemFocus(u)),
			onKeyDown: H(t.onKeyDown, (e) => {
				if (e.key === "Tab" && e.shiftKey) {
					d.onItemShiftTab();
					return;
				}
				if (e.target !== e.currentTarget) return;
				let t = yo(e, d.orientation, d.dir);
				if (t !== void 0) {
					if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
					e.preventDefault();
					let n = p().filter((e) => e.focusable).map((e) => e.ref.current);
					if (t === "last") n.reverse();
					else if (t === "prev" || t === "next") {
						t === "prev" && n.reverse();
						let r = n.indexOf(e.currentTarget);
						n = d.loop ? xo(n, r + 1) : n.slice(r + 1);
					}
					setTimeout(() => bo(n));
				}
			}),
			children: typeof s == "function" ? s({
				isCurrentTabStop: f,
				hasTabStop: g != null
			}) : s
		})
	});
});
go.displayName = ho;
var _o = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function vo(e, t) {
	return t === "rtl" ? e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e : e;
}
function yo(e, t, n) {
	let r = vo(e.key, n);
	if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r))) return _o[r];
}
function bo(e, t = !1) {
	let n = document.activeElement;
	for (let r of e) if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function xo(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
var So = po, Co = go, wo = ["Enter", " "], To = [
	"ArrowDown",
	"PageUp",
	"Home"
], Eo = [
	"ArrowUp",
	"PageDown",
	"End"
], Do = [...To, ...Eo], Oo = {
	ltr: [...wo, "ArrowRight"],
	rtl: [...wo, "ArrowLeft"]
}, ko = {
	ltr: ["ArrowLeft"],
	rtl: ["ArrowRight"]
}, Ao = "Menu", [jo, Mo, No] = pe(Ao), [Po, Fo] = de(Ao, [
	No,
	Ia,
	lo
]), Io = Ia(), Lo = lo(), [Ro, zo] = Po(Ao), [Bo, Vo] = Po(Ao), Ho = (t) => {
	let { __scopeMenu: n, open: r = !1, children: i, dir: a, onOpenChange: o, modal: s = !0 } = t, c = Io(n), [l, u] = e.useState(null), d = e.useRef(!1), f = ke(o), p = Oe(a);
	return e.useEffect(() => {
		let e = () => {
			d.current = !0, document.addEventListener("pointerdown", t, {
				capture: !0,
				once: !0
			}), document.addEventListener("pointermove", t, {
				capture: !0,
				once: !0
			});
		}, t = () => d.current = !1;
		return document.addEventListener("keydown", e, { capture: !0 }), () => {
			document.removeEventListener("keydown", e, { capture: !0 }), document.removeEventListener("pointerdown", t, { capture: !0 }), document.removeEventListener("pointermove", t, { capture: !0 });
		};
	}, []), /* @__PURE__ */ (0, z.jsx)(Qa, {
		...c,
		children: /* @__PURE__ */ (0, z.jsx)(Ro, {
			scope: n,
			open: r,
			onOpenChange: f,
			content: l,
			onContentChange: u,
			children: /* @__PURE__ */ (0, z.jsx)(Bo, {
				scope: n,
				onClose: e.useCallback(() => f(!1), [f]),
				isUsingKeyboardRef: d,
				dir: p,
				modal: s,
				children: i
			})
		})
	});
};
Ho.displayName = Ao;
var Uo = "MenuAnchor", Wo = e.forwardRef((e, t) => {
	let { __scopeMenu: n, ...r } = e, i = Io(n);
	return /* @__PURE__ */ (0, z.jsx)($a, {
		...i,
		...r,
		ref: t
	});
});
Wo.displayName = Uo;
var Go = "MenuPortal", [Ko, qo] = Po(Go, { forceMount: void 0 }), Jo = (e) => {
	let { __scopeMenu: t, forceMount: n, children: r, container: i } = e, a = zo(Go, t);
	return /* @__PURE__ */ (0, z.jsx)(Ko, {
		scope: t,
		forceMount: n,
		children: /* @__PURE__ */ (0, z.jsx)(be, {
			present: n || a.open,
			children: /* @__PURE__ */ (0, z.jsx)(st, {
				asChild: !0,
				container: i,
				children: r
			})
		})
	});
};
Jo.displayName = Go;
var Yo = "MenuContent", [Xo, Zo] = Po(Yo), Qo = e.forwardRef((e, t) => {
	let n = qo(Yo, e.__scopeMenu), { forceMount: r = n.forceMount, ...i } = e, a = zo(Yo, e.__scopeMenu), o = Vo(Yo, e.__scopeMenu);
	return /* @__PURE__ */ (0, z.jsx)(jo.Provider, {
		scope: e.__scopeMenu,
		children: /* @__PURE__ */ (0, z.jsx)(be, {
			present: r || a.open,
			children: /* @__PURE__ */ (0, z.jsx)(jo.Slot, {
				scope: e.__scopeMenu,
				children: o.modal ? /* @__PURE__ */ (0, z.jsx)($o, {
					...i,
					ref: t
				}) : /* @__PURE__ */ (0, z.jsx)(es, {
					...i,
					ref: t
				})
			})
		})
	});
}), $o = e.forwardRef((t, n) => {
	let r = zo(Yo, t.__scopeMenu), i = e.useRef(null), a = L(n, i);
	return e.useEffect(() => {
		let e = i.current;
		if (e) return kn(e);
	}, []), /* @__PURE__ */ (0, z.jsx)(ns, {
		...t,
		ref: a,
		trapFocus: r.open,
		disableOutsidePointerEvents: r.open,
		disableOutsideScroll: !0,
		onFocusOutside: H(t.onFocusOutside, (e) => e.preventDefault(), { checkForDefaultPrevented: !1 }),
		onDismiss: () => r.onOpenChange(!1)
	});
}), es = e.forwardRef((e, t) => {
	let n = zo(Yo, e.__scopeMenu);
	return /* @__PURE__ */ (0, z.jsx)(ns, {
		...e,
		ref: t,
		trapFocus: !1,
		disableOutsidePointerEvents: !1,
		disableOutsideScroll: !1,
		onDismiss: () => n.onOpenChange(!1)
	});
}), ts = /* @__PURE__ */ re("MenuContent.ScrollLock"), ns = e.forwardRef((t, n) => {
	let { __scopeMenu: r, loop: i = !1, trapFocus: a, onOpenAutoFocus: o, onCloseAutoFocus: s, disableOutsidePointerEvents: c, onEntryFocus: l, onEscapeKeyDown: u, onPointerDownOutside: d, onFocusOutside: f, onInteractOutside: p, onDismiss: m, disableOutsideScroll: h, ...g } = t, _ = zo(Yo, r), v = Vo(Yo, r), y = Io(r), b = Lo(r), x = Mo(r), [S, C] = e.useState(null), w = e.useRef(null), T = L(n, w, _.onContentChange), E = e.useRef(0), D = e.useRef(""), O = e.useRef(0), k = e.useRef(null), A = e.useRef("right"), j = e.useRef(0), M = h ? bn : e.Fragment, N = h ? {
		as: ts,
		allowPinchZoom: !0
	} : void 0, P = (e) => {
		let t = D.current + e, n = x().filter((e) => !e.disabled), r = document.activeElement, i = n.find((e) => e.ref.current === r)?.textValue, a = Bs(n.map((e) => e.textValue), t, i), o = n.find((e) => e.textValue === a)?.ref.current;
		(function e(t) {
			D.current = t, window.clearTimeout(E.current), t !== "" && (E.current = window.setTimeout(() => e(""), 1e3));
		})(t), o && setTimeout(() => o.focus());
	};
	e.useEffect(() => () => window.clearTimeout(E.current), []), lt();
	let F = e.useCallback((e) => A.current === k.current?.side && Hs(e, k.current?.area), []);
	return /* @__PURE__ */ (0, z.jsx)(Xo, {
		scope: r,
		searchRef: D,
		onItemEnter: e.useCallback((e) => {
			F(e) && e.preventDefault();
		}, [F]),
		onItemLeave: e.useCallback((e) => {
			F(e) || (w.current?.focus(), C(null));
		}, [F]),
		onTriggerLeave: e.useCallback((e) => {
			F(e) && e.preventDefault();
		}, [F]),
		pointerGraceTimerRef: O,
		onPointerGraceIntentChange: e.useCallback((e) => {
			k.current = e;
		}, []),
		children: /* @__PURE__ */ (0, z.jsx)(M, {
			...N,
			children: /* @__PURE__ */ (0, z.jsx)(Je, {
				asChild: !0,
				trapped: a,
				onMountAutoFocus: H(o, (e) => {
					e.preventDefault(), w.current?.focus({ preventScroll: !0 });
				}),
				onUnmountAutoFocus: s,
				children: /* @__PURE__ */ (0, z.jsx)(Le, {
					asChild: !0,
					disableOutsidePointerEvents: c,
					onEscapeKeyDown: u,
					onPointerDownOutside: d,
					onFocusOutside: f,
					onInteractOutside: p,
					onDismiss: m,
					children: /* @__PURE__ */ (0, z.jsx)(So, {
						asChild: !0,
						...b,
						dir: v.dir,
						orientation: "vertical",
						loop: i,
						currentTabStopId: S,
						onCurrentTabStopIdChange: C,
						onEntryFocus: H(l, (e) => {
							v.isUsingKeyboardRef.current || e.preventDefault();
						}),
						preventScrollOnEntryFocus: !0,
						children: /* @__PURE__ */ (0, z.jsx)(eo, {
							role: "menu",
							"aria-orientation": "vertical",
							"data-state": Fs(_.open),
							"data-radix-menu-content": "",
							dir: v.dir,
							...y,
							...g,
							ref: T,
							style: {
								outline: "none",
								...g.style
							},
							onKeyDown: H(g.onKeyDown, (e) => {
								let t = e.target.closest("[data-radix-menu-content]") === e.currentTarget, n = e.ctrlKey || e.altKey || e.metaKey, r = e.key.length === 1;
								t && (e.key === "Tab" && e.preventDefault(), !n && r && P(e.key));
								let i = w.current;
								if (e.target !== i || !Do.includes(e.key)) return;
								e.preventDefault();
								let a = x().filter((e) => !e.disabled).map((e) => e.ref.current);
								Eo.includes(e.key) && a.reverse(), Rs(a);
							}),
							onBlur: H(t.onBlur, (e) => {
								e.currentTarget.contains(e.target) || (window.clearTimeout(E.current), D.current = "");
							}),
							onPointerMove: H(t.onPointerMove, Us((e) => {
								let t = e.target, n = j.current !== e.clientX;
								e.currentTarget.contains(t) && n && (A.current = e.clientX > j.current ? "right" : "left", j.current = e.clientX);
							}))
						})
					})
				})
			})
		})
	});
});
Qo.displayName = Yo;
var rs = "MenuGroup", is = e.forwardRef((e, t) => {
	let { __scopeMenu: n, ...r } = e;
	return /* @__PURE__ */ (0, z.jsx)(V.div, {
		role: "group",
		...r,
		ref: t
	});
});
is.displayName = rs;
var as = "MenuLabel", os = e.forwardRef((e, t) => {
	let { __scopeMenu: n, ...r } = e;
	return /* @__PURE__ */ (0, z.jsx)(V.div, {
		...r,
		ref: t
	});
});
os.displayName = as;
var ss = "MenuItem", cs = "menu.itemSelect", ls = e.forwardRef((t, n) => {
	let { disabled: r = !1, onSelect: i, ...a } = t, o = e.useRef(null), s = Vo(ss, t.__scopeMenu), c = Zo(ss, t.__scopeMenu), l = L(n, o), u = e.useRef(!1), d = () => {
		let e = o.current;
		if (!r && e) {
			let t = new CustomEvent(cs, {
				bubbles: !0,
				cancelable: !0
			});
			e.addEventListener(cs, (e) => i?.(e), { once: !0 }), le(e, t), t.defaultPrevented ? u.current = !1 : s.onClose();
		}
	};
	return /* @__PURE__ */ (0, z.jsx)(us, {
		...a,
		ref: l,
		disabled: r,
		onClick: H(t.onClick, d),
		onPointerDown: (e) => {
			t.onPointerDown?.(e), u.current = !0;
		},
		onPointerUp: H(t.onPointerUp, (e) => {
			u.current || e.currentTarget?.click();
		}),
		onKeyDown: H(t.onKeyDown, (e) => {
			let t = c.searchRef.current !== "";
			r || t && e.key === " " || wo.includes(e.key) && (e.currentTarget.click(), e.preventDefault());
		})
	});
});
ls.displayName = ss;
var us = e.forwardRef((t, n) => {
	let { __scopeMenu: r, disabled: i = !1, textValue: a, ...o } = t, s = Zo(ss, r), c = Lo(r), l = e.useRef(null), u = L(n, l), [d, f] = e.useState(!1), [p, m] = e.useState("");
	return e.useEffect(() => {
		let e = l.current;
		e && m((e.textContent ?? "").trim());
	}, [o.children]), /* @__PURE__ */ (0, z.jsx)(jo.ItemSlot, {
		scope: r,
		disabled: i,
		textValue: a ?? p,
		children: /* @__PURE__ */ (0, z.jsx)(Co, {
			asChild: !0,
			...c,
			focusable: !i,
			children: /* @__PURE__ */ (0, z.jsx)(V.div, {
				role: "menuitem",
				"data-highlighted": d ? "" : void 0,
				"aria-disabled": i || void 0,
				"data-disabled": i ? "" : void 0,
				...o,
				ref: u,
				onPointerMove: H(t.onPointerMove, Us((e) => {
					i ? s.onItemLeave(e) : (s.onItemEnter(e), e.defaultPrevented || e.currentTarget.focus({ preventScroll: !0 }));
				})),
				onPointerLeave: H(t.onPointerLeave, Us((e) => s.onItemLeave(e))),
				onFocus: H(t.onFocus, () => f(!0)),
				onBlur: H(t.onBlur, () => f(!1))
			})
		})
	});
}), ds = "MenuCheckboxItem", fs = e.forwardRef((e, t) => {
	let { checked: n = !1, onCheckedChange: r, ...i } = e;
	return /* @__PURE__ */ (0, z.jsx)(bs, {
		scope: e.__scopeMenu,
		checked: n,
		children: /* @__PURE__ */ (0, z.jsx)(ls, {
			role: "menuitemcheckbox",
			"aria-checked": Is(n) ? "mixed" : n,
			...i,
			ref: t,
			"data-state": Ls(n),
			onSelect: H(i.onSelect, () => r?.(Is(n) ? !0 : !n), { checkForDefaultPrevented: !1 })
		})
	});
});
fs.displayName = ds;
var ps = "MenuRadioGroup", [ms, hs] = Po(ps, {
	value: void 0,
	onValueChange: () => {}
}), gs = e.forwardRef((e, t) => {
	let { value: n, onValueChange: r, ...i } = e, a = ke(r);
	return /* @__PURE__ */ (0, z.jsx)(ms, {
		scope: e.__scopeMenu,
		value: n,
		onValueChange: a,
		children: /* @__PURE__ */ (0, z.jsx)(is, {
			...i,
			ref: t
		})
	});
});
gs.displayName = ps;
var _s = "MenuRadioItem", vs = e.forwardRef((e, t) => {
	let { value: n, ...r } = e, i = hs(_s, e.__scopeMenu), a = n === i.value;
	return /* @__PURE__ */ (0, z.jsx)(bs, {
		scope: e.__scopeMenu,
		checked: a,
		children: /* @__PURE__ */ (0, z.jsx)(ls, {
			role: "menuitemradio",
			"aria-checked": a,
			...r,
			ref: t,
			"data-state": Ls(a),
			onSelect: H(r.onSelect, () => i.onValueChange?.(n), { checkForDefaultPrevented: !1 })
		})
	});
});
vs.displayName = _s;
var ys = "MenuItemIndicator", [bs, xs] = Po(ys, { checked: !1 }), Ss = e.forwardRef((e, t) => {
	let { __scopeMenu: n, forceMount: r, ...i } = e, a = xs(ys, n);
	return /* @__PURE__ */ (0, z.jsx)(be, {
		present: r || Is(a.checked) || a.checked === !0,
		children: /* @__PURE__ */ (0, z.jsx)(V.span, {
			...i,
			ref: t,
			"data-state": Ls(a.checked)
		})
	});
});
Ss.displayName = ys;
var Cs = "MenuSeparator", ws = e.forwardRef((e, t) => {
	let { __scopeMenu: n, ...r } = e;
	return /* @__PURE__ */ (0, z.jsx)(V.div, {
		role: "separator",
		"aria-orientation": "horizontal",
		...r,
		ref: t
	});
});
ws.displayName = Cs;
var Ts = "MenuArrow", Es = e.forwardRef((e, t) => {
	let { __scopeMenu: n, ...r } = e, i = Io(n);
	return /* @__PURE__ */ (0, z.jsx)(to, {
		...i,
		...r,
		ref: t
	});
});
Es.displayName = Ts;
var Ds = "MenuSub", [Os, ks] = Po(Ds), As = (t) => {
	let { __scopeMenu: n, children: r, open: i = !1, onOpenChange: a } = t, o = zo(Ds, n), s = Io(n), [c, l] = e.useState(null), [u, d] = e.useState(null), f = ke(a);
	return e.useEffect(() => (o.open === !1 && f(!1), () => f(!1)), [o.open, f]), /* @__PURE__ */ (0, z.jsx)(Qa, {
		...s,
		children: /* @__PURE__ */ (0, z.jsx)(Ro, {
			scope: n,
			open: i,
			onOpenChange: f,
			content: u,
			onContentChange: d,
			children: /* @__PURE__ */ (0, z.jsx)(Os, {
				scope: n,
				contentId: Ee(),
				triggerId: Ee(),
				trigger: c,
				onTriggerChange: l,
				children: r
			})
		})
	});
};
As.displayName = Ds;
var js = "MenuSubTrigger", Ms = e.forwardRef((t, n) => {
	let r = zo(js, t.__scopeMenu), i = Vo(js, t.__scopeMenu), a = ks(js, t.__scopeMenu), o = Zo(js, t.__scopeMenu), s = e.useRef(null), { pointerGraceTimerRef: c, onPointerGraceIntentChange: l } = o, u = { __scopeMenu: t.__scopeMenu }, d = e.useCallback(() => {
		s.current && window.clearTimeout(s.current), s.current = null;
	}, []);
	return e.useEffect(() => d, [d]), e.useEffect(() => {
		let e = c.current;
		return () => {
			window.clearTimeout(e), l(null);
		};
	}, [c, l]), /* @__PURE__ */ (0, z.jsx)(Wo, {
		asChild: !0,
		...u,
		children: /* @__PURE__ */ (0, z.jsx)(us, {
			id: a.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": r.open,
			"aria-controls": a.contentId,
			"data-state": Fs(r.open),
			...t,
			ref: te(n, a.onTriggerChange),
			onClick: (e) => {
				t.onClick?.(e), !(t.disabled || e.defaultPrevented) && (e.currentTarget.focus(), r.open || r.onOpenChange(!0));
			},
			onPointerMove: H(t.onPointerMove, Us((e) => {
				o.onItemEnter(e), !e.defaultPrevented && !t.disabled && !r.open && !s.current && (o.onPointerGraceIntentChange(null), s.current = window.setTimeout(() => {
					r.onOpenChange(!0), d();
				}, 100));
			})),
			onPointerLeave: H(t.onPointerLeave, Us((e) => {
				d();
				let t = r.content?.getBoundingClientRect();
				if (t) {
					let n = r.content?.dataset.side, i = n === "right", a = i ? -5 : 5, s = t[i ? "left" : "right"], l = t[i ? "right" : "left"];
					o.onPointerGraceIntentChange({
						area: [
							{
								x: e.clientX + a,
								y: e.clientY
							},
							{
								x: s,
								y: t.top
							},
							{
								x: l,
								y: t.top
							},
							{
								x: l,
								y: t.bottom
							},
							{
								x: s,
								y: t.bottom
							}
						],
						side: n
					}), window.clearTimeout(c.current), c.current = window.setTimeout(() => o.onPointerGraceIntentChange(null), 300);
				} else {
					if (o.onTriggerLeave(e), e.defaultPrevented) return;
					o.onPointerGraceIntentChange(null);
				}
			})),
			onKeyDown: H(t.onKeyDown, (e) => {
				let n = o.searchRef.current !== "";
				t.disabled || n && e.key === " " || Oo[i.dir].includes(e.key) && (r.onOpenChange(!0), r.content?.focus(), e.preventDefault());
			})
		})
	});
});
Ms.displayName = js;
var Ns = "MenuSubContent", Ps = e.forwardRef((t, n) => {
	let r = qo(Yo, t.__scopeMenu), { forceMount: i = r.forceMount, ...a } = t, o = zo(Yo, t.__scopeMenu), s = Vo(Yo, t.__scopeMenu), c = ks(Ns, t.__scopeMenu), l = e.useRef(null), u = L(n, l);
	return /* @__PURE__ */ (0, z.jsx)(jo.Provider, {
		scope: t.__scopeMenu,
		children: /* @__PURE__ */ (0, z.jsx)(be, {
			present: i || o.open,
			children: /* @__PURE__ */ (0, z.jsx)(jo.Slot, {
				scope: t.__scopeMenu,
				children: /* @__PURE__ */ (0, z.jsx)(ns, {
					id: c.contentId,
					"aria-labelledby": c.triggerId,
					...a,
					ref: u,
					align: "start",
					side: s.dir === "rtl" ? "left" : "right",
					disableOutsidePointerEvents: !1,
					disableOutsideScroll: !1,
					trapFocus: !1,
					onOpenAutoFocus: (e) => {
						s.isUsingKeyboardRef.current && l.current?.focus(), e.preventDefault();
					},
					onCloseAutoFocus: (e) => e.preventDefault(),
					onFocusOutside: H(t.onFocusOutside, (e) => {
						e.target !== c.trigger && o.onOpenChange(!1);
					}),
					onEscapeKeyDown: H(t.onEscapeKeyDown, (e) => {
						s.onClose(), e.preventDefault();
					}),
					onKeyDown: H(t.onKeyDown, (e) => {
						let t = e.currentTarget.contains(e.target), n = ko[s.dir].includes(e.key);
						t && n && (o.onOpenChange(!1), c.trigger?.focus(), e.preventDefault());
					})
				})
			})
		})
	});
});
Ps.displayName = Ns;
function Fs(e) {
	return e ? "open" : "closed";
}
function Is(e) {
	return e === "indeterminate";
}
function Ls(e) {
	return Is(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Rs(e) {
	let t = document.activeElement;
	for (let n of e) if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function zs(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
function Bs(e, t, n) {
	let r = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1, a = zs(e, Math.max(i, 0));
	r.length === 1 && (a = a.filter((e) => e !== n));
	let o = a.find((e) => e.toLowerCase().startsWith(r.toLowerCase()));
	return o === n ? void 0 : o;
}
function Vs(e, t) {
	let { x: n, y: r } = e, i = !1;
	for (let e = 0, a = t.length - 1; e < t.length; a = e++) {
		let o = t[e], s = t[a], c = o.x, l = o.y, u = s.x, d = s.y;
		l > r != d > r && n < (u - c) * (r - l) / (d - l) + c && (i = !i);
	}
	return i;
}
function Hs(e, t) {
	return t ? Vs({
		x: e.clientX,
		y: e.clientY
	}, t) : !1;
}
function Us(e) {
	return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
var Ws = Ho, Gs = Wo, Ks = Jo, qs = Qo, Js = is, Ys = os, Xs = ls, Zs = fs, Qs = gs, $s = vs, ec = Ss, tc = ws, nc = Es, rc = As, ic = Ms, ac = Ps, oc = "DropdownMenu", [sc, cc] = de(oc, [Fo]), U = Fo(), [lc, uc] = sc(oc), dc = (t) => {
	let { __scopeDropdownMenu: n, children: r, dir: i, open: a, defaultOpen: o, onOpenChange: s, modal: c = !0 } = t, l = U(n), u = e.useRef(null), [d, f] = ge({
		prop: a,
		defaultProp: o ?? !1,
		onChange: s,
		caller: oc
	});
	return /* @__PURE__ */ (0, z.jsx)(lc, {
		scope: n,
		triggerId: Ee(),
		triggerRef: u,
		contentId: Ee(),
		open: d,
		onOpenChange: f,
		onOpenToggle: e.useCallback(() => f((e) => !e), [f]),
		modal: c,
		children: /* @__PURE__ */ (0, z.jsx)(Ws, {
			...l,
			open: d,
			onOpenChange: f,
			dir: i,
			modal: c,
			children: r
		})
	});
};
dc.displayName = oc;
var fc = "DropdownMenuTrigger", pc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, disabled: r = !1, ...i } = e, a = uc(fc, n), o = U(n);
	return /* @__PURE__ */ (0, z.jsx)(Gs, {
		asChild: !0,
		...o,
		children: /* @__PURE__ */ (0, z.jsx)(V.button, {
			type: "button",
			id: a.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": a.open,
			"aria-controls": a.open ? a.contentId : void 0,
			"data-state": a.open ? "open" : "closed",
			"data-disabled": r ? "" : void 0,
			disabled: r,
			...i,
			ref: te(t, a.triggerRef),
			onPointerDown: H(e.onPointerDown, (e) => {
				!r && e.button === 0 && e.ctrlKey === !1 && (a.onOpenToggle(), a.open || e.preventDefault());
			}),
			onKeyDown: H(e.onKeyDown, (e) => {
				r || (["Enter", " "].includes(e.key) && a.onOpenToggle(), e.key === "ArrowDown" && a.onOpenChange(!0), [
					"Enter",
					" ",
					"ArrowDown"
				].includes(e.key) && e.preventDefault());
			})
		})
	});
});
pc.displayName = fc;
var mc = "DropdownMenuPortal", hc = (e) => {
	let { __scopeDropdownMenu: t, ...n } = e, r = U(t);
	return /* @__PURE__ */ (0, z.jsx)(Ks, {
		...r,
		...n
	});
};
hc.displayName = mc;
var gc = "DropdownMenuContent", _c = e.forwardRef((t, n) => {
	let { __scopeDropdownMenu: r, ...i } = t, a = uc(gc, r), o = U(r), s = e.useRef(!1);
	return /* @__PURE__ */ (0, z.jsx)(qs, {
		id: a.contentId,
		"aria-labelledby": a.triggerId,
		...o,
		...i,
		ref: n,
		onCloseAutoFocus: H(t.onCloseAutoFocus, (e) => {
			s.current || a.triggerRef.current?.focus(), s.current = !1, e.preventDefault();
		}),
		onInteractOutside: H(t.onInteractOutside, (e) => {
			let t = e.detail.originalEvent, n = t.button === 0 && t.ctrlKey === !0, r = t.button === 2 || n;
			(!a.modal || r) && (s.current = !0);
		}),
		style: {
			...t.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
_c.displayName = gc;
var vc = "DropdownMenuGroup", yc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(Js, {
		...i,
		...r,
		ref: t
	});
});
yc.displayName = vc;
var bc = "DropdownMenuLabel", xc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(Ys, {
		...i,
		...r,
		ref: t
	});
});
xc.displayName = bc;
var Sc = "DropdownMenuItem", Cc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(Xs, {
		...i,
		...r,
		ref: t
	});
});
Cc.displayName = Sc;
var wc = "DropdownMenuCheckboxItem", Tc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(Zs, {
		...i,
		...r,
		ref: t
	});
});
Tc.displayName = wc;
var Ec = "DropdownMenuRadioGroup", Dc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(Qs, {
		...i,
		...r,
		ref: t
	});
});
Dc.displayName = Ec;
var Oc = "DropdownMenuRadioItem", kc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)($s, {
		...i,
		...r,
		ref: t
	});
});
kc.displayName = Oc;
var Ac = "DropdownMenuItemIndicator", jc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(ec, {
		...i,
		...r,
		ref: t
	});
});
jc.displayName = Ac;
var Mc = "DropdownMenuSeparator", Nc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(tc, {
		...i,
		...r,
		ref: t
	});
});
Nc.displayName = Mc;
var Pc = "DropdownMenuArrow", Fc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(nc, {
		...i,
		...r,
		ref: t
	});
});
Fc.displayName = Pc;
var Ic = (e) => {
	let { __scopeDropdownMenu: t, children: n, open: r, onOpenChange: i, defaultOpen: a } = e, o = U(t), [s, c] = ge({
		prop: r,
		defaultProp: a ?? !1,
		onChange: i,
		caller: "DropdownMenuSub"
	});
	return /* @__PURE__ */ (0, z.jsx)(rc, {
		...o,
		open: s,
		onOpenChange: c,
		children: n
	});
}, Lc = "DropdownMenuSubTrigger", Rc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(ic, {
		...i,
		...r,
		ref: t
	});
});
Rc.displayName = Lc;
var zc = "DropdownMenuSubContent", Bc = e.forwardRef((e, t) => {
	let { __scopeDropdownMenu: n, ...r } = e, i = U(n);
	return /* @__PURE__ */ (0, z.jsx)(ac, {
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
	});
});
Bc.displayName = zc;
var Vc = dc, Hc = pc, Uc = hc, Wc = _c, Gc = yc, Kc = xc, qc = Cc, Jc = Tc, Yc = Dc, Xc = kc, Zc = jc, Qc = Nc, $c = Ic, el = Rc, tl = Bc, nl = "Label", rl = e.forwardRef((e, t) => /* @__PURE__ */ (0, z.jsx)(V.label, {
	...e,
	ref: t,
	onMouseDown: (t) => {
		t.target.closest("button, input, select, textarea") || (e.onMouseDown?.(t), !t.defaultPrevented && t.detail > 1 && t.preventDefault());
	}
}));
rl.displayName = nl;
var il = rl, al = "Popover", [ol, sl] = de(al, [Ia]), cl = Ia(), [ll, ul] = ol(al), dl = (t) => {
	let { __scopePopover: n, children: r, open: i, defaultOpen: a, onOpenChange: o, modal: s = !1 } = t, c = cl(n), l = e.useRef(null), [u, d] = e.useState(!1), [f, p] = ge({
		prop: i,
		defaultProp: a ?? !1,
		onChange: o,
		caller: al
	});
	return /* @__PURE__ */ (0, z.jsx)(Qa, {
		...c,
		children: /* @__PURE__ */ (0, z.jsx)(ll, {
			scope: n,
			contentId: Ee(),
			triggerRef: l,
			open: f,
			onOpenChange: p,
			onOpenToggle: e.useCallback(() => p((e) => !e), [p]),
			hasCustomAnchor: u,
			onCustomAnchorAdd: e.useCallback(() => d(!0), []),
			onCustomAnchorRemove: e.useCallback(() => d(!1), []),
			modal: s,
			children: r
		})
	});
};
dl.displayName = al;
var fl = "PopoverAnchor", pl = e.forwardRef((t, n) => {
	let { __scopePopover: r, ...i } = t, a = ul(fl, r), o = cl(r), { onCustomAnchorAdd: s, onCustomAnchorRemove: c } = a;
	return e.useEffect(() => (s(), () => c()), [s, c]), /* @__PURE__ */ (0, z.jsx)($a, {
		...o,
		...i,
		ref: n
	});
});
pl.displayName = fl;
var ml = "PopoverTrigger", hl = e.forwardRef((e, t) => {
	let { __scopePopover: n, ...r } = e, i = ul(ml, n), a = cl(n), o = L(t, i.triggerRef), s = /* @__PURE__ */ (0, z.jsx)(V.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": i.open,
		"aria-controls": i.contentId,
		"data-state": Al(i.open),
		...r,
		ref: o,
		onClick: H(e.onClick, i.onOpenToggle)
	});
	return i.hasCustomAnchor ? s : /* @__PURE__ */ (0, z.jsx)($a, {
		asChild: !0,
		...a,
		children: s
	});
});
hl.displayName = ml;
var gl = "PopoverPortal", [_l, vl] = ol(gl, { forceMount: void 0 }), yl = (e) => {
	let { __scopePopover: t, forceMount: n, children: r, container: i } = e, a = ul(gl, t);
	return /* @__PURE__ */ (0, z.jsx)(_l, {
		scope: t,
		forceMount: n,
		children: /* @__PURE__ */ (0, z.jsx)(be, {
			present: n || a.open,
			children: /* @__PURE__ */ (0, z.jsx)(st, {
				asChild: !0,
				container: i,
				children: r
			})
		})
	});
};
yl.displayName = gl;
var bl = "PopoverContent", xl = e.forwardRef((e, t) => {
	let n = vl(bl, e.__scopePopover), { forceMount: r = n.forceMount, ...i } = e, a = ul(bl, e.__scopePopover);
	return /* @__PURE__ */ (0, z.jsx)(be, {
		present: r || a.open,
		children: a.modal ? /* @__PURE__ */ (0, z.jsx)(Cl, {
			...i,
			ref: t
		}) : /* @__PURE__ */ (0, z.jsx)(wl, {
			...i,
			ref: t
		})
	});
});
xl.displayName = bl;
var Sl = /* @__PURE__ */ re("PopoverContent.RemoveScroll"), Cl = e.forwardRef((t, n) => {
	let r = ul(bl, t.__scopePopover), i = e.useRef(null), a = L(n, i), o = e.useRef(!1);
	return e.useEffect(() => {
		let e = i.current;
		if (e) return kn(e);
	}, []), /* @__PURE__ */ (0, z.jsx)(bn, {
		as: Sl,
		allowPinchZoom: !0,
		children: /* @__PURE__ */ (0, z.jsx)(Tl, {
			...t,
			ref: a,
			trapFocus: r.open,
			disableOutsidePointerEvents: !0,
			onCloseAutoFocus: H(t.onCloseAutoFocus, (e) => {
				e.preventDefault(), o.current || r.triggerRef.current?.focus();
			}),
			onPointerDownOutside: H(t.onPointerDownOutside, (e) => {
				let t = e.detail.originalEvent, n = t.button === 0 && t.ctrlKey === !0;
				o.current = t.button === 2 || n;
			}, { checkForDefaultPrevented: !1 }),
			onFocusOutside: H(t.onFocusOutside, (e) => e.preventDefault(), { checkForDefaultPrevented: !1 })
		})
	});
}), wl = e.forwardRef((t, n) => {
	let r = ul(bl, t.__scopePopover), i = e.useRef(!1), a = e.useRef(!1);
	return /* @__PURE__ */ (0, z.jsx)(Tl, {
		...t,
		ref: n,
		trapFocus: !1,
		disableOutsidePointerEvents: !1,
		onCloseAutoFocus: (e) => {
			t.onCloseAutoFocus?.(e), e.defaultPrevented || (i.current || r.triggerRef.current?.focus(), e.preventDefault()), i.current = !1, a.current = !1;
		},
		onInteractOutside: (e) => {
			t.onInteractOutside?.(e), e.defaultPrevented || (i.current = !0, e.detail.originalEvent.type === "pointerdown" && (a.current = !0));
			let n = e.target;
			r.triggerRef.current?.contains(n) && e.preventDefault(), e.detail.originalEvent.type === "focusin" && a.current && e.preventDefault();
		}
	});
}), Tl = e.forwardRef((e, t) => {
	let { __scopePopover: n, trapFocus: r, onOpenAutoFocus: i, onCloseAutoFocus: a, disableOutsidePointerEvents: o, onEscapeKeyDown: s, onPointerDownOutside: c, onFocusOutside: l, onInteractOutside: u, ...d } = e, f = ul(bl, n), p = cl(n);
	return lt(), /* @__PURE__ */ (0, z.jsx)(Je, {
		asChild: !0,
		loop: !0,
		trapped: r,
		onMountAutoFocus: i,
		onUnmountAutoFocus: a,
		children: /* @__PURE__ */ (0, z.jsx)(Le, {
			asChild: !0,
			disableOutsidePointerEvents: o,
			onInteractOutside: u,
			onEscapeKeyDown: s,
			onPointerDownOutside: c,
			onFocusOutside: l,
			onDismiss: () => f.onOpenChange(!1),
			children: /* @__PURE__ */ (0, z.jsx)(eo, {
				"data-state": Al(f.open),
				role: "dialog",
				id: f.contentId,
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
			})
		})
	});
}), El = "PopoverClose", Dl = e.forwardRef((e, t) => {
	let { __scopePopover: n, ...r } = e, i = ul(El, n);
	return /* @__PURE__ */ (0, z.jsx)(V.button, {
		type: "button",
		...r,
		ref: t,
		onClick: H(e.onClick, () => i.onOpenChange(!1))
	});
});
Dl.displayName = El;
var Ol = "PopoverArrow", kl = e.forwardRef((e, t) => {
	let { __scopePopover: n, ...r } = e, i = cl(n);
	return /* @__PURE__ */ (0, z.jsx)(to, {
		...i,
		...r,
		ref: t
	});
});
kl.displayName = Ol;
function Al(e) {
	return e ? "open" : "closed";
}
var jl = dl, Ml = hl, Nl = yl, Pl = xl, Fl = "Separator", Il = "horizontal", Ll = ["horizontal", "vertical"], Rl = e.forwardRef((e, t) => {
	let { decorative: n, orientation: r = Il, ...i } = e, a = zl(r) ? r : Il, o = n ? { role: "none" } : {
		"aria-orientation": a === "vertical" ? a : void 0,
		role: "separator"
	};
	return /* @__PURE__ */ (0, z.jsx)(V.div, {
		"data-orientation": a,
		...o,
		...i,
		ref: t
	});
});
Rl.displayName = Fl;
function zl(e) {
	return Ll.includes(e);
}
var Bl = Rl, Vl = (e, t) => {
	let n = Array(e.length + t.length);
	for (let t = 0; t < e.length; t++) n[t] = e[t];
	for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
	return n;
}, Hl = (e, t) => ({
	classGroupId: e,
	validator: t
}), Ul = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
	nextPart: e,
	validators: t,
	classGroupId: n
}), Wl = "-", Gl = [], Kl = "arbitrary..", ql = (e) => {
	let t = Xl(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			if (e.startsWith("[") && e.endsWith("]")) return Yl(e);
			let n = e.split(Wl);
			return Jl(n, +(n[0] === "" && n.length > 1), t);
		},
		getConflictingClassGroupIds: (e, t) => {
			if (t) {
				let t = r[e], i = n[e];
				return t ? i ? Vl(i, t) : t : i || Gl;
			}
			return n[e] || Gl;
		}
	};
}, Jl = (e, t, n) => {
	if (e.length - t === 0) return n.classGroupId;
	let r = e[t], i = n.nextPart.get(r);
	if (i) {
		let n = Jl(e, t + 1, i);
		if (n) return n;
	}
	let a = n.validators;
	if (a === null) return;
	let o = t === 0 ? e.join(Wl) : e.slice(t).join(Wl), s = a.length;
	for (let e = 0; e < s; e++) {
		let t = a[e];
		if (t.validator(o)) return t.classGroupId;
	}
}, Yl = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	let t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
	return r ? Kl + r : void 0;
})(), Xl = (e) => {
	let { theme: t, classGroups: n } = e;
	return Zl(n, t);
}, Zl = (e, t) => {
	let n = Ul();
	for (let r in e) {
		let i = e[r];
		Ql(i, n, r, t);
	}
	return n;
}, Ql = (e, t, n, r) => {
	let i = e.length;
	for (let a = 0; a < i; a++) {
		let i = e[a];
		$l(i, t, n, r);
	}
}, $l = (e, t, n, r) => {
	if (typeof e == "string") {
		eu(e, t, n);
		return;
	}
	if (typeof e == "function") {
		tu(e, t, n, r);
		return;
	}
	nu(e, t, n, r);
}, eu = (e, t, n) => {
	let r = e === "" ? t : ru(t, e);
	r.classGroupId = n;
}, tu = (e, t, n, r) => {
	if (iu(e)) {
		Ql(e(r), t, n, r);
		return;
	}
	t.validators === null && (t.validators = []), t.validators.push(Hl(n, e));
}, nu = (e, t, n, r) => {
	let i = Object.entries(e), a = i.length;
	for (let e = 0; e < a; e++) {
		let [a, o] = i[e];
		Ql(o, ru(t, a), n, r);
	}
}, ru = (e, t) => {
	let n = e, r = t.split(Wl), i = r.length;
	for (let e = 0; e < i; e++) {
		let t = r[e], i = n.nextPart.get(t);
		i || (i = Ul(), n.nextPart.set(t, i)), n = i;
	}
	return n;
}, iu = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, au = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = Object.create(null), r = Object.create(null), i = (i, a) => {
		n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null));
	};
	return {
		get(e) {
			let t = n[e];
			if (t !== void 0) return t;
			if ((t = r[e]) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			e in n ? n[e] = t : i(e, t);
		}
	};
}, ou = "!", su = ":", cu = [], lu = (e, t, n, r, i) => ({
	modifiers: e,
	hasImportantModifier: t,
	baseClassName: n,
	maybePostfixModifierPosition: r,
	isExternal: i
}), uu = (e) => {
	let { prefix: t, experimentalParseClassName: n } = e, r = (e) => {
		let t = [], n = 0, r = 0, i = 0, a, o = e.length;
		for (let s = 0; s < o; s++) {
			let o = e[s];
			if (n === 0 && r === 0) {
				if (o === su) {
					t.push(e.slice(i, s)), i = s + 1;
					continue;
				}
				if (o === "/") {
					a = s;
					continue;
				}
			}
			o === "[" ? n++ : o === "]" ? n-- : o === "(" ? r++ : o === ")" && r--;
		}
		let s = t.length === 0 ? e : e.slice(i), c = s, l = !1;
		s.endsWith(ou) ? (c = s.slice(0, -1), l = !0) : s.startsWith(ou) && (c = s.slice(1), l = !0);
		let u = a && a > i ? a - i : void 0;
		return lu(t, l, c, u);
	};
	if (t) {
		let e = t + su, n = r;
		r = (t) => t.startsWith(e) ? n(t.slice(e.length)) : lu(cu, !1, t, void 0, !0);
	}
	if (n) {
		let e = r;
		r = (t) => n({
			className: t,
			parseClassName: e
		});
	}
	return r;
}, du = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.orderSensitiveModifiers.forEach((e, n) => {
		t.set(e, 1e6 + n);
	}), (e) => {
		let n = [], r = [];
		for (let i = 0; i < e.length; i++) {
			let a = e[i], o = a[0] === "[", s = t.has(a);
			o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
		}
		return r.length > 0 && (r.sort(), n.push(...r)), n;
	};
}, fu = (e) => ({
	cache: au(e.cacheSize),
	parseClassName: uu(e),
	sortModifiers: du(e),
	...ql(e)
}), pu = /\s+/, mu = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a } = t, o = [], s = e.trim().split(pu), c = "";
	for (let e = s.length - 1; e >= 0; --e) {
		let t = s[e], { isExternal: l, modifiers: u, hasImportantModifier: d, baseClassName: f, maybePostfixModifierPosition: p } = n(t);
		if (l) {
			c = t + (c.length > 0 ? " " + c : c);
			continue;
		}
		let m = !!p, h = r(m ? f.substring(0, p) : f);
		if (!h) {
			if (!m) {
				c = t + (c.length > 0 ? " " + c : c);
				continue;
			}
			if (h = r(f), !h) {
				c = t + (c.length > 0 ? " " + c : c);
				continue;
			}
			m = !1;
		}
		let g = u.length === 0 ? "" : u.length === 1 ? u[0] : a(u).join(":"), _ = d ? g + ou : g, v = _ + h;
		if (o.indexOf(v) > -1) continue;
		o.push(v);
		let y = i(h, m);
		for (let e = 0; e < y.length; ++e) {
			let t = y[e];
			o.push(_ + t);
		}
		c = t + (c.length > 0 ? " " + c : c);
	}
	return c;
}, hu = (...e) => {
	let t = 0, n, r, i = "";
	for (; t < e.length;) (n = e[t++]) && (r = gu(n)) && (i && (i += " "), i += r);
	return i;
}, gu = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = gu(e[r])) && (n && (n += " "), n += t);
	return n;
}, _u = (e, ...t) => {
	let n, r, i, a, o = (o) => (n = fu(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)), s = (e) => {
		let t = r(e);
		if (t) return t;
		let a = mu(e, n);
		return i(e, a), a;
	};
	return a = o, (...e) => a(hu(...e));
}, vu = [], W = (e) => {
	let t = (t) => t[e] || vu;
	return t.isThemeGetter = !0, t;
}, yu = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, bu = /^\((?:(\w[\w-]*):)?(.+)\)$/i, xu = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Su = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Cu = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, wu = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Tu = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Eu = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Du = (e) => xu.test(e), G = (e) => !!e && !Number.isNaN(Number(e)), Ou = (e) => !!e && Number.isInteger(Number(e)), ku = (e) => e.endsWith("%") && G(e.slice(0, -1)), Au = (e) => Su.test(e), ju = () => !0, Mu = (e) => Cu.test(e) && !wu.test(e), Nu = () => !1, Pu = (e) => Tu.test(e), Fu = (e) => Eu.test(e), Iu = (e) => !K(e) && !q(e), Lu = (e) => Qu(e, nd, Nu), K = (e) => yu.test(e), Ru = (e) => Qu(e, rd, Mu), zu = (e) => Qu(e, id, G), Bu = (e) => Qu(e, od, ju), Vu = (e) => Qu(e, ad, Nu), Hu = (e) => Qu(e, ed, Nu), Uu = (e) => Qu(e, td, Fu), Wu = (e) => Qu(e, sd, Pu), q = (e) => bu.test(e), Gu = (e) => $u(e, rd), Ku = (e) => $u(e, ad), qu = (e) => $u(e, ed), Ju = (e) => $u(e, nd), Yu = (e) => $u(e, td), Xu = (e) => $u(e, sd, !0), Zu = (e) => $u(e, od, !0), Qu = (e, t, n) => {
	let r = yu.exec(e);
	return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, $u = (e, t, n = !1) => {
	let r = bu.exec(e);
	return r ? r[1] ? t(r[1]) : n : !1;
}, ed = (e) => e === "position" || e === "percentage", td = (e) => e === "image" || e === "url", nd = (e) => e === "length" || e === "size" || e === "bg-size", rd = (e) => e === "length", id = (e) => e === "number", ad = (e) => e === "family-name", od = (e) => e === "number" || e === "weight", sd = (e) => e === "shadow", cd = /* @__PURE__ */ _u(() => {
	let e = W("color"), t = W("font"), n = W("text"), r = W("font-weight"), i = W("tracking"), a = W("leading"), o = W("breakpoint"), s = W("container"), c = W("spacing"), l = W("radius"), u = W("shadow"), d = W("inset-shadow"), f = W("text-shadow"), p = W("drop-shadow"), m = W("blur"), h = W("perspective"), g = W("aspect"), _ = W("ease"), v = W("animate"), y = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], b = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	], x = () => [
		...b(),
		q,
		K
	], S = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], C = () => [
		"auto",
		"contain",
		"none"
	], w = () => [
		q,
		K,
		c
	], T = () => [
		Du,
		"full",
		"auto",
		...w()
	], E = () => [
		Ou,
		"none",
		"subgrid",
		q,
		K
	], D = () => [
		"auto",
		{ span: [
			"full",
			Ou,
			q,
			K
		] },
		Ou,
		q,
		K
	], O = () => [
		Ou,
		"auto",
		q,
		K
	], k = () => [
		"auto",
		"min",
		"max",
		"fr",
		q,
		K
	], A = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	], j = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	], M = () => ["auto", ...w()], N = () => [
		Du,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], P = () => [
		Du,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...w()
	], F = () => [
		Du,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...w()
	], I = () => [
		e,
		q,
		K
	], ee = () => [
		...b(),
		qu,
		Hu,
		{ position: [q, K] }
	], te = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }], L = () => [
		"auto",
		"cover",
		"contain",
		Ju,
		Lu,
		{ size: [q, K] }
	], ne = () => [
		ku,
		Gu,
		Ru
	], R = () => [
		"",
		"none",
		"full",
		l,
		q,
		K
	], z = () => [
		"",
		G,
		Gu,
		Ru
	], re = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	], ie = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], B = () => [
		G,
		ku,
		qu,
		Hu
	], ae = () => [
		"",
		"none",
		m,
		q,
		K
	], oe = () => [
		"none",
		G,
		q,
		K
	], se = () => [
		"none",
		G,
		q,
		K
	], ce = () => [
		G,
		q,
		K
	], V = () => [
		Du,
		"full",
		...w()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [Au],
			breakpoint: [Au],
			color: [ju],
			container: [Au],
			"drop-shadow": [Au],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [Iu],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [Au],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [Au],
			shadow: [Au],
			spacing: ["px", G],
			text: [Au],
			"text-shadow": [Au],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				Du,
				K,
				q,
				g
			] }],
			container: ["container"],
			columns: [{ columns: [
				G,
				K,
				q,
				s
			] }],
			"break-after": [{ "break-after": y() }],
			"break-before": [{ "break-before": y() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			sr: ["sr-only", "not-sr-only"],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: x() }],
			overflow: [{ overflow: S() }],
			"overflow-x": [{ "overflow-x": S() }],
			"overflow-y": [{ "overflow-y": S() }],
			overscroll: [{ overscroll: C() }],
			"overscroll-x": [{ "overscroll-x": C() }],
			"overscroll-y": [{ "overscroll-y": C() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: T() }],
			"inset-x": [{ "inset-x": T() }],
			"inset-y": [{ "inset-y": T() }],
			start: [{
				"inset-s": T(),
				start: T()
			}],
			end: [{
				"inset-e": T(),
				end: T()
			}],
			"inset-bs": [{ "inset-bs": T() }],
			"inset-be": [{ "inset-be": T() }],
			top: [{ top: T() }],
			right: [{ right: T() }],
			bottom: [{ bottom: T() }],
			left: [{ left: T() }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				Ou,
				"auto",
				q,
				K
			] }],
			basis: [{ basis: [
				Du,
				"full",
				"auto",
				s,
				...w()
			] }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			flex: [{ flex: [
				G,
				Du,
				"auto",
				"initial",
				"none",
				K
			] }],
			grow: [{ grow: [
				"",
				G,
				q,
				K
			] }],
			shrink: [{ shrink: [
				"",
				G,
				q,
				K
			] }],
			order: [{ order: [
				Ou,
				"first",
				"last",
				"none",
				q,
				K
			] }],
			"grid-cols": [{ "grid-cols": E() }],
			"col-start-end": [{ col: D() }],
			"col-start": [{ "col-start": O() }],
			"col-end": [{ "col-end": O() }],
			"grid-rows": [{ "grid-rows": E() }],
			"row-start-end": [{ row: D() }],
			"row-start": [{ "row-start": O() }],
			"row-end": [{ "row-end": O() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": k() }],
			"auto-rows": [{ "auto-rows": k() }],
			gap: [{ gap: w() }],
			"gap-x": [{ "gap-x": w() }],
			"gap-y": [{ "gap-y": w() }],
			"justify-content": [{ justify: [...A(), "normal"] }],
			"justify-items": [{ "justify-items": [...j(), "normal"] }],
			"justify-self": [{ "justify-self": ["auto", ...j()] }],
			"align-content": [{ content: ["normal", ...A()] }],
			"align-items": [{ items: [...j(), { baseline: ["", "last"] }] }],
			"align-self": [{ self: [
				"auto",
				...j(),
				{ baseline: ["", "last"] }
			] }],
			"place-content": [{ "place-content": A() }],
			"place-items": [{ "place-items": [...j(), "baseline"] }],
			"place-self": [{ "place-self": ["auto", ...j()] }],
			p: [{ p: w() }],
			px: [{ px: w() }],
			py: [{ py: w() }],
			ps: [{ ps: w() }],
			pe: [{ pe: w() }],
			pbs: [{ pbs: w() }],
			pbe: [{ pbe: w() }],
			pt: [{ pt: w() }],
			pr: [{ pr: w() }],
			pb: [{ pb: w() }],
			pl: [{ pl: w() }],
			m: [{ m: M() }],
			mx: [{ mx: M() }],
			my: [{ my: M() }],
			ms: [{ ms: M() }],
			me: [{ me: M() }],
			mbs: [{ mbs: M() }],
			mbe: [{ mbe: M() }],
			mt: [{ mt: M() }],
			mr: [{ mr: M() }],
			mb: [{ mb: M() }],
			ml: [{ ml: M() }],
			"space-x": [{ "space-x": w() }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": w() }],
			"space-y-reverse": ["space-y-reverse"],
			size: [{ size: N() }],
			"inline-size": [{ inline: ["auto", ...P()] }],
			"min-inline-size": [{ "min-inline": ["auto", ...P()] }],
			"max-inline-size": [{ "max-inline": ["none", ...P()] }],
			"block-size": [{ block: ["auto", ...F()] }],
			"min-block-size": [{ "min-block": ["auto", ...F()] }],
			"max-block-size": [{ "max-block": ["none", ...F()] }],
			w: [{ w: [
				s,
				"screen",
				...N()
			] }],
			"min-w": [{ "min-w": [
				s,
				"screen",
				"none",
				...N()
			] }],
			"max-w": [{ "max-w": [
				s,
				"screen",
				"none",
				"prose",
				{ screen: [o] },
				...N()
			] }],
			h: [{ h: [
				"screen",
				"lh",
				...N()
			] }],
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...N()
			] }],
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...N()
			] }],
			"font-size": [{ text: [
				"base",
				n,
				Gu,
				Ru
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				r,
				Zu,
				Bu
			] }],
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				ku,
				K
			] }],
			"font-family": [{ font: [
				Ku,
				Vu,
				t
			] }],
			"font-features": [{ "font-features": [K] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				i,
				q,
				K
			] }],
			"line-clamp": [{ "line-clamp": [
				G,
				"none",
				q,
				zu
			] }],
			leading: [{ leading: [a, ...w()] }],
			"list-image": [{ "list-image": [
				"none",
				q,
				K
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				q,
				K
			] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"placeholder-color": [{ placeholder: I() }],
			"text-color": [{ text: I() }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...re(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				G,
				"from-font",
				"auto",
				q,
				Ru
			] }],
			"text-decoration-color": [{ decoration: I() }],
			"underline-offset": [{ "underline-offset": [
				G,
				"auto",
				q,
				K
			] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: w() }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				q,
				K
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: [
				"none",
				q,
				K
			] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: ee() }],
			"bg-repeat": [{ bg: te() }],
			"bg-size": [{ bg: L() }],
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						Ou,
						q,
						K
					],
					radial: [
						"",
						q,
						K
					],
					conic: [
						Ou,
						q,
						K
					]
				},
				Yu,
				Uu
			] }],
			"bg-color": [{ bg: I() }],
			"gradient-from-pos": [{ from: ne() }],
			"gradient-via-pos": [{ via: ne() }],
			"gradient-to-pos": [{ to: ne() }],
			"gradient-from": [{ from: I() }],
			"gradient-via": [{ via: I() }],
			"gradient-to": [{ to: I() }],
			rounded: [{ rounded: R() }],
			"rounded-s": [{ "rounded-s": R() }],
			"rounded-e": [{ "rounded-e": R() }],
			"rounded-t": [{ "rounded-t": R() }],
			"rounded-r": [{ "rounded-r": R() }],
			"rounded-b": [{ "rounded-b": R() }],
			"rounded-l": [{ "rounded-l": R() }],
			"rounded-ss": [{ "rounded-ss": R() }],
			"rounded-se": [{ "rounded-se": R() }],
			"rounded-ee": [{ "rounded-ee": R() }],
			"rounded-es": [{ "rounded-es": R() }],
			"rounded-tl": [{ "rounded-tl": R() }],
			"rounded-tr": [{ "rounded-tr": R() }],
			"rounded-br": [{ "rounded-br": R() }],
			"rounded-bl": [{ "rounded-bl": R() }],
			"border-w": [{ border: z() }],
			"border-w-x": [{ "border-x": z() }],
			"border-w-y": [{ "border-y": z() }],
			"border-w-s": [{ "border-s": z() }],
			"border-w-e": [{ "border-e": z() }],
			"border-w-bs": [{ "border-bs": z() }],
			"border-w-be": [{ "border-be": z() }],
			"border-w-t": [{ "border-t": z() }],
			"border-w-r": [{ "border-r": z() }],
			"border-w-b": [{ "border-b": z() }],
			"border-w-l": [{ "border-l": z() }],
			"divide-x": [{ "divide-x": z() }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": z() }],
			"divide-y-reverse": ["divide-y-reverse"],
			"border-style": [{ border: [
				...re(),
				"hidden",
				"none"
			] }],
			"divide-style": [{ divide: [
				...re(),
				"hidden",
				"none"
			] }],
			"border-color": [{ border: I() }],
			"border-color-x": [{ "border-x": I() }],
			"border-color-y": [{ "border-y": I() }],
			"border-color-s": [{ "border-s": I() }],
			"border-color-e": [{ "border-e": I() }],
			"border-color-bs": [{ "border-bs": I() }],
			"border-color-be": [{ "border-be": I() }],
			"border-color-t": [{ "border-t": I() }],
			"border-color-r": [{ "border-r": I() }],
			"border-color-b": [{ "border-b": I() }],
			"border-color-l": [{ "border-l": I() }],
			"divide-color": [{ divide: I() }],
			"outline-style": [{ outline: [
				...re(),
				"none",
				"hidden"
			] }],
			"outline-offset": [{ "outline-offset": [
				G,
				q,
				K
			] }],
			"outline-w": [{ outline: [
				"",
				G,
				Gu,
				Ru
			] }],
			"outline-color": [{ outline: I() }],
			shadow: [{ shadow: [
				"",
				"none",
				u,
				Xu,
				Wu
			] }],
			"shadow-color": [{ shadow: I() }],
			"inset-shadow": [{ "inset-shadow": [
				"none",
				d,
				Xu,
				Wu
			] }],
			"inset-shadow-color": [{ "inset-shadow": I() }],
			"ring-w": [{ ring: z() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: I() }],
			"ring-offset-w": [{ "ring-offset": [G, Ru] }],
			"ring-offset-color": [{ "ring-offset": I() }],
			"inset-ring-w": [{ "inset-ring": z() }],
			"inset-ring-color": [{ "inset-ring": I() }],
			"text-shadow": [{ "text-shadow": [
				"none",
				f,
				Xu,
				Wu
			] }],
			"text-shadow-color": [{ "text-shadow": I() }],
			opacity: [{ opacity: [
				G,
				q,
				K
			] }],
			"mix-blend": [{ "mix-blend": [
				...ie(),
				"plus-darker",
				"plus-lighter"
			] }],
			"bg-blend": [{ "bg-blend": ie() }],
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			"mask-image-linear-pos": [{ "mask-linear": [G] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": B() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": B() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": I() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": I() }],
			"mask-image-t-from-pos": [{ "mask-t-from": B() }],
			"mask-image-t-to-pos": [{ "mask-t-to": B() }],
			"mask-image-t-from-color": [{ "mask-t-from": I() }],
			"mask-image-t-to-color": [{ "mask-t-to": I() }],
			"mask-image-r-from-pos": [{ "mask-r-from": B() }],
			"mask-image-r-to-pos": [{ "mask-r-to": B() }],
			"mask-image-r-from-color": [{ "mask-r-from": I() }],
			"mask-image-r-to-color": [{ "mask-r-to": I() }],
			"mask-image-b-from-pos": [{ "mask-b-from": B() }],
			"mask-image-b-to-pos": [{ "mask-b-to": B() }],
			"mask-image-b-from-color": [{ "mask-b-from": I() }],
			"mask-image-b-to-color": [{ "mask-b-to": I() }],
			"mask-image-l-from-pos": [{ "mask-l-from": B() }],
			"mask-image-l-to-pos": [{ "mask-l-to": B() }],
			"mask-image-l-from-color": [{ "mask-l-from": I() }],
			"mask-image-l-to-color": [{ "mask-l-to": I() }],
			"mask-image-x-from-pos": [{ "mask-x-from": B() }],
			"mask-image-x-to-pos": [{ "mask-x-to": B() }],
			"mask-image-x-from-color": [{ "mask-x-from": I() }],
			"mask-image-x-to-color": [{ "mask-x-to": I() }],
			"mask-image-y-from-pos": [{ "mask-y-from": B() }],
			"mask-image-y-to-pos": [{ "mask-y-to": B() }],
			"mask-image-y-from-color": [{ "mask-y-from": I() }],
			"mask-image-y-to-color": [{ "mask-y-to": I() }],
			"mask-image-radial": [{ "mask-radial": [q, K] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": B() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": B() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": I() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": I() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": b() }],
			"mask-image-conic-pos": [{ "mask-conic": [G] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": B() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": B() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": I() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": I() }],
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			"mask-position": [{ mask: ee() }],
			"mask-repeat": [{ mask: te() }],
			"mask-size": [{ mask: L() }],
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			"mask-image": [{ mask: [
				"none",
				q,
				K
			] }],
			filter: [{ filter: [
				"",
				"none",
				q,
				K
			] }],
			blur: [{ blur: ae() }],
			brightness: [{ brightness: [
				G,
				q,
				K
			] }],
			contrast: [{ contrast: [
				G,
				q,
				K
			] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				p,
				Xu,
				Wu
			] }],
			"drop-shadow-color": [{ "drop-shadow": I() }],
			grayscale: [{ grayscale: [
				"",
				G,
				q,
				K
			] }],
			"hue-rotate": [{ "hue-rotate": [
				G,
				q,
				K
			] }],
			invert: [{ invert: [
				"",
				G,
				q,
				K
			] }],
			saturate: [{ saturate: [
				G,
				q,
				K
			] }],
			sepia: [{ sepia: [
				"",
				G,
				q,
				K
			] }],
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				q,
				K
			] }],
			"backdrop-blur": [{ "backdrop-blur": ae() }],
			"backdrop-brightness": [{ "backdrop-brightness": [
				G,
				q,
				K
			] }],
			"backdrop-contrast": [{ "backdrop-contrast": [
				G,
				q,
				K
			] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				G,
				q,
				K
			] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				G,
				q,
				K
			] }],
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				G,
				q,
				K
			] }],
			"backdrop-opacity": [{ "backdrop-opacity": [
				G,
				q,
				K
			] }],
			"backdrop-saturate": [{ "backdrop-saturate": [
				G,
				q,
				K
			] }],
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				G,
				q,
				K
			] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": w() }],
			"border-spacing-x": [{ "border-spacing-x": w() }],
			"border-spacing-y": [{ "border-spacing-y": w() }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				q,
				K
			] }],
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			duration: [{ duration: [
				G,
				"initial",
				q,
				K
			] }],
			ease: [{ ease: [
				"linear",
				"initial",
				_,
				q,
				K
			] }],
			delay: [{ delay: [
				G,
				q,
				K
			] }],
			animate: [{ animate: [
				"none",
				v,
				q,
				K
			] }],
			backface: [{ backface: ["hidden", "visible"] }],
			perspective: [{ perspective: [
				h,
				q,
				K
			] }],
			"perspective-origin": [{ "perspective-origin": x() }],
			rotate: [{ rotate: oe() }],
			"rotate-x": [{ "rotate-x": oe() }],
			"rotate-y": [{ "rotate-y": oe() }],
			"rotate-z": [{ "rotate-z": oe() }],
			scale: [{ scale: se() }],
			"scale-x": [{ "scale-x": se() }],
			"scale-y": [{ "scale-y": se() }],
			"scale-z": [{ "scale-z": se() }],
			"scale-3d": ["scale-3d"],
			skew: [{ skew: ce() }],
			"skew-x": [{ "skew-x": ce() }],
			"skew-y": [{ "skew-y": ce() }],
			transform: [{ transform: [
				q,
				K,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			"transform-origin": [{ origin: x() }],
			"transform-style": [{ transform: ["3d", "flat"] }],
			translate: [{ translate: V() }],
			"translate-x": [{ "translate-x": V() }],
			"translate-y": [{ "translate-y": V() }],
			"translate-z": [{ "translate-z": V() }],
			"translate-none": ["translate-none"],
			accent: [{ accent: I() }],
			appearance: [{ appearance: ["none", "auto"] }],
			"caret-color": [{ caret: I() }],
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				q,
				K
			] }],
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scroll-m": [{ "scroll-m": w() }],
			"scroll-mx": [{ "scroll-mx": w() }],
			"scroll-my": [{ "scroll-my": w() }],
			"scroll-ms": [{ "scroll-ms": w() }],
			"scroll-me": [{ "scroll-me": w() }],
			"scroll-mbs": [{ "scroll-mbs": w() }],
			"scroll-mbe": [{ "scroll-mbe": w() }],
			"scroll-mt": [{ "scroll-mt": w() }],
			"scroll-mr": [{ "scroll-mr": w() }],
			"scroll-mb": [{ "scroll-mb": w() }],
			"scroll-ml": [{ "scroll-ml": w() }],
			"scroll-p": [{ "scroll-p": w() }],
			"scroll-px": [{ "scroll-px": w() }],
			"scroll-py": [{ "scroll-py": w() }],
			"scroll-ps": [{ "scroll-ps": w() }],
			"scroll-pe": [{ "scroll-pe": w() }],
			"scroll-pbs": [{ "scroll-pbs": w() }],
			"scroll-pbe": [{ "scroll-pbe": w() }],
			"scroll-pt": [{ "scroll-pt": w() }],
			"scroll-pr": [{ "scroll-pr": w() }],
			"scroll-pb": [{ "scroll-pb": w() }],
			"scroll-pl": [{ "scroll-pl": w() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				q,
				K
			] }],
			fill: [{ fill: ["none", ...I()] }],
			"stroke-w": [{ stroke: [
				G,
				Gu,
				Ru,
				zu
			] }],
			stroke: [{ stroke: ["none", ...I()] }],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
});
//#endregion
//#region src/lib/utils.ts
function J(...e) {
	return cd(N(e));
}
//#endregion
//#region src/components/ui/button.tsx
var ld = I("inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
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
});
function Y({ className: e, variant: t = "default", size: n = "default", asChild: r = !1, ...i }) {
	return /* @__PURE__ */ (0, z.jsx)(r ? ie : "button", {
		"data-slot": "button",
		"data-variant": t,
		"data-size": n,
		className: J(ld({
			variant: t,
			size: n,
			className: e
		})),
		...i
	});
}
//#endregion
//#region src/components/ui/card.tsx
function ud({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "card",
		className: J("flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm", e),
		...t
	});
}
function dd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "card-header",
		className: J("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", e),
		...t
	});
}
function fd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "card-title",
		className: J("leading-none font-semibold", e),
		...t
	});
}
function pd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "card-description",
		className: J("text-sm text-muted-foreground", e),
		...t
	});
}
function md({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "card-action",
		className: J("col-start-2 row-span-2 row-start-1 self-start justify-self-end", e),
		...t
	});
}
function hd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "card-content",
		className: J("px-6", e),
		...t
	});
}
function gd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "card-footer",
		className: J("flex items-center px-6 [.border-t]:pt-6", e),
		...t
	});
}
//#endregion
//#region src/components/ui/input.tsx
function _d({ className: e, type: t, ...n }) {
	return /* @__PURE__ */ (0, z.jsx)("input", {
		type: t,
		"data-slot": "input",
		className: J("h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", e),
		...n
	});
}
//#endregion
//#region src/components/ui/label.tsx
function vd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(il, {
		"data-slot": "label",
		className: J("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e),
		...t
	});
}
//#endregion
//#region src/components/ui/separator.tsx
function yd({ className: e, orientation: t = "horizontal", decorative: n = !0, ...r }) {
	return /* @__PURE__ */ (0, z.jsx)(Bl, {
		"data-slot": "separator",
		decorative: n,
		orientation: t,
		className: J("shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", e),
		...r
	});
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js
var bd = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), xd = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Sd = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Cd = (e) => {
	let t = Sd(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, wd = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, Td = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Ed = r({}), Dd = () => s(Ed), Od = a(({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: a = "", children: o, iconNode: s, ...c }, l) => {
	let { size: u = 24, strokeWidth: d = 2, absoluteStrokeWidth: f = !1, color: p = "currentColor", className: m = "" } = Dd() ?? {}, h = r ?? f ? Number(n ?? d) * 24 / Number(t ?? u) : n ?? d;
	return i("svg", {
		ref: l,
		...wd,
		width: t ?? u ?? wd.width,
		height: t ?? u ?? wd.height,
		stroke: e ?? p,
		strokeWidth: h,
		className: bd("lucide", m, a),
		...!o && !Td(c) && { "aria-hidden": "true" },
		...c
	}, [...s.map(([e, t]) => i(e, t)), ...Array.isArray(o) ? o : [o]]);
}), X = (e, t) => {
	let n = a(({ className: n, ...r }, a) => i(Od, {
		ref: a,
		iconNode: t,
		className: bd(`lucide-${xd(Cd(e))}`, `lucide-${e}`, n),
		...r
	}));
	return n.displayName = Cd(e), n;
}, kd = X("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Ad = X("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), jd = X("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]), Md = X("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), Nd = X("chevron-up", [["path", {
	d: "m18 15-6-6-6 6",
	key: "153udz"
}]]), Pd = X("circle-alert", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "8",
		y2: "12",
		key: "1pkeuh"
	}],
	["line", {
		x1: "12",
		x2: "12.01",
		y1: "16",
		y2: "16",
		key: "4dfq90"
	}]
]), Fd = X("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]), Id = X("circle", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}]]), Ld = X("clipboard-list", [
	["rect", {
		width: "8",
		height: "4",
		x: "8",
		y: "2",
		rx: "1",
		ry: "1",
		key: "tgr4d6"
	}],
	["path", {
		d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
		key: "116196"
	}],
	["path", {
		d: "M12 11h4",
		key: "1jrz19"
	}],
	["path", {
		d: "M12 16h4",
		key: "n85exb"
	}],
	["path", {
		d: "M8 11h.01",
		key: "1dfujw"
	}],
	["path", {
		d: "M8 16h.01",
		key: "18s6g9"
	}]
]), Rd = X("expand", [
	["path", {
		d: "m15 15 6 6",
		key: "1s409w"
	}],
	["path", {
		d: "m15 9 6-6",
		key: "ko1vev"
	}],
	["path", {
		d: "M21 16v5h-5",
		key: "1ck2sf"
	}],
	["path", {
		d: "M21 8V3h-5",
		key: "1qoq8a"
	}],
	["path", {
		d: "M3 16v5h5",
		key: "1t08am"
	}],
	["path", {
		d: "m3 21 6-6",
		key: "wwnumi"
	}],
	["path", {
		d: "M3 8V3h5",
		key: "1ln10m"
	}],
	["path", {
		d: "M9 9 3 3",
		key: "v551iv"
	}]
]), zd = X("info", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 16v-4",
		key: "1dtifu"
	}],
	["path", {
		d: "M12 8h.01",
		key: "e9boi3"
	}]
]), Bd = X("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Vd = X("monitor", [
	["rect", {
		width: "20",
		height: "14",
		x: "2",
		y: "3",
		rx: "2",
		key: "48i651"
	}],
	["line", {
		x1: "8",
		x2: "16",
		y1: "21",
		y2: "21",
		key: "1svkeh"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "17",
		y2: "21",
		key: "vw1qmm"
	}]
]), Hd = X("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), Ud = X("panel-right", [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2",
	key: "afitv7"
}], ["path", {
	d: "M15 3v18",
	key: "14nvp0"
}]]), Wd = X("save", [
	["path", {
		d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
		key: "1c8476"
	}],
	["path", {
		d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
		key: "1ydtos"
	}],
	["path", {
		d: "M7 3v4a1 1 0 0 0 1 1h7",
		key: "t51u73"
	}]
]), Gd = X("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]), Kd = X("sun", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "m17.66 17.66 1.41 1.41",
		key: "ptbguv"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m6.34 17.66-1.41 1.41",
		key: "1m8zz5"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}]
]), qd = X("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region src/components/ui/dialog.tsx
function Jd({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(ur, {
		"data-slot": "dialog",
		...e
	});
}
function Yd({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(dr, {
		"data-slot": "dialog-trigger",
		...e
	});
}
function Xd({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(fr, {
		"data-slot": "dialog-portal",
		...e
	});
}
function Zd({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(_r, {
		"data-slot": "dialog-close",
		...e
	});
}
function Qd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(pr, {
		"data-slot": "dialog-overlay",
		className: J("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", e),
		...t
	});
}
function $d({ className: e, children: t, showCloseButton: n = !0, ...r }) {
	return /* @__PURE__ */ (0, z.jsxs)(Xd, {
		"data-slot": "dialog-portal",
		children: [/* @__PURE__ */ (0, z.jsx)(Qd, {}), /* @__PURE__ */ (0, z.jsxs)(mr, {
			"data-slot": "dialog-content",
			className: J("fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100vh-1rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg", e),
			...r,
			children: [t, n && /* @__PURE__ */ (0, z.jsxs)(_r, {
				"data-slot": "dialog-close",
				className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ (0, z.jsx)(qd, {}), /* @__PURE__ */ (0, z.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		})]
	});
}
function ef({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "dialog-header",
		className: J("flex flex-col gap-2 text-center sm:text-left", e),
		...t
	});
}
function tf({ className: e, showCloseButton: t = !1, children: n, ...r }) {
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		"data-slot": "dialog-footer",
		className: J("shrink-0 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", e),
		...r,
		children: [n, t && /* @__PURE__ */ (0, z.jsx)(_r, {
			asChild: !0,
			children: /* @__PURE__ */ (0, z.jsx)(Y, {
				variant: "outline",
				children: "Close"
			})
		})]
	});
}
function nf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(hr, {
		"data-slot": "dialog-title",
		className: J("text-lg leading-none font-semibold", e),
		...t
	});
}
function rf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(gr, {
		"data-slot": "dialog-description",
		className: J("text-sm text-muted-foreground", e),
		...t
	});
}
//#endregion
//#region src/auth/userStorage.ts
var af = "auth.user";
function of() {
	try {
		let e = localStorage.getItem(af);
		return e ? JSON.parse(e) : null;
	} catch {
		return localStorage.removeItem(af), null;
	}
}
function sf() {
	localStorage.removeItem(af);
}
function cf(e) {
	localStorage.setItem(af, JSON.stringify(e));
}
//#endregion
//#region src/api_calls/fetchWithRefresh.ts
var lf = null, uf = null, df = 429, ff = 1, pf = "auth:session-expired";
function mf(e) {
	if (typeof e == "string") return e;
	if (e && typeof e == "object") {
		let t = e, n = t.message ?? t.detail ?? t.error;
		if (typeof n == "string") return n;
	}
	return "";
}
async function hf(e) {
	let t = e.clone(), n = t.headers.get("content-type") || "";
	try {
		return n.includes("application/json") ? mf(await t.json()) : (await t.text()).trim();
	} catch {
		return "";
	}
}
function gf(e) {
	if (!e) return null;
	let t = Number(e);
	if (Number.isFinite(t) && t >= 0) return t * 1e3;
	let n = Date.parse(e);
	return Number.isNaN(n) ? null : Math.max(n - Date.now(), 0);
}
function _f(e) {
	return new Promise((t) => {
		window.setTimeout(t, e);
	});
}
async function vf(e, t, n = ff) {
	let r = await fetch(e, {
		...t,
		cache: t?.cache ?? "no-store"
	});
	if (r.status !== df || n <= 0) return r;
	let i = gf(r.headers.get("retry-after"));
	return i === null ? r : (await _f(i), vf(e, t, n - 1));
}
async function yf(e) {
	if (e.status !== 401) return !1;
	let t = (await hf(e)).toLowerCase();
	return t.includes("token") && t.includes("expired");
}
function bf() {
	let e = of();
	if (!e) return null;
	let t = e.username ?? e.email ?? e.sub;
	return typeof t == "string" && t.trim() ? t.trim() : null;
}
async function xf() {
	return lf ||= (async () => {
		let e = bf();
		return e ? !!(await vf(j("refresh"), {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				username: e
			},
			credentials: "include"
		})).ok : !1;
	})().finally(() => {
		lf = null;
	}), lf;
}
async function Sf() {
	return uf ||= (async () => {
		try {
			await vf(j("logout"), {
				method: "GET",
				headers: { Accept: "application/json" },
				credentials: "include"
			});
		} catch {} finally {
			window.dispatchEvent(new Event(pf));
		}
	})().finally(() => {
		uf = null;
	}), uf;
}
async function Cf(e, t = {}) {
	let { skipRefresh: n = !1, ...r } = t, i = await vf(e, r);
	return n || !await yf(i) ? i : await xf() ? Cf(e, {
		...r,
		skipRefresh: !0
	}) : (await Sf(), i);
}
//#endregion
//#region src/components/StatusBanner.tsx
var wf = {
	error: {
		container: "border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/12",
		icon: Pd
	},
	success: {
		container: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/12 dark:text-emerald-300",
		icon: Fd
	},
	info: {
		container: "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/12 dark:text-sky-300",
		icon: zd
	}
};
function Tf({ children: e, className: t, variant: n = "info" }) {
	let { container: r, icon: i } = wf[n];
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		role: n === "error" ? "alert" : "status",
		className: J("flex items-start gap-3 rounded-xl border px-3 py-2 text-sm", r, t),
		children: [/* @__PURE__ */ (0, z.jsx)(i, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, z.jsx)("div", { children: e })]
	});
}
//#endregion
//#region src/components/ForgotPassword.tsx
function Ef({ open: t, handleClose: n }) {
	let [r, i] = e.useState(!1), [a, o] = e.useState(""), s = () => {
		o(""), n();
	}, c = (e) => {
		e || s();
	}, l = async (e) => {
		o("");
		let t = new FormData(e).get("username");
		if (!t || typeof t != "string") {
			o("Username is required.");
			return;
		}
		i(!0);
		try {
			let e = new URLSearchParams();
			e.append("username", t);
			let n = await Cf(j("resetPassword"), {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json"
				},
				credentials: "include",
				body: e.toString()
			});
			if (!n.ok) throw Error(`Reset password failed: ${n.status} ${n.statusText}`);
			s();
		} catch (e) {
			o(e instanceof Error ? e.message : "Failed to request password reset. Please try again.");
		} finally {
			i(!1);
		}
	};
	return /* @__PURE__ */ (0, z.jsx)(Jd, {
		open: t,
		onOpenChange: c,
		children: /* @__PURE__ */ (0, z.jsx)($d, {
			className: "flex max-h-[92vh] w-[min(97vw,38rem)] max-w-none flex-col overflow-hidden border-border/70 bg-card/95 p-0",
			children: /* @__PURE__ */ (0, z.jsxs)("form", {
				className: "flex min-h-0 flex-1 flex-col",
				onSubmit: (e) => {
					e.preventDefault(), e.stopPropagation(), l(e.currentTarget);
				},
				children: [
					/* @__PURE__ */ (0, z.jsxs)(ef, {
						className: "border-b border-border/70 px-6 py-4 text-left",
						children: [/* @__PURE__ */ (0, z.jsx)(nf, { children: "Reset password" }), /* @__PURE__ */ (0, z.jsx)(rf, { children: "Enter your account's username, and we'll send you a link to reset your password." })]
					}),
					/* @__PURE__ */ (0, z.jsx)("div", {
						className: "min-h-0 flex-1 overflow-y-auto px-6 py-5",
						children: /* @__PURE__ */ (0, z.jsxs)("div", {
							className: "space-y-4",
							children: [a && /* @__PURE__ */ (0, z.jsx)(Tf, {
								variant: "error",
								children: a
							}), /* @__PURE__ */ (0, z.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, z.jsx)(vd, {
									htmlFor: "forgot-password-username",
									children: /* @__PURE__ */ (0, z.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "Username" }), /* @__PURE__ */ (0, z.jsx)("span", {
											className: "text-destructive",
											"aria-hidden": "true",
											children: "*"
										})]
									})
								}), /* @__PURE__ */ (0, z.jsx)(_d, {
									autoFocus: !0,
									required: !0,
									id: "forgot-password-username",
									name: "username",
									placeholder: "username",
									type: "text",
									disabled: r
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, z.jsxs)(tf, {
						className: "gap-2 border-t border-border/70 px-6 py-4 sm:justify-between",
						children: [/* @__PURE__ */ (0, z.jsx)(Y, {
							type: "button",
							variant: "outline",
							onClick: s,
							disabled: r,
							children: "Cancel"
						}), /* @__PURE__ */ (0, z.jsx)(Y, {
							type: "submit",
							disabled: r,
							children: r ? "Sending..." : "Continue"
						})]
					})
				]
			})
		})
	});
}
//#endregion
//#region src/theme/AppTheme.tsx
var Df = "app-color-mode", Of = e.createContext({
	mode: "system",
	resolvedMode: "light",
	systemMode: "light",
	setMode: () => void 0
});
function kf() {
	if (typeof window > "u") return "system";
	let e = window.localStorage.getItem(Df);
	return e === "light" || e === "dark" || e === "system" ? e : "system";
}
function Af() {
	return typeof window > "u" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function jf(e) {
	if (typeof document > "u") return;
	let t = document.documentElement;
	t.classList.toggle("dark", e === "dark"), t.dataset.theme = e, t.style.colorScheme = e;
}
function Mf() {
	return e.useContext(Of);
}
function Nf({ children: t, disableCustomTheme: n }) {
	let [r, i] = e.useState(() => kf()), [a, o] = e.useState(() => Af()), s = r === "system" ? a : r;
	e.useEffect(() => {
		if (typeof window > "u") return;
		let e = window.matchMedia("(prefers-color-scheme: dark)"), t = (e) => {
			o(e.matches ? "dark" : "light");
		};
		return o(e.matches ? "dark" : "light"), e.addEventListener("change", t), () => {
			e.removeEventListener("change", t);
		};
	}, []), e.useEffect(() => {
		typeof window > "u" || window.localStorage.setItem(Df, r);
	}, [r]), e.useEffect(() => {
		n || jf(s);
	}, [n, s]);
	let c = e.useMemo(() => ({
		mode: r,
		resolvedMode: s,
		systemMode: a,
		setMode: i
	}), [
		r,
		s,
		a
	]);
	return /* @__PURE__ */ (0, z.jsx)(Of.Provider, {
		value: c,
		children: t
	});
}
//#endregion
//#region src/components/ui/dropdown-menu.tsx
function Pf({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(Vc, {
		"data-slot": "dropdown-menu",
		...e
	});
}
function Ff({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(Uc, {
		"data-slot": "dropdown-menu-portal",
		...e
	});
}
function If({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(Hc, {
		"data-slot": "dropdown-menu-trigger",
		...e
	});
}
function Lf({ className: e, sideOffset: t = 4, ...n }) {
	return /* @__PURE__ */ (0, z.jsx)(Uc, { children: /* @__PURE__ */ (0, z.jsx)(Wc, {
		"data-slot": "dropdown-menu-content",
		sideOffset: t,
		className: J("z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", e),
		...n
	}) });
}
function Rf({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(Gc, {
		"data-slot": "dropdown-menu-group",
		...e
	});
}
function zf({ className: e, inset: t, variant: n = "default", ...r }) {
	return /* @__PURE__ */ (0, z.jsx)(qc, {
		"data-slot": "dropdown-menu-item",
		"data-inset": t,
		"data-variant": n,
		className: J("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!", e),
		...r
	});
}
function Bf({ className: e, children: t, checked: n, ...r }) {
	return /* @__PURE__ */ (0, z.jsxs)(Jc, {
		"data-slot": "dropdown-menu-checkbox-item",
		className: J("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		checked: n,
		...r,
		children: [/* @__PURE__ */ (0, z.jsx)("span", {
			className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ (0, z.jsx)(Zc, { children: /* @__PURE__ */ (0, z.jsx)(kd, { className: "size-4" }) })
		}), t]
	});
}
function Vf({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(Yc, {
		"data-slot": "dropdown-menu-radio-group",
		...e
	});
}
function Hf({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ (0, z.jsxs)(Xc, {
		"data-slot": "dropdown-menu-radio-item",
		className: J("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		...n,
		children: [/* @__PURE__ */ (0, z.jsx)("span", {
			className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ (0, z.jsx)(Zc, { children: /* @__PURE__ */ (0, z.jsx)(Id, { className: "size-2 fill-current" }) })
		}), t]
	});
}
function Uf({ className: e, inset: t, ...n }) {
	return /* @__PURE__ */ (0, z.jsx)(Kc, {
		"data-slot": "dropdown-menu-label",
		"data-inset": t,
		className: J("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", e),
		...n
	});
}
function Wf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(Qc, {
		"data-slot": "dropdown-menu-separator",
		className: J("-mx-1 my-1 h-px bg-border", e),
		...t
	});
}
function Gf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("span", {
		"data-slot": "dropdown-menu-shortcut",
		className: J("ml-auto text-xs tracking-widest text-muted-foreground", e),
		...t
	});
}
function Kf({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)($c, {
		"data-slot": "dropdown-menu-sub",
		...e
	});
}
function qf({ className: e, inset: t, children: n, ...r }) {
	return /* @__PURE__ */ (0, z.jsxs)(el, {
		"data-slot": "dropdown-menu-sub-trigger",
		"data-inset": t,
		className: J("flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", e),
		...r,
		children: [n, /* @__PURE__ */ (0, z.jsx)(Md, { className: "ml-auto size-4" })]
	});
}
function Jf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(tl, {
		"data-slot": "dropdown-menu-sub-content",
		className: J("z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", e),
		...t
	});
}
//#endregion
//#region src/theme/ColorModeSelect.tsx
function Yf(e) {
	let { mode: t, setMode: n } = Mf(), { className: r, ...i } = e, a = {
		system: "System",
		light: "Light",
		dark: "Dark"
	}, o = {
		system: /* @__PURE__ */ (0, z.jsx)(Vd, { className: "size-4" }),
		light: /* @__PURE__ */ (0, z.jsx)(Kd, { className: "size-4" }),
		dark: /* @__PURE__ */ (0, z.jsx)(Hd, { className: "size-4" })
	};
	return /* @__PURE__ */ (0, z.jsxs)(Pf, { children: [/* @__PURE__ */ (0, z.jsx)(If, {
		asChild: !0,
		children: /* @__PURE__ */ (0, z.jsxs)(Y, {
			"data-screenshot": "toggle-mode",
			variant: "outline",
			size: "sm",
			className: J("rounded-full border-border/70 bg-background/85 px-3 shadow-sm backdrop-blur", r),
			...i,
			children: [o[t], /* @__PURE__ */ (0, z.jsx)("span", {
				className: "hidden sm:inline",
				children: a[t]
			})]
		})
	}), /* @__PURE__ */ (0, z.jsx)(Lf, {
		align: "end",
		className: "w-36",
		children: /* @__PURE__ */ (0, z.jsxs)(Vf, {
			value: t,
			onValueChange: (e) => n(e),
			children: [
				/* @__PURE__ */ (0, z.jsxs)(Hf, {
					value: "system",
					children: [/* @__PURE__ */ (0, z.jsx)(Vd, { className: "mr-2 size-4" }), "System"]
				}),
				/* @__PURE__ */ (0, z.jsxs)(Hf, {
					value: "light",
					children: [/* @__PURE__ */ (0, z.jsx)(Kd, { className: "mr-2 size-4" }), "Light"]
				}),
				/* @__PURE__ */ (0, z.jsxs)(Hf, {
					value: "dark",
					children: [/* @__PURE__ */ (0, z.jsx)(Hd, { className: "mr-2 size-4" }), "Dark"]
				})
			]
		})
	})] });
}
//#endregion
//#region src/assets/sitemark.png
var Xf = "data:image/png;base64,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NqTSftvpM/mNx7tG2g8c6t20ffeJjW++f6TtxVe3r33jzd1L/uQvfjbr//nbJxv+4A+2XNUHgb17gVGaDfUMZuoPH+qfv29/d/uu/d1YfuemHTtPbdq6s2vTe9uOt73x/v51z765c/VTr7y14sff//GyHfuPrd59sLNtz+HO9t2HOjce7zjdNnAmvXY0U14yNlpquhgzao47vrcjsmv/sTm7d55o276rc+PWnT3tH+zua38P3fd2dW/asrNz03u7j69+d3dHK5ZTmxPRveR99OiYnXbK8UNHT8/csb9rLZbbvnVv56YPtqP8u062v7vjePs7249ueOv9o2tefmvfqqeff2flBzuOrtm5v79t38Ezm46fHGnvPp1rHxgpbxzNVtvODOfbTvWn2o+cHGjfub+r/b0dx9vefOfo2qee2rbsp7/cO+epV95pff75D+JPPvkku6RgF4lEHiie6IW34KnrXz7xztSfvfLmwq07jqzaerCjbfuhrk27j/ZuOtgx0N7Vn9rYnypuPJMpt43kym2nh4sbD3cNtu88cKr93X0nN7255+jGN7cdWfvzl/atfA3dt3Yfaftgz7H2rfs62nfs62zfsf/kpl37TrQfONzRdvh49/qOnr45I/l8XVdXJvzOO6BWhItICEBwQcElRhC04mqdgIMKpymc6wgQYgChJlBqxEolPvWdHccXvrPzxKqtu7vbdhw5s3H/iZH2rsHSxsFMsDFV4G3ZktM2mi+29QwMt+07dmrj3kOdGz44eHL9O3uPrn5+27Fl/8d//tuZP3np/fqenp4QcnNNnAJeW7b0hF461Ff/vVe2TX36/bfmv7XzyIp9x3vWHjjZ23bwZO/GPcd6Nx4/PbqxbzS/cTDvtGUcvj7t8vWn06W2A5397YdO9bcf7Opv34Pptx88tu69nceWvXFw97z/9rPnp/z3J7fEUDaigFVd0b0F27Nl//66p978YMqLO9+a/96+Y8v3HO9as7fjVNu+Ez0bdh3tattz8vTG/V1n2juHsxsH8s760bK/PuWItpTD2wayzsbj/an2gz1n2nefwHF/rK9t6+HOdduPdS7f09sz96dvvtn6o9dei16RMOckyo+cjo1khqd0Dw0tON7dt+oIcnOkowf77dSmvSd7N+3t7mvf3Xl6/dajx1c9v/PQyue3HVr5JW7mcgAAEABJREFUzsEj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";
//#endregion
//#region src/components/CustomIcons.tsx
function Zf() {
	return /* @__PURE__ */ (0, z.jsx)("img", {
		src: Xf,
		width: "150",
		alt: "Sitemark"
	});
}
//#endregion
//#region src/utils/formatters.ts
var Qf = /* @__PURE__ */ E((/* @__PURE__ */ w(((e, t) => {
	(function(n, r) {
		typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self).dayjs = r();
	})(e, (function() {
		var e = 1e3, t = 6e4, n = 36e5, r = "millisecond", i = "second", a = "minute", o = "hour", s = "day", c = "week", l = "month", u = "quarter", d = "year", f = "date", p = "Invalid Date", m = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, h = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, g = {
			name: "en",
			weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
			months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
			ordinal: function(e) {
				var t = [
					"th",
					"st",
					"nd",
					"rd"
				], n = e % 100;
				return "[" + e + (t[(n - 20) % 10] || t[n] || t[0]) + "]";
			}
		}, _ = function(e, t, n) {
			var r = String(e);
			return !r || r.length >= t ? e : "" + Array(t + 1 - r.length).join(n) + e;
		}, v = {
			s: _,
			z: function(e) {
				var t = -e.utcOffset(), n = Math.abs(t), r = Math.floor(n / 60), i = n % 60;
				return (t <= 0 ? "+" : "-") + _(r, 2, "0") + ":" + _(i, 2, "0");
			},
			m: function e(t, n) {
				if (t.date() < n.date()) return -e(n, t);
				var r = 12 * (n.year() - t.year()) + (n.month() - t.month()), i = t.clone().add(r, l), a = n - i < 0, o = t.clone().add(r + (a ? -1 : 1), l);
				return +(-(r + (n - i) / (a ? i - o : o - i)) || 0);
			},
			a: function(e) {
				return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
			},
			p: function(e) {
				return {
					M: l,
					y: d,
					w: c,
					d: s,
					D: f,
					h: o,
					m: a,
					s: i,
					ms: r,
					Q: u
				}[e] || String(e || "").toLowerCase().replace(/s$/, "");
			},
			u: function(e) {
				return e === void 0;
			}
		}, y = "en", b = {};
		b[y] = g;
		var x = "$isDayjsObject", S = function(e) {
			return e instanceof E || !(!e || !e[x]);
		}, C = function e(t, n, r) {
			var i;
			if (!t) return y;
			if (typeof t == "string") {
				var a = t.toLowerCase();
				b[a] && (i = a), n && (b[a] = n, i = a);
				var o = t.split("-");
				if (!i && o.length > 1) return e(o[0]);
			} else {
				var s = t.name;
				b[s] = t, i = s;
			}
			return !r && i && (y = i), i || !r && y;
		}, w = function(e, t) {
			if (S(e)) return e.clone();
			var n = typeof t == "object" ? t : {};
			return n.date = e, n.args = arguments, new E(n);
		}, T = v;
		T.l = C, T.i = S, T.w = function(e, t) {
			return w(e, {
				locale: t.$L,
				utc: t.$u,
				x: t.$x,
				$offset: t.$offset
			});
		};
		var E = function() {
			function g(e) {
				this.$L = C(e.locale, null, !0), this.parse(e), this.$x = this.$x || e.x || {}, this[x] = !0;
			}
			var _ = g.prototype;
			return _.parse = function(e) {
				this.$d = function(e) {
					var t = e.date, n = e.utc;
					if (t === null) return /* @__PURE__ */ new Date(NaN);
					if (T.u(t)) return /* @__PURE__ */ new Date();
					if (t instanceof Date) return new Date(t);
					if (typeof t == "string" && !/Z$/i.test(t)) {
						var r = t.match(m);
						if (r) {
							var i = r[2] - 1 || 0, a = (r[7] || "0").substring(0, 3);
							return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, a)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, a);
						}
					}
					return new Date(t);
				}(e), this.init();
			}, _.init = function() {
				var e = this.$d;
				this.$y = e.getFullYear(), this.$M = e.getMonth(), this.$D = e.getDate(), this.$W = e.getDay(), this.$H = e.getHours(), this.$m = e.getMinutes(), this.$s = e.getSeconds(), this.$ms = e.getMilliseconds();
			}, _.$utils = function() {
				return T;
			}, _.isValid = function() {
				return this.$d.toString() !== p;
			}, _.isSame = function(e, t) {
				var n = w(e);
				return this.startOf(t) <= n && n <= this.endOf(t);
			}, _.isAfter = function(e, t) {
				return w(e) < this.startOf(t);
			}, _.isBefore = function(e, t) {
				return this.endOf(t) < w(e);
			}, _.$g = function(e, t, n) {
				return T.u(e) ? this[t] : this.set(n, e);
			}, _.unix = function() {
				return Math.floor(this.valueOf() / 1e3);
			}, _.valueOf = function() {
				return this.$d.getTime();
			}, _.startOf = function(e, t) {
				var n = this, r = !!T.u(t) || t, u = T.p(e), p = function(e, t) {
					var i = T.w(n.$u ? Date.UTC(n.$y, t, e) : new Date(n.$y, t, e), n);
					return r ? i : i.endOf(s);
				}, m = function(e, t) {
					return T.w(n.toDate()[e].apply(n.toDate("s"), (r ? [
						0,
						0,
						0,
						0
					] : [
						23,
						59,
						59,
						999
					]).slice(t)), n);
				}, h = this.$W, g = this.$M, _ = this.$D, v = "set" + (this.$u ? "UTC" : "");
				switch (u) {
					case d: return r ? p(1, 0) : p(31, 11);
					case l: return r ? p(1, g) : p(0, g + 1);
					case c:
						var y = this.$locale().weekStart || 0, b = (h < y ? h + 7 : h) - y;
						return p(r ? _ - b : _ + (6 - b), g);
					case s:
					case f: return m(v + "Hours", 0);
					case o: return m(v + "Minutes", 1);
					case a: return m(v + "Seconds", 2);
					case i: return m(v + "Milliseconds", 3);
					default: return this.clone();
				}
			}, _.endOf = function(e) {
				return this.startOf(e, !1);
			}, _.$set = function(e, t) {
				var n, c = T.p(e), u = "set" + (this.$u ? "UTC" : ""), p = (n = {}, n[s] = u + "Date", n[f] = u + "Date", n[l] = u + "Month", n[d] = u + "FullYear", n[o] = u + "Hours", n[a] = u + "Minutes", n[i] = u + "Seconds", n[r] = u + "Milliseconds", n)[c], m = c === s ? this.$D + (t - this.$W) : t;
				if (c === l || c === d) {
					var h = this.clone().set(f, 1);
					h.$d[p](m), h.init(), this.$d = h.set(f, Math.min(this.$D, h.daysInMonth())).$d;
				} else p && this.$d[p](m);
				return this.init(), this;
			}, _.set = function(e, t) {
				return this.clone().$set(e, t);
			}, _.get = function(e) {
				return this[T.p(e)]();
			}, _.add = function(r, u) {
				var f, p = this;
				r = Number(r);
				var m = T.p(u), h = function(e) {
					var t = w(p);
					return T.w(t.date(t.date() + Math.round(e * r)), p);
				};
				if (m === l) return this.set(l, this.$M + r);
				if (m === d) return this.set(d, this.$y + r);
				if (m === s) return h(1);
				if (m === c) return h(7);
				var g = (f = {}, f[a] = t, f[o] = n, f[i] = e, f)[m] || 1, _ = this.$d.getTime() + r * g;
				return T.w(_, this);
			}, _.subtract = function(e, t) {
				return this.add(-1 * e, t);
			}, _.format = function(e) {
				var t = this, n = this.$locale();
				if (!this.isValid()) return n.invalidDate || p;
				var r = e || "YYYY-MM-DDTHH:mm:ssZ", i = T.z(this), a = this.$H, o = this.$m, s = this.$M, c = n.weekdays, l = n.months, u = n.meridiem, d = function(e, n, i, a) {
					return e && (e[n] || e(t, r)) || i[n].slice(0, a);
				}, f = function(e) {
					return T.s(a % 12 || 12, e, "0");
				}, m = u || function(e, t, n) {
					var r = e < 12 ? "AM" : "PM";
					return n ? r.toLowerCase() : r;
				};
				return r.replace(h, (function(e, r) {
					return r || function(e) {
						switch (e) {
							case "YY": return String(t.$y).slice(-2);
							case "YYYY": return T.s(t.$y, 4, "0");
							case "M": return s + 1;
							case "MM": return T.s(s + 1, 2, "0");
							case "MMM": return d(n.monthsShort, s, l, 3);
							case "MMMM": return d(l, s);
							case "D": return t.$D;
							case "DD": return T.s(t.$D, 2, "0");
							case "d": return String(t.$W);
							case "dd": return d(n.weekdaysMin, t.$W, c, 2);
							case "ddd": return d(n.weekdaysShort, t.$W, c, 3);
							case "dddd": return c[t.$W];
							case "H": return String(a);
							case "HH": return T.s(a, 2, "0");
							case "h": return f(1);
							case "hh": return f(2);
							case "a": return m(a, o, !0);
							case "A": return m(a, o, !1);
							case "m": return String(o);
							case "mm": return T.s(o, 2, "0");
							case "s": return String(t.$s);
							case "ss": return T.s(t.$s, 2, "0");
							case "SSS": return T.s(t.$ms, 3, "0");
							case "Z": return i;
						}
						return null;
					}(e) || i.replace(":", "");
				}));
			}, _.utcOffset = function() {
				return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
			}, _.diff = function(r, f, p) {
				var m, h = this, g = T.p(f), _ = w(r), v = (_.utcOffset() - this.utcOffset()) * t, y = this - _, b = function() {
					return T.m(h, _);
				};
				switch (g) {
					case d:
						m = b() / 12;
						break;
					case l:
						m = b();
						break;
					case u:
						m = b() / 3;
						break;
					case c:
						m = (y - v) / 6048e5;
						break;
					case s:
						m = (y - v) / 864e5;
						break;
					case o:
						m = y / n;
						break;
					case a:
						m = y / t;
						break;
					case i:
						m = y / e;
						break;
					default: m = y;
				}
				return p ? m : T.a(m);
			}, _.daysInMonth = function() {
				return this.endOf(l).$D;
			}, _.$locale = function() {
				return b[this.$L];
			}, _.locale = function(e, t) {
				if (!e) return this.$L;
				var n = this.clone(), r = C(e, t, !0);
				return r && (n.$L = r), n;
			}, _.clone = function() {
				return T.w(this.$d, this);
			}, _.toDate = function() {
				return new Date(this.valueOf());
			}, _.toJSON = function() {
				return this.isValid() ? this.toISOString() : null;
			}, _.toISOString = function() {
				return this.$d.toISOString();
			}, _.toString = function() {
				return this.$d.toUTCString();
			}, g;
		}(), D = E.prototype;
		return w.prototype = D, [
			["$ms", r],
			["$s", i],
			["$m", a],
			["$H", o],
			["$W", s],
			["$M", l],
			["$y", d],
			["$D", f]
		].forEach((function(e) {
			D[e[1]] = function(t) {
				return this.$g(t, e[0], e[1]);
			};
		})), w.extend = function(e, t) {
			return e.$i ||= (e(t, E, w), !0), w;
		}, w.locale = C, w.isDayjs = S, w.unix = function(e) {
			return w(1e3 * e);
		}, w.en = b[y], w.Ls = b, w.p = {}, w;
	}));
})))(), 1), $f = "YYYY-MM-DDTHH:mm:ss.SSSZ", ep = "YYYY-MM-DDTHH:mm", tp = "HH:mm";
function np(e) {
	let t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), i = String(e.getHours()).padStart(2, "0"), a = String(e.getMinutes()).padStart(2, "0"), o = String(e.getSeconds()).padStart(2, "0"), s = String(e.getMilliseconds()).padStart(3, "0"), c = -e.getTimezoneOffset(), l = c >= 0 ? "+" : "-", u = Math.abs(c);
	return `${t}-${n}-${r}T${i}:${a}:${o}.${s}${l}${String(Math.floor(u / 60)).padStart(2, "0")}:${String(u % 60).padStart(2, "0")}`;
}
function rp(e) {
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? void 0 : t;
}
function ip(e) {
	let t = e.trim(), n = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])$/);
	if (n) {
		let [, e, t, r, i] = n, a = Number(e), o = Number(t), s = r ? Number(r) : 0;
		if (a < 1 || a > 12 || o < 0 || o > 59 || s < 0 || s > 59) return;
		let c = i.toLowerCase() === "pm" ? a % 12 + 12 : a % 12;
		return `${String(c).padStart(2, "0")}:${t}`;
	}
	let r = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
	if (!r) return;
	let [, i, a] = r, o = Number(i), s = Number(a);
	if (!(o < 0 || o > 23 || s < 0 || s > 59)) return `${String(o).padStart(2, "0")}:${a}`;
}
function ap(e) {
	return e ? new Date(e).toLocaleDateString() : "-";
}
function op(e) {
	if (!e) return "-";
	let t = Intl.DateTimeFormat().resolvedOptions().timeZone;
	return new Date(e).toLocaleString(void 0, { timeZone: t });
}
function sp(e) {
	let t = e?.trim();
	if (!t) return;
	let n = (0, Qf.default)(t);
	if (n.isValid()) return n.format($f);
	let r = rp(t);
	return r ? np(r) : void 0;
}
function cp(e, t) {
	let n = e?.trim();
	if (!n) return;
	let r = t === "start" ? (0, Qf.default)(n).startOf("day") : (0, Qf.default)(n).endOf("day");
	return r.isValid() ? r.format($f) : void 0;
}
function lp(e) {
	let t = e?.trim();
	if (!t) return "";
	let n = (0, Qf.default)(t);
	return n.isValid() ? n.format(ep) : "";
}
function up(e) {
	let t = e?.trim();
	if (!t) return;
	let n = (0, Qf.default)(t, tp);
	return n.isValid() ? n.format(tp) : ip(t);
}
function dp(e, t = 2, n = 8) {
	let r = e ?? "", i = r.split("\n").length, a = Math.ceil(r.length / 70);
	return Math.min(n, Math.max(t, i, a));
}
//#endregion
//#region src/api_calls/UserData.tsx
function fp(e) {
	if (!e || typeof e != "object") return null;
	let t = e, n = t.name, r = t.username, i = t.sub, a = t.account_type;
	return typeof n != "string" || typeof r != "string" || typeof i != "string" || typeof a != "string" ? null : {
		...t,
		name: n,
		username: r,
		sub: i,
		account_type: a
	};
}
function pp(e) {
	if (!e || typeof e != "object") return e;
	let t = e;
	if (t.user) return t.user;
	if (t.data && typeof t.data == "object") {
		let e = t.data;
		if (e.user) return e.user;
	}
	return e;
}
async function mp(e) {
	let t = new URLSearchParams();
	t.append("grant_type", "password"), t.append("username", e.username), t.append("password", e.password);
	let n = await vf(j("login"), {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json"
		},
		credentials: "include",
		body: t.toString()
	});
	if (!n.ok) throw Error(`Login failed: ${n.status} ${n.statusText}`);
	return _p();
}
async function hp(e) {
	let t = new URLSearchParams();
	t.append("credential", e);
	let n = await Cf(`${j("authenticateGoogle")}?${t.toString()}`, {
		method: "GET",
		headers: { Accept: "application/json" },
		credentials: "include"
	});
	if (!n.ok) throw Error(`Google login failed: ${n.status} ${n.statusText}`);
	return _p();
}
async function gp() {
	let e = await Cf(j("logout"), {
		method: "GET",
		headers: { Accept: "application/json" },
		credentials: "include"
	});
	if (!e.ok) throw Error(`Logout failed: ${e.status} ${e.statusText}`);
	sf();
}
async function _p() {
	let e = await Cf(j("currentUser"), {
		method: "GET",
		headers: { Accept: "application/json" },
		credentials: "include"
	});
	if (!e.ok) throw Error(`Failed to fetch current user: ${e.status} ${e.statusText}`);
	let t = fp(pp(await e.json()));
	if (!t) throw Error("Current user response did not contain a valid user");
	return cf(t), t;
}
async function vp(e) {
	let t = new URLSearchParams();
	t.append("token", e.token), t.append("username", e.username), t.append("password", e.password);
	let n = await Cf(j("resetPasswordAuthorised"), {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json"
		},
		credentials: "include",
		body: t.toString()
	});
	if (!n.ok) throw Error(`Password reset failed: ${n.status} ${n.statusText}`);
}
//#endregion
//#region src/context/AuthContext.tsx
var yp = r(void 0);
function bp() {
	localStorage.clear(), sf();
}
function xp({ children: e }) {
	let [t, n] = p(null), [r, i] = p(!0);
	return c(() => {
		let e = !0;
		return (async () => {
			let t = of();
			t && n(t);
			try {
				let t = await _p();
				if (!e) return;
				n(t);
			} catch {
				if (!e) return;
				n(null), sf();
			} finally {
				e && i(!1);
			}
		})(), () => {
			e = !1;
		};
	}, []), c(() => {
		let e = () => {
			bp(), n(null);
		};
		return window.addEventListener(pf, e), () => {
			window.removeEventListener(pf, e);
		};
	}, []), /* @__PURE__ */ (0, z.jsx)(yp.Provider, {
		value: {
			user: t,
			isLoading: r,
			isAuthenticated: !!t,
			login: async (e) => {
				try {
					n(await mp(e));
				} catch (e) {
					throw console.error("Login failed:", e), e;
				}
			},
			setAuthenticatedUser: (e) => {
				cf(e), n(e);
			},
			logout: async () => {
				try {
					await gp();
				} catch (e) {
					console.error("Logout API failed:", e);
				} finally {
					bp(), n(null);
				}
			}
		},
		children: e
	});
}
function Sp() {
	let e = s(yp);
	if (e === void 0) throw Error("useAuth must be used within an AuthProvider");
	return e;
}
//#endregion
//#region src/views/SignIn.tsx
function Cp(t) {
	let { login: n, setAuthenticatedUser: r } = Sp(), [i, a] = e.useState(""), [o, s] = e.useState(""), [c, l] = e.useState(""), [u, d] = e.useState(""), [f, p] = e.useState(""), [m, h] = e.useState(""), [g, _] = e.useState(!1), [v, y] = e.useState(!1);
	e.useEffect(() => {
		t.authNotice && h(t.authNotice);
	}, [t.authNotice]), e.useEffect(() => {
		let e = t.googleClientId || "";
		if (!e) return;
		let n = document.createElement("script");
		n.src = "https://accounts.google.com/gsi/client", n.async = !0, n.defer = !0, document.head.appendChild(n), n.onload = () => {
			window.google?.accounts?.id && (window.google.accounts.id.initialize({
				client_id: e,
				callback: S,
				use_fedcm_for_prompt: !0,
				auto_select: !1,
				context: "signin"
			}), window.google.accounts.id.renderButton(document.getElementById("google-btn"), {
				theme: "outline",
				size: "large",
				text: "continue_with"
			}), window.google.accounts.id.prompt((e) => {
				(e.isNotDisplayed() || e.isSkippedMoment()) && console.log("Google prompt status:", e.getNotDisplayedReason());
			}));
		};
	}, [t.googleClientId]);
	let b = (e) => {
		e.preventDefault(), e.stopPropagation(), y(!0);
	}, x = () => {
		y(!1);
	}, S = async (e) => {
		_(!0), p(""), h("");
		try {
			r(await hp(e.credential));
		} catch (e) {
			p(e instanceof Error ? e.message : "Google sign-in failed. Please try again.");
		} finally {
			_(!1);
		}
	}, C = async (e) => {
		if (e.preventDefault(), w()) {
			_(!0), p("");
			try {
				await n({
					username: i.trim(),
					password: o
				});
			} catch (e) {
				let t = e instanceof Error ? e.message : "";
				if (t.includes("401") || t.includes("400")) {
					p("Invalid username or password.");
					return;
				}
				p(e instanceof Error ? e.message : "Login failed. Please try again.");
			} finally {
				_(!1);
			}
		}
	}, w = () => {
		let e = !0;
		return i.trim() ? l("") : (l("Please enter your username."), e = !1), o ? d("") : (d("Password is required."), e = !1), e;
	};
	return /* @__PURE__ */ (0, z.jsx)(Nf, {
		...t,
		children: /* @__PURE__ */ (0, z.jsxs)("div", {
			className: "relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8",
			children: [
				/* @__PURE__ */ (0, z.jsx)("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),transparent_32%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),transparent_28%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" }),
				/* @__PURE__ */ (0, z.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-[-10rem] -z-10 mx-auto h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10" }),
				/* @__PURE__ */ (0, z.jsx)(Yf, { className: "fixed right-4 top-4 z-20 sm:right-6 sm:top-6" }),
				/* @__PURE__ */ (0, z.jsx)("div", {
					className: "mx-auto flex w-full max-w-md flex-1 items-center",
					children: /* @__PURE__ */ (0, z.jsxs)(ud, {
						className: "w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur",
						children: [/* @__PURE__ */ (0, z.jsxs)(dd, {
							className: "gap-5 px-6 pt-6 sm:px-8 sm:pt-8",
							children: [/* @__PURE__ */ (0, z.jsx)("div", {
								className: "flex justify-center sm:justify-start",
								children: /* @__PURE__ */ (0, z.jsx)(Zf, {})
							}), /* @__PURE__ */ (0, z.jsx)("div", {
								className: "space-y-2",
								children: /* @__PURE__ */ (0, z.jsx)(fd, {
									className: "text-3xl tracking-tight",
									children: "Sign in"
								})
							})]
						}), /* @__PURE__ */ (0, z.jsx)(hd, {
							className: "space-y-5 px-6 pb-6 sm:px-8 sm:pb-8",
							children: /* @__PURE__ */ (0, z.jsxs)("form", {
								className: "space-y-4",
								onSubmit: C,
								noValidate: !0,
								children: [
									f && /* @__PURE__ */ (0, z.jsx)(Tf, {
										variant: "error",
										children: f
									}),
									m && /* @__PURE__ */ (0, z.jsx)(Tf, {
										variant: "success",
										children: m
									}),
									/* @__PURE__ */ (0, z.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, z.jsx)(vd, {
												htmlFor: "username",
												children: /* @__PURE__ */ (0, z.jsxs)("span", {
													className: "inline-flex items-center gap-1",
													children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "Username" }), /* @__PURE__ */ (0, z.jsx)("span", {
														className: "text-destructive",
														"aria-hidden": "true",
														children: "*"
													})]
												})
											}),
											/* @__PURE__ */ (0, z.jsx)(_d, {
												"aria-invalid": !!c,
												id: "username",
												type: "text",
												name: "username",
												placeholder: "username",
												autoComplete: "username",
												autoFocus: !0,
												required: !0,
												value: i,
												onChange: (e) => {
													a(e.target.value), c && l("");
												},
												disabled: g
											}),
											c && /* @__PURE__ */ (0, z.jsx)("p", {
												className: "text-sm text-destructive",
												children: c
											})
										]
									}),
									/* @__PURE__ */ (0, z.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, z.jsx)(vd, {
												htmlFor: "password",
												children: /* @__PURE__ */ (0, z.jsxs)("span", {
													className: "inline-flex items-center gap-1",
													children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "Password" }), /* @__PURE__ */ (0, z.jsx)("span", {
														className: "text-destructive",
														"aria-hidden": "true",
														children: "*"
													})]
												})
											}),
											/* @__PURE__ */ (0, z.jsx)(_d, {
												"aria-invalid": !!u,
												name: "password",
												placeholder: "••••••",
												type: "password",
												id: "password",
												autoComplete: "current-password",
												required: !0,
												value: o,
												onChange: (e) => {
													s(e.target.value), u && d("");
												},
												disabled: g
											}),
											u && /* @__PURE__ */ (0, z.jsx)("p", {
												className: "text-sm text-destructive",
												children: u
											})
										]
									}),
									/* @__PURE__ */ (0, z.jsx)(Y, {
										type: "submit",
										className: "w-full",
										disabled: g,
										children: g ? "Signing in..." : "Sign in"
									}),
									/* @__PURE__ */ (0, z.jsx)("button", {
										type: "button",
										onClick: b,
										className: "mx-auto block text-sm font-medium text-primary transition hover:text-primary/80",
										children: "Forgot your password?"
									}),
									t.googleClientId && /* @__PURE__ */ (0, z.jsxs)(z.Fragment, { children: [/* @__PURE__ */ (0, z.jsxs)("div", {
										className: "relative py-1",
										children: [/* @__PURE__ */ (0, z.jsx)(yd, {}), /* @__PURE__ */ (0, z.jsx)("span", {
											className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
											children: "or continue with"
										})]
									}), /* @__PURE__ */ (0, z.jsx)("div", {
										className: "rounded-2xl border border-dashed border-border/70 bg-muted/35 p-4",
										children: /* @__PURE__ */ (0, z.jsx)("div", {
											id: "google-btn",
											className: "flex min-h-10 justify-center"
										})
									})] })
								]
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, z.jsx)(Ef, {
					open: v,
					handleClose: x
				}),
				/* @__PURE__ */ (0, z.jsxs)("div", {
					className: "space-y-3 pt-6 text-center",
					children: [/* @__PURE__ */ (0, z.jsx)("a", {
						href: "https://docs.google.com/document/d/1vueS_dzdvDkBex5BLe_F03GEFLzjtoiFbNi0VJa2_gE/edit?tab=t.0",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex text-sm font-medium text-muted-foreground transition hover:text-foreground",
						children: "Hướng dẫn sử dụng / User Guide"
					}), /* @__PURE__ */ (0, z.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "© 2026 Springboard English"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/views/ResetPassword.tsx
function wp(t) {
	let [n, r] = e.useState(""), [i, a] = e.useState(""), [o, s] = e.useState(""), [c, l] = e.useState(""), [u, d] = e.useState(""), [f, p] = e.useState(!1);
	e.useEffect(() => {
		r(new URLSearchParams(window.location.search).get("token") || "");
	}, []);
	let m = async (e) => {
		if (e.preventDefault(), d(""), !n.trim()) {
			d("Reset token is required.");
			return;
		}
		if (!i.trim()) {
			d("Username is required.");
			return;
		}
		if (!o) {
			d("New password is required.");
			return;
		}
		if (!c) {
			d("Please confirm your new password.");
			return;
		}
		if (o !== c) {
			d("Passwords do not match.");
			return;
		}
		p(!0);
		try {
			await vp({
				token: n.trim(),
				username: i.trim(),
				password: o
			}), t.onNavigateToSignIn?.("Password reset successful. You can now sign in."), !t.onNavigateToSignIn && t.signInPath && window.location.assign(t.signInPath);
		} catch (e) {
			d(e instanceof Error ? e.message : "Failed to reset password. Please try again.");
		} finally {
			p(!1);
		}
	};
	return /* @__PURE__ */ (0, z.jsx)(Nf, {
		...t,
		children: /* @__PURE__ */ (0, z.jsxs)("div", {
			className: "relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8",
			children: [
				/* @__PURE__ */ (0, z.jsx)("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_24%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" }),
				/* @__PURE__ */ (0, z.jsx)("div", { className: "pointer-events-none absolute bottom-[-8rem] right-[-3rem] -z-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" }),
				/* @__PURE__ */ (0, z.jsx)(Yf, { className: "fixed right-4 top-4 z-20 sm:right-6 sm:top-6" }),
				/* @__PURE__ */ (0, z.jsx)("div", {
					className: "mx-auto flex w-full max-w-md flex-1 items-center",
					children: /* @__PURE__ */ (0, z.jsxs)(ud, {
						className: "w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur",
						children: [/* @__PURE__ */ (0, z.jsxs)(dd, {
							className: "gap-5 px-6 pt-6 sm:px-8 sm:pt-8",
							children: [/* @__PURE__ */ (0, z.jsx)("div", {
								className: "flex justify-center sm:justify-start",
								children: /* @__PURE__ */ (0, z.jsx)(Zf, {})
							}), /* @__PURE__ */ (0, z.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, z.jsx)(fd, {
									className: "text-3xl tracking-tight",
									children: "Reset password"
								}), /* @__PURE__ */ (0, z.jsx)(pd, {
									className: "text-sm leading-6",
									children: "Set a new password for your account using the reset link you received."
								})]
							})]
						}), /* @__PURE__ */ (0, z.jsx)(hd, {
							className: "px-6 pb-6 sm:px-8 sm:pb-8",
							children: /* @__PURE__ */ (0, z.jsxs)("form", {
								className: "space-y-4",
								onSubmit: m,
								noValidate: !0,
								children: [
									u && /* @__PURE__ */ (0, z.jsx)(Tf, {
										variant: "error",
										children: u
									}),
									/* @__PURE__ */ (0, z.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, z.jsx)(vd, {
											htmlFor: "username",
											children: /* @__PURE__ */ (0, z.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "Username" }), /* @__PURE__ */ (0, z.jsx)("span", {
													className: "text-destructive",
													"aria-hidden": "true",
													children: "*"
												})]
											})
										}), /* @__PURE__ */ (0, z.jsx)(_d, {
											id: "username",
											name: "username",
											type: "text",
											autoComplete: "username",
											required: !0,
											value: i,
											onChange: (e) => a(e.target.value),
											disabled: f
										})]
									}),
									/* @__PURE__ */ (0, z.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, z.jsx)(vd, {
											htmlFor: "new-password",
											children: /* @__PURE__ */ (0, z.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "New password" }), /* @__PURE__ */ (0, z.jsx)("span", {
													className: "text-destructive",
													"aria-hidden": "true",
													children: "*"
												})]
											})
										}), /* @__PURE__ */ (0, z.jsx)(_d, {
											id: "new-password",
											name: "new-password",
											type: "password",
											autoComplete: "new-password",
											required: !0,
											value: o,
											onChange: (e) => s(e.target.value),
											disabled: f
										})]
									}),
									/* @__PURE__ */ (0, z.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, z.jsx)(vd, {
											htmlFor: "confirm-password",
											children: /* @__PURE__ */ (0, z.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "Confirm new password" }), /* @__PURE__ */ (0, z.jsx)("span", {
													className: "text-destructive",
													"aria-hidden": "true",
													children: "*"
												})]
											})
										}), /* @__PURE__ */ (0, z.jsx)(_d, {
											id: "confirm-password",
											name: "confirm-password",
											type: "password",
											autoComplete: "new-password",
											required: !0,
											value: c,
											onChange: (e) => l(e.target.value),
											disabled: f
										})]
									}),
									/* @__PURE__ */ (0, z.jsx)(Y, {
										type: "submit",
										className: "w-full",
										disabled: f,
										children: f ? "Resetting password..." : "Reset password"
									}),
									/* @__PURE__ */ (0, z.jsx)(Y, {
										type: "button",
										className: "w-full",
										variant: "outline",
										onClick: () => {
											t.onNavigateToSignIn?.(), !t.onNavigateToSignIn && t.signInPath && window.location.assign(t.signInPath);
										},
										disabled: f,
										children: "Back to sign in"
									})
								]
							})
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/context/PendingChangesContext.tsx
function Tp(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n += 1) if (e[n]?.key !== t[n]?.key || e[n]?.value !== t[n]?.value) return !1;
	return !0;
}
function Ep(e, t) {
	return e ? e.count === t.count && e.saving === t.saving && e.disabled === t.disabled && e.keyLabel === t.keyLabel && e.valueLabel === t.valueLabel && e.onSave === t.onSave && e.onCancel === t.onCancel && Tp(e.items, t.items) : !1;
}
var Dp = r(void 0);
function Op({ children: e }) {
	let [t, n] = p(null), [r, i] = p({}), [a, s] = p({}), c = o((e, t) => {
		let n = e.trim();
		n && (s((e) => {
			let r = t.count;
			if (r <= 0) {
				if (!(n in e)) return e;
				let t = { ...e };
				return delete t[n], t;
			}
			return e[n] === r ? e : {
				...e,
				[n]: r
			};
		}), i((e) => {
			let r = e[n];
			return Ep(r, t) ? e : {
				...e,
				[n]: t
			};
		}));
	}, []), l = o((e) => {
		let t = e.trim();
		t && i((e) => {
			if (!(t in e)) return e;
			let n = { ...e };
			return delete n[t], n;
		});
	}, []), u = d(() => Object.entries(r).flatMap(([e, t]) => t.items.map((t) => ({
		section: e,
		key: t.key,
		value: t.value
	}))), [r]), f = d(() => Object.values(r).reduce((e, t) => e + t.count, 0), [r]), m = d(() => {
		let e = Object.entries(r).reduce((e, [t, n]) => (e[t] = n.count, e), {});
		return {
			...a,
			...e
		};
	}, [a, r]), h = d(() => Object.entries(r).find(([, e]) => e.count > 0)?.[0] ?? null, [r]), g = t && r[t] ? t : h, _ = g ? r[g] ?? null : null, v = o(() => {
		if (_?.onSave) return _.onSave();
	}, [_]), y = o(() => {
		_?.onCancel?.();
	}, [_]), b = d(() => ({
		globalPendingCount: f,
		globalPendingItems: u,
		sectionPendingCounts: m,
		activeSection: g,
		activeSectionPendingCount: _?.count ?? 0,
		activeSectionSaving: _?.saving ?? !1,
		activeSectionDisabled: _?.disabled ?? !1,
		activeSectionKeyLabel: _?.keyLabel ?? "Name",
		activeSectionValueLabel: _?.valueLabel ?? "Changed",
		setActiveSection: n,
		registerSection: c,
		unregisterSection: l,
		handleSaveActiveSection: v,
		handleCancelActiveSection: y
	}), [
		g,
		_,
		f,
		u,
		m,
		y,
		v,
		c,
		l
	]);
	return /* @__PURE__ */ (0, z.jsx)(Dp.Provider, {
		value: b,
		children: e
	});
}
function kp() {
	let e = s(Dp);
	if (!e) throw Error("usePendingChanges must be used within a PendingChangesProvider");
	return e;
}
//#endregion
//#region src/theme/ColorModeIconDropdown.tsx
function Ap(e) {
	let { mode: t, systemMode: n, setMode: r } = Mf(), { className: i, ...a } = e, o = (n || t) === "light" ? /* @__PURE__ */ (0, z.jsx)(Kd, { className: "size-4" }) : /* @__PURE__ */ (0, z.jsx)(Hd, { className: "size-4" });
	return /* @__PURE__ */ (0, z.jsxs)(Pf, { children: [/* @__PURE__ */ (0, z.jsx)(If, {
		asChild: !0,
		children: /* @__PURE__ */ (0, z.jsx)(Y, {
			"data-screenshot": "toggle-mode",
			variant: "ghost",
			size: "icon",
			className: J("rounded-full", i),
			"aria-label": "Toggle color mode",
			...a,
			children: o
		})
	}), /* @__PURE__ */ (0, z.jsxs)(Lf, {
		align: "end",
		className: "w-44",
		children: [
			/* @__PURE__ */ (0, z.jsx)(Uf, { children: "Appearance" }),
			/* @__PURE__ */ (0, z.jsx)(Wf, {}),
			/* @__PURE__ */ (0, z.jsxs)(Vf, {
				value: t,
				onValueChange: (e) => r(e),
				children: [
					/* @__PURE__ */ (0, z.jsxs)(Hf, {
						value: "system",
						children: [/* @__PURE__ */ (0, z.jsx)(Vd, { className: "mr-2 size-4" }), "System"]
					}),
					/* @__PURE__ */ (0, z.jsxs)(Hf, {
						value: "light",
						children: [/* @__PURE__ */ (0, z.jsx)(Kd, { className: "mr-2 size-4" }), "Light"]
					}),
					/* @__PURE__ */ (0, z.jsxs)(Hf, {
						value: "dark",
						children: [/* @__PURE__ */ (0, z.jsx)(Hd, { className: "mr-2 size-4" }), "Dark"]
					})
				]
			})
		]
	})] });
}
//#endregion
//#region src/components/LazyViewFallback.tsx
function jp() {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		className: "flex min-h-[240px] w-full items-center justify-center",
		children: /* @__PURE__ */ (0, z.jsx)(Bd, { className: "size-7 animate-spin text-muted-foreground" })
	});
}
//#endregion
//#region src/components/ui/searchable-select.tsx
function Mp({ id: e, value: t, options: n, placeholder: r = "Select option", searchPlaceholder: i = "Search...", emptyMessage: a = "No options found.", disabled: o = !1, className: s, contentClassName: c, onValueChange: l }) {
	let [u, f] = p(!1), [m, h] = p(""), g = String(t ?? ""), _ = d(() => n.find((e) => e.value === g), [g, n]), v = d(() => {
		let e = m.trim().toLowerCase();
		return e ? n.filter((t) => `${t.label} ${t.keywords ?? ""} ${t.value}`.toLowerCase().includes(e)) : n;
	}, [n, m]), y = (e) => {
		l(e), f(!1), h("");
	};
	return /* @__PURE__ */ (0, z.jsxs)(jl, {
		open: u,
		onOpenChange: f,
		children: [/* @__PURE__ */ (0, z.jsx)(Ml, {
			asChild: !0,
			children: /* @__PURE__ */ (0, z.jsxs)("button", {
				id: e,
				type: "button",
				disabled: o,
				className: J("flex h-10 w-full min-w-0 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "disabled:cursor-not-allowed disabled:opacity-50", s),
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, z.jsx)("span", {
					className: J("min-w-0 flex-1 truncate text-left", !_ && "text-muted-foreground"),
					children: _?.label ?? r
				}), /* @__PURE__ */ (0, z.jsx)(Ad, { className: "ml-2 size-4 shrink-0 text-muted-foreground" })]
			})
		}), /* @__PURE__ */ (0, z.jsx)(Nl, { children: /* @__PURE__ */ (0, z.jsxs)(Pl, {
			sideOffset: 4,
			align: "start",
			className: J("z-50 w-(--radix-popover-trigger-width) min-w-[12rem] max-h-[min(18rem,var(--radix-popover-content-available-height))] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", c),
			onOpenAutoFocus: (e) => e.preventDefault(),
			onPointerDownOutside: () => h(""),
			onEscapeKeyDown: () => h(""),
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, z.jsxs)("div", {
				className: "relative mb-2",
				children: [/* @__PURE__ */ (0, z.jsx)(Gd, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, z.jsx)("input", {
					value: m,
					onChange: (e) => h(e.target.value),
					placeholder: i,
					className: J("h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm shadow-xs outline-none transition", "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"),
					autoFocus: !0
				})]
			}), /* @__PURE__ */ (0, z.jsx)("div", {
				className: "max-h-56 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] touch-pan-y",
				style: { WebkitOverflowScrolling: "touch" },
				onWheelCapture: (e) => e.stopPropagation(),
				children: v.length === 0 ? /* @__PURE__ */ (0, z.jsx)("div", {
					className: "px-2 py-1.5 text-sm text-muted-foreground",
					children: a
				}) : v.map((e) => {
					let t = e.value === g;
					return /* @__PURE__ */ (0, z.jsxs)("button", {
						type: "button",
						onClick: () => y(e.value),
						disabled: e.disabled,
						className: J("flex w-full min-w-0 cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm outline-none transition", "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground", "disabled:pointer-events-none disabled:opacity-50"),
						children: [/* @__PURE__ */ (0, z.jsx)("span", {
							className: "min-w-0 flex-1 truncate",
							children: e.label
						}), t ? /* @__PURE__ */ (0, z.jsx)(kd, { className: "ml-2 size-4 shrink-0" }) : null]
					}, e.value);
				})
			})]
		}) })]
	});
}
//#endregion
//#region src/components/ui/textarea.tsx
function Np({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("textarea", {
		"data-slot": "textarea",
		className: J("flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30", e),
		...t
	});
}
//#endregion
//#region src/components/ui/table.tsx
function Pp({ className: e, containerClassName: t, ...n }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "table-container",
		className: J("relative w-full overflow-x-auto", t),
		children: /* @__PURE__ */ (0, z.jsx)("table", {
			"data-slot": "table",
			className: J("w-full caption-bottom text-sm", e),
			...n
		})
	});
}
function Fp({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("thead", {
		"data-slot": "table-header",
		className: J("[&_tr]:border-b", e),
		...t
	});
}
function Ip({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("tbody", {
		"data-slot": "table-body",
		className: J("[&_tr:last-child]:border-0", e),
		...t
	});
}
function Lp({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("tfoot", {
		"data-slot": "table-footer",
		className: J("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", e),
		...t
	});
}
function Rp({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("tr", {
		"data-slot": "table-row",
		className: J("border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted", e),
		...t
	});
}
function zp({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("th", {
		"data-slot": "table-head",
		className: J("h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground", e),
		...t
	});
}
function Bp({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("td", {
		"data-slot": "table-cell",
		className: J("p-4 align-middle", e),
		...t
	});
}
function Vp({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("caption", {
		"data-slot": "table-caption",
		className: J("mt-4 text-sm text-muted-foreground", e),
		...t
	});
}
//#endregion
//#region src/components/dialogs/FormTableDialog.tsx
function Hp({ label: e, required: t = !1, helperText: n, children: r, className: i, align: a = "center" }) {
	return /* @__PURE__ */ (0, z.jsxs)(Rp, {
		className: J("hover:bg-transparent", i),
		children: [/* @__PURE__ */ (0, z.jsx)(Bp, {
			className: J("w-[220px] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground", a === "center" ? "align-middle" : "align-top"),
			children: /* @__PURE__ */ (0, z.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, z.jsxs)("div", {
					className: "inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, z.jsx)("span", { children: e }), t && /* @__PURE__ */ (0, z.jsx)("span", {
						className: "text-destructive",
						"aria-hidden": "true",
						children: "*"
					})]
				}), n && /* @__PURE__ */ (0, z.jsx)("p", {
					className: "text-xs normal-case leading-5 text-muted-foreground",
					children: n
				})]
			})
		}), /* @__PURE__ */ (0, z.jsx)(Bp, {
			className: J("min-w-0 px-4 py-3 text-sm", a === "center" ? "align-middle" : "align-top"),
			children: r
		})]
	});
}
function Up({ open: e, saving: t = !1, title: n, description: r, error: i, submitLabel: a = "Create", submitDisabled: o = !1, onClose: s, onSubmit: c, children: l }) {
	return /* @__PURE__ */ (0, z.jsx)(Jd, {
		open: e,
		onOpenChange: (e) => !e && !t && s(),
		children: /* @__PURE__ */ (0, z.jsxs)($d, {
			showCloseButton: !t,
			className: "!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[80vw] max-h-[92vh] !max-w-none flex flex-col overflow-hidden border-0 bg-card p-0 shadow-none",
			children: [
				/* @__PURE__ */ (0, z.jsxs)(ef, {
					className: "border-b border-border/60 px-6 py-4 text-left",
					children: [/* @__PURE__ */ (0, z.jsx)(nf, { children: n }), r && /* @__PURE__ */ (0, z.jsx)(rf, { children: r })]
				}),
				/* @__PURE__ */ (0, z.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-6 py-5",
					children: /* @__PURE__ */ (0, z.jsxs)("div", {
						className: "flex min-h-full flex-col justify-center gap-4",
						children: [i && /* @__PURE__ */ (0, z.jsx)(Tf, {
							variant: "error",
							children: i
						}), /* @__PURE__ */ (0, z.jsx)("div", {
							className: "overflow-hidden rounded-2xl bg-transparent",
							children: /* @__PURE__ */ (0, z.jsx)(Pp, {
								className: "table-fixed",
								containerClassName: "overflow-x-hidden",
								children: /* @__PURE__ */ (0, z.jsx)(Ip, {
									className: "[&_tr]:border-b-0",
									children: l
								})
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, z.jsxs)(tf, {
					className: "border-t border-border/60 px-6 py-4",
					showCloseButton: !1,
					children: [/* @__PURE__ */ (0, z.jsx)(Y, {
						type: "button",
						variant: "outline",
						onClick: s,
						disabled: t,
						children: "Cancel"
					}), /* @__PURE__ */ (0, z.jsx)(Y, {
						type: "button",
						onClick: () => void c(),
						disabled: t || o,
						children: a
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/PatchRecordDialog.tsx
function Wp(e, t) {
	return e === "boolean" ? t === !0 : t == null ? "" : String(t);
}
function Gp(e) {
	return e.includes("\n") || e.length > 80;
}
function Kp(e, t) {
	let n = e.split("\n").length, r = Math.ceil(e.length / 90);
	return Math.min(12, Math.max(t ?? 3, n, r));
}
function qp(e) {
	return e === "number" ? "number" : e === "date" ? "date" : "text";
}
function Jp({ open: e, title: t, fields: n, initialValues: r, error: i, saving: a = !1, onClose: o, onSubmit: s }) {
	let [l, u] = p([]);
	c(() => {
		e && u(n.map((e) => {
			let t = Wp(e.type, r[e.key]);
			return {
				...e,
				value: t,
				initialValue: t
			};
		}));
	}, [
		n,
		r,
		e
	]);
	let d = (e, t) => {
		u((n) => n.map((n) => n.key === e ? {
			...n,
			value: t
		} : n));
	};
	return /* @__PURE__ */ (0, z.jsx)(Up, {
		open: e,
		saving: a,
		title: t,
		description: "Only modified fields will be included in the update request.",
		error: i,
		submitLabel: "Save",
		onClose: o,
		onSubmit: async () => {
			await s(l.reduce((e, t) => {
				if (t.value === t.initialValue || t.readOnly) return e;
				if (t.type === "boolean") return e[t.key] = !!t.value, e;
				let n = typeof t.value == "string" ? t.value.trim() : "";
				return n ? t.type === "number" ? (e[t.key] = Number(n), e) : (e[t.key] = n, e) : (e[t.key] = null, e);
			}, {}));
		},
		children: l.map((e) => {
			let t = typeof e.value == "string" ? e.value : "", n = e.type === "text" && (e.multiline || Gp(t));
			return /* @__PURE__ */ (0, z.jsx)(Hp, {
				label: e.label,
				helperText: e.helperText,
				align: n ? "start" : "center",
				children: e.type === "boolean" ? /* @__PURE__ */ (0, z.jsxs)("label", {
					className: "inline-flex items-center gap-3 text-sm",
					children: [/* @__PURE__ */ (0, z.jsx)("input", {
						type: "checkbox",
						checked: !!e.value,
						disabled: e.readOnly,
						onChange: (t) => d(e.key, t.target.checked),
						className: "size-4 rounded border-input accent-primary"
					}), /* @__PURE__ */ (0, z.jsx)("span", { children: e.value ? "Enabled" : "Disabled" })]
				}) : e.type === "select" ? /* @__PURE__ */ (0, z.jsx)(Mp, {
					value: t,
					onValueChange: (t) => d(e.key, t),
					disabled: e.readOnly,
					options: [{
						value: "",
						label: `-- ${e.label} --`
					}, ...(e.options ?? []).map((e) => ({
						value: e.value,
						label: e.label
					}))],
					placeholder: `-- ${e.label} --`,
					searchPlaceholder: `Search ${e.label.toLowerCase()}...`
				}) : n ? /* @__PURE__ */ (0, z.jsx)(Np, {
					value: t,
					onChange: (t) => d(e.key, t.target.value),
					readOnly: e.readOnly,
					disabled: e.readOnly,
					rows: Kp(t, e.minRows),
					placeholder: e.label,
					className: "resize-y"
				}) : /* @__PURE__ */ (0, z.jsx)(_d, {
					value: t,
					type: qp(e.type),
					onChange: (t) => d(e.key, t.target.value),
					readOnly: e.readOnly,
					disabled: e.readOnly,
					placeholder: e.label
				})
			}, e.key);
		})
	});
}
//#endregion
//#region node_modules/@react-spring/rafz/dist/react-spring_rafz.modern.mjs
var Yp = dm(), Z = (e) => om(e, Yp), Xp = dm();
Z.write = (e) => om(e, Xp);
var Zp = dm();
Z.onStart = (e) => om(e, Zp);
var Qp = dm();
Z.onFrame = (e) => om(e, Qp);
var $p = dm();
Z.onFinish = (e) => om(e, $p);
var em = [];
Z.setTimeout = (e, t) => {
	let n = Z.now() + t, r = () => {
		let e = em.findIndex((e) => e.cancel == r);
		~e && em.splice(e, 1), im -= +!!~e;
	}, i = {
		time: n,
		handler: e,
		cancel: r
	};
	return em.splice(tm(n), 0, i), im += 1, sm(), i;
};
var tm = (e) => ~(~em.findIndex((t) => t.time > e) || ~em.length);
Z.cancel = (e) => {
	Zp.delete(e), Qp.delete(e), $p.delete(e), Yp.delete(e), Xp.delete(e);
}, Z.sync = (e) => {
	am = !0, Z.batchedUpdates(e), am = !1;
}, Z.throttle = (e) => {
	let t;
	function n() {
		try {
			e(...t);
		} finally {
			t = null;
		}
	}
	function r(...e) {
		t = e, Z.onStart(n);
	}
	return r.handler = e, r.cancel = () => {
		Zp.delete(n), t = null;
	}, r;
};
var nm = typeof window < "u" ? window.requestAnimationFrame : (() => {});
Z.use = (e) => nm = e, Z.now = typeof performance < "u" ? () => performance.now() : Date.now, Z.batchedUpdates = (e) => e(), Z.catch = console.error, Z.frameLoop = "always", Z.advance = () => {
	Z.frameLoop === "demand" ? um() : console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand");
};
var rm = -1, im = 0, am = !1;
function om(e, t) {
	am ? (t.delete(e), e(0)) : (t.add(e), sm());
}
function sm() {
	rm < 0 && (rm = 0, Z.frameLoop !== "demand" && nm(lm));
}
function cm() {
	rm = -1;
}
function lm() {
	~rm && (nm(lm), Z.batchedUpdates(um));
}
function um() {
	let e = rm;
	rm = Z.now();
	let t = tm(rm);
	if (t && (fm(em.splice(0, t), (e) => e.handler()), im -= t), !im) {
		cm();
		return;
	}
	Zp.flush(), Yp.flush(e ? Math.min(64, rm - e) : 16.667), Qp.flush(), Xp.flush(), $p.flush();
}
function dm() {
	let e = /* @__PURE__ */ new Set(), t = e;
	return {
		add(n) {
			im += +(t == e && !e.has(n)), e.add(n);
		},
		delete(n) {
			return im -= t == e && e.has(n) ? 1 : 0, e.delete(n);
		},
		flush(n) {
			t.size && (e = /* @__PURE__ */ new Set(), im -= t.size, fm(t, (t) => t(n) && e.add(t)), im += e.size, t = e);
		}
	};
}
function fm(e, t) {
	e.forEach((e) => {
		try {
			t(e);
		} catch (e) {
			Z.catch(e);
		}
	});
}
//#endregion
//#region node_modules/@react-spring/shared/dist/react-spring_shared.modern.mjs
var pm = Object.defineProperty, mm = (e, t) => {
	for (var n in t) pm(e, n, {
		get: t[n],
		enumerable: !0
	});
}, hm = {};
mm(hm, {
	assign: () => km,
	colors: () => Em,
	createStringInterpolator: () => wm,
	skipAnimation: () => Dm,
	to: () => Tm,
	willAdvance: () => Om
});
function gm() {}
var _m = (e, t, n) => Object.defineProperty(e, t, {
	value: n,
	writable: !0,
	configurable: !0
}), Q = {
	arr: Array.isArray,
	obj: (e) => !!e && e.constructor.name === "Object",
	fun: (e) => typeof e == "function",
	str: (e) => typeof e == "string",
	num: (e) => typeof e == "number",
	und: (e) => e === void 0
};
function vm(e, t) {
	if (Q.arr(e)) {
		if (!Q.arr(t) || e.length !== t.length) return !1;
		for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
		return !0;
	}
	return e === t;
}
var $ = (e, t) => e.forEach(t);
function ym(e, t, n) {
	if (Q.arr(e)) {
		for (let r = 0; r < e.length; r++) t.call(n, e[r], `${r}`);
		return;
	}
	for (let r in e) e.hasOwnProperty(r) && t.call(n, e[r], r);
}
var bm = (e) => Q.und(e) ? [] : Q.arr(e) ? e : [e];
function xm(e, t) {
	if (e.size) {
		let n = Array.from(e);
		e.clear(), $(n, t);
	}
}
var Sm = (e, ...t) => xm(e, (e) => e(...t)), Cm = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent), wm, Tm, Em = null, Dm = !1, Om = gm, km = (e) => {
	e.to && (Tm = e.to), e.now && (Z.now = e.now), e.colors !== void 0 && (Em = e.colors), e.skipAnimation != null && (Dm = e.skipAnimation), e.createStringInterpolator && (wm = e.createStringInterpolator), e.requestAnimationFrame && Z.use(e.requestAnimationFrame), e.batchedUpdates && (Z.batchedUpdates = e.batchedUpdates), e.willAdvance && (Om = e.willAdvance), e.frameLoop && (Z.frameLoop = e.frameLoop);
}, Am = /* @__PURE__ */ new Set(), jm = [], Mm = [], Nm = 0, Pm = {
	get idle() {
		return !Am.size && !jm.length;
	},
	start(e) {
		Nm > e.priority ? (Am.add(e), Z.onStart(Fm)) : (Im(e), Z(Rm));
	},
	advance: Rm,
	sort(e) {
		if (Nm) Z.onFrame(() => Pm.sort(e));
		else {
			let t = jm.indexOf(e);
			~t && (jm.splice(t, 1), Lm(e));
		}
	},
	clear() {
		jm = [], Am.clear();
	}
};
function Fm() {
	Am.forEach(Im), Am.clear(), Z(Rm);
}
function Im(e) {
	jm.includes(e) || Lm(e);
}
function Lm(e) {
	jm.splice(zm(jm, (t) => t.priority > e.priority), 0, e);
}
function Rm(e) {
	let t = Mm;
	for (let n = 0; n < jm.length; n++) {
		let r = jm[n];
		Nm = r.priority, r.idle || (Om(r), r.advance(e), r.idle || t.push(r));
	}
	return Nm = 0, Mm = jm, Mm.length = 0, jm = t, jm.length > 0;
}
function zm(e, t) {
	let n = e.findIndex(t);
	return n < 0 ? e.length : n;
}
var Bm = (e, t, n) => Math.min(Math.max(n, e), t), Vm = {
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
}, Hm = "[-+]?\\d*\\.?\\d+", Um = Hm + "%";
function Wm(...e) {
	return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
var Gm = RegExp("rgb" + Wm(Hm, Hm, Hm)), Km = RegExp("rgba" + Wm(Hm, Hm, Hm, Hm)), qm = RegExp("hsl" + Wm(Hm, Um, Um)), Jm = RegExp("hsla" + Wm(Hm, Um, Um, Hm)), Ym = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, Xm = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, Zm = /^#([0-9a-fA-F]{6})$/, Qm = /^#([0-9a-fA-F]{8})$/;
function $m(e) {
	let t;
	return typeof e == "number" ? e >>> 0 === e && e >= 0 && e <= 4294967295 ? e : null : (t = Zm.exec(e)) ? parseInt(t[1] + "ff", 16) >>> 0 : Em && Em[e] !== void 0 ? Em[e] : (t = Gm.exec(e)) ? (nh(t[1]) << 24 | nh(t[2]) << 16 | nh(t[3]) << 8 | 255) >>> 0 : (t = Km.exec(e)) ? (nh(t[1]) << 24 | nh(t[2]) << 16 | nh(t[3]) << 8 | ih(t[4])) >>> 0 : (t = Ym.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + "ff", 16) >>> 0 : (t = Qm.exec(e)) ? parseInt(t[1], 16) >>> 0 : (t = Xm.exec(e)) ? parseInt(t[1] + t[1] + t[2] + t[2] + t[3] + t[3] + t[4] + t[4], 16) >>> 0 : (t = qm.exec(e)) ? (th(rh(t[1]), ah(t[2]), ah(t[3])) | 255) >>> 0 : (t = Jm.exec(e)) ? (th(rh(t[1]), ah(t[2]), ah(t[3])) | ih(t[4])) >>> 0 : null;
}
function eh(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function th(e, t, n) {
	let r = n < .5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r, a = eh(i, r, e + 1 / 3), o = eh(i, r, e), s = eh(i, r, e - 1 / 3);
	return Math.round(a * 255) << 24 | Math.round(o * 255) << 16 | Math.round(s * 255) << 8;
}
function nh(e) {
	let t = parseInt(e, 10);
	return t < 0 ? 0 : t > 255 ? 255 : t;
}
function rh(e) {
	return (parseFloat(e) % 360 + 360) % 360 / 360;
}
function ih(e) {
	let t = parseFloat(e);
	return t < 0 ? 0 : t > 1 ? 255 : Math.round(t * 255);
}
function ah(e) {
	let t = parseFloat(e);
	return t < 0 ? 0 : t > 100 ? 1 : t / 100;
}
function oh(e) {
	let t = $m(e);
	return t === null ? e : (t ||= 0, `rgba(${(t & 4278190080) >>> 24}, ${(t & 16711680) >>> 16}, ${(t & 65280) >>> 8}, ${(t & 255) / 255})`);
}
var sh = (e, t, n) => {
	if (Q.fun(e)) return e;
	if (Q.arr(e)) return sh({
		range: e,
		output: t,
		extrapolate: n
	});
	if (Q.str(e.output[0])) return wm(e);
	let r = e, i = r.output, a = r.range || [0, 1], o = r.extrapolateLeft || r.extrapolate || "extend", s = r.extrapolateRight || r.extrapolate || "extend", c = r.easing || ((e) => e);
	return (e) => {
		let t = lh(e, a);
		return ch(e, a[t], a[t + 1], i[t], i[t + 1], c, o, s, r.map);
	};
};
function ch(e, t, n, r, i, a, o, s, c) {
	let l = c ? c(e) : e;
	if (l < t) {
		if (o === "identity") return l;
		o === "clamp" && (l = t);
	}
	if (l > n) {
		if (s === "identity") return l;
		s === "clamp" && (l = n);
	}
	return r === i ? r : t === n ? e <= t ? r : i : (t === -Infinity ? l = -l : n === Infinity ? l -= t : l = (l - t) / (n - t), l = a(l), r === -Infinity ? l = -l : i === Infinity ? l += r : l = l * (i - r) + r, l);
}
function lh(e, t) {
	for (var n = 1; n < t.length - 1 && !(t[n] >= e); ++n);
	return n - 1;
}
var uh = (e, t = "end") => (n) => {
	n = t === "end" ? Math.min(n, .999) : Math.max(n, .001);
	let r = n * e;
	return Bm(0, 1, (t === "end" ? Math.floor(r) : Math.ceil(r)) / e);
}, dh = 1.70158, fh = dh * 1.525, ph = dh + 1, mh = 2 * Math.PI / 3, hh = 2 * Math.PI / 4.5, gh = (e) => {
	let t = 7.5625, n = 2.75;
	return e < 1 / n ? t * e * e : e < 2 / n ? t * (e -= 1.5 / n) * e + .75 : e < 2.5 / n ? t * (e -= 2.25 / n) * e + .9375 : t * (e -= 2.625 / n) * e + .984375;
}, _h = {
	linear: (e) => e,
	easeInQuad: (e) => e * e,
	easeOutQuad: (e) => 1 - (1 - e) * (1 - e),
	easeInOutQuad: (e) => e < .5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2,
	easeInCubic: (e) => e * e * e,
	easeOutCubic: (e) => 1 - (1 - e) ** 3,
	easeInOutCubic: (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2,
	easeInQuart: (e) => e * e * e * e,
	easeOutQuart: (e) => 1 - (1 - e) ** 4,
	easeInOutQuart: (e) => e < .5 ? 8 * e * e * e * e : 1 - (-2 * e + 2) ** 4 / 2,
	easeInQuint: (e) => e * e * e * e * e,
	easeOutQuint: (e) => 1 - (1 - e) ** 5,
	easeInOutQuint: (e) => e < .5 ? 16 * e * e * e * e * e : 1 - (-2 * e + 2) ** 5 / 2,
	easeInSine: (e) => 1 - Math.cos(e * Math.PI / 2),
	easeOutSine: (e) => Math.sin(e * Math.PI / 2),
	easeInOutSine: (e) => -(Math.cos(Math.PI * e) - 1) / 2,
	easeInExpo: (e) => e === 0 ? 0 : 2 ** (10 * e - 10),
	easeOutExpo: (e) => e === 1 ? 1 : 1 - 2 ** (-10 * e),
	easeInOutExpo: (e) => e === 0 ? 0 : e === 1 ? 1 : e < .5 ? 2 ** (20 * e - 10) / 2 : (2 - 2 ** (-20 * e + 10)) / 2,
	easeInCirc: (e) => 1 - Math.sqrt(1 - e ** 2),
	easeOutCirc: (e) => Math.sqrt(1 - (e - 1) ** 2),
	easeInOutCirc: (e) => e < .5 ? (1 - Math.sqrt(1 - (2 * e) ** 2)) / 2 : (Math.sqrt(1 - (-2 * e + 2) ** 2) + 1) / 2,
	easeInBack: (e) => ph * e * e * e - dh * e * e,
	easeOutBack: (e) => 1 + ph * (e - 1) ** 3 + dh * (e - 1) ** 2,
	easeInOutBack: (e) => e < .5 ? (2 * e) ** 2 * ((fh + 1) * 2 * e - fh) / 2 : ((2 * e - 2) ** 2 * ((fh + 1) * (e * 2 - 2) + fh) + 2) / 2,
	easeInElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : -(2 ** (10 * e - 10)) * Math.sin((e * 10 - 10.75) * mh),
	easeOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : 2 ** (-10 * e) * Math.sin((e * 10 - .75) * mh) + 1,
	easeInOutElastic: (e) => e === 0 ? 0 : e === 1 ? 1 : e < .5 ? -(2 ** (20 * e - 10) * Math.sin((20 * e - 11.125) * hh)) / 2 : 2 ** (-20 * e + 10) * Math.sin((20 * e - 11.125) * hh) / 2 + 1,
	easeInBounce: (e) => 1 - gh(1 - e),
	easeOutBounce: gh,
	easeInOutBounce: (e) => e < .5 ? (1 - gh(1 - 2 * e)) / 2 : (1 + gh(2 * e - 1)) / 2,
	steps: uh
}, vh = Symbol.for("FluidValue.get"), yh = Symbol.for("FluidValue.observers"), bh = (e) => !!(e && e[vh]), xh = (e) => e && e[vh] ? e[vh]() : e, Sh = (e) => e[yh] || null;
function Ch(e, t) {
	e.eventObserved ? e.eventObserved(t) : e(t);
}
function wh(e, t) {
	let n = e[yh];
	n && n.forEach((e) => {
		Ch(e, t);
	});
}
var Th = class {
	constructor(e) {
		if (!e && !(e = this.get)) throw Error("Unknown getter");
		Eh(this, e);
	}
}, Eh = (e, t) => kh(e, vh, t);
function Dh(e, t) {
	if (e[vh]) {
		let n = e[yh];
		n || kh(e, yh, n = /* @__PURE__ */ new Set()), n.has(t) || (n.add(t), e.observerAdded && e.observerAdded(n.size, t));
	}
	return t;
}
function Oh(e, t) {
	let n = e[yh];
	if (n && n.has(t)) {
		let r = n.size - 1;
		r ? n.delete(t) : e[yh] = null, e.observerRemoved && e.observerRemoved(r, t);
	}
}
var kh = (e, t, n) => Object.defineProperty(e, t, {
	value: n,
	writable: !0,
	configurable: !0
}), Ah = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, jh = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, Mh = RegExp(`(${Ah.source})(%|[a-z]+)`, "i"), Nh = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, Ph = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/, Fh = (e) => {
	let [t, n] = Ih(e);
	if (!t || Cm()) return e;
	let r = window.getComputedStyle(document.documentElement).getPropertyValue(t);
	return r ? r.trim() : n && n.startsWith("--") ? window.getComputedStyle(document.documentElement).getPropertyValue(n) || e : n && Ph.test(n) ? Fh(n) : n || e;
}, Ih = (e) => {
	let t = Ph.exec(e);
	if (!t) return [,];
	let [, n, r] = t;
	return [n, r];
}, Lh, Rh = (e, t, n, r, i) => `rgba(${Math.round(t)}, ${Math.round(n)}, ${Math.round(r)}, ${i})`, zh = (e) => {
	Lh ||= Em ? RegExp(`(${Object.keys(Em).join("|")})(?!\\w)`, "g") : /^\b$/;
	let t = e.output.map((e) => xh(e).replace(Ph, Fh).replace(jh, oh).replace(Lh, oh)), n = t.map((e) => e.match(Ah).map(Number)), r = n[0].map((e, t) => n.map((e) => {
		if (!(t in e)) throw Error("The arity of each \"output\" value must be equal");
		return e[t];
	})).map((t) => sh({
		...e,
		output: t
	}));
	return (e) => {
		let n = !Mh.test(t[0]) && t.find((e) => Mh.test(e))?.replace(Ah, ""), i = 0;
		return t[0].replace(Ah, () => `${r[i++](e)}${n || ""}`).replace(Nh, Rh);
	};
}, Bh = "react-spring: ", Vh = (e) => {
	let t = e, n = !1;
	if (typeof t != "function") throw TypeError(`${Bh}once requires a function parameter`);
	return (...e) => {
		n ||= (t(...e), !0);
	};
}, Hh = Vh(console.warn);
function Uh() {
	Hh(`${Bh}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
var Wh = Vh(console.warn);
function Gh() {
	Wh(`${Bh}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
}
function Kh(e) {
	return Q.str(e) && (e[0] == "#" || /\d/.test(e) || !Cm() && Ph.test(e) || e in (Em || {}));
}
var qh = Cm() ? c : u, Jh = () => {
	let e = f(!1);
	return qh(() => (e.current = !0, () => {
		e.current = !1;
	}), []), e;
};
function Yh() {
	let e = p()[1], t = Jh();
	return () => {
		t.current && e(Math.random());
	};
}
var Xh = (e) => c(e, Zh), Zh = [];
function Qh(e) {
	let t = f(void 0);
	return c(() => {
		t.current = e;
	}), t.current;
}
//#endregion
//#region node_modules/@react-spring/animated/dist/react-spring_animated.modern.mjs
var $h = Symbol.for("Animated:node"), eg = (e) => !!e && e[$h] === e, tg = (e) => e && e[$h], ng = (e, t) => _m(e, $h, t), rg = (e) => e && e[$h] && e[$h].getPayload(), ig = class {
	constructor() {
		ng(this, this);
	}
	getPayload() {
		return this.payload || [];
	}
}, ag = class e extends ig {
	constructor(e) {
		super(), this._value = e, this.done = !0, this.durationProgress = 0, Q.num(this._value) && (this.lastPosition = this._value);
	}
	static create(t) {
		return new e(t);
	}
	getPayload() {
		return [this];
	}
	getValue() {
		return this._value;
	}
	setValue(e, t) {
		return Q.num(e) && (this.lastPosition = e, t && (e = Math.round(e / t) * t, this.done && (this.lastPosition = e))), this._value === e ? !1 : (this._value = e, !0);
	}
	reset() {
		let { done: e } = this;
		this.done = !1, Q.num(this._value) && (this.elapsedTime = 0, this.durationProgress = 0, this.lastPosition = this._value, e && (this.lastVelocity = null), this.v0 = null);
	}
}, og = class e extends ag {
	constructor(e) {
		super(0), this._string = null, this._toString = sh({ output: [e, e] });
	}
	static create(t) {
		return new e(t);
	}
	getValue() {
		return this._string ??= this._toString(this._value);
	}
	setValue(e) {
		if (Q.str(e)) {
			if (e == this._string) return !1;
			this._string = e, this._value = 1;
		} else if (super.setValue(e)) this._string = null;
		else return !1;
		return !0;
	}
	reset(e) {
		e && (this._toString = sh({ output: [this.getValue(), e] })), this._value = 0, super.reset();
	}
}, sg = { dependencies: null }, cg = class extends ig {
	constructor(e) {
		super(), this.source = e, this.setValue(e);
	}
	getValue(e) {
		let t = {};
		return ym(this.source, (n, r) => {
			eg(n) ? t[r] = n.getValue(e) : bh(n) ? t[r] = xh(n) : e || (t[r] = n);
		}), t;
	}
	setValue(e) {
		this.source = e, this.payload = this._makePayload(e);
	}
	reset() {
		this.payload && $(this.payload, (e) => e.reset());
	}
	_makePayload(e) {
		if (e) {
			let t = /* @__PURE__ */ new Set();
			return ym(e, this._addToPayload, t), Array.from(t);
		}
	}
	_addToPayload(e) {
		sg.dependencies && bh(e) && sg.dependencies.add(e);
		let t = rg(e);
		t && $(t, (e) => this.add(e));
	}
}, lg = class e extends cg {
	constructor(e) {
		super(e);
	}
	static create(t) {
		return new e(t);
	}
	getValue() {
		return this.source.map((e) => e.getValue());
	}
	setValue(e) {
		let t = this.getPayload();
		return e.length == t.length ? t.map((t, n) => t.setValue(e[n])).some(Boolean) : (super.setValue(e.map(ug)), !0);
	}
};
function ug(e) {
	return (Kh(e) ? og : ag).create(e);
}
function dg(e) {
	let t = tg(e);
	return t ? t.constructor : Q.arr(e) ? lg : Kh(e) ? og : ag;
}
var fg = (t, n) => {
	let r = !Q.fun(t) || t.prototype && t.prototype.isReactComponent;
	return a((i, a) => {
		let s = f(null), l = r && o((e) => {
			s.current = hg(a, e);
		}, [a]), [u, d] = mg(i, n), p = Yh(), m = () => {
			let e = s.current;
			r && !e || (e ? n.applyAnimatedValues(e, u.getValue(!0)) : !1) === !1 && p();
		}, h = new pg(m, d), g = f(void 0);
		qh(() => (g.current = h, $(d, (e) => Dh(e, h)), () => {
			g.current && ($(g.current.deps, (e) => Oh(e, g.current)), Z.cancel(g.current.update));
		})), c(m, []), Xh(() => () => {
			let e = g.current;
			$(e.deps, (t) => Oh(t, e));
		});
		let _ = n.getComponentProps(u.getValue());
		return /* @__PURE__ */ e.createElement(t, {
			..._,
			ref: l
		});
	});
}, pg = class {
	constructor(e, t) {
		this.update = e, this.deps = t;
	}
	eventObserved(e) {
		e.type == "change" && Z.write(this.update);
	}
};
function mg(e, t) {
	let n = /* @__PURE__ */ new Set();
	return sg.dependencies = n, e.style && (e = {
		...e,
		style: t.createAnimatedStyle(e.style)
	}), e = new cg(e), sg.dependencies = null, [e, n];
}
function hg(e, t) {
	return e && (Q.fun(e) ? e(t) : e.current = t), t;
}
var gg = Symbol.for("AnimatedComponent"), _g = (e, { applyAnimatedValues: t = () => !1, createAnimatedStyle: n = (e) => new cg(e), getComponentProps: r = (e) => e } = {}) => {
	let i = {
		applyAnimatedValues: t,
		createAnimatedStyle: n,
		getComponentProps: r
	}, a = (e) => {
		let t = vg(e) || "Anonymous";
		return e = Q.str(e) ? a[e] || (a[e] = fg(e, i)) : e[gg] || (e[gg] = fg(e, i)), e.displayName = `Animated(${t})`, e;
	};
	return ym(e, (t, n) => {
		Q.arr(e) && (n = vg(t)), a[n] = a(t);
	}), { animated: a };
}, vg = (e) => Q.str(e) ? e : e && Q.str(e.displayName) ? e.displayName : Q.fun(e) && e.name || null;
//#endregion
//#region node_modules/@react-spring/core/dist/react-spring_core.modern.mjs
function yg(e, ...t) {
	return Q.fun(e) ? e(...t) : e;
}
var bg = (e, t) => e === !0 || !!(t && e && (Q.fun(e) ? e(t) : bm(e).includes(t))), xg = (e, t) => Q.obj(e) ? t && e[t] : e, Sg = (e, t) => e.default === !0 ? e[t] : e.default ? e.default[t] : void 0, Cg = (e) => e, wg = (e, t = Cg) => {
	let n = Tg;
	e.default && e.default !== !0 && (e = e.default, n = Object.keys(e));
	let r = {};
	for (let i of n) {
		let n = t(e[i], i);
		Q.und(n) || (r[i] = n);
	}
	return r;
}, Tg = [
	"config",
	"onProps",
	"onStart",
	"onChange",
	"onPause",
	"onResume",
	"onRest"
], Eg = {
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
	keys: 1,
	callId: 1,
	parentId: 1
};
function Dg(e) {
	let t = {}, n = 0;
	if (ym(e, (e, r) => {
		Eg[r] || (t[r] = e, n++);
	}), n) return t;
}
function Og(e) {
	let t = Dg(e);
	if (t) {
		let n = { to: t };
		return ym(e, (e, r) => r in t || (n[r] = e)), n;
	}
	return { ...e };
}
function kg(e) {
	return e = xh(e), Q.arr(e) ? e.map(kg) : Kh(e) ? hm.createStringInterpolator({
		range: [0, 1],
		output: [e, e]
	})(1) : e;
}
function Ag(e) {
	for (let t in e) return !0;
	return !1;
}
function jg(e) {
	return Q.fun(e) || Q.arr(e) && Q.obj(e[0]);
}
function Mg(e, t) {
	e.ref?.delete(e), t?.delete(e);
}
function Ng(e, t) {
	t && e.ref !== t && (e.ref?.delete(e), t.add(e), e.ref = t);
}
var Pg = {
	...{
		default: {
			tension: 170,
			friction: 26
		},
		gentle: {
			tension: 120,
			friction: 14
		},
		wobbly: {
			tension: 180,
			friction: 12
		},
		stiff: {
			tension: 210,
			friction: 20
		},
		slow: {
			tension: 280,
			friction: 60
		},
		molasses: {
			tension: 280,
			friction: 120
		}
	}.default,
	mass: 1,
	damping: 1,
	easing: _h.linear,
	clamp: !1
}, Fg = class {
	constructor() {
		this.velocity = 0, Object.assign(this, Pg);
	}
};
function Ig(e, t, n) {
	n && (n = { ...n }, Lg(n, t), t = {
		...n,
		...t
	}), Lg(e, t), Object.assign(e, t);
	for (let t in Pg) e[t] ?? (e[t] = Pg[t]);
	let { frequency: r, damping: i } = e, { mass: a } = e;
	return Q.und(r) || (r < .01 && (r = .01), i < 0 && (i = 0), e.tension = (2 * Math.PI / r) ** 2 * a, e.friction = 4 * Math.PI * i * a / r), e;
}
function Lg(e, t) {
	if (!Q.und(t.decay)) e.duration = void 0;
	else {
		let n = !Q.und(t.tension) || !Q.und(t.friction);
		(n || !Q.und(t.frequency) || !Q.und(t.damping) || !Q.und(t.mass)) && (e.duration = void 0, e.decay = void 0), n && (e.frequency = void 0);
	}
}
var Rg = [], zg = class {
	constructor() {
		this.changed = !1, this.values = Rg, this.toValues = null, this.fromValues = Rg, this.config = new Fg(), this.immediate = !1;
	}
};
function Bg(e, { key: t, props: n, defaultProps: r, state: i, actions: a }) {
	return new Promise((o, s) => {
		let c, l, u = bg(n.cancel ?? r?.cancel, t);
		if (u) p();
		else {
			Q.und(n.pause) || (i.paused = bg(n.pause, t));
			let e = r?.pause;
			e !== !0 && (e = i.paused || bg(e, t)), c = yg(n.delay || 0, t), e ? (i.resumeQueue.add(f), a.pause()) : (a.resume(), f());
		}
		function d() {
			i.resumeQueue.add(f), i.timeouts.delete(l), l.cancel(), c = l.time - Z.now();
		}
		function f() {
			c > 0 && !hm.skipAnimation ? (i.delayed = !0, l = Z.setTimeout(p, c), i.pauseQueue.add(d), i.timeouts.add(l)) : p();
		}
		function p() {
			i.delayed &&= !1, i.pauseQueue.delete(d), i.timeouts.delete(l), e <= (i.cancelId || 0) && (u = !0);
			try {
				a.start({
					...n,
					callId: e,
					cancel: u
				}, o);
			} catch (e) {
				s(e);
			}
		}
	});
}
var Vg = (e, t) => t.length == 1 ? t[0] : t.some((e) => e.cancelled) ? Wg(e.get()) : t.every((e) => e.noop) ? Hg(e.get()) : Ug(e.get(), t.every((e) => e.finished)), Hg = (e) => ({
	value: e,
	noop: !0,
	finished: !0,
	cancelled: !1
}), Ug = (e, t, n = !1) => ({
	value: e,
	finished: t,
	cancelled: n
}), Wg = (e) => ({
	value: e,
	cancelled: !0,
	finished: !1
});
function Gg(e, t, n, r) {
	let { callId: i, parentId: a, onRest: o } = t, { asyncTo: s, promise: c } = n;
	return !a && e === s && !t.reset ? c : n.promise = (async () => {
		n.asyncId = i, n.asyncTo = e;
		let l = wg(t, (e, t) => t === "onRest" ? void 0 : e), u, d, f = new Promise((e, t) => (u = e, d = t)), p = (e) => {
			let t = i <= (n.cancelId || 0) && Wg(r) || i !== n.asyncId && Ug(r, !1);
			if (t) throw e.result = t, d(e), e;
		}, m = (e, t) => {
			let a = new qg(), o = new Jg();
			return (async () => {
				if (hm.skipAnimation) throw Kg(n), o.result = Ug(r, !1), d(o), o;
				p(a);
				let s = Q.obj(e) ? { ...e } : {
					...t,
					to: e
				};
				s.parentId = i, ym(l, (e, t) => {
					Q.und(s[t]) && (s[t] = e);
				});
				let c = await r.start(s);
				return p(a), n.paused && await new Promise((e) => {
					n.resumeQueue.add(e);
				}), c;
			})();
		}, h;
		if (hm.skipAnimation) return Kg(n), Ug(r, !1);
		try {
			let t;
			t = Q.arr(e) ? (async (e) => {
				for (let t of e) await m(t);
			})(e) : Promise.resolve(e(m, r.stop.bind(r))), await Promise.all([t.then(u), f]), h = Ug(r.get(), !0, !1);
		} catch (e) {
			if (e instanceof qg) h = e.result;
			else if (e instanceof Jg) h = e.result;
			else throw e;
		} finally {
			i == n.asyncId && (n.asyncId = a, n.asyncTo = a ? s : void 0, n.promise = a ? c : void 0);
		}
		return Q.fun(o) && Z.batchedUpdates(() => {
			o(h, r, r.item);
		}), h;
	})();
}
function Kg(e, t) {
	xm(e.timeouts, (e) => e.cancel()), e.pauseQueue.clear(), e.resumeQueue.clear(), e.asyncId = e.asyncTo = e.promise = void 0, t && (e.cancelId = t);
}
var qg = class extends Error {
	constructor() {
		super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.");
	}
}, Jg = class extends Error {
	constructor() {
		super("SkipAnimationSignal");
	}
}, Yg = (e) => e instanceof Zg, Xg = 1, Zg = class extends Th {
	constructor() {
		super(...arguments), this.id = Xg++, this._priority = 0;
	}
	get priority() {
		return this._priority;
	}
	set priority(e) {
		this._priority != e && (this._priority = e, this._onPriorityChange(e));
	}
	get() {
		let e = tg(this);
		return e && e.getValue();
	}
	to(...e) {
		return hm.to(this, e);
	}
	interpolate(...e) {
		return Uh(), hm.to(this, e);
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
	_attach() {}
	_detach() {}
	_onChange(e, t = !1) {
		wh(this, {
			type: "change",
			parent: this,
			value: e,
			idle: t
		});
	}
	_onPriorityChange(e) {
		this.idle || Pm.sort(this), wh(this, {
			type: "priority",
			parent: this,
			priority: e
		});
	}
}, Qg = Symbol.for("SpringPhase"), $g = 1, e_ = 2, t_ = 4, n_ = (e) => (e[Qg] & $g) > 0, r_ = (e) => (e[Qg] & e_) > 0, i_ = (e) => (e[Qg] & t_) > 0, a_ = (e, t) => t ? e[Qg] |= e_ | $g : e[Qg] &= ~e_, o_ = (e, t) => t ? e[Qg] |= t_ : e[Qg] &= ~t_, s_ = class extends Zg {
	constructor(e, t) {
		if (super(), this.animation = new zg(), this.defaultProps = {}, this._state = {
			paused: !1,
			delayed: !1,
			pauseQueue: /* @__PURE__ */ new Set(),
			resumeQueue: /* @__PURE__ */ new Set(),
			timeouts: /* @__PURE__ */ new Set()
		}, this._pendingCalls = /* @__PURE__ */ new Set(), this._lastCallId = 0, this._lastToId = 0, this._memoizedDuration = 0, !Q.und(e) || !Q.und(t)) {
			let n = Q.obj(e) ? { ...e } : {
				...t,
				from: e
			};
			Q.und(n.default) && (n.default = !0), this.start(n);
		}
	}
	get idle() {
		return !(r_(this) || this._state.asyncTo) || i_(this);
	}
	get goal() {
		return xh(this.animation.to);
	}
	get velocity() {
		let e = tg(this);
		return e instanceof ag ? e.lastVelocity || 0 : e.getPayload().map((e) => e.lastVelocity || 0);
	}
	get hasAnimated() {
		return n_(this);
	}
	get isAnimating() {
		return r_(this);
	}
	get isPaused() {
		return i_(this);
	}
	get isDelayed() {
		return this._state.delayed;
	}
	advance(e) {
		let t = !0, n = !1, r = this.animation, { toValues: i } = r, { config: a } = r, o = rg(r.to);
		!o && bh(r.to) && (i = bm(xh(r.to))), r.values.forEach((s, c) => {
			if (s.done) return;
			let l = s.constructor == og ? 1 : o ? o[c].lastPosition : i[c], u = r.immediate, d = l;
			if (!u) {
				if (d = s.lastPosition, a.tension <= 0) {
					s.done = !0;
					return;
				}
				let t = s.elapsedTime += e, n = r.fromValues[c], i = s.v0 == null ? s.v0 = Q.arr(a.velocity) ? a.velocity[c] : a.velocity : s.v0, o, f = a.precision || (n == l ? .005 : Math.min(1, Math.abs(l - n) * .001));
				if (!Q.und(a.duration)) {
					let r = 1;
					a.duration > 0 && (this._memoizedDuration !== a.duration && (this._memoizedDuration = a.duration, s.durationProgress > 0 && (s.elapsedTime = a.duration * s.durationProgress, t = s.elapsedTime += e)), r = (a.progress || 0) + t / this._memoizedDuration, r = r > 1 ? 1 : r < 0 ? 0 : r, s.durationProgress = r), d = n + a.easing(r) * (l - n), o = (d - s.lastPosition) / e, u = r == 1;
				} else if (a.decay) {
					let e = a.decay === !0 ? .998 : a.decay, r = Math.exp(-(1 - e) * t);
					d = n + i / (1 - e) * (1 - r), u = Math.abs(s.lastPosition - d) <= f, o = i * r;
				} else {
					o = s.lastVelocity == null ? i : s.lastVelocity;
					let t = a.restVelocity || f / 10, r = a.clamp ? 0 : a.bounce, c = !Q.und(r), p = n == l ? s.v0 > 0 : n < l, m, h = !1, g = Math.ceil(e / 1);
					for (let e = 0; e < g && (m = Math.abs(o) > t, !(!m && (u = Math.abs(l - d) <= f, u))); ++e) {
						c && (h = d == l || d > l == p, h && (o = -o * r, d = l));
						let e = (-a.tension * 1e-6 * (d - l) + -a.friction * .001 * o) / a.mass;
						o += e * 1, d += o * 1;
					}
				}
				s.lastVelocity = o, Number.isNaN(d) && (console.warn("Got NaN while animating:", this), u = !0);
			}
			o && !o[c].done && (u = !1), u ? s.done = !0 : t = !1, s.setValue(d, a.round) && (n = !0);
		});
		let s = tg(this), c = s.getValue();
		if (t) {
			let e = xh(r.to);
			(c !== e || n) && !a.decay ? (s.setValue(e), this._onChange(e)) : n && a.decay && this._onChange(c), this._stop();
		} else n && this._onChange(c);
	}
	set(e) {
		return Z.batchedUpdates(() => {
			this._stop(), this._focus(e), this._set(e);
		}), this;
	}
	pause() {
		this._update({ pause: !0 });
	}
	resume() {
		this._update({ pause: !1 });
	}
	finish() {
		if (r_(this)) {
			let { to: e, config: t } = this.animation;
			Z.batchedUpdates(() => {
				this._onStart(), t.decay || this._set(e, !1), this._stop();
			});
		}
		return this;
	}
	update(e) {
		return (this.queue ||= []).push(e), this;
	}
	start(e, t) {
		let n;
		return Q.und(e) ? (n = this.queue || [], this.queue = []) : n = [Q.obj(e) ? e : {
			...t,
			to: e
		}], Promise.all(n.map((e) => this._update(e))).then((e) => Vg(this, e));
	}
	stop(e) {
		let { to: t } = this.animation;
		return this._focus(this.get()), Kg(this._state, e && this._lastCallId), Z.batchedUpdates(() => this._stop(t, e)), this;
	}
	reset() {
		this._update({ reset: !0 });
	}
	eventObserved(e) {
		e.type == "change" ? this._start() : e.type == "priority" && (this.priority = e.priority + 1);
	}
	_prepareNode(e) {
		let t = this.key || "", { to: n, from: r } = e;
		n = Q.obj(n) ? n[t] : n, (n == null || jg(n)) && (n = void 0), r = Q.obj(r) ? r[t] : r, r ??= void 0;
		let i = {
			to: n,
			from: r
		};
		return n_(this) || (e.reverse && ([n, r] = [r, n]), r = xh(r), Q.und(r) ? tg(this) || this._set(n) : this._set(r)), i;
	}
	_update({ ...e }, t) {
		let { key: n, defaultProps: r } = this;
		e.default && Object.assign(r, wg(e, (e, t) => /^on/.test(t) ? xg(e, n) : e)), m_(this, e, "onProps"), h_(this, "onProps", e, this);
		let i = this._prepareNode(e);
		if (Object.isFrozen(this)) throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
		let a = this._state;
		return Bg(++this._lastCallId, {
			key: n,
			props: e,
			defaultProps: r,
			state: a,
			actions: {
				pause: () => {
					i_(this) || (o_(this, !0), Sm(a.pauseQueue), h_(this, "onPause", Ug(this, c_(this, this.animation.to)), this));
				},
				resume: () => {
					i_(this) && (o_(this, !1), r_(this) && this._resume(), Sm(a.resumeQueue), h_(this, "onResume", Ug(this, c_(this, this.animation.to)), this));
				},
				start: this._merge.bind(this, i)
			}
		}).then((n) => {
			if (e.loop && n.finished && !(t && n.noop)) {
				let t = l_(e);
				if (t) return this._update(t, !0);
			}
			return n;
		});
	}
	_merge(e, t, n) {
		if (t.cancel) return this.stop(!0), n(Wg(this));
		let r = !Q.und(e.to), i = !Q.und(e.from);
		if (r || i) if (t.callId > this._lastToId) this._lastToId = t.callId;
		else return n(Wg(this));
		let { key: a, defaultProps: o, animation: s } = this, { to: c, from: l } = s, { to: u = c, from: d = l } = e;
		i && !r && (!t.default || Q.und(u)) && (u = d), t.reverse && ([u, d] = [d, u]);
		let f = !vm(d, l);
		f && (s.from = d), d = xh(d);
		let p = !vm(u, c);
		p && this._focus(u);
		let m = jg(t.to), { config: h } = s, { decay: g, velocity: _ } = h;
		(r || i) && (h.velocity = 0), t.config && !m && Ig(h, yg(t.config, a), t.config === o.config ? void 0 : yg(o.config, a));
		let v = tg(this);
		if (!v || Q.und(u)) return n(Ug(this, !0));
		let y = Q.und(t.reset) ? i && !t.default : !Q.und(d) && bg(t.reset, a), b = y ? d : this.get(), x = kg(u), S = Q.num(x) || Q.arr(x) || Kh(x), C = !m && (!S || bg(o.immediate || t.immediate, a));
		if (p) {
			let e = dg(u);
			if (e !== v.constructor) if (C) v = this._set(x);
			else throw Error(`Cannot animate between ${v.constructor.name} and ${e.name}, as the "to" prop suggests`);
		}
		let w = v.constructor, T = bh(u), E = !1;
		if (!T) {
			let e = y || !n_(this) && f;
			(p || e) && (E = vm(kg(b), x), T = !E), (!vm(s.immediate, C) && !C || !vm(h.decay, g) || !vm(h.velocity, _)) && (T = !0);
		}
		if (E && r_(this) && (s.changed && !y ? T = !0 : T || this._stop(c)), !m && ((T || bh(c)) && (s.values = v.getPayload(), s.toValues = bh(u) ? null : w == og ? [1] : bm(x)), s.immediate != C && (s.immediate = C, !C && !y && this._set(c)), T)) {
			let { onRest: e } = s;
			$(p_, (e) => m_(this, t, e));
			let r = Ug(this, c_(this, c));
			Sm(this._pendingCalls, r), this._pendingCalls.add(n), s.changed && Z.batchedUpdates(() => {
				s.changed = !y, e?.(r, this), y ? yg(o.onRest, r) : s.onStart?.(r, this);
			});
		}
		y && this._set(b), m ? n(Gg(t.to, t, this._state, this)) : T ? this._start() : r_(this) && !p ? this._pendingCalls.add(n) : n(Hg(b));
	}
	_focus(e) {
		let t = this.animation;
		e !== t.to && (Sh(this) && this._detach(), t.to = e, Sh(this) && this._attach());
	}
	_attach() {
		let e = 0, { to: t } = this.animation;
		bh(t) && (Dh(t, this), Yg(t) && (e = t.priority + 1)), this.priority = e;
	}
	_detach() {
		let { to: e } = this.animation;
		bh(e) && Oh(e, this);
	}
	_set(e, t = !0) {
		let n = xh(e);
		if (!Q.und(n)) {
			let e = tg(this);
			if (!e || !vm(n, e.getValue())) {
				let r = dg(n);
				!e || e.constructor != r ? ng(this, r.create(n)) : e.setValue(n), e && Z.batchedUpdates(() => {
					this._onChange(n, t);
				});
			}
		}
		return tg(this);
	}
	_onStart() {
		let e = this.animation;
		e.changed || (e.changed = !0, h_(this, "onStart", Ug(this, c_(this, e.to)), this));
	}
	_onChange(e, t) {
		t || (this._onStart(), yg(this.animation.onChange, e, this)), yg(this.defaultProps.onChange, e, this), super._onChange(e, t);
	}
	_start() {
		let e = this.animation;
		tg(this).reset(xh(e.to)), e.immediate || (e.fromValues = e.values.map((e) => e.lastPosition)), r_(this) || (a_(this, !0), i_(this) || this._resume());
	}
	_resume() {
		hm.skipAnimation ? this.finish() : Pm.start(this);
	}
	_stop(e, t) {
		if (r_(this)) {
			a_(this, !1);
			let n = this.animation;
			$(n.values, (e) => {
				e.done = !0;
			}), n.toValues && (n.onChange = n.onPause = n.onResume = void 0), wh(this, {
				type: "idle",
				parent: this
			});
			let r = t ? Wg(this.get()) : Ug(this.get(), c_(this, e ?? n.to));
			Sm(this._pendingCalls, r), n.changed && (n.changed = !1, h_(this, "onRest", r, this));
		}
	}
};
function c_(e, t) {
	let n = kg(t);
	return vm(kg(e.get()), n);
}
function l_(e, t = e.loop, n = e.to) {
	let r = yg(t);
	if (r) {
		let i = r !== !0 && Og(r), a = (i || e).reverse, o = !i || i.reset;
		return u_({
			...e,
			loop: t,
			default: !1,
			pause: void 0,
			to: !a || jg(n) ? n : void 0,
			from: o ? e.from : void 0,
			reset: o,
			...i
		});
	}
}
function u_(e) {
	let { to: t, from: n } = e = Og(e), r = /* @__PURE__ */ new Set();
	return Q.obj(t) && f_(t, r), Q.obj(n) && f_(n, r), e.keys = r.size ? Array.from(r) : null, e;
}
function d_(e) {
	let t = u_(e);
	return Q.und(t.default) && (t.default = wg(t)), t;
}
function f_(e, t) {
	ym(e, (e, n) => e != null && t.add(n));
}
var p_ = [
	"onStart",
	"onRest",
	"onChange",
	"onPause",
	"onResume"
];
function m_(e, t, n) {
	e.animation[n] = t[n] === Sg(t, n) ? void 0 : xg(t[n], e.key);
}
function h_(e, t, ...n) {
	e.animation[t]?.(...n), e.defaultProps[t]?.(...n);
}
var g_ = [
	"onStart",
	"onChange",
	"onRest"
], __ = 1, v_ = class {
	constructor(e, t) {
		this.id = __++, this.springs = {}, this.queue = [], this._lastAsyncId = 0, this._active = /* @__PURE__ */ new Set(), this._changed = /* @__PURE__ */ new Set(), this._started = !1, this._state = {
			paused: !1,
			pauseQueue: /* @__PURE__ */ new Set(),
			resumeQueue: /* @__PURE__ */ new Set(),
			timeouts: /* @__PURE__ */ new Set()
		}, this._events = {
			onStart: /* @__PURE__ */ new Map(),
			onChange: /* @__PURE__ */ new Map(),
			onRest: /* @__PURE__ */ new Map()
		}, this._onFrame = this._onFrame.bind(this), t && (this._flush = t), e && this.start({
			default: !0,
			...e
		});
	}
	get idle() {
		return !this._state.asyncTo && Object.values(this.springs).every((e) => e.idle && !e.isDelayed && !e.isPaused);
	}
	get item() {
		return this._item;
	}
	set item(e) {
		this._item = e;
	}
	get() {
		let e = {};
		return this.each((t, n) => e[n] = t.get()), e;
	}
	set(e) {
		for (let t in e) {
			let n = e[t];
			Q.und(n) || this.springs[t].set(n);
		}
	}
	update(e) {
		return e && this.queue.push(u_(e)), this;
	}
	start(e) {
		let { queue: t } = this;
		return e ? t = bm(e).map(u_) : this.queue = [], this._flush ? this._flush(this, t) : (T_(this, t), y_(this, t));
	}
	stop(e, t) {
		if (e !== !!e && (t = e), t) {
			let n = this.springs;
			$(bm(t), (t) => n[t].stop(!!e));
		} else Kg(this._state, this._lastAsyncId), this.each((t) => t.stop(!!e));
		return this;
	}
	pause(e) {
		if (Q.und(e)) this.start({ pause: !0 });
		else {
			let t = this.springs;
			$(bm(e), (e) => t[e].pause());
		}
		return this;
	}
	resume(e) {
		if (Q.und(e)) this.start({ pause: !1 });
		else {
			let t = this.springs;
			$(bm(e), (e) => t[e].resume());
		}
		return this;
	}
	each(e) {
		ym(this.springs, e);
	}
	_onFrame() {
		let { onStart: e, onChange: t, onRest: n } = this._events, r = this._active.size > 0, i = this._changed.size > 0;
		(r && !this._started || i && !this._started) && (this._started = !0, xm(e, ([e, t]) => {
			t.value = this.get(), e(t, this, this._item);
		}));
		let a = !r && this._started, o = i || a && n.size ? this.get() : null;
		i && t.size && xm(t, ([e, t]) => {
			t.value = o, e(t, this, this._item);
		}), a && (this._started = !1, xm(n, ([e, t]) => {
			t.value = o, e(t, this, this._item);
		}));
	}
	eventObserved(e) {
		if (e.type == "change") this._changed.add(e.parent), e.idle || this._active.add(e.parent);
		else if (e.type == "idle") this._active.delete(e.parent);
		else return;
		Z.onFrame(this._onFrame);
	}
};
function y_(e, t) {
	return Promise.all(t.map((t) => b_(e, t))).then((t) => Vg(e, t));
}
async function b_(e, t, n) {
	let { keys: r, to: i, from: a, loop: o, onRest: s, onResolve: c } = t, l = Q.obj(t.default) && t.default;
	o && (t.loop = !1), i === !1 && (t.to = null), a === !1 && (t.from = null);
	let u = Q.arr(i) || Q.fun(i) ? i : void 0;
	u ? (t.to = void 0, t.onRest = void 0, l && (l.onRest = void 0)) : $(g_, (n) => {
		let r = t[n];
		if (Q.fun(r)) {
			let i = e._events[n];
			t[n] = ({ finished: e, cancelled: t }) => {
				let n = i.get(r);
				n ? (e || (n.finished = !1), t && (n.cancelled = !0)) : i.set(r, {
					value: null,
					finished: e || !1,
					cancelled: t || !1
				});
			}, l && (l[n] = t[n]);
		}
	});
	let d = e._state;
	t.pause === !d.paused ? (d.paused = t.pause, Sm(t.pause ? d.pauseQueue : d.resumeQueue)) : d.paused && (t.pause = !0);
	let f = (r || Object.keys(e.springs)).map((n) => e.springs[n].start(t)), p = t.cancel === !0 || Sg(t, "cancel") === !0;
	(u || p && d.asyncId) && f.push(Bg(++e._lastAsyncId, {
		props: t,
		state: d,
		actions: {
			pause: gm,
			resume: gm,
			start(t, n) {
				p ? (Kg(d, e._lastAsyncId), n(Wg(e))) : (t.onRest = s, n(Gg(u, t, d, e)));
			}
		}
	})), d.paused && await new Promise((e) => {
		d.resumeQueue.add(e);
	});
	let m = Vg(e, await Promise.all(f));
	if (o && m.finished && !(n && m.noop)) {
		let n = l_(t, o, i);
		if (n) return T_(e, [n]), b_(e, n, !0);
	}
	return c && Z.batchedUpdates(() => c(m, e, e.item)), m;
}
function x_(e, t) {
	let n = { ...e.springs };
	return t && $(bm(t), (e) => {
		Q.und(e.keys) && (e = u_(e)), Q.obj(e.to) || (e = {
			...e,
			to: void 0
		}), w_(n, e, (e) => C_(e));
	}), S_(e, n), n;
}
function S_(e, t) {
	ym(t, (t, n) => {
		e.springs[n] || (e.springs[n] = t, Dh(t, e));
	});
}
function C_(e, t) {
	let n = new s_();
	return n.key = e, t && Dh(n, t), n;
}
function w_(e, t, n) {
	t.keys && $(t.keys, (r) => {
		(e[r] || (e[r] = n(r)))._prepareNode(t);
	});
}
function T_(e, t) {
	$(t, (t) => {
		w_(e.springs, t, (t) => C_(t, e));
	});
}
var E_ = e.createContext({
	pause: !1,
	immediate: !1
}), D_ = () => {
	let e = [], t = function(t) {
		Gh();
		let r = [];
		return $(e, (e, i) => {
			if (Q.und(t)) r.push(e.start());
			else {
				let a = n(t, e, i);
				a && r.push(e.start(a));
			}
		}), r;
	};
	t.current = e, t.add = function(t) {
		e.includes(t) || e.push(t);
	}, t.delete = function(t) {
		let n = e.indexOf(t);
		~n && e.splice(n, 1);
	}, t.pause = function() {
		return $(e, (e) => e.pause(...arguments)), this;
	}, t.resume = function() {
		return $(e, (e) => e.resume(...arguments)), this;
	}, t.set = function(t) {
		$(e, (e, n) => {
			let r = Q.fun(t) ? t(n, e) : t;
			r && e.set(r);
		});
	}, t.start = function(t) {
		let n = [];
		return $(e, (e, r) => {
			if (Q.und(t)) n.push(e.start());
			else {
				let i = this._getProps(t, e, r);
				i && n.push(e.start(i));
			}
		}), n;
	}, t.stop = function() {
		return $(e, (e) => e.stop(...arguments)), this;
	}, t.update = function(t) {
		return $(e, (e, n) => e.update(this._getProps(t, e, n))), this;
	};
	let n = function(e, t, n) {
		return Q.fun(e) ? e(n, t) : e;
	};
	return t._getProps = n, t;
};
function O_(e, t, n) {
	let r = Q.fun(t) && t;
	r && !n && (n = []);
	let i = d(() => r || arguments.length == 3 ? D_() : void 0, []), a = f(0), o = Yh(), c = d(() => ({
		ctrls: [],
		queue: [],
		flush(e, t) {
			let n = x_(e, t);
			return a.current > 0 && !c.queue.length && !Object.keys(n).some((t) => !e.springs[t]) ? y_(e, t) : new Promise((r) => {
				S_(e, n), c.queue.push(() => {
					r(y_(e, t));
				}), o();
			});
		}
	}), []), l = f([...c.ctrls]), u = f([]), p = Qh(e) || 0;
	d(() => {
		$(l.current.slice(e, p), (e) => {
			Mg(e, i), e.stop(!0);
		}), l.current.length = e, m(p, e);
	}, [e]), d(() => {
		m(0, Math.min(p, e));
	}, n);
	function m(e, n) {
		for (let i = e; i < n; i++) {
			let e = l.current[i] || (l.current[i] = new v_(null, c.flush)), n = r ? r(i, e) : t[i];
			n && (u.current[i] = d_(n));
		}
	}
	let h = l.current.map((e, t) => x_(e, u.current[t])), g = s(E_), _ = g !== Qh(g) && Ag(g);
	qh(() => {
		a.current++, c.ctrls = l.current;
		let { queue: e } = c;
		e.length && (c.queue = [], $(e, (e) => e())), $(l.current, (e, t) => {
			i?.add(e), _ && e.start({ default: g });
			let n = u.current[t];
			n && (Ng(e, n.ref), e.ref ? e.queue.push(n) : e.start(n));
		});
	}), Xh(() => () => {
		$(c.ctrls, (e) => e.stop(!0));
	});
	let v = h.map((e) => ({ ...e }));
	return i ? [v, i] : v;
}
function k_(e, t) {
	let n = Q.fun(e), [[r], i] = O_(1, n ? e : [e], n ? t || [] : t);
	return n || arguments.length == 2 ? [r, i] : r;
}
var A_ = class extends Zg {
	constructor(e, t) {
		super(), this.source = e, this.idle = !0, this._active = /* @__PURE__ */ new Set(), this.calc = sh(...t);
		let n = this._get(), r = dg(n);
		ng(this, r.create(n));
	}
	advance(e) {
		let t = this._get();
		vm(t, this.get()) || (tg(this).setValue(t), this._onChange(t, this.idle)), !this.idle && M_(this._active) && N_(this);
	}
	_get() {
		let e = Q.arr(this.source) ? this.source.map(xh) : bm(xh(this.source));
		return this.calc(...e);
	}
	_start() {
		this.idle && !M_(this._active) && (this.idle = !1, $(rg(this), (e) => {
			e.done = !1;
		}), hm.skipAnimation ? (Z.batchedUpdates(() => this.advance()), N_(this)) : Pm.start(this));
	}
	_attach() {
		let e = 1;
		$(bm(this.source), (t) => {
			bh(t) && Dh(t, this), Yg(t) && (t.idle || this._active.add(t), e = Math.max(e, t.priority + 1));
		}), this.priority = e, this._start();
	}
	_detach() {
		$(bm(this.source), (e) => {
			bh(e) && Oh(e, this);
		}), this._active.clear(), N_(this);
	}
	eventObserved(e) {
		e.type == "change" ? e.idle ? this.advance() : (this._active.add(e.parent), this._start()) : e.type == "idle" ? this._active.delete(e.parent) : e.type == "priority" && (this.priority = bm(this.source).reduce((e, t) => Math.max(e, (Yg(t) ? t.priority : 0) + 1), 0));
	}
};
function j_(e) {
	return e.idle !== !1;
}
function M_(e) {
	return !e.size || Array.from(e).every(j_);
}
function N_(e) {
	e.idle || (e.idle = !0, $(rg(e), (e) => {
		e.done = !0;
	}), wh(e, {
		type: "idle",
		parent: e
	}));
}
hm.assign({
	createStringInterpolator: zh,
	to: (e, t) => new A_(e, t)
}), Pm.advance;
//#endregion
//#region node_modules/@react-spring/web/dist/react-spring_web.modern.mjs
var P_ = /^--/;
function F_(e, t) {
	return t == null || typeof t == "boolean" || t === "" ? "" : typeof t == "number" && t !== 0 && !P_.test(e) && !(R_.hasOwnProperty(e) && R_[e]) ? t + "px" : ("" + t).trim();
}
var I_ = {};
function L_(e, t) {
	if (!e.nodeType || !e.setAttribute) return !1;
	let n = e.nodeName === "filter" || e.parentNode && e.parentNode.nodeName === "filter", { className: r, style: i, children: a, scrollTop: o, scrollLeft: s, viewBox: c, ...l } = t, u = Object.values(l), d = Object.keys(l).map((t) => n || e.hasAttribute(t) ? t : I_[t] || (I_[t] = t.replace(/([A-Z])/g, (e) => "-" + e.toLowerCase())));
	a !== void 0 && (e.textContent = a);
	for (let t in i) if (i.hasOwnProperty(t)) {
		let n = F_(t, i[t]);
		P_.test(t) ? e.style.setProperty(t, n) : e.style[t] = n;
	}
	d.forEach((t, n) => {
		e.setAttribute(t, u[n]);
	}), r !== void 0 && (e.className = r), o !== void 0 && (e.scrollTop = o), s !== void 0 && (e.scrollLeft = s), c !== void 0 && e.setAttribute("viewBox", c);
}
var R_ = {
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
	fillOpacity: !0,
	floodOpacity: !0,
	stopOpacity: !0,
	strokeDasharray: !0,
	strokeDashoffset: !0,
	strokeMiterlimit: !0,
	strokeOpacity: !0,
	strokeWidth: !0
}, z_ = (e, t) => e + t.charAt(0).toUpperCase() + t.substring(1), B_ = [
	"Webkit",
	"Ms",
	"Moz",
	"O"
];
R_ = Object.keys(R_).reduce((e, t) => (B_.forEach((n) => e[z_(n, t)] = e[t]), e), R_);
var V_ = /^(matrix|translate|scale|rotate|skew)/, H_ = /^(translate)/, U_ = /^(rotate|skew)/, W_ = (e, t) => Q.num(e) && e !== 0 ? e + t : e, G_ = (e, t) => Q.arr(e) ? e.every((e) => G_(e, t)) : Q.num(e) ? e === t : parseFloat(e) === t, K_ = class extends cg {
	constructor({ x: e, y: t, z: n, ...r }) {
		let i = [], a = [];
		(e || t || n) && (i.push([
			e || 0,
			t || 0,
			n || 0
		]), a.push((e) => [`translate3d(${e.map((e) => W_(e, "px")).join(",")})`, G_(e, 0)])), ym(r, (e, t) => {
			if (t === "transform") i.push([e || ""]), a.push((e) => [e, e === ""]);
			else if (V_.test(t)) {
				if (delete r[t], Q.und(e)) return;
				let n = H_.test(t) ? "px" : U_.test(t) ? "deg" : "";
				i.push(bm(e)), a.push(t === "rotate3d" ? ([e, t, r, i]) => [`rotate3d(${e},${t},${r},${W_(i, n)})`, G_(i, 0)] : (e) => [`${t}(${e.map((e) => W_(e, n)).join(",")})`, G_(e, +!!t.startsWith("scale"))]);
			}
		}), i.length && (r.transform = new q_(i, a)), super(r);
	}
}, q_ = class extends Th {
	constructor(e, t) {
		super(), this.inputs = e, this.transforms = t, this._value = null;
	}
	get() {
		return this._value ||= this._get();
	}
	_get() {
		let e = "", t = !0;
		return $(this.inputs, (n, r) => {
			let i = xh(n[0]), [a, o] = this.transforms[r](Q.arr(i) ? i : n.map(xh));
			e += " " + a, t &&= o;
		}), t ? "none" : e;
	}
	observerAdded(e) {
		e == 1 && $(this.inputs, (e) => $(e, (e) => bh(e) && Dh(e, this)));
	}
	observerRemoved(e) {
		e == 0 && $(this.inputs, (e) => $(e, (e) => bh(e) && Oh(e, this)));
	}
	eventObserved(e) {
		e.type == "change" && (this._value = null), wh(this, e);
	}
}, J_ = /* @__PURE__ */ "a.abbr.address.area.article.aside.audio.b.base.bdi.bdo.big.blockquote.body.br.button.canvas.caption.cite.code.col.colgroup.data.datalist.dd.del.details.dfn.dialog.div.dl.dt.em.embed.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.iframe.img.input.ins.kbd.keygen.label.legend.li.link.main.map.mark.menu.menuitem.meta.meter.nav.noscript.object.ol.optgroup.option.output.p.param.picture.pre.progress.q.rp.rt.ruby.s.samp.script.section.select.small.source.span.strong.style.sub.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.title.tr.track.u.ul.var.video.wbr.circle.clipPath.defs.ellipse.foreignObject.g.image.line.linearGradient.mask.path.pattern.polygon.polyline.radialGradient.rect.stop.svg.text.tspan".split(".");
hm.assign({
	batchedUpdates: _,
	createStringInterpolator: zh,
	colors: Vm
});
var Y_ = _g(J_, {
	applyAnimatedValues: L_,
	createAnimatedStyle: (e) => new K_(e),
	getComponentProps: ({ scrollTop: e, scrollLeft: t, ...n }) => n
}).animated, X_ = "Save changes", Z_ = "Cancel", Q_ = "Review", $_ = "OBJECT", ev = "Changed", tv = 440, nv = {
	tension: 320,
	friction: 34
}, rv = 250, iv = 200;
function av({ pendingCount: e, pendingItems: t, saving: r = !1, onSave: i, onCancel: a, saveLabel: o = X_, cancelLabel: s = Z_, viewUnsavedLabel: l = Q_, pendingKeyLabel: u = $_, pendingValueLabel: f = ev, dimmed: m = !1, disabled: h = !1, expandMaxHeight: _ = 440, expandSpringConfig: v = nv, barTransitionMs: y = 250, chevronTransitionMs: b = 200 }) {
	let [x, S] = p(!1), C = e > 0, w = d(() => Array.isArray(t) && t.length > 0, [t]), T = d(() => (t ?? []).some((e) => !!e.section), [t]), E = d(() => {
		let e = /* @__PURE__ */ new Map();
		return (t ?? []).forEach((t) => {
			let n = t.section?.trim() || "General", r = e.get(n) ?? [];
			r.push(t), e.set(n, r);
		}), Array.from(e.entries()).map(([e, t]) => ({
			section: e,
			items: t
		}));
	}, [t]), [D, O] = k_(() => ({
		maxHeight: 0,
		opacity: 0,
		config: v
	}));
	if (c(() => {
		C || S(!1);
	}, [C]), c(() => {
		let e = x && w;
		O.start({
			maxHeight: e ? _ : 0,
			opacity: +!!e,
			config: v
		});
	}, [
		x,
		w,
		O,
		_,
		v
	]), typeof document > "u") return null;
	let k = e === 1 ? "1 unsaved change" : `${e} unsaved changes`;
	return g(/* @__PURE__ */ (0, z.jsx)("div", {
		className: J("fixed bottom-3 left-3 right-3 z-[35] transform-gpu transition-all md:bottom-6 md:left-[calc(18rem+1.5rem)] md:right-6", C ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-6 opacity-0 pointer-events-none"),
		style: { transitionDuration: `${y}ms` },
		children: /* @__PURE__ */ (0, z.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, z.jsx)(Y_.div, {
				style: {
					maxHeight: D.maxHeight,
					opacity: D.opacity
				},
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, z.jsx)("div", {
					className: J("pointer-events-auto mx-auto w-[calc(100%-7rem)] overflow-auto rounded-t-[28px] border border-b-0 border-border/70 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.5)] backdrop-blur", m ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/95"),
					children: /* @__PURE__ */ (0, z.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, z.jsx)("thead", {
							className: "sticky top-0 bg-muted/70",
							children: /* @__PURE__ */ (0, z.jsxs)("tr", {
								className: "border-b border-border/70",
								children: [/* @__PURE__ */ (0, z.jsx)("th", {
									className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
									children: u
								}), /* @__PURE__ */ (0, z.jsx)("th", {
									className: "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
									children: f
								})]
							})
						}), /* @__PURE__ */ (0, z.jsx)("tbody", { children: E.map((e, t) => /* @__PURE__ */ (0, z.jsxs)(n, { children: [T ? /* @__PURE__ */ (0, z.jsx)("tr", {
							className: "border-b border-border/70 bg-muted/45",
							children: /* @__PURE__ */ (0, z.jsx)("td", {
								colSpan: 2,
								className: "px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
								children: e.section
							})
						}) : null, e.items.map((t, n) => /* @__PURE__ */ (0, z.jsxs)("tr", {
							className: "border-b border-border/60 last:border-b-0",
							children: [/* @__PURE__ */ (0, z.jsx)("td", {
								className: "px-4 py-2.5 align-top font-medium text-foreground",
								children: t.key
							}), /* @__PURE__ */ (0, z.jsx)("td", {
								className: "px-4 py-2.5 align-top text-muted-foreground",
								children: t.value
							})]
						}, `${e.section}-${t.key}-${t.value}-${n}`))] }, `${e.section}-${t}`)) })]
					})
				})
			}), /* @__PURE__ */ (0, z.jsxs)("div", {
				className: J("pointer-events-auto relative flex min-h-[3.75rem] items-center justify-between gap-3 rounded-[999px] border border-border/70 px-4 py-2 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.4)] backdrop-blur-md", m ? "bg-muted/80 opacity-80 shadow-none" : "bg-card/96"),
				children: [/* @__PURE__ */ (0, z.jsxs)("div", {
					className: "flex min-w-0 shrink items-center gap-2.5 text-sm",
					children: [/* @__PURE__ */ (0, z.jsxs)("span", {
						className: "relative flex size-2.5 shrink-0",
						children: [/* @__PURE__ */ (0, z.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" }), /* @__PURE__ */ (0, z.jsx)("span", { className: "relative inline-flex size-2.5 rounded-full bg-amber-400" })]
					}), /* @__PURE__ */ (0, z.jsx)("span", {
						className: "truncate font-medium text-foreground",
						children: k
					})]
				}), /* @__PURE__ */ (0, z.jsxs)("div", {
					className: "flex shrink-0 flex-wrap items-center justify-end gap-1.5",
					children: [
						w ? /* @__PURE__ */ (0, z.jsxs)(Y, {
							type: "button",
							variant: "outline",
							size: "sm",
							disabled: r || h,
							onClick: () => S((e) => !e),
							children: [
								/* @__PURE__ */ (0, z.jsx)(Ld, { className: "size-4" }),
								l,
								/* @__PURE__ */ (0, z.jsx)(Nd, {
									className: J("size-4 transition-transform", x ? "rotate-0" : "rotate-180"),
									style: { transitionDuration: `${b}ms` }
								})
							]
						}) : null,
						a ? /* @__PURE__ */ (0, z.jsxs)(Y, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: a,
							disabled: r || h,
							children: [/* @__PURE__ */ (0, z.jsx)(qd, { className: "size-4" }), s]
						}) : null,
						/* @__PURE__ */ (0, z.jsxs)(Y, {
							type: "button",
							size: "sm",
							onClick: i,
							disabled: r || h,
							children: [r ? /* @__PURE__ */ (0, z.jsx)(Bd, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, z.jsx)(Wd, { className: "size-4" }), r ? "Saving…" : o]
						})
					]
				})]
			})]
		})
	}), document.body);
}
//#endregion
//#region src/components/SimpleDataTable.tsx
function ov({ columns: e, rows: t, rowKey: n, loading: r = !1, loadingMessage: i = "Loading...", emptyMessage: a = "No records found.", page: o, pageSize: s, pageSizeOptions: u = [
	10,
	25,
	50
], onPageChange: d, onPageSizeChange: m, onRowClick: h, paginationMode: g = "client", totalRowCount: _, sortBy: v = null, sortOrder: y = "asc", onSortChange: b, alignPaginationToLeft: x = !1, onLoadingChange: S }) {
	let C = l(), w = f(null), T = f(null), [E, D] = p(null), O = g === "server", k = O ? _ ?? t.length : t.length, A = Math.max(1, Math.ceil(k / s)), j = Math.min(o, A - 1), M = j * s, N = O ? t : t.slice(M, M + s), P = k === 0 || N.length === 0 ? 0 : Math.min(M + N.length, k), F = j > 0, I = P < k, ee = P === 0 ? "No results" : O && I ? `Showing ${M + 1}-${P}` : `Showing ${M + 1}-${P} of ${k}`, te = O && I ? `Page ${j + 1}` : `Page ${j + 1} of ${A}`, L = Math.max(3, Math.min(s || 5, 8));
	c(() => {
		if (S) return S(C, r, i), () => {
			S(C, !1);
		};
	}, [
		r,
		i,
		C,
		S
	]);
	let ne = (e) => {
		b && b(e, v === e && y === "asc" ? "desc" : "asc");
	};
	return c(() => {
		let e = () => {
			if (!w.current) return;
			let e = w.current.closest("[data-detail-tab-content], [data-table-viewport]");
			if (!e) {
				D(null);
				return;
			}
			let t = e;
			if (!t) return;
			let n = w.current.getBoundingClientRect(), r = t.getBoundingClientRect(), i = Math.max(0, n.top - r.top), a = t.clientHeight, o = T.current?.offsetHeight ?? 80;
			if (a <= 0) {
				D(null);
				return;
			}
			let s = a - i - 16;
			if (s < 180) {
				let e = Math.max(40, s - o - 8);
				D(Math.max(0, e));
				return;
			}
			D(Math.max(100, Math.floor(s - o - 8)));
		};
		e();
		let t = window.requestAnimationFrame(e);
		window.addEventListener("resize", e);
		let n = new ResizeObserver(e);
		w.current?.parentElement && n.observe(w.current.parentElement);
		let r = w.current?.closest("[data-detail-tab-content], [data-table-viewport]");
		return r && n.observe(r), n.observe(document.documentElement), () => {
			window.cancelAnimationFrame(t), window.removeEventListener("resize", e), n.disconnect();
		};
	}, []), /* @__PURE__ */ (0, z.jsxs)("div", {
		ref: w,
		className: "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
		children: [
			/* @__PURE__ */ (0, z.jsx)("div", {
				className: "min-h-0 overflow-auto",
				style: E ? { maxHeight: `${E}px` } : void 0,
				children: /* @__PURE__ */ (0, z.jsxs)(Pp, {
					containerClassName: "overflow-x-visible",
					children: [/* @__PURE__ */ (0, z.jsx)(Fp, { children: /* @__PURE__ */ (0, z.jsx)(Rp, {
						className: "hover:bg-transparent",
						children: e.map((e) => /* @__PURE__ */ (0, z.jsx)(zp, {
							className: J("sticky top-0 z-[1] bg-muted/40 text-center", e.className),
							children: e.sortable && b ? /* @__PURE__ */ (0, z.jsxs)("button", {
								type: "button",
								onClick: () => ne(e.id),
								className: "inline-flex w-full cursor-pointer items-center justify-center gap-1 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
								children: [/* @__PURE__ */ (0, z.jsx)("span", { children: e.header }), v === e.id ? y === "asc" ? /* @__PURE__ */ (0, z.jsx)(Nd, { className: "size-3.5" }) : /* @__PURE__ */ (0, z.jsx)(Ad, { className: "size-3.5" }) : /* @__PURE__ */ (0, z.jsx)(Nd, { className: "size-3.5 opacity-30" })]
							}) : e.header
						}, e.id))
					}) }), /* @__PURE__ */ (0, z.jsx)(Ip, { children: r ? Array.from({ length: L }).map((t, n) => /* @__PURE__ */ (0, z.jsx)(Rp, {
						className: "hover:bg-transparent",
						children: e.map((e) => /* @__PURE__ */ (0, z.jsx)(Bp, {
							className: e.cellClassName,
							children: /* @__PURE__ */ (0, z.jsx)("div", { className: "h-4 w-full animate-pulse rounded bg-muted/60" })
						}, `${e.id}-skeleton-${n}`))
					}, `loading-skeleton-${n}`)) : N.length === 0 ? /* @__PURE__ */ (0, z.jsx)(Rp, {
						className: "hover:bg-transparent",
						children: /* @__PURE__ */ (0, z.jsx)(Bp, {
							colSpan: e.length,
							className: "py-10 text-center text-sm text-muted-foreground",
							children: a
						})
					}) : N.map((t) => /* @__PURE__ */ (0, z.jsx)(Rp, {
						className: J("odd:bg-transparent even:bg-muted/20", h && "cursor-pointer"),
						onClick: h ? () => h(t) : void 0,
						children: e.map((e) => /* @__PURE__ */ (0, z.jsx)(Bp, {
							className: e.cellClassName,
							children: e.render(t)
						}, e.id))
					}, n(t))) })]
				})
			}),
			r && /* @__PURE__ */ (0, z.jsx)("div", {
				className: "sr-only",
				"aria-live": "polite",
				children: i
			}),
			/* @__PURE__ */ (0, z.jsxs)("div", {
				ref: T,
				className: J("flex-shrink-0 flex flex-col gap-3 border-t border-border/70 bg-muted/40 px-4 py-3 sm:flex-row sm:items-center", x ? "sm:justify-start" : "sm:justify-between"),
				children: [/* @__PURE__ */ (0, z.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: ee
				}), /* @__PURE__ */ (0, z.jsxs)("div", {
					className: J("flex flex-col gap-3 sm:flex-row sm:items-center", x ? "sm:ml-4" : ""),
					children: [/* @__PURE__ */ (0, z.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "Rows" }), /* @__PURE__ */ (0, z.jsx)(Mp, {
							value: s,
							onValueChange: (e) => m(Number(e)),
							options: u.map((e) => ({
								value: String(e),
								label: String(e)
							})),
							className: "h-9",
							searchPlaceholder: "Search rows..."
						})]
					}), /* @__PURE__ */ (0, z.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, z.jsxs)(Y, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => d(j - 1),
								disabled: !F,
								children: [/* @__PURE__ */ (0, z.jsx)(jd, { className: "size-4" }), "Previous"]
							}),
							/* @__PURE__ */ (0, z.jsx)("span", {
								className: "min-w-20 text-center text-sm text-muted-foreground",
								children: te
							}),
							/* @__PURE__ */ (0, z.jsxs)(Y, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => d(j + 1),
								disabled: !I,
								children: ["Next", /* @__PURE__ */ (0, z.jsx)(Md, { className: "size-4" })]
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/utils/detailViewMode.ts
var sv = "2", cv = "returnUrl", lv = "ui.detailViewMode", uv = `${lv}:latest`, dv = "detail-view-mode-change", fv = {
	floating: !1,
	collapsed: "0"
}, pv = /* @__PURE__ */ new Map();
function mv() {
	let [e, t] = p(() => typeof window > "u" ? "/" : window.location.pathname);
	return c(() => {
		let e = () => t(window.location.pathname);
		return window.addEventListener("popstate", e), () => window.removeEventListener("popstate", e);
	}, []), e;
}
function hv(e) {
	return e ? e.length > 1 && e.endsWith("/") ? e.slice(0, -1) : e : "/";
}
function gv(e) {
	return e === "1" || e === "2" ? e : "0";
}
function _v(e) {
	let t = e.floating === !0;
	return {
		floating: t,
		collapsed: t ? gv(e.collapsed) : "0"
	};
}
function vv(e, t) {
	return e?.floating === t.floating && e.collapsed === t.collapsed;
}
function yv(e) {
	let t = hv(e), n = t.split("/").filter(Boolean);
	if (n[0] !== "management") return t;
	if (n[1] === "classes" && n[2]) {
		let e = n[3], t = n[4];
		return t && (e === "schedules" || e === "sessions" || e === "tests" || e === "feedbacks") ? `/management/classes/${n[2]}/${e}/${t}` : `/management/classes/${n[2]}`;
	}
	return (n[1] === "schedules" || n[1] === "sessions" || n[1] === "tests" || n[1] === "feedbacks") && n[2] ? `/management/${n[1]}/${n[2]}` : t;
}
function bv(e) {
	return pv.get(e) ?? null;
}
function xv() {
	typeof window > "u" || window.dispatchEvent(new Event(dv));
}
function Sv(e) {
	let t = e.trim();
	if (!t) return null;
	let n = typeof window > "u" ? "http://localhost" : window.location.origin;
	try {
		return new URL(t, n);
	} catch {
		return null;
	}
}
function Cv(e, t) {
	let n = Sv(e);
	if (!n) return e;
	let r = n.searchParams.get(cv)?.trim();
	return r && t > 0 && n.searchParams.set(cv, Cv(r, t - 1)), `${n.pathname}${n.search}${n.hash}`;
}
function wv(e) {
	return Cv(e, 3);
}
function Tv(e) {
	return bv(`${lv}:${yv(e)}`) ?? bv(uv);
}
function Ev(e, t) {
	let n = _v(t), r = `${lv}:${yv(e)}`, i = !vv(bv(r), n), a = !vv(bv(uv), n);
	return pv.set(r, n), pv.set(uv, n), (i || a) && xv(), n;
}
function Dv(e) {
	return Tv(e) ?? fv;
}
function Ov(e) {
	return wv(e);
}
function kv(e) {
	let t = Sv(Ov(e));
	return t ? {
		pathname: t.pathname,
		search: t.search,
		hash: t.hash
	} : null;
}
function Av(e = {}) {
	let t = mv(), n = e.enabled ?? !0, r = e.pathname ?? t, [i, a] = p(0);
	return c(() => {
		if (!n || typeof window > "u") return;
		let e = () => {
			a((e) => e + 1);
		};
		return window.addEventListener(dv, e), () => {
			window.removeEventListener(dv, e);
		};
	}, [n]), d(() => n ? Dv(r) : fv, [
		n,
		r,
		i
	]);
}
function jv(e = {}) {
	let t = mv(), n = e.enabled ?? !0, r = e.pathname ?? t, i = Av({
		enabled: n,
		pathname: r
	}), [a, s] = p(i);
	c(() => {
		s((e) => vv(e, i) ? e : i);
	}, [i]), c(() => {
		n && (vv(Tv(r), a) || Ev(r, a));
	}, [
		n,
		r,
		a
	]);
	let l = o((e) => {
		n && s(Ev(r, e));
	}, [n, r]);
	return {
		...a,
		isCollapsed: a.collapsed !== "0",
		hiddenCollapsed: a.collapsed === "2",
		setMode: l
	};
}
//#endregion
//#region src/components/layout/DetailLayout.tsx
var Mv = {
	tabPillSpring: {
		tension: 300,
		friction: 26
	},
	tabContentFadeOutMs: 100,
	tabContentFadeInMs: 200
}, Nv = {
	tabPillSpring: { ...Mv.tabPillSpring },
	tabContentFadeOutMs: Mv.tabContentFadeOutMs,
	tabContentFadeInMs: Mv.tabContentFadeInMs
}, Pv = 0;
function Fv() {
	return typeof window > "u" ? !1 : window.__DETAIL_TABS_DEBUG__ ? !0 : new URLSearchParams(window.location.search).get("detailTabsDebug") === "1";
}
function Iv(e, t, n) {
	Fv() && console.debug(`[DetailTabs:${e}] ${t}`, {
		path: typeof window > "u" ? void 0 : `${window.location.pathname}${window.location.search}`,
		...n
	});
}
function Lv() {
	return {
		tabPillSpring: { ...Nv.tabPillSpring },
		tabContentFadeOutMs: Nv.tabContentFadeOutMs,
		tabContentFadeInMs: Nv.tabContentFadeInMs
	};
}
var Rv = r(null), zv = r(!1);
function Bv({ children: e, className: t = "w-full max-w-[1700px] space-y-4", isBackground: n, onCloseFloating: r }) {
	let i = s(zv), a = n ?? i, o = jv({ enabled: !a }), l = a ? !1 : o.floating, u = a ? !1 : o.isCollapsed, d = a ? !1 : o.hiddenCollapsed, f = (e, t, n = !1) => {
		if (a) return;
		let r = t ? n ? "2" : "1" : "0";
		o.setMode({
			floating: e,
			collapsed: r
		});
	};
	return c(() => {
		if (typeof document > "u" || !l) return;
		let e = document.body.style.overflow;
		return document.body.style.overflow = "hidden", () => {
			document.body.style.overflow = e;
		};
	}, [l]), /* @__PURE__ */ (0, z.jsx)(Rv.Provider, {
		value: {
			floating: l,
			collapsed: u,
			hiddenCollapsed: d,
			isBackground: a,
			expandToNormalView: () => {
				f(!1, !1, !1);
			},
			switchToFloatingView: () => {
				f(!0, !1, !1);
			}
		},
		children: /* @__PURE__ */ (0, z.jsxs)("section", {
			className: J(l ? "fixed inset-0 z-50" : "w-full", l && d ? "pointer-events-none" : "", l && u && !d ? "pointer-events-none" : ""),
			children: [
				l && !u ? /* @__PURE__ */ (0, z.jsx)("button", {
					type: "button",
					"aria-label": "Close details",
					onClick: () => {
						a || !r || r();
					},
					className: "absolute inset-0 bg-background/45 backdrop-blur-md"
				}) : null,
				l && d ? /* @__PURE__ */ (0, z.jsx)(Y, {
					type: "button",
					size: "sm",
					variant: "outline",
					"aria-label": "Restore details panel",
					onClick: () => f(!0, !0, !1),
					className: "pointer-events-auto absolute right-0 top-1/2 z-20 h-28 w-7 -translate-y-1/2 rounded-l-md rounded-r-none border-r-0 bg-background text-[10px] font-semibold uppercase tracking-[0.14em] shadow-md [writing-mode:vertical-rl]",
					children: "Details"
				}) : null,
				/* @__PURE__ */ (0, z.jsxs)("div", {
					"data-floating-collapsed": l && u ? "true" : "false",
					className: J(t, l ? u ? d ? "floating-detail pointer-events-none absolute right-0 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 translate-x-[calc(100%-20px)] !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail pointer-events-auto absolute right-3 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : "floating-detail absolute left-1/2 top-1/2 z-10 w-[85dvw] -translate-x-1/2 -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl" : ""),
					children: [
						l && u ? d ? null : /* @__PURE__ */ (0, z.jsxs)(z.Fragment, { children: [/* @__PURE__ */ (0, z.jsx)(Y, {
							type: "button",
							size: "icon",
							variant: "outline",
							"aria-label": "Expand details panel",
							onClick: () => f(!0, !1),
							className: "absolute -left-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md",
							children: /* @__PURE__ */ (0, z.jsx)(Md, { className: "h-4 w-4 rotate-180" })
						}), /* @__PURE__ */ (0, z.jsx)(Y, {
							type: "button",
							size: "icon",
							variant: "outline",
							"aria-label": "Fully collapse details",
							onClick: () => f(!0, !0, !0),
							className: "absolute -left-4 top-[calc(50%+2.5rem)] z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md",
							children: /* @__PURE__ */ (0, z.jsx)(Md, { className: "h-4 w-4" })
						})] }) : null,
						l && !u ? /* @__PURE__ */ (0, z.jsx)(Y, {
							type: "button",
							size: "icon",
							variant: "outline",
							"aria-label": "Collapse details",
							onClick: () => f(!0, !0, !1),
							className: "absolute -right-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md",
							children: /* @__PURE__ */ (0, z.jsx)(Md, { className: "h-4 w-4" })
						}) : null,
						e
					]
				})
			]
		})
	});
}
function Vv({ items: e, current: t }) {
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2 text-base",
		children: [e.map((e, t) => /* @__PURE__ */ (0, z.jsxs)("div", {
			className: "contents",
			children: [e.onClick ? /* @__PURE__ */ (0, z.jsx)(Y, {
				type: "button",
				variant: "link",
				size: "sm",
				className: "h-auto px-0 text-base no-underline hover:no-underline",
				onClick: e.onClick,
				children: e.label
			}) : /* @__PURE__ */ (0, z.jsx)("span", {
				className: "text-base",
				children: e.label
			}), /* @__PURE__ */ (0, z.jsx)("span", {
				className: "text-muted-foreground",
				children: ">"
			})]
		}, `${e.label}-${t}`)), /* @__PURE__ */ (0, z.jsx)("h2", {
			className: "min-w-0 break-words text-xl font-semibold tracking-tight",
			children: t
		})]
	});
}
function Hv({ breadcrumbs: e, actions: t, className: n }) {
	let r = s(Rv), i = r?.floating && !r.collapsed, a = r && !r.floating;
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		"data-detail-header": !0,
		className: J("flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between", n),
		children: [/* @__PURE__ */ (0, z.jsx)("div", {
			className: "min-w-0 flex-1",
			children: e
		}), t ? /* @__PURE__ */ (0, z.jsxs)("div", {
			className: "flex shrink-0 items-center gap-2 self-start",
			children: [
				i ? /* @__PURE__ */ (0, z.jsxs)(Y, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: () => r.expandToNormalView(),
					children: [/* @__PURE__ */ (0, z.jsx)(Rd, { className: "mr-2 h-4 w-4" }), "Expand View"]
				}) : null,
				a ? /* @__PURE__ */ (0, z.jsxs)(Y, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: () => r.switchToFloatingView(),
					children: [/* @__PURE__ */ (0, z.jsx)(Ud, { className: "mr-2 h-4 w-4" }), "Floating View"]
				}) : null,
				t
			]
		}) : i || a ? /* @__PURE__ */ (0, z.jsxs)("div", {
			className: "flex shrink-0 items-center gap-2 self-start",
			children: [i ? /* @__PURE__ */ (0, z.jsxs)(Y, {
				type: "button",
				size: "sm",
				variant: "outline",
				onClick: () => r.expandToNormalView(),
				children: [/* @__PURE__ */ (0, z.jsx)(Rd, { className: "mr-2 h-4 w-4" }), "Expand View"]
			}) : null, a ? /* @__PURE__ */ (0, z.jsxs)(Y, {
				type: "button",
				size: "sm",
				variant: "outline",
				onClick: () => r.switchToFloatingView(),
				children: [/* @__PURE__ */ (0, z.jsx)(Ud, { className: "mr-2 h-4 w-4" }), "Floating View"]
			}) : null]
		}) : null]
	});
}
function Uv({ children: e, className: t = "grid gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)] md:grid-cols-4" }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		className: t,
		children: e
	});
}
function Wv({ label: e, value: t }) {
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, z.jsx)("div", {
			className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
			children: e
		}), /* @__PURE__ */ (0, z.jsx)("div", {
			className: "text-sm font-medium",
			children: t
		})]
	});
}
function Gv({ children: e, className: t = "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]" }) {
	return /* @__PURE__ */ (0, z.jsx)("section", {
		className: t,
		children: e
	});
}
function Kv({ label: e, value: t }) {
	return /* @__PURE__ */ (0, z.jsxs)(Gv, { children: [/* @__PURE__ */ (0, z.jsx)("div", {
		className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
		children: e
	}), /* @__PURE__ */ (0, z.jsx)("p", {
		className: "mt-2 whitespace-pre-wrap break-words text-sm leading-6",
		children: t?.trim() || "-"
	})] });
}
function qv({ rows: e, className: t, tableClassName: n, labelColumnClassName: r }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		className: J("overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]", t),
		children: /* @__PURE__ */ (0, z.jsx)(Pp, {
			className: J("min-w-[40rem] table-fixed", n),
			children: /* @__PURE__ */ (0, z.jsx)(Ip, { children: e.map((e, t) => /* @__PURE__ */ (0, z.jsxs)(Rp, {
				className: J("hover:bg-transparent", e.rowClassName),
				children: [/* @__PURE__ */ (0, z.jsx)(Bp, {
					className: J("border-r border-border/60 px-4 py-3 align-middle text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground", r ?? "w-[220px]", e.labelClassName),
					children: e.label
				}), /* @__PURE__ */ (0, z.jsx)(Bp, {
					className: J("px-4 py-3 align-middle text-sm", e.valueClassName),
					children: e.value
				})]
			}, e.key ?? `detail-row-${t}`)) })
		})
	});
}
function Jv({ className: e, classKey: t, onOpenClass: n, buttonLabel: r = "Open class" }) {
	let i = t?.trim() || "";
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		className: "flex min-w-0 flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ (0, z.jsx)("span", {
			className: "break-words",
			children: e?.trim() || "-"
		}), /* @__PURE__ */ (0, z.jsx)(Y, {
			type: "button",
			size: "sm",
			variant: "outline",
			onClick: n,
			disabled: !i,
			children: r
		})]
	});
}
function Yv({ label: e = "Class", classKey: t, onOpenClass: n }) {
	let r = t?.trim() || "";
	return /* @__PURE__ */ (0, z.jsxs)("span", {
		className: "inline-flex items-center gap-1",
		children: [/* @__PURE__ */ (0, z.jsx)("span", { children: e }), /* @__PURE__ */ (0, z.jsx)(Y, {
			type: "button",
			size: "icon",
			variant: "ghost",
			className: "h-5 w-5 p-0 text-muted-foreground hover:text-foreground",
			onClick: n,
			disabled: !r,
			children: /* @__PURE__ */ (0, z.jsx)(Md, { className: "h-3.5 w-3.5" })
		})]
	});
}
function Xv({ title: e, children: t }) {
	return /* @__PURE__ */ (0, z.jsxs)("aside", {
		className: "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
		children: [/* @__PURE__ */ (0, z.jsx)("div", {
			className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
			children: e
		}), /* @__PURE__ */ (0, z.jsx)("div", {
			className: "mt-3 flex flex-col gap-2",
			children: t
		})]
	});
}
function Zv({ tabs: e, activeTab: t, onChange: n }) {
	let r = f(/* @__PURE__ */ new Map()), i = f(null), a = f(++Pv), s = f(!1), l = e.find((e) => e.value === t)?.value ?? e[0]?.value, [d, p] = k_(() => ({
		left: 0,
		width: 0
	})), m = o((n) => {
		if (!l) return Iv(a.current, "updatePill:no-active-tab", {
			activeTab: t,
			resolvedActiveTab: l,
			animate: n,
			tabs: e.map((e) => e.value)
		}), !1;
		let o = r.current.get(l);
		if (!o) return Iv(a.current, "updatePill:no-button", {
			activeTab: t,
			resolvedActiveTab: l,
			animate: n,
			availableButtons: Array.from(r.current.keys())
		}), !1;
		let s = o.offsetWidth;
		if (s <= 0) return Iv(a.current, "updatePill:zero-width", {
			activeTab: t,
			resolvedActiveTab: l,
			animate: n,
			offsetLeft: o.offsetLeft,
			offsetWidth: s,
			rect: o.getBoundingClientRect().toJSON()
		}), !1;
		let c = Lv();
		return Iv(a.current, "updatePill:start", {
			activeTab: t,
			resolvedActiveTab: l,
			animate: n,
			offsetLeft: o.offsetLeft,
			offsetWidth: s,
			buttonRect: o.getBoundingClientRect().toJSON(),
			tabListRect: i.current?.getBoundingClientRect().toJSON()
		}), p.start({
			left: o.offsetLeft,
			width: s,
			immediate: !n,
			config: {
				tension: c.tabPillSpring.tension,
				friction: c.tabPillSpring.friction,
				clamp: !0
			}
		}), !0;
	}, [
		t,
		p,
		l,
		e
	]);
	return u(() => {
		let e = 0, t = 0, n = () => {
			let r = m(s.current);
			Iv(a.current, "layout-effect:measure", {
				attempts: t,
				measured: r,
				initialized: s.current
			}), !r && t < 8 && (t += 1, e = requestAnimationFrame(n));
		};
		return n(), s.current = !0, () => {
			e && cancelAnimationFrame(e);
		};
	}, [m]), c(() => {
		Iv(a.current, "render-state", {
			activeTab: t,
			resolvedActiveTab: l,
			tabs: e.map((e) => e.value)
		});
	}, [
		t,
		l,
		e
	]), c(() => {
		let e = () => {
			Iv(a.current, "window:resize"), m(!0);
		};
		return window.addEventListener("resize", e), () => {
			window.removeEventListener("resize", e);
		};
	}, [m]), c(() => {
		if (typeof ResizeObserver > "u") return;
		let e = i.current, t = l ? r.current.get(l) : null;
		if (!e && !t) return;
		let n = new ResizeObserver(() => {
			Iv(a.current, "resize-observer"), m(!0);
		});
		return e && n.observe(e), t && n.observe(t), () => {
			n.disconnect();
		};
	}, [l, m]), c(() => {
		if (typeof document > "u" || !("fonts" in document)) return;
		let e = !1;
		return document.fonts.ready.then(() => {
			e || (Iv(a.current, "fonts:ready", { status: document.fonts.status }), m(!0));
		}), () => {
			e = !0;
		};
	}, [m]), /* @__PURE__ */ (0, z.jsx)("div", {
		className: "overflow-x-auto rounded-2xl border border-border/70 bg-card/70 p-1 drop-shadow-md",
		children: /* @__PURE__ */ (0, z.jsxs)("div", {
			ref: i,
			className: "relative flex min-w-max gap-2",
			children: [/* @__PURE__ */ (0, z.jsx)(Y_.div, {
				"aria-hidden": "true",
				className: "pointer-events-none absolute left-0 top-0 h-full rounded-xl bg-primary shadow-sm",
				style: {
					left: d.left,
					width: d.width,
					opacity: d.width.to((e) => +(e > 0))
				}
			}), e.map((e) => /* @__PURE__ */ (0, z.jsx)("button", {
				ref: (n) => {
					n ? r.current.set(e.value, n) : r.current.delete(e.value), Iv(a.current, "button:ref", {
						tabValue: e.value,
						mounted: !!n,
						activeTab: t,
						resolvedActiveTab: l,
						offsetLeft: n?.offsetLeft,
						offsetWidth: n?.offsetWidth
					}), n && e.value === t && m(s.current);
				},
				type: "button",
				onClick: () => {
					Iv(a.current, "button:click", {
						tabValue: e.value,
						activeTab: t,
						resolvedActiveTab: l
					}), e.value !== l && n(e.value);
				},
				className: J("relative z-10 shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-150", l === e.value ? "text-primary-foreground" : e.hasPendingChanges ? "font-bold text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-accent-foreground"),
				children: e.label
			}, e.value))]
		})
	});
}
function Qv({ tabs: e, activeTab: t, onChange: n, children: r, className: i, contentClassName: a }) {
	return /* @__PURE__ */ (0, z.jsxs)("section", {
		className: J("flex min-h-0 flex-col", i),
		children: [/* @__PURE__ */ (0, z.jsx)("div", {
			"data-detail-tabs-wrap": !0,
			className: "shrink-0 overflow-visible pb-2",
			children: /* @__PURE__ */ (0, z.jsx)(Zv, {
				tabs: e,
				activeTab: t,
				onChange: n
			})
		}), /* @__PURE__ */ (0, z.jsx)("div", {
			"data-detail-tab-content": !0,
			className: J("mt-4 flex min-h-0 flex-1 flex-col", a),
			children: r
		})]
	});
}
//#endregion
//#region src/components/cells/ProgressMetricCell.tsx
function $v(e) {
	return !Number.isFinite(e) || e < 0 ? 0 : e;
}
function ey({ primaryLabel: e, secondaryLabel: t, percent: n }) {
	let r = $v(n);
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		className: "flex min-w-[220px] flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, z.jsxs)("div", {
			className: "flex items-center justify-between gap-3 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, z.jsx)("span", {
				className: "truncate",
				children: e
			}), t ? /* @__PURE__ */ (0, z.jsx)("span", {
				className: "shrink-0 tabular-nums",
				children: t
			}) : null]
		}), /* @__PURE__ */ (0, z.jsx)("div", {
			className: "h-2 overflow-hidden rounded-full bg-muted/70",
			children: /* @__PURE__ */ (0, z.jsx)("div", {
				className: `h-full rounded-full transition-[width] ${r > 100 ? "bg-destructive" : "bg-primary"}`,
				style: { width: `${Math.min(100, r)}%` }
			})
		})]
	});
}
//#endregion
//#region src/utils/urlQueryState.ts
function ty(e, t, n = "") {
	return e.get(t) ?? n;
}
function ny(e, t, n, r = 0) {
	let i = e.get(t);
	if (!i) return n;
	let a = Number.parseInt(i, 10);
	return Number.isNaN(a) || a < r ? n : a;
}
function ry(e, t, n) {
	let r = e.get(t);
	return r === "1" ? !0 : r === "0" ? !1 : n;
}
function iy(e, t) {
	let n = new URLSearchParams(e);
	return Object.entries(t).forEach(([e, t]) => {
		if (t == null || t === "" || t === !1) {
			n.delete(e);
			return;
		}
		if (t === !0) {
			n.set(e, "1");
			return;
		}
		n.set(e, String(t));
	}), n;
}
//#endregion
//#region src/utils/userScopes.ts
function ay(e) {
	return Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.trim().length > 0) : typeof e == "string" ? e.split(/\s+/).map((e) => e.trim()).filter(Boolean) : [];
}
function oy(e) {
	return !!e && typeof e == "object";
}
function sy(e) {
	if (oy(e)) {
		let t = ay(e.roles);
		return t.length > 0 ? t : ay(e.scope);
	}
	return ay(e);
}
function cy(e, t) {
	return sy(e).includes(t);
}
function ly(e, t) {
	let n = sy(e);
	return t.some((e) => n.includes(e));
}
function uy(e) {
	return !oy(e) || e.account_type !== "employee" ? !1 : ly(e, [
		"classes_get",
		"sessions_get",
		"schedules_get",
		"tests_get",
		"classes_feedbacks_get"
	]);
}
//#endregion
//#region src/utils/permissions.ts
function dy(e) {
	if (!(e instanceof Error)) return !1;
	let t = e.message.toLowerCase();
	return t.includes("403") || t.includes("forbidden") || t.includes("insufficient permission") || t.includes("insufficient permissions");
}
//#endregion
//#region src/utils/conflictErrors.ts
var fy = "edited_at is older than the current value. refresh data and retry with a newer edited_at";
function py(e) {
	return e instanceof Error ? e.message.toLowerCase().includes(fy) : !1;
}
//#endregion
//#region src/components/ui/sheet.tsx
function my({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(ur, {
		"data-slot": "sheet",
		...e
	});
}
function hy({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(dr, {
		"data-slot": "sheet-trigger",
		...e
	});
}
function gy({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(_r, {
		"data-slot": "sheet-close",
		...e
	});
}
function _y({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(fr, {
		"data-slot": "sheet-portal",
		...e
	});
}
function vy({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(pr, {
		"data-slot": "sheet-overlay",
		className: J("fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", e),
		...t
	});
}
function yy({ className: e, children: t, side: n = "right", showCloseButton: r = !0, ...i }) {
	return /* @__PURE__ */ (0, z.jsxs)(_y, { children: [/* @__PURE__ */ (0, z.jsx)(vy, {}), /* @__PURE__ */ (0, z.jsxs)(mr, {
		"data-slot": "sheet-content",
		className: J("fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500", n === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm", n === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm", n === "top" && "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top", n === "bottom" && "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", e),
		...i,
		children: [t, r && /* @__PURE__ */ (0, z.jsxs)(_r, {
			className: "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary",
			children: [/* @__PURE__ */ (0, z.jsx)(qd, { className: "size-4" }), /* @__PURE__ */ (0, z.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function by({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "sheet-header",
		className: J("flex flex-col gap-1.5 p-4", e),
		...t
	});
}
function xy({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "sheet-footer",
		className: J("mt-auto flex flex-col gap-2 p-4", e),
		...t
	});
}
function Sy({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(hr, {
		"data-slot": "sheet-title",
		className: J("font-semibold text-foreground", e),
		...t
	});
}
function Cy({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(gr, {
		"data-slot": "sheet-description",
		className: J("text-sm text-muted-foreground", e),
		...t
	});
}
//#endregion
export { A as API_CONFIG, Nf as AppTheme, xp as AuthProvider, zv as BackgroundDetailViewContext, Y as Button, ud as Card, md as CardAction, hd as CardContent, pd as CardDescription, gd as CardFooter, dd as CardHeader, fd as CardTitle, Ap as ColorModeIconDropdown, Yf as ColorModeSelect, sv as DETAIL_HIDDEN_COLLAPSED_VALUE, Xv as DetailActionPanel, Vv as DetailBreadcrumbs, Gv as DetailCard, Yv as DetailClassHeaderLabel, Jv as DetailClassLinkValue, qv as DetailFieldsTable, Hv as DetailHeader, Uv as DetailSummaryGrid, Wv as DetailSummaryItem, Qv as DetailTabbedSection, Zv as DetailTabs, Kv as DetailTextBlock, Bv as DetailView, Jd as Dialog, Zd as DialogClose, $d as DialogContent, rf as DialogDescription, tf as DialogFooter, ef as DialogHeader, Qd as DialogOverlay, Xd as DialogPortal, nf as DialogTitle, Yd as DialogTrigger, Pf as DropdownMenu, Bf as DropdownMenuCheckboxItem, Lf as DropdownMenuContent, Rf as DropdownMenuGroup, zf as DropdownMenuItem, Uf as DropdownMenuLabel, Ff as DropdownMenuPortal, Vf as DropdownMenuRadioGroup, Hf as DropdownMenuRadioItem, Wf as DropdownMenuSeparator, Gf as DropdownMenuShortcut, Kf as DropdownMenuSub, Jf as DropdownMenuSubContent, qf as DropdownMenuSubTrigger, If as DropdownMenuTrigger, Ef as ForgotPassword, Up as FormTableDialog, Hp as FormTableRow, _d as Input, vd as Label, jp as LazyViewFallback, rv as PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS, Z_ as PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL, iv as PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS, tv as PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT, $_ as PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL, ev as PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL, X_ as PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL, nv as PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG, Q_ as PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL, Jp as PatchRecordDialog, av as PendingChangesBar, Op as PendingChangesProvider, ey as ProgressMetricCell, wp as ResetPassword, Mp as SearchableSelect, yd as Separator, my as Sheet, gy as SheetClose, yy as SheetContent, Cy as SheetDescription, xy as SheetFooter, by as SheetHeader, Sy as SheetTitle, hy as SheetTrigger, Cp as SignIn, ov as SimpleDataTable, Zf as SitemarkIcon, Tf as StatusBanner, Pp as Table, Ip as TableBody, Vp as TableCaption, Bp as TableCell, Lp as TableFooter, zp as TableHead, Fp as TableHeader, Rp as TableRow, Np as Textarea, ld as buttonVariants, uy as canAccessManagement, k as configureApi, ap as formatDate, op as formatUserTimestamp, kv as getDetailReturnLocation, ry as getQueryBoolean, ny as getQueryNumber, ty as getQueryParam, dp as getTextareaRows, sy as getUserScopes, ly as hasAnyUserScope, cy as hasUserScope, py as isOutdatedEditedAtConflictError, dy as isPermissionDeniedError, Tv as readStoredDetailViewMode, Dv as resolveDetailViewMode, wv as stripDetailViewModeFromPath, cp as toBackendBoundary, up as toBackendTimeValue, sp as toBackendTimestamp, lp as toDateTimeLocalValue, Ov as toDetailReturnUrl, iy as updateSearchParams, Sp as useAuth, Mf as useColorMode, jv as useDetailViewMode, kp as usePendingChanges, Av as useResolvedDetailViewMode, Ev as writeDetailViewMode };
