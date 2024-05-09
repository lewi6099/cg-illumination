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
uniform vec2 texture_scale;

// Output
out vec3 model_position;
out vec3 model_normal;
out vec2 model_uv;

void main() {
    // -----> Question - do we need to do this transposing and invertgin for the ground and for the illum in the phong
    mat3 new_matrix = mat3(world); //create a 3x3 matrix of the world matrix
    mat3 transpose_matrix = transpose(new_matrix); //transpose this world matrix 
    mat3 inverse_matrix = inverse(transpose_matrix); //take the inverse of this transpose matrix

    // Get initial position of vertex (prior to height displacement)
    vec4 world_pos = world * vec4(position, 1.0);

    // Pass vertex position onto the fragment shader
    model_position = world_pos.xyz;
    // Pass vertex normal onto the fragment shader
    model_normal = inverse_matrix * vec3(0.0, 1.0, 0.0);
    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world_pos;
}
