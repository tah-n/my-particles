precision highp float;

attribute vec2 aUv;
uniform sampler2D uPosition;
uniform float uSize;

void main() {
  vec3 pos = texture2D(uPosition, aUv).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize;
}