(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function a(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=a(r);fetch(r.href,i)}})();const c=document.getElementById("video"),s=document.getElementById("canvas"),n=s.getContext("webgl");if(!n)throw new Error("WebGL not supported");const p=`
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying highp vec2 vTextureCoord;
    void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`,D=`
precision highp float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler; // Your video frame
uniform sampler2D uDitherMatrix; // The dither matrix texture

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float gray = (color.r + color.g + color.b) / 3.0;
    float luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

    // Calculate the position to sample the dither matrix
    int x = int(mod(gl_FragCoord.x, 8.0));
    int y = int(mod(gl_FragCoord.y, 8.0));
    float ditherThreshold = texture2D(uDitherMatrix, vec2(float(x) / 8.0, float(y) / 8.0)).r;

    float blackOrWhite = luminance < ditherThreshold ? 0.0 : 1.0;

    gl_FragColor = vec4(vec3(blackOrWhite), 1.0);
}
`,u=b(n,p,D),U={program:u,attribLocations:{vertexPosition:n.getAttribLocation(u,"aVertexPosition"),textureCoord:n.getAttribLocation(u,"aTextureCoord")},uniformLocations:{uSampler:n.getUniformLocation(u,"uSampler"),uDitherMatrix:n.getUniformLocation(u,"uDitherMatrix")}},P=y(n),v=C(n);_();const x=[1,49,13,61,4,52,16,64,33,17,45,29,36,20,48,32,9,57,5,53,12,60,8,56,41,25,37,21,44,28,40,24,3,51,15,63,2,50,14,62,35,19,47,31,34,18,46,30,11,59,7,55,10,58,6,54,39,23,43,27,42,26,38,22].map(e=>e/64),L=[24,10,12,26,35,47,49,37,8,0,2,14,45,59,61,51,22,6,4,16,43,57,63,53,30,20,18,28,41,55,39,33,34,46,44,36,25,11,13,27,42,58,62,50,9,1,3,15,32,54,56,52,23,7,5,17,40,38,48,60,31,21,19,29].map(e=>e/65);let T=!0,h=R(n,x);const E=e=>{h=R(n,e)};var m;(m=document.querySelector("#swap-matrix"))==null||m.addEventListener("click",e=>{T?(T=!1,E(L),e.target.innerText="Swap to Bayer Matrix"):(T=!0,E(x),e.target.innerText="Swap to Cluster Dot")});function R(e,t){const a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a);const o=new Uint8Array(t.map(r=>r*255));return e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,8,8,0,e.LUMINANCE,e.UNSIGNED_BYTE,o),a}async function _(){try{const e=await navigator.mediaDevices.getUserMedia({video:!0});c.srcObject=e,c.onloadedmetadata=()=>{c.play()},c.addEventListener("play",()=>{s.width=c.videoWidth,s.height=c.videoHeight,n.viewport(0,0,s.width,s.height),A()})}catch(e){console.error("Error accessing the camera",e)}}function A(){c.paused||c.ended||(S(n,U,P,v,h),requestAnimationFrame(A))}function S(e,t,a,o,r){c.paused||c.ended||(e.clearColor(0,0,0,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,c),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,o),e.uniform1i(t.uniformLocations.uSampler,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,r),e.uniform1i(t.uniformLocations.uDitherMatrix,1),e.bindBuffer(e.ARRAY_BUFFER,a.position),e.vertexAttribPointer(t.attribLocations.vertexPosition,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(t.attribLocations.vertexPosition),e.bindBuffer(e.ARRAY_BUFFER,a.textureCoord),e.vertexAttribPointer(t.attribLocations.textureCoord,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(t.attribLocations.textureCoord),e.useProgram(t.program),e.drawArrays(e.TRIANGLE_STRIP,0,4))}_();function b(e,t,a){const o=f(e,e.VERTEX_SHADER,t),r=f(e,e.FRAGMENT_SHADER,a),i=e.createProgram();return e.attachShader(i,o),e.attachShader(i,r),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)?i:(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(i)),null)}function f(e,t,a){const o=e.createShader(t);return e.shaderSource(o,a),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(o)),e.deleteShader(o),null)}function y(e){const t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t);const a=[-1,1,1,1,-1,-1,1,-1];e.bufferData(e.ARRAY_BUFFER,new Float32Array(a),e.STATIC_DRAW);const o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o);const r=[0,0,1,0,0,1,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(r),e.STATIC_DRAW),{position:t,textureCoord:o}}function C(e){const t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),t}
