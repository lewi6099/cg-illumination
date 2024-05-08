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
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec2 model_uv;
out vec3 diffuse_illum;
out vec3 specular_illum;

void main() {
    // ---------------- Issue is that we don't have the normal here ---------------------
    // so our thought would be to then calculate the lighting in the fragment shader but we don't have the normal there either
        //  - do we just create the normal ourselves?
    
    // Calculations to be used for illum equations
    vec3 L = normalize(light_positions[0] - position); // normalized light direction
    float N_cross_L = dot(normal, L); // dot product of normal and the normalized light direction
    vec3 R = normalize((2.0*N_cross_L*normal) - L); //used for specular light
    vec3 normalized_view_direction = normalize(camera_position - position);

    // calculating diffuse and specular as much as we can in the vertex shader
    diffuse_illum = light_colors[0] * N_cross_L; // still need to mulitply by mat_color
    specular_illum = light_colors[0] * pow(dot(R, normalized_view_direction), mat_shininess); //still need to mulitply by mat_specular
    
    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world;

    //illum does it:
    // gl_Position = projection * view * world * vec4(position, 1.0);
}
