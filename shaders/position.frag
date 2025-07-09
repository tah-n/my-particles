precision highp float;

uniform sampler2D uPosition;
uniform sampler2D uVelocity;

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(128.0, 128.0);
  vec3 pos = texture2D(uPosition, uv).xyz;
  vec3 vel = texture2D(uVelocity, uv).xyz;

  pos += vel;
  gl_FragColor = vec4(pos, 1.0);
}