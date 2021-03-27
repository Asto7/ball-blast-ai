// @tensorflow/tfjs-models Copyright 2018 Google
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports, require("@tensorflow/tfjs"))
    : "function" == typeof define && define.amd
    ? define(["exports", "@tensorflow/tfjs"], e)
    : e((t.knnClassifier = {}), t.tf);
})(this, function (t, e) {
  "use strict";
  function a(t, e) {
    var a,
      s,
      r,
      n,
      i = {
        label: 0,
        sent: function () {
          if (1 & r[0]) throw r[1];
          return r[1];
        },
        trys: [],
        ops: [],
      };
    return (
      (n = { next: l(0), throw: l(1), return: l(2) }),
      "function" == typeof Symbol &&
        (n[Symbol.iterator] = function () {
          return this;
        }),
      n
    );
    function l(n) {
      return function (l) {
        return (function (n) {
          if (a) throw new TypeError("Generator is already executing.");
          for (; i; )
            try {
              if (
                ((a = 1),
                s &&
                  (r =
                    2 & n[0]
                      ? s.return
                      : n[0]
                      ? s.throw || ((r = s.return) && r.call(s), 0)
                      : s.next) &&
                  !(r = r.call(s, n[1])).done)
              )
                return r;
              switch (((s = 0), r && (n = [2 & n[0], r.value]), n[0])) {
                case 0:
                case 1:
                  r = n;
                  break;
                case 4:
                  return i.label++, { value: n[1], done: !1 };
                case 5:
                  i.label++, (s = n[1]), (n = [0]);
                  continue;
                case 7:
                  (n = i.ops.pop()), i.trys.pop();
                  continue;
                default:
                  if (
                    !(r = (r = i.trys).length > 0 && r[r.length - 1]) &&
                    (6 === n[0] || 2 === n[0])
                  ) {
                    i = 0;
                    continue;
                  }
                  if (3 === n[0] && (!r || (n[1] > r[0] && n[1] < r[3]))) {
                    i.label = n[1];
                    break;
                  }
                  if (6 === n[0] && i.label < r[1]) {
                    (i.label = r[1]), (r = n);
                    break;
                  }
                  if (r && i.label < r[2]) {
                    (i.label = r[2]), i.ops.push(n);
                    break;
                  }
                  r[2] && i.ops.pop(), i.trys.pop();
                  continue;
              }
              n = e.call(t, i);
            } catch (t) {
              (n = [6, t]), (s = 0);
            } finally {
              a = r = 0;
            }
          if (5 & n[0]) throw n[1];
          return { value: n[0] ? n[1] : void 0, done: !0 };
        })([n, l]);
      };
    }
  }
  function s(t, e) {
    for (var a = [], s = 0; s < t.length; s++)
      a.push({ value: t[s], index: s });
    a.sort(function (t, e) {
      return e.value - t.value;
    });
    var r = new Float32Array(e),
      n = new Int32Array(e);
    for (s = 0; s < e; s++) (r[s] = a[s].value), (n[s] = a[s].index);
    return { values: r, indices: n };
  }
  var r = (function () {
    function t() {
      (this.classDatasetMatrices = {}), (this.classExampleCount = {});
    }
    return (
      (t.prototype.addExample = function (t, a) {
        var s = this;
        if (
          (null == this.exampleShape && (this.exampleShape = t.shape),
          !e.util.arraysEqual(this.exampleShape, t.shape))
        )
          throw new Error(
            "Example shape provided, " +
              t.shape +
              " does not match previously provided example shapes " +
              this.exampleShape +
              "."
          );
        if (!Number.isInteger(a))
          throw new Error("classIndex must be an integer, got " + a + ".");
        this.clearTrainDatasetMatrix(),
          e.tidy(function () {
            var r = s.normalizeVectorToUnitLength(t.flatten()),
              n = r.shape[0];
            if (null == s.classDatasetMatrices[a])
              s.classDatasetMatrices[a] = r.as2D(1, n);
            else {
              var i = s.classDatasetMatrices[a]
                .as2D(s.classExampleCount[a], n)
                .concat(r.as2D(1, n), 0);
              s.classDatasetMatrices[a].dispose(),
                (s.classDatasetMatrices[a] = i);
            }
            e.keep(s.classDatasetMatrices[a]),
              null == s.classExampleCount[a] && (s.classExampleCount[a] = 0),
              s.classExampleCount[a]++;
          });
      }),
      (t.prototype.similarities = function (t) {
        var a = this;
        return e.tidy(function () {
          var s,
            r,
            n = a.normalizeVectorToUnitLength(t.flatten()),
            i = n.shape[0];
          if (null == a.trainDatasetMatrix) {
            var l = null;
            for (var o in a.classDatasetMatrices)
              (s = l),
                (r = a.classDatasetMatrices[o]),
                (l =
                  null == s && null == r
                    ? null
                    : null == s
                    ? r.clone()
                    : null === r
                    ? s.clone()
                    : s.concat(r, 0));
            a.trainDatasetMatrix = l;
          }
          if (null == a.trainDatasetMatrix)
            return (
              console.warn(
                "Cannot predict without providing training examples."
              ),
              null
            );
          e.keep(a.trainDatasetMatrix);
          var c = a.getNumExamples();
          return a.trainDatasetMatrix.as2D(c, i).matMul(n.as2D(i, 1)).as1D();
        });
      }),
      (t.prototype.predictClass = function (t, r) {
        return (
          void 0 === r && (r = 3),
          (n = this),
          (i = void 0),
          (o = function () {
            var n,
              i,
              l,
              o,
              c = this;
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  if (r < 1)
                    throw new Error(
                      "Please provide a positive integer k value to predictClass."
                    );
                  if (0 === this.getNumExamples())
                    throw new Error(
                      "You have not added any exaples to the KNN classifier. Please add examples before calling predictClass."
                    );
                  return (
                    (n = e.tidy(function () {
                      return c.similarities(t).asType("float32");
                    })),
                    (i = Math.min(r, this.getNumExamples())),
                    (o = s),
                    [4, n.data()]
                  );
                case 1:
                  return (
                    (l = o.apply(void 0, [a.sent(), i]).indices),
                    n.dispose(),
                    [2, this.calculateTopClass(l, i)]
                  );
              }
            });
          }),
          new ((l = void 0) || (l = Promise))(function (t, e) {
            function a(t) {
              try {
                r(o.next(t));
              } catch (t) {
                e(t);
              }
            }
            function s(t) {
              try {
                r(o.throw(t));
              } catch (t) {
                e(t);
              }
            }
            function r(e) {
              e.done
                ? t(e.value)
                : new l(function (t) {
                    t(e.value);
                  }).then(a, s);
            }
            r((o = o.apply(n, i || [])).next());
          })
        );
        var n, i, l, o;
      }),
      (t.prototype.clearClass = function (t) {
        if (null == this.classDatasetMatrices[t])
          throw new Error("Cannot clear invalid class ${classIndex}");
        delete this.classDatasetMatrices[t],
          delete this.classExampleCount[t],
          this.clearTrainDatasetMatrix();
      }),
      (t.prototype.clearAllClasses = function () {
        for (var t in this.classDatasetMatrices) this.clearClass(+t);
      }),
      (t.prototype.getClassExampleCount = function () {
        return this.classExampleCount;
      }),
      (t.prototype.getClassifierDataset = function () {
        return this.classDatasetMatrices;
      }),
      (t.prototype.getNumClasses = function () {
        return Object.keys(this.classExampleCount).length;
      }),
      (t.prototype.setClassifierDataset = function (t) {
        for (var e in (this.clearTrainDatasetMatrix(),
        (this.classDatasetMatrices = t),
        t))
          this.classExampleCount[e] = t[e].shape[0];
      }),
      (t.prototype.calculateTopClass = function (t, e) {
        var a = -1,
          s = {};
        if (null == t) return { classIndex: a, confidences: s };
        var r = [];
        for (var n in this.classDatasetMatrices) {
          var i = this.classExampleCount[n];
          +n > 0 && (i += r[+n - 1]), r.push(i);
        }
        var l = Array(Object.keys(this.classDatasetMatrices).length).fill(0);
        for (n = 0; n < t.length; n++)
          for (var o = 0; o < r.length; o++)
            if (t[n] < r[o]) {
              l[o]++;
              break;
            }
        var c = 0;
        for (var n in this.classDatasetMatrices) {
          var u = l[n] / e;
          u > c && ((c = u), (a = +n)), (s[n] = u);
        }
        return { classIndex: a, confidences: s };
      }),
      (t.prototype.clearTrainDatasetMatrix = function () {
        null != this.trainDatasetMatrix &&
          (this.trainDatasetMatrix.dispose(), (this.trainDatasetMatrix = null));
      }),
      (t.prototype.normalizeVectorToUnitLength = function (t) {
        return e.tidy(function () {
          var a = t.norm();
          return e.div(t, a);
        });
      }),
      (t.prototype.getNumExamples = function () {
        var t = 0;
        for (var e in this.classDatasetMatrices)
          t += this.classExampleCount[+e];
        return t;
      }),
      (t.prototype.dispose = function () {
        for (var t in (this.clearTrainDatasetMatrix(),
        this.classDatasetMatrices))
          this.classDatasetMatrices[t].dispose();
      }),
      t
    );
  })();
  (t.KNNClassifier = r),
    (t.create = function () {
      return new r();
    }),
    Object.defineProperty(t, "__esModule", { value: !0 });
});