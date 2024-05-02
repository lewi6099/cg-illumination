#version 300 es
precision mediump float;

// Input
in vec3 model_position;
in vec3 model_normal;
in vec2 model_uv;

// Uniforms
// material
uniform vec3 mat_color;
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

vec3 N_cross_L = Vector3.Dot(model_normal, light_positions[0])

//L is a vecotr pointing to the light
// subtract the light position from the model position

vec3 R = (2*N_cross_L*model_normal).subtract(light_positions);

vec3 ambient_light = ambient * mat_color;
vec3 diffuse_light = light_colors[0] * mat_color * N_cross_L;
vec3 specular_light = light_colors[0] * mat_specular * pow(Vector3.Dot(R, camera_position), mat_shininess);

vec3 combined_light = ambient_light + diffuse_light + specular_light;

void main() {
    // Color
    FragColor = vec4(mat_color * combined_light * texture(mat_texture, model_uv).rgb, 1.0);
}
