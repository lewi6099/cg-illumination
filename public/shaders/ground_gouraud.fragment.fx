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
    vec3 color = mat_color * texture(mat_texture, model_uv).rgb;
    vec3 ambient_light = max(ambient, vec3(0.0));
    
    vec3 combined_light = (ambient_light * color) + (diffuse_illum * color) + (specular_illum * mat_specular);
    
    // Color
    FragColor = vec4(combined_light, 1.0);
}
