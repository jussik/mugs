attribute vec3 position;
attribute vec3 normal;

uniform mat4 worldMatrix;
uniform mat4 projectionMatrix;
uniform mat4 worldInverseTransposeMatrix;
uniform vec3 matColor;

varying vec4 vTransformedNormal;
varying vec4 vPosition;
varying vec4 vColor;


void main(void) {
	//vPosition = worldMatrix * vec4(position, 1.0);
	vPosition = vec4(position, 1.0);
	vTransformedNormal = worldInverseTransposeMatrix * vec4(normal, 1.0);
	vColor = vec4(matColor, 1.0);
	gl_Position = projectionMatrix * worldMatrix * vPosition;
	//gl_Position = projectionMatrix * vPosition;
}