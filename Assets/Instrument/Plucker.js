#pragma strict

private var drawer : StringDrawer;
private var normal = Vector3.zero;
private var border = 0.0;

function Start() {
	drawer = GetComponentInChildren.<StringDrawer>();
	drawer.FixPoints();

	var pin1 = transform.Find("Pin 1").position;
	var pin2 = transform.Find("Pin 2").position;

	var vline = (pin2 - pin1).normalized;
	normal = Vector3(-vline.y, vline.x, 0);
	border = Vector3.Dot(normal, pin1);

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
				drawer.ResetMidpoint();
				break;
			}
			if (Mathf.Abs(p2) > 1.5) {
				drawer.StartWave();
				audio.Play();
				while(Input.GetMouseButton(0)) yield;
				break;
			}
			drawer.SetMidpoint(GetTouchPosition());
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
