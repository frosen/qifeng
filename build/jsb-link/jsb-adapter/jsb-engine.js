(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

cc.Assembler2D.prototype.updateWorldVerts = function (comp) {
  var local = this._local;
  var verts = this._renderData.vDatas[0];
  var vl = local[0],
      vr = local[2],
      vb = local[1],
      vt = local[3]; // left bottom

  verts[0] = vl;
  verts[1] = vb; // right bottom

  verts[5] = vr;
  verts[6] = vb; // left top

  verts[10] = vl;
  verts[11] = vt; // right top

  verts[15] = vr;
  verts[16] = vt;
};

var _updateColor = cc.Assembler2D.prototype.updateColor;

cc.Assembler2D.prototype.updateColor = function (comp, color) {
  this._dirtyPtr[0] |= cc.Assembler.FLAG_VERTICES_OPACITY_CHANGED;

  _updateColor.call(this, comp, color);
};

},{}],2:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Assembler3D) return;

  cc.Assembler3D.updateWorldVerts = function (comp) {
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var vl = local[0],
        vr = local[2],
        vb = local[1],
        vt = local[3]; // left bottom

    var floatsPerVert = this.floatsPerVert;
    var offset = 0;
    world[offset] = vl;
    world[offset + 1] = vb;
    world[offset + 2] = 0;
    offset += floatsPerVert; // right bottom

    world[offset] = vr;
    world[offset + 1] = vb;
    world[offset + 2] = 0;
    offset += floatsPerVert; // left top

    world[offset] = vl;
    world[offset + 1] = vt;
    world[offset + 2] = 0;
    offset += floatsPerVert; // right top

    world[offset] = vr;
    world[offset + 1] = vt;
    world[offset + 2] = 0;
  };
})();

},{}],3:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var RenderFlow = cc.RenderFlow;
var originInit = cc.Assembler.prototype.init;
var FLAG_VERTICES_OPACITY_CHANGED = 1 << 0;
var FLAG_VERTICES_DIRTY = 1 << 1;
var Assembler = {
  _ctor: function _ctor() {
    this._dirtyPtr = new Uint32Array(1);
    this.setDirty(this._dirtyPtr);
    this.initVertexFormat();
  },
  destroy: function destroy() {
    this._renderComp = null;
    this._effect = null;
  },
  clear: function clear() {
    this._renderData.clear();
  },
  _extendNative: function _extendNative() {
    renderer.Assembler.prototype.ctor.call(this);
  },
  initVertexFormat: function initVertexFormat() {
    var vfmt = this.getVfmt();
    if (!vfmt) return;
    this.setVertexFormat(vfmt._nativeObj);
  },
  init: function init(renderComp) {
    this._effect = [];
    originInit.call(this, renderComp);

    if (renderComp.node && renderComp.node._proxy) {
      renderComp.node._proxy.setAssembler(this);
    }
  },
  _updateRenderData: function _updateRenderData() {
    if (!this._renderComp || !this._renderComp.isValid) return;
    this.updateRenderData(this._renderComp);
    var materials = this._renderComp._materials;

    for (var i = 0; i < materials.length; i++) {
      var m = materials[i]; // TODO: find why material can be null

      if (!m) continue;
      m.getHash();
      this.updateMaterial(i, m);
    }
  },
  updateRenderData: function updateRenderData(comp) {
    comp._assembler.updateMaterial(0, comp._materials[0]);
  },
  updateMaterial: function updateMaterial(iaIndex, material) {
    var effect = material && material.effect;

    if (this._effect[iaIndex] !== effect) {
      this._effect[iaIndex] = effect;
      this.updateEffect(iaIndex, effect ? effect._nativeObj : null);
    }
  },
  updateColor: function updateColor(comp, color) {
    this._dirtyPtr[0] |= FLAG_VERTICES_OPACITY_CHANGED;
  },
  updateIADatas: function updateIADatas(iaIndex, meshIndex) {
    // When the MeshBuffer is switched, it is necessary to synchronize the iaData of the native assembler.
    this.updateMeshIndex(iaIndex, meshIndex);
    var materials = this._renderComp.sharedMaterials;
    var material = materials[iaIndex] || materials[0];
    this.updateMaterial(iaIndex, material);
  }
};
cc.Assembler.FLAG_VERTICES_OPACITY_CHANGED = FLAG_VERTICES_OPACITY_CHANGED;
cc.Assembler.FLAG_VERTICES_DIRTY = FLAG_VERTICES_DIRTY;
Object.setPrototypeOf(cc.Assembler.prototype, renderer.Assembler.prototype);
cc.js.mixin(cc.Assembler.prototype, Assembler);
module.exports = Assembler;

},{}],4:[function(require,module,exports){
"use strict";

var proto = cc.Graphics.__assembler__.prototype;
var _init = proto.init;

proto.init = function (renderComp) {
  _init.call(this, renderComp);

  this.ignoreOpacityFlag();
};

proto.genBuffer = function (graphics, cverts) {
  var buffers = this.getBuffers();
  var buffer = buffers[this._bufferOffset];
  var meshbuffer = buffer.meshbuffer;
  meshbuffer.requestStatic(cverts, cverts * 3);
  this._buffer = buffer;
  meshbuffer.setNativeAssembler(this);
  return buffer;
};

var _stroke = proto.stroke;

proto.stroke = function (graphics) {
  _stroke.call(this, graphics);

  var buffer = this._buffer;
  buffer.meshbuffer.used(buffer.vertexStart, buffer.indiceStart);
};

var _fill = proto.fill;

proto.fill = function (graphics) {
  _fill.call(this, graphics);

  var buffer = this._buffer;
  buffer.meshbuffer.used(buffer.vertexStart, buffer.indiceStart);
};

var _updateIADatas = proto.updateIADatas;

proto.updateIADatas = function (iaIndex, meshIndex) {
  _updateIADatas.call(this, iaIndex, meshIndex); // Reset vertexStart and indiceStart when buffer is switched.


  this._buffer.vertexStart = 0;
  this._buffer.indiceStart = 0;
};

},{}],5:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var originReserveQuads = cc.Label.__assembler__.Bmfont.prototype._reserveQuads;
Object.assign(cc.Label.__assembler__.Bmfont.prototype, {
  updateWorldVerts: function updateWorldVerts(comp) {
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var offset = 0, l = local.length; offset < l; offset += floatsPerVert) {
      world[offset] = local[offset];
      world[offset + 1] = local[offset + 1];
    }
  }
});

},{}],6:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Label.__assembler__.Bmfont3D) return;
  var proto = cc.Label.__assembler__.Bmfont3D.prototype;
  Object.assign(proto, {
    updateWorldVerts: function updateWorldVerts(comp) {
      var local = this._local;
      var world = this._renderData.vDatas[0];
      var floatsPerVert = this.floatsPerVert;

      for (var offset = 0, l = world.length; offset < l; offset += floatsPerVert) {
        world[offset] = local[offset];
        world[offset + 1] = local[offset + 1];
        world[offset + 2] = 0;
      }
    }
  });
})();

},{}],7:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Label.__assembler__.TTF3D) return;
  var proto = cc.Label.__assembler__.TTF3D.prototype;
  Object.assign(proto, {
    updateWorldVerts: cc.Assembler3D.updateWorldVerts
  });
})();

},{}],8:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
require('./2d/bmfont.js');

require('./3d/bmfont.js');

require('./3d/ttf.js');

},{"./2d/bmfont.js":5,"./3d/bmfont.js":6,"./3d/ttf.js":7}],9:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var Mask = cc.Mask;
var RenderFlow = cc.RenderFlow;
var spriteAssembler = cc.Sprite.__assembler__.Simple.prototype;
var graphicsAssembler = cc.Graphics.__assembler__.prototype;
var proto = cc.Mask.__assembler__.prototype;
var _updateRenderData = proto.updateRenderData; // Avoid constructor being overridden.

renderer.MaskAssembler.prototype.constructor = cc.Mask.__assembler__;
cc.js.mixin(proto, {
  _extendNative: function _extendNative() {
    renderer.MaskAssembler.prototype.ctor.call(this);
  },
  initLocal: function initLocal() {
    this._local = new Float32Array(4);
    renderer.MaskAssembler.prototype.setLocalData.call(this, this._local);
  },
  updateRenderData: function updateRenderData(mask) {
    _updateRenderData.call(this, mask);

    mask._clearGraphics._assembler.updateMaterial(0, mask._clearMaterial);

    this.setMaskInverted(mask.inverted);
    this.setUseModel(mask._type !== Mask.Type.IMAGE_STENCIL);
    this.setImageStencil(mask._type === Mask.Type.IMAGE_STENCIL);
    mask.node._renderFlag |= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
  }
}, renderer.MaskAssembler.prototype);
var originCreateGraphics = cc.Mask.prototype._createGraphics;
var originRemoveGraphics = cc.Mask.prototype._removeGraphics;
cc.js.mixin(cc.Mask.prototype, {
  _createGraphics: function _createGraphics() {
    originCreateGraphics.call(this);

    if (this._graphics) {
      this._assembler.setRenderSubHandle(this._graphics._assembler);
    } // TODO: remove clearGraphics


    if (!this._clearGraphics) {
      this._clearGraphics = new cc.Graphics();
      cc.Assembler.init(this._clearGraphics);
      this._clearGraphics.node = new cc.Node();

      this._clearGraphics._activateMaterial();

      this._clearGraphics.lineWidth = 0;

      this._clearGraphics.rect(-1, -1, 2, 2);

      this._clearGraphics.fill();

      this._clearGraphics._assembler.ignoreWorldMatrix();

      this._assembler.setClearSubHandle(this._clearGraphics._assembler);
    }
  },
  _removeGraphics: function _removeGraphics() {
    originRemoveGraphics.call(this); // TODO: remove clearGraphics

    if (this._clearGraphics) {
      this._clearGraphics.destroy();

      this._clearGraphics = null;
    }
  }
});

},{}],10:[function(require,module,exports){
"use strict";

(function () {
  var Mesh = cc.MeshRenderer;
  if (Mesh === undefined) return;
  var proto = cc.MeshRenderer.__assembler__.prototype;
  var _init = proto.init;
  cc.js.mixin(proto, {
    initVertexFormat: function initVertexFormat() {},
    _extendNative: function _extendNative() {
      renderer.MeshAssembler.prototype.ctor.call(this);
    },
    init: function init(comp) {
      _init.call(this, comp);

      this.updateMeshData(true);
    },
    setRenderNode: function setRenderNode(node) {
      this.setNode(node._proxy);
    },
    updateRenderData: function updateRenderData(comp) {
      this.updateMeshData();
      comp.node._renderFlag |= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
    },
    updateMeshData: function updateMeshData(force) {
      var comp = this._renderComp;
      var mesh = comp.mesh;
      if (!mesh || !mesh.loaded) return;
      var subdatas = comp.mesh.subDatas;

      for (var i = 0, len = subdatas.length; i < len; i++) {
        var data = subdatas[i];

        if (force || data.vDirty || data.iDirty) {
          this.updateIAData(i, data.vfm._nativeObj, data.vData, data.iData);
          data.vDirty = false;
          data.iDirty = false;
        }
      }
    }
  }, renderer.MeshAssembler.prototype);
})();

},{}],11:[function(require,module,exports){
"use strict";

var proto = cc.MotionStreak.__assembler__.prototype;
var _init = proto.init;
var _update = proto.update;
cc.js.mixin(proto, {
  init: function init(comp) {
    _init.call(this, comp);

    this.setUseModel(false);
    this.ignoreWorldMatrix();
    this.ignoreOpacityFlag();
  },
  update: function update(comp, dt) {
    comp.node._updateWorldMatrix();

    _update.call(this, comp, dt);

    var _this$_renderData$_fl = this._renderData._flexBuffer,
        iData = _this$_renderData$_fl.iData,
        usedVertices = _this$_renderData$_fl.usedVertices;
    var indiceOffset = 0;

    for (var i = 0, l = usedVertices; i < l; i += 2) {
      iData[indiceOffset++] = i;
      iData[indiceOffset++] = i + 2;
      iData[indiceOffset++] = i + 1;
      iData[indiceOffset++] = i + 1;
      iData[indiceOffset++] = i + 2;
      iData[indiceOffset++] = i + 3;
    }
  }
});

},{}],12:[function(require,module,exports){
"use strict";

(function () {
  var PS = cc.ParticleSystem3D;
  if (PS === undefined) return;
  var proto = PS.__assembler__.prototype;
  var _init = proto.init;
  var _updateRenderData = proto.updateRenderData;
  cc.js.mixin(proto, {
    initVertexFormat: function initVertexFormat() {},
    _extendNative: function _extendNative() {
      renderer.Particle3DAssembler.prototype.ctor.call(this);
    },
    init: function init(comp) {
      _init.call(this, comp);

      this._renderDataList = new renderer.RenderDataList();
      this.setRenderDataList(this._renderDataList);
      this.ignoreOpacityFlag();
      this.updateMeshData();
      this.setUseModel(true);
    },
    updateRenderData: function updateRenderData(comp) {
      _updateRenderData.call(this, comp);

      if (comp._vertsDirty) {
        this.updateMeshData();
        comp._vertsDirty = false;
      }
    },
    setRenderNode: function setRenderNode(node) {
      this.setNode(node._proxy);
    },
    updateMeshData: function updateMeshData() {
      if (!this._model) {
        return;
      }

      var subdatas = this._model._subDatas;

      for (var i = 0, len = subdatas.length; i < len; i++) {
        var data = subdatas[i];

        if (data.vDirty && data.enable) {
          this._renderDataList.updateMesh(i, data.vData, data.iData);
        }
      }

      this.setVertexFormat(subdatas[0].vfm._nativeObj);
      this.setSimulationSpace(this._particleSystem.simulationSpace);

      if (subdatas[1] && subdatas[1].enable) {
        this.setTrailVertexFormat(subdatas[1].vfm._nativeObj);
        this.setTrailModuleSpace(this._particleSystem.trailModule.space);
      }
    },
    setSimulationSpace: function setSimulationSpace(space) {
      this.setParticleSpace(space);
    },
    setTrailModuleSpace: function setTrailModuleSpace(space) {
      this.setTrailSpace(space);
    },
    updateIA: function updateIA(index, count, vDirty, iDirty) {
      this.updateIndicesRange(index, 0, count);
    }
  }, renderer.Particle3DAssembler.prototype);
})();

},{}],13:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
Object.assign(cc.Sprite.__assembler__.Mesh.prototype, {
  updateWorldVerts: function updateWorldVerts(sprite) {
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var i = 0, l = local.length / 2; i < l; i++) {
      world[i * floatsPerVert] = local[i * 2];
      world[i * floatsPerVert + 1] = local[i * 2 + 1];
    }
  }
});

},{}],14:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
Object.assign(cc.Sprite.__assembler__.RadialFilled.prototype, {
  updateWorldVerts: function updateWorldVerts(sprite) {
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var offset = 0, l = world.length; offset < l; offset += floatsPerVert) {
      world[offset] = local[offset];
      world[offset + 1] = local[offset + 1];
    }
  }
});

},{}],15:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var proto = cc.Sprite.__assembler__.Simple.prototype;
var nativeProto = renderer.SimpleSprite2D.prototype;

