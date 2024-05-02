#version 300 es
precision mediump float;

// Input
in vec2 model_uv;
in vec3 diffuse_illum;
in vec3 specular_illum;

// Uniforms
// material
uniform vec3 mat_color;
uniform vec3 mat_specular;
uniform sampler2D mat_texture;
// light from environment
uniform vec3 ambient; // Ia

// Output
out vec4 FragColor;

void main() {
    // multiply the color by diffuse_illum adn by specular_illum
    vec3 model_color = mat_color * texture(mat_texture, model_uv).rgb;
    
    // Color
    FragColor = vec4(model_color, 1.0);
}
