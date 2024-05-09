#version 300 es
precision highp float;

// Attributes - these are in model space
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

// Output
out vec3 model_position;
out vec3 model_normal; //automatically interpolates it
out vec2 model_uv;

void main() {
    // Pass vertex position onto the fragment shader

    // ------- HAVE PROF CHECK THESE 4 LINES OF CODE - they don't seem to be doing anything for multiplying by the inverse matrix--
    mat3 new_matrix = mat3(world); //create a 3x3 matrix of the world matrix
    mat3 transpose_matrix = transpose(new_matrix); //transpose this world matrix 
    mat3 inverse_matrix = inverse(transpose_matrix); //take the inverse of this transpose matrix

    // QUESTION: when you comment out the "* inverse_matrix" nothing seems to change...
    model_position = vec3(world * vec4(position, 1.0)); //multiply the position by this inverse and transposed world matrix
    // Pass vertex normal onto the fragment shader
    model_normal = inverse_matrix * normal; //model's normal in world space
    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world * vec4(position, 1.0);;
}
