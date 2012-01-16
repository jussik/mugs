#ifdef GL_ES
precision highp float;
#endif

#define LIGHT_MAX 3

varying vec4 vTransformedNormal;
varying vec4 vPosition;
varying vec4 vModelPosition;
varying vec4 vColor;

uniform float shininess;
uniform float imageScale;

uniform vec3 ambientColor;
uniform vec3 directionalColor;
uniform vec3 lightingDirection;

uniform vec3 pointLocation[LIGHT_MAX];
uniform vec3 pointColor[LIGHT_MAX];
uniform vec3 pointSpecularColor[LIGHT_MAX];
uniform float enableSpecular[LIGHT_MAX];
uniform int numberPoints;

uniform bool hasTexture;
uniform sampler2D sampler;

uniform mat4 viewMatrix;
uniform mat4 worldMatrix;

void main(void) {
	vec3 lightWeighting;
	vec3 specularLight = vec3(0.0, 0.0, 0.0);
	vec3 lightDirection;
	float specularLightWeighting = 0.0;
	float diffuseLightWeighting = 0.0;
	vec3  diffuseLight = vec3(0.0, 0.0, 0.0);

	vec3 transformedPointLocation;
	vec3 normal = vTransformedNormal.xyz;

	vec3 eyeDirection = normalize(-vPosition.xyz);
	vec3 reflectionDirection;

	vec3 pointWeight = vec3(0.0, 0.0, 0.0);

	for (int i = 0; i < LIGHT_MAX; i++) {
		if (i < numberPoints) {
			transformedPointLocation = (viewMatrix * vec4(pointLocation[i], 1.0)).xyz;
			lightDirection = normalize(transformedPointLocation - vPosition.xyz);

			if (enableSpecular[i] > 0.0) {
				reflectionDirection = reflect(-lightDirection, normal);
				specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
				specularLight += specularLightWeighting * pointSpecularColor[i];
			}

			diffuseLightWeighting = max(dot(normal, lightDirection), 0.0);
			diffuseLight += diffuseLightWeighting * pointColor[i];
		} else {
			break;
		}
	}

	lightWeighting = ambientColor + diffuseLight;

	vec3 texPos = vModelPosition.xyz;
	vec4 texColor = vec4(0.0, 0.0, 0.0, 0.0);
	vec2 texCoord = vec2(texPos.x/imageScale + 0.5, -texPos.y/imageScale + 0.5);
	if (hasTexture) {
		if(texCoord.x <= 1.0 && texCoord.x >= 0.0 &&
			texCoord.y <= 1.0 && texCoord.y >= 0.0 &&
			dot(vTransformedNormal, vPosition) > 0.5) {
			if(texPos.z < 0.0) {
				texCoord.x = 1.0 - texCoord.x;
			}
			texColor = texture2D(sampler, texCoord);
		}
	}
	vec4 fragmentColor = mix(vColor, texColor, texColor.a);
	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting + specularLight, 1.0);
}