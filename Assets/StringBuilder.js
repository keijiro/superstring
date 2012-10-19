#pragma strict

var sections = 10;

private var point1 : GameObject;
private var point2 : GameObject;
private var wave = 0.0;

function Start () {
	point1 = transform.parent.Find("Point 1").gameObject;
	point2 = transform.parent.Find("Point 2").gameObject;

	ResetString();
}

function ResetString() {
	var mesh = Mesh();
	mesh.MarkDynamic();

	mesh.vertices = [
		point1.transform.localPosition,
		point1.transform.localPosition,
		point2.transform.localPosition
	];
	mesh.SetIndices([0, 1, 2], MeshTopology.LineStrip, 0);

	GetComponent.<MeshFilter>().mesh = mesh;
}

function SetMidpoint(midpoint : Vector3) {
	if (wave > 0.0) return;
	GetComponent.<MeshFilter>().mesh.vertices = [
		point1.transform.localPosition,
		midpoint,
		point2.transform.localPosition
	];
}

function ResetMidpoint() {
	if (wave > 0.0) return;
	GetComponent.<MeshFilter>().mesh.vertices = [
		point1.transform.localPosition,
		point1.transform.localPosition,
		point2.transform.localPosition
	];
}

function StartWave() {
	var vertices = new Vector3[sections];
	for (var i = 0; i < sections; i++) {
		vertices[i] = Vector3.Lerp(point1.transform.localPosition, point2.transform.localPosition, 1.0 / sections * i);
	}

	var indices = new int[sections];
	for (i = 0; i < sections; i++) indices[i] = i;

	var mesh = Mesh();
	mesh.MarkDynamic();
	mesh.vertices = vertices;
	mesh.SetIndices(indices, MeshTopology.LineStrip, 0);

	GetComponent.<MeshFilter>().mesh = mesh;

	wave = 1.0;
}

function Update() {
	if (wave > 0.0) {
		wave -= 0.5 * Time.deltaTime;
		if (wave > 0.0) {
			UpdateWave();
		} else {
			ResetString();
			wave = 0.0;
		}
	}
}

function UpdateWave() {
	var vertices = new Vector3[sections];
	for (var i = 0; i < sections; i++) {
		var x = 1.0 / (sections - 1) * i;
		vertices[i] = Vector3.Lerp(point1.transform.localPosition, point2.transform.localPosition, x);
		vertices[i].y = Mathf.Sin(Mathf.PI * x) * wave * Mathf.Cos(wave * 80.0);
	}
	GetComponent.<MeshFilter>().mesh.vertices = vertices;
}
