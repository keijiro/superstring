#pragma strict

var sections = 10;
var waveHeight = 1.0;
var frequency = 80.0;
var decay = 2.0;

private var point1 : Transform;
private var point2 : Transform;
private var wave = 0.0;

function Start () {
	point1 = transform.parent.Find("Point 1");
	point2 = transform.parent.Find("Point 2");
	ResetString();
}

function ResetString() {
	var mesh = Mesh();
	mesh.MarkDynamic();
	mesh.vertices = [point1.position, point1.position, point2.position];
	mesh.SetIndices([0, 1, 2], MeshTopology.LineStrip, 0);
	GetComponent.<MeshFilter>().mesh = mesh;
}

function SetMidpoint(midpoint : Vector3) {
	if (wave > 0.0) return;
	GetComponent.<MeshFilter>().mesh.vertices = [point1.position, midpoint, point2.position];
}

function ResetMidpoint() {
	if (wave > 0.0) return;
	GetComponent.<MeshFilter>().mesh.vertices = [point1.position, point1.position, point2.position];
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

	var vv = (point2.position - point1.position).normalized;
	vv = Vector3(-vv.y, vv.x);

	var vertices = new Vector3[sections];
	for (var i = 0; i < sections; i++) {
		var x = 1.0 / (sections - 1) * i;
		vertices[i] = Vector3.Lerp(point1.position, point2.position, x);
		vertices[i] += vv * (Mathf.Sin(Mathf.PI * x) * height);
	}
	return vertices;
}
