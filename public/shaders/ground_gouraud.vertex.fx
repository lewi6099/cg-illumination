#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// height displacement
uniform vec2 ground_size;
uniform float height_scalar;
uniform sampler2D heightmap;
// material
uniform float mat_shininess;
uniform vec2 texture_scale;
// camera
uniform vec3 camera_position;
// lights
uniform int num_lights; // we aren't using this because we can't loop in babylon vertex shaders
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec2 model_uv;
out vec3 diffuse_illum;
out vec3 specular_illum;

void main() {
    mat3 new_matrix = mat3(world); //create a 3x3 matrix of the world matrix
    mat3 transpose_matrix = transpose(new_matrix); //transpose this world matrix 
    mat3 inverse_matrix = inverse(transpose_matrix);

    // Calculations to be used for illum equations
    vec3 model_position = vec3(world * vec4(position, 1.0));
    vec3 model_normal = normalize(inverse_matrix * vec3(0.0, 1.0, 0.0));
    
    //      ------ Accounting for 3 different lights -----
    // ------------------Light 0
    vec3 L0 = normalize(light_positions[0] - model_position); // normalized light direction
    float N_cross_L0 = max(dot(model_normal, L0), 0.0); // dot product of normal and the normalized light direction
    vec3 R0 = normalize((2.0 * N_cross_L0 * model_normal) - L0); //used for specular light
    vec3 normalized_view_direction0 = normalize(camera_position - model_position);
    vec3 diffuse_illum0 = max(light_colors[0] * N_cross_L0, vec3(0.0)); // still need to mulitply by mat_color
    vec3 specular_illum0 = max(light_colors[0] * pow(dot(R0, normalized_view_direction0), mat_shininess), vec3(0.0)); //still need to mulitply by mat_specular

    // ------------------ Light 1
    vec3 L1 = normalize(light_positions[1] - model_position); // normalized light direction
    float N_cross_L1 = max(dot(model_normal, L1), 0.0); // dot product of normal and the normalized light direction
    vec3 R1 = normalize((2.0 * N_cross_L1 * model_normal) - L1); //used for specular light
    vec3 normalized_view_direction1 = normalize(camera_position - model_position);
    vec3 diffuse_illum1 = max(light_colors[1] * N_cross_L1, vec3(0.0)); // still need to mulitply by mat_color
    vec3 specular_illum1 = max(light_colors[1] * pow(dot(R1, normalized_view_direction1), mat_shininess), vec3(0.0)); //still need to mulitply by mat_specular

    // ------------------ Light 2
    vec3 L2 = normalize(light_positions[2] - model_position); // normalized light direction
    float N_cross_L2 = max(dot(model_normal, L2), 0.0); // dot product of normal and the normalized light direction
    vec3 R2 = normalize((2.0 * N_cross_L2 * model_normal) - L0); //used for specular light
    vec3 normalized_view_direction2 = normalize(camera_position - model_position);
    vec3 diffuse_illum2 = max(light_colors[2] * N_cross_L2, vec3(0.0)); // still need to mulitply by mat_color
    vec3 specular_illum2 = max(light_colors[2] * pow(dot(R2, normalized_view_direction2), mat_shininess), vec3(0.0)); //still need to mulitply by mat_specular

    // --- Add all light together ---
    diffuse_illum = diffuse_illum0 + diffuse_illum1 + diffuse_illum2;
    specular_illum = specular_illum0 + specular_illum1 + specular_illum2;

    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world * vec4(position, 1.0);
}
