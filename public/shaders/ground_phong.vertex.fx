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
    // Height displacement formulas:
    float gray = texture(heightmap, uv).r;
    float d = 2.0 * height_scalar * (gray - 0.5);

    // calculate the displacement for neighbor 1
    float gray_1 = texture(heightmap, uv + vec2(0.01, 0.0)).r;
    float d_1 = 2.0 * height_scalar * (gray_1 - 0.5);

    // calculate the displacement for neighbor 2
    float gray_2 = texture(heightmap, uv+ vec2(0.0, 0.01)).r;
    float d_2 = 2.0 * height_scalar * (gray_2 - 0.5);

    // For each neighbor, move over/up by a little bit, add the displacement we just calculated
    vec3 neighbor1_pos = vec3(position.x + 0.01, position.y + d_1, position.z);
    vec3 neighbor2_pos = vec3(position.x, position.y + 0.01 + d_2, position.z); 

    vec3 tangent = neighbor1_pos - position;
    vec3 bitangent = neighbor2_pos - position;
    vec3 normal = normalize(cross(tangent, bitangent));


    mat3 new_matrix = mat3(world); //create a 3x3 matrix of the world matrix
    mat3 transpose_matrix = transpose(new_matrix); //transpose this world matrix 
    mat3 inverse_matrix = inverse(transpose_matrix); //take the inverse of this transpose matrix

    // Get initial position of vertex (prior to height displacement)
    vec4 world_pos = world * vec4(position, 1.0);
    // Pass vertex position onto the fragment shader
    model_position = vec3(world_pos.x, world_pos.y + d, world_pos.z);
    // Pass vertex normal onto the fragment shader
     model_normal = inverse_matrix * normal;

    // model_normal = inverse_matrix * vec3(0.0, 1.0, 0.0);
    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world_pos;
}
