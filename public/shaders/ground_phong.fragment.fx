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

void main() {
    // variables needed for the light equations:
    vec3 N = normalize(model_normal);
    vec3 normalized_view_direction = normalize(camera_position - model_position);

    // ------ Light 0 -----
    vec3 L0 = normalize(light_positions[0] - model_position); // normalized light direction
    float N_cross_L0 = max(dot(N, L0), 0.0); // dot product of normal and the normalized light direction
    vec3 R0 = normalize((2.0 * N_cross_L0 * N) - L0); //used for specular light
    vec3 diffuse_light0 = max(light_colors[0] * N_cross_L0, vec3(0.0)); // still need to mulitply by mat_color
    vec3 specular_light0 = max(light_colors[0] * pow(dot(R0, normalized_view_direction), mat_shininess), vec3(0.0)); //still need to mulitply by mat_specular
    
    // ----- Light 1 -------
    vec3 L1 = normalize(light_positions[1] - model_position); // normalized light direction
    float N_cross_L1 = max(dot(N, L1), 0.0); // dot product of normal and the normalized light direction
    vec3 R1 = normalize((2.0 * N_cross_L1 * N) - L1); //used for specular light
    vec3 diffuse_light1 = max(light_colors[1] * N_cross_L1, vec3(0.0)); // still need to mulitply by mat_color
    vec3 specular_light1 = max(light_colors[1] * pow(dot(R1, normalized_view_direction), mat_shininess), vec3(0.0)); //still need to mulitply by mat_specular
    
    // ------ Light 2 -------
    vec3 L2 = normalize(light_positions[2] - model_position); // normalized light direction
    float N_cross_L2 = max(dot(N, L2), 0.0); // dot product of normal and the normalized light direction
    vec3 R2 = normalize((2.0 * N_cross_L2 * N) - L2); //used for specular light
    vec3 diffuse_light2 = max(light_colors[2] * N_cross_L2, vec3(0.0)); // still need to mulitply by mat_color
    vec3 specular_light2 = max(light_colors[2] * pow(dot(R2, normalized_view_direction), mat_shininess), vec3(0.0)); //still need to mulitply by mat_specular
    

    vec3 color = mat_color * texture(mat_texture, model_uv).rgb;
    // light equations
    vec3 ambient_light = max(ambient, vec3(0.0)); 

    vec3 diffuse_light = diffuse_light0 + diffuse_light1+ diffuse_light2;
    vec3 specular_light = specular_light0 + specular_light1 + specular_light2;
    vec3 combined_light = (ambient_light * color) + (diffuse_light * color) + (specular_light * mat_specular);
    // Color
    FragColor = vec4(combined_light, 1.0);
}