proto.updateWorldVerts = function (comp) {
  this._dirtyPtr[0] |= cc.Assembler.FLAG_VERTICES_DIRTY;
};

proto._extendNative = function () {
  nativeProto.ctor.call(this);
};

proto.initLocal = function () {
  this._local = new Float32Array(4);
  nativeProto.setLocalData.call(this, this._local);
};

},{}],16:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var proto = cc.Sprite.__assembler__.Sliced.prototype;
var nativeProto = renderer.SlicedSprite2D.prototype;

proto.updateWorldVerts = function (comp) {
  this._dirtyPtr[0] |= cc.Assembler.FLAG_VERTICES_DIRTY;
};

proto._extendNative = function () {
  nativeProto.ctor.call(this);
};

proto.initLocal = function () {
  this._local = new Float32Array(8);
  nativeProto.setLocalData.call(this, this._local);
};

},{}],17:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
Object.assign(cc.Sprite.__assembler__.Tiled.prototype, {
  updateWorldVerts: function updateWorldVerts(sprite) {
    var renderData = this._renderData;
    var local = this._local;
    var localX = local.x,
        localY = local.y;
    var world = renderData.vDatas[0];
    var row = this.row,
        col = this.col;
    var x, x1, y, y1;
    var floatsPerVert = this.floatsPerVert;
    var vertexOffset = 0;

    for (var yindex = 0, ylength = row; yindex < ylength; ++yindex) {
      y = localY[yindex];
      y1 = localY[yindex + 1];

      for (var xindex = 0, xlength = col; xindex < xlength; ++xindex) {
        x = localX[xindex];
        x1 = localX[xindex + 1]; // lb

        world[vertexOffset] = x;
        world[vertexOffset + 1] = y;
        vertexOffset += floatsPerVert; // rb

        world[vertexOffset] = x1;
        world[vertexOffset + 1] = y;
        vertexOffset += floatsPerVert; // lt

        world[vertexOffset] = x;
        world[vertexOffset + 1] = y1;
        vertexOffset += floatsPerVert; // rt

        world[vertexOffset] = x1;
        world[vertexOffset + 1] = y1;
        vertexOffset += floatsPerVert;
      }
    }
  }
});

},{}],18:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Sprite.__assembler__.BarFilled3D) return;
  var proto = cc.Sprite.__assembler__.BarFilled3D.prototype;
  Object.assign(proto, {
    updateWorldVerts: cc.Assembler3D.updateWorldVerts
  });
})();

},{}],19:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Sprite.__assembler__.Mesh3D) return;
  var proto = cc.Sprite.__assembler__.Mesh3D.prototype;
  Object.assign(proto, {
    updateWorldVerts: function updateWorldVerts(sprite) {
      var local = this._local;
      var world = this._renderData.vDatas[0];
      var floatsPerVert = this.floatsPerVert,
          offset = 0;

      for (var i = 0, j = 0, l = local.length / 2; i < l; i++, offset += floatsPerVert) {
        j = i * 2;
        world[offset] = local[j];
        world[offset + 1] = local[j++];
        world[offset + 2] = 0;
      }
    }
  });
})();

},{}],20:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Sprite.__assembler__.RadialFilled3D) return;
  var proto = cc.Sprite.__assembler__.RadialFilled3D.prototype;
  Object.assign(proto, {
    updateWorldVerts: function updateWorldVerts(sprite) {
      var local = this._local;
      var world = this._renderData.vDatas[0];
      var floatsPerVert = this.floatsPerVert;

      for (var offset = 0, l = world.length; offset < l; offset += floatsPerVert) {
        world[offset] = local[offset];
        world[offset + 1] = local[offset + 1];
        world[offset + 2] = 0;
      }
    }
  });
})();

},{}],21:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Sprite.__assembler__.Simple3D) return;
  var proto = cc.Sprite.__assembler__.Simple3D.prototype;
  var nativeProto = renderer.SimpleSprite3D.prototype;
  Object.assign(proto, {
    _extendNative: nativeProto.ctor
  });
})();

},{}],22:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Sprite.__assembler__.Sliced3D) return;
  var proto = cc.Sprite.__assembler__.Sliced3D.prototype;
  var nativeProto = renderer.SlicedSprite3D.prototype;
  Object.assign(proto, {
    _extendNative: nativeProto.ctor
  });
})();

},{}],23:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.Sprite.__assembler__.Tiled3D) return;
  var proto = cc.Sprite.__assembler__.Tiled3D.prototype;
  Object.assign(proto, {
    updateWorldVerts: function updateWorldVerts(sprite) {
      var local = this._local;
      var localX = local.x,
          localY = local.y;
      var world = this._renderData.vDatas[0];
      var row = this.row,
          col = this.col;
      var x, x1, y, y1;
      var vertexOffset = 0;

      for (var yindex = 0, ylength = row; yindex < ylength; ++yindex) {
        y = localY[yindex];
        y1 = localY[yindex + 1];

        for (var xindex = 0, xlength = col; xindex < xlength; ++xindex) {
          x = localX[xindex];
          x1 = localX[xindex + 1]; // left bottom

          var padding = 6;
          world[vertexOffset] = x;
          world[vertexOffset + 1] = y;
          world[vertexOffset + 2] = 0;
          vertexOffset += padding; // right bottom

          world[vertexOffset] = x1;
          world[vertexOffset + 1] = y;
          world[vertexOffset + 2] = 0;
          vertexOffset += padding; // left top

          world[vertexOffset] = x;
          world[vertexOffset + 1] = y1;
          world[vertexOffset + 2] = 0;
          vertexOffset += padding; // right top

          world[vertexOffset] = x1;
          world[vertexOffset + 1] = y1;
          world[vertexOffset + 2] = 0;
          vertexOffset += padding;
        }
      }
    }
  });
})();

},{}],24:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
require('./2d/sliced.js');

require('./2d/tiled.js');

require('./2d/radial-filled.js');

require('./2d/simple.js');

require('./2d/mesh.js');

require('./3d/sliced.js');

require('./3d/simple.js');

require('./3d/tiled.js');

require('./3d/mesh.js');

require('./3d/bar-filled.js');

require('./3d/radial-filled.js');

},{"./2d/mesh.js":13,"./2d/radial-filled.js":14,"./2d/simple.js":15,"./2d/sliced.js":16,"./2d/tiled.js":17,"./3d/bar-filled.js":18,"./3d/mesh.js":19,"./3d/radial-filled.js":20,"./3d/simple.js":21,"./3d/sliced.js":22,"./3d/tiled.js":23}],25:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
require('./jsb-sys.js');

require('./jsb-game.js');

require('./jsb-videoplayer.js');

require('./jsb-webview.js');

require('./jsb-audio.js');

require('./jsb-loader.js');

require('./jsb-editbox.js');

require('./jsb-reflection.js');

require('./jsb-assets-manager.js');

