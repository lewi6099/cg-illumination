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
    // calculate the different lights
    vec3 ambient_light = ambient * mat_color;
    vec3 diffuse_illum_with_mat_color = diffuse_illum *mat_color;
    vec3 specular_illum_with_mat_specular = specular_illum * mat_specular;
    vec3 combined_light = ambient_light + diffuse_illum_with_mat_color + specular_illum_with_mat_specular;

    // multiplay combined light by the color
    vec3 model_color = mat_color * combined_light * texture(mat_texture, model_uv).rgb;
    // Color
    FragColor = vec4(model_color, 1.0);
}
