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
    // ---> questions: the vertex shader is supposed to calculate these, but we have a problem with finding the normal?
    vec3 ambient_light = max(ambient * mat_color, vec3(0.0)); 
    vec3 diffuse_illum_new = max(diffuse_illum * mat_color, vec3(0.0));
    vec3 specular_illum_new = max(specular_illum * mat_specular, vec3(0.0));

    vec3 combined_light = ambient_light + diffuse_illum_new + specular_illum_new;

    vec3 model_color = mat_color * combined_light * texture(mat_texture, model_uv).rgb;

    // Color
    FragColor = vec4(model_color, 1.0);
}
