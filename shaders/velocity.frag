precision highp float;

uniform sampler2D uVelocity;
uniform float uTime;

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(128.0, 128.0); // یا resolution.xy
  vec3 vel = texture2D(uVelocity, uv).xyz;

  vel.xy += 0.001 * vec2(sin(uTime), cos(uTime));
  gl_FragColor = vec4(vel, 1.0);
}