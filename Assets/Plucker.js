#pragma strict

private var stringBuilder : StringBuilder;
private var normal = Vector3.zero;
private var border = 0.0;

function Start() {
	stringBuilder = GetComponentInChildren.<StringBuilder>();

	var point1 = transform.Find("Point 1").position;
	var point2 = transform.Find("Point 2").position;

	var vline = (point2 - point1).normalized;
	normal = Vector3(-vline.y, vline.x, 0);
	border = Vector3.Dot(normal, point1);

	while (true) {
		while (!Input.GetMouseButton(0)) yield;

		var p0 = GetHeightOfTouchPosition();
		var p0_is_plus = (p0 > 0.0);

		yield;

		while (Input.GetMouseButton(0)) {
			var p1 = GetHeightOfTouchPosition();
			if (p0_is_plus ^ (p1 > 0.0)) break;
			yield;
		}

		yield;

		while (true) {
			var p2 = GetHeightOfTouchPosition();
			if (!Input.GetMouseButton(0) || (p0_is_plus ^ (p2 < 0.0))) {
				stringBuilder.ResetMidpoint();
				break;
			}
			if (Mathf.Abs(p2) > 1.5) {
				stringBuilder.StartWave();
				audio.Play();
				while(Input.GetMouseButton(0)) yield;
				break;
			}
			stringBuilder.SetMidpoint(GetTouchPosition());
			yield;
		}
	}
}

private function GetTouchPosition() {
	var pos = Input.mousePosition - Vector3.forward * camera.main.transform.position.z;
	return camera.main.ScreenToWorldPoint(pos);
}

private function GetHeightOfTouchPosition() {
	return Vector3.Dot(GetTouchPosition(), normal) - border;
}
