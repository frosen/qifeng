window.__require = function t(e, r, o) {
function n(s, c) {
if (!r[s]) {
if (!e[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!e[a]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = a;
}
var u = r[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return n(e[s][1][t] || t);
}, u, u.exports, t, e, r, o);
}
return r[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < o.length; s++) n(o[s]);
return n;
}({
1: [ function(t, e, r) {
"use strict";
r.byteLength = function(t) {
var e = l(t), r = e[0], o = e[1];
return 3 * (r + o) / 4 - o;
};
r.toByteArray = function(t) {
var e, r, o = l(t), s = o[0], c = o[1], a = new i(u(t, s, c)), p = 0, f = c > 0 ? s - 4 : s;
for (r = 0; r < f; r += 4) {
e = n[t.charCodeAt(r)] << 18 | n[t.charCodeAt(r + 1)] << 12 | n[t.charCodeAt(r + 2)] << 6 | n[t.charCodeAt(r + 3)];
a[p++] = e >> 16 & 255;
a[p++] = e >> 8 & 255;
a[p++] = 255 & e;
}
if (2 === c) {
e = n[t.charCodeAt(r)] << 2 | n[t.charCodeAt(r + 1)] >> 4;
a[p++] = 255 & e;
}
if (1 === c) {
e = n[t.charCodeAt(r)] << 10 | n[t.charCodeAt(r + 1)] << 4 | n[t.charCodeAt(r + 2)] >> 2;
a[p++] = e >> 8 & 255;
a[p++] = 255 & e;
}
return a;
};
r.fromByteArray = function(t) {
for (var e, r = t.length, n = r % 3, i = [], s = 0, c = r - n; s < c; s += 16383) i.push(f(t, s, s + 16383 > c ? c : s + 16383));
if (1 === n) {
e = t[r - 1];
i.push(o[e >> 2] + o[e << 4 & 63] + "==");
} else if (2 === n) {
e = (t[r - 2] << 8) + t[r - 1];
i.push(o[e >> 10] + o[e >> 4 & 63] + o[e << 2 & 63] + "=");
}
return i.join("");
};
for (var o = [], n = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = 0, a = s.length; c < a; ++c) {
o[c] = s[c];
n[s.charCodeAt(c)] = c;
}
n["-".charCodeAt(0)] = 62;
n["_".charCodeAt(0)] = 63;
function l(t) {
var e = t.length;
if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
var r = t.indexOf("=");
-1 === r && (r = e);
return [ r, r === e ? 0 : 4 - r % 4 ];
}
function u(t, e, r) {
return 3 * (e + r) / 4 - r;
}
function p(t) {
return o[t >> 18 & 63] + o[t >> 12 & 63] + o[t >> 6 & 63] + o[63 & t];
}
function f(t, e, r) {
for (var o, n = [], i = e; i < r; i += 3) {
o = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (255 & t[i + 2]);
n.push(p(o));
}
return n.join("");
}
}, {} ],
2: [ function(t, e, r) {
(function(e) {
"use strict";
var o = t("base64-js"), n = t("ieee754"), i = t("isarray");
r.Buffer = a;
r.SlowBuffer = function(t) {
+t != t && (t = 0);
return a.alloc(+t);
};
r.INSPECT_MAX_BYTES = 50;
a.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
try {
var t = new Uint8Array(1);
t.__proto__ = {
__proto__: Uint8Array.prototype,
foo: function() {
return 42;
}
};
return 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength;
} catch (t) {
return !1;
}
}();
r.kMaxLength = s();
function s() {
return a.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function c(t, e) {
if (s() < e) throw new RangeError("Invalid typed array length");
if (a.TYPED_ARRAY_SUPPORT) (t = new Uint8Array(e)).__proto__ = a.prototype; else {
null === t && (t = new a(e));
t.length = e;
}
return t;
}
function a(t, e, r) {
if (!(a.TYPED_ARRAY_SUPPORT || this instanceof a)) return new a(t, e, r);
if ("number" == typeof t) {
if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
return f(this, t);
}
return l(this, t, e, r);
}
a.poolSize = 8192;
a._augment = function(t) {
t.__proto__ = a.prototype;
return t;
};
function l(t, e, r, o) {
if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? y(t, e, r, o) : "string" == typeof e ? h(t, e, r) : g(t, e);
}
a.from = function(t, e, r) {
return l(null, t, e, r);
};
if (a.TYPED_ARRAY_SUPPORT) {
a.prototype.__proto__ = Uint8Array.prototype;
a.__proto__ = Uint8Array;
"undefined" != typeof Symbol && Symbol.species && a[Symbol.species] === a && Object.defineProperty(a, Symbol.species, {
value: null,
configurable: !0
});
}
function u(t) {
if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
if (t < 0) throw new RangeError('"size" argument must not be negative');
}
function p(t, e, r, o) {
u(e);
return e <= 0 ? c(t, e) : void 0 !== r ? "string" == typeof o ? c(t, e).fill(r, o) : c(t, e).fill(r) : c(t, e);
}
a.alloc = function(t, e, r) {
return p(null, t, e, r);
};
function f(t, e) {
u(e);
t = c(t, e < 0 ? 0 : 0 | m(e));
if (!a.TYPED_ARRAY_SUPPORT) for (var r = 0; r < e; ++r) t[r] = 0;
return t;
}
a.allocUnsafe = function(t) {
return f(null, t);
};
a.allocUnsafeSlow = function(t) {
return f(null, t);
};
function h(t, e, r) {
"string" == typeof r && "" !== r || (r = "utf8");
if (!a.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
var o = 0 | b(e, r), n = (t = c(t, o)).write(e, r);
n !== o && (t = t.slice(0, n));
return t;
}
function d(t, e) {
var r = e.length < 0 ? 0 : 0 | m(e.length);
t = c(t, r);
for (var o = 0; o < r; o += 1) t[o] = 255 & e[o];
return t;
}
function y(t, e, r, o) {
e.byteLength;
if (r < 0 || e.byteLength < r) throw new RangeError("'offset' is out of bounds");
if (e.byteLength < r + (o || 0)) throw new RangeError("'length' is out of bounds");
e = void 0 === r && void 0 === o ? new Uint8Array(e) : void 0 === o ? new Uint8Array(e, r) : new Uint8Array(e, r, o);
a.TYPED_ARRAY_SUPPORT ? (t = e).__proto__ = a.prototype : t = d(t, e);
return t;
}
function g(t, e) {
if (a.isBuffer(e)) {
var r = 0 | m(e.length);
if (0 === (t = c(t, r)).length) return t;
e.copy(t, 0, 0, r);
return t;
}
if (e) {
if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) return "number" != typeof e.length || $(e.length) ? c(t, 0) : d(t, e);
if ("Buffer" === e.type && i(e.data)) return d(t, e.data);
}
throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function m(t) {
if (t >= s()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s().toString(16) + " bytes");
return 0 | t;
}
a.isBuffer = function(t) {
return !(null == t || !t._isBuffer);
};
a.compare = function(t, e) {
if (!a.isBuffer(t) || !a.isBuffer(e)) throw new TypeError("Arguments must be Buffers");
if (t === e) return 0;
for (var r = t.length, o = e.length, n = 0, i = Math.min(r, o); n < i; ++n) if (t[n] !== e[n]) {
r = t[n];
o = e[n];
break;
}
return r < o ? -1 : o < r ? 1 : 0;
};
a.isEncoding = function(t) {
switch (String(t).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;

default:
return !1;
}
};
a.concat = function(t, e) {
if (!i(t)) throw new TypeError('"list" argument must be an Array of Buffers');
if (0 === t.length) return a.alloc(0);
var r;
if (void 0 === e) {
e = 0;
for (r = 0; r < t.length; ++r) e += t[r].length;
}
var o = a.allocUnsafe(e), n = 0;
for (r = 0; r < t.length; ++r) {
var s = t[r];
if (!a.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');
s.copy(o, n);
n += s.length;
}
return o;
};
function b(t, e) {
if (a.isBuffer(t)) return t.length;
if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
"string" != typeof t && (t = "" + t);
var r = t.length;
if (0 === r) return 0;
for (var o = !1; ;) switch (e) {
case "ascii":
case "latin1":
case "binary":
return r;

case "utf8":
case "utf-8":
case void 0:
return J(t).length;

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * r;

case "hex":
return r >>> 1;

case "base64":
return K(t).length;

default:
if (o) return J(t).length;
e = ("" + e).toLowerCase();
o = !0;
}
}
a.byteLength = b;
function v(t, e, r) {
var o = !1;
(void 0 === e || e < 0) && (e = 0);
if (e > this.length) return "";
(void 0 === r || r > this.length) && (r = this.length);
if (r <= 0) return "";
if ((r >>>= 0) <= (e >>>= 0)) return "";
t || (t = "utf8");
for (;;) switch (t) {
case "hex":
return j(this, e, r);

case "utf8":
case "utf-8":
return D(this, e, r);

case "ascii":
return A(this, e, r);

case "latin1":
case "binary":
return E(this, e, r);

case "base64":
return I(this, e, r);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return N(this, e, r);

default:
if (o) throw new TypeError("Unknown encoding: " + t);
t = (t + "").toLowerCase();
o = !0;
}
}
a.prototype._isBuffer = !0;
function w(t, e, r) {
var o = t[e];
t[e] = t[r];
t[r] = o;
}
a.prototype.swap16 = function() {
var t = this.length;
if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
for (var e = 0; e < t; e += 2) w(this, e, e + 1);
return this;
};
a.prototype.swap32 = function() {
var t = this.length;
if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
for (var e = 0; e < t; e += 4) {
w(this, e, e + 3);
w(this, e + 1, e + 2);
}
return this;
};
a.prototype.swap64 = function() {
var t = this.length;
if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
for (var e = 0; e < t; e += 8) {
w(this, e, e + 7);
w(this, e + 1, e + 6);
w(this, e + 2, e + 5);
w(this, e + 3, e + 4);
}
return this;
};
a.prototype.toString = function() {
var t = 0 | this.length;
return 0 === t ? "" : 0 === arguments.length ? D(this, 0, t) : v.apply(this, arguments);
};
a.prototype.equals = function(t) {
if (!a.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
return this === t || 0 === a.compare(this, t);
};
a.prototype.inspect = function() {
var t = "", e = r.INSPECT_MAX_BYTES;
if (this.length > 0) {
t = this.toString("hex", 0, e).match(/.{2}/g).join(" ");
this.length > e && (t += " ... ");
}
return "<Buffer " + t + ">";
};
a.prototype.compare = function(t, e, r, o, n) {
if (!a.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
void 0 === e && (e = 0);
void 0 === r && (r = t ? t.length : 0);
void 0 === o && (o = 0);
void 0 === n && (n = this.length);
if (e < 0 || r > t.length || o < 0 || n > this.length) throw new RangeError("out of range index");
if (o >= n && e >= r) return 0;
if (o >= n) return -1;
if (e >= r) return 1;
e >>>= 0;
r >>>= 0;
o >>>= 0;
n >>>= 0;
if (this === t) return 0;
for (var i = n - o, s = r - e, c = Math.min(i, s), l = this.slice(o, n), u = t.slice(e, r), p = 0; p < c; ++p) if (l[p] !== u[p]) {
i = l[p];
s = u[p];
break;
}
return i < s ? -1 : s < i ? 1 : 0;
};
function _(t, e, r, o, n) {
if (0 === t.length) return -1;
if ("string" == typeof r) {
o = r;
r = 0;
} else r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648);
r = +r;
isNaN(r) && (r = n ? 0 : t.length - 1);
r < 0 && (r = t.length + r);
if (r >= t.length) {
if (n) return -1;
r = t.length - 1;
} else if (r < 0) {
if (!n) return -1;
r = 0;
}
"string" == typeof e && (e = a.from(e, o));
if (a.isBuffer(e)) return 0 === e.length ? -1 : R(t, e, r, o, n);
if ("number" == typeof e) {
e &= 255;
return a.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : R(t, [ e ], r, o, n);
}
throw new TypeError("val must be string, number or Buffer");
}
function R(t, e, r, o, n) {
var i, s = 1, c = t.length, a = e.length;
if (void 0 !== o && ("ucs2" === (o = String(o).toLowerCase()) || "ucs-2" === o || "utf16le" === o || "utf-16le" === o)) {
if (t.length < 2 || e.length < 2) return -1;
s = 2;
c /= 2;
a /= 2;
r /= 2;
}
function l(t, e) {
return 1 === s ? t[e] : t.readUInt16BE(e * s);
}
if (n) {
var u = -1;
for (i = r; i < c; i++) if (l(t, i) === l(e, -1 === u ? 0 : i - u)) {
-1 === u && (u = i);
if (i - u + 1 === a) return u * s;
} else {
-1 !== u && (i -= i - u);
u = -1;
}
} else {
r + a > c && (r = c - a);
for (i = r; i >= 0; i--) {
for (var p = !0, f = 0; f < a; f++) if (l(t, i + f) !== l(e, f)) {
p = !1;
break;
}
if (p) return i;
}
}
return -1;
}
a.prototype.includes = function(t, e, r) {
return -1 !== this.indexOf(t, e, r);
};
a.prototype.indexOf = function(t, e, r) {
return _(this, t, e, r, !0);
};
a.prototype.lastIndexOf = function(t, e, r) {
return _(this, t, e, r, !1);
};
function C(t, e, r, o) {
r = Number(r) || 0;
var n = t.length - r;
o ? (o = Number(o)) > n && (o = n) : o = n;
var i = e.length;
if (i % 2 != 0) throw new TypeError("Invalid hex string");
o > i / 2 && (o = i / 2);
for (var s = 0; s < o; ++s) {
var c = parseInt(e.substr(2 * s, 2), 16);
if (isNaN(c)) return s;
t[r + s] = c;
}
return s;
}
function P(t, e, r, o) {
return Z(J(e, t.length - r), t, r, o);
}
function O(t, e, r, o) {
return Z(G(e), t, r, o);
}
function T(t, e, r, o) {
return O(t, e, r, o);
}
function L(t, e, r, o) {
return Z(K(e), t, r, o);
}
function S(t, e, r, o) {
return Z(W(e, t.length - r), t, r, o);
}
a.prototype.write = function(t, e, r, o) {
if (void 0 === e) {
o = "utf8";
r = this.length;
e = 0;
} else if (void 0 === r && "string" == typeof e) {
o = e;
r = this.length;
e = 0;
} else {
if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
e |= 0;
if (isFinite(r)) {
r |= 0;
void 0 === o && (o = "utf8");
} else {
o = r;
r = void 0;
}
}
var n = this.length - e;
(void 0 === r || r > n) && (r = n);
if (t.length > 0 && (r < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
o || (o = "utf8");
for (var i = !1; ;) switch (o) {
case "hex":
return C(this, t, e, r);

case "utf8":
case "utf-8":
return P(this, t, e, r);

case "ascii":
return O(this, t, e, r);

case "latin1":
case "binary":
return T(this, t, e, r);

case "base64":
return L(this, t, e, r);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return S(this, t, e, r);

default:
if (i) throw new TypeError("Unknown encoding: " + o);
o = ("" + o).toLowerCase();
i = !0;
}
};
a.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0)
};
};
function I(t, e, r) {
return 0 === e && r === t.length ? o.fromByteArray(t) : o.fromByteArray(t.slice(e, r));
}
function D(t, e, r) {
r = Math.min(t.length, r);
for (var o = [], n = e; n < r; ) {
var i = t[n], s = null, c = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
if (n + c <= r) {
var a, l, u, p;
switch (c) {
case 1:
i < 128 && (s = i);
break;

case 2:
128 == (192 & (a = t[n + 1])) && (p = (31 & i) << 6 | 63 & a) > 127 && (s = p);
break;

case 3:
a = t[n + 1];
l = t[n + 2];
128 == (192 & a) && 128 == (192 & l) && (p = (15 & i) << 12 | (63 & a) << 6 | 63 & l) > 2047 && (p < 55296 || p > 57343) && (s = p);
break;

case 4:
a = t[n + 1];
l = t[n + 2];
u = t[n + 3];
128 == (192 & a) && 128 == (192 & l) && 128 == (192 & u) && (p = (15 & i) << 18 | (63 & a) << 12 | (63 & l) << 6 | 63 & u) > 65535 && p < 1114112 && (s = p);
}
}
if (null === s) {
s = 65533;
c = 1;
} else if (s > 65535) {
s -= 65536;
o.push(s >>> 10 & 1023 | 55296);
s = 56320 | 1023 & s;
}
o.push(s);
n += c;
}
return x(o);
}
var B = 4096;
function x(t) {
var e = t.length;
if (e <= B) return String.fromCharCode.apply(String, t);
for (var r = "", o = 0; o < e; ) r += String.fromCharCode.apply(String, t.slice(o, o += B));
return r;
}
function A(t, e, r) {
var o = "";
r = Math.min(t.length, r);
for (var n = e; n < r; ++n) o += String.fromCharCode(127 & t[n]);
return o;
}
function E(t, e, r) {
var o = "";
r = Math.min(t.length, r);
for (var n = e; n < r; ++n) o += String.fromCharCode(t[n]);
return o;
}
function j(t, e, r) {
var o = t.length;
(!e || e < 0) && (e = 0);
(!r || r < 0 || r > o) && (r = o);
for (var n = "", i = e; i < r; ++i) n += Q(t[i]);
return n;
}
function N(t, e, r) {
for (var o = t.slice(e, r), n = "", i = 0; i < o.length; i += 2) n += String.fromCharCode(o[i] + 256 * o[i + 1]);
return n;
}
a.prototype.slice = function(t, e) {
var r, o = this.length;
t = ~~t;
e = void 0 === e ? o : ~~e;
t < 0 ? (t += o) < 0 && (t = 0) : t > o && (t = o);
e < 0 ? (e += o) < 0 && (e = 0) : e > o && (e = o);
e < t && (e = t);
if (a.TYPED_ARRAY_SUPPORT) (r = this.subarray(t, e)).__proto__ = a.prototype; else {
var n = e - t;
r = new a(n, void 0);
for (var i = 0; i < n; ++i) r[i] = this[i + t];
}
return r;
};
function U(t, e, r) {
if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
if (t + e > r) throw new RangeError("Trying to access beyond buffer length");
}
a.prototype.readUIntLE = function(t, e, r) {
t |= 0;
e |= 0;
r || U(t, e, this.length);
for (var o = this[t], n = 1, i = 0; ++i < e && (n *= 256); ) o += this[t + i] * n;
return o;
};
a.prototype.readUIntBE = function(t, e, r) {
t |= 0;
e |= 0;
r || U(t, e, this.length);
for (var o = this[t + --e], n = 1; e > 0 && (n *= 256); ) o += this[t + --e] * n;
return o;
};
a.prototype.readUInt8 = function(t, e) {
e || U(t, 1, this.length);
return this[t];
};
a.prototype.readUInt16LE = function(t, e) {
e || U(t, 2, this.length);
return this[t] | this[t + 1] << 8;
};
a.prototype.readUInt16BE = function(t, e) {
e || U(t, 2, this.length);
return this[t] << 8 | this[t + 1];
};
a.prototype.readUInt32LE = function(t, e) {
e || U(t, 4, this.length);
return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
};
a.prototype.readUInt32BE = function(t, e) {
e || U(t, 4, this.length);
return 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
};
a.prototype.readIntLE = function(t, e, r) {
t |= 0;
e |= 0;
r || U(t, e, this.length);
for (var o = this[t], n = 1, i = 0; ++i < e && (n *= 256); ) o += this[t + i] * n;
o >= (n *= 128) && (o -= Math.pow(2, 8 * e));
return o;
};
a.prototype.readIntBE = function(t, e, r) {
t |= 0;
e |= 0;
r || U(t, e, this.length);
for (var o = e, n = 1, i = this[t + --o]; o > 0 && (n *= 256); ) i += this[t + --o] * n;
i >= (n *= 128) && (i -= Math.pow(2, 8 * e));
return i;
};
a.prototype.readInt8 = function(t, e) {
e || U(t, 1, this.length);
return 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
};
a.prototype.readInt16LE = function(t, e) {
e || U(t, 2, this.length);
var r = this[t] | this[t + 1] << 8;
return 32768 & r ? 4294901760 | r : r;
};
a.prototype.readInt16BE = function(t, e) {
e || U(t, 2, this.length);
var r = this[t + 1] | this[t] << 8;
return 32768 & r ? 4294901760 | r : r;
};
a.prototype.readInt32LE = function(t, e) {
e || U(t, 4, this.length);
return this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
};
a.prototype.readInt32BE = function(t, e) {
e || U(t, 4, this.length);
return this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
};
a.prototype.readFloatLE = function(t, e) {
e || U(t, 4, this.length);
return n.read(this, t, !0, 23, 4);
};
a.prototype.readFloatBE = function(t, e) {
e || U(t, 4, this.length);
return n.read(this, t, !1, 23, 4);
};
a.prototype.readDoubleLE = function(t, e) {
e || U(t, 8, this.length);
return n.read(this, t, !0, 52, 8);
};
a.prototype.readDoubleBE = function(t, e) {
e || U(t, 8, this.length);
return n.read(this, t, !1, 52, 8);
};
function F(t, e, r, o, n, i) {
if (!a.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
if (e > n || e < i) throw new RangeError('"value" argument is out of bounds');
if (r + o > t.length) throw new RangeError("Index out of range");
}
a.prototype.writeUIntLE = function(t, e, r, o) {
t = +t;
e |= 0;
r |= 0;
if (!o) {
F(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
}
var n = 1, i = 0;
this[e] = 255 & t;
for (;++i < r && (n *= 256); ) this[e + i] = t / n & 255;
return e + r;
};
a.prototype.writeUIntBE = function(t, e, r, o) {
t = +t;
e |= 0;
r |= 0;
if (!o) {
F(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
}
var n = r - 1, i = 1;
this[e + n] = 255 & t;
for (;--n >= 0 && (i *= 256); ) this[e + n] = t / i & 255;
return e + r;
};
a.prototype.writeUInt8 = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 1, 255, 0);
a.TYPED_ARRAY_SUPPORT || (t = Math.floor(t));
this[e] = 255 & t;
return e + 1;
};
function k(t, e, r, o) {
e < 0 && (e = 65535 + e + 1);
for (var n = 0, i = Math.min(t.length - r, 2); n < i; ++n) t[r + n] = (e & 255 << 8 * (o ? n : 1 - n)) >>> 8 * (o ? n : 1 - n);
}
a.prototype.writeUInt16LE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 2, 65535, 0);
if (a.TYPED_ARRAY_SUPPORT) {
this[e] = 255 & t;
this[e + 1] = t >>> 8;
} else k(this, t, e, !0);
return e + 2;
};
a.prototype.writeUInt16BE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 2, 65535, 0);
if (a.TYPED_ARRAY_SUPPORT) {
this[e] = t >>> 8;
this[e + 1] = 255 & t;
} else k(this, t, e, !1);
return e + 2;
};
function M(t, e, r, o) {
e < 0 && (e = 4294967295 + e + 1);
for (var n = 0, i = Math.min(t.length - r, 4); n < i; ++n) t[r + n] = e >>> 8 * (o ? n : 3 - n) & 255;
}
a.prototype.writeUInt32LE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 4, 4294967295, 0);
if (a.TYPED_ARRAY_SUPPORT) {
this[e + 3] = t >>> 24;
this[e + 2] = t >>> 16;
this[e + 1] = t >>> 8;
this[e] = 255 & t;
} else M(this, t, e, !0);
return e + 4;
};
a.prototype.writeUInt32BE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 4, 4294967295, 0);
if (a.TYPED_ARRAY_SUPPORT) {
this[e] = t >>> 24;
this[e + 1] = t >>> 16;
this[e + 2] = t >>> 8;
this[e + 3] = 255 & t;
} else M(this, t, e, !1);
return e + 4;
};
a.prototype.writeIntLE = function(t, e, r, o) {
t = +t;
e |= 0;
if (!o) {
var n = Math.pow(2, 8 * r - 1);
F(this, t, e, r, n - 1, -n);
}
var i = 0, s = 1, c = 0;
this[e] = 255 & t;
for (;++i < r && (s *= 256); ) {
t < 0 && 0 === c && 0 !== this[e + i - 1] && (c = 1);
this[e + i] = (t / s >> 0) - c & 255;
}
return e + r;
};
a.prototype.writeIntBE = function(t, e, r, o) {
t = +t;
e |= 0;
if (!o) {
var n = Math.pow(2, 8 * r - 1);
F(this, t, e, r, n - 1, -n);
}
var i = r - 1, s = 1, c = 0;
this[e + i] = 255 & t;
for (;--i >= 0 && (s *= 256); ) {
t < 0 && 0 === c && 0 !== this[e + i + 1] && (c = 1);
this[e + i] = (t / s >> 0) - c & 255;
}
return e + r;
};
a.prototype.writeInt8 = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 1, 127, -128);
a.TYPED_ARRAY_SUPPORT || (t = Math.floor(t));
t < 0 && (t = 255 + t + 1);
this[e] = 255 & t;
return e + 1;
};
a.prototype.writeInt16LE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 2, 32767, -32768);
if (a.TYPED_ARRAY_SUPPORT) {
this[e] = 255 & t;
this[e + 1] = t >>> 8;
} else k(this, t, e, !0);
return e + 2;
};
a.prototype.writeInt16BE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 2, 32767, -32768);
if (a.TYPED_ARRAY_SUPPORT) {
this[e] = t >>> 8;
this[e + 1] = 255 & t;
} else k(this, t, e, !1);
return e + 2;
};
a.prototype.writeInt32LE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 4, 2147483647, -2147483648);
if (a.TYPED_ARRAY_SUPPORT) {
this[e] = 255 & t;
this[e + 1] = t >>> 8;
this[e + 2] = t >>> 16;
this[e + 3] = t >>> 24;
} else M(this, t, e, !0);
return e + 4;
};
a.prototype.writeInt32BE = function(t, e, r) {
t = +t;
e |= 0;
r || F(this, t, e, 4, 2147483647, -2147483648);
t < 0 && (t = 4294967295 + t + 1);
if (a.TYPED_ARRAY_SUPPORT) {
this[e] = t >>> 24;
this[e + 1] = t >>> 16;
this[e + 2] = t >>> 8;
this[e + 3] = 255 & t;
} else M(this, t, e, !1);
return e + 4;
};
function V(t, e, r, o, n, i) {
if (r + o > t.length) throw new RangeError("Index out of range");
if (r < 0) throw new RangeError("Index out of range");
}
function H(t, e, r, o, i) {
i || V(t, 0, r, 4);
n.write(t, e, r, o, 23, 4);
return r + 4;
}
a.prototype.writeFloatLE = function(t, e, r) {
return H(this, t, e, !0, r);
};
a.prototype.writeFloatBE = function(t, e, r) {
return H(this, t, e, !1, r);
};
function Y(t, e, r, o, i) {
i || V(t, 0, r, 8);
n.write(t, e, r, o, 52, 8);
return r + 8;
}
a.prototype.writeDoubleLE = function(t, e, r) {
return Y(this, t, e, !0, r);
};
a.prototype.writeDoubleBE = function(t, e, r) {
return Y(this, t, e, !1, r);
};
a.prototype.copy = function(t, e, r, o) {
r || (r = 0);
o || 0 === o || (o = this.length);
e >= t.length && (e = t.length);
e || (e = 0);
o > 0 && o < r && (o = r);
if (o === r) return 0;
if (0 === t.length || 0 === this.length) return 0;
if (e < 0) throw new RangeError("targetStart out of bounds");
if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
if (o < 0) throw new RangeError("sourceEnd out of bounds");
o > this.length && (o = this.length);
t.length - e < o - r && (o = t.length - e + r);
var n, i = o - r;
if (this === t && r < e && e < o) for (n = i - 1; n >= 0; --n) t[n + e] = this[n + r]; else if (i < 1e3 || !a.TYPED_ARRAY_SUPPORT) for (n = 0; n < i; ++n) t[n + e] = this[n + r]; else Uint8Array.prototype.set.call(t, this.subarray(r, r + i), e);
return i;
};
a.prototype.fill = function(t, e, r, o) {
if ("string" == typeof t) {
if ("string" == typeof e) {
o = e;
e = 0;
r = this.length;
} else if ("string" == typeof r) {
o = r;
r = this.length;
}
if (1 === t.length) {
var n = t.charCodeAt(0);
n < 256 && (t = n);
}
if (void 0 !== o && "string" != typeof o) throw new TypeError("encoding must be a string");
if ("string" == typeof o && !a.isEncoding(o)) throw new TypeError("Unknown encoding: " + o);
} else "number" == typeof t && (t &= 255);
if (e < 0 || this.length < e || this.length < r) throw new RangeError("Out of range index");
if (r <= e) return this;
e >>>= 0;
r = void 0 === r ? this.length : r >>> 0;
t || (t = 0);
var i;
if ("number" == typeof t) for (i = e; i < r; ++i) this[i] = t; else {
var s = a.isBuffer(t) ? t : J(new a(t, o).toString()), c = s.length;
for (i = 0; i < r - e; ++i) this[i + e] = s[i % c];
}
return this;
};
var q = /[^+\/0-9A-Za-z-_]/g;
function z(t) {
if ((t = X(t).replace(q, "")).length < 2) return "";
for (;t.length % 4 != 0; ) t += "=";
return t;
}
function X(t) {
return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
}
function Q(t) {
return t < 16 ? "0" + t.toString(16) : t.toString(16);
}
function J(t, e) {
e = e || Infinity;
for (var r, o = t.length, n = null, i = [], s = 0; s < o; ++s) {
if ((r = t.charCodeAt(s)) > 55295 && r < 57344) {
if (!n) {
if (r > 56319) {
(e -= 3) > -1 && i.push(239, 191, 189);
continue;
}
if (s + 1 === o) {
(e -= 3) > -1 && i.push(239, 191, 189);
continue;
}
n = r;
continue;
}
if (r < 56320) {
(e -= 3) > -1 && i.push(239, 191, 189);
n = r;
continue;
}
r = 65536 + (n - 55296 << 10 | r - 56320);
} else n && (e -= 3) > -1 && i.push(239, 191, 189);
n = null;
if (r < 128) {
if ((e -= 1) < 0) break;
i.push(r);
} else if (r < 2048) {
if ((e -= 2) < 0) break;
i.push(r >> 6 | 192, 63 & r | 128);
} else if (r < 65536) {
if ((e -= 3) < 0) break;
i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
} else {
if (!(r < 1114112)) throw new Error("Invalid code point");
if ((e -= 4) < 0) break;
i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
}
}
return i;
}
function G(t) {
for (var e = [], r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r));
return e;
}
function W(t, e) {
for (var r, o, n, i = [], s = 0; s < t.length && !((e -= 2) < 0); ++s) {
o = (r = t.charCodeAt(s)) >> 8;
n = r % 256;
i.push(n);
i.push(o);
}
return i;
}
function K(t) {
return o.toByteArray(z(t));
}
function Z(t, e, r, o) {
for (var n = 0; n < o && !(n + r >= e.length || n >= t.length); ++n) e[n + r] = t[n];
return n;
}
function $(t) {
return t != t;
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"base64-js": 1,
ieee754: 4,
isarray: 3
} ],
3: [ function(t, e, r) {
var o = {}.toString;
e.exports = Array.isArray || function(t) {
return "[object Array]" == o.call(t);
};
}, {} ],
4: [ function(t, e, r) {
r.read = function(t, e, r, o, n) {
var i, s, c = 8 * n - o - 1, a = (1 << c) - 1, l = a >> 1, u = -7, p = r ? n - 1 : 0, f = r ? -1 : 1, h = t[e + p];
p += f;
i = h & (1 << -u) - 1;
h >>= -u;
u += c;
for (;u > 0; i = 256 * i + t[e + p], p += f, u -= 8) ;
s = i & (1 << -u) - 1;
i >>= -u;
u += o;
for (;u > 0; s = 256 * s + t[e + p], p += f, u -= 8) ;
if (0 === i) i = 1 - l; else {
if (i === a) return s ? NaN : Infinity * (h ? -1 : 1);
s += Math.pow(2, o);
i -= l;
}
return (h ? -1 : 1) * s * Math.pow(2, i - o);
};
r.write = function(t, e, r, o, n, i) {
var s, c, a, l = 8 * i - n - 1, u = (1 << l) - 1, p = u >> 1, f = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = o ? 0 : i - 1, d = o ? 1 : -1, y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
e = Math.abs(e);
if (isNaN(e) || Infinity === e) {
c = isNaN(e) ? 1 : 0;
s = u;
} else {
s = Math.floor(Math.log(e) / Math.LN2);
if (e * (a = Math.pow(2, -s)) < 1) {
s--;
a *= 2;
}
if ((e += s + p >= 1 ? f / a : f * Math.pow(2, 1 - p)) * a >= 2) {
s++;
a /= 2;
}
if (s + p >= u) {
c = 0;
s = u;
} else if (s + p >= 1) {
c = (e * a - 1) * Math.pow(2, n);
s += p;
} else {
c = e * Math.pow(2, p - 1) * Math.pow(2, n);
s = 0;
}
}
for (;n >= 8; t[r + h] = 255 & c, h += d, c /= 256, n -= 8) ;
s = s << n | c;
l += n;
for (;l > 0; t[r + h] = 255 & s, h += d, s /= 256, l -= 8) ;
t[r + h - d] |= 128 * y;
};
}, {} ],
5: [ function(t, e, r) {
var o = {
utf8: {
stringToBytes: function(t) {
return o.bin.stringToBytes(unescape(encodeURIComponent(t)));
},
bytesToString: function(t) {
return decodeURIComponent(escape(o.bin.bytesToString(t)));
}
},
bin: {
stringToBytes: function(t) {
for (var e = [], r = 0; r < t.length; r++) e.push(255 & t.charCodeAt(r));
return e;
},
bytesToString: function(t) {
for (var e = [], r = 0; r < t.length; r++) e.push(String.fromCharCode(t[r]));
return e.join("");
}
}
};
e.exports = o;
}, {} ],
6: [ function(t, e, r) {
(function() {
var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = {
rotl: function(t, e) {
return t << e | t >>> 32 - e;
},
rotr: function(t, e) {
return t << 32 - e | t >>> e;
},
endian: function(t) {
if (t.constructor == Number) return 16711935 & r.rotl(t, 8) | 4278255360 & r.rotl(t, 24);
for (var e = 0; e < t.length; e++) t[e] = r.endian(t[e]);
return t;
},
randomBytes: function(t) {
for (var e = []; t > 0; t--) e.push(Math.floor(256 * Math.random()));
return e;
},
bytesToWords: function(t) {
for (var e = [], r = 0, o = 0; r < t.length; r++, o += 8) e[o >>> 5] |= t[r] << 24 - o % 32;
return e;
},
wordsToBytes: function(t) {
for (var e = [], r = 0; r < 32 * t.length; r += 8) e.push(t[r >>> 5] >>> 24 - r % 32 & 255);
return e;
},
bytesToHex: function(t) {
for (var e = [], r = 0; r < t.length; r++) {
e.push((t[r] >>> 4).toString(16));
e.push((15 & t[r]).toString(16));
}
return e.join("");
},
hexToBytes: function(t) {
for (var e = [], r = 0; r < t.length; r += 2) e.push(parseInt(t.substr(r, 2), 16));
return e;
},
bytesToBase64: function(e) {
for (var r = [], o = 0; o < e.length; o += 3) for (var n = e[o] << 16 | e[o + 1] << 8 | e[o + 2], i = 0; i < 4; i++) 8 * o + 6 * i <= 8 * e.length ? r.push(t.charAt(n >>> 6 * (3 - i) & 63)) : r.push("=");
return r.join("");
},
base64ToBytes: function(e) {
e = e.replace(/[^A-Z0-9+\/]/gi, "");
for (var r = [], o = 0, n = 0; o < e.length; n = ++o % 4) 0 != n && r.push((t.indexOf(e.charAt(o - 1)) & Math.pow(2, -2 * n + 8) - 1) << 2 * n | t.indexOf(e.charAt(o)) >>> 6 - 2 * n);
return r;
}
};
e.exports = r;
})();
}, {} ],
7: [ function(t, e, r) {
"use strict";
var o = String.prototype.replace, n = /%20/g, i = t("./utils"), s = {
RFC1738: "RFC1738",
RFC3986: "RFC3986"
};
e.exports = i.assign({
default: s.RFC3986,
formatters: {
RFC1738: function(t) {
return o.call(t, n, "+");
},
RFC3986: function(t) {
return String(t);
}
}
}, s);
}, {
"./utils": 11
} ],
8: [ function(t, e, r) {
"use strict";
var o = t("./stringify"), n = t("./parse"), i = t("./formats");
e.exports = {
formats: i,
parse: n,
stringify: o
};
}, {
"./formats": 7,
"./parse": 9,
"./stringify": 10
} ],
9: [ function(t, e, r) {
"use strict";
var o = t("./utils"), n = Object.prototype.hasOwnProperty, i = Array.isArray, s = {
allowDots: !1,
allowPrototypes: !1,
arrayLimit: 20,
charset: "utf-8",
charsetSentinel: !1,
comma: !1,
decoder: o.decode,
delimiter: "&",
depth: 5,
ignoreQueryPrefix: !1,
interpretNumericEntities: !1,
parameterLimit: 1e3,
parseArrays: !0,
plainObjects: !1,
strictNullHandling: !1
}, c = function(t) {
return t.replace(/&#(\d+);/g, function(t, e) {
return String.fromCharCode(parseInt(e, 10));
});
}, a = function(t, e) {
return t && "string" == typeof t && e.comma && t.indexOf(",") > -1 ? t.split(",") : t;
}, l = function(t, e) {
var r, l = {}, u = e.ignoreQueryPrefix ? t.replace(/^\?/, "") : t, p = Infinity === e.parameterLimit ? void 0 : e.parameterLimit, f = u.split(e.delimiter, p), h = -1, d = e.charset;
if (e.charsetSentinel) for (r = 0; r < f.length; ++r) if (0 === f[r].indexOf("utf8=")) {
"utf8=%E2%9C%93" === f[r] ? d = "utf-8" : "utf8=%26%2310003%3B" === f[r] && (d = "iso-8859-1");
h = r;
r = f.length;
}
for (r = 0; r < f.length; ++r) if (r !== h) {
var y, g, m = f[r], b = m.indexOf("]="), v = -1 === b ? m.indexOf("=") : b + 1;
if (-1 === v) {
y = e.decoder(m, s.decoder, d, "key");
g = e.strictNullHandling ? null : "";
} else {
y = e.decoder(m.slice(0, v), s.decoder, d, "key");
g = o.maybeMap(a(m.slice(v + 1), e), function(t) {
return e.decoder(t, s.decoder, d, "value");
});
}
g && e.interpretNumericEntities && "iso-8859-1" === d && (g = c(g));
m.indexOf("[]=") > -1 && (g = i(g) ? [ g ] : g);
n.call(l, y) ? l[y] = o.combine(l[y], g) : l[y] = g;
}
return l;
}, u = function(t, e, r, o) {
for (var n = o ? e : a(e, r), i = t.length - 1; i >= 0; --i) {
var s, c = t[i];
if ("[]" === c && r.parseArrays) s = [].concat(n); else {
s = r.plainObjects ? Object.create(null) : {};
var l = "[" === c.charAt(0) && "]" === c.charAt(c.length - 1) ? c.slice(1, -1) : c, u = parseInt(l, 10);
r.parseArrays || "" !== l ? !isNaN(u) && c !== l && String(u) === l && u >= 0 && r.parseArrays && u <= r.arrayLimit ? (s = [])[u] = n : s[l] = n : s = {
0: n
};
}
n = s;
}
return n;
}, p = function(t, e, r, o) {
if (t) {
var i = r.allowDots ? t.replace(/\.([^.[]+)/g, "[$1]") : t, s = /(\[[^[\]]*])/g, c = r.depth > 0 && /(\[[^[\]]*])/.exec(i), a = c ? i.slice(0, c.index) : i, l = [];
if (a) {
if (!r.plainObjects && n.call(Object.prototype, a) && !r.allowPrototypes) return;
l.push(a);
}
for (var p = 0; r.depth > 0 && null !== (c = s.exec(i)) && p < r.depth; ) {
p += 1;
if (!r.plainObjects && n.call(Object.prototype, c[1].slice(1, -1)) && !r.allowPrototypes) return;
l.push(c[1]);
}
c && l.push("[" + i.slice(c.index) + "]");
return u(l, e, r, o);
}
}, f = function(t) {
if (!t) return s;
if (null !== t.decoder && void 0 !== t.decoder && "function" != typeof t.decoder) throw new TypeError("Decoder has to be a function.");
if ("undefined" != typeof t.charset && "utf-8" !== t.charset && "iso-8859-1" !== t.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
var e = "undefined" == typeof t.charset ? s.charset : t.charset;
return {
allowDots: "undefined" == typeof t.allowDots ? s.allowDots : !!t.allowDots,
allowPrototypes: "boolean" == typeof t.allowPrototypes ? t.allowPrototypes : s.allowPrototypes,
arrayLimit: "number" == typeof t.arrayLimit ? t.arrayLimit : s.arrayLimit,
charset: e,
charsetSentinel: "boolean" == typeof t.charsetSentinel ? t.charsetSentinel : s.charsetSentinel,
comma: "boolean" == typeof t.comma ? t.comma : s.comma,
decoder: "function" == typeof t.decoder ? t.decoder : s.decoder,
delimiter: "string" == typeof t.delimiter || o.isRegExp(t.delimiter) ? t.delimiter : s.delimiter,
depth: "number" == typeof t.depth || !1 === t.depth ? +t.depth : s.depth,
ignoreQueryPrefix: !0 === t.ignoreQueryPrefix,
interpretNumericEntities: "boolean" == typeof t.interpretNumericEntities ? t.interpretNumericEntities : s.interpretNumericEntities,
parameterLimit: "number" == typeof t.parameterLimit ? t.parameterLimit : s.parameterLimit,
parseArrays: !1 !== t.parseArrays,
plainObjects: "boolean" == typeof t.plainObjects ? t.plainObjects : s.plainObjects,
strictNullHandling: "boolean" == typeof t.strictNullHandling ? t.strictNullHandling : s.strictNullHandling
};
};
e.exports = function(t, e) {
var r = f(e);
if ("" === t || null === t || "undefined" == typeof t) return r.plainObjects ? Object.create(null) : {};
for (var n = "string" == typeof t ? l(t, r) : t, i = r.plainObjects ? Object.create(null) : {}, s = Object.keys(n), c = 0; c < s.length; ++c) {
var a = s[c], u = p(a, n[a], r, "string" == typeof t);
i = o.merge(i, u, r);
}
return o.compact(i);
};
}, {
"./utils": 11
} ],
10: [ function(t, e, r) {
"use strict";
var o = t("./utils"), n = t("./formats"), i = Object.prototype.hasOwnProperty, s = {
brackets: function(t) {
return t + "[]";
},
comma: "comma",
indices: function(t, e) {
return t + "[" + e + "]";
},
repeat: function(t) {
return t;
}
}, c = Array.isArray, a = Array.prototype.push, l = function(t, e) {
a.apply(t, c(e) ? e : [ e ]);
}, u = Date.prototype.toISOString, p = n.default, f = {
addQueryPrefix: !1,
allowDots: !1,
charset: "utf-8",
charsetSentinel: !1,
delimiter: "&",
encode: !0,
encoder: o.encode,
encodeValuesOnly: !1,
format: p,
formatter: n.formatters[p],
indices: !1,
serializeDate: function(t) {
return u.call(t);
},
skipNulls: !1,
strictNullHandling: !1
}, h = function(t) {
return "string" == typeof t || "number" == typeof t || "boolean" == typeof t || "symbol" == typeof t || "bigint" == typeof t;
}, d = function t(e, r, n, i, s, a, u, p, d, y, g, m, b) {
var v = e;
"function" == typeof u ? v = u(r, v) : v instanceof Date ? v = y(v) : "comma" === n && c(v) && (v = o.maybeMap(v, function(t) {
return t instanceof Date ? y(t) : t;
}).join(","));
if (null === v) {
if (i) return a && !m ? a(r, f.encoder, b, "key") : r;
v = "";
}
if (h(v) || o.isBuffer(v)) {
if (a) {
return [ g(m ? r : a(r, f.encoder, b, "key")) + "=" + g(a(v, f.encoder, b, "value")) ];
}
return [ g(r) + "=" + g(String(v)) ];
}
var w, _ = [];
if ("undefined" == typeof v) return _;
if (c(u)) w = u; else {
var R = Object.keys(v);
w = p ? R.sort(p) : R;
}
for (var C = 0; C < w.length; ++C) {
var P = w[C], O = v[P];
if (!s || null !== O) {
var T = c(v) ? "function" == typeof n ? n(r, P) : r : r + (d ? "." + P : "[" + P + "]");
l(_, t(O, T, n, i, s, a, u, p, d, y, g, m, b));
}
}
return _;
}, y = function(t) {
if (!t) return f;
if (null !== t.encoder && void 0 !== t.encoder && "function" != typeof t.encoder) throw new TypeError("Encoder has to be a function.");
var e = t.charset || f.charset;
if ("undefined" != typeof t.charset && "utf-8" !== t.charset && "iso-8859-1" !== t.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
var r = n.default;
if ("undefined" != typeof t.format) {
if (!i.call(n.formatters, t.format)) throw new TypeError("Unknown format option provided.");
r = t.format;
}
var o = n.formatters[r], s = f.filter;
("function" == typeof t.filter || c(t.filter)) && (s = t.filter);
return {
addQueryPrefix: "boolean" == typeof t.addQueryPrefix ? t.addQueryPrefix : f.addQueryPrefix,
allowDots: "undefined" == typeof t.allowDots ? f.allowDots : !!t.allowDots,
charset: e,
charsetSentinel: "boolean" == typeof t.charsetSentinel ? t.charsetSentinel : f.charsetSentinel,
delimiter: "undefined" == typeof t.delimiter ? f.delimiter : t.delimiter,
encode: "boolean" == typeof t.encode ? t.encode : f.encode,
encoder: "function" == typeof t.encoder ? t.encoder : f.encoder,
encodeValuesOnly: "boolean" == typeof t.encodeValuesOnly ? t.encodeValuesOnly : f.encodeValuesOnly,
filter: s,
formatter: o,
serializeDate: "function" == typeof t.serializeDate ? t.serializeDate : f.serializeDate,
skipNulls: "boolean" == typeof t.skipNulls ? t.skipNulls : f.skipNulls,
sort: "function" == typeof t.sort ? t.sort : null,
strictNullHandling: "boolean" == typeof t.strictNullHandling ? t.strictNullHandling : f.strictNullHandling
};
};
e.exports = function(t, e) {
var r, o = t, n = y(e);
"function" == typeof n.filter ? o = (0, n.filter)("", o) : c(n.filter) && (r = n.filter);
var i, a = [];
if ("object" != typeof o || null === o) return "";
i = e && e.arrayFormat in s ? e.arrayFormat : e && "indices" in e ? e.indices ? "indices" : "repeat" : "indices";
var u = s[i];
r || (r = Object.keys(o));
n.sort && r.sort(n.sort);
for (var p = 0; p < r.length; ++p) {
var f = r[p];
n.skipNulls && null === o[f] || l(a, d(o[f], f, u, n.strictNullHandling, n.skipNulls, n.encode ? n.encoder : null, n.filter, n.sort, n.allowDots, n.serializeDate, n.formatter, n.encodeValuesOnly, n.charset));
}
var h = a.join(n.delimiter), g = !0 === n.addQueryPrefix ? "?" : "";
n.charsetSentinel && ("iso-8859-1" === n.charset ? g += "utf8=%26%2310003%3B&" : g += "utf8=%E2%9C%93&");
return h.length > 0 ? g + h : "";
};
}, {
"./formats": 7,
"./utils": 11
} ],
11: [ function(t, e, r) {
"use strict";
var o = Object.prototype.hasOwnProperty, n = Array.isArray, i = function() {
for (var t = [], e = 0; e < 256; ++e) t.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
return t;
}(), s = function(t) {
for (;t.length > 1; ) {
var e = t.pop(), r = e.obj[e.prop];
if (n(r)) {
for (var o = [], i = 0; i < r.length; ++i) "undefined" != typeof r[i] && o.push(r[i]);
e.obj[e.prop] = o;
}
}
}, c = function(t, e) {
for (var r = e && e.plainObjects ? Object.create(null) : {}, o = 0; o < t.length; ++o) "undefined" != typeof t[o] && (r[o] = t[o]);
return r;
};
e.exports = {
arrayToObject: c,
assign: function(t, e) {
return Object.keys(e).reduce(function(t, r) {
t[r] = e[r];
return t;
}, t);
},
combine: function(t, e) {
return [].concat(t, e);
},
compact: function(t) {
for (var e = [ {
obj: {
o: t
},
prop: "o"
} ], r = [], o = 0; o < e.length; ++o) for (var n = e[o], i = n.obj[n.prop], c = Object.keys(i), a = 0; a < c.length; ++a) {
var l = c[a], u = i[l];
if ("object" == typeof u && null !== u && -1 === r.indexOf(u)) {
e.push({
obj: i,
prop: l
});
r.push(u);
}
}
s(e);
return t;
},
decode: function(t, e, r) {
var o = t.replace(/\+/g, " ");
if ("iso-8859-1" === r) return o.replace(/%[0-9a-f]{2}/gi, unescape);
try {
return decodeURIComponent(o);
} catch (t) {
return o;
}
},
encode: function(t, e, r) {
if (0 === t.length) return t;
var o = t;
"symbol" == typeof t ? o = Symbol.prototype.toString.call(t) : "string" != typeof t && (o = String(t));
if ("iso-8859-1" === r) return escape(o).replace(/%u[0-9a-f]{4}/gi, function(t) {
return "%26%23" + parseInt(t.slice(2), 16) + "%3B";
});
for (var n = "", s = 0; s < o.length; ++s) {
var c = o.charCodeAt(s);
if (45 === c || 46 === c || 95 === c || 126 === c || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122) n += o.charAt(s); else if (c < 128) n += i[c]; else if (c < 2048) n += i[192 | c >> 6] + i[128 | 63 & c]; else if (c < 55296 || c >= 57344) n += i[224 | c >> 12] + i[128 | c >> 6 & 63] + i[128 | 63 & c]; else {
s += 1;
c = 65536 + ((1023 & c) << 10 | 1023 & o.charCodeAt(s));
n += i[240 | c >> 18] + i[128 | c >> 12 & 63] + i[128 | c >> 6 & 63] + i[128 | 63 & c];
}
}
return n;
},
isBuffer: function(t) {
return !(!t || "object" != typeof t || !(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t)));
},
isRegExp: function(t) {
return "[object RegExp]" === Object.prototype.toString.call(t);
},
maybeMap: function(t, e) {
if (n(t)) {
for (var r = [], o = 0; o < t.length; o += 1) r.push(e(t[o]));
return r;
}
return e(t);
},
merge: function t(e, r, i) {
if (!r) return e;
if ("object" != typeof r) {
if (n(e)) e.push(r); else {
if (!e || "object" != typeof e) return [ e, r ];
(i && (i.plainObjects || i.allowPrototypes) || !o.call(Object.prototype, r)) && (e[r] = !0);
}
return e;
}
if (!e || "object" != typeof e) return [ e ].concat(r);
var s = e;
n(e) && !n(r) && (s = c(e, i));
if (n(e) && n(r)) {
r.forEach(function(r, n) {
if (o.call(e, n)) {
var s = e[n];
s && "object" == typeof s && r && "object" == typeof r ? e[n] = t(s, r, i) : e.push(r);
} else e[n] = r;
});
return e;
}
return Object.keys(r).reduce(function(e, n) {
var s = r[n];
o.call(e, n) ? e[n] = t(e[n], s, i) : e[n] = s;
return e;
}, s);
}
};
}, {} ],
12: [ function(t, e, r) {
(function(r) {
(function() {
var o = t("crypt"), n = t("charenc").utf8, i = t("charenc").bin, s = function(t) {
t.constructor == String ? t = n.stringToBytes(t) : "undefined" != typeof r && "function" == typeof r.isBuffer && r.isBuffer(t) ? t = Array.prototype.slice.call(t, 0) : Array.isArray(t) || (t = t.toString());
var e = o.bytesToWords(t), i = 8 * t.length, s = [], c = 1732584193, a = -271733879, l = -1732584194, u = 271733878, p = -1009589776;
e[i >> 5] |= 128 << 24 - i % 32;
e[15 + (i + 64 >>> 9 << 4)] = i;
for (var f = 0; f < e.length; f += 16) {
for (var h = c, d = a, y = l, g = u, m = p, b = 0; b < 80; b++) {
if (b < 16) s[b] = e[f + b]; else {
var v = s[b - 3] ^ s[b - 8] ^ s[b - 14] ^ s[b - 16];
s[b] = v << 1 | v >>> 31;
}
var w = (c << 5 | c >>> 27) + p + (s[b] >>> 0) + (b < 20 ? 1518500249 + (a & l | ~a & u) : b < 40 ? 1859775393 + (a ^ l ^ u) : b < 60 ? (a & l | a & u | l & u) - 1894007588 : (a ^ l ^ u) - 899497514);
p = u;
u = l;
l = a << 30 | a >>> 2;
a = c;
c = w;
}
c += h;
a += d;
l += y;
u += g;
p += m;
}
return [ c, a, l, u, p ];
}, c = function(t, e) {
var r = o.wordsToBytes(s(t));
return e && e.asBytes ? r : e && e.asString ? i.bytesToString(r) : o.bytesToHex(r);
};
c._blocksize = 16;
c._digestsize = 20;
e.exports = c;
})();
}).call(this, t("buffer").Buffer);
}, {
buffer: 2,
charenc: 5,
crypt: 6
} ],
Business: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "8e984fbnBdAYI6RizJOD+Ug", "Business");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, a = t("./ItemCell"), l = t("./ItemInfo"), u = t("./ListView"), p = t("./ListViewDelegate"), f = t("./PrinterManager"), h = t("./TitleCell"), d = t("./ItemCellSub"), y = t("./FinalPanel"), g = t("./TableIdxCtrlr"), m = t("./TimeUpdater"), b = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.printerMgr = null;
e.resDict = {};
e.listView = null;
e.titleCellPrefab = null;
e.itemCellPrefab = null;
e.subPrefab = null;
e.jumpBase = null;
e.navLbls = [];
e.curListIdx = 0;
e.curTitle = "商品";
e.itemList = [];
e.selectedItems = [];
e.confirm = null;
e.itemNumLbl = null;
e.finalPanel = null;
e.tableIdxCtrlr = null;
e.timer = null;
e.toastNode = null;
return e;
}
e.prototype.onLoad = function() {
for (var t = this, e = function(e) {
var o = r.navLbls[e].node;
o.on(cc.Node.EventType.TOUCH_START, function() {
o.color = cc.color(150, 150, 150);
});
o.on(cc.Node.EventType.TOUCH_END, function() {
o.color = cc.color(220, 220, 220);
t.turnList(e);
});
o.on(cc.Node.EventType.TOUCH_CANCEL, function() {
o.color = cc.color(220, 220, 220);
});
}, r = this, o = 0; o < this.navLbls.length; o++) e(o);
this.confirm.node.on(cc.Node.EventType.TOUCH_END, this.onConfirm.bind(this));
this.finalPanel.init(this);
cc.loader.loadResDir("items", cc.SpriteFrame, function(e, r, o) {
for (var n = 0; n < r.length; n++) {
var i = r[n], s = o[n].split("/")[1];
t.resDict[s] = i;
cc.log("^_^!---", s);
}
t.turnList(0);
});
};
e.prototype.turnList = function(t) {
this.curListIdx = t;
for (var e = 0, r = this.navLbls; e < r.length; e++) {
var o = r[e];
o.node.color = cc.color(220, 220, 220);
o.node.resumeSystemEvents(!0);
}
var n = this.navLbls[t];
this.curTitle = n.string;
n.node.color = cc.color(222, 181, 75);
n.node.pauseSystemEvents(!0);
for (var i = [], s = 0, c = l.itemInfos; s < c.length; s++) {
var a = c[s];
a.sort === t && i.push(a);
}
this.itemList = i;
this.listView.resetContent();
};
e.prototype.numberOfRows = function(t) {
return Math.ceil(this.itemList.length / 3) + 1;
};
e.prototype.heightForRow = function(t, e) {
return 0 === e ? 103 : 355;
};
e.prototype.cellIdForRow = function(t, e) {
return 0 === e ? "t" : "i";
};
e.prototype.createCellForRow = function(t, e, r) {
if ("t" === r) {
return o = cc.instantiate(this.titleCellPrefab).getComponent(h.TitleCell);
}
var o;
(o = cc.instantiate(this.itemCellPrefab).getComponent(a.ItemCell)).init();
o.onClickSub = this.onClickSubCell.bind(this);
return o;
};
e.prototype.setCellForRow = function(t, e, r) {
if (0 === e) r.setData(this.curTitle); else {
var o = 3 * (e - 1);
this.setItemCellData(r, 0, o);
this.setItemCellData(r, 1, o + 1);
this.setItemCellData(r, 2, o + 2);
}
};
e.prototype.setItemCellData = function(t, e, r) {
var o = this.itemList[r];
cc.log("^_^!data", e, r, o);
o ? t.setData(e, r, this.resDict[o.imgName], o.name, o.price) : t.setData(e, r, null, null, 0);
};
e.prototype.onClickSubCell = function(t, e) {
for (var r = this.itemList[t], o = !1, n = 0, i = this.selectedItems; n < i.length; n++) {
var s = i[n];
if (s.data === r) {
s.count++;
o = !0;
break;
}
}
o || this.selectedItems.push({
count: 1,
data: r
});
var c = cc.instantiate(this.subPrefab), a = e.convertToWorldSpaceAR(cc.v2(-540, -960));
c.position = cc.v3(a);
this.jumpBase.addChild(c);
cc.log("click cell: ", t, a.x, a.y);
var l = function(t) {
t.groupIndex = 2;
for (var e = 0, r = t.children; e < r.length; e++) {
var o = r[e];
l(o);
}
};
l(c);
var u = c.getComponent(d.ItemCellSub);
u.sp.spriteFrame = this.resDict[r.imgName];
u.itemName.string = r.name;
u.price.string = "￥" + String(r.price);
c.runAction(cc.sequence(cc.spawn(cc.jumpTo(.6, 280, -760, 400, 1), cc.scaleTo(.6, .2)), cc.callFunc(function() {
setTimeout(function() {
c.removeFromParent();
c.destroy();
});
})));
};
e.prototype.update = function() {
this.checkSelectedItemNum();
};
e.prototype.checkSelectedItemNum = function() {
for (var t = 0, e = 0, r = this.selectedItems; e < r.length; e++) {
t += r[e].count;
}
if (0 === t) this.itemNumLbl.node.parent.opacity = 0; else {
this.itemNumLbl.string = String(t > 99 ? 99 : t);
this.itemNumLbl.node.parent.opacity = 255;
}
};
e.prototype.onConfirm = function() {
this.selectedItems.length <= 0 ? this.popToast("亲，您选的是寂寞吗~~") : this.finalPanel.show();
};
e.prototype.send = function() {
var t = "\n桌号 ##号<BR>\n\n产品种类　　　     单价     数量<BR>\n--------------------------------<BR>\nVV\n--------------------------------<BR>\n合计：$$元<BR>\n<BR>\n订餐时间：%%<BR><BR>\n";
t = (t = (t = (t = t.replace("##", String(this.tableIdxCtrlr.idx))).replace("$$", String(this.getTotal()))).replace("%%", this.timer.getCurTimeStr())).replace("VV", this.getItemsStr());
this.print(t);
this.popToast("订单已提交，\n请您稍等一下，我们尽快为您准备~");
this.clear();
};
e.prototype.getTotal = function() {
for (var t = 0, e = 0, r = this.selectedItems; e < r.length; e++) {
var o = r[e];
t += o.count * o.data.price;
}
return t;
};
e.prototype.getItemsStr = function() {
for (var t = "", e = 0, r = this.selectedItems; e < r.length; e++) {
var o = r[e], n = "";
n += o.data.name;
for (var i = 14 - this.getStringLen(o.data.name), s = 0; s < i; s++) n += " ";
n += "     ";
var c = String(o.data.price);
n += c;
n += 1 === c.length ? "        " : "       ";
n += String(o.count);
t += n += "<BR>\n";
}
return t;
};
e.prototype.getStringLen = function(t) {
for (var e = 0, r = 0; r < t.length; r++) t.charCodeAt(r) > 1e4 ? e += 2 : e += 1;
return e;
};
e.prototype.clear = function() {
this.selectedItems.length = 0;
};
e.prototype.popToast = function(t) {
this.toastNode.getComponentInChildren(cc.Label).string = t;
this.toastNode.stopAllActions();
cc.tween(this.toastNode).to(.3, {
opacity: 255
}).delay(3).to(.3, {
opacity: 0
}).start();
};
e.prototype.addPrinter = function() {
this.printerMgr.addPrinter();
};
e.prototype.print = function(t) {
cc.log("print: ", t);
this.printerMgr.print(t);
};
n([ c(f.default) ], e.prototype, "printerMgr", void 0);
n([ c(u.ListView) ], e.prototype, "listView", void 0);
n([ c(cc.Prefab) ], e.prototype, "titleCellPrefab", void 0);
n([ c(cc.Prefab) ], e.prototype, "itemCellPrefab", void 0);
n([ c(cc.Prefab) ], e.prototype, "subPrefab", void 0);
n([ c(cc.Node) ], e.prototype, "jumpBase", void 0);
n([ c([ cc.Label ]) ], e.prototype, "navLbls", void 0);
n([ c(cc.Button) ], e.prototype, "confirm", void 0);
n([ c(cc.Label) ], e.prototype, "itemNumLbl", void 0);
n([ c(y.default) ], e.prototype, "finalPanel", void 0);
n([ c(g.default) ], e.prototype, "tableIdxCtrlr", void 0);
n([ c(m.default) ], e.prototype, "timer", void 0);
n([ c(cc.Node) ], e.prototype, "toastNode", void 0);
return e = n([ s ], e);
}(p.ListViewDelegate);
r.default = b;
cc._RF.pop();
}, {
"./FinalPanel": "FinalPanel",
"./ItemCell": "ItemCell",
"./ItemCellSub": "ItemCellSub",
"./ItemInfo": "ItemInfo",
"./ListView": "ListView",
"./ListViewDelegate": "ListViewDelegate",
"./PrinterManager": "PrinterManager",
"./TableIdxCtrlr": "TableIdxCtrlr",
"./TimeUpdater": "TimeUpdater",
"./TitleCell": "TitleCell"
} ],
DataModel: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "12ec3JbykdJzJuv2dMGY8g5", "DataModel");
Object.defineProperty(r, "__esModule", {
value: !0
});
var o = function() {
return function() {};
}();
r.ItemInfo = o;
cc._RF.pop();
}, {} ],
FinalCell: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "0381fhPUXBE55zh/oF9+Osy", "FinalCell");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = t("./ListViewCell"), s = cc._decorator, c = s.ccclass, a = s.property, l = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.nameLbl = null;
e.priceLbl = null;
e.countLbl = null;
e.addBtn = null;
e.rdcBtn = null;
e.delBtn = null;
e.addCallback = null;
e.rdcCallback = null;
e.delCallback = null;
return e;
}
e.prototype.onLoad = function() {
t.prototype.onLoad.call(this);
0;
this.addBtn.node.on("click", this.onAdd.bind(this));
this.rdcBtn.node.on("click", this.onRdc.bind(this));
this.delBtn.node.on("click", this.onDel.bind(this));
};
e.prototype.setData = function(t) {
this.nameLbl.string = t.data.name;
this.priceLbl.string = "￥" + String(t.data.price);
this.countLbl.string = String(t.count);
};
e.prototype.onAdd = function() {
this.addCallback(this.curCellIdx);
};
e.prototype.onRdc = function() {
this.rdcCallback(this.curCellIdx);
};
e.prototype.onDel = function() {
this.delCallback(this.curCellIdx);
};
n([ a(cc.Label) ], e.prototype, "nameLbl", void 0);
n([ a(cc.Label) ], e.prototype, "priceLbl", void 0);
n([ a(cc.Label) ], e.prototype, "countLbl", void 0);
n([ a(cc.Button) ], e.prototype, "addBtn", void 0);
n([ a(cc.Button) ], e.prototype, "rdcBtn", void 0);
n([ a(cc.Button) ], e.prototype, "delBtn", void 0);
return e = n([ c ], e);
}(i.ListViewCell);
r.FinalCell = l;
cc._RF.pop();
}, {
"./ListViewCell": "ListViewCell"
} ],
FinalPanel: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "2c430HXeH5D/b2Yq67rqtvJ", "FinalPanel");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, a = t("./ListView"), l = t("./ListViewDelegate"), u = t("./FinalCell"), p = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.btn = null;
e.closeBtn = null;
e.listView = null;
e.totalStr = null;
e.finalCellPrefab = null;
e.mask = null;
e.pop = null;
e.popConfirm = null;
e.popBack = null;
e.business = null;
return e;
}
e.prototype.onLoad = function() {
var t = this;
this.node.on(cc.Node.EventType.TOUCH_END, function() {
t.hide();
});
this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, function() {
t.hide();
});
this.btn.node.on(cc.Node.EventType.TOUCH_END, function() {
if (t.business.selectedItems.length <= 0) t.business.popToast("好像并没有商品呀\n请再确认下哈"); else {
t.pop.scaleX = 1;
t.pop.opacity = 255;
}
});
this.popConfirm.on(cc.Node.EventType.TOUCH_END, function() {
t.business.send();
t.pop.scaleX = 0;
t.pop.opacity = 0;
t.hide();
});
this.popBack.on(cc.Node.EventType.TOUCH_END, function() {
t.pop.scaleX = 0;
t.pop.opacity = 0;
});
};
e.prototype.init = function(t) {
this.business = t;
};
e.prototype.show = function() {
this.node.scaleX = 1;
this.node.opacity = 255;
this.listView.resetContent();
this.mask.stopAllActions();
cc.tween(this.mask).to(.3, {
opacity: 125
}).start();
};
e.prototype.hide = function() {
this.node.scaleX = 0;
this.node.opacity = 0;
this.mask.stopAllActions();
cc.tween(this.mask).to(.3, {
opacity: 0
}).start();
};
e.prototype.update = function() {
if (this.node.scaleX > 0) {
for (var t = 0, e = 0, r = this.business.selectedItems; e < r.length; e++) {
var o = r[e];
t += o.count * o.data.price;
}
this.totalStr.string = "总价：￥" + String(t);
}
};
e.prototype.numberOfRows = function(t) {
return this.business.selectedItems.length;
};
e.prototype.cellIdForRow = function(t, e) {
return "i";
};
e.prototype.createCellForRow = function(t, e, r) {
var o = cc.instantiate(this.finalCellPrefab).getComponent(u.FinalCell);
o.addCallback = this.add.bind(this);
o.rdcCallback = this.rdc.bind(this);
o.delCallback = this.del.bind(this);
return o;
};
e.prototype.setCellForRow = function(t, e, r) {
r.setData(this.business.selectedItems[e]);
};
e.prototype.add = function(t) {
var e = this.business.selectedItems[t];
e.count = Math.min(9, e.count + 1);
this.listView.resetContent(!0);
};
e.prototype.rdc = function(t) {
var e = this.business.selectedItems[t];
e.count = Math.max(1, e.count - 1);
this.listView.resetContent(!0);
};
e.prototype.del = function(t) {
this.business.selectedItems.splice(t, 1);
this.listView.resetContent(!0);
};
n([ c(cc.Button) ], e.prototype, "btn", void 0);
n([ c(cc.Button) ], e.prototype, "closeBtn", void 0);
n([ c(a.ListView) ], e.prototype, "listView", void 0);
n([ c(cc.Label) ], e.prototype, "totalStr", void 0);
n([ c(cc.Prefab) ], e.prototype, "finalCellPrefab", void 0);
n([ c(cc.Node) ], e.prototype, "mask", void 0);
n([ c(cc.Node) ], e.prototype, "pop", void 0);
n([ c(cc.Node) ], e.prototype, "popConfirm", void 0);
n([ c(cc.Node) ], e.prototype, "popBack", void 0);
return e = n([ s ], e);
}(l.ListViewDelegate);
r.default = p;
cc._RF.pop();
}, {
"./FinalCell": "FinalCell",
"./ListView": "ListView",
"./ListViewDelegate": "ListViewDelegate"
} ],
ItemCellSub: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "fdc1bM/5T5A+YPbyHVodMZo", "ItemCellSub");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.sp = null;
e.itemName = null;
e.price = null;
return e;
}
n([ c(cc.Sprite) ], e.prototype, "sp", void 0);
n([ c(cc.Label) ], e.prototype, "itemName", void 0);
n([ c(cc.Label) ], e.prototype, "price", void 0);
return e = n([ s ], e);
}(cc.Component);
r.ItemCellSub = a;
cc._RF.pop();
}, {} ],
ItemCell: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "1dfd1INNN9KA6rLeFaHcl3O", "ItemCell");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = t("./ListViewCell"), s = t("./ItemCellSub"), c = cc._decorator, a = c.ccclass, l = c.property, u = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.subPrefab = null;
e.sub0 = null;
e.sub1 = null;
e.sub2 = null;
e.subList = [];
e.dataIdx = 0;
return e;
}
e.prototype.init = function() {
var t = cc.instantiate(this.subPrefab);
t.parent = this.sub0;
this.subList.push(t.getComponent(s.ItemCellSub));
var e = cc.instantiate(this.subPrefab);
e.parent = this.sub1;
this.subList.push(e.getComponent(s.ItemCellSub));
var r = cc.instantiate(this.subPrefab);
r.parent = this.sub2;
this.subList.push(r.getComponent(s.ItemCellSub));
};
e.prototype.setData = function(t, e, r, o, n) {
var i = this, s = this.subList[t];
if (r) {
s.node.opacity = 255;
s.node.scaleX = 1;
s.sp.spriteFrame = r;
s.itemName.string = o;
s.price.string = "￥" + String(n);
s.node.targetOff(s.node);
s.node.on(cc.Node.EventType.TOUCH_END, function() {
i.onClickSub(e, s.node);
}, s.node);
} else {
s.node.opacity = 0;
s.node.scaleX = 0;
}
this.dataIdx = e;
};
e.prototype.onClickSub = function(t, e) {};
n([ l(cc.Prefab) ], e.prototype, "subPrefab", void 0);
n([ l(cc.Node) ], e.prototype, "sub0", void 0);
n([ l(cc.Node) ], e.prototype, "sub1", void 0);
n([ l(cc.Node) ], e.prototype, "sub2", void 0);
return e = n([ a ], e);
}(i.ListViewCell);
r.ItemCell = u;
cc._RF.pop();
}, {
"./ItemCellSub": "ItemCellSub",
"./ListViewCell": "ListViewCell"
} ],
ItemInfo: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "b6b4b85bhtCp7rdoJeWxK4P", "ItemInfo");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.itemInfos = [ {
id: "meishikafei_",
sort: 0,
name: "美式咖啡",
price: 20,
imgName: "meishikafei_"
}, {
id: "natie_",
sort: 0,
name: "拿铁",
price: 22,
imgName: "natie_"
}, {
id: "mochanatie_",
sort: 0,
name: "抹茶拿铁",
price: 24,
imgName: "mochanatie_"
}, {
id: "xiangcaonatie_",
sort: 0,
name: "香草拿铁",
price: 24,
imgName: "xiangcaonatie_"
}, {
id: "jiaotangmaqiduo_",
sort: 0,
name: "焦糖玛奇朵",
price: 24,
imgName: "jiaotangmaqiduo_"
}, {
id: "kabuqinuo_",
sort: 0,
name: "卡布奇诺",
price: 22,
imgName: "kabuqinuo_"
}, {
id: "moka_",
sort: 0,
name: "摩卡",
price: 26,
imgName: "moka_"
}, {
id: "reniunai_",
sort: 0,
name: "热牛奶",
price: 15,
imgName: "reniunai_"
}, {
id: "qiaokeli_",
sort: 0,
name: "巧克力",
price: 22,
imgName: "qiaokeli_"
}, {
id: "mmihoutao_",
sort: 1,
name: "猕猴桃",
price: 26,
imgName: "mmihoutao_"
}, {
id: "chengzhi_",
sort: 1,
name: "橙汁",
price: 24,
imgName: "chengzhi_"
}, {
id: "xiangjiaoniunai_",
sort: 1,
name: "香蕉牛奶",
price: 24,
imgName: "xiangjiaoniunai_"
}, {
id: "baixiangguo_",
sort: 1,
name: "百香果",
price: 24,
imgName: "baixiangguo_"
}, {
id: "xihongshi_",
sort: 1,
name: "西红柿",
price: 20,
imgName: "xihongshi_"
}, {
id: "mangguobingsha_",
sort: 1,
name: "芒果冰沙",
price: 26,
imgName: "mangguobingsha_"
}, {
id: "hongyoubingsha_",
sort: 1,
name: "红柚冰沙",
price: 26,
imgName: "hongyoubingsha_"
}, {
id: "youzicha_",
sort: 2,
name: "柚子茶",
price: 20,
imgName: "youzicha_"
}, {
id: "wuweizicha_",
sort: 2,
name: "五味子茶",
price: 25,
imgName: "wuweizicha_"
}, {
id: "shengjiangcha_",
sort: 2,
name: "生姜茶",
price: 20,
imgName: "shengjiangcha_"
}, {
id: "ningmengcha_",
sort: 2,
name: "柠檬茶",
price: 20,
imgName: "ningmengcha_"
}, {
id: "wubaotea_",
sort: 2,
name: "五宝茶（一壶）",
price: 52,
imgName: "wubaotea_"
}, {
id: "xiaoqinggantea_",
sort: 2,
name: "小青柑（一壶）",
price: 52,
imgName: "xiaoqinggantea_"
}, {
id: "puertea_",
sort: 2,
name: "普洱茶（一壶）",
price: 52,
imgName: "puertea_"
}, {
id: "hongtea_",
sort: 2,
name: "红茶（一壶）",
price: 52,
imgName: "hongtea_"
}, {
id: "kuangquanshui_",
sort: 3,
name: "矿泉水",
price: 3,
imgName: "kuangquanshui_"
}, {
id: "kele_",
sort: 3,
name: "可乐",
price: 5,
imgName: "kele_"
}, {
id: "xuebi_",
sort: 3,
name: "雪碧",
price: 5,
imgName: "xuebi_"
}, {
id: "meinianda_",
sort: 3,
name: "美年达",
price: 5,
imgName: "meinianda_"
}, {
id: "binghongcha_",
sort: 3,
name: "冰红茶",
price: 5,
imgName: "binghongcha_"
}, {
id: "binglvcha_",
sort: 3,
name: "冰绿茶",
price: 5,
imgName: "binglvcha_"
}, {
id: "shuijingputao_",
sort: 3,
name: "水晶葡萄",
price: 5,
imgName: "shuijingputao_"
}, {
id: "hongniu_",
sort: 3,
name: "红牛",
price: 8,
imgName: "hongniu_"
}, {
id: "kaochang_",
sort: 4,
name: "烤肠（两根）",
price: 12,
imgName: "kaochang_"
}, {
id: "mingtaiyu_",
sort: 4,
name: "明太鱼",
price: 25,
imgName: "mingtaiyu_"
}, {
id: "youzhataocan_",
sort: 4,
name: "油炸套餐",
price: 38,
imgName: "youzhataocan_"
}, {
id: "xinlamian_",
sort: 4,
name: "辛拉面",
price: 12,
imgName: "xinlamian_"
}, {
id: "shuijiao_",
sort: 4,
name: "水饺",
price: 15,
imgName: "shuijiao_"
} ];
cc._RF.pop();
}, {} ],
ListViewCell: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "79e009C/xdC57QCCPF8u8fd", "ListViewCell");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = (i.property, i.executeInEditMode), a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.curCellIdx = -1;
return e;
}
e.prototype.onLoad = function() {
0;
this.node.on("click", this.onClick, this);
};
e.prototype.check = function() {
cc.assert(this.node._prefab.root === this.node, "cell脚本需要放在prefab的根节点");
this.node.name = this.node._prefab.asset.name;
var t = cc.js.getClassName(this.__proto__.constructor);
cc.assert(this.node.name === t, "cell的prefab要和class名称一致");
this.node.anchorX = 0;
this.node.anchorY = 1;
this.node.width = 1080;
0 === this.node.height && (this.node.height = 200);
this.node.x = 0;
this.node.y = 0;
this.checkBake();
};
e.prototype.checkBake = function() {
var t = this.node.getChildByName("root");
if (!t) {
(t = new cc.Node("root")).parent = this.node;
(r = t.addComponent(cc.Widget)).isAlignTop = !0;
r.isAlignBottom = !0;
r.isAlignLeft = !0;
r.isAlignRight = !0;
r.top = 0;
r.bottom = 0;
r.left = 0;
r.right = 0;
}
var e = this.node.getChildByName("bake");
if (!e) {
(e = new cc.Node("bake")).parent = this.node;
var r;
(r = e.addComponent(cc.Widget)).isAlignTop = !0;
r.isAlignBottom = !0;
r.isAlignLeft = !0;
r.isAlignRight = !0;
r.top = 0;
r.bottom = 0;
r.left = 0;
r.right = 0;
}
for (var o = 0, n = this.node.children; o < n.length; o++) {
var i = n[o];
i !== t && i !== e && cc.error("cell根节点下只能有root和bake");
}
};
e.prototype.onClick = function() {};
return e = n([ s, c ], e);
}(cc.Component);
r.ListViewCell = a;
cc._RF.pop();
}, {} ],
ListViewDelegate: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "938a1pVVBBGpZTBFF3CqsGQ", "ListViewDelegate");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = (i.property, function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.heightForRow = function(t, e) {
return 0;
};
return e = n([ s ], e);
}(cc.Component));
r.ListViewDelegate = c;
cc._RF.pop();
}, {} ],
ListView: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "e26eeF62vFG1Le8Bob1mfRl", "ListView");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, a = i.requireComponent, l = t("./ListViewDelegate"), u = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.delegate = null;
e.fixedHeight = 0;
e.scrollView = null;
e.content = null;
e.rowCount = 0;
e.disTopRowIdx = 0;
e.disBtmRowIdx = 0;
e.disTopRowPos = 0;
e.disBtmRowPos = 0;
e.disTopRowH = 0;
e.disBtmRowH = 0;
e.disCellDataDict = {};
e.reuseCellsDict = {};
e._touching = !1;
return e;
}
Object.defineProperty(e.prototype, "touching", {
get: function() {
return this._touching;
},
enumerable: !0,
configurable: !0
});
e.prototype.onLoad = function() {
cc.assert(this.delegate, "未指定代理");
this.scrollView = this.getComponent(cc.ScrollView);
this.content = this.scrollView.content;
this.node.on("scrolling", this.onScrolling.bind(this));
var t = this, e = this.scrollView.verticalScrollBar._setOpacity;
this.scrollView.verticalScrollBar._setOpacity = function(r) {
this.node && (t._touching || r <= this.node.opacity) && e.call(this, r);
};
var r = this.scrollView._handlePressLogic, o = this.scrollView._handleReleaseLogic;
this.scrollView._handlePressLogic = function(e) {
r.call(this, e);
t._touching = !0;
};
this.scrollView._handleReleaseLogic = function(e) {
o.call(this, e);
t._touching = !1;
};
};
e.prototype.createContent = function(t) {
void 0 === t && (t = 0);
this.rowCount = this.delegate.numberOfRows(this);
this.content.height = this.getHeight(this.rowCount);
this.content.y = t;
var e = this.calcDisplayArea(), r = e.disTop, o = e.disBtm;
if (this.fixedHeight > 0) {
this.disTopRowIdx = Math.max(Math.floor(r / this.fixedHeight), 0);
this.disBtmRowIdx = Math.min(Math.floor(o / this.fixedHeight), this.rowCount - 1);
this.disTopRowPos = this.disTopRowIdx * this.fixedHeight;
this.disBtmRowPos = this.disBtmRowIdx * this.fixedHeight;
this.disTopRowH = this.fixedHeight;
this.disBtmRowH = this.fixedHeight;
for (var n = this.disTopRowIdx; n <= this.disBtmRowIdx; n++) {
var i = this.getUnusedCellData(n);
this.setCellPos(i.cell, n * this.fixedHeight);
this.disCellDataDict[n] = i;
}
} else {
this.disTopRowIdx = 0;
this.disBtmRowIdx = this.rowCount - 1;
var s = !1, c = 0;
for (n = 0; n < this.rowCount; n++) {
var a = this.delegate.heightForRow(this, n), l = c + a;
if (l > r && !s) {
this.disTopRowIdx = n;
this.disTopRowPos = c;
this.disTopRowH = a;
s = !0;
}
if (s) {
i = this.getUnusedCellData(n);
this.setCellPos(i.cell, c);
this.disCellDataDict[n] = i;
}
if (l >= o) {
this.disBtmRowIdx = n;
this.disBtmRowPos = c;
this.disBtmRowH = a;
break;
}
c = l;
}
}
};
e.prototype.getHeight = function(t) {
var e = 0;
if (this.fixedHeight > 0) e = this.fixedHeight * t; else for (var r = 0; r < t; r++) e += this.delegate.heightForRow(this, r);
return e;
};
e.prototype.clearContent = function() {
this.scrollView.stopAutoScroll();
for (var t in this.disCellDataDict) if (this.disCellDataDict.hasOwnProperty(t)) {
var e = this.disCellDataDict[t];
this.reclaimCell(e, t);
}
this.disCellDataDict = {};
this.rowCount = 0;
this.content.y = 0;
this.content.height = 0;
this.disTopRowIdx = 0;
this.disBtmRowIdx = 0;
this.disTopRowPos = 0;
this.disBtmRowPos = 0;
this.disTopRowH = 0;
this.disBtmRowH = 0;
};
e.prototype.resetContent = function(t) {
void 0 === t && (t = !1);
var e = t ? this.content.y : 0;
this.clearContent();
this.createContent(e);
};
e.prototype.onScrolling = function() {
var t = this.calcDisplayArea(), e = t.disTop, r = t.disBtm;
this.updateDisTopRowData(e);
this.updateDisBtmRowData(r);
};
e.prototype.updateDisTopRowData = function(t) {
if (t < this.disTopRowPos) {
if (this.disTopRowIdx > 0) {
this.disTopRowIdx--;
this.disTopRowH = this.getRowHeightOnScrolling(this.disTopRowIdx);
this.disTopRowPos -= this.disTopRowH;
var e = this.getUnusedCellData(this.disTopRowIdx);
this.setCellPos(e.cell, this.disTopRowPos);
this.disCellDataDict[this.disTopRowIdx] = e;
return this.updateDisTopRowData(t);
}
} else if (this.disTopRowPos + this.disTopRowH <= t && this.disTopRowIdx < this.rowCount - 1) {
e = this.disCellDataDict[this.disTopRowIdx];
this.reclaimCell(e, this.disTopRowIdx);
delete this.disCellDataDict[this.disTopRowIdx];
this.disTopRowIdx++;
this.disTopRowPos += this.disTopRowH;
this.disTopRowH = this.getRowHeightOnScrolling(this.disTopRowIdx);
return this.updateDisTopRowData(t);
}
};
e.prototype.updateDisBtmRowData = function(t) {
if (t <= this.disBtmRowPos) {
if (this.disBtmRowIdx > 0) {
var e = this.disCellDataDict[this.disBtmRowIdx];
this.reclaimCell(e, this.disBtmRowIdx);
delete this.disCellDataDict[this.disBtmRowIdx];
this.disBtmRowIdx--;
this.disBtmRowH = this.getRowHeightOnScrolling(this.disBtmRowIdx);
this.disBtmRowPos -= this.disBtmRowH;
return this.updateDisBtmRowData(t);
}
} else if (this.disBtmRowPos + this.disBtmRowH < t && this.disBtmRowIdx < this.rowCount - 1) {
this.disBtmRowIdx++;
this.disBtmRowPos += this.disBtmRowH;
this.disBtmRowH = this.getRowHeightOnScrolling(this.disBtmRowIdx);
e = this.getUnusedCellData(this.disBtmRowIdx);
this.setCellPos(e.cell, this.disBtmRowPos);
this.disCellDataDict[this.disBtmRowIdx] = e;
return this.updateDisBtmRowData(t);
}
};
e.prototype.getRowHeightOnScrolling = function(t) {
return this.fixedHeight > 0 ? this.fixedHeight : this.delegate.heightForRow(this, t);
};
e.prototype.calcDisplayArea = function() {
var t = this.content.y, e = t + this.node.height;
if (e > this.content.height) {
var r = e - this.content.height;
if (r < t) {
t -= r;
e -= r;
} else {
t = 0;
e = this.node.height;
}
this.content.y = t;
}
return {
disTop: t,
disBtm: e
};
};
e.prototype.setCellPos = function(t, e) {
t.node.y = -e;
};
e.prototype.getUnusedCellData = function(t) {
var e = this.delegate.cellIdForRow(this, t);
cc.assert(e, "cellIdForRow获取cell id不成功：" + t);
this.reuseCellsDict.hasOwnProperty(e) || (this.reuseCellsDict[e] = []);
var r = this.reuseCellsDict[e], o = null;
if (0 === r.length) {
o = this.delegate.createCellForRow(this, t, e);
cc.assert(o, "创建cell没有成功：" + t + ", " + e);
o.node.parent = this.content;
} else (o = r.pop()).node.active = !0;
o.curCellIdx = t;
this.delegate.setCellForRow(this, t, o);
return {
cell: o,
id: e
};
};
e.prototype.reclaimCell = function(t, e) {
t.cell.node.active = !1;
var r = t.id;
this.reuseCellsDict.hasOwnProperty(r) || (this.reuseCellsDict[r] = []);
this.reuseCellsDict[r].push(t.cell);
};
e.prototype.isScrolling = function() {
return this.scrollView.isScrolling() || this.scrollView.isAutoScrolling();
};
n([ c(l.ListViewDelegate) ], e.prototype, "delegate", void 0);
n([ c({
tooltip: "0为不固定宽度，使用delegate的heightForRow指定"
}) ], e.prototype, "fixedHeight", void 0);
return e = n([ s, a(cc.ScrollView) ], e);
}(cc.Component);
r.ListView = u;
cc._RF.pop();
}, {
"./ListViewDelegate": "ListViewDelegate"
} ],
PageCtrlr: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "d3b69wNgn9C14h168E1R4IO", "PageCtrlr");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.page2 = null;
return e;
}
e.prototype.showPage2 = function() {
this.page2.opacity = 255;
this.page2.scaleX = 1;
};
e.prototype.closePage2 = function() {
this.page2.opacity = 0;
this.page2.scaleX = 0;
};
n([ c(cc.Node) ], e.prototype, "page2", void 0);
return e = n([ s ], e);
}(cc.Component);
r.default = a;
cc._RF.pop();
}, {} ],
PrinterManager: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "e1b90/rohdEk4SdmmEZANaD", "PrinterManager");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = (i.property, t("sha1")), a = t("qs"), l = "466041061@qq.com", u = "9D9L7DjcFtPLUsAr", p = "http://api.feieyun.cn:80/Api/Open/", f = "921576976";
function h() {
return Math.floor(new Date().getTime() / 1e3);
}
function d(t) {
return c(l + u + t);
}
var y = function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.addPrinter = function() {
var t = h(), e = {
user: l,
stime: t,
sig: d(String(t)),
apiname: "Open_printerAddlist",
printerContent: "921576976#bq8b48v6#QiFengPool"
}, r = a.stringify(e);
this.send(r, function(t) {
cc.log("add printer rzt: ", t);
});
};
e.prototype.print = function(t) {
var e = h(), r = {
user: l,
stime: e,
sig: d(String(e)),
apiname: "Open_printMsg",
sn: f,
content: t,
times: "1"
}, o = a.stringify(r);
this.send(o, function(t) {
cc.log("print rzt: ", t);
});
};
e.prototype.send = function(t, e) {
var r = cc.loader.getXMLHttpRequest();
r.open("POST", p);
r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
r.timeout = 1e5;
[ "abort", "error", "timeout" ].forEach(function(t) {
r["on" + t] = function() {
cc.log("****** http error! eventname:", t);
};
});
r.onreadystatechange = function() {
cc.log("readyState == ", r.readyState, r.status);
if (4 === r.readyState && 200 === r.status) {
var t = r.response;
e && e(t);
}
};
cc.log("HTTP url:", p);
cc.log("HTTP send:", t);
r.send(t);
};
return e = n([ s ], e);
}(cc.Component);
r.default = y;
cc._RF.pop();
}, {
qs: 8,
sha1: 12
} ],
ScoreIndicator: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "00147fOKdVGmKKVH1aHjSLU", "ScoreIndicator");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.scoreBtns = [];
e.totalScoreBtns = [];
e.scoreLbls = [];
e.scoreLblUps = [];
e.scoreLblDowns = [];
e.scoreLblUp2s = [];
e.scoreLblDown2s = [];
e.totalScoreLbls = [];
e.totalScoreLblUps = [];
e.totalScoreLblDowns = [];
e.totalScoreLblUp2s = [];
e.totalScoreLblDown2s = [];
e.scoreNums = [ 0, 0 ];
e.totalScoreNums = [ 0, 0 ];
e.running = !1;
return e;
}
e.prototype.onLoad = function() {
this.setBtn(this.scoreBtns[0], this.scoreNums, 0, this.scoreLblUps[0], this.scoreLblDowns[0], this.scoreLblUp2s[0], this.scoreLblDown2s[0]);
this.setBtn(this.scoreBtns[1], this.scoreNums, 1, this.scoreLblUps[1], this.scoreLblDowns[1], this.scoreLblUp2s[1], this.scoreLblDown2s[1]);
this.setBtn(this.totalScoreBtns[0], this.totalScoreNums, 0, this.totalScoreLblUps[0], this.totalScoreLblDowns[0], this.totalScoreLblUp2s[0], this.totalScoreLblDown2s[0]);
this.setBtn(this.totalScoreBtns[1], this.totalScoreNums, 1, this.totalScoreLblUps[1], this.totalScoreLblDowns[1], this.totalScoreLblUp2s[1], this.totalScoreLblDown2s[1]);
this.scoreLblUps.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.scoreLblDowns.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.totalScoreLblUps.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.totalScoreLblDowns.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.scoreLblUp2s.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.scoreLblDown2s.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.totalScoreLblUp2s.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.totalScoreLblDown2s.forEach(function(t) {
return t.node.parent.opacity = 0;
});
this.resetUI();
};
e.prototype.setBtn = function(t, e, r, o, n, i, s) {
var c = this, a = !1;
t.on(cc.Node.EventType.TOUCH_START, function(t) {
a = !1;
});
t.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
if (!a && !c.running) {
var l = t.getLocationY() - t.getStartLocation().y;
if (l > 100) {
a = !0;
var u = e[r];
e[r] = Math.min(e[r] + 1, 99);
c.resetUI(1, u, e[r], o, n, i, s);
} else if (l < -100) {
a = !0;
u = e[r];
e[r] = Math.max(e[r] - 1, 0);
c.resetUI(-1, u, e[r], o, n, i, s);
}
}
});
};
e.prototype.clear = function(t) {
if (!this.running) {
this.scoreNums[0] = 0;
this.scoreNums[1] = 0;
this.totalScoreNums[0] = 0;
this.totalScoreNums[1] = 0;
this.resetUI(0);
}
};
e.prototype.resetUI = function(t, e, r, o, n, i, s) {
var c = this;
void 0 === t && (t = 0);
void 0 === e && (e = 0);
void 0 === r && (r = 0);
void 0 === o && (o = null);
void 0 === n && (n = null);
void 0 === i && (i = null);
void 0 === s && (s = null);
if (e !== r) {
if (t > 0) {
o.node.parent.opacity = 255;
o.node.parent.scaleY = 1;
o.string = String(e);
i.node.parent.opacity = 255;
i.node.parent.scaleY = 0;
i.string = String(r);
n.node.parent.opacity = 255;
n.node.parent.scaleY = 1;
n.string = String(r);
s.node.parent.opacity = 255;
s.node.parent.scaleY = 1;
s.string = String(e);
this.running = !0;
cc.tween(s.node.parent).to(.1, {
scaleY: 0
}).start();
cc.tween(i.node.parent).delay(.1).to(.1, {
scaleY: 1
}).call(function() {
o.node.parent.opacity = 0;
i.node.parent.opacity = 0;
n.node.parent.opacity = 0;
s.node.parent.opacity = 0;
c.running = !1;
}).start();
} else if (t < 0) {
o.node.parent.opacity = 255;
o.node.parent.scaleY = 1;
o.string = String(r);
i.node.parent.opacity = 255;
i.node.parent.scaleY = 1;
i.string = String(e);
n.node.parent.opacity = 255;
n.node.parent.scaleY = 1;
n.string = String(e);
s.node.parent.opacity = 255;
s.node.parent.scaleY = 0;
s.string = String(r);
this.running = !0;
cc.tween(i.node.parent).to(.1, {
scaleY: 0
}).start();
cc.tween(s.node.parent).delay(.1).to(.1, {
scaleY: 1
}).call(function() {
o.node.parent.opacity = 0;
i.node.parent.opacity = 0;
n.node.parent.opacity = 0;
s.node.parent.opacity = 0;
c.running = !1;
}).start();
}
}
this.scoreLbls[0].string = String(this.scoreNums[0]);
this.scoreLbls[1].string = String(this.scoreNums[1]);
this.totalScoreLbls[0].string = String(this.totalScoreNums[0]);
this.totalScoreLbls[1].string = String(this.totalScoreNums[1]);
};
n([ c([ cc.Node ]) ], e.prototype, "scoreBtns", void 0);
n([ c([ cc.Node ]) ], e.prototype, "totalScoreBtns", void 0);
n([ c([ cc.Label ]) ], e.prototype, "scoreLbls", void 0);
n([ c([ cc.Label ]) ], e.prototype, "scoreLblUps", void 0);
n([ c([ cc.Label ]) ], e.prototype, "scoreLblDowns", void 0);
n([ c([ cc.Label ]) ], e.prototype, "scoreLblUp2s", void 0);
n([ c([ cc.Label ]) ], e.prototype, "scoreLblDown2s", void 0);
n([ c([ cc.Label ]) ], e.prototype, "totalScoreLbls", void 0);
n([ c([ cc.Label ]) ], e.prototype, "totalScoreLblUps", void 0);
n([ c([ cc.Label ]) ], e.prototype, "totalScoreLblDowns", void 0);
n([ c([ cc.Label ]) ], e.prototype, "totalScoreLblUp2s", void 0);
n([ c([ cc.Label ]) ], e.prototype, "totalScoreLblDown2s", void 0);
return e = n([ s ], e);
}(cc.Component);
r.default = a;
cc._RF.pop();
}, {} ],
TableIdxCtrlr: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "9a557wFqMhGUbahJqSBA+gD", "TableIdxCtrlr");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.lbl = null;
e.panel = null;
e.idx = 1;
e.touching = !1;
e.touchingTime = 0;
return e;
}
e.prototype.onLoad = function() {
var t = this;
this.lbl = this.getComponent(cc.Label);
this.node.on(cc.Node.EventType.TOUCH_START, function() {
t.touching = !0;
});
this.node.on(cc.Node.EventType.TOUCH_END, function() {
t.touching = !1;
});
this.node.on(cc.Node.EventType.TOUCH_CANCEL, function() {
t.touching = !1;
});
var e = cc.sys.localStorage.getItem("tableIdx");
if (e) {
this.idx = e;
this.closePanel();
this.lbl.string = String(this.idx);
} else this.popChangePanel();
};
e.prototype.update = function(t) {
if (this.touching) {
this.touchingTime += t;
if (this.touchingTime > 2) {
this.popChangePanel();
this.touching = !1;
}
} else this.touchingTime = 0;
};
e.prototype.popChangePanel = function() {
this.panel.opacity = 255;
this.panel.scaleX = 1;
this.lbl.string = String(this.idx);
};
e.prototype.closePanel = function() {
this.panel.opacity = 0;
this.panel.scaleX = 0;
};
e.prototype.addIdx = function() {
this.idx = Math.min(this.idx + 1, 99);
this.lbl.string = String(this.idx);
cc.sys.localStorage.setItem("tableIdx", this.idx);
};
e.prototype.rdcIdx = function() {
this.idx = Math.max(this.idx - 1, 1);
this.lbl.string = String(this.idx);
cc.sys.localStorage.setItem("tableIdx", this.idx);
};
n([ c(cc.Node) ], e.prototype, "panel", void 0);
return e = n([ s ], e);
}(cc.Component);
r.default = a;
cc._RF.pop();
}, {} ],
TimeUpdater: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "d673duVBzxHjLxp9MqaG1Se", "TimeUpdater");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = (i.property, [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ]), a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.lbl = null;
return e;
}
e.prototype.onLoad = function() {
this.lbl = this.getComponent(cc.Label);
};
e.prototype.update = function(t) {
this.setTime();
};
e.prototype.setTime = function() {
this.lbl.string = this.getCurTimeStr();
};
e.prototype.getCurTimeStr = function() {
var t = new Date(), e = t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日", r = "" + c[t.getDay()], o = t.getMinutes(), n = o < 10 ? "0" + String(o) : String(o);
return e + "  " + r + "  " + (t.getHours() + ":" + n);
};
return e = n([ s ], e);
}(cc.Component);
r.default = a;
cc._RF.pop();
}, {} ],
TitleCell: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "67454YCIUVO1IvFnUHHkJ9l", "TitleCell");
var o = this && this.__extends || function() {
var t = function(e, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
})(e, r);
};
return function(e, r) {
t(e, r);
function o() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var i = t("./ListViewCell"), s = cc._decorator, c = s.ccclass, a = s.property, l = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.title = null;
return e;
}
e.prototype.setData = function(t) {
this.title.string = "———— " + t + " ————";
};
n([ a(cc.Label) ], e.prototype, "title", void 0);
return e = n([ c ], e);
}(i.ListViewCell);
r.TitleCell = l;
cc._RF.pop();
}, {
"./ListViewCell": "ListViewCell"
} ]
}, {}, [ "Business", "DataModel", "FinalCell", "FinalPanel", "ItemCell", "ItemCellSub", "ItemInfo", "ListView", "ListViewCell", "ListViewDelegate", "PageCtrlr", "PrinterManager", "ScoreIndicator", "TableIdxCtrlr", "TimeUpdater", "TitleCell" ]);