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
    // ---- QUESTION: what do we need to do about texture mapping?

    // ---- CALCULATE MODEL_POSITION   --need to do this to acount for scaling! 
    // ------- HAVE PROF CHECK THESE 4 LINES OF CODE ----------------
    mat3 new_matrix = mat3(world) //create a 3x3 matrix of the world matrix
    mat3 transpose_matrix = transpose(new_matrix) //transpose this world matrix 
    mat3 inverse_matrix = inverse(transpose_matrix) //take the inverse of this transpose matrix
    model_position = position * inverse_matrix; //multiply the position by this inverse and transposed world matrix


    // Calculations to be used for illum equations
    vec3 L = normalize(light_positions[0].subtract(model_position)) // we just calculated model_position
    vec3 N_cross_L = Vector3.Dot(normal, L)
    vec3 R = (2*N_cross_L*normal).subtract(L);

    // calculating diffuse and specular as much as we can in the vertex shader
    diffuse_illum = light_colors[0] * N_cross_L; // still need to mulitply by mat_color
    specular_illum = light_colors[0]  * pow(Vector3.Dot(R, camera_position), mat_shininess); //still need to mulitply by mat_specular

    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world * vec4(position, 1.0);
}
