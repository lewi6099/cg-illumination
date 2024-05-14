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

    // For each neighbor, move over/up by a little bit, add the displacement we just calculated
    vec3 neighbor1_pos = vec3(position.x + 0.01, position.y, position.z);
    vec3 neighbor2_pos = vec3(position.x, position.y + 0.01, position.z); 

    vec3 tangent = neighbor1_pos - position;
    vec3 bitangent = neighbor2_pos - position;
    vec3 normal = normalize(cross(tangent, bitangent));

    // Get initial position of vertex (prior to height displacement)
    vec4 world_pos = world * vec4(position, 1.0);
    // Pass vertex position onto the fragment shader
    model_position = vec3(world_pos.x, world_pos.y + d, world_pos.z);
    // Pass vertex normal onto the fragment shader
    model_normal = normal;

    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * vec4(model_position, 1.0); //world_pos;
}
