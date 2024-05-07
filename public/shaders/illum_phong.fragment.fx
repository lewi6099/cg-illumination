#version 300 es
precision mediump float;

// Input
in vec3 model_position;
in vec3 model_normal;
in vec2 model_uv;

// Uniforms
// material
uniform vec3 mat_color; //Ka
uniform vec3 mat_specular;
uniform float mat_shininess;
uniform sampler2D mat_texture;
// camera
uniform vec3 camera_position;
// lights
uniform vec3 ambient; // Ia
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec4 FragColor;

void main() {
    // variables needed for the light equations:
    vec3 L = normalize(light_positions[0] - model_position); // normalized light direction
    float N_cross_L = dot(model_normal, L); // dot product of normal and the normalized light direction
    vec3 R = (2.0*N_cross_L*model_normal) - L; //used for specular light

    // light equations
    vec3 ambient_light = ambient * mat_color; 
    vec3 diffuse_light = light_colors[0] * mat_color * N_cross_L; 
    vec3 specular_light = light_colors[0] * mat_specular * pow(dot(R, camera_position), mat_shininess); // makes the top of the box white and the sides of the sphere white

    vec3 combined_light = ambient_light + diffuse_light + specular_light;

    FragColor = vec4(mat_color * diffuse_light * texture(mat_texture, model_uv).rgb, 1.0);
}