if (CC_NATIVERENDERER) {
  require('./jsb-effect.js');

  require('./jsb-effect-variant.js');

  require('./scene/camera.js');

  require('./scene/light.js');

  require('./scene/node-proxy.js');

  require('./scene/render-flow.js'); // must be required after render flow


  require('./scene/node.js');

  cc.game.on(cc.game.EVENT_ENGINE_INITED, function () {
    require('./scene/mesh-buffer.js');

    require('./scene/quad-buffer.js');

    require('./scene/render-data.js');

    require('./assemblers/assembler.js');

    require('./assemblers/assembler-2d.js');

    require('./assemblers/assembler-3d.js');

    require('./assemblers/sprite/index.js');

    require('./assemblers/label/index.js');

    require('./assemblers/mask-assembler.js');

    require('./assemblers/graphics-assembler.js');

    require('./assemblers/motion-streak.js');

    require('./assemblers/mesh-renderer.js');

    require('./assemblers/particle-3d-assembler.js');

    require('./jsb-dragonbones.js');

    require('./jsb-spine-skeleton.js');

    require('./jsb-particle.js');

    require('./jsb-tiledmap.js');

    require('./jsb-skin-mesh.js');
  });
}

},{"./assemblers/assembler-2d.js":1,"./assemblers/assembler-3d.js":2,"./assemblers/assembler.js":3,"./assemblers/graphics-assembler.js":4,"./assemblers/label/index.js":8,"./assemblers/mask-assembler.js":9,"./assemblers/mesh-renderer.js":10,"./assemblers/motion-streak.js":11,"./assemblers/particle-3d-assembler.js":12,"./assemblers/sprite/index.js":24,"./jsb-assets-manager.js":26,"./jsb-audio.js":27,"./jsb-dragonbones.js":undefined,"./jsb-editbox.js":28,"./jsb-effect-variant.js":29,"./jsb-effect.js":30,"./jsb-game.js":31,"./jsb-loader.js":32,"./jsb-particle.js":33,"./jsb-reflection.js":34,"./jsb-skin-mesh.js":35,"./jsb-spine-skeleton.js":undefined,"./jsb-sys.js":36,"./jsb-tiledmap.js":37,"./jsb-videoplayer.js":39,"./jsb-webview.js":40,"./scene/camera.js":41,"./scene/light.js":42,"./scene/mesh-buffer.js":43,"./scene/node-proxy.js":44,"./scene/node.js":45,"./scene/quad-buffer.js":46,"./scene/render-data.js":47,"./scene/render-flow.js":48}],26:[function(require,module,exports){
"use strict";

/*
 * Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
if (jsb.AssetsManager) {
  jsb.AssetsManager.State = {
    UNINITED: 0,
    UNCHECKED: 1,
    PREDOWNLOAD_VERSION: 2,
    DOWNLOADING_VERSION: 3,
    VERSION_LOADED: 4,
    PREDOWNLOAD_MANIFEST: 5,
    DOWNLOADING_MANIFEST: 6,
    MANIFEST_LOADED: 7,
    NEED_UPDATE: 8,
    READY_TO_UPDATE: 9,
    UPDATING: 10,
    UNZIPPING: 11,
    UP_TO_DATE: 12,
    FAIL_TO_UPDATE: 13
  };
  jsb.Manifest.DownloadState = {
    UNSTARTED: 0,
    DOWNLOADING: 1,
    SUCCESSED: 2,
    UNMARKED: 3
  };
  jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST = 0;
  jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST = 1;
  jsb.EventAssetsManager.ERROR_PARSE_MANIFEST = 2;
  jsb.EventAssetsManager.NEW_VERSION_FOUND = 3;
  jsb.EventAssetsManager.ALREADY_UP_TO_DATE = 4;
  jsb.EventAssetsManager.UPDATE_PROGRESSION = 5;
  jsb.EventAssetsManager.ASSET_UPDATED = 6;
  jsb.EventAssetsManager.ERROR_UPDATING = 7;
  jsb.EventAssetsManager.UPDATE_FINISHED = 8;
  jsb.EventAssetsManager.UPDATE_FAILED = 9;
  jsb.EventAssetsManager.ERROR_DECOMPRESS = 10;
}

},{}],27:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
cc.Audio = function (src) {
  this.src = src;
  this.volume = 1;
  this.loop = false;
  this.id = -1;
};

var handleVolume = function handleVolume(volume) {
  if (volume === undefined) {
    // set default volume as 1
    volume = 1;
  } else if (typeof volume === 'string') {
    volume = Number.parseFloat(volume);
  }

  return volume;
};

(function (proto, audioEngine) {
  if (!audioEngine) return; // Using the new audioEngine

  cc.audioEngine = audioEngine;

  audioEngine.setMaxWebAudioSize = function () {};

  cc.Audio.State = audioEngine.AudioState;

  proto.play = function () {
    audioEngine.stop(this.id);
    var clip = this.src;
    this.id = audioEngine.play(clip, this.loop, this.volume);
  };

  proto.pause = function () {
    audioEngine.pause(this.id);
  };

  proto.resume = function () {
    audioEngine.resume(this.id);
  };

  proto.stop = function () {
    audioEngine.stop(this.id);
  };

  proto.destroy = function () {};

  proto.setLoop = function (loop) {
    this.loop = loop;
    audioEngine.setLoop(this.id, loop);
  };

  proto.getLoop = function () {
    return this.loop;
  };

  proto.setVolume = function (volume) {
    volume = handleVolume(volume);
    this.volume = volume;
    return audioEngine.setVolume(this.id, volume);
  };

  proto.getVolume = function () {
    return this.volume;
  };

  proto.setCurrentTime = function (time) {
    audioEngine.setCurrentTime(this.id, time);
  };

  proto.getCurrentTime = function () {
    return audioEngine.getCurrentTime(this.id);
  };

  proto.getDuration = function () {
    return audioEngine.getDuration(this.id);
  };

  proto.getState = function () {
    return audioEngine.getState(this.id);
  }; // polyfill audioEngine


  var _music = {
    id: -1,
    clip: '',
    loop: false,
    volume: 1
  };
  var _effect = {
    volume: 1
  };

  audioEngine.play = function (clip, loop, volume) {
    if (typeof volume !== 'number') {
      volume = 1;
    }

    var audioFilePath;
    var md5Pipe = cc.loader.md5Pipe;

    if (typeof clip === 'string') {
      // backward compatibility since 1.10
      cc.warnID(8401, 'cc.audioEngine', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
      audioFilePath = clip;

      if (md5Pipe) {
        audioFilePath = md5Pipe.transformURL(audioFilePath);
      }
    } else {
      if (clip.loaded) {
        audioFilePath = clip._nativeAsset;
      } else {
        // audio delay loading
        clip._nativeAsset = audioFilePath = md5Pipe ? md5Pipe.transformURL(clip.nativeUrl) : clip.nativeUrl;
        clip.loaded = true;
      }
    }

    return audioEngine.play2d(audioFilePath, loop, volume);
  };

  audioEngine.playMusic = function (clip, loop) {
    audioEngine.stop(_music.id);
    _music.id = audioEngine.play(clip, loop, _music.volume);
    _music.loop = loop;
    _music.clip = clip;
    return _music.id;
  };

  audioEngine.stopMusic = function () {
    audioEngine.stop(_music.id);
  };

  audioEngine.pauseMusic = function () {
    audioEngine.pause(_music.id);
    return _music.id;
  };

  audioEngine.resumeMusic = function () {
    audioEngine.resume(_music.id);
    return _music.id;
  };

  audioEngine.getMusicVolume = function () {
    return _music.volume;
  };

  audioEngine.setMusicVolume = function (volume) {
    _music.volume = handleVolume(volume);
    audioEngine.setVolume(_music.id, _music.volume);
    return volume;
  };

  audioEngine.isMusicPlaying = function () {
    return audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING;
  };

  audioEngine.playEffect = function (filePath, loop) {
    return audioEngine.play(filePath, loop || false, _effect.volume);
  };

  audioEngine.setEffectsVolume = function (volume) {
    _effect.volume = handleVolume(volume);
  };

  audioEngine.getEffectsVolume = function () {
    return _effect.volume;
  };

  audioEngine.pauseEffect = function (audioID) {
    return audioEngine.pause(audioID);
  };

  audioEngine.pauseAllEffects = function () {
    var musicPlay = audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING;
    audioEngine.pauseAll();

    if (musicPlay) {
      audioEngine.resume(_music.id);
    }
  };

  audioEngine.resumeEffect = function (id) {
    audioEngine.resume(id);
  };

  audioEngine.resumeAllEffects = function () {
    var musicPaused = audioEngine.getState(_music.id) === audioEngine.AudioState.PAUSED;
    audioEngine.resumeAll();

    if (musicPaused && audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING) {
      audioEngine.pause(_music.id);
    }
  };

  audioEngine.stopEffect = function (id) {
    return audioEngine.stop(id);
  };

  audioEngine.stopAllEffects = function () {
    var musicPlaying = audioEngine.getState(_music.id) === audioEngine.AudioState.PLAYING;
    var currentTime = audioEngine.getCurrentTime(_music.id);
    audioEngine.stopAll();

    if (musicPlaying) {
      _music.id = audioEngine.play(_music.clip, _music.loop);
      audioEngine.setCurrentTime(_music.id, currentTime);
    }
  }; // Unnecessary on native platform


  audioEngine._break = function () {};

  audioEngine._restore = function () {}; // deprecated


  audioEngine._uncache = audioEngine.uncache;

  audioEngine.uncache = function (clip) {
    var path;

    if (typeof clip === 'string') {
      // backward compatibility since 1.10
      cc.warnID(8401, 'cc.audioEngine', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
      path = clip;
    } else {
      if (!clip) {
        return;
      }

      path = clip._nativeAsset;
    }

    audioEngine._uncache(path);
  };

  audioEngine._preload = audioEngine.preload;

  audioEngine.preload = function (filePath, callback) {
    cc.warn('`cc.audioEngine.preload` is deprecated, use `cc.loader.loadRes(url, cc.AudioClip)` instead please.');

    audioEngine._preload(filePath, callback);
  };
})(cc.Audio.prototype, jsb.AudioEngine);

},{}],28:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
  if (!(cc && cc.EditBox)) {
    return;
  }

  var EditBox = cc.EditBox;
  var js = cc.js;
  var KeyboardReturnType = EditBox.KeyboardReturnType;
  var InputMode = EditBox.InputMode;
  var InputFlag = EditBox.InputFlag;
  var MAX_VALUE = 65535;
  var worldMat = new cc.Mat4(),
      cameraMat = new cc.Mat4();

  function getInputType(type) {
    switch (type) {
      case InputMode.EMAIL_ADDR:
        return 'email';

      case InputMode.NUMERIC:
      case InputMode.DECIMAL:
        return 'number';

      case InputMode.PHONE_NUMBER:
        return 'phone';

      case InputMode.URL:
        return 'url';

      case InputMode.SINGLE_LINE:
      case InputMode.ANY:
      default:
        return 'text';
    }
  }

  function getKeyboardReturnType(type) {
    switch (type) {
      case KeyboardReturnType.DEFAULT:
      case KeyboardReturnType.DONE:
        return 'done';

      case KeyboardReturnType.SEND:
        return 'send';

      case KeyboardReturnType.SEARCH:
        return 'search';

      case KeyboardReturnType.GO:
        return 'go';

      case KeyboardReturnType.NEXT:
        return 'next';
    }

    return 'done';
  }

  var BaseClass = EditBox._ImplClass;

  function JsbEditBoxImpl() {
    BaseClass.call(this);
  }

  js.extend(JsbEditBoxImpl, BaseClass);
  EditBox._ImplClass = JsbEditBoxImpl;
  Object.assign(JsbEditBoxImpl.prototype, {
    init: function init(delegate) {
      if (!delegate) {
        cc.error('EditBox init failed');
        return;
      }

      this._delegate = delegate;
    },
    beginEditing: function beginEditing() {
      var self = this;
      var delegate = this._delegate;
      var multiline = delegate.inputMode === InputMode.ANY;

      var rect = this._getRect();

      var maxLength = delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength;
      var inputTypeString = getInputType(delegate.inputMode);

      if (delegate.inputFlag === InputFlag.PASSWORD) {
        inputTypeString = 'password';
      }

      function onConfirm(res) {
        delegate.editBoxEditingReturn();
      }

      function onInput(res) {
        if (delegate._string !== res.value) {
          delegate.editBoxTextChanged(res.value);
        }
      }

      function onComplete(res) {
        self.endEditing();
      }

      jsb.inputBox.onInput(onInput);
      jsb.inputBox.onConfirm(onConfirm);
      jsb.inputBox.onComplete(onComplete);

      if (!cc.sys.isMobile) {
        this._delegate._hideLabels();
      }

      jsb.inputBox.show({
        defaultValue: delegate._string,
        maxLength: maxLength,
        multiple: multiline,
        confirmHold: false,
        confirmType: getKeyboardReturnType(delegate.returnType),
        inputType: inputTypeString,
        originX: rect.x,
        originY: rect.y,
        width: rect.width,
        height: rect.height
      });
      this._editing = true;
      delegate.editBoxEditingDidBegan();
    },
    endEditing: function endEditing() {
      jsb.inputBox.offConfirm();
      jsb.inputBox.offInput();
      jsb.inputBox.offComplete();
      this._editing = false;

      if (!cc.sys.isMobile) {
        this._delegate._showLabels();
      }

      jsb.inputBox.hide();

      this._delegate.editBoxEditingDidEnded();
    },
    _getRect: function _getRect() {
      var node = this._delegate.node,
          viewScaleX = cc.view._scaleX,
          viewScaleY = cc.view._scaleY;
      var dpr = cc.view._devicePixelRatio;
      node.getWorldMatrix(worldMat);
      var camera = cc.Camera.findCamera(node);
      camera.getWorldToScreenMatrix2D(cameraMat);
      cc.Mat4.multiply(cameraMat, cameraMat, worldMat);
      var contentSize = node._contentSize;
      var vec3 = cc.v3();
      vec3.x = -node._anchorPoint.x * contentSize.width;
      vec3.y = -node._anchorPoint.y * contentSize.height;
      cc.Mat4.translate(cameraMat, cameraMat, vec3);
      viewScaleX /= dpr;
      viewScaleY /= dpr;
      var finalScaleX = cameraMat.m[0] * viewScaleX;
      var finaleScaleY = cameraMat.m[5] * viewScaleY;
      var viewportRect = cc.view._viewportRect;
      var offsetX = viewportRect.x / dpr,
          offsetY = viewportRect.y / dpr;
      return {
        x: cameraMat.m[12] * viewScaleX + offsetX,
        y: cameraMat.m[13] * viewScaleY + offsetY,
        width: contentSize.width * finalScaleX,
        height: contentSize.height * finaleScaleY
      };
    }
  });
})();

},{}],29:[function(require,module,exports){
"use strict";

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
(function () {
  if (!cc.EffectVariant) return;
  var EffectVariant = cc.EffectVariant;
  var _init = EffectVariant.prototype.init;
  Object.assign(EffectVariant.prototype, {
    init: function init(effect) {
      _init.call(this, effect);

      this._nativeObj = new renderer.EffectVariant(effect._nativeObj);
    },
    _onEffectChanged: function _onEffectChanged() {
      var nativeEffect = this._effect ? this._effect._nativeObj : null;

      this._nativeObj.setEffect(nativeEffect);
    },
    updateHash: function updateHash(hash) {
      this._nativeObj.updateHash(hash);
    }
  });
})();

},{}],30:[function(require,module,exports){
"use strict";

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
var gfx = window.gfx; // Effect

var Effect = cc.Effect;
var _init = Effect.prototype.init;
var _clone = Effect.prototype.clone;
var _switchTechnique = Effect.prototype.switchTechnique;
Object.assign(Effect.prototype, {
  init: function init(name, techniques, techniqueIndex, asset, createNative) {
    _init.call(this, name, techniques, techniqueIndex, asset);

    if (createNative) {
      this._nativeObj = new renderer.EffectNative();

      this._nativeObj.init(techniques);

      this._nativePtr = this._nativeObj.self();
    }
  },
  clone: function clone() {
    var effect = _clone.call(this);

    effect._nativeObj = new renderer.EffectNative();

    effect._nativeObj.copy(this._nativeObj);

    effect._nativePtr = effect._nativeObj.self();
    return effect;
  },
  switchTechnique: function switchTechnique(techniqueIndex) {
    _switchTechnique.call(this, techniqueIndex);

    this._nativeObj.switchTechnique(techniqueIndex);
  }
}); // EffectBase

var EffectBase = cc.EffectBase;
var _setCullMode = EffectBase.prototype.setCullMode;
var _setBlend = EffectBase.prototype.setBlend;
var _setStencilEnabled = EffectBase.prototype.setStencilEnabled;
var _setStencil = EffectBase.prototype.setStencil;
var _setDepth = EffectBase.prototype.setDepth;
var _define = EffectBase.prototype.define;
var _setProperty = EffectBase.prototype.setProperty;
Object.assign(EffectBase.prototype, {
  setCullMode: function setCullMode() {
    var cullMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gfx.CULL_BACK;
    var passIdx = arguments.length > 1 ? arguments[1] : undefined;

    _setCullMode.call(this, cullMode, passIdx);

    this._nativeObj.setCullMode(cullMode, passIdx === undefined ? -1 : passIdx);
  },
  setBlend: function setBlend() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var blendEq = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gfx.BLEND_FUNC_ADD;
    var blendSrc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gfx.BLEND_SRC_ALPHA;
    var blendDst = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gfx.BLEND_ONE_MINUS_SRC_ALPHA;
    var blendAlphaEq = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : gfx.BLEND_FUNC_ADD;
    var blendSrcAlpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : gfx.BLEND_SRC_ALPHA;
    var blendDstAlpha = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : gfx.BLEND_ONE_MINUS_SRC_ALPHA;
    var blendColor = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0xffffffff;
    var passIdx = arguments.length > 8 ? arguments[8] : undefined;

    _setBlend.call(this, enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx);

    this._nativeObj.setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx === undefined ? -1 : passIdx);
  },
  setDepth: function setDepth(depthTest, depthWrite, depthFunc, passIdx) {
    _setDepth.call(this, depthTest, depthWrite, depthFunc, passIdx);

    this._nativeObj.setDepth(depthTest, depthWrite, depthFunc, passIdx === undefined ? -1 : passIdx);
  },
  setStencilEnabled: function setStencilEnabled(enabled, passIdx) {
    _setStencilEnabled.call(this, enabled, passIdx);

    this._nativeObj.setStencilTest(enabled, passIdx === undefined ? -1 : passIdx);
  },
  setStencil: function setStencil() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gfx.STENCIL_INHERIT;
    var stencilFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gfx.DS_FUNC_ALWAYS;
    var stencilRef = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var stencilMask = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0xff;
    var stencilFailOp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : gfx.STENCIL_OP_KEEP;
    var stencilZFailOp = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : gfx.STENCIL_OP_KEEP;
    var stencilZPassOp = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : gfx.STENCIL_OP_KEEP;
    var stencilWriteMask = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0xff;
    var passIdx = arguments.length > 8 ? arguments[8] : undefined;

    _setStencil.call(this, enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx);

    this._nativeObj.setStencil(stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx === undefined ? -1 : passIdx);
  },
  define: function define(name, value, passIdx, force) {
    _define.call(this, name, value, passIdx, force);

    this._nativeObj.define(name, value, passIdx === undefined ? -1 : passIdx);
  },
  updateHash: function updateHash(hash) {
    this._nativeObj.updateHash(hash);
  },
  setProperty: function setProperty(name, val, passIdx, directly) {
    _setProperty.call(this, name, val, passIdx);

    var prop = this.getProperty(name);

    if (prop !== undefined) {
      this._nativeObj.setProperty(name, prop, passIdx === undefined ? -1 : passIdx, directly);
    }
  }
});

},{}],31:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
cc.game.restart = function () {
  // Need to clear scene, or native object destructor won't be invoke.
  cc.director.getScene().destroy();

  cc.Object._deferredDestroy();

  __restartVM();
};

jsb.onPause = function () {
  cc.game.emit(cc.game.EVENT_HIDE);
};

jsb.onResume = function () {
  cc.game.emit(cc.game.EVENT_SHOW);
};

function resize(size) {
  // size should be the css style
  size.width /= cc.view._devicePixelRatio;
  size.height /= cc.view._devicePixelRatio;
  window.resize(size.width, size.height);
}

jsb.onResize = function (size) {
  if (size.width === 0 || size.height === 0) return; // getSafeAreaEdge is asynchronous on iOS, so callback later is required

  if (CC_JSB && cc.sys.os === cc.sys.OS_IOS) {
    var edges = jsb.Device.getSafeAreaEdge();
    var hasSafeArea = edges.x > 0 || edges.y > 0 || edges.z > 0 || edges.w > 0;

    if (hasSafeArea) {
      setTimeout(function () {
        if (cc.Vec4.strictEquals(edges, jsb.Device.getSafeAreaEdge())) {
          setTimeout(resize, 200, size);
        } else {
          resize(size);
        }
      }, 0);
      return;
    }
  }

  resize(size);
};

},{}],32:[function(require,module,exports){
/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var jsbUtils = require('./jsb-utils');

function downloadScript(item, callback) {
  require(item.url);

  return null;
}

var mediaDownloader = new jsb.Downloader();
var mediaUrlMap = {}; // key: url, value: { loadingItem, callback }

mediaDownloader.setOnFileTaskSuccess(function (task) {
  var _mediaUrlMap$task$req = mediaUrlMap[task.requestURL],
      item = _mediaUrlMap$task$req.item,
      callback = _mediaUrlMap$task$req.callback;

  if (!(item && callback)) {
    return;
  }

  item.url = task.storagePath;
  item.rawUrl = task.storagePath;
  callback(null, item);
  delete mediaUrlMap[task.requestURL];
});
mediaDownloader.setOnTaskError(function (task, errorCode, errorCodeInternal, errorStr) {
  var callback = mediaUrlMap[task.requestURL].callback;
  callback && callback(errorStr, null);
  delete mediaUrlMap[task.requestURL];
});

function downloadMedia(item, callback) {
  if (/^http/.test(item.url)) {
    var fileName = jsbUtils.murmurhash2_32_gc(item.url) + cc.path.extname(item.url);
    var storagePath = jsb.fileUtils.getWritablePath() + fileName; // load from local cache

    if (jsb.fileUtils.isFileExist(storagePath)) {
      item.url = storagePath;
      item.rawUrl = storagePath;
      callback && callback(null, item);
    } // download remote media file
    else {
        mediaUrlMap[item.url] = {
          item: item,
          callback: callback
        };
        mediaDownloader.createDownloadFileTask(item.url, storagePath);
      } // Don't return anything to use async loading.

  } else {
    return item.url;
  }
}

function loadAudio(item, callback) {
  var loadByDeserializedAsset = item._owner instanceof cc.AudioClip;

  if (loadByDeserializedAsset) {
    return item.url;
  } else {
    var audioClip = new cc.AudioClip(); // obtain user url through nativeUrl

    audioClip._setRawAsset(item.rawUrl, false); // obtain download url through _nativeAsset


    audioClip._nativeAsset = item.url;
    return audioClip;
  }
}

function downloadImage(item, callback) {
  var img = new Image();
  img.src = item.url;

  img.onload = function (info) {
    callback(null, img);
  };

  img.onerror = function (event) {
    callback(new Error('load image fail:' + img.src), null);
  }; // Don't return anything to use async loading.

}

function _getFontFamily(fontHandle) {
  var ttfIndex = fontHandle.lastIndexOf(".ttf");
  if (ttfIndex === -1) return fontHandle;
  var slashPos = fontHandle.lastIndexOf("/");
  var fontFamilyName;

  if (slashPos === -1) {
    fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
  } else {
    fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
  }

  if (fontFamilyName.indexOf(' ') !== -1) {
    fontFamilyName = '"' + fontFamilyName + '"';
  }

  return fontFamilyName;
}

function downloadText(item) {
  var url = item.url;
  var result = jsb.fileUtils.getStringFromFile(url);

  if (typeof result === 'string' && result) {
    return result;
  } else {
    return new Error('Download text failed: ' + url);
  }
}

function downloadBinary(item) {
  var url = item.url;
  var result = jsb.fileUtils.getDataFromFile(url);

  if (result) {
    return result;
  } else {
    return new Error('Download binary file failed: ' + url);
  }
}

function loadFont(item, callback) {
  var url = item.url;

  var fontFamilyName = _getFontFamily(url);

  var fontFace = new FontFace(fontFamilyName, "url('" + url + "')");
  document.fonts.add(fontFace);
  fontFace.load();
  fontFace.loaded.then(function () {
    callback(null, fontFamilyName);
  }, function () {
    cc.warnID(4933, fontFamilyName);
    callback(null, fontFamilyName);
  });
}

function loadCompressedTex(item) {
  return item.content;
}

cc.loader.addDownloadHandlers({
  // JS
  'js': downloadScript,
  'jsc': downloadScript,
  // Images
  'png': downloadImage,
  'jpg': downloadImage,
  'bmp': downloadImage,
  'jpeg': downloadImage,
  'gif': downloadImage,
  'ico': downloadImage,
  'tiff': downloadImage,
  'webp': downloadImage,
  'image': downloadImage,
  'pvr': downloadImage,
  'pkm': downloadImage,
  // Audio
  'mp3': downloadMedia,
  'ogg': downloadMedia,
  'wav': downloadMedia,
  'm4a': downloadMedia,
  // Video
  'mp4': downloadMedia,
  'avi': downloadMedia,
  'mov': downloadMedia,
  'mpg': downloadMedia,
  'mpeg': downloadMedia,
  'rm': downloadMedia,
  'rmvb': downloadMedia,
  // Text
  'txt': downloadText,
  'xml': downloadText,
  'vsh': downloadText,
  'fsh': downloadText,
  'atlas': downloadText,
  'tmx': downloadText,
  'tsx': downloadText,
  'json': downloadText,
  'ExportJson': downloadText,
  'plist': downloadText,
  'fnt': downloadText,
  'binary': downloadBinary,
  'bin': downloadBinary,
  'dbbin': downloadBinary,
  'skel': downloadBinary,
  'default': downloadText
});
cc.loader.addLoadHandlers({
  // Font
  'font': loadFont,
  'eot': loadFont,
  'ttf': loadFont,
  'woff': loadFont,
  'svg': loadFont,
  'ttc': loadFont,
  // Audio
  'mp3': loadAudio,
  'ogg': loadAudio,
  'wav': loadAudio,
  'm4a': loadAudio,
  // compressed texture
  'pvr': loadCompressedTex,
  'pkm': loadCompressedTex
});

},{"./jsb-utils":38}],33:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
  if (window.middleware === undefined) return;
  var ParticleSystem = cc.ParticleSystem;
  if (ParticleSystem === undefined) return;
  var PSProto = ParticleSystem.prototype;

  PSProto.initProperties = function () {
    this._simulator = new middleware.ParticleSimulator();
    this._previewTimer = null;
    this._focused = false;
    this._texture = null;
    this._renderData = null;
    this._simulator.__particleSystem__ = this;

    this._simulator.setFinishedCallback(function () {
      var self = this.__particleSystem__;

      self._finishedSimulation();
    });

    this._simulator.setStopCallback(function () {
      var self = this.__particleSystem__;
      self.stopSystem();
    });

    this._initProperties();
  }; // value type properties


  var propertiesList = ["positionType", "emissionRate", "totalParticles", "duration", "emitterMode", "life", "lifeVar", "startSize", "startSizeVar", "endSize", "endSizeVar", "startSpin", "startSpinVar", "endSpin", "endSpinVar", "angle", "angleVar", "speed", "speedVar", "radialAccel", "radialAccelVar", "tangentialAccel", "tangentialAccelVar", "rotationIsDir", "startRadius", "startRadiusVar", "endRadius", "endRadiusVar", "rotatePerS", "rotatePerSVar"];
  propertiesList.forEach(function (getSetName) {
    var varName = "_" + getSetName;
    Object.defineProperty(PSProto, getSetName, {
      get: function get() {
        this[varName] === undefined && (this[varName] = 0);
        return this[varName];
      },
      set: function set(val) {
        this[varName] = val;
        this._simulator && (this._simulator[getSetName] = val);
      }
    });
  }); // object type properties

  var objPropList = ['gravity', 'sourcePos', 'posVar', 'startColor', 'startColorVar', 'endColor', 'endColorVar'];
  PSProto._initProperties = function () {
    // init properties
    for (var key in propertiesList) {
      var propName = propertiesList[key];
      this[propName] = this[propName];
    }

    for (var _key in objPropList) {
      var _propName = objPropList[_key];
      this[_propName] = this[_propName];
    }
  }, Object.defineProperty(PSProto, 'gravity', {
    get: function get() {
      !this._gravity && (this._gravity = cc.v2(0, 0));
      return this._gravity;
    },
    set: function set(val) {
      if (!val) return;
      !this._gravity && (this._gravity = cc.v2(0, 0));
      this.gravity.x = val.x;
      this.gravity.y = val.y;
      this._simulator && this._simulator.setGravity(val.x, val.y, 0);
    }
  });
  Object.defineProperty(PSProto, 'sourcePos', {
    get: function get() {
      !this._sourcePos && (this._sourcePos = cc.v2(0, 0));
      return this._sourcePos;
    },
    set: function set(val) {
      if (!val) return;
      !this._sourcePos && (this._sourcePos = cc.v2(0, 0));
      this._sourcePos.x = val.x;
      this._sourcePos.y = val.y;
      this._simulator && this._simulator.setSourcePos(val.x, val.y, 0);
    }
  });
  Object.defineProperty(PSProto, 'posVar', {
    get: function get() {
      !this._posVar && (this._posVar = cc.v2(0, 0));
      return this._posVar;
    },
    set: function set(val) {
      if (!val) return;
      !this._posVar && (this._posVar = cc.v2(0, 0));
      this._posVar.x = val.x;
      this._posVar.y = val.y;
      this._simulator && this._simulator.setPosVar(val.x, val.y, 0);
    }
  });
  Object.defineProperty(PSProto, 'startColor', {
    get: function get() {
      !this._startColor && (this._startColor = cc.color(255, 255, 255, 255));
      return this._startColor;
    },
    set: function set(val) {
      if (!val) return;
      !this._startColor && (this._startColor = cc.color(255, 255, 255, 255));
      this._startColor.r = val.r;
      this._startColor.g = val.g;
      this._startColor.b = val.b;
      this._startColor.a = val.a;
      this._simulator && this._simulator.setStartColor(val.r, val.g, val.b, val.a);
    }
  });
  Object.defineProperty(PSProto, 'startColorVar', {
    get: function get() {
      !this._startColorVar && (this._startColorVar = cc.color(0, 0, 0, 0));
      return this._startColorVar;
    },
    set: function set(val) {
      if (!val) return;
      !this._startColorVar && (this._startColorVar = cc.color(0, 0, 0, 0));
      this._startColorVar.r = val.r;
      this._startColorVar.g = val.g;
      this._startColorVar.b = val.b;
      this._startColorVar.a = val.a;
      this._simulator && this._simulator.setStartColorVar(val.r, val.g, val.b, val.a);
    }
  });
  Object.defineProperty(PSProto, 'endColor', {
    get: function get() {
      !this._endColor && (this._endColor = cc.color(255, 255, 255, 0));
      return this._endColor;
    },
    set: function set(val) {
      if (!val) return;
      !this._endColor && (this._endColor = cc.color(255, 255, 255, 0));
      this._endColor.r = val.r;
      this._endColor.g = val.g;
      this._endColor.b = val.b;
      this._endColor.a = val.a;
      this._simulator && this._simulator.setEndColor(val.r, val.g, val.b, val.a);
    }
  });
  Object.defineProperty(PSProto, 'endColorVar', {
    get: function get() {
      !this._endColorVar && (this._endColorVar = cc.color(0, 0, 0, 0));
      return this._endColorVar;
    },
    set: function set(val) {
      if (!val) return;
      !this._endColorVar && (this._endColorVar = cc.color(0, 0, 0, 0));
      this._endColorVar.r = val.r;
      this._endColorVar.g = val.g;
      this._endColorVar.b = val.b;
      this._endColorVar.a = val.a;
      this._simulator && this._simulator.setEndColorVar(val.r, val.g, val.b, val.a);
    }
  });
  Object.defineProperty(PSProto, 'particleCount', {
    get: function get() {
      if (!this._simulator) {
        return 0;
      }

      return this._simulator.getParticleCount();
    }
  });
  Object.defineProperty(PSProto, 'active', {
    get: function get() {
      if (!this._simulator) {
        return false;
      }

      return this._simulator.active();
    }
  });

  PSProto.onLoad = function () {
    this._simulator.bindNodeProxy(this.node._proxy);
  }; // shield in native


  PSProto.update = null;
  PSProto.lateUpdate = null;

  PSProto._resetAssembler = function () {
    this._assembler = new renderer.CustomAssembler();

    this._assembler.setUseModel(true);

    this.node._proxy.setAssembler(this._assembler);
  };

  var _onEnable = PSProto.onEnable;

  PSProto.onEnable = function () {
    _onEnable.call(this);

    if (this._simulator) {
      this._simulator.onEnable();
    }
  };

  var _onDisable = PSProto.onDisable;

  PSProto.onDisable = function () {
    _onDisable.call(this);

    if (this._simulator) {
      this._simulator.onDisable();
    }
  };

  PSProto._onTextureLoaded = function () {
    this._simulator.updateUVs(this._renderSpriteFrame.uv);

    this._syncAspect();

    this._simulator.aspectRatio = this._aspectRatio || 1.0;

    this._updateMaterial();

    this.markForRender(true);
  };

  var _updateMaterial = PSProto._updateMaterial;

  PSProto._updateMaterial = function () {
    _updateMaterial.call(this);

    var material = this._materials[0];
    material && this._simulator.setEffect(material.effect._nativeObj);
  };

  var _initWithDictionary = PSProto._initWithDictionary;

  PSProto._initWithDictionary = function (content) {
    _initWithDictionary.call(this, content);

    this._initProperties();
  };

  var __preload = PSProto.__preload;

  PSProto.__preload = function () {
    __preload.call(this);

    this._initProperties();
  };
})();

},{}],34:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// JS to Native bridges
if (window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID) {
  jsb.reflection = new JavascriptJavaBridge();
  cc.sys.capabilities["keyboard"] = true;
} else if (window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)) {
  jsb.reflection = new JavaScriptObjCBridge();
}

},{}],35:[function(require,module,exports){
"use strict";

(function () {
  if (!cc.SkinnedMeshRenderer) return;
  var SkinnedMeshAssembler = cc.SkinnedMeshRenderer.__assembler__.prototype;
  cc.js.mixin(SkinnedMeshAssembler, {
    updateRenderData: function updateRenderData(comp) {
      comp.calcJointMatrix();
      comp.node._renderFlag |= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
  });
})();

},{}],36:[function(require,module,exports){
/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var sys = cc.sys;
sys.getNetworkType = jsb.Device.getNetworkType;
sys.getBatteryLevel = jsb.Device.getBatteryLevel;
sys.garbageCollect = jsb.garbageCollect;
sys.restartVM = __restartVM;
sys.isObjectValid = __isObjectValid;

sys.getSafeAreaRect = function () {
  // x(top), y(left), z(bottom), w(right)
  var edge = jsb.Device.getSafeAreaEdge();
  var screenSize = cc.view.getFrameSize(); // Get leftBottom and rightTop point in UI coordinates

  var leftBottom = new cc.Vec2(edge.y, screenSize.height - edge.z);
  var rightTop = new cc.Vec2(screenSize.width - edge.w, edge.x); // Returns the real location in view.

  var relatedPos = {
    left: 0,
    top: 0,
    width: screenSize.width,
    height: screenSize.height
  };
  cc.view.convertToLocationInView(leftBottom.x, leftBottom.y, relatedPos, leftBottom);
  cc.view.convertToLocationInView(rightTop.x, rightTop.y, relatedPos, rightTop); // convert view point to design resolution size

  cc.view._convertPointWithScale(leftBottom);

  cc.view._convertPointWithScale(rightTop);

  return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
};

},{}],37:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
  if (!cc.TiledMap) return;
  var RenderFlow = cc.RenderFlow; // tiled layer

  var TiledLayer = cc.TiledLayer.prototype;
  var _addUserNode = TiledLayer.addUserNode;

  TiledLayer.addUserNode = function (node) {
    var result = _addUserNode.call(this, node);

    if (result) {
      var proxy = node._proxy;
      proxy && proxy.enableVisit(false);
    }
  };

  var _removeUserNode = TiledLayer.removeUserNode;

  TiledLayer.removeUserNode = function (node) {
    var result = _removeUserNode.call(this, node);

    if (result) {
      var proxy = node._proxy;
      proxy && proxy.enableVisit(true);
    }
  }; // override _activateMaterial to upload hash value to native


  var _activateMaterial = TiledLayer._activateMaterial;

  TiledLayer._activateMaterial = function () {
    _activateMaterial.call(this);

    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      var m = materials[i];
      if (m) m.getHash();
    }
  }; // tiledmap buffer


  var TiledMapBuffer = cc.TiledMapBuffer.prototype;

  TiledMapBuffer._updateOffset = function () {
    var offsetInfo = this._offsetInfo;
    offsetInfo.vertexOffset = this.vertexOffset;
    offsetInfo.indiceOffset = this.indiceOffset;
    offsetInfo.byteOffset = this.byteOffset;
  }; // tiledmap render data list


  var TiledMapRenderDataList = cc.TiledMapRenderDataList.prototype;

  TiledMapRenderDataList._pushRenderData = function () {
    var renderData = {};
    renderData.ia = {};
    renderData.nodesRenderList = [];

    this._dataList.push(renderData);
  };

  TiledMapRenderDataList.reset = function () {
    this._offset = 0;
    var assembler = this._nativeAssembler;
    assembler._effect.length = 0;
    assembler.reset();
  };

  TiledMapRenderDataList.setNativeAssembler = function (assembler) {
    this._nativeAssembler = assembler;
  };

  TiledMapRenderDataList.popRenderData = function (buffer) {
    if (this._offset >= this._dataList.length) {
      this._pushRenderData();
    }

    var renderData = this._dataList[this._offset];
    renderData.nodesRenderList.length = 0;

    this._nativeAssembler.clearNodes(this._offset);

    var ia = renderData.ia;
    ia._meshIndex = buffer.getCurMeshIndex();
    ia._start = buffer.indiceOffset;
    ia._count = 0;
    ia._verticesStart = buffer.vertexOffset;
    ia._index = this._offset;
    this._offset++;
    return renderData;
  };

  TiledMapRenderDataList.pushNodesList = function (renderData, nodesList) {
    var nodesRenderList = renderData.nodesRenderList;
    nodesRenderList.push(nodesList);
    var nativeNodes = [];

    for (var j = 0; j < nodesRenderList.length; j++) {
      var _nodesList = nodesRenderList[j];
      if (!_nodesList) continue;

      for (var idx = 0; idx < _nodesList.length; idx++) {
        var dataComp = _nodesList[idx];
        if (!dataComp) continue;
        nativeNodes.push(dataComp.node._id);
      }
    }

    this._nativeAssembler.updateNodes(renderData.ia._index, nativeNodes);
  };

  var ModelBatcherDelegate = cc.Class({
    ctor: function ctor() {
      this._nativeAssembler = null;
    },
    setNativeAssembler: function setNativeAssembler(assembler) {
      this._nativeAssembler = assembler;
    },
    setBuffer: function setBuffer(buffer) {
      this._buffer = buffer;
    },
    _flushIA: function _flushIA(ia) {
      var iaIndex = ia._index;
      var meshIndex = ia._meshIndex;

      this._nativeAssembler.updateMeshIndex(iaIndex, meshIndex);

      var verticesStart = ia._verticesStart;
      var verticesOffset = this._buffer.vertexOffset;
      var vertexCount = verticesOffset - verticesStart;

      this._nativeAssembler.updateVerticesRange(iaIndex, verticesStart, vertexCount);

      this._nativeAssembler.updateIndicesRange(iaIndex, ia._start, ia._count);

      this._nativeAssembler.updateMaterial(iaIndex, this.material);
    },
    _flush: function _flush() {}
  });
  var TiledMapAssembler = cc.TiledLayer.__assembler__.prototype;
  var _fillBuffers = TiledMapAssembler.fillBuffers;
  cc.js.mixin(TiledMapAssembler, {
    _extendNative: function _extendNative() {
      renderer.TiledMapAssembler.prototype.ctor.call(this);
    },
    // override _updateRenderData function avoid base class cover material
    _updateRenderData: function _updateRenderData() {
      if (!this._renderComp || !this._renderComp.isValid) return;
      this.updateRenderData(this._renderComp);
    },
    updateRenderData: function updateRenderData(comp) {
      if (!comp._modelBatcherDelegate) {
        comp._buffer = new cc.TiledMapBuffer(null, cc.gfx.VertexFormat.XY_UV_Color);
        comp._renderDataList = new cc.TiledMapRenderDataList();
        comp._modelBatcherDelegate = new ModelBatcherDelegate();

        comp._buffer.setNativeAssembler(this);

        comp._renderDataList.setNativeAssembler(this);

        comp._modelBatcherDelegate.setBuffer(comp._buffer);

        comp._modelBatcherDelegate.setNativeAssembler(this);
      }

      _fillBuffers.call(this, comp, comp._modelBatcherDelegate);

      comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
  }, renderer.TiledMapAssembler.prototype);
})();

},{}],38:[function(require,module,exports){
"use strict";

var jsbUtils = {
  /****************************************************************************
  Copyright (c) 2011 Gary Court
      http://github.com/garycourt/murmurhash-js
   Permission is hereby granted, free of charge, to any person obtaining a copy 
  of this software and associated documentation files (the "Software"), to deal 
  in the Software without restriction, including without limitation the rights 
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
  copies of the Software, and to permit persons to whom the Software is furnished 
  to do so, subject to the following conditions:
   The above copyright notice and this permission notice shall be included in all 
  copies or substantial portions of the Software.
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  ****************************************************************************/
  murmurhash2_32_gc: function murmurhash2_32_gc(str, seed) {
    var l = str.length,
        h = seed ^ l,
        i = 0,
        k;

    while (l >= 4) {
      k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
      k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
      k ^= k >>> 24;
      k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
      l -= 4;
      ++i;
    }

    switch (l) {
      case 3:
        h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

      case 2:
        h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

      case 1:
        h ^= str.charCodeAt(i) & 0xff;
        h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    }

    h ^= h >>> 13;
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h ^= h >>> 15;
    return h >>> 0;
  }
};
module.exports = jsbUtils;

},{}],39:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
  if (!(cc && cc.VideoPlayer && cc.VideoPlayer.Impl)) {
    return;
  }

  var vec3 = cc.Vec3;

  var _worldMat = new cc.Mat4();

  var _topLeft = new vec3();

  var _bottomRight = new vec3();

  var _impl = cc.VideoPlayer.Impl;
  var _p = cc.VideoPlayer.Impl.prototype;

  _p._bindEvent = function () {
    var video = this._video,
        self = this;

    if (!video) {
      return;
    } //binding event


    var cbs = this.__eventListeners;

    cbs.loadedmetadata = function () {
      self._loadedmeta = true;

      self._dispatchEvent(_impl.EventType.META_LOADED);
    };

    cbs.ended = function () {
      if (self._video !== video) return;
      self._playing = false;

      self._dispatchEvent(_impl.EventType.COMPLETED);
    };

    cbs.play = function () {
      if (self._video !== video) return;
      self._playing = true;

      self._dispatchEvent(_impl.EventType.PLAYING);
    };

    cbs.pause = function () {
      if (self._ignorePause || self._video !== video) return;
      self._playing = false;

      self._dispatchEvent(_impl.EventType.PAUSED);
    };

    cbs.click = function () {
      self._dispatchEvent(_impl.EventType.CLICKED);
    };

    cbs.stoped = function () {
      self._dispatchEvent(_impl.EventType.STOPPED);

      self._ignorePause = false;
    };

    video.addEventListener("loadedmetadata", cbs.loadedmetadata);
    video.addEventListener("ended", cbs.ended);
    video.addEventListener("play", cbs.play);
    video.addEventListener("pause", cbs.pause);
    video.addEventListener("click", cbs.click);
    video.addEventListener("stoped", cbs.stoped);

    function onCanPlay() {
      if (this._loaded) return;
      this._loaded = true;

      this._dispatchEvent(_impl.EventType.READY_TO_PLAY);

      this._updateVisibility();
    }

    cbs.onCanPlay = onCanPlay.bind(this);
    video.addEventListener('canplay', cbs.onCanPlay);
    video.addEventListener('canplaythrough', cbs.onCanPlay);
    video.addEventListener('suspend', cbs.onCanPlay);
  };

  _p._updateVisibility = function () {
    if (!this._video) return;
    var video = this._video;

    if (this._visible) {
      this._video.setVisible(true);
    } else {
      this._video.setVisible(false);

      video.pause();
      this._playing = false;
    }
  };

  _p._updateSize = function (width, height) {};

  _p.createDomElementIfNeeded = function () {
    if (!jsb.VideoPlayer) {
      cc.warn('VideoPlayer is not supported.');
      return null;
    }

    if (!this._video) {
      this._video = new jsb.VideoPlayer();
    }
  };

  _p.removeDom = function () {
    var video = this._video;

    if (video) {
      video.stop();
      video.setVisible(false);
      var cbs = this.__eventListeners;
      cbs.loadedmetadata = null;
      cbs.ended = null;
      cbs.play = null;
      cbs.pause = null;
      cbs.click = null;
      cbs.onCanPlay = null;
      video.destroy();
    }

    this._video = null;
    this._url = "";
  };

  _p.setURL = function (path) {
    var source, extname;

    if (this._url === path) {
      return;
    }

    this.removeDom();
    this._url = path;
    this.createDomElementIfNeeded();

    this._bindEvent();

    var video = this._video;

    if (!video) {
      return;
    }

    video.setVisible(this._visible);
    this._loaded = false;
    this._played = false;
    this._playing = false;
    this._loadedmeta = false;
    video.setURL(this._url);
    this._forceUpdate = true;
  };

  _p.getURL = function () {
    return this._url;
  };

  _p.play = function () {
    var video = this._video;
    if (!video || !this._visible || this._playing) return;
    video.play();
    this._playing = true;
  };

  _p.setStayOnBottom = function (enabled) {};

  _p.pause = function () {
    var video = this._video;
    if (!this._playing || !video) return;
    video.pause();
    this._playing = false;
  };

  _p.resume = function () {
    var video = this._video;
    if (this._playing || !video) return;
    video.resume();
    this._playing = true;
  };

  _p.stop = function () {
    var video = this._video;
    if (!video || !this._visible) return;
    this._ignorePause = true;
    video.stop();
    this._playing = false;
  };

  _p.setVolume = function (volume) {};

  _p.seekTo = function (time) {
    var video = this._video;
    if (!video) return;

    if (this._loaded) {
      video.seekTo(time);
    } else {
      var cb = function cb() {
        video.seekTo(time);
      };

      video.addEventListener(_impl._polyfill.event, cb);
    }

    if (_impl._polyfill.autoplayAfterOperation && this.isPlaying()) {
      setTimeout(function () {
        video.play();
      }, 20);
    }
  };

  _p.isPlaying = function () {
    return this._playing;
  };

  _p.duration = function () {
    var video = this._video;
    var duration = -1;
    if (!video) return duration;
    duration = video.duration();

    if (duration <= 0) {
      cc.logID(7702);
    }

    return duration;
  };

  _p.currentTime = function () {
    var video = this._video;
    if (!video) return -1;
    return video.currentTime();
  };

  _p.setKeepAspectRatioEnabled = function (isEnabled) {
    if (!this._video) {
      return false;
    }

    return this._video.setKeepAspectRatioEnabled(isEnabled);
  };

  _p.isKeepAspectRatioEnabled = function () {
    if (!this._video) {
      return false;
    }

    return this._video.isKeepAspectRatioEnabled();
  };

  _p.isFullScreenEnabled = function () {
    return this._fullScreenEnabled;
  };

  _p.setEventListener = function (event, callback) {
    this._EventList[event] = callback;
  };

  _p.removeEventListener = function (event) {
    this._EventList[event] = null;
  };

  _p._dispatchEvent = function (event) {
    var callback = this._EventList[event];
    if (callback) callback.call(this, this, this._video.src);
  };

  _p.onPlayEvent = function () {
    var callback = this._EventList[_impl.EventType.PLAYING];
    callback.call(this, this, this._video.src);
  };

  _p.enable = function () {
    var list = _impl.elements;
    if (list.indexOf(this) === -1) list.push(this);
    this.setVisible(true);
  };

  _p.disable = function () {
    var list = _impl.elements;
    var index = list.indexOf(this);
    if (index !== -1) list.splice(index, 1);
    this.setVisible(false);
  };

  _p.destroy = function () {
    this.disable();
    this.removeDom();
  };

  _p.setVisible = function (visible) {
    if (this._visible !== visible) {
      this._visible = !!visible;

      this._updateVisibility();
    }
  };

  _p.setFullScreenEnabled = function (enable) {
    var video = this._video;

    if (!video) {
      return;
    }

    this._fullScreenEnabled = enable;
    video.setFullScreenEnabled(enable);
  };

  _p.updateMatrix = function (node) {
    if (!this._video || !this._visible) return;
    node.getWorldMatrix(_worldMat);

    if (!this._forceUpdate && this._m00 === _worldMat.m[0] && this._m01 === _worldMat.m[1] && this._m04 === _worldMat.m[4] && this._m05 === _worldMat.m[5] && this._m12 === _worldMat.m[12] && this._m13 === _worldMat.m[13] && this._w === node._contentSize.width && this._h === node._contentSize.height) {
      return;
    } // update matrix cache


    this._m00 = _worldMat.m[0];
    this._m01 = _worldMat.m[1];
    this._m04 = _worldMat.m[4];
    this._m05 = _worldMat.m[5];
    this._m12 = _worldMat.m[12];
    this._m13 = _worldMat.m[13];
    this._w = node._contentSize.width;
    this._h = node._contentSize.height;

    var camera = cc.Camera.findCamera(node)._camera;

    var canvas_width = cc.game.canvas.width;
    var canvas_height = cc.game.canvas.height;
    var ap = node._anchorPoint; // Vectors in node space

    vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
    vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0); // Convert to world space

    vec3.transformMat4(_topLeft, _topLeft, _worldMat);
    vec3.transformMat4(_bottomRight, _bottomRight, _worldMat); // Convert to Screen space

    camera.worldToScreen(_topLeft, _topLeft, canvas_width, canvas_height);
    camera.worldToScreen(_bottomRight, _bottomRight, canvas_width, canvas_height);
    var finalWidth = _bottomRight.x - _topLeft.x;
    var finalHeight = _topLeft.y - _bottomRight.y;

    this._video.setFrame(_topLeft.x, canvas_height - _topLeft.y, finalWidth, finalHeight);
  };

  _impl.EventType = {
    PLAYING: 0,
    PAUSED: 1,
    STOPPED: 2,
    COMPLETED: 3,
    META_LOADED: 4,
    CLICKED: 5,
    READY_TO_PLAY: 6
  }; // video 队列，所有 vidoe 在 onEnter 的时候都会插入这个队列

  _impl.elements = []; // video 在 game_hide 事件中被自动暂停的队列，用于回复的时候重新开始播放

  _impl.pauseElements = [];
  cc.game.on(cc.game.EVENT_HIDE, function () {
    var list = _impl.elements;

    for (var element, i = 0; i < list.length; i++) {
      element = list[i];

      if (element.isPlaying()) {
        element.pause();

        _impl.pauseElements.push(element);
      }
    }
  });
  cc.game.on(cc.game.EVENT_SHOW, function () {
    var list = _impl.pauseElements;
    var element = list.pop();

    while (element) {
      element.play();
      element = list.pop();
    }
  });
})();

},{}],40:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
  if (!(cc && cc.WebView && cc.WebView.Impl)) {
    return;
  }

  var vec3 = cc.Vec3;

  var _worldMat = new cc.Mat4();

  var _topLeft = new vec3();

  var _bottomRight = new vec3();

  cc.WebView.Impl = cc.Class({
    "extends": cc.WebView.Impl,
    ctor: function ctor() {
      // keep webview data
      this.jsCallback = null;
      this.interfaceSchema = null;
    }
  });
  var _impl = cc.WebView.Impl;
  var _p = cc.WebView.Impl.prototype;

  _p._updateVisibility = function () {
    if (!this._iframe) return;

    this._iframe.setVisible(this._visible);
  };

  _p._updateSize = function (w, h) {};

  _p._initEvent = function () {
    var iframe = this._iframe;

    if (iframe) {
      var cbs = this.__eventListeners,
          self = this;

      cbs.load = function () {
        self._dispatchEvent(_impl.EventType.LOADED);
      };

      cbs.error = function () {
        self._dispatchEvent(_impl.EventType.ERROR);
      }; // native event callback


      this._iframe.setOnDidFinishLoading(cbs.load);

      this._iframe.setOnDidFailLoading(cbs.error);
    }
  };

  _p._initExtraSetting = function () {
    this.jsCallback && this.setOnJSCallback(this.jsCallback);
    this.interfaceSchema && this.setJavascriptInterfaceScheme(this.interfaceSchema); // remove obj

    this.jsCallback = null;
    this.interfaceSchema = null;
  };

  _p._setOpacity = function (opacity) {
    var iframe = this._iframe;

    if (iframe && iframe.style) {
      iframe.style.opacity = opacity / 255; // TODO, add impl to Native
    }
  };

  _p.createDomElementIfNeeded = function (w, h) {
    if (!jsb.WebView) {
      cc.warn('WebView only supports mobile platform.');
      return;
    }

    if (!this._iframe) {
      this._iframe = jsb.WebView.create();

      this._initEvent();

      this._initExtraSetting();
    }
  };

  _p.removeDom = function () {
    var iframe = this._iframe;

    if (iframe) {
      var cbs = this.__eventListeners;
      cbs.load = null;
      cbs.error = null;
      iframe.destroy();
      this._iframe = null;
    }
  };

  _p.setOnJSCallback = function (callback) {
    var iframe = this._iframe;

    if (iframe) {
      iframe.setOnJSCallback(callback);
    } else {
      this.jsCallback = callback;
    }
  };

  _p.setJavascriptInterfaceScheme = function (scheme) {
    var iframe = this._iframe;

    if (iframe) {
      iframe.setJavascriptInterfaceScheme(scheme);
    } else {
      this.interfaceSchema = scheme;
    }
  };

  _p.loadData = function (data, MIMEType, encoding, baseURL) {
    var iframe = this._iframe;

    if (iframe) {
      iframe.loadData(data, MIMEType, encoding, baseURL);
    }
  };

  _p.loadHTMLString = function (string, baseURL) {
    var iframe = this._iframe;

    if (iframe) {
      iframe.loadHTMLString(string, baseURL);
    }
  };
  /**
   * Load an URL
   * @param {String} url
   */


  _p.loadURL = function (url) {
    var iframe = this._iframe;

    if (iframe) {
      iframe.src = url;
      iframe.loadURL(url);

      this._dispatchEvent(_impl.EventType.LOADING);
    }
  };
  /**
   * Stop loading
   */


  _p.stopLoading = function () {
    cc.logID(7800);
  };
  /**
   * Reload the WebView
   */


  _p.reload = function () {
    var iframe = this._iframe;

    if (iframe) {
      iframe.reload();
    }
  };
  /**
   * Determine whether to go back
   */


  _p.canGoBack = function () {
    var iframe = this._iframe;

    if (iframe) {
      return iframe.canGoBack();
    }
  };
  /**
   * Determine whether to go forward
   */


  _p.canGoForward = function () {
    var iframe = this._iframe;

    if (iframe) {
      return iframe.canGoForward();
    }
  };
  /**
   * go back
   */


  _p.goBack = function () {
    var iframe = this._iframe;

    if (iframe) {
      return iframe.goBack();
    }
  };
  /**
   * go forward
   */


  _p.goForward = function () {
    var iframe = this._iframe;

    if (iframe) {
      return iframe.goForward();
    }
  };
  /**
   * In the webview execution within a period of js string
   * @param {String} str
   */


  _p.evaluateJS = function (str) {
    var iframe = this._iframe;

    if (iframe) {
      return iframe.evaluateJS(str);
    }
  };
  /**
   * Limited scale
   */


  _p.setScalesPageToFit = function () {
    var iframe = this._iframe;

    if (iframe) {
      return iframe.setScalesPageToFit();
    }
  };
  /**
   * The binding event
   * @param {_impl.EventType} event
   * @param {Function} callback
   */


  _p.setEventListener = function (event, callback) {
    this._EventList[event] = callback;
  };
  /**
   * Delete events
   * @param {_impl.EventType} event
   */


  _p.removeEventListener = function (event) {
    this._EventList[event] = null;
  };

  _p._dispatchEvent = function (event) {
    var callback = this._EventList[event];
    if (callback) callback.call(this, this, this._iframe.src);
  };

  _p._createRenderCmd = function () {
    return new _impl.RenderCmd(this);
  };

  _p.destroy = function () {
    this.removeDom();
  };

  _p.setVisible = function (visible) {
    if (this._visible !== visible) {
      this._visible = !!visible;

      this._updateVisibility();
    }
  };

  _p.updateMatrix = function (node) {
    if (!this._iframe || !this._visible) return;
    node.getWorldMatrix(_worldMat);

    if (this._m00 === _worldMat.m[0] && this._m01 === _worldMat.m[1] && this._m04 === _worldMat.m[4] && this._m05 === _worldMat.m[5] && this._m12 === _worldMat.m[12] && this._m13 === _worldMat.m[13] && this._w === node._contentSize.width && this._h === node._contentSize.height) {
      return;
    } // update matrix cache


    this._m00 = _worldMat.m[0];
    this._m01 = _worldMat.m[1];
    this._m04 = _worldMat.m[4];
    this._m05 = _worldMat.m[5];
    this._m12 = _worldMat.m[12];
    this._m13 = _worldMat.m[13];
    this._w = node._contentSize.width;
    this._h = node._contentSize.height;

    var camera = cc.Camera.findCamera(node)._camera;

    var canvas_width = cc.game.canvas.width;
    var canvas_height = cc.game.canvas.height;
    var ap = node._anchorPoint; // Vectors in node space

    vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
    vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0); // Convert to world space

    vec3.transformMat4(_topLeft, _topLeft, _worldMat);
    vec3.transformMat4(_bottomRight, _bottomRight, _worldMat); // Convert to screen space

    camera.worldToScreen(_topLeft, _topLeft, canvas_width, canvas_height);
    camera.worldToScreen(_bottomRight, _bottomRight, canvas_width, canvas_height);
    var finalWidth = _bottomRight.x - _topLeft.x;
    var finalHeight = _topLeft.y - _bottomRight.y;

    this._iframe.setFrame(_topLeft.x, canvas_height - _topLeft.y, finalWidth, finalHeight);
  };
})();

},{}],41:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var nativeCameraProto = renderer.Camera.prototype;
var _setNode = nativeCameraProto.setNode;
cc.js.mixin(nativeCameraProto, {
  setNode: function setNode(node) {
    this._persistentNode = node;

    _setNode.call(this, node);
  }
});

},{}],42:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var nativeLightProto = renderer.Light.prototype;
var _setNode = nativeLightProto.setNode;
cc.js.mixin(nativeLightProto, {
  setNode: function setNode(node) {
    this._node = node;

    _setNode.call(this, node);
  }
});

},{}],43:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
  if (!cc.MeshBuffer) return;
  var MeshBuffer = cc.MeshBuffer.prototype;

  MeshBuffer.init = function (batcher, vertexFormat) {
    this.byteOffset = 0;
    this.indiceOffset = 0;
    this.vertexOffset = 0;
    this._vertexFormat = vertexFormat;
    this._vertexBytes = this._vertexFormat._bytes;
    this._vDatas = [];
    this._uintVDatas = [];
    this._iDatas = [];
    this._arrOffset = 0;
    this._vData = null;
    this._uintVData = null;
    this._iData = null;
    this._initVDataCount = 256 * vertexFormat._bytes; // actually 256 * 4 * (vertexFormat._bytes / 4)

    this._initIDataCount = 256 * 6;
    this._offsetInfo = {
      byteOffset: 0,
      vertexOffset: 0,
      indiceOffset: 0
    };
    this._renderDataList = new renderer.RenderDataList();

    this._reallocBuffer();
  };

  MeshBuffer.setNativeAssembler = function (assembler) {
    if (assembler !== this._nativeAssembler) {
      this._nativeAssembler = assembler;
      assembler.setRenderDataList(this._renderDataList);
    }
  };

  MeshBuffer._updateVIDatas = function () {
    var offset = this._arrOffset;
    this._vDatas[offset] = this._vData;
    this._uintVDatas[offset] = this._uintVData;
    this._iDatas[offset] = this._iData;

    this._renderDataList.updateMesh(offset, this._vData, this._iData);
  };

  MeshBuffer.getNativeAssembler = function () {
    return this._nativeAssembler;
  };

  MeshBuffer.getCurMeshIndex = function () {
    return this._arrOffset;
  };

  MeshBuffer.uploadData = function () {};

  MeshBuffer.switchBuffer = function () {
    var offset = ++this._arrOffset;
    this.byteOffset = 0;
    this.vertexOffset = 0;
    this.indiceOffset = 0;

    if (offset < this._vDatas.length) {
      this._vData = this._vDatas[offset];
      this._uintVData = this._uintVDatas[offset];
      this._iData = this._iDatas[offset];
    } else {
      this._reallocBuffer();
    }
  };

  MeshBuffer.checkAndSwitchBuffer = function (vertexCount) {
    if (this.vertexOffset + vertexCount > 65535) {
      this.switchBuffer();
      if (!this._nativeAssembler) return;
      this._nativeAssembler.updateIADatas && this._nativeAssembler.updateIADatas(this._arrOffset, this._arrOffset);
    }
  };

  MeshBuffer.used = function (vertexCount, indiceCount) {
    if (!this._nativeAssembler) return;

    this._nativeAssembler.updateVerticesRange(this._arrOffset, 0, vertexCount);

    this._nativeAssembler.updateIndicesRange(this._arrOffset, 0, indiceCount);
  };

  MeshBuffer.request = function (vertexCount, indiceCount) {
    this.requestStatic(vertexCount, indiceCount);
    return this._offsetInfo;
  };

  MeshBuffer._reallocBuffer = function () {
    this._reallocVData(true);

    this._reallocIData(true);

    this._updateVIDatas();
  };

  MeshBuffer._reallocVData = function (copyOldData) {
    var oldVData;

    if (this._vData) {
      oldVData = new Uint8Array(this._vData.buffer);
    }

    this._vData = new Float32Array(this._initVDataCount);
    this._uintVData = new Uint32Array(this._vData.buffer);
    var newData = new Uint8Array(this._uintVData.buffer);

    if (oldVData && copyOldData) {
      for (var i = 0, l = oldVData.length; i < l; i++) {
        newData[i] = oldVData[i];
      }
    }
  };

  MeshBuffer._reallocIData = function (copyOldData) {
    var oldIData = this._iData;
    this._iData = new Uint16Array(this._initIDataCount);

    if (oldIData && copyOldData) {
      var iData = this._iData;

      for (var i = 0, l = oldIData.length; i < l; i++) {
        iData[i] = oldIData[i];
      }
    }
  };

  MeshBuffer.reset = function () {
    this._arrOffset = 0;
    this._vData = this._vDatas[0];
    this._uintVData = this._uintVDatas[0];
    this._iData = this._iDatas[0];
    this.byteOffset = 0;
    this.indiceOffset = 0;
    this.vertexOffset = 0;
    if (!this._nativeAssembler) return;

    for (var i = 0, len = this._vDatas.length; i < len; i++) {
      this._nativeAssembler.updateVerticesRange(i, 0, 0);

      this._nativeAssembler.updateIndicesRange(i, 0, 0);
    }
  };

  MeshBuffer.destroy = function () {
    this.reset();
  };
})();

},{}],44:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var RenderFlow = cc.RenderFlow;
cc.js.mixin(renderer.NodeProxy.prototype, {
  _ctor: function _ctor() {
    this._owner = null;
  },
  init: function init(owner) {
    this._owner = owner;
    var spaceInfo = owner._spaceInfo;
    this._owner._dirtyPtr = spaceInfo.dirty;
    this._dirtyPtr = spaceInfo.dirty;
    this._parentPtr = spaceInfo.parent;
    this._zOrderPtr = spaceInfo.zOrder;
    this._cullingMaskPtr = spaceInfo.cullingMask;
    this._opacityPtr = spaceInfo.opacity;
    this._is3DPtr = spaceInfo.is3D;
    this._skewPtr = spaceInfo.skew;
    this._isVisitingTraversal = false;
    owner._proxy = this;
    this.updateOpacity();
    this.update3DNode();
    this.updateZOrder();
    this.updateCullingMask();
    this.updateSkew();
    owner.on(cc.Node.EventType.SIBLING_ORDER_CHANGED, this.updateZOrder, this);
  },
  initNative: function initNative() {
    this.setName(this._owner._name);
    this.updateParent();
    this.updateOpacity();
    this.update3DNode();
    this.updateZOrder();
    this.updateSkew();
    this.updateCullingMask();
  },
  destroy: function destroy() {
    this.destroyImmediately();

    this._owner.off(cc.Node.EventType.SIBLING_ORDER_CHANGED, this.updateZOrder, this);

    this._owner._proxy = null;
    this._owner = null;
  },
  updateParent: function updateParent() {
    var parent = this._owner._parent;

    if (parent) {
      var parentSpaceInfo = parent._spaceInfo;
      this._parentPtr[0] = parentSpaceInfo.unitID;
      this._parentPtr[1] = parentSpaceInfo.index;
      var parentDirtyPtr = parentSpaceInfo.dirty;
      parentDirtyPtr[0] |= RenderFlow.FLAG_REORDER_CHILDREN;
      this._dirtyPtr[0] |= RenderFlow.FLAG_OPACITY;
    } else {
      this._parentPtr[0] = 0xffffffff;
      this._parentPtr[1] = 0xffffffff;
    }

    this.notifyUpdateParent();
  },
  updateZOrder: function updateZOrder() {
    this._zOrderPtr[0] = this._owner._localZOrder;
    var parent = this._owner._parent;

    if (parent && parent._proxy) {
      parent._proxy._dirtyPtr[0] |= RenderFlow.FLAG_REORDER_CHILDREN;
    }
  },
  updateCullingMask: function updateCullingMask() {
    this._cullingMaskPtr[0] = this._owner._cullingMask;
  },
  updateOpacity: function updateOpacity() {
    this._opacityPtr[0] = this._owner.opacity;
    this._dirtyPtr[0] |= RenderFlow.FLAG_OPACITY;
  },
  update3DNode: function update3DNode() {
    this._is3DPtr[0] = this._owner.is3DNode ? 0x1 : 0x0;
    this._dirtyPtr[0] |= RenderFlow.FLAG_LOCAL_TRANSFORM;
  },
  updateSkew: function updateSkew() {
    var skewPtr = this._skewPtr;
    var owner = this._owner;
    var skx = owner._skewX;
    var sky = owner._skewY;
    skewPtr[0] = skx;
    skewPtr[1] = sky;

    if (!this._isVisitingTraversal && (skx !== 0 || sky !== 0)) {
      this.switchTraverseToVisit();
      this._isVisitingTraversal = true;
    }
  }
});

},{}],45:[function(require,module,exports){
/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var RenderFlow = cc.RenderFlow;
var LOCAL_TRANSFORM = RenderFlow.FLAG_LOCAL_TRANSFORM;
var COLOR = RenderFlow.FLAG_COLOR;
var UPDATE_RENDER_DATA = RenderFlow.FLAG_UPDATE_RENDER_DATA;
var POSITION_ON = 1 << 0;

cc.Node.prototype.setLocalDirty = function (flag) {
  this._localMatDirty |= flag;
  this._worldMatDirty = true;
  this._dirtyPtr[0] |= RenderFlow.FLAG_TRANSFORM;
};

cc.js.getset(cc.Node.prototype, "_renderFlag", function () {
  return this._dirtyPtr[0];
}, function (flag) {
  this._dirtyPtr[0] = flag;

  if (flag & UPDATE_RENDER_DATA || flag & COLOR) {
    cc.RenderFlow.register(this);
  }
});

cc.PrivateNode.prototype._posDirty = function (sendEvent) {
  var parent = this.parent;

  if (parent) {
    // Position correction for transform calculation
    this._trs[0] = this._originPos.x - (parent._anchorPoint.x - 0.5) * parent._contentSize.width;
    this._trs[1] = this._originPos.y - (parent._anchorPoint.y - 0.5) * parent._contentSize.height;
  }

  this.setLocalDirty(cc.Node._LocalDirtyFlag.POSITION);

  if (sendEvent === true && this._eventMask & POSITION_ON) {
    this.emit(cc.Node.EventType.POSITION_CHANGED);
  }
};

},{}],46:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
  if (!cc.QuadBuffer) return;
  var QuadBuffer = cc.QuadBuffer.prototype;

  QuadBuffer._fillQuadBuffer = function () {
    var count = this._initIDataCount / 6;
    var buffer = this._iData;

    for (var i = 0, idx = 0; i < count; i++) {
      var vertextID = i * 4;
      buffer[idx++] = vertextID;
      buffer[idx++] = vertextID + 1;
      buffer[idx++] = vertextID + 2;
      buffer[idx++] = vertextID + 1;
      buffer[idx++] = vertextID + 3;
      buffer[idx++] = vertextID + 2;
    }
  };

  QuadBuffer._reallocBuffer = function () {
    this._reallocVData(true);

    this._reallocIData();

    this._fillQuadBuffer();

    this._updateVIDatas();
  };

  QuadBuffer.uploadData = function () {};

  QuadBuffer.switchBuffer = function () {
    cc.MeshBuffer.prototype.switchBuffer.call(this);
  };
})();

},{}],47:[function(require,module,exports){
"use strict";

var proto = cc.RenderData.prototype;

cc.RenderData.prototype.init = function (assembler) {
  this._renderDataList = new renderer.RenderDataList();
  assembler.setRenderDataList(this._renderDataList);
  this._nativeAssembler = assembler;
};

var originClear = proto.clear;

proto.clear = function () {
  originClear.call(this);

  this._renderDataList.clear();
};

var originUpdateMesh = proto.updateMesh;

proto.updateMesh = function (meshIndex, vertices, indices) {
  originUpdateMesh.call(this, meshIndex, vertices, indices);

  if (vertices && indices) {
    this._renderDataList.updateMesh(meshIndex, vertices, indices);
  }
};

proto.updateMeshRange = function (verticesCount, indicesCount) {
  this._nativeAssembler.updateVerticesRange(0, 0, verticesCount);

  this._nativeAssembler.updateIndicesRange(0, 0, indicesCount);
};

},{}],48:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var RenderFlow = cc.RenderFlow;
RenderFlow.FLAG_REORDER_CHILDREN = 1 << 29;
RenderFlow.FLAG_WORLD_TRANSFORM_CHANGED = 1 << 30;
RenderFlow.FLAG_OPACITY_CHANGED = 1 << 31;
var _dirtyTargets = [];
var _dirtyWaiting = [];
var _rendering = false;
var director = cc.director;

