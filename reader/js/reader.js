var Pixastic = function() {
    function t(e, t, n) {
        return e.createImageData ? e.createImageData(t, n) : e.getImageData(0, 0, t, n)
    }
    function n(r, i) {
        var s = {},
            o = r.canvas.width,
            u = r.canvas.height,
            a = [],
            i = i || "";
        if (!e) {
            if (typeof window.Worker != "undefined")
                try {
                    e = new window.Worker(i + "pixastic.worker.control.js")
                } catch (f) {
                    location.protocol == "file:" ? n.log("Could not create real worker, running from file://") : n.log("Could not create real worker.")
                }
            e || (e = new n.Worker)
        }
        for (var f in n.Effects)
            n.Effects.hasOwnProperty(f) && function(n) {
                s[n] = function(e) {
                    return a.push({
                        effect: n,
                        options: e
                    }), s
                }, s.done = function(n, i) {
                    var s,
                        f;
                    try {
                        s = r.getImageData(0, 0, o, u)
                    } catch (l) {
                        throw location.protocol == "file:" ? new Error("Could not access image data, running from file://") : new Error("Could not access image data, is canvas tainted by cross-origin data?")
                    }
                    f = t(r, o, u), e.postMessage({
                        queue: a,
                        inData: s,
                        outData: f,
                        width: o,
                        height: u
                    }), e.onmessage = function(e) {
                        var t = e.data;
                        switch (t.event) {
                        case "done":
                            r.putImageData(t.data, 0, 0), n && n(), i && i(1);
                            break;
                        case "progress":
                            i && i(t.data);
                            break;
                        case "error":
                        }
                    }, i && i(0)
                }
            }(f);
        return s
    }
    function r(e) {
        var t;
        if (typeof e == "object")
            if (typeof e.tagName == "string") {
                if (e.tagName.toLowerCase() == "canvas" || e.tagName.toLowerCase() == "img")
                    t = document.createElement("canvas"), t.width = e.width, t.height = e.height, t.getContext("2d").drawImage(e, 0, 0)
            } else if (window.ImageData && e instanceof window.ImageData || typeof e.width == "number" && typeof e.height == "number" && typeof e.data == "object")
                t = document.createElement("canvas"), t.width = e.width, t.height = e.height, t.getContext("2d").putImageData(e, 0, 0);
        return t
    }
    function i(e) {
        var t = r(e),
            n = new Image;
        return n.width = t.width, n.height = t.height, n.src = t.toDataURL(), n
    }
    function s(e) {
        var t = r(e),
            n = t.getContext("2d");
        return n.getImageData(0, 0, t.width, t.height)
    }
    function o(e) {
        var t = [],
            n,
            r,
            i = e.data,
            s = Math.round,
            o,
            u = e.width * e.height;
        for (n = 0; n < 256; n++)
            t[n] = 0;
        for (n = 0; n < u; n++)
            r = n * 4, t[s((i[r] + i[r + 1] + i[r + 2]) / 3)]++;
        o = 0;
        for (n = 0; n < 256; n++)
            t[n] > o && (o = t[n]);
        return {
            maxValue: o,
            values: t
        }
    }
    var e;
    return n.Worker = function() {
        function t(t) {
            var r = t.queue,
                i = t.inData,
                s = t.outData,
                o = t.width,
                u = t.height,
                a;
            for (var f = 0; f < r.length; f++) {
                var l = r[f].effect,
                    c = r[f].options,
                    h;
                f > 0 && (a = i, i = s, s = a), typeof importScripts == "function" && (h = function(t) {
                    return e.onmessage({
                        data: {
                            event: "progress",
                            data: (f + t) / r.length
                        }
                    }), t
                }), n.Effects[l](i.data, s.data, o, u, c, h), e.onmessage({
                    data: {
                        event: "progress",
                        data: (f + 1) / r.length
                    }
                })
            }
            e.onmessage({
                data: {
                    event: "done",
                    data: s
                }
            })
        }
        var e = this;
        this.postMessage = function(e) {
            setTimeout(function() {
                t(e)
            }, 0)
        }, this.onmessage = function() {}
    }, n.log = function(e) {
        typeof console != "undefined" && console.log && console.log("Pixastic: " + e)
    }, n.toCanvas = r, n.toImage = i, n.toImageData = s, n.histogram = o, n.Color = {
        rgb2hsl: function(e, t, n) {
            e < 0 && (e = 0), t < 0 && (t = 0), n < 0 && (n = 0), e > 255 && (e = 0), t > 255 && (t = 0), n > 255 && (n = 0)
        },
        rgb2hsv: function(e, t, n) {},
        rgb2hex: function(e, t, n) {},
        hsl2rgb: function(e, t, n) {},
        hsv2rgb: function(e, t, n) {}
    }, n
}();
Pixastic.Effects = function() {
    function e(e, t) {
        var n = {};
        for (var r in t)
            typeof e[r] == "undefined" ? n[r] = t[r] : n[r] = e[r];
        return n
    }
    function t(e, t, n) {
        return Math.min(n, Math.max(t, e))
    }
    function n(e, t, n, r, i, s, o, u, a) {
        var f,
            l,
            c,
            h,
            p,
            d,
            v,
            m,
            g,
            y,
            b,
            w,
            E,
            S,
            x = 0,
            T = n * r * 4,
            N = i[0][0],
            C = i[0][1],
            k = i[0][2],
            L = i[1][0],
            A = i[1][1],
            O = i[1][2],
            M = i[2][0],
            _ = i[2][1],
            D = i[2][2],
            P,
            H,
            B,
            j,
            F,
            I,
            q,
            R,
            U;
        for (E = 0; E < r; ++E) {
            d = E * n * 4, v = d - n * 4, m = d + n * 4, E < 1 && (v = d), E >= n - 1 && (m = d);
            for (w = 0; w < n; ++w)
                f = (E * n + w) * 4, g = w * 4, y = g - 4, b = g + 4, w < 1 && (y = g), w >= n - 1 && (b = g), P = v + y, H = v + g, B = v + b, j = d + y, F = d + g, I = d + b, q = m + y, R = m + g, U = m + b, l = e[P] * N + e[H] * C + e[B] * k + e[j] * L + e[F] * A + e[I] * O + e[q] * M + e[R] * _ + e[U] * D, c = e[P + 1] * N + e[H + 1] * C + e[B + 1] * k + e[j + 1] * L + e[F + 1] * A + e[I + 1] * O + e[q + 1] * M + e[R + 1] * _ + e[U + 1] * D, h = e[P + 2] * N + e[H + 2] * C + e[B + 2] * k + e[j + 2] * L + e[F + 2] * A + e[I + 2] * O + e[q + 2] * M + e[R + 2] * _ + e[U + 2] * D, o ? p = e[P + 3] * N + e[H + 3] * C + e[B + 3] * k + e[j + 3] * L + e[F + 3] * A + e[I + 3] * O + e[q + 3] * M + e[R + 3] * _ + e[U + 3] * D : p = e[f + 3], a && (l = c = h = (l + c + h) / 3), u && (l = 255 - l, c = 255 - c, h = 255 - h), t[f] = l, t[f + 1] = c, t[f + 2] = h, t[f + 3] = p, s && (S = (f / T * 100 >> 0) / 100, S > x && (x = s(S)))
        }
    }
    function s(e, t, n, r, i, s, o, u, a) {
        var f,
            l,
            c,
            h,
            p,
            d,
            v,
            m,
            g,
            y,
            b,
            w,
            E,
            S,
            x,
            T,
            N,
            C,
            k = 0,
            L = n * r * 4,
            A = i[0][0],
            O = i[0][1],
            M = i[0][2],
            _ = i[0][3],
            D = i[0][4],
            P = i[1][0],
            H = i[1][1],
            B = i[1][2],
            j = i[1][3],
            F = i[1][4],
            I = i[2][0],
            q = i[2][1],
            R = i[2][2],
            U = i[2][3],
            z = i[2][4],
            W = i[3][0],
            X = i[3][1],
            V = i[3][2],
            $ = i[3][3],
            J = i[3][4],
            K = i[4][0],
            Q = i[4][1],
            G = i[4][2],
            Y = i[4][3],
            Z = i[4][4],
            et,
            tt,
            nt,
            rt,
            it,
            st,
            ot,
            ut,
            at,
            ft,
            lt,
            ct,
            ht,
            pt,
            dt,
            vt,
            mt,
            gt,
            yt,
            bt,
            wt,
            Et,
            St,
            xt,
            Tt;
        for (N = 0; N < r; ++N) {
            d = N * n * 4, v = d - n * 4, g = d - n * 4 * 2, m = d + n * 4, y = d + n * 4 * 2, N < 1 && (v = d), N >= n - 1 && (m = d), N < 2 && (g = v), N >= n - 2 && (y = m);
            for (T = 0; T < n; ++T)
                f = (N * n + T) * 4, b = T * 4, w = b - 4, E = b + 4, S = b - 8, x = b + 8, T < 1 && (w = b), T >= n - 1 && (E = b), T < 2 && (S = w), T >= n - 2 && (x = E), et = g + S, tt = g + w, nt = g + b, rt = g + E, it = g + x, st = v + S, ot = v + w, ut = v + b, at = v + E, ft = v + x, lt = d + S, ct = d + w, ht = d + b, pt = d + E, dt = d + x, vt = m + S, mt = m + w, gt = m + b, yt = m + E, bt = m + x, wt = y + S, Et = y + w, St = y + b, xt = y + E, Tt = y + x, l = e[et] * A + e[tt] * O + e[nt] * M + e[rt] * D + e[nt] * D + e[st] * P + e[ot] * H + e[ut] * B + e[at] * F + e[ut] * F + e[lt] * I + e[ct] * q + e[ht] * R + e[pt] * z + e[ht] * z + e[vt] * W + e[mt] * X + e[gt] * V + e[yt] * J + e[gt] * J + e[wt] * K + e[Et] * Q + e[St] * G + e[xt] * Z + e[St] * Z, c = e[et + 1] * A + e[tt + 1] * O + e[nt + 1] * M + e[rt + 1] * D + e[nt + 1] * D + e[st + 1] * P + e[ot + 1] * H + e[ut + 1] * B + e[at + 1] * F + e[ut + 1] * F + e[lt + 1] * I + e[ct + 1] * q + e[ht + 1] * R + e[pt + 1] * z + e[ht + 1] * z + e[vt + 1] * W + e[mt + 1] * X + e[gt + 1] * V + e[yt + 1] * J + e[gt + 1] * J + e[wt + 1] * K + e[Et + 1] * Q + e[St + 1] * G + e[xt + 1] * Z + e[St + 1] * Z, h = e[et + 2] * A + e[tt + 2] * O + e[nt + 2] * M + e[rt + 2] * D + e[nt + 2] * D + e[st + 2] * P + e[ot + 2] * H + e[ut + 2] * B + e[at + 2] * F + e[ut + 2] * F + e[lt + 2] * I + e[ct + 2] * q + e[ht + 2] * R + e[pt + 2] * z + e[ht + 2] * z + e[vt + 2] * W + e[mt + 2] * X + e[gt + 2] * V + e[yt + 2] * J + e[gt + 2] * J + e[wt + 2] * K + e[Et + 2] * Q + e[St + 2] * G + e[xt + 2] * Z + e[St + 2] * Z, o ? p = e[et + 3] * A + e[tt + 3] * O + e[nt + 3] * M + e[rt + 3] * D + e[nt + 3] * D + e[st + 3] * P + e[ot + 3] * H + e[ut + 3] * B + e[at + 3] * F + e[ut + 3] * F + e[lt + 3] * I + e[ct + 3] * q + e[ht + 3] * R + e[pt + 3] * z + e[ht + 3] * z + e[vt + 3] * W + e[mt + 3] * X + e[gt + 3] * V + e[yt + 3] * J + e[gt + 3] * J + e[wt + 3] * K + e[Et + 3] * Q + e[St + 3] * G + e[xt + 3] * Z + e[St + 3] * Z : p = e[f + 3], a && (l = c = h = (l + c + h) / 3), u && (l = 255 - l, c = 255 - c, h = 255 - h), t[f] = l, t[f + 1] = c, t[f + 2] = h, t[f + 3] = p, s && (C = (f / L * 100 >> 0) / 100, C > k && (k = s(C)))
        }
    }
    function o(e, n, r, i, s, o) {
        var u,
            a,
            f,
            l,
            c,
            h = r * i * 4,
            p,
            d,
            v,
            m,
            g,
            y,
            b,
            w = [],
            E = 13,
            s = t(s, 3, E),
            S = -s / 2 + (s % 2 ? .5 : 0),
            x = s + S,
            T,
            N = [[1]],
            C,
            k = 0;
        for (v = 1; v < E; ++v)
            N[0][v] = 0;
        for (v = 1; v < E; ++v) {
            N[v] = [1];
            for (m = 1; m < E; ++m)
                N[v][m] = N[v - 1][m] + N[v - 1][m - 1]
        }
        T = N[s - 1];
        for (v = 0, b = 0; v < s; ++v)
            b += T[v];
        for (v = 0; v < s; ++v)
            T[v] /= b;
        for (d = 0; d < i; ++d)
            for (p = 0; p < r; ++p) {
                u = a = f = l = 0;
                for (v = S; v < x; ++v)
                    g = p + v, y = d, b = T[v - S], g < 0 && (g = 0), g >= r && (g = r - 1), c = (y * r + g) * 4, u += e[c] * b, a += e[c + 1] * b, f += e[c + 2] * b, l += e[c + 3] * b;
                c = (d * r + p) * 4, w[c] = u, w[c + 1] = a, w[c + 2] = f, w[c + 3] = l, o && (C = (c / h * 50 >> 0) / 100, C > k && (k = o(C)))
            }
        k = 0;
        for (d = 0; d < i; ++d)
            for (p = 0; p < r; ++p) {
                u = a = f = l = 0;
                for (v = S; v < x; ++v)
                    g = p, y = d + v, b = T[v - S], y < 0 && (y = 0), y >= i && (y = i - 1), c = (y * r + g) * 4, u += w[c] * b, a += w[c + 1] * b, f += w[c + 2] * b, l += w[c + 3] * b;
                c = (d * r + p) * 4, n[c] = u, n[c + 1] = a, n[c + 2] = f, n[c + 3] = l, o && (C = .5 + (c / h * 50 >> 0) / 100, C > k && (k = o(C)))
            }
    }
    return {
        invert: function(e, t, n, r, s, o) {
            var u = n * r * 4,
                a,
                f = 0;
            for (i = 0; i < u; i += 4)
                t[i] = 255 - e[i], t[i + 1] = 255 - e[i + 1], t[i + 2] = 255 - e[i + 2], t[i + 3] = e[i + 3], o && (a = (i / u * 100 >> 0) / 100, a > f && (f = o(a)))
        },
        sepia: function(e, t, n, r, i, s) {
            var o = n * r * 4,
                u,
                a = 0,
                f,
                l,
                c;
            for (var h = 0; h < o; h += 4)
                f = e[h], l = e[h + 1], c = e[h + 2], t[h] = f * .393 + l * .769 + c * .189, t[h + 1] = f * .349 + l * .686 + c * .168, t[h + 2] = f * .272 + l * .534 + c * .131, t[h + 3] = e[h + 3], s && (u = (h / o * 100 >> 0) / 100, u > a && (a = s(u)))
        },
        solarize: function(e, t, n, r, s, o) {
            var u = n * r * 4,
                a,
                f = 0,
                l,
                c,
                h;
            for (i = 0; i < u; i += 4)
                l = e[i], c = e[i + 1], h = e[i + 2], t[i] = l > 127 ? 255 - l : l, t[i + 1] = c > 127 ? 255 - c : c, t[i + 2] = h > 127 ? 255 - h : h, t[i + 3] = e[i + 3], o && (a = (i / u * 100 >> 0) / 100, a > f && (f = o(a)))
        },
        brightness: function(n, r, i, s, o, u) {
            o = e(o, {
                brightness: 0,
                contrast: 0
            });
            var a = t(o.contrast, -1, 1) / 2,
                f = 1 + t(o.brightness, -1, 1),
                l,
                c = 0,
                h,
                p,
                d,
                v = i * s * 4,
                m = f < 0 ? -f : f,
                g = f < 0 ? 0 : f;
            a = .5 * Math.tan((a + 1) * Math.PI / 4), contrastAdd = -(a - .5) * 255;
            for (var y = 0; y < v; y += 4)
                h = n[y], p = n[y + 1], d = n[y + 2], h = (h + h * m + g) * a + contrastAdd, p = (p + p * m + g) * a + contrastAdd, d = (d + d * m + g) * a + contrastAdd, r[y] = h, r[y + 1] = p, r[y + 2] = d, r[y + 3] = n[y + 3], u && (l = (y / v * 100 >> 0) / 100, l > c && (c = u(l)))
        },
        desaturate: function(e, t, n, r, i, s) {
            var o = n * r * 4,
                u,
                a = 0,
                f;
            for (var l = 0; l < o; l += 4)
                f = e[l] * .3 + e[l + 1] * .59 + e[l + 2] * .11, t[l] = f, t[l + 1] = f, t[l + 2] = f, t[l + 3] = e[l + 3], s && (u = (l / o * 100 >> 0) / 100, u > a && (a = s(u)))
        },
        lighten: function(e, n, r, i, s, o) {
            var u = r * i * 4,
                a,
                f = 0,
                l = 1 + t(s.amount, 0, 1);
            for (var c = 0; c < u; c += 4)
                n[c] = e[c] * l, n[c + 1] = e[c + 1] * l, n[c + 2] = e[c + 2] * l, n[c + 3] = e[c + 3], o && (a = (c / u * 100 >> 0) / 100, a > f && (f = o(a)))
        },
        noise: function(e, n, r, i, s, o) {
            var u = r * i * 4,
                a,
                f = 0,
                l = t(s.amount, 0, 1),
                c = t(s.strength, 0, 1),
                h = !!s.mono,
                p = Math.random,
                d,
                v,
                m,
                g;
            for (var y = 0; y < u; y += 4)
                v = e[y], m = e[y + 1], g = e[y + 2], d = p(), d < l && (h ? (d = c * (d / l * 2 - 1) * 255, v += d, m += d, g += d) : (v += c * p() * 255, m += c * p() * 255, g += c * p() * 255)), n[y] = v, n[y + 1] = m, n[y + 2] = g, n[y + 3] = e[y + 3], o && (a = (y / u * 100 >> 0) / 100, a > f && (f = o(a)))
        },
        flipv: function(e, t, n, r, i, s) {
            var o,
                u,
                a = n * r * 4,
                f,
                l = 0,
                c,
                h;
            for (h = 0; h < r; ++h)
                for (c = 0; c < n; ++c)
                    o = (h * n + c) * 4, u = (h * n + (n - c - 1)) * 4, t[u] = e[o], t[u + 1] = e[o + 1], t[u + 2] = e[o + 2], t[u + 3] = e[o + 3], s && (f = (o / a * 100 >> 0) / 100, f > l && (l = s(f)))
        },
        fliph: function(e, t, n, r, i, s) {
            var o,
                u,
                a = n * r * 4,
                f,
                l = 0,
                c,
                h;
            for (h = 0; h < r; ++h)
                for (c = 0; c < n; ++c)
                    o = (h * n + c) * 4, u = ((r - h - 1) * n + c) * 4, t[u] = e[o], t[u + 1] = e[o + 1], t[u + 2] = e[o + 2], t[u + 3] = e[o + 3], s && (f = (o / a * 100 >> 0) / 100, f > l && (l = s(f)))
        },
        blur: function(e, t, n, r, i, s) {
            o(e, t, n, r, i.kernelSize, s)
        },
        glow: function(e, t, n, r, i, s) {
            var u = n * r * 4,
                a,
                f,
                l,
                c,
                h = i.amount,
                p = [],
                d,
                v,
                m = 0;
            s && (d = function(e) {
                return s(e * .8), e
            }), o(e, p, n, r, i.kernelSize, d);
            for (a = 0; a < u; a += 4)
                f = e[a] + p[a] * h, l = e[a + 1] + p[a + 1] * h, c = e[a + 2] + p[a + 2] * h, f > 255 && (f = 255), l > 255 && (l = 255), c > 255 && (c = 255), t[a] = f, t[a + 1] = l, t[a + 2] = c, t[a + 3] = e[a + 3], s && (v = .8 + (a / u * 100 >> 0) / 100 * .2, v > m && (m = s(v)))
        },
        convolve3x3: function(e, t, r, i, s, o) {
            n(e, t, r, i, s.kernel, o)
        },
        convolve5x5: function(e, t, r, i, s, o) {
            n(e, t, r, i, s.kernel, o)
        },
        sharpen3x3: function(e, r, i, s, o, u) {
            var a = -t(o.strength, 0, 1);
            n(e, r, i, s, [[a, a, a], [a, 1 - a * 8, a], [a, a, a]], u)
        },
        sharpen5x5: function(e, n, r, i, o, u) {
            var a = -t(o.strength, 0, 1);
            s(e, n, r, i, [[a, a, a, a, a], [a, a, a, a, a], [a, a, 1 - a * 24, a, a], [a, a, a, a, a], [a, a, a, a, a]], u)
        },
        soften3x3: function(e, t, r, i, s, o) {
            var u = 1 / 9;
            n(e, t, r, i, [[u, u, u], [u, u, u], [u, u, u]], o)
        },
        soften5x5: function(e, t, n, r, i, o) {
            var u = .04;
            s(e, t, n, r, [[u, u, u, u, u], [u, u, u, u, u], [u, u, u, u, u], [u, u, u, u, u], [u, u, u, u, u]], o)
        },
        crossedges: function(e, r, i, s, o, u) {
            var a = t(o.strength, 0, 1) * 5;
            n(e, r, i, s, [[0, -a, 0], [-a, 0, a], [0, a, 0]], u, !1, !0)
        },
        emboss: function(e, t, r, i, s, o) {
            var u = s.amount,
                a = s.angle,
                f = Math.cos(-a) * u,
                l = Math.sin(-a) * u,
                c = r * i * 4,
                h = -f - l,
                p = -f,
                d = l - f,
                v = -l,
                m = l,
                g = -l + f,
                y = f,
                b = l + f,
                w = [],
                E,
                S = 0,
                x;
            o && (x = function(e) {
                return o(e * .5), e
            }), n(e, w, r, i, [[h, v, g], [p, 0, y], [d, m, b]]);
            for (var T = 0; T < c; T += 4)
                t[T] = 128 + w[T], t[T + 1] = 128 + w[T + 1], t[T + 2] = 128 + w[T + 2], t[T + 3] = e[T + 3], o && (E = .5 + (T / c * 100 >> 0) / 100 * .5, E > S && (S = o(E)))
        },
        findedges: function(e, t, r, i, s, o) {
            var u = r * i * 4,
                a,
                f = [],
                l = [],
                c,
                h,
                p,
                d,
                v,
                m,
                g,
                y = 0,
                b,
                w;
            o && (b = function(e) {
                return o(e * .4), e
            }, w = function(e) {
                return o(.4 + e * .4), e
            }), n(e, f, r, i, [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]), n(e, l, r, i, [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]);
            for (a = 0; a < u; a += 4)
                c = f[a], h = l[a], p = f[a + 1], d = l[a + 1], v = f[a + 2], m = l[a + 2], c < 0 && (c = -c), h < 0 && (h = -h), p < 0 && (p = -p), d < 0 && (d = -d), v < 0 && (v = -v), m < 0 && (m = -m), t[a] = 255 - (c + h) * .8, t[a + 1] = 255 - (p + d) * .8, t[a + 2] = 255 - (v + m) * .8, t[a + 3] = e[a + 3], o && (g = .8 + (a / u * 100 >> 0) / 100 * .2, g > y && (y = o(g)))
        },
        edgeenhance3x3: function(e, t, r, i, s, o) {
            n(e, t, r, i, [[-1 / 9, -1 / 9, -1 / 9], [-1 / 9, 17 / 9, -1 / 9], [-1 / 9, -1 / 9, -1 / 9]], o)
        },
        edgeenhance5x5: function(e, t, n, r, i, o) {
            s(e, t, n, r, [[-0.04, -0.04, -0.04, -0.04, -0.04], [-0.04, -0.04, -0.04, -0.04, -0.04], [-0.04, -0.04, 1.96, -0.04, -0.04], [-0.04, -0.04, -0.04, -0.04, -0.04], [-0.04, -0.04, -0.04, -0.04, -0.04]], o)
        },
        laplace3x3: function(e, t, r, i, s, o) {
            n(e, t, r, i, [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], o, !1, !0, !0)
        },
        laplace5x5: function(e, t, n, r, i, o) {
            s(e, t, n, r, [[-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, 24, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1]], o, !1, !0, !0)
        },
        coloradjust: function(e, n, r, i, s, o) {
            var u = r * i * 4,
                a,
                f,
                l,
                c,
                h = 0,
                p = t(s.r, -1, 1) * 255,
                d = t(s.g, -1, 1) * 255,
                v = t(s.b, -1, 1) * 255;
            for (var m = 0; m < u; m += 4)
                a = e[m] + p, f = e[m + 1] + d, l = e[m + 2] + v, a < 0 && (a = 0), f < 0 && (f = 0), l < 0 && (l = 0), a > 255 && (a = 255), f > 255 && (f = 255), l > 255 && (l = 255), n[m] = a, n[m + 1] = f, n[m + 2] = l, n[m + 3] = e[m + 3], o && (c = (m / u * 100 >> 0) / 100, c > h && (h = o(c)))
        },
        colorfilter: function(e, n, r, i, s, o) {
            var u = r * i * 4,
                a,
                f,
                l,
                c,
                h = !!s.luminosity,
                p,
                d = 0,
                v,
                m,
                g,
                y,
                b,
                w,
                E,
                S,
                x = t(s.r, 0, 1),
                T = t(s.g, 0, 1),
                N = t(s.b, 0, 1);
            for (a = 0; a < u; a += 4)
                f = e[a] / 255, l = e[a + 1] / 255, c = e[a + 2] / 255, y = f * .3 + l * .59 + c * .11, f = (f + f * x) / 2, l = (l + l * T) / 2, c = (c + c * N) / 2, h && (v = m = f, l > m && (m = l), c > m && (m = c), l < v && (v = l), c < v && (v = c), w = m - v, f == m ? g = (l - c) / w % 6 : l == m ? g = (c - f) / w + 2 : g = (f - l) / w + 4, b = g >> 0, E = w * (g - b), f = l = c = y - (f * .3 + l * .59 + c * .11), b == 0 ? (f += w, l += E) : b == 1 ? (f += w - E, l += w) : b == 2 ? (l += w, c += E) : b == 3 ? (l += w - E, c += w) : b == 4 ? (f += E, c += w) : b == 5 && (f += w, c += w - E)), n[a] = f * 255, n[a + 1] = l * 255, n[a + 2] = c * 255, n[a + 3] = e[a + 3], o && (p = (a / u * 100 >> 0) / 100, p > d && (d = o(p)))
        },
        hsl: function(e, n, i, s, o, u) {
            var a = i * s * 4,
                f = t(o.hue, -1, 1),
                l = t(o.saturation, -1, 1),
                c = t(o.lightness, -1, 1),
                h = 1 + l * (l < 0 ? 1 : 2),
                p = c < 0 ? 1 + c : 1 - c,
                d = c < 0 ? 0 : c * 255,
                v,
                m,
                y,
                w,
                E,
                S,
                x,
                T,
                N,
                C,
                k,
                L = 0;
            f = f * 6 % 6;
            for (var A = 0; A < a; A += 4) {
                r = e[A], g = e[A + 1], b = e[A + 2];
                if (f != 0 || l != 0)
                    v = r, g > v && (v = g), b > v && (v = b), m = r, g < m && (m = g), b < m && (m = b), y = v - m, S = (m + v) / 510, S > 0 && y > 0 && (S <= .5 ? (E = y / (v + m) * h, E > 1 && (E = 1), x = S * (1 + E)) : (E = y / (510 - v - m) * h, E > 1 && (E = 1), x = S + E - S * E), r == v ? g == m ? w = 5 + (v - b) / y + f : w = 1 - (v - g) / y + f : g == v ? b == m ? w = 1 + (v - r) / y + f : w = 3 - (v - b) / y + f : r == m ? w = 3 + (v - g) / y + f : w = 5 - (v - r) / y + f, w < 0 && (w += 6), w >= 6 && (w -= 6), T = S + S - x, C = w >> 0, N = (x - T) * (w - C), C == 0 ? (r = x, g = T + N, b = T) : C == 1 ? (r = x - N, g = x, b = T) : C == 2 ? (r = T, g = x, b = T + N) : C == 3 ? (r = T, g = x - N, b = x) : C == 4 ? (r = T + N, g = T, b = x) : C == 5 && (r = x, g = T, b = x - N), r *= 255, g *= 255, b *= 255);
                r = r * p + d, g = g * p + d, b = b * p + d, r < 0 && (r = 0), g < 0 && (g = 0), b < 0 && (b = 0), r > 255 && (r = 255), g > 255 && (g = 255), b > 255 && (b = 255), n[A] = r, n[A + 1] = g, n[A + 2] = b, n[A + 3] = e[A + 3], u && (k = (A / a * 100 >> 0) / 100, k > L && (L = u(k)))
            }
        },
        posterize: function(e, n, r, s, o, u) {
            var a = t(o.levels, 2, 256),
                f = 256 / a,
                l = 256 / (a - 1),
                c,
                h,
                p,
                d = r * s * 4,
                v,
                m = 0;
            for (i = 0; i < d; i += 4)
                n[i] = l * (e[i] / f >> 0), n[i + 1] = l * (e[i + 1] / f >> 0), n[i + 2] = l * (e[i + 2] / f >> 0), n[i + 3] = e[i + 3], u && (v = (i / d * 100 >> 0) / 100, v > m && (m = u(v)))
        },
        removenoise: function(e, t, n, r, i, s) {
            var o,
                u,
                a,
                f,
                l,
                c,
                h,
                p,
                d,
                v,
                m,
                g,
                y,
                b,
                w,
                E,
                S,
                x,
                T,
                N,
                C,
                k = 0;
            N = n * r * 4;
            for (l = 0; l < r; ++l) {
                p = l * n * 4, d = p - n * 4, v = p + n * 4, l < 1 && (d = p), l >= n - 1 && (v = p);
                for (c = 0; c < n; ++c)
                    h = (l * n + c) * 4, m = c * 4, g = m - 4, y = m + 4, c < 1 && (g = m), c >= n - 1 && (y = m), b = S = e[p + g], f = e[p + y], f < b && (b = f), f > S && (S = f), f = e[d + m], f < b && (b = f), f > S && (S = f), f = e[v + m], f < b && (b = f), f > S && (S = f), w = e[p + g + 1], f = e[p + y + 1], f < w && (w = f), f = e[d + m + 1], f < w && (w = f), f = e[v + m + 1], f < w && (w = f), E = e[p + g + 2], f = e[p + y + 2], f < E && (E = f), f = e[d + m + 2], f < E && (E = f), f = e[v + m + 2], f < E && (E = f), o = e[h], u = e[h + 1], a = e[h + 2], o < b && (o = b), o > S && (o = S), u < w && (u = w), u > x && (u = x), a < E && (a = E), a > T && (a = T), t[h] = o, t[h + 1] = u, t[h + 2] = a, t[h + 3] = e[h + 3], s && (C = (h / N * 100 >> 0) / 100, C > k && (k = s(C)))
            }
        }
    }
}(), Pixastic.Worker = function() {
    function t(t) {
        var n = t.queue,
            r = t.inData,
            i = t.outData,
            s = t.width,
            o = t.height,
            u;
        for (var a = 0; a < n.length; a++) {
            var f = n[a].effect,
                l = n[a].options;
            a > 0 && (u = r, r = i, i = u), Pixastic.Effects[f](r.data, i.data, s, o, l), e.onmessage({
                data: {
                    event: "progress",
                    data: (a + 1) / n.length
                }
            })
        }
        e.onmessage({
            data: {
                event: "done",
                data: i
            }
        })
    }
    var e = this;
    this.postMessage = function(e) {
        setTimeout(function() {
            t(e)
        }, 0)
    }, this.onmessage = function() {}
}, this.Handlebars = {}, function(e) {
    e.VERSION = "1.0.rc.1", e.helpers = {}, e.partials = {}, e.registerHelper = function(e, t, n) {
        n && (t.not = n), this.helpers[e] = t
    }, e.registerPartial = function(e, t) {
        this.partials[e] = t
    }, e.registerHelper("helperMissing", function(e) {
        if (arguments.length === 2)
            return undefined;
        throw new Error("Could not find property '" + e + "'")
    });
    var t = Object.prototype.toString,
        n = "[object Function]";
    e.registerHelper("blockHelperMissing", function(r, i) {
        var s = i.inverse || function() {},
            o = i.fn,
            u = "",
            a = t.call(r);
        return a === n && (r = r.call(this)), r === !0 ? o(this) : r === !1 || r == null ? s(this) : a === "[object Array]" ? r.length > 0 ? e.helpers.each(r, i) : s(this) : o(r)
    }), e.K = function() {}, e.createFrame = Object.create || function(t) {
        e.K.prototype = t;
        var n = new e.K;
        return e.K.prototype = null, n
    }, e.registerHelper("each", function(t, n) {
        var r = n.fn,
            i = n.inverse,
            s = 0,
            o = "",
            u;
        n.data && (u = e.createFrame(n.data));
        if (t && typeof t == "object")
            if (t instanceof Array)
                for (var a = t.length; s < a; s++)
                    u && (u.index = s), o += r(t[s], {
                        data: u
                    });
            else
                for (var f in t)
                    t.hasOwnProperty(f) && (u && (u.key = f), o += r(t[f], {
                        data: u
                    }), s++);
        return s === 0 && (o = i(this)), o
    }), e.registerHelper("if", function(r, i) {
        var s = t.call(r);
        return s === n && (r = r.call(this)), !r || e.Utils.isEmpty(r) ? i.inverse(this) : i.fn(this)
    }), e.registerHelper("unless", function(t, n) {
        var r = n.fn,
            i = n.inverse;
        return n.fn = i, n.inverse = r, e.helpers["if"].call(this, t, n)
    }), e.registerHelper("with", function(e, t) {
        return t.fn(e)
    }), e.registerHelper("log", function(t) {
        e.log(t)
    })
}(this.Handlebars);
var errorProps = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
Handlebars.Exception = function(e) {
    var t = Error.prototype.constructor.apply(this, arguments);
    for (var n = 0; n < errorProps.length; n++)
        this[errorProps[n]] = t[errorProps[n]]
}, Handlebars.Exception.prototype = new Error, Handlebars.SafeString = function(e) {
    this.string = e
}, Handlebars.SafeString.prototype.toString = function() {
    return this.string.toString()
}, function() {
    var e = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        },
        t = /[&<>"'`]/g,
        n = /[&<>"'`]/,
        r = function(t) {
            return e[t] || "&amp;"
        };
    Handlebars.Utils = {
        escapeExpression: function(e) {
            return e instanceof Handlebars.SafeString ? e.toString() : e == null || e === !1 ? "" : n.test(e) ? e.replace(t, r) : e
        },
        isEmpty: function(e) {
            return typeof e == "undefined" ? !0 : e === null ? !0 : e === !1 ? !0 : Object.prototype.toString.call(e) === "[object Array]" && e.length === 0 ? !0 : !1
        }
    }
}(), Handlebars.VM = {
    template: function(e) {
        var t = {
            escapeExpression: Handlebars.Utils.escapeExpression,
            invokePartial: Handlebars.VM.invokePartial,
            programs: [],
            program: function(e, t, n) {
                var r = this.programs[e];
                return n ? Handlebars.VM.program(t, n) : r ? r : (r = this.programs[e] = Handlebars.VM.program(t), r)
            },
            programWithDepth: Handlebars.VM.programWithDepth,
            noop: Handlebars.VM.noop
        };
        return function(n, r) {
            return r = r || {}, e.call(t, Handlebars, n, r.helpers, r.partials, r.data)
        }
    },
    programWithDepth: function(e, t, n) {
        var r = Array.prototype.slice.call(arguments, 2);
        return function(n, i) {
            return i = i || {}, e.apply(this, [n, i.data || t].concat(r))
        }
    },
    program: function(e, t) {
        return function(n, r) {
            return r = r || {}, e(n, r.data || t)
        }
    },
    noop: function() {
        return ""
    },
    invokePartial: function(e, t, n, r, i, s) {
        var o = {
            helpers: r,
            partials: i,
            data: s
        };
        if (e === undefined)
            throw new Handlebars.Exception("The partial " + t + " could not be found");
        if (e instanceof Function)
            return e(n, o);
        if (!Handlebars.compile)
            throw new Handlebars.Exception("The partial " + t + " could not be compiled when running in runtime-only mode");
        return i[t] = Handlebars.compile(e, {
            data: s !== undefined
        }), i[t](n, o)
    }
}, Handlebars.template = Handlebars.VM.template, function() {
    var e = Handlebars.template,
        t = Handlebars.templates = Handlebars.templates || {};
    t.loadingOverlay = e(function(e, t, n, r, i) {
        return this.compilerInfo = [2, ">= 1.0.0-rc.3"], n = n || e.helpers, i = i || {}, '\n<div id="cb-loading-overlay" class="cb-control"></div>\n'
    }), t.navigateLeft = e(function(e, t, n, r, i) {
        return this.compilerInfo = [2, ">= 1.0.0-rc.3"], n = n || e.helpers, i = i || {}, '\n<div data-trigger="click" data-action="navigation">\n</div>\n'
    }), t.navigateRight = e(function(e, t, n, r, i) {
        return this.compilerInfo = [2, ">= 1.0.0-rc.3"], n = n || e.helpers, i = i || {}, '\n<div data-trigger="click" data-action="navigation">\n</div>\n'
    }), t.progressbar = e(function(e, t, n, r, i) {
        return this.compilerInfo = [2, ">= 1.0.0-rc.3"], n = n || e.helpers, i = i || {}, '<div id="cb-status" class="cb-control">\n	<div id="cb-progress-bar">\n		<div class="progressbar-value"></div>\n	</div>\n</div>\n'
    }), t.toolbar = e(function(e, t, n, r, i) {
        return this.compilerInfo = [2, ">= 1.0.0-rc.3"], n = n || e.helpers, i = i || {}, '<div class="toolbar">\n\n	<ul class="pull-left">\n		<li class="close">\n			<button data-trigger="click" data-action="close" title="close" class="icon-remove-sign"></button>\n		</li>\n		<li class="close separator"></li>\n		<li>\n			<button title="Drawing Settings" class="icon-settings" data-toggle="dropdown"></button>\n			<div class="dropdown">\n				<form name="image-enhancements" >\n					<div class="sliders"><div class="control-group">\n							<label title="Brush Size" class="icon-adjust"></label>\n							<input data-trigger="change" data-action="brush-size" class="brush-size" type="range" min="1" max="40" step="3" value="1">\n						</div>\n					</div>\n					<div class="control-group pull-left">\n						<br><input type="text" id="picker"> </div>\n					<div class="control-group pull-right">\n						<input type="button" onclick="TogetherJS(this); return false;" value="Collaborate"><br><br>\n\n<input type="button" class="clear" value="Clear">\n					</div>\n				</form>\n			</div>\n		</li>\n<li>\n			<button data-trigger="click" data-action="zoomIn" title="Zoom In" class="icon-zoom-in"></button>\n		</li>\n		<li>\n			<button data-trigger="click" data-action="zoomOut" title="Zoom Out" class="icon-zoom-out"></button>\n      <li>\n          <button data-trigger="click" data-action="toggleLayout" title="toggle one/two pages at a time" class="icon-file layout layout-single"></button>\n           <button data-trigger="click" data-action="toggleLayout" title="toggle one/two pages at a time" class="icon-copy layout layout-double"></button>\n       </li>\n		</li>\n</ul>\n\n	<ul class="pull-right"><li><button data-trigger="click" data-action="navigation" data-navigate-side="left" class="icon-arrow-left-3"></button><li><button data-trigger="click" data-action="navigation" data-navigate-side="right" class="icon-arrow-right-3"></button><span id="current-page"></span> / <span id="page-count"></span></li>\n	</ul>\n\n</div>\n'
    })
}();
var ComicBook = function(e) {
    "use strict";
    function t(e, t) {
        var n;
        typeof t == "undefined" && (t = {});
        for (n in e)
            if (e.hasOwnProperty(n)) {
                if (n in t)
                    continue;
                t[n] = e[n]
            }
        return t
    }
    function r(i, s, o) {
        function E() {
            var t = window.innerHeight + 1;
            return w === !1 && (w = e(document.createElement("div")).attr("id", "cb-width-shiv").css({
                width: "100%",
                position: "absolute",
                top: 0,
                zIndex: "-1000"
            }), e("body").append(w)), w.height(t), w.innerWidth()
        }
        function S() {
            var e = x();
            e !== C && v.indexOf(e) > -1 && (C = e, u.draw())
        }
        function x() {
            var e = parseInt(location.hash.substring(1), 10) - 1 || 0;
            return e < 0 && (T(0), e = 0), e
        }
        function T(e) {
            location.hash = e
        }
        function k() {
            p = document.getElementById(a), d = p.getContext("2d"), y === !1 && (u.renderControls(), y = !0), window.addEventListener("keydown", u.navigation, !1), window.addEventListener("hashchange", S, !1)
        }
        var u = this,
            a = i;
        this.srcs = s;
        var f = {
            displayMode: "double",
            zoomMode: "fitWindow",
            manga: !1,
            enhance: {},
            keyboard: {
                next: 39,
                previous: 37//,
                // toolbar: 84,
                // toggleLayout: 76
            },
            libPath: "/lib/",
            forward_buffer: 3
        };
        this.isMobile = !1, /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent) && (this.isMobile = !0, $("body").addClass("mobile"), f.displayMode = "single", window.addEventListener("load", function() {
            setTimeout(function() {
                window.scrollTo(0, 1)
            }, 0)
        }));
        var l = t(f, o),
            c = s.length,
            h = [],
            p,
            d,
            v = [],
            m = 1,
            g = !1,
            y = !1,
            b = !1,
            w = !1,
            N = x(),
            C = N < s.length ? N : 0;
        window.addEventListener("touchstart", function(t) {
            var n = e(t.target);
            n.attr("id") === "comic" && u.toggleToolbar(), n.data("toggle") === "dropdown" && n.siblings(".dropdown").toggle()
        }, !1), r.prototype.renderControls = function() {
            var t = {},
                n;
            e.each(Handlebars.templates, function(n, r) {
                var i = e(r().trim());
                t[n] = i, i.find("*").andSelf().filter("[data-action][data-trigger]").each(function() {
                    var t = e(this),
                        n = t.data("trigger"),
                        r = t.data("action");
                    typeof u[t.data("action")] == "function" && t.on(n, u[r]), t.on(n, function(t) {
                        e(u).trigger(n, t)
                    })
                }), e(p).before(i)
            }), this.controls = t, n = this.getControl("toolbar"), n.find(".manga-" + l.manga).show().end().find(".manga-" + !l.manga).hide().end().find(".layout").hide().end().find(".layout-" + l.displayMode).show()
        }, r.prototype.getControl = function(e) {
            if (typeof this.controls[e] != "object")
                throw n.UNDEFINED_CONTROL + " " + e;
            return this.controls[e]
        }, r.prototype.showControl = function(e) {
            this.getControl(e).show().addClass("open")
        }, r.prototype.hideControl = function(e) {
            this.getControl(e).removeClass("open").hide()
        }, r.prototype.toggleControl = function(e) {
            this.getControl(e).toggle().toggleClass("open")
        }, r.prototype.toggleLayout = function() {
            var e = u.getControl("toolbar"),
                t = l.displayMode === "single" ? "double" : "single";
            l.displayMode = t, e.find(".layout").hide().end().find(".layout-" + l.displayMode).show(), u.drawPage()
        }, r.prototype.getPage = function(e) {
            if (e < 0 || e > s.length - 1)
                throw n.INVALID_PAGE + " " + e;
            if (typeof h[e] == "object")
                return h[e];
            b = e, this.showControl("loadingOverlay")
        }, r.prototype.draw = function() {
            k(), e(".navigate").outerHeight(window.innerHeight), e("#cb-loading-overlay").outerWidth(E()).height(window.innerHeight), h.length !== c ? this.preload() : this.drawPage()
        }, r.prototype.zoom = function(e) {
            l.zoomMode = "manual", m = e, typeof this.getPage(C) == "object" && this.drawPage()
        }, r.prototype.zoomIn = function() {
            u.zoom(m + .1)
        }, r.prototype.zoomOut = function() {
            u.zoom(m - .1)
        }, r.prototype.fitWidth = function() {
            l.zoomMode = "fitWidth", u.drawPage()
        }, r.prototype.fitWindow = function() {
            l.zoomMode = "fitWindow", u.drawPage()
        }, r.prototype.preload = function() {
            function i(t) {
                var o = new Image;
                o.src = s[t], o.onload = function() {
                    h[t] = this, v.push(t), e("#cb-progress-bar .progressbar-value").css("width", Math.floor(v.length / c * 100) + "%");
                    var o = l.displayMode === "double" && C < s.length - 1 ? 1 : 0;
                    if (n === !1 && e.inArray(C + o, v) !== -1 || typeof b == "number" && e.inArray(b, v) !== -1)
                        typeof b == "number" && (C = b - 1, b = !1), u.drawPage(), u.hideControl("loadingOverlay"), n = !0;
                    r.length ? (i(r[0]), r.splice(0, 1)) : e("#cb-status").delay(500).fadeOut()
                }
            }
            function o(e, t) {
                var n = 0,
                    s = 1,
                    o = e,
                    u = e - 1;
                while (o <= t)
                    s > l.forward_buffer && u > -1 ? (r.push(u), u--, s = 0) : (r.push(o), o++), s++;
                while (u > -1)
                    r.push(u), u--;
                i(r[n])
            }
            var t = C,
                n = !1,
                r = [];
            this.showControl("loadingOverlay"), o(t, s.length - 1)
        }, r.prototype.pageLoaded = function(e) {
            return typeof v[e - 1] != "undefined"
        }, r.prototype.drawPage = function(t, r) {
            var i;
            r = typeof r != "undefined" ? r : !0, i = r ? 0 : window.scrollY;
            if (typeof t == "number" && t < s.length && t > 0) {
                C = t - 1;
                if (!this.pageLoaded(t)) {
                    this.showControl("loadingOverlay");
                    return
                }
            }
            C < 0 && (C = 0);
            var o,
                a = 0,
                f = 0,
                c = u.getPage(C),
                h = !1;
            l.displayMode === "double" && C < s.length - 1 && (h = u.getPage(C + 1));
            if (typeof c != "object")
                throw n.INVALID_PAGE_TYPE + " " + typeof c;
            var v = c.width,
                y = c.height;
            p.width = 0, p.height = 0, g = typeof h == "object" && (c.width > c.height || h.width > h.height) && l.displayMode === "double", g && (l.displayMode = "single"), l.displayMode === "double" && (typeof h == "object" ? v += h.width : v += v);
            switch (l.zoomMode) {
            case "manual":
                document.body.style.overflowX = "auto", o = l.displayMode === "double" ? m * 2 : m;
                break;
            case "fitWidth":
                document.body.style.overflowX = "hidden", o = E() > v ? (E() - v) / E() + 1 : E() / v, m = o;
                break;
            case "fitWindow":
                document.body.style.overflowX = "hidden";
                var b = E() > v ? (E() - v) / E() + 1 : E() / v,
                    w = window.innerHeight,
                    S = w > y ? (w - y) / w + 1 : w / y;
                o = b > S ? S : b, m = o;
                break;
            default:
                throw n.INVALID_ZOOM_MODE + " " + l.zoomMode
            }
            var N = c.width * o,
                k = c.height * o,
                L = l.zoomMode === "manual" ? c.width * m : N,
                A = l.zoomMode === "manual" ? c.height * m : k;
            k = A, p.width = N < E() ? E() : N, p.height = k < window.innerHeight ? window.innerHeight : k;
            if (l.zoomMode === "manual" || l.zoomMode === "fitWindow")
                N < E() && (a = (E() - L) / 2, l.displayMode === "double" && (a -= L / 2)), k < window.innerHeight && (f = (window.innerHeight - A) / 2);
            if (l.manga && l.displayMode === "double" && typeof h == "object") {
                var O = c,
                    M = h;
                c = M, h = O
            }
            d.drawImage(c, a, f, L, A), l.displayMode === "double" && typeof h == "object" && d.drawImage(h, L + a, f, L, A), this.pixastic = new Pixastic(d, l.libPath + "pixastic/"), e.each(l.enhance, function(e, t) {
                u.enhance[e](t)
            });
            var _ = l.displayMode === "double" && C + 2 <= s.length ? C + 1 + "-" + (C + 2) : C + 1;
            this.getControl("toolbar").find("#current-page").text(_).end().find("#page-count").text(s.length), g && (l.displayMode = "double"), e("button.cb-fit-width").attr("disabled", l.zoomMode === "fitWidth"), e("button.cb-fit-window").attr("disabled", l.zoomMode === "fitWindow"), e(".navigate").show(), C === 0 && (l.manga ? (e(".navigate-left").show(), e(".navigate-right").hide()) : (e(".navigate-left").hide(), e(".navigate-right").show()));
            if (C === s.length - 1 || typeof h == "object" && C === s.length - 2)
                l.manga ? (e(".navigate-left").hide(), e(".navigate-right").show()) : (e(".navigate-left").show(), e(".navigate-right").hide());
            C !== x() && e(this).trigger("navigate"), x() !== C && T(C + 1)
        }, r.prototype.drawNextPage = function() {
            var e;
            try {
                e = u.getPage(C + 1)
            } catch (t) {}
            if (!e)
                return !1;
            if (C + 1 < h.length) {
                C += l.displayMode === "single" || g ? 1 : 2;
                try {
                    u.drawPage()
                } catch (t) {}
            }
            window.scroll(0, 0)
        }, r.prototype.drawPrevPage = function() {
            var e;
            try {
                e = u.getPage(C - 1)
            } catch (t) {}
            if (!e)
                return !1;
            g = e.width > e.height, C > 0 && (C -= l.displayMode === "single" || g ? 1 : 2, u.drawPage()), window.scroll(0, 0)
        }, r.prototype.brightness = function() {
            u.enhance.brightness({
                brightness: e(this).val()
            })
        }, r.prototype.contrast = function() {
            u.enhance.brightness({
                contrast: e(this).val()
            })
        }, r.prototype.sharpen = function() {
            u.enhance.sharpen({
                strength: e(this).val()
            })
        }, r.prototype.desaturate = function() {
            e(this).is(":checked") ? u.enhance.desaturate() : u.enhance.resaturate()
        }, r.prototype.resetEnhancements = function() {
            u.enhance.reset()
        }, r.prototype.enhance = {
            reset: function(e) {
                e ? delete l.enhance[e] : l.enhance = {}, u.drawPage(null, !1)
            },
            progress: function() {},
            done: function() {},
            brightness: function(e, n) {
                n !== !1 && this.reset("brightness");
                var r = t({
                    brightness: 0,
                    contrast: 0
                }, e);
                l.enhance.brightness = r, u.pixastic.brightness({
                    brightness: r.brightness,
                    contrast: r.contrast
                }).done(this.done, this.progress)
            },
            desaturate: function() {
                l.enhance.desaturate = {}, u.pixastic.desaturate().done(this.done, this.progress)
            },
            resaturate: function() {
                delete l.enhance.desaturate, u.drawPage(null, !1)
            },
            sharpen: function(e) {
                this.desharpen();
                var n = t({
                    strength: 0
                }, e);
                l.enhance.sharpen = n, u.pixastic.sharpen3x3({
                    strength: n.strength
                }).done(this.done, this.progress)
            },
            desharpen: function() {
                delete l.enhance.sharpen, u.drawPage(null, !1)
            }
        }, r.prototype.navigation = function(t) {
            if (e("#cb-loading-overlay").is(":visible"))
                return !1;
            var r = !1;
            switch (t.type) {
            case "click":
                r = t.currentTarget.getAttribute("data-navigate-side");
                break;
            case "keydown":
                t.keyCode === l.keyboard.previous && (r = "left"), t.keyCode === l.keyboard.next && (r = "right"), t.keyCode === l.keyboard.toolbar && u.toggleToolbar(), t.keyCode === l.keyboard.toggleLayout && u.toggleLayout();
                break;
            default:
                throw n.INVALID_NAVIGATION_EVENT + " " + t.type
            }
            if (r){
                return t.stopPropagation(), l.manga ? (r === "left" && u.drawNextPage(), r === "right" && u.drawPrevPage()) : (r === "left" && u.drawPrevPage(), r === "right" && u.drawNextPage()), !1, togetherjs()
            }
        }, r.prototype.toggleReadingMode = function() {
            l.manga = !l.manga, u.getControl("toolbar").find(".manga-" + l.manga).show().end().find(".manga-" + !l.manga).hide()
        }, r.prototype.toggleToolbar = function() {
            u.toggleControl("toolbar")
        }, r.prototype.destroy = function() {
            e.each(this.controls, function(e, t) {
                t.remove()
            }), p.width = 0, p.height = 0, window.removeEventListener("keydown", this.navigation, !1), window.removeEventListener("hashchange", S, !1), T("")

        }, r.prototype.togetherjs = function(){togetherjs()}
    }

    function togetherjs(){
        var page = parseInt(window.location.toString().split('#')[1])
        var displayMode = $(".layout:visible").prop("classList")[2]
        if (TogetherJS.running) { TogetherJS.send({ type: 'page', pageNumber: page, displayMode: displayMode}) }
        return page
    }

    var n = {
        INVALID_ACTION: "invalid action",
        INVALID_PAGE: "invalid page",
        INVALID_PAGE_TYPE: "invalid page type",
        UNDEFINED_CONTROL: "undefined control",
        INVALID_ZOOM_MODE: "invalid zoom mode",
        INVALID_NAVIGATION_EVENT: "invalid navigation event"
    };
    return r
}(jQuery);

