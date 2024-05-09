#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// material
uniform vec2 texture_scale;
uniform float mat_shininess;
// camera
uniform vec3 camera_position;
// lights
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec2 model_uv;
out vec3 diffuse_illum;
out vec3 specular_illum;


void main() {
    vec3 model_position = vec3(world * vec4(position, 1.0));

    mat3 new_matrix = mat3(world); //create a 3x3 matrix of the world matrix
    mat3 transpose_matrix = transpose(new_matrix); //transpose this world matrix 
    mat3 inverse_matrix = inverse(transpose_matrix);

    vec3 model_normal = normalize(inverse_matrix * normal);

    // Calculations to be used for illum equations
    vec3 L = normalize(light_positions[0] - model_position); // normalized light direction
    float N_cross_L = max(dot(model_normal, L), 0.0); // dot product of normal and the normalized light direction
    vec3 R = normalize((2.0 * N_cross_L * model_normal) - L); //used for specular light
    vec3 normalized_view_direction = normalize(camera_position - model_position);

    // calculating diffuse and specular as much as we can in the vertex shader
    diffuse_illum = max(light_colors[0] * N_cross_L, vec3(0.0)); // still need to mulitply by mat_color
    specular_illum = max(light_colors[0] * pow(dot(R, normalized_view_direction), mat_shininess), vec3(0.0)); //still need to mulitply by mat_specular
    
    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // ----- HERE are you supposed to actually do the transpose/inverse thing?
    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world * vec4(position, 1.0);
}



// void main() {
//     // Pass diffuse and specular illumination onto the fragment shader
//     diffuse_illum = vec3(0.0, 0.0, 0.0);
//     specular_illum = vec3(0.0, 0.0, 0.0);

//     // Pass vertex texcoord onto the fragment shader
//     model_uv = uv;

//     // Transform and project vertex from 3D world-space to 2D screen-space
//     gl_Position = projection * view * world * vec4(position, 1.0);
// }