RenderFlow.render = function (scene) {
  _rendering = true;
  RenderFlow.validateRenderers();

  for (var i = 0, l = _dirtyTargets.length; i < l; i++) {
    var node = _dirtyTargets[i];
    node._inJsbDirtyList = false;
    var comp = node._renderComponent;
    if (!comp) continue;
    var assembler = comp._assembler;
    if (!assembler) continue;
    var flag = node._dirtyPtr[0];

    if (flag & RenderFlow.FLAG_UPDATE_RENDER_DATA) {
      node._dirtyPtr[0] &= ~RenderFlow.FLAG_UPDATE_RENDER_DATA;
      assembler._updateRenderData && assembler._updateRenderData();
    }

    if (flag & RenderFlow.FLAG_COLOR) {
      node._dirtyPtr[0] &= ~RenderFlow.FLAG_COLOR;
      comp._updateColor && comp._updateColor();
    }
  }

  _dirtyTargets.length = 0;

  this._nativeFlow.render(scene._proxy, director._deltaTime);

  _dirtyTargets = _dirtyWaiting.slice(0);
  _dirtyWaiting.length = 0;
  _rendering = false;
};

RenderFlow.init = function (nativeFlow) {
  cc.EventTarget.call(this);
  this._nativeFlow = nativeFlow;
};

RenderFlow.register = function (target) {
  if (target._inJsbDirtyList) return;

  if (_rendering) {
    _dirtyWaiting.push(target);
  } else {
    _dirtyTargets.push(target);
  }

  target._inJsbDirtyList = true;
};

},{}]},{},[25]);
