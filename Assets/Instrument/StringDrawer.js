#pragma strict

var sections = 10;
var waveHeight = 1.0;
var frequency = 80.0;
var decay = 2.0;
var standardLength = 4.0;
var degree = 0;
var colors : Color[];

private var pin1 : Transform;
private var pin2 : Transform;
private var wave = 0.0;

function Awake() {
	pin1 = transform.parent.Find("Pin 1");
	pin2 = transform.parent.Find("Pin 2");
}

function FixPoints() {
	var length = (pin2.position - pin1.position).magnitude;
	var ratio = length / standardLength;

	frequency /= ratio;
	degree = Mathf.FloorToInt(ratio);

	Debug.Log(degree);

	ResetString();
	renderer.material.color = colors[degree % colors.Length];
}

function ResetString() {
	var mesh = Mesh();
	mesh.MarkDynamic();
	mesh.vertices = [pin1.position, pin1.position, pin2.position];
	mesh.SetIndices([0, 1, 2], MeshTopology.LineStrip, 0);
	GetComponent.<MeshFilter>().mesh = mesh;
}

function SetMidpoint(midpoint : Vector3) {
	if (wave > 0.0) return;
	GetComponent.<MeshFilter>().mesh.vertices = [pin1.position, midpoint, pin2.position];
}

function ResetMidpoint() {
	if (wave > 0.0) return;
	GetComponent.<MeshFilter>().mesh.vertices = [pin1.position, pin1.position, pin2.position];
}

function StartWave() {
	var indices = new int[sections];
	for (var i = 0; i < sections; i++) indices[i] = i;

	var mesh = Mesh();
	mesh.MarkDynamic();
	mesh.vertices = MakeWaveVertices();
	mesh.SetIndices(indices, MeshTopology.LineStrip, 0);
	GetComponent.<MeshFilter>().mesh = mesh;

	wave = Mathf.Epsilon;
}

function Update() {
	if (wave > 0.0) {
		wave += Time.deltaTime;
		if (wave < decay) {
			GetComponent.<MeshFilter>().mesh.vertices = MakeWaveVertices();
		} else {
			ResetString();
			wave = 0.0;
		}
	}
}

private function MakeWaveVertices() {
	var height = waveHeight * (1.0 - wave / decay);
	height *= Mathf.Cos(wave * frequency * Mathf.PI * 2.0);

	var vv = (pin2.position - pin1.position).normalized;
	vv = Vector3(-vv.y, vv.x);

	var vertices = new Vector3[sections];
	for (var i = 0; i < sections; i++) {
		var x = 1.0 / (sections - 1) * i;
		vertices[i] = Vector3.Lerp(pin1.position, pin2.position, x);
		vertices[i] += vv * (Mathf.Sin(Mathf.PI * x) * height);
	}
	return vertices;
}
